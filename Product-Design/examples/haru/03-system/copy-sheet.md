# Copy sheet: 하루 (Haru), web app

**Stage:** 6 Write (`references/workflow.md#write`). Every interface string, keyed by screen and element. Language: Korean, 해요체. Contract: `tests/e2e/02-design/screens/S01.md` to `S09.md`, `decisions.md`, owner answers (D01 confirmations by size class, members stay, no auto purge). Interaction detail: `state-and-feedback-table.md`.
`{…}` marks a value filled in by the app. Keys: `S01.title`, `S01.empty.text`, … `S00` is the shared container (tab bar, sidebar, toasts, banner, dialogs that appear on several screens).

## Voice
- **Voice from the brief:** plain, short, calm Korean; nouns for sections, verbs for actions; 해요체 (assumption confirmed by the owner in stage 2) `writing/getting-started/determine-your-apps-voice`.
- **Tone per situation** `writing/getting-started/match-your-tone-to-the-context`: everyday (lists, buttons) neutral and brief; empty states warm and one sentence; errors calm, no blame, say what is still safe; irreversible confirmations plain and specific, no drama, no exclamation marks anywhere.
- **Writing rules used:** buttons are verbs, titles are nouns `writing/best-practices/be-action-oriented`; the most important words come first `design-principles/simplicity/be-concise`; no “please” stacking: “주세요” only where the person must act.
- **Particles:** names the person types have unknown final sounds, so every sentence puts a fixed noun after the name (‘{제목}’ 할 일을, ‘{이름}’ 프로젝트를) and the particle follows the fixed noun. No 은/는, 이/가, 을/를, 와/과 directly after a variable.
- **Dates:** 오늘, 내일, otherwise “11월 6일 (금)”; another year “2027년 1월 8일 (금)”. Overdue: “11월 2일 (월) · 2일 지났어요”. Counts: “{N}개”. People: “{N}명”.

## Terms (one term per concept) `writing/best-practices/give-clear-guidance-and-use-consistent`
| Concept | Term | Not used |
|---|---|---|
| a to-do item | 할 일 | 태스크, 작업, 항목 (항목 only for mixed trash content) |
| group of tasks | 프로젝트 | 폴더, 목록 |
| person in the workspace | 구성원 | 멤버, 팀원 |
| one person responsible | 담당자 | 배정 |
| due date | 마감일 | 기한, 날짜 (날짜 only in “날짜 고르기”) |
| free text on a task | 메모 | 설명 |
| deleted-items place | 휴지통 | 보관함 |
| removing an item (to the trash) | 삭제 | 지우기 (only the recent-search list uses 지우기: it is erasing text, not deleting an item) |
| removing for good | 영구 삭제 | 완전 삭제 |
| finished | 완료 (the state), 끝낸 일 (a group name) | 마침, 종료 |
| saving a file copy | 내보내기 (export), 가져오기 (import) | 백업 (only as the section name 백업), 업로드 |
| take back | 실행 취소 (undo), 복원 (from the trash), 되돌렸어요 (result) | 취소 alone for undo |

Changes to the stage 3 strings, all for the table above: 지웠어요 → 삭제했어요; 모든 데이터 지우기 → 모든 데이터 삭제; 영구히 지울까요 → 영구 삭제할까요; project sheet button 완료 → 만들기 / 저장 (완료 now only means a finished task).

## Strings

