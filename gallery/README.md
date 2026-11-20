# ghostless gallery

A local "site builder"-style picker: the person sees every style, motion move and image
treatment live, marks what they like and what they never want, and sends the choice back to the
agent. Run it with `node scripts/gallery.mjs` (see SKILL.md, phase 2).

## Files

```
catalog.json          every item: id, group, Turkish/English name, one-line description, fits, libs
demos/_runtime.js     loop / fixed-frame / reduced-motion runtime for motion demos
demos/<group>/<id>.html   one standalone demo per catalog item
assets/*.webp         shared demo photos (credits in CREDITS.md)
shots.mjs             renders demos to shots/<id>.webp (+ <id>-strip.webp film strips for motion)
shots/                generated images, embedded in the reference .md files
index.html            the picker shell (served by scripts/gallery.mjs)
```

## Demo contract (for anyone adding a demo)

- **One standalone HTML file** at `demos/<group>/<id>.html`, with `id` and `group` exactly as in
  `catalog.json`. No build step, no npm, no CDN scripts. Google Fonts `<link>`s are fine (with
  system fallbacks). Vanilla CSS/JS, `<canvas>`, SVG and WebGL are fine.
- **Designed for a 1280×800 viewport** (it's shown scaled in a card and screenshotted at that
  size); must not break at 375 px wide. `overflow: hidden` on body; no scrollbars.
- **Same fictional client everywhere:** `catalog.json → demoBrand` ("Lodos", a coffee roastery by
  the Karaköy ferry pier). Use its real-sounding facts, menu and Turkish copy; Turkish characters
  must render. Images: `../../assets/<name>.webp` (list and descriptions in `demoBrand.images`).
- **Motion demos** (every group except `styles`) define, then load the runtime:
  ```html
  <script>
    window.demo = { duration: 2400, render(p) { /* deterministic frame for p ∈ [0,1] */ } };
  </script>
  <script src="../_runtime.js"></script>
  ```
  `render(p)` must draw the full state for any p with no dependence on previous frames (the
  screenshotter loads `?t=0.12`, `?t=0.4`, `?t=0.7`, `?t=1` separately). p = 1 is the finished,
  resting state. Helpers: `gl.seg`, `gl.lerp`, `gl.clamp`, easings, `gl.rand(seed)`.
  Scroll demos map p to "how far the visitor has scrolled". Interaction demos simulate the
  pointer along a scripted path as p advances (draw a small cursor).
  Canvas/WebGL demos that process an image must wait for it to load before the first render
  (call `demo.render(...)` again on load, or set `window.demo` after load and then load the runtime).
- **Style demos** are a first screen of the Lodos site in that style: header, a hero with real
  copy, imagery, and the beginning of a second section, so the style reads at a glance. They can
  include the runtime for a short entrance, but `?t=1` must show the complete design.
- **Quality bar:** each one should look like a page from a real studio, not a wireframe. Real
  type pairing, confident scale, real imagery. It has to be obviously different from the others.
- **Never use** (the person's rejections): gradient-filled text, glow or halo, grid/dot-pattern
  backgrounds, glass blur panels, horizontal shine/sweep, ambient blurred blobs, ✦ sparkles,
  emoji as icons, fake dashboards, invented statistics, "premium / next-gen" copy.
- Respect `prefers-reduced-motion` through the runtime (don't add your own loops outside it).
- Check your work: `node gallery/shots.mjs <id> [<id>…]`, then open `gallery/shots/<id>.webp`
  and `<id>-strip.webp` and look at them. Fix and re-shoot until they are good.
