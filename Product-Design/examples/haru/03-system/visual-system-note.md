# Visual system note: 하루 (Haru), web app

**Stage:** 4 Express (`references/workflow.md#express`). Contract: `tests/e2e/01-plan/*`, `tests/e2e/02-design/*`. Implementation: `theme.css` (loads after the kit). Labels: [HIG], [HIG transfer], [HIG none], [House].
Owner answers applied (stage 2 questions): (1) confirmation styles per size class, see `state-and-feedback-table.md`; (2) project members stay; (3) no automatic trash purge.

## The feeling (craft pass step 1)
**차분함 (calm) and 또렷함 (clear).** The brief asks for calm and focused: few things on screen, one next action, no scores or red counts `design-principles/delight/identify-the-emotion-you-want-to`. What carries it, in order of weight:

| Means | How it carries the feeling | Where |
|---|---|---|
| Type contrast | One large Bold title, then plain Medium task titles, then quiet secondary meta. Three clear levels, nothing in between | every list screen |
| Color restraint | One accent (indigo) on four things only: the primary button, the checked circle, selection and focus. Overdue, progress and status get no color of their own | whole app |
| Spacing rhythm | 4 px scale, 12 px inside a row, 24 px between sections: air does the grouping, not boxes or lines | S01, S03, S07, S08 |
| Flat content layer | Task rows sit directly on the page with hairline separators; no cards behind text | S01, S03, S07, S08 |
| Materials | Glass only on the bars that float over the list, nothing else | tab bar, navigation bar |
| Motion | Press feedback, the check, the disclosure and the sheet. Nothing moves to decorate, and it all stops under Reduce Motion | whole app |

Delight here is finishing a task: the circle fills, the title is struck through, the section count goes down. No confetti, no streak `design-principles/delight/dont-mistake-delight-for-decoration`.

## Type
- **Font:** Pretendard Variable [House 1]; Korean lines break between words (`word-break: keep-all` is already in the kit base). Weights used: 400, 500, 600, 700. No weight under 400 for any text `accessibility/vision/bear-in-mind-that-font-weight`.
- **Scale decision: iOS scale on compact; macOS scale (`.hk-mac` density) on regular when the pointer is fine.** [HIG transfer] `media/web.md` "Choosing a type scale" puts app-like interfaces on the macOS scale. 하루 is app-like for its desk sessions, and the three-pane layout (sidebar, list, detail) only fits at 744 to 1000 px with the 13 px scale. But regular width also includes touch tablets in portrait (744 px and wider). So density follows input, not width alone:
  - Compact (below 744 px): iOS Large scale, 44 px targets.
  - Regular and `(pointer: fine)`: add class `hk-mac` to `<html>`: macOS scale, 28 px targets (20 px minimum).
  - Regular and `(pointer: coarse)` (iPad portrait, touch laptops): the regular layout with the iOS scale and 44 px targets, because 28 px is the HIG touch minimum, not the default `accessibility/mobility/offer-sufficiently-sized-controls`. The sidebar starts hidden there (see Spacing).
  - The build sets the class with one line: `matchMedia('(min-width: 744px) and (pointer: fine)')` toggles `hk-mac` on `<html>` and re-evaluates on change. The kit has no such switch yet.
  - Never both scales on one screen: the class is set on `<html>`, so a screen has exactly one.
- **One scale per page type** (web guide: do not mix) `typography/conveying-hierarchy/adjust-font-weight-size-and-color`. Text stays resizable: all sizes are rem (kit) `accessibility/vision/support-larger-text-sizes`.
- **Product floor [House]:** smallest text people must read is 13 px on compact (Footnote) and 12 px on regular (Callout). HIG minimums are 11 px (iOS) and 10 px (macOS); Korean glyphs at 10 px are too small for hints and errors. Footnote and Caption on the macOS scale are not used for information. `typography/ensuring-legibility/use-font-sizes-that-most-people`
- **Text roles** (tokens in `theme.css`; size/leading in px):

