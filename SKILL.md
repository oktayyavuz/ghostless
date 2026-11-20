---
name: ghostless
description: End-to-end design process for websites, web apps and product UI that should look like the work of a top studio, not AI output. Use when starting or redesigning a site, landing page, dashboard or app screen, when choosing a visual direction, design system, fonts, colors, imagery or motion, when writing interface copy, and when someone says a design looks generic, templated, dull, "AI-made", "slop", "cıvık", "şablon gibi", "kuru" or "yapay zekâ yapmış gibi". Also use to audit an existing UI (it ships a scanner) and to extend a project that already has a DESIGN.md.
license: MIT
---

# Ghostless

Every prompt like "build a site for a dental clinic" has a **ghost**: the design any model
produces on autopilot. Indigo gradient, Inter, pill badge, centered hero, three icon cards,
fade-up on every section. People spot it in a second and stop trusting the page.

There are two ways to fail, and avoiding the first one usually leads straight into the second:

1. **The ghost:** template defaults.
2. **The sterile escape:** strip out everything the ghost does and what's left is a monochrome
   table, one typeface, no images, no motion, dressed up as a document (a datasheet, a blueprint,
   a receipt). It isn't "AI-looking", but it's dull, it looks unfinished, and nobody remembers it.

The goal is neither of these. **The goal is work a top studio would put in its portfolio:**
striking at first sight, alive, clearly made for this client, and built with care down to the
details. Avoiding tells is the floor. The bar is set by the ambition.

## Modes

| Mode | When | Phases |
|---|---|---|
| **New** | new project or full redesign | 0 → 8 |
| **Extend** | project has a `DESIGN.md`; new page/feature | 0, 2 (new part only), 5 → 8 |
| **Audit** | "review", "why does this look AI/dull" | 0, 7 → report |
| **Rescue** | existing UI that's generic or dull | 0, 7 (diagnose), 1–4 light, 6–8 |

The person's explicit words always win. Say which mode you're in, in one line.

## Phase 0 — Load what's decided

Read `DESIGN.md`, `DESIGN-LOG.md` (decisions and **rejected directions with reasons**), brand
files, tokens, a few components, and any memory about the person. Everything that was rejected
is off the table, and so are its close relatives. If a whole *kind* of design was rejected (for
example "dry document-like directions"), steer every new direction away from that kind.

## Phase 1 — Brief: feeling, facts, subject

- **Target feeling:** ask, or infer and confirm: e.g. *impressive and alive / calm and refined /
  technical but warm / playful*. Write it in one line. Every later decision is judged against it.
- **Who / job / one action:** who arrives, what they need in 5 seconds, what they should do.
- **Real content:** services, prices, numbers, team, work, quotes. Never invent proof. Ask for
  what's missing in one message; mark gaps `[FILL: …]`.
- **Subject material:** objects, materials, processes, places, numbers and words from the client's
  world (`references/subject.md`). This is **raw material for visuals, motion and details**, not
  a costume for the layout. Don't dress the page up as a receipt or a datasheet.
- **Locale:** language, formats, and whether candidate typefaces render it (Turkish ğ ş ı İ…).

## Phase 2 — References and the ghost

Humans design from references. Models design from the average. Close that gap here.

1. **Reference board (6–10 real sites):** use web search or the browser to find excellent, recent
   work that matches the **target feeling**, not just the sector. Good places to look: Awwwards,
   Godly, Siteinspire, Land-book, httpster, One Page Love, studio portfolios, product sites of
   brands known for design. For each one, note **one specific technique** worth learning (how
   the hero image is cropped, how the type scale jumps, how scrolling tells a story, how color
   blocks pace the page). Learn the technique, never copy the site. If you have no web access,
   say so and use your best knowledge of named studios and sites.
2. **Ghost table:** write the autopilot design as a table, then plan to beat every row (see
   `references/subject.md`). Add a row for the *sterile escape* too, so you don't fall into it.

## Phase 3 — Three directions that really differ

Make three directions that span a range of **visual energy**, not three takes on one metaphor:

- **Bold:** leads with imagery, color and motion. The most striking of the three.
- **Refined:** leads with typography, space and detail. Quiet but rich, never empty.
- **Wildcard:** an unexpected idea that's still right for the subject and the feeling.

Each direction has:
- **Hero visual plan:** exactly what makes the first screen striking (a 3D scene of the real
  product, an art-directed photo series, a scroll-driven sequence, oversized kinetic type over
  imagery, a bold color field system…). "A headline and a button" is not a hero visual plan.
  Previews use real pictures: fetch candidates for the hero and 2–3 sections before building them
  (`references/imagery.md`), so the person judges the direction with its imagery, not grey boxes.
- **Signature move:** one memorable idea grown from the subject material.
- **Moves:** 2–3 additive moves from `references/moves.md` (scale, color, image, motion, type).
  At most **one** restrictive constraint per direction, and only if it sharpens the idea.
