# Rule index: Foundations

Source: Apple Human Interface Guidelines, collected 2026-11-04. 18 pages, 336 entries.

Each line is our own summary of one HIG rule, not Apple's wording. Open the page link for the original text.

Legend: **P** principles behind the rule (why) · **L** lenses · **S** work stages · **M** media fit for mobile / web / slides / cards (d = direct, t = transfer, - = none) · [Platform] marks platform-specific rules · **Term** entries are definitions, not rules.

## Accessibility (`accessibility`)

<https://developer.apple.com/design/human-interface-guidelines/accessibility>

### Vision

- `accessibility/vision/support-larger-text-sizes` **Do:** Let people enlarge text or icons, ideally by at least 200 percent (140 percent in watchOS apps). **Why:** Adjustable size makes content more legible, visible and comfortable. · P flexibility · L inclusion, attention · S include · M d/d/t/t
- `accessibility/vision/use-recommended-defaults-for-custom-type` **Do:** For custom text styles, follow each platform's recommended default and minimum sizes. **Why:** Platform sizes are set to promote readability. · P flexibility · L inclusion · S express · M d/d/t/t
- `accessibility/vision/bear-in-mind-that-font-weight` **Do:** If using a thin custom font, go above the recommended sizes. **Why:** Heavier weights are easier to read. · P flexibility · L inclusion, attention · S express · M d/d/t/t
- `accessibility/vision/strive-to-meet-color-contrast-minimum` **Do:** Make text and icons contrast enough with backgrounds, meeting recognized contrast standards like WCAG or APCA. **Why:** Insufficient contrast makes information illegible. · P flexibility · L inclusion, attention · S include · M d/d/d/d
- `accessibility/vision/prefer-system-defined-colors` **Do:** Prefer system-defined colors, which adapt to contrast and appearance settings. **Why:** They have accessible variants that adjust automatically. · P flexibility · L inclusion · S express · M d/d/d/d
- `accessibility/vision/convey-information-with-more-than-color` **Do:** Don't use color alone to convey information; add shapes or icons for people who struggle to tell colors apart. **Why:** Color blindness can make some pairings, like red-green, hard to differentiate. · P flexibility · L inclusion · S include · M d/d/d/d
- `accessibility/vision/describe-your-apps-interface-and-content` **Do:** Provide VoiceOver descriptions of the interface and content. **Why:** VoiceOver lets people use the app without seeing the screen. · P flexibility · L inclusion · S include · M d/t/-/-
### Hearing

- `accessibility/hearing/support-text-based-ways-to-enjoy` **Do:** Don't give dialogue or crucial information through audio only; offer text options such as captions, and let people customize how the text looks. **Why:** Not everyone can hear audio. · P flexibility · L inclusion · S include · M d/d/t/t
- `accessibility/hearing/use-haptics-in-addition-to-audio` **Do:** Pair audio cues with matching haptics. **Why:** Some people can't perceive audio or have it turned off. · P flexibility · L inclusion, interaction · S interact · M d/t/-/-
- `accessibility/hearing/augment-audio-cues-with-visual-cues` **Do:** Add visual cues to audio cues, pointing where to interact, especially in games and spatial apps with off-screen action. **Why:** Important events may happen out of view. · P flexibility · L inclusion, attention · S include · M d/t/-/-
### Mobility

- `accessibility/mobility/offer-sufficiently-sized-controls` **Do:** Make controls meet each platform's recommended minimum size for tapping and clicking. **Why:** Tiny controls are hard for many people to select. · P flexibility · L inclusion, interaction · S interact · M d/d/-/-
- `accessibility/mobility/consider-spacing-between-controls-as-important` **Do:** Leave enough space between controls: roughly 12 points around bezeled elements and 24 around unbezeled ones. **Why:** It lowers the chance of tapping the wrong control. · P flexibility · L inclusion, interaction · S compose · M d/d/-/-
- `accessibility/mobility/support-simple-gestures-for-common-interactions` **Do:** Use the simplest gestures for frequent actions and avoid custom multifinger or two-hand gestures. **Why:** Complex gestures are hard for many people; simple ones are comfortable and memorable. · P flexibility · L inclusion, interaction · S interact · M d/t/-/-
- `accessibility/mobility/offer-alternatives-to-gestures` **Do:** Offer on-screen alternatives to gestures so core functions work through more than one interaction type. **Why:** Limited dexterity makes gestures less comfortable. · P flexibility · L inclusion, interaction · S interact · M d/t/-/-
- `accessibility/mobility/let-people-use-voice-control-to` **Do:** Label interface elements properly so Voice Control users can speak commands and dictate. **Why:** It lets people operate devices entirely by speaking. · P flexibility · L inclusion · S include · M d/t/-/-
- `accessibility/mobility/integrate-with-siri-and-shortcuts-to` **Do:** Support Siri and Shortcuts so people can automate frequent tasks by voice or shortcuts. **Why:** It lets people perform repetitive tasks without touch. · P flexibility · L inclusion, interaction · S include · M -/-/-/-
- `accessibility/mobility/support-mobility-related-assistive-technologies` **Do:** Test and verify support for mobility-related assistive technologies like AssistiveTouch, Switch Control and pointer control, with proper element labels. **Why:** They give alternate ways to interact for people with low mobility. · P flexibility · L inclusion · S include · M d/t/-/-
### Speech

- `accessibility/speech/let-people-use-the-keyboard-alone` **Do:** Let people operate the whole app by keyboard, and don't override system keyboard shortcuts. **Why:** Full Keyboard Access and system shortcuts are widely used. · P flexibility · L inclusion, interaction · S include · M -/d/d/-
- `accessibility/speech/support-switch-control` **Do:** Support navigating the app with Switch Control, including selecting, tapping, typing and drawing. **Why:** People can control devices through external hardware or sounds. · P flexibility · L inclusion, interaction · S include · M d/t/-/-
### Cognitive

- `accessibility/cognitive/keep-actions-simple-and-intuitive` **Do:** Use easy-to-remember, consistent interactions and prefer familiar system gestures to custom ones. **Why:** Custom gestures must be learned and retained. · P familiarity · L inclusion, interaction · S interact · M d/t/-/-
- `accessibility/cognitive/minimize-use-of-time-boxed-interface` **Do:** Avoid views or controls that dismiss themselves on a timer; dismiss through explicit actions. **Why:** Some people need longer to process, or use assistive tech that takes longer. · P agency · L inclusion, interaction · S interact · M d/t/-/-
- `accessibility/cognitive/consider-offering-difficulty-accommodations-in-games` **Do:** Consider letting players adjust difficulty, such as easier success criteria or reaction time. **Why:** People have different cognitive abilities and ways of playing. · P flexibility · L inclusion · S include · M -/-/-/-
- `accessibility/cognitive/let-people-control-audio-and-video` **Do:** Don't autoplay audio or video without discoverable controls, and consider a global opt-out. **Why:** People should control media playback. · P agency · L inclusion, interaction · S interact · M d/t/-/-
- `accessibility/cognitive/allow-people-to-opt-out-of` **Do:** If your app plays video, respond appropriately to the Dim Flashing Lights setting. **Why:** Bright, frequent flashes may be something people want to avoid. · P responsibility · L inclusion, interaction · S include · M d/t/-/-
- `accessibility/cognitive/be-cautious-with-fast-moving-and` **Do:** Use fast-moving and blinking animations sparingly, and reduce automatic motion when Reduce Motion is on. **Why:** Excess can distract, cause dizziness and trigger epileptic episodes. · P responsibility · L inclusion · S express · M d/d/t/t
- `accessibility/cognitive/optimize-your-apps-ui-for-assistive` **Do:** Optimize your UI for Assistive Access with a streamlined layout and controls. **Why:** It reduces cognitive load for people with cognitive disabilities. · P flexibility · L inclusion, platform · S include · M t/-/-/-
### Platform considerations > visionOS

- `accessibility/platform-considerations/visionos/prioritize-comfort` [visionOS] **Do:** On visionOS, avoid interface elements, animations and interactions that cause motion sickness or discomfort, keeping elements within field of view. **Why:** Immersion raises the chance of motion sickness and discomfort. · P flexibility · L platform, inclusion · S interact · M -/-/-/-

## App icons (`app-icons`)

<https://developer.apple.com/design/human-interface-guidelines/app-icons>

### Layer design

- `app-icons/layer-design/prefer-clearly-defined-edges-in-foreground` **Do:** Avoid soft or feathered edges on foreground layer shapes in icons. **Why:** System highlights and shadows look best on clear edges. · P craft · L attention · S express · M -/-/-/-
- `app-icons/layer-design/vary-opacity-in-foreground-layers-to` **Do:** Vary opacity across foreground layers, using translucent pieces to add depth and liveliness. **Why:** Translucent layers bring greater dynamism. · P delight · L attention · S express · M -/-/-/-
- `app-icons/layer-design/design-a-background-that-both-stands` **Do:** Make the background layer stand out while emphasizing foreground content, and ensure gradients respond well to system lighting. **Why:** Background supports the foreground. · P craft · L attention · S express · M -/-/-/-
- `app-icons/layer-design/prefer-vector-graphics-when-bringing-layers` **Do:** Bring layers in as vectors, outline artwork and text, and use PNG for mesh gradients and raster art. **Why:** Vectors scale crisply at any size. · P craft · L attention · S express · M -/-/-/-
### Icon formats

- `app-icons/icon-formats/provide-your-icon-in-the-icon` **Do:** Supply the icon in Icon Composer format rather than a bitmap. **Why:** A bitmap is auto-segmented into two layers for dark and tinted variants, so you get less control. · P flexibility · L platform · S express · M -/-/-/-
### Icon shape

- `app-icons/icon-shape/produce-appropriately-shaped-unmasked-layers` **Do:** Provide unmasked square layers for most platforms and rectangular ones for tvOS, letting the system apply the final shape. **Why:** The system masks all layer edges. · P craft · L platform · S express · M -/-/-/-
- `app-icons/icon-shape/keep-primary-content-centered-to-avoid` **Do:** Center primary icon content, using the production template grids, especially for visionOS and watchOS. **Why:** Masking or corner adjustments could truncate off-center content. · P craft · L attention · S express · M -/-/-/-
### Design

- `app-icons/design/provide-a-visually-consistent-icon-design` **Do:** Keep the icon design visually consistent across supported platforms. **Why:** People find the app quickly and don't mistake it for several apps. · P familiarity · L value · S express · M t/t/-/-
- `app-icons/design/consider-basing-your-icon-design-around` **Do:** Consider building icons from filled, overlapping shapes, perhaps with transparency and blur. **Why:** Overlapping solid shapes create depth. · P delight · L attention · S express · M -/-/-/-
- `app-icons/design/include-text-only-when-its-essential` **Do:** Include text in an icon only when essential to the experience or brand. **Why:** Text hurts accessibility and localization, is often too small, clutters, and may repeat the nearby app name. · P simplicity · L inclusion, attention · S express · M t/d/t/t
- `app-icons/design/prefer-illustrations-to-photos-and-avoid` **Do:** Use illustrations instead of photos, avoid copying UI components, and avoid extremely thin lines. **Why:** Photos have details that fail across appearances, small sizes and layers. · P simplicity · L attention · S express · M t/d/t/t
- `app-icons/design/dont-use-replicas-of-apple-hardware` **Do:** Don't use replicas of Apple hardware in icons. **Why:** Apple products are copyrighted and can't be reproduced. · P responsibility · L trust · S define · M t/d/-/-
### Visual effects

- `app-icons/visual-effects/let-the-system-handle-blurring-and` **Do:** Skip custom blurs, glows, shadows, bevels and highlights in icon layers; the system applies effects. **Why:** Custom effects clash with system effects and are static, whereas system ones are dynamic. · P craft · L attention · S express · M -/-/-/-
- `app-icons/visual-effects/create-layer-groupings-to-apply-effects` **Do:** Group layers when you want an effect applied to several at once. **Why:** System effects normally apply to individual layers; groups unlock extra Liquid Glass options. · P craft · L attention · S express · M -/-/-/-
### Appearances

- `app-icons/appearances/keep-your-icons-features-consistent-across` **Do:** Keep an icon's core features identical in default, dark, clear and tinted appearances, avoiding variants that swap elements. **Why:** It makes finding your app easier when appearance changes. · P familiarity · L value · S express · M t/d/-/-
- `app-icons/appearances/design-dark-and-tinted-icons-that` **Do:** Make dark and tinted icon variants that sit naturally beside system icons and widgets, staying visible, legible and recognizable even though they are more subdued. **Why:** Dark, clear and tinted variants are progressively more muted, so the icon must still read clearly in each one. · P craft, familiarity · L attention, platform · S express · M t/-/-/-
- `app-icons/appearances/use-your-light-app-icon-as` **Do:** Derive the dark icon from the light one, choosing complementary colors, avoiding overly bright imagery, and generally using colored backgrounds for contrast. **Why:** Colored backgrounds usually give dark icons the strongest contrast while keeping the default design recognizable. · P craft, familiarity · L attention · S express · M t/-/-/-
- `app-icons/appearances/consider-offering-alternate-app-icons` **Do:** If you let people pick an alternate app icon in settings, keep each option closely tied to your content and never resemble another app. **Why:** Choice lets people personalize, but a lookalike icon could be mistaken for a different app. · P agency, familiarity · L value, platform · S express · M t/-/-/-
### Platform considerations > tvOS

- `app-icons/platform-considerations/tvos/include-a-safe-zone-to-ensure` [tvOS] **Do:** On tvOS, leave a safe margin inside the icon, remembering it varies with image size, layer depth and motion, and foreground layers get trimmed more. **Why:** When the icon is focused, scaling and movement make the system crop its edges. · P craft · L platform, attention · S express · M -/-/-/-
### Platform considerations > visionOS

