# Motion palette

The ghost moves one way: everything fades up 30 px when it scrolls into view. Ten sections, one
entrance, the same easing. It reads as a template even when every other choice is good.

Sites that feel crafted have a **motion language**: a small set of named moves, derived from the
subject, each used where it means something, and no two neighbouring sections arriving the same way.

## 1. Build a motion language, not a list of effects

Take the shape for the motion from the subject or the brand mark, then reuse it everywhere.

> **Worked example (a holding company site).** The logo is five vertical bars. The same five
> bars become the preloader (they grow from the centre out), the page transition (five strips
> cover the screen, centre first), the menu opening, and the hero image, which is cut into five
> columns that slide in alternately up and down and then **morph into the logo shape** while the
> hero is pinned on scroll. Nothing is literally made of pixels, but the page feels like it
> assembles itself out of pieces, because one motif does all the moving.

Write the language into `DESIGN.md`:

```
Motion motif: <the shape/material it comes from> (5 logo bars / route line / dough fold / PCB layers)
Signature move: <one, used once or twice, the thing people remember>
Supporting moves: <2–4, from the catalog below, each with where it's used>
Shared grammar: <stagger order (centre-out, edge-in, random, along a path), 2 named easings, duration range>
Page transition: <how pages change>
Reduced motion: <what each move becomes>
```

Shared grammar is what makes varied moves still feel like one site: the same stagger order, the
same two easings (e.g. `expo.inOut` for wipes, `power4.out` for text), the same "container clips
while the inner image counter-moves and settles from scale 1.15–1.35".

## 2. Rules

1. **One signature move per project**, plus 2–4 supporting moves. More than that is a demo reel.
2. **No two adjacent sections share an entrance.** Plan it as a sequence, e.g.:
   hero (pinned morph) → statement (word scrub) → numbers (rule draw + count) → services (sticky
   stack) → vision (iris expand) → work (horizontal rail) → footer.
3. **Inner pages reuse 3 primitives** (e.g. line reveal, image curtain, quiet fade) and vary them
   with props: direction, delay cascade, stagger order. Don't invent new effects per page.
4. **Motion explains or rewards.** A morph that turns the photo into the logo says "this is who
   we are"; a scrub that darkens words as you read paces a manifesto. If you can't say what a move
   means, cut it.
5. **The page works without it.** Real text stays in the DOM (`aria-label` on the original,
   `aria-hidden` on split spans). Every move has a `prefers-reduced-motion` version (final state or
   a plain cross-fade). Hide pre-animation state only when JS + motion are on (`.js [data-reveal]`),
   never with a bare `opacity:0` in CSS.
6. **Don't hijack scroll.** Pinned sections advance with native scroll; smooth scroll (Lenis) must
   keep anchors, find-in-page and keyboard scrolling working.
7. **Pick a different signature next project.** Record it in `DESIGN-LOG.md`; repeating last
   project's signature is your own ghost.
8. **Watch the person's rejections.** Horizontal shine/sweep, glow trails and ambient blobs are
   common rejections. Prefer vertical, centre-out or shaped wipes over a left-to-right shine.

## 3. Catalog

Difficulty: **S** an afternoon · **M** a day or two · **L** WebGL-heavy.
⚠ = slides easily into a common rejection; use only with a reason.

### Text
| Move | What you see | Tool | D | Fits |
|---|---|---|---|---|
| Line mask rise | each line slides up from behind its own mask | GSAP SplitText `mask:"lines"`, anime.js `splitText` | S | editorial, long headlines |
| Word scrub | words go from faint to full as you scroll past | SplitText + ScrollTrigger `scrub` | S | manifestos, statements |
| Set-type drop | words drop in with a slight rotation, like set type | SplitText, Motion | S | brand statements |
| Character cascade | letters arrive on a custom curve | SplitText, Splitting | S | short display words |
| Scramble / decode | random glyphs settle into the real text | GSAP ScrambleTextPlugin | S | tech, security, data |
| Typed with corrections | types, backspaces, retypes | GSAP TextPlugin | S | dev tools, conversational products |
| Variable-font morph | weight/width change with scroll, cursor or proximity | `font-variation-settings` + GSAP/Motion | S | type-led, fashion, music |
| Kinetic sequence | words scale, stack and fill the viewport on a timeline | GSAP timeline | M | campaigns, events, music |
| Text on a path | type runs along a curve tied to the subject | SVG `textPath` + GSAP | S | food, craft, routes |
| Split-flap board | characters flip like a departures board | CSS 3D, Rive | M | transport, time, live data |
| Handwriting draw | an SVG stroke writes itself | GSAP DrawSVGPlugin | S | signatures, personal brands |
| Glyph/logo morph | one shape morphs into another | GSAP MorphSVGPlugin | M | logo intros, transitions |

