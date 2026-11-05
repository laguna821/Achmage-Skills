# HIG Kit: nav (navigation and containers)

Files: `hk-nav.css`, `hk-nav.js`, `gallery-nav.html`. Needs `hk-base.css` and `hk-base.js`. Gallery: `assets/kit/gallery-nav.html`.

```html
<link rel="stylesheet" href="hk-base.css"><link rel="stylesheet" href="hk-nav.css">
<script src="hk-base.js"></script><script src="hk-nav.js"></script>
```

Size classes: compact is below 744 px, regular is 744 px and wider (house-style 11). Components that change use `@media` or `HK.compact()`. Icons are inline Lucide SVGs (class `hk-icon`); the chevron, check and sort arrows drawn by CSS are masks made from the same Lucide files. Every overlay opens from `data-hk-open="#id"` on a button; focus returns to that button when it closes.

Shared helpers: `.hk-bar-btn` (icon or text button for bars; add `hk-bar-btn--prominent` for the Bold confirming action), `.hk-badge`, `.hk-regular-only` / `.hk-compact-only`, `--hk-link` (accent text one step deeper, so it reaches 4.5:1 on gray fills).

## 1. App shell `.hk-app`

Rules: `tab-bars/best-practices/use-a-tab-bar-to-support` `sidebars/platform-considerations/ios-ipados/consider-using-a-tab-bar-first` `tab-bars/platform-considerations/ipados/prefer-a-tab-bar-for-navigation` `sidebars/best-practices/consider-letting-people-hide-the-sidebar` `layout/adaptability/design-a-layout-that-adapts-gracefully`

```html
<div class="hk-app" data-hk="app" style="--hk-app-h:100dvh">
  <nav class="hk-sidebar" data-hk="sidebar" aria-label="Main"> ... <a class="hk-sidebar__item" href="#today" data-dest="today">...</a> </nav>
  <div class="hk-app__main"><div class="hk-app__page">
    <section class="hk-app__view" data-view="today"> navbar + content </section>
    <section class="hk-app__view" data-view="inbox" hidden> ... </section>
  </div></div>
  <nav class="hk-tabbar hk-glass" aria-label="Main tabs"> <ul><li><a class="hk-tab" href="#today" data-dest="today" aria-current="page">...</a></li> ... </ul></nav>
</div>
```

Compact: content plus the floating tab bar. Regular: sidebar (17 rem) plus content, centered up to 1200 px. Clicking any `[data-dest]` sets `aria-current="page"` on both navs, shows `[data-view]`, and announces the name. A button with `data-hk-sidebar-toggle` (use `hk-regular-only`) hides and shows the sidebar; it is shown by default. `--hk-app-h` sets the shell height (default full viewport). Safe-area insets need `viewport-fit=cover`.
Options: `data-sidebar="hidden"` on the shell. Does not: persist the sidebar choice, customize tabs, or route (links are `#` anchors; wire your own router and keep `aria-current`).

## 2. Tab bar `.hk-tabbar`

Rules: `tab-bars/best-practices/use-a-tab-bar-to-support` `tab-bars/best-practices/make-sure-the-tab-bar-is` `tab-bars/best-practices/use-the-appropriate-number-of-tabs` `tab-bars/best-practices/avoid-overflow-tabs` `tab-bars/best-practices/dont-disable-or-hide-tab-bar` `tab-bars/best-practices/include-tab-labels-to-help-with` `tab-bars/best-practices/use-a-badge-to-indicate-that`

```html
<nav class="hk-tabbar hk-glass" aria-label="Main tabs"><ul>
  <li><a class="hk-tab" href="#a" aria-current="page"><svg class="hk-icon">...</svg><span class="hk-tab__label">Home</span></a></li>
  <li><a class="hk-tab" href="#c"><svg class="hk-icon">...</svg><span class="hk-tab__label">Alerts</span><span class="hk-badge">3<span class="hk-visually-hidden"> new</span></span></a></li>
</ul></nav>
```

