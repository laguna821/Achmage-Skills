---
slug: snippets
title: "Snippets"
kind: technology
group: "System experiences"
platforms: [iOS, iPadOS, macOS]
source: https://developer.apple.com/design/human-interface-guidelines/snippets
decision_trees: [beyond-the-app]
---

# Snippets

**In one line:** A small custom view that shows a result or asks for confirmation when someone uses your app through the system, without opening it.

## Why it exists
People can trigger app actions from Siri or shortcuts and need a quick visual answer. A snippet gives that answer in a compact view, so the app does not need to open. The view should carry the purpose on its own `snippets/best-practices/communicate-a-snippets-purpose-visually` and stay brief `snippets/best-practices/keep-content-concise` (Simplicity).

## Use it when
- A system-triggered action needs to show a short result `snippets/best-practices/keep-content-concise`
- An action needs a confirmation step with a clear primary button `snippets/best-practices/choose-a-descriptive-label-for-a`

## Don't use it when
- The result needs lots of detail: show the essentials and deep-link into the app instead (no HIG alternative component named) `snippets/best-practices/keep-content-concise`
- The view would only repeat the spoken dialogue: show visual content that expresses the purpose `snippets/best-practices/communicate-a-snippets-purpose-visually`

## Cost to the user
A snippet is brief and does not pull people into the app, so its cost is low if it stays short. Tall or text-heavy views and vague buttons add reading and guessing `snippets/best-practices/keep-content-concise` `snippets/best-practices/choose-a-descriptive-label-for-a`.

## Principles at stake
- **Simplicity:** brief content, with the rest one tap away in the app `snippets/best-practices/keep-content-concise`
- **Flexibility:** respect text size settings and both appearances `snippets/best-practices/ensure-legibility`
- **Craft:** consistent margins and enough contrast with the system background `snippets/best-practices/ensure-legibility`

## Key rules
- Make custom content contrast enough with the system background in light and dark `snippets/best-practices/ensure-legibility`
- Keep content margins consistent `snippets/best-practices/ensure-legibility`
- Keep custom views no taller than 400 points `snippets/best-practices/keep-content-concise`
- Allow for the person's text size setting `snippets/best-practices/keep-content-concise`
- Deep-link to the app for additional result detail `snippets/best-practices/keep-content-concise`
- Label a confirmation's primary button with a specific action word such as Order, not OK or Proceed `snippets/best-practices/choose-a-descriptive-label-for-a`
- Convey the purpose visually and leave spoken dialogue text out of the view `snippets/best-practices/communicate-a-snippets-purpose-visually`

## Platform differences
- **iOS, iPadOS, macOS:** no additional considerations.
- **Not available on:** tvOS, visionOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] brief views and specific button labels apply as written `snippets/best-practices/choose-a-descriptive-label-for-a`
- **Desktop web:** [HIG] the same brevity and labeling rules apply `snippets/best-practices/keep-content-concise`
- **Slides:** [HIG transfer] keep a result slide brief and let the visual carry the purpose `snippets/best-practices/communicate-a-snippets-purpose-visually`
- **Card news:** [HIG transfer] same, and keep a clear contrast with the background `snippets/best-practices/ensure-legibility`

## Related
[Live Activities](live-activities.md) · [Siri](https://developer.apple.com/design/human-interface-guidelines/siri) · [App Shortcuts](https://developer.apple.com/design/human-interface-guidelines/app-shortcuts) · see [Decision tree](../decision-trees/beyond-the-app.md)