- `app-icons/platform-considerations/visionos/avoid-adding-a-shape-thats-intended` [visionOS] **Do:** On visionOS, don't draw a hole-like or recessed shape into the icon's background layer. **Why:** The system's shadow and highlights would make that shape pop out rather than sink back. · P craft · L platform, attention · S express · M -/-/-/-
### Platform considerations > watchOS

- `app-icons/platform-considerations/watchos/avoid-using-black-for-your-icons` [watchOS] **Do:** On watchOS, lighten a black icon background instead of using pure black. **Why:** A black background would merge with the dark watch display. · P craft · L platform, attention · S express · M -/-/-/-

## Branding (`branding`)

<https://developer.apple.com/design/human-interface-guidelines/branding>

### Best practices

- `branding/best-practices/use-your-brands-unique-voice-and` **Do:** Write every piece of displayed text in your brand's own voice and tone, such as encouraging, plain wording with simple sentences. **Why:** A consistent voice conveys the feeling the brand wants people to have. · P delight · L content · S write · M d/d/d/d
- `branding/best-practices/apply-your-apps-accent-color-judiciously` **Do:** Use the brand accent color sparingly: keep it off most controls and reserve it for primary actions or status cues; carry brand color in the content layer instead. **Why:** Spreading brand color widely overwhelms the interface and weakens its impact. · P simplicity, purpose · L attention · S express · M d/d/d/d
- `branding/best-practices/consider-using-a-custom-font` **Do:** If your brand owns a font, ensure it stays legible at every size and honors bold text and Dynamic Type; consider it for headings while system fonts handle body text. **Why:** System fonts are built for readability at small sizes, so custom fonts shouldn't undermine legibility or accessibility. · P flexibility, craft · L inclusion, attention · S express · M d/d/d/d
- `branding/best-practices/express-your-brand-with-familiar-components` **Do:** Convey brand through standard, well-known components; when restyling one, keep its size, position and behavior appropriate to the platform. **Why:** Known components feel reliable and let people concentrate on what makes your app distinctive. · P familiarity, purpose · L interaction, platform · S compose, express · M d/d/-/-
- `branding/best-practices/ensure-branding-always-defers-to-content` **Do:** Let content take priority over branding; include brand in subtle, refined ways rather than devoting space to pure brand display. **Why:** Brand-only elements consume room that content people care about needs, and can distract. · P simplicity, purpose · L attention, value · S compose · M d/d/d/d
- `branding/best-practices/help-people-feel-comfortable-by-using` **Do:** Even in a stylized UI, keep standard patterns: place elements where expected, use common symbols for common actions, and follow established navigation and modality conventions. **Why:** Familiar behavior keeps even a heavily styled interface approachable and comfortable. · P familiarity · L interaction, platform · S compose, interact · M d/d/-/-
- `branding/best-practices/resist-the-temptation-to-display-your` **Do:** Show your logo repeatedly only when it supplies needed context; otherwise use that space for useful information and controls. **Why:** People rarely need reminding which app they're in. · P simplicity, purpose · L value, attention · S compose · M d/d/d/t
- `branding/best-practices/avoid-using-a-launch-screen-as` **Do:** Don't treat the launch screen as a brand showcase; if you want branded content, put it on a welcome or onboarding screen at the start. **Why:** A launch screen vanishes too quickly to communicate anything. · P purpose, simplicity · L flow · S structure · M d/-/-/-
- `branding/best-practices/follow-apples-trademark-guidelines` **Do:** Keep Apple trademarks out of your app name and images, and consult Apple's trademark guidelines. · P responsibility · L trust · S define · M d/d/d/d

## Color (`color`)

<https://developer.apple.com/design/human-interface-guidelines/color>

### Best practices

- `color/best-practices/avoid-using-the-same-color-to` **Do:** Keep each color's meaning constant, particularly for status or interactivity; don't style plain text with the color that marks tappable items. **Why:** Reusing a color for different meanings confuses people about what is interactive. · P familiarity, simplicity · L attention, interaction · S express · M d/d/d/d
- `color/best-practices/make-sure-all-your-apps-colors` **Do:** Verify colors work in light, dark and increased-contrast settings; prefer system colors, which already have variants, and give custom colors variants for each context. **Why:** System colors shift subtly per appearance to preserve differentiation and contrast, and Increase Contrast makes differences matter more. · P flexibility, familiarity · L inclusion, attention · S express, include · M d/d/t/t
- `color/best-practices/test-your-apps-color-scheme-under` **Do:** Check your palette in varied lighting such as bright sun and dim rooms, and tune colors so they work well in most situations. **Why:** Colors look darker and muted in bright surroundings and brighter and more saturated in the dark. · P flexibility, craft · L attention, inclusion · S express · M d/d/d/t
- `color/best-practices/test-your-app-on-different-devices` **Do:** Test color on multiple devices, since displays such as True Tone ones adjust the white point to ambient light; reading, photo, video and gaming apps can tune that effect. **Why:** Different displays render color differently depending on their hardware and environment. · P flexibility, craft · L platform, attention · S express, adapt · M d/d/t/t
- `color/best-practices/consider-how-artwork-and-translucency-affect` **Do:** Adjust nearby colors when artwork changes, and account for how translucent elements like toolbars alter the appearance of colors behind or on them. **Why:** Doing so keeps visual continuity and stops interface elements from becoming overpowering or underwhelming. · P craft · L attention · S express · M d/d/d/d
- `color/best-practices/if-your-app-lets-people-choose` **Do:** When people choose colors, use the built-in system color picker where it exists. **Why:** It offers a consistent experience and lets people keep a saved set of colors available across apps. · P familiarity, agency · L interaction, platform · S interact · M t/t/-/-
### Inclusive color

- `color/inclusive-color/avoid-relying-solely-on-color-to` **Do:** Never let color alone distinguish objects, signal interactivity or carry key information; add text labels or distinctive glyph shapes too. **Why:** People with color blindness or other visual disabilities need the same information through another channel. · P flexibility · L inclusion · S include, express · M d/d/d/d
- `color/inclusive-color/avoid-using-colors-that-make-it` **Do:** Avoid color choices that make content hard to perceive, such as low contrast or combinations color-blind people can't tell apart. **Why:** Weak contrast makes icons and text merge with the background and become hard to read. · P flexibility · L inclusion, attention · S include, express · M d/d/d/d
- `color/inclusive-color/consider-how-the-colors-you-use` **Do:** Check how your colors may be read in other countries and cultures so they deliver the message you mean. **Why:** The same color can signal danger in one culture and something positive in another. · P flexibility · L inclusion, content · S include, express · M d/d/d/d
### System colors

- `color/system-colors/avoid-hard-coding-system-color-values` **Do:** Apply system colors through the platform's APIs rather than copying the documented values into your code; use dynamic system colors that adapt to light and dark. **Why:** Published values are only for reference and can change between releases. · P familiarity, craft · L platform · S express · M t/t/-/-
- `color/system-colors/avoid-redefining-the-semantic-meanings-of` **Do:** Use dynamic system colors only for their intended roles, for instance never the separator color for text or a secondary label color for backgrounds. **Why:** Intended use keeps the experience consistent and looking right when the platform appearance changes. · P familiarity · L attention, platform · S express · M t/t/-/-
### Liquid Glass color

- `color/liquid-glass-color/apply-color-sparingly-to-the-liquid` **Do:** Color Liquid Glass and its symbols or text only where emphasis is warranted, like status or primary actions; tint the background of primary actions rather than their symbols, and not many controls. **Why:** Restrained color keeps emphasis meaningful and draws attention to the key actions. · P simplicity, purpose · L attention, platform · S express · M t/t/-/-
- `color/liquid-glass-color/avoid-using-similar-colors-in-control` **Do:** With colorful backgrounds, keep toolbars and tab bars monochromatic or choose a clearly distinct accent color rather than control labels in similar hues. **Why:** Too much color overwhelms and makes control labels harder to read. · P simplicity, flexibility · L attention, platform · S express · M t/t/-/-
- `color/liquid-glass-color/be-aware-of-the-placement-of` **Do:** Avoid letting similar colors overlap between content and controls, and ensure scrollable content is clearly legible in its resting state, such as at the top. **Why:** Overlapping similar colors would cut contrast between content and the controls above it. · P flexibility, craft · L attention, inclusion · S compose, express · M t/t/-/-
### Color management

- `color/color-management/apply-color-profiles-to-your-images` **Do:** Attach color profiles to your images; sRGB gives accurate color on most displays. **Why:** Profiles make colors show as intended across different displays. · P craft · L attention · S express · M d/d/d/d
- `color/color-management/use-wide-color-to-enhance-the` **Do:** Use wide color (Display P3, 16 bits per channel, PNG exports) where suitable so photos, video, data and status colors look richer on compatible displays. **Why:** P3 yields more saturated, lifelike color than sRGB, making visuals and indicators more meaningful. · P craft, delight · L attention · S express · M t/t/t/t
- `color/color-management/provide-color-space-specific-image-and` **Do:** Where needed, ship separate image and color variants for wide color and sRGB displays via the asset catalog. **Why:** Very similar P3 colors can look alike and P3 gradients can clip on sRGB screens. · P craft, flexibility · L attention, platform · S express, adapt · M t/t/-/-
### Platform considerations > tvOS

- `color/platform-considerations/tvos/consider-choosing-a-limited-color-palette` [tvOS] **Do:** On tvOS, choose a small palette that coordinates with your app logo. **Why:** Subtle color communicates the brand while letting content lead. · P simplicity, purpose · L attention, platform · S express · M -/-/t/-
- `color/platform-considerations/tvos/avoid-using-only-color-to-indicate` [tvOS] **Do:** On tvOS, show focus mainly through subtle scaling and responsive animation, not through color alone. **Why:** Scaling and animation are the primary means of showing something is focused. · P familiarity, flexibility · L interaction, platform · S interact · M -/-/-/-
### Platform considerations > visionOS

- `color/platform-considerations/visionos/use-color-sparingly-especially-on-glass` [visionOS] **Do:** On visionOS, use color sparingly on glass, saving it for important information or to show relationships between parts. **Why:** Colors from the surroundings show through glass and can reduce legibility of colorful app content. · P simplicity, flexibility · L attention, platform · S express · M -/-/-/-
- `color/platform-considerations/visionos/prefer-using-color-in-bold-text` [visionOS] **Do:** On visionOS, apply color to bold text and large areas instead of thin text or small shapes. **Why:** Color on lightweight text or small areas is harder to see and understand. · P flexibility · L attention, platform · S express · M -/-/t/t
- `color/platform-considerations/visionos/in-a-fully-immersive-experience-help` [visionOS] **Do:** In fully immersive visionOS experiences, balance brightness; make content fully bright only when its surroundings are bright, and avoid bright flashing or moving objects on black. **Why:** High contrast helps direct attention but can cause visual discomfort once eyes have adapted to darkness. · P flexibility, responsibility · L attention, platform · S express · M -/-/-/-
### Platform considerations > watchOS

- `color/platform-considerations/watchos/use-background-color-to-support-existing` [watchOS] **Do:** On watchOS, use background color to support content or add information, not as decoration, and avoid full-screen color in views that stay on screen for long. **Why:** Background color can establish place and highlight key content when it has something to say. · P purpose, simplicity · L attention, platform · S express · M -/-/t/t
- `color/platform-considerations/watchos/recognize-that-people-might-prefer-graphic` [watchOS] **Do:** On watchOS, expect graphic complications to be shown in a tinted single-color mode and make sure they work that way. **Why:** The system may use the wearer's chosen color for a complication's images, gauges and text. · P flexibility, agency · L platform, attention · S adapt, express · M -/-/-/-

## Dark Mode (`dark-mode`)

<https://developer.apple.com/design/human-interface-guidelines/dark-mode>

### Best practices

- `dark-mode/best-practices/avoid-offering-an-app-specific-appearance` **Do:** Follow the systemwide appearance setting and don't add your own light/dark option inside the app. **Why:** A separate setting means extra work for people, and the app may seem broken when it ignores their system choice. · P agency, familiarity · L interaction, platform · S interact · M d/t/-/-
- `dark-mode/best-practices/ensure-that-your-app-looks-good` **Do:** Make the design look good in both light and dark, keeping in mind that Auto mode can switch between them while the app is open. **Why:** People may choose either mode or Auto, which changes with conditions during the day. · P flexibility, craft · L attention, inclusion · S express · M d/d/t/t
- `dark-mode/best-practices/test-your-content-to-make-sure` **Do:** Check that content stays comfortably readable in both appearances, including with Increase Contrast and Reduce Transparency on, separately and combined. **Why:** Dark text on dark backgrounds can lose legibility and contrast in those combinations, hurting people with weaker vision. · P flexibility, craft · L inclusion, attention · S include, express · M d/d/d/d
- `dark-mode/best-practices/in-rare-cases-consider-using-only` **Do:** Only rarely, adopt a permanently dark look, for example in an app centered on immersive media viewing. **Why:** A fixed dark UI recedes and helps people concentrate on the media. · P purpose, delight · L attention, value · S define, express · M d/d/d/d
### Dark Mode colors

