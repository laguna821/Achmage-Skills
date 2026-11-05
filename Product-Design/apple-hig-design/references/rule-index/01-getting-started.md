# Rule index: Getting started

Source: Apple Human Interface Guidelines, collected 2026-11-04. 9 pages, 105 entries.

Each line is our own summary of one HIG rule, not Apple's wording. Open the page link for the original text.

Legend: **P** principles behind the rule (why) · **L** lenses · **S** work stages · **M** media fit for mobile / web / slides / cards (d = direct, t = transfer, - = none) · [Platform] marks platform-specific rules · **Term** entries are definitions, not rules.

## Design principles (`design-principles`)

<https://developer.apple.com/design/human-interface-guidelines/design-principles>

### Purpose

- `design-principles/purpose/create-value` **Do:** At each development step, ask what the product is for and check that the design serves that goal. **Why:** The best designs stay oriented toward what makes a product truly useful. · P purpose · L value · S define · M d/d/t/t
- `design-principles/purpose/keep-focused` **Do:** Rank the app's key features by how people want to use it, and make those few excellent. **Why:** A product with a clear use helps people reach their goals more effectively. · P purpose · L value · S define · M d/d/t/t
- `design-principles/purpose/find-new-ways-to-solve-the` **Do:** Study existing solutions without copying them, and decide what sets your product apart and how the design shows it. **Why:** Differentiating from existing solutions leads to a better answer to the problem. · P purpose · L value · S define · M d/d/t/t
### Agency

- `design-principles/agency/stay-out-of-the-way` **Do:** Get people straight to their task or content; keep the design unobtrusive yet available when needed. **Why:** People use a product to get things done, so the quickest route to the task helps most. · P agency · L attention, interaction · S structure · M d/d/-/-
- `design-principles/agency/give-people-the-freedom-to-explore` **Do:** Let people move around and reach features freely rather than being locked into flows or modes; make any required guided flow easy to skip or leave. **Why:** Freedom to explore gets people to the main experience quickly. · P agency · L flow · S structure · M d/d/-/-
- `design-principles/agency/help-people-recover-from-mistakes` **Do:** Build in easy ways to reverse actions or go back to an earlier state so mistakes cost no time or work. **Why:** Knowing they can undo makes people comfortable exploring, which makes the interface more inviting. · P agency · L flow · S interact · M d/d/-/-
### Responsibility

- `design-principles/responsibility/be-fully-transparent-about-what-your` **Do:** Make the app's intent clear from the start, explain why you ask for permission, and say what data you gather and how it is used. **Why:** The first interaction starts a relationship, and openness builds it. · P responsibility · L trust · S include · M d/d/t/t
- `design-principles/responsibility/keep-peoples-information-safe` **Do:** Collect only the data the product needs, handle it carefully, and anticipate misuse or harm so protections are in place. **Why:** People trust you to keep their data intact and safe. · P responsibility · L trust · S include · M d/d/-/-
### Familiarity

- `design-principles/familiarity/use-concepts-that-people-know` **Do:** Lean on concepts from the real world and other software so the interface feels familiar and intuitive. **Why:** Prior experience with everyday objects and other apps carries over into anything new. · P familiarity · L value · S define · M d/d/t/t
- `design-principles/familiarity/keep-visuals-and-interactions-consistent` **Do:** Once an element has a behavior or look, reuse it everywhere in the design. **Why:** Consistency speeds up learning and gives people confidence that new interactions will behave as expected. · P familiarity · L interaction · S interact · M d/d/t/t
- `design-principles/familiarity/provide-clear-feedback` **Do:** Signal what is happening: show when controls are usable, show content changes, and use system patterns for alerts and choices. **Why:** Consistent feedback keeps people informed and in control. · P familiarity · L interaction · S interact · M d/d/-/-
### Flexibility

