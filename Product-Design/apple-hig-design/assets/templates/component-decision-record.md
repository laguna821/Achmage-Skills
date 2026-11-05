# Component decision record

**Purpose:** Records why one component or pattern was picked over others, so a reviewer can trace it. Used for each non-obvious choice in Compose. See the decision trees (`references/decision-trees.md`).

## Decision
- ID / screen: <DR-1 / screen name>
- Need: <what the person must do or see>
- Chosen: <component or pattern, link its card, e.g. Alerts (`references/components/alerts.md`)>

## Tree used
<Decision tree and branch followed, e.g. alerting and confirming (`references/decision-trees/alerting-and-confirming.md`).>
If no tree fits, write "None fits" and cite the rules used directly.

## Options compared
| Option | Fits because | Costs the user | Rule IDs |
|---|---|---|---|
| <chosen> | <reason> | <attention, steps, space> | `rule-id` |
| <rejected> | <reason not chosen> | <cost> | `rule-id` |

## Why-chain
| Situation | Principle | Pattern | Component | Rule IDs | Label |
|---|---|---|---|---|---|
| <what is happening> | <Purpose, Agency, Responsibility, Familiarity, Flexibility, Simplicity, Craft, Delight> | <pattern> | <component> | `rule-id` | [HIG] / [HIG transfer] / [HIG none] / [House] |

## Customization
- Standard look kept? <yes/no>. If changed: what and why `branding/best-practices/express-your-brand-with-familiar-components`

## Other media
- <Medium>: [HIG transfer] <what is translated> or [HIG none]

## Revisit if
- <condition that would change the choice>

## Assumptions
- <what was assumed> · Why: <missing input> · Confirm with: <owner or source>
