# Platform profile: tvOS

Overview page: <https://developer.apple.com/design/human-interface-guidelines/designing-for-tvos> · 35 platform-specific rules across 15 pages.

**Key numbers (from HIG tables):**

- Text size: default 29 pt, minimum 23 pt
- Control size: default 66x66 pt, minimum 56x56 pt

## Platform traits

- **Display:** On Apple TV, design for a very large, high-resolution display.
- **Ergonomics:** On Apple TV, assume viewers sit many feet away but may move around the room while interacting.
- **Inputs:** On Apple TV, support remote, game controller, voice and companion apps on other devices.
- **App interactions:** On Apple TV, support long immersive sessions and picture-in-picture viewing alongside another app or video.
- **System features:** On Apple TV, integrate with system experiences such as the TV app, SharePlay, Top Shelf and TV provider accounts.

## Stated as not supported on this platform

`immersive-experiences`, `spatial-layout`, `collaboration-and-sharing`, `drag-and-drop`, `going-full-screen`, `printing`, `undo-and-redo`, `workouts`, `web-views`, `boxes`, `column-views`, `disclosure-controls`, `outline-views`, `tab-views`, `activity-views`, `dock-menus`, `edit-menus`, `home-screen-quick-actions`, `ornaments`, `pop-up-buttons`, `pull-down-buttons`, `the-menu-bar`, `path-controls`, `token-fields`, `panels`, `popovers`, `windows`, `color-wells`, `combo-boxes`, `image-wells`, `sliders`, `steppers`, `activity-rings`, `gauges`, `rating-indicators`, `app-shortcuts`, `complications`, `controls`, `live-activities`, `snippets`, `status-bars`, `watch-faces`, `widgets`, `action-button`, `apple-pencil-and-scribble`, `camera-control`, `digital-crown`, `eyes`, `nearby-interactions`, `pointing-devices`, `always-on`, `app-clips`, `apple-pay`, `augmented-reality`, `carekit`, `carplay`, `healthkit`, `id-verifier`, `imessage-apps-and-stickers`, `mac-catalyst`, `nfc`, `photo-editing`, `researchkit`, `tap-to-pay-on-iphone`, `wallet`

## Platform-specific rules on other pages

### App icons (`app-icons`)

- `app-icons/platform-considerations/tvos/include-a-safe-zone-to-ensure` [tvOS] **Do:** On tvOS, leave a safe margin inside the icon, remembering it varies with image size, layer depth and motion, and foreground layers get trimmed more. **Why:** When the icon is focused, scaling and movement make the system crop its edges. · P craft · L platform, attention · S express · M -/-/-/-

### Color (`color`)

- `color/platform-considerations/tvos/consider-choosing-a-limited-color-palette` [tvOS] **Do:** On tvOS, choose a small palette that coordinates with your app logo. **Why:** Subtle color communicates the brand while letting content lead. · P simplicity, purpose · L attention, platform · S express · M -/-/t/-
- `color/platform-considerations/tvos/avoid-using-only-color-to-indicate` [tvOS] **Do:** On tvOS, show focus mainly through subtle scaling and responsive animation, not through color alone. **Why:** Scaling and animation are the primary means of showing something is focused. · P familiarity, flexibility · L interaction, platform · S interact · M -/-/-/-

### Images (`images`)

- `images/platform-considerations/tvos/layered-images/use-standard-interface-elements-to-display` [tvOS] **Do:** On tvOS, show layered images with standard views and system focus APIs. **Why:** Layered images then get the parallax effect automatically when focused. · P familiarity · L platform, interaction · S compose, interact · M -/-/-/-
- `images/platform-considerations/tvos/layered-images/identify-logical-foreground-middle-and-background` [tvOS] **Do:** On tvOS, split artwork into logical layers: prominent elements in front, secondary content and shadows in the middle, and an opaque backdrop behind that doesn't upstage them. **Why:** Each layer has a distinct role in showcasing the content. · P craft, simplicity · L attention, platform · S express · M -/-/-/-
- `images/platform-considerations/tvos/layered-images/generally-keep-text-in-the-foreground` [tvOS] **Do:** On tvOS, put text on the front layer unless you purposely want to hide it. **Why:** Front-layer text is clearer. · P simplicity · L attention, platform · S express · M -/-/-/-
- `images/platform-considerations/tvos/layered-images/keep-the-background-layer-opaque` [tvOS] **Do:** On tvOS, make the bottom layer fully opaque; upper layers may vary in opacity. **Why:** An opaque base keeps the artwork looking good with parallax, drop shadows and system backgrounds. · P craft · L platform, attention · S express · M -/-/-/-
- `images/platform-considerations/tvos/layered-images/keep-layering-simple-and-subtle` [tvOS] **Do:** On tvOS, keep depth and layering understated and simple. **Why:** Parallax is meant to be nearly unnoticeable; heavy 3D looks unrealistic and jarring, while simple depth brings delight. · P simplicity, delight · L attention, platform · S express · M -/-/-/-
- `images/platform-considerations/tvos/layered-images/leave-a-safe-zone-around-the` [tvOS] **Do:** On tvOS, keep essential content inside a safe zone away from the edges of foreground layers. **Why:** Focused layers scale and move, so content on some layers may get cropped. · P craft · L platform, attention · S express · M -/-/-/-
- `images/platform-considerations/tvos/layered-images/always-preview-layered-images` [tvOS] **Do:** On tvOS, preview layered images throughout design with Apple's tools, watch scaling and clipping, readjust, and finally check on an actual Apple TV. **Why:** Scaling and clipping can push important content out of view, so previewing catches problems. · P craft · L platform · S express, interact · M -/-/-/-

