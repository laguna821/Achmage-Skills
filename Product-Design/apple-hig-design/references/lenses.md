# Lenses: eight ways to look at a design

A lens is one question set you hold up to a screen, flow, slide or card. Apply them in the order below, or pick the ones that fit the job. Every question can be answered by looking at the artifact. Every question ends with rule IDs, so a "no" becomes a finding you can cite. Labels: [HIG] applies as written, [HIG transfer] applied to another medium, [HIG none] no HIG basis.

<a id="value"></a>
## Value

**Looks at:** Whether each element earns its place by serving what the product is for.

**Questions:**
1. Can you state in one sentence what this screen, slide or card is for, and does every visible element serve that? `design-principles/purpose/create-value`
2. Are the few most important features clearly the best-made ones, rather than many features of equal weight? `design-principles/purpose/keep-focused`
3. Does the view show only what the task needs, with advanced or rare options left out? `context-menus/best-practices/prioritize-relevancy-when-choosing-items-to`, `app-clips/designing-your-app-clip/focus-on-essential-features`
4. Does the main toolbar or action area hold only essential actions, with the rest tucked away? `toolbars/platform-considerations/ios/prioritize-only-the-most-important-items`
5. Is the brand mark shown only where it gives needed context, with the space otherwise used for content and controls? `branding/best-practices/resist-the-temptation-to-display-your`
6. Does a chart or data display lead with its key takeaway? `charting-data/best-practices/use-a-chart-when-you-want`
7. Is any depth, immersion or special effect used only where it adds meaning? `spatial-layout/depth/make-sure-depth-adds-value`, `immersive-experiences/best-practices/reserve-immersion-for-meaningful-moments-and`
8. If there is an AI or generated feature, does it offer a clear, specific benefit? `generative-ai/best-practices/design-engaging-and-useful-generative-features`
9. Is the intended feeling (calm, energy, thrill) chosen and visible in the design choices? `design-principles/delight/identify-the-emotion-you-want-to`

**Typical problems:**
- Everything is promoted equally: rank features by how people want to use them and polish the top few `design-principles/purpose/keep-focused`
- Onboarding or intro content teaches the device instead of the product: refocus it on your own app `onboarding/best-practices/keep-onboarding-content-focused-on-the`
- A shortcut or action only reopens the app: support the most essential functions instead `action-button/best-practices/support-the-action-button-with-a`
- A web view is rebuilt into a mini browser: use it for brief access only `web-views/best-practices/avoid-using-a-web-view-to`
- Effects added for decoration: remove them or tie them to a meaningful moment `spatial-layout/depth/make-sure-depth-adds-value`