- `design-principles/flexibility/design-for-everyone` **Do:** Consider the diversity of people using your design and treat accessibility as a priority from the very start. **Why:** Inclusive design reaches the widest audience and makes a better product for everyone. · P flexibility · L inclusion · S include · M d/d/t/t
- `design-principles/flexibility/preserve-a-persons-context` **Do:** Keep content and controls in consistent, predictable positions as the design moves across platforms and configurations, and use natural animation for transitions. **Why:** People should feel at home as the design adapts. · P flexibility · L attention, platform · S adapt · M d/d/t/t
- `design-principles/flexibility/consider-a-variety-of-input-methods` **Do:** Support as many input methods as possible, such as voice, touch and keyboard. **Why:** Different input options let more people use the product in the way that suits them. · P flexibility · L interaction, inclusion · S interact · M d/d/-/-
- `design-principles/flexibility/approach-every-platform-with-intention` **Do:** Give each supported platform equal care so the software feels polished and native on all of them. **Why:** Software should feel at home wherever it runs. · P flexibility · L platform · S adapt · M d/t/t/-
### Simplicity

- `design-principles/simplicity/include-just-whats-necessary` **Do:** Aim for a focused, useful experience: keep important things within reach and let secondary ones recede. This is not the same as minimalism. **Why:** Focus keeps the experience useful. · P simplicity · L value · S define · M d/d/t/t
- `design-principles/simplicity/be-concise` **Do:** Use exactly the words needed to explain a concept or label a control, choosing the simplest phrasing. **Why:** The simplest wording is often the most universal and helpful. · P simplicity · L content · S write · M d/d/d/d
- `design-principles/simplicity/establish-hierarchy` **Do:** Make controls recognizable and structure consistent so people see where they are and what follows. **Why:** When form and function are plain, people know how to reach their goal. · P simplicity · L attention · S structure · M d/d/t/t
### Craft

- `design-principles/craft/quality-sets-the-tone` **Do:** Be deliberate in each decision, aiming for striking visuals, smooth animation, exact wording and careful audio. **Why:** Every element shows how much care went into the product. · P craft · L attention · S express · M d/d/d/d
- `design-principles/craft/experiment-and-iterate` **Do:** Prototype early, try new ideas, drop what fails, refine features to a high standard, and test in real-world conditions. **Why:** Testing in practice ensures the product is durable, reliable and performs well. · P craft · L value · S interact · M d/d/-/-
- `design-principles/craft/maintain-your-craft` **Do:** Keep updating the interface with new platform capabilities and design patterns, and hold quality high after release. **Why:** Shipping is not the end; design is an ongoing commitment. · P craft · L value · S define · M d/d/-/-
### Delight

- `design-principles/delight/identify-the-emotion-you-want-to` **Do:** Decide which feeling the product should evoke, such as energy, calm or thrill, and let it guide the design. **Why:** Different kinds of software feel different to use. · P delight · L value · S define · M d/d/t/t
- `design-principles/delight/create-defining-moments` **Do:** Treat every moment, from a button press to an error message, as a chance to express the product's character. **Why:** Each interaction shows what the software stands for. · P delight · L content · S express · M d/d/t/t
- `design-principles/delight/dont-mistake-delight-for-decoration` **Do:** Do not chase delight for its own sake at the cost of the core task; experiment to find the right balance of practicality and whimsy. **Why:** People are trying to finish a task, and decoration shouldn't interfere with the product's purpose. · P delight · L value · S define · M d/d/t/t
- `design-principles/delight/consider-the-whole` **Do:** Design with the whole experience in mind, combining freedom to act, safe exploration, familiar metaphors and flexibility across contexts. **Why:** Delight is the sum of all the care invested across the experience. · P delight · L value · S define · M d/d/t/t

## Designing for iOS (`designing-for-ios`)

<https://developer.apple.com/design/human-interface-guidelines/designing-for-ios>

### Overview

- `designing-for-ios/display` **Term: Display.** On iPhone, design for a medium-size, high-resolution display.
- `designing-for-ios/ergonomics` **Term: Ergonomics.** On iPhone, account for one- or two-handed use, switching between orientations, and a viewing distance of a foot or two.
- `designing-for-ios/inputs` **Term: Inputs.** On iPhone, support multi-touch gestures, virtual keyboards and voice, and consider personal data, motion sensors and spatial interaction.
- `designing-for-ios/app-interactions` **Term: App interactions.** On iPhone, support both brief check-ins and long sessions, and make switching between many open apps smooth.
- `designing-for-ios/system-features` **Term: System features.** On iPhone, adopt system features like widgets, Home Screen quick actions, Spotlight, Shortcuts and activity views.

