---
slug: activity-views
title: "Activity views"
kind: component
group: "Menus and actions"
platforms: [iOS, iPadOS, visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/activity-views
---

# Activity views

**In one line:** The system panel of sharing and content actions (copy, print, send, save) that opens from the Share button for the current item.

## Why it exists
People expect one familiar place to share or act on what they are looking at. The activity view collects system and app-specific actions in that place, so people do not hunt through each app's own layout. Its value depends on familiarity: the entry point, the system actions and the extension flow should behave the way people already know `activity-views/best-practices/use-the-share-button-to-display`.

## Use it when
- People may want to share, copy, print or otherwise act on the current content, and the Share button is the entry point `activity-views/best-practices/use-the-share-button-to-display`
- Your app has its own actions that fit the current context and belong next to system ones `activity-views/best-practices/make-sure-activities-are-appropriate-for`
- You want a quick task, such as posting in one tap, available from other apps through a share or action extension `activity-views/share-and-action-extensions/streamline-and-limit-interaction`

## Don't use it when
- You would open it from a custom control instead of Share: use the Share button, or a [Pull-down button](pull-down-buttons.md) for your own command menu `activity-views/best-practices/use-the-share-button-to-display`
- You want to rebuild a system action such as Print: let the system provide it, and give any similar custom action a distinct title `activity-views/best-practices/avoid-creating-duplicate-versions-of-common`
- You need to show a lot of custom content or settings: use a [Sheet](sheets.md) or [Popover](popovers.md) instead (the HIG lists both as related, with no explicit rule here)

## Cost to the user
Low when it is the standard Share route: it is a brief modal step people already know. Cost grows when irrelevant actions crowd the list, or when an extension adds steps or stacks another modal view on top `activity-views/best-practices/make-sure-activities-are-appropriate-for` `activity-views/share-and-action-extensions/avoid-placing-a-modal-view-above`.

## Principles at stake
- **Familiarity:** one entry point, standard actions, no look-alike duplicates `activity-views/best-practices/use-the-share-button-to-display` `activity-views/best-practices/avoid-creating-duplicate-versions-of-common`
- **Simplicity:** show only relevant activities, with short titles `activity-views/best-practices/make-sure-activities-are-appropriate-for` `activity-views/best-practices/write-a-succinct-descriptive-title-for`
- **Agency:** extensions finish quickly and let the person get back to what they were doing `activity-views/share-and-action-extensions/use-your-main-app-to-denote`

## Key rules
- Open the activity view from the Share button, not another control `activity-views/best-practices/use-the-share-button-to-display`
- Exclude system activities that do not apply, and choose which custom activities to show for the current context `activity-views/best-practices/make-sure-activities-are-appropriate-for`
- Do not recreate system actions; give similar custom actions a distinct, specific title `activity-views/best-practices/avoid-creating-duplicate-versions-of-common`
- Title custom actions with a short verb or verb phrase, without your company or product name `activity-views/best-practices/write-a-succinct-descriptive-title-for`
- Represent a custom activity with a symbol, or a custom icon centered in an area of about 70x70 pixels `activity-views/best-practices/consider-using-a-symbol-to-represent`
- In a share extension, use the system composition view; in an action extension with custom UI, show your app name and app interface elements `activity-views/share-and-action-extensions/if-necessary-create-a-custom-interface`
- Let extensions finish in few steps `activity-views/share-and-action-extensions/streamline-and-limit-interaction`
- Do not place another modal view above an extension (an alert is acceptable) `activity-views/share-and-action-extensions/avoid-placing-a-modal-view-above`
- Show an image that tells who provided the extension and what it does: the app icon for sharing, a clear symbol for actions `activity-views/share-and-action-extensions/if-necessary-provide-an-image-that`
- For long tasks, let work continue in the background, show progress in the main app, and notify only about problems `activity-views/share-and-action-extensions/use-your-main-app-to-denote`

## Platform differences
- **iOS, iPadOS, visionOS:** supported; the guidance above applies to all three.
- **Not available on:** macOS, tvOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] the Share button as the single route to sharing, with short verb titles and only relevant actions, suits any share sheet `activity-views/best-practices/use-the-share-button-to-display`
- **Desktop web:** [HIG transfer] a share menu with context-relevant, uniquely titled actions `activity-views/best-practices/write-a-succinct-descriptive-title-for`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Sheets](sheets.md) · [Popovers](popovers.md) · [Pull-down buttons](pull-down-buttons.md)