### S00 Shared: containers, toasts, banner
| Screen | Element | Text | Role | Fits without truncation? | Rule IDs | Label |
|---|---|---|---|---|---|---|
| S00 | tab / sidebar 1 | 오늘 | section name | yes | `tab-views/best-practices/provide-a-label-for-each-tab` | [HIG] |
| S00 | tab / sidebar 2 | 프로젝트 | section name | yes | same | [HIG] |
| S00 | tab / sidebar 3 | 검색 | section name | yes | same | [HIG] |
| S00 | tab / sidebar 4 | 설정 | section name | yes | same | [HIG] |
| S00 | sidebar item (regular only) | 휴지통 | section name | yes | `sidebars/best-practices/in-general-show-no-more-than` | [HIG transfer] |
| S00 | sidebar toggle label (hide) | 사이드바 숨기기 | icon-button name | yes | `voiceover/descriptions/provide-alternative-labels-for-all-key` | [HIG] |
| S00 | sidebar toggle label (show) | 사이드바 보기 | icon-button name | yes | same | [HIG] |
| S00 | Back button accessible name | 뒤로, {부모 제목} | icon + title name | visible text is the parent title only | `toolbars/navigation/use-the-standard-back-and-close` | [HIG transfer] |
| S00 | page title (browser tab) | 하루 · {화면 이름} | document title | yes | `toolbars/titles/provide-a-useful-title-for-each` | [HIG transfer] |
| S00 | live region: section changed | {화면 이름} | announcement on navigation | n/a | `voiceover/navigation/inform-voiceover-when-visible-content-or` | [HIG] |
| S00 | undo toast, task deleted | ‘{제목}’ 할 일을 삭제했어요 | result | wraps to 2 lines | `undo-and-redo/best-practices/show-the-results-of-an-undo` | [HIG] |
| S00 | undo toast, project deleted | ‘{이름}’ 프로젝트와 할 일 {N}개를 삭제했어요 | result with the count | wraps | `undo-and-redo/best-practices/help-people-predict-the-results-of` | [HIG] |
| S00 | undo toast, project deleted (no tasks) | ‘{이름}’ 프로젝트를 삭제했어요 | result | yes | same | [HIG] |
| S00 | undo toast, member removed | ‘{이름}’ 구성원을 삭제했어요 | result | yes | same | [HIG] |
| S00 | undo button | 실행 취소 | action | yes | `undo-and-redo/platform-considerations/ios-ipados/briefly-and-precisely-describe-the-operation` | [HIG] |
| S00 | undo result (announced) | 되돌렸어요 | result of undo | yes | `undo-and-redo/best-practices/show-the-results-of-an-undo` | [HIG] |
| S00 | toast close | 닫기 | icon-button name | yes | `voiceover/descriptions/provide-alternative-labels-for-all-key` | [HIG] |
| S00 | restore toast (no Undo button) | ‘{제목}’ 할 일을 되돌렸어요 | result | wraps | `feedback/best-practices/when-it-makes-sense-confirm-that` | [HIG] |
| S00 | restore toast, project | ‘{이름}’ 프로젝트와 할 일 {N}개를 되돌렸어요 | result | wraps | same | [HIG] |
| S00 | banner heading, storage full | 변경 내용을 저장하지 못했어요 | what happened | wraps | `writing/best-practices/write-clear-error-messages` | [HIG] |
| S00 | banner body, storage full | 브라우저 저장 공간이 가득 찼어요. 지금 작업은 이 화면에서 계속할 수 있어요. | what is still safe | wraps | same | [HIG] |
| S00 | banner action, storage full | 내보내기 | next step | yes | `design-principles/responsibility/be-fully-transparent-about-what-your` | [HIG] |
| S00 | banner heading, storage blocked | 이 브라우저가 저장을 막고 있어요 | what happened | wraps | `writing/best-practices/write-clear-error-messages` | [HIG] |
| S00 | banner body, storage blocked | 시크릿 모드이거나 사이트 데이터가 차단됐을 수 있어요. 창을 닫으면 작업이 사라져요. | cause and consequence | wraps | same | [HIG] |
| S00 | banner action, storage blocked | 내보내기 | next step | yes | same | [HIG] |
| S00 | banner heading, data missing | 저장된 데이터를 찾을 수 없어요 | what happened | wraps | same | [HIG] |
| S00 | banner body, data missing | 브라우저가 사이트 데이터를 지웠을 수 있어요. 내보낸 파일이 있다면 설정에서 가져올 수 있어요. | cause and next step | wraps | same | [HIG] |
| S00 | banner action, data missing | 설정 열기 | next step | yes | same | [HIG] |
| S00 | banner accessible label | 저장 문제 | region name (warning icon is hidden) | yes | `voiceover/descriptions/provide-alternative-labels-for-all-key` | [HIG] |
| S00 | banner resolved (announced) | 다시 저장할 수 있어요 | status | yes | `feedback/best-practices/when-it-makes-sense-confirm-that` | [HIG] |
| S00 | project, none | 프로젝트 없음 | pop-up value and menu item | yes | `pop-up-buttons/best-practices/provide-a-useful-default-selection` | [HIG] |
| S00 | assignee, none | 담당자 없음 | pop-up value and menu item | yes | same | [HIG] |
| S00 | me (first member, default name) | 나 | member name | yes | `writing/getting-started/be-clear` | [HIG] |
| S00 | row menu: open | 열기 | menu item | yes | `context-menus/best-practices/always-make-context-menu-items-available` | [HIG] |
| S00 | row menu: edit | 편집 | menu item (projects) | yes | same | [HIG] |
| S00 | row menu: delete | 삭제 | menu item | yes | same | [HIG] |
| S00 | row menu button name | ‘{제목}’ 더 보기 | icon-button name | wraps in the name only | `voiceover/descriptions/provide-alternative-labels-for-all-key` | [HIG] |
| S00 | completion button name | ‘{제목}’ 완료 | checkbox name; state read as checked / not checked | n/a | same | [HIG] |
| S00 | completion announced, on | 완료로 표시했어요 | status | yes | `feedback/best-practices/make-sure-all-feedback-is-accessible` | [HIG] |
| S00 | completion announced, off | 완료를 취소했어요 | status | yes | same | [HIG] |
| S00 | task added (announced) | ‘{제목}’ 할 일을 추가했어요 | status | n/a | same | [HIG] |

