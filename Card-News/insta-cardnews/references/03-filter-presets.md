# 03 — Filter Presets

Three presets. **One governs the whole series.** A preset = a `:root` token block (colors + one LUT grade) + the set of filter classes it draws from. The LUT is the trick that makes 20 *different* photos read as one carousel: every `.card-img` gets the same `filter:` grade.

Set the chosen block once at the top of `cardnews-proof.html`. The filter classes themselves live in `04-card-runtime-css.md`.

## Preset A · Dark Wash  (default — dramatic, impactful)

```css
:root{
  --card-text:#ffffff;
  --ink:#0e1116;
  --accent:#ff5a36;                 /* coral-red — the ONE accent */
  --accent-mult:rgba(232,73,42,.55); /* for halftone multiply */
  --lut:saturate(.9) contrast(1.06) brightness(.98);  /* dark grade, applied to every photo */
}
```

- **Body cards:** `fx-material` (image window + dark scrim, photo stays visible) or `fx-tone-dark`.
- **Cover:** `fx-blendif` (white type straight on photo) or `fx-halftone` (poster accent).
- **Texture card / closing:** `fx-paper` (grain + dark).
- **Data card:** `fx-material` + inline SVG chart (metric-window pattern).
- Text is **white**; accent is coral-red; one accent only.

## Preset B · Brand Tone  (cohesive branded series)

```css
:root{
  --card-text:#ffffff;
  --accent:#b6ff00;                 /* set to the brand's accent */
  --tone-a:rgba(19,54,109,.78);     /* brand hue, light stop  */
  --tone-b:rgba(9,20,40,.88);       /* brand hue, dark stop   */
  --blend-fade:rgba(9,20,40,.72);
  --blend-fade-end:rgba(9,20,40,.98);
  --accent-mult:rgba(19,54,109,.60);
  --lut:saturate(.95) contrast(1.05) brightness(.96);
}
```

- **Body cards:** `fx-tone` (brand-color `multiply` over the photo) or `fx-blend` (photo fades to the text zone).
- **Cover:** `fx-tone` with the headline accent word in `--accent`.
- **Data card:** `fx-material` + SVG.
- Swap `--tone-a/-b`, `--blend-fade*`, `--accent-mult` to the real brand hue; keep the SAME hue across all cards.

## Preset C · Light Editorial  (report / magazine feel)

```css
:root{
  --card-text:#12233d;              /* navy ink — text is dark here */
  --accent:#e8492a;                 /* coral */
  --paper:#faf9f6;
  --lut:grayscale(.06) saturate(.82) contrast(1.04) brightness(1.02);  /* light grade */
}
```

- **Body cards:** `fx-wash` (blurred low-opacity photo behind a light panel) or `fx-luma` (photo up top fading into a light text zone below).
- **Cover:** `fx-luma` — photo fills the top, headline sits in the light lower third.
- **Data card:** light card, slim HTML/SVG chart, `--accent` bars.
- Text is **navy ink** on light; accent coral; the ONE dark thing per card is the accent.

## LUT — why it's load-bearing here

raw5-deck reused 5 images, so tonal consistency was free. This skill uses up to 20 *different* photos, so without a shared grade the carousel looks like a random album. The `--lut` value is applied to **every** `.card-img` (the runtime composes it as `filter:var(--lut) …`), pulling all photos toward one saturation/contrast/brightness signature. **Do not vary `--lut` per card.** If one photo still clashes, fix it in Stage-2 re-prompt, not by re-grading a single card.

## Rules across all presets

- **Text color is set by the preset** (`--card-text`) — white for A/B, ink for C. Never gray on photo.
- **One accent** (`--accent`). No second accent, no gradient-clipped text.
- **One filter per card.** Vary the filter across cards for rhythm; never stack two on one card.
- **No `backdrop-filter`** anywhere (hangs headless export).
