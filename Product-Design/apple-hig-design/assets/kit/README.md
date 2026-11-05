# HIG Kit

Shared web components for front ends built with the apple-hig-design skill. Every component follows its HIG card and the house decisions, lists the rule IDs it implements, and works by keyboard, in light and dark, with increased contrast, reduced transparency and reduced motion.

## Use

```html
<link rel="stylesheet" href="kit.css">
...
<script src="kit.js"></script>
```

Copy `kit.css` and `kit.js` next to your page. Components bind to markup with `data-hk="name"`. Desktop pointer density: add `class="hk-mac"` on a container, or `data-hk="density"` on the app root to switch automatically on regular widths with a mouse or trackpad. Rebrand by setting `--accent`, `--accent-text` and `--accent-fill` (check both modes with `scripts/contrast.mjs`). Galleries: `gallery-controls.html`, `gallery-nav.html`, `gallery-status.html`. Conventions for adding components: `KIT-SPEC.md`.


## HIG Kit: controls

Files: `hk-controls.css`, `hk-controls.js`, `gallery-controls.html`. Needs `hk-base.css` and `hk-base.js`. Behavior binds with `data-hk="name"`. Controls fire a bubbling `hk:change` event (segmented: `{index, value}`, switch: `{checked}`, stepper: `{value}`) and the search field fires `hk:search` (`{query, scope}`). Icons in markup are inline Lucide SVGs copied from `assets/icons/lucide/` (add `aria-hidden="true"`); icon-only controls carry `aria-label`.

Common to all: 44 px targets on touch layouts (`--target`), 28 px inside `.hk-mac`; focus ring from the base; checked in light and dark, with more contrast and reduced motion.

## 1. Button (`.hk-btn`)

Rules: `buttons/style/in-general-use-a-button-that` `buttons/style/use-style-not-size-to-visually` `buttons/role/dont-assign-the-primary-role-to` `buttons/best-practices/always-include-a-press-state-for` `buttons/best-practices/make-buttons-easy-for-people-to` `buttons/content/ensure-that-each-button-clearly-communicates` `buttons/content/try-to-associate-familiar-actions-with`

```html
<button class="hk-btn hk-btn--filled">저장</button>
<button class="hk-btn hk-btn--filled hk-btn--destructive"><svg class="hk-icon" aria-hidden="true">…</svg>삭제</button>
<button class="hk-btn hk-btn--filled hk-btn--icon" aria-label="추가"><svg class="hk-icon" aria-hidden="true">…</svg></button>
<button class="hk-btn hk-btn--filled" data-hk="button" aria-busy="true">저장 중…</button>
```

Options: style `--filled` (accent fill, white Bold label), `--tinted`, `--bordered`, `--plain`; add `--destructive` to any; size `--sm`, default, `--lg`; `--block` (full width); `--icon` (square capsule, needs `aria-label`); `disabled`; `aria-busy="true"` with `data-hk="button"` adds the spinner and swallows clicks while keeping focus. `.hk-btn-row` lays buttons out with 12 px gaps. Capsule shape.
Does not: pick the primary action for you (use one `--filled` per view); `--sm` is as tall as the default on touch (44 px), it only gets smaller type and padding; on `.hk-mac` small is 20 px.

## 2. Segmented control (`.hk-seg`, `data-hk="segmented"`)

Rules: `segmented-controls/best-practices/use-a-segmented-control-to-provide` `segmented-controls/best-practices/limit-the-number-of-segments-in` `segmented-controls/best-practices/in-general-keep-segment-size-consistent` `segmented-controls/best-practices/keep-control-types-consistent-within-a` `segmented-controls/content/prefer-using-either-text-or-images` `segmented-controls/content/use-nouns-or-noun-phrases-for`

```html
<div class="hk-seg" data-hk="segmented" role="radiogroup" aria-label="보기 방식">
  <button type="button" role="radio" aria-checked="true" data-value="day">일</button>
  <button type="button" role="radio" aria-checked="false" data-value="week">주</button>
</div>
```