### S01 오늘
| Screen | Element | Text | Role | Fits without truncation? | Rule IDs | Label |
|---|---|---|---|---|---|---|
| S01 | title | 오늘 | names the screen | yes | `toolbars/titles/write-a-concise-title` | [HIG transfer] |
| S01 | secondary line | 11월 4일 수요일 | today's date | yes | `lists-and-tables/content/keep-item-text-succinct-so-row` | [HIG transfer] |
| S01 | toolbar button | 새 할 일 | action (icon only on compact) | yes | `toolbars/actions/make-sure-the-meaning-of-each` | [HIG transfer] |
| S01 | section 1 | 오늘 | group name | yes | `layout/visual-hierarchy/group-related-items-to-clearly-express` | [HIG transfer] |
| S01 | section 2 header | 지난 할 일 | group name (no alarm) | yes | `design-principles/purpose/keep-focused` | [HIG transfer] |
| S01 | section 2 count | {N}개 | plain count | yes | same | [HIG transfer] |
| S01 | section 3 header | 오늘 끝낸 일 {N}개 | disclosure label | yes | `disclosure-controls/disclosure-triangles/provide-a-descriptive-label-when-using` | [HIG transfer] |
| S01 | row meta | {프로젝트 이름} · {담당자 이름} | second line (assignee only when 2+ members) | wraps | `lists-and-tables/content/keep-item-text-succinct-so-row` | [HIG transfer] |
| S01 | row meta, overdue | {프로젝트 이름} · 11월 2일 (월) · 2일 지났어요 | second line | wraps | `color/inclusive-color/avoid-relying-solely-on-color-to` | [HIG transfer] |
| S01 | row without project | 프로젝트 없음 | meta | yes | `design-principles/simplicity/include-just-whats-necessary` | [HIG] |
| S01 | first open, sentence | 오늘 할 일이 여기에 모여요 | what the screen is for | yes | `onboarding/best-practices/teach-through-interactivity` | [HIG] |
| S01 | first open, field placeholder | 무엇을 할까요? | hint | yes | `text-fields/best-practices/show-a-hint-in-a-text` | [HIG] |
| S01 | first open, field label (hidden) | 새 할 일 제목 | field name | n/a | `text-fields/best-practices/show-a-hint-in-a-text` | [HIG] |
| S01 | first open, button | 추가 | action (creates the task due today) | yes | `writing/best-practices/be-action-oriented` | [HIG] |
| S01 | nothing due today | 오늘 할 일이 없어요 | state | yes | `writing/best-practices/provide-clear-next-steps-on-any` | [HIG] |
| S01 | nothing due today, button | 새 할 일 | next step | yes | same | [HIG] |
| S01 | all done today | 오늘 할 일을 모두 끝냈어요 | state, no celebration | yes | `design-principles/delight/identify-the-emotion-you-want-to` | [HIG] |
| S01 | detail pane, none selected (regular) | 할 일을 고르면 여기에 보여요 | pane hint | yes | `writing/best-practices/provide-clear-next-steps-on-any` | [HIG] |

### S02 프로젝트
| Screen | Element | Text | Role | Fits without truncation? | Rule IDs | Label |
|---|---|---|---|---|---|---|
| S02 | title | 프로젝트 | names the screen | yes | `toolbars/titles/write-a-concise-title` | [HIG transfer] |
| S02 | toolbar buttons | 새 프로젝트, 새 할 일 | actions | yes | `buttons/content/ensure-that-each-button-clearly-communicates` | [HIG transfer] |
| S02 | row progress | {M}개 중 {K}개 완료 | status text beside the gauge (8개 중 3개 완료) | yes | `gauges/best-practices/write-succinct-labels-that-describe-the` | [HIG transfer] |
| S02 | row, no tasks | 할 일이 아직 없어요 | status | yes | `design-principles/simplicity/include-just-whats-necessary` | [HIG] |
| S02 | row, all done | 모두 끝냈어요 | status | yes | `design-principles/delight/identify-the-emotion-you-want-to` | [HIG] |
| S02 | row members, up to 3 | {이름}, {이름} | who is in it (나, 민지) | yes | `lists-and-tables/content/keep-item-text-succinct-so-row` | [HIG transfer] |
| S02 | row members, 4 or more | {N}명 | count | yes | same | [HIG transfer] |
| S02 | gauge accessible name | ‘{이름}’ 프로젝트 진행도 (value text: {M}개 중 {K}개 완료) | meter name | n/a | `voiceover/descriptions/provide-alternative-labels-for-all-key` | [HIG] |
| S02 | empty, sentence | 프로젝트는 할 일을 한곳에 모아 둬요 | what a project is | yes | `writing/best-practices/provide-clear-next-steps-on-any` | [HIG] |
| S02 | empty, button | 새 프로젝트 | next step | yes | same | [HIG] |

