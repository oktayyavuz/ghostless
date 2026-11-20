#!/usr/bin/env node
// ghostless gallery: a local "site builder"-style picker for styles, motion moves and image
// treatments, plus (optionally) the three direction previews. Zero dependencies, Node 18+.
//
//   node <skill-dir>/scripts/gallery.mjs                     open the catalog picker
//   node <skill-dir>/scripts/gallery.mjs --directions tasarim/yonler   also show direction previews
//                                                             (each subfolder with an index.html is one direction)
//   --out tasarim/secimler.json   where choices are written (default: ./tasarim/secimler.json)
//   --port 5600                   first port to try (skips busy ones and 3000, 4586, 5487, 80)
//   --wait                        exit after the first submit and print the choice (run it in the background)
//   --project "Çekici"            name shown in the header (default: current folder name)
//
// The person marks "Beğendim" / "Asla" on cards, writes notes, picks a direction and says why the
// others didn't work, then presses "Gönder". The choice is saved to --out and printed.
import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync, statSync, readdirSync, mkdirSync } from "node:fs";
import { join, resolve, extname, dirname, basename, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : d; };
const galleryDir = resolve(dirname(fileURLToPath(import.meta.url)), "..", "gallery");
const outFile = resolve(opt("out", "tasarim/secimler.json"));
const dirsRoot = opt("directions") ? resolve(opt("directions")) : null;
const project = opt("project", basename(process.cwd()));
const wait = args.includes("--wait");
const RESERVED = new Set([80, 3000, 4586, 5487]);

const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".webp": "image/webp", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".gif": "image/gif", ".avif": "image/avif",
  ".woff2": "font/woff2", ".woff": "font/woff", ".mp4": "video/mp4", ".webm": "video/webm", ".glb": "model/gltf-binary", ".txt": "text/plain; charset=utf-8" };

function directions() {
  if (!dirsRoot || !existsSync(dirsRoot)) return [];
  return readdirSync(dirsRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(dirsRoot, d.name, "index.html")))
    .map((d) => {
      let title = d.name;
      try { const m = readFileSync(join(dirsRoot, d.name, "index.html"), "utf8").match(/<title>([^<]*)<\/title>/i); if (m) title = m[1].trim(); } catch {}
      return { id: d.name, title, url: `/yonler/${encodeURIComponent(d.name)}/` };
    });
}

function sendFile(res, root, rel) {
  const p = normalize(join(root, rel));
  if (!p.startsWith(root + sep) && p !== root) { res.writeHead(403).end(); return; }
  let f = p;
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404, { "content-type": "text/plain" }).end("not found"); return; }
  res.writeHead(200, { "content-type": TYPES[extname(f).toLowerCase()] || "application/octet-stream", "cache-control": "no-cache" });
  res.end(readFileSync(f));
}

const server = createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  const path = decodeURIComponent(url.pathname);
  if (path === "/api/info") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ project, directions: directions(), saved: existsSync(outFile) ? JSON.parse(readFileSync(outFile, "utf8")) : null }));
    return;
  }
  if (path === "/api/secim" && req.method === "POST") {
    let body = "";
    req.on("data", (c) => { body += c; if (body.length > 2e6) req.destroy(); });
    req.on("end", () => {
      try {
        const choice = JSON.parse(body);
        const record = { project, savedAt: new Date().toISOString(), ...choice };
        mkdirSync(dirname(outFile), { recursive: true });
        const prev = existsSync(outFile) ? JSON.parse(readFileSync(outFile, "utf8")) : null;
        if (prev) record.previous = prev.previous ? [...prev.previous, { ...prev, previous: undefined }] : [{ ...prev }];
        writeFileSync(outFile, JSON.stringify(record, null, 2));
        res.writeHead(200, { "content-type": "application/json" }).end('{"ok":true}');
        console.log(`\n[ghostless] seçim kaydedildi → ${outFile}`);
        console.log(JSON.stringify(summary(record), null, 2));
        if (wait) setTimeout(() => process.exit(0), 300);
      } catch (e) { res.writeHead(400).end(String(e.message)); }
    });
    return;
  }
  if (path.startsWith("/yonler/") && dirsRoot) return sendFile(res, dirsRoot, path.slice("/yonler/".length));
  return sendFile(res, galleryDir, path === "/" ? "index.html" : path.slice(1));
});

function summary(r) {
  const s = {};
  for (const [k, v] of Object.entries(r.items || {})) (s[v] ||= []).push(k);
  return { begenilen: s.like || [], asla: s.never || [], notlar: r.notes || "", yon: r.direction || null, yonGerekceleri: r.reasons || {} };
}

function listen(port) {
  if (RESERVED.has(port)) return listen(port + 1);
  server.once("error", (e) => { if (e.code === "EADDRINUSE" && port < 65000) listen(port + 1); else throw e; });
  server.listen(port, "127.0.0.1", () => {
    console.log(`[ghostless] galeri açık: http://localhost:${port}/`);
    if (dirsRoot) console.log(`[ghostless] yönler: ${directions().map((d) => d.id).join(", ") || "(klasörde index.html'li alt klasör yok)"}`);
    console.log(`[ghostless] seçimler şuraya yazılacak: ${outFile}${wait ? " (ilk gönderimde kapanır)" : ""}`);
  });
}
listen(Number(opt("port", "5600")));
