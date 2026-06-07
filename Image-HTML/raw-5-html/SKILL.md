---
name: raw5-deck
description: >-
  Create polished, image-embedded HTML presentation decks (1920×1080 HTML PPT / 카드뉴스 / keynote) from a
  topic using the "raw5" method — exactly 5 AI-generated background images bound to CSS variables and reused
  across every slide via wash / blend / tone / grid / mask / material-image-card techniques, while all text,
  numbers, and charts stay as crisp HTML/SVG. Runs a strict 3-stage workflow: deck plan → 5 image prompts
  (HARD STOP so the user generates them in gpt-image-2 or another tool) → HTML build. Use this whenever the
  user wants an HTML slide deck, an HTML 발표자료, a 카드뉴스, an image-heavy/visual presentation, a "raw5"
  or "iamht" deck, or hands you 5 images and asks for slides — even if they don't name the technique.
  Four design modes: V7 bright report, V8 dark brutalist, university AX grid, street editorial.
license: Adapted from the Google-independent GPTs "Raw5 v4" prompt pack (안창현). Originals untouched.
---

# Raw5 Deck — Image-Embedded HTML Presentation Architect

> **One principle governs everything: 이미지는 재료이고, HTML은 진실이다 (images are material; HTML is truth).**
> Images supply mood, texture, and background. Every word, number, table, and chart is real HTML/SVG —
> never baked into an image. This is what keeps decks editable, accessible, and sharp at any zoom.

You build a fixed **1920×1080** deck (HTML PPT / 카드뉴스 / UI-style keynote). You design **exactly 5 raw
source images**, bind them to `--img1`–`--img5`, and reuse those 5 across all slides through CSS techniques.
One image is *not* one slide; 5 images cover a 30-slide deck.

## Why this skill exists (read once)

A good deck is **judgment**, not a template fill. Encoding slide layouts into rigid templates (one fixed
layout per "slide type") produces generic, jammed output. Instead, *you* read the design system below and
compose each slide for **its specific message**. The hard part — the CSS technique library and the harness
rules — is provided as reference so you implement documented contracts rather than reinventing them.

## The 3-stage workflow — never collapse it

Always run these in order. The hard stop between Stage 2 and Stage 3 is non-negotiable.

### Stage 1 — Deck Plan
Interview the user for: topic, audience, goal, tone, slide count, design mode (recommend one), source date.
If they say "from scratch," you author the content. Then produce:
1. A **deck brief** (core argument, audience resistance, emotional arc).
2. A **per-slide plan table** with a `message` column — the literal sentence the speaker will say. This
   message column is what prevents template-jamming; every slide must earn its place with a real message.
3. A **raw5 strategy** — the 5 image roles (see `references/03-raw5-image-director.md`).
Get the user's OK before Stage 2. Details: `references/02-deck-planner.md`, `references/01-router.md`.

### Stage 2 — Raw5 image prompts (HARD STOP)
You cannot generate images yourself, so emit **exactly 5 image-generation prompts** (one per role, using the
templates in `references/03-raw5-image-director.md`, toned for the chosen mode). Each prompt must forbid
readable text / logos / numbers and call for wide negative space + croppability.

Then **STOP** with this exact message and produce **no HTML/CSS/JS**:

```text
raw image 5장 프롬프트 생성 단계까지 완료했습니다.

이 5개 프롬프트로 이미지를 만들어 assets 폴더에 img1~img5.png로 저장해주세요.
수정할 프롬프트가 있으면 번호와 방향을 알려주세요.
5장이 준비되면 "HTML로 진행"이라고 답해주세요.

아직 HTML 덱은 만들지 않겠습니다.
```

Accept as approval: `HTML로 진행`, `진행`, `이걸로 가자`, `이미지 괜찮아`, `go`, `proceed`. Do **not** treat
"좋아 보여 / 괜찮은 듯 / 더 볼게" as approval — ask. If the user already has 5 images, skip to Stage 3
(Render-Only): confirm there are exactly 5, no text/logos, then build.

When the 5 files arrive, **read each image** (multimodal) and verify: no readable text/logo, distinct roles,
ample negative space, survives dark overlays. Re-request any that fail.

### Stage 3 — HTML build (only after explicit approval)
- **Start from `assets/example/democracy-deck.html`.** Its `<style>` (design tokens + every technique class
  + `.mcard`) and `<script>` (1920×1080 fit-scale + auto-hide nav + keyboard/swipe/edge-tap) are
  production-ready. Reuse them verbatim; replace the `<section class="slide">` blocks with your content.
- **Bind images** in `:root`: `--img1:url("assets/img1.png")` … `--img5:url("assets/img5.png")` (relative).
  Apply them with the `.img1`–`.img5` classes or inline `style="--card-img:var(--imgN)"`. Never leave an
  empty `url()` or `background-image:none`, and never use the `background:` shorthand on an image element
  (it wipes the image — use `background-color:` for solid fills).
- **Build large decks in batches.** Write the scaffold (`<style>` + runtime + the insert marker) once, then
  append ~6 slides per edit. A single 30-slide generation can truncate; batching keeps output reliable and
  keeps the CSS defined once so every slide stays consistent.
- **Compose each slide for its message and vary the technique** (cover, statement, blend split, toned
  divider, card grid, overlap, compare, SVG diagram, grid-6, definition row, big-question, material-image
  cards…). Repeating one layout across slides is the template-jamming failure mode — avoid it.

## Quality harness — these rules are why decks look professional

