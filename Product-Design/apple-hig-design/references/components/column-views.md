---
slug: column-views
title: "Column views"
kind: component
group: "Layout and organization"
platforms: [macOS]
source: https://developer.apple.com/design/human-interface-guidelines/column-views
decision_trees: [showing-collections]
---

# Column views

**In one line:** A Mac view that shows a data hierarchy as side-by-side columns, each one listing the children of the item selected before it.

## Why it exists
Deep hierarchies are hard to keep in mind. Columns show each level next to the last, so people see where they are and can step back. The HIG gives only a few rules for the page (see the gap note below).

## Use it when
- Data is hierarchical and people benefit from seeing several levels at once `column-views/best-practices/show-the-root-level-of-your`
- Selecting a leaf item should show its details or a preview `column-views/best-practices/consider-showing-information-about-the-selected`

## Don't use it when
- The hierarchy should be expandable in place with indentation: see [Outline views](outline-views.md) instead (named as related, not as a rule) `column-views/best-practices/show-the-root-level-of-your`
- The data is flat text rows: see [Lists and tables](lists-and-tables.md) instead (named as related, not as a rule) `column-views/best-practices/show-the-root-level-of-your`

## Cost to the user
Each level adds a column, so width is the cost. Resizable columns let people reveal clipped names `column-views/best-practices/let-people-resize-columns`.

## Principles at stake
- **Familiarity:** the leftmost column is the top tier, so people know where to scroll to start over `column-views/best-practices/show-the-root-level-of-your`
- **Agency:** people can resize columns to see what is clipped `column-views/best-practices/let-people-resize-columns`
- **Simplicity:** a detail pane for selected leaf items avoids an empty area `column-views/best-practices/consider-showing-information-about-the-selected`

## Key rules
- Put the root level in the leftmost column `column-views/best-practices/show-the-root-level-of-your`
- When the selection has no children, show its details or a preview `column-views/best-practices/consider-showing-information-about-the-selected`
- Let people resize columns, especially when names are long `column-views/best-practices/let-people-resize-columns`

## Platform differences
- **macOS:** the only supported platform.
- **Not available on:** iOS, iPadOS, tvOS, visionOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] a drill-down hierarchy keeps its root first, and shows details for leaf items `column-views/best-practices/show-the-root-level-of-your`
- **Desktop web:** [HIG transfer] a multi-column file-browser pattern can follow the same rules, with resizable columns `column-views/best-practices/let-people-resize-columns`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Lists and tables](lists-and-tables.md) · [Outline views](outline-views.md) · [Split views](split-views.md) · see [Decision tree](../decision-trees/showing-collections.md)

Gap note: the HIG page has only three rules and no stated alternatives, so Why it exists is thin.
