---
slug: gauges
title: "Gauges"
kind: component
group: "Status"
platforms: [iOS, iPadOS, macOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/gauges
decision_trees: [progress-and-status]
---

# Gauges

**In one line:** A visual showing a current value within a range, such as a capacity level or a temperature.

## Why it exists
A number alone does not show where a value sits between its limits. A gauge shows the position along a path, and short labels for the value and both ends let people grasp it, including through VoiceOver `gauges/best-practices/write-succinct-labels-that-describe-the`. Color can add meaning to the range `gauges/best-practices/consider-filling-the-path-with-a`.

## Use it when
- A value should be read against a range, such as hot to cold, with the ends named `gauges/best-practices/write-succinct-labels-that-describe-the`
- The range has meaning a gradient can express `gauges/best-practices/consider-filling-the-path-with-a`
- On macOS, you show capacity, with large ranges in the continuous style `gauges/platform-considerations/macos/consider-using-the-continuous-style-for`

## Don't use it when
- The task is running and its completion matters: use [Progress indicators](progress-indicators.md) instead (the gauge page itself names no alternative)
- You want a share-of-whole display for Move, Exercise or Stand: those belong to [Activity rings](activity-rings.md) (HIG alternative inferred from that page) `activity-rings/best-practices/use-activity-rings-only-to-show`

## Cost to the user
A gauge takes glance time, and labels that are long or unclear cost more than they give `gauges/best-practices/write-succinct-labels-that-describe-the`. On macOS, discrete segments across a large range become too small to be useful `gauges/platform-considerations/macos/consider-using-the-continuous-style-for`.

## Principles at stake
- **Simplicity:** short labels for the value and both range ends `gauges/best-practices/write-succinct-labels-that-describe-the`
- **Delight:** a meaningful gradient makes the gauge's subject easier to feel `gauges/best-practices/consider-filling-the-path-with-a`
- **Purpose:** color shifts at key levels point to the meaningful parts of the range `gauges/platform-considerations/macos/consider-changing-the-fill-color-to`

## Key rules
- Write succinct labels naming the current value and both ends of the range `gauges/best-practices/write-succinct-labels-that-describe-the`
- Consider a gradient along the path that reflects meaning, such as red to blue for hot to cold `gauges/best-practices/consider-filling-the-path-with-a`
- On macOS, use the continuous style for capacity indicators with large ranges `gauges/platform-considerations/macos/consider-using-the-continuous-style-for`
- On macOS, consider changing a capacity indicator's fill color at key levels, or use tiered colors in one indicator `gauges/platform-considerations/macos/consider-changing-the-fill-color-to`

## Platform differences
- **macOS:** continuous style for large capacities, and color changes at key levels `gauges/platform-considerations/macos/consider-using-the-continuous-style-for` `gauges/platform-considerations/macos/consider-changing-the-fill-color-to`
- **iOS, iPadOS, visionOS, watchOS:** no additional platform guidance.
- **Not available on:** tvOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] labels and gradient guidance apply `gauges/best-practices/write-succinct-labels-that-describe-the`
- **Desktop web:** [HIG] same; the macOS capacity-style rules are [HIG transfer] `gauges/platform-considerations/macos/consider-using-the-continuous-style-for`
- **Slides:** [HIG transfer] labelled ends and meaningful gradients suit an on-slide meter `gauges/best-practices/write-succinct-labels-that-describe-the`
- **Card news:** [HIG transfer] the same label and gradient lessons suit a meter graphic `gauges/best-practices/consider-filling-the-path-with-a`

## Related
[Progress indicators](progress-indicators.md) · [Activity rings](activity-rings.md) · [Complications](complications.md) · see [Decision tree](../decision-trees/progress-and-status.md)
