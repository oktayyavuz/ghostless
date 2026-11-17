# Critique

Never call a design checked from reading code. Render it. Prefer text checks (`get_page_text`,
DOM queries, `curl`) for content; use screenshots for visual judgment, at small scale (0.4–0.5)
to keep context lean.

## 1. Scanner

```bash
node <skill-dir>/scripts/slop-scan.mjs src            # human report
node <skill-dir>/scripts/slop-scan.mjs src --json     # machine-readable
node <skill-dir>/scripts/slop-scan.mjs src --fail-under 80   # exit 1 below 80 (CI)
```

For every finding: fix it, or keep it and write the dossier reason next to it in the report.
Don't game the scanner (renaming classes to dodge patterns); the scanner is a proxy for the eye.

## 2. Visual tests

Run on the first screen and one inner page, at 375 px and 1440 px.

1. **Swap test.** Mentally replace the client's name and logo with a competitor's. If the page
   still works unchanged, it isn't specific yet. Count client-only facts on the first screen:
   need ≥ 3 (specificity count).
2. **Squint test.** Blur/squint: is there one clear focal point and a reading order? If
   everything has equal weight, cut or demote.
3. **Delete-one test.** Remove one section, one effect, one accessory. If nobody would miss it, keep it deleted.
4. **Stop-scroll test.** Imagine the first screen as a thumbnail in a feed of 20 sites. Does it
   stop the scroll? If it's the quietest one there, it's not done (unless "calm" was the brief, and
   even then it should be the most *beautiful* quiet one).
5. **Ghost check.** Compare against the ghost table. Did any ghost row sneak back during the build?
6. **Lineup.** Put the first screen next to the reference board and 3 real competitors (and, if available, 3 typical
   AI-generated pages for the same prompt). It should not blend in with either row.
7. **Thumb test (mobile).** The one action is reachable with a thumb on the first screen, tap
   targets ≥ 44 px, no horizontal scroll, text readable without zoom.
8. **States.** Empty, loading, error, long text, Turkish characters, 1 item vs 100 items.
9. **Dark / reduced motion / keyboard.** Visible focus; nothing important only on hover;
   motion off doesn't break layout.

## 3. Report format

Keep it short and ordered by impact.

```
Ghostless review: <page>   scanner: 72/100 → 91/100 after fixes
Impact: memorability 4 · richness 5 · liveliness 4 · craft 4 · subject fit 5 · clarity 5

Fixed
- Hero headline was generic ("Fast and reliable towing") → district + minutes
- 11 sections faded up on scroll → removed; kept the arrival counter as the one moment
- rounded-2xl on all 23 cards → level scale (0 / 4 / 8)

Kept on purpose
- Phone number top-right on every page: every competitor does it and drivers look for it there

Not checked
- Real-device iOS Safari; dark mode (system has none yet)

Open questions for you
- Fleet photos: are the 4 we have the current trucks?
```

Then append decisions and any rejection to `DESIGN-LOG.md`.