### Image and media: "forming from pieces"
| Move | What you see | Tool | D | Fits |
|---|---|---|---|---|
| Strip assemble / blinds | image arrives in staggered strips, alternating directions | `clip-path` per strip + GSAP | S | architecture, holdings, interiors |
| Shape morph on scroll | full image morphs into the brand mark (polygon clip-paths) | interpolated `clip-path: polygon()` in a pinned scrub | M | brand openers |
| Pixel / mosaic resolve | big blocks resolve down to a sharp image | shader (OGL/three), canvas; React Bits "pixel transition" | M | games, digital culture, retro |
| Dithering reveal | 1-bit Bayer pattern resolves to full tone | `@paper-design/shaders-react` ImageDithering, custom shader | M | tech with character, print-like |
| Halftone build | image forms from dots (optionally CMYK) | Paper Shaders HalftoneDots/HalftoneCMYK | M | print, music, posters |
| ASCII render | image or 3D scene drawn in characters | three `AsciiEffect`, React Bits ASCII text | M | dev tools, archives |
| Particle assemble | thousands of points fly into the image's shape | three `Points`, OGL | L | launches, science |
| Noise dissolve | image burns or erodes in through noise | shader, vfx-js | M | film, fragrance, mood |
| Liquid / displacement transition | two images blend through a warp map | three/OGL shader, vfx-js, curtainsjs | L | fashion, galleries |
| Iris / window expand | small framed window grows to full bleed while the image scales down | `clip-path: inset()` + scale, scrubbed | S | vision statements, hospitality |
| Curtain + counter-parallax | container opens from one edge while the inner image moves the other way | `clip-path: inset()` + inner `yPercent` | S | any photo-led site |
| SVG mask wipe | organic/brush-shaped mask reveals the image | SVG `<mask>` + GSAP | M | craft, food, illustration |
| Scale-down hero | full-bleed media shrinks into its place in the layout | ScrollTrigger, GSAP Flip | S | real estate, hospitality |
| Slit-scan | time-smeared strips of video | canvas/shader with frame history | L | art, experimental video |
| Hover distortion | image ripples or bulges under the cursor | vfx-js, OGL | M | portfolios (desktop only) |
| RGB split ⚠ | colour channels separate for a moment | vfx-js, postprocessing | S | music, nightlife; reads "cyber" fast |

### Layout and scroll
| Move | What you see | Tool | D | Fits |
|---|---|---|---|---|
| Pinned story | section holds while its content advances with scroll | ScrollTrigger `pin`+`scrub`, Motion `useScroll` | M | process, product explainers |
| Sticky stack | panels stack; the one beneath scales to ~0.92 and darkens | `position:sticky` + scrubbed scale | S | services, case studies, steps |
| Horizontal rail | vertical scroll drives a sideways track (desktop) | ScrollTrigger `containerAnimation` | M | timelines, portfolios |
| Zoom-through | camera pushes through an element into the next scene | ScrollTrigger scale, three camera | M | immersive openers |
| Rule draw + count | lines draw in, real numbers count to value | GSAP scaleX + tweened text | S | stats (only real numbers) |
| FLIP layout | items glide to new positions on filter/sort | GSAP Flip, Motion `layout`, AutoAnimate | S | shops, galleries, filters |
| View transitions | native morph between pages or states | `document.startViewTransition`, `view-transition-name` | S | any multi-page site |
| Shared-element page change | a thumbnail grows into the next page's hero | View Transitions, Motion `layoutId`, Barba/Swup | M | portfolios, e-commerce |
| Motif page transition | strips/shapes from the brand mark cover and uncover the page | GSAP + router intercept | M | brand-led sites |
| Scroll-driven CSS | progress and reveals with no JS | `animation-timeline: view()` | S | lightweight sites |
| Velocity skew | content skews slightly with scroll speed | Lenis velocity + GSAP | S | editorial, galleries |

### Interaction and ambient
| Move | What you see | Tool | D | Fits |
|---|---|---|---|---|
| Magnetic control | button leans toward the cursor | GSAP `quickTo`, Motion springs | S | playful, agency |
| Cursor image trail | images spawn and fade along the cursor path | GSAP; Codrops image-trail demos | M | photography, fashion |
| Drag with inertia | a track or canvas you can throw | GSAP Draggable + Inertia, Embla | M | galleries, maps (keyboard alternative) |
| Physics toys | objects fall, collide, can be grabbed | GSAP Physics2D, Matter.js | M | playful brands, events |
| State-machine characters | icons/mascots react to input | Rive | M | apps, onboarding |
| Data-driven canvas | generative image from real data (tide, traffic, sales) | p5.js, canvas, OGL | M | civic, science, logistics |
| Flow field | particles follow a noise field | p5.js, three | M | art, research |
| Mesh gradient ⚠ | slowly moving colour field | Paper Shaders MeshGradient | S | basically the ambient blob |
| No-code shader scenes ⚠ | animated WebGL backgrounds | Unicorn Studio, Spline | S | most templates are glow, blobs or grids |

