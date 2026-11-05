---
slug: gestures
title: "Gestures"
kind: input
group: "Inputs"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/gestures
---

# Gestures

**In one line:** Touch, hand and finger movements that control an interface. Standard gestures carry shared meanings, so people use them without learning.

## Why it exists
People already know how a tap, swipe or pinch behaves from other apps and from the system. Honoring those meanings makes an app feel predictable `gestures/best-practices/in-general-respond-to-gestures-in`. Gestures are never the only route, because some people use voice, a keyboard or Switch Control instead `gestures/best-practices/give-people-more-than-one-way`.

## Use it when
- You want people to act directly on content with the gestures they already know, such as tap or swipe `gestures/best-practices/in-general-respond-to-gestures-in`
- A specialized, frequent task justifies a custom gesture, and it is also easy to discover and distinct from others `gestures/custom-gestures/add-custom-gestures-only-when-necessary`
- A shortcut gesture can speed up a path that already exists as visible UI `gestures/custom-gestures/use-shortcut-gestures-to-supplement-standard`

## Don't use it when
- A gesture would be the only way to do something important: also provide a visible control, a keyboard path or another input (see [Keyboards](keyboards.md)) `gestures/custom-gestures/add-custom-gestures-only-when-necessary`
- A standard action would need an invented gesture: use the standard gesture instead `gestures/best-practices/in-general-respond-to-gestures-in`
- The gesture would clash with a system gesture, such as watchOS edge swipes or visionOS hand rolling (games and immersive experiences may be exceptions) `gestures/custom-gestures/avoid-conflicting-with-gestures-that-access`
- The same job suits a pointer or a remote: see [Pointing devices](pointing-devices.md) or [Remotes](remotes.md)

## Cost to the user
A standard gesture costs almost nothing to learn. A custom gesture adds a learning step, and a hard-to-describe one is likely hard to learn `gestures/custom-gestures/make-custom-gestures-easy-to-learn`. On visionOS, physically tiring gestures add bodily cost `gestures/platform-considerations/visionos/designing-custom-gestures-in-visionos/prioritize-comfort`.

## Principles at stake
- **Familiarity:** keep standard meanings; do not give tap or swipe an app-specific sense `gestures/best-practices/in-general-respond-to-gestures-in`
- **Agency:** offer more than one way to act, and show clearly when a gesture is unavailable `gestures/best-practices/give-people-more-than-one-way` `gestures/best-practices/indicate-when-a-gesture-isnt-available`
- **Flexibility:** do not depend on particular body movements or one hand `gestures/platform-considerations/visionos/avoid-requiring-specific-body-movements-or` `gestures/platform-considerations/visionos/designing-custom-gestures-in-visionos/avoid-custom-gestures-that-require-using`
- **Simplicity:** add custom gestures only for specialized, frequent tasks `gestures/custom-gestures/add-custom-gestures-only-when-necessary`

## Key rules
- Offer more than one way to use the app `gestures/best-practices/give-people-more-than-one-way`
- Make gestures behave as people expect, and do not invent new ones for standard actions `gestures/best-practices/in-general-respond-to-gestures-in`
- Respond quickly, with feedback that helps people predict the result and see the movement needed `gestures/best-practices/handle-gestures-as-responsively-as-possible`
- Show when a gesture is unavailable, for example with a locked object or a disabled button `gestures/best-practices/indicate-when-a-gesture-isnt-available`
- Give people chances to learn custom gestures and test them in real use `gestures/custom-gestures/make-custom-gestures-easy-to-learn`
- Keep familiar paths such as a Back button in the toolbar even when a shortcut gesture exists `gestures/custom-gestures/use-shortcut-gestures-to-supplement-standard`
- Support standard gestures such as tap wherever you can, even beside custom ones `gestures/platform-considerations/visionos/support-standard-gestures-everywhere-you-can`

## Platform differences
- **iOS, iPadOS:** consider recognizing several gestures at once when it helps, as with a game joystick plus fire buttons `gestures/platform-considerations/ios-ipados/consider-allowing-simultaneous-recognition-of-multiple`
- **macOS:** with touch, keep layout and element size unchanged and enlarge tap targets, not controls `gestures/platform-considerations/macos/keep-the-layout-and-size-of` `gestures/platform-considerations/macos/make-tap-targets-bigger-not-the`. Offer a touch-sized temporary variant for small or dense controls `gestures/platform-considerations/macos/consider-providing-expandable-controls`. Everything must also work with keyboard and pointer `gestures/platform-considerations/macos/dont-use-touch-as-the-only`. Reuse gestures people know, after testing for conflicts `gestures/platform-considerations/macos/where-possible-align-with-gestures-people`. Custom gestures should work with touch and trackpad `gestures/platform-considerations/macos/make-sure-custom-gestures-work-for`
- **visionOS:** default to indirect gestures for buttons and common controls; keep direct and custom gestures for close-up objects and special motions `gestures/platform-considerations/visionos/offer-both-indirect-and-direct-interactions`. Test ergonomics, avoid raised arms and long runs of similar motion `gestures/platform-considerations/visionos/designing-custom-gestures-in-visionos/prioritize-comfort`. Think hard before requiring multi-finger or two-hand gestures, and offer a lighter alternative `gestures/platform-considerations/visionos/designing-custom-gestures-in-visionos/carefully-consider-complex-custom-gestures-that`. Keep content away from the hand area `gestures/platform-considerations/visionos/working-with-system-overlays-in-visionos/reserve-the-area-around-a-persons`. Be wary of rolling-hand gestures `gestures/platform-considerations/visionos/working-with-system-overlays-in-visionos/use-caution-when-designing-custom-gestures`
- **watchOS (double tap):** map it to the most-used button in a view, such as play/pause `gestures/platform-considerations/watchos/double-tap/choose-the-button-that-people-use`; do not set a primary double-tap action in list, scroll or vertical-tab views `gestures/platform-considerations/watchos/double-tap/avoid-setting-a-primary-action-in`
- **tvOS:** no additional considerations here; see [Remotes](remotes.md).

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] keep standard touch meanings and avoid app-specific swipes or taps `gestures/best-practices/in-general-respond-to-gestures-in`
- **Desktop web:** [HIG] provide more than one way to act, including keyboard and pointer `gestures/best-practices/give-people-more-than-one-way`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Keyboards](keyboards.md) · [Pointing devices](pointing-devices.md) · [Remotes](remotes.md) · [Gyroscope and accelerometer](gyro-and-accelerometer.md)
