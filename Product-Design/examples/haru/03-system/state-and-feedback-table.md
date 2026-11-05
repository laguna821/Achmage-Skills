# State and feedback table: 하루 (Haru), web app

**Stage:** 5 Interact (`references/workflow.md#interact`). Covers every interactive element of S01 to S09 and the containers around them. Contract: `tests/e2e/02-design/decisions.md` (D01 to D16) and `screens/S01.md` to `S09.md`. Visual values: `visual-system-note.md` and `theme.css`. Strings: `copy-sheet.md` (keys such as `S01.row.menu`).
Labels: [HIG], [HIG transfer], [HIG none], [House]. Owner answers applied: (1) D01 confirmations by size class (below); (2) project members stay (S03, S06, D08); (3) no automatic trash purge, so S08 has no expiry state.

## Common states (apply to every control below unless a row overrides)
| State | Visual | Notes | Rule IDs | Label |
|---|---|---|---|---|
| default | kit look | | `design-principles/familiarity/provide-clear-feedback` | [HIG] |
| hover (fine pointer only, regular) | `--row-hover` on rows, `--fill` on bar buttons | never the only route to an action | `pointing-devices/best-practices/let-people-use-the-pointer-to` | [HIG transfer] |
| focus (keyboard) | 3 px accent ring with 2 px offset (kit base); inset ring on rows and alert buttons | always visible, never removed | `focus-and-selection/best-practices/indicate-focus-using-visual-appearances-that` `accessibility/speech/let-people-use-the-keyboard-alone` | [HIG] |
| pressed | kit press fill (`--gray-4` on bar buttons, `--fill` on rows, darker fill on filled buttons), 120 ms | every button has one | `buttons/best-practices/always-include-a-press-state-for` | [HIG] |
| disabled | `--label-3` text / `--label-disabled`, no hover, `disabled` or `aria-disabled` | when the reason is not obvious, say it in text nearby | `feedback/best-practices/show-people-when-a-command-cant` | [HIG] |
| Reduce Motion | all motion collapses to about 0 ms; end states stay visible | | `motion/best-practices/make-motion-optional` | [HIG] |
| Sound / haptic | none anywhere | web, [HIG none] | | [HIG none] |

**Feedback channels (all controls):** visual shape or text first; a screen-reader announcement (`role="status"` region, `HK.announce`) for every result that changes the screen without moving focus: complete, undo, delete, restore, add, export, import, validation. Color is never the only channel `feedback/best-practices/make-sure-all-feedback-is-accessible` `color/inclusive-color/avoid-relying-solely-on-color-to`. Is every important message sent by more than one channel? Yes: text plus shape plus announcement.

