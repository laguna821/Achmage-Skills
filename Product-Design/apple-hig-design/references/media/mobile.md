# Medium: Mobile apps (any OS) and mobile websites

**Baseline:** iOS. The HIG's phone rules (touch, one hand, a medium-size display, short and long sessions) describe the people and the device, so they carry over to any phone. See [iOS profile](../platforms/ios.md); for tablets see [iPadOS](../platforms/ipados.md). Native iPhone apps should also read [native.md](native.md).

Key numbers (from `../tokens.md`): default text 17 pt, minimum 11 pt; default control 44x44 pt, minimum 28x28 pt. On the web, start with 1 pt = 1 CSS px. That conversion is an implementation choice, not an HIG rule.

## Applies as written [HIG]

These rules describe people, content and behavior, so they hold in any mobile product.

**Principles and content**
- Start from purpose, keep the few key features excellent, and stay out of the way. `design-principles/purpose/keep-focused` `design-principles/agency/stay-out-of-the-way`
- Make mistakes cheap to undo, and keep looks and behavior consistent. `design-principles/agency/help-people-recover-from-mistakes` `design-principles/familiarity/keep-visuals-and-interactions-consistent`
- Include just what is necessary, and be concise. `design-principles/simplicity/include-just-whats-necessary` `design-principles/simplicity/be-concise`
- Write in plain words, with the most important information first, and verb-led button labels. `writing/getting-started/be-clear` `writing/best-practices/consider-each-screens-purpose` `writing/best-practices/be-action-oriented`
- Write errors that sit near the problem, do not blame, and say how to fix it. `writing/best-practices/write-clear-error-messages`
- Welcome people on empty screens and point to the next step. `writing/best-practices/provide-clear-next-steps-on-any`
- Address people as "you", avoid jargon and slang. `inclusion/welcoming-language/pay-attention-to-how-you-refer` `inclusion/welcoming-language/avoid-using-specialized-or-technical-terms` `inclusion/welcoming-language/replace-colloquial-expressions-with-plain-language`

**Layout**
- Put key items toward the top and leading edge, align for scanning, group related items, use progressive disclosure. `layout/visual-hierarchy/order-content-by-relative-importance` `layout/visual-hierarchy/align-elements-to-make-them-easier` `layout/visual-hierarchy/group-related-items-to-clearly-express` `layout/visual-hierarchy/use-progressive-disclosure-to-make-layouts`
- Adapt gracefully, reflow for larger text, and preview on several devices, text sizes and languages. `layout/adaptability/design-a-layout-that-adapts-gracefully` `layout/adaptability/be-prepared-for-text-size-changes` `layout/adaptability/preview-your-app-on-multiple-devices`
- Design for every size class in portrait and landscape, and keep features the same while only the amount shown changes. `layout/adaptability/size-classes/consider-all-possible-combinations-of-size` `layout/adaptability/size-classes/keep-functionality-the-same-as-size`

