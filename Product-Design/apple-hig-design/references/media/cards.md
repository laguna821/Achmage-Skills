# Medium: Card news

**Baseline:** iOS, because card news is a static square or portrait image carousel read on a phone in a social feed. The HIG has no page for this medium. Most guidance here is [HIG transfer]: the iOS type scale and contrast floors carry over directly, and the glanceable-surface guidance (adopted, see below) supplies the "read it in one look" discipline. Everything about canvas, ratio and platform is open (see "Ask the user first").

## Applies as written [HIG]
Foundations that do not depend on a device or an interactive screen.

- **Contrast.** Keep text and icons at 4.5:1 or better in every appearance, and aim for 7:1 with custom colors, especially small text. Minimums by size are in [tokens.md](../tokens.md#minimum-contrast). `dark-mode/dark-mode-colors/aim-for-sufficient-color-contrast-in`, `accessibility/vision/strive-to-meet-color-contrast-minimum`
- **Color is never the only signal.** Add a label, shape or icon wherever color carries meaning. `color/inclusive-color/avoid-relying-solely-on-color-to`, `accessibility/vision/convey-information-with-more-than-color`, `charts/color/avoid-relying-solely-on-color-to`
- **Avoid hard-to-see color pairs**, such as low contrast or combinations color-blind people cannot tell apart. `color/inclusive-color/avoid-using-colors-that-make-it`
- **Check how colors read in other countries and cultures** if the audience crosses borders. `color/inclusive-color/consider-how-the-colors-you-use`
- **One color, one meaning.** Do not give plain text the color used for status or interactive cues. `color/best-practices/avoid-using-the-same-color-to`
- **Weights.** Choose Regular, Medium, Semibold or Bold; avoid Ultralight, Thin and Light. `typography/ensuring-legibility/in-general-avoid-light-font-weights`
- **Hierarchy through weight, size and color**, with as few typefaces as possible. `typography/conveying-hierarchy/adjust-font-weight-size-and-color`, `typography/conveying-hierarchy/minimize-the-number-of-typefaces-you`
- **Text over a picture** must contrast clearly with it. Use a shadow or a background layer when needed. `image-views/content/take-care-when-overlaying-text-on`
- **Images carry a color profile**, and sRGB renders accurately on most displays. `images/best-practices/include-a-color-profile-with-each`, `color/color-management/apply-color-profiles-to-your-images`
- **Test on real devices**, not only in the design tool. `images/best-practices/always-test-images-on-a-range`
- **Brand defers to content.** Keep brand subtle, use the accent color sparingly, and repeat a logo only where it supplies needed context. `branding/best-practices/ensure-branding-always-defers-to-content`, `branding/best-practices/apply-your-apps-accent-color-judiciously`, `branding/best-practices/resist-the-temptation-to-display-your`
- **Voice and tone.** Write in one brand voice, and adjust tone to the situation. `branding/best-practices/use-your-brands-unique-voice-and`, `writing/getting-started/match-your-tone-to-the-context`
- **Plain, inclusive wording.** Plain words, no jargon unless defined, no slang or idioms, think hard before humor, and say "you" rather than "the user". `writing/getting-started/be-clear`, `writing/getting-started/write-for-everyone`, `inclusion/welcoming-language/avoid-using-specialized-or-technical-terms`, `inclusion/welcoming-language/replace-colloquial-expressions-with-plain-language`, `inclusion/welcoming-language/consider-carefully-before-including-humor`, `inclusion/welcoming-language/pay-attention-to-how-you-refer`
- **Most important text first**, one idea per screen. `writing/best-practices/consider-each-screens-purpose`
- **Consistent capitalization and recurring language patterns.** `writing/best-practices/adopt-capitalization-rules-that-align-with`, `writing/best-practices/build-language-patterns`
- **People in images.** Show a range of people, including people with disabilities, and use people-first wording. `inclusion/accessibility/avoid-images-and-language-that-exclude`, `inclusion/accessibility/take-a-people-first-approach-when`
- **Right-to-left audiences.** Align paragraphs of three or more lines by their own language, and never reverse the digits of a number. `right-to-left/text-alignment/align-a-paragraph-based-on-its`, `right-to-left/numbers-and-characters/dont-reverse-the-order-of-numerals`
- **Charts.** If a card holds a chart, lead with the takeaway, use a common chart type, label it, and keep similar charts consistent. `charts/descriptive-content/summarize-the-main-message-of-your`, `charting-data/designing-effective-charts/in-general-prefer-using-common-chart`, `charting-data/designing-effective-charts/aid-comprehension-by-adding-descriptive-text`, `charting-data/designing-effective-charts/maintain-continuity-among-multiple-charts-that`, `charts/color/aid-comprehension-by-adding-visual-separation`. See [Charts](../components/charts.md).
- **Dark and light.** Check the design in both appearances. Slightly darken white-background photos in dark mode, and make separate icon versions if one does not contrast in both. `dark-mode/dark-mode-colors/soften-the-color-of-white-backgrounds`, `dark-mode/dark-mode-colors/icons-and-images/design-separate-interface-icons-for-the`
- **Icons.** Simple, recognizable, uniform in size, detail and stroke, with the weight of nearby text. Put text inside an icon only when essential. `icons/best-practices/create-a-recognizable-highly-simplified-design`, `icons/best-practices/maintain-visual-consistency-across-all-interface`, `icons/best-practices/in-general-match-the-weights-of`, `icons/best-practices/include-text-in-your-design-only`
- **No Apple trademarks** in names or images. `branding/best-practices/follow-apples-trademark-guidelines`

## Translate [HIG transfer]
| HIG element | Equivalent here | How | Rules |
| --- | --- | --- | --- |
| [Page controls](../components/page-controls.md) | Swipe indicator on the carousel | Use it only for an ordered sequence. Center it near the bottom. Keep few dots: the HIG moves past about ten peer pages to another layout. Do not color the indicator. | `page-controls/best-practices/use-page-controls-to-represent-movement`, `page-controls/best-practices/center-a-page-control-at-the`, `page-controls/best-practices/although-page-controls-can-handle-any`, `page-controls/customizing-indicators/avoid-coloring-indicator-images` |
| [Scroll views](../components/scroll-views.md) paging | Swipe between cards | Show that more follows, for example by letting the next card peek in at the edge. Show count and position. | `scroll-views/best-practices/make-it-apparent-when-content-is`, `scroll-views/platform-considerations/ios-ipados/consider-showing-a-page-control-when` |
| tvOS grid peek | Peeking card | If content peeks from both edges, show equal width on both sides. | `layout/platform-considerations/tvos/grids/make-partially-hidden-content-look-symmetrical` |
| Dynamic Type | Text size floor on a fixed image | The image cannot scale with a reader's setting, so start from the iOS defaults and minimums in [tokens.md](../tokens.md#text-size-floors), converted to canvas pixels (see "House style here"), and stay above them. Go larger when the font is thin. | `typography/ensuring-legibility/use-font-sizes-that-most-people`, `accessibility/vision/use-recommended-defaults-for-custom-type`, `accessibility/vision/bear-in-mind-that-font-weight` |
| Hierarchy and grouping | Layout inside one card | Key item at the top and leading edge, align for scanning, group related items with space or containers. | `layout/visual-hierarchy/order-content-by-relative-importance`, `layout/visual-hierarchy/align-elements-to-make-them-easier`, `layout/visual-hierarchy/group-related-items-to-clearly-express` |
| Progressive disclosure | Spread across cards | Show less on the first card and reveal more as people swipe. | `layout/visual-hierarchy/use-progressive-disclosure-to-make-layouts` |
| Onboarding | Opening cards | If an intro must come first, keep it short and about your own subject, with little to memorize. | `onboarding/best-practices/if-you-need-to-present-a`, `onboarding/best-practices/keep-onboarding-content-focused-on-the` |
| Multi-step flow labels | Sequence cues | Start with a clear entry cue, then one consistent term between steps. | `writing/best-practices/give-clear-guidance-and-use-consistent` |
| Button wording | Call to action text | Verb-led, clear over clever. The image itself cannot be tapped, so the action lives in the post or link. | `writing/best-practices/be-action-oriented`, `buttons/content/consider-using-text-when-a-short` |
| Prominent button | One main action | Make one action stand out and keep the rest equal. | `buttons/style/in-general-use-a-button-that`, `buttons/style/use-style-not-size-to-visually` |
| Boxes | Panel on a card | Keep a panel small relative to the card, separate subgroups with padding and alignment instead of nested panels, and give it a short sentence-case title. | `boxes/best-practices/prefer-keeping-a-box-relatively-small`, `boxes/best-practices/consider-using-padding-and-alignment-to`, `boxes/content/provide-a-succinct-introductory-title-if`, `boxes/content/if-you-need-a-title-write` |
| Lists | Short item rows | Keep item text brief and keep clipped text recognizable. | `lists-and-tables/content/keep-item-text-succinct-so-row`, `lists-and-tables/content/consider-ways-to-preserve-readability-of` |
| Gauges | Progress or amount graphic | Short labels for the value and both ends of the range. | `gauges/best-practices/write-succinct-labels-that-describe-the` |
| Lockups | Repeated items | Keep lockups in a row the same size. | `lockups/best-practices/use-consistent-lockup-sizes-within-a` |
| Design principles | Planning the series | Ask what the series is for, keep to a few key ideas, and treat the whole series as one experience. | `design-principles/purpose/create-value`, `design-principles/purpose/keep-focused`, `design-principles/simplicity/include-just-whats-necessary`, `design-principles/delight/consider-the-whole` |
| Consistency | Series template | Once an element has a look, reuse it on every card. | `design-principles/familiarity/keep-visuals-and-interactions-consistent`, `design-principles/simplicity/establish-hierarchy` |
| Delight | Emotion of the series | Decide the feeling first. Do not let decoration cost the message. | `design-principles/delight/identify-the-emotion-you-want-to`, `design-principles/delight/dont-mistake-delight-for-decoration` |
| Motion | Animated cards or video | Add motion only with a purpose, use fast or blinking motion sparingly, and give controls for audio and video. | `motion/best-practices/add-motion-purposefully-supporting-the-experience`, `accessibility/cognitive/be-cautious-with-fast-moving-and`, `accessibility/cognitive/let-people-control-audio-and-video` |
| Captions | Text for audio | Do not carry crucial information in audio only. | `accessibility/hearing/support-text-based-ways-to-enjoy` |
| Tips | "How to read this" card | One or two direct sentences about what something does and how to use it, without promotion. | `offering-help/creating-tips/make-tips-short-actionable-and-engaging` |

### Alt text for social posts [HIG transfer]
The HIG's accessibility pages (see [VoiceOver](../components/voiceover.md)) govern how screen readers describe an app's images. A card post is made of images, so the same rules carry over to the alt text attached to each card.

- Write alt text for every card that carries meaning. `voiceover/descriptions/describe-meaningful-images`
- Describe what the image itself shows. Do not repeat a caption or the post text. `voiceover/descriptions/describe-meaningful-images`
- Hide purely decorative images from screen readers (leave their alt text empty). `voiceover/descriptions/exclude-purely-decorative-images-from-voiceover`
- Chart and infographic cards get a short description of what they convey. `voiceover/descriptions/make-charts-and-other-infographics-fully`
- Text sits inside the image, so put the card's essential text into the alt text or caption; nobody should depend on pixels alone. `accessibility/vision/describe-your-apps-interface-and-content`
- Custom icons need a hidden text description. `icons/best-practices/provide-alternative-text-labels-for-custom`
- Keep the order of cards clear when relationships are only visual. `voiceover/navigation/specify-how-elements-are-grouped-ordered`
- Whether a platform has an alt text field, and its length limit, is not an HIG question (see "Ask the user first").

## Does not apply
- Tap targets, control spacing, hit sizes, keyboard, Switch Control and Voice Control rules: a static image has no controls.
- Alerts, menus, toolbars, sidebars, popovers and panels: no interactive surface.
- Text that resizes with the reader's text size setting: pixels are fixed in the image. Use the size floors instead.
- Live data, refresh schedules and system rendering modes (tinted, vibrant, accented): the platform, not the card, controls these.
- Platform-specific sections for CarPlay, visionOS, tvOS, watchOS and games.
- Switching between light and dark: the card cannot follow the reader's setting. Decide on a fixed look that holds in both (see "Ask the user first").

## Adopted: glanceable surfaces as the reference
**Adopted as a house decision (2026-11-04) [House] [HIG transfer].** Apply it by default.

**The case.** The HIG has no page for feed images, but a card is read like a glanceable surface: a person scrolling a feed gives it a moment, at phone size, among competing content. Widgets, notifications and complications hold the HIG's densest guidance for that situation. If the user agrees, use these pages as the reference for density, text size and content choice, instead of the full-screen app screens that otherwise fill the baseline. See [Widgets](../components/widgets.md), [Notifications](../components/notifications.md) and [Complications](../components/complications.md). [Live Activities](../components/live-activities.md) are a close cousin on text.

**Guidance to borrow**

| Topic | Borrowed rule | Rules |
| --- | --- | --- |
| Density | Essential facts at a glance, detail for a longer look. If crowded, use more room or swap text for a graphic. | `widgets/best-practices/balance-information-density` |
| Focus | Show only information tied to the card's main purpose. | `widgets/best-practices/display-only-the-information-thats-directly`, `live-activities/best-practices/focus-on-important-information-that-people` |
| More room, more layers | A larger area adds layers of information, not stretched small content. | `widgets/best-practices/offer-widgets-in-multiple-sizes-when` |
| Few words | Valuable information in as few words as possible, in short complete sentences in sentence case. | `notifications/best-practices/provide-concise-informative-notifications`, `notifications/content/write-succinct-easy-to-read-notification` |
| Short title | A brief title only when it adds context. | `notifications/content/create-a-short-title-if-it` |
| No homework | Notifications do not tell people to do tasks in the app. For a card: do not turn the image into a to-do list for the link. | `notifications/best-practices/avoid-sending-a-notification-that-tells` |
| Text size | Large text in medium weight or heavier, small text rarely, nothing below about 11 points. | `live-activities/best-practices/ensure-text-is-easy-to-read`, `widgets/best-practices/displaying-text-in-widgets/avoid-very-small-font-sizes` |
| Line weight | Lines at least two points wide, because thin lines fail at a glance. | `complications/visual-design/when-creating-complication-content-generally-use` |
| Custom type | Use a custom font sparingly and keep it readable at a glance, for example only for large text. | `widgets/best-practices/displaying-text-in-widgets/prefer-using-the-system-font-text` |
| Color | Color attracts without pulling attention from the information, and never carries meaning alone. | `widgets/best-practices/using-color/use-color-to-enhance-a-widgets`, `widgets/best-practices/using-color/convey-meaning-without-relying-on-specific` |
| Meaningful background | A colored background should convey meaning, as with red or green for a falling or rising value. | `widgets/platform-considerations/watchos/provide-a-colorful-background-that-conveys` |
| Photos | Use full-color images judiciously. | `widgets/best-practices/using-color/use-full-color-images-judiciously` |
| Brand | Brand color, type and glyphs for recognition without overpowering the content. A bare logo mark beats a full app icon in a container. | `widgets/best-practices/use-brand-elements-thoughtfully`, `live-activities/best-practices/if-you-include-a-logo-mark` |
| Margins | Consistent margins so edges are not crowded, with nested corner radii matched. | `widgets/best-practices/choosing-margins-and-padding/in-general-use-standard-margins-to`, `live-activities/best-practices/creating-live-activity-layouts/use-consistent-margins-and-concentric-placement` |
| Set-apart blocks | An inset rounded container or a heavy divider, never content running all the way out. | `live-activities/best-practices/creating-live-activity-layouts/when-separating-a-block-of-content` |
| Rings and gauges | Closed for a share of a whole; open or segmented for a range with arbitrary limits. | `complications/visual-design/choose-a-ring-or-gauge-style` |
| Freshness | Prefer information that changes, and show how current it is. A card is static, so use this only to date the content. | `widgets/best-practices/prefer-dynamic-information-that-changes-throughout`, `widgets/best-practices/updating-widget-content/keep-your-widget-up-to-date` |
| Meaningful moments | A special treatment for a meaningful day. | `widgets/best-practices/look-for-opportunities-to-surprise-and` |
| Survives desaturation | Check that the card still reads when desaturated and tinted with one color. | `complications/visual-design/make-sure-images-look-good-in`, `widgets/platform-considerations/ios-ipados/standby-and-carplay/limit-usage-of-rich-images-or` |

**Why it fits.** A card gets one look, is mostly short text over a graphic, and is followed by the next item. Those are the conditions these pages address.

**Where it does not fit.** This reference works by analogy only. Glanceable surfaces are system-owned, refresh on a schedule and sit on a device whose size is known. A card is a flat image inside someone else's platform. The "about 11 points" floor describes text on a device; on an image that the feed scales, the same number is a different physical size. Do not copy widget sizes or margin values as card dimensions.

**How to apply.** Apply the table above on top of "Applies as written".

## Ask the user first [HIG none]
The HIG gives no basis for any of these. Ask; do not guess, and do not fill them with outside advice.

- **Canvas size and pixel dimensions.** The HIG states no size for a social image.
- **Aspect ratio** (square, portrait or other), and whether a cropped preview of the first card matters.
- **Target platform and its specifications**: file format, file size, areas the platform covers with its own interface, caption and alt text length limits.
- **Number of cards.** The HIG cautions against many page dots (`page-controls/best-practices/although-page-controls-can-handle-any`) but gives no count for a series.
- **Cover card and ending card**: whether needed, and what they carry.
- **Where text may sit** relative to the platform's own overlays.
- **Language and script**, including whether cards must work in right-to-left.
- **Brand assets**: logo, accent color, and any font other than Pretendard.
- **Light or dark look**, since the card cannot follow the reader's setting.
- **Swipe sequence or independent images.**
- **Call to action and link destination.**
- **Motion**: static only, or animated.
- **Data and sources** for any chart or statistic.

## House style here [House]
- **Font:** Pretendard Variable instead of Apple fonts. Weights map as Regular 400, Medium 500, Semibold 600, Bold 700. Avoid anything lighter than Regular. See [tokens.md](../tokens.md). `typography/ensuring-legibility/in-general-avoid-light-font-weights`
- **Sizes [HIG transfer]:** a card is seen at the full width of a phone, so convert the iOS "Large (default)" scale from points to canvas pixels: canvas px = pt x (canvas width / 375). 375 pt is the narrowest iPhone width in the screen-size table on the HIG Widgets page, so text appears at least at its iOS size on every listed iPhone. For a 1080 px wide canvas the factor is 2.88 (round up):

  | Style | iOS pt (size/leading) | 1080 px canvas (px) |
  | --- | --- | --- |
  | Large Title | 34/41 | 98/119 |
  | Title 1 | 28/34 | 81/98 |
  | Title 2 | 22/28 | 64/81 |
  | Title 3 | 20/25 | 58/72 |
  | Headline, Body | 17/22 | 49/64 |
  | Callout | 16/21 | 47/61 |
  | Subhead | 15/20 | 44/58 |
  | Footnote | 13/18 | 38/52 |
  | Caption 1 | 12/16 | 35/47 |
  | Caption 2 (the floor) | 11/13 | 32/38 |

  Keep body text at or above Body, and never set the main message at the floor. Never use the point values as pixels on a large canvas: 17 px on a 1080 px card shows at about 6 pt on a phone. `typography/ensuring-legibility/use-font-sizes-that-most-people`
- If the whole scale must grow beyond this conversion, ask the user (see above), and keep the relative steps between styles. `typography/conveying-hierarchy/adjust-font-weight-size-and-color`
- **Check:** run `scripts/audit-page.js` with `pxPerPt: 2.88` and `canvas: [1080, 1350]` so sizes and the contrast table read in phone points.
- **Contrast:** 4.5:1 up to 17 pt, 3:1 at 18 pt and larger or bold, from [tokens.md](../tokens.md#minimum-contrast); aim for 7:1 on small text. `dark-mode/dark-mode-colors/aim-for-sufficient-color-contrast-in`
- **Colors:** system colors in sRGB hex from [tokens.md](../tokens.md#system-colors-srgb-hex). Use the increased-contrast values when a card sits on a busy photo.
- **Icons:** Lucide per [icons.md](../icons.md), stroke matched to the text beside it (Pretendard 400 = 1.75, 500 = 2, 600 = 2.25, 700 = 2.5). One set per series, no emoji in place of icons. `icons/best-practices/in-general-match-the-weights-of`, `icons/best-practices/maintain-visual-consistency-across-all-interface`
- **Swipe indicator:** if drawn on the image, use simple dots only, with no text, inner lines or custom color. `page-controls/customizing-indicators/make-sure-custom-indicator-images-are`, `page-controls/customizing-indicators/avoid-coloring-indicator-images`
- **Liquid Glass look [House] [HIG transfer]:** only for elements that float over imagery (page indicators, small labels or button shapes on a photo), never as the panel behind body text; use the clear variant only over visually rich images with a dark dimming layer when the image is bright, and follow [house style](../house-style.md#liquid-glass) `materials/liquid-glass/dont-use-liquid-glass-in-the` `materials/liquid-glass/use-liquid-glass-effects-sparingly` `materials/liquid-glass/only-use-clear-liquid-glass-for`

## Before you deliver
- [ ] Each card has one clear idea, the most important text first, and the series has a stated purpose. `writing/best-practices/consider-each-screens-purpose`, `design-principles/purpose/keep-focused`
- [ ] Body text is at or above the iOS default size and no light weights are used. `typography/ensuring-legibility/use-font-sizes-that-most-people`, `typography/ensuring-legibility/in-general-avoid-light-font-weights`
- [ ] Text and icons meet 4.5:1 on their actual background, including text over photos. `dark-mode/dark-mode-colors/aim-for-sufficient-color-contrast-in`, `image-views/content/take-care-when-overlaying-text-on`
- [ ] No meaning rests on color alone. `color/inclusive-color/avoid-relying-solely-on-color-to`
- [ ] Every card has alt text that describes the image, not the caption, and decorative images are hidden. `voiceover/descriptions/describe-meaningful-images`, `voiceover/descriptions/exclude-purely-decorative-images-from-voiceover`
- [ ] Template, icons and wording patterns are consistent across the series. `design-principles/familiarity/keep-visuals-and-interactions-consistent`, `writing/best-practices/build-language-patterns`
- [ ] Brand is subtle and does not displace the content. `branding/best-practices/ensure-branding-always-defers-to-content`
- [ ] Images carry a color profile and were viewed on real phones. `images/best-practices/include-a-color-profile-with-each`, `images/best-practices/always-test-images-on-a-range`
- [ ] Any chart states its takeaway and does not depend on color alone. `charts/descriptive-content/summarize-the-main-message-of-your`
- [ ] The questions under "Ask the user first" are answered.
