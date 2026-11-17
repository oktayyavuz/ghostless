# Subject dossier and ghost pass

## Why

A model with a thin brief fills every gap with the average of the internet. A human designer
fills the same gaps with things they **saw**: the client's shop, their documents, their tools,
their customers' words. The dossier is a way to do the seeing on purpose.

## Dossier template

Write this into the conversation (or `DESIGN.md` § Subject) before any design work.

```markdown
## Subject
- Who arrives: <persona in one line, incl. device and moment: "driver stuck on E-5 at night, phone at 15%">
- Their job in 5 seconds: <the question they need answered>
- The one action: <call / book / buy / sign in / read>
- Vernacular (8–15):
  - objects & tools: …
  - materials & textures: …
  - documents & artifacts: (receipts, plates, tickets, forms, labels, maps, schedules…)
  - places & times: …
  - numbers that matter: (minutes, grams, km, episode counts, prices…)
  - words customers use: (not the industry's marketing words)
- Real content we have: …
- Missing (asked for): …
- Locale: language, script, ₺/€ format, date format, glyph check needed: yes/no
- Already rejected (from DESIGN-LOG): …
```

## Mining techniques

1. **Artifact hunt.** List the physical and digital things the business makes or uses: products,
   materials, tools, vehicles, receipts, signage, maps, schedules. Use them as **raw material**:
   a 3D model of the product as the hero, macro photos of materials, a motion that copies how the
   real thing moves, a small detail (a receipt-style order summary). **Don't turn the whole page
   into one artifact** (site-as-datasheet, site-as-blueprint, site-as-letter). That's concept
   cosplay, and it reads as dry and gimmicky.
2. **Numbers audit.** Which numbers does the customer actually care about? Put them on the first
   screen with units. "Avg. 22 min to Beylikdüzü" beats "Fast service".
3. **Material palette.** Colors sampled from the real place or product (photos the client sends,
   the logo, the uniform, the product itself) beat colors picked from a palette site. Name them
   after their source: `hazard-yellow`, `asphalt`, `flour`, `crust`.
4. **Customer words.** Read reviews, WhatsApp messages, support tickets, forum posts. Headlines
   come from what customers say ("Kaç dakikada gelirsiniz?"), not what the business wishes they said.
5. **Moment and device.** The same sector at different moments needs different design: a tow
   truck site is used in panic at night on a phone, so big tap targets, dark-friendly, the phone
   number never more than one thumb away. A bakery site is browsed calmly.
6. **Competitor lineup.** Look at 3–5 real competitors. Write what they *all* do. That's the
   local ghost; it's a second row of things to beat (or a convention to keep on purpose because
   customers rely on it, e.g. phone number top-right).

## Ghost pass

Write the ghost as a table. Be honest: this is what you'd ship for the generic prompt.

| Axis | The ghost (autopilot) | Ours | Reason (dossier item) |
|---|---|---|---|
| Sterile escape check | monochrome table, no images, one face | (how ours stays rich) | target feeling |
| Palette | | | |
| Typefaces | | | |
| Hero | | | |
| Section order | | | |
| Component shapes | | | |
| Imagery | | | |
| Motion | | | |
| Headline | | | |
| Primary CTA | | | |

Rules:
- "Ours" must differ from the ghost on every row, **or** "Reason" must cite a dossier item.
  "It looks clean" is not a reason. "Drivers in panic need the phone number as the hero" is.
- If 3+ rows keep the ghost, the direction isn't one yet; go back to the dossier.
- Keep the table; it goes into `DESIGN-LOG.md` with the decision.

## Worked example: 24/7 tow truck, Istanbul

**Dossier (excerpt):** driver on a highway at night, phone, stressed. Job: "will someone come,
how soon, how much". Action: call. Vernacular: hook, winch, flatbed, hazard triangle, plate
(34 ABC 123), E-5/TEM, district names, minutes, night, reflective tape, yellow-black chevrons.
Real content: 39 districts with measured arrival times, 6 services, fleet photos, phone, WhatsApp.

| Axis | Ghost | Ours | Reason |
|---|---|---|---|
| Palette | navy + orange gradient | asphalt black, reflective-tape yellow, white | night use; tape is the subject's own material |
| Type | Inter / Poppins bold | condensed grotesk like road signage, tabular figures | signage vernacular; times and plates are numbers |
| Hero | truck stock photo + "Fast & Reliable Towing" | night photo of their own truck under reflective light, full-bleed; the phone number and "Beylikdüzü: ~22 dk" set big over it | the one action and the one number, on the real thing |
| Section order | services cards → why us → testimonials → CTA | district picker → price ranges → fleet (real photos) → how a call goes | user's questions in order |
| Components | rounded-2xl cards | plate-shaped tags for districts; hard edges | plate artifact |
| Motion | fade-ups | the truck route animating across the district map to show the arrival time; otherwise quiet | panic moment: the motion *is* the answer |
| Headline | "Your trusted roadside partner" | "Nerede kaldınız? Söyleyin, kaç dakikada geleceğimizi görün." | customer's question |

## Worked example: anime streaming community (Turkish)

Vernacular: episode numbers, fansub credits (çeviri, encode, timing), subtitle file, seasons,
MAL score, "bölüm", watch history, Japanese titles, opening/ending, night binge.
Signature options: the fansub credit block designed like end-credits; episode list as a vertical
timetable (not a number grid); progress shown as a subtitle timing bar. Ghost to beat: Netflix row
carousels + HiAnime grids + red accent on black.

## Worked example: holding company (multi-sector)

Vernacular came from the company's own PDF: the logo is five vertical bars, one per sector.
Signature move: every motion (intro, page change, menu, hero image collapsing into the logo on
scroll) grows from those bars. Palette from the PDF's sector colors with roles. Ghost beaten:
"corporate blue + skyline stock photo + 'Building the future together'".