Behavior: roving tabindex (only the selected segment is a tab stop), arrows select and move (wrap), Home and End, indicator slides to the selection, equal widths. The selected segment is also Bold, so selection is not carried by position alone. `disabled` segments are skipped.
Does not: scroll or wrap into several rows; keep to 2 to 5 short segments. No glass variant (wrap it yourself only when it floats over media).

## 3. Toggle (`.hk-switch`, `.hk-check`)

Rules: `toggles/best-practices/use-a-toggle-to-help-people` `toggles/best-practices/clearly-identify-the-setting-view-or` `toggles/best-practices/make-sure-the-visual-differences-in` `toggles/platform-considerations/ios-ipados/use-the-switch-toggle-style-only` `toggles/platform-considerations/ios-ipados/avoid-supplying-a-label-that-explains` `toggles/platform-considerations/macos/checkboxes/accurately-reflect-a-checkboxs-state-in` `toggles/platform-considerations/macos/checkboxes/use-a-checkbox-instead-of-a`

```html
<label class="hk-toggle"><span class="hk-toggle__text"><span class="hk-toggle__label">Wi-Fi</span><span class="hk-toggle__hint">힌트</span></span>
  <button type="button" class="hk-switch" data-hk="switch" aria-checked="true"></button></label>

<label class="hk-check"><input class="hk-check__box" type="checkbox"> 메일</label>   <!-- wrap in .hk-mac for desktop density -->
```

Switch: `role="switch"` and `aria-checked`; named from `.hk-toggle__label`. On and off differ by knob position, a bar glyph (on) versus an open ring (off), and fill color, so the state does not depend on color. On fill is the accent fill (not the iOS green). Checkbox: native input, supports `indeterminate`; the full 44 px (or 28 px in `.hk-mac`) is the click area.
Does not: put the state word in the label; no radio buttons (use the segmented control or native radio inputs).

## 4. Stepper (`.hk-stepper`, `data-hk="stepper"`)

Rules: `steppers/best-practices/make-the-value-that-a-stepper` `steppers/best-practices/consider-pairing-a-stepper-with-a` `steppers/platform-considerations/macos/for-large-value-ranges-consider-supporting`

```html
<div class="hk-stepper" data-hk="stepper" data-min="1" data-max="10" data-value="2" data-unit="개" aria-label="수량">
  <button type="button" class="hk-stepper__btn" data-step="-1" aria-label="수량 줄이기">…minus…</button>
  <output class="hk-stepper__value"></output>
  <button type="button" class="hk-stepper__btn" data-step="1" aria-label="수량 늘리기">…plus…</button>
</div>
```

Options: `data-min`, `data-max`, `data-step`, `data-value`, `data-unit`. The value is shown next to the buttons and announced politely. At a limit the button gets `aria-disabled="true"` (stays focusable). Keyboard: Up, Right, Down, Left on either button, Page Up and Page Down move 10 steps, Home and End jump to min and max. Press and hold repeats.
Does not: let people type a value (pair it with a text field for large ranges).

## 5. Slider (`.hk-slider`, `data-hk="slider"`)

Rules: `sliders/best-practices/use-familiar-slider-directions` `sliders/best-practices/consider-supplementing-a-slider-with-a` `sliders/best-practices/customize-a-sliders-appearance-if-it` `sliders/platform-considerations/macos/consider-using-a-label-to-introduce` `sliders/platform-considerations/macos/consider-giving-live-feedback-as-the` `sliders/platform-considerations/ios-ipados/dont-use-a-slider-to-adjust`

```html
<label class="hk-field__label" for="b">밝기</label>
<div class="hk-slider-row"><input class="hk-slider" id="b" type="range" min="0" max="100" value="40" data-hk="slider" data-output="b-o" data-unit="%"><output class="hk-slider__value" id="b-o" for="b"></output></div>
```

Native range input (arrows, Page keys, Home and End); the filled track follows `--p`, set by the script. `data-output` names an element that shows the live value; `data-unit` also becomes `aria-valuetext`. Does not: draw tick marks.

