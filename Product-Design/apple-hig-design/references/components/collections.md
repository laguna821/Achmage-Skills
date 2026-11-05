---
slug: collections
title: "Collections"
kind: component
group: "Layout and organization"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/collections
decision_trees: [showing-collections]
---

# Collections

**In one line:** A scrollable arrangement of items, usually in rows or a grid, that suits content with images or items of differing sizes.

## Why it exists
Some content, such as photos or media, is mostly visual and varied in size, and a text row would waste it. A collection lays items out so people can scan and pick them. The standard layouts are expected, and custom ones can confuse people or draw needless attention (Familiarity, Simplicity) `collections/best-practices/use-the-standard-row-or-grid`.

## Use it when
- Items are images, or differ widely in size `collections/best-practices/consider-using-a-table-instead-of`
- People pick from a set of visual items and need to reach each one easily `collections/best-practices/make-it-easy-to-choose-an`
- Items get added, removed or reordered and people need to see what changed `collections/best-practices/consider-using-animations-to-provide-feedback`

## Don't use it when
- The content is text: use [Lists and tables](lists-and-tables.md) instead `collections/best-practices/consider-using-a-table-instead-of`
- The layout would shift while people interact, unless they asked for it: keep it stable `collections/platform-considerations/ios-ipados/use-caution-when-making-dynamic-layout`

## Cost to the user
Hard-to-reach items frustrate people before they reach content `collections/best-practices/make-it-easy-to-choose-an`. Layouts that change under their hands are disorienting on iOS and iPadOS `collections/platform-considerations/ios-ipados/use-caution-when-making-dynamic-layout`. Custom gestures add learning, so build on tap, hold and swipe `collections/best-practices/add-custom-interactions-when-necessary`.

## Principles at stake
- **Familiarity:** stay with the default row or grid and standard gestures `collections/best-practices/use-the-standard-row-or-grid` `collections/best-practices/add-custom-interactions-when-necessary`
- **Simplicity:** pick the plainer list when content is text `collections/best-practices/consider-using-a-table-instead-of`
- **Agency:** change layout in response to an explicit action, not on its own `collections/platform-considerations/ios-ipados/use-caution-when-making-dynamic-layout`

## Key rules
- Use the default row or grid layout wherever possible `collections/best-practices/use-the-standard-row-or-grid`
- Show text content in a scrollable list or table `collections/best-practices/consider-using-a-table-instead-of`
- Leave enough padding around images so focus or hover effects show and nothing overlaps `collections/best-practices/make-it-easy-to-choose-an`
- Add custom gestures only for extra actions, on top of tap to select, hold to edit and swipe to scroll `collections/best-practices/add-custom-interactions-when-necessary`
- Animate insertions, deletions and reordering as feedback `collections/best-practices/consider-using-animations-to-provide-feedback`
- On iOS and iPadOS, change layout dynamically with care, preferably after an explicit action `collections/platform-considerations/ios-ipados/use-caution-when-making-dynamic-layout`

## Platform differences
- **iOS, iPadOS:** be cautious with dynamic layout changes `collections/platform-considerations/ios-ipados/use-caution-when-making-dynamic-layout`
- **macOS, tvOS, visionOS:** no additional considerations.
- **Not available on:** watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] grids for visual items, lists for text, no layout shifts mid-interaction `collections/best-practices/use-the-standard-row-or-grid`
- **Desktop web:** [HIG] the same; leave space for hover effects `collections/best-practices/make-it-easy-to-choose-an`
- **Slides:** [HIG transfer] a plain, regular grid of items beats a custom arrangement `collections/best-practices/use-the-standard-row-or-grid`
- **Card news:** [HIG transfer] use a regular grid for image sets and text lists for text `collections/best-practices/consider-using-a-table-instead-of`

## Related
[Lists and tables](lists-and-tables.md) · [Image views](image-views.md) · [Layout](https://developer.apple.com/design/human-interface-guidelines/layout) · see [Decision tree](../decision-trees/showing-collections.md)
