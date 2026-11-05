---
tree: beyond-the-app
title: "Reaching people outside the app"
members: [widgets, live-activities, notifications, controls, complications, app-shortcuts, snippets, top-shelf, watch-faces]
---

# Decision tree: Reaching people outside the app

**Use this when:** you want to give people something useful without making them open the app, and need to pick the surface.
**Members:** [Widgets](../components/widgets.md) · [Live Activities](../components/live-activities.md) · [Notifications](../components/notifications.md) · [Controls](../components/controls.md) · [Complications](../components/complications.md) · [App Shortcuts](../components/app-shortcuts.md) · [Snippets](../components/snippets.md) · [Top Shelf](../components/top-shelf.md) · [Watch Faces](../components/watch-faces.md)
**Related patterns:** [Managing notifications](https://developer.apple.com/design/human-interface-guidelines/managing-notifications)

## Start with the need
1. **Do people need to glance at information that changes through the day, with no action required?**
   - Yes, on iPhone, iPad, Mac or Vision Pro → [Widgets](../components/widgets.md). Pick one simple idea tied to the app's core purpose and favor changing data. `widgets/best-practices/choose-simple-ideas-that-relate-to` `widgets/best-practices/prefer-dynamic-information-that-changes-throughout`
   - Yes, on the Apple Watch face → [Complications](../components/complications.md). Show essential, changing information, not just a launcher. `complications/best-practices/identify-essential-dynamic-content-that-people`
   - Yes, on Apple TV's home screen → [Top Shelf](../components/top-shelf.md). Take people straight to content they care about. `top-shelf/best-practices/help-people-jump-right-into-your`
   - No → go to 2
2. **Is the need to follow one task or event that starts and ends, with frequent updates?**
   - Yes → [Live Activities](../components/live-activities.md), for tasks with a clear start and end of at most eight hours. Widgets are not real-time. `live-activities/best-practices/offer-live-activities-for-tasks-and` `widgets/platform-considerations/ios-ipados/offer-live-activities-to-show-real`
   - Several events at once → keep them in one Live Activity that rotates through them. `live-activities/best-practices/starting-updating-and-ending-a-live-activity/let-people-track-multiple-events-efficiently`
   - No → go to 3
3. **Is it a single, quick action that does not need the app open?**
   - Yes → [Controls](../components/controls.md), for the actions with the greatest benefit, such as starting a Live Activity. `controls/best-practices/offer-controls-for-actions-that-provide`
   - If the action affects security (a door, a car), require authentication. `controls/best-practices/require-authentication-for-actions-that-affect`
   - A short in-widget action tied to its content is also acceptable; complex tasks stay in the app. `widgets/best-practices/adding-interactivity/offer-simple-relevant-functionality-and-reserve`
   - No → go to 4
4. **Do people want to start a task by voice or search, or run it from the system?**
   - Yes → [App Shortcuts](../components/app-shortcuts.md) for the tasks done most, ideally finishable without leaving the current context. `app-shortcuts/best-practices/offer-app-shortcuts-for-your-apps`
   - The system's answer to the request (a result or confirmation) → [Snippets](../components/snippets.md). Keep it brief and label the confirm button with a specific verb. `snippets/best-practices/keep-content-concise` `snippets/best-practices/choose-a-descriptive-label-for-a`
   - No → go to 5
5. **Does something happen that people must hear about when they are not looking?**
   - Yes → [Notifications](../components/notifications.md). Give valuable information in few words, one notification per matter. `notifications/best-practices/provide-concise-informative-notifications` `notifications/best-practices/avoid-sending-multiple-notifications-for-the`
   - It is an error → use an alert in the app instead. `notifications/best-practices/use-an-alert-not-a-notification`
   - It is promotional → get explicit permission first and never mark it Time Sensitive. `managing-notifications/sending-marketing-notifications/get-peoples-permission-if-you-want` `managing-notifications/sending-marketing-notifications/never-use-the-time-sensitive-interruption`
   - It is urgent → Time Sensitive only for events happening now or within an hour. `managing-notifications/best-practices/use-the-time-sensitive-interruption-level`
   - Only a live task's progress → a Live Activity, and alert only for crucial updates. `live-activities/best-practices/starting-updating-and-ending-a-live-activity/alert-people-only-for-essential-updates`
   - No → go to 6
6. **Do you want people to find your app through ready-made watch faces?**
   - Yes → [Watch Faces](../components/watch-faces.md): share faces featuring several of your complications, with a preview. `watch-faces/best-practices/help-people-discover-your-app-by` `watch-faces/best-practices/display-a-preview-of-each-watch`
   - No → none of these surfaces; keep the content in the app.
7. **Is the information sensitive?**
   - Yes → show a harmless summary or let the system redact it, on every surface. `live-activities/best-practices/avoid-displaying-sensitive-information` `controls/best-practices/hide-sensitive-information-when-the-device` `notifications/best-practices/avoid-including-sensitive-personal-or-confidential` `complications/best-practices/keep-privacy-in-mind`

## At a glance
| Component | Needs the person to look | Time span | Can act | Best for | Avoid when |
| --- | --- | --- | --- | --- | --- |
| Widgets | Glance at will | Ongoing | Simple actions | Changing, relevant information | Real-time tracking `widgets/platform-considerations/ios-ipados/offer-live-activities-to-show-real` |
| Live Activities | Glance at will | Up to 8 hours | One simple element | A task or event in progress | Ads, endless tasks `live-activities/best-practices/dont-use-a-live-activity-to` |
| Notifications | Interrupts | One matter | Few quick actions | Things to hear about now | Errors, repeats `notifications/best-practices/use-an-alert-not-a-notification` |
| Controls | Tap to use | Instant | Yes, that is the point | Action without opening the app | Needs the full app `controls/best-practices/offer-controls-for-actions-that-provide` |
| Complications | Glance at will | Ongoing | Deep link | Watch-face data | A pure launcher `complications/best-practices/identify-essential-dynamic-content-that-people` |
| App Shortcuts | Voice or search | Instant | Yes | Frequent tasks | Awkward spoken phrases `app-shortcuts/best-practices/keep-voice-interactions-simple` |
| Snippets | Shown in reply | One exchange | Confirm | Results and confirmations | Long content `snippets/best-practices/keep-content-concise` |
| Top Shelf | Browse | Ongoing | Play or more info | New and personal content | Ads, prices `top-shelf/best-practices/avoid-showing-advertisements-or-prices` |
| Watch Faces | Browse | Ongoing | Install | App discovery | Incompatible models `watch-faces/best-practices/respond-gracefully-if-people-choose-an` |

## Platform notes
- **iOS and iPadOS:** Widgets must stay legible when the Always-On display dims, and in StandBy convey meaning without rich images. `widgets/platform-considerations/ios-ipados/support-the-always-on-display-on` `widgets/platform-considerations/ios-ipados/standby-and-carplay/limit-usage-of-rich-images-or`
- **watchOS:** Widgets appear in the Smart Stack; supply relevancy so the system can raise them. Live Activities there may need a custom layout. `widgets/platform-considerations/watchos/encourage-the-system-to-display-or` `live-activities/platform-considerations/watchos/consider-creating-a-custom-watchos-layout`
- **CarPlay and watchOS while driving:** leave buttons and toggles out of Live Activity layouts. `live-activities/carplay/carefully-consider-including-buttons-or-toggles` `live-activities/platform-considerations/watchos/carefully-consider-including-buttons-or-toggles`
- **visionOS:** Widgets belong to the room; design for viewing distance. `widgets/platform-considerations/visionos/adapt-your-design-and-content-for`
- **tvOS:** Top Shelf is the only surface here. Supply at least a static fallback image if you lack full-screen content. `top-shelf/best-practices/if-you-dont-provide-the-recommended`

## Common mistakes
- **Copying the app icon into a widget:** deliver wanted content with actions and deep links. `widgets/best-practices/aim-to-create-a-widget-that`
- **Leaving a Live Activity running:** end it when the task finishes. `live-activities/best-practices/starting-updating-and-ending-a-live-activity/always-end-a-live-activity-immediately`
- **Notifying and also updating a Live Activity for the same news:** avoid duplicate pushes. `live-activities/best-practices/starting-updating-and-ending-a-live-activity/alert-people-only-for-essential-updates`
- **Notification actions that only open the app:** drop them. `notifications/notification-actions/avoid-providing-an-action-that-merely`
- **Using a badge for non-notification numbers:** badge only unread counts. `notifications/badging/use-a-badge-only-to-show`
- **Overstating urgency:** match the interruption level to real urgency. `managing-notifications/best-practices/build-trust-by-accurately-representing-the`
- **No way to change choices:** provide in-app notification settings. `managing-notifications/sending-marketing-notifications/make-sure-people-can-manage-their`

## Not settled by the HIG
- Widget interaction versus a Control for one-tap actions: the HIG describes both but gives no rule to choose between them. [HIG none]
- Complication versus Smart Stack widget on watchOS: no stated choice rule. [HIG none]
- How App Shortcuts and Snippets relate in a given flow: the cards describe each, with no joint decision rule. [HIG none]

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] Treat these as glanceable summaries, timely alerts and quick actions; the same restraint rules apply (few words, honest urgency, permission first). `notifications/best-practices/provide-concise-informative-notifications`
- **Desktop web:** [HIG transfer] Web notifications and status badges follow the same limits: unread counts only, no errors, no ads. `notifications/badging/use-a-badge-only-to-show`
- **Slides and card news:** [HIG transfer] Glanceable surfaces suggest one core idea with essential facts first and detail on a longer look. `widgets/best-practices/balance-information-density`