## 6. Text field (`.hk-field`, `data-hk="field"`)

Rules: `text-fields/best-practices/use-a-text-field-to-request` `text-fields/best-practices/show-a-hint-in-a-text` `text-fields/best-practices/validate-fields-when-it-makes-sense` `text-fields/best-practices/use-secure-text-fields-to-hide` `text-fields/platform-considerations/ios-ipados/display-a-clear-button-in-the` `text-fields/best-practices/evenly-space-multiple-text-fields` `entering-data/best-practices/be-clear-about-the-data-you` `entering-data/best-practices/dynamically-validate-field-values`

```html
<div class="hk-field" data-hk="field" data-count data-error="이메일 형식을 확인해 주세요.">
  <label class="hk-field__label" for="m">이메일</label>
  <div class="hk-field__control"><input class="hk-field__input" id="m" type="email" required maxlength="40"></div>
  <div class="hk-field__foot"><p class="hk-field__hint">영수증을 보내 드립니다</p></div>
</div>
```

The label is always visible. The script adds a clear button (text-like inputs, opt out with `data-clear="false"`), an error line and, with `data-count` and `maxlength`, a character count. `aria-describedby` lists the hint, the error (only while `aria-invalid="true"`) and the count. The error shows an icon, bold text and a thicker outline, never color alone. Validation runs when the field is left (native constraints; message from `data-error` or the browser) and clears as soon as the value is valid. Set an error yourself with `el.hkSetError('message')`, clear with `el.hkSetError('')`. Use `type="password"` for secure fields.
Does not: format numbers; run validation on every keystroke.

## 7. Text view (`data-hk="field textview"`)

Rules: `text-views/best-practices/use-a-text-view-when-you` `text-views/best-practices/keep-text-legible` `text-views/best-practices/make-useful-text-selectable` `text-views/platform-considerations/ios-ipados/show-the-appropriate-keyboard-type`

Same markup as the text field with a `<textarea class="hk-field__input">`. It grows with its content up to `data-max-rows` (default 8) and then scrolls. Count works the same. Does not: offer rich text.

## 8. Search field (`.hk-search`, `data-hk="search"`)

Rules: `search-fields/best-practices/use-placeholder-text-to-help-people` `search-fields/scope-bars-and-tokens/use-a-scope-bar-to-filter` `search-fields/scope-bars-and-tokens/default-to-a-broader-scope-and` `search-fields/best-practices/simplify-search-results` `search-fields/platform-considerations/ios/search-as-an-inline-field/place-search-as-an-inline-field` `searching/best-practices/clearly-display-the-current-scope-of`

```html
<form class="hk-search" data-hk="search"><div class="hk-search__bar">
  <div class="hk-search__field"><svg class="hk-icon" aria-hidden="true">…search…</svg><input class="hk-search__input" type="search" aria-label="검색" placeholder="검색" enterkeyhint="search"></div>
  <button type="button" class="hk-btn hk-btn--plain hk-search__cancel">취소</button></div>
  <!-- optional scope bar: a segmented control with class hk-search__scopes -->
</form>
```

Behavior: clear button when there is text; Enter submits (the script prevents navigation unless the form has an `action`, and fires `hk:search`); Esc clears, then leaves; the Cancel button shows only on compact widths (max 743 px) while the field is active, and clears and blurs. Changing the scope re-fires `hk:search` when there is a query. Does not: show suggestions, results or tokens.

## 9. Pop-up button (`.hk-select`)

Rules: `pop-up-buttons/best-practices/use-a-pop-up-button-to` `pop-up-buttons/best-practices/provide-a-useful-default-selection` `pop-up-buttons/best-practices/give-people-a-way-to-predict` `pop-up-buttons/best-practices/consider-using-a-pop-up-button` `pickers/best-practices/use-predictable-and-logically-ordered-values` `entering-data/best-practices/when-possible-offer-choices-instead-of`

```html
<div class="hk-select"><select class="hk-select__input" id="l"><option>한국어</option>…</select><svg class="hk-icon" aria-hidden="true">…chevron-down…</svg></div>
```

