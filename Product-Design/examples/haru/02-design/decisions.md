# Decisions: 하루 (Haru), web app. D01 to D16

**Stage:** 2 Decide (`references/workflow.md`, "Whole product from scratch"). Contract: `tests/e2e/01-plan/screens.md`. Owner answers applied: (1) team = local member names, no real sharing; (2) no notifications; (3) 해요체.
Size classes [House, house-style 11]: **compact** below 744 px, **regular** from 744 px. Labels: [HIG], [HIG transfer], [HIG none], [House].
Common basis for all records: the product is a web app, so every HIG component is a [HIG transfer] unless the card says otherwise. Standard look is kept in every record unless a "Customization" line says otherwise `branding/best-practices/express-your-brand-with-familiar-components`. No visual values here (next stage).

## Summary table

| ID | Decision (one line) | Compact | Regular |
|---|---|---|---|
| D01 | Irreversible steps (empty trash, delete one forever, delete all data, import over data) get a confirmation with destructive style and no default button | Action sheet | Alert |
| D02 | Delete task/project without asking; an in-context undo message that stays until dismissed; restore from S08 | Message above tab bar | Message at top of list pane |
| D03 | Due date: one pop-up button with quick choices (오늘, 내일, 다음 주, 없음) and "날짜 고르기" opening a date picker; date only, no time | Compact date picker in context | Graphical date picker in popover |
| D04 | No all/open/done filter (the done section already does it); filter by person with a pop-up button in S03 only | same | same |
| D05 | Project progress: gauge plus always-visible text "N개 중 M개 완료" | Slim gauge in rows | Same |
| D06 | Quick add: bottom sheet on compact, popover on regular; reached by a prominent toolbar button | Sheet | Popover |
| D07 | Task detail: pushed screen on compact, detail pane on regular; no sheet | Pushed screen | Detail pane |
| D08 | Project and assignee: pop-up buttons; project members: list with checkmarks | same | same |
| D09 | Completion: circular toggle-like button (checkbox semantics), row stays in place and settles into the done section on leaving | same | same |
| D10 | Projects are told apart by name only; no color, no icon | same | same |
| D11 | No manual reorder in the first release; open tasks sort by due date | same | same |
| D12 | Members: rows in S09, inline add field, tap name to rename, remove with undo | same | same |
| D13 | Search scope is fixed to all tasks and projects, stated in the placeholder; no scope control | same | same |
| D14 | Compact detail views are pushed full-width screens with standard Back; tab bar stays | Pushed | n/a (split view) |
| D15 | Storage and import problems: persistent inline banner or message next to the control, never an alert | Banner under toolbar | Banner under toolbar |
| D16 | 오늘 groups: 오늘 first, 지난 할 일 second (labeled, count plain, date text on rows), 오늘 끝낸 일 collapsed | same | same |

---

## D01 Confirming irreversible steps

> **Amendment (owner, 2026-11-04, after stage 2):** on regular widths, Empty Trash and delete-one-forever use a normal-style alert in which Return confirms, following the HIG's own Empty Trash example (`alerts/buttons/use-the-destructive-style-to-identify`). On compact the action sheet keeps the destructive style. Delete-all and import-replace keep the destructive style with no default button.
- **Decision:** Four steps need a confirmation: empty the trash, delete one item forever, delete all data in this browser, import a file over existing data. All four use destructive-styled action button, a Cancel that is not the default, and no default button. Compact: action sheet (Cancel at the bottom, destructive choice on top). Regular: alert.
- **Tree / branch:** `alerting-and-confirming` step 1 (needs a decision) → 2 (data loss, rare, irreversible) → 3 (the person started it deliberately and chooses how it ends) → action sheet; the tree's Empty Trash styling note decides the regular case.
- **Options**

| Option | Fits because | Costs the user | Rule IDs |
|---|---|---|---|
| Action sheet (compact) / alert (regular), destructive style, no default | Deliberate action, rare, irreversible; sheet on touch, alert on desktop per the Empty Trash example | One extra tap or click, only on rare steps | `action-sheets/best-practices/use-an-action-sheet-not-an` `alerts/best-practices/use-alerts-sparingly` `alerts/buttons/if-theres-a-destructive-action-include` |
| Alert at both widths | One component | HIG says action sheet for deliberate actions on iOS | `alerts/platform-considerations/ios-ipados/use-an-action-sheet-not-an` |
| Typed confirmation ("삭제" typed) | Stops accidents for delete-all | Slow, HIG silent | [HIG none] |
| No confirmation, undo only | Fastest | These steps cannot be undone | `alerts/best-practices/avoid-displaying-alerts-for-common-undoable` |

