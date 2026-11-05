# Medium: Native Apple platform apps

**Baseline:** The platform you are building for. The HIG is written for these apps, so its rules apply directly. Start from the matching profile, then read the component card for each element you use.

## How to use the platform profiles

1. Pick the target platform and open its profile: [iOS](../platforms/ios.md) · [iPadOS](../platforms/ipados.md) · [macOS](../platforms/macos.md) · [tvOS](../platforms/tvos.md) · [visionOS](../platforms/visionos.md) · [watchOS](../platforms/watchos.md) · [Games](../platforms/games.md).
2. Read "Key numbers" first (default and minimum text size, default and minimum control size). The same values are in `../tokens.md`.
3. Read "Stated as not supported". If a component is listed there, do not use it on that platform (for example tab views and outline views are not iOS components, and the menu bar is a macOS idea).
4. Read the platform-specific rules on other pages. They override the general rule for that platform only.
5. Open the component card and check its "Platform differences" section before you build.
6. Several platforms: keep functions, content and structure the same and change only the amount shown, the input style and the layout. `design-principles/flexibility/preserve-a-persons-context` `design-principles/flexibility/approach-every-platform-with-intention` `layout/adaptability/size-classes/keep-functionality-the-same-as-size`
7. Decide layout by size class, not by device or orientation. `layout/adaptability/size-classes/determine-layout-based-on-size-classes` `layout/adaptability/size-classes/consider-all-possible-combinations-of-size`

| Platform | Default / minimum text | Default / minimum control | What the profile adds |
| --- | --- | --- | --- |
| iOS, iPadOS | 17 / 11 pt | 44x44 / 28x28 pt | touch, tab bar first, sheets and detents, keyboard handling |
| macOS | 13 / 10 pt | 28x28 / 20x20 pt | pointer and keyboard, menu bar, windows |
| tvOS | 29 / 23 pt | 66x66 / 56x56 pt | focus, remote, distance viewing, 1920x1080 grid |
| visionOS | 17 / 12 pt | 60x60 / 28x28 pt | windows, ornaments, depth, comfort |
| watchOS | 16 / 12 pt | 44x44 / 28x28 pt | glances, complications, few controls per row |

Values are from `../tokens.md`; the HIG also states the 44x44 pt hit region for buttons. `buttons/best-practices/make-buttons-easy-for-people-to`

## Applies as written [HIG]

**Principles and purpose**
- Ask what the product is for at each step and keep the few key features excellent. `design-principles/purpose/create-value` `design-principles/purpose/keep-focused`
- Get people to their task and let them recover from mistakes. `design-principles/agency/stay-out-of-the-way` `design-principles/agency/help-people-recover-from-mistakes`
- Reuse a look or behavior everywhere once you set it, and give clear feedback. `design-principles/familiarity/keep-visuals-and-interactions-consistent` `design-principles/familiarity/provide-clear-feedback`

**Layout and hierarchy**
- Put key items toward the top and leading edge, align for scanning, group related items, and reveal more progressively. `layout/visual-hierarchy/order-content-by-relative-importance` `layout/visual-hierarchy/align-elements-to-make-them-easier` `layout/visual-hierarchy/group-related-items-to-clearly-express` `layout/visual-hierarchy/use-progressive-disclosure-to-make-layouts`
- Respect safe areas, margins and guides, and preview on several devices, localizations and text sizes. `layout/adaptability/design-a-layout-that-adapts-gracefully` `layout/adaptability/preview-your-app-on-multiple-devices`
- Reflow for larger text. `layout/adaptability/be-prepared-for-text-size-changes`