Native select (the system draws the list, so keyboard and screen readers work as is); `.hk-select--inline` makes a tinted capsule. Always give it a label. Does not: restyle the options list.

## 10. Date and time pickers

Rules: `pickers/best-practices/consider-using-a-picker-to-offer` `pickers/best-practices/avoid-switching-views-to-show-a` `pickers/platform-considerations/ios-ipados/use-a-compact-date-picker-when` `pickers/best-practices/consider-providing-less-granularity-when-specifying` `pickers/platform-considerations/macos/choose-a-date-picker-style-that`

```html
<div class="hk-field" data-hk="field"><label class="hk-field__label" for="d">날짜</label>
  <div class="hk-field__control"><input class="hk-field__input" id="d" type="date">
  <svg class="hk-icon hk-field__icon" aria-hidden="true">…calendar…</svg></div></div>
```

Native `date`, `time`, `datetime-local` and `month` inputs styled like the text field; the picker opens from the whole field (Chromium and Safari) and by Alt+Down. Use `min`, `max` and `step` to limit granularity. Does not: draw an inline calendar or wheel.

## Not covered

Tokens that were missing: a track color that stays visible on the card fill in dark (the kit defines `--hk-track` and `--hk-raised` in `hk-controls.css` from existing tokens), and a disabled-text color (uses `--label-3` with reduced opacity).


## 11. Completion check (`.hk-complete`, `data-hk="complete"`)

The name `.hk-check` already belongs to the macOS-density checkbox in section 3, so the circular completion control is `.hk-complete`.

Rules: `toggles/platform-considerations/ios-ipados/outside-of-a-list-use-a` `toggles/best-practices/clearly-identify-the-setting-view-or` `toggles/best-practices/make-sure-the-visual-differences-in` `toggles/best-practices/use-a-toggle-to-help-people` `color/inclusive-color/avoid-relying-solely-on-color-to` [HIG none] for the circle shape (no HIG completion control; it follows the toggle-like button guidance).

```html
<div class="task-row">
  <button type="button" class="hk-complete" data-hk="complete" role="checkbox" aria-checked="false"
          aria-label="‘우유 사기’ 완료" data-strike="#t1"></button>
  <span class="hk-strike" id="t1">우유 사기</span>
</div>
```

Semantics: a real `button` with `role="checkbox"` and `aria-checked`, or without a role and with `aria-pressed="false"` for a plain toggle button (the script keeps whichever you wrote). The accessible name names the task (`‘우유 사기’ 완료`); do not put the state in the name. Space, Enter and click toggle; `hk:change` fires with `{checked}`. Setting `aria-checked` from your own code works too: the strike-through follows.
Look: the visible circle is 24 px (18 px in `.hk-mac`) inside a 44 px hit area (28 px in `.hk-mac`). Unchecked is an empty ring (`--label-3`, ring only, 3:1 against the surface); checked is a filled circle with a check mark. The check mark and the optional strike-through carry the state, not color. Increased contrast turns the ring black or white; forced colors use system colors; disabled uses `disabled`.
Options: `data-strike="#id"` toggles `data-done="true"` on that element; add `.hk-strike` to it for the strike-through and secondary color (`--label-2`). Without the helper the row text is yours to style from `[data-done]`.
Does not: move or reorder the row (an app that settles done rows elsewhere should wait until the person leaves the screen), confirm, undo, or draw a label (put the visible text beside it).


## HIG Kit: nav (navigation and containers)

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


## HIG Kit · status

Status and feedback components. Files: `hk-status.css`, `hk-status.js` (needs `hk-base.css` and `hk-base.js`), gallery in `gallery-status.html`. Rules from `KIT-SPEC.md` apply: tokens only, semantic HTML, `data-hk` binding, states through ARIA attributes. Components bind with `data-hk="name"`; none of them needs another group.

Load order:

