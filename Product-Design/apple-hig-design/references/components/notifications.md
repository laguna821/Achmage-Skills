---
slug: notifications
title: "Notifications"
kind: technology
group: "System experiences"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/notifications
decision_trees: [beyond-the-app]
---

# Notifications

**In one line:** Short messages that reach people outside the app, with optional actions, sounds and a badge count.

## Why it exists
People want timely news without watching an app, but every message takes a slice of their attention. Notifications work when each one is concise and valuable `notifications/best-practices/provide-concise-informative-notifications`, sent once per matter `notifications/best-practices/avoid-sending-multiple-notifications-for-the`, and careful with private details `notifications/best-practices/avoid-including-sensitive-personal-or-confidential`.

## Use it when
- You have valuable information that can be said in very few words `notifications/best-practices/provide-concise-informative-notifications`
- A simple task can be finished right from the notification through an action `notifications/notification-actions/provide-beneficial-actions-that-make-sense`
- You need to show the count of unread notifications through a badge `notifications/badging/use-a-badge-only-to-show`

## Don't use it when
- You are reporting an error: use [Alerts](alerts.md) instead `notifications/best-practices/use-an-alert-not-a-notification`
- The app is in front and the news is minor: bump a badge or quietly update the current view (no HIG alternative component named) `notifications/best-practices/handle-notifications-gracefully-when-your-app`
- You want to tell people to do something in the app: offer a notification action for simple tasks instead `notifications/best-practices/avoid-sending-a-notification-that-tells`
- The matter was already notified: do not repeat it, even if there was no response `notifications/best-practices/avoid-sending-multiple-notifications-for-the`

## Cost to the user
A notification interrupts whatever the person is doing, so each one must justify itself. Repeats and tasks pushed at people cost trust `notifications/best-practices/avoid-sending-multiple-notifications-for-the`. Good actions save steps by avoiding a trip into the app `notifications/notification-actions/provide-beneficial-actions-that-make-sense`.

## Principles at stake
- **Simplicity:** few words, sentence case, no app name or icon in the content `notifications/content/write-succinct-easy-to-read-notification` `notifications/content/avoid-including-your-app-name-or`
- **Responsibility:** one message per matter, and no sensitive text `notifications/best-practices/avoid-including-sensitive-personal-or-confidential`
- **Agency:** actions let people finish tasks on their terms `notifications/notification-actions/provide-beneficial-actions-that-make-sense`
- **Familiarity:** badges mean unread counts only, and errors go to alerts `notifications/badging/use-a-badge-only-to-show` `notifications/best-practices/use-an-alert-not-a-notification`

## Key rules
- Give valuable information in as few words as possible `notifications/best-practices/provide-concise-informative-notifications`
- Add a short title only when it gives context; otherwise let the system show the app name `notifications/content/create-a-short-title-if-it`
- Write short, complete sentences, and do not shorten the message yourself `notifications/content/write-succinct-easy-to-read-notification`
- Supply a generic body that hints at the content for when previews are hidden `notifications/content/provide-generically-descriptive-text-to-display`
- Treat sound as a supplement, never the only carrier of important information `notifications/content/consider-providing-a-sound-to-supplement`
- Do not add an action whose only effect is to open the app `notifications/notification-actions/avoid-providing-an-action-that-merely`
- Prefer nondestructive actions; mark unavoidable destructive ones and give enough context `notifications/notification-actions/prefer-nondestructive-actions`
- Give each action a simple, recognizable icon `notifications/notification-actions/provide-a-simple-recognizable-interface-icon`
- Do not rely on a badge alone for essential information `notifications/badging/make-sure-badging-isnt-the-only`
- Update the badge when people open the related notifications `notifications/badging/keep-badges-up-to-date`
- Never build a custom image or component that imitates a badge `notifications/badging/avoid-creating-a-custom-image-or`

## Anatomy and content
A notification has an optional title, a body, optional actions and an optional sound. Titles use title-style capitalization without ending punctuation; the body uses sentence case `notifications/content/create-a-short-title-if-it` `notifications/content/write-succinct-easy-to-read-notification`. Action labels are short title-case phrases that state the result, with no app name `notifications/notification-actions/provide-beneficial-actions-that-make-sense`.

## Platform differences
- **watchOS (short look):** deliver critical information by other means too, and keep sensitive details out of the title `notifications/platform-considerations/watchos/short-looks/avoid-using-a-short-look-as` `notifications/platform-considerations/watchos/short-looks/keep-privacy-in-mind`
- **watchOS (long look):** always provide a static interface, ideally with a dynamic one; consider a rich custom look `notifications/platform-considerations/watchos/long-looks/at-the-minimum-provide-a-static` `notifications/platform-considerations/watchos/long-looks/consider-using-a-rich-custom-long`
- **watchOS (look styling):** choose a custom or blurred sash, and a content background that is transparent, white at 18% opacity, or a brand color `notifications/platform-considerations/watchos/long-looks/choose-a-background-appearance-for-the` `notifications/platform-considerations/watchos/long-looks/choose-a-background-color-for-the`
- **watchOS (actions):** at most four custom actions, with the most frequently used first for Double Tap `notifications/platform-considerations/watchos/long-looks/provide-up-to-four-custom-actions` `notifications/platform-considerations/watchos/double-tap/keep-double-tap-in-mind-when`
- **iOS, iPadOS, macOS, tvOS, visionOS:** no additional considerations.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] concise text, one message per matter, no sensitive details `notifications/best-practices/provide-concise-informative-notifications`
- **Desktop web:** [HIG] the same content, action and badge rules apply to web push messages `notifications/notification-actions/provide-beneficial-actions-that-make-sense`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Alerts](alerts.md) · [Live Activities](live-activities.md) · [Managing notifications](https://developer.apple.com/design/human-interface-guidelines/managing-notifications) · see [Decision tree](../decision-trees/beyond-the-app.md)
