---
slug: virtual-keyboards
title: "Virtual keyboards"
kind: component
group: "Selection and input"
platforms: [iOS, iPadOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/virtual-keyboards
decision_trees: [text-input]
---

# Virtual keyboards

**In one line:** The onscreen keyboard that appears when people need to type, which an app can tune to the content or replace with its own.

## Why it exists
The system keyboard is the one people already know. Choosing the layout that fits the content makes entry easier, and declaring what an input means can also improve the corrections offered `virtual-keyboards/best-practices/choose-a-keyboard-that-matches-the`. Custom keyboards and input views cost people effort to learn, so they must earn it `virtual-keyboards/custom-keyboards/consider-providing-a-keyboard-tutorial-in`. This is mainly Familiarity and Flexibility.

## Use it when
- Content has a clear type, such as numbers or punctuation: present the matching layout `virtual-keyboards/best-practices/choose-a-keyboard-that-matches-the`
- The Return key can name the action, such as a search key when the app starts a search `virtual-keyboards/best-practices/consider-customizing-the-return-key-type`
- A custom input view genuinely makes entry simpler in your app's context `virtual-keyboards/custom-input-views/make-sure-your-custom-input-view`

## Don't use it when
- A custom view gives no clear benefit: stay with the system keyboard, otherwise people wonder why they cannot return to it `virtual-keyboards/custom-input-views/make-sure-your-custom-input-view` (no HIG alternative component named)
- A custom keyboard would repeat system keys such as Emoji/Globe or Dictation: leave those to the system `virtual-keyboards/custom-keyboards/avoid-duplicating-system-provided-keyboard-features`

## Cost to the user
A keyboard covers part of the screen, so key fields and buttons must stay visible above it `virtual-keyboards/platform-considerations/ios-ipados/use-the-keyboard-layout-guide-to`. A custom keyboard adds learning and a way to switch back, so it needs an obvious route to other keyboards and in-app instructions `virtual-keyboards/custom-keyboards/provide-an-obvious-and-easy-way` `virtual-keyboards/custom-keyboards/consider-providing-a-keyboard-tutorial-in`.

## Principles at stake
- **Familiarity:** standard layouts, Return keys and key-click sound match what people know `virtual-keyboards/custom-input-views/play-the-standard-keyboard-sound-while`
- **Flexibility:** matching layouts and easy keyboard switching serve different content and people `virtual-keyboards/best-practices/choose-a-keyboard-that-matches-the` `virtual-keyboards/custom-keyboards/provide-an-obvious-and-easy-way`
- **Purpose:** controls above the keyboard should serve the current task only `virtual-keyboards/platform-considerations/ios-ipados/place-custom-controls-above-the-keyboard`
- **Craft:** the keyboard should feel integrated and not hide important parts of the interface `virtual-keyboards/platform-considerations/ios-ipados/use-the-keyboard-layout-guide-to`

## Key rules
- Declare the input's meaning so the matching keyboard layout appears `virtual-keyboards/best-practices/choose-a-keyboard-that-matches-the`
- Change the Return key type when it clarifies the action `virtual-keyboards/best-practices/consider-customizing-the-return-key-type`
- Make a custom input view fit your context, simplify entry and show why it beats the system keyboard `virtual-keyboards/custom-input-views/make-sure-your-custom-input-view`
- Play the standard key-click sound in a custom input view `virtual-keyboards/custom-input-views/play-the-standard-keyboard-sound-while`
- In a custom keyboard, give an evident, easy way to switch to other keyboards `virtual-keyboards/custom-keyboards/provide-an-obvious-and-easy-way`
- Do not duplicate Emoji/Globe or Dictation keys `virtual-keyboards/custom-keyboards/avoid-duplicating-system-provided-keyboard-features`
- Teach choosing, enabling, using and leaving a new keyboard inside the app, not inside the keyboard `virtual-keyboards/custom-keyboards/consider-providing-a-keyboard-tutorial-in`

## Platform differences
- **iOS, iPadOS:** use the keyboard layout guide so the keyboard fits and key fields stay visible; put only task-relevant custom controls above the keyboard, apply Liquid Glass if it matches the rest of the app, and use standard padding `virtual-keyboards/platform-considerations/ios-ipados/use-the-keyboard-layout-guide-to` `virtual-keyboards/platform-considerations/ios-ipados/place-custom-controls-above-the-keyboard`
- **tvOS, visionOS, watchOS:** no additional platform guidance.
- **Not available on:** macOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] pick the keyboard type for the content, and keep fields above the keyboard `virtual-keyboards/best-practices/choose-a-keyboard-that-matches-the`
- **Desktop web:** [HIG transfer] declaring an input's meaning (number, URL, email) still helps touch devices and autofill `virtual-keyboards/best-practices/choose-a-keyboard-that-matches-the`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Text fields](text-fields.md) · [Entering data](https://developer.apple.com/design/human-interface-guidelines/entering-data) · [Keyboards](https://developer.apple.com/design/human-interface-guidelines/keyboards) · see [Decision tree](../decision-trees/text-input.md)