Up to five destinations, icon and one-word label, selected through `aria-current="page"`, glass because it floats, safe-area bottom inset. Warns in the console above five. Does not: offer a More tab, disable or hide tabs (show an empty state instead), hold actions, use filled icons (Lucide is stroke only; the selected tab gets a thicker stroke and a tinted pill).

## 3. Sidebar `.hk-sidebar`

Rules: `sidebars/best-practices/in-general-show-no-more-than` `sidebars/best-practices/group-hierarchy-with-disclosure-controls-if` `sidebars/best-practices/consider-letting-people-hide-the-sidebar` `sidebars/best-practices/if-you-need-to-include-two` `sidebars/best-practices/consider-using-familiar-symbols-to-represent` `sidebars/best-practices/make-sure-any-sidebar-icon-colors`

```html
<nav class="hk-sidebar" data-hk="sidebar" aria-label="Main">
  <div class="hk-sidebar__section"><h2 class="hk-sidebar__header">Library</h2><ul>
    <li><a class="hk-sidebar__item" href="#" aria-current="page"><svg class="hk-icon">..</svg><span class="hk-sidebar__label">All Items</span><span class="hk-sidebar__count">128</span></a></li>
    <li><details open><summary class="hk-sidebar__item"><svg class="hk-icon">..</svg><span class="hk-sidebar__label">Projects</span><span class="hk-sidebar__twisty" aria-hidden="true"></span></summary><ul>...</ul></details></li>
  </ul></div>
</nav>
```

One tab stop (roving tabindex); Up, Down, Home, End move; Right opens and Left closes a group. Icons take the accent color. Two levels at most. Does not: reorder or hide items per person, or nest deeper.

## 4. Navigation bar and toolbar `.hk-navbar`, `.hk-toolbar`

Rules: `toolbars/titles/write-a-concise-title` `toolbars/navigation/use-the-standard-back-and-close` `toolbars/actions/prefer-system-provided-symbols-without-borders` `toolbars/actions/make-sure-the-meaning-of-each` `toolbars/best-practices/reduce-the-use-of-toolbar-backgrounds` `toolbars/platform-considerations/ios/use-a-large-title-to-help` `toolbars/best-practices/choose-items-deliberately-to-avoid-overcrowding`

```html
<header class="hk-navbar" data-hk="navbar"><div class="hk-navbar__row">
  <div class="hk-navbar__lead"><button class="hk-bar-btn"><svg class="hk-icon">chevron-left</svg>Back</button></div>
  <span class="hk-navbar__title" aria-hidden="true">Notes</span>
  <div class="hk-navbar__trail"><button class="hk-bar-btn" aria-label="Share"><svg class="hk-icon">..</svg></button></div>
</div></header>
<h1 class="hk-navbar__large">Notes</h1>   <!-- directly after the bar: the large title -->
```

Large-title variant: the `h1` follows the bar; the inline title is `aria-hidden` and fades in when the large title scrolls away. On regular the large title stays as a visually hidden heading and the inline title always shows. Control the large title with `data-show` on the `h1`: `compact` (default), `always` (also visible on regular, the inline title then follows the scroll there too) or `never` (a visually hidden heading at every width, inline title always visible), for example `<h1 class="hk-navbar__large" data-show="always">`. It is a plain attribute rule with no `!important`, so a product never has to override the kit; changing the attribute at run time works. Toolbar variant (no large title): `<header class="hk-toolbar">` with `<h1 class="hk-navbar__title">`. The bar is sticky and transparent; `data-scrolled` (set on scroll) turns on glass only while content moves beneath it. The scroll container is the nearest `.hk-app__main` or `[data-hk-scroll]`, else the window. Icon actions need `aria-label`. Does not: customize items, hide the toolbar, or collapse into a More menu by itself (put a pull-down menu in `__trail`).

## 5. List `.hk-list`

Rules: `lists-and-tables/best-practices/prefer-displaying-text-in-a-list` `lists-and-tables/best-practices/provide-appropriate-feedback-when-people-select` `lists-and-tables/content/keep-item-text-succinct-so-row` `lists-and-tables/style/choose-a-row-style-that-fits` `lists-and-tables/best-practices/let-people-edit-a-table-when`. Swipe actions: [HIG none] (house pattern for touch, with hover and focus equivalents for pointers).