- **Styling conflict, settled:** The alerts page skips destructive styling for a deliberately chosen action like Empty Trash `alerts/buttons/use-the-destructive-style-to-identify`; the action sheets page asks for it `action-sheets/best-practices/make-destructive-choices-visually-prominent`. The tree says the pages are not reconciled. [House] Decision: destructive style on all four steps at both widths, and no default button so people read the text `alerts/buttons/if-theres-a-destructive-action-include`. Reason: one consistent rule for four steps, and delete-all and import-replace are not as routine as Empty Trash. This departs from the Mac Empty Trash example (Return would confirm); disclosed.
- **Import** has a third choice: the dialog offers 바꾸기 (replace, destructive), 합치기 (merge) and 취소. Titles are verbs `alerts/buttons/create-succinct-logical-button-titles` `action-sheets/best-practices/if-necessary-provide-a-cancel-button`.
- **Rules of use:** title says what is lost and how much ("휴지통의 항목 12개를 영구히 지울까요?"), message only if it adds value `alerts/content/include-informative-text-only-if-it`; delete-all text points to export first. Escape or outside tap closes `alerts/buttons/provide-alternative-ways-to-cancel-an`. Never stacked `sheets/best-practices/display-only-one-sheet-at-a`.

| Situation | Principle | Pattern | Component | Rule IDs | Label |
|---|---|---|---|---|---|
| Rare irreversible data loss the person started | Agency, Responsibility | Confirm, name the loss, safe exit | Action sheet (compact), alert (regular) | `design-principles/agency/help-people-recover-from-mistakes` `feedback/best-practices/warn-people-when-they-initiate-a` | [HIG transfer] |
| Styling pages disagree | Familiarity | One rule across four steps | Destructive style, no default | `alerts/buttons/use-the-destructive-style-to-identify` `action-sheets/best-practices/make-destructive-choices-visually-prominent` | [House] |

- **Other media:** slides and cards [HIG none].
- **Revisit if:** the owner prefers the Mac Empty Trash behavior (normal style, Return confirms); backend arrives (account deletion rules, `managing-accounts/deleting-accounts/provide-a-clear-way-to-initiate`); data-loss reports suggest typed confirmation [HIG none].
- **Assumptions:** merge keeps the newer copy of a task with the same id · Why: merge rule is not in the HIG [HIG none] · Confirm with: product owner.

## D02 Delete and recover without asking
- **Decision:** Deleting a task, a project (with its tasks), or a member does not ask. The item leaves at once and an **undo message** names the result ("할 일 '…'을 지웠어요", with 실행 취소). The message **has no timer**: it stays until dismissed, replaced by the next one, or the person navigates to another section. Restore from S08 is the backstop. Keyboard undo (Ctrl or Cmd+Z) undoes deletes in reverse order, several times, on regular.
  - Compact: message sits above the tab bar. Regular: message sits at the top of the list pane under the toolbar (the bottom edge stays free).
- **Tree / branch:** `alerting-and-confirming` step 1 → 2: "common and can be undone → no confirmation; support undo".
- **Options**

| Option | Fits because | Costs | Rule IDs |
|---|---|---|---|
| Undo message, no timer, plus trash | Common, undoable; message shows the result; trash backs it up | One persistent line on screen | `alerts/best-practices/avoid-displaying-alerts-for-common-undoable` `undo-and-redo/best-practices/show-the-results-of-an-undo` `accessibility/cognitive/minimize-use-of-time-boxed-interface` |
| Timed toast (few seconds) | Common web pattern | Can be missed; HIG says no time-boxed UI | `accessibility/cognitive/minimize-use-of-time-boxed-interface` |
| Confirm alert | Familiar | Interrupts a frequent action | `alerts/best-practices/avoid-displaying-alerts-for-common-undoable` |
| Trash only, no message | Simplest | Undo is far away | `undo-and-redo/best-practices/let-people-undo-multiple-times` |

- **Project with many tasks:** still undoable (whole project and its tasks return together from S08), so still no alert. The message says how many tasks went with it `undo-and-redo/best-practices/help-people-predict-the-results-of`.
- **Completion is not deleted:** completing a task gets no message (D09).

