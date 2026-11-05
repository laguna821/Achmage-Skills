---
slug: keyboards
title: "Keyboards"
kind: input
group: "Inputs"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/keyboards
---

# Keyboards

**In one line:** Physical keyboard input: full keyboard navigation, standard shortcuts and a small set of custom shortcuts for an app's most frequent commands.

## Why it exists
Some people use only a keyboard, and many others use it to work faster. Full keyboard access makes every part of the system usable without a pointer or touch `keyboards/best-practices/support-full-keyboard-access-when-possible`. Shortcuts work because people trust them to mean the same thing everywhere `keyboards/best-practices/respect-standard-keyboard-shortcuts`.

## Use it when
- Any window, menu or control would otherwise require a pointer or touch `keyboards/best-practices/support-full-keyboard-access-when-possible`
- A command is frequent and app-specific, so a new shortcut saves effort `keyboards/custom-keyboard-shortcuts/define-custom-keyboard-shortcuts-for-only`
- A game needs key bindings that players can remap `keyboards/best-practices/respect-standard-keyboard-shortcuts`

## Don't use it when
- The shortcut would change what a standard one does: keep the usual meaning, unless its original action is irrelevant to the app `keyboards/standard-keyboard-shortcuts/in-general-dont-repurpose-standard-keyboard`
- The command is rare: skip a shortcut and leave it in a menu or control `keyboards/custom-keyboard-shortcuts/define-custom-keyboard-shortcuts-for-only`
- A new shortcut would just layer a modifier on a known one for an unrelated command `keyboards/custom-keyboard-shortcuts/avoid-creating-a-new-shortcut-by`
- The primary input is touch or hand: see [Gestures](gestures.md) (the keyboard must still not be excluded)

## Cost to the user
Each shortcut is something to learn, so too many add memory load. Shortcuts that break convention cost more, because people act on habit `keyboards/standard-keyboard-shortcuts/in-general-dont-repurpose-standard-keyboard`. On visionOS, a virtual keyboard overlay can appear when a physical keyboard is connected `keyboards/platform-considerations/visionos/recognize-that-people-see-an-overlay`.

## Principles at stake
- **Familiarity:** standard shortcuts keep their usual jobs `keyboards/best-practices/respect-standard-keyboard-shortcuts`
- **Flexibility:** the full interface works with only a keyboard, and shortcuts adapt to keyboard layout and reading direction `keyboards/best-practices/support-full-keyboard-access-when-possible` `keyboards/custom-keyboard-shortcuts/let-the-system-localize-and-mirror`
- **Simplicity:** custom shortcuts only for the most used app commands `keyboards/custom-keyboard-shortcuts/define-custom-keyboard-shortcuts-for-only`
- **Agency:** people can remap game key bindings `keyboards/best-practices/respect-standard-keyboard-shortcuts`

## Key rules
- Make every window, menu, control and system feature usable with only the keyboard, and test with Full Keyboard Access on `keyboards/best-practices/support-full-keyboard-access-when-possible`
- On iPadOS, leave control navigation to Full Keyboard Access `keyboards/best-practices/support-full-keyboard-access-when-possible`
- Create custom shortcuts only for the commands people use most `keyboards/custom-keyboard-shortcuts/define-custom-keyboard-shortcuts-for-only`
- Use Command as the main modifier, Shift as a related secondary, and Option sparingly `keyboards/custom-keyboard-shortcuts/use-modifier-keys-in-ways-that`
- List multiple modifiers in the order Control, Option, Shift, Command `keyboards/custom-keyboard-shortcuts/list-modifier-keys-in-the-correct`
- For a key with two symbols, show the upper symbol alone instead of adding Shift `keyboards/custom-keyboard-shortcuts/avoid-adding-shift-to-a-shortcut`
- Let the system localize shortcuts and mirror them in right-to-left layouts `keyboards/custom-keyboard-shortcuts/let-the-system-localize-and-mirror`

## Platform differences
- **visionOS:** give every shortcut a title that explains its action without a parent submenu name `keyboards/platform-considerations/visionos/write-descriptive-shortcut-titles`; plan for the virtual keyboard overlay `keyboards/platform-considerations/visionos/recognize-that-people-see-an-overlay`
- **iOS, iPadOS, macOS, tvOS:** no additional considerations.
- **Not available on:** watchOS

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] external keyboards still need full navigation and standard shortcuts `keyboards/best-practices/support-full-keyboard-access-when-possible`
- **Desktop web:** [HIG] keep standard shortcuts meaning what they always do, and add few, well-chosen custom ones `keyboards/best-practices/respect-standard-keyboard-shortcuts`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Gestures](gestures.md) · [Pointing devices](pointing-devices.md) · [Remotes](remotes.md)
