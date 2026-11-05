---
slug: carplay
title: "CarPlay"
kind: technology
group: "Technologies"
platforms: [iOS]
source: https://developer.apple.com/design/human-interface-guidelines/carplay
---

# CarPlay

**In one line:** Running an iPhone app on a car's display and controls, designed so drivers keep their attention on the road.

## Why it exists
Drivers can give an app only brief glances. CarPlay apps must therefore show only high-value information, work through the car's own controls, and never make a driver pick up the phone `carplay/layout/provide-useful-high-value-information-in` `carplay/iphone-interactions/eliminate-app-interactions-on-iphone-when`. Responsibility comes first here.

## Use it when
- Your app type suits driving, such as audio playback `carplay/iphone-interactions/audio/let-people-choose-when-to-start`
- Key tasks can be done with the car's display and controls alone `carplay/iphone-interactions/eliminate-app-interactions-on-iphone-when`
- The experience can work while the iPhone stays locked `carplay/iphone-interactions/make-sure-your-app-works-without`

## Don't use it when
- A task needs phone interaction while CarPlay is active: finish setup before driving `carplay/iphone-interactions/eliminate-app-interactions-on-iphone-when`
- An error would need the person to look at the phone: report it on the CarPlay display `carplay/error-handling/report-errors-in-carplay-not-on`
- You would add nonessential details or decoration `carplay/layout/provide-useful-high-value-information-in`

## Cost to the user
Every glance and tap competes with driving. Keep screens clean, controls large and near the top half, and playback quick to start `carplay/layout/ensure-that-primary-content-stands-out` `carplay/iphone-interactions/audio/start-playback-as-soon-as-audio`.

## Principles at stake
- **Responsibility:** no iPhone interaction required, no lockouts, errors on the car display `carplay/iphone-interactions/never-lock-people-out-of-carplay` `carplay/error-handling/report-errors-in-carplay-not-on`
- **Simplicity:** clean layouts with valuable information only `carplay/layout/provide-useful-high-value-information-in`
- **Agency:** people decide when audio starts and set final volume `carplay/iphone-interactions/audio/let-people-choose-when-to-start` `carplay/iphone-interactions/audio/when-necessary-automatically-adjust-audio-levels`
- **Familiarity:** consistent look and the iPhone app icon `carplay/layout/maintain-an-overall-consistent-appearance-throughout` `carplay/icons-and-images/mirror-your-iphone-app-icon`

## Key rules
- Do not require iPhone interaction while CarPlay is active, and never block CarPlay because the phone needs input; defer fixes until the vehicle stops `carplay/iphone-interactions/eliminate-app-interactions-on-iphone-when` `carplay/iphone-interactions/never-lock-people-out-of-carplay`
- Let people choose when audio starts; auto-play only single-source audio or resumed audio `carplay/iphone-interactions/audio/let-people-choose-when-to-start`
- Show the Now Playing screen once audio can play, loading details in the background `carplay/iphone-interactions/audio/display-the-now-playing-screen-when`
- Resume after temporary interruptions such as calls, but not permanent ones `carplay/iphone-interactions/audio/resume-audio-playback-after-an-interruption`
- Make primary content larger, with key content and controls in the top half `carplay/layout/ensure-that-primary-content-stands-out`
- Use a limited palette; do not color interactive and noninteractive elements alike `carplay/color/in-general-prefer-a-limited-color` `carplay/color/avoid-using-the-same-color-for`
- Test colors in a real car in night and direct sun, and support light and dark appearances `carplay/color/test-your-apps-color-scheme-under` `carplay/color/ensure-your-app-looks-great-in`
- Provide artwork at @2x and @3x, and avoid a black icon background `carplay/icons-and-images/supply-high-resolution-images-with-scale` `carplay/icons-and-images/dont-use-black-for-your-icons`

## Platform differences
- **iOS:** this card applies; no additional considerations beyond it.
- **Not available on:** iPadOS, macOS, tvOS, visionOS, watchOS

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] keep driving-adjacent or glance-based screens sparse and color-coded consistently `carplay/layout/maintain-an-overall-consistent-appearance-throughout`
- **Desktop web:** [HIG transfer] limited palette and distinct interactive color `carplay/color/avoid-using-the-same-color-for`
- **Slides:** [HIG transfer] limited palette `carplay/color/in-general-prefer-a-limited-color`
- **Card news:** [HIG transfer] large primary content toward the top `carplay/layout/ensure-that-primary-content-stands-out`

## Related
[AirPlay](airplay.md) · [Always On](always-on.md)
