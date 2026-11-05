---
slug: complications
title: "Complications"
kind: component
group: "System experiences"
platforms: [watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/complications
decision_trees: [beyond-the-app]
---

# Complications

**In one line:** Small, glanceable pieces of an app's information on the Apple Watch face that also open the app.

## Why it exists
A watch face is checked in moments. A complication puts the most relevant, changing information there so people need not open the app `complications/best-practices/identify-essential-dynamic-content-that-people`. It serves Purpose and Flexibility: show what matters now, and work across faces and display modes `complications/best-practices/support-all-complication-families-when-possible`.

## Use it when
- You have essential, changing information people want to glance at `complications/best-practices/identify-essential-dynamic-content-that-people`
- Each complication can open the most relevant part of the app through its own deep link `complications/best-practices/define-a-different-deep-link-for`
- A closed, open or segmented gauge fits the data (closed for a share of a whole, open or segmented for ranges with arbitrary limits) `complications/visual-design/choose-a-ring-or-gauge-style`

## Don't use it when
- You only want a launcher: static complications may lose their prominent spot, so show dynamic content `complications/best-practices/identify-essential-dynamic-content-that-people`
- No useful data fits a family: show an image representing the app, such as the icon, rather than skipping the family `complications/best-practices/support-all-complication-families-when-possible`
- The content is sensitive and visible to others nearby: protect it, since the Always-On display can leave it visible `complications/best-practices/keep-privacy-in-mind`

## Cost to the user
A complication costs almost no attention when it works: a glance. Cost appears when it is stale, static or sends every tap to the same place `complications/best-practices/define-a-different-deep-link-for`. Thin lines are easy to miss in a quick look, particularly while the wearer is in motion `complications/visual-design/when-creating-complication-content-generally-use`.

## Principles at stake
- **Purpose:** essential, current data and well-timed updates `complications/best-practices/carefully-consider-when-to-update-data`
- **Flexibility:** every family, multiple complications per family, and tinted mode `complications/best-practices/consider-creating-multiple-complications-for-each` `complications/visual-design/recognize-that-people-might-prefer-to`
- **Responsibility:** keep private information from onlookers `complications/best-practices/keep-privacy-in-mind`
- **Craft:** line weight, placeholders and tinted variants `complications/visual-design/provide-a-set-of-static-placeholder`

## Key rules
- Show essential dynamic content rather than only a launcher `complications/best-practices/identify-essential-dynamic-content-that-people`
- Support all families where you can; fall back to an app-representing image `complications/best-practices/support-all-complication-families-when-possible`
- Consider several complications per family, perhaps with a preconfigured shareable watch face `complications/best-practices/consider-creating-multiple-complications-for-each`
- Give each complication its own deep link `complications/best-practices/define-a-different-deep-link-for`
- Help prevent sensitive information on the face from being seen by others `complications/best-practices/keep-privacy-in-mind`
- Pick timeline entry times to match when data is most useful, since updates and stored entries are limited `complications/best-practices/carefully-consider-when-to-update-data`
- Check tinted mode: do not rely on color alone, and supply a tinted image when full color degrades `complications/visual-design/make-sure-images-look-good-in`
- Draw content with lines at least two points wide `complications/visual-design/when-creating-complication-content-generally-use`
- Supply static placeholder images for every complication, remembering sizes can differ `complications/visual-design/provide-a-set-of-static-placeholder`

## Anatomy and content
Gauge style communicates the kind of value: closed for a share of a whole, open or segmented for arbitrary ranges `complications/visual-design/choose-a-ring-or-gauge-style`. Tinted mode turns complications grayscale and tints them with one wearer-chosen color `complications/visual-design/recognize-that-people-might-prefer-to`.

## Platform differences
No platform-specific guidance beyond watchOS itself.
- **Not available on:** iOS, iPadOS, macOS, tvOS, visionOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] lessons for glanceable widgets: dynamic content and distinct deep links `complications/best-practices/identify-essential-dynamic-content-that-people`
- **Desktop web:** [HIG none]
- **Slides:** [HIG transfer] gauge style choice and line-weight legibility apply to small data visuals `complications/visual-design/choose-a-ring-or-gauge-style` `complications/visual-design/when-creating-complication-content-generally-use`
- **Card news:** [HIG transfer] same, plus not relying on color alone `complications/visual-design/make-sure-images-look-good-in`

## Related
[Watch faces](https://developer.apple.com/design/human-interface-guidelines/watch-faces) · [Gauges](gauges.md) · [Controls](controls.md) · see [Decision tree](../decision-trees/beyond-the-app.md)