## Designing for iPadOS (`designing-for-ipados`)

<https://developer.apple.com/design/human-interface-guidelines/designing-for-ipados>

### Overview

- `designing-for-ipados/display` **Term: Display.** On iPad, design for a large, high-resolution display.
- `designing-for-ipados/ergonomics` **Term: Ergonomics.** On iPad, expect it to be held, set on a surface or stand, with a viewing distance up to about 3 feet.
- `designing-for-ipados/inputs` **Term: Inputs.** On iPad, support touch, keyboards, pointing devices, Apple Pencil and voice, including combined use.
- `designing-for-ipados/app-interactions` **Term: App interactions.** On iPad, support both quick actions and long immersive sessions, with several apps open and visible side by side.
- `designing-for-ipados/system-features` **Term: System features.** On iPad, adopt system features like multitasking, widgets and drag and drop.

## Designing for macOS (`designing-for-macos`)

<https://developer.apple.com/design/human-interface-guidelines/designing-for-macos>

### Overview

- `designing-for-macos/display` **Term: Display.** On Mac, design for a large display, possibly several, including an iPad used via Sidecar.
- `designing-for-macos/ergonomics` **Term: Ergonomics.** On Mac, assume stationary use at a desk; on touch Macs treat touch as brief, intentional interaction rather than sustained work.
- `designing-for-macos/inputs` **Term: Inputs.** On Mac, put keyboard and pointer first while also supporting trackpad gestures, touch, Siri, Voice Control and game controllers.
- `designing-for-macos/app-interactions` **Term: App interactions.** On Mac, support both quick tasks and hours of deep focus, with smooth transitions between active and inactive states when switching apps.
- `designing-for-macos/system-features` **Term: System features.** On Mac, adopt system features like the menu bar, file management, full screen and Dock menus.

## Designing for tvOS (`designing-for-tvos`)

<https://developer.apple.com/design/human-interface-guidelines/designing-for-tvos>

### Overview

- `designing-for-tvos/display` **Term: Display.** On Apple TV, design for a very large, high-resolution display.
- `designing-for-tvos/ergonomics` **Term: Ergonomics.** On Apple TV, assume viewers sit many feet away but may move around the room while interacting.
- `designing-for-tvos/inputs` **Term: Inputs.** On Apple TV, support remote, game controller, voice and companion apps on other devices.
- `designing-for-tvos/app-interactions` **Term: App interactions.** On Apple TV, support long immersive sessions and picture-in-picture viewing alongside another app or video.
- `designing-for-tvos/system-features` **Term: System features.** On Apple TV, integrate with system experiences such as the TV app, SharePlay, Top Shelf and TV provider accounts.

## Designing for visionOS (`designing-for-visionos`)

<https://developer.apple.com/design/human-interface-guidelines/designing-for-visionos>

### Overview

- `designing-for-visionos/space` **Term: Space.** On Apple Vision Pro, use the limitless space for windows, volumes and 3D content, and offer deeply immersive experiences.
- `designing-for-visionos/immersion` **Term: Immersion.** On visionOS, let people move fluidly between immersion levels, from the Shared Space with several apps to a Full Space with one.
- `designing-for-visionos/passthrough` **Term: Passthrough.** On visionOS, use passthrough so people see their surroundings alongside virtual content, with the Digital Crown adjusting the amount.
- `designing-for-visionos/spatial-audio` **Term: Spatial Audio.** On visionOS, use Spatial Audio, and with permission to read the surroundings you can tune it for custom experiences.
- `designing-for-visionos/eyes-and-hands` **Term: Eyes and hands.** On visionOS, support looking at an object and tapping indirectly, as well as touching items directly with a finger.
- `designing-for-visionos/ergonomics` **Term: Ergonomics.** On visionOS, prioritize visual comfort, trusting the system to place content relative to the head.
- `designing-for-visionos/accessibility` **Term: Accessibility.** On Vision Pro, support assistive technologies and prefer system UI components, which include accessibility support by default.
### Best practices

