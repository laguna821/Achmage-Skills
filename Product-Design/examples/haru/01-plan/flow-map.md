# Flow map: 하루 (Haru), web app

**Stage:** 2 Structure (`references/workflow.md#structure`). Screen IDs refer to screens.md.

## Top-level container
Settled with `references/decision-trees/navigation-structure.md`.

- **Compact (below 744 px): tab bar** with 4 tabs: 오늘 (S01), 프로젝트 (S02), 검색 (S07), 설정 (S09). Each tab is a peer section; drill-downs happen inside a tab.
- **Regular (744 px and wider): sidebar plus split view.** Sidebar (leading side, hideable) lists 오늘, 검색, then 프로젝트 with its projects as the second level, and 휴지통 and 설정 at the end. Content to the right: a list pane, plus a detail pane for the selected task where room allows.
- Same sections and same functions at both classes; only the container changes `layout/adaptability/size-classes/keep-functionality-the-same-as-size` [HIG transfer]

**Tree walk:**
1. Jump between main sections often? Yes, a handful (4 to 5) → tab bar `tab-bars/best-practices/use-a-tab-bar-to-support`. With many sections or nested collections (projects) and a wide window → sidebar, two levels at most `sidebars/best-practices/in-general-show-no-more-than`.
2. Room and rich structure? Regular width yes (projects are a collection) → sidebar, hideable `sidebars/best-practices/consider-letting-people-hide-the-sidebar`. Compact: start with a tab bar, and keep the less-used content (trash, settings) out of the main tabs where possible.
3. List then detail side by side? Regular → split view, with the selection highlighted `split-views/best-practices/to-support-navigation-persistently-highlight-the`. Compact → no split view; the HIG names no replacement `split-views/platform-considerations/ios/prefer-using-a-split-view-in` [HIG none]. Drill into a full-width detail with a Back button is the working assumption (D14).
4. Act on the current view, Back, title? → toolbar with a short title, Back and Close `toolbars/navigation/use-the-standard-back-and-close` `toolbars/titles/provide-a-useful-title-for-each`.
5. Switch related views of one list (all / open / done)? → segmented control inside the screen, not a tab `segmented-controls/platform-considerations/ios-ipados/consider-a-segmented-control-to-switch` (confirmed in D04).
7. Find rather than browse? → search gets its own prominent place: a tab (compact) and a sidebar entry (regular) `searching/best-practices/if-search-is-important-give-it`.

**Why-chain rows:**
| Situation | Principle | Pattern | Component | Rule IDs | Label |
|---|---|---|---|---|---|
| Phone, thumb reach, 4 peer sections | Familiarity | Top-level bottom bar | Tab bar | `tab-bars/best-practices/use-a-tab-bar-to-support` `tab-bars/best-practices/make-sure-the-tab-bar-is` | [HIG transfer] (mobile web) |
| Desk, many projects, long session | Flexibility | Left navigation, two levels | Sidebar + split view | `sidebars/best-practices/in-general-show-no-more-than` `split-views/best-practices/to-support-navigation-persistently-highlight-the` | [HIG transfer] |
| Tab with nothing in it | Simplicity | Keep the tab, explain the empty state | Tab bar + empty state | `tab-bars/best-practices/dont-disable-or-hide-tab-bar` | [HIG] |
| Controls placement on desktop | Familiarity | Vital actions not at the bottom edge | Toolbar at top | `layout/platform-considerations/macos/avoid-placing-controls-or-critical-information` | [HIG transfer] |

Note: a bottom tab bar sits at the bottom edge on compact widths, which is the phone pattern; on regular widths the bottom edge stays free `layout/platform-considerations/macos/avoid-placing-controls-or-critical-information`.