- `dark-mode/dark-mode-colors/embrace-colors-that-adapt-to-the` **Do:** Prefer semantic colors that adapt automatically; for custom colors define bright and dim variants in a Color Set, and avoid hard-coded or non-adaptive values. **Why:** Semantic and Color Set colors follow the current appearance automatically. · P familiarity, flexibility · L platform, attention · S express · M t/t/-/-
- `dark-mode/dark-mode-colors/aim-for-sufficient-color-contrast-in` **Do:** Keep contrast ratio at least 4.5:1 in every appearance, and aim for 7:1 with custom colors, particularly for small text; system colors help. **Why:** Strong contrast makes foreground content stand out and supports accessibility guidelines. · P flexibility · L inclusion, attention · S express, include · M d/d/d/d
- `dark-mode/dark-mode-colors/soften-the-color-of-white-backgrounds` **Do:** Slightly darken content images that have white backgrounds when they appear in dark mode. **Why:** A bright white background would glow against the dark surroundings. · P craft · L attention · S express · M d/d/d/d
### Dark Mode colors > Icons and images

- `dark-mode/dark-mode-colors/icons-and-images/use-sf-symbols-wherever-possible` **Do:** Choose SF Symbols whenever you can, tinting them with dynamic colors or adding vibrancy. **Why:** Symbols then look right in both appearance modes. · P familiarity, flexibility · L platform · S express · M t/t/-/-
- `dark-mode/dark-mode-colors/icons-and-images/design-separate-interface-icons-for-the` **Do:** If an icon doesn't contrast well in both appearances, make separate light and dark versions, such as adding an outline or border on only one background. **Why:** Some shapes, like a full moon or oil drop, lose their edges against one of the backgrounds. · P craft, flexibility · L attention · S express · M d/d/d/t
- `dark-mode/dark-mode-colors/icons-and-images/make-sure-full-color-images-and` **Do:** Check full-color images and icons in both appearances; reuse one asset if it works in both, otherwise tweak it or supply separate light and dark assets. **Why:** An asset that looks good in only one mode will look wrong in the other. · P craft, flexibility · L attention · S express · M d/d/d/t
### Dark Mode colors > Text

- `dark-mode/dark-mode-colors/text/use-the-system-provided-label-colors` **Do:** Color labels with the system label colors (primary through quaternary). **Why:** These colors switch automatically between light and dark appearances. · P familiarity, flexibility · L platform, attention · S express · M t/t/-/-
- `dark-mode/dark-mode-colors/text/use-system-views-to-draw-text` **Do:** Display text through system-provided text views and controls instead of drawing it yourself. **Why:** System views keep text looking good on any background and adjust automatically to vibrancy. · P familiarity, craft · L platform, attention · S express, compose · M t/t/-/-
### Platform considerations > iOS, iPadOS

- `dark-mode/platform-considerations/ios-ipados/prefer-the-system-background-colors` [iOS, iPadOS] **Do:** On iOS and iPadOS, use the system background colors instead of custom ones. **Why:** They switch from base to elevated automatically for foreground layers like popovers and sheets, and separate apps and windows in multitasking. · P familiarity, flexibility · L platform, attention · S express · M t/t/-/-
### Platform considerations > macOS

- `dark-mode/platform-considerations/macos/include-some-transparency-in-custom-component` [macOS] **Do:** On macOS, give custom components with a visible background or bezel some transparency, only while in a neutral state. **Why:** Transparency picks up window background color during desktop tinting, producing harmony that persists when the wallpaper changes. · P craft, familiarity · L platform, attention · S express · M -/t/-/-

## Icons (`icons`)

<https://developer.apple.com/design/human-interface-guidelines/icons>

### Best practices

- `icons/best-practices/create-a-recognizable-highly-simplified-design` **Do:** Draw icons as simple, widely recognizable shapes built on familiar metaphors tied directly to the action or content they stand for. **Why:** Excess detail makes an icon confusing or unreadable. · P simplicity, familiarity · L attention, content · S express · M d/d/d/d
- `icons/best-practices/maintain-visual-consistency-across-all-interface` **Do:** Keep every interface icon uniform in size, detail level, stroke weight and perspective, whether custom or system, adjusting dimensions to match visual weight. **Why:** Uniformity makes the icon set feel coherent. · P familiarity, craft · L attention · S express · M d/d/d/d
- `icons/best-practices/in-general-match-the-weights-of` **Do:** Give icons the same weight as nearby text unless you intend to stress one over the other. **Why:** Matching weights yields a consistent look and an even level of emphasis. · P familiarity, simplicity · L attention · S express · M d/d/d/d
- `icons/best-practices/if-necessary-add-padding-to-a` **Do:** Nudge asymmetric custom icons with padding so they look optically centered rather than just geometrically centered. **Why:** A top-light, bottom-heavy icon looks too low when centered mathematically. · P craft · L attention · S express, compose · M d/d/d/d
- `icons/best-practices/provide-a-selected-state-version-of` **Do:** Supply separate selected and unselected icon versions only when needed; standard toolbars, tab bars and buttons handle selection styling themselves. **Why:** The system updates the selected appearance automatically in standard components. · P simplicity, familiarity · L interaction, platform · S express, interact · M t/t/-/-
- `icons/best-practices/use-inclusive-images` **Do:** Make icons understandable and welcoming to all: favor gender-neutral human figures and skip imagery that is hard to recognize across cultures or languages. **Why:** Icons should be accessible and inviting to everyone. · P flexibility · L inclusion · S include, express · M d/d/d/d
- `icons/best-practices/include-text-in-your-design-only` **Do:** Put text in an icon only when essential to the meaning; localize any characters, and for suggesting text use an abstract form with a flipped version for right-to-left. **Why:** Letters can be the most direct way to convey some concepts, but they must work across languages and reading directions. · P simplicity, flexibility · L inclusion, content · S express, include · M d/d/d/d
- `icons/best-practices/if-you-create-a-custom-interface` **Do:** Create custom interface icons as vector files such as PDF or SVG, not PNG, so extra resolution versions aren't needed. **Why:** The system scales vectors for high-resolution screens, whereas PNG can't scale and needs multiple versions. · P craft, flexibility · L platform · S express · M t/d/d/t
- `icons/best-practices/provide-alternative-text-labels-for-custom` **Do:** Give custom interface icons hidden alternative text descriptions. **Why:** VoiceOver can then describe what's on screen, easing navigation for people with visual disabilities. · P flexibility · L inclusion, content · S include, write · M d/d/t/t
- `icons/best-practices/avoid-using-replicas-of-apple-hardware` **Do:** Don't draw your own copies of Apple hardware; if you must show it, use only official Design Resources images or SF Symbols for Apple products. **Why:** Hardware designs change often, so replicas make your content look outdated. · P craft · L attention, platform · S express · M -/-/-/-
### Platform considerations > macOS > Document icons

- `icons/platform-considerations/macos/document-icons/design-simple-images-that-clearly-communicate` [macOS] **Do:** On macOS, give document icons plain shapes and a reduced palette of distinct colors that stay recognizable at every size, down to very small ones. **Why:** Document icons can appear tiny, so complex designs become unrecognizable. · P simplicity, craft · L attention, platform · S express · M -/-/-/-
- `icons/platform-considerations/macos/document-icons/designing-a-single-expressive-image-for` [macOS] **Do:** On macOS, consider a single rich background image, with no center image, to help people identify a document type. **Why:** A distinctive background helps people understand and recognize the document type. · P familiarity, delight · L attention, platform · S express · M -/-/-/-
- `icons/platform-considerations/macos/document-icons/consider-reducing-complexity-in-the-small` [macOS] **Do:** On macOS, simplify small document icon versions: use fewer, thicker lines aligned to the reduced pixel grid, and drop fine details at the smallest size. **Why:** Details that are crisp when large turn blurry and unrecognizable when small. · P simplicity, craft · L attention, platform · S express · M -/-/-/-
- `icons/platform-considerations/macos/document-icons/avoid-placing-important-content-in-the` [macOS] **Do:** On macOS, keep key content out of the background fill's top-right corner, and supply background images in each listed size and scale. **Why:** The system masks the image to the document shape and draws a folded corner over that spot. · P craft · L attention, platform · S express · M -/-/-/-
- `icons/platform-considerations/macos/document-icons/if-a-familiar-object-can-convey` [macOS] **Do:** On macOS, add a center image of a familiar object if it conveys the document type or app link; keep it simple, unambiguous, half the icon canvas, in the listed sizes. **Why:** A clear familiar object communicates the document's type or relationship with your app. · P familiarity, simplicity · L attention, platform · S express · M -/-/-/-
- `icons/platform-considerations/macos/document-icons/define-a-margin-that-measures-about` [macOS] **Do:** On macOS, leave a margin of roughly 10% of the canvas so the image fills about 80%, letting parts extend into it only for optical alignment. · P craft · L attention, platform · S express, compose · M -/-/-/-
- `icons/platform-considerations/macos/document-icons/specify-a-succinct-term-if-it` [macOS] **Do:** On macOS, replace an unfamiliar file extension on the document icon with a short descriptive term, such as scene for a SceneKit file. **Why:** A clearer term helps people understand the document type. · P simplicity, familiarity · L content, platform · S write, express · M -/-/-/-

## Images (`images`)

<https://developer.apple.com/design/human-interface-guidelines/images>

### Resolution

- `images/resolution/provide-high-resolution-assets-for-all` **Do:** Provide high-resolution versions of every bitmap for each supported device, naming scale factors in filenames (@2x and @3x on iOS, @2x on iPadOS and watchOS, @1x and @2x on macOS and tvOS). **Why:** Each device class needs the proper scale for sharp images. · P craft, flexibility · L platform · S express, adapt · M d/d/t/t
- `images/resolution/in-general-design-images-at-the` **Do:** Design at the lowest resolution and scale up for the others; with resizable vector shapes, place control points on whole values. **Why:** 2x and 3x are multiples of 1x, so whole-value points stay aligned to the pixel grid at higher resolutions. · P craft · L platform · S express · M t/t/-/-
### Best practices

- `images/best-practices/include-a-color-profile-with-each` **Do:** Embed a color profile in every image. **Why:** Profiles make colors show as intended on different displays. · P craft · L attention · S express · M d/d/d/d
- `images/best-practices/always-test-images-on-a-range` **Do:** Check images on a variety of real devices, not just in the design tool. **Why:** An image fine at design time may look pixelated, stretched or compressed on other devices. · P craft, flexibility · L attention · S express, adapt · M d/d/d/d
### Platform considerations > tvOS > Layered images

- `images/platform-considerations/tvos/layered-images/use-standard-interface-elements-to-display` [tvOS] **Do:** On tvOS, show layered images with standard views and system focus APIs. **Why:** Layered images then get the parallax effect automatically when focused. · P familiarity · L platform, interaction · S compose, interact · M -/-/-/-
- `images/platform-considerations/tvos/layered-images/identify-logical-foreground-middle-and-background` [tvOS] **Do:** On tvOS, split artwork into logical layers: prominent elements in front, secondary content and shadows in the middle, and an opaque backdrop behind that doesn't upstage them. **Why:** Each layer has a distinct role in showcasing the content. · P craft, simplicity · L attention, platform · S express · M -/-/-/-
- `images/platform-considerations/tvos/layered-images/generally-keep-text-in-the-foreground` [tvOS] **Do:** On tvOS, put text on the front layer unless you purposely want to hide it. **Why:** Front-layer text is clearer. · P simplicity · L attention, platform · S express · M -/-/-/-
- `images/platform-considerations/tvos/layered-images/keep-the-background-layer-opaque` [tvOS] **Do:** On tvOS, make the bottom layer fully opaque; upper layers may vary in opacity. **Why:** An opaque base keeps the artwork looking good with parallax, drop shadows and system backgrounds. · P craft · L platform, attention · S express · M -/-/-/-
- `images/platform-considerations/tvos/layered-images/keep-layering-simple-and-subtle` [tvOS] **Do:** On tvOS, keep depth and layering understated and simple. **Why:** Parallax is meant to be nearly unnoticeable; heavy 3D looks unrealistic and jarring, while simple depth brings delight. · P simplicity, delight · L attention, platform · S express · M -/-/-/-
- `images/platform-considerations/tvos/layered-images/leave-a-safe-zone-around-the` [tvOS] **Do:** On tvOS, keep essential content inside a safe zone away from the edges of foreground layers. **Why:** Focused layers scale and move, so content on some layers may get cropped. · P craft · L platform, attention · S express · M -/-/-/-
- `images/platform-considerations/tvos/layered-images/always-preview-layered-images` [tvOS] **Do:** On tvOS, preview layered images throughout design with Apple's tools, watch scaling and clipping, readjust, and finally check on an actual Apple TV. **Why:** Scaling and clipping can push important content out of view, so previewing catches problems. · P craft · L platform · S express, interact · M -/-/-/-
### Platform considerations > visionOS

- `images/platform-considerations/visionos/create-a-layered-app-icon` [visionOS] **Do:** On visionOS, build the app icon from two to three layers. **Why:** Layers move at slightly different rates when focused, giving a sense of depth. · P craft, delight · L platform, attention · S express · M -/-/-/-
- `images/platform-considerations/visionos/prefer-vector-based-art-for-2d` [visionOS] **Do:** On visionOS, prefer vector art for 2D images and avoid bitmaps. **Why:** Bitmaps may look poor once the system scales them up. · P craft · L platform · S express · M t/t/t/-
- `images/platform-considerations/visionos/if-you-need-to-use-rasterized` [visionOS] **Do:** On visionOS, when using raster images, pick a resolution balancing sharpness at varied distances against file size and performance. **Why:** A fixed @2x image can look soft up close, but higher resolution costs file size and performance. · P craft, flexibility · L platform · S express · M t/t/t/-
### Platform considerations > visionOS > Spatial photos and spatial scenes