### S03 프로젝트 상세
| Screen | Element | Text | Role | Fits without truncation? | Rule IDs | Label |
|---|---|---|---|---|---|---|
| S03 | title | {프로젝트 이름} | names the screen; long names are cut in the middle with a tooltip on regular | wraps up to 2 lines at large text | `toolbars/titles/write-a-concise-title` | [HIG transfer] |
| S03 | toolbar buttons | 편집, 새 할 일 | actions | yes | `toolbars/actions/make-sure-the-meaning-of-each` | [HIG transfer] |
| S03 | progress | {M}개 중 {K}개 완료 | status | yes | `gauges/best-practices/write-succinct-labels-that-describe-the` | [HIG transfer] |
| S03 | filter label | 담당자 | pop-up button name | yes | `pop-up-buttons/best-practices/give-people-a-way-to-predict` | [HIG transfer] |
| S03 | filter value, all | 담당자: 모두 | pop-up label | yes | `settings/task-specific-options/when-possible-prefer-letting-people-modify` | [HIG transfer] |
| S03 | filter value, a person | 담당자: {이름} | pop-up label | yes | same | [HIG transfer] |
| S03 | filter menu items | 모두, 나, {이름} | options | yes | same | [HIG transfer] |
| S03 | members line | 구성원: {이름}, {이름} | who is in it | wraps | `design-principles/simplicity/include-just-whats-necessary` | [HIG transfer] |
| S03 | row meta | {담당자 이름} · {마감일} | second line | wraps | `lists-and-tables/content/keep-item-text-succinct-so-row` | [HIG transfer] |
| S03 | done section | 끝낸 일 {N}개 | disclosure label | yes | `disclosure-controls/disclosure-triangles/provide-a-descriptive-label-when-using` | [HIG transfer] |
| S03 | empty, sentence | 이 프로젝트에 할 일이 아직 없어요 | state | yes | `writing/best-practices/provide-clear-next-steps-on-any` | [HIG] |
| S03 | empty, button | 새 할 일 | next step | yes | same | [HIG] |
| S03 | filter finds nothing | 이 담당자의 할 일이 없어요 | state | yes | same | [HIG] |
| S03 | filter finds nothing, button | 필터 해제 | next step | yes | same | [HIG] |
| S03 | all done | 모두 끝냈어요 | state, no celebration | yes | `design-principles/delight/identify-the-emotion-you-want-to` | [HIG] |
| S03 | project not found | 이 프로젝트를 찾을 수 없어요 | error | yes | `writing/best-practices/write-clear-error-messages` | [HIG] |
| S03 | project not found, button | 프로젝트 목록 | next step | yes | same | [HIG] |

### S04 할 일 상세
| Screen | Element | Text | Role | Fits without truncation? | Rule IDs | Label |
|---|---|---|---|---|---|---|
| S04 | bar title (compact) | 할 일 | names the screen | yes | `toolbars/titles/write-a-concise-title` | [HIG transfer] |
| S04 | title field label | 제목 | field name (visible) | yes | `text-fields/best-practices/show-a-hint-in-a-text` | [HIG] |
| S04 | title error | 제목을 적어 주세요 | validation | yes | `entering-data/best-practices/dynamically-validate-field-values` | [HIG] |
| S04 | due date label | 마감일 | field name | yes | `entering-data/best-practices/be-clear-about-the-data-you` | [HIG] |
| S04 | due date values | 오늘, 내일, 11월 6일 (금), 마감일 없음 | pop-up value | yes | `pop-up-buttons/best-practices/provide-a-useful-default-selection` | [HIG] |
| S04 | due date, overdue | 11월 2일 (월) · 2일 지났어요 | value with wording | wraps | `color/inclusive-color/avoid-relying-solely-on-color-to` | [HIG] |
| S04 | due date menu | 오늘, 내일, 다음 주 (11월 9일), 마감일 없음, 날짜 고르기… | options | yes | `entering-data/best-practices/when-possible-offer-choices-instead-of` | [HIG] |
| S04 | project label | 프로젝트 | field name | yes | same | [HIG] |
| S04 | assignee label | 담당자 | field name | yes | same | [HIG] |
| S04 | note label | 메모 | field name | yes | `text-views/best-practices/use-a-text-view-when-you` | [HIG] |
| S04 | note placeholder | 메모를 남겨 보세요 | hint | yes | `text-fields/best-practices/show-a-hint-in-a-text` | [HIG] |
| S04 | menu button name | 더 보기 | icon-button name | yes | `voiceover/descriptions/provide-alternative-labels-for-all-key` | [HIG] |
| S04 | menu item | 삭제 | action | yes | `buttons/content/try-to-associate-familiar-actions-with` | [HIG] |
| S04 | close pane (regular) | 상세 닫기 | icon-button name | yes | `toolbars/navigation/use-the-standard-back-and-close` | [HIG transfer] |
| S04 | task not found | 이 할 일을 찾을 수 없어요 | error | yes | `writing/best-practices/write-clear-error-messages` | [HIG] |
| S04 | task not found, button | 목록으로 | next step (compact: the Back button does the same) | yes | same | [HIG] |

