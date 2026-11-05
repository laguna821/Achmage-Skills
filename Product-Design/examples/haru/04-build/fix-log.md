# Fix log: 하루 (Haru), build after the HIG review

Review: `tests/e2e/05-review/hig-review-report.md` (1 Blocker, 3 Major, 13 Minor; the report lists 17 numbered findings). Fixed on 2026-11-04. State found at the start of this run: the interrupted run had left `04-build` as the reviewed version (no `fix-log.md`, old `kit.css` and `kit.js`), so the work started from step 1.

## Kit update
- Copied the rebuilt `skill/apple-hig-design/assets/kit/kit.css` and `kit.js` over the build's copies (the skill files are untouched).
- Replaced with kit parts, keeping behavior:
  - completion button: `hh-check` is now `.hk-complete` (`data-hk="complete"`, `role="checkbox"`, `aria-checked`); the Space-key handler is gone (a native button).
  - gauge: `hh-gauge` is now `.hk-gauge--slim` with `data-value-text`, `data-empty-text`, `data-full-text`; the visible text comes from the kit (the label is visually hidden, the meter is named by it). The separate progress line is gone.
  - banner: `hh-banner` is now `.hk-banner--warning` with one `.hk-banner__action`; role `region` kept so it is not announced at load.
- Workarounds removed, with the documented option instead:
  - large-title override (hidden inline title, forced two-column grid on regular) → `data-show="always"` on each `h1.hk-navbar__large`.
  - discard intercept (capture handlers on both sheets) → `data-discard-ask="swipe"` on `#qa-sheet` and `#pj-sheet` (D06: Cancel and Escape close and keep the draft, only swipe-down asks). The draft survives because the app saves it on input.
  - Ctrl+Z capture handler → `shortcut: true` on the undo toast. Consequence: Ctrl+Z undoes the delete whose message is showing (one level); before, it undid several deletes in reverse order.
- Search field: the kit now keeps placeholder contrast (see finding 1).

## Findings

