---
slug: steppers
title: "Steppers"
kind: component
group: "Selection and input"
platforms: [iOS, iPadOS, macOS, visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/steppers
decision_trees: [choosing-values]
---

# Steppers

**In one line:** A two-part control that raises or lowers a value by small steps, without showing the value itself.

## Why it exists
Small, precise changes to a number are quick with plus and minus buttons. A stepper has no value display of its own, so its meaning depends on a nearby value that people can see `steppers/best-practices/make-the-value-that-a-stepper`. This serves Simplicity and Familiarity, and Flexibility when paired with typing `steppers/best-practices/consider-pairing-a-stepper-with-a`.

## Use it when
- People make small adjustments to a visible value `steppers/best-practices/consider-pairing-a-stepper-with-a`
- Large changes are also likely: pair the stepper with a text field `steppers/best-practices/consider-pairing-a-stepper-with-a`

## Don't use it when
- The value is not displayed nearby: show it first, or people cannot tell what they are changing (no HIG alternative named) `steppers/best-practices/make-the-value-that-a-stepper`
- Values vary widely and people need a specific number: add a [Text fields](text-fields.md) field `steppers/best-practices/consider-pairing-a-stepper-with-a`

## Cost to the user
Alone, a stepper makes big jumps slow, since each press changes the value only a little `steppers/best-practices/consider-pairing-a-stepper-with-a`. If the changed value is not evident, people must guess what they are adjusting `steppers/best-practices/make-the-value-that-a-stepper`.

## Principles at stake
- **Simplicity:** show the value next to the stepper so the control stays minimal `steppers/best-practices/make-the-value-that-a-stepper`
- **Flexibility:** a typed number covers wide ranges, such as print copies `steppers/best-practices/consider-pairing-a-stepper-with-a`
- **Agency:** on macOS, a modifier key speeds large changes `steppers/platform-considerations/macos/for-large-value-ranges-consider-supporting`

## Key rules
- Show the value the stepper changes right beside it `steppers/best-practices/make-the-value-that-a-stepper`
- Use a stepper alone only for small adjustments; add a text field when large changes are likely `steppers/best-practices/consider-pairing-a-stepper-with-a`
- On macOS, consider letting Shift-click apply a bigger increment, such as ten times `steppers/platform-considerations/macos/for-large-value-ranges-consider-supporting`
- Pair it with a slider only when a wide range needs both sweeping and whole-number steps, as the slider page suggests (see [Sliders](sliders.md)) `sliders/best-practices/consider-supplementing-a-slider-with-a`

## Platform differences
- **macOS:** Shift-click for larger increments on wide ranges `steppers/platform-considerations/macos/for-large-value-ranges-consider-supporting`
- **iOS, iPadOS, visionOS:** no platform-specific guidance.
- **Not available on:** tvOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] show the value beside the control `steppers/best-practices/make-the-value-that-a-stepper`
- **Desktop web:** [HIG] pair with a typed field; modifier-key increments carry over `steppers/platform-considerations/macos/for-large-value-ranges-consider-supporting`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Sliders](sliders.md) · [Pickers](pickers.md) · [Text fields](text-fields.md) · see [Decision tree](../decision-trees/choosing-values.md)