| Role | Token | Compact (iOS Large) | Regular (macOS density) | Used for |
|---|---|---|---|---|
| Screen title | `--t-screen-title` | Large Title 34/41, 700 | Large Title 26/32, 700 | S01, S02, S07, S08, S09 titles; S01 shows the date under it in Subhead/Callout, secondary |
| Task title | `--t-task-title` | Title 2 22/28, 700 | Title 1 22/26, 700 | S04 title field (same 22 px at both classes) |
| Section header | `--t-section` | Headline 17/22, 600 | Headline 13/16, 700 | 오늘, 지난 할 일, 오늘 끝낸 일, 구성원, 백업, 할 일, 프로젝트 |
| Row title | `--t-row-title` | Body 17/22, 500 | Body 13/16, 500 | task and project names in rows, field values, menu items |
| Row meta | `--t-row-meta` | Subhead 15/20, 400, `--label-2` | Callout 12/15, 400, `--label-2` | project, assignee, date, "8개 중 3개 완료", counts |
| Hint, error, banner body | `--t-hint` | Footnote 13/18 | Callout 12/15 | hints, validation, banner, undo message body |
| Tab label | `--t-tab` | Caption 2 11/13, 500 | not used (sidebar uses Row title) | compact tab bar only |
| Button label | kit | Body, 700 on filled | Body 13, 700 on filled | all `.hk-btn` |
| Sheet and bar titles | kit | Headline | Headline | S05, S06, alerts |

- **Hierarchy method:** size, weight and color together, never one alone `typography/conveying-hierarchy/adjust-font-weight-size-and-color`. Screen title 34 Bold black → row title 17 Medium black → meta 15 Regular gray `#6C6C70`: neighboring levels differ in at least two of the three. Counts and dates use `.hh-num` (tabular figures) so columns of dates do not jitter.
- **Larger text:** rows wrap (no truncation at large text) `layout/adaptability/be-prepared-for-text-size-changes`; at 200 percent the meta line wraps under the title and the gauge is dropped on compact only if rows crowd (D05 revisit), the text "8개 중 3개 완료" stays.

## Color
Chosen from the HIG system colors (`tokens.md`). Contrast from `scripts/contrast.mjs`, minimums from the HIG table: 4.5:1 up to 17 pt, 3:1 for 18 pt or Bold `accessibility/vision/strive-to-meet-color-contrast-minimum`.

### Accent: indigo
| Role | Kit token → value light / dark | Meaning (one only) | Light and dark checked | Rule IDs |
|---|---|---|---|---|
| Accent tint | `--accent` → `#6155F5` / `#6D7CFF` | Primary action, checked state, selection, focus | on white 5.08:1; on black 5.97:1; on `#2C2C2E` 3.96:1 (so only icons, rings and Bold or 18 pt+ text, never small text) | `branding/best-practices/apply-your-apps-accent-color-judiciously` |
| Accent as small text | `--accent-text` → `#564ADE` / `#A7AAFF` | Plain buttons, links, selected tab label | white 6.12:1; gray-6 5.48:1; dark on black 9.83:1, on `#2C2C2E` 6.52:1, on `#1C1C1E` 7.97:1 | same |
| Accent fill | `--accent-fill` → `#564ADE` / `#6D7CFF` | Fill behind a white Bold label: 새 할 일, 추가, 만들기, 저장, checked circle | light white-on-fill 6.12:1; dark 3.51:1, passes only as Bold (3:1) | house 10 |

**Why indigo, not the kit's blue or green (the one decision that shapes the look most; craft pass step 3):**

| Variant | Light fill + white | Dark fill + white (Bold) | Dark small-text accent | Verdict |
|---|---|---|---|---|
| A Blue (kit default) | 4.57:1 | 3.23:1 | 9.75:1 on black | Passes. Looks like every default app and like a link color; weakest identity |
| B Indigo | 6.12:1 | 3.51:1 | 9.83:1 on black | Passes with the most margin in light; calmer and cooler than blue; its plain tint already reaches 5.08:1 on white |
| C Green | 4.54:1 | 2.02:1 (fails even the Bold 3:1) | 11.41:1 | Fails house 10 in dark; also green already means success |

[House] choice B. The three were compared by computed contrast and by meaning; they were **not rendered side by side** because no page exists at this stage. The build stage must render S01 once with each accent and confirm the choice at real size (craft pass step 3) before the theme is frozen.

### Status colors (each has one meaning)
| Role | Kit token → light / dark | Meaning | Contrast | Rule |
|---|---|---|---|---|
| Destructive | `--destructive`, `--destructive-text`, `--destructive-fill` → `#E9152D` / `#FF6165` text; fill `#E9152D` / `#FF4245` | A destructive choice (삭제, 영구 삭제, 바꾸기, 모든 데이터 삭제) | text on white 4.55:1; on `#2C2C2E` dark 4.74:1; dark fill + white Bold 3.43:1 (Bold, 3:1) | house 10 |
| Warning | `--warning` → `#C55300` / `#FFA056` | A storage problem (banner icon only) | icon on white 4.55:1; dark on `#2C2C2E` 6.91:1 | `color/best-practices/avoid-using-the-same-color-to` |
| Success | `--success` → `#008932` / `#4AD968` | A confirmed result (icon in "내보냈어요", "가져왔어요") | white 4.54:1; dark on `#2C2C2E` 7.57:1 | same |

