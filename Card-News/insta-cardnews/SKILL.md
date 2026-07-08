---
name: insta-cardnews
description: Build Instagram-feed photo card-news (카드뉴스) — 1080×1440 px, 3:4 portrait, up to 20 cards, ONE purpose-built image per card with a single legibility filter, exported as carousel-ready PNGs. Use when the user wants an Instagram/SNS card-news series where every card is a full-bleed photo with Korean text on top (not a chart set, not a 16:9 deck).
license: Achmage OS internal (Achmage Custom)
aliases:
  - insta-cardnews
  - cardnews-photo
  - 인스타-카드뉴스
tags:
  - skill
  - skill/insta-cardnews
  - skill-category/visual-content-presentation
  - DIKM-M
---

# insta-cardnews — Instagram 3:4 photo card-news

Make an Instagram-feed **card-news series**: **1080×1440 px, 3:4 portrait, up to 20 cards** (cover included). Every card is **one dedicated, full-bleed photo** with a **single legibility filter** and **Korean text laid on top as real HTML/SVG**. Output = an editable HTML proof **plus** carousel-ready per-card PNGs.

## The one principle (inherited, then inverted)

> **이미지는 재료이고, HTML은 진실이다 — images are material; HTML is truth.**
> Photos supply mood, texture, and background. Every word, number, and chart is real HTML/SVG — never baked into the image. This keeps cards editable, sharp at any zoom, and legible.

**The inversion from `raw5-deck`:** raw5-deck reuses **5 images across 30 landscape slides** by cutting each into circles/arches/frames. This skill does the opposite — **one purpose-built image per card**. Because each image already fills its own card, the entire "cut an image into shapes" half of the design library is dropped. All that remains is the **legibility-treatment family**: lay a photo full-bleed, put **one** filter over it, and set Korean text so it reads. That makes the pattern much simpler than a deck.

## What each card is (3 layers, always)

	[ bg image ]        one photo, background-size:cover, filling 1080×1440
	[ filter/scrim ]    ONE treatment from the kept family (wash / tone / blend / material / luma / halftone / paper-grain)
	[ content ]         Korean headline + short body + footer — real HTML/SVG, padded, inside the safe zone

## The 3 presets (pick ONE per series — this is what makes the carousel look like a set)

- **A · Dark Wash** — full-bleed photo + dark scrim (`material-image-card` / dark tone / paper-grain), white text, one coral/red accent, dark LUT grade. Dramatic, impactful. **Default.**
- **B · Brand Tone** — full-bleed photo + brand-color `multiply` overlay (tone-scene / neon), white text, brand accent, LUT toward the brand hue. Cohesive branded series.
- **C · Light Editorial** — photo washed / luma-masked into a light text zone, navy/ink text on light, coral accent, light LUT. Report/editorial feel.

One preset governs the whole series. A single LUT grade (`references/03-filter-presets.md`) is applied to every image so 20 *different* photos read as one set. See `references/03-filter-presets.md` and `references/04-card-runtime-css.md`.

## The 3-stage workflow (HARD STOP between Stage 2 and Stage 3 — non-negotiable)

### Stage 1 — Card Plan
Interview the user for: topic, audience, goal, tone, **card count (≤ 20)**, **preset (A / B / C — recommend one)**, series name + @handle, source date. If they say "from scratch," you author the content. Then produce:

1. A **brief** — core message, who's scrolling, the emotional arc across the carousel.
2. A **per-card message table** with columns `card# / role / message / image-brief / filter`. The `message` column is the literal one sentence that card must land — this is what prevents template-jamming; **every card earns its place with a real message.** Roles follow SCQA: card 1 = cover/hook → middle = one point/data/quote each → last card = takeaway/CTA.
3. The **preset choice** and its accent color.

Get the user's OK before Stage 2. Details: `references/01-card-planner.md`.

### Stage 2 — Card image prompts (HARD STOP)
You cannot generate images yourself. Emit **exactly one portrait image prompt per card** (using the templates in `references/02-image-prompts.md`, toned for the chosen preset), **grouped into batches of ≤ 10** (GPT image 2 generates up to 10 at once). Each prompt must forbid readable text / logos / numbers and must reserve **clear negative space in the top or bottom third** for the headline.

Then **STOP** with this exact message and produce **no HTML/CSS/JS**:

```text
카드별 이미지 프롬프트 생성 단계까지 완료했습니다.

아래 프롬프트로 이미지를 만들어 주세요. (GPT image 2는 한 번에 10장까지 생성 가능 — 배치로 나눴습니다.)
  · 배치 1: 카드 01–10
  · 배치 2: 카드 11–20   (카드가 10장 이하면 배치 1만)
생성한 이미지를 assets/cards/ 폴더에 card01.png ~ cardNN.png 로 저장해 주세요.
수정할 프롬프트가 있으면 번호와 방향을 알려주세요.
전부 준비되면 "HTML로 진행"이라고 답해 주세요.

아직 HTML 카드뉴스는 만들지 않겠습니다.
```

Accept as approval: `HTML로 진행`, `진행`, `이걸로 가자`, `이미지 괜찮아`, `go`, `proceed`. Do **not** treat "좋아 보여 / 괜찮은 듯 / 더 볼게" as approval — ask. If the user already has the images, skip to Stage 3.

When the files arrive, **read each image (multimodal)** and verify: no readable text/logo, focal subject not jammed edge-to-edge, negative space in the headline zone, survives the preset's scrim. Re-request any that fail. QA table: `references/02-image-prompts.md`.

### Stage 3 — Build + Export (only after explicit approval)
- Build `cardnews-proof.html` — a vertical stack of `.card` blocks (one per image), using the chosen preset's tokens + the tool-safe filter classes in `references/04-card-runtime-css.md`. **Every word/number/chart is real HTML/SVG.**
- Bind each card's photo: `<section class="card" style="--card-img:url('cards/card01.png')">` (relative). Never an `<img>` tag; never baked-in text.
- Run **DOM-eval QA** (not screenshots — they time out on image-heavy pages): correct card count, every card has a bound `--card-img`, text-vs-scrim contrast, ≥ 70 % fill, safe-zone respected, no forbidden patterns.
- **Export**: run `export-cards.ps1` → each card rendered to a **1080×1440 PNG** via headless Chrome (`references/05-export-and-qa.md`). Then read 2–3 PNGs back to confirm the headline is legible over the photo.
- Deliver: `cardnews-proof.html` + `assets/export/*.png` (carousel-ready, upload in order). Input photos stay in `assets/cards/`; exported cards go to `assets/export/` (no name collision).

## Two ways to deliver (same build)

1. **Instagram carousel** — the per-card PNGs in `assets/export/` (upload in order).
2. **Mobile HTML link** — `cardnews-proof.html` is a **responsive viewer**: each 3:4 card scales to the phone's width and the page scrolls one card at a time. Host the folder (GitHub Pages / any static host) and share the link; upload `cards/` alongside it. Self-contained except the Pretendard CDN font.

Both come from the **same file** — the responsive wrapper (`.frame` + fit script + `<meta viewport>`) is stripped during PNG export, so exports stay exactly 1080×1440. Details: `references/04-card-runtime-css.md` → "Responsive viewer".

## Invariants (every card, every preset)

- **Text on photo is white or ink — never gray.** If a headline doesn't pop, the scrim is too weak (or the photo too busy in that zone).
- **One accent color** per series. No gradient-clipped text.
- **Content fills ≥ 70 %** of the card; no dead bands.
- **Safe zone 상하 ~135 px** kept clear so Instagram's grid-thumbnail crop doesn't clip the headline or footer.
- **No `backdrop-filter`** — it hangs headless screenshot capture. Use plain rgba scrims + `filter:` on the image layer only.
- **One filter per card.** Stacking treatments muddies legibility. Vary the filter across cards for rhythm, but never combine two on one card.

## References

| File | Covers |
|---|---|
| `references/01-card-planner.md` | Interview, brief, per-card message table, SCQA roles, anti-jam card gate |
| `references/02-image-prompts.md` | Portrait prompt templates (per preset), 10+10 batching, image QA table |
| `references/03-filter-presets.md` | The 3 presets — `:root` tokens, accent, LUT grade, which filters each uses |
| `references/04-card-runtime-css.md` | 1080×1440 card skeleton + the kept filter classes (tool-safe, no backdrop-filter) |
| `references/05-export-and-qa.md` | headless-Chrome per-card PNG export + DOM-eval QA + PNG legibility read-back |
| `references/06-master-prompts.md` | Copy-ready prompt blocks (full run / render-only / patch) |

Worked example: `assets/example/cardnews-proof.html` (an 8-card Dark-Wash series) + `assets/example/cards/`.
