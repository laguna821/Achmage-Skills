# Principles: the why behind every rule

The HIG names eight principles: purpose, agency, responsibility, familiarity, flexibility, simplicity, craft and delight. It says there is no one right way to apply them. They are tools for weighing competing priorities and making key decisions, and they sit under the guidance on every other page. `design-principles/purpose/create-value`

This skill uses them as the reason behind each decision. Every rule in `rule-index/` is tagged with the principles that explain it, and every component card has a "Principles at stake" section. A design decision is justified as a chain:

1. **Situation:** what the person is trying to do, and where.
2. **Principle:** which of the eight matters most in that situation.
3. **Pattern:** the HIG pattern that governs the situation (for example onboarding, feedback or entering data).
4. **Component:** the element that implements the pattern.
5. **Rule:** the specific guideline, cited by ID.

If a decision cannot be traced from a situation to a principle to a rule, treat it as a guess and look again. When two principles pull in different directions, name both, say which one the situation favors, and cite the rules for each. The rules below are examples chosen from different HIG sections; the full set is in `rule-index/`.

<a id="purpose"></a>
## Purpose: "Make something meaningful."
**What it asks:** Start from intention. Find what matters most to the people you serve, then make those few things excellent rather than adding more.
**Sub-principles:**
- Ask at every stage what the product is for and whether the design serves it. `design-principles/purpose/create-value`
- Rank key features by how people want to use them and make those great. `design-principles/purpose/keep-focused`
- Study existing solutions without copying them, and show what sets yours apart. `design-principles/purpose/find-new-ways-to-solve-the`
**Questions to ask:**
- What is this screen, card or slide for, in one sentence?
- Which one or two things do people most want to do here?
- Does every element serve that, or does it serve us?
- What would a person lose if this were removed?
**Rules that put it into practice:**
- Mark only the single most likely action as prominent, one or two at most. `buttons/style/in-general-use-a-button-that`
- Use a chart to spotlight the key takeaway that matters to the audience. `charting-data/best-practices/use-a-chart-when-you-want`
- Do not use the launch screen as a brand showcase; put branding on a welcome screen. `branding/best-practices/avoid-using-a-launch-screen-as`
- Back the Action button with a few essential functions, not a shortcut that only opens the app. `action-button/best-practices/support-the-action-button-with-a`
- Fill a context menu with the commands most likely needed in this context. `context-menus/best-practices/prioritize-relevancy-when-choosing-items-to`
- Keep App Clips useful for getting a task done, not for promotion or ads. `app-clips/designing-your-app-clip/dont-use-app-clips-solely-for`
- Put live content first so playback takes at most one tap. `live-viewing-apps/best-practices/feature-live-content-prominently-and-make`
- Reserve immersion for meaningful moments; not every task needs it. `immersive-experiences/best-practices/reserve-immersion-for-meaningful-moments-and`
**Share of guidelines:** primary reason for 117 of 2,280 guidelines.

<a id="agency"></a>
## Agency: "Let people do things their own way."
**What it asks:** Give people the freedom to act, tell them what is happening, and make mistakes cheap to undo. The interface is there to help them reach their goals, not to hold them in a path.
**Sub-principles:**
- Take people straight to the task or content; stay unobtrusive but available. `design-principles/agency/stay-out-of-the-way`
- Let people move freely instead of locking them into flows or modes; make required guided flows easy to skip. `design-principles/agency/give-people-the-freedom-to-explore`
- Provide easy ways to reverse actions so mistakes cost no time or work. `design-principles/agency/help-people-recover-from-mistakes`
**Questions to ask:**
- Can a person skip, leave or go back from every step?
- Does anything dismiss itself or move focus without the person acting?
- Is there more than one way to do each task?
- Is work saved and restorable without effort?
- Do people have to create an account or finish setup before getting value?
**Rules that put it into practice:**
- Save work automatically, so people do not have to remember to save. `file-management/saving-work/help-people-be-confident-that-their`
- Restore the earlier state on relaunch, including scroll position and window placement. `launching/best-practices/restore-the-previous-state-when-your`
- Do not force account creation before the task delivers value. `app-clips/designing-your-app-clip/avoid-requiring-people-to-create-an`
- Avoid controls that dismiss themselves on a timer; dismiss by explicit action. `accessibility/cognitive/minimize-use-of-time-boxed-interface`
- Do not move focus unless the person acted, except for discrete directional input. `focus-and-selection/best-practices/avoid-changing-focus-without-peoples-interaction`
- Offer more than one way to use the app; not everyone can do a given gesture. `gestures/best-practices/give-people-more-than-one-way`
- Let people do other things while content loads in the background. `loading/best-practices/let-people-do-other-things-in`
- Let people try the app before they buy. `apple-in-app-purchase/best-practices/let-people-experience-your-app-before`
- Validate entries as people type so they can fix problems on the spot. `entering-data/best-practices/dynamically-validate-field-values`
**Share of guidelines:** primary reason for 301 of 2,280 guidelines.

