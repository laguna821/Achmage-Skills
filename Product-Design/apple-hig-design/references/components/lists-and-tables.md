---
slug: lists-and-tables
title: "Lists and tables"
kind: component
group: "Layout and organization"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/lists-and-tables
decision_trees: [showing-collections]
---

# Lists and tables

**In one line:** Rows of data in a single scrolling column (list) or in several columns (table), best for text people need to scan.

## Why it exists
Text is easiest to scan and compare in rows. Lists and tables give structure and context, with styles that signal grouping or hierarchy and selection feedback that shows where people are or what they chose (Familiarity, Simplicity) `lists-and-tables/best-practices/prefer-displaying-text-in-a-list` `lists-and-tables/best-practices/provide-appropriate-feedback-when-people-select`.

## Use it when
- Content is mostly text `lists-and-tables/best-practices/prefer-displaying-text-in-a-list`
- People may need to rearrange or edit rows `lists-and-tables/best-practices/let-people-edit-a-table-when`
- Rows hold a short label with a small leading image, or other layouts matching each row's content `lists-and-tables/style/choose-a-row-style-that-fits`

## Don't use it when
- Items differ widely in size, or many images are shown: use [Collections](collections.md) instead `lists-and-tables/best-practices/prefer-displaying-text-in-a-list`
- On Mac, the data is hierarchical: use [Outline views](outline-views.md) instead `lists-and-tables/platform-considerations/macos/use-an-outline-view-instead-of`

## Cost to the user
Long text in rows wraps or truncates and slows scanning, so keep it brief or show titles with details elsewhere `lists-and-tables/content/keep-item-text-succinct-so-row`. On the watch, long lists can worry people when expected items are missing `lists-and-tables/platform-considerations/watchos/when-possible-limit-the-number-of`.

## Principles at stake
- **Simplicity:** brief rows and the right style keep scanning easy `lists-and-tables/content/keep-item-text-succinct-so-row`
- **Familiarity:** selection feedback and platform styles follow what people expect `lists-and-tables/style/choose-a-table-or-list-style` `lists-and-tables/best-practices/provide-appropriate-feedback-when-people-select`
- **Agency:** reordering, sorting and resizing put control with people `lists-and-tables/best-practices/let-people-edit-a-table-when` `lists-and-tables/platform-considerations/macos/when-it-provides-value-let-people`

## Key rules
- Prefer lists or tables for text, and collections for varied sizes or many images `lists-and-tables/best-practices/prefer-displaying-text-in-a-list`
- Allow editing when sensible, such as reordering even if adding and removing are not possible `lists-and-tables/best-practices/let-people-edit-a-table-when`
- Match selection feedback to the list: persistent highlight for hierarchy navigation, brief highlight plus checkmark for option lists `lists-and-tables/best-practices/provide-appropriate-feedback-when-people-select`
- Keep item text succinct, or show only titles and reveal the rest in a detail view `lists-and-tables/content/keep-item-text-succinct-so-row`
- When text must clip, keep it recognizable with a middle ellipsis `lists-and-tables/content/consider-ways-to-preserve-readability-of`
- Give multicolumn tables noun headings in title-style capitalization with no ending punctuation; add a label or header to a single column `lists-and-tables/content/use-descriptive-column-headings-in-a`
- Choose table, list and row styles that fit the data and platform `lists-and-tables/style/choose-a-table-or-list-style` `lists-and-tables/style/choose-a-row-style-that-fits`

## Platform differences
- **iOS, iPadOS, visionOS:** use an info button only to reveal more about a row, and a disclosure indicator to drill in; skip an alphabetical index when rows have trailing controls `lists-and-tables/platform-considerations/ios-ipados-visionos/use-an-info-button-only-to` `lists-and-tables/platform-considerations/ios-ipados-visionos/avoid-adding-an-index-to-a`
- **macOS:** click a heading to sort and again to reverse; allow column resizing; consider alternating row colors; use outline views for hierarchy `lists-and-tables/platform-considerations/macos/when-it-provides-value-let-people` `lists-and-tables/platform-considerations/macos/let-people-resize-columns` `lists-and-tables/platform-considerations/macos/consider-using-alternating-row-colors-in`
- **tvOS:** check images beside rows when focus enlarges and rounds a row; add no corner masks of your own `lists-and-tables/platform-considerations/tvos/confirm-that-images-near-a-table`
- **watchOS:** limit rows, offer a way to see more, and keep detail views short for vertical page navigation `lists-and-tables/platform-considerations/watchos/when-possible-limit-the-number-of` `lists-and-tables/platform-considerations/watchos/constrain-the-length-of-detail-views`

## In other media
- **Mobile (any OS) and mobile web:** [HIG] rows for text, brief items, clear selection feedback `lists-and-tables/best-practices/prefer-displaying-text-in-a-list`
- **Desktop web:** [HIG] sortable, resizable columns with noun headings apply to data tables `lists-and-tables/platform-considerations/macos/when-it-provides-value-let-people` `lists-and-tables/content/use-descriptive-column-headings-in-a`
- **Slides:** [HIG transfer] short row text, clear headings and middle-ellipsis for clipped items `lists-and-tables/content/keep-item-text-succinct-so-row` `lists-and-tables/content/use-descriptive-column-headings-in-a`
- **Card news:** [HIG transfer] short list items and clear headings `lists-and-tables/content/keep-item-text-succinct-so-row`

## Related
[Collections](collections.md) · [Outline views](outline-views.md) · [Layout](https://developer.apple.com/design/human-interface-guidelines/layout) · see [Decision tree](../decision-trees/showing-collections.md)
