#!/usr/bin/env node
// Renders gallery demos to images with a headless Chromium (no npm deps).
//   node gallery/shots.mjs                 all items in catalog.json
//   node gallery/shots.mjs swiss pixel-mosaic   only these ids
//   --frames 0.12,0.4,0.7,1                 frames for motion demos (film strip)
// Output: gallery/shots/<id>.webp (still, 960×600) and, for motion items, <id>-strip.webp.
// Needs: a Chromium-based browser (CHROME_PATH, Playwright's cache, chromium, google-chrome, brave)
//        and ImageMagick (`magick`) for resizing / strips.
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { homedir, tmpdir } from "node:os";

const here = dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(readFileSync(join(here, "catalog.json"), "utf8"));
const args = process.argv.slice(2);
const fi = args.indexOf("--frames");
const frames = fi >= 0 ? args[fi + 1].split(",").map(Number) : [0.12, 0.4, 0.7, 1];
const only = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--frames");

function findChrome() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const pw = join(homedir(), ".cache/ms-playwright");
  if (existsSync(pw)) {
    for (const d of readdirSync(pw).sort().reverse()) {
      for (const rel of ["chrome-linux/headless_shell", "chrome-headless-shell-linux64/chrome-headless-shell", "chrome-linux/chrome", "chrome-linux64/chrome"]) {
        const p = join(pw, d, rel);
        if (existsSync(p)) return p;
      }
    }
  }
  for (const c of ["chromium", "chromium-browser", "google-chrome", "google-chrome-stable", "brave", "brave-browser", "microsoft-edge"]) {
    try { return execFileSync("which", [c]).toString().trim(); } catch {}
  }
  const mac = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  if (existsSync(mac)) return mac;
  throw new Error("No Chromium-based browser found. Set CHROME_PATH.");
}
const chrome = findChrome();
const shotsDir = join(here, "shots");
const tmp = join(tmpdir(), "ghostless-shots-" + process.pid);
mkdirSync(shotsDir, { recursive: true });
mkdirSync(tmp, { recursive: true });

function shoot(url, out) {
  return new Promise((ok) => {
    const p = spawn(chrome, ["--headless=new", "--disable-gpu-sandbox", "--hide-scrollbars", "--force-device-scale-factor=1",
      "--window-size=1280,800", "--virtual-time-budget=5000", "--run-all-compositor-stages-before-draw",
      `--screenshot=${out}`, url], { stdio: "ignore" });
    const kill = setTimeout(() => p.kill("SIGKILL"), 30000);
    p.on("exit", () => { clearTimeout(kill); ok(existsSync(out)); });
  });
}

const items = catalog.items.filter((it) => !only.length || only.includes(it.id));
const jobs = [];
for (const it of items) {
  const file = join(here, "demos", it.group, `${it.id}.html`);
  if (!existsSync(file)) { console.log(`missing  ${it.group}/${it.id}.html`); continue; }
  jobs.push({ it, file });
}

let i = 0;
const results = [];
async function worker() {
  while (i < jobs.length) {
    const { it, file } = jobs[i++];
    const base = pathToFileURL(file).href;
    const isStyle = it.group === "styles";
    const still = join(tmp, `${it.id}.png`);
    const ok = await shoot(`${base}?t=1`, still);
    if (!ok) { results.push(`FAILED   ${it.id}`); continue; }
    execFileSync("magick", [still, "-resize", "960x600", "-quality", "78", join(shotsDir, `${it.id}.webp`)]);
    if (!isStyle) {
      const fs = [];
      for (const t of frames) {
        const f = join(tmp, `${it.id}-${t}.png`);
        if (await shoot(`${base}?t=${t}`, f)) fs.push(f);
      }
      if (fs.length) execFileSync("magick", [...fs.map((f) => `${f}[640x400]`), "-bordercolor", "#111", "-border", "4", "+append", "-quality", "74", join(shotsDir, `${it.id}-strip.webp`)]);
    }
    results.push(`ok       ${it.id}`);
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
rmSync(tmp, { recursive: true, force: true });
console.log(results.sort().join("\n"));
console.log(`\n→ ${shotsDir}`);