**Type and color**
- Stay at or above each platform's default and minimum sizes, and vary weight, size and color for hierarchy. `typography/ensuring-legibility/use-font-sizes-that-most-people` `typography/conveying-hierarchy/adjust-font-weight-size-and-color`
- Use as few typefaces as possible. `typography/conveying-hierarchy/minimize-the-number-of-typefaces-you`
- Support Dynamic Type: adapt the layout, keep truncation low, and keep the information order the same at every size. `typography/supporting-dynamic-type/make-sure-your-apps-layout-adapts` `typography/supporting-dynamic-type/keep-text-truncation-to-a-minimum` `typography/supporting-dynamic-type/maintain-a-consistent-information-hierarchy-regardless`
- Let people enlarge text or icons by at least 200 percent (140 percent on watchOS). `accessibility/vision/support-larger-text-sizes`
- Keep a color's meaning constant, test in light, dark and increased contrast, and never use color alone. `color/best-practices/avoid-using-the-same-color-to` `color/best-practices/make-sure-all-your-apps-colors` `color/inclusive-color/avoid-relying-solely-on-color-to`
- Follow the systemwide appearance and keep contrast at least 4.5:1 in every appearance. `dark-mode/best-practices/avoid-offering-an-app-specific-appearance` `dark-mode/dark-mode-colors/aim-for-sufficient-color-contrast-in`
- Apply system colors through the platform API, not copied values. `color/system-colors/avoid-hard-coding-system-color-values`

**Patterns**
- Launch fast, restore state, and keep the launch screen plain and nearly the same as the first screen. `launching/best-practices/launch-instantly` `launching/best-practices/restore-the-previous-state-when-your` `launching/launch-screens/design-a-launch-screen-thats-nearly`
- Keep onboarding short, skippable and about your own app. `onboarding/best-practices/if-you-need-to-present-a` `onboarding/best-practices/keep-onboarding-content-focused-on-the`
- Ask for permission only when a feature needs it, with one clear sentence. `privacy/requesting-permission/request-permission-only-when-your-app` `privacy/requesting-permission/write-copy-that-clearly-describes-how`
- Use modals only when they help focus, and always give a clear way out. `modality/best-practices/present-content-modally-only-when-theres` `modality/best-practices/always-give-people-an-obvious-way`
- Show something at once while loading. `loading/best-practices/show-something-as-soon-as-possible`
- Use the system rating prompt. `ratings-and-reviews/best-practices/prefer-the-system-provided-prompt`