| Situation | Principle | Pattern | Component | Rule IDs | Label |
|---|---|---|---|---|---|
| Frequent, reversible delete | Agency, Simplicity | Undo instead of asking | In-context message with an Undo button | `design-principles/agency/help-people-recover-from-mistakes` `undo-and-redo/best-practices/let-people-undo-multiple-times` | [HIG] for the rule, [HIG none] for the message component (no HIG toast) |
| Message must not vanish | Responsibility | No timer, trash backstop | Persistent message | `accessibility/cognitive/minimize-use-of-time-boxed-interface` | [HIG] |

- **Customization:** custom component (the HIG has no toast); built from a button and text, announced to assistive technology.
- **Revisit if:** testing shows persistent messages pile up (then limit to the latest and rely on S08); the owner wants a timer (conflicts with the HIG rule).
- **Assumption:** undo stack lives for the browser session only · Why: simple local storage · Confirm with: front-end developer.

## D03 Picking a due date
- **Decision:** One **pop-up button** labeled with the current value ("오늘", "11월 6일 (금)", "마감일 없음") whose menu lists 오늘, 내일, 다음 주 (Monday), 마감일 없음 and **날짜 고르기…**. The last item opens a **date picker** in context: compact date picker on compact; graphical date picker in a popover on regular. **Date only; no time of day** in the first release. S05 default: 오늘 when opened from 오늘, else 없음.
- **Tree / branch:** `choosing-values` step 2 (task option, in the screen) → 3 (one of several named options) → 5: space tight, flat set, show the current one → pop-up button; "a date or time → a picker". Also `text-input` step 2: choices instead of free typing.
- **Options**

| Option | Fits because | Costs | Rule IDs |
|---|---|---|---|
| Pop-up button of quick choices + picker | Most tasks are today, tomorrow or next week: one tap; picker for the rest | Two steps for rare dates | `pop-up-buttons/best-practices/provide-a-useful-default-selection` `pickers/platform-considerations/ios-ipados/use-a-compact-date-picker-when` `entering-data/best-practices/when-possible-offer-choices-instead-of` |
| Picker only | Direct | Calendar for every task | `pickers/best-practices/avoid-switching-views-to-show-a` |
| Typed date | Keyboard users | Format errors, free text | `entering-data/best-practices/when-possible-offer-choices-instead-of` |

- Inside the quick-add popover (S05, regular) the graphical picker opens inline in that popover, never as a second popover `popovers/best-practices/show-one-popover-at-a-time`.
- Picker is shown near the field, not in a new view `pickers/best-practices/avoid-switching-views-to-show-a`. Regular style: textual is for precise entry, graphical for browsing; we need browsing `pickers/platform-considerations/macos/choose-a-date-picker-style-that`.

| Situation | Principle | Pattern | Component | Rule IDs | Label |
|---|---|---|---|---|---|
| Fast capture, mostly near dates | Simplicity | Offer choices, defaults | Pop-up button + date picker | `entering-data/best-practices/be-clear-about-the-data-you` `pop-up-buttons/best-practices/give-people-a-way-to-predict` | [HIG transfer] |

- **Contract change:** S01 contract said "due time if any". Time is cut: each field adds weight to every task `design-principles/simplicity/include-just-whats-necessary`.
- **Revisit if:** people ask for a time of day; then add a time picker with quarter-hour steps `pickers/best-practices/consider-providing-less-granularity-when-specifying`.

## D04 Filtering tasks
- **Decision:** The all/open/done segmented control from the contract is **removed**: S03 already shows open tasks and a collapsed done section (D16 pattern), so a done view exists. The only filter is **by person**: a pop-up button in S03 ("담당자: 모두", 나, each member). S01 and S07 have no filter. The choice is kept per project and restored on relaunch.
- **Tree / branch:** `choosing-values` step 2 (task option → in the screen, not in settings) → 5: flat set, space tight, current choice visible → pop-up button. For all/open/done: no component needed.
- **Options**

| Option | Fits because | Costs | Rule IDs |
|---|---|---|---|
| Pop-up button for person | 2 to 7 names; shows current; compact fits | One tap to change | `pop-up-buttons/best-practices/consider-using-a-pop-up-button` `settings/task-specific-options/when-possible-prefer-letting-people-modify` |
| Segmented control (all/open/done) | Selection always visible | A third way to see done tasks; takes a row | `segmented-controls/best-practices/consider-a-segmented-control-when-its` `design-principles/simplicity/include-just-whats-necessary` |
| Segmented control for people | All names visible | Count varies, overflows past about five | `segmented-controls/best-practices/limit-the-number-of-segments-in` |