## Controls: container and bars
| Control | Screens | State | Visual | Text | Motion | D## | Rule IDs | Label |
|---|---|---|---|---|---|---|---|---|
| Tab bar item (compact) | all | selected | accent text and icon, label 500; `aria-current="page"`; the tab stays selected inside pushed screens | 오늘, 프로젝트, 검색, 설정 | none | flow-map | `tab-bars/best-practices/use-a-tab-bar-to-support` `tab-bars/best-practices/make-sure-the-tab-bar-is` | [HIG transfer] |
| Tab bar item | S02 empty, S08 empty | empty section | tab stays enabled, content explains | empty-state text | none | flow-map | `tab-bars/best-practices/dont-disable-or-hide-tab-bar` | [HIG] |
| Tab bar | all | content scrolls beneath | glass bar (regular glass), opaque fallback under Reduce Transparency | - | none | house 3 | `materials/liquid-glass/dont-use-liquid-glass-in-the` | [House] |
| Sidebar item (regular) | all | selected | `--accent-soft` fill and `aria-current="page"`; a project item sits one level in | 오늘, 검색, 프로젝트 (group), project names, 휴지통, 설정 | none | D14 | `sidebars/best-practices/in-general-show-no-more-than` `split-views/best-practices/to-support-navigation-persistently-highlight-the` | [HIG transfer] |
| Sidebar toggle | all, regular | shown / hidden | `aria-expanded`; below 960 px the sidebar is an overlay that closes on Escape and outside click | 사이드바 숨기기 / 사이드바 보기 | slide 220 ms, none under Reduce Motion | D07 | `sidebars/best-practices/consider-letting-people-hide-the-sidebar` | [HIG transfer] |
| Back (compact) | S03, S04, S08 | default, pressed | `chevron-left` plus parent title; returns to the same row and scroll position | 뒤로 / parent title | push transition 220 ms | D14 | `toolbars/navigation/use-the-standard-back-and-close` `design-principles/flexibility/preserve-a-persons-context` | [HIG transfer] |
| Close pane (regular) | S04 | default | `x` at the pane corner; the list row loses selection | 상세 닫기 | none | D07 | `toolbars/navigation/use-the-standard-back-and-close` | [HIG transfer] |
| Toolbar 새 할 일 (prominent, filled) | S01, S02, S03, S07 | default | indigo fill, white Bold label, `plus` | 새 할 일 (compact: icon only) | none | D06 | `toolbars/actions/use-the-prominent-style-for-key` `buttons/style/in-general-use-a-button-that` | [HIG transfer] |
| Toolbar 새 할 일 | S01 to S07 | opened | `aria-expanded="true"`, focus moves into the sheet or popover; on close focus returns here | - | sheet 320 ms, popover 220 ms | D06 | `modality/best-practices/always-give-people-an-obvious-way` | [HIG transfer] |
| Toolbar 새 할 일 | S08, S09 | absent | not shown (no list to add to) | - | - | D06 | `design-principles/purpose/keep-focused` | [HIG] |
| 새 프로젝트 (plain) | S02 | default | text button next to the prominent one, 12 px gap | 새 프로젝트 | none | S02 | `buttons/style/use-style-not-size-to-visually` | [HIG transfer] |
| 편집 (plain) | S03 | default | text button | 편집 | none | S03 | `toolbars/actions/make-sure-the-meaning-of-each` | [HIG transfer] |
| 더 보기 (S04 menu) | S04 | closed / open | `ellipsis`, `aria-haspopup`, `aria-expanded`; menu lists 삭제 only | 더 보기 → 삭제 | menu fade 120 ms | D02 | `buttons/role/dont-assign-the-primary-role-to` | [HIG transfer] |