- `designing-for-visionos/best-practices/embrace-the-unique-features-of-apple` **Do:** On Vision Pro, use space, Spatial Audio and immersion to enrich experiences, and use passthrough and eye and hand input naturally. **Why:** These features make experiences feel at home on the device. · P delight · L platform · S express · M -/-/-/-
- `designing-for-visionos/best-practices/consider-different-types-of-immersion-as` **Do:** For each key moment on visionOS, pick the least immersion that fits, not assuming everything needs full immersion. **Why:** Not every moment needs full immersion. · P simplicity · L value · S define · M -/-/-/-
- `designing-for-visionos/best-practices/use-windows-for-contained-ui-centric` **Do:** On visionOS, use standard windows with familiar controls for contained, UI-focused tasks. **Why:** Windows can be moved anywhere and scale dynamically to stay legible. · P familiarity · L platform · S compose · M -/-/-/-
- `designing-for-visionos/best-practices/prioritize-comfort` **Do:** On visionOS, keep content in the field of view, positioned relative to the head, so people needn't turn or shift to interact. **Why:** People should stay comfortable and physically relaxed. · P flexibility · L platform, interaction · S interact · M -/-/-/-
- `designing-for-visionos/best-practices/help-people-share-activities-with-others` **Do:** On visionOS, support shared activities with SharePlay so people see participants' spatial Personas. **Why:** It feels like everyone is together in the same space. · P delight · L platform · S interact · M -/-/-/-

## Designing for watchOS (`designing-for-watchos`)

<https://developer.apple.com/design/human-interface-guidelines/designing-for-watchos>

### Overview

- `designing-for-watchos/display` **Term: Display.** On Apple Watch, design for the small, high-resolution display that fits on the wrist.
- `designing-for-watchos/ergonomics` **Term: Ergonomics.** On Apple Watch, design for glances at about a foot, wrist raising, opposite-hand interaction and Always On viewing.
- `designing-for-watchos/inputs` **Term: Inputs.** On Apple Watch, use Digital Crown, tap, swipe and drag, and the Action button for essential actions while people are moving.
- `designing-for-watchos/app-interactions` **Term: App interactions.** On Apple Watch, design for brief interactions of under a minute and treat complications, notifications and Siri as key experiences.
- `designing-for-watchos/system-features` **Term: System features.** On Apple Watch, adopt system features such as complications, notifications, Always On and watch faces.

## Designing for games (`designing-for-games`)

<https://developer.apple.com/design/human-interface-guidelines/designing-for-games>

### Jump into gameplay

- `designing-for-games/jump-into-gameplay/let-people-play-as-soon-as` **Do:** Ship playable content in the first install, keep initial download to half an hour at most, and fetch the rest in the background. **Why:** A player's first experience shouldn't be waiting for a lengthy download. · P purpose · L flow, value · S structure · M t/-/-/-
- `designing-for-games/jump-into-gameplay/provide-great-default-settings` **Do:** Pick strong defaults from device info, such as resolution, paired accessories and controllers, so play starts without configuration. **Why:** People like starting without changing many settings. · P agency · L interaction · S interact · M t/-/-/-
- `designing-for-games/jump-into-gameplay/teach-through-play` **Do:** Fold setup and onboarding into a playable tutorial that engages players and gives quick success. **Why:** Players learn better by discovering mechanics in the game world. · P agency · L flow · S structure · M t/-/-/-
- `designing-for-games/jump-into-gameplay/defer-requests-until-the-right-time` **Do:** Delay permission requests until needed, don't pile them up before play, and explain why access is required. **Why:** Too many early requests bombard people; context helps them understand the request. · P responsibility · L trust · S include · M t/-/-/-
### Look stunning on every display