- `images/platform-considerations/visionos/spatial-photos-and-spatial-scenes/make-sure-spatial-photos-render-correctly` [visionOS] **Do:** On visionOS, show spatial photos as stereo HEIC files with spatial metadata. **Why:** The system then recognizes them as spatial and applies treatments that reduce stereo-viewing discomfort. · P craft, responsibility · L platform · S express · M -/-/-/-
- `images/platform-considerations/visionos/spatial-photos-and-spatial-scenes/prefer-the-feathered-glass-background-effect` [visionOS] **Do:** On visionOS, put text over spatial photos using the feathered glass background effect. **Why:** It adds contrast for readability and blurs detail to ease visual discomfort. · P flexibility, craft · L attention, platform · S express · M -/-/-/-
- `images/platform-considerations/visionos/spatial-photos-and-spatial-scenes/take-visual-comfort-into-consideration-when` [visionOS] **Do:** On visionOS, when converting 2D content to spatial photos, think about how people will view it and how metadata changes like disparity adjustment alter perceived depth. **Why:** Such metadata changes can cause discomfort from certain viewing positions. · P flexibility, responsibility · L platform, inclusion · S express · M -/-/-/-
- `images/platform-considerations/visionos/spatial-photos-and-spatial-scenes/display-spatial-photos-and-spatial-scenes` [visionOS] **Do:** On visionOS, show spatial photos and scenes in their own sheet or window; if inline, leave generous space around them. **Why:** Inline placement can cause visual discomfort; spacing helps eyes adjust to depth changes. · P flexibility, responsibility · L platform, attention · S compose · M -/-/-/-
- `images/platform-considerations/visionos/spatial-photos-and-spatial-scenes/use-spatial-scenes-in-your-app` [visionOS] **Do:** On visionOS, reserve spatial scenes for specific moments, avoid showing many at once, and use scrolling, pagination or explicit actions to move on. **Why:** Each scene takes several seconds to generate from an image, so the design must accommodate that delay. · P purpose, simplicity · L flow, value · S structure, interact · M -/-/-/-
- `images/platform-considerations/visionos/spatial-photos-and-spatial-scenes/when-displaying-immersively-prefer-minimal-ui` [visionOS] **Do:** On visionOS, in immersive display keep UI minimal, like one item, a small caption and a single Back button, with swipes for moving between items. · P simplicity · L attention, platform · S compose · M -/-/t/-
- `images/platform-considerations/visionos/spatial-photos-and-spatial-scenes/prefer-displaying-larger-spatial-scenes-that` [visionOS] **Do:** On visionOS, show spatial scenes large and centered in the field of view. **Why:** People may move their heads sideways to see parallax, and small scenes deliver less of it and less impact. · P delight, craft · L attention, platform · S compose · M -/-/-/-
### Platform considerations > watchOS

- `images/platform-considerations/watchos/in-general-avoid-transparency-to-keep` [watchOS] **Do:** On watchOS, avoid transparency to keep files small, and bake in the background if it's always the same solid color; keep it for template images like complications and menu icons. **Why:** Template images need transparency so the system knows where to apply color. · P craft, simplicity · L platform · S express · M -/-/-/-
- `images/platform-considerations/watchos/use-autoscaling-pdfs-to-let-you` [watchOS] **Do:** On watchOS, supply one autoscaling PDF per image, designed for the 40mm and 42mm screens at 2x, and let WatchKit scale it per device. **Why:** A single asset can serve every screen size. · P flexibility, craft · L platform · S adapt, express · M -/-/-/-

## Immersive experiences (`immersive-experiences`)

<https://developer.apple.com/design/human-interface-guidelines/immersive-experiences>

### Best practices

- `immersive-experiences/best-practices/offer-multiple-ways-to-use-your` **Do:** Give people several ways to use the app or game, and support the accessibility features they use to personalize interaction. **Why:** People should be free to choose their experience and tailor how they interact with devices. · P agency, flexibility · L inclusion, interaction · S include, interact · M t/t/-/-
- `immersive-experiences/best-practices/prefer-launching-your-app-or-game` **Do:** On visionOS, start in the Shared Space or with the mixed immersion style, even if the experience can go fully immersive or progressive. **Why:** People can refer to other apps and switch between them easily, and decide when to go fully immersive. · P agency, flexibility · L flow, platform · S structure · M -/-/-/-
- `immersive-experiences/best-practices/reserve-immersion-for-meaningful-moments-and` **Do:** Use immersion only for meaningful moments and content; not every task needs it, nor needs full immersion. **Why:** People often want to stay grounded in their surroundings and use other software and system features alongside. · P purpose, agency · L value, platform · S define · M -/-/-/-
- `immersive-experiences/best-practices/help-people-engage-with-key-moments` **Do:** Direct attention to key moments using cues such as dimming, tinting, motion, scale or Spatial Audio; begin subtle and strengthen only with good reason. **Why:** Cues guide people to a specific area of content at any immersion level. · P purpose, simplicity · L attention, platform · S express, interact · M -/-/t/t
- `immersive-experiences/best-practices/prefer-subtle-tint-colors-for-passthrough` **Do:** On visionOS 2 and later, tint passthrough subtly so surroundings and hands blend with your content; avoid bright or dramatic tints. **Why:** Strong tints distract and weaken the sense of immersion. · P delight, simplicity · L attention, platform · S express · M -/-/-/-
### Promoting comfort

- `immersive-experiences/promoting-comfort/be-mindful-of-peoples-visual-comfort` **Do:** Place 3D content in people's field of view in a Full Space, and show motion in comfortable ways. **Why:** Poorly handled motion can distract, confuse or physically discomfort people. · P responsibility, flexibility · L inclusion, platform · S compose, interact · M -/-/-/-
- `immersive-experiences/promoting-comfort/choose-a-style-of-immersion-that` **Do:** Pick an immersion style that suits the physical movements people may make, like shifting weight, turning or sitting versus standing. **Why:** The style lets the system respond properly to movement; excessive movement can make the system interrupt the experience. · P flexibility, responsibility · L platform, interaction · S define, interact · M -/-/-/-
- `immersive-experiences/promoting-comfort/avoid-encouraging-people-to-move-while` **Do:** In progressive or fully immersive experiences, let people interact without moving, such as pulling an object toward them instead of walking to it. **Why:** Some people don't want to move or can't, due to disability or physical surroundings. · P agency, flexibility · L inclusion, interaction · S include, interact · M -/-/-/-
- `immersive-experiences/promoting-comfort/if-you-use-the-mixed-immersion` **Do:** With the mixed immersion style, don't let virtual objects block too much passthrough; if they would, switch to the full or progressive style. **Why:** People rely on passthrough to understand and move around their physical surroundings. · P responsibility, flexibility · L platform, trust · S compose · M -/-/-/-
- `immersive-experiences/promoting-comfort/adopt-arkit-if-you-want-to` **Do:** Use ARKit to blend custom content with surroundings or hand positions, and ask permission to access the sensitive data it needs. **Why:** Surroundings and hand data are sensitive, so people must consent to sharing them. · P responsibility · L trust, platform · S include · M -/-/-/-
### Transitioning between immersive styles

- `immersive-experiences/transitioning-between-immersive-styles/design-smooth-predictable-transitions-when-changing` **Do:** Change immersion levels with gentle transitions people can follow visually; avoid abrupt ones. **Why:** Gradual changes prepare people for a new experience, whereas sudden ones can disorient or discomfort them. · P flexibility, delight · L flow, interaction · S interact · M -/-/-/-
- `immersive-experiences/transitioning-between-immersive-styles/let-people-choose-when-to-enter` **Do:** Give a clear, prominent action for entering and leaving a more immersive experience, and don't switch into it unexpectedly. **Why:** Unexpected immersion is disorienting; a control lets people decide when to be more immersed or leave. · P agency · L flow, interaction · S interact, structure · M -/-/-/-
- `immersive-experiences/transitioning-between-immersive-styles/indicate-the-purpose-of-an-exit` **Do:** Make an exit button show whether it goes back to a less immersive context or quits entirely; if it quits, offer pause or save-progress options first. **Why:** People should know what leaving will do, and not lose progress. · P agency, simplicity · L content, interaction · S write, interact · M -/-/-/-
### Displaying virtual hands

- `immersive-experiences/displaying-virtual-hands/prefer-virtual-hands-that-match-familiar` **Do:** Make virtual hands mirror the real hands' positions and gestures so interaction stays natural. **Why:** Hands that behave familiarly keep people immersed in fully virtual worlds. · P familiarity, delight · L interaction, platform · S interact · M -/-/-/-
- `immersive-experiences/displaying-virtual-hands/use-caution-if-you-create-virtual` **Do:** Be careful with virtual hands much larger than real ones. **Why:** Oversized hands block the content people want, make interactions clumsy and look out of proportion, seeming too near the face. · P craft, flexibility · L interaction, attention · S express · M -/-/-/-
- `immersive-experiences/displaying-virtual-hands/if-theres-an-interruption-in-hand` **Do:** If hand tracking drops, fade out the virtual hands to show the real ones, then fade them back in when tracking resumes. **Why:** Virtual hands shouldn't freeze or go unresponsive. · P craft, agency · L interaction, flow · S interact · M -/-/-/-
### Creating an environment

- `immersive-experiences/creating-an-environment/minimize-distracting-content` **Do:** For a primary task like watching video, limit movement and high-contrast detail in the environment; to highlight an area, use top-quality assets there and dim lesser ones elsewhere. **Why:** Less distraction helps people stay immersed in the main task. · P simplicity, purpose · L attention · S express, compose · M -/-/t/t
- `immersive-experiences/creating-an-environment/help-people-distinguish-interactive-objects-in` **Do:** Use distance to signal interactivity: place objects people can touch close, and non-interactive ones farther away. **Why:** People judge whether they can interact by proximity, and tend to try touching near objects. · P familiarity, purpose · L interaction, attention · S compose, interact · M -/-/-/-
- `immersive-experiences/creating-an-environment/keep-animation-subtle` **Do:** Limit environment animation to small, gentle movements like drifting clouds, and keep movement away from the edges of the field of view. **Why:** Subtle motion enriches the environment without distracting or discomforting people. · P simplicity, delight · L attention · S express · M -/-/-/-
- `immersive-experiences/creating-an-environment/create-an-expansive-environment-regardless-of` **Do:** Make environments feel spacious whatever place they depict. **Why:** Small, confined spaces can make people uncomfortable or claustrophobic. · P flexibility, delight · L attention · S express · M -/-/-/-
- `immersive-experiences/creating-an-environment/use-spatial-audio-to-create-atmosphere` **Do:** Use Spatial Audio to build a soundscape for the environment, avoiding heavy repetition or looping to keep it fresh. **Why:** Sound placed in space adds atmosphere, and variety keeps the experience captivating. · P delight · L attention, platform · S express · M -/-/-/-
- `immersive-experiences/creating-an-environment/in-general-avoid-using-a-flat` **Do:** Generally build environments from lit object meshes with shader animations such as moving clouds, instead of a flat 360-degree image. **Why:** A flat panorama gives no sense of scale, reducing immersion. · P craft, delight · L attention · S express · M -/-/-/-
- `immersive-experiences/creating-an-environment/help-people-feel-grounded` **Do:** Always include a ground plane mesh, even with a flat 360-degree image, to make the scene feel more real. **Why:** Without a ground, people feel like they are floating. · P craft, flexibility · L attention · S express · M -/-/-/-
- `immersive-experiences/creating-an-environment/minimize-asset-redundancy` **Do:** Avoid repeating the same assets or models too often in an environment. **Why:** Heavy repetition makes the environment feel less realistic. · P craft, delight · L attention · S express · M -/-/-/-

## Inclusion (`inclusion`)

<https://developer.apple.com/design/human-interface-guidelines/inclusion>

### Welcoming language

- `inclusion/welcoming-language/consider-the-tone-of-your-copy` **Do:** Review your copy's tone from several viewpoints so it doesn't imply something unintended, while staying clear and direct in whatever style suits the experience. **Why:** Style communicates nearly as much as words; for instance, an academic tone can suggest only highly educated people are welcome. · P flexibility, delight · L content, inclusion · S write, define · M d/d/d/d
- `inclusion/welcoming-language/pay-attention-to-how-you-refer` **Do:** Address people as you and your rather than the user or the player, and keep we and our for your software or company. **Why:** Indirect terms feel distant and unwelcoming, and we can imply a personal relationship that may feel insulting. · P flexibility, delight · L content, inclusion · S write · M d/d/d/d
- `inclusion/welcoming-language/avoid-using-specialized-or-technical-terms` **Do:** Skip jargon unless you define it first and make the definition easy to find. **Why:** Specialized terms leave out people who don't know them and make sentences harder to read and translate. · P flexibility, simplicity · L content, inclusion · S write · M d/d/d/d
- `inclusion/welcoming-language/replace-colloquial-expressions-with-plain-language` **Do:** Swap slang and idioms for plain wording. **Why:** Colloquialisms are culture-specific, hard to translate, and some carry exclusionary origins unknown to the writer. · P flexibility, simplicity · L content, inclusion · S write · M d/d/d/d
- `inclusion/welcoming-language/consider-carefully-before-including-humor` **Do:** Think hard before adding humor to your experience. **Why:** Humor is subjective and hard to translate, and can confuse, irritate through repetition, or insult people. · P flexibility, delight · L content, inclusion · S write, define · M d/d/d/d
### Accessibility

- `inclusion/accessibility/avoid-images-and-language-that-exclude` **Do:** Depict people with disabilities among the variety of people you show, and avoid wording that uses disability to describe something negative. **Why:** Imagery and language shouldn't exclude people with disabilities. · P flexibility · L inclusion, content · S include, write · M d/d/d/d
- `inclusion/accessibility/take-a-people-first-approach-when` **Do:** When writing about people with disabilities, lead with the person's accomplishments and goals before any disability, and learn how an individual or community self-identifies. · P flexibility · L content, inclusion · S write, include · M d/d/d/d
- `inclusion/accessibility/prioritize-simplicity-and-perceivability` **Do:** Favor familiar, consistent interactions that keep tasks simple, and make content perceivable through sight, hearing or touch. **Why:** Everyone should be able to perceive and use the content. · P flexibility, simplicity · L inclusion, interaction · S include · M d/d/d/d