**Type, color, accessibility**
- Text at or above 17 pt default and 11 pt minimum; vary weight, size and color for hierarchy; few typefaces. `typography/ensuring-legibility/use-font-sizes-that-most-people` `typography/conveying-hierarchy/adjust-font-weight-size-and-color` `typography/conveying-hierarchy/minimize-the-number-of-typefaces-you`
- Text must scale: keep the information order at every size and keep truncation low. `typography/supporting-dynamic-type/maintain-a-consistent-information-hierarchy-regardless` `typography/supporting-dynamic-type/keep-text-truncation-to-a-minimum`
- Allow text to grow by at least 200 percent. `accessibility/vision/support-larger-text-sizes`
- Contrast: 4.5:1 for text up to 17 pt, 3:1 for 18 pt and for bold (from `../tokens.md`). In dark appearance keep at least 4.5:1. `accessibility/vision/strive-to-meet-color-contrast-minimum` `dark-mode/dark-mode-colors/aim-for-sufficient-color-contrast-in`
- Never rely on color alone, and keep each color's meaning fixed. `color/inclusive-color/avoid-relying-solely-on-color-to` `color/best-practices/avoid-using-the-same-color-to`
- Check colors in bright and dim light and on several screens. `color/best-practices/test-your-apps-color-scheme-under` `color/best-practices/test-your-app-on-different-devices`
- Follow the system light or dark setting; do not add an app-only switch. `dark-mode/best-practices/avoid-offering-an-app-specific-appearance` `dark-mode/best-practices/ensure-that-your-app-looks-good`
- Controls at least 44x44 pt, spaced about 12 pt (bezeled) or 24 pt (unbezeled) apart. `buttons/best-practices/make-buttons-easy-for-people-to` `accessibility/mobility/consider-spacing-between-controls-as-important`
- Use simple gestures, offer an on-screen alternative, and keep core functions reachable by more than one input. `accessibility/mobility/support-simple-gestures-for-common-interactions` `accessibility/mobility/offer-alternatives-to-gestures` `gestures/best-practices/give-people-more-than-one-way`
- Do not give tap or swipe an app-specific meaning, and signal when a gesture is unavailable. `gestures/best-practices/in-general-respond-to-gestures-in` `gestures/best-practices/indicate-when-a-gesture-isnt-available`
- Do not autoplay audio or video without controls, and avoid self-dismissing timed UI. `accessibility/cognitive/let-people-control-audio-and-video` `accessibility/cognitive/minimize-use-of-time-boxed-interface`
- Do not give sound or motion alone for important information. `accessibility/hearing/support-text-based-ways-to-enjoy` `motion/best-practices/make-motion-optional`
- Right-to-left: mirror layout, back and next controls and progress, but not photos, logos or real-world objects. `right-to-left/controls/flip-controls-that-help-people-navigate` `right-to-left/images/avoid-flipping-images-like-photographs-illustrations` `right-to-left/interface-icons/dont-flip-logos-or-universal-signs`

