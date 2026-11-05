---
slug: text-fields
title: "Text fields"
kind: component
group: "Selection and input"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/text-fields
decision_trees: [text-input]
---

# Text fields

**In one line:** A rectangular area where people type a small amount of text, such as a name, an email address or a password.

## Why it exists
Some information cannot be chosen from a list and has to be typed. A text field collects short input, and its size, hints, keyboard and validation decide how much effort that typing costs `text-fields/best-practices/use-a-text-field-to-request`. It serves Simplicity and Familiarity, and Responsibility when it hides sensitive entries and warns about invalid ones `text-fields/best-practices/use-secure-text-fields-to-hide` `text-fields/best-practices/validate-fields-when-it-makes-sense`.

## Use it when
- You need short input such as a name or email `text-fields/best-practices/use-a-text-field-to-request`
- A sensitive entry such as a password is needed: use a secure text field `text-fields/best-practices/use-secure-text-fields-to-hide`
- Numbers must be entered: use a number formatter so only numbers are accepted `text-fields/best-practices/use-a-number-formatter-to-help`

## Don't use it when
- People will write longer text: use [Text views](text-views.md) instead `text-fields/best-practices/use-a-text-field-to-request`
- On macOS, typing should come with a list of choices: use [Combo boxes](combo-boxes.md) instead `text-fields/platform-considerations/macos/consider-using-a-combo-box-if`
- On Apple Watch, options can be listed: show a list of options instead (no card named) `text-fields/platform-considerations/watchos/present-a-text-field-only-when`
- On Apple TV and Apple Watch, long text or many fields would be needed: gather information another way, for example with buttons `text-fields/best-practices/minimize-text-entry-in-your-tvos`

## Cost to the user
Typing is work. It is expensive on Apple TV and Apple Watch, where long text or many fields take a lot of time `text-fields/best-practices/minimize-text-entry-in-your-tvos`. A field also demands that people understand what it wants, which is why a persistent label matters once placeholder text disappears `text-fields/best-practices/show-a-hint-in-a-text`.

## Principles at stake
- **Simplicity:** size fields to the expected text and space them so each pairs with its label `text-fields/best-practices/to-the-extent-possible-match-the` `text-fields/best-practices/evenly-space-multiple-text-fields`
- **Familiarity:** tab order and keyboard type follow expectations `text-fields/best-practices/ensure-that-tabbing-between-multiple-fields` `text-fields/best-practices/in-ios-ipados-tvos-and-visionos`
- **Responsibility:** hide private input and tell people when entries are invalid `text-fields/best-practices/use-secure-text-fields-to-hide` `text-fields/best-practices/validate-fields-when-it-makes-sense`
- **Agency:** a Clear button and an expansion tooltip give people control over their text `text-fields/platform-considerations/ios-ipados/display-a-clear-button-in-the` `text-fields/best-practices/consider-using-an-expansion-tooltip-to`

## Key rules
- Put placeholder hint text in an empty field, and also add a separate label, because the hint vanishes when typing starts `text-fields/best-practices/show-a-hint-in-a-text`
- Size each field to suit the amount of text expected `text-fields/best-practices/to-the-extent-possible-match-the`
- Space multiple fields so each clearly pairs with its label, stack them vertically when possible, and share widths among similar fields `text-fields/best-practices/evenly-space-multiple-text-fields`
- Make tabbing between fields follow a logical order `text-fields/best-practices/ensure-that-tabbing-between-multiple-fields`
- Validate at a sensible moment: for email, when leaving the field; for usernames and passwords, before leaving it `text-fields/best-practices/validate-fields-when-it-makes-sense`
- Use a number formatter and do not assume one presentation, since formats differ by locale `text-fields/best-practices/use-a-number-formatter-to-help`
- Choose how overflowing text behaves per field: clip, wrap by character or word, or truncate at the start, middle or end `text-fields/best-practices/adjust-line-breaks-according-to-the`
- Offer an expansion tooltip on hover for clipped or truncated text `text-fields/best-practices/consider-using-an-expansion-tooltip-to`
- Show the keyboard type that matches the content, such as numbers or URLs `text-fields/best-practices/in-ios-ipados-tvos-and-visionos`

## Anatomy and content
Images or system buttons can sit at the ends of a field on iOS and iPadOS: the leading end for the field's purpose, the trailing end for extra features `text-fields/platform-considerations/ios-ipados/use-images-and-buttons-to-provide`. A Clear button belongs at the trailing end `text-fields/platform-considerations/ios-ipados/display-a-clear-button-in-the`.

## Platform differences
- **iOS, iPadOS:** show a Clear button at the trailing end; use leading and trailing images or buttons consistently `text-fields/platform-considerations/ios-ipados/display-a-clear-button-in-the` `text-fields/platform-considerations/ios-ipados/use-images-and-buttons-to-provide`
- **macOS:** use a combo box when text entry comes with a list of choices `text-fields/platform-considerations/macos/consider-using-a-combo-box-if`
- **watchOS:** show a text field only when truly necessary `text-fields/platform-considerations/watchos/present-a-text-field-only-when`
- **tvOS, visionOS:** no additional platform guidance beyond the keyboard-type rule `text-fields/best-practices/in-ios-ipados-tvos-and-visionos`

## In other media
- **Mobile (any OS) and mobile web:** [HIG] label plus placeholder, secure entry, validation and matching keyboard type apply; limiting typing is [HIG transfer] `text-fields/best-practices/minimize-text-entry-in-your-tvos`
- **Desktop web:** [HIG] same field rules; tab order and expansion tooltips carry over `text-fields/best-practices/ensure-that-tabbing-between-multiple-fields`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Text views](text-views.md) · [Combo boxes](combo-boxes.md) · [Virtual keyboards](virtual-keyboards.md) · [Entering data](https://developer.apple.com/design/human-interface-guidelines/entering-data) · see [Decision tree](../decision-trees/text-input.md)