## Layout (`layout`)

<https://developer.apple.com/design/human-interface-guidelines/layout>

### Visual hierarchy

- `layout/visual-hierarchy/order-content-by-relative-importance` **Do:** Place key items toward the top and leading edge, and rely on standard system components so right-to-left languages adapt on their own. **Why:** People start reading top to bottom and leading to trailing. · P simplicity, flexibility · L attention, inclusion · S compose · M d/d/d/d
- `layout/visual-hierarchy/align-elements-to-make-them-easier` **Do:** Align elements for easy scanning, and use indentation deliberately to show subordinate items. **Why:** Alignment looks organized and helps eyes follow content; people read aligned items as related and indented ones as subordinate. · P simplicity, craft · L attention · S compose · M d/d/d/d
- `layout/visual-hierarchy/group-related-items-to-clearly-express` **Do:** Cluster elements that belong together, using space, containers, or dividers to show what is related and what isn't. **Why:** Visible grouping makes the relationships between pieces of information and functions clear. · P simplicity · L attention · S compose · M d/d/d/d
- `layout/visual-hierarchy/use-progressive-disclosure-to-make-layouts` **Do:** Show less at first, revealing more through disclosure triangles, menus, nested views or scrollable sections. **Why:** Too much content and too many choices makes information hard to find and choices hard to grasp. · P simplicity, agency · L attention, flow · S compose, structure · M d/d/t/t
- `layout/visual-hierarchy/differentiate-controls-from-content` **Do:** Use Liquid Glass to make controls stand apart, and use a scroll edge effect rather than a solid or semi-opaque backing; extend full-screen background content beneath sidebars. **Why:** Controls should look distinct and sit above the content. · P simplicity, familiarity · L attention, platform · S compose, express · M t/t/-/-
### Adaptability

- `layout/adaptability/design-a-layout-that-adapts-gracefully` **Do:** Make layouts adapt smoothly and consistently by respecting safe areas, margins and guides and using layout modifiers for placement, so the experience stays familiar across rotation, resizing and devices. **Why:** People expect the experience to feel familiar when they rotate, resize, add a display or change devices. · P flexibility, familiarity · L platform, attention · S adapt, compose · M d/d/t/t
- `layout/adaptability/be-prepared-for-text-size-changes` **Do:** Support Dynamic Type by reflowing layouts for larger text, for instance stacking side-by-side views vertically. **Why:** Apps that ignore system text size can be hard or impossible to use for people who depend on it. · P flexibility · L inclusion, attention · S adapt, include · M d/d/t/t
- `layout/adaptability/preview-your-app-on-multiple-devices` **Do:** Preview on several devices, size classes, localizations and text sizes, starting with the largest and smallest layouts, checking for clipping and resizing cases. **Why:** Testing across configurations reveals clipping and other layout problems. · P craft, flexibility · L platform · S adapt · M d/d/t/t
- `layout/adaptability/when-necessary-scale-background-artwork-in` **Do:** If background artwork would be cropped or letterboxed in a new context, scale it to fill the screen without changing its aspect ratio; remember windows can be very wide or tall. **Why:** Different aspect ratios can make artwork appear cropped or padded with bars. · P flexibility, craft · L attention, platform · S adapt, express · M d/d/d/t
### Adaptability > Size classes

- `layout/adaptability/size-classes/determine-layout-based-on-size-classes` **Do:** Base layout decisions on size classes, not device type or orientation. **Why:** Size classes reflect the space actually available, which orientation and device type don't, and let the interface adapt to many window sizes. · P flexibility · L platform · S adapt, compose · M t/t/-/-
- `layout/adaptability/size-classes/consider-all-possible-combinations-of-size` **Do:** Design for every size class combination in portrait and landscape, not just one, such as an iPhone landscape layout that wastes iPad space when resized. **Why:** The app can appear in many combinations, and each needs a good experience. · P flexibility · L platform · S adapt, compose · M t/t/-/-
- `layout/adaptability/size-classes/keep-functionality-the-same-as-size` **Do:** Keep features constant as space changes, only varying how much is visible, like swapping a tab bar for a sidebar; keep layout changes platform-familiar. **Why:** Functionality shouldn't depend on available space, and familiar changes keep the app recognizable. · P familiarity, flexibility · L platform, flow · S adapt, structure · M t/t/-/-
### Platform considerations > macOS

- `layout/platform-considerations/macos/avoid-placing-controls-or-critical-information` [macOS] **Do:** On macOS, don't put controls or critical information along a window's bottom edge. **Why:** People often drag windows so the bottom edge falls below the screen. · P craft, flexibility · L platform, attention · S compose · M -/t/-/-
- `layout/platform-considerations/macos/avoid-displaying-content-behind-the-camera` [macOS] **Do:** On macOS, keep content out of the area behind the camera housing at the window's top edge. · P craft, flexibility · L platform, attention · S compose · M -/-/-/-
### Platform considerations > tvOS

- `layout/platform-considerations/tvos/adhere-to-the-screens-safe-area` [tvOS] **Do:** On tvOS, inset primary content 60 points top and bottom and 80 points at the sides. **Why:** Such margins keep content in view whatever the TV's compatibility settings or overscan cropping. · P craft, flexibility · L platform, attention · S compose · M -/-/t/-
- `layout/platform-considerations/tvos/include-appropriate-padding-between-focusable-elements` [tvOS] **Do:** On tvOS, leave enough spacing between focusable elements so a focused, enlarged one doesn't cover important information. **Why:** Elements grow when focused. · P craft · L platform, interaction · S compose, interact · M -/-/-/-
### Platform considerations > tvOS > Grids

- `layout/platform-considerations/tvos/grids/include-additional-vertical-spacing-for-titled` [tvOS] **Do:** On tvOS, give titled rows extra vertical room above and below the title, measured from the unfocused row above to the title center and from title bottom to the items. **Why:** Added space prevents crowding. · P craft, simplicity · L platform, attention · S compose · M -/-/t/-
- `layout/platform-considerations/tvos/grids/use-consistent-spacing` [tvOS] **Do:** On tvOS, space grid content evenly. **Why:** Uneven spacing breaks the grid look and makes scanning harder. · P craft, simplicity · L platform, attention · S compose · M -/-/d/d
- `layout/platform-considerations/tvos/grids/make-partially-hidden-content-look-symmetrical` [tvOS] **Do:** On tvOS, make offscreen content that peeks in show equal width on both screen sides. **Why:** Symmetry directs attention to the fully visible content. · P craft, simplicity · L platform, attention · S compose · M -/-/t/t
### Platform considerations > visionOS

- `layout/platform-considerations/visionos/in-general-support-resizing` [visionOS] **Do:** On visionOS, support window and volume resizing, adapt the layout as size changes, keep content horizontally centered at very large sizes, and optionally set minimum and maximum sizes. **Why:** Resizing is standard visionOS behavior, as in macOS and iPadOS, and centered content stays easy to view and use. · P flexibility, familiarity · L platform, interaction · S adapt, compose · M -/t/-/-
- `layout/platform-considerations/visionos/use-3d-content-sparingly-in-windows` [visionOS] **Do:** On visionOS, limit fixed-depth 3D content in windows to meaningful moments next to 2D content, and inset it so it doesn't collide with other elements. **Why:** Insetting prevents collisions with other content or controls and unpredictable appearance. · P purpose, simplicity · L value, platform · S compose · M -/-/-/-
- `layout/platform-considerations/visionos/display-supplemental-content-in-an-adjacent` [visionOS] **Do:** On visionOS, open supplemental content in a neighboring window and keep ornaments for app-specific interactive controls like toolbars and playback controls. **Why:** Ornaments suit interactive controls, not supplementary content. · P familiarity, simplicity · L platform, flow · S compose, structure · M -/-/-/-
- `layout/platform-considerations/visionos/include-enough-space-around-controls-for` [visionOS] **Do:** On visionOS, leave generous room around controls, with button centers well apart, so each is easy to identify and hover effects don't cover neighbors. **Why:** Spacing keeps controls distinguishable and stops the system hover effect from hiding other content. · P flexibility, craft · L interaction, platform · S compose · M t/t/-/-
### Platform considerations > watchOS

- `layout/platform-considerations/watchos/avoid-placing-more-than-two-or` [watchOS] **Do:** On Apple Watch, put at most three glyph buttons or two text buttons in one row; full-width text buttons are usually better, and side-by-side works only on non-scrolling screens. · P simplicity · L attention, platform · S compose · M t/-/-/-
- `layout/platform-considerations/watchos/support-autorotation-in-views-people-might` [watchOS] **Do:** On Apple Watch, let content rotate automatically in views a wearer may want to show to someone else, such as an image or QR code. **Why:** Turning the wrist away normally sleeps the display, but sharing content with another person needs it to stay readable. · P flexibility, agency · L platform, interaction · S adapt · M -/-/-/-

## Materials (`materials`)

<https://developer.apple.com/design/human-interface-guidelines/materials>

### Liquid Glass

- `materials/liquid-glass/dont-use-liquid-glass-in-the` **Do:** Keep Liquid Glass out of the content layer; use standard materials for things like app backgrounds. Transient interactive controls such as sliders and toggles are the exception. **Why:** Liquid Glass should separate interactive elements from content; placing it in content adds complexity and muddles the visual hierarchy. · P simplicity, familiarity · L attention · S express · M t/t/-/-
- `materials/liquid-glass/use-liquid-glass-effects-sparingly` **Do:** Apply Liquid Glass to custom controls rarely, reserving it for the app's most important functional elements; standard components already get it automatically. **Why:** The material is meant to point attention to content underneath; overusing it distracts from that content and degrades the experience. · P simplicity, purpose · L attention · S express · M t/t/-/-
- `materials/liquid-glass/only-use-clear-liquid-glass-for` **Do:** Choose the clear Liquid Glass variant only for components sitting over visually rich backgrounds; otherwise use the regular variant. **Why:** Appearance of the variants shifts with system and accessibility settings, so the clear variant needs a busy background to stay legible. · P flexibility, simplicity · L attention, inclusion · S express · M t/t/-/-
### Standard materials

- `materials/standard-materials/choose-materials-and-effects-based-on` **Do:** Pick a material or vibrancy style for its intended use, not for the color it seems to add to your interface. **Why:** System settings can alter how a material looks and behaves, so apparent color is an unreliable basis. · P familiarity, flexibility · L attention · S express · M t/t/-/-
- `materials/standard-materials/help-ensure-legibility-by-using-vibrant` **Do:** Place system-defined vibrant colors on top of whichever material you use, rather than ordinary fixed colors. **Why:** Vibrant colors stay readable across contexts without looking too dark, bright, saturated, or low in contrast. · P flexibility, craft · L attention, inclusion · S express · M t/t/-/-
- `materials/standard-materials/consider-contrast-and-visual-separation-when` **Do:** When pairing a material with blur and vibrancy, weigh needs: thicker, more opaque materials for fine-detail contrast, thinner translucent ones to keep background context visible. **Why:** Material thickness trades text contrast against awareness of the content behind. · P craft, flexibility · L attention · S express · M t/t/-/-
### Platform considerations > macOS

- `materials/platform-considerations/macos/choose-when-to-allow-vibrancy-in` [macOS] **Do:** On macOS, decide deliberately where custom views and controls use vibrancy, testing in varied contexts to see where it helps. **Why:** Vibrancy makes foreground content stand out on any background, but only testing shows where it improves communication. · P craft, familiarity · L attention, platform · S express · M -/t/-/-
- `materials/platform-considerations/macos/choose-a-background-blending-mode-that` [macOS] **Do:** On macOS, select between the behind-window and within-window blending modes to suit your interface design. · P craft · L attention, platform · S express · M -/t/-/-
### Platform considerations > visionOS

- `materials/platform-considerations/visionos/prefer-translucency-to-opaque-colors-in` [visionOS] **Do:** On visionOS, give windows translucent materials instead of solid opaque fills. **Why:** Opaque areas block the view, make people feel confined, and lessen awareness of virtual and physical surroundings. · P flexibility, responsibility · L platform, attention · S express · M -/-/-/-
- `materials/platform-considerations/visionos/if-necessary-choose-materials-that-help` [visionOS] **Do:** On visionOS, for custom components pick the thin material for interactive or selected items, regular to separate sections, and thick for a dark element that stays distinct. **Why:** Each material weight signals a different role, creating separation or interactivity cues. · P craft, familiarity · L attention, platform · S express · M -/-/-/-
### Platform considerations > watchOS

- `materials/platform-considerations/watchos/use-materials-to-provide-context-in` [watchOS] **Do:** On Apple Watch, keep the default material backgrounds on full-screen modal sheets instead of removing or replacing them. **Why:** Layered material contrast helps orient people and separates controls and system elements from other content in these common modals. · P familiarity, simplicity · L attention, platform · S express · M -/-/-/-

## Motion (`motion`)

<https://developer.apple.com/design/human-interface-guidelines/motion>

### Best practices

- `motion/best-practices/add-motion-purposefully-supporting-the-experience` **Do:** Animate only when motion supports the experience; never add it just to have movement. **Why:** Gratuitous animation distracts people and can make them feel disconnected or physically uncomfortable. · P simplicity, delight · L attention · S express, interact · M d/d/d/t
- `motion/best-practices/make-motion-optional` **Do:** Never rely on motion alone to convey important information; back it up with alternatives such as haptics and audio. **Why:** Not everyone can or wants to experience motion, so other channels let everyone get the message. · P flexibility, agency · L inclusion, interaction · S include, interact · M d/d/t/-
### Providing feedback

