---
slug: activity-rings
title: "Activity rings"
kind: component
group: "Status"
platforms: [iOS, iPadOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/activity-rings
decision_trees: [progress-and-status]
---

# Activity rings

**In one line:** Apple's concentric rings that show one person's daily Move, Exercise and Stand progress, reserved for exactly that data.

## Why it exists
People already know the rings as the sign of Activity progress, so a health or fitness app that shows them borrows a meaning people learned elsewhere `activity-rings/best-practices/display-activity-rings-when-theyre-relevant`. That meaning only holds if the rings are never reused for other data or altered `activity-rings/best-practices/use-activity-rings-only-to-show`. The principles at work are Familiarity and Responsibility.

## Use it when
- The app deals with health or fitness, such as workout metrics or summary screens `activity-rings/best-practices/display-activity-rings-when-theyre-relevant`
- You show Move, Exercise or Stand progress for one person, with a label, photo or avatar saying whose it is `activity-rings/best-practices/use-activity-rings-to-show-progress`

## Don't use it when
- The data is anything other than Move, Exercise and Stand: do not copy, alter or imitate the rings; a [Gauges](gauges.md) or [Progress indicators](progress-indicators.md) element suits other progress `activity-rings/best-practices/use-activity-rings-only-to-show`
- You want decoration or a background graphic `activity-rings/best-practices/dont-use-activity-rings-for-decoration`
- You want branding in the app icon or marketing `activity-rings/best-practices/dont-use-activity-rings-for-branding`
- Several people's progress would share one set of rings: show one person only (no HIG alternative named) `activity-rings/best-practices/use-activity-rings-to-show-progress`

## Cost to the user
Misusing the rings dilutes a symbol people trust, and mixed ring-like graphics create a confusing interface `activity-rings/best-practices/differentiate-other-ring-like-elements-from`. Repeating the Activity app's notifications adds noise people already receive `activity-rings/best-practices/dont-send-notifications-that-repeat-the`.

## Principles at stake
- **Familiarity:** identical look everywhere, with matching label colors `activity-rings/best-practices/always-keep-the-visual-appearance-of` `activity-rings/best-practices/to-display-a-label-or-value`
- **Responsibility:** the rings report Activity progress, not decoration or brand `activity-rings/best-practices/dont-use-activity-rings-for-decoration`
- **Purpose:** show them where the data matters, such as workout summaries `activity-rings/best-practices/display-activity-rings-when-theyre-relevant`
- **Craft:** keep margins and scale correct `activity-rings/best-practices/maintain-activity-ring-margins`

## Key rules
- Reserve the rings for Move, Exercise and Stand `activity-rings/best-practices/use-activity-rings-only-to-show`
- Show one person's rings and make ownership clear `activity-rings/best-practices/use-activity-rings-to-show-progress`
- Keep colors, black background and proportions unchanged; adapt the surrounding UI, not the rings `activity-rings/best-practices/always-keep-the-visual-appearance-of`
- Color Move, Exercise and Stand labels and values to match their rings `activity-rings/best-practices/to-display-a-label-or-value`
- Leave an outer margin at least equal to the gap between rings, and let nothing crop or cover it `activity-rings/best-practices/maintain-activity-ring-margins`
- Separate other ring-like graphics with padding, lines, labels, or color and scale differences `activity-rings/best-practices/differentiate-other-ring-like-elements-from`
- Do not send notifications that duplicate Activity updates or embed rings in them `activity-rings/best-practices/dont-send-notifications-that-repeat-the`

## Platform differences
No platform-specific guidance.
- **Not available on:** macOS, tvOS, visionOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG none] the rules concern Apple's own Activity data
- **Desktop web:** [HIG none]
- **Slides:** [HIG none]
- **Card news:** [HIG none]. The lesson not to imitate a reserved symbol is [HIG transfer] only as a caution `activity-rings/best-practices/use-activity-rings-only-to-show`

## Related
[Gauges](gauges.md) · [Progress indicators](progress-indicators.md) · [Workouts](https://developer.apple.com/design/human-interface-guidelines/workouts) · see [Decision tree](../decision-trees/progress-and-status.md)
