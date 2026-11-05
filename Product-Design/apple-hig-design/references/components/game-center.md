---
slug: game-center
title: "Game Center"
kind: technology
group: "Technologies"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/game-center
---

# Game Center

**In one line:** Apple's social gaming service: achievements, leaderboards, challenges and multiplayer activities, reached through a system access point or your own links.

## Why it exists
Players like progress, rivalry and playing with others. Game Center gives games a shared, recognizable way to offer these without each game inventing its own. The guidance protects the player's focus (Agency) and keeps the feature consistent from game to game (Familiarity) `game-center/accessing-game-center/integrating-the-access-point/display-the-access-point-in-menu` `game-center/achievements/integrating-achievements-into-your-game/align-with-game-center-achievement-states`.

## Use it when
- You want players to see progress and rewards: add achievements that show progress toward a goal `game-center/achievements/integrating-achievements-into-your-game/give-players-a-sense-of-progress`
- You want players to compete on a goal: add a leaderboard, classic or recurring, matched to that goal `game-center/leaderboards/choose-a-leaderboard-type`
- You want short, skill-based tasks one person can finish: add challenges `game-center/challenges/create-engaging-challenges`
- You want real-time play with others: support party codes and in-game partner finding `game-center/multiplayer-activities/use-party-codes-to-invite-players` `game-center/multiplayer-activities/support-multiplayer-activities-through-in-game`

## Don't use it when
- You are on Apple Watch and expect a system Game Center screen: none is provided, and the content shows on the connected iPhone `game-center/platform-considerations/watchos/be-aware-of-game-center-support`
- Challenges would be based on overall progress or personal bests: track the most recent score per attempt instead (no HIG alternative named) `game-center/challenges/avoid-creating-challenges-that-track-overall`
- You would place the access point mid-play, on a splash screen, in a cinematic or in a tutorial: put it in a menu or settings screen instead `game-center/accessing-game-center/integrating-the-access-point/display-the-access-point-in-menu`

## Cost to the user
The access point is a persistent control in a fixed corner, so it can cover game UI and distract a busy player `game-center/accessing-game-center/integrating-the-access-point/avoid-placing-controls-near-the-access`. Opening the overlay or dashboard takes attention away from the game, so pausing can help `game-center/accessing-game-center/integrating-the-access-point/consider-pausing-your-game-while-the`.

## Principles at stake
- **Agency:** keep the access point out of moments when players are busy, and let a challenge start quickly `game-center/accessing-game-center/integrating-the-access-point/display-the-access-point-in-menu` `game-center/challenges/make-it-easy-to-jump-into`
- **Familiarity:** use official artwork, correct Game Center names and the four standard achievement states `game-center/accessing-game-center/using-custom-ui/use-the-artwork-game-center-provides` `game-center/accessing-game-center/using-custom-ui/use-the-correct-terminology-in-custom`
- **Delight:** progress feedback and rich, unique art make rewards feel real `game-center/achievements/creating-achievement-images/design-rich-high-quality-images-that`
- **Craft:** keep key art content clear of crops and text overlays `game-center/achievements/creating-achievement-images/create-artwork-in-the-appropriate-size` `game-center/challenges/create-high-quality-artwork-that-encourages`

## Key rules
- Put the access point in menu or settings screens, and keep other controls away from its collapsed and expanded forms `game-center/accessing-game-center/integrating-the-access-point/display-the-access-point-in-menu` `game-center/accessing-game-center/integrating-the-access-point/avoid-placing-controls-near-the-access`
- Consider pausing the game while the overlay or dashboard is open `game-center/accessing-game-center/integrating-the-access-point/consider-pausing-your-game-while-the`
- In custom links, use Apple's artwork unmodified and the system-provided terms `game-center/accessing-game-center/using-custom-ui/use-the-artwork-game-center-provides` `game-center/accessing-game-center/using-custom-ui/use-the-correct-terminology-in-custom`
- Map achievements to locked, in-progress, hidden and completed states `game-center/achievements/integrating-achievements-into-your-game/align-with-game-center-achievement-states`
- Decide achievement order before upload, because upload order is display order `game-center/achievements/integrating-achievements-into-your-game/determine-a-display-order`
- Keep achievement titles and descriptions to two lines each `game-center/achievements/integrating-achievements-into-your-game/be-succinct-when-describing-achievements`
- Group many leaderboards into sets by theme or gameplay, and give each its own image `game-center/leaderboards/take-advantage-of-leaderboard-sets-for` `game-center/leaderboards/add-leaderboard-images`
- Make challenges about 1 to 5 minutes long with a clear measure of success, and deep-link into the right mode or level `game-center/challenges/create-engaging-challenges` `game-center/challenges/make-it-easy-to-jump-into`
- Give multiplayer activities engaging artwork that follows the specifications `game-center/multiplayer-activities/provide-engaging-activity-artwork`

## Anatomy and content
Achievement art is masked to a circle, so keep content centered `game-center/achievements/creating-achievement-images/create-artwork-in-the-appropriate-size`. Titles use title-style capitalization and descriptions use sentence style `game-center/achievements/integrating-achievements-into-your-game/be-succinct-when-describing-achievements`. Challenge art may be covered by the title and description, so keep key content away from them `game-center/challenges/create-high-quality-artwork-that-encourages`.

## Platform differences
- **tvOS:** optionally add a simple, recognizable image atop the dashboard, such as a logo or word mark rather than the app icon `game-center/platform-considerations/tvos/display-an-optional-image-at-the`
- **watchOS:** no system Game Center UI to invoke; content appears on the connected iPhone `game-center/platform-considerations/watchos/be-aware-of-game-center-support`
- **iOS, iPadOS, macOS, visionOS:** no additional considerations.

## In other media
- **Mobile (any OS) and mobile web:** [HIG none] for the service; [HIG transfer] distinct artwork for each reward applies to any achievement badge `game-center/achievements/creating-achievement-images/design-rich-high-quality-images-that`
- **Desktop web:** [HIG transfer] the same lesson on unique reward art applies `game-center/achievements/creating-achievement-images/design-rich-high-quality-images-that`
- **Slides:** [HIG none] for the service; the achievement-art rule has a transfer tag, so a reward badge can use the same idea `game-center/achievements/creating-achievement-images/design-rich-high-quality-images-that`
- **Card news:** [HIG none] for the service; [HIG transfer] a reward card can use the same unique, high-quality art idea `game-center/achievements/creating-achievement-images/design-rich-high-quality-images-that`

## Related
[Designing for games](https://developer.apple.com/design/human-interface-guidelines/designing-for-games) · [Game controls](https://developer.apple.com/design/human-interface-guidelines/game-controls)
