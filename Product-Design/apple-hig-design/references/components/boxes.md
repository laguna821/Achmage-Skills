---
slug: boxes
title: "Boxes"
kind: component
group: "Layout and organization"
platforms: [iOS, iPadOS, macOS, visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/boxes
---

# Boxes

**In one line:** A bordered or tinted container that visibly groups related information and controls, optionally with a short title.

## Why it exists
People understand an interface faster when related things look related. A box draws a boundary around a group so its contents read as one unit. It works only while it stays small and quiet; large or nested boxes make the screen busy (Simplicity) `boxes/best-practices/prefer-keeping-a-box-relatively-small` `boxes/best-practices/consider-using-padding-and-alignment-to`.

## Use it when
- A few controls or facts are logically related and need a visible boundary `boxes/best-practices/prefer-keeping-a-box-relatively-small`
- The relationship needs a word or two of explanation, so a short title helps `boxes/content/provide-a-succinct-introductory-title-if`

## Don't use it when
- The box would fill nearly the whole window or screen: it stops separating anything (no HIG alternative named) `boxes/best-practices/prefer-keeping-a-box-relatively-small`
- You need subgroups inside a group: use padding and alignment rather than nested boxes `boxes/best-practices/consider-using-padding-and-alignment-to`

## Cost to the user
Each border is one more visual element to parse. Nested boxes make the interface feel busy and constrained `boxes/best-practices/consider-using-padding-and-alignment-to`.

## Principles at stake
- **Simplicity:** use space, not extra borders, for sub-grouping `boxes/best-practices/consider-using-padding-and-alignment-to`
- **Responsibility:** a title helps VoiceOver users anticipate what is inside `boxes/content/provide-a-succinct-introductory-title-if`
- **Craft:** consistent title style keeps boxes tidy `boxes/content/if-you-need-a-title-write`

## Key rules
- Keep a box small relative to its container `boxes/best-practices/prefer-keeping-a-box-relatively-small`
- Show subgroups with padding and alignment, not nested boxes `boxes/best-practices/consider-using-padding-and-alignment-to`
- Add a short intro title only when it clarifies the contents `boxes/content/provide-a-succinct-introductory-title-if`
- Write the title as a brief descriptive phrase in sentence-style capitalization, with no closing punctuation, except a colon in a settings pane `boxes/content/if-you-need-a-title-write`

## Anatomy and content
A box has a visible border or background and an optional title. On iOS and iPadOS the default fills are the secondary and tertiary background colors; on macOS the title sits above the box by default (see the source page).

## Platform differences
- **iOS, iPadOS:** default boxes use secondary and tertiary background colors (see the source page).
- **macOS:** the title appears above the box by default (see the source page).
- **visionOS:** no additional considerations.
- **Not available on:** tvOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] keep boxes small and sub-group with spacing `boxes/best-practices/consider-using-padding-and-alignment-to`
- **Desktop web:** [HIG] the same applies to cards and panels `boxes/best-practices/prefer-keeping-a-box-relatively-small`
- **Slides:** [HIG transfer] group with a panel only when small, and use spacing for inner groups `boxes/best-practices/consider-using-padding-and-alignment-to`
- **Card news:** [HIG transfer] use sentence-style, brief titles and spacing over nested frames `boxes/content/if-you-need-a-title-write`

## Related
[Layout](https://developer.apple.com/design/human-interface-guidelines/layout) · [Lists and tables](lists-and-tables.md)
