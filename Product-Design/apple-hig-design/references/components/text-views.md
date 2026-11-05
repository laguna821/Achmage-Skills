---
slug: text-views
title: "Text views"
kind: component
group: "Content"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/text-views
decision_trees: [text-input]
---

# Text views

**In one line:** A scrollable area for displaying and optionally editing long or specially formatted text.

## Why it exists
Short strings are easy, but long or styled text needs room, scrolling and formatting. A text view gives that capability, with more options than small amounts of text require, so it should be matched to the content (Simplicity) `text-views/best-practices/use-a-text-view-when-you`. Readability stays more important than styling (Craft, Responsibility) `text-views/best-practices/keep-text-legible`.

## Use it when
- Text is long, editable or specially formatted `text-views/best-practices/use-a-text-view-when-you`
- People may want to copy details such as error messages, serial numbers or IP addresses `text-views/best-practices/make-useful-text-selectable`

## Don't use it when
- You have only a small amount of non-editable text: use [Labels](labels.md) instead `text-views/best-practices/use-a-text-view-when-you`
- You have a small amount of editable text: use [Text fields](text-fields.md) instead `text-views/best-practices/use-a-text-view-when-you`

## Cost to the user
Long text takes reading time and screen space, so legibility settings matter: people change text size and weight, and creative styling must not get in the way `text-views/best-practices/keep-text-legible`. On iPhone and iPad a mismatched keyboard adds typing effort `text-views/platform-considerations/ios-ipados/show-the-appropriate-keyboard-type`.

## Principles at stake
- **Simplicity:** use the lightest element that fits the amount of text `text-views/best-practices/use-a-text-view-when-you`
- **Responsibility:** respect text settings such as Dynamic Type and bold text `text-views/best-practices/keep-text-legible`
- **Agency:** let people select and copy useful text `text-views/best-practices/make-useful-text-selectable`

## Key rules
- Choose a text view for long, editable or formatted text, and labels or text fields for small amounts `text-views/best-practices/use-a-text-view-when-you`
- Keep text readable even with creative styling; adopt Dynamic Type and test with accessibility options like bold text `text-views/best-practices/keep-text-legible`
- Make useful text selectable and copyable `text-views/best-practices/make-useful-text-selectable`
- On iPhone and iPad, show the keyboard type that fits what is being typed `text-views/platform-considerations/ios-ipados/show-the-appropriate-keyboard-type`

## Platform differences
- **iOS, iPadOS:** match the keyboard type to the content `text-views/platform-considerations/ios-ipados/show-the-appropriate-keyboard-type`
- **macOS, visionOS, watchOS:** no additional considerations.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] legibility and selectable-text rules apply; [HIG transfer] pick an input type that suits the field `text-views/platform-considerations/ios-ipados/show-the-appropriate-keyboard-type`
- **Desktop web:** [HIG] legibility and selectable-text rules apply; [HIG transfer] use a multi-line input only for long text `text-views/best-practices/use-a-text-view-when-you`
- **Slides:** [HIG none] for the component; [HIG transfer] keep styled text legible `text-views/best-practices/keep-text-legible`
- **Card news:** [HIG none] for the component; [HIG transfer] keep styled text legible `text-views/best-practices/keep-text-legible`

## Related
[Labels](labels.md) · [Text fields](text-fields.md) · [Combo boxes](combo-boxes.md) · see [Decision tree](../decision-trees/text-input.md)
