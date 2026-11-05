---
slug: token-fields
title: "Token fields"
kind: component
group: "Navigation and search"
platforms: [macOS]
source: https://developer.apple.com/design/human-interface-guidelines/token-fields
decision_trees: [text-input]
---

# Token fields

**In one line:** A text field that turns typed entries into compact tokens people can select, move and act on.

## Why it exists
Some entries, such as names in an address line, work better as discrete objects than as plain text. A token field lets people type quickly and then handle each entry as a unit. The HIG gives only three guidelines for it, so treat it as a refinement of a normal text field, with extra options attached to each token `token-fields/best-practices/add-value-with-a-context-menu`.

## Use it when
- Entries are discrete items, like recipients, that people may select or rearrange [HIG none] for the exact use cases; the page defines tokens as easy to select and manipulate
- Each token has extra options or details worth exposing `token-fields/best-practices/add-value-with-a-context-menu`
- The app suggests tokens as people type `token-fields/best-practices/consider-customizing-the-delay-the-system`

## Don't use it when
- The input is free text with no discrete items: use a plain text field (no HIG card in this set; see the Text fields page) [HIG none]
- You are building for iOS, iPadOS, tvOS, visionOS or watchOS: the component is not available there (no HIG alternative named)

## Cost to the user
Little interruption: it lives inline in a form. Suggestions that appear instantly can distract while typing, so tune their delay `token-fields/best-practices/consider-customizing-the-delay-the-system`.

## Principles at stake
- **Flexibility:** more than one way to turn text into a token (comma, Return) suits different typing habits `token-fields/best-practices/consider-providing-additional-ways-to-convert`
- **Agency:** a context menu on tokens puts options in reach without extra screens `token-fields/best-practices/add-value-with-a-context-menu`
- **Craft:** a comfortable suggestion delay keeps the field calm `token-fields/best-practices/consider-customizing-the-delay-the-system`

## Key rules
- Attach a context menu to tokens for extra options or details about the token `token-fields/best-practices/add-value-with-a-context-menu`
- Beyond the default comma, consider other shortcuts such as Return to create a token `token-fields/best-practices/consider-providing-additional-ways-to-convert`
- If you suggest tokens, tune the delay before suggestions appear instead of showing them instantly `token-fields/best-practices/consider-customizing-the-delay-the-system`

## Platform differences
- **macOS:** the only supported platform; no platform-specific guidance beyond the rules above.
- **Not available on:** iOS, iPadOS, tvOS, visionOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] chips in a tag or recipient field can offer a long-press menu and extra commit keys `token-fields/best-practices/add-value-with-a-context-menu`
- **Desktop web:** [HIG transfer] a tag input can convert on comma or Enter and delay its suggestions `token-fields/best-practices/consider-providing-additional-ways-to-convert` `token-fields/best-practices/consider-customizing-the-delay-the-system`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Combo boxes](combo-boxes.md) · [Text fields](https://developer.apple.com/design/human-interface-guidelines/text-fields) · see [Decision tree](../decision-trees/text-input.md)