## Entry points
| Entry | Lands on | First useful content | Rule IDs |
|---|---|---|---|
| Open the site (first time, no data) | S01 오늘, empty state | An input to add the first task and one sentence on what the screen is for; no tour, no sign-in | `onboarding/best-practices/teach-through-interactivity` `managing-accounts/best-practices/delay-sign-in-for-as-long` `branding/best-practices/avoid-using-a-launch-screen-as` |
| Open the site (returning) | The section and position last used, default S01 | Last list with tasks already shown, no loading screen | `launching/best-practices/restore-the-previous-state-when-your` `launching/best-practices/launch-instantly` `loading/best-practices/show-something-as-soon-as-possible` |
| Open a URL for a project or task | S03 or S04 | That project or task [HIG none: URL scheme, routing, deep links] | |
| Keyboard shortcut or "add" control anywhere | S05 빠른 추가 | Focused title field | `design-principles/agency/stay-out-of-the-way` |

## Screens and moves
| From | Action | To | Peer or drill-down | Modal? (why) | Back or exit |
|---|---|---|---|---|---|
| Tab/sidebar | Choose 오늘 / 프로젝트 / 검색 / 설정 | S01 / S02 / S07 / S09 | Peer | No | Choose another section; position in each is kept `design-principles/flexibility/preserve-a-persons-context` |
| S01, S02, S03 | "새 할 일" | S05 빠른 추가 | Modal | Yes: short single task, needs focus; compact = bottom sheet, regular = sheet or popover (D06) `modality/best-practices/present-content-modally-only-when-theres` | Done saves; Cancel or Escape closes; typed text kept if closed by accident `modality/best-practices/when-necessary-help-people-avoid-data` |
| S01, S03, S07 | Open a task | S04 할 일 상세 | Drill-down (compact: pushed screen; regular: detail pane) | No (D07) | Back (compact) / select another or close pane (regular) `toolbars/navigation/use-the-standard-back-and-close` |
| S01, S03, S07 | Check the circle | Same row, task done | In place | No | Undo message `undo-and-redo/best-practices/show-the-results-of-an-undo` |
| S02 | Choose a project | S03 프로젝트 상세 | Drill-down (regular: sidebar item, list pane) | No | Back to S02 (compact) |
| S02 | "새 프로젝트" | S06 프로젝트 만들기 | Modal sheet: short, scoped | Yes, focused task | Cancel / Done |
| S03 | "편집" | S06 (edit mode) | Modal sheet | Yes | Cancel / Done |
| S03, S04 | Delete task | Row removed, S08 gets it | Same screen | No confirmation; undo | Undo message; restore from S08 `alerts/best-practices/avoid-displaying-alerts-for-common-undoable` |
| S03 / S06 | Delete project | S08 gets the project and its tasks | Back to S02 | No alert if undoable; see D02 | Undo; restore from S08 |
| S09 | "휴지통" | S08 | Drill-down (regular: sidebar item) | No | Back |
| S08 | Restore | Item returns to its place | Same screen | No | Undo not needed (restore is the undo) |
| S08 | Empty trash / delete forever | Confirmation per D01 | Modal | Yes: irreversible `feedback/best-practices/warn-people-when-they-initiate-a` | Cancel |
| S09 | Export / Import | Browser download / file chooser | Browser-owned | Browser-owned | Cancel in chooser |
| S09 | Add or rename a member | Inline in S09 (D12) | Same screen | No | Done |

## Sign-in and permissions
- Sign-in appears at: **never in the first release**. Value is shown at once (S01 works on first open). Accounts arrive with the backend, and sign-in should then be requested only when sharing or sync needs it `managing-accounts/best-practices/delay-sign-in-for-as-long` [HIG]
- Account deletion: not applicable without accounts; "delete all my data in this browser" lives in S09 and needs its own confirmation (D01). When accounts arrive, deletion must be easy on the web too `managing-accounts/deleting-accounts/provide-a-clear-way-to-initiate`
- Permission asks: none in the first release (no notifications, location, camera). If reminders return later, ask in context with the reason `privacy/requesting-permission/request-permission-only-when-your-app` `privacy/requesting-permission/avoid-requesting-permission-at-launch-unless`