## Controls: lists and rows (S01, S02, S03, S07, S08)
| Control | Screens | State | Visual | Text | Motion | D## | Rule IDs | Label |
|---|---|---|---|---|---|---|---|---|
| Task row | S01, S03, S07 | default | flat on `--bg`, hairline separator; title 500, meta secondary | title, meta | none | D07 | `design-principles/agency/give-people-the-freedom-to-explore` | [HIG transfer] |
| Task row | same | hover (regular) | `--row-hover` | - | none | D07 | `pointing-devices/best-practices/let-people-use-the-pointer-to` | [HIG transfer] |
| Task row | same | selected (regular, open in detail pane) | `--accent-soft`, `aria-current="true"`; stays selected while the pane shows it | - | none | D07 | `split-views/best-practices/to-support-navigation-persistently-highlight-the` `lists-and-tables/best-practices/provide-appropriate-feedback-when-people-select` | [HIG transfer] |
| Task row | same | overdue | date text with “지났어요”, no color; sits under 지난 할 일 | “11월 2일 (월) · 2일 지났어요” | none | D16 | `color/inclusive-color/avoid-relying-solely-on-color-to` | [HIG transfer] |
| Task row | same | done | struck-through title in `--label-2`, filled circle, still editable | - | none | D09 | `toggles/best-practices/make-sure-the-visual-differences-in` | [HIG transfer] |
| Task row | same | new (just added) | row appears in place and is scrolled into view; announced | “‘{제목}’ 할 일을 추가했어요” (hidden, announced) | 220 ms scroll, none under Reduce Motion | D06 | `design-principles/familiarity/provide-clear-feedback` | [HIG transfer] |
| Task row | same | deleted | row leaves at once; undo message appears | message | row collapses 220 ms | D02 | `undo-and-redo/best-practices/show-the-results-of-an-undo` | [HIG transfer] |
| Completion button | S01, S03, S04, S07 | off | empty ring 2 px `--label-3`, 24 px (20 px with `hk-mac`) inside a 44 px (28 px) hit area; `role="checkbox"` `aria-checked="false"` | name: ‘{제목}’ 완료 | none | D09 | `toggles/platform-considerations/ios-ipados/outside-of-a-list-use-a` | [HIG transfer] |
| Completion button | same | pressed | ring darkens one step | - | 120 ms | D09 | `buttons/best-practices/always-include-a-press-state-for` | [HIG] |
| Completion button | same | on | filled `--accent-fill` circle, white `check`, title struck through and secondary; header count changes; `aria-checked="true"`; announced | “완료로 표시했어요” | fill and check 120 ms | D09 | `toggles/best-practices/make-sure-the-visual-differences-in` `feedback/best-practices/make-sure-all-feedback-is-accessible` | [HIG transfer] |
| Completion button | same | on, row stays | row does not move under the finger; it moves into 오늘 끝낸 일 / 끝낸 일 when the person leaves the screen or reloads | - | none | D09 | `design-principles/familiarity/provide-clear-feedback` | [HIG transfer] |
| Completion button | same | toggled back | ring returns, strike-through removed; announced | “완료를 취소했어요” | 120 ms | D09 | `design-principles/agency/help-people-recover-from-mistakes` | [HIG transfer] |
| Completion button | same | keyboard | Space toggles; Enter on the row opens the task | - | - | D09 | `accessibility/speech/let-people-use-the-keyboard-alone` | [HIG] |
| Row menu button (더 보기) and context menu | S01, S02, S03, S07, S08 | closed / open | `ellipsis` button always visible on compact, on hover or focus and by right click on regular; menu items: 열기, 편집 (projects), 삭제; S08: 복원, 영구 삭제 | 열기, 편집, 삭제, 복원, 영구 삭제 | 120 ms | D02 | `context-menus/best-practices/always-make-context-menu-items-available` `pointing-devices/platform-considerations/macos/touch-support-for-hidden-controls/make-essential-hidden-controls-available-in` | [HIG transfer] |
| Delete key (regular) | S01, S03, S07 | row focused | deletes the task, same as the menu; undo message | - | - | D02 | `accessibility/speech/let-people-use-the-keyboard-alone` | [HIG transfer] |
| 오늘 끝낸 일 / 끝낸 일 header (disclosure) | S01, S03 | collapsed (default) | `chevron-right`, count in the label, `aria-expanded="false"` | “오늘 끝낸 일 3개” | chevron turns 220 ms | D16 | `disclosure-controls/best-practices/use-a-disclosure-control-to-hide` `disclosure-controls/disclosure-triangles/provide-a-descriptive-label-when-using` | [HIG transfer] |
| same | same | expanded | chevron down, done rows listed (restored on relaunch) | - | height 220 ms | D16 | `launching/best-practices/restore-the-previous-state-when-your` | [HIG transfer] |
| same | same | empty | header is not shown when there are no done items | - | - | D16 | `design-principles/simplicity/include-just-whats-necessary` | [HIG] |
| 담당자 filter (pop-up button) | S03 | default “모두” | `chevron-down`, value in the label “담당자: 모두” | 담당자: 모두 | menu 120 ms | D04 | `pop-up-buttons/best-practices/provide-a-useful-default-selection` `settings/task-specific-options/when-possible-prefer-letting-people-modify` | [HIG transfer] |
| same | same | filtered | label “담당자: 나”; text line states the filter; kept per project and restored | - | - | D04 | `color/inclusive-color/avoid-relying-solely-on-color-to` | [HIG transfer] |
| same | same | filter finds nothing | empty text + 필터 해제 button | “이 담당자의 할 일이 없어요” | - | D04 | `writing/best-practices/provide-clear-next-steps-on-any` | [HIG] |
| Project row | S02 | default / selected / hover | name 500, gauge + text, members; `chevron-right` on compact; selected tint on regular | see copy | none | D14 | `lists-and-tables/content/keep-item-text-succinct-so-row` | [HIG transfer] |
| Gauge (status, not a control) | S02, S03 | has tasks | 4 px `<meter>`, `--label-2` fill, length = ratio; text “8개 중 3개 완료” always visible | 8개 중 3개 완료 | fill change 220 ms | D05 | `gauges/best-practices/write-succinct-labels-that-describe-the` `feedback/best-practices/consider-integrating-status-feedback-into-your` | [HIG transfer] |
| same | same | no tasks | no gauge | “할 일이 아직 없어요” | - | D05 | `design-principles/simplicity/include-just-whats-necessary` | [HIG transfer] |
| same | same | all done | full gauge, text only, no celebration | “모두 끝냈어요” | - | D05 | `design-principles/delight/dont-mistake-delight-for-decoration` | [HIG transfer] |

