# Screen spec

**Purpose:** Stage 3 (Compose). One filled spec per screen, slide or card: what it is for, what is on it and in what order. See workflow (`references/workflow.md#compose`).

## Identity
- Name: <screen> · Medium: <medium> · Platform or size: <target>
- Job in one sentence: <what this screen is for> `design-principles/purpose/create-value`

## Content order (most important first)
| Order | Element | Component | Why here | Rule IDs | Label |
|---|---|---|---|---|---|
| 1 | <title or key item> | <card (`references/components/alerts.md`) or custom> | <importance, leading edge> | `layout/visual-hierarchy/order-content-by-relative-importance` | [HIG] |

## Layout
- Grouping: <what is clustered, how (space, container, divider)> `rule-id`
- Safe areas and margins: <how respected> `rule-id`
- Control spacing: <values from tokens (`references/tokens.md`) only> `accessibility/mobility/consider-spacing-between-controls-as-important`

## Controls and actions
| Control | Action | Prominence | Where | Rule IDs |
|---|---|---|---|---|
| <button> | <result> | <prominent / secondary> | <position> | `rule-id` |

## Data entry (if any)
- Choices offered instead of free text? <where> `rule-id`

## States
See the state and feedback table (`assets/templates/state-and-feedback-table.md`).

## Component decisions
Non-obvious picks go in a component decision record (`assets/templates/component-decision-record.md`).

## Why-chain (main layout choice)
- **Why-chain:** situation → principle → pattern → component → rule IDs → label
- <situation> → <principle> → <pattern> → <component> → `rule-id` → [HIG]

## Assumptions
- <what was assumed> · Why: <missing input> · Confirm with: <owner or source>

## Open [HIG none] questions
- <e.g. reading distance on slides>
