---
slug: image-views
title: "Image views"
kind: component
group: "Content"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/image-views
---

# Image views

**In one line:** A plain view that shows a picture or an animated sequence of pictures, without editing or action behavior of its own.

## Why it exists
Pictures carry content that text cannot. An image view does one job, showing an image, and leaves tapping, editing and iconography to elements built for them (Familiarity, Simplicity) `image-views/best-practices/use-an-image-view-when-the`. Keeping each element to its own job makes the interface predictable.

## Use it when
- You need to display a picture and nothing else `image-views/best-practices/use-an-image-view-when-the`
- You show a sequence of animation frames that share one size and shape `image-views/content/aim-to-use-a-consistent-size`

## Don't use it when
- The image must be tappable or clickable: use a system [Buttons](buttons.md) element holding the image instead `image-views/best-practices/use-an-image-view-when-the`
- You need an interface icon: use a symbol or interface icon (see [Icons](../icons.md) for the house spec) `image-views/best-practices/if-you-want-to-display-an`
- On Mac, people must edit the image: use [Image wells](image-wells.md) instead `image-views/platform-considerations/macos/if-your-app-needs-an-editable`
- On Mac, a picture should trigger an action: use an image button, not an image view `image-views/platform-considerations/macos/use-an-image-button-instead-of`

## Cost to the user
An image view itself asks for no decision. The cost comes from text laid over a picture, which can hurt both the image and the legibility of the words `image-views/content/take-care-when-overlaying-text-on`.

## Principles at stake
- **Familiarity:** a picture that looks tappable but is not (or the reverse) breaks expectation, so use a real button for actions `image-views/best-practices/use-an-image-view-when-the`
- **Craft:** overlaid text needs enough contrast, with a shadow or background layer when needed `image-views/content/take-care-when-overlaying-text-on`
- **Simplicity:** each element does its own job rather than imitating another `image-views/best-practices/use-an-image-view-when-the`

## Key rules
- Use a plain image view only to show a picture; wrap it in a button for interaction `image-views/best-practices/use-an-image-view-when-the`
- Choose symbols or interface icons over image views for icons, since they are vector-based, can take color and opacity, and follow the accent color `image-views/best-practices/if-you-want-to-display-an`
- Check that overlaid text contrasts clearly with the picture `image-views/content/take-care-when-overlaying-text-on`
- Prepare all frames of an animated sequence at the same size and shape so the system need not rescale `image-views/content/aim-to-use-a-consistent-size`
- On Mac, use an image well for editable images (copy, paste, drag, clear with Delete) `image-views/platform-considerations/macos/if-your-app-needs-an-editable`
- On Mac, use an image button for a clickable picture `image-views/platform-considerations/macos/use-an-image-button-instead-of`

## Platform differences
- **macOS:** image wells for editable images, image buttons for clickable ones `image-views/platform-considerations/macos/if-your-app-needs-an-editable` `image-views/platform-considerations/macos/use-an-image-button-instead-of`
- **watchOS:** prefer SwiftUI for animation, with WatchKit image sequences only if needed `image-views/platform-considerations/watchos/use-swiftui-to-create-animations-when`
- **iOS, iPadOS:** no additional considerations.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] show a picture in a plain image and put actions on a real button `image-views/best-practices/use-an-image-view-when-the`; overlaid text rule applies as written `image-views/content/take-care-when-overlaying-text-on`
- **Desktop web:** [HIG transfer] use an image for display and a button or link for interaction; ensure overlay text contrast `image-views/content/take-care-when-overlaying-text-on`
- **Slides:** [HIG] text over a picture needs clear contrast `image-views/content/take-care-when-overlaying-text-on`
- **Card news:** [HIG] text over a picture needs clear contrast, using a shadow or background layer if needed `image-views/content/take-care-when-overlaying-text-on`

## Related
[Image wells](image-wells.md) · [Buttons](buttons.md) · [Images](https://developer.apple.com/design/human-interface-guidelines/images) · [Icons](../icons.md)