- Not by color alone: a filtered list says so in text ("담당자: 나") next to the control `color/inclusive-color/avoid-relying-solely-on-color-to`.

| Situation | Principle | Pattern | Component | Rule IDs | Label |
|---|---|---|---|---|---|
| Team of 2 to 6 looks at one project | Simplicity | Task option in the screen | Pop-up button | `pop-up-buttons/best-practices/use-a-pop-up-button-to` | [HIG transfer] |

- **Revisit if:** people ask for a "done only" or "overdue only" view; then a segmented control of nouns fits `segmented-controls/content/use-nouns-or-noun-phrases-for`.

## D05 Showing project progress
- **Decision:** A **gauge** (slim linear bar) plus a text equivalent that is always visible: "8개 중 3개 완료". S02 rows: gauge under the name; S03: gauge in the header. Zero tasks: no gauge, text "할 일이 아직 없어요". All done: text "모두 끝냈어요", no celebration.
- **Tree / branch:** `progress-and-status` step 1 (nothing is running, so no progress indicator) → 4: "a level within a range" → gauge with short labels. Step 5: not Activity rings.
- **Options**

| Option | Fits because | Costs | Rule IDs |
|---|---|---|---|
| Gauge + text | Reads a level in 0 to total; compare rows at a glance | Small space per row | `gauges/best-practices/write-succinct-labels-that-describe-the` `feedback/best-practices/consider-integrating-status-feedback-into-your` |
| Number only | Smallest | Hard to compare projects | `design-principles/simplicity/include-just-whats-necessary` |
| Progress indicator | Looks like a bar | Means a running wait, not a ratio | `progress-indicators/best-practices/when-possible-use-a-determinate-progress` |
| Rings | Familiar shape | Reserved for activity data | `activity-rings/best-practices/use-activity-rings-only-to-show` |

- Gauge fill is a length, never color alone; text always accompanies it `color/inclusive-color/avoid-relying-solely-on-color-to`.

| Situation | Principle | Pattern | Component | Rule IDs | Label |
|---|---|---|---|---|---|
| "How far is this project?" | Purpose | Status beside the item | Gauge + text | `feedback/best-practices/consider-integrating-status-feedback-into-your` | [HIG transfer] (gauge on the web); the boundary gauge vs progress bar is [HIG none] |

- **Revisit if:** rows get crowded at large text (drop the gauge on compact, keep text) `layout/adaptability/be-prepared-for-text-size-changes`.

## D06 Container for quick add
- **Decision:** Compact: **sheet** from the bottom (Done and Cancel, title field focused, keyboard open). Regular: **popover** aimed at the "새 할 일" toolbar button. Reach: a prominent "새 할 일" button in the toolbar of S01, S02, S03, S07; plus a keyboard shortcut on regular. S08 and S09 have none.
- **Tree / branch:** `alerting-and-confirming` step 6 (few related details tied to one control): regular → popover; compact → full-screen modal such as a sheet; step 7 for the sheet (short, scoped, Done plus Cancel); step 8 (closing could lose text).
- **Options**

| Option | Fits because | Costs | Rule IDs |
|---|---|---|---|
| Sheet (compact) / popover (regular) | One focused field set; popover keeps the list visible | Two containers to build | `popovers/platform-considerations/ios-ipados/avoid-displaying-popovers-in-compact-views` `popovers/best-practices/use-a-popover-to-expose-a` `sheets/best-practices/provide-an-alternative-to-the-done` |
| Inline row at the list top | No modal | Takes a row on every list; 4 fields do not fit | `layout/visual-hierarchy/use-progressive-disclosure-to-make-layouts` |
| Popover on compact | One component | HIG: sheet in compact | `popovers/platform-considerations/ios-ipados/avoid-displaying-popovers-in-compact-views` |