```html
<section class="hk-list" aria-labelledby="h"><h2 class="hk-list__header" id="h">Header</h2>
  <ul class="hk-list__group">
    <li class="hk-row"><a class="hk-row__main" href="#"><svg class="hk-icon hk-row__icon">..</svg><span class="hk-row__text"><span class="hk-row__title">Title</span><span class="hk-row__sub">Subtitle</span></span><span class="hk-row__value">Value</span><span class="hk-row__chevron" aria-hidden="true"></span></a></li>
    <li class="hk-row"><div class="hk-row__main"><span class="hk-row__title" id="t">Wi-Fi</span><button role="switch" aria-checked="true" aria-labelledby="t" class="hk-row__switch" data-hk="switchrow"></button></div></li>
    <li class="hk-row" data-hk="swipe"><a class="hk-row__main" href="#">...</a><div class="hk-row__actions"><button class="hk-row__action">Flag</button><button class="hk-row__action hk-row__action--destructive" data-action="delete">Delete</button></div></li>
  </ul><p class="hk-list__footer">Footer</p></section>
```

Option list (checkmark): `<ul class="hk-list__group" role="radiogroup" data-hk="choicelist"><li role="none"><button role="radio" aria-checked="true" class="hk-row__main">...<span class="hk-row__check" aria-hidden="true"></span></button></li>`; arrow keys move the choice. Swipe: touch drag past half the actions width opens (`data-open`), tap elsewhere or Escape closes; pointers reveal the same actions on hover and focus-within; the destructive action goes last and is red. A button click fires `hk:row-action` with `detail.action`; the app removes or changes the row. Disabled row: `aria-disabled="true"` on `__main`. Does not: reorder, edit mode, full-swipe to run the last action, index bars, or confirm deletes (undoable deletes need no alert).

## 6. Table `.hk-table`

Rules: `lists-and-tables/platform-considerations/macos/when-it-provides-value-let-people` `lists-and-tables/content/use-descriptive-column-headings-in-a` `lists-and-tables/best-practices/provide-appropriate-feedback-when-people-select` `lists-and-tables/style/choose-a-table-or-list-style` `lists-and-tables/content/keep-item-text-succinct-so-row`

```html
<div class="hk-table-wrap" role="region" aria-label="Files" tabindex="0"><table class="hk-table" data-hk="table">
  <thead><tr><th data-select><input type="checkbox" aria-label="Select all"></th>
    <th scope="col" aria-sort="ascending"><button class="hk-table__sort">Name</button></th>
    <th scope="col" data-num><button class="hk-table__sort">Size</button></th></tr></thead>
  <tbody><tr><td data-select><input type="checkbox" aria-label="Select Cover"></td><td>Cover</td><td data-num data-sort="820000">820 KB</td></tr></tbody>
</table></div>
```

Click a heading to sort, again to reverse; `aria-sort` moves with it and the change is announced. `data-sort` gives a machine value. Rows get hover and `aria-selected`; the checkbox or a click on the row selects. For regular widths; on compact it only scrolls sideways, so use a list there. Does not: resize or reorder columns, middle-ellipsis clipping (cells clip at the end), or range selection.

## 7. Sheet `dialog.hk-sheet`

Rules: `sheets/best-practices/for-complex-or-prolonged-user-flows` `sheets/best-practices/display-only-one-sheet-at-a` `sheets/best-practices/provide-an-alternative-to-the-done` `sheets/platform-considerations/ios-ipados/include-a-grabber-in-a-resizable` `sheets/platform-considerations/ios-ipados/support-swiping-to-dismiss-a-sheet` `sheets/platform-considerations/ios-ipados/prefer-using-the-page-or-form` `modality/best-practices/when-necessary-help-people-avoid-data`