```html
<link rel="stylesheet" href="hk-base.css"><link rel="stylesheet" href="hk-status.css">
<script src="hk-base.js"></script><script src="hk-status.js"></script>
```

Local hooks (not new tokens): `--hk-tabbar-h` (set on `:root` to your tab bar height so the toast clears it on compact), `--hk-toast-bottom`, `--hk-arrow-x`.

## 1. Progress bar (determinate)

Rules: `progress-indicators/best-practices/when-possible-use-a-determinate-progress` `progress-indicators/best-practices/be-as-accurate-as-possible-when` `progress-indicators/best-practices/if-its-helpful-display-a-description` `progress-indicators/best-practices/keep-progress-indicators-moving-so-people` `progress-indicators/best-practices/display-a-progress-indicator-in-a` `loading/showing-progress/clearly-communicate-that-content-is-loading`

```html
<div class="hk-progress" data-hk="progress" data-value-text="{value} / {max} MB">
  <div class="hk-progress__head"><span class="hk-progress__label" id="up">사진 업로드 중</span><span class="hk-progress__value"></span></div>
  <progress class="hk-progress__bar" aria-labelledby="up" value="42" max="120"></progress>
</div>
```

Options: `data-value-text` with `{value}`, `{max}`, `{percent}` (default `{percent}%`); `data-state="error"` with a `.hk-progress__note` that says what is wrong and what happens next; `data-state="done"` is set automatically at 100%. Change `progress.value` and the text follows.
Does not do: indeterminate bars (use the activity indicator), cancel or pause controls (add a button next to the label when stopping is safe), and a stalled-state timer.

## 2. Activity indicator (indeterminate)

Rules: `progress-indicators/platform-considerations/macos/prefer-an-activity-indicator-spinner-to` `progress-indicators/best-practices/when-possible-switch-a-progress-bar` `progress-indicators/best-practices/keep-progress-indicators-moving-so-people` `progress-indicators/best-practices/if-its-helpful-display-a-description` `accessibility/cognitive/be-cautious-with-fast-moving-and`

```html
<span class="hk-activity"><span class="hk-spinner" role="progressbar" aria-labelledby="l"></span><span id="l">검색 결과 불러오는 중</span></span>
```

Options: `.hk-spinner--sm` and `--lg`; without a visible label use `aria-label` on the spinner. With Reduce Motion it does not spin: a static partial ring remains, so keep the visible text label.
Does not do: switch to a bar by itself; replace the element yourself once the length is known.

## 3. Progress ring (determinate, small)

Rules: `progress-indicators/best-practices/when-possible-use-a-determinate-progress` `progress-indicators/best-practices/dont-switch-from-the-circular-style` `progress-indicators/best-practices/be-as-accurate-as-possible-when` `progress-indicators/best-practices/display-a-progress-indicator-in-a`

```html
<div class="hk-ring-row">
  <div class="hk-ring" data-hk="ring" role="progressbar" aria-label="웹사이트 리뉴얼 완성도" aria-valuemin="0" aria-valuemax="100" aria-valuenow="60">
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle class="hk-ring__track" cx="12" cy="12" r="10" pathLength="100"/><circle class="hk-ring__fill" cx="12" cy="12" r="10" pathLength="100"/></svg>
    <span class="hk-ring__check"><!-- check icon --></span>
  </div>
  <span class="hk-ring-row__text"><span>웹사이트 리뉴얼</span><span class="hk-ring-row__value"></span></span>
</div>
```

Options: set `aria-valuenow`; the arc, `aria-valuetext` (`data-value-text`, default `{percent}% 완료`) and the done check (`data-complete`, green) follow. Does not do: a number inside the ring (32 px is too small for legible text).

## 4. Toast with undo

Rules: `undo-and-redo/best-practices/help-people-predict-the-results-of` `undo-and-redo/best-practices/show-the-results-of-an-undo` `keyboards/standard-keyboard-shortcuts/in-general-dont-repurpose-standard-keyboard` `undo-and-redo/platform-considerations/ios-ipados/briefly-and-precisely-describe-the-operation` `feedback/best-practices/make-sure-all-feedback-is-accessible` `feedback/best-practices/when-it-makes-sense-confirm-that` `feedback/best-practices/consider-integrating-status-feedback-into-your`

