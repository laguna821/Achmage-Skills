---
slug: voiceover
title: "VoiceOver"
kind: technology
group: "Technologies"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/voiceover
---

# VoiceOver

**In one line:** A screen reader that describes the interface aloud so people who cannot see the screen can navigate and use an app.

## Why it exists
Layout, proximity and images carry meaning only for people who can see them. VoiceOver users get that meaning only if you describe it: labels, image descriptions, headings, grouping and change notices `voiceover/descriptions/provide-alternative-labels-for-all-key` `voiceover/navigation/specify-how-elements-are-grouped-ordered`. This is Apple's inclusion work in practice (Responsibility, Familiarity).

## Use it when
- Any interface element, including custom ones, conveys function and needs a descriptive label `voiceover/descriptions/provide-alternative-labels-for-all-key`
- Images, charts or infographics carry meaning `voiceover/descriptions/describe-meaningful-images` `voiceover/descriptions/make-charts-and-other-infographics-fully`
- Visual relationships (grouping, order, pairing) or content changes need to be conveyed `voiceover/navigation/specify-how-elements-are-grouped-ordered` `voiceover/navigation/inform-voiceover-when-visible-content-or`

## Don't use it when
- An image is purely decorative: hide it from VoiceOver instead of describing it (no HIG alternative named) `voiceover/descriptions/exclude-purely-decorative-images-from-voiceover`

## Cost to the user
Missing or noisy descriptions cost the most. Without labels people cannot use key controls, and decorative images waste their time and add cognitive load `voiceover/descriptions/exclude-purely-decorative-images-from-voiceover`. Unannounced layout changes make a person's mental map wrong `voiceover/navigation/inform-voiceover-when-visible-content-or`.

## Principles at stake
- **Responsibility:** every person can reach the same information and actions `voiceover/descriptions/provide-alternative-labels-for-all-key`
- **Simplicity:** hide decoration and keep titles and headings clear `voiceover/descriptions/exclude-purely-decorative-images-from-voiceover` `voiceover/navigation/use-titles-and-headings-to-help`
- **Familiarity:** headings and rotor types let people navigate by content type `voiceover/navigation/support-the-voiceover-rotor-when-possible`

## Key rules
- Give all key elements descriptive alternative labels, and keep them current as the interface changes `voiceover/descriptions/provide-alternative-labels-for-all-key`
- Describe what a meaningful image shows, not nearby text such as its caption `voiceover/descriptions/describe-meaningful-images`
- Give charts and infographics short descriptions and make their interactions available too `voiceover/descriptions/make-charts-and-other-infographics-fully`
- Hide purely decorative images `voiceover/descriptions/exclude-purely-decorative-images-from-voiceover`
- Give each page a unique, concise title and accurate section headings `voiceover/navigation/use-titles-and-headings-to-help`
- Express visual-only relationships by grouping, ordering or linking, such as pairing an image with its caption `voiceover/navigation/specify-how-elements-are-grouped-ordered`
- Notify assistive technologies when visible content or layout changes `voiceover/navigation/inform-voiceover-when-visible-content-or`
- Identify headings, links and other element types to the rotor `voiceover/navigation/support-the-voiceover-rotor-when-possible`

## Platform differences
- **visionOS:** apps with custom gestures do not receive hand input while VoiceOver is on, unless the person enables Direct Gesture mode `voiceover/platform-considerations/visionos/be-mindful-that-custom-gestures-arent`
- **iOS, iPadOS, macOS, tvOS, watchOS:** no additional considerations.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] labels, image descriptions, headings and change notices apply directly to any screen reader `voiceover/descriptions/provide-alternative-labels-for-all-key`
- **Desktop web:** [HIG transfer] unique page titles, headings, grouping and the rotor idea carry over to web screen readers `voiceover/navigation/use-titles-and-headings-to-help` `voiceover/navigation/support-the-voiceover-rotor-when-possible`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) · [Inclusion](https://developer.apple.com/design/human-interface-guidelines/inclusion) · [Charts](https://developer.apple.com/design/human-interface-guidelines/charts)