## Controls: forms (S04, S05, S06)
| Control | Screens | State | Visual | Text | Motion | D## | Rule IDs | Label |
|---|---|---|---|---|---|---|---|---|
| Title field (task) | S04, S05 | default / focus | visible label; kit field; S05 focused on open with keyboard up | label 제목 | none | D06 | `text-fields/best-practices/show-a-hint-in-a-text` `text-fields/best-practices/use-a-text-field-to-request` | [HIG transfer] |
| same | S04 | empty on leaving | old title returns, field shows error icon, bold text and thicker outline; nothing saved | “제목을 적어 주세요” | none | S04 | `entering-data/best-practices/dynamically-validate-field-values` | [HIG transfer] |
| same | S04 | saving | no Save button; saves on blur and on leaving the screen; no visible spinner for local data | - | - | S04 | `file-management/saving-work/help-people-be-confident-that-their` | [HIG transfer] |
| same | S05 | empty | 추가 disabled and the hint below the field is the reason | “제목을 적어 주세요” | - | D06 | `feedback/best-practices/show-people-when-a-command-cant` | [HIG transfer] |
| 마감일 pop-up | S04, S05 | default | `calendar` + value; menu 오늘, 내일, 다음 주, 마감일 없음, 날짜 고르기… | value, e.g. “오늘” | 120 ms | D03 | `pop-up-buttons/best-practices/provide-a-useful-default-selection` `entering-data/best-practices/when-possible-offer-choices-instead-of` | [HIG transfer] |
| same | same | picking a date | compact: native date input styled as a field; regular: graphical picker in a popover (S04) or replacing the content inline (S05, never a second popover); Escape returns | label | none | D03 | `pickers/best-practices/avoid-switching-views-to-show-a` `popovers/best-practices/show-one-popover-at-a-time` | [HIG transfer] |
| same | S04 | changed | value updates at once and is saved; a task with a changed date moves group in lists on return | - | - | D03 | `file-management/saving-work/help-people-be-confident-that-their` | [HIG transfer] |
| same | S04 | overdue | value reads “11월 2일 (월) · 2일 지났어요” | - | - | D16 | `color/inclusive-color/avoid-relying-solely-on-color-to` | [HIG transfer] |
| 프로젝트 and 담당자 pop-ups | S04, S05 | default / changed | current value in the label; 프로젝트 없음 / 담당자 없음 are menu items; assignee list = members of the project | value | 120 ms | D08 | `pop-up-buttons/best-practices/use-a-pop-up-button-to` `pop-up-buttons/best-practices/give-people-a-way-to-predict` | [HIG transfer] |
| same | S04 | project or assignee removed elsewhere | value reads 프로젝트 없음 / 담당자 없음 | - | - | D08, D12 | `design-principles/simplicity/include-just-whats-necessary` | [HIG] |
| 메모 text view | S04 | default / focus / long | grows to 8 rows, then scrolls; saves on blur | label 메모, placeholder | none | S04 | `text-views/best-practices/use-a-text-view-when-you` `text-views/best-practices/keep-text-legible` | [HIG transfer] |
| 추가 (S05 Done, filled) | S05 | default / disabled / pressed | filled; disabled until a title exists | 추가 | none | D06 | `sheets/best-practices/provide-an-alternative-to-the-done` | [HIG transfer] |
| 추가 / Return / Shift+Return | S05 | saved | sheet or popover closes, new row visible and announced; Shift+Return (regular) keeps it open with the title cleared | - | sheet 320 ms | D06 | `design-principles/familiarity/provide-clear-feedback` | [HIG transfer] |
| 취소 / Escape / outside click | S05, S06 | closed with text typed | text is kept as a draft and returns on next open | - | - | D06 | `popovers/best-practices/always-save-work-when-automatically-closing` `modality/best-practices/when-necessary-help-people-avoid-data` | [HIG transfer] |
| Sheet swipe-down (compact) | S05, S06 | with typed or changed content | action sheet 초안 지우기 / 계속 쓰기 (S05) or 변경 취소 / 계속 편집 (S06); empty sheet just closes | see copy | rise 320 ms | D06 | `sheets/platform-considerations/ios-ipados/support-swiping-to-dismiss-a-sheet` | [HIG transfer] |
| 이름 field (project) | S06 | empty | 만들기 / 저장 disabled with hint | “이름을 적어 주세요” | - | S06 | `entering-data/best-practices/dynamically-validate-field-values` | [HIG transfer] |
| same | S06 | duplicate name | neutral note below the field (allowed) | “같은 이름의 프로젝트가 이미 있어요” | - | S06 | `writing/best-practices/write-clear-error-messages` | [HIG transfer] |
| 만들기 / 저장 (filled) | S06 | default / disabled | create mode label 만들기, edit mode 저장; changes apply on press, not before | label | sheet closes 320 ms | S06 | `sheets/best-practices/provide-an-alternative-to-the-done` | [HIG transfer] |
| Member row (checkmark) | S06 | unchecked / checked | `check` at the trailing edge, `aria-checked`, row tint on press; 나 checked by default | name | none | D08 | `lists-and-tables/best-practices/provide-appropriate-feedback-when-people-select` | [HIG transfer] |
| 구성원 관리 (plain link) | S06 | default | goes to S09 after closing the sheet; no nested sheet | 구성원 관리 | - | S06 | `sheets/best-practices/display-only-one-sheet-at-a` | [HIG transfer] |
| 프로젝트 삭제 (plain, destructive color) | S06 edit | default | inside a white cell at the end; closes the sheet and returns to S02 | 프로젝트 삭제 | - | D02 | `buttons/role/dont-assign-the-primary-role-to` | [HIG] |

