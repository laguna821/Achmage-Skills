---
slug: icloud
title: "iCloud"
kind: technology
group: "Technologies"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/icloud
---

# iCloud

**In one line:** Apple's cloud storage and sync service: your app's content, state and settings follow people across their devices.

## Why it exists
Once people turn on iCloud system-wide, they assume every app will use it and their content will be everywhere. The guidance makes that sync automatic and low-effort (Agency, Familiarity), and careful with a limited, paid resource (Responsibility) `icloud/best-practices/make-it-easy-to-use-your` `icloud/best-practices/respect-icloud-storage-space`.

## Use it when
- People expect their documents or data on all devices: make iCloud work automatically `icloud/best-practices/make-it-easy-to-use-your`
- People should pick up where they left off on another device: save app state and settings `icloud/best-practices/keep-app-state-information-in-icloud`
- A game has progress to carry over: consider saving it in iCloud `icloud/best-practices/for-games-consider-saving-player-progress`

## Don't use it when
- The data can be regenerated: do not store it in iCloud (no HIG alternative named) `icloud/best-practices/respect-icloud-storage-space`
- A setting suits only one device: do not sync it everywhere `icloud/best-practices/keep-app-state-information-in-icloud`
- You would ask which documents to keep in iCloud: manage files automatically instead `icloud/best-practices/avoid-asking-which-documents-to-keep`

## Cost to the user
Done well, iCloud costs almost nothing: at most one simple first-launch choice for all data or none `icloud/best-practices/make-it-easy-to-use-your`. Done badly, it adds per-document storage decisions, version conflicts, and surprise deletions across devices `icloud/best-practices/avoid-asking-which-documents-to-keep` `icloud/best-practices/warn-about-the-consequences-of-deleting`.

## Principles at stake
- **Agency:** people choose once, resolve conflicts early and confirm deletions `icloud/best-practices/make-conflict-resolution-prompt-and-easy` `icloud/best-practices/warn-about-the-consequences-of-deleting`
- **Familiarity:** iCloud content shows up in search, as people assume it will `icloud/best-practices/include-icloud-content-in-search-results`
- **Responsibility:** store only what people create and understand `icloud/best-practices/respect-icloud-storage-space`
- **Flexibility:** balance freshness against storage and bandwidth `icloud/best-practices/keep-content-up-to-date-when`

## Key rules
- Make iCloud work automatically; if a choice is needed, offer one simple first-launch option `icloud/best-practices/make-it-easy-to-use-your`
- Do not ask which documents to keep in iCloud `icloud/best-practices/avoid-asking-which-documents-to-keep`
- Keep content up to date, and let people decide when to update very large documents `icloud/best-practices/keep-content-up-to-date-when`
- Store only things people create and understand, remembering backups include every app's Documents contents `icloud/best-practices/respect-icloud-storage-space`
- When iCloud is unavailable, skip an alert and quietly say changes will not reach other devices until access returns `icloud/best-practices/make-sure-your-app-behaves-appropriately`
- Sync only the settings people want on every device `icloud/best-practices/keep-app-state-information-in-icloud`
- Warn and ask for confirmation before deleting an iCloud-backed document `icloud/best-practices/warn-about-the-consequences-of-deleting`
- Resolve conflicts automatically when possible; otherwise show a low-key notice that makes versions easy to tell apart, as early as possible `icloud/best-practices/make-conflict-resolution-prompt-and-easy`
- Include iCloud content in search results `icloud/best-practices/include-icloud-content-in-search-results`

## Platform differences
No platform-specific guidance.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] sync should be automatic, and deletion should be confirmed `icloud/best-practices/make-it-easy-to-use-your` `icloud/best-practices/warn-about-the-consequences-of-deleting`
- **Desktop web:** [HIG transfer] resolve conflicts early and include synced content in search `icloud/best-practices/make-conflict-resolution-prompt-and-easy` `icloud/best-practices/include-icloud-content-in-search-results`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Alerts](alerts.md) · [Privacy](https://developer.apple.com/design/human-interface-guidelines/privacy)
