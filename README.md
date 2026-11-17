# ghostless

**English** · [Türkçe](README.tr.md)

A design skill for Claude Code (and other agents that read `SKILL.md`) that keeps websites and
product UI from looking AI-generated.

Every prompt like "build a site for a dental clinic" has a *ghost*: the design any model produces
on autopilot. Indigo gradient, Inter, a pill badge, a centered hero, three icon cards,
"Trusted by", fade-up on every section. Most anti-slop skills ban the ghost's features, so the
default just moves to the next trend (cream and terracotta, black and acid green).

ghostless works upstream of the pixels:

1. **Subject dossier.** Before layout, collect the vernacular of the client's world: objects,
   documents, materials, numbers, the words customers use. Distinct design comes from there.
2. **Ghost pass.** Write down the default design as a table, then beat every row on purpose or
   justify keeping it with a fact from the dossier.
3. **Ambition, not just avoidance.** A reference board of real top-tier sites, a target feeling, and an
   impact rubric. A clean scan with a dull result counts as a fail, because the "sterile escape"
   (monochrome tables, page dressed up as a document) is a failure mode too.
4. **Three directions across a range of energy** (bold / refined / wildcard), each with a hero visual plan, built
   as high-fidelity previews that you look at before the person chooses.
5. **System with roles.** Tokens say what they're for; radius, shadow and spacing change by hierarchy level.
6. **Words before layout.** Real copy, specificity count, and a filler lexicon in **English and Turkish**.
7. **Measure.** `slop-scan.mjs` scores the code for 20+ tells, then visual tests: swap, squint,
   delete-one, competitor lineup.
8. **Design log.** It asks why the other directions lost and records the answer in the person's words, so the next session
   doesn't bring them back.

## Install

```bash
git clone https://github.com/oktayyavuz/ghostless ~/.claude/skills/ghostless
```

Claude loads it automatically when a task is about UI design; you can also call `/ghostless`.

## Scanner

Zero dependencies, Node 18+.

```bash
node ~/.claude/skills/ghostless/scripts/slop-scan.mjs src
node ~/.claude/skills/ghostless/scripts/slop-scan.mjs src --json
node ~/.claude/skills/ghostless/scripts/slop-scan.mjs src --fail-under 80   # CI gate
```

It checks color (AI gradient palettes, gradient text, glow, trend accents), surfaces (glass, blur
blobs, one radius everywhere, icon tiles), type (default faces, caps eyebrows, mono meta), motion
(scroll fades, hover lifts, marquee/shimmer/count-up), imagery (sparkles, emoji icons, stock),
structure (→ CTAs, middle-dot meta, 01/02/03) and copy (filler lexicon EN/TR, invented proof,
generic CTAs). Scoring scales with project size.

Silence a line with a `ghostless-ignore` comment, or a file with `ghostless-ignore-file`. Each hit is
a question, not a verdict.

## Layout

```
SKILL.md                  process (modes, phases 0–8)
references/tells.md       catalog of AI tells by family
references/subject.md     dossier method, ghost table, worked examples
references/ambition.md   quality bar, references, liveliness, craft, impact rubric
references/moves.md       additive moves + a few constraints
references/system.md      tokens with roles, hierarchy scales, DESIGN.md / DESIGN-LOG.md templates
references/copy.md        copy rules + EN/TR filler lexicon
references/critique.md    visual tests, report format
scripts/slop-scan.mjs     scanner
```

## License

MIT