- `motion/providing-feedback/strive-for-realistic-feedback-motion-that` **Do:** In non-game apps, make feedback motion physically plausible and consistent with gestures; a view that slides in from the top shouldn't leave sideways. **Why:** Realistic motion explains how things work, while illogical motion leaves people disoriented. · P familiarity · L interaction · S interact · M d/d/-/-
- `motion/providing-feedback/aim-for-brevity-and-precision-in` **Do:** Keep feedback animations short and tightly tied to the action that triggered them. **Why:** Brief, precise animation feels lightweight and often communicates better than a prominent one without distracting people. · P simplicity, delight · L interaction, attention · S interact · M d/d/t/-
- `motion/providing-feedback/in-apps-generally-avoid-adding-motion` **Do:** In apps, don't add custom animation to interactions people perform often; standard elements already get subtle motion from the system. **Why:** Needless motion forces people to spend extra attention on it each time they use the element. · P simplicity, agency · L interaction, attention · S interact · M d/d/-/-
- `motion/providing-feedback/let-people-cancel-motion` **Do:** Don't make people sit through an animation before acting, particularly one they'll see repeatedly. **Why:** Waiting on repeated animation wastes time and gets in the way of the task. · P agency · L interaction, flow · S interact · M d/d/t/-
- `motion/providing-feedback/consider-using-animated-symbols-where-it` **Do:** Use animation on SF Symbols or custom symbols where it fits, using SF Symbols 5 or later. · P delight, familiarity · L interaction · S express · M -/-/-/-
### Leveraging platform capabilities

- `motion/leveraging-platform-capabilities/make-sure-your-games-motion-looks` **Do:** For each platform a game supports, exploit the device's graphics so default settings look smooth, aiming for a steady frame rate, with no tweaking needed first. **Why:** A steady frame rate gives a smooth, appealing experience, and people shouldn't have to change settings to get it. · P flexibility, craft · L platform · S adapt · M t/t/-/-
- `motion/leveraging-platform-capabilities/let-people-customize-the-visual-experience` **Do:** Let players tune a game's visuals for performance or battery life, for example offering power modes when an external power source is detected. **Why:** Players have different priorities between visual quality, performance, and battery, and conditions change. · P agency, flexibility · L interaction, platform · S interact, adapt · M t/t/-/-
### Platform considerations > visionOS

- `motion/platform-considerations/visionos/as-much-as-possible-avoid-displaying` [visionOS] **Do:** On visionOS, avoid motion at the edges of the field of view; if peripheral movement is needed in immersive scenes, match the object's brightness to surrounding content. **Why:** Peripheral motion distracts and can cause discomfort by making people feel they or their surroundings are moving. · P flexibility, responsibility · L platform, inclusion · S express · M -/-/-/-
- `motion/platform-considerations/visionos/help-people-remain-comfortable-when-showing` [visionOS] **Do:** On visionOS, when large virtual objects move, raise their translucency or lower their contrast so the motion is less noticeable. **Why:** A big object may be read as part of the surroundings, making people think they themselves are moving. · P flexibility, responsibility · L platform, inclusion · S express · M -/-/-/-
- `motion/platform-considerations/visionos/consider-using-fades-when-you-need` [visionOS] **Do:** On visionOS, if moving an object between places conveys nothing useful, fade it out, relocate it, then fade it back in. **Why:** People naturally follow movement with their eyes, so pointless travel draws attention for no reason. · P simplicity, flexibility · L attention, platform · S express, interact · M -/-/-/-
- `motion/platform-considerations/visionos/in-general-avoid-letting-people-rotate` [visionOS] **Do:** On visionOS, generally don't let people spin a virtual world; use instant direction changes during a quick fade-out instead. **Why:** A rotating world upsets people's sense of stability, even if they control it and the movement is subtle. · P flexibility, responsibility · L platform, inclusion · S interact · M -/-/-/-
- `motion/platform-considerations/visionos/consider-giving-people-a-stationary-frame` [visionOS] **Do:** On visionOS, keep moving visuals inside a region that stays still rather than moving the whole surrounding view. **Why:** Movement is easier to tolerate within a fixed frame; when everything moves, people can feel unwell. · P flexibility, responsibility · L platform, inclusion · S compose, express · M -/-/-/-
- `motion/platform-considerations/visionos/avoid-showing-objects-that-oscillate-in` [visionOS] **Do:** On visionOS, avoid sustained oscillation, especially near 0.2 Hz; if it is unavoidable, use low amplitude and consider translucent content. **Why:** People are very sensitive to oscillation at roughly that frequency. · P flexibility, responsibility · L platform, inclusion · S express · M -/-/-/-

## Privacy (`privacy`)

<https://developer.apple.com/design/human-interface-guidelines/privacy>

### Best practices

- `privacy/best-practices/request-access-only-to-data-that` **Do:** Ask only for data a feature truly needs, not before interest in that feature, and word permission requests as specifically as possible. **Why:** Over-asking or asking too early erodes trust; specific requests give people precise control over their data. · P responsibility, agency · L trust · S include · M d/d/-/-
- `privacy/best-practices/be-transparent-about-how-your-app` **Do:** Explain clearly how you gather and use personal data, and honor choices people make through system privacy features and tracking rules. **Why:** People hesitate to share data when they don't understand exactly what will be done with it. · P responsibility · L trust, content · S include, write · M d/d/-/-
- `privacy/best-practices/process-data-on-the-device-where` **Do:** Where possible, handle data on the device itself, for example with on-device machine learning in iOS, instead of sending it to a server. **Why:** It avoids slow and potentially risky trips to a remote server. · P responsibility · L trust · S include · M t/t/-/-
- `privacy/best-practices/adopt-system-defined-privacy-protections-and` **Do:** Use the privacy protections the system provides and follow security best practices, such as relying on CloudKit encryption and key management in iOS 15 and later. · P responsibility, familiarity · L trust · S include · M t/t/-/-
### Requesting permission

- `privacy/requesting-permission/request-permission-only-when-your-app` **Do:** Ask for access to personal data or device capabilities only when a feature clearly needs it, ideally at the moment someone uses that feature. **Why:** Requests without an obvious need make people suspicious; asking in context makes the reason evident. · P responsibility · L trust · S include, interact · M d/d/-/-
- `privacy/requesting-permission/avoid-requesting-permission-at-launch-unless` **Do:** Skip permission prompts at launch unless the app can't work without that access and the need is obvious, as with a navigation app and location. **Why:** A launch-time request is tolerated when people see why it is made. · P responsibility, agency · L trust, flow · S include, structure · M d/d/-/-
- `privacy/requesting-permission/write-copy-that-clearly-describes-how` **Do:** Write the permission explanation as one short, specific, complete sentence in sentence case with active voice and a closing period, saying how the data or ability is used. **Why:** The text sits in the system alert between the app name and the buttons, so it must be easy to grasp when deciding. · P responsibility, simplicity · L content, trust · S write, include · M d/t/-/-
### Requesting permission > Pre-alert screens, windows, or views

- `privacy/requesting-permission/pre-alert-screens-windows-or-views/include-only-one-button-and-make` **Do:** On a screen shown before a system permission alert, offer a single button that clearly leads to the alert, and avoid labels like Allow that mimic the alert's choice. **Why:** Extra buttons or look-alike labels divert people from their real choice, feel manipulative, and can trigger accidental consent. · P responsibility, agency · L trust, interaction · S include, write · M d/t/-/-
- `privacy/requesting-permission/pre-alert-screens-windows-or-views/dont-include-additional-actions-in-your` **Do:** Don't add ways to leave a pre-alert screen without seeing the system alert, such as Close or Cancel, unless legal consent requires it. **Why:** Letting people bypass the alert diverts them from making their permission choice. · P responsibility · L trust, flow · S include, interact · M d/t/-/-
### Requesting permission > Tracking requests

- `privacy/requesting-permission/tracking-requests/never-precede-the-system-provided-alert` **Do:** Never put a custom screen before the system tracking alert if it could mislead, for example by offering incentives or imitating the alert. **Why:** People often tap through alerts quickly, and screens exploiting that to steer choices are rejected by App Store review. · P responsibility · L trust, content · S include · M d/t/-/-
### Location button

- `privacy/location-button/consider-using-the-location-button-to` **Do:** Offer the location button for features like attaching a place or finding a store, especially if people commonly choose Allow Once. **Why:** It lets people share location without repeatedly handling the permission alert. · P agency, responsibility · L interaction, trust · S interact, include · M -/t/-/-
- `privacy/location-button/consider-customizing-the-location-button-to` **Do:** Adjust the location button's system title, filled or outlined glyph, colors, and corner radius to fit your UI; other visual attributes stay fixed. **Why:** Fixed system styling helps people recognize and trust location buttons. · P craft, familiarity · L interaction, platform · S express · M -/-/-/-
### Protecting data

- `privacy/protecting-data/avoid-relying-solely-on-passwords-for` **Do:** Replace passwords with passkeys where possible; if passwords remain, add two-factor authentication, and use biometrics to protect apps that stay logged in. **Why:** Passwords alone give weaker protection for people's accounts and data. · P responsibility · L trust · S include · M t/t/-/-
- `privacy/protecting-data/store-sensitive-information-in-a-keychain` **Do:** Keep sensitive information in a keychain. **Why:** A keychain gives a secure and predictable experience when handling private information. · P responsibility · L trust · S include · M t/t/-/-
- `privacy/protecting-data/never-store-passwords-or-other-secure` **Do:** Never save passwords or other secrets in plain-text files, even with file permissions limiting access. **Why:** Sensitive data is much safer inside an encrypted keychain. · P responsibility · L trust · S include · M t/t/-/-
- `privacy/protecting-data/avoid-inventing-custom-authentication-schemes` **Do:** Rather than building your own sign-in method, lean on system options: passkeys, Sign in with Apple, or Password AutoFill. · P responsibility, familiarity · L trust · S include · M t/t/-/-
### Platform considerations > macOS

- `privacy/platform-considerations/macos/sign-your-app-with-a-valid` [macOS] **Do:** On macOS, if distributing outside the store, sign the app with a valid Developer ID. **Why:** Signing identifies you as an Apple developer and confirms the app is safe to use. · P responsibility · L trust, platform · S include · M -/-/-/-
- `privacy/platform-considerations/macos/protect-peoples-data-with-app-sandboxing` [macOS] **Do:** On macOS, sandbox your app; it is required for Mac App Store submission. **Why:** Sandboxing grants needed access to resources and user data while shielding the app from malware. · P responsibility · L trust, platform · S include · M -/-/-/-
- `privacy/platform-considerations/macos/avoid-making-assumptions-about-who-is` [macOS] **Do:** On macOS, don't assume a single signed-in person. **Why:** With fast user switching, several people can be active on the same system. · P responsibility, flexibility · L trust, platform · S include · M -/t/-/-

## Right to left (`right-to-left`)

<https://developer.apple.com/design/human-interface-guidelines/right-to-left>

### Text alignment

- `right-to-left/text-alignment/adjust-text-alignment-to-match-the` **Do:** If the system doesn't flip text alignment automatically, align text to the interface direction, e.g. right-align text that was left-aligned in left-to-right layout. **Why:** Text should follow the content's mirrored position in right-to-left layouts. · P flexibility · L inclusion · S include, adapt · M d/d/d/d
- `right-to-left/text-alignment/align-a-paragraph-based-on-its` **Do:** Align paragraphs (three or more lines) by their own language; keep one- and two-line blocks matching the current context's reading direction. **Why:** A paragraph aligned against its language is hard to read because line beginnings are hard to spot. · P flexibility, simplicity · L inclusion, content · S include · M d/d/d/d
- `right-to-left/text-alignment/use-a-consistent-alignment-for-all` **Do:** In right-to-left layouts, mirror the alignment of every item in a list, including items written in another script. **Why:** Uniform alignment makes the list comfortable to read and scan. · P flexibility, simplicity · L inclusion, attention · S include · M d/d/d/d
### Numbers and characters

- `right-to-left/numbers-and-characters/dont-reverse-the-order-of-numerals` **Do:** Show the digits of a given number, such as a phone or card number, in the same order whatever the language or surrounding text. **Why:** A number's digit order stays constant regardless of reading direction. · P flexibility, familiarity · L inclusion, content · S include · M d/d/d/d
- `right-to-left/numbers-and-characters/reverse-the-order-of-numerals-that` **Do:** In right-to-left layouts, reverse the sequence of numerals used for progress, counting, or ordering to match flipped controls, but never mirror the numerals themselves. **Why:** Numerals on sliders, progress bars, and ratings must agree with the direction of the flipped control. · P flexibility, familiarity · L inclusion, interaction · S include · M d/d/d/d
### Controls

- `right-to-left/controls/flip-controls-that-show-progress-from` **Do:** Mirror sliders and progress indicators in right-to-left contexts, and swap the glyphs or images marking their start and end values too. **Why:** People see forward progress as running the same way as their reading direction. · P flexibility, familiarity · L inclusion, interaction · S include, adapt · M d/d/t/t
- `right-to-left/controls/flip-controls-that-help-people-navigate` **Do:** In right-to-left contexts, flip back, next, and previous controls so the back button points right and ordered navigation follows reading order. **Why:** The flow of screens should match the reading order of the language. · P flexibility, familiarity · L inclusion, flow · S include, adapt · M d/d/t/t
- `right-to-left/controls/preserve-the-direction-of-a-control` **Do:** Leave controls that mean a literal direction or point to an onscreen area unflipped; a control meaning right must always point right. **Why:** Its meaning is a physical direction, independent of language context. · P familiarity, flexibility · L inclusion, interaction · S include · M d/d/d/d
- `right-to-left/controls/visually-balance-adjacent-latin-and-rtl` **Do:** Where Arabic or Hebrew sits beside all-caps Latin in buttons, labels, or titles, consider enlarging the RTL text by about 2 points. **Why:** These scripts lack capital letters, so they look undersized next to uppercase Latin. · P craft, flexibility · L inclusion, attention · S include, express · M d/d/d/d
### Images

