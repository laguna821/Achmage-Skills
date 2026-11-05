---
slug: page-controls
title: "Page controls"
kind: component
group: "Presentation"
platforms: [iOS, iPadOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/page-controls
decision_trees: [navigation-structure]
---

# Page controls

**In one line:** A row of small dots showing how many pages exist in a flat, ordered list and which one is current.

## Why it exists
When content is split into peer pages, people need to know there are more and where they are in the sequence. Page controls give that position at a glance. They only make sense for an ordered line of pages `page-controls/best-practices/use-page-controls-to-represent-movement`. The principle is Familiarity plus Simplicity: a quiet indicator, not extra navigation.

## Use it when
- Content is a short, ordered sequence of peer pages `page-controls/best-practices/use-page-controls-to-represent-movement`
- On tvOS, pages are full-screen, content-rich peers `page-controls/platform-considerations/tvos/use-page-controls-on-collections-of`
- On watchOS, several views each have a clear purpose and are reached by vertical paging `page-controls/platform-considerations/watchos/use-vertical-pagination-to-separate-multiple`

## Don't use it when
- The structure is hierarchical or nonsequential: use [Sidebars](sidebars.md) or a split view instead `page-controls/best-practices/use-page-controls-to-represent-movement`
- There are many pages (past about ten): use a layout such as a grid that allows any-order access `page-controls/best-practices/although-page-controls-can-handle-any`
- You are on macOS: the component is not available (no HIG alternative named)

## Cost to the user
Light: it takes a thin strip and no decision. The cost shows with many pages, where dots become hard to read and stepping one by one is slow `page-controls/best-practices/although-page-controls-can-handle-any`.

## Principles at stake
- **Simplicity:** simple indicators, at most two image kinds `page-controls/customizing-indicators/avoid-using-more-than-two-different`
- **Familiarity:** centered near the bottom, system-colored `page-controls/best-practices/center-a-page-control-at-the` `page-controls/customizing-indicators/avoid-coloring-indicator-images`
- **Craft:** custom images only when they add meaning `page-controls/customizing-indicators/customize-the-default-indicator-image-only`

## Key rules
- Use it only for movement through an ordered sequence `page-controls/best-practices/use-page-controls-to-represent-movement`
- Center it horizontally near the bottom of the view or window `page-controls/best-practices/center-a-page-control-at-the`
- Avoid showing many dots; move to a grid past roughly ten pages `page-controls/best-practices/although-page-controls-can-handle-any`
- Keep custom images simple: no intricate shapes, negative space, text or inner lines `page-controls/customizing-indicators/make-sure-custom-indicator-images-are`
- Change the default image only if the new one adds meaning, such as a bookmark symbol `page-controls/customizing-indicators/customize-the-default-indicator-image-only`
- Use at most two kinds of indicator image `page-controls/customizing-indicators/avoid-using-more-than-two-different`
- Let the system color the indicators `page-controls/customizing-indicators/avoid-coloring-indicator-images`

## Platform differences
- **iOS, iPadOS:** animate the transition only for taps, not while scrubbing; to allow scrubbing choose the automatic or prominent background, not minimal `page-controls/platform-considerations/ios-ipados/avoid-animating-page-transitions-during-scrubbing` `page-controls/platform-considerations/ios-ipados/avoid-supporting-the-scrubber-when-you`
- **tvOS:** for full-screen peer pages, without extra controls on them `page-controls/platform-considerations/tvos/use-page-controls-on-collections-of`
- **watchOS:** vertical pages, each fitting one screen height where possible; place variable-height pages after fixed ones `page-controls/platform-considerations/watchos/consider-limiting-the-content-of-an`
- **visionOS:** no additional considerations.
- **Not available on:** macOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] carousel dots follow the same position, count and color rules `page-controls/best-practices/center-a-page-control-at-the`
- **Desktop web:** [HIG] a carousel indicator, centered below, switching to a grid when long `page-controls/best-practices/although-page-controls-can-handle-any`
- **Slides:** [HIG transfer] a small progress indicator for an ordered deck, kept simple `page-controls/customizing-indicators/avoid-using-more-than-two-different`
- **Card news:** [HIG transfer] swipe-card dots mark position in a short ordered series `page-controls/best-practices/use-page-controls-to-represent-movement`

## Related
[Tab bars](tab-bars.md) · [Scroll views](scroll-views.md) · see [Decision tree](../decision-trees/navigation-structure.md)
