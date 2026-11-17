# Ambition: the quality bar

Removing tells only gets you to neutral. People pay for, remember and share designs that have
**presence**: the first screen makes an impression, the page feels alive under the thumb, and the
details hold up when you look closely. This file says what that takes.

## 1. Sourcing references

Ask: *which sites would this client be proud to stand next to?*

- Search by **feeling + medium**, not only by sector: "engineering studio website scroll storytelling",
  "hardware startup product site 3D", "editorial portfolio bold typography", "awwwards site of the day industrial".
- Sources: Awwwards (SOTD/Developer award), Godly, Siteinspire, Land-book, httpster, Minimal Gallery,
  Lapa Ninja, studio sites (e.g. design agencies' case studies), product sites of design-led
  hardware/software brands.
- Pick 6–10. For each write: URL · the feeling it gives · **one stealable technique**, stated
  concretely ("hero is a full-bleed macro photo cropped so the product edge cuts the headline";
  "section color changes on scroll, so each discipline has its own world"; "numbers are huge and the
  labels small").
- Learn techniques, never copy layouts, assets, copy or brand.

## 2. Ways to make a page feel alive (without cliché)

| Want | Crafted way | Cliché to avoid |
|---|---|---|
| A striking first screen | full-bleed art-directed image or 3D scene of the real thing; type at a scale that fights the image; one bold color field | gradient blob, centered headline + 2 buttons, fake dashboard |
| Depth | real layering: image behind type, overlap across section edges, scale contrast, crisp shadows only on floating things | glow, glass, blur blobs |
| Motion | scroll-linked sequence that explains something (the board assembling, data flowing to the server); pinned sections; smooth page transitions; spring-based micro-interactions | fade-up on every block, shimmer, marquee, floating particles |
| Color | a confident palette with 1–2 strong fields that change by section or topic; color tied to meaning | accent sprinkled everywhere; monochrome "to be safe" |
| Type | a display face with character at large sizes, plus a calm text face; dramatic scale jumps | Inter everywhere; tiny caps eyebrows on every block |
| Imagery without photos | three.js / R3F model of the product; code-generated visuals from real data; custom illustration in one consistent style; kinetic type over textures you make | stock, AI renders, abstract waves |
| Pace | alternate density: immersive image section → information-dense section → quiet breather → interactive moment | identical `py-24` sections |

Pick what serves the target feeling. "Impressive and alive" usually needs at least: a real hero
visual, one scroll-driven or interactive signature moment, strong color, and display type at scale.
"Calm and refined" uses the same care spent on type, space and image quality instead of motion.

## 3. Craft checklist (what makes it look professional)

- Grid: one clear column system; things align to it or break it on purpose, never by accident.
- Optical alignment: large type pulled to the edge, icons centered by eye, punctuation hung.
- Type: real typographic quotes and dashes, no widows in headlines (`text-wrap: balance`),
  `pretty` for paragraphs, tabular figures where numbers align, tracking tuned per size.
- Images: consistent crop rule, focal points set, never stretched, sized correctly per breakpoint, art-directed on mobile.
- States: hover, focus-visible, active, disabled, loading, empty, error, all designed.
- Transitions: between routes, when content loads, when filters change. Nothing just pops.
- Mobile isn't a squeezed desktop: the hero visual is recomposed for portrait, tap targets ≥ 44 px.
- Performance: hero visual loads fast (poster frame before 3D/video), no layout shift.
- Finish: favicon, social card, 404, consistent icon style, real footer content.

## 4. Impact rubric

Score each 1–5 from **rendered screenshots** at desktop and mobile. Anything under 4 gets reworked.

| Criterion | 1 | 3 | 5 |
|---|---|---|---|
| Memorability | forgettable, could be any site | one nice moment | you could describe it to a friend the next day |
| Visual richness | flat, empty, monochrome table | some imagery/color | confident imagery, color and depth that serve the content |
| Liveliness | static or cliché animations | a few transitions | motion that tells the story and feels good to use |
| Craft | misalignments, default states | tidy | details hold up at 200 % zoom |
| Subject fit | generic or costume-like | relevant | couldn't belong to anyone else, without being a gimmick |
| Clarity | can't tell what they do | clear after reading | clear in 5 seconds |

Report the scores with one line of evidence each. A high slop-scan score never makes up for a low rubric.
