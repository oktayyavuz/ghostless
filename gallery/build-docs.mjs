#!/usr/bin/env node
// Writes the screenshots from gallery/shots into the markdown docs:
//   gallery/GALLERY.md                     full visual catalog (Turkish + English)
//   references/styles.md, references/motion.md   thumbnail grids between <!-- gallery:start/end --> markers
// Run after `node gallery/shots.mjs`.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const cat = JSON.parse(readFileSync(join(here, "catalog.json"), "utf8"));
const has = (f) => existsSync(join(here, "shots", f));
const byGroup = (g) => cat.items.filter((i) => i.group === g.id);

// ---- GALLERY.md ----------------------------------------------------------
let md = `# ghostless gallery

Every card is the same fictional client (Lodos, a coffee roastery by the Karaköy ferry pier) in a
different style or with a different move, so the differences are easy to see. Run it live with
\`node scripts/gallery.mjs\` to mark what you like and what you never want.

Her kart aynı hayali kahve dükkânının farklı bir stilde ya da farklı bir hareketle hazırlanmış hali.
Canlı görmek ve seçim yapmak için: \`node scripts/gallery.mjs\`.

`;
for (const g of cat.groups) {
  md += `## ${g.title_tr} · ${g.title_en}\n\n${g.note_tr ? g.note_tr + "\n\n" : ""}`;
  for (const it of byGroup(g)) {
    const still = has(`${it.id}.webp`), strip = has(`${it.id}-strip.webp`);
    md += `### ${it.name_tr} · ${it.name_en}${it.warn ? " ⚠" : ""}\n\n`;
    md += `${it.desc_tr}. ${it.fits_tr ? `Uyar: ${it.fits_tr}.` : ""}${it.libs ? ` Araç: ${it.libs}.` : ""}\n\n`;
    if (g.id === "styles" && still) md += `<img src="shots/${it.id}.webp" width="720" alt="${it.name_en}">\n\n`;
    else if (strip) md += `<img src="shots/${it.id}-strip.webp" width="100%" alt="${it.name_en}, four frames">\n\n`;
    else if (still) md += `<img src="shots/${it.id}.webp" width="720" alt="${it.name_en}">\n\n`;
    md += `Demo: [\`demos/${it.group}/${it.id}.html\`](demos/${it.group}/${it.id}.html)\n\n`;
  }
}
writeFileSync(join(here, "GALLERY.md"), md);

// ---- thumbnail grids in references --------------------------------------
function grid(items, { strip = false, cols = 3 } = {}) {
  const cells = items.filter((it) => has(strip ? `${it.id}-strip.webp` : `${it.id}.webp`)).map((it) => {
    const src = `../gallery/shots/${it.id}${strip ? "-strip" : ""}.webp`;
    return `<td width="${Math.floor(100 / cols)}%" valign="top"><img src="${src}" alt="${it.name_en}"><br><b>${it.name_en}</b><br><sub>${it.name_tr}</sub></td>`;
  });
  let out = "<table>\n";
  for (let i = 0; i < cells.length; i += cols) out += `<tr>${cells.slice(i, i + cols).join("")}</tr>\n`;
  return out + "</table>\n";
}
function inject(file, block) {
  const p = join(root, file);
  let s = readFileSync(p, "utf8");
  const start = "<!-- gallery:start -->", end = "<!-- gallery:end -->";
  const content = `${start}\n${block}${end}`;
  if (s.includes(start)) s = s.replace(new RegExp(`${start}[\\s\\S]*?${end}`), content);
  else { const i = s.indexOf("\n## "); s = s.slice(0, i) + `\n\n${content}\n` + s.slice(i); }
  writeFileSync(p, s);
}
const G = Object.fromEntries(cat.groups.map((g) => [g.id, byGroup(g)]));
inject("references/styles.md",
  `## See them\n\nEach style on the same demo client (live and selectable: \`node scripts/gallery.mjs\`; all of them: \`gallery/GALLERY.md\`).\n\n${grid(G.styles, { cols: 3 })}\n`);
inject("references/motion.md",
  `## See them\n\nFour frames of each move on the same demo client (live: \`node scripts/gallery.mjs\`; full list: \`gallery/GALLERY.md\`).\n\n` +
  ["text", "forming", "scroll", "interaction", "treatment"].map((g) => {
    const grp = cat.groups.find((x) => x.id === g);
    return `**${grp.title_en}**\n\n${grid(G[g], { strip: true, cols: 2 })}\n`;
  }).join(""));
console.log("GALLERY.md, references/styles.md and references/motion.md updated");