```html
<button data-hk-open="#s">New</button>
<dialog class="hk-sheet" id="s" data-hk="sheet" aria-labelledby="s-t" data-discard="#as-discard"><form method="dialog" class="hk-sheet__form">
  <div class="hk-sheet__grab" aria-hidden="true"></div>
  <div class="hk-sheet__bar"><button value="cancel" formnovalidate class="hk-bar-btn">Cancel</button><h2 class="hk-sheet__title" id="s-t">New</h2><button value="add" class="hk-bar-btn hk-bar-btn--prominent">Add</button></div>
  <div class="hk-sheet__body">...</div></form></dialog>
```

Compact: bottom sheet with grabber (drag it down to dismiss). Regular: centered form sheet. Cancel leads, the Bold confirming action trails (Done with Cancel, never all three). Escape and Cancel close; `close` fires with `returnValue` (`cancel`, `add`). With `data-discard="#id"` pointing at an action sheet, unsaved input makes Escape, Cancel and the swipe ask first (the action sheet button `value="discard"` confirms). Choose when it asks with `data-discard-ask` on the sheet: `cancel` (default: Cancel, Escape and swipe-down all ask), `swipe` (only the swipe-down asks, since it is the easy accidental dismissal; Cancel and Escape close at once and drop the input), `never` (nothing asks; also the effect of leaving out `data-discard`). The Cancel button is an explicit choice, so `swipe` fits short forms; keep the default where losing the input hurts. Rule for the swipe: `modality/best-practices/when-necessary-help-people-avoid-data`. Does not: resize with detents, close on backdrop click, or stack sheets.

## 8. Alert `dialog.hk-alert`

Rules: `alerts/best-practices/use-alerts-sparingly` `alerts/content/write-a-title-that-clearly-and` `alerts/content/include-informative-text-only-if-it` `alerts/buttons/create-succinct-logical-button-titles` `alerts/buttons/avoid-using-ok-as-the-default` `alerts/buttons/use-the-destructive-style-to-identify` `alerts/buttons/if-theres-a-destructive-action-include` `alerts/buttons/provide-alternative-ways-to-cancel-an`

```html
<dialog class="hk-alert" id="a" data-hk="alert" data-destructive aria-labelledby="a-t" aria-describedby="a-m"><form method="dialog">
  <div class="hk-alert__content"><h2 class="hk-alert__title" id="a-t">Delete Account?</h2><p class="hk-alert__message" id="a-m">This cannot be undone.</p></div>
  <div class="hk-alert__actions"><button value="cancel" class="hk-alert__btn">Cancel</button><button value="delete" class="hk-alert__btn hk-alert__btn--destructive">Delete Account</button></div>
</form></dialog>
```

`role="alertdialog"` is set by the script. One to three buttons (two side by side, three stacked). Escape cancels (`returnValue` `cancel`); the backdrop does not dismiss. Destructive style only for a rare, irreversible action the person did not choose deliberately; then add `data-destructive`: Cancel is not the default and nothing is focused except the dialog, so Enter does not act. Otherwise mark the default with `hk-alert__btn--default` (Bold, initial focus). Does not: text fields, or an icon.

## 9. Action sheet `dialog.hk-actionsheet`

Rules: `action-sheets/best-practices/use-an-action-sheet-not-an` `action-sheets/best-practices/use-action-sheets-sparingly` `action-sheets/best-practices/aim-to-keep-titles-short-enough` `action-sheets/best-practices/if-necessary-provide-a-cancel-button` `action-sheets/best-practices/make-destructive-choices-visually-prominent` `action-sheets/platform-considerations/ios-ipados/avoid-letting-an-action-sheet-scroll`

```html
<dialog class="hk-actionsheet" id="as" data-hk="actionsheet" aria-labelledby="as-t"><form method="dialog" class="hk-actionsheet__form">
  <div class="hk-actionsheet__group"><div class="hk-actionsheet__head"><h2 class="hk-actionsheet__title" id="as-t">Discard this draft?</h2></div>
    <button value="delete" class="hk-actionsheet__btn hk-actionsheet__btn--destructive">Delete Draft</button><button value="save" class="hk-actionsheet__btn">Save Draft</button></div>
  <div class="hk-actionsheet__cancel"><button value="cancel" class="hk-actionsheet__btn hk-actionsheet__btn--cancel">Cancel</button></div>
</form></dialog>
```

