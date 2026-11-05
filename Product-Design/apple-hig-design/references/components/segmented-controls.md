---
slug: segmented-controls
title: "Segmented controls"
kind: component
group: "Selection and input"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/segmented-controls
decision_trees: [navigation-structure, choosing-values]
---

# Segmented controls

**In one line:** A row of equal-width segments where people pick one closely related option, with the current choice visible at a glance.

## Why it exists
When a few options belong together, such as inspector attributes or time ranges, showing them side by side makes the relationship clear `segmented-controls/best-practices/use-a-segmented-control-to-provide`. Unlike other button styles, the grouping holds at any size or position, and the selection is obvious `segmented-controls/best-practices/consider-a-segmented-control-when-its`. This serves Familiarity and Simplicity.

## Use it when
- Closely related options modify an object, a state or a view `segmented-controls/best-practices/use-a-segmented-control-to-provide`
- The functions should stay grouped or the current selection must be obvious `segmented-controls/best-practices/consider-a-segmented-control-when-its`
- On iOS and iPadOS, people switch quickly between closely related subviews `segmented-controls/platform-considerations/ios-ipados/consider-a-segmented-control-to-switch`

## Don't use it when
- The destinations are fully separate app sections on iOS or iPadOS: use [Tab bars](tab-bars.md) instead `segmented-controls/platform-considerations/ios-ipados/consider-a-segmented-control-to-switch`
- On macOS, you switch views in the main window area: use [Tab views](tab-views.md) instead `segmented-controls/platform-considerations/macos/use-a-tab-view-in-the`
- On Apple TV, a screen filters content: use [Split views](split-views.md) instead `segmented-controls/platform-considerations/tvos/consider-using-a-split-view-instead`
- You would need many segments: keep to about five to seven in a wide interface, about five on iPhone (no HIG alternative named) `segmented-controls/best-practices/limit-the-number-of-segments-in`

## Cost to the user
Each extra segment is harder to parse and slower to move through `segmented-controls/best-practices/limit-the-number-of-segments-in`. Mixed content or mixed behavior makes the control feel disconnected and unclear `segmented-controls/content/prefer-using-either-text-or-images`.

## Principles at stake
- **Simplicity:** few segments, one kind of content, noun labels `segmented-controls/content/use-nouns-or-noun-phrases-for`
- **Familiarity:** a segment is either selection or action, never both `segmented-controls/best-practices/keep-control-types-consistent-within-a`
- **Craft:** equal widths and comparable content look balanced `segmented-controls/best-practices/in-general-keep-segment-size-consistent` `segmented-controls/content/as-much-as-possible-use-content`
- **Agency:** on macOS, spring loading lets people activate a segment mid-drag `segmented-controls/platform-considerations/macos/consider-supporting-spring-loading`

## Key rules
- Keep every segment the same kind: do not mix action segments with selection segments `segmented-controls/best-practices/keep-control-types-consistent-within-a`
- Limit segments: about five to seven when wide, about five on iPhone `segmented-controls/best-practices/limit-the-number-of-segments-in`
- Make segments the same width where possible, and keep icon and title widths similar `segmented-controls/best-practices/in-general-keep-segment-size-consistent`
- Use either text or images, not a mix `segmented-controls/content/prefer-using-either-text-or-images`
- Give segments content of comparable size `segmented-controls/content/as-much-as-possible-use-content`
- Label segments with nouns or noun phrases in title-style capitalization; text-labeled controls need no intro text `segmented-controls/content/use-nouns-or-noun-phrases-for`

## Anatomy and content
Segments share one width, so content that fills some and leaves others sparse looks unbalanced `segmented-controls/content/as-much-as-possible-use-content`. Descriptive noun labels already tell people what each segment is `segmented-controls/content/use-nouns-or-noun-phrases-for`.

## Platform differences
- **iOS, iPadOS:** quick switching between related subviews; use a tab bar for separate sections `segmented-controls/platform-considerations/ios-ipados/consider-a-segmented-control-to-switch`
- **macOS:** add intro text when meaning is unclear; with symbol segments add a label under each, and a tooltip per segment if the app uses them `segmented-controls/platform-considerations/macos/consider-using-introductory-text-to-clarify`. Reserve segmented controls for toolbars or inspector panes `segmented-controls/platform-considerations/macos/use-a-tab-view-in-the`. Consider spring loading on a Mac with a Magic Trackpad `segmented-controls/platform-considerations/macos/consider-supporting-spring-loading`
- **tvOS:** prefer a split view for filtering, and keep other focusable elements away because segments select on focus `segmented-controls/platform-considerations/tvos/consider-using-a-split-view-instead` `segmented-controls/platform-considerations/tvos/avoid-putting-other-focusable-elements-close`
- **Not available on:** watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] the same grouping, count and label rules `segmented-controls/best-practices/limit-the-number-of-segments-in`
- **Desktop web:** [HIG] same rules; the macOS intro text and tooltip guidance is [HIG transfer] for symbol-only segments `segmented-controls/platform-considerations/macos/consider-using-introductory-text-to-clarify`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Tab bars](tab-bars.md) · [Split views](split-views.md) · [Toggles](toggles.md) · see [Decision tree](../decision-trees/navigation-structure.md) · [Decision tree](../decision-trees/choosing-values.md)
