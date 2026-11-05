---
slug: homekit
title: "HomeKit"
kind: technology
group: "Technologies"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/homekit
---

# HomeKit

**In one line:** Apple's smart home framework: guidance for accessory setup, naming, Siri use, custom features, and how to show HomeKit icons and names.

## Why it exists
People control lights, locks and cameras by voice and by app, so accessories must be easy to set up and consistent with the Home app. The guidance reuses the system setup and settings (Familiarity), keeps setup short (Simplicity), and avoids surprising changes to people's homes (Responsibility) `homekit/setup/use-the-system-provided-setup-flow` `homekit/custom-functionality/ask-permission-to-update-the-homekit`.

## Use it when
- You make a smart home accessory and want setup to be fast and familiar: start with the system setup flow `homekit/setup/use-the-system-provided-setup-flow`
- You offer features HomeKit lacks: add a custom experience after basic setup works `homekit/setup/carefully-consider-how-and-when-to`
- You want voice control to work well: help people pick good names and teach example Siri phrases `homekit/siri-interactions/present-example-voice-commands-to-demonstrate`

## Don't use it when
- People already chose HomeKit setup: do not push another platform's setup into it `homekit/setup/honor-peoples-setup-choices`
- You would repeat home settings or ask people to redo setup: defer to the Home app (no HIG alternative named) `homekit/terminology-and-layout/dont-present-duplicate-home-settings`
- A shortcut would duplicate something HomeKit already does: leave it out `homekit/siri-interactions/offer-shortcuts-only-for-accessory-specific`

## Cost to the user
Setup is the main cost. The system flow handles naming, networks, pairing, rooms and favorites in a few steps, whereas custom or repeated setup delays use of the accessory `homekit/setup/use-the-system-provided-setup-flow` `homekit/setup/honor-peoples-setup-choices`. Requiring an account adds a barrier, so keep it optional and after setup `homekit/setup/dont-require-people-to-create-an`.

## Principles at stake
- **Familiarity:** mirror the home, room and zone model, and defer to Home app settings `homekit/terminology-and-layout/acknowledge-the-hierarchical-model-that-homekit` `homekit/terminology-and-layout/dont-present-duplicate-home-settings`
- **Simplicity:** one voice-control path, no duplicate shortcuts `homekit/siri-interactions/if-your-app-supports-both-homekit`
- **Agency:** never overwrite Home settings without explicit direction `homekit/custom-functionality/ask-permission-to-update-the-homekit`
- **Responsibility:** do not word text so that HomeKit appears to act, such as unlocking a door `homekit/referring-to-homekit/referencing-homekit-and-the-home-app/dont-suggest-that-homekit-is-performing`

## Key rules
- Show an accessory's room, zone and related details in an easy-to-find detail view, and allow for multiple homes `homekit/terminology-and-layout/make-it-easy-for-people-to` `homekit/terminology-and-layout/recognize-that-people-can-have-more`
- Give a purpose string explaining why you need Home data `homekit/setup/provide-context-to-explain-why-you`
- Do not require an account or personal info for setup `homekit/setup/dont-require-people-to-create-an`
- Suggest better service names when a name works poorly for Siri, never company names or model numbers; check renamed services and explain violations briefly `homekit/setup/help-people-choose-useful-names/suggest-service-names-that-suit-your` `homekit/setup/help-people-choose-useful-names/check-that-the-names-people-provide`
- Help people avoid names that repeat location information `homekit/setup/help-people-choose-useful-names/help-people-avoid-creating-names-that`
- Right after setup, show example Siri phrases with the chosen name `homekit/siri-interactions/present-example-voice-commands-to-demonstrate`
- Suggest zones and service groups where they fit `homekit/siri-interactions/recommend-that-people-create-zones-and`
- When your data differs from HomeKit, defer to HomeKit and show any conflict `homekit/custom-functionality/defer-to-homekit-if-your-database`
- On camera views, do not cover the image, and show a microphone button only for two-way audio `homekit/custom-functionality/cameras/dont-block-camera-images` `homekit/custom-functionality/cameras/show-a-microphone-button-only-if`

## Anatomy and content
Use only Apple-supplied HomeKit and Home icons `homekit/using-homekit-icons/use-only-apple-provided-icons`. Keep the HomeKit icon and name non-interactive (only the Apple Home icon may link, to its App Store page), and never set them inside text `homekit/using-homekit-icons/styles/custom-color-homekit-icon/use-the-homekit-icon-noninteractively` `homekit/using-homekit-icons/styles/custom-color-homekit-icon/dont-use-the-homekit-icon-within`. In copy, keep references secondary to your own app, write "HomeKit" with capital H and K, and use phrases like works with or compatible, not HomeKit as a descriptor `homekit/referring-to-homekit/emphasize-your-app-over-homekit` `homekit/referring-to-homekit/referencing-homekit-and-the-home-app/use-correct-capitalization-when-using-the` `homekit/referring-to-homekit/referencing-homekit-and-the-home-app/dont-use-the-name-homekit-as`. Follow Apple's trademark guidelines `homekit/referring-to-homekit/adhere-to-apples-trademark-guidelines`.

## Platform differences
No platform-specific guidance.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] keep setup short and make accounts optional `homekit/setup/dont-require-people-to-create-an`
- **Desktop web:** [HIG transfer] defer to a source of truth and do not force other setups `homekit/custom-functionality/defer-to-homekit-if-your-database` `homekit/setup/honor-peoples-setup-choices`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Siri](https://developer.apple.com/design/human-interface-guidelines/siri) · [Shortcuts](https://developer.apple.com/design/human-interface-guidelines/shortcuts)