**Patterns**
- Launch fast, restore state, keep any launch screen plain, nearly the same as the first screen, with no text or ads. `launching/best-practices/launch-instantly` `launching/best-practices/restore-the-previous-state-when-your` `launching/launch-screens/design-a-launch-screen-thats-nearly` `launching/launch-screens/avoid-including-text-on-your-launch` `launching/launch-screens/dont-advertise`
- Onboarding: short, skippable, interactive, about your app only; delay nonessential setup. `onboarding/best-practices/if-you-need-to-present-a` `onboarding/best-practices/if-it-makes-sense-to-offer` `onboarding/best-practices/teach-through-interactivity` `onboarding/additional-requests/postpone-nonessential-setup-flows-or-customization`
- Do not ask for ratings or purchases before people have used the app. `onboarding/additional-requests/prefer-letting-people-experience-your-app`
- Permissions: ask only when a feature needs it, not at launch, with one short specific sentence. `privacy/requesting-permission/request-permission-only-when-your-app` `privacy/requesting-permission/avoid-requesting-permission-at-launch-unless` `privacy/requesting-permission/write-copy-that-clearly-describes-how`
- A pre-permission screen has one button and no way around the system alert. `privacy/requesting-permission/pre-alert-screens-windows-or-views/include-only-one-button-and-make` `privacy/requesting-permission/pre-alert-screens-windows-or-views/dont-include-additional-actions-in-your`
- Accounts: delay sign-in, explain benefits, name the real method on buttons, offer account deletion in the app. `managing-accounts/best-practices/delay-sign-in-for-as-long` `managing-accounts/best-practices/always-identify-the-authentication-method-you` `managing-accounts/deleting-accounts/provide-a-clear-way-to-initiate`
- Prefer passkeys or other system sign-in over a custom scheme, and never prefill a password field. `privacy/protecting-data/avoid-inventing-custom-authentication-schemes` `entering-data/best-practices/never-prepopulate-a-password-field`
- Data entry: take data from the system when you can, show what a field needs, offer choices over typing, validate as people type. `entering-data/best-practices/get-information-from-the-system-whenever` `entering-data/best-practices/be-clear-about-the-data-you` `entering-data/best-practices/when-possible-offer-choices-instead-of` `entering-data/best-practices/dynamically-validate-field-values`
- Show the keyboard type that fits the content, and keep key fields visible above it. `virtual-keyboards/best-practices/choose-a-keyboard-that-matches-the` `virtual-keyboards/platform-considerations/ios-ipados/use-the-keyboard-layout-guide-to`
- Loading: show something at once, allow other tasks, show progress with a determinate indicator when length is known. `loading/best-practices/show-something-as-soon-as-possible` `loading/best-practices/let-people-do-other-things-in` `loading/showing-progress/clearly-communicate-that-content-is-loading`
- Modals only when they help focus; keep them short, titled, with an obvious close, and never stacked. `modality/best-practices/present-content-modally-only-when-theres` `modality/best-practices/aim-to-keep-modal-tasks-simple` `modality/best-practices/always-give-people-an-obvious-way` `modality/best-practices/let-people-dismiss-a-modal-view`
- Feedback: alerts only for critical, actionable information; warn before irreversible loss; confirm important completions. `feedback/best-practices/use-alerts-to-deliver-critical-and` `feedback/best-practices/warn-people-when-they-initiate-a` `feedback/best-practices/when-it-makes-sense-confirm-that`
- Search: give it a prominent place, show scope, offer suggestions. `searching/best-practices/if-search-is-important-give-it` `searching/best-practices/clearly-display-the-current-scope-of` `searching/best-practices/provide-suggestions-to-make-searching-easier`
- Settings: few, with good defaults; keep task options in the task. `settings/best-practices/minimize-the-number-of-settings-you` `settings/best-practices/aim-to-provide-default-settings-that` `settings/task-specific-options/when-possible-prefer-letting-people-modify`
- Notifications: honest urgency, no marketing at Time Sensitive level, permission before promotions, and an in-app place to manage them. `managing-notifications/best-practices/build-trust-by-accurately-representing-the` `managing-notifications/sending-marketing-notifications/never-use-the-time-sensitive-interruption` `managing-notifications/sending-marketing-notifications/get-peoples-permission-if-you-want` `managing-notifications/sending-marketing-notifications/make-sure-people-can-manage-their`
- Undo: allow repeated undo and name what will be undone. `undo-and-redo/best-practices/help-people-predict-the-results-of` `undo-and-redo/best-practices/let-people-undo-multiple-times`
- Haptics: complement visuals, keep them consistent and optional. `playing-haptics/best-practices/prefer-using-haptics-to-complement-other` `playing-haptics/best-practices/avoid-overusing-haptics` `playing-haptics/best-practices/make-haptics-optional`
- Motion: only with purpose, short, and cancelable. `motion/best-practices/add-motion-purposefully-supporting-the-experience` `motion/providing-feedback/aim-for-brevity-and-precision-in` `motion/providing-feedback/let-people-cancel-motion`
- Branding: content first, accent color sparingly, standard patterns even in a stylized UI. `branding/best-practices/ensure-branding-always-defers-to-content` `branding/best-practices/apply-your-apps-accent-color-judiciously` `branding/best-practices/help-people-feel-comfortable-by-using`