```js
HK.toast({ message: '‘회의 메모’를 삭제했어요', undoLabel: '실행 취소', undoneMessage: '삭제를 취소했어요',
           onUndo: () => restore(), duration: 8000 /* 0 = stay */, container: optionalElement });
```

Static markup (for server-rendered toasts): `<div class="hk-toast" data-hk="toast-item"><p class="hk-toast__msg" role="status">…</p><button class="hk-toast__undo" data-toast-undo>실행 취소</button><button class="hk-toast__close" data-toast-close aria-label="닫기">…</button></div>`.
Behavior: one toast at a time (a new one replaces the old). `duration: 0` stays until dismissed or replaced; otherwise it hides after the duration, never under 6000 ms, and the timer pauses while the pointer is over it or focus is inside. Esc closes it; Ctrl/Cmd+Z undoes while it shows (not while typing), an option: pass `shortcut: false` (static markup: `data-shortcut="false"`) to turn it off, or `shortcut: true` to force it on. Left out, it is on unless the page contains an element with `data-hk-own-undo` (put it on `<html>` or `<body>` when the app has its own undo stack), so the toast never competes with the app's Ctrl+Z; an event already handled (`defaultPrevented`) is also left alone. The Undo button always works. The fixed region is inserted right after the opener, so Tab reaches Undo next. Undo announces `undoneMessage` and returns focus to the opener if it is still on screen. Position: above `--hk-tabbar-h` on compact, bottom center on regular. Events: `hk-undo`, `hk-toast-dismiss`.
Does not do: queues, swipe to dismiss, or glass (a toast is content feedback, so it uses an opaque elevated surface). When the opener was hidden by the action, focus is not restored; move it to a sensible row yourself.

## 5. Empty state

Rules: `writing/best-practices/provide-clear-next-steps-on-any` `tab-bars/best-practices/dont-disable-or-hide-tab-bar` `feedback/best-practices/show-people-when-a-command-cant` `writing/best-practices/be-action-oriented` `writing/getting-started/be-clear`

```html
<div class="hk-empty"><div class="hk-empty__icon" aria-hidden="true"><!-- icon --></div>
  <h3 class="hk-empty__title">아직 프로젝트가 없어요</h3>
  <p class="hk-empty__text">프로젝트를 만들면 할 일과 진행 상황을 한곳에서 볼 수 있어요.</p>
  <button type="button" class="hk-empty__action">프로젝트 만들기</button></div>
```

Variants in the gallery: empty list, no search results (name the query, offer to clear it), unavailable content (explain why, action disabled while offline). Does not do: a second action, illustrations beyond one icon.

## 6. Tips

Rules: `offering-help/creating-tips/use-the-most-appropriate-tip-type` `offering-help/creating-tips/use-tips-for-simple-features` `offering-help/creating-tips/make-tips-short-actionable-and-engaging` `offering-help/creating-tips/define-rules-to-help-ensure-your` `offering-help/creating-tips/if-theres-an-image-or-symbol` `offering-help/creating-tips/use-buttons-to-direct-people-to` `popovers/best-practices/show-one-popover-at-a-time`

Inline: `<div class="hk-tip" data-hk="tip" role="group" aria-labelledby="h">` with `.hk-tip__icon`, `.hk-tip__body` (`.hk-tip__title`, `.hk-tip__text`, optional `.hk-tip__action`) and `<button class="hk-tip__close" data-tip-close aria-label="팁 닫기">`.
Popover: same markup plus `class="hk-tip hk-tip--popover"`, `data-anchor="#element"`, `hidden`, and a first child `<span class="hk-tip__arrow" aria-hidden="true">`. Open with `HK.tip.show('#tip', {focus:true})` or a `data-hk="tip-open" data-target="#tip"` button; opening one hides the other. It sits below the anchor (above when there is no room), the arrow points at the anchor, the anchor gets `aria-describedby` while it shows, Esc or the close button closes it and focus returns to the opener. Events: `hk-tip-close` (store that the tip was dismissed).
Does not do: eligibility rules or frequency limits (the app decides when to call `show`), filled icons (Lucide is outline).

