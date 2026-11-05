---
slug: pointing-devices
title: "Pointing devices"
kind: input
group: "Inputs"
platforms: [iOS, iPadOS, macOS, visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/pointing-devices
---

# Pointing devices

**In one line:** Mouse, trackpad and similar pointers: how an app should respond to them, show hover feedback and stay consistent with touch and keyboard.

## Why it exists
People who use a mouse or trackpad expect system-wide gestures and pointer behavior to work the same in every app `pointing-devices/best-practices/be-consistent-when-responding-to-mouse`. A pointer is precise and can hover, which allows richer feedback, but it must not create a separate, inconsistent experience `pointing-devices/best-practices/provide-a-consistent-experience-in-your`.

## Use it when
- The app runs where a pointer is likely, such as Mac, iPad with a mouse or trackpad, or visionOS `pointing-devices/best-practices/provide-a-consistent-experience-in-your`
- Custom views need multiple selection by dragging a rectangle (iPad: build it yourself) `pointing-devices/platform-considerations/ipados/allow-multiple-selection-in-custom-views`
- Controls fade or minimize, and the pointer can bring them back by hovering `pointing-devices/best-practices/let-people-use-the-pointer-to`
- A pointer adds real value, such as a precise click to seek on a scrubber `pointing-devices/platform-considerations/ipados/distinguish-between-pointer-and-finger-input`

## Don't use it when
- You are tempted to redefine system-wide trackpad gestures, even in a game `pointing-devices/best-practices/avoid-redefining-systemwide-trackpad-gestures`
- A pointer effect would be purely decorative: leave it out `pointing-devices/platform-considerations/ipados/customizing-pointers/avoid-creating-gratuitous-pointer-and-content`
- You want to teach with text attached to the pointer: make the interface self-explanatory instead `pointing-devices/platform-considerations/ipados/customizing-pointers/avoid-displaying-instructional-text-with-a`
- Touch is the main input: see [Gestures](gestures.md)

## Cost to the user
Inconsistent pointer behavior makes people relearn what they already know `pointing-devices/best-practices/be-consistent-when-responding-to-mouse`. Gratuitous effects and attention-grabbing pointer shapes add noise `pointing-devices/platform-considerations/ipados/customizing-pointers/keep-custom-pointer-shapes-simple`.

## Principles at stake
- **Familiarity:** same results for the same gestures across the system, and system pointer looks for standard controls `pointing-devices/best-practices/be-consistent-when-responding-to-mouse` `pointing-devices/platform-considerations/ipados/standard-pointers-and-effects/prefer-the-system-provided-pointer-appearances`
- **Flexibility:** the same behavior whether people use gestures, eyes, a pointer or a keyboard `pointing-devices/best-practices/provide-a-consistent-experience-in-your`
- **Simplicity:** every pointer change must be useful `pointing-devices/platform-considerations/ipados/customizing-pointers/avoid-creating-gratuitous-pointer-and-content`
- **Agency:** keep the current selection when touch reveals a hidden control `pointing-devices/platform-considerations/macos/touch-support-for-hidden-controls/retain-the-current-selection-when-revealing`

## Key rules
- Make mouse and trackpad gestures act as they do across the system `pointing-devices/best-practices/be-consistent-when-responding-to-mouse`
- Do not redefine system-wide trackpad gestures `pointing-devices/best-practices/avoid-redefining-systemwide-trackpad-gestures`
- Keep behavior the same across gestures, eyes, pointer and keyboard `pointing-devices/best-practices/provide-a-consistent-experience-in-your`
- Make a held modifier key give the same result with touch or pointer `pointing-devices/best-practices/provide-a-consistent-experience-when-people`
- Let hovering reveal auto-hidden controls and moving away hide them `pointing-devices/best-practices/let-people-use-the-pointer-to`

## Platform differences
- **iPadOS:** use system pointer looks for standard buttons and text fields `pointing-devices/platform-considerations/ipados/standard-pointers-and-effects/prefer-the-system-provided-pointer-appearances`. Choose effects by intent: highlight for control groups, lift for standalone glass controls or small opaque elements, hover for large elements `pointing-devices/platform-considerations/ipados/standard-pointers-and-effects/when-possible-support-the-system-provided`. Pad interactive elements for hit regions, roughly 12 points around bezeled elements and about 24 points around others, found through experimentation `pointing-devices/platform-considerations/ipados/standard-pointers-and-effects/add-padding-around-interactive-elements-to`. Make custom bar button hit regions touch with no gaps `pointing-devices/platform-considerations/ipados/standard-pointers-and-effects/create-contiguous-hit-regions-for-custom`. Give custom elements that act like standard ones the system effects, and use the same treatment for comparable areas `pointing-devices/platform-considerations/ipados/customizing-pointers/prefer-system-provided-pointer-effects-for` `pointing-devices/platform-considerations/ipados/customizing-pointers/use-pointer-effects-in-consistent-ways`. Keep custom pointer shapes and accessory imagery simple `pointing-devices/platform-considerations/ipados/customizing-pointers/keep-custom-pointer-shapes-simple` `pointing-devices/platform-considerations/ipados/pointer-accessories/use-clear-simple-images-to-create`. Scale hover effects only where there is room; use tint alone for tight rows `pointing-devices/platform-considerations/ipados/customizing-pointers/consider-the-interplay-of-shadow-scale`
- **macOS (touch displays):** give touch access to hidden controls only if essential `pointing-devices/platform-considerations/macos/touch-support-for-hidden-controls/decide-which-hidden-controls-need-touch`. A tap near a hidden control reveals it, and it hides after use or idle time `pointing-devices/platform-considerations/macos/touch-support-for-hidden-controls/reveal-a-hidden-control-when-someone`. Also place the most-needed hidden controls in a short context menu `pointing-devices/platform-considerations/macos/touch-support-for-hidden-controls/make-essential-hidden-controls-available-in`. In sidebars, a tap acts like a click on the row `pointing-devices/platform-considerations/macos/touch-support-for-hidden-controls/in-a-sidebar-reveal-hidden-controls`; in tabbed windows, a tap shows the selected tab's close button `pointing-devices/platform-considerations/macos/touch-support-for-hidden-controls/in-a-tabbed-window-reveal-the`
- **iOS, visionOS:** iOS has no additional considerations; follow the best practices above.
- **Not available on:** tvOS, watchOS

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] keep gesture and modifier behavior consistent between touch and a connected pointer `pointing-devices/best-practices/provide-a-consistent-experience-when-people`
- **Desktop web:** [HIG] hover reveals, consistent gestures and simple, useful hover effects apply `pointing-devices/best-practices/let-people-use-the-pointer-to`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Gestures](gestures.md) · [Keyboards](keyboards.md) · [Remotes](remotes.md)
