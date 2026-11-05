---
slug: sliders
title: "Sliders"
kind: component
group: "Selection and input"
platforms: [iOS, iPadOS, macOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/sliders
decision_trees: [choosing-values]
---

# Sliders

**In one line:** A track with a movable thumb for choosing a value anywhere between a minimum and a maximum.

## Why it exists
Some values are continuous and best adjusted by feel, such as volume or size. A slider lets people sweep through a range and, on macOS, see the effect as they move `sliders/platform-considerations/macos/consider-giving-live-feedback-as-the`. It relies on Familiarity: people expect the same direction in every app `sliders/best-practices/use-familiar-slider-directions`.

## Use it when
- People adjust a value within a range and rough positioning is enough `sliders/best-practices/use-familiar-slider-directions`
- The range is wide and people also want an exact value: pair the slider with a text field and a stepper `sliders/best-practices/consider-supplementing-a-slider-with-a`
- On macOS, the effect can be previewed live as the thumb moves `sliders/platform-considerations/macos/consider-giving-live-feedback-as-the`

## Don't use it when
- On iOS or iPadOS, you control volume: use a volume view instead of a plain slider (no HIG card for it) `sliders/platform-considerations/ios-ipados/dont-use-a-slider-to-adjust`
- Precise whole-number entry matters: add [Steppers](steppers.md) and a [Text fields](text-fields.md) field beside the slider `sliders/best-practices/consider-supplementing-a-slider-with-a`

## Cost to the user
A bare slider gives no exact value, which costs people precision on wide ranges `sliders/best-practices/consider-supplementing-a-slider-with-a`. Without a label or tick marks, people may not know what it controls or where values sit `sliders/platform-considerations/macos/consider-using-a-label-to-introduce` `sliders/platform-considerations/macos/use-tick-marks-to-increase-clarity`.

## Principles at stake
- **Familiarity:** minimum on the leading side, maximum on the trailing side; bottom and top for vertical `sliders/best-practices/use-familiar-slider-directions`
- **Flexibility:** typed values and steppers serve people who need precision `sliders/best-practices/consider-supplementing-a-slider-with-a`
- **Delight:** custom styling should hint at what the slider adjusts, only when it adds value `sliders/best-practices/customize-a-sliders-appearance-if-it`
- **Craft:** tick marks convey the scale `sliders/platform-considerations/macos/use-tick-marks-to-increase-clarity`

## Key rules
- Put minimum on the leading side and maximum on the trailing side of horizontal sliders; minimum at the bottom for vertical ones `sliders/best-practices/use-familiar-slider-directions`
- Restyle the track, thumb or end icons only when it adds value `sliders/best-practices/customize-a-sliders-appearance-if-it`
- For wide ranges, add a text field for the exact value and a stepper for whole-number steps `sliders/best-practices/consider-supplementing-a-slider-with-a`
- Use a volume view, not a slider, for volume on iOS and iPadOS `sliders/platform-considerations/ios-ipados/dont-use-a-slider-to-adjust`
- Show results in real time while the slider moves (macOS) `sliders/platform-considerations/macos/consider-giving-live-feedback-as-the`
- Add tick marks (macOS) `sliders/platform-considerations/macos/use-tick-marks-to-increase-clarity`, labeled with numbers or words where useful, often just the ends `sliders/platform-considerations/macos/consider-adding-labels-to-tick-marks`

## Anatomy and content
A slider has a track, a thumb and optional end icons `sliders/best-practices/customize-a-sliders-appearance-if-it`. On macOS a lead-in label uses sentence-style capitalization and ends with a colon `sliders/platform-considerations/macos/consider-using-a-label-to-introduce`. Label tick marks periodically for nonlinear scales and show the thumb value in a tooltip `sliders/platform-considerations/macos/consider-adding-labels-to-tick-marks`.

## Platform differences
- **iOS, iPadOS:** use a volume view for volume `sliders/platform-considerations/ios-ipados/dont-use-a-slider-to-adjust`
- **macOS:** live feedback, a horizontal slider between fixed endpoints and a circular slider for repeating or unending values like rotation, lead-in label, tick marks `sliders/platform-considerations/macos/choose-a-slider-style-that-matches`
- **visionOS:** favor horizontal sliders, because side-to-side gestures are easier `sliders/platform-considerations/visionos/prefer-horizontal-sliders`
- **watchOS:** the default shows plus and minus signs; design custom glyphs if they do not convey the purpose `sliders/platform-considerations/watchos/if-necessary-create-custom-glyphs-to`
- **Not available on:** tvOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] direction and styling rules apply; the volume-view rule is [HIG transfer] for media players `sliders/platform-considerations/ios-ipados/dont-use-a-slider-to-adjust`
- **Desktop web:** [HIG] direction, live feedback, tick marks and labels carry over `sliders/platform-considerations/macos/consider-giving-live-feedback-as-the`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Steppers](steppers.md) · [Pickers](pickers.md) · [Text fields](text-fields.md) · see [Decision tree](../decision-trees/choosing-values.md)