### S05 빠른 추가
| Screen | Element | Text | Role | Fits without truncation? | Rule IDs | Label |
|---|---|---|---|---|---|---|
| S05 | sheet / popover title | 새 할 일 | names the task | yes | `sheets/best-practices/provide-an-alternative-to-the-done` | [HIG transfer] |
| S05 | title field label | 제목 | field name | yes | `text-fields/best-practices/show-a-hint-in-a-text` | [HIG] |
| S05 | title field placeholder | 할 일을 적어 주세요 | hint | yes | same | [HIG] |
| S05 | due date label / project label / assignee label | 마감일 / 프로젝트 / 담당자 | field names | yes | `entering-data/best-practices/be-clear-about-the-data-you` | [HIG] |
| S05 | primary button | 추가 | action (Done role; also the Return key label) | yes | `virtual-keyboards/best-practices/consider-customizing-the-return-key-type` | [HIG] |
| S05 | secondary button | 취소 | leaves, keeps a draft | yes | `modality/best-practices/always-give-people-an-obvious-way` | [HIG] |
| S05 | empty-title hint | 제목을 적어 주세요 | why 추가 is disabled | yes | `feedback/best-practices/show-people-when-a-command-cant` | [HIG] |
| S05 | swipe-down action sheet title | 작성 중인 내용이 있어요 | what is at stake | yes | `sheets/platform-considerations/ios-ipados/support-swiping-to-dismiss-a-sheet` | [HIG] |
| S05 | swipe-down choices | 초안 지우기 (destructive) · 계속 쓰기 (cancel) | action sheet | yes | `action-sheets/best-practices/if-necessary-provide-a-cancel-button` | [HIG] |

### S06 프로젝트 만들기·편집
| Screen | Element | Text | Role | Fits without truncation? | Rule IDs | Label |
|---|---|---|---|---|---|---|
| S06 | sheet title, create | 새 프로젝트 | names the task | yes | `sheets/best-practices/provide-an-alternative-to-the-done` | [HIG transfer] |
| S06 | sheet title, edit | 프로젝트 편집 | names the task | yes | same | [HIG transfer] |
| S06 | name label | 이름 | field name | yes | `text-fields/best-practices/show-a-hint-in-a-text` | [HIG] |
| S06 | name placeholder | 프로젝트 이름 | hint | yes | same | [HIG] |
| S06 | name error | 이름을 적어 주세요 | validation | yes | `entering-data/best-practices/dynamically-validate-field-values` | [HIG] |
| S06 | duplicate note | 같은 이름의 프로젝트가 이미 있어요 | note, allowed | wraps | `writing/best-practices/write-clear-error-messages` | [HIG] |
| S06 | members section | 구성원 | group name | yes | `lists-and-tables/best-practices/provide-appropriate-feedback-when-people-select` | [HIG] |
| S06 | members link | 구성원 관리 | goes to S09 | yes | `sheets/best-practices/display-only-one-sheet-at-a` | [HIG] |
| S06 | buttons, create | 취소 · 만들기 | leading cancel, trailing primary | yes | `alerts/buttons/create-succinct-logical-button-titles` | [HIG transfer] |
| S06 | buttons, edit | 취소 · 저장 | leading cancel, trailing primary | yes | same | [HIG transfer] |
| S06 | delete button (edit only) | 프로젝트 삭제 | destructive, plain | yes | `buttons/role/dont-assign-the-primary-role-to` | [HIG] |
| S06 | swipe-down action sheet title | 변경한 내용이 있어요 | what is at stake | yes | `sheets/platform-considerations/ios-ipados/support-swiping-to-dismiss-a-sheet` | [HIG] |
| S06 | swipe-down choices | 변경 취소 (destructive) · 계속 편집 (cancel) | action sheet | yes | `action-sheets/best-practices/if-necessary-provide-a-cancel-button` | [HIG] |