## 4. Libraries (checked on npm 2026-11-20; run `npm view <pkg> version` before installing)

**Default stack:** `gsap` + `@gsap/react` (Next/React or vanilla), `lenis` for smooth scroll,
`motion` for React layout/gesture work, `@paper-design/shaders-react` or `ogl` for image
treatments, native View Transitions for page changes.

| Package | Version · license | For |
|---|---|---|
| `gsap` · `@gsap/react` | 3.15.1 · 2.1.2, GSAP Standard License | timelines, ScrollTrigger, Flip, Draggable. **All former paid plugins are free** (SplitText, ScrambleText, MorphSVG, DrawSVG, Inertia, Physics2D), commercial use OK. Not open source: it can't be used in no-code animation builders that compete with Webflow. |
| `motion` | 14.14.0, MIT | framer-motion's new name; `motion/react`, layout animations, gestures |
| `lenis` | 1.3.27, MIT | smooth scroll; drive it from `gsap.ticker` |
| `animejs` | 4.5.0, MIT | lighter GSAP alternative; v4 has `splitText`, `onScroll`, draggable |
| `@react-spring/web` | 10.1.2, MIT | spring physics |
| `@formkit/auto-animate` | 0.10.2, MIT | zero-config list FLIP |
| `splitting` | 1.1.0, MIT | text split into CSS-variable spans |
| `@barba/core` · `swup` | 2.10.3 · 4.10.0, MIT | page transitions for multi-page (non-SPA) sites |
| `embla-carousel-react` | 8.6.0, MIT | headless carousel with drag physics (prefer over Swiper's default look) |
| `three` · `@react-three/fiber` · `@react-three/drei` | 0.187.0 · 9.8.2 · 10.7.9, MIT | 3D/WebGL; three addons include `AsciiEffect` |
| `postprocessing` | 6.39.6, Zlib | pixelation, noise, chromatic aberration passes |
| `ogl` | 1.0.11, Unlicense | minimal WebGL, far smaller than three |
| `pixi.js` | 8.23.0, MIT | 2D WebGL/WebGPU sprites, filters, displacement |
| `@paper-design/shaders-react` | 0.0.82, npm says Apache-2.0 (check the repo LICENSE) | dithering, image dithering, halftone, many ready shaders; playground at shaders.paper.design |
| `@vfx-js/core` · `react-vfx` | 1.6.0 · 1.0.7, MIT | WebGL effects on img/video/text, custom GLSL |
| `curtainsjs` · `gpu-curtains` | 8.1.6 · 0.17.4, MIT | WebGL planes mapped to DOM images (gpu-curtains is WebGPU, still WIP) |
| `@rive-app/react-canvas` | 4.40.0, MIT | interactive state-machine animation |
| `@lottiefiles/dotlottie-react` | 0.22.3, MIT | After Effects animations (`.lottie`) |
| `@theatre/core` | 0.7.2, Apache-2.0 (studio is AGPL) | visual timeline editing; repo quiet since 2024 |
| `p5` | 2.4.0, LGPL-2.1 | generative / creative coding |

Spline (`@splinetool/react-spline`) and Unicorn Studio are hosted tools with their own terms; the
free Unicorn plan is non-commercial. Check before using them for a client.

## 5. Component kits: mechanics yes, looks no

Kits are where the "AI site" look comes from. Read them for **how** an effect works; never ship
their default tokens, and never use the components in the left column.

| Kit | License | Don't use (the AI signature) | Worth studying |
|---|---|---|---|
| Aceternity UI | free tier unclear; Pro commercial | spotlight, beams, meteors, sparkles, aurora/lamp, background grids, gradient text | sticky-scroll reveal, parallax hero scroll |
| Magic UI | MIT (Pro proprietary) | shimmer button, border beam, shine border, grid/dot pattern, meteors, particles, animated gradient text | number ticker (real numbers only), text-animate |
| React Bits | MIT + Commons Clause | aurora, galaxy, glare hover, shiny text | split text, decrypted text, variable-proximity text, pixel transition, ASCII text, dither, image trail, magnet |
| Motion Primitives | MIT | text shimmer, spotlight | text effect, text morph, morphing dialog, transition panel |
| Animata, Cult UI | MIT | animated beams, glossy cards | split-reveal preloader; check each piece |
| shadcn/ui | MIT | the default look itself (slate, one radius, `Card` everywhere) | accessible primitives; always restyle tokens |

The scanner flags the left-column names (`kit-slop`).

## 6. Where to learn a move

- **Codrops** (tympanus.net/codrops): demos with source. Good starting points: free GSAP plugin
  demos (SplitText → MorphSVG, 2025), real-time dithering shader (2025), Bayer dithering
  backgrounds (2025), animating WebGL shaders with GSAP (2025), VFX-JS (2025), ASCII + dithering
  with WebGL (2026).
- **shaders.paper.design**: live playground for every Paper shader.
- **gsap.com** docs and showcase; **developer.chrome.com** for View Transitions.