- `right-to-left/images/avoid-flipping-images-like-photographs-illustrations` **Do:** Don't mirror photographs, illustrations, or general artwork; if the image is tied to reading direction, make a new version instead. **Why:** Flipping can change an image's meaning, and flipping copyrighted work could be a violation. · P flexibility, responsibility · L inclusion, content · S include, express · M d/d/d/d
- `right-to-left/images/reverse-the-positions-of-images-when` **Do:** In right-to-left layouts, reverse the placement of images whose sequence matters, such as chronological, alphabetical, or favorites ordering. **Why:** Reversal keeps the order's meaning intact in the RTL context. · P flexibility · L inclusion, attention · S include, compose · M d/d/d/d
### Interface icons

- `right-to-left/interface-icons/flip-interface-icons-that-represent-text` **Do:** Mirror interface icons that stand for text or reading direction, such as shifting left-aligned bars to the right in RTL. · P flexibility, familiarity · L inclusion · S include, express · M d/d/d/d
- `right-to-left/interface-icons/consider-creating-a-localized-version-of` **Do:** For custom icons that contain real letters or words, consider making a localized version per script, as SF Symbols does for signature, rich-text, and I-beam symbols. **Why:** Icons that show script-related concepts need the actual script of the reader's language. · P flexibility · L inclusion, content · S include, express · M d/d/t/t
- `right-to-left/interface-icons/flip-an-interface-icon-that-shows` **Do:** Mirror icons depicting forward or backward motion in right-to-left contexts so the motion keeps its meaning. **Why:** Movement along the reading direction reads as forward and the opposite as backward. · P flexibility, familiarity · L inclusion · S include, express · M d/d/d/d
- `right-to-left/interface-icons/dont-flip-logos-or-universal-signs` **Do:** Always show logos in their original form, and don't mirror universal marks like the checkmark. **Why:** A flipped logo confuses people and may bring legal trouble; universal marks are expected to look constant. · P familiarity, responsibility · L inclusion, trust · S include, express · M d/d/d/d
- `right-to-left/interface-icons/in-general-avoid-flipping-interface-icons` **Do:** Generally don't mirror icons of everyday objects, like a clock, unless the object indicates direction. **Why:** Familiar items work the same everywhere regardless of language direction. · P familiarity, flexibility · L inclusion · S include, express · M d/d/d/d
- `right-to-left/interface-icons/before-merely-flipping-a-complex-custom` **Do:** Before mirroring a complex custom icon, examine its parts and overall balance; elements like badges or slashes may need to stay unflipped. **Why:** Some components should follow the visual design language regardless of localization, as the consistent backslash in SF Symbols shows. · P craft, familiarity · L inclusion, attention · S include, express · M d/d/t/t

## SF Symbols (`sf-symbols`)

<https://developer.apple.com/design/human-interface-guidelines/sf-symbols>

### Rendering modes

- `sf-symbols/rendering-modes/monochrome` **Term: Monochrome.** Use monochrome rendering to paint every layer of a symbol in one specified color.
- `sf-symbols/rendering-modes/hierarchical` **Term: Hierarchical.** Use hierarchical rendering to color a symbol in one hue while layer opacity varies by importance level.
- `sf-symbols/rendering-modes/palette` **Term: Palette.** Use palette rendering to give each symbol layer its own color from two or more; with two colors on three levels, the lower layers share one.
- `sf-symbols/rendering-modes/multicolor` **Term: Multicolor.** Use multicolor rendering for symbols with built-in colors that add meaning, like green for a leaf or red for data loss; some layers accept other colors.
- `sf-symbols/rendering-modes/confirm-that-a-symbols-rendering-mode` **Do:** Check each symbol's rendering mode in every place it appears, even with the automatic setting, and switch modes where details become easier to see. **Why:** Symbol size and background contrast change how well people can make out details. · P craft, flexibility · L attention, inclusion · S express · M t/t/t/t
### Variable color

- `sf-symbols/variable-color/use-variable-color-to-communicate-change` **Do:** Use variable color to show change; to suggest depth or visual hierarchy, use hierarchical rendering to lift certain layers instead. **Why:** Hierarchical mode is the tool meant for separating foreground from background layers. · P simplicity, craft · L attention · S express · M t/t/t/t
### Animations

- `sf-symbols/animations/appear` **Term: Appear.** Use the Appear animation to have a symbol gradually come into view.
- `sf-symbols/animations/disappear` **Term: Disappear.** Use the Disappear animation to have a symbol gradually fade out of view.
- `sf-symbols/animations/bounce` **Term: Bounce.** Use Bounce, a single elastic scale up or down that returns to the start, to indicate an action happened or one is needed.
- `sf-symbols/animations/scale` **Term: Scale.** Use Scale to resize a symbol persistently until changed, for example to flag a selected item or acknowledge a choice.
- `sf-symbols/animations/pulse` **Term: Pulse.** Use Pulse, which varies opacity of annotated layers (or all), to show ongoing activity, running continuously until a condition is met.
- `sf-symbols/animations/variable-color` **Term: Variable color.** Apply the Variable color animation, either cumulative or one layer at a time, to show progress or activity like playback, connecting, or broadcasting.
- `sf-symbols/animations/replace` **Term: Replace.** Use Replace to swap one symbol for another, choosing among down-up (state change) and other scale configurations.
- `sf-symbols/animations/magic-replace` **Term: Magic Replace.** Rely on Magic Replace, now the default, for smooth transitions between related symbols; unrelated symbols fall back to the down-up animation.
- `sf-symbols/animations/wiggle` **Term: Wiggle.** Use Wiggle to highlight a change or call to action people might miss, or to underline a symbol's meaning such as a pointing arrow.
- `sf-symbols/animations/breathe` **Term: Breathe.** Use Breathe, changing both opacity and size, for status changes or ongoing activity such as recording.
- `sf-symbols/animations/rotate` **Term: Rotate.** Use Rotate as an indicator or to mimic real-world behavior, such as showing a task in progress; some symbols turn wholly, others by layer.
- `sf-symbols/animations/draw-on-draw-off` **Term: Draw On / Draw Off.** Draw On and Draw Off (SF Symbols 7+) animate a symbol being traced in or out along its path, which suits showing progress such as a download or stressing meaning.
- `sf-symbols/animations/apply-symbol-animations-judiciously` **Do:** Be selective with symbol animations in a view. **Why:** Too many animations overwhelm the interface and distract people. · P simplicity · L attention · S interact · M d/d/t/-
- `sf-symbols/animations/make-sure-that-animations-serve-a` **Do:** Ensure each symbol animation has a clear job, and consider whether people could misread the animation or a combination of them. **Why:** Each animation type carries its own implied action or response, so mismatches confuse. · P purpose, simplicity · L interaction, content · S interact · M d/d/t/-
- `sf-symbols/animations/use-symbol-animations-to-communicate-information` **Do:** Use symbol animations as feedback to convey complex information compactly. **Why:** They confirm something happened and express information simply without using much visual space. · P simplicity, familiarity · L interaction, attention · S interact · M d/d/t/-
- `sf-symbols/animations/consider-your-apps-tone-when-adding` **Do:** When animating a symbol, choose motion that matches your brand identity and the app's overall style and tone. **Why:** Animation expresses a character that should fit the app's personality. · P delight, purpose · L attention, value · S define, express · M d/d/d/t
### Custom symbols

- `sf-symbols/custom-symbols/use-the-template-as-a-guide` **Do:** Build custom symbols from the template so they match system ones in detail, weight, alignment, position, and perspective, and are simple, recognizable, inclusive, and tied to their meaning. **Why:** Consistency with system symbols keeps custom ones coherent and understandable. · P craft, familiarity, simplicity · L attention, inclusion · S express · M d/d/t/t
- `sf-symbols/custom-symbols/assign-negative-side-margins-to-your` **Do:** Give a custom symbol negative side margins when a badge or extra element widens it, so symbols align horizontally by sight. **Why:** Wider symbols otherwise throw off optical alignment, for instance in a stack of folders. · P craft · L attention · S express, compose · M t/t/-/-
- `sf-symbols/custom-symbols/optimize-layers-to-use-animations-with` **Do:** To animate a custom symbol by layer, annotate its layers in the SF Symbols app, setting z-order, direction, and layer groups for related parts. · P craft · L interaction · S express, interact · M -/-/-/-
- `sf-symbols/custom-symbols/test-animations-for-custom-symbols` **Do:** Try custom symbols with every animation preset and draw them with whole shapes rather than cutouts. **Why:** Shapes and paths can look different than expected once layers move. · P craft · L interaction, attention · S express, interact · M -/-/-/-
- `sf-symbols/custom-symbols/avoid-making-custom-symbols-that-include` **Do:** Don't draw enclosures or badges into custom symbols; produce those variants with the SF Symbols component library. **Why:** The library keeps variants consistent with the included symbols. · P craft, familiarity · L attention · S express · M t/t/-/-
- `sf-symbols/custom-symbols/provide-alternative-text-labels-for-custom` **Do:** Give custom symbols alternative text labels (accessibility descriptions) for VoiceOver. **Why:** They let VoiceOver describe visible UI, easing navigation for people with visual disabilities. · P flexibility · L inclusion · S include · M d/d/-/t
- `sf-symbols/custom-symbols/dont-design-replicas-of-apple-products` **Do:** Don't create symbols that copy Apple products, and don't modify symbols that SF Symbols marks as representing an Apple feature or product. **Why:** Apple products are copyrighted and can't be reproduced. · P responsibility · L trust · S express · M d/d/d/d

## Spatial layout (`spatial-layout`)

<https://developer.apple.com/design/human-interface-guidelines/spatial-layout>

### Field of view

- `spatial-layout/field-of-view/center-important-content-within-the-field` **Do:** On visionOS, keep key content in the middle of view; in immersive scenes, keep distracting motion and bright, high-contrast objects out of the periphery. **Why:** Centering helps people keep their attention on what matters. · P purpose, flexibility · L attention, platform · S compose · M -/-/t/t
- `spatial-layout/field-of-view/avoid-anchoring-content-to-the-wearers` **Do:** On visionOS, anchor content in the person's space rather than fixing it in front of their head, so they are free to move. **Why:** Head-locked content makes people feel stuck, confined, and uncomfortable, especially when it hides much passthrough. · P agency, flexibility · L platform, interaction · S compose · M -/-/-/-
### Depth

- `spatial-layout/depth/provide-visual-cues-that-accurately-communicate` **Do:** On visionOS, include visual cues that portray depth correctly and agree with real-world experience. **Why:** Missing or conflicting cues can cause visual discomfort. · P craft, flexibility · L platform, attention · S express · M -/-/-/-
- `spatial-layout/depth/use-depth-to-communicate-hierarchy` **Do:** Use depth to make important objects stand out, such as pushing a window back so a sheet in front becomes prominent. **Why:** Depth makes objects noticeable, and people pay attention to changes in depth. · P simplicity, purpose · L attention, platform · S compose, express · M t/t/t/t
- `spatial-layout/depth/in-general-avoid-adding-depth-to` **Do:** Generally keep text flat on its background rather than giving it depth. **Why:** Floating text is hard to read, slows people, and may cause visual discomfort. · P simplicity, flexibility · L attention, inclusion · S express · M t/t/t/t
- `spatial-layout/depth/make-sure-depth-adds-value` **Do:** Use depth only where it clarifies or delights, mainly to separate large important elements like tab bars or toolbars; small objects may not benefit. **Why:** Depth isn't needed everywhere and works best at larger sizes and for relative importance. · P purpose, simplicity · L value, attention · S express, compose · M t/t/t/t
### Scale

- `spatial-layout/scale/consider-using-fixed-scale-when-you` **Do:** On visionOS, apply fixed scale rarely, only to noninteractive objects that must look true to physical size, such as a life-size product. **Why:** Interactive content has to scale with distance to remain usable, so fixed scale suits only realism-driven cases. · P purpose, flexibility · L attention, platform · S compose · M -/-/-/-
### Best practices

- `spatial-layout/best-practices/avoid-displaying-too-many-windows` **Do:** Limit how many windows an app shows at once. **Why:** Excess windows hide the surroundings, overwhelm and confine people, and make relocating the app burdensome. · P simplicity, flexibility · L attention, platform · S compose · M t/t/-/-
- `spatial-layout/best-practices/prioritize-standard-indirect-gestures` **Do:** On visionOS, favor standard indirect gestures that work without reaching a hand into view, over direct touch of virtual objects. **Why:** Direct gestures need touching objects, which tires people, especially for objects at or above eye level. · P familiarity, flexibility · L interaction, platform · S interact · M -/-/-/-
- `spatial-layout/best-practices/rely-on-the-digital-crown-to` **Do:** On visionOS, let people press the Digital Crown to recenter content; the app needs no extra work for it. **Why:** After head movement, content may no longer be where people want it. · P agency, familiarity · L interaction, platform · S interact · M -/-/-/-
- `spatial-layout/best-practices/include-enough-space-around-interactive-components` **Do:** On visionOS, leave ample room around interactive components so looking at them is comfortable and the hover effect doesn't crowd neighbors. **Why:** The hover effect confirms the target, so crowded elements make gaze selection harder. · P craft, flexibility · L interaction, platform · S compose · M t/t/-/-
- `spatial-layout/best-practices/let-people-use-your-app-with` **Do:** Let people use the app while staying nearly or fully still, unless physical movement is essential to the experience. **Why:** Everyone can then enjoy it regardless of ability to move. · P flexibility, agency · L inclusion, platform · S interact, include · M t/t/-/-
- `spatial-layout/best-practices/use-the-floor-to-help-you` **Do:** On visionOS, place large immersive content that rises from the floor on a flat horizontal plane aligned with the floor. **Why:** Alignment blends content with the real surroundings and feels more intuitive. · P craft, familiarity · L platform · S compose · M -/-/-/-

