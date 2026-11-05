---
slug: airplay
title: "AirPlay"
kind: technology
group: "Technologies"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/airplay
---

# AirPlay

**In one line:** A technology for sending video, audio and screen content from a device to a nearby speaker, TV or other screen.

## Why it exists
People want content they already chose to appear on a bigger screen or better speaker without disrupting what they are doing. The system player and its controls give a familiar way to do that `airplay/best-practices/prefer-the-system-provided-media-player`. Playback should stay under the person's control, even when the app is backgrounded `airplay/best-practices/dont-stop-playback-when-your-app`.

## Use it when
- Your app plays video or audio people may want on another screen or speaker `airplay/best-practices/prefer-the-system-provided-media-player`
- You want people to control playback from the lock screen, Siri or HomePod `airplay/best-practices/support-remote-control-events`
- You build a custom player and need an AirPlay button `airplay/best-practices/if-necessary-provide-a-custom-interface`

## Don't use it when
- The media is app-internal, such as background loops or short in-app clips: keep it on the device `airplay/best-practices/stream-only-the-content-people-expect`
- The built-in player meets your needs: do not build a custom one `airplay/best-practices/prefer-the-system-provided-media-player`
- You want to put the AirPlay icon or name in a custom interactive element: show them only non-interactively `airplay/using-airplay-icons/custom-color-airplay-icon/dont-use-the-airplay-icon-or`

## Cost to the user
Done well, AirPlay adds no steps. Done badly, it cuts off playback, interrupts another app or ties the person to the playback screen `airplay/best-practices/dont-interrupt-another-apps-playback-unless` `airplay/best-practices/let-people-use-other-parts-of`.

## Principles at stake
- **Agency:** keep the app usable during AirPlay, and do not stop or override playback `airplay/best-practices/let-people-use-other-parts-of` `airplay/best-practices/dont-stop-playback-when-your-app`
- **Familiarity:** use the system player, or match its AirPlay button in look and behavior `airplay/best-practices/prefer-the-system-provided-media-player` `airplay/best-practices/if-necessary-provide-a-custom-interface`
- **Craft:** provide a full range of video resolutions so each screen gets a suitable one `airplay/best-practices/provide-content-in-the-highest-possible`
- **Responsibility:** do not interrupt other apps' playback unless you start immersive content `airplay/best-practices/dont-interrupt-another-apps-playback-unless`

## Key rules
- Use the built-in media player by default `airplay/best-practices/prefer-the-system-provided-media-player`
- Offer video in the full range of resolutions in your streaming playlist `airplay/best-practices/provide-content-in-the-highest-possible`
- Do not send app-internal media to an external screen `airplay/best-practices/stream-only-the-content-people-expect`
- Support both AirPlay streaming and mirroring `airplay/best-practices/support-both-airplay-streaming-and-mirroring`
- Handle remote control events for play, pause and fast forward `airplay/best-practices/support-remote-control-events`
- Keep playback going when the app is backgrounded or the device locks, and avoid auto-mirroring then `airplay/best-practices/dont-stop-playback-when-your-app`
- Play launch or autoplay video only on the local device `airplay/best-practices/dont-interrupt-another-apps-playback-unless`
- In a custom player, place the AirPlay button at lower right with distinct states for starting, playing and unavailable `airplay/best-practices/if-necessary-provide-a-custom-interface`

## Anatomy and content
Naming: write AirPlay as one word with capital A and P `airplay/referring-to-airplay/use-correct-capitalization-when-using-the`; use it as a noun, never a verb `airplay/referring-to-airplay/always-use-airplay-as-a-noun`; say "works with" or "supports", not "has AirPlay" `airplay/referring-to-airplay/use-terms-like-works-with-use`. Icon: present it like your other technology icons `airplay/using-airplay-icons/custom-color-airplay-icon/position-the-airplay-icon-consistently-with`, keep any name in the regular layout font `airplay/using-airplay-icons/custom-color-airplay-icon/pair-the-icon-with-the-name`, and make it weaker than your own identity `airplay/using-airplay-icons/custom-color-airplay-icon/emphasize-your-app-over-airplay`.

## Platform differences
- **iOS, iPadOS, macOS, tvOS, visionOS:** no additional considerations.
- **Not available on:** watchOS

## In other media
- **Mobile (any OS) and mobile web:** [HIG] keep playback running and avoid cutting off other apps `airplay/best-practices/dont-stop-playback-when-your-app`
- **Desktop web:** [HIG] prefer the standard media player over a custom one `airplay/best-practices/prefer-the-system-provided-media-player`
- **Slides:** [HIG transfer] the naming and icon-presentation rules apply when mentioning AirPlay `airplay/referring-to-airplay/use-correct-capitalization-when-using-the`
- **Card news:** [HIG transfer] same naming rules `airplay/referring-to-airplay/always-use-airplay-as-a-noun`

## Related
[Nearby interactions](nearby-interactions.md) · [CarPlay](carplay.md) · [Remotes](remotes.md)
