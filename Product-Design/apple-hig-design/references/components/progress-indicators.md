---
slug: progress-indicators
title: "Progress indicators"
kind: component
group: "Status"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/progress-indicators
decision_trees: [progress-and-status]
---

# Progress indicators

**In one line:** A bar or spinner that shows a task is running and, when the length is known, how far along it is.

## Why it exists
People need to know the app has not frozen and how long to wait. A determinate indicator lets them estimate the duration and decide whether to wait, come back later or give up `progress-indicators/best-practices/when-possible-use-a-determinate-progress`. It supports Agency and Responsibility: report honestly, and keep it moving `progress-indicators/best-practices/be-as-accurate-as-possible-when` `progress-indicators/best-practices/keep-progress-indicators-moving-so-people`.

## Use it when
- A task takes noticeable time and its progress can be measured: use a determinate indicator `progress-indicators/best-practices/when-possible-use-a-determinate-progress`
- Duration is unknown at first: use an indeterminate one, then switch to determinate once duration is known `progress-indicators/best-practices/when-possible-switch-a-progress-bar`
- On macOS, a background operation or tight space needs status: use a spinner, such as inside a text field or next to a button `progress-indicators/platform-considerations/macos/prefer-an-activity-indicator-spinner-to`
- On iOS and iPadOS, content needs refreshing: use a refresh control and also refresh on a schedule `progress-indicators/platform-considerations/ios-ipados/refresh-content-controls/perform-automatic-content-updates`

## Don't use it when
- Duration is measurable: avoid the indeterminate form and use a determinate one `progress-indicators/best-practices/when-possible-use-a-determinate-progress`
- A spinner would turn into a bar midway: keep the same style throughout `progress-indicators/best-practices/dont-switch-from-the-circular-style`
- The meaning is a level within a range, not task progress: use [Gauges](gauges.md) instead `gauges/best-practices/write-succinct-labels-that-describe-the`

## Cost to the user
A progress indicator tells people to wait, so the cost is time and uncertainty. A motionless indicator suggests a freeze, uneven jumps make people doubt the app, and a vague label such as "loading" adds nothing `progress-indicators/best-practices/keep-progress-indicators-moving-so-people` `progress-indicators/best-practices/be-as-accurate-as-possible-when` `progress-indicators/best-practices/if-its-helpful-display-a-description`.

## Principles at stake
- **Agency:** people can estimate, cancel or pause `progress-indicators/best-practices/when-its-feasible-let-people-halt`
- **Responsibility:** accurate pacing and clear feedback on a stall; warn before canceling loses progress `progress-indicators/best-practices/let-people-know-when-halting-a`
- **Familiarity:** put the indicator in the same place each time `progress-indicators/best-practices/display-a-progress-indicator-in-a`
- **Craft:** do not swap spinner and bar, which differ in shape and size `progress-indicators/best-practices/dont-switch-from-the-circular-style`

## Key rules
- Prefer determinate over indeterminate whenever possible `progress-indicators/best-practices/when-possible-use-a-determinate-progress`
- Report progress accurately and even out its pace `progress-indicators/best-practices/be-as-accurate-as-possible-when`
- Keep it animating; if the process stalls, say what is wrong and what to do `progress-indicators/best-practices/keep-progress-indicators-moving-so-people`
- Switch an indeterminate bar to determinate once duration is known `progress-indicators/best-practices/when-possible-switch-a-progress-bar`
- Add a short, accurate description when it helps; avoid "loading" or "authenticating" `progress-indicators/best-practices/if-its-helpful-display-a-description`
- Place it in the same spot each time `progress-indicators/best-practices/display-a-progress-indicator-in-a`
- Offer Cancel when safe, and Pause as well if stopping could lose partial work such as a download `progress-indicators/best-practices/when-its-feasible-let-people-halt`
- If canceling loses progress, show an alert to confirm cancel or resume `progress-indicators/best-practices/let-people-know-when-halting-a`

## Platform differences
- **iOS, iPadOS:** refresh controls get a title only when it adds value, such as time of last update, never to explain how to refresh `progress-indicators/platform-considerations/ios-ipados/refresh-content-controls/supply-a-short-title-only-if`; also schedule automatic updates `progress-indicators/platform-considerations/ios-ipados/refresh-content-controls/perform-automatic-content-updates`
- **macOS:** use a spinner for background status or tight spaces, and do not label it `progress-indicators/platform-considerations/macos/prefer-an-activity-indicator-spinner-to` `progress-indicators/platform-considerations/macos/avoid-labeling-a-spinning-progress-indicator`
- **tvOS, visionOS, watchOS:** no additional platform guidance.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] determinate-first, honest pace and stall feedback `progress-indicators/best-practices/when-possible-use-a-determinate-progress`
- **Desktop web:** [HIG] same; spinner-in-small-space guidance applies directly `progress-indicators/platform-considerations/macos/prefer-an-activity-indicator-spinner-to`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Gauges](gauges.md) · [Activity rings](activity-rings.md) · [Alerts](alerts.md) · see [Decision tree](../decision-trees/progress-and-status.md)