- `designing-for-games/look-stunning-on-every-display/make-sure-text-is-always-legible` **Do:** Keep game text readable with good background contrast and at least the platform's recommended minimum size. **Why:** Hard-to-read text makes players lose the story, instructions and engagement. · P flexibility · L inclusion, attention · S express · M d/d/t/t
- `designing-for-games/look-stunning-on-every-display/make-sure-buttons-are-always-easy` **Do:** Size and space buttons to meet each platform's recommended minimum for its default input method. **Why:** Too-small or crowded buttons frustrate players and reduce fun. · P flexibility · L interaction, inclusion · S interact · M t/-/-/-
- `designing-for-games/look-stunning-on-every-display/prefer-resolution-independent-textures-and-graphics` **Do:** Prefer resolution-independent art; otherwise match game resolution to the device, and on visionOS favor vector art. **Why:** Vector art stays good-looking when the system scales it at different distances and angles. · P craft · L attention · S express · M d/d/t/t
- `designing-for-games/look-stunning-on-every-display/integrate-device-features-into-your-layout` **Do:** Account for rounded corners and camera housings in layout, using platform safe areas where possible. **Why:** Device features can affect parts of the interface and make the game look out of place. · P craft · L platform · S compose · M t/-/-/-
- `designing-for-games/look-stunning-on-every-display/make-sure-in-game-menus-adapt` **Do:** Make in-game menus legible and usable at varied aspect ratios and both iPhone and iPad orientations, without hiding other content. **Why:** Games must look good and behave well at different aspect ratios. · P flexibility · L platform · S adapt · M t/-/-/-
- `designing-for-games/look-stunning-on-every-display/design-for-the-full-screen-experience` **Do:** Design for full-screen play, where distraction is minimal and in visionOS a Full Space can surround the player. **Why:** People often enjoy distraction-free full-screen play. · P flexibility · L platform · S adapt · M t/-/-/-
### Enable intuitive interactions

- `designing-for-games/enable-intuitive-interactions/support-each-platforms-default-interaction-method` **Do:** Support each platform's default input: touch on iPhone, keyboard and mouse or trackpad on Mac, eyes and hands on visionOS. **Why:** Players expect those inputs on each platform. · P flexibility · L interaction, platform · S interact · M t/-/-/-
- `designing-for-games/enable-intuitive-interactions/support-physical-game-controllers-while-also` **Do:** Support physical controllers but also provide alternatives, since not every player can use one. **Why:** Offering other options makes the game available to more players. · P flexibility · L interaction, inclusion · S interact · M t/-/-/-
- `designing-for-games/enable-intuitive-interactions/offer-touch-based-game-controls-that` **Do:** On iPhone and iPad, let players touch game elements directly and use virtual controls over the content. **Why:** Touch controls suit the touchscreen experience. · P familiarity · L interaction, platform · S interact · M t/-/-/-
### Welcome everyone

- `designing-for-games/welcome-everyone/prioritize-perceivability` **Do:** Make game content perceivable through sight, hearing or touch; do not rely on color alone and give cutscenes subtitles or alternatives. **Why:** Players use different senses to perceive content. · P flexibility · L inclusion · S include · M d/d/t/t
- `designing-for-games/welcome-everyone/help-players-personalize-their-experience` **Do:** Let players customize type size, control mapping, motion intensity and sound balance. **Why:** No single configuration fits everyone's preferences and abilities. · P flexibility · L inclusion, interaction · S include · M t/-/-/-
- `designing-for-games/welcome-everyone/give-players-the-tools-they-need` **Do:** Offer avatar and name options that reflect the full range of self-identity and as many human traits as possible. **Why:** Players differ and should be able to represent themselves. · P flexibility · L inclusion · S include · M t/t/-/-
- `designing-for-games/welcome-everyone/avoid-stereotypes-in-your-stories-and` **Do:** Check characters and scenarios for stereotypes, such as tying enemies to a race, gender or culture, and remove biases. **Why:** Depictions can perpetuate real-life stereotypes. · P flexibility · L inclusion · S include · M d/d/t/t
### Adopt Apple technologies

