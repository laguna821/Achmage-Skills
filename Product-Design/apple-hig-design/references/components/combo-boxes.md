---
slug: combo-boxes
title: "Combo boxes"
kind: component
group: "Selection and input"
platforms: [macOS]
source: https://developer.apple.com/design/human-interface-guidelines/combo-boxes
decision_trees: [text-input]
---

# Combo boxes

**In one line:** A text field joined with a pull-down list, so people can type a value or pick a suggested one.

## Why it exists
Sometimes the common answers are known but not exhaustive. A combo box offers the likely choices and still lets people type their own `combo-boxes/best-practices/provide-relevant-choices`. It serves Flexibility and Familiarity.

## Use it when
- Likely values can be listed, but custom entries must stay possible `combo-boxes/best-practices/provide-relevant-choices`
- A sensible default can hint at the hidden choices `combo-boxes/best-practices/populate-the-field-with-a-meaningful`

## Don't use it when
- Only listed values are valid, or no custom entry makes sense: [HIG none] the page names no alternative here
- Entries are discrete objects to manipulate: use [Token fields](token-fields.md) instead [HIG none] on the exact rule; the Token fields page defines them
- You are not on macOS: not available (no HIG alternative named)

## Cost to the user
Small. People need to learn that the field has hidden choices, so the default value and the lead-in label help signal this `combo-boxes/best-practices/populate-the-field-with-a-meaningful` `combo-boxes/best-practices/use-an-introductory-label-to-let`.

## Principles at stake
- **Flexibility:** pick from a list or type freely `combo-boxes/best-practices/provide-relevant-choices`
- **Familiarity:** a lead-in label and a sensible default tell people what to expect `combo-boxes/best-practices/use-an-introductory-label-to-let`
- **Craft:** list items no wider than the field `combo-boxes/best-practices/make-sure-list-items-arent-wider`

## Key rules
- Pre-fill with a meaningful default from the list; it need not be first `combo-boxes/best-practices/populate-the-field-with-a-meaningful`
- Add an introductory label with title-style capitalization and a colon `combo-boxes/best-practices/use-an-introductory-label-to-let`
- Offer the most likely options while allowing custom entry `combo-boxes/best-practices/provide-relevant-choices`
- Keep list items no wider than the text field `combo-boxes/best-practices/make-sure-list-items-arent-wider`

## Platform differences
- **macOS:** the only platform; no further guidance.
- **Not available on:** iOS, iPadOS, tvOS, visionOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] an input with suggestions follows the default and label rules `combo-boxes/best-practices/use-an-introductory-label-to-let`
- **Desktop web:** [HIG transfer] an editable dropdown with likely options and free entry `combo-boxes/best-practices/provide-relevant-choices`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Token fields](token-fields.md) · [Text fields](https://developer.apple.com/design/human-interface-guidelines/text-fields) · see [Decision tree](../decision-trees/text-input.md)
