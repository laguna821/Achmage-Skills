---
slug: imessage-apps-and-stickers
title: "iMessage apps and stickers"
kind: technology
group: "Technologies"
platforms: [iOS, iPadOS]
source: https://developer.apple.com/design/human-interface-guidelines/imessage-apps-and-stickers
---

# iMessage apps and stickers

**In one line:** Mini-apps and sticker packs that live inside the Messages conversation, so people can share content or act together without leaving it.

## Why it exists
People open an iMessage app mid-conversation, so it must be quick to grasp and ready at once. The guidance narrows each app to one main job (Simplicity, Purpose) and makes stickers readable on any background `imessage-apps-and-stickers/best-practices/prefer-providing-one-primary-experience-in` `imessage-apps-and-stickers/best-practices/create-stickers-that-are-expressive-inclusive`.

## Use it when
- You have shareable content or a simple shared task that helps a conversation `imessage-apps-and-stickers/best-practices/consider-surfacing-content-from-your-ios`
- You want to offer expressive stickers `imessage-apps-and-stickers/best-practices/create-stickers-that-are-expressive-inclusive`

## Don't use it when
- You have several kinds of content or functionality: make a separate iMessage app for each, not one crowded app `imessage-apps-and-stickers/best-practices/prefer-providing-one-primary-experience-in`
- You are on macOS, tvOS, visionOS or watchOS: not supported there

## Cost to the user
Space is the main cost. The compact view is small and occupies about the keyboard's area, so it must hold only the most used items `imessage-apps-and-stickers/best-practices/present-essential-features-in-the-compact`. Editing text in the compact view would hide your content `imessage-apps-and-stickers/best-practices/in-general-let-people-edit-text`.

## Principles at stake
- **Simplicity:** one primary experience per app, essentials in compact view `imessage-apps-and-stickers/best-practices/prefer-providing-one-primary-experience-in` `imessage-apps-and-stickers/best-practices/present-essential-features-in-the-compact`
- **Flexibility:** stickers work on varied backgrounds, and each has a localized description `imessage-apps-and-stickers/best-practices/create-stickers-that-are-expressive-inclusive` `imessage-apps-and-stickers/best-practices/for-each-sticker-provide-a-localized`
- **Delight:** expressive stickers `imessage-apps-and-stickers/best-practices/create-stickers-that-are-expressive-inclusive`

## Key rules
- Give the app one main experience `imessage-apps-and-stickers/best-practices/prefer-providing-one-primary-experience-in`
- Bring useful content from your iOS or iPadOS app, such as shareable info or a simple collaborative task `imessage-apps-and-stickers/best-practices/consider-surfacing-content-from-your-ios`
- Put the most frequently used items in the compact view and the rest in the expanded view `imessage-apps-and-stickers/best-practices/present-essential-features-in-the-compact`
- Allow text editing generally only in the expanded view `imessage-apps-and-stickers/best-practices/in-general-let-people-edit-text`
- Make stickers legible on varied backgrounds and when rotated or scaled; transparency helps them blend in `imessage-apps-and-stickers/best-practices/create-stickers-that-are-expressive-inclusive`
- Give every sticker a localized alternative description, which VoiceOver reads aloud `imessage-apps-and-stickers/best-practices/for-each-sticker-provide-a-localized`

## Platform differences
- **iOS, iPadOS:** supported, with no additional considerations.
- **Not available on:** macOS, tvOS, visionOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] a small embedded surface should hold essentials and defer the rest to an expanded state `imessage-apps-and-stickers/best-practices/present-essential-features-in-the-compact`
- **Desktop web:** [HIG transfer] one primary job per embedded widget `imessage-apps-and-stickers/best-practices/prefer-providing-one-primary-experience-in`
- **Slides:** [HIG] sticker art should stay legible on varied backgrounds, which also suits slide graphics placed over photos `imessage-apps-and-stickers/best-practices/create-stickers-that-are-expressive-inclusive`
- **Card news:** [HIG] the same sticker legibility guidance applies to graphics overlaid on other content `imessage-apps-and-stickers/best-practices/create-stickers-that-are-expressive-inclusive`

## Related
[Messages for Business](https://developer.apple.com/design/human-interface-guidelines/messages-for-business) · [Sharing](https://developer.apple.com/design/human-interface-guidelines/sharing)