<a id="responsibility"></a>
## Responsibility: "Act in people's best interest."
**What it asks:** Your work affects people's lives. Earn trust by being open about what the product does and why, and by protecting safety and privacy.
**Sub-principles:**
- State the app's intent from the start, explain permission requests, and say what data is gathered and how it is used. `design-principles/responsibility/be-fully-transparent-about-what-your`
- Collect only the data the product needs, handle it with care, and anticipate misuse or harm. `design-principles/responsibility/keep-peoples-information-safe`
**Questions to ask:**
- Does this ask for data or access that the current feature does not need?
- Is the reason for each request stated in specific words?
- Could this action lose data or money, and does the design say so before it happens?
- Is anything urgent, free or safe presented as other than it is?
- Could motion, flashing or sound harm some people?
**Rules that put it into practice:**
- Ask only for data a feature truly needs, in specific wording, not before interest in the feature. `privacy/best-practices/request-access-only-to-data-that`
- Ask for health data only when tied to the current context. `carekit/data-and-privacy/healthkit-integration/request-access-to-health-data-only`
- Show the full amount that will be billed for every purchase option. `apple-in-app-purchase/best-practices/display-the-total-billing-price-for`
- Never make a destructive button the primary one, even if it is the most likely choice. `buttons/role/dont-assign-the-primary-role-to`
- Use secure text fields for sensitive entries such as passwords. `text-fields/best-practices/use-secure-text-fields-to-hide`
- Set a notification's interruption level to match its real urgency. `managing-notifications/best-practices/build-trust-by-accurately-representing-the`
- Do not show warnings in popovers; use an alert. `popovers/best-practices/avoid-using-a-popover-to-show`
- Use fast-moving and blinking animation sparingly and respond to Reduce Motion. `accessibility/cognitive/be-cautious-with-fast-moving-and`
- Tell people when account deletion will finish, and notify them when it has. `managing-accounts/deleting-accounts/tell-people-when-account-deletion-will`
**Share of guidelines:** primary reason for 187 of 2,280 guidelines.

<a id="familiarity"></a>
## Familiarity: "Build on what people know."
**What it asks:** Use concepts people already understand from the physical world and other software, and apply them the same way everywhere. Familiar behavior speeds learning and builds confidence.
**Sub-principles:**
- Lean on real-world and cross-software concepts so the interface feels intuitive. `design-principles/familiarity/use-concepts-that-people-know`
- Once an element has a look or behavior, reuse it everywhere. `design-principles/familiarity/keep-visuals-and-interactions-consistent`
- Signal what is happening: which controls are usable, what changed, and use system patterns for alerts and choices. `design-principles/familiarity/provide-clear-feedback`
**Questions to ask:**
- Is there a standard component for this, and am I using it as intended?
- Does the same look always mean the same thing?
- Would someone who has used other apps guess how this works?
- Does each action produce visible feedback?
- Where I depart from convention, what do people gain?
**Rules that put it into practice:**
- Prefer familiar system gestures to custom ones. `accessibility/cognitive/keep-actions-simple-and-intuitive`
- Express brand through well-known components, keeping size, position and behavior suited to the platform. `branding/best-practices/express-your-brand-with-familiar-components`
- Keep each color's meaning constant, and do not style plain text like tappable items. `color/best-practices/avoid-using-the-same-color-to`
- Choose widely known chart types such as bar or line charts when you can. `charting-data/designing-effective-charts/in-general-prefer-using-common-chart`
- Make the store look and feel like the rest of the app. `apple-in-app-purchase/best-practices/design-an-integrated-shopping-experience`
- Use the system's focus effects; make custom ones only when truly necessary. `focus-and-selection/best-practices/rely-on-system-provided-focus-effects`
- Offer New and Open through app menus and keyboard shortcuts. `file-management/creating-and-opening-files/use-app-menus-and-keyboard-shortcuts`
- Confirm completion of significant tasks, such as a payment. `feedback/best-practices/when-it-makes-sense-confirm-that`
- Keep control positions alike across device poses so people need not relearn them. `designing-for-iphone-duo/vertical-controls/keep-controls-consistent-across-device-poses`
**Share of guidelines:** primary reason for 475 of 2,280 guidelines.

