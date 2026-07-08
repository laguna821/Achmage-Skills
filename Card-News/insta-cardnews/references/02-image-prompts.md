# 02 — Card Image Prompts (Stage 2, HARD STOP)

One portrait image **per card**. This is the opposite of raw5-deck's 5-image economy: here every card gets its own purpose-built photo. Emit prompts, batch them for GPT image 2, then **stop** — no HTML until the user returns images and says `HTML로 진행`.

## 1. Aspect ratio — portrait, cover-cropped into 3:4

- The card is **1080×1440 (3:4 = 0.75)**. GPT image 2's portrait native is typically **1024×1536 (2:3 = 0.667)** — taller than the card.
- A 2:3 image placed `background-size:cover` in a 3:4 card is **cropped ~90 px top+bottom** (the horizontal center band is kept). This is fine and intended (croppable negative space), **but the headline zone must survive the crop.**
- **Rule:** every prompt reserves clear, low-detail negative space in the **top third OR bottom third** (wherever that card's headline sits per the preset). Keep the focal subject off the exact top/bottom edges.
- If the user's GPT image 2 supports a **direct 3:4 or custom size (e.g. 1080×1440)**, prompt at that and skip the crop note.

## 2. Every prompt must (10 conditions)

	1. No readable text.  2. No logos.  3. No numbers / tables / UI labels.  4. Doesn't look like a finished card.
	5. Wide, low-detail negative space in the headline third.  6. Works as a full-bleed 3:4 background.
	7. Survives the preset's scrim / tone / wash without going muddy.  8. Focal subject not jammed edge-to-edge.
	9. Texture still reads after color grading (LUT).  10. Fits the card's message — a photo, not decoration.

## 3. Base template (fill per card from the message table)

```text
Create a 1024x1536 vertical (2:3 portrait) raw photo for an Instagram card-news card.
This is not a finished card. It will be used full-bleed as a CSS background under a text overlay.
Subject: [topic]
This card's message: [message from the table]
Scene: [image-brief]
Style: premium editorial photography, realistic, natural light, clean composition, one clear focal point.
Composition: keep the [TOP | BOTTOM] third calm and low-detail as negative space for a Korean headline; focal subject in the [opposite] two-thirds, not touching the edges.
Do NOT include any readable text, logos, numbers, UI labels, posters, signage, brand names, or watermark.
It must survive a [dark scrim | brand-color multiply overlay | light wash] and still read.
```

Swap the two bracketed treatment/position choices to match the card's row (`filter` column) and the preset.

## 4. Per-preset tone add-ons (append to the base)

- **A · Dark Wash** — `Mood: cinematic, deep shadows, restrained saturation, strong atmosphere. Must hold shape and texture under a heavy dark gradient with white type on top.`
- **B · Brand Tone** — `Mood: clean and confident, mid-tones that take a [brand hue] multiply overlay well; avoid colors that clash with [brand hue]. White type will sit on top.`
- **C · Light Editorial** — `Mood: bright, airy, magazine editorial; leave one side/third light and unbusy so the image can wash into a light text panel with navy type.`

## 5. Batching for GPT image 2 (≤ 10 per batch)

GPT image 2 makes up to 10 at once. Group the prompts and label clearly so the user can paste one batch at a time:

	· 배치 1 — 카드 01–10   (10 prompts)
	· 배치 2 — 카드 11–20   (remaining prompts; omit if ≤ 10 cards)

Number every prompt with its card number. Filenames the user saves back: `card01.png … cardNN.png` into `assets/cards/`.

## 6. The STOP (emit, then wait)

After the prompts + batches, print the exact stop message from `SKILL.md` Stage 2 and produce **no HTML/CSS/JS**. Accept only explicit go words (`HTML로 진행`, `진행`, `go`, …). Ambiguous praise ≠ approval — ask.

## 7. Image QA (multimodal, when files return)

Read each returned image and check:

| Check | Pass |
|---|---|
| Text / logo | none readable |
| Headline zone | top or bottom third is calm enough for type |
| Focal subject | present, not jammed edge-to-edge |
| Scrim survival | still reads under this preset's treatment |
| Series fit | consistent enough to grade to one LUT with its neighbors |
| Crop safety | nothing important in the ~90 px that a 2:3→3:4 cover-crop removes |

Re-request only the failing cards (by number) with a corrected prompt. Do not proceed to build until every card passes.