### S07 검색
| Screen | Element | Text | Role | Fits without truncation? | Rule IDs | Label |
|---|---|---|---|---|---|---|
| S07 | title | 검색 | names the screen | yes | `toolbars/titles/write-a-concise-title` | [HIG transfer] |
| S07 | field placeholder | 할 일과 프로젝트 검색 | hint and scope | yes | `searching/best-practices/clearly-display-the-current-scope-of` | [HIG transfer] |
| S07 | field accessible name | 검색 | field name | yes | `voiceover/descriptions/provide-alternative-labels-for-all-key` | [HIG] |
| S07 | clear button name | 검색어 지우기 | icon-button name | yes | same | [HIG] |
| S07 | cancel (compact) | 취소 | action | yes | `search-fields/platform-considerations/ios/search-as-an-inline-field/place-search-as-an-inline-field` | [HIG transfer] |
| S07 | recent header | 최근 검색 | group name | yes | `search-fields/best-practices/consider-showing-suggested-search-terms` | [HIG transfer] |
| S07 | recent clear | 지우기 | action (aria-label: 최근 검색 지우기) | yes | `searching/best-practices/take-privacy-into-consideration-before-displaying` | [HIG transfer] |
| S07 | nothing typed, no recents | 할 일이나 프로젝트 이름을 적어 보세요 | next step | yes | `writing/best-practices/provide-clear-next-steps-on-any` | [HIG] |
| S07 | result sections | 할 일 {N}개 · 프로젝트 {N}개 | group names with counts | yes | `layout/visual-hierarchy/group-related-items-to-clearly-express` | [HIG transfer] |
| S07 | no results, title | ‘{검색어}’ 검색 결과가 없어요 | state | wraps | `writing/best-practices/provide-clear-next-steps-on-any` | [HIG] |
| S07 | no results, hint | 철자를 확인하거나 새 할 일로 추가해 보세요. 휴지통은 검색에 포함되지 않아요. | next step and scope | wraps | `searching/best-practices/clearly-display-the-current-scope-of` | [HIG] |
| S07 | no results, button | ‘{검색어}’ 새 할 일로 추가 | next step | wraps | `writing/best-practices/be-action-oriented` | [HIG] |

### S08 휴지통
| Screen | Element | Text | Role | Fits without truncation? | Rule IDs | Label |
|---|---|---|---|---|---|---|
| S08 | title | 휴지통 | names the screen | yes | `toolbars/titles/write-a-concise-title` | [HIG transfer] |
| S08 | count | 항목 {N}개 | title-area count | yes | `lists-and-tables/content/keep-item-text-succinct-so-row` | [HIG transfer] |
| S08 | row type | 할 일 / 프로젝트 | type label | yes | `color/inclusive-color/avoid-relying-solely-on-color-to` | [HIG transfer] |
| S08 | row meta | 오늘 삭제 · 어제 삭제 · 11월 2일 삭제 | when deleted | yes | `lists-and-tables/content/keep-item-text-succinct-so-row` | [HIG transfer] |
| S08 | project row meta | 할 일 {N}개 포함 · {삭제 시점} | what comes back with it | wraps | `undo-and-redo/best-practices/help-people-predict-the-results-of` | [HIG transfer] |
| S08 | row button | 복원 | action | yes | `buttons/content/ensure-that-each-button-clearly-communicates` | [HIG transfer] |
| S08 | row menu items | 복원 · 영구 삭제 | actions | yes | `context-menus/best-practices/always-make-context-menu-items-available` | [HIG transfer] |
| S08 | toolbar | 휴지통 비우기 | action | yes | `alerts/buttons/create-succinct-logical-button-titles` | [HIG transfer] |
| S08 | after permanent delete (status) | 영구 삭제했어요 | result, no undo | yes | `design-principles/familiarity/provide-clear-feedback` | [HIG] |
| S08 | empty, title | 휴지통이 비어 있어요 | state | yes | `writing/best-practices/provide-clear-next-steps-on-any` | [HIG] |
| S08 | empty, sentence | 삭제한 할 일과 프로젝트가 여기에 와요 | what the place is for | yes | same | [HIG] |