## Controls: search (S07)
| Control | State | Visual | Text | Motion | D## | Rule IDs | Label |
|---|---|---|---|---|---|---|---|
| Search field | open, empty | focused on open; shows 최근 검색 or the hint line | placeholder “할 일과 프로젝트 검색” | none | D13 | `search-fields/best-practices/use-placeholder-text-to-help-people` `searching/best-practices/clearly-display-the-current-scope-of` | [HIG transfer] |
| same | typing | results update as typed; matched text in 700 weight, not color | counts in section headers | none | D13 | `search-fields/best-practices/if-possible-start-search-immediately-when` | [HIG transfer] |
| same | no results | message with the query, a spelling hint and 새 할 일 with the query as its title; trash line | see copy | none | D13 | `writing/best-practices/provide-clear-next-steps-on-any` | [HIG transfer] |
| Clear button (in field) | text present | `x` in the field; Escape clears first, then leaves | 검색어 지우기 | none | D13 | `text-fields/platform-considerations/ios-ipados/display-a-clear-button-in-the` | [HIG transfer] |
| 취소 (compact) | field active | text button; clears and leaves | 취소 | none | D13 | `search-fields/platform-considerations/ios/search-as-an-inline-field/place-search-as-an-inline-field` | [HIG transfer] |
| Result row | default / selected | same as task row; project result shows gauge text | - | none | D07 | `design-principles/agency/give-people-the-freedom-to-explore` | [HIG transfer] |
| 지우기 (recent searches) | default | plain text button in the list header; no confirmation, the list is local and can be rebuilt; no undo | 지우기 | none | D13 | `searching/best-practices/take-privacy-into-consideration-before-displaying` | [HIG transfer] |

## Controls: trash (S08)
| Control | State | Visual | Text | Motion | D## | Rule IDs | Label |
|---|---|---|---|---|---|---|---|
| Trash row | default | type label (할 일 / 프로젝트), title, deleted when; project row adds “할 일 {N}개 포함”; a task whose project is also in the trash is inside the project row | see copy | none | S08 | `lists-and-tables/best-practices/prefer-displaying-text-in-a-list` | [HIG transfer] |
| 복원 (plain, on row) | default / pressed | text button, trailing; 24 px (regular) or 32 px (compact, in the row layout) away from the 영구 삭제 menu button | 복원 | none | S08 | `accessibility/mobility/consider-spacing-between-controls-as-important` | [HIG transfer] |
| 복원 | restored | row leaves; message-only toast names the result (no Undo button: restore is the undo); task returns to its project or to 프로젝트 없음 | “‘{제목}’ 할 일을 되돌렸어요” | toast 220 ms | S08 | `undo-and-redo/best-practices/show-the-results-of-an-undo` | [HIG transfer] |
| 휴지통 비우기 (toolbar, plain) | has items | plain text button, never prominent | 휴지통 비우기 | none | D01 | `buttons/role/dont-assign-the-primary-role-to` | [HIG transfer] |
| same | empty trash | disabled; the empty-state text is the reason | - | none | D01 | `feedback/best-practices/show-people-when-a-command-cant` | [HIG] |
| 영구 삭제 (row menu) | default | menu item, destructive text color | 영구 삭제 | none | D01 | `alerts/buttons/if-theres-a-destructive-action-include` | [HIG transfer] |
| After a permanent delete | done | row leaves; a status line states the result; no Undo (it cannot be undone) | “영구 삭제했어요” | none | D01 | `design-principles/familiarity/provide-clear-feedback` | [HIG transfer] |

