---
slug: game-controls
title: "Game controls"
kind: input
group: "Inputs"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/game-controls
---

# Game controls

**In one line:** How a game takes input: virtual touch controls, physical controllers, keyboards and spatial controllers.

## Why it exists
Games need fast, comfortable input across very different hardware. Good controls feel natural on each device, always have a fallback, and use the controller's own labels `game-controls/physical-controllers/support-the-platforms-default-interaction-method` `game-controls/physical-controllers/customize-onscreen-content-to-match-the`. They serve Familiarity and Flexibility.

## Use it when
- A touch game has many actions or movement control that justify virtual controls `game-controls/touch-controls/determine-whether-it-makes-sense-to`
- You support controllers: detect them automatically `game-controls/physical-controllers/automatically-detect-whether-a-controller-is`
- You support keyboards: use single-key commands and remappable bindings `game-controls/keyboards/prioritize-single-key-commands` `game-controls/keyboards/let-players-customize-key-bindings`

## Don't use it when
- In-game gestures and objects can replace on-screen buttons: tie actions to them to cut overlap `game-controls/touch-controls/determine-whether-it-makes-sense-to`
- The controller is required and unmentioned: say so (tvOS, visionOS) `game-controls/physical-controllers/tell-people-about-game-controller-requirements`
- Abstract shapes or names such as A, X or R1 would label touch buttons: depict the action `game-controls/touch-controls/use-symbols-that-communicate-the-actions`

## Cost to the user
Overlapping virtual controls hide the game; setup steps delay play. Automatic detection, sensible defaults and a fallback method lower the cost `game-controls/physical-controllers/automatically-detect-whether-a-controller-is`.

## Principles at stake
- **Familiarity:** standard UI mapping, such as A to activate and B to go back `game-controls/physical-controllers/map-controller-buttons-to-expected-ui`
- **Flexibility:** several controllers, remappable keys `game-controls/physical-controllers/support-multiple-connected-controllers`
- **Craft:** comfortable placement and clear press states `game-controls/touch-controls/always-include-visible-and-tactile-press`

## Key rules
- Touch: place buttons in safe areas, clear of the Home indicator and Dynamic Island, frequent ones near the thumb `game-controls/touch-controls/place-virtual-buttons-where-theyre-easy`
- Size frequent controls at least 44x44 pt, less important ones at least 28x28 pt `game-controls/touch-controls/make-sure-controls-are-large-enough`
- Give a visible press state plus sound and haptics `game-controls/touch-controls/always-include-visible-and-tactile-press`
- Show or hide controls to match gameplay `game-controls/touch-controls/show-and-hide-virtual-controls-to`
- Use double tap or touch and hold for variants instead of simultaneous presses `game-controls/touch-controls/combine-functionality-into-a-single-control`
- Movement on the left, camera on the right, large input areas `game-controls/touch-controls/map-movement-and-camera-controls-to`
- Controllers: keep the platform default method as fallback, and use the connected controller's own labels, with SF Symbols over text `game-controls/physical-controllers/support-the-platforms-default-interaction-method` `game-controls/physical-controllers/prefer-using-symbols-not-text-to`
- Keyboards: test comfort and place important commands near the movement keys `game-controls/keyboards/test-key-binding-comfort-game-using` `game-controls/keyboards/take-the-proximity-of-keys-into`

## Platform differences
- **visionOS:** spatial controllers act like hands: look and press a trigger to select `game-controls/platform-considerations/visionos/match-spatial-game-controller-behavior-to`
- **iOS, iPadOS, macOS, tvOS:** no additional considerations.
- **Not available on:** watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] touch target size, thumb zones and press feedback apply to any on-screen controls `game-controls/touch-controls/make-sure-controls-are-large-enough`
- **Desktop web:** [HIG transfer] single-key shortcuts and remapping suit browser games `game-controls/keyboards/let-players-customize-key-bindings`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Focus and selection](focus-and-selection.md) · [Designing for games](https://developer.apple.com/design/human-interface-guidelines/designing-for-games) · [Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures) · [Keyboards](https://developer.apple.com/design/human-interface-guidelines/keyboards)
