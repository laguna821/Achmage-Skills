# Visual system note

**Purpose:** Stage 4 (Express). Fixes type, color, icons, imagery and brand for the deliverable so every screen stays consistent. See workflow (`references/workflow.md#express`), tokens (`references/tokens.md`), icons (`references/icons.md`).

## Type
- Font: <Apple platforms: system font [HIG] | other media: Pretendard Variable [House]>
- Scale and minimums: <values copied only from tokens (`references/tokens.md`)> `accessibility/vision/use-recommended-defaults-for-custom-type`
- Hierarchy method: <weight, size, color> `typography/conveying-hierarchy/adjust-font-weight-size-and-color`

## Color
| Role | Value / semantic name | Meaning (one only) | Light and dark checked | Rule IDs |
|---|---|---|---|---|
| Accent | <name> | <primary action or status> | <yes/no> | `branding/best-practices/apply-your-apps-accent-color-judiciously` |
- Color never works alone: <second cue used> `color/inclusive-color/avoid-relying-solely-on-color-to`
- Contrast checked against tokens (`references/tokens.md`): <result>

## Appearance
- Light and dark both reviewed: <result> `dark-mode/best-practices/ensure-that-your-app-looks-good`

## Icons
- Set: <SF Symbols on Apple platforms [HIG] | Lucide [House], spec in icons (`references/icons.md`)>
- Text labels for custom icons: <where> `icons/best-practices/provide-alternative-text-labels-for-custom`

## Imagery, motion, materials
- <Imagery rule, motion use, glass or material use> `rule-id`

## Brand
- Where the brand shows: <welcome screen, content> and where it stays quiet `branding/best-practices/avoid-using-a-launch-screen-as`

## Why-chain (key choice)
- **Why-chain:** situation → principle → pattern → component → rule IDs → label
- <situation> → <principle> → <pattern> → <component> → `rule-id` → [HIG transfer] / [House]

## Open [HIG none] questions
- <e.g. exact slide font sizes, which the HIG does not set>