- **Tokens sketch:** 4–6 colors with roles, typefaces with roles, and the reference sites it learns from.
- **Style vocabulary:** a named style it starts from (`references/styles.md`: editorial, Swiss,
  industrial, risograph, dithered, terminal, collage…) and how the subject bends it. The three
  directions start from three different styles.
- **Motion language** (`references/motion.md`): a motif taken from the subject or the mark, one
  signature move, 2–4 supporting moves, and the section-by-section entrance sequence. No two
  neighbouring sections arrive the same way; "everything fades up" is not a motion language.

**Build each direction's first screen as a high-fidelity preview**, with real type, real color,
real or generated visuals and its motion running. Low-fi wireframes can't show "impressive",
and people judge what they can see. **Open the previews and look at them yourself before showing
them** (local server or browser; screenshots at scale 0.4–0.5). If you can't view them, say so
plainly. Then let the person choose or mix (`AskUserQuestion` if available).

**Ask why the others lost.** Once a direction is chosen, ask one short question about each
direction that wasn't chosen ("What put you off B: the color, the type, the mood?"), with a few
likely answers as options. A rejection without a reason only blocks that one design; a reason
("too playful", "the photo feels cheap") blocks a whole family of designs and goes into the log.
If the person skips the question, write "no reason given" in the log rather than inventing one.

Before you present, check: do the three look clearly different in a thumbnail? Would at least
one make someone stop scrolling? If not, redo the weakest one.

## Phase 4 — System

Turn the chosen direction into a system (`references/system.md`): tokens with roles, scales that
vary by hierarchy level, type scale with a locale glyph test, **imagery system** (sources, crops,
treatment, how missing images are handled), **motion system** (the signature motion, transitions,
micro-interactions, easing, reduced-motion fallback; use the template in `references/motion.md`).
Write it to `DESIGN.md`.

## Phase 5 — Words

Write the real copy before laying out pages (`references/copy.md`): specific over impressive,
buttons that say what happens, numbers with units, and no filler (English and Turkish lexicons).
The first screen needs at least 3 facts that only fit this client.

## Phase 6 — Build with craft

- Build the **hero visual and signature move first**, at full quality, then the rest.
- **Visual richness without cliché:** large confident imagery, real color, depth that comes from
  layering and scale (not glow and blur), section rhythm that changes pace (full-bleed image →
  dense info → breathing space).
- **Motion that feels alive:** build the motion language from `references/motion.md` with the
  libraries listed there (GSAP + free plugins, Lenis, Motion, shaders); scroll-linked storytelling tied to content, smooth page and state
  transitions, considered micro-interactions, one or two memorable moments. Avoid generic
  fade-up on everything, shimmer and ambient blobs. Always honor `prefers-reduced-motion`.
- **Imagery, and a lot of it** (`references/imagery.md`): the client's own photos first; then
  made visuals (3D of the real product, code-generated graphics from real data, illustration,
  kinetic type); then openly licensed images you **fetch yourself** with
  `node <skill-dir>/scripts/fetch-images.mjs "<specific query>"`: search with dossier nouns,
  look at every candidate, keep few, give them one treatment, keep the credits. Never generic
  stock clichés, hotlinks, fake dashboards, or AI renders presented as the real product.
- **Craft details** (`references/ambition.md` § Craft): optical alignment, type details, image
  treatment, hover/focus/active states, loading and empty states, 375 → 1920 px.

## Phase 7 — Measure both sides

1. **Slop scan:** `node <skill-dir>/scripts/slop-scan.mjs <src>` finds template tells. Fix each
   hit or keep it with a reason.
2. **Impact rubric** (`references/ambition.md`): score memorability, visual richness, liveliness,
   craft, subject fit and clarity from 1 to 5. **A clean scan with a dull result is a fail.** Anything
   under 4 gets reworked before you hand it over.
3. **Visual tests** (`references/critique.md`): swap, squint, stop-scroll, lineup against the
   reference board, mobile, states. Look at real renders, not code.

## Phase 8 — Log

Append to `DESIGN-LOG.md`: what was chosen, what was rejected and **why, in the person's words**,
and any later "I don't like this". Phase 0 reads it every time.

## References

| File | Use |
|---|---|
| `references/ambition.md` | phases 2, 3, 6, 7: quality bar, reference sourcing, liveliness techniques, craft checklist, impact rubric |
| `references/moves.md` | phase 3: additive moves + a few constraints |
| `references/styles.md` | phase 3: named visual styles as starting vocabularies, with motion that suits each |
| `references/imagery.md` | phases 3, 4, 6: image density, source ladder, fetching openly licensed images, curation, treatment, credits |
| `references/motion.md` | phases 3, 4, 6: motion language, ~50 named moves, verified libraries, component-kit warnings |
| `references/tells.md` | phases 2, 7: template tells **and** sterile-escape tells |
| `references/subject.md` | phases 1–2: subject material, ghost table, examples |
| `references/system.md` | phase 4: tokens, scales, imagery/motion systems, file templates |
| `references/copy.md` | phase 5: copy rules + EN/TR filler lexicon |
| `references/critique.md` | phase 7: visual tests, report format |