### S09 설정
| Screen | Element | Text | Role | Fits without truncation? | Rule IDs | Label |
|---|---|---|---|---|---|---|
| S09 | title | 설정 | names the screen | yes | `toolbars/titles/write-a-concise-title` | [HIG transfer] |
| S09 | section | 구성원 | group name | yes | `settings/best-practices/minimize-the-number-of-settings-you` | [HIG] |
| S09 | add field label | 구성원 이름 | field name | yes | `text-fields/best-practices/show-a-hint-in-a-text` | [HIG] |
| S09 | add field placeholder | 이름 | hint | yes | same | [HIG] |
| S09 | add button | 추가 | action (aria-label: 구성원 추가) | yes | `writing/best-practices/be-action-oriented` | [HIG] |
| S09 | name errors | 이름을 적어 주세요 · 같은 이름이 이미 있어요 | validation | yes | `entering-data/best-practices/dynamically-validate-field-values` | [HIG] |
| S09 | rename button name | ‘{이름}’ 이름 바꾸기 | icon-button name | wraps in the name only | `voiceover/descriptions/provide-alternative-labels-for-all-key` | [HIG] |
| S09 | remove button name | ‘{이름}’ 구성원 삭제 | icon-button name | same | same | [HIG] |
| S09 | section | 백업 | group name | yes | `design-principles/responsibility/be-fully-transparent-about-what-your` | [HIG] |
| S09 | storage note, line 1 | 데이터는 이 브라우저에만 저장돼요. | honest storage | wraps | `design-principles/responsibility/be-fully-transparent-about-what-your` | [HIG] |
| S09 | storage note, line 2 | 내보낸 파일로 다른 곳에 보관할 수 있어요. | next step | wraps | `design-principles/responsibility/keep-peoples-information-safe` | [HIG] |
| S09 | buttons | 내보내기 · 가져오기 | actions | yes | `buttons/content/ensure-that-each-button-clearly-communicates` | [HIG] |
| S09 | export result | 내보냈어요 · haru-2026-11-04.json | confirmation with the file name | wraps | `feedback/best-practices/when-it-makes-sense-confirm-that` | [HIG] |
| S09 | import progress label | 가져오는 중 | progress label | yes | `progress-indicators/best-practices/if-its-helpful-display-a-description` | [HIG] |
| S09 | import result | 가져왔어요. 할 일 {N}개, 프로젝트 {M}개 | confirmation | wraps | `feedback/best-practices/when-it-makes-sense-confirm-that` | [HIG] |
| S09 | row (compact) | 휴지통 | opens S08 | yes | `layout/adaptability/size-classes/keep-functionality-the-same-as-size` | [HIG transfer] |
| S09 | destructive button | 모든 데이터 삭제 | action | yes | `buttons/role/dont-assign-the-primary-role-to` | [HIG] |

## Confirmations (D01, owner answers applied)
Regular = alert. Compact = action sheet. “Default” = the button Return presses. “No default” = no button is highlighted or focused when it opens.

| Situation | Class | Title | Message | Buttons (order as shown) | Style and default | Rule IDs |
|---|---|---|---|---|---|---|
| Empty trash | regular | 휴지통의 항목 {N}개를 영구 삭제할까요? | 삭제한 항목은 되돌릴 수 없어요. | 취소 · 휴지통 비우기 | **Normal style**, 휴지통 비우기 is the default (Return confirms), 취소 not default, **no caution symbol** | `alerts/buttons/use-the-destructive-style-to-identify` `alerts/platform-considerations/macos/use-a-caution-symbol-sparingly` |
| Empty trash | compact | 휴지통의 항목 {N}개를 영구 삭제할까요? | 삭제한 항목은 되돌릴 수 없어요. | 휴지통 비우기 · 취소 | action sheet, **destructive style** on 휴지통 비우기, 취소 at the bottom | `action-sheets/best-practices/make-destructive-choices-visually-prominent` |
| Delete one task forever | regular | ‘{제목}’ 할 일을 영구 삭제할까요? | 되돌릴 수 없어요. | 취소 · 영구 삭제 | follows Empty Trash: normal style, 영구 삭제 default | `alerts/buttons/use-the-destructive-style-to-identify` |
| Delete one task forever | compact | ‘{제목}’ 할 일을 영구 삭제할까요? | 되돌릴 수 없어요. | 영구 삭제 · 취소 | action sheet, destructive style | `action-sheets/best-practices/make-destructive-choices-visually-prominent` |
| Delete one project forever | regular / compact | ‘{이름}’ 프로젝트와 할 일 {N}개를 영구 삭제할까요? | 되돌릴 수 없어요. | as above | as above | same |
| Delete all data | regular | 이 브라우저의 모든 데이터를 삭제할까요? | 할 일 {N}개, 프로젝트 {M}개, 구성원 {K}명이 모두 사라지고 되돌릴 수 없어요. 먼저 내보내기로 파일을 저장해 두세요. | 취소 · 모든 데이터 삭제 | alert, **destructive style on 모든 데이터 삭제, no default button** | `alerts/buttons/if-theres-a-destructive-action-include` |
| Delete all data | compact | same | same | 모든 데이터 삭제 · 취소 | action sheet, destructive style, no default | same |
| Import found valid | regular | 가져온 파일로 어떻게 할까요? | 파일에는 할 일 {N}개, 프로젝트 {M}개가 있어요. 바꾸면 지금 데이터가 사라져요. | 바꾸기 · 합치기 · 취소 | alert, **바꾸기 destructive**, no default button | `alerts/buttons/create-succinct-logical-button-titles` |
| Import found valid | compact | same | same | 바꾸기 · 합치기 · 취소 | action sheet, 바꾸기 destructive on top, no default | `action-sheets/best-practices/if-necessary-provide-a-cancel-button` |