- `designing-for-games/adopt-apple-technologies/integrate-game-center-to-help-players` **Do:** Integrate Game Center so players track progress, join leaderboards, challenges and multiplayer, and find friends across devices. **Why:** It is Apple's social gaming network on all platforms. · P delight · L platform · S interact · M -/-/-/-
- `designing-for-games/adopt-apple-technologies/let-players-pick-up-their-game` **Do:** Support GameSave so players can resume from the same point on another device. **Why:** People often use one iCloud account across several Apple devices. · P flexibility · L flow, platform · S interact · M -/-/-/-
- `designing-for-games/adopt-apple-technologies/support-haptics-to-help-players-feel` **Do:** Use Core Haptics for custom haptic patterns, optionally with custom audio, to help players feel the action. **Why:** Haptics convey the game's action physically. · P delight · L interaction, platform · S interact · M -/-/-/-
- `designing-for-games/adopt-apple-technologies/use-spatial-audio-to-immerse-players` **Do:** Provide multichannel audio so the soundscape adapts to the device and gives Spatial Audio where supported. **Why:** Multichannel audio lets the game sound adapt automatically. · P delight · L platform · S express · M -/-/-/-
- `designing-for-games/adopt-apple-technologies/take-advantage-of-apple-technologies-to` **Do:** Use Apple technologies like AR, machine learning, HealthKit, location, camera and microphone to enable unique mechanics. · P purpose · L value · S define · M -/-/-/-

## Designing for iPhone Duo (`designing-for-iphone-duo`)

<https://developer.apple.com/design/human-interface-guidelines/designing-for-iphone-duo>

### Best practices

- `designing-for-iphone-duo/best-practices/build-your-app-to-resize` **Do:** On iPhone Duo, lay out with size classes, margins and safe areas instead of fixed widths or display-specific assumptions. **Why:** The app can appear at many sizes across two displays, poses and Split View. · P flexibility · L platform · S adapt · M -/-/-/-
- `designing-for-iphone-duo/best-practices/create-a-consistent-experience-across-displays` **Do:** Keep functionality and element state the same on both displays, keeping the hierarchy and adding a hierarchy level on the inner display when it fits. **Why:** People should get a consistent experience across displays. · P familiarity · L platform · S adapt · M -/-/-/-
- `designing-for-iphone-duo/best-practices/maintain-the-same-functionality-across-device` **Do:** Give access to the same controls and content in every device pose, even as controls overflow or content resizes. **Why:** The interface adapts to the available area. · P flexibility · L platform · S adapt · M -/-/-/-
- `designing-for-iphone-duo/best-practices/follow-the-systems-vertical-layout-for` **Do:** On iPhone Duo, let toolbars, tab bars and navigation controls sit along the side as the system arranges them. **Why:** The outer display is wider and shorter, so vertical space is saved for content. · P familiarity · L platform · S structure · M -/-/-/-
- `designing-for-iphone-duo/best-practices/make-your-game-playable-in-every` **Do:** Make games playable in every pose: fill the screen, keep text and control sizes steady, and prefer changing aspect ratio over letterboxing. **Why:** Games need to adapt as the pose changes. · P flexibility · L platform · S adapt · M -/-/-/-
### Dynamic layouts > Reserved regions

- `designing-for-iphone-duo/dynamic-layouts/reserved-regions/adapt-your-layout-when-the-device` **Do:** Use adaptive layout containers for folding, prefer even column counts in grids, and use ReservedRegion to keep key elements clear. **Why:** Content should stay clearly visible as the device folds. · P flexibility · L platform · S adapt · M -/-/-/-
- `designing-for-iphone-duo/dynamic-layouts/reserved-regions/avoid-extreme-layout-changes-as-people` **Do:** When the device folds, move only what's needed and prefer small adjustments to rearrangement. **Why:** Controls that vanish or shift sharply are harder to find and track. · P simplicity · L attention, platform · S adapt · M -/-/-/-
### Dynamic layouts > Arrangement views

