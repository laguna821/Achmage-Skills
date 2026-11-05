# Flow map

**Purpose:** Stage 2 (Structure). Shows how people move through the product: entry, exits, back behavior and interruptions. See workflow (`references/workflow.md#structure`) and navigation structure (`references/decision-trees/navigation-structure.md`).

## Top-level container
- Choice: <tabs | sidebar | split view | single screen>
- **Why-chain:** situation → principle → pattern → component → rule IDs → label
- Row: <situation> → <principle> → <pattern> → <component> → `rule-id` → [HIG]

## Entry points
| Entry | Lands on | First useful content | Rule IDs |
|---|---|---|---|
| <launch, link, notification> | <screen> | <what shows at once> | `rule-id` |

## Screens and moves
| From | Action | To | Peer or drill-down | Modal? (why) | Back or exit |
|---|---|---|---|---|---|
| <screen> | <tap, click, swipe> | <screen> | <peer/drill> | <no / yes, because...> | <where it goes> |

## Sign-in and permissions
- Sign-in appears at: <step>; value shown before it? `managing-accounts/best-practices/delay-sign-in-for-as-long`
- Permission asks: <step, reason shown>

## Relaunch and switching away
- Restored state: <what returns> `rule-id`

## Interruptions and errors
- <call, offline, failure>: <where the person lands, how they resume>

## Undo and exits
- Every step can be backed out of? <yes/no, how> `design-principles/agency/help-people-recover-from-mistakes`

## Diagram
<Text or ASCII map of the screens above.>

## Assumptions
- <what was assumed> · Why: <missing input> · Confirm with: <owner or source>

## Open [HIG none] questions
- <e.g. step counts or timing the HIG does not set>
