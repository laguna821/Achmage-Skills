# HIG review report

**Purpose:** Stage 9 (Review). Findings against the HIG with evidence, severity and fixes. See workflow (`references/workflow.md#review`) and lenses (`references/lenses.md`).

## Scope
- Artifact: <name, medium, platform> · Reviewed: <date> · Deliverables checked: <brief, flow map, specs, ...>

## How it was tested
- Tested: <appearances, text sizes, widths, assistive technologies, keyboard>
- Measured: <screenshot pixels divided by the device scale; colors with `scripts/contrast.mjs`; pages with `scripts/audit-page.js`>
- Not tested: <what could not be checked, and why>

## Severity scale [House]
- **Blocker:** breaks an explicit HIG "don't", a minimum size or contrast, or blocks the task. Fix before release.
- **Major:** works against a principle or platform convention. Fix unless a written reason says otherwise.
- **Minor:** polish. Fix when time allows.
- **Estimates:** when a Blocker rests on an estimated measurement, file it as Major and write "Blocker if confirmed".

## Lens order [House]
Value, trust, inclusion, flow, attention, interaction, content, platform. Open each: value (`references/lenses.md#value`) · trust (`references/lenses.md#trust`) · inclusion (`references/lenses.md#inclusion`) · flow (`references/lenses.md#flow`) · attention (`references/lenses.md#attention`) · interaction (`references/lenses.md#interaction`) · content (`references/lenses.md#content`) · platform (`references/lenses.md#platform`)

## Summary
- Counts: Blocker <n> · Major <n> · Minor <n>
- Strongest points: <short list>

## Findings (sorted by severity, then by screen)
| # | Severity | Screen | Lens | What is wrong | Rule ID(s) | Fix |
|---|---|---|---|---|---|---|
| 1 | Blocker | <screen> | <lens> | <evidence seen> | `rule-id` | <change> |
| 2 | Major | <screen> | <lens> | <evidence> | `rule-id` | <change> |
| 3 | Minor | <screen> | <lens> | <evidence> | [HIG none] | <change> |

A finding without a rule ID is labeled [HIG none] and is an opinion, never a Blocker.

## Why-chains for the top findings (up to three)
| # | Situation | Principle | Pattern | Component | Rule IDs | Label |
|---|---|---|---|---|---|---|
| 1 | <what was seen> | <principle> | <pattern> | <component> | `rule-id` | [HIG] |
| 2 | | | | | | |
| 3 | | | | | | |

## Accepted exceptions
- <finding #>: <written reason it stays>

## Open [HIG none] questions
- <question for the owner>
