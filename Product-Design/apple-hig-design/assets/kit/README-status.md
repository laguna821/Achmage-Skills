# HIG Kit · status

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
