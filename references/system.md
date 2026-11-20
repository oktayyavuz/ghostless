# System: tokens, scales, files

## Tokens have roles

A palette of hex values is not a system. Every token says **what it's for**, so later pages don't
reach for the accent "because it looks nice".

```css
:root {
  /* material palette: named after source */
  --asphalt: #16181b;
  --tape: #f2c230;
  --chalk: #f3f1ec;
  --fog: #8a8f96;

  /* roles: the only names components use */
  --bg: var(--chalk);
  --ink: var(--asphalt);
  --ink-quiet: var(--fog);
  --action: var(--tape);          /* only things you can press */
  --action-ink: var(--asphalt);
  --rule: color-mix(in oklab, var(--ink) 14%, transparent);
  --danger: #b3261e;
}
```

Rules:
- Components use role tokens only. Raw hex or Tailwind palette classes (`indigo-500`) in a
  component are a review finding.
- Each accent has **exactly one role**, written in `DESIGN.md`.
- Check contrast for every ink/background pair you actually use (4.5:1 body, 3:1 large/UI).
- Dark mode is a second mapping of the roles, designed, not an inversion.

## Hierarchy-based scales

The "AI card kit" uses one radius and one shadow everywhere. Humans vary them by **level**:

| Level | Example | Radius | Elevation | Border |
|---|---|---|---|---|
| Page / section | section bands | 0 | none | none or rule |
| Container | panel, sheet | small or 0 | none | rule |
| Object | card, image, input | medium | none or 1 | rule |
| Control | button, chip | matches its shape idea | none | none |
| Overlay | menu, dialog, toast | medium | the only real shadow | none |

Pick values from the direction (hard-edged signage: 0/2/4; soft consumer: 6/12/20) but keep
**different levels visibly different**. Shadows exist only where something floats.

Spacing: a 4- or 8-based scale, but section spacing should come from content (see
`constraints.md` → content-length rhythm), not one `py-24` everywhere.

## Type scale

- Choose 1–2 families with a reason from the dossier; write the reason down.
- **Glyph test** before committing: render `Ğğ Şş İı Öö Üü Çç 0123456789 ₺ € — “” ‘’` (adjust for the
  locale) at display and body size. Reject faces with missing or fallback glyphs.
- Scale: 5–7 steps, ratio picked for density (1.2 dense UI, 1.25–1.333 marketing). Line length
  45–80ch for body; serif body gets a bit more line-height.
- Tabular figures (`font-variant-numeric: tabular-nums`) for prices, times, tables.
- Self-host fonts (`next/font/local` or `@font-face` with `font-display: swap`), subset to the locale.

## Imagery system

Sources (photo shoot brief, 3D models, generated graphics, illustration), crop and aspect rules,
color treatment (e.g. duotone), what every image slot falls back to when content has no image,
alt-text style. If the client has no photos, plan how visuals get **made** (3D, code-generated,
illustration, fetched openly licensed images with one shared treatment, or a shoot brief to send
the client), never "no images". Method and fetch script: `imagery.md`.

## Motion system

The signature motion (where, what it explains), page/state transitions, micro-interaction
springs, two or three named easing curves with durations, the scroll-linked moments, and the
reduced-motion fallback for each. Motion should make it feel alive; cut whatever is just decoration.

## Components inventory

For each component: purpose, variants actually needed, states (default, hover, focus-visible,
active, disabled, loading, empty, error), and which tokens it uses. Don't build variants nobody asked for.

## `DESIGN.md` template

```markdown
# <Project> design

## Subject
<dossier, short>

## Direction: <name>
Target feeling: <one line>. Source: <subject material>. Hero visual: <plan>. Signature move: <one thing>.
Moves: <2–3>. Constraint: <0–1>. Learns from: <reference sites + technique>.

## Color
| Token | Value | Role |
…
## Type
<families + reason + scale + glyph test result>
## Shape & depth
<level table with values>
## Imagery
<sources, crops, treatment, fallbacks>
## Motion
<signature motion, transitions, easings, reduced-motion>
## Copy voice
<3 rules + 3 example lines>
## Do / Don't
<project-specific, short>
```

## `DESIGN-LOG.md` template

```markdown
# Design log

## 2026-11-17 Direction chosen: "Signage"
Chosen over "Receipt" and "Night map".
Ghost table: <paste>
Rejected, with the person's words:
- "Receipt": "çok oyuncak gibi" (too toy-like)
- "Night map": "harita çok yavaş açılır, telefonda kullanılmaz"

## 2026-11-20 Feedback
- Hero counter animation: "dikkat dağıtıyor" → removed. Don't animate numbers on load.
```

Always read this file in phase 0. Treat rejected items and their close relatives as off-limits
unless the person reopens them.
