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

## The run: every step, every time (New and Rescue modes)

Skipping steps is how this skill fails: directions get invented from a template, nobody looked at
real sites, the person never got to show their taste, and the previews have no real pictures.
These are **not optional**, even when the request summarises the job in fewer words ("subject
file → ghost table → 3 directions" is a summary of this list, not permission to skip the rest):

1. **Read what's decided** (Phase 0), including the **live site** if one exists: open it and look.
2. **Subject file** `tasarim/KONU.md`: target feeling, who/one action, real content, subject material (Phase 1).
3. **Reference board** of 6–10 real sites **found with web search in this session**, each with its
   URL and one technique to learn, in `KONU.md` (Phase 2). From memory doesn't count.
4. **Ghost table** in `KONU.md` (Phase 2).
5. **Gallery taste check:** run `scripts/gallery.mjs`, open it for the person, wait for their
   choice in `tasarim/secimler.json` (Phase 2). Directions are built from what they liked.
6. **Images:** collect the client's own, make visuals, fetch openly licensed ones
   (`scripts/fetch-images.mjs`), and look at every candidate (Phase 3, `references/imagery.md`).
7. **Three directions** as hi-fi previews in `tasarim/yonler/<id>/index.html`, each from a
   different named style, with a hero visual and its own motion language (Phase 3).
8. **Gate:** `node <skill-dir>/scripts/check.mjs` must pass (✓ everywhere) before you show anything.
9. **Show them in the gallery** (`gallery.mjs --directions tasarim/yonler`), get the choice and the
   reasons, log both in `DESIGN-LOG.md` (Phases 3, 8).

Only the person can waive a step, in their own words. Then add `ghostless-waive: <gallery|references|images>`
with their quote to `DESIGN-LOG.md` so the gate knows. Never waive a step on their behalf.

If a round of directions is rejected, don't just make three more: go back to step 3 and step 5 with
what you learned (new references, a second pass in the gallery with the rejection in mind).

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
files, tokens, a few components, and any memory about the person. If there is a live site or an
older version, open it in a browser and look at it before proposing anything. Everything that was rejected
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
3. **Taste check in the gallery.** Most people can't name styles or read component code, but
   they know what they like when they see it. Start the bundled picker and let them choose:
   ```bash
   node <skill-dir>/scripts/gallery.mjs --project "<name>" --wait     # run in the background
   ```
   It serves a local page on a free port (from 5600, skipping busy and reserved ports) with ~60
   live demos of one fictional client: visual styles, text motion, image reveals ("forming from
   pixels"), scroll moves, interaction and image treatments. Open it where the person can see it
   (browser pane / their browser), tell them in one line what to do, and wait. They mark
   **Beğendim / Asla** and add a note; on "Seçimi gönder" the choice is written to
   `tasarim/secimler.json` and the process prints it and exits.
   Use it: liked styles and moves are the raw material for the three directions (spread them
   across bold / refined / wildcard); every "Asla" goes into `DESIGN-LOG.md` as a rejection, with
   its close relatives. Don't skip it because a DESIGN-LOG exists or because you think you know
   their taste; only the person can waive it (see "The run").

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
plainly. Check: do the three look clearly different in a thumbnail? Would at least one make
someone stop scrolling? If not, redo the weakest one.

**Then show them. This step is mandatory, and it's the one most often forgotten.** Asking "which
one?" about designs the person hasn't seen is a failure. Before any choice question:

1. **Put each preview in front of the person.** Best: the same gallery, with the directions on
   top, where they can pick one and tick why the others didn't work:
   ```bash
   node <skill-dir>/scripts/gallery.mjs --directions tasarim/yonler --project "<name>" --wait
   ```
   (each `tasarim/yonler/<id>/index.html` is one direction; its `<title>` is the label). The
   chosen direction and the reasons land in `tasarim/secimler.json`: copy the reasons into
   `DESIGN-LOG.md` verbatim. Otherwise, using whatever this environment offers, in this order of
   preference:
   - open it in a browser they can see (in Claude's desktop app: the browser pane, one tab per
     direction, via `preview_start` / `navigate`);
   - publish it as a viewable page if a page/artifact tool exists;
   - send **screenshots as images into the chat** (a file-sending tool with inline rendering):
     the first screen at desktop and mobile width, plus one inner section, for each direction.
2. **Give each one a label and a link:** "A · Night shift: http://localhost:5610/a (file:
   `tasarim/a/index.html`)". A file path alone, buried in a paragraph, doesn't count as showing.
3. **Describe each in two lines** next to its picture: the idea, the hero visual, the signature move.
4. **Only then ask.** The choice question must stand on its own (the dialog can hide everything
   above it): name each option with its label and where to look ("A: tab 1, the night-photo
   one"). If the question tool supports per-option previews, put the link and the two-line
   description there.
5. If you truly can't show anything visual here, say so and give the exact command to open the
   previews (`npx serve tasarim -l 5610`, then the three URLs).

Then let the person choose or mix (`AskUserQuestion` if available).

**Ask why the others lost.** Once a direction is chosen, ask one short question about each
direction that wasn't chosen ("What put you off B: the color, the type, the mood?"), with a few
likely answers as options. A rejection without a reason only blocks that one design; a reason
("too playful", "the photo feels cheap") blocks a whole family of designs and goes into the log.
If the person skips the question, write "no reason given" in the log rather than inventing one.

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
| `references/styles.md` | phase 3: named visual styles as starting vocabularies, with motion that suits each (with screenshots) |
| `scripts/check.mjs` | gate before showing directions: verifies every step of "The run" left its file |
| `gallery/` + `scripts/gallery.mjs` | phases 2–3: live picker for styles, motion and treatments; shows the directions and collects the choice |
| `references/imagery.md` | phases 3, 4, 6: image density, source ladder, fetching openly licensed images, curation, treatment, credits |
| `references/motion.md` | phases 3, 4, 6: motion language, ~50 named moves, verified libraries, component-kit warnings |
| `references/tells.md` | phases 2, 7: template tells **and** sterile-escape tells |
| `references/subject.md` | phases 1–2: subject material, ghost table, examples |
| `references/system.md` | phase 4: tokens, scales, imagery/motion systems, file templates |
| `references/copy.md` | phase 5: copy rules + EN/TR filler lexicon |
| `references/critique.md` | phase 7: visual tests, report format |