**Surface rule found while checking:** warning, success and destructive colors as **text** fail on gray-6 (4.06 to 4.08:1) and secondary text fails on gray-5 fills (4.16:1). So: status color is used for an **icon** (needs 3:1) or for text only on `--bg`, `--bg-cell` and `--bg-elevated`; the banner and messages keep `--label` text and color only the icon. Destructive text buttons (모든 데이터 삭제, 프로젝트 삭제) sit inside a white cell or on `--bg`, not directly on `--bg-grouped`. Secondary text never sits on `--fill`.
- **Overdue gets no color** (D16). The section title 지난 할 일, the date text and the wording "지났어요" carry it.
- **Progress gets no color.** The gauge fill is `--label-2` (4.16:1 on the light track, 4.12:1 on the dark track, graphics need 3:1), so it cannot compete with the first task (S03 visual-order conflict, fixed this way).
- **Color never works alone** `color/inclusive-color/avoid-relying-solely-on-color-to`: checked = filled shape + check glyph + strike-through + count; destructive = word 삭제 + position; warning = icon shape + bold heading; selection = tint + `aria-current`; filtered list = text "담당자: 나"; focus = 3 px ring.
- **Projects have no color** (D10).

### Neutrals (house 9) and surfaces
| Use | Token | Light | Dark |
|---|---|---|---|
| Primary text | `--label` | `#000000` | `#FFFFFF` |
| Secondary text, meta | `--label-2` | `#6C6C70` (5.22:1 on white, 4.68:1 on gray-6) | `#AEAEB2` (9.49:1 black, 6.30:1 on `#2C2C2E`) |
| Tertiary: icons, the empty circle, disabled | `--label-3` | `#8E8E93` (3.26:1) | `#8E8E93` |
| Separator | `--separator` | `#D1D1D6` | `#3A3A3C` |
| Page, list panes (S01, S03, S07, S08) | `--bg` | `#FFFFFF` | `#000000` |
| Grouped pages and forms (S04 metadata, S06, S09) | `--bg-grouped` with `--bg-cell` cells | `#F2F2F7` / `#FFFFFF` | `#1C1C1E` / `#2C2C2E` |
| Sheets, popovers, alerts, toast, banner | `--bg-elevated` | `#FFFFFF` | `#2C2C2E` |
| Row hover (regular) | `--row-hover` = `--fill-2` | `#F2F2F7` | `#1C1C1E` |
| Row selected (regular) | `--row-selected` = `--accent-soft` | 14% accent | 14% accent |
- **Surface logic:** task lists are the content layer, flat on `--bg`. Forms and settings are grouped cells on `--bg-grouped`. Overlays are `--bg-elevated`. `dark-mode/platform-considerations/ios-ipados/prefer-the-system-background-colors`

