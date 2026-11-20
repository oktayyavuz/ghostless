# Imagery: get real pictures onto the page

Template sites are image-poor: a headline, three icon cards, maybe one stock photo of people at a
laptop. Studio sites are carried by pictures: a full-bleed opener, macro details between
sections, a photo that the headline crosses. **Plan for a lot of imagery and go get it.**

Density to aim for: a hero visual on every page, imagery in at least every second section of a
landing page, and a picture (or made visual) heading every inner page. An empty slot is a
decision you have to defend, not a default.

## 1. Source ladder (best first)

1. **The client's own photos and footage:** their place, people, product, work. Ask for them early.
2. **A shoot brief** when they have none: a shot list (8–15 shots, each with subject, framing,
   light, aspect, which slot it fills). Send it to the client; use fetched images as stand-ins until it's shot.
3. **Made visuals:** 3D of the real product, code-generated graphics from real data, custom
   illustration, kinetic type over textures (see `motion.md` for dithering/halftone/ASCII treatments).
4. **Openly licensed images from the web**, fetched with `scripts/fetch-images.mjs` (below).
5. **Paid stock** only if the person approves the cost.

Never: images hotlinked from another site, grabs from Google Images or Pinterest (unknown
license), watermarked images, other companies' logos or products, and AI renders presented as
the real thing.

## 2. What fetched images are for, and what they are not

| Good use | Don't |
|---|---|
| place and atmosphere (the city, the street at night, the coast the hotel looks at) | present them as the client's office, staff, premises or work |
| materials and macro details (solder joints, dough, marble, rope, crema) | testimonial avatars or "our team" portraits |
| process and craft in general (hands kneading, a lathe, a server room) | the product the client sells, unless it's literally the same item |
| history and archive (public-domain photos, maps, prints, engravings) | portfolio / case-study images |
| textures for type and backgrounds (paper, concrete, fabric, film grain) | anything with readable brands or recognisable faces that don't need to be there |

If a slot needs the client's real thing and there is no photo yet, use a fetched stand-in, mark
it as a placeholder (`DESIGN-LOG.md` + a `placeholder: true` field or an admin flag), and add the
shot to the shoot brief.

## 3. Searching

Search terms come from the **subject dossier**, not from the industry name.

- ✗ "technology", "business team", "digital", "success", "coffee shop"
- ✓ "solder joint macro", "fiber optic cross section", "tow truck winch night rain",
  "portafilter crema close", "Istanbul ferry wake winter", "hand-set lead type"

Run 3–5 queries per slot, in English (most metadata is English) plus local names for places.
Prefer nouns + light + framing ("macro", "aerial", "night", "backlit", "overhead", "close").

```bash
node <skill-dir>/scripts/fetch-images.mjs "solder joint macro" --n 12 --orientation landscape
node <skill-dir>/scripts/fetch-images.mjs "istanbul ferry winter" --sources openverse,commons --out ./tasarim/gorsel-adaylari
PEXELS_API_KEY=… node <skill-dir>/scripts/fetch-images.mjs "night bakery hands dough" --sources pexels,openverse
```

It queries Openverse (aggregates Flickr CC, Wikimedia, museums and more), Wikimedia Commons, NASA
and, with a free key, Pexels. It keeps only licenses that allow commercial use **and**
modification (CC0, public domain, CC BY, Pexels; CC BY-SA only with `--allow-sa`), downloads
the files, and writes `credits.json`, `CREDITS.md` and `contact-sheet.html` per query.
Unsplash isn't included because its API terms require hotlinking; images downloaded by hand from
unsplash.com under the Unsplash License are fine.

**Reject on sight:** handshakes, lightbulbs, people pointing at laptops, glowing brains and
network lines, chess pieces, globes with connection lines, headset-smiling call centres,
high-fives, dartboards, rockets, anything that looks like a stock-photo search result.

## 4. Curate: look before you use

1. Open the contact sheet (serve the folder: `npx serve <dir>`) or montage it
   (`magick montage *.jpg -geometry 400x267+4+4 -tile 4x sheet.jpg`) and **look at every
   candidate.** Most won't be good enough; that's normal. Search again before settling.
2. Keep an image only if it has: one clear subject, good light, room for type where the layout
   needs it, resolution ≥ 2× its largest display width, no watermark, no stray brand.
3. Check the source page for each keeper: metadata is sometimes wrong (author, license, "own work").
4. The set must look like one shoot: similar colour temperature, contrast and lens feel. Drop
   the odd one out even if it's good on its own.

## 5. Art direction: make mixed sources one set

- **One crop system:** e.g. 3:2 for openers, 4:5 for portraits, 1:1 for details; focal points set.
- **One treatment:** a shared grade or duotone in the brand colours, the same grain, or a shader
  treatment (dithering, halftone) from `motion.md`. Examples with ImageMagick:
  ```bash
  magick in.jpg -colorspace gray -level 5%,95% +level-colors "#0e1b2c","#7cc3dc" out-duotone.jpg
  magick in.jpg -modulate 100,80 -fill "#16181b" -colorize 12% -attenuate .4 +noise gaussian out-graded.jpg
  ```
  (Applying a treatment is "modification": fine for CC0/BY/Pexels; for BY-SA the result must also be BY-SA.)
- **Type × image:** let headlines cross or sit inside images; that turns a photo into a layout.
- Export WebP/AVIF at 2–3 widths, keep originals out of `public/`.

## 6. Credits

- Keep `CREDITS.md` / `credits.json` in the repo for every image you use; delete unused candidates.
- CC BY / BY-SA need visible attribution: a `/credits` page linked from the footer, or a
  caption. Format: *"Title" by Author, CC BY 4.0, via Wikimedia Commons* with links.
- CC0, public domain and Pexels don't require it, but credit anyway when it costs nothing.

## 7. Where files go

```
tasarim/gorsel-adaylari/<query>/   candidates + contact sheet + credits (gitignored or deleted later)
public/images/<slot>/              chosen, treated, optimised files
content/credits.json               (or the DB) credits for the images in use
```
