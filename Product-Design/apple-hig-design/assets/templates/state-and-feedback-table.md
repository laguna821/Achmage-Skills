# State and feedback table

**Purpose:** Stage 5 (Interact). Lists every state of each control or flow step and how each is shown, with undo paths. See workflow (`references/workflow.md#interact`).

## Controls
| Control | State | Visual | Text | Sound / haptic | Motion | Rule IDs | Label |
|---|---|---|---|---|---|---|---|
| <button> | default | <look> | <label> | none | none | `rule-id` | [HIG] |
| <button> | pressed | <look> | - | <cue or none> | <brief or none> | `buttons/best-practices/always-include-a-press-state-for` | [HIG] |
| <button> | disabled | <look> | <why, if shown> | - | - | `rule-id` | [HIG] |
| <button> | loading | <placeholder or progress> | - | - | - | `rule-id` | [HIG] |
| <button> | error | <look + non-color cue> | <what happened, next step> | - | - | `rule-id` | [HIG] |
| <button> | success | <look> | <confirmation> | - | - | `rule-id` | [HIG] |

## Feedback channels
- Each important message uses more than one channel (color, text, sound, haptic)? <yes/no> `feedback/best-practices/make-sure-all-feedback-is-accessible`
- Motion is optional and never the only carrier `motion/best-practices/make-motion-optional`

## Undo and confirmation
| Action | Undo offered? | Confirmation needed? (why) | Tree used | Rule IDs |
|---|---|---|---|---|
| <action> | <how> | <no / yes, because...> | alerting and confirming (`references/decision-trees/alerting-and-confirming.md`) | `design-principles/agency/help-people-recover-from-mistakes` |

## Saving and progress
- Work saved automatically? <how shown> `rule-id`
- Progress shown where? <next to the thing it describes> `feedback/best-practices/consider-integrating-status-feedback-into-your`

## Why-chain (one state decision)
- **Why-chain:** situation → principle → pattern → component → rule IDs → label
- <situation> → <principle> → <pattern> → <component> → `rule-id` → [HIG]

## Open [HIG none] questions
- <e.g. durations or timings the HIG does not give>