<a id="flexibility"></a>
## Flexibility: "Adapt to diverse contexts and needs."
**What it asks:** People use your software in many ways, with different devices, abilities, inputs and surroundings. Support as many of them as you can, and keep the design feeling at home as it adapts.
**Sub-principles:**
- Consider the diversity of people and treat accessibility as a priority from the start. `design-principles/flexibility/design-for-everyone`
- Keep content and controls in predictable places across platforms and configurations, with natural transitions. `design-principles/flexibility/preserve-a-persons-context`
- Support as many input methods as possible, such as voice, touch and keyboard. `design-principles/flexibility/consider-a-variety-of-input-methods`
- Give every supported platform equal care so it feels native. `design-principles/flexibility/approach-every-platform-with-intention`
**Questions to ask:**
- Does it still work with larger text, high contrast, and dark and light appearances?
- Can every action be done by touch, pointer, keyboard and voice?
- Does the layout survive a different screen size, orientation or language?
- Does meaning ever depend on a single channel such as color alone?
- Where the platform differs, have I followed the platform?
**Rules that put it into practice:**
- Let people enlarge text, ideally by at least 200 percent (140 percent on watchOS). `accessibility/vision/support-larger-text-sizes`
- Check that colors work in light, dark and increased-contrast settings. `color/best-practices/make-sure-all-your-apps-colors`
- Give feedback through several channels, such as color, text, sound and haptics. `feedback/best-practices/make-sure-all-feedback-is-accessible`
- Offer alternative ways to do drag-and-drop tasks, such as menu commands. `drag-and-drop/best-practices/offer-alternative-ways-to-accomplish-drag`
- Make controls respond to both finger and Apple Pencil. `apple-pencil-and-scribble/best-practices/let-people-choose-when-to-switch`
- Lay out with size classes, margins and safe areas, not fixed widths. `designing-for-iphone-duo/best-practices/build-your-app-to-resize`
- Allow for button titles that are longer in some locales. `apple-pay/using-apple-pay-buttons/button-size-and-position/maintain-the-minimum-button-size-and`
- Place controls so neither hand covers them, for left- and right-handed use. `apple-pencil-and-scribble/best-practices/design-a-great-left-and-right`
- Give custom icons hidden alternative text. `icons/best-practices/provide-alternative-text-labels-for-custom`
**Share of guidelines:** primary reason for 325 of 2,280 guidelines.

<a id="simplicity"></a>
## Simplicity: "Be clear and direct."
**What it asks:** Remove what is not needed, so every element earns its place. Organize the interface so people can see where they are and what comes next.
**Sub-principles:**
- Keep important things within reach and let secondary ones recede. The HIG says this is not the same as minimalism. `design-principles/simplicity/include-just-whats-necessary`
- Use exactly the words needed, in the simplest phrasing. `design-principles/simplicity/be-concise`
- Make controls recognizable and structure consistent, so location and next steps are clear. `design-principles/simplicity/establish-hierarchy`
**Questions to ask:**
- What can be removed without hurting the task?
- Is the most important thing the most noticeable?
- Can detail wait behind a control until asked for?
- Is each label the shortest wording that is still clear?
- Does the layout order content by importance?
**Rules that put it into practice:**
- Place key items toward the top and leading edge. `layout/visual-hierarchy/order-content-by-relative-importance`
- Hide detailed options behind a disclosure control, keeping the most-used ones visible. `disclosure-controls/best-practices/use-a-disclosure-control-to-hide`
- Keep charts uncluttered and let people reveal detail on demand. `charting-data/best-practices/keep-a-chart-simple-letting-people`
- Use the brand accent color sparingly, for primary actions or status. `branding/best-practices/apply-your-apps-accent-color-judiciously`
- Include only what the task needs in an App Clip. `app-clips/designing-your-app-clip/focus-on-essential-features`
- Give products short names and plain descriptions. `apple-in-app-purchase/best-practices/use-simple-succinct-product-names-and`
- Hide toolbars temporarily when content is the focus. `going-full-screen/best-practices/prioritize-content-by-temporarily-hiding-toolbars`
- Make icons simple, recognizable shapes tied to the action or content. `icons/best-practices/create-a-recognizable-highly-simplified-design`
- Dim secondary content so key information stands out. `always-on/best-practices/keep-important-content-legible-and-dim`
**Share of guidelines:** primary reason for 500 of 2,280 guidelines.

