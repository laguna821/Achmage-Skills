# HIG Kit: controls

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
