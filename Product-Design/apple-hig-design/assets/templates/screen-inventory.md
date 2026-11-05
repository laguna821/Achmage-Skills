# Screen inventory

**Purpose:** The contract between stages when a whole product is built from scratch. Every later document refers to these IDs: decisions settle `D##`, screen specs describe `S##`, built pages carry `data-screen="S##"`, reviews cite both. See SKILL.md, "Whole product from scratch".

## Screens

### S01 <screen name>
- Purpose: <one line: what people come here to do> `rule-id`
- Content, most important first: <items>
- Main actions: <actions>
- Components expected: <card slugs, for example lists-and-tables, toolbars> (settled by `D##` where open)
- Reached from: <screens or entry points> · Leads to: <screens>
- Compact and regular differences: <tab bar or sidebar, pushed screen or split view>

### S02 <screen name>
- ...

## Cross-screen structure
- Navigation: <tab bar on compact, sidebar on regular; destinations> `rule-id`
- Shared elements: <toolbar actions, search, undo messages>

## Open component decisions

| ID | Question | Screens | Tree | Notes and rules already known |
|---|---|---|---|---|
| D01 | <how to confirm, pick, filter, show progress...> | S01, S03 | <decision tree name or none> | `rule-id` |

## Assumptions
- <what was assumed> · Why: <missing input> · Confirm with: <owner>

## Open [HIG none] questions
- <question the HIG cannot answer>