## 7. Badge

Rules: `tab-bars/best-practices/use-a-badge-to-indicate-that` `notifications/badging/use-a-badge-only-to-show` `notifications/badging/make-sure-badging-isnt-the-only` `notifications/badging/keep-badges-up-to-date`

```html
<span class="hk-badge-host"><!-- icon --><span class="hk-badge hk-badge--corner" data-hk="badge" data-count="3" data-label="읽지 않은 메시지 {n}개"></span></span>
```

Options: `data-count` (0 hides it), `data-max` (default 99, shows `99+`), `data-label` for the hidden spoken text, `.hk-badge--corner` for tab icons, `.hk-badge--quiet` for sidebar rows. Update `dataset.count` and it re-renders. Does not do: dots without numbers, unrelated numbers (scores, prices).

## 8. Placeholder skeletons

Rules: `loading/best-practices/show-something-as-soon-as-possible` `loading/showing-progress/clearly-communicate-that-content-is-loading` `loading/best-practices/let-people-do-other-things-in` `accessibility/cognitive/be-cautious-with-fast-moving-and`

```html
<div data-hk="skeleton" aria-busy="true">
  <div class="hk-skeleton-list" data-skeleton-placeholder><span class="hk-visually-hidden" role="status">목록을 불러오는 중</span>
    <div class="hk-skeleton-row" aria-hidden="true"><span class="hk-skeleton__avatar"></span><span class="hk-skeleton-text"><span class="hk-skeleton__line"></span><span class="hk-skeleton__line hk-skeleton__line--short"></span></span></div></div>
  <div data-skeleton-content hidden>…real content…</div>
</div>
```

Call `el.hkLoaded(true)` when content arrives (sets `aria-busy="false"`, swaps the parts). Also `.hk-skeleton-card` with `.hk-skeleton__thumb`. Shimmer stops under Reduce Motion. Does not do: a timeout for slow loads (add a progress bar or message yourself).

## 9. Bar chart (SVG)

Rules: `charting-data/best-practices/make-every-chart-in-your-app` `charts/enhancing-the-accessibility-of-a-chart/write-accessibility-labels-that-support-the` `charts/descriptive-content/summarize-the-main-message-of-your` `charts/axes/prefer-familiar-sequences-of-values-in` `charts/axes/define-the-value-of-the-lower` `charts/best-practices/in-a-compact-environment-maximize-the` `charts/color/avoid-relying-solely-on-color-to` `charting-data/designing-effective-charts/in-general-prefer-using-common-chart`

```html
<figure class="hk-chart" data-hk="bar-chart" data-unit="명" data-x-label="요일" data-y-label="방문자">
  <figcaption><strong class="hk-chart__title">토요일 방문자가 가장 많아요</strong><br><span class="hk-chart__summary">토요일에 212명으로 정점이에요.</span></figcaption>
  <table><caption>요일별 방문자 수</caption><thead><tr><th scope="col">요일</th><th scope="col">방문자(명)</th></tr></thead>
    <tbody><tr><th scope="row">월</th><td>120</td></tr>…</tbody></table>
</figure>
```

The table is the data source and the accessible fallback: JS draws the SVG from it, hides the table visually (`hk-visually-hidden`, still in the accessibility tree), gives the SVG `role="img"` named by the title, summary and a hidden description of type, axes and range. Axis starts at zero with familiar tick steps; values sit above the bars; the unit sits in the axis title; the plot redraws on resize. Does not do: line or stacked charts, multiple series, tooltips or keyboard scrubbing, rotated axis labels (long labels are thinned instead; keep them short).


## 10. Gauge `.hk-gauge`

