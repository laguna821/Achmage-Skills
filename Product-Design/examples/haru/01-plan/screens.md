# Screens contract: 하루 (Haru), web app

Contract for later stages. IDs are stable: do not renumber. Screen IDs S01 to S09, open component decisions D01 to D16. Nine screens fit the "6 to 9 screens, two weeks, one developer" guide. Sizes: compact below 744 px, regular from 744 px (house-style 11).

Component slugs refer to `references/components/<slug>.md`. "Expected" means a starting guess that the decision trees in the next stage may change; the decisions that are not settled are listed in D01 to D16.

## Screen inventory

### S01 오늘 (Today)
- Purpose: show what to do today and let people finish it in place.
- Main content, in priority order:
  1. Today's tasks that are not done (title, project name, assignee, due time if any)
  2. Overdue tasks, kept apart and plainly labeled (not alarming)
  3. Tasks done today, collapsed
  4. Empty state on first open: one sentence on what this screen is for, and the add input (this is the onboarding, no tour)
- Main actions: check a task done (and undo it); open a task (S04); add a task (S05); delete a task (with undo).
- Components expected: `lists-and-tables`, `toggles` (completion), `disclosure-controls` (done section), `buttons`, `toolbars`, `tab-bars` (compact), `sidebars` (regular), `split-views` (regular), `context-menus`, `scroll-views`.
- Open decisions: D02, D05, D07, D09, D16.

### S02 프로젝트 (Projects list)
- Purpose: see all projects and how far each one is, and open one.
- Main content, in priority order:
  1. Project rows: name, progress (done of total), number of open tasks
  2. Members shown on a project, if short
  3. Empty state: what a project is, and the create action
- Main actions: open a project (S03); create a project (S06).
- Components expected: `lists-and-tables` (or `collections`, D05), `progress-indicators` or `gauges` (D05), `buttons`, `toolbars`, `tab-bars`.
- Open decisions: D05, D14.

### S03 프로젝트 상세 (Project detail)
- Purpose: work through one project's tasks and see where the project stands.
- Main content, in priority order:
  1. Project title and progress
  2. Open tasks, in the order the person set
  3. Done tasks, collapsed
  4. Members on the project
- Main actions: add a task to this project (S05); check a task done; open a task (S04); filter by view (all, open, done) or by person (D04); reorder tasks (D11); edit the project (S06); delete the project (with undo).
- Components expected: `lists-and-tables`, `toggles`, `segmented-controls` or `pop-up-buttons` (filter, D04), `progress-indicators` or `gauges` (D05), `toolbars`, `pull-down-buttons`, `context-menus`, `disclosure-controls`.
- Open decisions: D02, D04, D05, D07, D09, D11, D14.

### S04 할 일 상세 (Task detail)
- Purpose: read and edit one task completely.
- Main content, in priority order:
  1. Title (editable) with the done control
  2. Due date
  3. Project
  4. Assignee
  5. Note
- Main actions: edit any field (saves as the person goes); mark done; set or clear the due date; change project or assignee; delete (undo).
- Components expected: `text-fields`, `text-views` (note), `pickers` (date, D03), `pop-up-buttons` or `menus` (project and assignee, D08), `toggles`, `buttons`, `toolbars`, `sheets` (compact, D07), `split-views` (regular pane, D07).
- Open decisions: D02, D03, D07, D08, D09.

### S05 빠른 추가 (Quick add)
- Purpose: write a new task in one step.
- Main content, in priority order:
  1. Title field, focused on open
  2. Project (defaults to the current project, or "none" from 오늘)
  3. Due date (defaults to today when opened from 오늘)
  4. Assignee (defaults to "me")
- Main actions: save (Done / Return), cancel (Escape / Cancel), save and add another [assumption].
- Components expected: `sheets` (or `popovers` on regular, D06), `text-fields`, `pickers` (D03), `pop-up-buttons`, `buttons`, `virtual-keyboards`.
- Open decisions: D03, D06, D08.

### S06 프로젝트 만들기·편집 (Create or edit project)
- Purpose: make or change a project.
- Main content, in priority order:
  1. Name
  2. Members on the project (from the workspace list)
  3. Color or icon to tell projects apart (if kept, never color alone) [assumption, D10]
- Main actions: save; cancel; delete project (edit mode only, with undo).
- Components expected: `sheets`, `text-fields`, `buttons`, `toggles` or `menus` (members, D08), `color-wells` (D10, only if a color is offered).
- Open decisions: D02, D08, D10.

### S07 검색 (Search)
- Purpose: find any task or project by words.
- Main content, in priority order:
  1. Search field, focused on open, with the scope shown
  2. Results: tasks first, then projects
  3. Recent searches (stay local; offer to clear)
  4. Empty and no-results states with a next step
- Main actions: type to search; narrow the scope; open a result (S04 or S03); clear recent searches.
- Components expected: `search-fields`, `lists-and-tables`, `segmented-controls` (scope, D13), `scroll-views`.
- Open decisions: D04, D07, D13.

### S08 휴지통 (Trash)
- Purpose: bring back deleted tasks and projects, or remove them for good.
- Main content, in priority order:
  1. Deleted items, newest first, with what they were and when deleted
  2. Restore on each item
  3. Empty-trash action (kept apart from Restore, not the primary action)
  4. Empty state
- Main actions: restore an item; delete one item forever; empty the trash.
- Components expected: `lists-and-tables`, `buttons`, `context-menus`, `alerts` or `action-sheets` (D01), `toolbars`.
- Open decisions: D01.

### S09 설정·구성원 (Settings and members)
- Purpose: manage the workspace people, keep a backup, and reach the trash.
- Main content, in priority order:
  1. Workspace members (add, rename, remove)
  2. Backup: export and import data, with a plain note that data lives in this browser only
  3. Link to 휴지통 (S08)
  4. Delete all data in this browser (kept at the end)