- Behavior: one modal at a time `sheets/best-practices/display-only-one-sheet-at-a` `popovers/best-practices/show-one-popover-at-a-time`; an obvious way out, Escape, outside click `modality/best-practices/always-give-people-an-obvious-way`; typed text kept as a draft if closed by accident `popovers/best-practices/always-save-work-when-automatically-closing` `modality/best-practices/when-necessary-help-people-avoid-data`; swipe-down on a sheet with text asks via action sheet `sheets/platform-considerations/ios-ipados/support-swiping-to-dismiss-a-sheet`.
- One primary action at the trailing side `toolbars/actions/use-the-prominent-style-for-key`; the toolbar button is that one on S01, S03, S07; on S02 "새 프로젝트" is a plain toolbar button next to it.
- Reach vs the brief: "one step from every screen" is met for the four list screens; S08 and S09 lack it by choice `design-principles/purpose/keep-focused`.

| Situation | Principle | Pattern | Component | Rule IDs | Label |
|---|---|---|---|---|---|
| Capture mid-task, short | Agency | Short scoped modal | Sheet / popover | `modality/best-practices/present-content-modally-only-when-theres` | [HIG transfer] |

- **Revisit if:** title-only capture is most of use (then an inline field might beat the modal); popover thresholds (HIG gives no width) need tuning [HIG none].

## D07 Opening a task
- **Decision:** Compact: **pushed full-width screen** (S04) with standard Back. Regular: **detail pane** in a split view, selection highlighted in the list. Never a sheet.
- **Tree / branch:** `navigation-structure` step 3 (list then detail): regular → split view; compact → no split, HIG names no replacement (see D14).
- **Options**

| Option | Fits because | Costs | Rule IDs |
|---|---|---|---|
| Pushed screen / detail pane | Edits save as you go; hierarchy with Back | Leaves the list on compact | `split-views/best-practices/to-support-navigation-persistently-highlight-the` `toolbars/navigation/use-the-standard-back-and-close` |
| Sheet | Focus | Needs Done/Cancel, contradicts autosave | `sheets/best-practices/provide-an-alternative-to-the-done` `file-management/saving-work/help-people-be-confident-that-their` |
| Popover | Stays on list | Too small for 5 fields on compact | `popovers/platform-considerations/ios-ipados/avoid-displaying-popovers-in-compact-views` |

- Resizing across 744 px keeps the open task `design-principles/flexibility/preserve-a-persons-context`.
- Regular panes: sidebar, list, detail. When room is short, the sidebar hides first `sidebars/platform-considerations/macos/consider-automatically-hiding-and-revealing-a`; the width where this happens is set in the visual stage [HIG none].

| Situation | Principle | Pattern | Component | Rule IDs | Label |
|---|---|---|---|---|---|
| Read and edit one task | Flexibility | Drill-down / split view | Pushed screen, detail pane | `layout/adaptability/size-classes/keep-functionality-the-same-as-size` | [HIG transfer] |

- **Revisit if:** three panes feel cramped at 744 to ~1000 px (then list and detail only).

## D08 Choosing project, assignee, members
- **Decision:** Project and assignee in S04 and S05: **pop-up buttons** (current value shown; "프로젝트 없음", "담당자 없음" are items). Assignee defaults to 나. Assignee choices are the members of the task's project, or all members when there is no project. Project members in S06: a **list with checkmarks** (multi-select, all members visible). Member add/rename/remove is D12.
- **Tree / branch:** `choosing-values` step 5 (one of several named options, tight space → pop-up button); for multi-select the pop-up is wrong (it avoids multi-select), so `showing-collections` step 5: "rows are only choices from a set → brief highlight plus a checkmark".
- **Options**

| Option | Fits because | Costs | Rule IDs |
|---|---|---|---|
| Pop-up button (single) | Flat set, current shown | Long menu if 10+ projects | `pop-up-buttons/best-practices/use-a-pop-up-button-to` `menus/organization/be-mindful-of-menu-length` |
| List with checkmarks (multi) | 2 to 6 members, selection visible | Takes rows | `lists-and-tables/best-practices/provide-appropriate-feedback-when-people-select` |
| Switch per member | On/off | Switch means a setting in a row; checkmark states membership | `toggles/platform-considerations/ios-ipados/use-the-switch-toggle-style-only` |
| Picker wheel | Ordered list | Not ordered, in a new view | `pickers/best-practices/avoid-switching-views-to-show-a` |

| Situation | Principle | Pattern | Component | Rule IDs | Label |
|---|---|---|---|---|---|
| Few options, set often | Simplicity | Choices over typing | Pop-up button; checkmark list | `entering-data/best-practices/when-possible-offer-choices-instead-of` | [HIG transfer] |

