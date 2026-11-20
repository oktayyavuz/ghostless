#!/usr/bin/env node
// ghostless fetch-images: find openly licensed images, download them locally, keep the credits.
// Zero dependencies, Node 18+.
//
//   node fetch-images.mjs "espresso crema macro" [options]
//
//   --sources openverse,commons,nasa,pexels   (default: openverse,commons; pexels needs PEXELS_API_KEY)
//   --n 12                 candidates per query (spread across sources)
//   --out ./tasarim/gorsel-adaylari   download folder (a subfolder per query is created)
//   --min-width 1200       skip smaller images when the source reports a size
//   --orientation landscape|portrait|square
//   --allow-sa             also accept CC BY-SA (share-alike); off by default
//   --json                 print the result as JSON
//
// Writes into <out>/<query-slug>/: the images, credits.json, CREDITS.md and contact-sheet.html.
// Never hotlinks: everything is downloaded so it can be cropped, treated and self-hosted.

import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : def;
};
const flag = (name) => args.includes(`--${name}`);
const VALUE_OPTS = new Set(["--sources", "--n", "--out", "--min-width", "--orientation"]);
const query = args.find((a, i) => !a.startsWith("--") && !VALUE_OPTS.has(args[i - 1]));
if (!query) {
  console.error('usage: node fetch-images.mjs "<specific query>" [--sources openverse,commons,nasa,pexels] [--n 12] [--out dir] [--min-width 1200] [--orientation landscape] [--allow-sa] [--json]');
  process.exit(2);
}
const sources = opt("sources", "openverse,commons").split(",").map((s) => s.trim()).filter(Boolean);
const N = Number(opt("n", "12"));
const minWidth = Number(opt("min-width", "1200"));
const orientation = opt("orientation", "");
const allowSA = flag("allow-sa");
const slug = query.toLocaleLowerCase("tr-TR").normalize("NFKD").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "query";
const outDir = resolve(opt("out", "./tasarim/gorsel-adaylari"), slug);
const UA = "ghostless-image-fetch/1.0 (+https://github.com/oktayyavuz/ghostless)";

const getJSON = async (url, headers = {}) => {
  const r = await fetch(url, { headers: { "User-Agent": UA, ...headers } });
  if (!r.ok) throw new Error(`${r.status} ${url.slice(0, 80)}`);
  return r.json();
};
const strip = (s = "") => String(s).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const orientOk = (w, h) => {
  if (!orientation || !w || !h) return true;
  const r = w / h;
  return orientation === "landscape" ? r > 1.15 : orientation === "portrait" ? r < 0.87 : r >= 0.87 && r <= 1.15;
};

// License policy: commercial use + modification allowed. No NC, no ND. SA only with --allow-sa.
const licenseOk = (lic) => {
  const l = (lic || "").toLowerCase();
  if (!l) return false;
  if (/\bnc\b|non-?commercial|\bnd\b|no-?deriv/.test(l)) return false;
  if (/\bsa\b|share-?alike/.test(l) && !allowSA) return false;
  return /cc0|pdm|public domain|^by\b|cc[ -]by|pexels|nasa|^by-sa/.test(l);
};

