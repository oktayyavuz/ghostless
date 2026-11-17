# AI tells: catalog

A tell is a choice made by default rather than for this subject. Any item here can be right
for a specific brief; what's wrong is reaching for it without a reason. In the ghost pass, these
are the rows to beat. In review, each hit needs a fix or a one-line reason.

Tells come in **families**. Banning one member just moves the default to its sibling (purple →
cream/terracotta → black/acid green). Beat the family, not the member.

## 1. Color

- Indigo/violet → pink/blue gradients; "aurora" mesh blobs; radial glow behind the hero.
- Gradient-filled headline text (`bg-clip-text text-transparent`).
- Colored glow shadows (`shadow-purple-500/50`), neon borders, animated gradient borders.
- **The 2025–26 siblings:** warm cream (#F4F1EA-ish) + high-contrast serif + terracotta/clay
  accent (#D97757-ish); near-black (#0B0B0B/#111) + one acid green or vermilion accent;
  slate-900 + sky-400 "dev tool" palette.
- Tinted near-black standing in for black everywhere; `white/10` borders on every dark surface.
- Accent used everywhere (buttons, icons, links, badges, borders) so it means nothing.

## 2. Typography

- Inter, Geist, Poppins, Plus Jakarta Sans, Manrope, DM Sans, Space Grotesk, Outfit as the
  unexamined default; Instrument Serif / Fraunces as the default "editorial" escape.
- One word in a headline set in italic, bold, gradient or accent color.
- Tracked-out ALL-CAPS eyebrow label above every heading.
- Monospace for small meta labels when nothing is code or data.
- Meta strings joined with middle dots: `Design · Build · Ship`.
- `WORD — fragment` labels with a spaced em dash; `→` appended to every link and button.
- Huge hero type with tight negative tracking as the only typographic idea.
- Display faces that fake Turkish/other locales (missing ş ğ İ ı, fallback glyphs mid-word).

## 3. Layout & structure

- Hero: pill badge ("✨ New: …") → giant centered h1 → gray subline → two buttons (solid + ghost)
  → product screenshot in a fake browser frame, tilted or with a glow.
- Logo cloud "Trusted by teams at…" (often with invented logos).
- Three (or six) feature cards: icon in a tinted rounded square, bold title, two gray lines.
- Bento grid used because it's trendy, not because content has those proportions.
- Stats band: `10k+ · 99.9% · 24/7 · 4.9★`.
- Testimonials carousel with initials avatars; 3-tier pricing with a highlighted middle
  "Most popular"; FAQ accordion; "Ready to get started?" CTA band; 4-column footer.
- Every section: same `py-24`, same `max-w-7xl mx-auto`, same centered heading + subline.
- Numbered markers `01 / 02 / 03` on content that isn't a sequence.
- Broadsheet pastiche: hairline rules, zero radius, dense columns, mono captions, on any subject.

## 4. Components

- One radius on everything (`rounded-2xl`), the same soft shadow under every card.
- Content chopped into identical cards regardless of hierarchy.
- Glass: sticky blurred navbar, frosted panels, `backdrop-blur` as decoration.
- Pill badges on everything; status dots that pulse.
- Toggle "Monthly / Yearly — save 20%" by reflex.

## 5. Motion

- Fade-and-slide-up on every section on scroll (`whileInView`, AOS, `animate-fade-up`).
- Hover lift (`hover:-translate-y-1 hover:shadow-xl`) on every card.
- Infinite logo marquee; shimmer/sweep light passes; typing-effect headlines; count-up numbers;
  gradient borders that rotate; floating blobs; cursor-follow glow.
- Many small effects instead of one orchestrated moment.

## 6. Imagery & icons

- Abstract 3D blobs, glossy spheres, isometric illustrations, wavy SVG dividers.
- Stock: handshakes, laptops on desks, diverse-team-laughing-at-screen.
- AI renders standing in for the real product or place.
- Fake dashboards with sparklines and `+12.5%` green pills as hero art.
- Emoji as feature icons; the default icon library at default stroke in tinted circles.
- ✦ four-point sparkle (now reads as "AI feature"), magic wand, gradient orb.

## 7. Copy

See `copy.md` for the lexicon (English + Turkish). Structural tells:
- "X, reimagined." "Not just X. It's Y." "Built for A. Designed for B."
- Rhetorical triads: "Faster. Smarter. Better."
- Headlines that could fit any company in the sector (fails the swap test).
- Invented proof: user counts, ratings, testimonials, awards, "as seen in".
- Every section ends with a CTA; every button says "Get started" / "Learn more".

## 8. Dashboards & app UI

- KPI cards row (number + delta pill + sparkline) as the first thing on every dashboard.
- Donut charts for everything; rainbow categorical palettes.
- Sidebar with 12 icons of equal weight; avatar + name + chevron at the bottom.
- Empty states with an illustration and "Nothing here yet!".
- Every table row with hover highlight + kebab menu + status pill.

## 9. Brand marks

- Sparkle/star ✦, hexagon, abstract gradient orb, letter in a rounded square, swoosh,
  droplet/comma shapes, "circuit trace" lines for tech companies, orbit rings.
- Ruler-drawn geometric compositions with no idea behind them.
- Wordmark in the same default sans used across the UI.

## 10. Process tells (not visible in code, visible in the result)

- Nothing on the page is specific to the client (no real names, places, numbers, photos).
- All sections have equal weight; nothing was cut.
- The design would be the same if the business were in another city or sector.

## 11. The sterile escape (the ghost's mirror image)

What models produce when told "don't look like AI": every default removed and nothing put in its place.
It looks like a spec sheet, and people call it dry, unfinished, unprofessional.

- Monochrome everything, with color only on buttons. One typeface, small sizes, no scale drama.
- No imagery at all, and no plan to make any; empty space standing in for design.
- The page dressed as a document: datasheet, BOM, blueprint/technical drawing sheet, receipt,
  letter, terminal, spreadsheet. Concept cosplay instead of a design.
- "Index first": the first screen is a table or list of contents.
- No motion "to be safe"; hover changes color and nothing else.
- Three directions that are three versions of the same metaphor.
- Hairline rules and tiny uppercase labels as the only structure (broadsheet pastiche again).

If the rubric in `ambition.md` scores visual richness or liveliness under 4, you're here.