Rules: `gauges/best-practices/write-succinct-labels-that-describe-the` `gauges/best-practices/consider-filling-the-path-with-a` `gauges/platform-considerations/macos/consider-changing-the-fill-color-to` `color/inclusive-color/avoid-relying-solely-on-color-to` `progress-indicators/best-practices/if-its-helpful-display-a-description`. Use a gauge for a level within a range that is not running (a project's share done, storage used); for something in progress use the progress bar.

```html
<div class="hk-gauge hk-gauge--slim" data-hk="gauge" data-value-text="{max}개 중 {value}개 완료" data-empty-text="할 일이 아직 없어요" data-full-text="모두 끝냈어요">
  <div class="hk-gauge__head"><span class="hk-gauge__label" id="g1">웹사이트 리뉴얼</span><span class="hk-gauge__value"></span></div>
  <div class="hk-gauge__track" role="meter" aria-labelledby="g1" aria-valuemin="0" aria-valuemax="8" aria-valuenow="3"><span class="hk-gauge__fill"></span></div>
</div>
```

Behavior: the bar is a `role="meter"` named by the label; change `aria-valuenow` (or min, max) and the fill, the visible value text and `aria-valuetext` follow. The text always shows, so the level never depends on the bar alone. Options: `data-value-text` with `{value}`, `{max}`, `{percent}` (default `{value} / {max}`); `data-empty-text` replaces the text and hides the bar when max is 0; `data-full-text` when the value reaches max; `.hk-gauge--slim` (4 px; default 8 px), `.hk-gauge--accent`; `.hk-gauge__ends` with two spans for the names of the range ends (`0`, `8` or `비어 있음`, `가득`); `data-warn` and `data-critical` (fractions such as `0.8`, `0.95`) switch the fill to the warning and destructive colors for a capacity gauge, and the text still states the level. Fill is `--label-2` by default (4:1 or more on the track, both appearances); increased contrast uses `--label` and outlines the track.
Does not: show a running task (progress bar), gradients, circular or segmented styles, or a needle.

## 11. Banner `.hk-banner`

Rules: `feedback/best-practices/use-alerts-to-deliver-critical-and` `feedback/best-practices/make-sure-all-feedback-is-accessible` `feedback/best-practices/consider-integrating-status-feedback-into-your` `color/inclusive-color/avoid-relying-solely-on-color-to` `accessibility/cognitive/minimize-use-of-time-boxed-interface`. A banner component is [HIG none]; this is the house pattern for a problem that is not critical or does not need a decision: it stays in the layout next to what it describes, it is not an alert.

```html
<section class="hk-banner hk-banner--warning" data-hk="banner">
  <svg class="hk-icon hk-banner__icon" aria-hidden="true">…triangle-alert…</svg>
  <div class="hk-banner__body"><h3 class="hk-banner__title">저장 공간이 가득 찼어요</h3><p class="hk-banner__text">새 내용은 저장되지 않아요. 이미 저장한 내용은 그대로예요.</p></div>
  <div class="hk-banner__actions"><button type="button" class="hk-banner__action">백업 파일 받기</button><button type="button" class="hk-banner__action hk-banner__action--plain">자세히</button></div>
</section>
```

Variants: `hk-banner--info` (default, accent icon), `--warning`, `--error`. The icon shape differs per variant (info circle, warning triangle, error circle with mark), so the variant is not carried by color alone. Title and text are always `--label` on a 10% tint of the variant color over the elevated surface (error text on that tint is black in light and white in dark, far above 4.5:1; only the icon uses the variant color). Up to two actions as `.hk-banner__action` buttons (44 px target; add `--plain` for the quieter one; the controls group is not needed; `hk-btn` fits as well); they sit under the text, aligned with it, at every width (the layout never depends on how wide the banner is, so it also works in a narrow pane). The script gives the banner `role="alert"` (error) or `role="status"` (others) unless you set a role, and names it from the title; set `role="region"` yourself if a banner already on the page at load should not be announced.
Does not: dismiss itself or time out (remove it in your code when the problem is gone), stack (show the most important one), use glass, or take the place of an alert for critical, actionable situations.
