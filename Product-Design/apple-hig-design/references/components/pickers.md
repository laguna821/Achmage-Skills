---
slug: pickers
title: "Pickers"
kind: component
group: "Selection and input"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/pickers
decision_trees: [choosing-values]
---

# Pickers

**In one line:** A control that lets people choose one value from a scrollable set of items, such as a list of countries or a date and time.

## Why it exists
Some inputs are best chosen from a known set, not typed. A picker puts a medium or long set of values in a compact, scrolling control so people can pick without leaving what they are editing `pickers/best-practices/consider-using-a-picker-to-offer`. It serves Simplicity and Familiarity: ordered values and a nearby position let people predict where an item is and stay oriented `pickers/best-practices/use-predictable-and-logically-ordered-values` `pickers/best-practices/avoid-switching-views-to-show-a`.

## Use it when
- People choose one value from a mid-length to long list `pickers/best-practices/consider-using-a-picker-to-offer`
- The values have a natural order, such as an alphabetized country list, so hidden items can be anticipated `pickers/best-practices/use-predictable-and-logically-ordered-values`
- On iOS and iPadOS, space is tight and a date or time must be edited: use the compact date picker `pickers/platform-considerations/ios-ipados/use-a-compact-date-picker-when`

## Don't use it when
- The list is short: use a [Pull-down button](pull-down-buttons.md) instead, since a picker adds visual weight to a few items `pickers/best-practices/consider-using-a-picker-to-offer`
- The set is very large: use [Lists and tables](lists-and-tables.md) instead, which can add an index for quick jumps `pickers/best-practices/consider-using-a-picker-to-offer`
- Showing the picker would pull people into a different view: show it in context instead, near the field being edited (no HIG alternative component named) `pickers/best-practices/avoid-switching-views-to-show-a`

## Cost to the user
A picker takes space and visual weight, so it is costly for a handful of options. Poorly ordered values force people to scroll and search, while predictable order lets them move quickly even when most items are out of view `pickers/best-practices/use-predictable-and-logically-ordered-values`.

## Principles at stake
- **Simplicity:** match the control to the list length, and thin out choices such as minutes `pickers/best-practices/consider-providing-less-granularity-when-specifying`
- **Familiarity:** logical ordering lets people anticipate values `pickers/best-practices/use-predictable-and-logically-ordered-values`
- **Agency:** keeping the picker in context keeps people oriented in what they are editing `pickers/best-practices/avoid-switching-views-to-show-a`
- **Flexibility:** the date picker offers styles for different space and precision needs `pickers/platform-considerations/macos/choose-a-date-picker-style-that`

## Key rules
- Use a picker for mid-length to long lists; use a pull-down button for short ones and a list or table for very large sets `pickers/best-practices/consider-using-a-picker-to-offer`
- Order values logically so people can predict where an item sits `pickers/best-practices/use-predictable-and-logically-ordered-values`
- Show the picker near the field, for example at the bottom of the window or in a popover, instead of switching views `pickers/best-practices/avoid-switching-views-to-show-a`
- In a date picker, consider a larger minute interval that divides evenly into 60, such as quarter hours `pickers/best-practices/consider-providing-less-granularity-when-specifying`
- On iOS and iPadOS, the compact date picker shows the value as a button that opens a calendar-style editor `pickers/platform-considerations/ios-ipados/use-a-compact-date-picker-when`
- On macOS, choose the date picker style by space and task `pickers/platform-considerations/macos/choose-a-date-picker-style-that`

## Platform differences
- **iOS, iPadOS:** use the compact date picker when space is tight `pickers/platform-considerations/ios-ipados/use-a-compact-date-picker-when`
- **macOS:** use the textual date picker for tight space and precise entries; use the graphical style for browsing a calendar, choosing ranges, or a clock look `pickers/platform-considerations/macos/choose-a-date-picker-style-that`
- **tvOS, watchOS, visionOS:** no additional platform-specific guidance.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] the list-length and ordering rules apply to any option picker `pickers/best-practices/consider-using-a-picker-to-offer`
- **Desktop web:** [HIG transfer] a select or popover list follows the same length, ordering and in-context rules `pickers/best-practices/avoid-switching-views-to-show-a`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Pull-down buttons](pull-down-buttons.md) · [Lists and tables](lists-and-tables.md) · see [Decision tree](../decision-trees/choosing-values.md)
