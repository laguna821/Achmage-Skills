# Platform and media difference table

**Purpose:** Stage 8 (Adapt). Records what changes between platforms, sizes, text scales and media, and what carries over. See workflow (`references/workflow.md#adapt`) and the media guides: native (`references/media/native.md`), mobile (`references/media/mobile.md`), web (`references/media/web.md`), slides (`references/media/slides.md`), cards (`references/media/cards.md`).

## Scope
- Targets: <platforms and media in scope> · Each given equal care? `design-principles/flexibility/approach-every-platform-with-intention`

## Differences
| Area | Base design | Variant (platform, size, medium) | What changes | Label | Rule IDs |
|---|---|---|---|---|---|
| Navigation | <tabs> | <desktop web> | <side navigation> | [HIG transfer] | `rule-id` |
| Text size | <default> | <largest text> | <reflow, stack> | [HIG] | `layout/adaptability/be-prepared-for-text-size-changes` |
| Input | <touch> | <pointer, keyboard> | <added support> | [HIG] | `rule-id` |
| Unsupported feature | <feature> | <device lacking it> | <hidden, not an error> | [HIG] | `augmented-reality/offer-ar-features-only-on-capable` |

## What stays the same
- <positions, groupings, labels kept predictable> `design-principles/flexibility/preserve-a-persons-context`

## Carried-over rules
| Rule | Label | How it is applied |
|---|---|---|
| `rule-id` | [HIG] / [HIG transfer] / [HIG none] | <say how, if transfer> |

## House choices in this table
- <Pretendard Variable, Lucide, or other [House] decision, and where it is used>

## Why-chain (one adaptation)
- **Why-chain:** situation → principle → pattern → component → rule IDs → label
- <situation> → <principle> → <pattern> → <component> → `rule-id` → [HIG transfer]

## Assumptions
- <what was assumed> · Why: <missing input> · Confirm with: <owner or source>

## Open [HIG none] questions
- <e.g. breakpoints, slide sizes, card dimensions>