- **Revisit if:** project membership turns out not to matter (cut it from S06 and S03; assignee then comes from all members). Candidate to cut `design-principles/simplicity/include-just-whats-necessary`. 10+ projects: switch the project choice to a searchable list [HIG none].

## D09 The completion control
- **Decision:** A **circular toggle-like button** at the leading edge of each task row and in S04, built with checkbox semantics (checked state exposed to assistive technology). Off: empty circle. On: filled circle with a check mark, row text struck through and in secondary text. After a tap the row **stays in place** (no shifting under the finger); it settles into 오늘 끝낸 일 / the done section when the person leaves the screen or reloads. Tapping again reverses it. No undo message. Same at both classes; hit area from tokens (44 px touch, 28 px pointer).
- **Tree / branch:** `choosing-values` step 4 (plain yes or no for content): iOS list row = switch; outside a list = toggle-like button; macOS = checkbox. A "complete" control is not covered exactly [HIG none]. Chosen: toggle-like button, one look at both classes for consistency.
- **Options**

| Option | Fits because | Costs | Rule IDs |
|---|---|---|---|
| Circular toggle-like button | Highlighted-when-active pattern, leading position, big target | Custom look needs care | `toggles/platform-considerations/ios-ipados/outside-of-a-list-use-a` `toggles/best-practices/make-sure-the-visual-differences-in` |
| Switch | Standard in list rows | A switch means a setting, and has no room at a row's leading edge | `toggles/platform-considerations/ios-ipados/use-the-switch-toggle-style-only` |
| Checkbox (square) | Mac convention | Different look from compact | `toggles/platform-considerations/macos/switches/in-general-dont-replace-a-checkbox` |
| Row swipe to complete | Fast on touch | Hidden gesture, no pointer route | `pointing-devices/platform-considerations/macos/touch-support-for-hidden-controls/make-essential-hidden-controls-available-in` |

- Feedback through more than color: shape change, strike-through, count in the section header `feedback/best-practices/make-sure-all-feedback-is-accessible` `color/inclusive-color/avoid-relying-solely-on-color-to`. Any movement is optional `motion/best-practices/make-motion-optional`. Keyboard: Space toggles `accessibility/speech/let-people-use-the-keyboard-alone`. States go in the state table (next stage).
- **Deviation from flow-map:** flow-map said "undo message" after completing. Removed: completing is frequent and reversible in place, so a message is noise `design-principles/simplicity/include-just-whats-necessary`.

| Situation | Principle | Pattern | Component | Rule IDs | Label |
|---|---|---|---|---|---|
| The most frequent action in the app | Simplicity, Familiarity | In-place toggle | Toggle-like button | `toggles/best-practices/use-a-toggle-to-help-people` | [HIG transfer]; exact "complete" control [HIG none] |

- **Revisit if:** people lose track of "where did it go" (then move at once with motion); the owner wants a square checkbox on regular.

## D10 Telling projects apart
- **Decision:** **Name only.** No color, no icon in the first release. S06 loses its third item.
- **Tree / branch:** None fits (`color-wells` and icons have no tree). Rules used directly.
- **Options**

| Option | Fits because | Costs | Rule IDs |
|---|---|---|---|
| Name only | Rows already show the name; nothing to misread | Similar names look alike | `design-principles/simplicity/include-just-whats-necessary` |
| Color | Quick scan | Color needs a second cue and one meaning per color | `color/inclusive-color/avoid-relying-solely-on-color-to` `color/best-practices/avoid-using-the-same-color-to` |
| Icon | Shape cue | Choice UI, more states, accessibility labels | `icons/best-practices/provide-alternative-text-labels-for-custom` |

- Accent color stays for primary actions and status `branding/best-practices/apply-your-apps-accent-color-judiciously`.

| Situation | Principle | Pattern | Component | Rule IDs | Label |
|---|---|---|---|---|---|
| A handful of projects | Simplicity | Text identity | Name | `design-principles/purpose/keep-focused` | [HIG] |

- **Revisit if:** testing shows people confuse projects; then add icon + name, never color alone.

## D11 Reordering tasks
- **Decision:** **Cut from the first release.** Open tasks sort by due date (earliest first, no date last), then by when they were added. S03 contract text "in the order the person set" is changed accordingly.
- **Tree / branch:** `showing-collections` step 7 (will people drag?): not in this release; the branch needs a non-drag route, which would be extra work for a feature outside the top 7.
- **Options**

