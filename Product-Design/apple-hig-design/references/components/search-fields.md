---
slug: search-fields
title: "Search fields"
kind: component
group: "Navigation and search"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/search-fields
decision_trees: [text-input]
---

# Search fields

**In one line:** A text field for entering a query that finds content, with suggestions, scopes and tokens to narrow results.

## Why it exists
People often know what they want but not where it is. A search field lets them go straight to it, and good support (hints, live results, suggestions, filters) shortens the path `search-fields/best-practices/if-possible-start-search-immediately-when` `search-fields/best-practices/consider-showing-suggested-search-terms`. Where it sits tells people what it searches `search-fields/platform-considerations/ios/search-as-an-inline-field/place-search-as-an-inline-field`.

## Use it when
- People need to find content in a large or deep set `search-fields/best-practices/simplify-search-results`
- The scope can be hinted by placeholder text `search-fields/best-practices/use-placeholder-text-to-help-people`
- Results can be narrowed by categories or common terms `search-fields/scope-bars-and-tokens/use-a-scope-bar-to-filter` `search-fields/scope-bars-and-tokens/use-tokens-to-filter-by-common`
- Search is a priority, so it deserves a dedicated place: a toolbar, sidebar, tab or its own item `search-fields/platform-considerations/ipados-macos/include-search-as-an-item-in`

## Don't use it when
- Search would cover content the app needs: on iOS, move it to the top, away from a bottom toolbar `search-fields/platform-considerations/ios/search-in-a-toolbar/place-search-at-the-top-when`
- A field filters only one view: place it inline next to that content, not globally `search-fields/platform-considerations/ios/search-as-an-inline-field/place-search-as-an-inline-field`
- A virtual-keyboard-only iPad would be covered: do not focus the field automatically `search-fields/platform-considerations/ipados-macos/in-a-search-field-in-a`

## Cost to the user
Typing costs effort, especially on tvOS, so suggestions and live results reduce it `search-fields/platform-considerations/tvos/provide-suggestions-to-make-searching-easier`. A focused field can raise a keyboard that covers the view `search-fields/platform-considerations/ipados-macos/in-a-search-field-in-a`.

## Principles at stake
- **Agency:** live results, filters and scope control `search-fields/best-practices/if-possible-start-search-immediately-when` `search-fields/scope-bars-and-tokens/default-to-a-broader-scope-and`
- **Simplicity:** relevant results first, grouped `search-fields/best-practices/simplify-search-results`
- **Familiarity:** placeholder hints, familiar positions `search-fields/best-practices/use-placeholder-text-to-help-people` `search-fields/platform-considerations/ipados-macos/put-a-search-field-at-the`
- **Purpose:** placement follows how central search is `search-fields/platform-considerations/ios/search-as-a-tab/choose-the-standard-tab-style-to`

## Key rules
- Use placeholder text that hints at what can be searched `search-fields/best-practices/use-placeholder-text-to-help-people`
- Start searching as the person types, where feasible `search-fields/best-practices/if-possible-start-search-immediately-when`
- Offer recent searches before typing and predictive suggestions while typing `search-fields/best-practices/consider-showing-suggested-search-terms`
- Rank the most relevant results first and consider grouping them `search-fields/best-practices/simplify-search-results`
- Let people filter results, for example with a scope bar `search-fields/best-practices/consider-letting-people-filter-search-results`
- Use scopes that run from broad to narrow, and start at the widest `search-fields/scope-bars-and-tokens/use-a-scope-bar-to-filter` `search-fields/scope-bars-and-tokens/default-to-a-broader-scope-and`
- Turn common terms into tokens, and show suggestions with them so people learn how tokens work `search-fields/scope-bars-and-tokens/use-tokens-to-filter-by-common` `search-fields/scope-bars-and-tokens/consider-pairing-tokens-with-search-suggestions`

## Platform differences
- **iOS:** use the standard search tab for rich content and the button style for quick, transient search; put search in a bottom toolbar when there is room, at the top otherwise; inline fields sit above their list `search-fields/platform-considerations/ios/search-as-a-tab/choose-the-standard-tab-style-to` `search-fields/platform-considerations/ios/search-as-a-tab/choose-the-button-appearance-to-help` `search-fields/platform-considerations/ios/search-in-a-toolbar/place-search-at-the-bottom-if` `search-fields/platform-considerations/ios/search-as-an-inline-field/when-at-the-top-position-an`
- **iPadOS, macOS:** place search at the toolbar's trailing end, at the top of a sidebar when it filters navigation, or as its own sidebar or tab bar item; focus a dedicated search area immediately (unfocused on iPad with only a virtual keyboard); plan for window resizing `search-fields/platform-considerations/ipados-macos/put-a-search-field-at-the` `search-fields/platform-considerations/ipados-macos/include-search-at-the-top-of` `search-fields/platform-considerations/ipados-macos/in-a-search-field-in-a` `search-fields/platform-considerations/ipados-macos/account-for-window-resizing-with-the`
- **tvOS:** supply popular or context-fitting suggestions, plus recent searches `search-fields/platform-considerations/tvos/provide-suggestions-to-make-searching-easier`
- **visionOS, watchOS:** no additional considerations.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] placeholder hints, live results, recents and scope filters `search-fields/best-practices/consider-showing-suggested-search-terms`
- **Desktop web:** [HIG] search at the trailing end of the header or top of the side navigation `search-fields/platform-considerations/ipados-macos/put-a-search-field-at-the`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Toolbars](toolbars.md) · [Token fields](token-fields.md) · [Searching](https://developer.apple.com/design/human-interface-guidelines/searching) · see [Decision tree](../decision-trees/text-input.md)
