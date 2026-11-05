---
slug: carekit
title: "CareKit"
kind: technology
group: "Technologies"
platforms: [iOS, iPadOS]
source: https://developer.apple.com/design/human-interface-guidelines/carekit
---

# CareKit

**In one line:** A framework for apps where people follow a care plan: tasks, charts, contacts and notifications built from ready-made views.

## Why it exists
Care apps ask people for health data and daily effort. Privacy and clarity matter most: a clear policy, access requests tied to context, and simple task and chart views `carekit/data-and-privacy/provide-a-coherent-privacy-policy` `carekit/data-and-privacy/healthkit-integration/request-access-to-health-data-only`. Notifications and branding should help, not nag or advertise `carekit/notifications/minimize-notifications`.

## Use it when
- People follow a care plan with recurring tasks, such as medication or activities `carekit/carekit-views/tasks/use-the-simple-style-for-a`
- Progress, narratives and trends are worth showing in charts `carekit/carekit-views/charts/consider-highlighting-narratives-and-trends-to`
- Contact with a care team should be easy to reach, with colors telling members apart `carekit/carekit-views/contact-views/consider-using-color-to-categorize-care`

## Don't use it when
- You would ask for health data at launch: ask in context, such as weight when logging weight `carekit/data-and-privacy/healthkit-integration/request-access-to-health-data-only`
- You want in-app screens that change health data sharing: leave that to system privacy settings `carekit/data-and-privacy/healthkit-integration/manage-health-data-sharing-solely-through`
- The symbol would be a corporate logo or purely decorative: choose one tied to the app or to health `carekit/symbols-and-branding/design-a-relevant-care-symbol`

## Cost to the user
People repeat tasks daily, so each extra word, tap or notification adds up. Keep task text plain, notifications few and merged, and let people act from a detail view without opening the app `carekit/carekit-views/tasks/combine-accuracy-with-simplicity-when-describing` `carekit/notifications/minimize-notifications` `carekit/notifications/consider-providing-a-detail-view`.

## Principles at stake
- **Responsibility:** privacy policy URL, contextual access requests, system-controlled sharing `carekit/data-and-privacy/provide-a-coherent-privacy-policy` `carekit/data-and-privacy/healthkit-integration/manage-health-data-sharing-solely-through`
- **Simplicity:** pick the simplest task style that fits `carekit/carekit-views/tasks/use-the-checklist-style-to-display`
- **Purpose:** charts that surface narratives; subtle, non-advertising branding `carekit/carekit-views/charts/consider-highlighting-narratives-and-trends-to` `carekit/symbols-and-branding/incorporate-refined-unobtrusive-branding`
- **Agency:** act on notifications without opening the app `carekit/notifications/consider-providing-a-detail-view`

## Key rules
- Provide a privacy policy URL at submission `carekit/data-and-privacy/provide-a-coherent-privacy-policy`
- Add a few sentences to the permission screen on why you need the data; skip duplicate custom screens `carekit/data-and-privacy/healthkit-integration/clarify-your-apps-intent-by-adding`
- Match the task style to the task: simple for one step, instructions for extra text, log for recorded events, checklist for multistep, grid for compact multistep `carekit/carekit-views/tasks/use-the-instructions-style-when-you` `carekit/carekit-views/tasks/use-the-log-style-to-help` `carekit/carekit-views/tasks/use-the-grid-style-to-display`
- Use color to help recognize categories, but never color alone `carekit/carekit-views/tasks/consider-using-color-to-reinforce-the`
- Add videos or images for multistep or complex tasks `carekit/carekit-views/tasks/consider-supplementing-multistep-or-complex-tasks`
- Label charts briefly, say the time unit, and add a legend when colors aren't obvious `carekit/carekit-views/charts/label-chart-elements-clearly-and-succinctly` `carekit/carekit-views/charts/clearly-denote-units-of-time` `carekit/carekit-views/charts/consider-providing-a-legend-to-add`
- Use clearly different colors for different data, and consolidate large sets `carekit/carekit-views/charts/use-distinct-colors` `carekit/carekit-views/charts/consolidate-large-data-sets-for-greater`
- Offset data so small values stay visible next to large ones `carekit/carekit-views/charts/if-necessary-offset-data-to-keep`

## Platform differences
- **iOS, iPadOS:** no additional considerations.
- **Not available on:** macOS, tvOS, visionOS, watchOS

## In other media
- **Mobile (any OS) and mobile web:** [HIG] task styles, notifications and permission copy apply to any health-style app `carekit/data-and-privacy/healthkit-integration/clarify-your-apps-intent-by-adding`
- **Desktop web:** [HIG transfer] chart labeling and color rules apply to dashboards `carekit/carekit-views/charts/use-distinct-colors`
- **Slides:** [HIG transfer] chart clarity rules apply to data slides `carekit/carekit-views/charts/label-chart-elements-clearly-and-succinctly`
- **Card news:** [HIG transfer] color-plus-label coding and plain wording `carekit/carekit-views/tasks/combine-accuracy-with-simplicity-when-describing`

## Related
[HealthKit](healthkit.md) · [Charting data](https://developer.apple.com/design/human-interface-guidelines/charting-data)
