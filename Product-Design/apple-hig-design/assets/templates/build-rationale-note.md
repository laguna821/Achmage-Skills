# Build rationale note

**Purpose:** The short note an agent attaches to anything it builds, so the owner sees what was made and why. Keep it to one screen of text.

## Built
- What: <app, page, slides, cards> · Medium: <medium and target platform> `rule-id`
- Goal in one sentence: <purpose> `design-principles/purpose/create-value`

## Assumptions
- <what was assumed> · Why: <missing input> · Confirm with: <owner or source>

## Decisions and why
| Decision | Why-chain: situation → principle → pattern → component | Rule IDs | Label |
|---|---|---|---|
| <what was chosen> | <need> → <principle> → <pattern> → <component (`references/components/alerts.md`)> | `rule-id` | [HIG] |
| <what was adapted> | <need> → <principle> → <pattern> → <component> | `rule-id` | [HIG transfer] |

## House-style choices
- [House] Font: <Pretendard Variable, where used>
- [House] Icons: <Lucide, per icons (`references/icons.md`)>
- [House] <other choice and reason>

## Craft pass
- Feeling: <one or two words> · Carried by: <type contrast, color, spacing, materials, motion>
- Decision varied: <the one that shapes the look most> · Variants: <A, B, C in a line each> · Chosen: <which> because <why>
- Finish list changes: <what was fixed>

## Checks run
- Preview: <URL from `scripts/preview.mjs`; appearances and widths viewed>
- Audit: <`scripts/audit-page.js` summary per appearance>
- Contrast spot checks: <text over images or gradients, with `scripts/contrast.mjs`>
- Rule IDs: <`scripts/find-rules.mjs --check` result>
- Accessibility: <items from `assets/templates/accessibility-and-trust-checklist.md`>

## Open [HIG none] questions
- <question the HIG cannot answer> · My default: <what was done> · Owner decides: <yes/no>

## Known gaps
- <what was not built or tested>