| Option | Fits because | Costs | Rule IDs |
|---|---|---|---|
| Sort by due date | Order has meaning, nothing to learn | No manual order | `layout/visual-hierarchy/order-content-by-relative-importance` |
| Drag + menu route | Manual control | Drag image, target cues, alternative route, animation, keyboard | `drag-and-drop/best-practices/offer-alternative-ways-to-accomplish-drag` `collections/best-practices/consider-using-animations-to-provide-feedback` |

| Situation | Principle | Pattern | Component | Rule IDs | Label |
|---|---|---|---|---|---|
| Small lists, due dates exist | Purpose | Meaningful default order | Sorted list | `design-principles/purpose/keep-focused` | [HIG] |

- **Revisit if:** people want manual priority; then menu commands "위로/아래로 옮기기" first, drag second.

## D12 Members
- **Decision:** In S09, a **list** of member rows. First row is 나 (the person using this browser; can be renamed, cannot be removed). Add: a text field row at the list end with a 추가 button, Return adds. Rename: activate the name to edit it in place, Return or leaving the field saves. Remove: a remove button on each row (not on 나); removal is **undoable** (D02), tasks of that member become "담당자 없음". Validation as typed: not empty, no duplicate names.
- **Tree / branch:** `showing-collections` step 1 (text, scan) → list; step 5 editing `lists-and-tables/best-practices/let-people-edit-a-table-when`; `text-input` step 4 (short value) → text field.
- **Options**

| Option | Fits because | Costs | Rule IDs |
|---|---|---|---|
| Inline rows + add row | No extra screen; 2 to 6 names | Row UI custom | `text-fields/best-practices/use-a-text-field-to-request` `entering-data/best-practices/dynamically-validate-field-values` |
| Sheet per member | Focus | A modal for one word | `modality/best-practices/present-content-modally-only-when-theres` |
| Edit mode with Done | Prevents accidental renames | A mode, more taps | `design-principles/agency/stay-out-of-the-way` |

- Remove has no alert because it is undoable `alerts/best-practices/avoid-displaying-alerts-for-common-undoable`.

| Situation | Principle | Pattern | Component | Rule IDs | Label |
|---|---|---|---|---|---|
| Local list of names | Simplicity | Edit in place | List + text field | `entering-data/best-practices/be-clear-about-the-data-you` | [HIG transfer] |

- **Assumption:** the first member 나 is created automatically · Why: assignee default needs someone · Confirm with: product owner. **Revisit if:** real sharing arrives (members become accounts).

## D13 Search scope
- **Decision:** Scope is fixed: **all tasks and projects** (trash excluded), stated in the field placeholder "할 일과 프로젝트 검색". Results are sectioned 할 일 then 프로젝트. **No scope control.** Recent searches stay local, with 지우기.
- **Tree / branch:** `text-input` step 3 (find something that exists) → search field with a placeholder hint; "results need narrowing → scope bar" not met: local data is small and results are already sectioned. `navigation-structure` step 7.
- **Options**

| Option | Fits because | Costs | Rule IDs |
|---|---|---|---|
| Fixed scope in placeholder | Scope is visible, nothing to operate | Cannot narrow | `searching/best-practices/clearly-display-the-current-scope-of` `search-fields/best-practices/use-placeholder-text-to-help-people` |
| Scope bar (전체/할 일/프로젝트) | Narrowing | Redundant with sections | `search-fields/scope-bars-and-tokens/use-a-scope-bar-to-filter` |

| Situation | Principle | Pattern | Component | Rule IDs | Label |
|---|---|---|---|---|---|
| Find, not browse | Agency | One place for all content | Search field | `searching/best-practices/aim-to-make-your-apps-content` | [HIG transfer] |

- **Revisit if:** result lists exceed one screen often; then add the scope bar.

## D14 Compact detail without split view
- **Decision:** On compact, project detail (S03) and task detail (S04) are **pushed full-width screens** inside the tab they started from; the tab bar stays visible; Back is the standard Back at the toolbar's leading edge with the title of the parent; returning keeps the list position and highlight.
- **Tree / branch:** `navigation-structure` step 3: "compact → do not split; the HIG names no replacement" [HIG none]. Rules used directly.
- **Options**

