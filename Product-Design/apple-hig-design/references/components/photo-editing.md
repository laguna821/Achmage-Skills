---
slug: photo-editing
title: "Photo editing"
kind: technology
group: "Technologies"
platforms: [iOS, iPadOS, macOS]
source: https://developer.apple.com/design/human-interface-guidelines/photo-editing
---

# Photo editing

**In one line:** A photo editing extension lets your app's tools run inside the Photos app, in a modal view the system provides.

## Why it exists
Editing can take a long time and people judge it by what they see. The guidance protects that work and keeps the extension consistent with the host (Agency, Familiarity) `photo-editing/best-practices/confirm-cancellation-of-edits` `photo-editing/best-practices/dont-provide-a-custom-top-toolbar`.

## Use it when
- You want people to apply your app's edits without leaving Photos: build an extension and use your app icon for it `photo-editing/best-practices/use-your-app-icon-for-your`
- People need to approve results: show a preview before they close the extension `photo-editing/best-practices/let-people-preview-edits`

## Don't use it when
- You are on tvOS, visionOS or watchOS: not supported
- You want a custom top toolbar: use the modal view's own toolbar `photo-editing/best-practices/dont-provide-a-custom-top-toolbar`

## Cost to the user
Cancelling after long editing is costly, so the extension adds one confirmation step in that case `photo-editing/best-practices/confirm-cancellation-of-edits`. A second toolbar would take space and confuse `photo-editing/best-practices/dont-provide-a-custom-top-toolbar`.

## Principles at stake
- **Agency:** preview before closing, confirm before discarding `photo-editing/best-practices/let-people-preview-edits` `photo-editing/best-practices/confirm-cancellation-of-edits`
- **Simplicity:** one toolbar only `photo-editing/best-practices/dont-provide-a-custom-top-toolbar`
- **Responsibility:** the app icon shows the extension truly comes from your app `photo-editing/best-practices/use-your-app-icon-for-your`

## Key rules
- Confirm cancellation and say edits will be lost, unless nothing was edited `photo-editing/best-practices/confirm-cancellation-of-edits`
- Do not add your own top toolbar `photo-editing/best-practices/dont-provide-a-custom-top-toolbar`
- Let people preview edits before returning to Photos `photo-editing/best-practices/let-people-preview-edits`
- Use your app icon as the extension icon `photo-editing/best-practices/use-your-app-icon-for-your`

## Platform differences
- **iOS, iPadOS, macOS:** supported, with no additional considerations.
- **Not available on:** tvOS, visionOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] preview and cancel confirmation apply to any editor `photo-editing/best-practices/let-people-preview-edits` `photo-editing/best-practices/confirm-cancellation-of-edits`
- **Desktop web:** [HIG] the same rules apply `photo-editing/best-practices/confirm-cancellation-of-edits`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Live Photos](live-photos.md) · [Alerts](alerts.md)