## Relaunch and switching away
- Restored state: last section (tab or sidebar item), last opened project, filter in the list, scroll position where possible, and any unsaved text in S05 or S04 `launching/best-practices/restore-the-previous-state-when-your` `file-management/saving-work/help-people-be-confident-that-their`
- Edits to tasks save as the person goes, with no Save button; sheets that collect a new item (S05, S06) save on Done `file-management/saving-work/help-people-be-confident-that-their`
- Resizing across 744 px keeps the open item selected and moves it between the pushed screen and the detail pane `design-principles/flexibility/preserve-a-persons-context`

## Interruptions and errors
- Browser storage full, blocked (private mode) or cleared: tell the person plainly in context, what happened and what to do (export, free space, allow storage); keep working on the data in memory if possible. Wording follows `writing/best-practices/write-clear-error-messages`. Alert vs inline message: D15.
- Tab closed or reload mid-edit: restored from saved state; unsaved text in a sheet is kept as a draft [assumption].
- Same site open in two tabs: changes made in one should show in the other, or the person is told to reload [HIG none]. Question for the developer.
- Import of a bad file: error next to the import control with the reason and the fix, existing data untouched `writing/best-practices/write-clear-error-messages` `design-principles/agency/help-people-recover-from-mistakes`
- Import over existing data: the person chooses whether to replace or merge; the choice is explained before anything changes (D01 covers confirmation style).
- Slow or large lists: show something at once `loading/best-practices/show-something-as-soon-as-possible`.
- Empty states (no tasks today, no projects, empty trash, no search results): each says what the place is for and gives the next step `writing/best-practices/provide-clear-next-steps-on-any`.

## Undo and exits
- Every step can be backed out of? Yes. Complete a task: tap again, plus undo message. Delete task or project: undo message and restore from S08. Close a sheet: Cancel, Escape or the close control, always visible `modality/best-practices/always-give-people-an-obvious-way`. The only non-reversible steps are emptying the trash, deleting all data, and replacing data by import; these are confirmed (D01). `design-principles/agency/help-people-recover-from-mistakes` `undo-and-redo/best-practices/let-people-undo-multiple-times`
- Undo messages must not disappear on a short timer if the person might miss them; the HIG warns against self-dismissing views on a timer `accessibility/cognitive/minimize-use-of-time-boxed-interface`. The restore path in S08 is the backstop. Exact duration is [HIG none] (D02).

## Diagram
```
COMPACT (< 744 px)                         REGULAR (>= 744 px)
Tab bar: 오늘 | 프로젝트 | 검색 | 설정      Sidebar: 오늘 / 검색 / 프로젝트 > (각 프로젝트) / 휴지통 / 설정
                                                      |
오늘 S01 --row--> 할 일 상세 S04            list pane (S01/S03/S07/S08) | detail pane (S04)
프로젝트 S02 -> 프로젝트 상세 S03 -> S04
검색 S07 --row--> S04
설정 S09 -> 휴지통 S08

Modals from anywhere:  S05 빠른 추가 (sheet/popover)   S06 프로젝트 만들기·편집 (sheet)
Confirmation (irreversible only): empty trash, delete all data, replace by import
```

## Assumptions
- 4 tabs fit the compact bar without a "More" tab `tab-bars/best-practices/avoid-overflow-tabs` · Why: sections kept to 4 · Confirm with: product owner
- Trash lives under 설정 on compact (rarely used) and in the sidebar on regular · Why: keep tab bar short · Confirm with: product owner
- Project detail on compact is a pushed full-width screen · Why: HIG names no compact split-view replacement · Confirm with: product owner (D14)
- Export/import is a file download/upload (JSON) · Why: no backend · Confirm with: front-end developer

## Open [HIG none] questions
- Compact-width alternative to a split view (the HIG does not name one) [HIG none]
- Tab bar versus sidebar count threshold (the HIG gives none) [HIG none]
- URL structure, deep links and browser Back behavior [HIG none]
- Undo message duration [HIG none]
- Behavior with the app open in two browser tabs [HIG none]