## Appearance
- Follows the system; no in-app toggle `dark-mode/best-practices/avoid-offering-an-app-specific-appearance` (the kit's `data-theme` is for testing only).
- Both appearances were checked by computed contrast above (every text pair, the checked circle, the gauge, the status icons). Not yet seen on screen: the build review must look at S01, S03, S04, S09 in both appearances `dark-mode/best-practices/ensure-that-your-app-looks-good`.
- Increased contrast: the kit swaps `--accent` to the text value; `theme.css` re-declares that rule after its own `--accent`, otherwise the override would cancel it. Reduced transparency: glass falls back to `--bg-elevated` (kit). Reduced motion: kit durations drop to about 0.

## Filled buttons (house 10)
- One filled accent button per view (새 할 일 in the toolbar, or 추가/만들기/저장 in a sheet). Label white, Bold 700, fill `--accent-fill`. Light 6.12:1, dark 3.51:1 (Bold). `buttons/style/in-general-use-a-button-that` `buttons/role/dont-assign-the-primary-role-to`
- Destructive buttons are never filled in the primary position. A filled destructive button exists only inside the alert and action sheet as a text button (`hk-alert__btn--destructive`), and 프로젝트 삭제 / 모든 데이터 삭제 are plain.
- Plain, bordered and tinted styles carry everything else (취소, 편집, 새 프로젝트, 내보내기, 가져오기).

## Spacing and widths (house 11)
| Item | Value | Notes |
|---|---|---|
| Scale | 4, 8, 12, 16, 20, 24, 32, 48 | kit `--s-*`; nothing else |
| Page inset | 16 px compact, 24 px regular | `--gutter` |
| Row | 12 px above and below text, 4 px between title line and meta line | `--row-pad-y`, `--row-gap`; row height about 70 px compact (22 + 4 + 20 + 24), 59 px regular (16 + 4 + 15 + 24) |
| Sections | 24 px above a header, 8 px below | `--section-gap`, `--section-head-gap` |
| Blocks in S04 and S09 | 32 px | `--block-gap` |
| Around bezeled controls | 12 px | `accessibility/mobility/consider-spacing-between-controls-as-important` |
| Around unbezeled controls that sit apart | 24 px | 복원 and 영구 삭제 are never adjacent; 모든 데이터 삭제 is 32 px below 가져오기 |
| Targets | 44 px compact and coarse pointer; 28 px with `hk-mac` | never below 28 px / 20 px |
| App shell | at most 1200 px, centered, `--bg-grouped` outside | `--app-max` |
| Reading and form column | at most 720 px | S04 form, S09 sections, the note field |
| Sidebar / list / detail | 240 / 360 / min 360 px | `--w-sidebar`, `--w-list`, `--w-detail-min` |
| Sheet (S06 regular) / popover (S05 regular) | 480 / 360 px | `--w-sheet`, `--w-popover` |
| Size classes | compact below 744 px, regular from 744 px | `layout/adaptability/design-a-layout-that-adapts-gracefully` |
- **Sidebar auto-hide width (D07 left it to this stage):** below **960 px** (240 + 360 + 360) the sidebar hides and a `panel-left` button in the toolbar reveals it as an overlay; at 960 px and wider it is shown and can still be hidden by the person. On coarse pointers at regular width the sidebar starts hidden. [HIG none] for the number; derived from the three pane widths. `sidebars/platform-considerations/macos/consider-automatically-hiding-and-revealing-a` `sidebars/best-practices/consider-letting-people-hide-the-sidebar`
- Alignment: the completion button, title and meta share one leading edge per row; section headers align to the row text edge `layout/visual-hierarchy/align-elements-to-make-them-easier`.

## Icons
- Set: Lucide [House 2], from `assets/icons/lucide/` (102 icons available locally; names below all exist there unless marked). 24 px grid, round caps and joins, `currentColor`, em-sized next to text (kit `.hk-icon` is 1.25em; bar buttons 1.5rem) `icons.md` rules 1, 3, 15.
- **Stroke by adjacent text weight** (`icons.md` rule 2): next to 400 text 1.75; 500 text 2 (tab bar, row title icons); 600 text 2.25; 700 (filled button) 2.5; the check inside the filled circle 2.5. Tokens `--icon-stroke-*`. Calibrate by rendering. `icons/best-practices/in-general-match-the-weights-of`
- One color: `currentColor`, which is `--label-2` for meta icons and `--accent-text` for selected nav. Only status icons take a status color (warning, success), always beside text.
- Filled selected variants: not used. The selected tab or sidebar item is marked by tint, label weight and `aria-current`.
- **Accessibility labels** for every icon-only control are in `copy-sheet.md` `icons/best-practices/provide-alternative-text-labels-for-custom` `voiceover/descriptions/provide-alternative-labels-for-all-key`.
- Standard metaphors (`icons.md` table): Add `plus`, Delete `trash-2`, Done `check`, Cancel/Close `x`, Search `search`, Share/Export `share`, Rename `pencil`, More `ellipsis`, Calendar `calendar`, Folder `folder`, Account/User `user`.

| Screen | Action or item | Lucide | Shown as | Accessible name |
|---|---|---|---|---|
| Container | 오늘 tab / sidebar item | `calendar` | icon + text | 오늘 |
| Container | 프로젝트 tab / sidebar group | `folder` | icon + text | 프로젝트 |
| Container | 검색 tab / sidebar item | `search` | icon + text | 검색 |
| Container | 설정 tab / sidebar item | `settings` | icon + text | 설정 |
| Container, S08 | 휴지통 sidebar item (regular), row in S09 (compact) | `trash-2` | icon + text | 휴지통 |
| Container | Hide or show sidebar (regular, below 960 px or on demand) | `panel-left` | icon only | 사이드바 숨기기 / 사이드바 보기 |
| S03, S04, S08 compact | Back | `chevron-left` | icon + parent title | 뒤로, {부모 제목} |
| S04 regular | Close detail pane | `x` | icon only | 상세 닫기 |
| S01, S02, S03, S07 | 새 할 일 | `plus` | icon + text on regular; icon only on compact (prominent) | 새 할 일 |
| S02 | 새 프로젝트 | none (text button; `folder-plus` is not in the local set) | text | 새 프로젝트 |
| S03 | 편집 | none (text button) | text | 편집 |
| S01, S03, S07 rows | Completion button | CSS ring, `check` when on | icon | ‘{제목}’ 완료 (checkbox state read separately) |
| S01, S03, S07, S08, S02 rows | 더 보기 (the row menu button) | `ellipsis` | icon only | ‘{제목}’ 더 보기 |
| Row menus | 열기 | none | text | 열기 |
| Row menus, S02 | 편집 | `pencil` | icon + text | 편집 |
| Row menus, S04, S06 | 삭제 | `trash-2` | icon + text (destructive text) | 삭제 |
| S08 | 복원 | `rotate-ccw` | text button, icon + text in menu | 복원 |
| S08 | 영구 삭제 | `trash-2` | menu item | 영구 삭제 |
| S08 | 휴지통 비우기 | none (text) | text, plain | 휴지통 비우기 |
| S01, S03 | Done section disclosure | `chevron-right` (turns to down when open) | icon + text | 오늘 끝낸 일 {N}개 (state by `aria-expanded`) |
| S02, S09 | Row opens (disclosure indicator) | `chevron-right` | decorative | hidden |
| Toast | 실행 취소 | none (text button) | text | 실행 취소 |
| Toast | Close | `x` | icon only | 닫기 |
| S03 | 담당자 filter | `chevron-down` (kit select) | text + chevron | 담당자 |
| S04, S05 | 마감일 | `calendar` | leading icon + value | 마감일 |
| S04, S05, S06 | 프로젝트 | `folder` | leading icon + value | 프로젝트 |
| S04, S05 | 담당자 | `user` | leading icon + value | 담당자 |
| S06 | Member row checked | `check` | icon | hidden, state by `aria-checked` |
| S05, S06 | 취소 / 추가 / 만들기 / 저장 | none | text | same as text |
| S07 | Search field | `search` (kit) | icon in field | 검색 |
| S07 | Clear the field | `x` (kit) | icon only | 검색어 지우기 |
| S07 | 지우기 (recent searches) | none | text, plain | 최근 검색 지우기 |
| S09 | 구성원 추가 | `plus` | icon + text 추가 | 구성원 추가 |
| S09 | Rename member | `pencil` | icon only | ‘{이름}’ 이름 바꾸기 |
| S09 | Remove member | `trash-2` | icon only | ‘{이름}’ 구성원 삭제 |
| S09 | 내보내기 | `share` | icon + text | 내보내기 |
| S09 | 가져오기 | `download` | icon + text | 가져오기 |
| S09 | 모든 데이터 삭제 | none | text, plain, destructive color | 모든 데이터 삭제 |
| Banner | Storage problem | `triangle-alert` | icon + bold heading | 경고 (hidden label “저장 문제”) |
| S09 | “내보냈어요”, “가져왔어요” | `circle-check` | icon + text | hidden |
| S09 | Import failure | `circle-alert` | icon + text | hidden |
| S09 | Browser-only note | `info` | icon + text | hidden |
| Empty states | S01 / S03 task | `square-check-big` | one icon | hidden |
| Empty states | S02 / S07 / S08 | `folder` / `search` / `trash-2` | one icon | hidden |
- **Alerts and action sheets carry no icon**, including the destructive ones. For Empty Trash this follows the owner's answer and the HIG's own example; for the others a caution symbol would repeat the destructive style. `alerts/platform-considerations/macos/use-a-caution-symbol-sparingly`
- Gaps in the local Lucide set: no `circle` (the empty completion ring is drawn in CSS), no `folder-plus`, `calendar-check`, `list-checks`. None is needed; if the build wants `folder-plus`, fetch it with `scripts/icons.mjs fetch` and normalize.

## Glass, radii, motion
- **Glass [House 3] only where it floats over content:** the compact tab bar and the navigation bar (or toolbar) of a list while content scrolls beneath it, both classes. **Never:** sidebar, list rows, S04 form, sheets and popovers (opaque `--bg-elevated`), alerts, action sheets, the undo toast, the banner, the empty states. Regular variant only (no clear glass: there are no photos). The filled 새 할 일 button sits on the bar and is not glass. `materials/liquid-glass/dont-use-liquid-glass-in-the` `materials/liquid-glass/use-liquid-glass-effects-sparingly`
- **Radii (kit tokens, nested concentrically):** buttons and tags `--r-full` (capsule); grouped lists, fields, banner `--r-group` = 12; the highlight inside a group `--r-row-hl` = 8 (12 minus a 4 px inset); popover 18; sheet, alert 26. Gauge and completion circle are fully round. `toolbars/best-practices/prefer-using-standard-components-in-a`
- **Motion [House values from the kit]:** press 120 ms; the completion fill and check 120 ms; disclosure, gauge change, toast, alert 220 ms; sheet and action sheet rise 320 ms, one easing `cubic-bezier(.2,.8,.2,1)`. A completed row does **not** move (D09); it settles into the done section when the person leaves the screen. Every motion has a visible end state (filled circle, new count, row in place) so nothing depends on it `motion/best-practices/make-motion-optional` `motion/best-practices/add-motion-purposefully-supporting-the-experience`.
- No sound, no haptics [HIG none on the web].

## Brand
- The product name 하루 appears in the browser tab title and the empty-state sentence of S01; there is no launch screen, no logo bar and no tagline inside the app `branding/best-practices/avoid-using-a-launch-screen-as` `branding/best-practices/ensure-branding-always-defers-to-content`. The brand is carried by the single indigo accent and the quiet type, not by decoration.
- Standard components everywhere; the only custom ones are the completion button, the gauge, the banner and the undo message layout (no HIG component exists for them) `branding/best-practices/express-your-brand-with-familiar-components`.

## Kit mapping (what the build applies)
| Need | Kit part | Our change |
|---|---|---|
| Tokens | `hk-base.css` | `theme.css`: accent roles, product tokens, text roles |
| Shell: tab bar, sidebar, split, navigation bar, toolbar | nav group (README in progress; classes `hk-app`, `hk-tabbar`, `hk-sidebar`, `hk-navbar`, `hk-bar-btn`, `hk-bar-btn--prominent`) | none |
| Lists and rows, disclosure, table | nav group `hk-list`, `hk-row`, `hk-disclosure` | row padding and text roles from `theme.css` |
| Sheet (S05 compact, S06), popover (S05 regular), menus | nav group `hk-sheet`, `hk-popover`, `hk-menu` | none |
| Alert (regular), action sheet (compact only) | `hk-alert`, `hk-actionsheet` | use the action sheet only on compact: on regular the kit turns it into a popover, and D01 wants an alert there |
| Buttons, segmented (unused), text fields, text view, search, pop-up button, date input | controls group | none; no switch and no stepper and no slider in the product |
| Undo message | `HK.toast({ duration: 0 })` | the kit default is 8000 ms; D02 needs `0` (no timer). Omit `undoLabel` for the message-only toast after 복원 |
| Empty states | `hk-empty` | one icon, one action |
| Badges, tips, skeletons, charts, progress bar, ring | status group | not used (no unread counts, no tips, local data loads at once, no charts, progress is a ratio so the gauge replaces the bar) |
| Completion button, gauge, banner | none in the kit | new, built from tokens; semantics: checkbox with `aria-checked`, `<meter>` with a text label, `role="status"` region |

## Why-chain (key choice)
- **Why-chain:** People open 하루 several times a day to see today and finish it → Simplicity, Craft → restraint: one accent, flat rows, two type levels → indigo accent plus Medium row titles on flat `--bg`; density by input → `branding/best-practices/apply-your-apps-accent-color-judiciously` `typography/conveying-hierarchy/adjust-font-weight-size-and-color` `accessibility/vision/strive-to-meet-color-contrast-minimum` → [House] for the color and density choice, [HIG transfer] for the scale.

## Open [HIG none] questions
- Is indigo accepted by the owner, and does it look right at real size next to the other two variants (build stage check)?
- Sidebar auto-hide at 960 px, the 360 px list width and the 480 px sheet width are derived values; confirm after seeing them.
- Density by `pointer: fine` is a web mapping; the HIG ties density to platform, not to input.
- Whether the product floor (13 px compact, 12 px regular) should be higher for Korean text.
- Shortcut that opens 새 할 일 (also open in stage 3).