| Option | Fits because | Costs | Rule IDs |
|---|---|---|---|
| Pushed screen + Back | Hierarchy, familiar, edits autosave | Leaves the list | `toolbars/navigation/use-the-standard-back-and-close` `tab-bars/best-practices/make-sure-the-tab-bar-is` |
| Sheet over the list | Keeps list behind | Modal for a destination; Done/Cancel vs autosave | `modality/best-practices/present-content-modally-only-when-theres` |
| Expand in place | No navigation | Five fields in a row | `layout/visual-hierarchy/use-progressive-disclosure-to-make-layouts` |

| Situation | Principle | Pattern | Component | Rule IDs | Label |
|---|---|---|---|---|---|
| Phone, drill into a project or task | Familiarity | Push navigation | Pushed screen | `layout/adaptability/size-classes/keep-functionality-the-same-as-size` | [HIG transfer]; the choice itself [HIG none] |

- **Revisit if:** the HIG-based review finds a better compact pattern; owner prefers sheets.

## D15 Reporting storage and import problems
- **Decision:** A **persistent inline banner** directly under the toolbar on every screen while the problem lasts: what happened, what is still safe, one action. Cases: storage full, storage blocked (private mode), data cleared/missing at launch. **Import failure**: message next to the import control in S09, with the reason and fix, existing data untouched. **No alert** for any of these. The banner shows the same words at both classes.
- **Tree / branch:** `alerting-and-confirming` step 1 ("told, no decision needed → show in context"); `progress-and-status` step 7 (status beside the thing it describes; alert only if critical and actionable). A banner component is [HIG none].
- **Options**

| Option | Fits because | Costs | Rule IDs |
|---|---|---|---|
| Inline banner + local message | Visible without blocking; works at launch | Can be ignored | `alerts/best-practices/avoid-using-an-alert-merely-to` `alerts/best-practices/avoid-showing-an-alert-when-your` `writing/best-practices/write-clear-error-messages` |
| Alert at each failure | Impossible to miss | Interrupts, repeats, blocks work | `feedback/best-practices/use-alerts-to-deliver-critical-and` `alerts/best-practices/use-alerts-sparingly` |
| Silent failure | None | Loss of work | `design-principles/responsibility/keep-peoples-information-safe` |

- The banner's action is "내보내기" when possible, so the person can keep a copy `design-principles/responsibility/be-fully-transparent-about-what-your`. Work continues in memory.

| Situation | Principle | Pattern | Component | Rule IDs | Label |
|---|---|---|---|---|---|
| Data may not be saved | Responsibility | Honest in-context message | Banner | `feedback/best-practices/show-people-when-a-command-cant` | [HIG transfer]; component [HIG none] |

- **Revisit if:** failures to save prove common and silent (then one alert on first detection per session).
- **Open question (developer):** same site open in two tabs [HIG none].

## D16 Grouping 오늘
- **Decision:** One scrolling list with sections: **오늘** (due today, not done) first; **지난 할 일** (overdue, with a plain count) second; **오늘 끝낸 일** (done today) last, collapsed behind a disclosure control with a label and count. Overdue rows show their due date as text ("11월 2일"), nothing red or alarming; the section title carries the meaning. Tasks with no due date do not appear here.
- **Tree / branch:** `showing-collections` step 1 (text, scan) → list; step 6 not needed. Disclosure from `layout/visual-hierarchy/use-progressive-disclosure-to-make-layouts`.
- **Options**

| Option | Fits because | Costs | Rule IDs |
|---|---|---|---|
| Sections in one list | Order = importance, calm | Overdue sits below today's | `layout/visual-hierarchy/order-content-by-relative-importance` `layout/visual-hierarchy/group-related-items-to-clearly-express` |
| Overdue first | Urgency | Puts missed work above the day's plan, adds pressure | `design-principles/purpose/keep-focused` |
| One flat list with labels | Fewer headers | Weak grouping | `layout/visual-hierarchy/group-related-items-to-clearly-express` |

- Done section: `disclosure-controls/best-practices/use-a-disclosure-control-to-hide`, `disclosure-controls/disclosure-triangles/provide-a-descriptive-label-when-using`. Expansion is remembered `launching/best-practices/restore-the-previous-state-when-your`.
- Cue not by color alone `color/inclusive-color/avoid-relying-solely-on-color-to`.

| Situation | Principle | Pattern | Component | Rule IDs | Label |
|---|---|---|---|---|---|
| Open the app each morning | Purpose, Simplicity | Hierarchy by sections | List + disclosure control | `design-principles/simplicity/establish-hierarchy` | [HIG transfer] |

- **Revisit if:** many overdue items bury today (then show an overdue summary row that opens them).