**Components** (read each card; the card holds the full rule set)
- [Tab bars](../components/tab-bars.md), [Sidebars](../components/sidebars.md), [Toolbars](../components/toolbars.md), [Split views](../components/split-views.md): see [Decision tree: navigation](../decision-trees.md#navigation-structure).
- [Alerts](../components/alerts.md), [Action sheets](../components/action-sheets.md), [Sheets](../components/sheets.md), [Popovers](../components/popovers.md): see [Decision tree: alerting](../decision-trees.md#alerting-and-confirming).
- Inputs: [Gestures](../components/gestures.md), [Keyboards](../components/keyboards.md), [Virtual keyboards](../components/virtual-keyboards.md), [Pointing devices](../components/pointing-devices.md), [Focus and selection](../components/focus-and-selection.md).
- Technologies: [Apple Pay](../components/apple-pay.md), [Sign in with Apple](../components/sign-in-with-apple.md), [Widgets](../components/widgets.md), [Live Activities](../components/live-activities.md), [Notifications](../components/notifications.md), [VoiceOver](../components/voiceover.md).

## House overrides and where they conflict with the HIG [House]

Two house decisions replace Apple resources, even in native Apple apps. Tell the user about every conflict below in your rationale, and do not hide it.

### Font: Pretendard Variable instead of Apple fonts [House]

The HIG describes San Francisco and New York as the system fonts and prefers them with the built-in text styles. The house rule uses Pretendard Variable. The HIG does not forbid custom fonts, so the override is allowed, but these rules still apply to it.

**Where the HIG prefers system fonts (disclose):**
- Prefer the built-in text styles with system fonts to express hierarchy. `typography/using-system-fonts/consider-using-the-built-in-text`
- The advice to avoid Ultralight, Thin and Light is stated for system fonts. `typography/ensuring-legibility/in-general-avoid-light-font-weights`
- Tracking advice is for variable system fonts. `typography/using-system-fonts/if-necessary-adjust-tracking-in-interface` Do not apply the HIG tracking tables to Pretendard (see `../tokens.md`).
- On macOS, dynamic system font variants match standard controls. `typography/platform-considerations/macos/when-necessary-use-dynamic-system-font`
- Widgets favor the system font and text styles, and a custom font only sparingly. `widgets/best-practices/displaying-text-in-widgets/prefer-using-the-system-font-text`
- A custom Sign in with Apple button prefers the system font for its title. `sign-in-with-apple/displaying-buttons/creating-a-custom-sign-in-with-apple-button/custom-buttons-with-a-logo-and-text/prefer-the-system-font-for-the`
- Standard system controls and views draw text with the system font; text drawn through system views follows the system. `dark-mode/dark-mode-colors/text/use-system-views-to-draw-text`

**What the HIG requires of a custom font (the conditions for the override):**
- Keep it legible and follow the recommended minimum size for each style and weight. `typography/using-custom-fonts/make-sure-custom-fonts-are-legible` `accessibility/vision/use-recommended-defaults-for-custom-type`
- Make it honor Dynamic Type and Bold Text as system fonts do. `typography/using-custom-fonts/implement-accessibility-features-for-custom-fonts`
- A thin face needs sizes above the recommended ones. `accessibility/vision/bear-in-mind-that-font-weight`
- A brand font is acceptable if it stays legible at every size. `branding/best-practices/consider-using-a-custom-font`

**How to apply:** use the platform's own type scale in `../tokens.md` (sizes and leading), and map weights to Pretendard (Regular 400, Medium 500, Semibold 600, Bold 700, Heavy 800). Keep Regular or heavier unless you have tested a lighter weight. In a native build, the font file must be bundled and wired to Dynamic Type so sizes scale; if you cannot do that, say so, because it breaks the custom-font rule above.

### Icons: Lucide with the icons.md spec instead of SF Symbols [House]

Follow all 15 rules in `../icons.md`. The HIG asks for consistent size, detail, stroke weight and perspective, not for a specific library, so Lucide is allowed. The HIG still prefers SF Symbols in these places (disclose each one you override):
- Dark Mode: choose SF Symbols wherever possible. `dark-mode/dark-mode-colors/icons-and-images/use-sf-symbols-wherever-possible`
- Tab bars: SF Symbols, preferably filled, that adapt between compact and regular layouts. `tab-bars/best-practices/consider-using-sf-symbols-to-provide`
- Sidebars: familiar SF Symbols, and custom symbols rather than bitmaps. `sidebars/best-practices/consider-using-familiar-symbols-to-represent`
- Toolbars: system-provided symbols without added borders. `toolbars/actions/prefer-system-provided-symbols-without-borders`
- Standard Back and Close use their standard symbols. `toolbars/navigation/use-the-standard-back-and-close`
- Buttons and undo or redo: standard symbols for familiar actions. `buttons/content/try-to-associate-familiar-actions-with` `undo-and-redo/best-practices/provide-undo-and-redo-buttons-only`
- Widgets: system font, text styles and SF Symbols. `widgets/best-practices/displaying-text-in-widgets/prefer-using-the-system-font-text`
- Notification actions: an icon based on an SF Symbol. `notifications/notification-actions/provide-a-simple-recognizable-interface-icon`
- Dynamic Type: SF Symbols scale automatically; other icons must be scaled with the text yourself. `typography/supporting-dynamic-type/increase-the-size-of-meaningful-interface`
- Animated symbols and rendering modes (hierarchical, palette, multicolor) are SF Symbols features. `motion/providing-feedback/consider-using-animated-symbols-where-it` `sf-symbols/rendering-modes/confirm-that-a-symbols-rendering-mode` Use `../icons.md` rules 12 and 13 instead (one color, lower opacity for hierarchy, purposeful animation).
- Watch sheets: an SF Symbol replaces a text label. `sheets/platform-considerations/watchos/if-you-change-the-default-label`
- Game controller elements are named with SF Symbols. `game-controls/physical-controllers/prefer-using-symbols-not-text-to`

**Custom icons:** Lucide icons are not custom symbols, but the same craft applies. Match system-like detail, weight and alignment, give every icon an accessibility label, and never copy Apple hardware. `sf-symbols/custom-symbols/use-the-template-as-a-guide` `sf-symbols/custom-symbols/provide-alternative-text-labels-for-custom` `icons/best-practices/avoid-using-replicas-of-apple-hardware` `icons/best-practices/provide-alternative-text-labels-for-custom`

The app icon is not covered by this override. Follow the [App icons](https://developer.apple.com/design/human-interface-guidelines/app-icons) page and the specification table in `../tokens.md`, and keep it free of custom blur, glow and shadow effects. `app-icons/visual-effects/let-the-system-handle-blurring-and`

## Translate [HIG transfer]

| HIG element | Equivalent here | How | Rules |
| --- | --- | --- | --- |
| System font and text styles | Pretendard Variable with the platform scale | Keep style names, sizes and leading from `../tokens.md`; change only the family and weights | `typography/using-system-fonts/consider-using-the-built-in-text` |
| SF Symbols | Lucide plus `../icons.md` spec | Match stroke to text weight, size in em, label every icon | `icons/best-practices/maintain-visual-consistency-across-all-interface` |
| Symbol rendering modes | One color, lower opacity for secondary strokes | Do not use multicolor unless color carries meaning | `sf-symbols/rendering-modes/confirm-that-a-symbols-rendering-mode` |
| System colors | Same hex values only when you cannot call the API | Prefer the API; copy values from `../tokens.md` only for mockups or non-native output | `color/system-colors/avoid-hard-coding-system-color-values` |

## Does not apply

- Components listed as unsupported in the target platform's profile.
- Rules tagged for another platform: for example visionOS depth and ornament rules do not apply on iOS.
- Developer-only API detail (asset catalogs, Icon Composer export steps). Mention it only when you hand off to a developer.

## Ask the user first [HIG none]

- Which platforms and devices are in scope, and the minimum OS version. The HIG cannot decide this.
- Whether the Pretendard and Lucide overrides are accepted for a store submission or a brand that must look system-native. The HIG does not say whether to use a custom font or icon set for a given product beyond the conditions above.
- Brand colors, logo and tone (the HIG says branding should defer to content but names no values). `branding/best-practices/ensure-branding-always-defers-to-content`
- Languages to support, since Pretendard coverage and right-to-left needs depend on it.
- How to bundle fonts and icons in the build, and licensing review.

## House style here [House]

- Type: Pretendard Variable, platform scale from `../tokens.md`; iOS and iPadOS at the Large (default) Dynamic Type size, macOS built-in styles, tvOS 1920x1080 styles, watchOS scale.
- Icons: Lucide, stroke by text weight (300 = 1.5, 400 = 1.75, 500 = 2, 600 = 2.25, 700 = 2.5; calibrate by rendering), SVG viewBox `0 0 24 24`, `currentColor`, round caps and joins.
- Colors: system color values from `../tokens.md` for mockups; native builds call the system API.
- Disclose every conflict listed above in one short note to the user, not on every screen.

## Before you deliver

- [ ] Platform profile and every used component card read; no component the profile lists as unsupported. `design-principles/flexibility/approach-every-platform-with-intention`
- [ ] Text at or above the platform's default and minimum sizes, and layout holds at the largest accessibility size. `typography/ensuring-legibility/use-font-sizes-that-most-people` `typography/supporting-dynamic-type/make-sure-your-apps-layout-adapts`
- [ ] Controls meet the platform minimum size, with space between them (about 12 pt around bezeled and 24 pt around unbezeled elements). `accessibility/mobility/offer-sufficiently-sized-controls` `accessibility/mobility/consider-spacing-between-controls-as-important`
- [ ] Light, dark and increased contrast checked; no color-only meaning. `color/best-practices/make-sure-all-your-apps-colors` `accessibility/vision/convey-information-with-more-than-color`
- [ ] Every icon has an accessibility label and an on-spec stroke. `icons/best-practices/provide-alternative-text-labels-for-custom`
- [ ] Gestures have an on-screen alternative. `accessibility/mobility/offer-alternatives-to-gestures`
- [ ] Motion is purposeful and respects Reduce Motion. `motion/best-practices/add-motion-purposefully-supporting-the-experience` `accessibility/cognitive/be-cautious-with-fast-moving-and`
- [ ] Permission requests are late, specific and necessary. `privacy/requesting-permission/request-permission-only-when-your-app`
- [ ] The Pretendard and Lucide conflicts are disclosed to the user, with the HIG's system-font and SF Symbols preferences named.
