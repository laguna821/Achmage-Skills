---
slug: live-activities
title: "Live Activities"
kind: technology
group: "System experiences"
platforms: [iOS, iPadOS, macOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/live-activities
decision_trees: [beyond-the-app]
---

# Live Activities

**In one line:** A glanceable, continuously updated view of a task or event in progress, shown outside the app on the Lock Screen and Dynamic Island.

## Why it exists
Some tasks unfold over time, such as a ride, a delivery or a game, and people want their status without opening the app. A Live Activity keeps the key facts in view for a bounded period `live-activities/best-practices/offer-live-activities-for-tasks-and`. It serves Purpose by showing only what matters, and Simplicity by letting people tap through for the rest `live-activities/best-practices/focus-on-important-information-that-people`.

## Use it when
- A task or event has a clear start and end and lasts at most eight hours `live-activities/best-practices/offer-live-activities-for-tasks-and`
- People could reasonably respond to an update, such as contacting a driver `live-activities/best-practices/offering-interactivity/consider-letting-people-respond-to-event`
- Several related events can share one dynamic layout that rotates through them `live-activities/best-practices/starting-updating-and-ending-a-live-activity/let-people-track-multiple-events-efficiently`

## Don't use it when
- You want to advertise or promote: keep ads out entirely (no HIG alternative named) `live-activities/best-practices/dont-use-a-live-activity-to`
- The content is a one-off message without ongoing status: use [Notifications](notifications.md) instead `live-activities/best-practices/starting-updating-and-ending-a-live-activity/alert-people-only-for-essential-updates`
- The content is sensitive and cannot be summarized or redacted (no HIG alternative named) `live-activities/best-practices/avoid-displaying-sensitive-information`
- The task is finished: end the activity immediately `live-activities/best-practices/starting-updating-and-ending-a-live-activity/always-end-a-live-activity-immediately`

## Cost to the user
A Live Activity occupies persistent, high-visibility space, so it competes for attention for as long as it lives. Update it only when content or status truly changes, and alert only for crucial updates `live-activities/best-practices/starting-updating-and-ending-a-live-activity/update-a-live-activity-only-when` `live-activities/best-practices/starting-updating-and-ending-a-live-activity/alert-people-only-for-essential-updates`. Interactive elements add decisions, so keep them few `live-activities/best-practices/offering-interactivity/focus-on-simple-direct-actions`.

## Principles at stake
- **Purpose:** show only information tied to the ongoing task, never promotions `live-activities/best-practices/dont-use-a-live-activity-to`
- **Simplicity:** compact, minimal and expanded views each carry only the essentials `live-activities/presentation/compact-presentation/focus-on-the-most-important-information`
- **Agency:** start at expected moments and give an easy way to turn the activity off `live-activities/best-practices/starting-updating-and-ending-a-live-activity/start-live-activities-at-appropriate-times`
- **Responsibility:** redact sensitive data and let people choose whether it appears `live-activities/best-practices/avoid-displaying-sensitive-information`
- **Craft:** even margins, concentric shapes and checked contrast `live-activities/best-practices/creating-live-activity-layouts/use-consistent-margins-and-concentric-placement`

## Key rules
- Show only the most useful information, and let a tap lead to the app for more `live-activities/best-practices/focus-on-important-information-that-people`
- Make a tap land directly on the related details in the app `live-activities/best-practices/offering-interactivity/make-sure-tapping-the-live-activity`
- Limit interactivity to essential, directly related actions, preferably a single element `live-activities/best-practices/offering-interactivity/focus-on-simple-direct-actions`
- Use large text in medium weight or heavier, small text rarely `live-activities/best-practices/ensure-text-is-easy-to-read`
- Show a logo mark without a container; avoid the full app icon `live-activities/best-practices/if-you-include-a-logo-mark`
- Design for several screen sizes and scale factors, starting from the provided templates `live-activities/best-practices/creating-live-activity-layouts/adapt-to-different-screen-sizes-and` `live-activities/best-practices/creating-live-activity-layouts/use-familiar-layouts-for-custom-views`
- Use animation to support the message; move existing elements instead of removing and re-adding them `live-activities/best-practices/adding-transitions-and-animating-content-updates/animate-layout-changes`
- Design a layout for the activity's own information, not a copy of a notification `live-activities/presentation/lock-screen-presentation/dont-replicate-notification-layouts`
- Check contrast in Dark Mode and on a dimmed Always-On display; use custom backgrounds sparingly `live-activities/presentation/lock-screen-presentation/make-sure-your-design-assets-and` `live-activities/best-practices/choosing-colors/carefully-consider-using-a-custom-background`
- End immediately when the task finishes, and set a dismissal time in proportion to its length (often 15 to 30 minutes) `live-activities/best-practices/starting-updating-and-ending-a-live-activity/always-end-a-live-activity-immediately`

## Anatomy and content
- **Compact:** show only up-to-date, easy-to-grasp essentials, such as two team logos and a score `live-activities/presentation/compact-presentation/focus-on-the-most-important-information`. Leading and trailing elements read as one unit with the same color and type, and both open the same screen `live-activities/presentation/compact-presentation/ensure-unified-information-and-design-of` `live-activities/presentation/compact-presentation/link-to-relevant-app-content`.
- **Minimal:** recognizable as your app, ideally with fresh information such as remaining time `live-activities/presentation/minimal-presentation/ensure-that-your-live-activity-is`. In narrow contexts, fit it in a 28 pt circle `live-activities/best-practices/creating-live-activity-layouts/support-limited-width-presentations`.
- **Expanded:** keep elements in the same relative positions as the view grows, and wrap content close to the TrueDepth camera `live-activities/presentation/expanded-presentation/maintain-the-relative-placement-of-elements` `live-activities/presentation/expanded-presentation/wrap-content-tightly-around-the-truedepth`. Grow or shrink height with the content `live-activities/best-practices/creating-live-activity-layouts/dynamically-change-the-height-of-your`.
- **Lock Screen:** use the standard 14 pt margin to line up with notifications `live-activities/presentation/lock-screen-presentation/use-standard-margins-to-align-your`.
- **StandBy:** check assets at the larger scale, keep margins, and test Night Mode under its red tint `live-activities/presentation/standby-presentation/update-your-layout-for-standby` `live-activities/presentation/standby-presentation/verify-your-design-in-night-mode`.

## Platform differences
- **iOS, iPadOS:** no additional considerations beyond the rules above.
- **CarPlay:** if people may use the activity while driving, favor timely content over buttons and toggles `live-activities/carplay/carefully-consider-including-buttons-or-toggles`
- **watchOS:** consider a custom layout, skip buttons and toggles if used while driving, and use Smart Stack space for progress and significant updates `live-activities/platform-considerations/watchos/consider-creating-a-custom-watchos-layout` `live-activities/platform-considerations/watchos/focus-on-essential-information-and-significant`
- **Not available on:** tvOS, visionOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] keep a persistent status widget to the essentials and let a tap open details `live-activities/best-practices/focus-on-important-information-that-people`
- **Desktop web:** [HIG transfer] a pinned progress indicator should follow the same restraint, with no ads `live-activities/best-practices/dont-use-a-live-activity-to`
- **Slides:** [HIG transfer] large, heavy text for at-a-glance reading suits a status slide `live-activities/best-practices/ensure-text-is-easy-to-read`
- **Card news:** [HIG transfer] the same legibility rule applies to a headline card `live-activities/best-practices/ensure-text-is-easy-to-read`

## Related
[Notifications](notifications.md) · [Widgets](widgets.md) · [Snippets](snippets.md) · see [Decision tree](../decision-trees/beyond-the-app.md)