- Main actions: add or rename a member; export; import; open the trash; delete all data.
- Components expected: `lists-and-tables`, `text-fields`, `buttons`, `alerts` (D01, D15), `toggles` (only if a real setting exists), `toolbars`, `tab-bars` (compact), `sidebars` (regular).
- Open decisions: D01, D08, D12, D15.
- Few settings, with good defaults: no appearance toggle, no language picker in the first release `settings/best-practices/minimize-the-number-of-settings-you` `settings/best-practices/aim-to-provide-default-settings-that` [HIG].

### Cross-screen structure (not screens)
- Navigation container: tab bar (compact), sidebar plus split view (regular); see flow-map.md. Components: `tab-bars`, `sidebars`, `split-views`, `toolbars`.
- Empty states, undo messages and storage errors appear inside the screens above and are settled in D02, D15.

## Open component decisions

Each one is settled in the next stage with the matching tree from `references/decision-trees/` and written as a component-decision-record. "Expected tree" is the tree I would start from.

| ID | Decision to settle | Screens | Expected tree | Notes for the next stage |
|---|---|---|---|---|
| D01 | How to confirm irreversible steps: empty the trash, delete one item forever, delete all data in this browser, replace data by import. Alert, action sheet, or typed confirmation; which button is default and destructive | S08, S09 | alerting-and-confirming | The tree names the Empty Trash styling conflict (alert on Mac vs action sheet on iPhone, "not reconciled"); web follows one component at both widths or switches by size class. Say which and why. |
| D02 | How to delete and recover without asking: task, project. Undo message form, where it appears, how long it stays, plus restore from S08 | S01, S03, S04, S06 | alerting-and-confirming | Undo, not an alert, for common undoable deletes `alerts/best-practices/avoid-displaying-alerts-for-common-undoable`. Deleting a project with many tasks: is it still "common and undoable"? |
| D03 | How to pick a due date (and time, if any) in the task and in quick add: date picker, quick choices (오늘 / tomorrow / next week) plus picker, or typed text | S04, S05 | choosing-values (also text-input) | The tree points dates to pickers; check compact vs regular, and whether quick choices come first `entering-data/best-practices/when-possible-offer-choices-instead-of`. |
| D04 | How to filter and view tasks: all / open / done, and by person; where the control lives and how the choice is kept | S03, S07 (and S01 if used) | choosing-values (filter is a task option) | Segmented control vs pop-up button vs menu; keep the filter in the screen, not in settings `settings/task-specific-options/when-possible-prefer-letting-people-modify`. Not by color alone. |
| D05 | How to show project progress (done of total): number only, progress bar, gauge, or both | S02, S03 | progress-and-status | Progress here is a ratio of tasks, not a wait. Check whether a progress indicator, a gauge or plain text is allowed; do not imitate Activity rings for non-fitness data. Needs a text equivalent. |
| D06 | The container for quick add: sheet, popover, or inline row; whether it differs by size class | S05 | alerting-and-confirming | Popovers are not for compact views `popovers/platform-considerations/ios-ipados/avoid-displaying-popovers-in-compact-views`. Also settle how to reach it (toolbar button, floating control, keyboard). |
| D07 | How a task detail opens: pushed screen, sheet, or side pane; per size class | S01, S03, S04, S07 | navigation-structure, alerting-and-confirming | Compact has no HIG replacement for split view (D14). |
| D08 | How to choose project, assignee and members: pop-up button, menu, picker, or list with checkmarks | S04, S05, S06, S09 | choosing-values | Few options in a small team; single assignee vs members of a project (multi). |
| D09 | The completion control: circle button, checkbox or switch; its states, feedback after completing, and how a done task leaves the list | S01, S03, S04 | choosing-values | The tree says switches are for list rows on iOS and checkboxes for macOS; a "complete" control is not covered exactly [HIG none]. State and feedback table needed. |
| D10 | How to tell projects apart: name only, color, icon, or color plus icon | S02, S03, S06 | (no tree; components `color-wells`, icons) | Color never alone `color/inclusive-color/avoid-relying-solely-on-color-to`; one color, one meaning `color/best-practices/avoid-using-the-same-color-to`. Consider cutting color entirely. |
| D11 | How to reorder tasks in a project, with a non-drag route | S03 | showing-collections (step 7) | Drag needs an alternative `drag-and-drop/best-practices/offer-alternative-ways-to-accomplish-drag`; decide if reorder is worth keeping in the first release. |
| D12 | How members are added, renamed and removed (inline row, sheet, or edit mode), and what happens to a removed member's tasks | S09 | showing-collections, text-input | Local names only in the first release. |
| D13 | Search scope: all, tasks only, projects only; how the scope is shown and changed | S07 | navigation-structure (step 7), showing-collections (step 6) | `searching/best-practices/clearly-display-the-current-scope-of`. |
| D14 | How project detail and task detail work at compact width without a split view | S02, S03, S04 | navigation-structure | HIG none; propose and label [HIG transfer] or [House]. |
| D15 | How to report storage problems (full, blocked, cleared) and failed imports: inline message, banner, or alert | S09, all screens | alerting-and-confirming, progress-and-status (step 7) | Alert only for critical and actionable `feedback/best-practices/use-alerts-to-deliver-critical-and`. |
| D16 | How the 오늘 list groups tasks (overdue / today / done today) and how overdue is shown without alarm | S01 | showing-collections | Grouping by sections vs one list with a label; calm, non-color-only cue. |

Counts: 9 screens, 16 decisions.

## Rule-ID check
Run `node scripts/find-rules.mjs --check` on this folder's .md files; result is in the stage report.
