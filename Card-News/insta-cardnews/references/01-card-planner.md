# 01 — Card Planner

Stage 1 engine. Turn a topic into a **per-card plan** that a reader can swipe through and a builder can execute without guessing. No image prompts and no HTML here — only the plan.

## 1. Interview (extract these before planning)

| Field | Why it matters |
|---|---|
| **Topic** | The one subject of the carousel |
| **Audience** | Who's scrolling — sets vocabulary and tone |
| **Goal** | What the reader should think / feel / do after the last card |
| **Tone** | dramatic / calm / playful / authoritative |
| **Card count (≤ 20)** | cover + body + closing. Fewer strong cards beat many weak ones |
| **Preset (A/B/C)** | Recommend one; it locks the whole series' look |
| **Series name + @handle** | Footer of every card |
| **Source date** | For any data/claims |

If the user says "from scratch," you author the content — but still confirm audience, goal, preset, and count.

## 2. Brief (write this first, ~5 lines)

	- 핵심 메시지: the single takeaway the whole carousel exists to deliver
	- 누가 보나: the scroller, and what they already believe
	- 감정 아크: where the reader starts (card 1) and lands (last card)
	- 선정 프리셋: A / B / C + accent color, and why it fits the tone
	- 카드 수: N (and the rough split — 1 cover / N-2 body / 1 closing)

## 3. Per-card message table (the core deliverable)

One row per card. The `message` column is the literal sentence that card must land — **if you can't write a real message, the card shouldn't exist.**

| card# | role | message (한 문장) | image-brief | filter |
|---|---|---|---|---|
| 01 | cover / hook | 스크롤을 멈추게 하는 한 줄 | 표지 사진 방향 | tone / blend-if |
| 02 | point | 첫 번째 주장 | 장면 방향 | material / wash |
| 03 | point | 두 번째 주장 | … | wash |
| 04 | data | 숫자로 증명 | 배경 사진(차트는 HTML/SVG) | material (metric-window) |
| 05 | quote | 전환 인용구 | 분위기 사진 | luma-mask |
| … | point | … | … | blend |
| N | takeaway / CTA | 다음 행동 한 줄 + @handle | 마무리 사진 | tone / paper-grain |

- **image-brief** = one line describing the photo that card needs (this seeds the Stage-2 prompt).
- **filter** = which kept treatment this card uses. Vary it card-to-card for rhythm; never two on one card.

## 4. SCQA carousel arc (default shape)

	- Card 1 (Situation/Hook) — a stopping headline over the strongest photo. Big type, minimal words.
	- Cards 2..k (Complication → points) — one idea per card. Each advances the argument; no card repeats the previous one's shape of thought.
	- One data card (Evidence) — a real HTML/SVG chart over a photo window (see metric-window in `04-card-runtime-css.md`).
	- One quote/pivot card — a single line that turns the argument.
	- Last card (Answer/CTA) — the takeaway + what to do next + @handle.

## 5. Anti-jam card gate (ask before finalizing the table)

For **each** card, all five must be YES — else cut or merge it:

	1. Does this card have a message the reader couldn't guess from the previous card?
	2. Can the headline be said in ≤ 12 Korean words?
	3. Is there a photo brief that genuinely fits this message (not decoration)?
	4. Is the filter different from the two cards around it (rhythm), or intentionally the same (section)?
	5. If removed, would the carousel lose something real?

**≤ 20 cards, but shorter is stronger.** A tight 8–12 card set almost always beats a padded 20.

## 6. Hand-off to Stage 2

Once the user approves the table + preset, pass to `02-image-prompts.md`: the `image-brief` and `filter` of each row become that card's portrait image prompt. The card **count** sets the batching (≤ 10 per batch).
