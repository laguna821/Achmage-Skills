---
tree: showing-collections
title: "Showing lists and collections"
members: [lists-and-tables, collections, outline-views, column-views]
---

# Decision tree: Showing lists and collections

**Use this when:** you must show many items of the same kind and need to pick the layout (rows, grid, tree or columns).
**Members:** [Lists and tables](../components/lists-and-tables.md) · [Collections](../components/collections.md) · [Outline views](../components/outline-views.md) · [Column views](../components/column-views.md)
**Related patterns:** [Searching](https://developer.apple.com/design/human-interface-guidelines/searching) · [Drag and drop](https://developer.apple.com/design/human-interface-guidelines/drag-and-drop)

## Start with the need
1. **What is most of the content: text, or images and items of mixed size?**
   - Mostly text, to be scanned and compared → [Lists and tables](../components/lists-and-tables.md) `lists-and-tables/best-practices/prefer-displaying-text-in-a-list` `collections/best-practices/consider-using-a-table-instead-of`
   - Many images, or items that differ widely in size → [Collections](../components/collections.md) `lists-and-tables/best-practices/prefer-displaying-text-in-a-list` `collections/best-practices/consider-using-a-table-instead-of`
   - Items nest inside other items (folders, groups) → go to 2
2. **Is the data truly hierarchical, and are you designing for Mac?**
   - Not hierarchical → stay with a plain table or list; an outline view is wrong here `outline-views/best-practices/use-a-table-instead-of-an`
   - Hierarchical on Mac → go to 3
   - Hierarchical on iOS, iPadOS, visionOS → a list that drills in with a disclosure indicator; the HIG names no outline or column component for these `lists-and-tables/platform-considerations/ios-ipados-visionos/use-an-info-button-only-to` [HIG none for a tree component]
3. **Do people need to expand levels in place and compare attributes, or see several levels side by side?**
   - Expand and collapse in place, with attributes in other columns → [Outline views](../components/outline-views.md) `outline-views/best-practices/expose-data-hierarchy-in-the-first` `lists-and-tables/platform-considerations/macos/use-an-outline-view-instead-of`
   - See the path across levels and preview the selected leaf → [Column views](../components/column-views.md) `column-views/best-practices/show-the-root-level-of-your` `column-views/best-practices/consider-showing-information-about-the-selected`
   - Both fit → the HIG does not say which to prefer (see the gap below)
4. **Will people re-find a place in a deep structure again and again?**
   - Yes, outline → restore the levels they opened `outline-views/best-practices/retain-peoples-expansion-choices` and make expanding easy `outline-views/best-practices/make-it-easy-for-people-to`
   - Yes, columns → keep the root in the leftmost column so the start is always clear `column-views/best-practices/show-the-root-level-of-your`
5. **Do people need to compare or reorder rows by a value?**
   - Yes, on Mac → sortable, resizable column headings `lists-and-tables/platform-considerations/macos/when-it-provides-value-let-people` `lists-and-tables/platform-considerations/macos/let-people-resize-columns`
   - Reordering without add or remove → still allow editing `lists-and-tables/best-practices/let-people-edit-a-table-when`
   - Rows are only choices from a set → brief highlight plus a checkmark `lists-and-tables/best-practices/provide-appropriate-feedback-when-people-select`
6. **Is the collection long enough that people will want to find one item fast?**
   - Yes → offer search from a clear, prominent place; in a long outline use a toolbar search field `outline-views/best-practices/consider-offering-a-search-field-to` [Searching](https://developer.apple.com/design/human-interface-guidelines/searching) `searching/best-practices/if-search-is-important-give-it`
   - Show the scope of the search `searching/best-practices/clearly-display-the-current-scope-of`
   - No → no search needed; keep row text short instead `lists-and-tables/content/keep-item-text-succinct-so-row`
7. **Will people move items around by dragging?**
   - Yes → [Drag and drop](https://developer.apple.com/design/human-interface-guidelines/drag-and-drop): show a drag image and valid-target cues `drag-and-drop/providing-feedback/display-a-drag-image-as-soon` `drag-and-drop/providing-feedback/show-people-whether-a-destination-can`
   - Always add a non-drag route, such as menu commands `drag-and-drop/best-practices/offer-alternative-ways-to-accomplish-drag`
   - In a collection, also animate insertions, deletions and reordering `collections/best-practices/consider-using-animations-to-provide-feedback`
8. **Do you want a custom layout or a layout that rearranges itself?**
   - Custom → use the default row or grid unless you have a strong reason `collections/best-practices/use-the-standard-row-or-grid`
   - Self-rearranging on iOS or iPadOS → only after an explicit action `collections/platform-considerations/ios-ipados/use-caution-when-making-dynamic-layout`

## At a glance
| Component | Content | Structure | Platforms | Best for | Avoid when |
| --- | --- | --- | --- | --- | --- |
| [Lists and tables](../components/lists-and-tables.md) | Text | Flat rows, one or several columns | iOS, iPadOS, macOS, tvOS, visionOS, watchOS | Scanning and comparing text | Many images or mixed sizes `lists-and-tables/best-practices/prefer-displaying-text-in-a-list` |
| [Collections](../components/collections.md) | Images, mixed sizes | Rows or grid | iOS, iPadOS, macOS, tvOS, visionOS | Picking visual items | Content is text `collections/best-practices/consider-using-a-table-instead-of` |
| [Outline views](../components/outline-views.md) | Hierarchical data | Levels in the first column, attributes beside | macOS | Opening and closing levels in place | Data is not hierarchical `outline-views/best-practices/use-a-table-instead-of-an` |
| [Column views](../components/column-views.md) | Hierarchical data | One column per level | macOS | Seeing several levels and a leaf preview | The HIG names no case to avoid |

## Platform notes
- **macOS:** hierarchy goes to an outline view, not a table `lists-and-tables/platform-considerations/macos/use-an-outline-view-instead-of`
- **watchOS:** no collections; limit rows and offer more `lists-and-tables/platform-considerations/watchos/when-possible-limit-the-number-of`
- **iOS and iPadOS:** skip the alphabetical index when rows have trailing controls `lists-and-tables/platform-considerations/ios-ipados-visionos/avoid-adding-an-index-to-a`
- **tvOS:** do not add your own corner masks to images beside focused rows `lists-and-tables/platform-considerations/tvos/confirm-that-images-near-a-table`

## Common mistakes
- **Text in a grid:** use a list or table `collections/best-practices/consider-using-a-table-instead-of`
- **Outline view for flat data:** use a plain table `outline-views/best-practices/use-a-table-instead-of-an`
- **Images packed tight:** leave padding so focus or hover effects show `collections/best-practices/make-it-easy-to-choose-an`
- **Long row text:** shorten it, or show titles and details elsewhere `lists-and-tables/content/keep-item-text-succinct-so-row`
- **Drag as the only route:** add alternatives `drag-and-drop/best-practices/offer-alternative-ways-to-accomplish-drag`
- **Clipping names at the end:** truncate in the middle `outline-views/best-practices/consider-using-a-centered-ellipsis-to`

## In other media
- **Mobile (any OS) and mobile web:** [HIG] text in rows, images in a regular grid `collections/best-practices/use-the-standard-row-or-grid` `lists-and-tables/best-practices/prefer-displaying-text-in-a-list`
- **Desktop web:** [HIG transfer] tree tables follow the outline rules; multi-column browsers follow the column rules `outline-views/best-practices/let-people-resize-columns` `column-views/best-practices/let-people-resize-columns`
- **Slides and card news:** [HIG transfer] short row text and a regular grid for image sets `lists-and-tables/content/keep-item-text-succinct-so-row` `collections/best-practices/use-the-standard-row-or-grid`

## Not settled by the HIG
- Outline view versus column view for the same hierarchy: no criterion is given.
- Collection versus list when content is mixed text and images: only the two extremes are covered.
- Hierarchical data outside macOS: no component is named.
