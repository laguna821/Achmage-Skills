---
slug: eyes
title: "Eyes"
kind: input
group: "Inputs"
platforms: [visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/eyes
---

# Eyes

**In one line:** On Apple Vision Pro, where people look selects what they interact with, so design must make targets easy to look at.

## Why it exists
Looking is the pointer on visionOS, so a crowded or noisy scene makes people's gaze drift. Calm, well-spaced, comfortably placed content keeps their attention on the target `eyes/making-items-easy-to-see/minimize-visual-distractions` and respects visual comfort `eyes/best-practices/design-for-visual-comfort`. Gaze must never be the only path `eyes/best-practices/always-give-people-multiple-ways-to`.

## Use it when
- Designing any visionOS interface: prefer standard components `eyes/best-practices/prefer-using-standard-ui-components`
- You need to guide attention to the likely target with subtle cues `eyes/encouraging-interaction/consider-using-subtle-visual-cues-to`
- A special moment justifies a custom hover effect `eyes/custom-hover-effects/prefer-using-a-custom-hover-effect`

## Don't use it when
- Gaze would be the only input: support multiple ways, including accessibility features `eyes/best-practices/always-give-people-multiple-ways-to`
- Standard hover effects already suffice: do not add custom ones `eyes/custom-hover-effects/prefer-using-a-custom-hover-effect`
- Content would be pinned very close for long reading: place it about a meter away or more `eyes/best-practices/place-content-at-a-comfortable-viewing`

## Cost to the user
Eye strain and mis-targeting are the main costs. Distraction, tight spacing, full-view patterns and close content raise them `eyes/making-items-easy-to-see/minimize-visual-distractions` `eyes/making-items-easy-to-see/avoid-using-a-repeating-pattern-or`.

## Principles at stake
- **Flexibility:** multiple ways to interact `eyes/best-practices/always-give-people-multiple-ways-to`
- **Craft:** rounded shapes, one containing shape, tested hover effects `eyes/encouraging-interaction/in-general-give-an-interactive-item` `eyes/custom-hover-effects/thoroughly-test-custom-hover-effects`
- **Simplicity:** less noise and movement, especially at the periphery `eyes/making-items-easy-to-see/minimize-visual-distractions`

## Key rules
- Keep needed objects within the field of view `eyes/best-practices/design-for-visual-comfort`
- Place content about a meter or more away for extended reading `eyes/best-practices/place-content-at-a-comfortable-viewing`
- Leave at least 16 points around interactive items, or equivalent spacing `eyes/making-items-easy-to-see/make-it-easy-for-people-to`
- Avoid patterns or textures across the whole view; use them in small areas `eyes/making-items-easy-to-see/avoid-using-a-repeating-pattern-or`
- Give interactive items rounded shapes `eyes/encouraging-interaction/in-general-give-an-interactive-item`
- Give multi-element components one containing shape so the whole highlights `eyes/encouraging-interaction/if-you-create-an-interactive-component`
- Choose hover-effect timing: immediate for subtle, delayed for others `eyes/custom-hover-effects/choose-the-right-delay`
- Keep at least one main view of an element unchanged during a custom hover effect `eyes/custom-hover-effects/aim-to-keep-one-or-more`
- Test custom hover effects, ideally on Apple Vision Pro `eyes/custom-hover-effects/thoroughly-test-custom-hover-effects`

## Platform differences
- **visionOS:** the only platform; all rules apply.
- **Not available on:** iOS, iPadOS, macOS, tvOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] generous space around tappable items and multiple input paths help any pointer `eyes/making-items-easy-to-see/make-it-easy-for-people-to`
- **Desktop web:** [HIG transfer] same for hover targets
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Focus and selection](focus-and-selection.md) · [Gestures](https://developer.apple.com/design/human-interface-guidelines/gestures) · [Spatial layout](https://developer.apple.com/design/human-interface-guidelines/spatial-layout) · [Immersive experiences](https://developer.apple.com/design/human-interface-guidelines/immersive-experiences)