## Typography (`typography`)

<https://developer.apple.com/design/human-interface-guidelines/typography>

### Ensuring legibility

- `typography/ensuring-legibility/use-font-sizes-that-most-people` **Do:** Set text at sizes most people can read comfortably, staying at or above each platform's default and minimum sizes, custom fonts included. **Why:** People read at different distances and in varied conditions; undersized text fails many of them. · P flexibility · L attention, inclusion · S express · M d/d/t/t
- `typography/ensuring-legibility/test-legibility-in-different-contexts` **Do:** Check text legibility in each environment it runs, for instance per game platform; if hard to read, enlarge it, raise contrast, or use fonts built for legibility like the system fonts. **Why:** Reading conditions differ across platforms, so only testing reveals problems. · P craft, flexibility · L attention, inclusion · S express · M d/d/d/d
- `typography/ensuring-legibility/in-general-avoid-light-font-weights` **Do:** With system fonts, choose Regular, Medium, Semibold, or Bold, and avoid Ultralight, Thin, and Light. **Why:** Lighter weights are hard to see, particularly at small sizes. · P flexibility, craft · L attention, inclusion · S express · M d/d/d/d
### Conveying hierarchy

- `typography/conveying-hierarchy/adjust-font-weight-size-and-color` **Do:** Vary weight, size, and color to stress key information and show hierarchy, keeping relative distinctions intact when people change text size. **Why:** Visible differences between text elements help people see what matters most. · P simplicity · L attention · S express · M d/d/d/d
- `typography/conveying-hierarchy/minimize-the-number-of-typefaces-you` **Do:** Use as few typefaces as possible, even in a heavily customized interface. **Why:** Too many typefaces blur the hierarchy, hurt readability, and make the interface look inconsistent or poorly designed. · P simplicity, familiarity · L attention · S express · M d/d/d/d
- `typography/conveying-hierarchy/prioritize-important-content-when-responding-to` **Do:** When text size grows, enlarge the content people care about, not every word; for example, leave tab titles at their size. **Why:** A larger setting usually means people want key content easier to read, not everything bigger. · P flexibility, simplicity · L attention, inclusion · S express, adapt · M d/d/-/-
### Using system fonts

- `typography/using-system-fonts/san-francisco-sf` **Term: San Francisco (SF).** Use San Francisco, the system sans serif family with variants for several scripts, monospace, and rounded styles.
- `typography/using-system-fonts/new-york-ny` **Term: New York (NY).** Use New York, the system serif family, alone or alongside the SF fonts; both come as variable fonts.
- `typography/using-system-fonts/consider-using-the-built-in-text` **Do:** Prefer the system text styles with system fonts to express hierarchy through size and weight. **Why:** They give a convenient, consistent hierarchy and automatically support Dynamic Type and larger accessibility sizes. · P familiarity, flexibility · L attention, inclusion · S express · M t/t/t/-
- `typography/using-system-fonts/modify-the-built-in-text-styles` **Do:** Tweak built-in text styles with symbolic traits when needed, such as bold for another hierarchy level or adjusted leading to improve readability or save space. **Why:** Traits allow limited changes without leaving the system styles. · P craft, flexibility · L attention · S express · M t/t/t/-
- `typography/using-system-fonts/if-necessary-adjust-tracking-in-interface` **Do:** In design mockups using variable system fonts, adjust tracking if needed; no specific optical size is required per point size. **Why:** A running app has the system font adjust tracking at every size, so mockups must approximate that. · P craft · L attention · S express · M -/-/-/-
### Using custom fonts

- `typography/using-custom-fonts/make-sure-custom-fonts-are-legible` **Do:** Make custom fonts easy to read, following the recommended minimum sizes for styles and weights. **Why:** People read at different distances and in varied conditions. · P flexibility, craft · L attention, inclusion · S express · M d/d/d/d
- `typography/using-custom-fonts/implement-accessibility-features-for-custom-fonts` **Do:** Make custom fonts honor Dynamic Type and settings like Bold Text just as system fonts do; in Unity games, use Apple's Unity plug-ins. **Why:** System fonts respond automatically to accessibility settings, so custom fonts must match to serve those users. · P flexibility · L inclusion, interaction · S include · M d/d/-/-
### Supporting Dynamic Type

- `typography/supporting-dynamic-type/make-sure-your-apps-layout-adapts` **Do:** Confirm the design scales and stays legible at every font size, testing on iPhone or iPad with the larger accessibility sizes turned on. **Why:** People choose different text sizes and must still read comfortably. · P flexibility · L inclusion, attention · S adapt, include · M d/d/t/-
- `typography/supporting-dynamic-type/increase-the-size-of-meaningful-interface` **Do:** Enlarge meaningful interface icons as text grows; SF Symbols scale automatically with Dynamic Type. **Why:** Icons carrying important information must stay easy to see at larger sizes. · P flexibility · L inclusion, attention · S include, express · M d/d/-/-
- `typography/supporting-dynamic-type/keep-text-truncation-to-a-minimum` **Do:** Show as much useful text at the largest accessibility size as at the largest standard size, avoiding truncation in scroll areas unless a separate view reveals the rest. **Why:** Cut-off text can hide content from people who need larger type. · P flexibility, simplicity · L inclusion, content · S adapt, compose · M d/d/-/-
- `typography/supporting-dynamic-type/consider-adjusting-your-layout-at-large` **Do:** At large font sizes, consider stacked layouts with text above secondary items and fewer columns to avoid crowding. **Why:** Inline items and container edges crowd enlarged text in narrow spaces, causing truncation or overlap, and multicolumn text becomes hard to read. · P flexibility · L inclusion, attention · S adapt, compose · M d/d/-/-
- `typography/supporting-dynamic-type/maintain-a-consistent-information-hierarchy-regardless` **Do:** Keep the same information order at every font size, for example primary elements staying near the top even at very large sizes. **Why:** People shouldn't lose track of the main elements. · P simplicity, flexibility · L attention, inclusion · S adapt, compose · M d/d/-/-
### Platform considerations > macOS

- `typography/platform-considerations/macos/when-necessary-use-dynamic-system-font` [macOS] **Do:** On macOS, use dynamic system font variants when text should look like that in standard controls. **Why:** They give text the look of system controls, matching other apps on the platform. · P familiarity, craft · L platform · S express · M -/t/-/-
### Platform considerations > visionOS

- `typography/platform-considerations/visionos/in-general-prefer-2d-text` [visionOS] **Do:** On visionOS, keep text flat or nearly so for content people must read; a bit of 3D text is fine as an eye-catching accent. **Why:** More visual depth on characters makes them harder to read. · P flexibility, simplicity · L attention, platform · S express · M -/-/t/t
- `typography/platform-considerations/visionos/make-sure-text-looks-good-and` [visionOS] **Do:** On visionOS, pick a text style that looks right at full size, then check readability at other scales. · P craft, flexibility · L attention, platform · S express · M -/t/t/-
- `typography/platform-considerations/visionos/maximize-the-contrast-between-text-and` [visionOS] **Do:** On visionOS, keep text strongly contrasting with its container; white is the default, and other colors need testing in varied contexts. **Why:** White gives strong contrast against the default system material, which makes reading easier. · P flexibility, craft · L attention, platform · S express · M -/t/t/t
- `typography/platform-considerations/visionos/if-you-need-to-display-text` [visionOS] **Do:** On visionOS, make text bold when it has no background, and skip shadows for contrast. **Why:** The space may lack a surface for an accurate shadow, and the right shadow size and density can't be predicted for each Environment. · P flexibility, craft · L attention, platform · S express · M -/-/-/-
- `typography/platform-considerations/visionos/keep-text-facing-people-as-much` [visionOS] **Do:** On visionOS, billboard text tied to a point in space, such as a 3D object's label, so it always faces the wearer. **Why:** Text seen from the side or an oblique angle can become unreadable. · P flexibility, craft · L attention, platform · S compose, interact · M -/-/-/-

## Writing (`writing`)

<https://developer.apple.com/design/human-interface-guidelines/writing>

### Getting started

- `writing/getting-started/determine-your-apps-voice` **Do:** Decide on a voice by considering your audience, familiar vocabulary, and the feeling you want to evoke, and keep a list of common terms to use consistently. **Why:** Word choice shapes how people feel, such as trust for banking versus excitement for games. · P delight, purpose · L content · S define, write · M d/d/d/d
- `writing/getting-started/match-your-tone-to-the-context` **Do:** Within your established voice, adjust tone to what people are doing, in the world and in the app, such as celebrating a goal versus hitting a payment error. **Why:** The situation affects both what to say and how to present it. · P delight, flexibility · L content · S write · M d/d/d/d
- `writing/getting-started/be-clear` **Do:** Pick plain words that say exactly what you mean, and remove any word that isn't pulling its weight. **Why:** Wording that is easy to understand carries the intended meaning without effort. · P simplicity · L content · S write · M d/d/d/d
- `writing/getting-started/write-for-everyone` **Do:** Favor plain, simple wording; keep accessibility and localization in mind; avoid jargon and gender-specific terms. **Why:** The app is useful to the most people only when it speaks to as many of them as possible. · P flexibility, simplicity · L inclusion, content · S write, include · M d/d/d/d
### Best practices

- `writing/best-practices/consider-each-screens-purpose` **Do:** Order a screen's text with the most important information first, format it for easy reading, and split multiple ideas across screens while planning the flow between them. · P purpose, simplicity · L content, attention · S write, compose · M d/d/d/d
- `writing/best-practices/be-action-oriented` **Do:** Use active voice and verb-led labels on buttons and links, preferring clarity to cleverness; Send beats a playful phrase. **Why:** Clear action labels help people move from one step or screen to the next. · P simplicity, familiarity · L content, flow · S write · M d/d/t/t
- `writing/best-practices/build-language-patterns` **Do:** Establish recurring language patterns and reuse them throughout the app. **Why:** Consistency creates familiarity, makes the app feel cohesive and intuitive, and eases writing. · P familiarity, craft · L content · S write · M d/d/d/d
- `writing/best-practices/adopt-capitalization-rules-that-align-with` **Do:** Choose title or sentence case per UI element type to fit your app's voice, and apply it consistently; title case reads more formal, sentence case more casual. **Why:** Capitalization style reflects the app's voice, and consistency keeps it coherent. · P familiarity, delight · L content · S write · M d/d/d/d
- `writing/best-practices/give-clear-guidance-and-use-consistent` **Do:** In multi-step flows, start with an entry label like Get Started, use one consistent term such as Continue or Next between steps, and make completion clear. **Why:** Consistent action wording helps people follow where they are in the sequence. · P familiarity, simplicity · L flow, content · S write, structure · M d/d/t/t
- `writing/best-practices/use-possessive-pronouns-sparingly` **Do:** Skip my and your when context is already clear (Favorites over Your Favorites); when used, keep them consistent and avoid we altogether. **Why:** Possessives are often needless and less succinct, and we may leave unclear who is speaking. · P simplicity, familiarity · L content · S write · M d/d/d/d
- `writing/best-practices/write-for-how-people-use-each` **Do:** Keep language consistent across devices but adapt wording to each one, and describe gestures correctly, such as tap on touch devices, never click. **Why:** People use the app on different devices in different ways, so wording must fit the interaction. · P flexibility, familiarity · L content, platform · S write, adapt · M d/d/t/t
- `writing/best-practices/provide-clear-next-steps-on-any` **Do:** On empty screens, welcome people, teach them about the app in useful and fitting content, and point to what they can do next. **Why:** An empty screen can feel daunting when it isn't obvious how to proceed. · P agency, delight · L content, flow · S write, structure · M d/d/t/-
- `writing/best-practices/write-clear-error-messages` **Do:** Prevent errors first; when a message is needed, place it near the problem, don't blame, and say how to fix it, avoiding interjections like oops. **Why:** Errors are frustrating, so specific guidance with a respectful tone helps people recover. · P simplicity, agency · L content, flow · S write, interact · M d/d/-/-
- `writing/best-practices/choose-the-right-delivery-method` **Do:** Select how to deliver each message by its urgency, importance, viewing context, need for immediate action, and how much supporting detail is required. **Why:** Matching the channel to the message respects people's attention. · P responsibility, simplicity · L trust, content · S write, structure · M d/d/-/-
- `writing/best-practices/keep-settings-labels-clear-and-simple` **Do:** Name settings practically so they're easy to find; add an explanation if needed, describing what happens when on, since the off behavior can be inferred. **Why:** Practical labels help people find the setting they need. · P simplicity · L content · S write · M d/d/-/-
- `writing/best-practices/show-hints-in-text-fields` **Do:** Label every text field clearly, add hint or placeholder text showing the expected format (an example or description), and show errors beside the field with instructions. **Why:** Hints tell people how to format input, and nearby errors help them correct it. · P simplicity, agency · L content, interaction · S write, interact · M d/d/-/-