**Components** (open the card; iOS rows in the table below)
- Navigation: start with a [Tab bar](../components/tab-bars.md); [Sidebars](../components/sidebars.md) and [Split views](../components/split-views.md) belong to wider screens. `sidebars/platform-considerations/ios-ipados/consider-using-a-tab-bar-first` `split-views/platform-considerations/ios/prefer-using-a-split-view-in` See [Decision tree: navigation](../decision-trees.md#navigation-structure).
- Tab bars: top-level sections only, few tabs, labels with icons, never hide or disable a tab. `tab-bars/best-practices/use-a-tab-bar-to-support` `tab-bars/best-practices/use-the-appropriate-number-of-tabs` `tab-bars/best-practices/include-tab-labels-to-help-with` `tab-bars/best-practices/dont-disable-or-hide-tab-bar`
- [Toolbars](../components/toolbars.md): only essential actions, the rest in a More menu; large title that shrinks on scroll. `toolbars/platform-considerations/ios/prioritize-only-the-most-important-items` `toolbars/platform-considerations/ios/use-a-large-title-to-help`
- [Sheets](../components/sheets.md): grabber on resizable sheets, swipe down to dismiss, confirm if changes would be lost. `sheets/platform-considerations/ios-ipados/include-a-grabber-in-a-resizable` `sheets/platform-considerations/ios-ipados/support-swiping-to-dismiss-a-sheet`
- [Action sheets](../components/action-sheets.md) for choices tied to an action, short enough not to scroll; [Alerts](../components/alerts.md) short enough not to scroll. `action-sheets/platform-considerations/ios-ipados/use-an-action-sheet-not-a` `action-sheets/platform-considerations/ios-ipados/avoid-letting-an-action-sheet-scroll` `alerts/platform-considerations/ios-ipados/when-possible-avoid-displaying-an-alert`
- [Popovers](../components/popovers.md) are for wide views; in compact views use a sheet. `popovers/platform-considerations/ios-ipados/avoid-displaying-popovers-in-compact-views`
- [Search fields](../components/search-fields.md): bottom toolbar when there is room, top when bottom content matters, inline to filter one view. `search-fields/platform-considerations/ios/search-in-a-toolbar/place-search-at-the-bottom-if` `search-fields/platform-considerations/ios/search-in-a-toolbar/place-search-at-the-top-when` `search-fields/platform-considerations/ios/search-as-an-inline-field/place-search-as-an-inline-field`
- [Text fields](../components/text-fields.md): hint plus a separate label, Clear button at the trailing end, secure field for passwords. `text-fields/best-practices/show-a-hint-in-a-text` `text-fields/platform-considerations/ios-ipados/display-a-clear-button-in-the` `text-fields/best-practices/use-secure-text-fields-to-hide`
- [Toggles](../components/toggles.md): the switch style only inside a list row. `toggles/platform-considerations/ios-ipados/use-the-switch-toggle-style-only`
- [Buttons](../components/buttons.md): one or two prominent buttons, a press state on custom buttons, never a destructive primary. `buttons/style/in-general-use-a-button-that` `buttons/best-practices/always-include-a-press-state-for` `buttons/role/dont-assign-the-primary-role-to`
- [Lists and tables](../components/lists-and-tables.md): short row text, info button only for more detail, no index beside trailing controls. `lists-and-tables/content/keep-item-text-succinct-so-row` `lists-and-tables/platform-considerations/ios-ipados-visionos/use-an-info-button-only-to` `lists-and-tables/platform-considerations/ios-ipados-visionos/avoid-adding-an-index-to-a`
- [Scroll views](../components/scroll-views.md): show that content continues, no nested same-direction scrolling. `scroll-views/best-practices/make-it-apparent-when-content-is` `scroll-views/best-practices/avoid-putting-a-scroll-view-inside`
- [Pull-down buttons](../components/pull-down-buttons.md) and menus: a More pull-down saves room but hides contents. `pull-down-buttons/platform-considerations/ios-ipados/consider-using-a-more-pull-down`
- Refresh controls: refresh on a schedule, title only if useful. `progress-indicators/platform-considerations/ios-ipados/refresh-content-controls/perform-automatic-content-updates` `progress-indicators/platform-considerations/ios-ipados/refresh-content-controls/supply-a-short-title-only-if`
- [Widgets](../components/widgets.md) and [Live Activities](../components/live-activities.md) are iOS features; use Live Activities for real-time following. `widgets/platform-considerations/ios-ipados/offer-live-activities-to-show-real`

## Translate [HIG transfer]

| HIG element | Equivalent here | How | Rules |
| --- | --- | --- | --- |
| Dynamic Type | Browser text scaling and user font settings | Size in relative units from the iOS scale so text can grow; keep order and limit truncation; test at large sizes | `typography/supporting-dynamic-type/make-sure-your-apps-layout-adapts` `accessibility/vision/support-larger-text-sizes` |
| Size classes | Responsive breakpoints | Decide layout by available width, not by device or orientation | `layout/adaptability/size-classes/determine-layout-based-on-size-classes` |
| Safe areas and margins | Safe-area insets and page margins | Keep content and controls out of notches, home indicator and rounded corners | `layout/adaptability/design-a-layout-that-adapts-gracefully` |
| System appearance setting | `prefers-color-scheme` and `prefers-contrast` | Follow the setting, no in-app toggle, test increased contrast | `dark-mode/best-practices/avoid-offering-an-app-specific-appearance` `dark-mode/best-practices/test-your-content-to-make-sure` |
| System colors | Tokens from `../tokens.md` | Use named roles, not raw values scattered in code | `color/system-colors/avoid-redefining-the-semantic-meanings-of` |
| System background colors | Base and elevated surface tokens | Raise layered surfaces such as sheets over the base | `dark-mode/platform-considerations/ios-ipados/prefer-the-system-background-colors` |
| Tab bar | Bottom navigation (app) or bottom nav bar (site) | Same few top-level sections, always visible, labeled | `tab-bars/best-practices/use-a-tab-bar-to-support` |
| Large title | Page title that shrinks on scroll | Keep location visible | `toolbars/platform-considerations/ios/use-a-large-title-to-help` |
| Sheet and detents | Bottom sheet or modal route | Grabber, swipe or button to dismiss, one at a time | `sheets/platform-considerations/ios-ipados/include-a-grabber-in-a-resizable` `sheets/best-practices/display-only-one-sheet-at-a` |
| Edit menu and context menu | Long-press menu | Use one per item, never both | `context-menus/platform-considerations/ios-ipados/provide-either-a-context-menu-or` |
| Haptics | `navigator.vibrate` or native haptics, if available | Brief, optional, paired with visuals | `playing-haptics/best-practices/make-haptics-optional` |
| Launch screen | Fast first paint, skeleton of the first screen | Show the layout of the first screen, no splash | `launching/launch-screens/design-a-launch-screen-thats-nearly` |
| Permission alert | Browser or OS permission prompt | Ask in context, explain first in one sentence | `privacy/requesting-permission/request-permission-only-when-your-app` |
| Web views | In-app browser use | Brief access to a site; do not rebuild a browser | `web-views/best-practices/avoid-using-a-web-view-to` `web-views/best-practices/support-forward-and-back-navigation-when` |
| Share sheet | OS share control | Use the system share action, with a small set of choices | `collaboration-and-sharing/best-practices/provide-a-set-of-simple-sharing` |
| Vector icons | SVG | Draw icons as vectors, not PNG | `icons/best-practices/if-you-create-a-custom-interface` |
| Image resolution | Responsive images | Make each image sharp on every screen density | `images/resolution/provide-high-resolution-assets-for-all` |
| Home screen quick actions and App Shortcuts | PWA shortcuts or deep links | Order the most useful first | `app-shortcuts/platform-considerations/ios-ipados/order-shortcuts-based-on-importance` |

## Does not apply

- Developer API details (UIKit, SwiftUI, asset catalogs, Icon Composer), unless the product is a native iPhone app.
- Components the iOS profile lists as unsupported: tab views, outline views, column views, lockups, the menu bar, panels, windows, token fields, combo boxes, digit entry views, image wells, rating indicators.
- Pointer, keyboard-first and window rules for desktop; they belong to [web.md](web.md) and [macOS](../platforms/macos.md).
- Apple-only features on other OSs: Apple Pay, Sign in with Apple, Live Activities, App Clips, Face ID wording. Use their equivalents on that OS and keep the HIG's behavior rules (late, clear, optional).

## Ask the user first [HIG none]

- Target OS and form: native iOS, Android, cross-platform or mobile web, and whether to follow the host OS's own conventions. The HIG gives no Android rules. Where a non-Apple platform has a conflicting convention, the HIG's familiarity principle only says to use patterns people already know. `design-principles/familiarity/use-concepts-that-people-know`
- Screen widths and breakpoints for the web. The HIG names size classes, not pixel breakpoints. House default: compact below 744 px, regular from 744 px (house-style 11).
- Browser support, installable web app, offline behavior and performance budgets.
- The browser chrome (address bar, bottom bar) is outside the HIG; ask how it affects fixed bars.
- Language list and any right-to-left need.
- Whether a dark appearance is required.
- Analytics, ads and consent rules for the region.

## House style here [House]

- Font: Pretendard Variable. Use the iOS Large (default) scale from `../tokens.md` through the `--m-*` variables: Large Title 34/41, Title 1 28/34, Title 2 22/28, Title 3 20/25, Headline 17/22 (600), Body 17/22, Callout 16/21, Subhead 15/20, Footnote 13/18, Caption 1 12/16, Caption 2 11/13.
- Do not set text below 11 pt-equivalent (11 px). Avoid weights lighter than Regular. `typography/ensuring-legibility/in-general-avoid-light-font-weights`
- Targets: 44 px default (`--target-touch`), 28 px absolute minimum (`--target-touch-min`).
- Icons: Lucide, stroke from text weight (400 = 1.75, 500 = 2, 600 = 2.25; calibrate by rendering), sized in em beside text, SVG on a 24 px grid, `currentColor`. Rules in `../icons.md`.
- Disclose the HIG's SF Symbols preference for tab bars and toolbars only when the target is a native iPhone app; on other OSs and the web the choice is not in conflict.
- Colors: system color tokens in light, dark and increased contrast; the CSS starter in `../tokens.md` includes all three.
- **Liquid Glass look [House] [HIG transfer]:** imitate it only for controls and navigation that float above content (bars, floating buttons, page indicators), sparingly, never as the surface behind body content; use the clear variant only over visually rich backgrounds, and follow the recipe and fallbacks in [house style](../house-style.md#liquid-glass) `materials/liquid-glass/dont-use-liquid-glass-in-the` `materials/liquid-glass/use-liquid-glass-effects-sparingly` `materials/liquid-glass/only-use-clear-liquid-glass-for`

## Before you deliver

- [ ] Body text is 17 px or larger by default, and nothing is below 11 px. `typography/ensuring-legibility/use-font-sizes-that-most-people`
- [ ] Every tap target is at least 44x44 with spacing between neighbors. `buttons/best-practices/make-buttons-easy-for-people-to` `accessibility/mobility/consider-spacing-between-controls-as-important`
- [ ] Layout holds at 200 percent text and in both orientations. `accessibility/vision/support-larger-text-sizes` `layout/adaptability/size-classes/consider-all-possible-combinations-of-size`
- [ ] Contrast meets 4.5:1 for small text in light, dark and increased contrast. `accessibility/vision/strive-to-meet-color-contrast-minimum`
- [ ] Nothing depends on color, sound or motion alone. `accessibility/vision/convey-information-with-more-than-color` `motion/best-practices/make-motion-optional`
- [ ] Each gesture has a visible alternative. `accessibility/mobility/offer-alternatives-to-gestures`
- [ ] Navigation has few top-level sections and the person always knows where they are. `tab-bars/best-practices/use-the-appropriate-number-of-tabs`
- [ ] Permissions, sign-in and rating prompts come late and say why. `privacy/requesting-permission/avoid-requesting-permission-at-launch-unless` `managing-accounts/best-practices/delay-sign-in-for-as-long`
- [ ] Modals are few, titled, and easy to close. `modality/best-practices/always-give-people-an-obvious-way`
- [ ] The first screen appears quickly and shows something while content loads. `launching/best-practices/launch-instantly` `loading/best-practices/show-something-as-soon-as-possible`
