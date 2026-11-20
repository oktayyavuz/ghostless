// ghostless gallery runtime. Every motion demo defines, before loading this file or right after:
//   window.demo = { duration: 2400, render(p) { /* set the visual state for progress p ∈ [0,1] */ } }
// render(p) must be deterministic: the same p always draws the same frame.
//
// Behaviour
//   default            plays 0 → 1 over `duration`, holds the end for `hold` ms, loops
//   ?t=0.35            draws that single frame and stops (used for screenshots / film strips)
//   ?static            same as ?t=1
//   click anywhere     restarts the loop
//   reduced motion     draws p = 1 and stops
// Pages may also set demo.hold (ms, default 1400) and demo.ease (fn) — p is passed through ease.
(function () {
  const q = new URLSearchParams(location.search);
  const fixed = q.has("static") ? 1 : q.has("t") ? Math.min(1, Math.max(0, parseFloat(q.get("t")) || 0)) : null;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function start() {
    const d = window.demo;
    if (!d || typeof d.render !== "function") return;
    const ease = d.ease || ((x) => x);
    const draw = (p) => d.render(ease(p));
    document.documentElement.dataset.ready = "1";
    if (fixed !== null) { draw(fixed); document.documentElement.dataset.frame = String(fixed); return; }
    if (reduce) { draw(1); return; }
    const dur = d.duration || 2400, hold = d.hold ?? 1400;
    let t0 = performance.now();
    const loop = (now) => {
      const e = now - t0;
      draw(Math.min(1, e / dur));
      if (e > dur + hold) t0 = now;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    addEventListener("click", () => { t0 = performance.now(); });
  }
  if (document.readyState === "complete") start();
  else addEventListener("load", start);
})();

// Small helpers demos may use.
window.gl = {
  clamp: (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)),
  // progress of a sub-range: seg(p, 0.2, 0.6) is 0 before 0.2, 1 after 0.6
  seg: (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a))),
  lerp: (a, b, t) => a + (b - a) * t,
  easeOutExpo: (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)),
  easeInOutExpo: (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2),
  easeOutQuart: (x) => 1 - Math.pow(1 - x, 4),
  easeInOutCubic: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  // seeded random so frames are stable
  rand: (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646,
};
