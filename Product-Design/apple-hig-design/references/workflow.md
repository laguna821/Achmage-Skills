# Workflow: from purpose to review

Nine stages take a design from "why does this exist" to a review report. Work them in order, but loop back when a later stage exposes a gap. At each stage, open the references named in **Do**. Label every recommendation outside Apple platforms as [HIG], [HIG transfer], [HIG none] or [House]. For the why behind a rule, see [principles.md](principles.md); for review questions, see [lenses.md](lenses.md).

<a id="define"></a>
## 1. Define
**Goal:** State what the product or screen is for, for whom, and what is deliberately left out.
**Ask:**
- What is this product, feature or screen for, and does the design serve that goal?
- Which few features matter most to the people using it?
- Is the task better served by something small, such as a quick action, a widget or an App Clip, than by a full app?
- Which medium is the deliverable: an Apple app, a mobile app or site, a desktop site, slides or card news?
- Which platform capabilities (camera, location, health data, payments) would make the idea possible, and are they needed?
**Do:**
1. Write the purpose in one sentence and re-check it at each development step `design-principles/purpose/create-value`.
2. Rank features by how people want to use them, then make the top few excellent and cut the rest `design-principles/purpose/keep-focused`.
3. Where a task is short or happens away from the app, look at [App Clips](components/app-clips.md), [Widgets](components/widgets.md) or [Home screen quick actions](components/home-screen-quick-actions.md) before designing a full flow `app-clips/designing-your-app-clip/focus-on-essential-features` `home-screen-quick-actions/best-practices/create-quick-actions-for-compelling-high`.
4. Choose the voice now, from audience, familiar vocabulary and the feeling you want `writing/getting-started/determine-your-apps-voice`.
5. If the deliverable is not an Apple app, open `media/native.md`, `media/mobile.md`, `media/web.md`, `media/slides.md` or `media/cards.md` and note what the HIG cannot answer.
6. Open [decision-trees/beyond-the-app.md](decision-trees/beyond-the-app.md) when the idea lives outside the app.
**Deliver:** Design brief
**Key rules:**
- Keep asking what the product is for as development proceeds `design-principles/purpose/create-value`.
- Rank features and perfect the few that matter most `design-principles/purpose/keep-focused`.
- Include only what the task needs in an App Clip and leave advanced features to the full app `app-clips/designing-your-app-clip/focus-on-essential-features`.
- Offer quick actions only for valuable tasks `home-screen-quick-actions/best-practices/create-quick-actions-for-compelling-high`.
- Use a web view for brief in-app access to a site, not to rebuild a browser `web-views/best-practices/avoid-using-a-web-view-to`.
- Reserve immersion for meaningful moments `immersive-experiences/best-practices/reserve-immersion-for-meaningful-moments-and`.
- Keep onboarding about your own app, not about the system `onboarding/best-practices/keep-onboarding-content-focused-on-the`.