// ---------------------------------------------------------------------------
const providers = {
  async openverse(n) {
    const lt = "commercial,modification";
    const asp = orientation === "landscape" ? "&aspect_ratio=wide" : orientation === "portrait" ? "&aspect_ratio=tall" : orientation === "square" ? "&aspect_ratio=square" : "";
    const j = await getJSON(`https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&license_type=${lt}${asp}&page_size=${Math.min(n * 3, 40)}&mature=false`);
    return j.results.map((r) => ({
      source: "openverse/" + r.source, title: r.title, creator: r.creator || "unknown",
      license: `${r.license === "cc0" || r.license === "pdm" ? r.license.toUpperCase() : "CC " + r.license.toUpperCase()} ${r.license_version || ""}`.trim(),
      licenseUrl: r.license_url, page: r.foreign_landing_url, url: r.url, width: r.width, height: r.height,
    }));
  },
  async commons(n) {
    const j = await getJSON(`https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query + " filetype:bitmap")}&gsrlimit=${Math.min(n * 3, 40)}&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=2400`);
    return Object.values(j.query?.pages || {}).sort((a, b) => a.index - b.index).map((p) => {
      const ii = p.imageinfo?.[0] || {}, m = ii.extmetadata || {};
      return {
        source: "wikimedia-commons", title: p.title.replace(/^File:|\.\w+$/g, ""), creator: strip(m.Artist?.value) || "unknown",
        license: strip(m.LicenseShortName?.value), licenseUrl: m.LicenseUrl?.value || "", page: ii.descriptionurl,
        url: ii.thumburl || ii.url, width: ii.width, height: ii.height,
      };
    });
  },
  async nasa(n) {
    const j = await getJSON(`https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image&page_size=${Math.min(n * 2, 40)}`);
    return (j.collection?.items || []).map((it) => {
      const d = it.data?.[0] || {};
      return {
        source: "nasa", title: d.title, creator: d.photographer || d.secondary_creator || `NASA ${d.center || ""}`.trim(),
        license: "NASA media (generally not copyrighted; check the page for third-party credits)", licenseUrl: "https://www.nasa.gov/nasa-brand-center/images-and-media/",
        page: `https://images.nasa.gov/details/${d.nasa_id}`, url: `https://images-assets.nasa.gov/image/${d.nasa_id}/${d.nasa_id}~large.jpg`,
      };
    });
  },
  async pexels(n) {
    const key = process.env.PEXELS_API_KEY;
    if (!key) throw new Error("PEXELS_API_KEY not set (free key at pexels.com/api)");
    const o = orientation ? `&orientation=${orientation}` : "";
    const j = await getJSON(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${Math.min(n * 2, 40)}${o}`, { Authorization: key });
    return j.photos.map((p) => ({
      source: "pexels", title: p.alt || `Pexels ${p.id}`, creator: p.photographer, license: "Pexels License",
      licenseUrl: "https://www.pexels.com/license/", page: p.url, url: p.src.large2x || p.src.original, width: p.width, height: p.height,
    }));
  },
};

// ---------------------------------------------------------------------------
const perSource = Math.ceil(N / sources.length);
const candidates = [];
const errors = [];
for (const s of sources) {
  if (!providers[s]) { errors.push(`${s}: unknown source`); continue; }
  try {
    const list = (await providers[s](perSource))
      .filter((c) => c.url && licenseOk(c.license))
      .filter((c) => !c.width || c.width >= minWidth || s === "nasa")
      .filter((c) => orientOk(c.width, c.height));
    candidates.push(...list.slice(0, perSource));
  } catch (e) { errors.push(`${s}: ${e.message}`); }
}

mkdirSync(outDir, { recursive: true });
const credFile = join(outDir, "credits.json");
const prev = existsSync(credFile) ? JSON.parse(readFileSync(credFile, "utf8")) : [];
const saved = [...prev];
let k = prev.length;
for (const c of candidates.slice(0, N)) {
  if (saved.some((p) => p.url === c.url)) continue;
  try {
    let r;
    for (let attempt = 0; attempt < 3; attempt++) {
      try { r = await fetch(c.url, { headers: { "User-Agent": UA } }); if (r.status !== 429) break; } catch (e) { if (attempt === 2) throw e; }
      await new Promise((ok) => setTimeout(ok, 1500 * (attempt + 1)));
    }
    const type = r.headers.get("content-type") || "";
    if (!r.ok || !type.startsWith("image/")) throw new Error(`${r.status} ${type}`);
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length < 30_000) throw new Error("too small");
    const ext = type.includes("png") ? "png" : type.includes("webp") ? "webp" : "jpg";
    const file = `${slug}-${String(++k).padStart(2, "0")}.${ext}`;
    writeFileSync(join(outDir, file), buf);
    saved.push({ file, ...c, title: strip(c.title), bytes: buf.length, fetched: new Date().toISOString().slice(0, 10), query });
  } catch (e) { errors.push(`download ${c.url.slice(0, 70)}: ${e.message}`); }
}

writeFileSync(credFile, JSON.stringify(saved, null, 2));
const credit = (s) => `"${s.title}" by ${s.creator}, ${s.license}${s.licenseUrl ? ` (${s.licenseUrl})` : ""}, via ${s.source}: ${s.page}`;
writeFileSync(join(outDir, "CREDITS.md"), `# Image credits: ${query}\n\nKeep only the ones you use. Attribution is required for every CC BY / BY-SA image (put it on a credits page or in a caption).\n\n${saved.map((s) => `- \`${s.file}\` ${credit(s)}`).join("\n")}\n`);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
writeFileSync(join(outDir, "contact-sheet.html"), `<!doctype html><meta charset="utf-8"><title>${esc(query)}</title>
<style>body{margin:0;padding:16px;font:13px/1.4 system-ui;background:#111;color:#ddd}h1{font-size:16px}
main{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}figure{margin:0}
img{width:100%;aspect-ratio:3/2;object-fit:cover;display:block;background:#222}figcaption{padding:6px 0;color:#aaa}b{color:#fff}a{color:#9cf}</style>
<h1>${esc(query)} · ${saved.length} candidates</h1><main>${saved.map((s) => `<figure><img src="${esc(s.file)}" loading="lazy"><figcaption><b>${esc(s.file)}</b><br>${esc(s.title)}<br>${esc(s.creator)} · ${esc(s.license)}<br><a href="${esc(s.page)}">source</a></figcaption></figure>`).join("")}</main>`);

if (flag("json")) console.log(JSON.stringify({ query, outDir, saved, errors }, null, 2));
else {
  console.log(`\nghostless fetch-images  "${query}"\n→ ${outDir}`);
  console.log(`${saved.length} image(s) saved (${saved.length - prev.length} new) · credits.json · CREDITS.md · contact-sheet.html`);
  for (const s of saved.slice(prev.length)) console.log(`  ${s.file}  ${s.width || "?"}×${s.height || "?"}  ${s.license}  ${s.source}`);
  if (errors.length) console.log(`\nskipped:\n  ${errors.slice(0, 8).join("\n  ")}${errors.length > 8 ? `\n  … ${errors.length - 8} more` : ""}`);
  console.log("\nLook at every candidate before using it (contact sheet or open the files). Most results won't be good enough; keep the few that are.");
}