## Errors and warnings
| Situation | Message (what happened, what to do) | Rule IDs |
|---|---|---|
| Import: not a 하루 file | 이 파일은 하루에서 내보낸 파일이 아니에요. 하루에서 내보낸 .json 파일을 골라 주세요. 지금 데이터는 그대로예요. | `writing/best-practices/write-clear-error-messages` |
| Import: damaged | 파일을 읽을 수 없어요. 파일이 손상됐을 수 있어요. 다시 내보낸 파일을 골라 주세요. 지금 데이터는 그대로예요. | same |
| Import: newer version | 더 새로운 버전의 하루에서 만든 파일이에요. 하루를 새로 고친 뒤 다시 시도해 주세요. 지금 데이터는 그대로예요. | same |
| Storage full / blocked / cleared | see S00 banner strings | same |
| Empty title (S04, S05) | 제목을 적어 주세요 | `entering-data/best-practices/dynamically-validate-field-values` |
| Empty or duplicate member name | 이름을 적어 주세요 · 같은 이름이 이미 있어요 | same |
| Task / project not found | 이 할 일을 찾을 수 없어요 · 이 프로젝트를 찾을 수 없어요 | `design-principles/agency/help-people-recover-from-mistakes` |

## Permission requests
None in the first release (no notifications, camera, location or sign-in) `privacy/requesting-permission/request-permission-only-when-your-app`. The browser's own file chooser and download dialogs carry their own text.

## Consistency checks
- One term per concept: see the Terms table. 삭제 (to trash) vs 영구 삭제 (for good) vs 지우기 (clearing recent searches only); 완료 (state) vs 끝낸 일 (group); 내보내기 / 가져오기 / 백업 (section) `writing/best-practices/give-clear-guidance-and-use-consistent`.
- Every word needed? Cut: “정말”, “잠시만요”, “!” everywhere, “~하시겠습니까”; undo messages give the result and nothing else; banner has one heading, one sentence, one action `design-principles/simplicity/be-concise`.
- Tone read from several viewpoints: “지난 할 일” and “지났어요” name a fact without blame or alarm; “다음 주 (11월 9일)” shows the date so no one has to guess which Monday; “나” works for the person using this browser and is renamable `inclusion/welcoming-language/consider-the-tone-of-your-copy`.
- Every icon-only control has a name in S00 or its screen table `voiceover/descriptions/provide-alternative-labels-for-all-key`.
- Length: the longest compact buttons are “휴지통 비우기” and “모든 데이터 삭제” (7 and 8 syllables) and fit a 390 px action sheet; the long messages (banner, import errors, delete-all) wrap and must not be truncated at 200 percent text.
- AI-generated text: none in the product `generative-ai/transparency/communicate-where-your-app-uses-ai`.

## Why-chain (one wording choice)
- **Why-chain:** A deleted task needs to be named so the person can trust the undo, but names end in unknown sounds → Clarity, Consistency → put a fixed noun after the quoted name → “‘{제목}’ 할 일을 삭제했어요” → `undo-and-redo/best-practices/show-the-results-of-an-undo` `writing/getting-started/be-clear` → [HIG]

## Open [HIG none] questions
- Korean politeness level beyond the owner's assent (해요체 everywhere, including confirmations; some products switch to 합쇼체 for destructive steps).
- The export file name pattern (`haru-YYYY-MM-DD.json`) and whether it should be Korean.
- Whether 나 should be shown as the real name once accounts exist.
- Character limits for project and member names (no limit set; long names wrap or are cut in the middle with a tooltip).

