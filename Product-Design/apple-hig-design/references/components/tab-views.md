---
slug: tab-views
title: "Tab views"
kind: component
group: "Layout and organization"
platforms: [macOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/tab-views
decision_trees: [navigation-structure]
---

# Tab views

**In one line:** A set of mutually exclusive panes in the same area, switched with a tabbed control.

## Why it exists
Related content can share one space when only one piece is needed at a time. A tab view encloses the panes and shows all choices at once, so one click gets people there (Familiarity, Simplicity) `tab-views/best-practices/use-a-tab-view-to-present` `tab-views/best-practices/avoid-using-a-pop-up-button`.

## Use it when
- Areas of content are closely related `tab-views/best-practices/use-a-tab-view-to-present`
- Each pane can be self-contained `tab-views/best-practices/make-sure-the-controls-within-a`

## Don't use it when
- You have more than six tabs: consider a pop-up button menu instead `tab-views/best-practices/avoid-providing-more-than-six-tabs`
- You are tempted to switch panes through a pop-up button when tabs fit: prefer tabs, which need one click and show all choices `tab-views/best-practices/avoid-using-a-pop-up-button`
- On iOS or iPadOS: use [Segmented controls](segmented-controls.md) (per the source page, tab views are not supported there)

## Cost to the user
Tabs hide all but one pane, but cost one click and show every choice. More than six tabs overwhelm and cause layout trouble `tab-views/best-practices/avoid-providing-more-than-six-tabs`.

## Principles at stake
- **Familiarity:** people expect tabs to hold related content `tab-views/best-practices/use-a-tab-view-to-present`
- **Simplicity:** a limited count and self-contained panes `tab-views/best-practices/avoid-providing-more-than-six-tabs` `tab-views/best-practices/make-sure-the-controls-within-a`
- **Craft:** noun labels in title-style capitalization help people predict contents `tab-views/best-practices/provide-a-label-for-each-tab`

## Key rules
- Group closely related areas in one tab view `tab-views/best-practices/use-a-tab-view-to-present`
- Controls in a pane act only on that pane `tab-views/best-practices/make-sure-the-controls-within-a`
- Label each tab with a noun or short noun phrase in title-style capitalization `tab-views/best-practices/provide-a-label-for-each-tab`
- Avoid a pop-up button for switching unless there are too many panes `tab-views/best-practices/avoid-using-a-pop-up-button`
- Keep to six tabs or fewer `tab-views/best-practices/avoid-providing-more-than-six-tabs`
- On Mac, inset the tab view with window-body margin on all sides `tab-views/anatomy/in-general-inset-a-tab-view`

## Anatomy and content
The tabbed control sits on the top edge of the content area. It can be hidden when the app switches panes by itself; the content area can then be borderless, bezeled or lined (see the source page).

## Platform differences
- **macOS:** inset the tab view from window edges `tab-views/anatomy/in-general-inset-a-tab-view`
- **watchOS:** tab views appear as page controls (see the source page).
- **Not available on:** iOS, iPadOS, tvOS, visionOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] keep a small set of related tabs with noun labels `tab-views/best-practices/provide-a-label-for-each-tab`
- **Desktop web:** [HIG] tabs of related, self-contained panes, six or fewer `tab-views/best-practices/avoid-providing-more-than-six-tabs`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Tab bars](tab-bars.md) · [Segmented controls](segmented-controls.md) · see [Decision tree](../decision-trees/navigation-structure.md)
