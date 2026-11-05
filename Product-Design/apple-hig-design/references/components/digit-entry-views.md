---
slug: digit-entry-views
title: "Digit entry views"
kind: component
group: "Selection and input"
platforms: [tvOS]
source: https://developer.apple.com/design/human-interface-guidelines/digit-entry-views
decision_trees: [text-input]
---

# Digit entry views

**In one line:** A full-screen tvOS view that asks for a series of digits, such as a PIN, using a number keyboard.

## Why it exists
Entering a code on a TV is awkward, so a dedicated screen with a digit-only keyboard keeps it simple. Because codes are often sensitive, the view must protect them and say why they are needed `digit-entry-views/best-practices/use-secure-digit-fields` `digit-entry-views/best-practices/clearly-state-the-purpose-of-the`. Responsibility and Simplicity.

## Use it when
- The app needs a PIN or other series of digits on Apple TV [HIG none] beyond the definition
- The digits are sensitive: use secure digit fields `digit-entry-views/best-practices/use-secure-digit-fields`

## Don't use it when
- Free text is needed: use a standard text field [HIG none] (no HIG alternative named on this page)
- You are not on tvOS: not available (no HIG alternative named)

## Cost to the user
It takes over the whole screen and asks for a precise input, so the reason must be obvious up front `digit-entry-views/best-practices/clearly-state-the-purpose-of-the`.

## Principles at stake
- **Responsibility:** mask sensitive digits `digit-entry-views/best-practices/use-secure-digit-fields`
- **Simplicity:** one purpose, explained by title and prompt `digit-entry-views/best-practices/clearly-state-the-purpose-of-the`

## Key rules
- Use secure digit fields, which mask digits with asterisks, for sensitive data `digit-entry-views/best-practices/use-secure-digit-fields`
- Give the view a title and prompt explaining why digits are needed `digit-entry-views/best-practices/clearly-state-the-purpose-of-the`
- The Text fields page agrees: hide sensitive entries with secure fields `text-fields/best-practices/use-secure-text-fields-to-hide`
- On Apple TV, limit typing and gather information more efficiently where possible `text-fields/best-practices/minimize-text-entry-in-your-tvos`

The digit entry page itself gives little more.

## Platform differences
- **tvOS:** the only platform; no further guidance.
- **Not available on:** iOS, iPadOS, macOS, visionOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] mask PIN digits and state the reason for the request `digit-entry-views/best-practices/use-secure-digit-fields`
- **Desktop web:** [HIG transfer] same for PIN or code inputs `digit-entry-views/best-practices/clearly-state-the-purpose-of-the`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Text fields](https://developer.apple.com/design/human-interface-guidelines/text-fields) · see [Decision tree](../decision-trees/text-input.md)
