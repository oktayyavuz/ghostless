#!/usr/bin/env node
// ghostless gate check: verifies that the process actually ran before directions are shown.
//   node <skill-dir>/scripts/check.mjs            check everything up to showing directions
//   node <skill-dir>/scripts/check.mjs brief      only the steps before building directions
//   --root .                                     project folder (default: current folder)
// Exit code 1 if a required step is missing. Run it before presenting directions; never present
// with a ✗ unless the person explicitly waived that step: add a line to DESIGN-LOG.md such as
//   ghostless-waive: gallery  (Oktay: "galeriye gerek yok, şu stilleri biliyorum")
// Waivable steps: gallery, references, images.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const stage = args.find((a) => !a.startsWith("--")) || "directions";
const ri = args.indexOf("--root");
const root = resolve(ri >= 0 ? args[ri + 1] : ".");
const T = join(root, "tasarim");
const read = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };
const walk = (d, out = []) => {
  if (!existsSync(d)) return out;
  for (const e of readdirSync(d, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const p = join(d, e.name);
    e.isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
};
const results = [];
// Only an explicit waiver line counts, e.g. "ghostless-waive: gallery (Oktay: 'galeriye gerek yok')".
const log = read(join(root, "DESIGN-LOG.md"));
const waived = (step) => new RegExp(`ghostless-waive:\\s*${step}\\b`, "i").test(log);
const check = (ok, label, fix, waivable = false) => results.push({ ok, label, fix, waivable });

// 1. subject dossier
const konu = ["tasarim/KONU.md", "tasarim/SUBJECT.md", "KONU.md"].map((f) => join(root, f)).find(existsSync);
const konuText = konu ? read(konu) : "";
check(!!konu, "Konu dosyası (tasarim/KONU.md)", "Phase 1: target feeling, who/one action, real content, subject material.");
check(/hayalet|ghost/i.test(konuText) && (konuText.match(/^\|/gm) || []).length >= 6, "Hayalet tablosu (KONU.md içinde)", "Phase 2: write the autopilot design as a table and beat every row.");

// 2. reference board from real sites, with URLs
const urls = [...new Set((konuText.match(/https?:\/\/[^\s)|>]+/g) || []).map((u) => u.replace(/[.,;]+$/, "")))];
check(urls.length >= 6 || waived("references"), `Referans panosu: gerçek sitelerden ≥6 bağlantı (şu an ${urls.length})`,
  "Phase 2: search the web (Awwwards, Godly, Siteinspire, studio portfolios) this session; put each URL and the one technique to learn in KONU.md.");

// 3. taste check in the gallery
const secimFile = join(T, "secimler.json");
let secim = null; try { secim = JSON.parse(read(secimFile)); } catch {}
const marked = secim?.items ? Object.keys(secim.items).length : 0;
check(marked >= 3 || waived("gallery"), `Galeri tadım seçimi (tasarim/secimler.json, ${marked} işaret)`,
  'Phase 2: run `node <skill-dir>/scripts/gallery.mjs --project "<name>" --wait` in the background, open it for the person, wait for "Seçimi gönder".', true);

// 4. images collected or made
const imgRe = /\.(webp|jpe?g|png|avif|gif|svg|mp4|webm|glb)$/i;
const tasarimImages = walk(T).filter((f) => imgRe.test(f) && !/\/shots?\//.test(f));
const credits = walk(T).filter((f) => /credits\.json$/.test(f)).length;
check(tasarimImages.length >= 6 || waived("images"), `Görseller toplandı ya da üretildi (tasarim/ altında ${tasarimImages.length} dosya, ${credits} kaynakça)`,
  "Phase 3 / imagery.md: client photos first, then made visuals, then `scripts/fetch-images.mjs` with dossier nouns. Look at every candidate.");

if (stage !== "brief") {
  // 5. three directions, each with imagery and motion
  const dirRoots = existsSync(T) ? readdirSync(T).map((d) => join(T, d)).filter((d) => statSync(d).isDirectory()) : [];
  let best = [];
  for (const d of dirRoots) {
    const subs = readdirSync(d).map((s) => join(d, s)).filter((s) => statSync(s).isDirectory() && existsSync(join(s, "index.html")));
    if (subs.length >= best.length) best = subs;
  }
  const latest = best.sort();
  check(latest.length >= 3, `Üç yön önizlemesi (tasarim/<klasör>/<yön>/index.html: ${latest.length})`,
    "Phase 3: build each direction's first screen as a hi-fi preview, one folder per direction.");
  for (const s of latest) {
    const html = read(join(s, "index.html")) + walk(s).filter((f) => /\.(css|js)$/.test(f)).map(read).join("\n");
    const name = s.split("/").pop();
    const hasImage = /<img\b|<video\b|<canvas\b|background(-image)?:\s*url\(|<svg[\s\S]{400,}?<\/svg>|three|ogl/i.test(html);
    const hasMotion = /@keyframes|animation\s*:|transition\s*:|requestAnimationFrame|gsap|animate\(|ScrollTrigger|scroll-timeline|animation-timeline/i.test(html);
    check(hasImage, `  ${name}: güçlü görsel var`, "Hero visual plan: real or made imagery, not a headline and a button.");
    check(hasMotion, `  ${name}: hareket dili var`, "motion.md: a motif, one signature move, varied entrances.");
  }
}
check(existsSync(join(root, "DESIGN-LOG.md")), "DESIGN-LOG.md", "Phase 8: decisions and rejections in the person's own words.");

// ---------------------------------------------------------------------------
let missing = 0;
console.log(`\nghostless check (${stage})  ${root}\n`);
for (const r of results) {
  if (!r.ok) missing++;
  console.log(`${r.ok ? "✓" : "✗"} ${r.label}${r.ok ? "" : `\n    → ${r.fix}`}`);
}
console.log(missing ? `\n${missing} adım eksik. Yönleri göstermeden önce tamamla (kişi açıkça vazgeçtiyse DESIGN-LOG.md'ye "ghostless-waive: <adım>" satırı ve kendi sözünü yaz).` : "\nHepsi tamam.");
process.exit(missing ? 1 : 0);