<a id="structure"></a>
## 2. Structure
**Goal:** Decide how people move through the product and where each thing lives.
**Ask:**
- What is the fastest route from opening to the task or content?
- Which areas are peers (tabs or sidebar) and which are drill-downs?
- What must be reachable in one step, and what can be modal?
- What happens on relaunch, when people switch away, or before they sign in?
- Does the structure let people explore freely instead of locking them into modes?
**Do:**
1. Open [decision-trees/navigation-structure.md](decision-trees/navigation-structure.md) and pick the top-level container (see [Tab bars](components/tab-bars.md), [Sidebars](components/sidebars.md), [Split views](components/split-views.md)).
2. Send people straight to their task and keep the design unobtrusive `design-principles/agency/stay-out-of-the-way`.
3. Keep tab views to closely related areas `tab-views/best-practices/use-a-tab-view-to-present`.
4. Use [modality](https://developer.apple.com/design/human-interface-guidelines/modality) only when it helps focus or decides something that affects people's content `modality/best-practices/present-content-modally-only-when-theres`.
5. Delay sign-in, keep the launch screen plain, and restore the earlier state on relaunch `managing-accounts/best-practices/delay-sign-in-for-as-long` `branding/best-practices/avoid-using-a-launch-screen-as` `launching/best-practices/restore-the-previous-state-when-your`.
6. Write the flow as a map with entry points, exits, back behavior and interruptions.
**Deliver:** Flow map
**Key rules:**
- Let people move and reach features freely `design-principles/agency/give-people-the-freedom-to-explore`.
- Make structure consistent so people see where they are and what comes next `design-principles/simplicity/establish-hierarchy`.
- Keep the launch screen plain; put brand on a welcome screen `branding/best-practices/avoid-using-a-launch-screen-as`.
- Postpone sign-in as long as possible `managing-accounts/best-practices/delay-sign-in-for-as-long`.
- Do not require account creation before value is delivered `app-clips/designing-your-app-clip/avoid-requiring-people-to-create-an`.
- On tvOS, Back goes to the parent screen; in active gameplay it opens a pause menu `remotes/best-practices/in-almost-all-cases-open-the`.
- Offer full-screen mode when focus or immersion helps `going-full-screen/best-practices/support-full-screen-mode-when-it`.
- On visionOS, prefer a split view to a new window for supplementary information `split-views/platform-considerations/visionos/to-display-supplementary-information-prefer-a`.

<a id="compose"></a>
## 3. Compose
**Goal:** Arrange content and controls on each screen so the important thing is found first and nothing is crowded.
**Ask:**
- What is the most important item, and is it at the top or leading edge?
- Are controls spaced so they are hard to mis-tap?
- Does the standard row, grid or component already do this?
- Does the layout respect safe areas, rounded corners and device features?
- Does the layout work for left- and right-handed use and for right-to-left languages?
**Do:**
1. Order content by importance, key items toward the top and leading edge `layout/visual-hierarchy/order-content-by-relative-importance`.
2. For each interface part, open the matching tree: [showing-collections.md](decision-trees/showing-collections.md), [choosing-values.md](decision-trees/choosing-values.md), [text-input.md](decision-trees/text-input.md), [progress-and-status.md](decision-trees/progress-and-status.md). Write the choice down.
3. Prefer standard components and default row or grid layouts `collections/best-practices/use-the-standard-row-or-grid` `branding/best-practices/express-your-brand-with-familiar-components`.
4. Offer choices instead of free text when you can `entering-data/best-practices/when-possible-offer-choices-instead-of`.
5. Check control sizes and spacing in [tokens.md](tokens.md) and the platform file in `platforms/`.
6. Keep status feedback next to the thing it describes `feedback/best-practices/consider-integrating-status-feedback-into-your`.
**Deliver:** Screen spec, and a Component decision record for each non-obvious choice
**Key rules:**
- Leave roughly 12 points around bezeled controls and 24 around unbezeled ones `accessibility/mobility/consider-spacing-between-controls-as-important`.
- Keep charts uncluttered and reveal detail on demand `charting-data/best-practices/keep-a-chart-simple-letting-people`.
- Keep a box small relative to its window `boxes/best-practices/prefer-keeping-a-box-relatively-small`.
- Use safe areas for rounded corners and camera housings `designing-for-games/look-stunning-on-every-display/integrate-device-features-into-your-layout`.
- Place controls so neither hand covers them `apple-pencil-and-scribble/best-practices/design-a-great-left-and-right`.
- Keep controls in the same relative place across device poses `designing-for-iphone-duo/vertical-controls/keep-controls-consistent-across-device-poses`.
- In AR, give the display to the physical world, not to controls `augmented-reality/best-practices/let-people-use-the-entire-display`.
- Use a text view for long text and a label or text field for small amounts `text-views/best-practices/use-a-text-view-when-you`.

<a id="express"></a>
## 4. Express
**Goal:** Set type, color, imagery and brand so the design feels crafted and stays legible.
**Ask:**
- Does the type follow platform sizes and stay legible at every size?
- Does each color keep one meaning, and is the accent used sparingly?
- Does it look good in both light and dark?
- Where does the brand show, and does it fight the platform?
- Which moments deserve extra character?
**Do:**
1. Open [tokens.md](tokens.md) for text size floors, contrast, type scales and semantic colors. [House] On non-Apple media the font is Pretendard Variable; see the medium guide for sizes.
2. For icons, open [icons.md](icons.md). [House] Icons are Lucide, not SF Symbols.
3. Keep custom text styles at the platform's recommended defaults and minimums `accessibility/vision/use-recommended-defaults-for-custom-type`.
4. Use the accent color only for primary actions or status `branding/best-practices/apply-your-apps-accent-color-judiciously`.
5. Give each color one meaning `color/best-practices/avoid-using-the-same-color-to`.
6. Check both appearances `dark-mode/best-practices/ensure-that-your-app-looks-good`.
**Deliver:** Visual system note
**Key rules:**
- Be deliberate about visuals, animation, wording and audio `design-principles/craft/quality-sets-the-tone`.
- Treat each moment as a chance to show character `design-principles/delight/create-defining-moments`.
- Keep text legible under creative styling and adopt Dynamic Type `text-views/best-practices/keep-text-legible`.
- Choose chart marks by what people should learn `charts/marks/choose-a-mark-type-based-on`.
- Prefer common chart types `charting-data/designing-effective-charts/in-general-prefer-using-common-chart`.
- Follow the system appearance instead of adding an in-app toggle `dark-mode/best-practices/avoid-offering-an-app-specific-appearance`.
- Make live content look live `live-viewing-apps/best-practices/make-sure-live-content-looks-live`.
- Show focus with the platform's look `focus-and-selection/best-practices/indicate-focus-using-visual-appearances-that`.

<a id="interact"></a>
## 5. Interact
**Goal:** Define how people act, what the product does in response, and how mistakes are undone.
**Ask:**
- What does each control do, and is it clear when it is usable?
- Can every action be undone or backed out of?
- Does feedback arrive through more than one channel?
- Is work saved without asking?
- Are gestures and shortcuts ones people already know?
**Do:**
1. Open [decision-trees/alerting-and-confirming.md](decision-trees/alerting-and-confirming.md) for confirmations and warnings, and prefer undo over asking.
2. List states for each control (default, pressed, disabled, loading, error, success) and how each is shown `design-principles/familiarity/provide-clear-feedback`.
3. Support the inputs of the target: [Gestures](components/gestures.md), [Keyboards](components/keyboards.md), [Pointing devices](components/pointing-devices.md), [Drag and drop](https://developer.apple.com/design/human-interface-guidelines/drag-and-drop).
4. Preserve work automatically `file-management/saving-work/help-people-be-confident-that-their`.
5. Reuse each behavior and look everywhere `design-principles/familiarity/keep-visuals-and-interactions-consistent`.
6. Add custom gestures only on top of the defaults `collections/best-practices/add-custom-interactions-when-necessary`.
**Deliver:** State and feedback table
**Key rules:**
- Provide easy ways to reverse actions `design-principles/agency/help-people-recover-from-mistakes`.
- Send feedback through color, text, sound and haptics `feedback/best-practices/make-sure-all-feedback-is-accessible`.
- Pair audio cues with haptics `accessibility/hearing/use-haptics-in-addition-to-audio`.
- Make motion physically plausible and consistent with gestures `motion/providing-feedback/strive-for-realistic-feedback-motion-that`.
- Make field requirements clear and prefill sensible defaults `entering-data/best-practices/be-clear-about-the-data-you`.
- Keep the system purchase confirmation sheet unchanged `apple-in-app-purchase/best-practices/use-the-default-confirmation-sheet`.
- Change immersion with gentle, followable transitions `immersive-experiences/transitioning-between-immersive-styles/design-smooth-predictable-transitions-when-changing`.
- Let people resize columns `column-views/best-practices/let-people-resize-columns`.

<a id="write"></a>
## 6. Write
**Goal:** Give every label, title, message and permission request the fewest clear words.
**Ask:**
- Is each word needed, and is the simplest phrasing used?
- Does the tone match what the person is doing right now?
- Does the title name the task or content?
- Is the copy free of unintended implications?
- Do names fit without truncating?
**Do:**
1. Start from the voice chosen in Define `writing/getting-started/determine-your-apps-voice`.
2. Cut to the needed words `design-principles/simplicity/be-concise`.
3. Adjust tone to context within the voice `writing/getting-started/match-your-tone-to-the-context`.
4. Name tabs with nouns, give modals a task title, and keep list text brief `tab-views/best-practices/provide-a-label-for-each-tab` `modality/best-practices/make-it-easy-to-identify-a` `lists-and-tables/content/keep-item-text-succinct-so-row`.
5. Write permission text as one short, specific sentence `privacy/requesting-permission/write-copy-that-clearly-describes-how`.
6. Fill in a copy sheet for every screen.
**Deliver:** Copy sheet
**Key rules:**
- Review tone from several viewpoints `inclusion/welcoming-language/consider-the-tone-of-your-copy`.
- Keep tips to one or two action-oriented sentences `offering-help/creating-tips/make-tips-short-actionable-and-engaging`.
- Give charts informative titles and labels `charts/descriptive-content/write-descriptions-that-help-people-understand`.
- Use plain wording in AR instructions `augmented-reality/communicating-with-people/if-you-must-display-instructional-text`.
- Keep product names short with plain descriptions `apple-in-app-purchase/best-practices/use-simple-succinct-product-names-and`.
- Show the current search scope `searching/best-practices/clearly-display-the-current-scope-of`.
- Make exit buttons say whether they go back or quit `immersive-experiences/transitioning-between-immersive-styles/indicate-the-purpose-of-an-exit`.
- Use the controller's own labels when naming controls `game-controls/physical-controllers/customize-onscreen-content-to-match-the`.

<a id="include"></a>
## 7. Include
**Goal:** Make the product usable, private and honest for everyone.
**Ask:**
- Can people enlarge text, and does the layout survive it?
- Is anything carried by color, motion or sound alone?
- Do charts, icons and custom controls have accessibility labels?
- Why is each permission needed, and is it asked at the right moment?
- Is AI use disclosed and data collection minimal?
**Do:**
1. Treat accessibility as a start-of-project priority `design-principles/flexibility/design-for-everyone`.
2. Support larger text, ideally at least 200 percent (140 percent in watchOS) `accessibility/vision/support-larger-text-sizes`.
3. Check contrast in [tokens.md](tokens.md) and test both appearances with Increase Contrast and Reduce Transparency `dark-mode/best-practices/test-your-content-to-make-sure`.
4. Ask for permissions in context, with the reason `onboarding/additional-requests/if-your-app-or-game-needs` `carekit/data-and-privacy/healthkit-integration/request-access-to-health-data-only`.
5. Collect only what you need and protect it `design-principles/responsibility/keep-peoples-information-safe`.
6. Offer alternatives to any single input or body movement `gestures/platform-considerations/visionos/avoid-requiring-specific-body-movements-or`.
**Deliver:** Accessibility and trust checklist
**Key rules:**
- Be open about intent, permissions and data use `design-principles/responsibility/be-fully-transparent-about-what-your`.
- Never use color alone to distinguish or carry key information `color/inclusive-color/avoid-relying-solely-on-color-to`.
- Make every chart usable with VoiceOver `charts/best-practices/make-every-chart-in-your-app`.
- Give custom icons hidden text labels `icons/best-practices/provide-alternative-text-labels-for-custom`.
- Make motion optional `motion/best-practices/make-motion-optional`.
- Use secure text fields for sensitive entries `text-fields/best-practices/use-secure-text-fields-to-hide`.
- Tell people where AI is used and never pass it off as human-made `generative-ai/transparency/communicate-where-your-app-uses-ai`.
- Ask only for the data the current task needs `id-verifier/best-practices/ask-only-for-the-data-you`.

<a id="adapt"></a>
## 8. Adapt
**Goal:** Carry the design across platforms, sizes, text scales and media without losing context.
**Ask:**
- Which platforms and media are in scope, and is each given equal care?
- What changes at compact widths, large text, or on a small display?
- Are positions and groupings consistent across them?
- Which features are unavailable somewhere, and what shows instead?
- Which rules transfer to a non-Apple medium and which do not?
**Do:**
1. Open the file in `platforms/` for each target and `media/<medium>.md` for the deliverable. Mark each carried-over rule [HIG], [HIG transfer] or [HIG none].
2. Keep content and controls in predictable positions across configurations `design-principles/flexibility/preserve-a-persons-context`.
3. Reflow for larger text, for example stacking side-by-side views `layout/adaptability/be-prepared-for-text-size-changes` `typography/supporting-dynamic-type/consider-adjusting-your-layout-at-large`.
4. Adapt with safe areas, margins and guides rather than fixed widths `layout/adaptability/design-a-layout-that-adapts-gracefully` `designing-for-iphone-duo/best-practices/build-your-app-to-resize`.
5. Hide unsupported features instead of showing errors `augmented-reality/offer-ar-features-only-on-capable`.
6. Record every difference in a table.
**Deliver:** Platform and media difference table
**Key rules:**
- Give each supported platform equal care `design-principles/flexibility/approach-every-platform-with-intention`.
- Keep toolbar groupings the same on every platform `toolbars/item-groupings/keep-consistent-groupings-and-placement-across`.
- Favor split views in regular, not compact, size environments on iOS `split-views/platform-considerations/ios/prefer-using-a-split-view-in`.
- Widen plot areas in compact charts `charts/best-practices/in-a-compact-environment-maximize-the`.
- Make every iPadOS menu function reachable another way `the-menu-bar/platform-considerations/ipados/because-the-menu-bar-is-often`.
- Show a still where Live Photos are unsupported `live-photos/best-practices/display-live-photos-as-traditional-photos`.
- Design passes to work on every device `wallet/designing-passes/design-a-pass-that-looks-great`.
- Prefer small adjustments when a layout changes shape `designing-for-iphone-duo/dynamic-layouts/reserved-regions/avoid-extreme-layout-changes-as-people`.

<a id="review"></a>
## 9. Review
**Goal:** Check the finished design against the HIG and report findings with evidence.
**Ask:**
- Which rule does each problem break, and what is the ID?
- Does the problem block the task or break a minimum?
- Does it work against a principle or platform convention?
- Is it polish only?
- Which finding is [HIG none] and so only an opinion?
**Do:**
1. Walk the screens and the deliverables from earlier stages.
2. [House] Apply the lenses in [lenses.md](lenses.md) in this order: value, trust, inclusion, flow, attention, interaction, content, platform.
3. For each issue, search `rule-index/` for the rule and cite its ID. A finding without an ID is marked [HIG none].
4. Assign a severity from the scale below.
5. Report fixes in order of severity, then by screen.
**Deliver:** HIG review report
**Severity scale [House]:**
- **Blocker:** breaks an explicit HIG "don't", a minimum size or contrast, or blocks the task. Fix before release.
- **Major:** works against a principle or a platform convention. Fix unless a written reason says otherwise.
- **Minor:** polish. Fix when time allows.

**Report format:** one row per finding: severity, screen, lens, what is wrong, rule ID(s), fix.
**Key rules:**
- Trace each decision to a principle `design-principles/purpose/create-value`.
- Check that color never works alone `color/inclusive-color/avoid-relying-solely-on-color-to`.
- Check spacing between controls `accessibility/mobility/consider-spacing-between-controls-as-important`.
- Check larger text support `accessibility/vision/support-larger-text-sizes`.
- Check both appearances `dark-mode/best-practices/test-your-content-to-make-sure`.
- Check that motion is optional `motion/best-practices/make-motion-optional`.
- Check consistency of behavior and look `design-principles/familiarity/keep-visuals-and-interactions-consistent`.
- Check that quality is deliberate `design-principles/craft/quality-sets-the-tone`.