| # | Sev. | Finding | Change | Verified by |
|---|---|---|---|---|
| 1 | Blocker | S07 placeholder 4.16:1 | Rebuilt kit sets the placeholder to `--label-2` with opacity 1. Placeholder now 4.69:1 light (`#6C6C70` on `#F2F2F7`) and 7.69:1 dark. The audit found the same fault on the S09 member field (own input, dark 3.02:1); fixed in `app.css` with the same placeholder color. | Computed ratio on `#/search` at 1280, both appearances; audit with placeholder checks on 60 runs, 0 findings. |
| 2 | Major | D01 on regular | The owner's amendment is in `decisions.md`: empty trash and delete one forever use a normal-style alert where Return confirms (default button, focus on it, Cancel first); delete all and import replace keep destructive style with no default; compact action sheets keep destructive style. Code already matched; the note's wording now cites the amendment instead of "owner answer 1". | Keyboard at 1280: empty trash opens with focus on 휴지통 비우기 and `data-destructive` off; Return on 영구 삭제 deletes; delete-all opens with focus on the dialog and `data-destructive` on; Escape closes. Compact: sheets unchanged. |
| 3 | Major | New person sees someone else's data | First launch starts empty and shows the S01 first-open state (one sentence, the add input) plus a plain button 예시로 둘러보기 that loads the sample data. The toast says how many sample tasks were loaded and offers 실행 취소 (restores the empty state). `?sample=1` seeds when storage is empty; it never overwrites existing data. Blocked storage no longer seeds. | Cleared storage: S01 shows the empty state; the button loads 14 tasks; undo is offered; reload with `?sample=1` keeps the data; first add from the empty state works. Trace: S01 found. |
| 4 | Major | Focus lost to body | One helper (`focusSoon`) places focus after each action. Quick add (popover and sheet, also Escape and Cancel): back to 새 할 일 (the opener, by `data-fk`, since the list is re-rendered). First add from the empty state: the new row. Opening a task by keyboard: the title field (not on touch or pointer, to avoid the on-screen keyboard); closing the pane or Back: the row it came from. Delete (Delete key, row menu, detail menu), delete project, remove member, restore, delete forever: the neighbor row, else 새 할 일 or the heading. Undo: the restored row. Dialogs (including import after the file is chosen): the opener. Large titles are focusable (`tabindex=-1`) as the last resort. | Scripted keyboard run at 1280 and 390: after quick add `BUTTON[add]`; after open `TEXTAREA#d-title`; after close `A[row:id]`; after Delete the next row; after Ctrl+Z the restored row; Esc on quick add `[add]`; Esc on import `[import]`, on delete-all `[delall]`; after Return on forever `H1`. Never `BODY`. |
| 5 | Minor | Native date input row | The menu item 날짜 고르기… now opens the native picker directly from a visually hidden input at the date row (no extra row, no layout jump); focus returns to the date button, which shows "11월 20일 (금)". Fallback to the visible field where `showPicker` throws. Still not a calendar component. | Chosen date set through the input: button text and focus checked. The native popup itself cannot be captured here. |
| 6 | Minor | "오늘" twice | The first section header is removed when it only repeats the title; 지난 할 일 and 오늘 끝낸 일 keep theirs. Copy-sheet row "S01 section 1" is no longer shown. | Screenshots 390 and 1280. |
| 7 | Minor | Glass smears the large title | The bar stays flat until the large title has scrolled away (`data-collapsed`); then the bar is 96 percent page color with the glass blur, so the date line passing under it is a clean edge. | Screenshots at 390 scrolled. A faint tint remains at the edge of the blur. |
| 8 | Minor | Columns not on the title's edge at 1280 | `.hh-col` is left-aligned (title and rows start at x = 456 on S02, S08 and S09). | Screenshots of S02 and S08 at 1280. |
| 9 | Minor | Trash row layout | Actions sit together at the trailing edge (4 px apart, not 32). 영구 삭제 stays in the 더 보기 menu (destructive path kept one step further, D01 pairs it with a dialog). | Screenshot at 1280; audit. |
| 10 | Minor | Hint before any input | The hint appears only after the person typed and emptied the field (S05, S06). | Sheet opened: hint empty. |
| 11 | Minor | Stale import error | Starting a new import clears the message. | Invalid file, then a new import: message empty. |
| 12 | Minor | Empty detail pane | Centered icon and sentence, vertically centered. | Screenshot at 1280. |
| 13 | Minor | Three create actions on empty S02 | The toolbar text button 새 프로젝트 shows only when there is at least one project; the empty-state button leads. | Audit state "S02 empty". |
| 14 | Minor | Toast covers subtitle or last row | Regular: toast at the bottom of the list pane (kit default), clear of the title block. Both widths: while a message shows, the pane gets extra bottom padding so the last rows scroll above it. | Screenshots at 1280 and 390 with a toast. |
| 15 | Minor | Banner scrolls away and is narrow | The slot is sticky under the bar; kit banner puts the action under the text at any width. | Screenshot at 1280 with `__haru.simulate('full')`. |
| 16 | Minor | 195 px width | Below 260 px the bar wraps (trail under the lead), the inline title hides, tab labels may break, the tab bar insets 4 px. No control passes the viewport; `scrollWidth` 195. Tab labels still wrap ("프로젝/트") and are small there. | Measured at 195 px on S03; screenshot. |
| 17 | Minor | Trace gaps | `data-screen="S00"` on the shell, `data-decision="D02"` on the toast host, `data-decision="D10"` on the S02 project list. | `node scripts/trace.mjs tests/e2e`: "No gaps between documents and build." |

Noted in the review but not scored: the sheet's title, field and list left edges differ (24 px vs 48 px); left as is.

## Not fixed or partly fixed
- Finding 5: no calendar component (the kit has none); the native picker is used.
- Finding 16: at 195 px tab labels still break inside a word; a proper answer needs a different tab bar at accessibility sizes.
- Roving focus (one tab stop per row, from "Open questions"): not done; the owner has not decided.
- `prefers-reduced-transparency`: still not testable here.
- Multi-level Ctrl+Z (previous behavior) is gone with the capture handler.

## Verification
- Audit: `scripts/audit-page.js` (placeholders checked, disabled controls skipped), `minTarget` 44 at 390 and 28 at 1280, light and dark, 15 states per run (S01 first open, S02 empty, S01, S01 with S04, S02, S03, S03 with S04, S07, S07 results, S07 no results, S08, S09, S05 open, S06 open, empty-trash dialog or sheet): 60 runs, 0 findings (no text under the floor, no placeholder under 4.5:1, no target under size, no unnamed control, no unlabeled field, no clipped text).
- Keyboard core flow (regular and compact) as listed in finding 4, plus swipe-down on the quick-add sheet asking before discarding (`초안 지우기` clears the draft; Cancel and Escape do not ask and keep it).
- `node scripts/trace.mjs tests/e2e`: 10 of 10 screens, 16 of 16 decisions found, no gaps (before: D10 missing, S00 unmarked).
- `node scripts/find-rules.mjs --check build-rationale-note.md`: 12 IDs, 0 unknown.
- Not tested: VoiceOver, real touch, Safari and Firefox, the native date popup.
