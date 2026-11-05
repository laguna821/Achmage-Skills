---
slug: augmented-reality
title: "Augmented reality"
kind: technology
group: "Technologies"
platforms: [iOS, iPadOS, visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/augmented-reality
---

# Augmented reality

**In one line:** Placing virtual objects into the real world seen through a camera, so people can view, move and explore them in their own space.

## Why it exists
AR blends digital objects with a person's surroundings. The surroundings vary, objects are in 3D while touch is 2D, and people move physically. The guidelines therefore favor clear space for the real world, believable objects, simple interactions and attention to comfort and safety `augmented-reality/best-practices/let-people-use-the-entire-display` `augmented-reality/best-practices/strive-for-convincing-illusions-when-placing` `augmented-reality/best-practices/be-mindful-of-peoples-safety`.

## Use it when
- Seeing an object in the person's own space is the point of the experience `augmented-reality/best-practices/strive-for-convincing-illusions-when-placing`
- Direct manipulation of 3D objects makes the task natural `augmented-reality/designing-object-interactions/let-people-use-direct-manipulation-to`
- The device supports it: otherwise hide an optional AR feature rather than show an error `augmented-reality/offer-ar-features-only-on-capable`

## Don't use it when
- The device cannot run AR: hide the feature `augmented-reality/offer-ar-features-only-on-capable`
- Scaling would defeat the goal, such as judging real furniture size: do not offer scaling `augmented-reality/designing-object-interactions/let-people-initiate-object-scaling-when`
- Text overlays would clutter the scene: use 3D hints, or text only if people don't respond `augmented-reality/communicating-with-people/in-a-three-dimensional-context-prefer`

## Cost to the user
AR can need physical effort, space and a good environment. It can tire people who hold the device up, and it can fail in poor light or on reflective surfaces `augmented-reality/best-practices/be-mindful-of-peoples-comfort` `augmented-reality/suggesting-problem-resolutions/suggest-possible-fixes-if-problems-occur`. Interruptions force re-localization, so keep non-AR tasks inside the AR view `augmented-reality/handling-interruptions/minimize-interruptions-if-your-app-supports`.

## Principles at stake
- **Simplicity:** give the screen to the real world and objects; keep controls in screen space and interactions simple `augmented-reality/best-practices/let-people-use-the-entire-display` `augmented-reality/designing-object-interactions/in-general-keep-interactions-simple`
- **Responsibility:** comfort, safety and gradual movement `augmented-reality/best-practices/be-mindful-of-peoples-safety` `augmented-reality/best-practices/if-your-app-encourages-people-to`
- **Agency:** reset and cancel paths when AR fails `augmented-reality/suggesting-problem-resolutions/let-people-reset-the-experience-if` `augmented-reality/handling-interruptions/allow-people-to-cancel-relocalization`
- **Delight:** believable objects, audio and haptics `augmented-reality/best-practices/use-audio-and-haptics-to-enhance`

## Key rules
- Make realistic objects believable: detailed assets, correct scale, surface placement and matching light and shadow `augmented-reality/best-practices/strive-for-convincing-illusions-when-placing`
- Keep needed controls and information in screen space `augmented-reality/best-practices/if-additional-information-or-controls-are`
- Minimize text in the environment `augmented-reality/best-practices/minimize-text-in-the-environment`
- State requirements up front, as environments vary `augmented-reality/best-practices/anticipate-that-people-will-use-your`
- Show when to find a surface and when an object can be placed `augmented-reality/helping-people-place-objects/show-people-when-to-locate-a`
- Place an object right away, then refine its position once detection finishes `augmented-reality/helping-people-place-objects/when-people-place-an-object-immediately`
- Support standard gestures such as one-finger drag to move and two-finger rotation `augmented-reality/designing-object-interactions/let-people-directly-interact-with-virtual`
- Accept gestures near an interactive object and keep moving objects attached to surfaces `augmented-reality/designing-object-interactions/respond-to-gestures-within-reasonable-proximity` `augmented-reality/designing-object-interactions/strive-for-virtual-object-movement-thats`
- Hide unrelated UI during coaching, and use plain, friendly language in instructions `augmented-reality/providing-coaching/hide-unnecessary-app-ui-while-people` `augmented-reality/communicating-with-people/if-you-must-display-instructional-text`
- Display critical text in screen space `augmented-reality/communicating-with-people/make-important-text-readable`

## Anatomy and content
Glyph and badges: use the AR glyph only to start ARKit experiences, with clear space of 10% of its height `augmented-reality/icons-and-badges/use-the-ar-glyph-as-intended` `augmented-reality/icons-and-badges/maintain-minimum-clear-space`. Use the AR badge only on ARKit-viewable items, prefer the full badge, badge only when some items lack AR, and keep placement consistent `augmented-reality/icons-and-badges/use-the-ar-badges-as-intended` `augmented-reality/icons-and-badges/prefer-the-ar-badge-to-the` `augmented-reality/icons-and-badges/use-badging-only-when-your-app` `augmented-reality/icons-and-badges/keep-badge-placement-consistent-and-clear`.

## Platform differences
- **iOS, iPadOS, visionOS:** the guidance above applies; iOS and iPadOS list no additional considerations.
- **Not available on:** macOS, tvOS, watchOS

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] keep controls in screen space, give plain instructions and a reset path in any camera-based or spatial feature `augmented-reality/suggesting-problem-resolutions/let-people-reset-the-experience-if`
- **Desktop web:** [HIG none]
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Gestures](gestures.md) · [Gyroscope and accelerometer](gyro-and-accelerometer.md) · [Nearby interactions](nearby-interactions.md)