- **Fill the canvas (≥ 70%); no dead bands.** Do not push a card row to the bottom with `margin-top:auto`
  and leave an empty middle. Make card rows `flex:1` and let cards fill the height (icon/number at top,
  text at bottom, or content centered). This is the single most common thing reviewers catch.
- **Exactly one accent color.** And **no gradient-clipped text** — Korean glyphs break in `background-clip:text`
  gradients; use solid colors for headings.
- **Text on photos needs contrast.** White text + a scrim/`text-shadow`, or dark text on a light wash.
  Never gray body text directly on a photo.
- **`material-image-card` (image-window cards): the raw image must stay visible** — brightness ≈ 0.7 plus a
  bottom-weighted scrim for text, not a black box. **Avoid `backdrop-filter:blur()`** — it is beautiful in a
  live browser but hangs headless screenshot capture; a solid translucent background + scrim looks ~identical
  and stays tool-safe.
- **Forbidden:** left-bottom table-of-contents / slide-number lists / thumbnail rails; always-visible nav
  bars; fake "chart-looking" vectors (use real `<svg>` with `<polyline>`/`<rect>`/`<path>`); images that
  overpower the information. Nav auto-hides bottom-right; mobile swipe + edge-tap are included in the starter.
  Full list + feedback→CSS patch map: `references/08-harness-qa.md`.

## Verify before delivering (Claude-native QA)

Headless screenshots are flaky in some environments — do not depend on them. Serve the folder (e.g.
`python -m http.server`) and run **objective DOM checks** via the preview/eval tool. This snippet flags the
things that actually break a deck:

```js
(()=>{
  const slides=[...document.querySelectorAll('.slide')];
  const over=slides.map((s,i)=>{s.style.display='block';const box=s.querySelector('.slide-shell')||s.firstElementChild||s;
    const o=box.scrollHeight-1080;
    if(!s.classList.contains('active'))s.style.display='';return {n:(+s.dataset.slide||i+1),over:o};}).filter(x=>x.over>2);
  const r=getComputedStyle(document.documentElement);
  return {count:slides.length, seqOK:(slides.some(s=>s.dataset.slide)?slides.every((s,i)=>+s.dataset.slide===i+1):slides.length>0),
    overflow:over, allImgBound:[1,2,3,4,5].every(i=>r.getPropertyValue('--img'+i).includes('img'+i)),
    forbiddenTOC:!!document.querySelector('#toc,.toc,.slide-index,.thumb-strip,.slide-dots,.page-list'),
    navHidden:getComputedStyle(document.getElementById('controller')).opacity};
})()
```
Pass = right slide count, sequential (data-slide decks checked strictly; attribute-free modes like
University-AX / Street pass on DOM order), `overflow:[]` (nothing clipped past 1080), all images bound, no
forbidden TOC, `navHidden:"0"`. If screenshots do work, grab a few slides to eye-check density and contrast;
otherwise ask the user to review live (an expert eye on the running deck is the best signal).

## Design modes (pick one dominant tone; you may mix sparingly)

- **V7 Bright Report** — light bg, navy text, information-first. Default for lectures/reports/strategy.
- **V8 Dark Brutalist** — black bg, neon-green accent, big statements; repeat only 3–4 techniques.
- **University AX Grid** — bright 12-column info grid; KPI/roadmap/dashboard.
- **Street Editorial** — paper bg, coral accent, bold Pretendard, visible image-window cards.

Per-mode raw5 roles, recommended techniques, and do/don'ts: `references/07-design-playbooks.md`,
`references/03-raw5-image-director.md`, `references/01-router.md`.

## Reference map (load as needed)

| File | When to read |
|---|---|
| `references/01-router.md` | Routing a request, picking the mode, render-only vs full-deck |
| `references/02-deck-planner.md` | Narrative arc, the message table, the 5-question slide gate |
| `references/03-raw5-image-director.md` | Designing the 5 image roles + prompt templates per mode |
| `references/04-runtime-and-qa.md` | The canonical 1920×1080 runtime, scaling, nav, QA checklist |
| `references/05-css-techniques.md` | Full CSS class catalog for all four modes |
| `references/07-design-playbooks.md` | Per-mode do/don't and technique counts |
| `references/08-harness-qa.md` | Forbidden patterns + "user says X → patch CSS class Y" map |
| `references/09-master-prompts.md` | Copy-ready prompts (instructions, full-deck, render-only, per-mode) |

## Worked examples — open the one matching your chosen mode before building

**Built with this skill (study first for structure + harness rules in practice):**
- `assets/example/democracy-deck.html` — complete 30-slide **V7** deck ("민주주의는 다수결이 아니다"). Shows a
  centered full-bleed cover, toned section dividers, 3-/6-card grids that fill the canvas, a two-column
  compare with a "≠" badge, real SVG diagrams (Condorcet cycle, a Venn of two fairnesses, a gap diagram),
  `material-image-card` windows in parts 4–5, a filled checklist, and a bookended close. Uses external
  `assets/imgN.png` (the standard binding convention you'll copy).

**Canonical mode references (self-contained, data-URI images — open the one for your mode):**
- `assets/example/mode-references/hallym-v7-bright.html` — **V7** bright report, the gold standard (30 slides)
- `assets/example/mode-references/ai-planner-v8-dark.html` — **V8** dark brutalist keynote (30 slides)
- `assets/example/mode-references/university-ax-grid.html` — **University AX** info grid (40 slides)
- `assets/example/mode-references/seongsu-street-editorial.html` — **Street editorial** (20 slides)

Match the chosen reference's information density, technique variety, and chrome. Don't undershoot its
richness — those decks are the quality bar.
