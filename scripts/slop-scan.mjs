#!/usr/bin/env node
// ghostless slop-scan: zero-dependency heuristic scanner for AI-default design tells.
// Usage: node slop-scan.mjs [dir=.] [--json] [--all] [--fail-under N]
// Silence a line with a `ghostless-ignore` comment on it or on the line above;
// silence a whole file with `ghostless-ignore-file` anywhere in it.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, extname, basename } from "node:path";

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n) => {
  const i = args.indexOf(n);
  return i >= 0 ? args[i + 1] : undefined;
};
const root = args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--fail-under") ?? ".";
const asJson = flag("--json");
const showAll = flag("--all");
const failUnder = opt("--fail-under") ? Number(opt("--fail-under")) : null;

const SKIP_DIRS = new Set([
  "node_modules", ".next", "dist", "build", "out", ".git", "coverage", ".turbo", ".vercel",
  ".svelte-kit", ".astro", ".cache", "vendor", "target", ".venv", "__pycache__", "test-results", "generated",
]);
const CODE_EXT = new Set([".html", ".htm", ".css", ".scss", ".sass", ".less", ".js", ".jsx", ".ts",
  ".tsx", ".mjs", ".cjs", ".vue", ".svelte", ".astro", ".mdx"]);
const COPY_JSON_DIR = /(^|\/)(messages|locales?|i18n|lang|translations?|content)\//i;
const MAX_BYTES = 400_000;