## Controls: settings and members (S09)
| Control | State | Visual | Text | Motion | D## | Rule IDs | Label |
|---|---|---|---|---|---|---|---|
| Member name (inline edit) | default / editing | name as a text button; activating it turns it into a field with the text selected; Return or blur saves, Escape reverts | name | none | D12 | `lists-and-tables/best-practices/let-people-edit-a-table-when` | [HIG transfer] |
| same | invalid | error icon, bold hint, thicker outline; nothing saved until valid | “이름을 적어 주세요” / “같은 이름이 이미 있어요” | none | D12 | `entering-data/best-practices/dynamically-validate-field-values` | [HIG transfer] |
| 나 row | default | renamable, no remove button | 나 | none | D12 | `design-principles/simplicity/include-just-whats-necessary` | [HIG transfer] |
| Rename button (pencil) | default | visible on every row except it is the same action as activating the name | ‘{이름}’ 이름 바꾸기 | none | D12 | `icons/best-practices/provide-alternative-text-labels-for-custom` | [HIG transfer] |
| Remove button | default / pressed | `trash-2`, not on 나; removes at once | ‘{이름}’ 구성원 삭제 | row collapses 220 ms | D12 | `alerts/best-practices/avoid-displaying-alerts-for-common-undoable` | [HIG transfer] |
| Add field + 추가 | empty / typing / invalid | 추가 disabled until a valid name; Return adds; field clears and keeps focus | 추가 | none | D12 | `text-fields/best-practices/use-a-text-field-to-request` | [HIG transfer] |
| 내보내기 | default / working / done | starts the browser download of `haru-YYYY-MM-DD.json`; after it, a line with `circle-check` | “내보냈어요 · haru-2026-11-04.json” | none | S09 | `feedback/best-practices/when-it-makes-sense-confirm-that` `design-principles/responsibility/keep-peoples-information-safe` | [HIG transfer] |
| 가져오기 | default | opens the browser file chooser; nothing changes until a valid file is read | 가져오기 | none | D01 | `design-principles/agency/help-people-recover-from-mistakes` | [HIG transfer] |
| same | working (large file) | `hk-progress` bar with a label, only if it takes noticeable time; otherwise none | “가져오는 중” | none | S09 | `progress-indicators/best-practices/when-possible-use-a-determinate-progress` | [HIG transfer] |
| same | error | message with `circle-alert` under the button: what is wrong, what to do, “지금 데이터는 그대로예요”; stays until the next attempt | see copy | none | D15 | `writing/best-practices/write-clear-error-messages` | [HIG transfer] |
| same | success | line with `circle-check` | “가져왔어요. 할 일 {N}개, 프로젝트 {M}개” | none | S09 | `feedback/best-practices/when-it-makes-sense-confirm-that` | [HIG transfer] |
| 휴지통 row (compact) | default | row with `chevron-right`; regular has the sidebar item instead | 휴지통 | push 220 ms | S09 | `layout/adaptability/size-classes/keep-functionality-the-same-as-size` | [HIG transfer] |
| 모든 데이터 삭제 | default | plain button in a white cell, destructive color, 32 px below the backup buttons | 모든 데이터 삭제 | none | D01 | `buttons/role/dont-assign-the-primary-role-to` | [HIG transfer] |