### Layout (`layout`)

- `layout/platform-considerations/tvos/adhere-to-the-screens-safe-area` [tvOS] **Do:** On tvOS, inset primary content 60 points top and bottom and 80 points at the sides. **Why:** Such margins keep content in view whatever the TV's compatibility settings or overscan cropping. · P craft, flexibility · L platform, attention · S compose · M -/-/t/-
- `layout/platform-considerations/tvos/include-appropriate-padding-between-focusable-elements` [tvOS] **Do:** On tvOS, leave enough spacing between focusable elements so a focused, enlarged one doesn't cover important information. **Why:** Elements grow when focused. · P craft · L platform, interaction · S compose, interact · M -/-/-/-
- `layout/platform-considerations/tvos/grids/include-additional-vertical-spacing-for-titled` [tvOS] **Do:** On tvOS, give titled rows extra vertical room above and below the title, measured from the unfocused row above to the title center and from title bottom to the items. **Why:** Added space prevents crowding. · P craft, simplicity · L platform, attention · S compose · M -/-/t/-
- `layout/platform-considerations/tvos/grids/use-consistent-spacing` [tvOS] **Do:** On tvOS, space grid content evenly. **Why:** Uneven spacing breaks the grid look and makes scanning harder. · P craft, simplicity · L platform, attention · S compose · M -/-/d/d
- `layout/platform-considerations/tvos/grids/make-partially-hidden-content-look-symmetrical` [tvOS] **Do:** On tvOS, make offscreen content that peeks in show equal width on both screen sides. **Why:** Symmetry directs attention to the fully visible content. · P craft, simplicity · L platform, attention · S compose · M -/-/t/t

### Launching (`launching`)

- `launching/platform-considerations/tvos/in-a-live-viewing-app-consider` [tvOS] **Do:** On tvOS live-viewing apps, consider starting playback automatically after a few seconds of inactivity. **Why:** People come to watch TV, so playing live content soon gets them to it. · P agency · L flow, platform · S interact · M -/-/-/-

### Managing accounts (`managing-accounts`)

- `managing-accounts/platform-considerations/tvos/prefer-letting-people-use-another-device` [tvOS] **Do:** On tvOS, prefer letting people sign up or authenticate using another device. **Why:** With associated domains configured, Apple TV can work with other devices to suggest credentials safely. · P simplicity · L trust, platform · S structure, interact · M t/-/-/-
- `managing-accounts/platform-considerations/tvos/when-people-are-signed-in-to` [tvOS] **Do:** On tvOS, with a shared account, don't make people pick a profile each time they become the current user. **Why:** The app can use the current user's profile automatically while keeping data separate. · P simplicity · L flow, platform · S structure, interact · M -/-/-/-
- `managing-accounts/platform-considerations/tvos/minimize-data-entry` [tvOS] **Do:** On tvOS, minimize data entry: for larger input, send people to a website on another device, and use the email keyboard screen for emails. **Why:** Typing on this platform is burdensome; the email screen lists recent addresses. · P simplicity · L interaction, platform · S interact, adapt · M t/-/-/-

### Playing video (`playing-video`)

- `playing-video/platform-considerations/tvos/defer-to-content-when-displaying-logos` [tvOS] **Do:** On tvOS, keep logos and noninteractive overlays small, short, and preferably translucent SDR, not large, bright, opaque graphics. **Why:** Big overlays distract from viewing, and some devices are prone to image retention. · P simplicity, craft · L attention · S express · M t/-/-/-
- `playing-video/platform-considerations/tvos/show-interactive-overlays-gracefully` [tvOS] **Do:** On tvOS, pause media after a delay of at least 0.5 seconds before an interactive overlay, and provide a clear way to dismiss it and resume. **Why:** Overlays should appear gracefully and let people return to viewing. · P agency, craft · L flow, interaction · S interact · M t/-/-/-

### Lists and tables (`lists-and-tables`)

- `lists-and-tables/platform-considerations/tvos/confirm-that-images-near-a-table` [tvOS] **Do:** On Apple TV, check that images beside table rows look right when a focused row grows and gets rounded corners; don't add your own corner masks. **Why:** Focus effects change the row's corners, which affects neighboring images. · P craft · L platform, attention · S express · M -/-/-/-

