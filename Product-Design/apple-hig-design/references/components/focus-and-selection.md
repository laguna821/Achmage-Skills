---
slug: focus-and-selection
title: "Focus and selection"
kind: input
group: "Inputs"
platforms: [iPadOS, macOS, tvOS, visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/focus-and-selection
---

# Focus and selection

**In one line:** The visible marker of which item will receive input next, driven by keyboards, remotes, controllers or gaze.

## Why it exists
When input is directional rather than pointed, people need to see where they are. A consistent focus marker tells them which item responds, and the system's own effects already do this `focus-and-selection/best-practices/rely-on-system-provided-focus-effects`. It serves Familiarity and Agency: focus moves only when they act `focus-and-selection/best-practices/avoid-changing-focus-without-peoples-interaction`.

## Use it when
- Content is navigated by keyboard, remote or game controller `focus-and-selection/best-practices/avoid-changing-focus-without-peoples-interaction`
- On tvOS, wherever interface elements are navigated by focus `focus-and-selection/best-practices/be-consistent-with-the-platform-as`
- On iPadOS and macOS, for content elements only `focus-and-selection/best-practices/be-consistent-with-the-platform-as`

## Don't use it when
- A system effect would do: avoid custom ones unless truly necessary `focus-and-selection/best-practices/rely-on-system-provided-focus-effects`
- On tvOS, a pointer is tempting: use focus instead `focus-and-selection/platform-considerations/tvos/avoid-displaying-a-pointer`
- Focus would move without a person's action (no HIG alternative named) `focus-and-selection/best-practices/avoid-changing-focus-without-peoples-interaction`

## Cost to the user
Low, if it is predictable. Unexpected focus jumps cost orientation `focus-and-selection/best-practices/avoid-changing-focus-without-peoples-interaction`.

## Principles at stake
- **Familiarity:** platform-native looks, a ring for fields and a highlight for lists `focus-and-selection/best-practices/in-general-use-a-focus-ring`
- **Agency:** focus follows the person's input `focus-and-selection/best-practices/avoid-changing-focus-without-peoples-interaction`
- **Craft:** each focus state looks right and does not crowd neighbors `focus-and-selection/platform-considerations/tvos/design-your-interface-to-accommodate-components`

## Key rules
- Use system focus effects; build custom only if necessary `focus-and-selection/best-practices/rely-on-system-provided-focus-effects`
- Move focus only after the person acts, except with discrete directional devices `focus-and-selection/best-practices/avoid-changing-focus-without-peoples-interaction`
- Follow each platform's focus norms `focus-and-selection/best-practices/be-consistent-with-the-platform-as`
- Show focus with the platform's own look `focus-and-selection/best-practices/indicate-focus-using-visual-appearances-that`
- Use a focus ring for text and search fields, a highlight for lists and collections `focus-and-selection/best-practices/in-general-use-a-focus-ring`
- iPadOS: refine the halo effect when the default does not fit, make Tab order sensible, and prioritize the most important item in a group `focus-and-selection/platform-considerations/ipados/customize-the-halo-focus-effect-when` `focus-and-selection/platform-considerations/ipados/ensure-that-focus-moves-through-your` `focus-and-selection/platform-considerations/ipados/adjust-the-priority-of-an-item`
- tvOS: let gestures act on full-screen content, and supply sharp larger assets for focused items `focus-and-selection/platform-considerations/tvos/in-a-full-screen-experience-let` `focus-and-selection/platform-considerations/tvos/design-your-interface-to-accommodate-components`

## Platform differences
- **iPadOS:** halo, Tab order and priority rules above.
- **tvOS:** no pointer; full-screen gestures act on content; plan every focus state.
- **macOS, visionOS:** the general rules apply.
- **Not available on:** iOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] keyboard focus should have a visible marker and not jump unprompted `focus-and-selection/best-practices/avoid-changing-focus-without-peoples-interaction`
- **Desktop web:** [HIG] focus ring on fields, highlight on lists; keep Tab order sensible `focus-and-selection/best-practices/in-general-use-a-focus-ring` `focus-and-selection/platform-considerations/ipados/ensure-that-focus-moves-through-your`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Eyes](eyes.md) · [Game controls](game-controls.md) · [Keyboards](https://developer.apple.com/design/human-interface-guidelines/keyboards)