<a id="craft"></a>
## Craft: "Care about every detail."
**What it asks:** Treat quality as visible evidence of care. Decide deliberately, prototype and test, and keep refining after release.
**Sub-principles:**
- Be deliberate about visuals, motion, wording and sound. `design-principles/craft/quality-sets-the-tone`
- Prototype early, drop what fails, and test in real-world conditions. `design-principles/craft/experiment-and-iterate`
- Keep adopting new platform capabilities and patterns after release. `design-principles/craft/maintain-your-craft`
**Questions to ask:**
- Is anything misaligned, clipped, blurry or inconsistent in size?
- Was it tested on a real device and in real conditions?
- Does motion end gracefully rather than cut off?
- Is the wording exact?
- Are launch, loading and edge cases designed, not left to chance?
**Rules that put it into practice:**
- Make the app ready to use almost immediately on launch. `launching/best-practices/launch-instantly`
- Make the launch screen nearly identical to the first screen. `launching/launch-screens/design-a-launch-screen-thats-nearly`
- Nudge asymmetric custom icons so they look optically centered. `icons/best-practices/if-necessary-add-padding-to-a`
- Account for rounded corners and camera housings using safe areas. `designing-for-games/look-stunning-on-every-display/integrate-device-features-into-your-layout`
- Display video at its original aspect ratio. `playing-video/best-practices/always-display-video-content-at-its`
- Let motion wind down smoothly into a resting state. `always-on/best-practices/gracefully-transition-motion-to-a-resting`
- Add small gaps between adjacent colored chart segments. `charts/color/aid-comprehension-by-adding-visual-separation`
- Thoroughly test custom hover effects. `eyes/custom-hover-effects/thoroughly-test-custom-hover-effects`
- Leave enough gap between lockups for a focused one to grow. `lockups/best-practices/allow-adequate-space-between-lockups`
**Share of guidelines:** primary reason for 286 of 2,280 guidelines.

<a id="delight"></a>
## Delight: "Make it human."
**What it asks:** People remember how a product makes them feel. Choose the emotion that fits, and let it shape the details, without getting in the way of the core task.
**Sub-principles:**
- Decide which feeling the product should evoke, such as energy, calm or thrill. `design-principles/delight/identify-the-emotion-you-want-to`
- Treat every moment, from a button press to an error message, as a chance to express character. `design-principles/delight/create-defining-moments`
- Do not chase delight at the cost of the core task. `design-principles/delight/dont-mistake-delight-for-decoration`
- Design for the whole experience, combining freedom, safe exploration, familiar metaphors and flexibility. `design-principles/delight/consider-the-whole`
**Questions to ask:**
- Which emotion do we want here, and which details carry it?
- Does the expression help the task or compete with it?
- Is the tone of the writing consistent with the product's voice?
- Do sound, haptics and motion match each other?
- Is the whimsy placed at a moment where people have time for it?
**Rules that put it into practice:**
- Choose a voice from audience, familiar vocabulary and intended feeling. `writing/getting-started/determine-your-apps-voice`
- Match symbol animation to the app's tone. `sf-symbols/animations/consider-your-apps-tone-when-adding`
- Use haptics to support visual and audio feedback, matching intensity and sharpness. `playing-haptics/best-practices/prefer-using-haptics-to-complement-other`
- Show progress with encouraging messages through progressive achievements. `game-center/achievements/integrating-achievements-into-your-game/give-players-a-sense-of-progress`
- If a long load is unavoidable, show something interesting, such as tips. `loading/best-practices/if-loading-takes-an-unavoidably-long`
- Make a Live Activity reflect the app's look and personality. `live-activities/best-practices/create-a-live-activity-that-matches`
- Mark successful calibration explicitly and show the path onward. `machine-learning/calibration/confirm-success`
- Prefer photos over initials when showing people. `lockups/monograms/prefer-images-over-initials`
**Tension with other principles:** The HIG warns that delight must not displace the core task, and asks you to experiment to balance practicality and whimsy. `design-principles/delight/dont-mistake-delight-for-decoration` It also says simplicity is not the same as minimalism. `design-principles/simplicity/include-just-whats-necessary`
**Share of guidelines:** primary reason for 64 of 2,280 guidelines.