## Feedback components
| Control | State | Visual | Text | Motion | D## | Rule IDs | Label |
|---|---|---|---|---|---|---|---|
| Undo message (`HK.toast`, `duration: 0`) | shown | opaque elevated surface; compact: above the tab bar, regular: top of the list pane under the toolbar; `role="status"`; Undo button right after the opener in tab order; Close `x`; **no timer** | “‘{제목}’ 할 일을 삭제했어요” + 실행 취소 | appears 220 ms | D02 | `undo-and-redo/best-practices/show-the-results-of-an-undo` `accessibility/cognitive/minimize-use-of-time-boxed-interface` | [HIG none] component |
| same | replaced | the newest message replaces the old one (one at a time); earlier deletes stay in 휴지통 | - | - | D02 | `undo-and-redo/best-practices/let-people-undo-multiple-times` | [HIG transfer] |
| same | dismissed | by Close, by Escape, by choosing another section, or by 실행 취소 | - | - | D02 | `accessibility/cognitive/minimize-use-of-time-boxed-interface` | [HIG transfer] |
| same | after undo | item returns to its place; “되돌렸어요” is announced; focus goes to the restored row if it is on screen | “되돌렸어요” (announced) | 220 ms | D02 | `undo-and-redo/best-practices/help-people-predict-the-results-of` | [HIG transfer] |
| same | keyboard | Ctrl or Cmd+Z undoes deletes in reverse order, several times (regular), when not typing | - | - | D02 | `undo-and-redo/best-practices/let-people-undo-multiple-times` | [HIG transfer] |
| Storage banner | shown | under the toolbar on every screen, `--bg-elevated`, `triangle-alert` in orange, bold heading, one action; persistent | see copy (full, blocked, cleared) | appears 220 ms | D15 | `writing/best-practices/write-clear-error-messages` `feedback/best-practices/show-people-when-a-command-cant` | [HIG none] component |
| same | resolved | banner leaves when saving works again; nothing announced beyond “저장할 수 있어요” | “다시 저장할 수 있어요” (announced) | - | D15 | `feedback/best-practices/when-it-makes-sense-confirm-that` | [HIG transfer] |
| Empty state | shown | one icon, one sentence, one button; tab bar stays | see copy | none | S01, S02, S03, S07, S08 | `writing/best-practices/provide-clear-next-steps-on-any` | [HIG] |

## Undo and confirmation
D01 as the owner answered it. Confirmation exists for exactly four irreversible steps plus deleting one item forever; everything else is undo.

