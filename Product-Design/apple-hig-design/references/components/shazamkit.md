---
slug: shazamkit
title: "ShazamKit"
kind: technology
group: "Technologies"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/shazamkit
---

# ShazamKit

**In one line:** A framework that lets an app recognize audio, such as songs, from a short recorded sample.

## Why it exists
Audio recognition needs the microphone, and people do not expect it to keep listening once they allow it. The HIG therefore asks for the shortest capture that works `shazamkit/best-practices/stop-recording-as-soon-as-possible`. Saving a recognized song to a library is a separate matter that belongs to the person (Responsibility, Agency) `shazamkit/best-practices/let-people-opt-in-to-storing`.

## Use it when
- Your app identifies audio content and can stop recording as soon as it has what recognition needs `shazamkit/best-practices/stop-recording-as-soon-as-possible`
- Your app wants to add recognized songs to the person's iCloud library, after they approve `shazamkit/best-practices/let-people-opt-in-to-storing`

## Don't use it when
- You would keep the microphone on after the sample is captured: stop recording instead (no HIG alternative named) `shazamkit/best-practices/stop-recording-as-soon-as-possible`
- You would store results to a library without approval (no HIG alternative named) `shazamkit/best-practices/let-people-opt-in-to-storing`

## Cost to the user
The cost is trust and privacy, not screen space. A microphone that stays on after permission is granted breaks expectations `shazamkit/best-practices/stop-recording-as-soon-as-possible`, and an unrequested library addition takes control away `shazamkit/best-practices/let-people-opt-in-to-storing`.

## Principles at stake
- **Responsibility:** a short capture protects privacy `shazamkit/best-practices/stop-recording-as-soon-as-possible`
- **Agency:** people decide which apps can add content to their library `shazamkit/best-practices/let-people-opt-in-to-storing`

## Key rules
- Stop recording audio as soon as you have the sample needed for recognition `shazamkit/best-practices/stop-recording-as-soon-as-possible`
- Ask people to approve before storing recognized songs in their iCloud library `shazamkit/best-practices/let-people-opt-in-to-storing`

## Platform differences
No platform-specific guidance.

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] any feature that listens through a microphone should capture only what it needs `shazamkit/best-practices/stop-recording-as-soon-as-possible`
- **Desktop web:** [HIG transfer] the same capture and opt-in rules apply to browser microphone features `shazamkit/best-practices/let-people-opt-in-to-storing`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Privacy](https://developer.apple.com/design/human-interface-guidelines/privacy)
