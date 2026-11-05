---
slug: charts
title: "Charts"
kind: component
group: "Content"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/charts
---

# Charts

**In one line:** A visual display of data in which marks, axes and labels let people compare values, see trends and spot patterns quickly.

## Why it exists
Numbers in a table are hard to compare at a glance. A chart turns them into a picture, but only if its mark type, axes and summary fit the question people are asking `charts/marks/choose-a-mark-type-based-on`. The chart also has to make its main point without a long study, and has to work for people who perceive it differently (Simplicity, Responsibility) `charts/descriptive-content/summarize-the-main-message-of-your` `charts/best-practices/make-every-chart-in-your-app`.

## Use it when
- People need to compare values, follow a trend or inspect single values, and a mark type matches that job `charts/marks/choose-a-mark-type-based-on`
- A mix of marks explains the data better than one, such as points on a line `charts/marks/consider-combining-mark-types-when-it`
- The data has a single clear message you can state in a short title and subtitle `charts/descriptive-content/summarize-the-main-message-of-your`

## Don't use it when
- The values are mostly text or need exact row-by-row reading: use [Lists and tables](lists-and-tables.md) instead `lists-and-tables/best-practices/prefer-displaying-text-in-a-list`
- The chart would need complex interaction on a watch: keep it glanceable and move deeper exploration to a companion app (no HIG alternative component named) `charts/platform-considerations/watchos/in-general-avoid-requiring-complex-chart`
- The critical information is only reachable through tapping or hovering: show it in the main view instead `charts/best-practices/let-people-interact-with-the-data`

## Cost to the user
A chart asks people to read axes, marks and labels before they get the point, so a clear title, summary and quiet supporting elements lower that cost `charts/descriptive-content/write-descriptions-that-help-people-understand` `charts/best-practices/establish-a-consistent-visual-hierarchy-that`. Too many grid lines or odd tick intervals add effort `charts/axes/tailor-the-appearance-of-grid-lines` `charts/axes/prefer-familiar-sequences-of-values-in`.

## Principles at stake
- **Simplicity:** the data stands out most, and everything else supports it quietly `charts/best-practices/establish-a-consistent-visual-hierarchy-that`
- **Purpose:** the mark type and axis bounds exist to answer one question `charts/marks/choose-a-mark-type-based-on` `charts/axes/define-the-value-of-the-lower`
- **Responsibility:** a chart must be usable through VoiceOver, keyboard and color-independent cues `charts/best-practices/make-every-chart-in-your-app` `charts/color/avoid-relying-solely-on-color-to`
- **Agency:** exploration is optional, never required to get the main point `charts/best-practices/let-people-interact-with-the-data`

## Key rules
- Pick bar, line, point or other marks by what people should learn from the data `charts/marks/choose-a-mark-type-based-on`
- Fix the axis range when set limits carry meaning (like a charge meter); let it adapt when values vary widely `charts/axes/use-a-fixed-or-dynamic-axis`
- Choose the lower bound to suit the mark and the job: zero helps compare bars but can hide small differences `charts/axes/define-the-value-of-the-lower`
- Label ticks with familiar sequences, such as steps of five `charts/axes/prefer-familiar-sequences-of-values-in`
- Use fewer, lighter grid lines when people can inspect the data directly `charts/axes/tailor-the-appearance-of-grid-lines`
- Give the chart an informative title and labels, and state the takeaway briefly `charts/descriptive-content/write-descriptions-that-help-people-understand` `charts/descriptive-content/summarize-the-main-message-of-your`
- Back up color with shapes or patterns, and add small gaps between adjacent colored segments `charts/color/avoid-relying-solely-on-color-to` `charts/color/aid-comprehension-by-adding-visual-separation`
- Where marks are too small to hit, make the whole plot area the target so people can scrub `charts/best-practices/make-it-easy-for-everyone-to`
- Make important changes to marks or axes noticeable with more than animation alone `charts/best-practices/help-people-notice-important-changes-in`
- Line up the chart's leading edge with neighboring views `charts/best-practices/align-a-chart-with-surrounding-interface`

## Anatomy and content
Compact spaces: widen the plot by shortening vertical-axis labels and moving units into the title `charts/best-practices/in-a-compact-environment-maximize-the`. For assistive technology, give a title and summary, describe chart type, axes and bounds, and label either stretches (for trends) or each mark (for exact values) `charts/enhancing-the-accessibility-of-a-chart/consider-using-audio-graphs-to-give` `charts/enhancing-the-accessibility-of-a-chart/write-accessibility-labels-that-support-the`. Keep visible axis text out of what assistive tech reads `charts/enhancing-the-accessibility-of-a-chart/hide-visible-text-labels-for-axes`. Interactive charts need a predictable keyboard or Switch Control path `charts/best-practices/make-an-interactive-chart-easy-to`.

## Platform differences
- **watchOS:** avoid charts that need complex interaction; favor glanceable info `charts/platform-considerations/watchos/in-general-avoid-requiring-complex-chart`
- **iOS, iPadOS, macOS, tvOS, visionOS:** no additional considerations.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] mark, axis, color and description rules apply as written; widen the plot in narrow layouts `charts/best-practices/in-a-compact-environment-maximize-the`
- **Desktop web:** [HIG] the same rules apply, including a clear keyboard path through interactive charts `charts/best-practices/make-an-interactive-chart-easy-to`
- **Slides:** [HIG transfer] mark choice, one-line takeaway, axes and color cues carry over; interaction and VoiceOver rules do not `charts/descriptive-content/summarize-the-main-message-of-your` `charts/color/avoid-relying-solely-on-color-to`
- **Card news:** [HIG transfer] state the key message as a title and subtitle, and keep the data dominant `charts/descriptive-content/summarize-the-main-message-of-your` `charts/best-practices/establish-a-consistent-visual-hierarchy-that`

## Related
[Lists and tables](lists-and-tables.md) · [Charting data](https://developer.apple.com/design/human-interface-guidelines/charting-data)