// ---------------------------------------------------------------------------
// Rules. kind "line": counted per matching line. weight = max penalty, sat = hits for full penalty.
const L = String.raw;
const rules = [
  // color
  { id: "ai-gradient-palette", cat: "color", weight: 10, sat: 3,
    re: /\b(?:from|via|to)-(?:indigo|violet|purple|fuchsia|pink)-[1-9]00\b|#(?:6366f1|8b5cf6|a855f7|7c3aed|4f46e5|ec4899|d946ef)\b/i,
    msg: "Indigo/violet/pink gradient palette, the classic AI default" },
  { id: "gradient-text", cat: "color", weight: 10, sat: 1,
    re: /bg-clip-text|background-clip:\s*text/i, msg: "Gradient-filled text" },
  { id: "glow", cat: "color", weight: 6, sat: 2,
    re: /shadow-(?:indigo|violet|purple|fuchsia|pink|blue|cyan|sky|emerald)-\d{2,3}(?:\/\d+)?|shadow-\[0_0_\d{2,}px|box-shadow:\s*0\s+0\s+\d{2,}px|drop-shadow-\[0_0/i,
    msg: "Colored glow shadow" },
  { id: "trend-palette", cat: "color", weight: 5, sat: 1,
    re: /#(?:d97757|da7756|c96442|cc785c|d4714e|e07a5f|c6ff00|ccff00|d4ff00|b6ff00|a3e635|bef264)\b/i,
    msg: "Terracotta / acid-green accent, the current 'escape from purple' default" },
  // surfaces
  { id: "glass", cat: "surface", weight: 6, sat: 2,
    re: /\bbackdrop-blur|backdrop-filter:\s*blur/i, unless: /\bfixed\s+inset-0\b|\binset-0\b[^"'`]*bg-[a-z]+-\d{3}\/\d+/, msg: "Glass / backdrop blur (modal scrims excluded)" },
  { id: "blur-blob", cat: "surface", weight: 6, sat: 2,
    re: /\bblur-3xl\b|\bblur-\[\d{3}px\]|filter:\s*blur\(\s*\d{2,}px/i, msg: "Large blurred decorative blob / glow" },
  { id: "icon-tinted-tile", cat: "surface", weight: 5, sat: 3,
    re: /(?=[^"'`]*rounded-(?:lg|xl|2xl|full))(?=[^"'`]*bg-[a-z]+-(?:50|100|[4-6]00\/(?:5|10|15|20)))(?=[^"'`]*(?:\b[hw]|size)-(?:8|9|10|11|12|14)\b)[^"'`]{0,200}/,
    msg: "Icon sitting in a tinted rounded tile" },
  // typography
  { id: "default-font", cat: "type", weight: 8, sat: 1,
    re: /(?:font|Font)[^\n]*\b(?:Inter|Geist|Poppins|Plus[ _]Jakarta[ _]Sans|Manrope|DM[ _]Sans|Space[ _]Grotesk|Outfit|Montserrat)\b|\b(?:Inter|Poppins|Plus_Jakarta_Sans|Manrope|DM_Sans|Space_Grotesk|Outfit|Montserrat)\s*\(\s*\{/,
    msg: "Default AI typeface (Inter, Geist, Poppins, Space Grotesk…)" },
  { id: "eyebrow-caps", cat: "type", weight: 6, sat: 4,
    re: /(?=[^"'`\n]*\buppercase\b)(?=[^"'`\n]*\btracking-(?:wide|wider|widest|\[0?\.\d+em\]))/,
    msg: "Tracked-out ALL-CAPS eyebrow label" },
  { id: "mono-meta", cat: "type", weight: 2, sat: 5,
    re: /(?=[^"'`\n]*\bfont-mono\b)(?=[^"'`\n]*\b(?:text-xs|text-\[1[01]px\]|uppercase)\b)/,
    msg: "Monospace small meta label" },
  // motion
  { id: "scroll-fade", cat: "motion", weight: 8, sat: 8,
    re: /\bwhileInView\b|data-aos=|animate-fade-(?:in-)?up|\bfadeInUp\b/,
    msg: "Fade/slide-up on scroll (count shows how widespread)" },
  { id: "hover-lift", cat: "motion", weight: 4, sat: 5,
    re: /hover:-translate-y-(?:0\.5|1|2|\d)|hover:scale-1(?:0[2-9]|[1-9]\d)/, msg: "Hover lift / scale on cards" },
  { id: "ambient-fx", cat: "motion", weight: 4, sat: 2,
    re: /\bmarquee\b|\bshimmer\b|animate-(?:gradient|spin-slow|float|glow|shimmer|marquee)\b|\btypewriter\b|\bcount-up\b|\bCountUp\b/,
    msg: "Ambient effect (marquee, shimmer, float, typing, count-up)" },
  // imagery & icons
  { id: "sparkle", cat: "imagery", weight: 6, sat: 2,
    re: /✨|✦|<Sparkles\b|\bSparklesIcon\b/, msg: "Sparkle ✨/✦ motif" },
  { id: "emoji-icon", cat: "imagery", weight: 5, sat: 4,
    re: /[\u{1F300}-\u{1FAFF}\u{26A1}\u{2B50}]/u, msg: "Emoji used as an icon" },
  { id: "stock-image", cat: "imagery", weight: 5, sat: 3,
    re: /images\.unsplash\.com|source\.unsplash|images\.pexels\.com|picsum\.photos|placehold\.co|via\.placeholder|randomuser\.me|i\.pravatar\.cc/i,
    msg: "Stock / placeholder imagery" },
  // structure chrome
  { id: "arrow-cta", cat: "structure", weight: 3, sat: 5,
    re: /[A-Za-zÇĞİÖŞÜçğıöşü][^<>{}"'`\n]{1,40}\s(?:→|&rarr;)\s*(?:<|["'`]|$)/, msg: "→ appended to link/button text" },
  { id: "middot-meta", cat: "structure", weight: 3, sat: 6,
    re: /[\p{L}\d]\s·\s[\p{L}\d]/u, msg: "Meta string joined with middle dots" },
  { id: "numbered-markers", cat: "structure", weight: 3, sat: 3,
    re: /(?:>|["'`])\s*0[1-9]\s*(?:<|["'`])|\b0[1-6]\s*\/\s*0[1-6]\b/, msg: "01 / 02 / 03 markers (is it really a sequence?)" },
  // copy
  { id: "fake-proof", cat: "copy", weight: 8, sat: 3, copy: true,
    re: /\d[\d.,]*\s?(?:k)?\+\s*(?:happy|satisfied|customers|users|clients|teams|companies|mutlu|memnun|müşteri|kullanıcı|firma)|trusted by|loved by|\b\d{1,3}k\+|99[.,]9\s?%|4[.,]9\s?(?:★|\/\s?5|stars)|binlerce mutlu|yüzlerce mutlu|%\s?100 (?:müşteri )?memnuniyet/i,
    msg: "Proof that looks invented (counts, uptime, ratings, 'trusted by')" },
  { id: "generic-cta", cat: "copy", weight: 3, sat: 6, copy: true,
    re: /(?:^|\|)\s*(?:Get started|Learn more|Read more|Discover more|Hemen keşfet\w*|Daha fazla(?: bilgi)?|Şimdi keşfet)\s*(?:→|&rarr;)?\s*(?:\||$)/i,
    msg: "Generic CTA label" },
];

const EN_LEXICON = [
  "elevate", "unlock", "unleash", "empower", "supercharge", "seamless", "effortless", "cutting-edge",
  "state-of-the-art", "next-gen", "next-generation", "revolutioniz", "reimagin", "transform your",
  "game-changer", "game changer", "world-class", "best-in-class", "synergy", "holistic",
  "tailored solutions", "one-stop", "all-in-one", "next level", "the future of", "say goodbye to",
  "look no further", "fast-paced world", "ready to get started", "join thousands", "crafted with care",
  "not just a", "built for", "designed for", "harness the power", "streamline your",
];
const TR_LEXICON = [
  "yeni nesil", "dijital dönüşüm", "sınırları zorlayan", "hayalinizdeki", "profesyonel ekib",
  "uzman kadro", "kaliteli hizmet", "müşteri memnuniyeti odaklı", "sektörün önc", "sektörde önc",
  "lider firma", "en iyi çözüm", "yenilikçi çözüm", "uçtan uca çözüm", "size özel çözüm",
  "anahtar teslim", "fark yaratan", "farkı yaşa", "bir adım önde", "geleceği şekillendir",
  "yeniden tanımlıyor", "vizyoner", "çözüm ortağınız", "hemen keşfedin", "neden biz",
  "yılların tecrübe", "kalite ve güven", "uygun fiyat garanti", "dinamik ekip", "tutkuyla",
  "özenle hazırlan", "hizmetinizdeyiz", "bizimle tanışın", "hayallerinizi gerçeğe", "değer katıyoruz",
  "inovatif", "profesyonel çözüm",
];
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const enRe = new RegExp(L`(?<![\p{L}])(?:` + EN_LEXICON.map(escapeRe).join("|") + L`)`, "iu");
const trRe = new RegExp(L`(?<![\p{L}])(?:` + TR_LEXICON.map(escapeRe).join("|") + L`)`, "u");
rules.push(
  { id: "filler-en", cat: "copy", weight: 10, sat: 8, copy: true, re: enRe, msg: "Filler marketing lexicon (EN)" },
  { id: "filler-tr", cat: "copy", weight: 10, sat: 8, copy: true, re: trRe, trLower: true, msg: "Filler marketing lexicon (TR)" },
);

// ---------------------------------------------------------------------------
function walk(dir, out = []) {
  let entries;
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name) && !e.name.startsWith(".")) walk(p, out);
    } else if (e.isFile()) out.push(p);
  }
  return out;
}

function classify(file) {
  const rel = relative(root, file).split("\\").join("/");
  const ext = extname(file).toLowerCase();
  const name = basename(file).toLowerCase();
  if (/\.min\.|lock|\.d\.ts$|\.map$/.test(name)) return null;
  if (CODE_EXT.has(ext)) return { rel, code: true, copy: true };
  if (ext === ".json" && COPY_JSON_DIR.test(rel)) return { rel, code: false, copy: true };
  if (ext === ".md" && /(^|\/)(content|posts|blog|pages)\//i.test(rel)) return { rel, code: false, copy: true };
  return null;
}

// Visible-text candidates from a code line: string literals and JSX text.
function textParts(line) {
  const parts = [];
  const re = /"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|`([^`]*)`|>([^<>{}]+)</g;
  let m;
  while ((m = re.exec(line))) {
    const t = m[1] ?? m[2] ?? m[3] ?? m[4] ?? "";
    if (/\s/.test(t.trim()) || /^[A-ZÇĞİÖŞÜ]/.test(t.trim())) parts.push(t);
  }
  if (!parts.length && /^\s*[\p{L}][^=;(){}<>]*$/u.test(line) && /\s/.test(line.trim())) parts.push(line); // bare JSX text line
  return parts.join(" | ");
}

const isComment = (t) => /^\s*(?:\/\/|\/\*|\*|<!--|#)/.test(t);

const hits = Object.fromEntries(rules.map((r) => [r.id, []]));
let radiusBig = 0, radiusAll = 0, filesScanned = 0, visualHits = 0;
const ctaLabels = new Map();

for (const file of walk(root)) {
  const kind = classify(file);
  if (!kind) continue;
  let text;
  try {
    if (statSync(file).size > MAX_BYTES) continue;
    text = readFileSync(file, "utf8");
  } catch { continue; }
  if (text.includes("ghostless-ignore-file")) continue;
  filesScanned++;
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    if (line.includes("ghostless-ignore") || (i > 0 && lines[i - 1].includes("ghostless-ignore"))) return;
    if (line.length > 2000) return; // minified
    if (kind.code) {
      if (/<(?:img|Image|video|canvas|picture|Canvas)\b|three|@react-three|background-image:\s*url|lottie|spline/i.test(line)) visualHits++;
      radiusAll += (line.match(/\brounded(?:-[a-z0-9[\].]+)?\b/g) || []).length;
      radiusBig += (line.match(/\brounded-(?:xl|2xl|3xl)\b/g) || []).length;
    }
    const comment = isComment(line);
    const isImport = /^\s*import\s/.test(line);
    for (const r of rules) {
      if (r.copy) {
        if (!kind.copy || comment || isImport) continue;
      } else if (!kind.code) continue;
      let subject = line;
      if (r.copy && kind.code) {
        subject = textParts(line);
        if (!subject) continue;
      }
      if (r.trLower) subject = subject.toLocaleLowerCase("tr-TR");
      if (r.unless && r.unless.test(line)) continue;
      if (r.re.test(subject)) hits[r.id].push({ file: kind.rel, line: i + 1, text: line.trim().slice(0, 110) });
    }
  });
}

// Aggregate rule: one radius everywhere.
const aggregate = [];
if (radiusBig >= 12 && radiusBig / Math.max(radiusAll, 1) > 0.6) {
  aggregate.push({ id: "uniform-radius", cat: "surface", weight: 8,
    msg: `One big radius everywhere: ${radiusBig} of ${radiusAll} rounded classes are xl/2xl/3xl (no hierarchy)` });
}

if (filesScanned >= 3 && visualHits === 0) {
  aggregate.push({ id: "sterile-no-visuals", cat: "sterile", weight: 8,
    msg: "No images, video, canvas or 3D anywhere. Avoiding the ghost by removing everything is the sterile escape" });
}

// ---------------------------------------------------------------------------
let penalty = 0;
const findings = [];
for (const r of rules) {
  const h = hits[r.id];
  if (!h.length) continue;
  // Small projects saturate sooner: 3 tells in a 5-file landing page are the whole page.
  const sat = Math.max(1, Math.round(r.sat * Math.min(1, filesScanned / 40)));
  const p = r.weight * Math.min(1, h.length / sat);
  penalty += p;
  findings.push({ id: r.id, category: r.cat, message: r.msg, count: h.length, penalty: +p.toFixed(1), hits: h });
}
for (const a of aggregate) {
  penalty += a.weight;
  findings.push({ id: a.id, category: a.cat, message: a.msg, count: 1, penalty: a.weight, hits: [] });
}
findings.sort((a, b) => b.penalty - a.penalty);
const score = Math.max(0, Math.round(100 - penalty));

if (asJson) {
  console.log(JSON.stringify({ root, filesScanned, score, findings }, null, 2));
} else {
  const bar = (s) => "█".repeat(Math.round(s / 5)).padEnd(20, "░");
  console.log(`\nghostless slop-scan  ${root}`);
  console.log(`files scanned: ${filesScanned}`);
  console.log(`score: ${score}/100  ${bar(score)}  ${score >= 85 ? "clean" : score >= 65 ? "some tells" : score >= 40 ? "templated" : "ghost"}\n`);
  if (!findings.length) console.log("No tells found. Still run the visual tests: a scanner can't see a generic idea.\n");
  for (const f of findings) {
    console.log(`[-${f.penalty}] ${f.category} · ${f.id}: ${f.message}${f.count > 1 ? ` (${f.count}×)` : ""}`);
    for (const h of showAll ? f.hits : f.hits.slice(0, 4)) console.log(`    ${h.file}:${h.line}  ${h.text}`);
    if (!showAll && f.hits.length > 4) console.log(`    … ${f.hits.length - 4} more (--all)`);
  }
  console.log("\nEvery hit is a question, not a verdict: fix it, or keep it with a reason from the subject.");
}
if (failUnder != null && score < failUnder) process.exit(1);
