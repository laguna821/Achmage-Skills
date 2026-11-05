---
tree: progress-and-status
title: "Showing progress and status"
members: [progress-indicators, gauges, activity-rings, rating-indicators]
---

# Decision tree: Showing progress and status

**Use this when:** you need to show how far a task has gone, where a value sits, how a person is doing on daily activity, or how an item is ranked.
**Members:** [Progress indicators](../components/progress-indicators.md) · [Gauges](../components/gauges.md) · [Activity rings](../components/activity-rings.md) · [Rating indicators](../components/rating-indicators.md)
**Related patterns:** [Loading](https://developer.apple.com/design/human-interface-guidelines/loading) · [Feedback](https://developer.apple.com/design/human-interface-guidelines/feedback)

## Start with the need
1. **Is something running that people must wait for?**
   - Yes, and the length is known or measurable → use a determinate [Progress indicator](../components/progress-indicators.md), paced evenly and accurately `progress-indicators/best-practices/when-possible-use-a-determinate-progress` `progress-indicators/best-practices/be-as-accurate-as-possible-when`
   - Yes, but the length is unknown for now → use an indeterminate one, and switch to determinate once the length is known `progress-indicators/best-practices/when-possible-switch-a-progress-bar`
   - No, the person is reading a value or a ranking → go to 4
2. **Is this a content load rather than a task with its own progress?**
   - Yes → show something at once (placeholders), let people do other things, and say that loading is happening `loading/best-practices/show-something-as-soon-as-possible` `loading/best-practices/let-people-do-other-things-in` `loading/showing-progress/clearly-communicate-that-content-is-loading`
   - The wait is unavoidably long → show something interesting, such as tips, timed to the wait `loading/best-practices/if-loading-takes-an-unavoidably-long`
   - No → go to 3
3. **Does the person need to control or understand the wait?**
   - They may want to stop it → offer Cancel when safe, and Pause if stopping loses partial work `progress-indicators/best-practices/when-its-feasible-let-people-halt`
   - Stopping would lose progress → confirm with an [Alert](../components/alerts.md) offering cancel or resume `progress-indicators/best-practices/let-people-know-when-halting-a`
   - It stalls → keep it moving, say what is wrong and what to do `progress-indicators/best-practices/keep-progress-indicators-moving-so-people`
   - The task needs a name → add a short, specific description, not "loading" `progress-indicators/best-practices/if-its-helpful-display-a-description`
4. **Is the value a level within a range (capacity, temperature)?**
   - Yes → use a [Gauge](../components/gauges.md) with short labels for the value and both ends `gauges/best-practices/write-succinct-labels-that-describe-the`
   - The range has meaning → add a gradient that reflects it `gauges/best-practices/consider-filling-the-path-with-a`
   - No → go to 5
5. **Is it one person's daily Move, Exercise or Stand progress in a health or fitness app?**
   - Yes → use [Activity rings](../components/activity-rings.md), for one person, with ownership clear `activity-rings/best-practices/display-activity-rings-when-theyre-relevant` `activity-rings/best-practices/use-activity-rings-to-show-progress`
   - Any other data → do not borrow or imitate the rings; use a gauge or progress indicator `activity-rings/best-practices/use-activity-rings-only-to-show`
   - No → go to 6
6. **Is it a rank or rating that people may change?**
   - Yes (macOS) → use a [Rating indicator](../components/rating-indicators.md) and let people change it in place `rating-indicators/best-practices/make-it-easy-to-change-rankings`
   - Custom symbol instead of a star → keep it clearly a rating `rating-indicators/best-practices/if-you-replace-the-star-with`
   - No → go to 7
7. **Is it a one-off result or problem, not an ongoing state?**
   - Status that belongs beside the thing it describes → put it next to those items `feedback/best-practices/consider-integrating-status-feedback-into-your`
   - A significant task finished → confirm completion, sparingly `feedback/best-practices/when-it-makes-sense-confirm-that`
   - A command cannot run → say so and explain why `feedback/best-practices/show-people-when-a-command-cant`
   - Critical and actionable → alert, only then `feedback/best-practices/use-alerts-to-deliver-critical-and`

## At a glance
| Component | Shows | Unit | Person acts on it | Best for | Avoid when |
| --- | --- | --- | --- | --- | --- |
| Progress indicators | Task completion, or that work is happening | A running task | Can cancel or pause `progress-indicators/best-practices/when-its-feasible-let-people-halt` | Waits, downloads, refresh | Value is a level, not a task `gauges/best-practices/write-succinct-labels-that-describe-the` |
| Gauges | A value within a range | A level | Reads only (HIG silent on editing) | Capacity, temperature `gauges/best-practices/write-succinct-labels-that-describe-the` | A task is running |
| Activity rings | Move, Exercise, Stand | One person's day | Reads only | Health and fitness apps `activity-rings/best-practices/display-activity-rings-when-theyre-relevant` | Any other data `activity-rings/best-practices/use-activity-rings-only-to-show` |
| Rating indicators | A rank or rating | An item | Changes it in place `rating-indicators/best-practices/make-it-easy-to-change-rankings` | Ranked lists on macOS | Edit needs a separate screen |

## Platform notes
- **iOS, iPadOS:** refresh content on a schedule, and give a refresh control a title only for value such as last update time `progress-indicators/platform-considerations/ios-ipados/refresh-content-controls/perform-automatic-content-updates` `progress-indicators/platform-considerations/ios-ipados/refresh-content-controls/supply-a-short-title-only-if`
- **macOS:** a spinner suits background status and tight spaces, unlabeled `progress-indicators/platform-considerations/macos/prefer-an-activity-indicator-spinner-to` `progress-indicators/platform-considerations/macos/avoid-labeling-a-spinning-progress-indicator`; large capacities suit the continuous gauge style `gauges/platform-considerations/macos/consider-using-the-continuous-style-for`
- **watchOS:** avoid loading indicators where possible, but show one rather than a blank screen for a short wait `loading/platform-considerations/watchos/as-much-as-possible-avoid-showing`; do not show an indeterminate one, and say people will be notified `feedback/platform-considerations/watchos/avoid-displaying-an-indeterminate-progress-indicator`
- **Availability:** gauges are not on tvOS, activity rings only on iOS, iPadOS and watchOS, rating indicators only on macOS (from the cards).

## Common mistakes
- **Indeterminate when length is measurable:** use determinate `progress-indicators/best-practices/when-possible-use-a-determinate-progress`
- **Spinner that turns into a bar:** keep one style `progress-indicators/best-practices/dont-switch-from-the-circular-style`
- **Frozen or uneven indicator:** keep it moving and even `progress-indicators/best-practices/keep-progress-indicators-moving-so-people` `progress-indicators/best-practices/be-as-accurate-as-possible-when`
- **Rings as decoration, branding or generic progress:** reserve them `activity-rings/best-practices/dont-use-activity-rings-for-decoration` `activity-rings/best-practices/dont-use-activity-rings-for-branding`
- **Long gauge labels:** shorten them `gauges/best-practices/write-succinct-labels-that-describe-the`
- **Sending people away to change a rating:** edit in place `rating-indicators/best-practices/make-it-easy-to-change-rankings`

## Not settled by the HIG
- Gauge versus progress indicator for a bar-like value: no explicit boundary [HIG none].
- Whether a rating indicator is right outside macOS, and when to prefer it over a gauge: no guidance [HIG none].
- When a wait is long enough to need an indicator: no threshold [HIG none].

## In other media
- **Mobile (any OS) and mobile web:** [HIG] determinate-first, honest pacing, stall feedback `progress-indicators/best-practices/when-possible-use-a-determinate-progress`; rings are [HIG none].
- **Desktop web:** [HIG] progress and gauge rules apply; rating rules apply directly `rating-indicators/best-practices/make-it-easy-to-change-rankings`.
- **Slides and card news:** [HIG transfer] gauge labels and gradients suit a static meter `gauges/best-practices/write-succinct-labels-that-describe-the`; live progress is [HIG none]; do not imitate the rings `activity-rings/best-practices/use-activity-rings-only-to-show`