Compact: bottom group plus a separate Cancel, destructive first and red. Regular: a popover with an arrow from the opener (the opener is the button with `data-hk-open`, or the focused element when opened from code); Cancel is hidden there because Escape or an outside click cancels. Focus lands on the dialog, so no choice is a default. Does not: scroll long lists.

## 10. Popover `[popover].hk-popover`

Rules: `popovers/best-practices/use-a-popover-to-expose-a` `popovers/best-practices/position-popovers-appropriately` `popovers/best-practices/show-one-popover-at-a-time` `popovers/best-practices/use-a-close-button-for-confirmation` `popovers/best-practices/avoid-making-a-popover-too-big` `popovers/platform-considerations/ios-ipados/avoid-displaying-popovers-in-compact-views`

```html
<button data-hk-open="#p">Calendar</button>
<div id="p" class="hk-popover" popover data-hk="popover" role="dialog" aria-labelledby="p-t">
  <div class="hk-popover__bar"><span></span><h2 class="hk-popover__title" id="p-t">Calendar</h2><button class="hk-bar-btn hk-bar-btn--prominent" data-hk-close>Done</button></div>
  <div class="hk-popover__body">...</div></div>
```

Uses the native Popover API (`popover="auto"`): one at a time, outside click and Escape close, focus returns to the opener. Regular: anchored below or above its source with an arrow, flips at the viewport edge, max 22 rem wide. Compact: a bottom sheet with a scrim, and the bar with Done (hidden on regular) closes it. Needs a browser with the Popover API. Does not: stack popovers or resize between states.

## 11. Pull-down menu `.hk-menu`

Rules: `pull-down-buttons/best-practices/use-a-pull-down-button-to` `pull-down-buttons/best-practices/balance-menu-length-with-ease-of` `pull-down-buttons/best-practices/let-people-know-when-a-pull` `menus/toggled-items/consider-using-a-checkmark-to-show` `menus/organization/consider-grouping-logically-related-items` `menus/labels/show-people-when-a-menu-item`

```html
<div class="hk-menu" data-hk="menu"><button class="hk-menu__trigger" aria-haspopup="menu">Sort</button>
  <div role="menu" aria-label="Sort">
    <button role="menuitemradio" aria-checked="true" class="hk-menu__item">Name</button>
    <button role="menuitemradio" aria-checked="false" class="hk-menu__item">Date Added</button>
    <hr class="hk-menu__sep" role="separator">
    <button role="menuitem" class="hk-menu__item hk-menu__item--destructive">Delete All</button>
  </div></div>
```

Button opens the menu (Popover API). Keys: Down or Up on the button opens and focuses the first or last item; Up, Down, Home, End, type-ahead move; Enter or Space chooses; Escape closes and returns focus to the button; Tab closes. `menuitemradio` is exclusive between separators; `menuitemcheckbox` toggles; the check slot appears only when a menu has `aria-checked` items. Unavailable items stay visible with `aria-disabled="true"`. The destructive item goes last and red; confirmation after choosing is the app's job (action sheet on compact, popover on regular). Event `hk:menu-select` carries `detail.label`. Icon-only trigger: `.hk-bar-btn` with `aria-label`. Does not: submenus, icons in the leading slot, or a menu title.

## 12. Disclosure `.hk-disclosure`

Rules: `disclosure-controls/best-practices/use-a-disclosure-control-to-hide` `disclosure-controls/disclosure-triangles/provide-a-descriptive-label-when-using` `disclosure-controls/disclosure-buttons/place-a-disclosure-button-near-the` `disclosure-controls/disclosure-buttons/use-no-more-than-one-disclosure`

```html
<details class="hk-disclosure"><summary>Advanced Options</summary><div class="hk-disclosure__body">...</div></details>
```

Plain `details` and `summary`; no script. The chevron sits at the leading edge, points inward while closed and down when open. Label what is hidden. Disabled look: `aria-disabled="true"`. Does not: animate the height, or group (use separate `details`).