**Where in the HIG:** [Design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles) · [Branding](https://developer.apple.com/design/human-interface-guidelines/branding) · [Charting data](https://developer.apple.com/design/human-interface-guidelines/charting-data) · [Context menus](components/context-menus.md) · [Toolbars](components/toolbars.md) · [Generative AI](components/generative-ai.md)

<a id="attention"></a>
## Attention

**Looks at:** What people notice first, how much the design asks of them, and what it leaves quiet.

**Questions:**
1. Does the design get people to their task or content quickly and stay out of the way? `design-principles/agency/stay-out-of-the-way`
2. Is there a clear order, so people can see where they are and what follows? `design-principles/simplicity/establish-hierarchy`
3. Are the most important items placed toward the top and leading edge? `layout/visual-hierarchy/order-content-by-relative-importance`
4. Do size, weight and color separate key information from the rest, and does that hold when text size changes? `typography/conveying-hierarchy/adjust-font-weight-size-and-color`
5. Is accent color kept for primary actions and status, rather than spread over most controls? `branding/best-practices/apply-your-apps-accent-color-judiciously`, `color/liquid-glass-color/apply-color-sparingly-to-the-liquid`
6. Does each color keep one meaning, with tappable-item color not used for plain text? `color/best-practices/avoid-using-the-same-color-to`
7. Is there at most one or two prominent buttons per view, with the likely action styled as the prominent one? `buttons/style/in-general-use-a-button-that`
8. Is the chart, box or panel uncluttered, with extra detail available on demand? `charting-data/best-practices/keep-a-chart-simple-letting-people`, `disclosure-controls/best-practices/use-a-disclosure-control-to-hide`
9. Are attention cues (dimming, tinting, motion, scale) subtle first and stronger only for a good reason? `immersive-experiences/best-practices/help-people-engage-with-key-moments`
10. Is secondary content dimmed on glanceable surfaces so the key item stands out? `always-on/best-practices/keep-important-content-legible-and-dim`

**Typical problems:**
- Equal visual weight everywhere: set hierarchy with weight, size and color `typography/conveying-hierarchy/adjust-font-weight-size-and-color`
- Accent color on every control: reserve it for primary actions and status cues `branding/best-practices/apply-your-apps-accent-color-judiciously`
- Related items scattered: cluster them with space, containers or dividers `layout/visual-hierarchy/group-related-items-to-clearly-express`
- Too much shown at once: reveal more through progressive disclosure `layout/visual-hierarchy/use-progressive-disclosure-to-make-layouts`
- Controls and content blur together: separate them visually `layout/visual-hierarchy/differentiate-controls-from-content`

**Where in the HIG:** [Layout](https://developer.apple.com/design/human-interface-guidelines/layout) · [Typography](https://developer.apple.com/design/human-interface-guidelines/typography) · [Color](https://developer.apple.com/design/human-interface-guidelines/color) · [Materials](https://developer.apple.com/design/human-interface-guidelines/materials) · [Motion](https://developer.apple.com/design/human-interface-guidelines/motion) · [Buttons](components/buttons.md)

### Reading visual order

The HIG offers no eye-tracking data and no model of gaze. It never claims to predict what people look at. What it does name are the factors below, so this method is a structured reading of those factors, not a measurement. Treat the result as a hypothesis to check with the person who owns the design, and with real people if possible.

1. **Mark the intended first item.** Write down what the artifact is for and which one element or message should come first. Compare it to the result of the later steps. `design-principles/purpose/create-value`
2. **Size and weight.** List the elements by text size and weight. The HIG names weight, size and color as the tools for emphasis and hierarchy. Check that the order still holds at larger text sizes, and that only the content people care about grows. `typography/conveying-hierarchy/adjust-font-weight-size-and-color`, `typography/conveying-hierarchy/prioritize-important-content-when-responding-to`
3. **Contrast and color.** Find where color or strong contrast appears. The HIG treats color as an emphasis tool to apply sparingly, for status or primary actions. Many colored items mean none stands out. Check contrast is enough for text and icons. `color/liquid-glass-color/apply-color-sparingly-to-the-liquid`, `accessibility/vision/strive-to-meet-color-contrast-minimum`
4. **Position and grouping.** Note where each item sits. The HIG places key items toward the top and leading edge, and uses alignment, space, containers and dividers to show what belongs together. `layout/visual-hierarchy/order-content-by-relative-importance`, `layout/visual-hierarchy/align-elements-to-make-them-easier`, `layout/visual-hierarchy/group-related-items-to-clearly-express`
5. **Layers and materials.** Separate the control layer from the content layer. Glass is for controls and used sparingly, not for content. Check that controls do not blend into colorful content behind them. `layout/visual-hierarchy/differentiate-controls-from-content`, `materials/liquid-glass/dont-use-liquid-glass-in-the`, `materials/liquid-glass/use-liquid-glass-effects-sparingly`, `color/liquid-glass-color/be-aware-of-the-placement-of`
6. **Motion.** Note anything that moves or animates. Motion should serve the experience and never be the only carrier of important information. Frequent actions should not get extra animation. `motion/best-practices/add-motion-purposefully-supporting-the-experience`, `motion/best-practices/make-motion-optional`, `motion/providing-feedback/in-apps-generally-avoid-adding-motion`
7. **Build the order.** Combine the notes into a ranked list of what is likely noticed first, second and third. Where two factors point at different items, the design has a conflict: weaken one of them. `design-principles/simplicity/establish-hierarchy`
8. **Compare with step 1.** If the intended item is not first, change size, weight, color, position, grouping or layer on the evidence above, not by adding more emphasis everywhere. `design-principles/simplicity/establish-hierarchy`

For slides and cards, the factors are the same but the HIG gives no viewing distance or feed context. [HIG transfer] Use the same steps and mark any claim about reading distance as [HIG none].

<a id="flow"></a>
## Flow

**Looks at:** How a person gets from arrival to done, and how easily they can leave, undo or resume.

**Questions:**
1. Can people reach features freely, and is any guided flow easy to skip or leave? `design-principles/agency/give-people-the-freedom-to-explore`
2. Does the first screen show something useful right away, with placeholders while content loads? `launching/best-practices/launch-instantly`, `loading/best-practices/show-something-as-soon-as-possible`
3. Is the launch or opening view plain and close to the first real screen, not a brand showcase? `launching/launch-screens/design-a-launch-screen-thats-nearly`, `branding/best-practices/avoid-using-a-launch-screen-as`
4. Is sign-in postponed until people have seen the app's value? `managing-accounts/best-practices/delay-sign-in-for-as-long`
5. In a multi-step flow, does it start with a clear entry label, use one consistent term between steps and make completion clear? `writing/best-practices/give-clear-guidance-and-use-consistent`
6. Can a mistake be reversed or an earlier state restored? `design-principles/agency/help-people-recover-from-mistakes`, `drag-and-drop/best-practices/prefer-letting-people-undo-a-drag`
7. Does the Back or exit action lead somewhere predictable, and does an immersive entry or exit have a clear, prominent control? `remotes/best-practices/in-almost-all-cases-open-the`, `immersive-experiences/transitioning-between-immersive-styles/let-people-choose-when-to-enter`
8. In a split or hierarchical view, does the current selection stay highlighted so people know where they are? `split-views/best-practices/to-support-navigation-persistently-highlight-the`
9. Does checkout or a similar task stay inside the product, without sending people to other pages or windows? `apple-pay/streamlining-checkout/provide-a-cohesive-checkout-experience`
10. Do long tasks continue in the background, with progress shown and notifications only for problems? `activity-views/share-and-action-extensions/use-your-main-app-to-denote`

**Typical problems:**
- A forced tour before any value: let people explore and make the guide skippable `design-principles/agency/give-people-the-freedom-to-explore`
- Blank screen while loading: show placeholders and replace them as content arrives `loading/best-practices/show-something-as-soon-as-possible`
- Setup front-loaded in a game: teach through a playable tutorial `designing-for-games/jump-into-gameplay/teach-through-play`
- Steps with changing button labels: choose one term and keep it `writing/best-practices/give-clear-guidance-and-use-consistent`
- Dead ends after a mistake: add a way back `design-principles/agency/help-people-recover-from-mistakes`

**Where in the HIG:** [Launching](https://developer.apple.com/design/human-interface-guidelines/launching) · [Onboarding](https://developer.apple.com/design/human-interface-guidelines/onboarding) · [Loading](https://developer.apple.com/design/human-interface-guidelines/loading) · [Managing accounts](https://developer.apple.com/design/human-interface-guidelines/managing-accounts) · [Split views](components/split-views.md) · [Tab views](components/tab-views.md) · [Decision trees](decision-trees/)

<a id="interaction"></a>
## Interaction

**Looks at:** How controls look and behave, how they respond, and whether they match what people already know.

**Questions:**
1. Does an element look and act the same everywhere it appears? `design-principles/familiarity/keep-visuals-and-interactions-consistent`
2. Are standard components used, and are restyled ones still right in size, position and behavior? `branding/best-practices/express-your-brand-with-familiar-components`
3. Is there visible feedback showing what is happening, when controls are usable and when content changes? `design-principles/familiarity/provide-clear-feedback`
4. Does every custom button show a press state? `buttons/best-practices/always-include-a-press-state-for`
5. Are hit areas at least 44x44 pt (60x60 in visionOS), with enough space around them? `buttons/best-practices/make-buttons-easy-for-people-to`
6. Where possible, do people pick from choices rather than type free text? `entering-data/best-practices/when-possible-offer-choices-instead-of`
7. Are several input methods supported, such as touch, keyboard and voice? `design-principles/flexibility/consider-a-variety-of-input-methods`
8. Does motion feel physically plausible and match the gesture that caused it? `motion/providing-feedback/strive-for-realistic-feedback-motion-that`
9. Are significant completions confirmed, but only the important ones? `feedback/best-practices/when-it-makes-sense-confirm-that`
10. Do essential controls stay available, or easy to reveal, in full-screen or focused modes? `going-full-screen/best-practices/continue-to-provide-access-to-essential`

**Typical problems:**
- The same action looks different on two screens: reuse one pattern `design-principles/familiarity/keep-visuals-and-interactions-consistent`
- Small or crowded targets: enlarge and space them `buttons/best-practices/make-buttons-easy-for-people-to`
- A custom picker or player where a system one works: use the system component `color/best-practices/if-your-app-lets-people-choose`, `airplay/best-practices/prefer-the-system-provided-media-player`
- Custom effects replacing system focus: rely on system focus effects `focus-and-selection/best-practices/rely-on-system-provided-focus-effects`
- Animation people must wait through: let them act without waiting `motion/providing-feedback/let-people-cancel-motion`

**Where in the HIG:** [Buttons](components/buttons.md) · [Gestures](components/gestures.md) · [Menus](components/menus.md) · [Text fields](components/text-fields.md) · [Pickers](components/pickers.md) · [Focus and selection](components/focus-and-selection.md) · [Motion](https://developer.apple.com/design/human-interface-guidelines/motion) · [Feedback](https://developer.apple.com/design/human-interface-guidelines/feedback)

<a id="content"></a>
## Content

**Looks at:** The words, labels, data and imagery people read, and whether they say the right thing briefly.

**Questions:**
1. Is every label and sentence as short as it can be while staying clear? `design-principles/simplicity/be-concise`
2. Does each button, tab or control name say what it does, using a verb for actions and a noun for tabs? `buttons/content/consider-using-text-when-a-short`, `tab-views/best-practices/provide-a-label-for-each-tab`
3. Does the writing have a defined voice and consistent terms? `writing/getting-started/determine-your-apps-voice`
4. Does a chart state its main message in a short title and subtitle? `charts/descriptive-content/summarize-the-main-message-of-your`
5. Does a field make clear what data it needs, with prompts or defaults? `entering-data/best-practices/be-clear-about-the-data-you`
6. Does a modal or panel have a title or short line that names its task? `modality/best-practices/make-it-easy-to-identify-a`
7. Are people addressed as "you" rather than "the user", and is jargon avoided or defined? `inclusion/welcoming-language/pay-attention-to-how-you-refer`, `inclusion/welcoming-language/avoid-using-specialized-or-technical-terms`
8. Is the tone checked from several viewpoints so it does not imply something unintended? `inclusion/welcoming-language/consider-the-tone-of-your-copy`
9. Are list items short, with full content one step deeper? `lists-and-tables/content/keep-item-text-succinct-so-row`
10. Is text kept out of images and icons unless it is essential? `app-icons/design/include-text-only-when-its-essential`, `app-clips/creating-content-for-an-app-clip-card/avoid-using-text`

**Typical problems:**
- Long, wordy labels: cut to the words needed `design-principles/simplicity/be-concise`
- Inconsistent terms for the same thing: keep a term list `writing/getting-started/determine-your-apps-voice`
- Charts with no stated point: add a title and subtitle that say it `charts/descriptive-content/summarize-the-main-message-of-your`
- Unfamiliar chart form: teach how to read it `charting-data/designing-effective-charts/if-you-need-to-create-a`
- Permission text that is vague or long: one short, specific sentence `privacy/requesting-permission/write-copy-that-clearly-describes-how`

**Where in the HIG:** [Writing](https://developer.apple.com/design/human-interface-guidelines/writing) · [Inclusion](https://developer.apple.com/design/human-interface-guidelines/inclusion) · [Labels](components/labels.md) · [Charts](components/charts.md) · [Lists and tables](components/lists-and-tables.md) · [Typography](https://developer.apple.com/design/human-interface-guidelines/typography)

<a id="inclusion"></a>
## Inclusion

**Looks at:** Whether people with different abilities, devices, languages and backgrounds can use the design.

**Questions:**
1. Does the text enlarge (ideally by at least 200 percent, 140 percent in watchOS), and does the layout survive it? `accessibility/vision/support-larger-text-sizes`, `typography/supporting-dynamic-type/make-sure-your-apps-layout-adapts`
2. Is the information order the same at every text size? `typography/supporting-dynamic-type/maintain-a-consistent-information-hierarchy-regardless`
3. Do text and icons have enough contrast with their backgrounds? `accessibility/vision/strive-to-meet-color-contrast-minimum`
4. Is color never the only way to tell objects apart or carry meaning? `color/inclusive-color/avoid-relying-solely-on-color-to`
5. Is feedback given through more than one channel (color, text, sound, haptics)? `feedback/best-practices/make-sure-all-feedback-is-accessible`
6. Do controls meet the minimum size and have enough space between them? `accessibility/mobility/offer-sufficiently-sized-controls`, `accessibility/mobility/consider-spacing-between-controls-as-important`
7. Is there an alternative to each gesture or drag? `accessibility/mobility/offer-alternatives-to-gestures`, `drag-and-drop/best-practices/offer-alternative-ways-to-accomplish-drag`
8. Do charts, icons and images have text descriptions for assistive technology? `charting-data/best-practices/make-every-chart-in-your-app`, `icons/best-practices/provide-alternative-text-labels-for-custom`
9. Are dialogue and key information available as text, not audio only? `accessibility/hearing/support-text-based-ways-to-enjoy`
10. Do fast or blinking animations stay minimal, and does the design respect Reduce Motion? `accessibility/cognitive/be-cautious-with-fast-moving-and`

**Typical problems:**
- Thin type at small sizes: use heavier weights and at least the default sizes `typography/ensuring-legibility/in-general-avoid-light-font-weights`, `typography/ensuring-legibility/use-font-sizes-that-most-people`
- Red and green as the only status signal: add text or shapes `color/inclusive-color/avoid-relying-solely-on-color-to`
- Truncated text at large sizes: reflow instead `typography/supporting-dynamic-type/keep-text-truncation-to-a-minimum`
- Timed, self-dismissing views: dismiss through explicit actions `accessibility/cognitive/minimize-use-of-time-boxed-interface`
- Stereotypes in characters, copy or avatars: review and remove `generative-ai/best-practices/ensure-an-inclusive-experience-for-all`, `designing-for-games/welcome-everyone/avoid-stereotypes-in-your-stories-and`

**Where in the HIG:** [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) · [Inclusion](https://developer.apple.com/design/human-interface-guidelines/inclusion) · [Color](https://developer.apple.com/design/human-interface-guidelines/color) · [Typography](https://developer.apple.com/design/human-interface-guidelines/typography) · [VoiceOver](components/voiceover.md) · [Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode)

<a id="trust"></a>
## Trust

**Looks at:** Honesty about data, permissions, money and interruptions, and protection of people from harm.

**Questions:**
1. Is the app's intent clear from the start, with reasons given for any permission and for any data gathered? `design-principles/responsibility/be-fully-transparent-about-what-your`
2. Is each permission requested only when a feature needs it, ideally at the moment of use? `privacy/requesting-permission/request-permission-only-when-your-app`
3. Is the data requested limited to what the feature truly needs? `privacy/best-practices/request-access-only-to-data-that`
4. Does the permission wording say specifically how the data will be used? `privacy/requesting-permission/write-copy-that-clearly-describes-how`
5. Are destructive actions flagged and confirmed? `pull-down-buttons/best-practices/let-people-know-when-a-pull`
6. Is the full billed amount shown for every purchase option? `apple-in-app-purchase/best-practices/display-the-total-billing-price-for`
7. Does each notification's urgency match its real importance, with one notification per matter? `managing-notifications/best-practices/build-trust-by-accurately-representing-the`, `notifications/best-practices/avoid-sending-multiple-notifications-for-the`
8. Are sensitive entries hidden as typed? `text-fields/best-practices/use-secure-text-fields-to-hide`
9. Is progress reported accurately rather than racing ahead and stalling? `progress-indicators/best-practices/be-as-accurate-as-possible-when`
10. Are ratings requested only after a sign of engagement, never at first launch? `ratings-and-reviews/best-practices/ask-for-a-rating-only-after`
11. Are ads kept out of surfaces meant for task information? `live-activities/best-practices/dont-use-a-live-activity-to`

**Typical problems:**
- Permission prompts stacked at launch: defer each until needed `designing-for-games/jump-into-gameplay/defer-requests-until-the-right-time`
- Warnings shown in a popover: use an alert `popovers/best-practices/avoid-using-a-popover-to-show`
- Everything marked urgent: set honest interruption levels `managing-notifications/best-practices/build-trust-by-accurately-representing-the`
- Copies of Apple marks or hardware in icons and symbols: do not reproduce them `app-icons/design/dont-use-replicas-of-apple-hardware`, `sf-symbols/custom-symbols/dont-design-replicas-of-apple-products`
- Sensitive data visible on a locked or shared surface: let the system hide it `controls/best-practices/hide-sensitive-information-when-the-device`, `complications/best-practices/keep-privacy-in-mind`

**Where in the HIG:** [Privacy](https://developer.apple.com/design/human-interface-guidelines/privacy) · [Managing accounts](https://developer.apple.com/design/human-interface-guidelines/managing-accounts) · [Managing notifications](https://developer.apple.com/design/human-interface-guidelines/managing-notifications) · [Alerts](components/alerts.md) · [Notifications](components/notifications.md) · [Apple Pay](components/apple-pay.md) · [In-app purchase](components/apple-in-app-purchase.md)

<a id="platform"></a>
## Platform

**Looks at:** Whether the design fits the device, input method and size it runs on, and carries its character across them.

**Questions:**
1. Has each supported platform received equal care so it feels native? `design-principles/flexibility/approach-every-platform-with-intention`
2. Do layouts follow size classes, safe areas and margins rather than device type or fixed widths? `layout/adaptability/size-classes/determine-layout-based-on-size-classes`, `layout/adaptability/design-a-layout-that-adapts-gracefully`
3. Do features stay the same as space changes, with only the amount shown varying? `layout/adaptability/size-classes/keep-functionality-the-same-as-size`
4. Are content and controls in consistent, predictable positions across configurations? `design-principles/flexibility/preserve-a-persons-context`
5. Is the layout checked at the largest and smallest sizes for clipping? `layout/adaptability/preview-your-app-on-multiple-devices`
6. Does it support each platform's default input: touch, pointer and keyboard, or eyes and hands? `designing-for-games/enable-intuitive-interactions/support-each-platforms-default-interaction-method`
7. Are standard system bars, toolbars and tab bars used where the platform provides them? `ornaments/best-practices/use-system-provided-toolbars-and-tab`, `going-full-screen/platform-considerations/macos/use-the-system-provided-full-screen`
8. On glanceable devices, are complex interactions avoided in favor of short, scannable views? `charts/platform-considerations/watchos/in-general-avoid-requiring-complex-chart`
9. On immersive or spatial devices, does content stay inside the field of view, with comfort in mind? `designing-for-visionos/best-practices/prioritize-comfort`
10. Are colors and images checked in light, dark and high-contrast settings? `color/best-practices/make-sure-all-your-apps-colors`, `dark-mode/best-practices/ensure-that-your-app-looks-good`

**Typical problems:**
- One layout stretched over every device: base layout on size classes `layout/adaptability/size-classes/consider-all-possible-combinations-of-size`
- Controls along a window's bottom edge on Mac: move them `layout/platform-considerations/macos/avoid-placing-controls-or-critical-information`
- Hard-coded system color values: use dynamic system colors `color/system-colors/avoid-hard-coding-system-color-values`
- Raster custom icons: make them vector `icons/best-practices/if-you-create-a-custom-interface`
- Split view in a compact environment: reserve it for regular size `split-views/platform-considerations/ios/prefer-using-a-split-view-in`

**Where in the HIG:** [Platforms](platforms/) · [Layout](https://developer.apple.com/design/human-interface-guidelines/layout) · [Designing for visionOS](https://developer.apple.com/design/human-interface-guidelines/designing-for-visionos) · [Split views](components/split-views.md) · [Sidebars](components/sidebars.md) · [Tab bars](components/tab-bars.md) · [Windows](components/windows.md)

## Where the lenses are thin

- **Attention:** the HIG describes hierarchy tools but gives no eye-tracking or noticing data. [HIG none] for any claim about what people look at first.
- **Value:** the HIG states a purpose principle and scattered feature-scope rules, but no method for measuring value or choosing between ideas. [HIG none]
- **Slides and cards:** the HIG has no guidance on viewing distance, feed context or story pacing for these media. [HIG transfer] from tvOS and glanceable surfaces is proposed in the media guides.
