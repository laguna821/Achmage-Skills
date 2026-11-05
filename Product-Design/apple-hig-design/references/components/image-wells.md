---
slug: image-wells
title: "Image wells"
kind: component
group: "Selection and input"
platforms: [macOS]
source: https://developer.apple.com/design/human-interface-guidelines/image-wells
---

# Image wells

**In one line:** An editable image view where people can place, copy, paste or clear an image.

## Why it exists
Some settings hold an image, such as an avatar, and people should be able to change it directly. The HIG asks for two things: a sensible fallback when the image is cleared, and normal copy and paste `image-wells/best-practices/revert-to-a-default-image-when` `image-wells/best-practices/if-your-image-well-supports-copy`. Familiarity and Responsibility.

## Use it when
- A setting holds a user-chosen image on Mac [HIG none] beyond the definition
- People should be able to copy and paste images `image-wells/best-practices/if-your-image-well-supports-copy`

## Don't use it when
- The image is display-only: use a plain image view [HIG none] (no HIG alternative named)
- You are not on macOS: not available (no HIG alternative named)

## Cost to the user
Low. An empty well with no default can leave a required slot blank, so restore the default `image-wells/best-practices/revert-to-a-default-image-when`.

## Principles at stake
- **Responsibility:** a required image never ends up empty `image-wells/best-practices/revert-to-a-default-image-when`
- **Familiarity:** standard Edit menu items and shortcuts `image-wells/best-practices/if-your-image-well-supports-copy`

## Key rules
- If the well must always hold an image, show the default again after clearing `image-wells/best-practices/revert-to-a-default-image-when`
- When copy and paste work, keep the standard Edit menu items and keyboard shortcuts `image-wells/best-practices/if-your-image-well-supports-copy`
- On Mac, use an image well when an image must be editable, and a plain image view otherwise `image-views/platform-considerations/macos/if-your-app-needs-an-editable` `image-views/best-practices/use-an-image-view-when-the`

The image well page itself gives little more.

## Platform differences
- **macOS:** the only platform; no further guidance.
- **Not available on:** iOS, iPadOS, tvOS, visionOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] an avatar picker falls back to a default when cleared `image-wells/best-practices/revert-to-a-default-image-when`
- **Desktop web:** [HIG transfer] an image drop area keeps standard paste shortcuts `image-wells/best-practices/if-your-image-well-supports-copy`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Color wells](color-wells.md) · [Image views](https://developer.apple.com/design/human-interface-guidelines/image-views)