### Split views (`split-views`)

- `split-views/platform-considerations/tvos/choose-a-split-view-layout-that` [tvOS] **Do:** On Apple TV, pick a split view proportion that balances the panes, either the default or half and half. **Why:** Balanced panes look right. · P craft · L attention · S compose · M -/-/-/-
- `split-views/platform-considerations/tvos/display-a-single-title-above-a` [tvOS] **Do:** On Apple TV, put one title above the split view describing the whole content, not titles per pane. **Why:** People already understand how split views work. · P simplicity · L content · S write · M t/t/-/-
- `split-views/platform-considerations/tvos/choose-the-titles-alignment-based-on` [tvOS] **Do:** On Apple TV, center the title when the secondary pane holds a collection; place it above the primary view when it holds one main view. **Why:** Placement should suit the content and give it room. · P craft · L attention · S compose · M t/t/-/-

### Search fields (`search-fields`)

- `search-fields/platform-considerations/tvos/provide-suggestions-to-make-searching-easier` [tvOS] **Do:** On tvOS, supply suggestions that are popular or fit the context, plus recent searches if any. **Why:** People don't want to type much on tvOS, so suggestions ease searching. · P flexibility, simplicity · L interaction, platform · S interact · M t/t/-/-

### Tab bars (`tab-bars`)

- `tab-bars/platform-considerations/tvos/be-aware-of-tab-bar-scrolling` [tvOS] **Do:** On tvOS, expect the tab bar to scroll away on single-view tabs but stay pinned with split views, and know that Menu returns focus to it. **Why:** This is how the system behaves by default, so designs should account for it. · P familiarity, flexibility · L flow, platform · S interact · M -/-/-/-
- `tab-bars/platform-considerations/tvos/in-a-live-viewing-app-organize` [tvOS] **Do:** On tvOS, in live-streaming apps, order tabs as live content first, then recorded content such as cloud DVR, then everything else. **Why:** A consistent tab order gives the best experience in live-viewing apps. · P familiarity · L flow, platform · S structure · M t/t/-/-

### Page controls (`page-controls`)

- `page-controls/platform-considerations/tvos/use-page-controls-on-collections-of` [tvOS] **Do:** On tvOS, use page controls for sets of full-screen, content-rich peer pages, without extra controls on them. **Why:** Added controls make it hard to keep focus when moving between pages. · P familiarity, simplicity · L interaction, platform · S structure, compose · M t/t/t/-

### Segmented controls (`segmented-controls`)

- `segmented-controls/platform-considerations/tvos/consider-using-a-split-view-instead` [tvOS] **Do:** On Apple TV, use a split view rather than a segmented control on screens that filter content. **Why:** Moving between content and filter options is easy in a split view, while a segmented control may be harder to reach. · P familiarity, simplicity · L flow, platform · S structure, compose · M -/-/-/-
- `segmented-controls/platform-considerations/tvos/avoid-putting-other-focusable-elements-close` [tvOS] **Do:** On Apple TV, keep other focusable elements away from segmented controls. **Why:** Segments are selected on focus, so nearby elements can be focused by accident while switching segments. · P craft, flexibility · L interaction, platform · S compose, interact · M -/-/-/-

### Focus and selection (`focus-and-selection`)

- `focus-and-selection/platform-considerations/tvos/in-a-full-screen-experience-let` [tvOS] **Do:** On tvOS, in full-screen content let gestures act on the content rather than moving focus. **Why:** With no focus shown, people assume gestures affect the object. · P familiarity, agency · L interaction · S interact · M -/-/-/-
- `focus-and-selection/platform-considerations/tvos/avoid-displaying-a-pointer` [tvOS] **Do:** On tvOS, avoid showing a pointer; use focus for menus and interface elements, and make any needed pointer highly visible. **Why:** People expect to change focus among fixed items rather than drag a tiny pointer across a huge screen. · P familiarity, simplicity · L interaction, platform · S interact · M -/-/-/-
- `focus-and-selection/platform-considerations/tvos/design-your-interface-to-accommodate-components` [tvOS] **Do:** On tvOS, plan for each focus state's look, supply sharp larger assets for focused items and ensure they don't crowd neighbors. **Why:** Focused items often scale up, so assets and spacing must hold up. · P craft, flexibility · L attention, interaction · S express, compose · M -/-/-/-

### Game Center (`game-center`)

- `game-center/platform-considerations/tvos/display-an-optional-image-at-the` [tvOS] **Do:** On tvOS, optionally add a simple, recognizable image atop the dashboard, such as your logo or word mark rather than the app icon, sized per spec. **Why:** It highlights the game's look and must read well from a distance. · P craft, delight · L attention, platform · S express · M -/-/-/-
