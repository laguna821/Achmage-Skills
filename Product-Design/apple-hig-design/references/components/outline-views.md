---
slug: outline-views
title: "Outline views"
kind: component
group: "Layout and organization"
platforms: [macOS]
source: https://developer.apple.com/design/human-interface-guidelines/outline-views
decision_trees: [showing-collections]
---

# Outline views

**In one line:** A Mac table whose first column shows expandable levels of a hierarchy, with other columns holding attributes.

## Why it exists
Hierarchical data such as folders needs both structure and detail. An outline view puts the structure in the first column and the attributes beside it, so people can open and close levels as needed (Simplicity, Flexibility) `outline-views/best-practices/expose-data-hierarchy-in-the-first`.

## Use it when
- Data is truly hierarchical `outline-views/best-practices/use-a-table-instead-of-an`
- People will explore deep levels and need quick expand and collapse `outline-views/best-practices/make-it-easy-for-people-to`
- Long hierarchies need search or sorting `outline-views/best-practices/consider-offering-a-search-field-to` `outline-views/best-practices/consider-letting-people-click-column-headings`

## Don't use it when
- The data is not hierarchical: use a plain [Lists and tables](lists-and-tables.md) table instead `outline-views/best-practices/use-a-table-instead-of-an`

## Cost to the user
Deep hierarchies take clicks to open. Easy expand and collapse and remembered expansion state reduce that cost, since people need not navigate back to the same place `outline-views/best-practices/make-it-easy-for-people-to` `outline-views/best-practices/retain-peoples-expansion-choices`.

## Principles at stake
- **Simplicity:** hierarchy only in the first column; other columns hold attributes `outline-views/best-practices/expose-data-hierarchy-in-the-first`
- **Agency:** people can sort, resize, edit and search `outline-views/best-practices/let-people-resize-columns` `outline-views/best-practices/let-people-edit-data-if-it`
- **Familiarity:** single-click editing and double-click opening match expectations `outline-views/best-practices/let-people-edit-data-if-it`

## Key rules
- Use an outline view only for hierarchical data `outline-views/best-practices/use-a-table-instead-of-an`
- Show hierarchy in the first column only `outline-views/best-practices/expose-data-hierarchy-in-the-first`
- Give columns noun headings without trailing colons, and add a label if a single column has none `outline-views/best-practices/use-descriptive-column-headings-to-provide`
- Consider click-to-sort headings, sorting within each level `outline-views/best-practices/consider-letting-people-click-column-headings`
- Let people resize columns `outline-views/best-practices/let-people-resize-columns`
- Make expanding and collapsing easy, for example a modifier-click to open all subfolders `outline-views/best-practices/make-it-easy-for-people-to`
- Remember and restore expanded levels `outline-views/best-practices/retain-peoples-expansion-choices`
- Consider alternating row colors in wide outlines `outline-views/best-practices/consider-using-alternating-row-colors-in`
- Allow cell editing with a single click, and optional reorder, add and remove `outline-views/best-practices/let-people-edit-data-if-it`
- Truncate in the middle, not at the end `outline-views/best-practices/consider-using-a-centered-ellipsis-to`
- Offer a toolbar search field for long outlines `outline-views/best-practices/consider-offering-a-search-field-to`

## Platform differences
- **macOS:** the only supported platform.
- **Not available on:** iOS, iPadOS, tvOS, visionOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] a tree list should restore expanded state and use middle truncation `outline-views/best-practices/retain-peoples-expansion-choices` `outline-views/best-practices/consider-using-a-centered-ellipsis-to`
- **Desktop web:** [HIG] tree tables follow these rules directly: sortable, resizable, searchable `outline-views/best-practices/let-people-resize-columns`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Column views](column-views.md) · [Lists and tables](lists-and-tables.md) · [Split views](split-views.md) · see [Decision tree](../decision-trees/showing-collections.md)