| Action | Undo offered? | Confirmation needed? (why) | Presentation | Tree used | Rule IDs |
|---|---|---|---|---|---|
| Complete or uncomplete a task | Tap again; no message | No: frequent, reversible in place | none | alerting and confirming step 2 | `design-principles/agency/help-people-recover-from-mistakes` |
| Delete a task | Undo message (no timer) and 휴지통 | No: common and undoable | toast, D02 | alerting and confirming | `alerts/best-practices/avoid-displaying-alerts-for-common-undoable` |
| Delete a project (with its tasks) | Undo message naming the task count, and 휴지통 (project and tasks return together) | No: undoable even with many tasks | toast, D02 | same | `undo-and-redo/best-practices/help-people-predict-the-results-of` |
| Remove a member | Undo message; the member's tasks return to that member on undo | No: undoable | toast, D02, D12 | same | `alerts/best-practices/avoid-displaying-alerts-for-common-undoable` |
| Restore from 휴지통 | Restore is the undo; message-only toast | No | toast without Undo | same | `undo-and-redo/best-practices/show-the-results-of-an-undo` |
| Edit a task field | Set the value again | No: autosave | none | - | `file-management/saving-work/help-people-be-confident-that-their` |
| Change project or assignee | Pick again | No | none | - | `entering-data/best-practices/when-possible-offer-choices-instead-of` |
| Close S05 or S06 with typed text | Draft kept (S05); S06 asks via action sheet on swipe-down only (compact) | No on 취소 and Escape; yes only for swipe-down | action sheet, compact | alerting and confirming step 8 | `modality/best-practices/when-necessary-help-people-avoid-data` `sheets/platform-considerations/ios-ipados/support-swiping-to-dismiss-a-sheet` |
| **Empty trash** | None (permanent) | **Yes**, rare and irreversible | **Compact:** action sheet, 휴지통 비우기 in the destructive style, 취소 at the bottom. **Regular:** alert in the normal style, 취소 and 휴지통 비우기; 휴지통 비우기 is the default button and Return confirms; no caution symbol and no icon | alerting and confirming, Empty Trash note | `alerts/buttons/use-the-destructive-style-to-identify` `alerts/platform-considerations/macos/use-a-caution-symbol-sparingly` `action-sheets/best-practices/make-destructive-choices-visually-prominent` |
| **Delete one item forever** | None | **Yes**, same as Empty Trash | same presentation as Empty Trash, title names the item; default button 영구 삭제 on regular | same | `alerts/buttons/use-the-destructive-style-to-identify` |
| **Delete all data in this browser** | None | **Yes** | **Both classes:** destructive style, **no default button**. Compact: action sheet with 모든 데이터 삭제 (destructive) and 취소. Regular: alert with 취소 and 모든 데이터 삭제 (destructive); focus starts on the dialog, not on a button; Return does nothing until a button is focused. The message points to 내보내기 | same | `alerts/buttons/if-theres-a-destructive-action-include` `feedback/best-practices/warn-people-when-they-initiate-a` |
| **Import over existing data** | None after 바꾸기 (a merge cannot be reversed either) | **Yes** | **Both classes:** three choices, destructive 바꾸기, plain 합치기, 취소; **no default button**. Compact: action sheet with 바꾸기 on top, 합치기, 취소 at the bottom. Regular: stacked alert buttons. Shown only after the file was read and found valid | same | `alerts/buttons/create-succinct-logical-button-titles` `action-sheets/best-practices/if-necessary-provide-a-cancel-button` |
| Export | n/a (creates a copy) | No | browser download plus a result line | - | `feedback/best-practices/when-it-makes-sense-confirm-that` |
| Clear recent searches | No | No: local, low stakes | none | - | `searching/best-practices/take-privacy-into-consideration-before-displaying` |
- All confirmations: Escape and an outside click cancel `alerts/buttons/provide-alternative-ways-to-cancel-an`; one at a time `sheets/best-practices/display-only-one-sheet-at-a`; the title says what is lost and how much `alerts/content/include-informative-text-only-if-it`; button titles are verbs `alerts/buttons/avoid-using-ok-as-the-default`; the most likely choice trails or tops, 취소 leads or sits at the bottom `alerts/buttons/place-buttons-where-people-expect`.
- Kit note: use `hk-actionsheet` only on compact. At 744 px and wider the kit renders an action sheet as a popover from its source, which is not the D01 decision for regular.
- Regular alert for Empty Trash: `hk-alert__btn--default` (Bold) on 휴지통 비우기 and `autofocus` on it so Return confirms; for delete-all and import: no `--default`, no `autofocus`.
- No automatic purge: 휴지통 items stay until emptied or deleted by the person (owner answer 3).

## Saving and progress
- Work saved automatically? Yes for S04 fields (on blur and on leaving), member names (Return or blur), completion and every delete or restore (at once). S05, S06 and the import choice save on their primary button. Nothing shows a spinner for local data; the only visible save state is the banner when saving fails. `file-management/saving-work/help-people-be-confident-that-their`
- Relaunch restores: last section, last project, person filter, done-section expansion, scroll where possible, S05 draft. `launching/best-practices/restore-the-previous-state-when-your`
- Progress shown where? Project progress next to the project name (gauge plus text, D05); import progress next to the 가져오기 button only if slow. `feedback/best-practices/consider-integrating-status-feedback-into-your`
- Resizing across 744 px keeps the open task: pushed screen ⇄ detail pane. `design-principles/flexibility/preserve-a-persons-context`

## Why-chain (one state decision)
- **Why-chain:** Someone ticks off a task and their finger is still on it → Simplicity, Familiarity → a toggle that changes shape in place and does not move the row → circular completion button with fill, check, strike-through and a header count; the row settles later → `toggles/best-practices/make-sure-the-visual-differences-in` `design-principles/familiarity/provide-clear-feedback` `feedback/best-practices/make-sure-all-feedback-is-accessible` → [HIG transfer]; the exact control is [HIG none].

## Open [HIG none] questions
- Undo-stack length and whether the stack survives a reload (D02 assumed the session).
- How long a restored-row focus should be held and whether the restore toast should also pause on hover (kit default pauses only timed toasts).
- Shortcut for 새 할 일 and whether Delete should also work when the list is not focused.
- Behavior with the app open in two browser tabs (stale state, “이 할 일을 찾을 수 없어요”).
- Whether the compact 영구 삭제 menu item should be reachable by swipe (not offered: hidden gesture, no pointer route).

