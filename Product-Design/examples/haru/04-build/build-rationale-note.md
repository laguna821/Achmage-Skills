# Build rationale note: 하루 (Haru), front end

## Built
- What: working front end for 하루, screens S01 to S09, in `index.html`, `app.js`, `app.css`, `icons.js`, with the rebuilt kit (`kit.css`, `kit.js`, copied from the skill on 2026-11-04, second build) and `theme.css` copied unchanged. The completion button, gauge, banner and large title are the kit's (`.hk-complete`, `.hk-gauge`, `.hk-banner`, `data-show="always"`); no kit override remains in `app.css`. Medium: responsive web app, compact below 744 px and regular from 744 px `layout/adaptability/design-a-layout-that-adapts-gracefully`
- Goal in one sentence: show what to do today and let people finish it, with quick add, projects, search, trash and backup `design-principles/purpose/create-value`
- Serve: https://laguna821.github.io/Achmage-Skills/Product-Design/examples/haru/04-build/ (hash routes `#/today`, `#/projects/<id>`, `#/today/t/<id>`, `#/search`, `#/trash`, `#/settings`). Data in localStorage key `haru.v1`, restored with the last route. First launch starts empty (the S01 first-open state) with a plain action 예시로 둘러보기 that loads sample data and can be undone; `?sample=1` seeds the same data when storage is empty (demos and tests).

## Assumptions
- Shortcut `n` opens 새 할 일 on regular, Delete removes the focused task, Ctrl or Cmd+Z undoes the delete whose message is showing (the kit toast shortcut; one level, because the message is replaced by the next one) · Why: HIG silent [HIG none] · Confirm with: product owner
- The native date input (with `showPicker`) stands in for the compact date picker and for the graphical picker popover · Why: the kit has no calendar; building one was out of scope · Confirm with: designer
- Storage problems can be simulated with `__haru.simulate('full'|'blocked'|'missing')` · Why: cannot be triggered by hand · Confirm with: front-end developer
- Merge on import keeps the newer copy by id (D01 assumption).

## Decisions and why
| Decision | Why-chain | Rule IDs | Label |
|---|---|---|---|
| Tab bar (compact) and sidebar plus list and detail panes (regular); hash routes | 4 peer sections on a phone, many projects at a desk → Familiarity → adaptive container | `tab-bars/best-practices/use-a-tab-bar-to-support` `sidebars/best-practices/in-general-show-no-more-than` | [HIG transfer] |
| Completion circle, row stays until the person leaves the screen (D09) | Most frequent act → no shifting under the finger → toggle-like button, session `settling` set | `toggles/best-practices/make-sure-the-visual-differences-in` | [HIG transfer] |
| Delete with a no-timer undo message plus trash (D02) | Common and undoable → undo, not alert | `alerts/best-practices/avoid-displaying-alerts-for-common-undoable` `accessibility/cognitive/minimize-use-of-time-boxed-interface` | [HIG] |
| Empty trash and delete one forever: alert with Return confirming, normal style on regular; destructive action sheet on compact. Delete all and import replace: destructive, no default | Owner amendment to D01, recorded in `02-design/decisions.md` (2026-11-04) | `alerts/buttons/use-the-destructive-style-to-identify` `action-sheets/best-practices/make-destructive-choices-visually-prominent` | [HIG transfer] |
| Quick add: bottom sheet (compact), popover (regular); Cancel and Escape keep a draft, swipe-down with text asks | Short modal task | `popovers/platform-considerations/ios-ipados/avoid-displaying-popovers-in-compact-views` `modality/best-practices/when-necessary-help-people-avoid-data` | [HIG transfer] |
| Gauge plus always-visible text (D05); overdue by words only (D16); projects by name only (D10) | Status beside the item, no color alone | `color/inclusive-color/avoid-relying-solely-on-color-to` | [HIG transfer] |

## House-style choices
- [House] Font: Pretendard Variable via the kit. Icons: Lucide from the skill set, inlined by `icons.js` (no icon was missing, nothing fetched), stroke 2 on bars, 2.5 in the check.
- [House] Density follows input: `hk-mac` on `<html>` at 744 px and wider with a fine pointer; touch tablets keep 44 px. Sidebar auto-hides below 960 px (overlay) and starts hidden on coarse pointers.
- [House] Indigo accent from `theme.css`; glass only on the tab bar and on navigation bars once the large title has scrolled away. That bar is almost opaque (96 percent of the page color) so a line passing beneath it reads as a clean edge, not a smudge `materials/standard-materials/help-ensure-legibility-by-using-vibrant`.

## Craft pass
- Feeling: calm and clear. Carried by: one accent, flat rows on white, three type levels, 24 px between sections, no color for overdue or progress.
- Decision varied: the accent. Variants rendered on S01 with a selected row at 1280 px: A blue (kit default), B indigo, C green. A looked like every default app and like a link color. C read as success and as a different product (a health or finance tone), and its dark fill fails Bold 3:1. B stayed calm, separated the button and selected row from black text without shouting. Chosen: B (the theme value), confirmed at real size.
- Second pass (review fixes): the duplicate section header 오늘 is gone (the title already says it); S02, S08, S09 columns share the title's left edge at 1280 px; the empty detail pane is a centered icon and sentence; the toast sits at the bottom of the list pane on regular and the list gains room under it while it shows; the storage banner is pinned under the bar; trash actions sit together at the trailing edge; the date menu item opens the native picker directly (no extra row).
- Finish list changes: section headers aligned to the row text edge (contract); hover and selected row tints; row meta kept to one line where possible; sidebar icons reduced to 20 px in `hk-mac` and the count to 12 px (the 10 px footnote failed the floor); project-row separators start at the page edge; the S09 page moved to the grouped background so white cells show.

## Checks run
- Preview: 390 px and 1280 px, light and dark, all nine screens and the S05, S06, confirmation dialogs viewed.
- Audit, second pass (`audit-page.js` with placeholder checks, minTarget 44 at 390, 28 at 1280; 15 states per width per appearance: S01 first open, S02 empty, S01 to S04, S07 with and without results, S08, S09, S05 and S06 open, the empty-trash dialog; 60 runs): zero findings, including placeholders. First pass: after fixes no text below the floor, no target under size, no unnamed control, no unlabeled field. Remaining reports: "clipped text" on one hidden inline nav title or sidebar label per page (a false positive, text is fully visible), and 추가 contrast while it is disabled (a disabled control, exempt).
- Keyboard and focus, second pass: after quick add focus returns to 새 할 일; opening a task by keyboard moves focus to its title and closing returns it to the row; Delete and the row menu delete move focus to the next row; Undo focuses the restored row; every dialog returns focus to its opener (import included, after the file is chosen). See `fix-log.md`.
- Keyboard: Tab to 새 할 일, Enter opens the popover, type and Enter adds; Space or Enter on the circle toggles; Enter on a row opens S04; Delete removes and Ctrl+Z restores; Escape closes dialogs.
- Rule IDs: `node scripts/find-rules.mjs --check build-rationale-note.md` (result in the reply).

## Open [HIG none] questions
- Shortcut letters · My default: `n`, Delete, Ctrl+Z · Owner decides: yes
- Behavior with two browser tabs open · My default: none (no `storage` sync) · Owner decides: yes

## Known gaps
- Calendar is the browser's native date picker (opened directly from the menu), not a custom graphical popover. Where `showPicker` is unavailable the visible date field appears as a fallback.
- No automated test of the two-tab case; import and export were exercised by code path, with the file chooser not driven.
- Screen reader (VoiceOver) not tested; announcements use `HK.announce` and `role="status"`.