- `designing-for-iphone-duo/dynamic-layouts/arrangement-views/consider-an-arrangement-view-when-your` **Do:** Choose an arrangement view when your layout is already side by side, stacked, or layered. **Why:** Such layouts map directly to split or overlay arrangements. · P flexibility · L platform · S compose · M -/-/-/-
- `designing-for-iphone-duo/dynamic-layouts/arrangement-views/keep-navigation-outside-of-arrangement-views` **Do:** Place navigation containers around an arrangement view, not inside it. **Why:** An arrangement view handles layout only, not navigation. · P flexibility · L platform · S structure · M -/-/-/-
### Vertical controls

- `designing-for-iphone-duo/vertical-controls/account-for-asymmetry-in-your-layouts` **Do:** Use safe areas so controls on one edge, including those from a second app in Split View, don't cover content. **Why:** Controls on one edge make content space asymmetrical. · P flexibility · L platform · S compose · M -/-/-/-
- `designing-for-iphone-duo/vertical-controls/keep-controls-consistent-across-device-poses` **Do:** Keep controls' relative positions alike across poses so people needn't relearn where actions are. **Why:** Poses give different space and don't always place controls on the side. · P familiarity · L platform · S compose · M -/-/-/-
- `designing-for-iphone-duo/vertical-controls/follow-the-standard-placement-order-for` **Do:** Put primary navigation like Back or Close at the top of the vertical axis, then prominent actions like Done, keeping other items grouped as is. **Why:** This preserves familiar navigation and keeps important actions within reach. · P familiarity · L platform · S compose · M -/-/-/-
- `designing-for-iphone-duo/vertical-controls/prioritize-frequently-used-toolbar-items-to` **Do:** Give toolbar groups and items visibility priorities so frequently used ones stay available when items overflow. **Why:** Items overflow from bottom to top by default. · P flexibility · L platform, attention · S compose · M -/-/-/-
- `designing-for-iphone-duo/vertical-controls/in-general-dont-override-the-default` **Do:** Generally keep the system's default bar placement. **Why:** Familiar control positions teach people how the app works right away and reinforce the unified platform. · P familiarity · L platform · S compose · M -/-/-/-
- `designing-for-iphone-duo/vertical-controls/consider-using-the-full-display-width` **Do:** Where bars are unnecessary, a layout may span the entire display provided it avoids the Dynamic Island and status bar. **Why:** Visual, immersive non-scrolling interfaces suit full-width use. · P simplicity · L attention, platform · S compose · M -/-/-/-
- `designing-for-iphone-duo/vertical-controls/group-related-toolbar-items-instead-of` **Do:** Group related toolbar items with the group APIs rather than adding manual spacing. **Why:** Groups space themselves automatically and adapt to available room. · P familiarity · L platform · S compose · M -/-/-/-
- `designing-for-iphone-duo/vertical-controls/locate-controls-near-the-content-they` **Do:** Keep controls beside the content area they affect instead of moving them to the side. **Why:** Proximity makes the control-to-content relationship clear. · P simplicity · L attention, platform · S compose · M -/-/-/-
- `designing-for-iphone-duo/vertical-controls/provide-both-a-title-and-a` **Do:** Give every non-text toolbar item both a title and a symbol, even if only the symbol shows. **Why:** The system chooses the best representation and uses titles in overflow and expanded forms. · P flexibility · L platform, content · S write · M -/-/-/-
- `designing-for-iphone-duo/vertical-controls/keep-text-based-buttons-to-a` **Do:** Prefer symbols over text on buttons wherever a symbol works. **Why:** Text labels stay in a horizontal bar. · P simplicity · L platform · S express · M -/-/-/-
- `designing-for-iphone-duo/vertical-controls/when-space-is-limited-preserve-either` **Do:** When space is tight, keep the tab bar for navigation-focused views and compress the toolbar into overflow; in task-focused views, shrink the tab bar to keep toolbar actions. **Why:** The choice depends on what the experience centers on. · P flexibility · L platform, flow · S compose · M -/-/-/-
- `designing-for-iphone-duo/vertical-controls/use-the-system-overflow-menu` **Do:** Move app-specific overflow actions into the system overflow menu, reserving the ellipsis for overflow and using other symbols for other menus. **Why:** People then find everything in one place. · P familiarity · L platform · S compose · M -/-/-/-
