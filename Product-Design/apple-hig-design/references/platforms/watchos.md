# Platform profile: watchOS

Overview page: <https://developer.apple.com/design/human-interface-guidelines/designing-for-watchos> · 62 platform-specific rules across 29 pages.

**Key numbers (from HIG tables):**

- Text size: default 16 pt, minimum 12 pt
- Control size: default 44x44 pt, minimum 28x28 pt

## Platform traits

- **Display:** On Apple Watch, design for the small, high-resolution display that fits on the wrist.
- **Ergonomics:** On Apple Watch, design for glances at about a foot, wrist raising, opposite-hand interaction and Always On viewing.
- **Inputs:** On Apple Watch, use Digital Crown, tap, swipe and drag, and the Action button for essential actions while people are moving.
- **App interactions:** On Apple Watch, design for brief interactions of under a minute and treat complications, notifications and Siri as key experiences.
- **System features:** On Apple Watch, adopt system features such as complications, notifications, Always On and watch faces.

## Stated as not supported on this platform

`dark-mode`, `immersive-experiences`, `spatial-layout`, `drag-and-drop`, `going-full-screen`, `multitasking`, `printing`, `undo-and-redo`, `web-views`, `boxes`, `collections`, `column-views`, `disclosure-controls`, `lockups`, `outline-views`, `activity-views`, `context-menus`, `dock-menus`, `edit-menus`, `home-screen-quick-actions`, `ornaments`, `pop-up-buttons`, `pull-down-buttons`, `the-menu-bar`, `path-controls`, `sidebars`, `tab-bars`, `token-fields`, `panels`, `popovers`, `windows`, `color-wells`, `combo-boxes`, `digit-entry-views`, `image-wells`, `segmented-controls`, `steppers`, `rating-indicators`, `controls`, `snippets`, `status-bars`, `top-shelf`, `apple-pencil-and-scribble`, `camera-control`, `eyes`, `focus-and-selection`, `game-controls`, `keyboards`, `pointing-devices`, `remotes`, `airplay`, `app-clips`, `augmented-reality`, `carekit`, `carplay`, `id-verifier`, `imessage-apps-and-stickers`, `live-photos`, `mac-catalyst`, `nfc`, `photo-editing`, `researchkit`, `shareplay`, `tap-to-pay-on-iphone`

## Platform-specific rules on other pages

### App icons (`app-icons`)

- `app-icons/platform-considerations/watchos/avoid-using-black-for-your-icons` [watchOS] **Do:** On watchOS, lighten a black icon background instead of using pure black. **Why:** A black background would merge with the dark watch display. · P craft · L platform, attention · S express · M -/-/-/-

### Color (`color`)

- `color/platform-considerations/watchos/use-background-color-to-support-existing` [watchOS] **Do:** On watchOS, use background color to support content or add information, not as decoration, and avoid full-screen color in views that stay on screen for long. **Why:** Background color can establish place and highlight key content when it has something to say. · P purpose, simplicity · L attention, platform · S express · M -/-/t/t
- `color/platform-considerations/watchos/recognize-that-people-might-prefer-graphic` [watchOS] **Do:** On watchOS, expect graphic complications to be shown in a tinted single-color mode and make sure they work that way. **Why:** The system may use the wearer's chosen color for a complication's images, gauges and text. · P flexibility, agency · L platform, attention · S adapt, express · M -/-/-/-

### Images (`images`)

- `images/platform-considerations/watchos/in-general-avoid-transparency-to-keep` [watchOS] **Do:** On watchOS, avoid transparency to keep files small, and bake in the background if it's always the same solid color; keep it for template images like complications and menu icons. **Why:** Template images need transparency so the system knows where to apply color. · P craft, simplicity · L platform · S express · M -/-/-/-
- `images/platform-considerations/watchos/use-autoscaling-pdfs-to-let-you` [watchOS] **Do:** On watchOS, supply one autoscaling PDF per image, designed for the 40mm and 42mm screens at 2x, and let WatchKit scale it per device. **Why:** A single asset can serve every screen size. · P flexibility, craft · L platform · S adapt, express · M -/-/-/-

### Layout (`layout`)

- `layout/platform-considerations/watchos/avoid-placing-more-than-two-or` [watchOS] **Do:** On Apple Watch, put at most three glyph buttons or two text buttons in one row; full-width text buttons are usually better, and side-by-side works only on non-scrolling screens. · P simplicity · L attention, platform · S compose · M t/-/-/-
- `layout/platform-considerations/watchos/support-autorotation-in-views-people-might` [watchOS] **Do:** On Apple Watch, let content rotate automatically in views a wearer may want to show to someone else, such as an image or QR code. **Why:** Turning the wrist away normally sleeps the display, but sharing content with another person needs it to stay readable. · P flexibility, agency · L platform, interaction · S adapt · M -/-/-/-

### Materials (`materials`)

- `materials/platform-considerations/watchos/use-materials-to-provide-context-in` [watchOS] **Do:** On Apple Watch, keep the default material backgrounds on full-screen modal sheets instead of removing or replacing them. **Why:** Layered material contrast helps orient people and separates controls and system elements from other content in these common modals. · P familiarity, simplicity · L attention, platform · S express · M -/-/-/-

### Feedback (`feedback`)

- `feedback/platform-considerations/watchos/avoid-displaying-an-indeterminate-progress-indicator` [watchOS] **Do:** On watchOS, don't show an indeterminate loading indicator; tell people they'll be notified when the process finishes. **Why:** An animated indicator suggests they must keep watching the screen. · P simplicity · L flow, interaction · S interact, adapt · M -/-/-/-

### Loading (`loading`)

- `loading/platform-considerations/watchos/as-much-as-possible-avoid-showing` [watchOS] **Do:** On watchOS, avoid loading indicators where possible, but show one rather than a blank screen if a load takes a second or two. **Why:** People expect quick interactions with Apple Watch. · P simplicity · L flow, interaction · S interact, adapt · M -/-/-/-

### Playing audio (`playing-audio`)

- `playing-audio/platform-considerations/watchos/use-the-recommended-encoding-values-for` [watchOS] **Do:** On watchOS, encode audio with the recommended 64 kbps HE-AAC format. **Why:** It gives good quality with lower data needs. · P craft, flexibility · L platform · S express · M -/-/-/-
- `playing-audio/platform-considerations/watchos/consider` [watchOS] **Do:** On watchOS, consider adding a Now Playing view that lets people manage recent or active sound while staying in your app. **Why:** The system view shows the active audio source and selects it automatically. · P agency, familiarity · L platform, interaction · S structure, interact · M -/-/-/-

### Playing video (`playing-video`)

- `playing-video/platform-considerations/watchos/keep-video-clips-short` [watchOS] **Do:** On watchOS, keep video clips short, preferably under 30 seconds. **Why:** Long clips use disk space and tire wrists held up. · P flexibility, craft · L platform · S express · M -/-/-/-
- `playing-video/platform-considerations/watchos/use-the-recommended-sizes-and-encoding` [watchOS] **Do:** On watchOS, use the recommended media sizes and encodings, and avoid scaling video clips. **Why:** Scaling hurts performance and looks poor. · P craft · L platform · S express · M -/-/-/-
- `playing-video/platform-considerations/watchos/avoid-creating-a-poster-image-that` [watchOS] **Do:** On watchOS, don't style a poster image to look like a system control. **Why:** People should see that tapping a movie element plays it, not mistake it for something else. · P familiarity, simplicity · L platform, attention · S express · M -/-/-/-
- `playing-video/platform-considerations/watchos/consider-creating-a-poster-image-that` [watchOS] **Do:** On watchOS, make poster images reflect the clip's contents and avoid unrelated or control-like images. **Why:** A relevant poster helps people decide whether to watch. · P familiarity, purpose · L platform, content · S express · M -/-/-/-

### Charts (`charts`)

- `charts/platform-considerations/watchos/in-general-avoid-requiring-complex-chart` [watchOS] **Do:** On Apple Watch, avoid charts that need complex interaction; favor glanceable info and put deeper exploration in a companion app on another platform. **Why:** Small-screen users want quick information, while larger devices suit richer exploration. · P flexibility, simplicity · L platform, interaction · S adapt · M t/-/-/-

### Image views (`image-views`)

- `image-views/platform-considerations/watchos/use-swiftui-to-create-animations-when` [watchOS] **Do:** On Apple Watch, prefer SwiftUI for animation, resorting to WatchKit image sequences only if needed. · P craft · L platform · S interact · M -/-/-/-

### Lists and tables (`lists-and-tables`)

- `lists-and-tables/platform-considerations/watchos/when-possible-limit-the-number-of` [watchOS] **Do:** On Apple Watch, limit row counts, listing the most relevant items and offering a way to see more. **Why:** Short lists are easy to scan, but people may worry if expected items are missing. · P simplicity, flexibility · L platform, content · S compose · M t/-/-/-
- `lists-and-tables/platform-considerations/watchos/constrain-the-length-of-detail-views` [watchOS] **Do:** On Apple Watch, keep detail views short if you want vertical page-based navigation between rows. **Why:** Scrolling detail views block that swipe navigation, which saves time. · P simplicity · L flow, platform · S structure · M -/-/-/-

### Split views (`split-views`)

- `split-views/platform-considerations/watchos/automatically-display-the-most-relevant-detail` [watchOS] **Do:** On Apple Watch, open with the most relevant detail view, based on location, time or recent actions. **Why:** People see the most pertinent information at launch. · P purpose, agency · L value, flow · S structure · M t/-/-/-
- `split-views/platform-considerations/watchos/if-your-app-displays-multiple-detail` [watchOS] **Do:** On Apple Watch, put multiple detail pages in a vertical tab view navigated with the Digital Crown, showing a page indicator. **Why:** The Digital Crown scrolls between tabs, and the indicator shows position. · P familiarity · L platform · S structure · M -/-/-/-

### Buttons (`buttons`)

- `buttons/platform-considerations/watchos/use-a-toolbar-to-place-buttons` [watchOS] **Do:** On Apple Watch, place corner buttons through a toolbar so the system adjusts the time and title around them. **Why:** The system handles spacing and gives toolbar buttons a Liquid Glass look that separates them from content. · P familiarity, craft · L platform, attention · S compose · M -/-/-/-
- `buttons/platform-considerations/watchos/prefer-buttons-that-span-the-width` [watchOS] **Do:** On Apple Watch, give primary actions full-width buttons; if two share a row, match heights and use images or short titles. **Why:** Full-width buttons look better and are easier to tap. · P flexibility, simplicity · L interaction, platform · S compose · M t/-/-/-
- `buttons/platform-considerations/watchos/use-toolbar-buttons-to-provide-either` [watchOS] **Do:** On Apple Watch, use toolbar buttons for links to related areas or for contextual actions tied to the current content. **Why:** They offer extra information or secondary actions related to the view. · P simplicity, familiarity · L flow, platform · S structure · M -/-/-/-
- `buttons/platform-considerations/watchos/use-the-same-height-for-vertical` [watchOS] **Do:** On Apple Watch, make stacked text buttons the same height whether their labels take one line or two. **Why:** Identical heights keep the look consistent. · P craft, familiarity · L attention, platform · S compose · M -/-/-/-

### Toolbars (`toolbars`)

- `toolbars/platform-considerations/watchos/use-a-scrolling-toolbar-button-for` [watchOS] **Do:** On watchOS, offer an important but non-primary action as a scrolling toolbar button, such as compose at the top of an inbox. **Why:** A view can surface closely related important functionality even when it isn't the view's main purpose. · P purpose, simplicity · L value, platform · S compose · M t/t/-/-

### Action sheets (`action-sheets`)

- `action-sheets/platform-considerations/watchos/avoid-displaying-more-than-four-buttons` [watchOS] **Do:** On watchOS, limit an action sheet to four buttons total, counting the required Cancel, so at most three other choices. **Why:** Fewer buttons let people see all options at once. · P simplicity, flexibility · L interaction, platform · S compose · M t/-/-/-

### Page controls (`page-controls`)

- `page-controls/platform-considerations/watchos/use-vertical-pagination-to-separate-multiple` [watchOS] **Do:** On watchOS, split multiple views into vertical pages that each have a clear purpose, navigated by Digital Crown scrolling. **Why:** On watchOS this works better than horizontal paging or deep hierarchical navigation. · P simplicity, purpose · L flow, platform · S structure · M t/-/-/-
- `page-controls/platform-considerations/watchos/consider-limiting-the-content-of-an` [watchOS] **Do:** On watchOS, try to fit each page within one screen height; use variable-height pages carefully, placed after fixed-height ones if possible. **Why:** The constraint gives each page a distinct purpose and a more glanceable design. · P simplicity, purpose · L attention, platform · S compose · M t/-/t/t

### Scroll views (`scroll-views`)

- `scroll-views/platform-considerations/watchos/prefer-vertically-scrolling-content` [watchOS] **Do:** On Apple Watch, lay out content to scroll vertically so the Digital Crown scrolls it when taller than the display. **Why:** People are used to using the Digital Crown for navigation in Apple Watch apps. · P familiarity · L interaction, platform · S interact, compose · M t/-/-/-
- `scroll-views/platform-considerations/watchos/use-tab-views-to-provide-page` [watchOS] **Do:** On watchOS, stack tab views vertically to give full-screen pages navigated with the Digital Crown, with the system's page indicator. **Why:** The indicator shows where people are within a page and the set of pages. · P familiarity, simplicity · L interaction, platform · S structure, interact · M -/-/-/-
- `scroll-views/platform-considerations/watchos/when-displaying-paged-content-consider-limiting` [watchOS] **Do:** On watchOS, try to keep each page to one screen height; use variable-height pages carefully, after fixed-height ones. **Why:** The limit clarifies each page's purpose and makes the design glanceable; long pages still work via the expanding indicator. · P simplicity, purpose · L attention, platform · S compose · M t/-/t/t

### Sheets (`sheets`)

- `sheets/platform-considerations/watchos/use-a-sheet-only-when-your` [watchOS] **Do:** On Apple Watch, use a sheet only if the modal task needs custom titling or custom content; for key information or choices, use an alert or action sheet. **Why:** Alerts and action sheets already suit conveying important information and presenting choices. · P simplicity, familiarity · L platform, flow · S structure · M -/-/-/-
- `sheets/platform-considerations/watchos/keep-sheet-interactions-brief-and-occasional` [watchOS] **Do:** On Apple Watch, treat a sheet as a short, infrequent interruption for an important task, never as a way to browse content. **Why:** Sheets interrupt the current workflow, so they should be reserved for something that warrants it. · P simplicity, agency · L flow, platform · S structure, interact · M -/-/-/-
- `sheets/platform-considerations/watchos/if-you-change-the-default-label` [watchOS] **Do:** On Apple Watch, if you replace the default sheet label, use an SF Symbol for the action and avoid text that resembles a back button or page title. **Why:** Misleading labels suggest hierarchical navigation, and title-like text leaves people unsure how to dismiss the sheet. · P familiarity, simplicity · L platform, content · S express, write · M -/-/-/-

### Sliders (`sliders`)

- `sliders/platform-considerations/watchos/if-necessary-create-custom-glyphs-to` [watchOS] **Do:** On Apple Watch, design custom glyphs if needed to show what a slider does, since the default shows plus and minus signs. **Why:** Default symbols may not convey the slider's specific purpose. · P simplicity, familiarity · L platform, content · S express · M -/-/-/-

### Text fields (`text-fields`)

- `text-fields/platform-considerations/watchos/present-a-text-field-only-when` [watchOS] **Do:** On Apple Watch, show a text field only when truly necessary and offer a list of options instead whenever possible. **Why:** Typing is costly on the watch, and choosing from options is easier. · P simplicity, agency · L interaction, platform · S interact · M t/-/-/-

### Live Activities (`live-activities`)

- `live-activities/platform-considerations/watchos/consider-creating-a-custom-watchos-layout` [watchOS] **Do:** On Apple Watch, consider a custom layout rather than the automatic default view. **Why:** A tailored layout can show more information and add a button or toggle. · P flexibility · L platform · S adapt · M -/-/-/-
- `live-activities/platform-considerations/watchos/carefully-consider-including-buttons-or-toggles` [watchOS] **Do:** If people may start or watch the activity while driving, leave buttons and toggles out of your custom watchOS layout. **Why:** That layout is reused in CarPlay, where interactive elements are deactivated. · P flexibility, responsibility · L platform, interaction · S adapt · M -/-/-/-
- `live-activities/platform-considerations/watchos/focus-on-essential-information-and-significant` [watchOS] **Do:** Use Smart Stack space efficiently for the most helpful content: progress, timer-like controls, and significant updates. **Why:** Space on the watch is limited, so only the most useful items belong. · P simplicity, purpose · L value, platform · S define, compose · M -/-/-/-

### Notifications (`notifications`)

- `notifications/platform-considerations/watchos/short-looks/avoid-using-a-short-look-as` [watchOS] **Do:** On Apple Watch, deliver critical information through other means in addition to the short look. **Why:** A short look disappears quickly, leaving time only to see the topic and sender. · P flexibility, responsibility · L platform, trust · S interact · M -/-/-/-
- `notifications/platform-considerations/watchos/short-looks/keep-privacy-in-mind` [watchOS] **Do:** On Apple Watch, put only basic information in short looks and keep potentially sensitive details out of the title. **Why:** Short looks are meant to be discreet. · P responsibility · L trust, platform · S include, write · M -/-/-/-
- `notifications/platform-considerations/watchos/long-looks/consider-using-a-rich-custom-long` [watchOS] **Do:** On Apple Watch, consider a rich custom long look so people get what they need without launching the app; SwiftUI animations, SpriteKit, or SceneKit are options. **Why:** People can get information directly, with engaging, interruptible animation. · P purpose, delight · L value, platform · S compose, express · M -/-/-/-
- `notifications/platform-considerations/watchos/long-looks/at-the-minimum-provide-a-static` [watchOS] **Do:** On Apple Watch, always provide a static interface, ideally with a dynamic one; prepare static resources ahead and bundle them with the app. **Why:** The system falls back to static when the dynamic one can't load, such as when offline. · P flexibility, craft · L platform, flow · S adapt, interact · M -/-/-/-
- `notifications/platform-considerations/watchos/long-looks/choose-a-background-appearance-for-the` [watchOS] **Do:** On Apple Watch, set the sash to a custom color or blurred look; the blurred one suits a photo at the top of the content. **Why:** The translucent blurred sash appears to overlap the image. · P craft, delight · L attention, platform · S express · M -/-/-/-
- `notifications/platform-considerations/watchos/long-looks/choose-a-background-color-for-the` [watchOS] **Do:** On Apple Watch, pick the content background: default transparent, white at 18% opacity to match system notifications, or a brand color. · P craft, familiarity · L attention, platform · S express · M -/-/-/-
- `notifications/platform-considerations/watchos/long-looks/provide-up-to-four-custom-actions` [watchOS] **Do:** On Apple Watch, offer at most four custom actions under the content; the system adds Dismiss below and may reuse your iPhone app's registered actions. · P simplicity, familiarity · L interaction, platform · S interact · M -/-/-/-
- `notifications/platform-considerations/watchos/double-tap/keep-double-tap-in-mind-when` [watchOS] **Do:** On Apple Watch, list the most frequently used custom action first among responses. **Why:** Double tap triggers the first nondestructive action. · P purpose, agency · L interaction, platform · S interact · M -/-/-/-

### Widgets (`widgets`)

- `widgets/platform-considerations/watchos/provide-a-colorful-background-that-conveys` [watchOS] **Do:** On watchOS, replace the default black Smart Stack background with a color that carries meaning, such as red or green for a stock falling or rising. **Why:** A meaningful background color adds information at a glance. · P delight, purpose · L attention, platform · S express · M -/-/-/-
- `widgets/platform-considerations/watchos/encourage-the-system-to-display-or` [watchOS] **Do:** On watchOS, supply relevancy information so the system can show or raise your widget in the Smart Stack when it's most useful. **Why:** Relevance, such as location or workouts, lets the system surface the widget when people need it. · P purpose, flexibility · L value, platform · S define · M -/-/-/-

### Action button (`action-button`)

- `action-button/platform-considerations/watchos/consider-offering-a-secondary-function-that` [watchOS] **Do:** On watchOS, consider a simple secondary function that logically extends the primary Action button action, and think hard before adding more than one. **Why:** People often press without looking, and extra functions add mental load. · P agency, simplicity · L interaction, platform · S interact · M -/-/-/-
- `action-button/platform-considerations/watchos/prefer-using-subsequent-button-presses-to` [watchOS] **Do:** On watchOS, use extra Action button presses for added functionality, not to stop the main task; offer stopping within the interface and treat pausing as separate. **Why:** Stopping and pausing differ, so stopping belongs in the interface. · P familiarity, agency · L interaction, platform · S interact · M -/-/-/-
- `action-button/platform-considerations/watchos/pause-the-current-function-when-people` [watchOS] **Do:** On watchOS, pause the current function when the Action and side buttons are pressed together, except where a pause could endanger someone, such as a dive. **Why:** People expect this behavior, but pausing a dive may cause a diver to lose track of depth or time. · P familiarity, responsibility · L interaction, platform · S interact · M -/-/-/-

### Gestures (`gestures`)

- `gestures/platform-considerations/watchos/double-tap/avoid-setting-a-primary-action-in` [watchOS] **Do:** On Apple Watch, don't assign a primary double-tap action in views built around lists, scroll views, or vertical tabs. **Why:** It would clash with the navigation behavior people expect from double-tap. · P familiarity · L interaction, platform · S interact · M -/-/-/-
- `gestures/platform-considerations/watchos/double-tap/choose-the-button-that-people-use` [watchOS] **Do:** On Apple Watch, map double-tap to the button people reach for most in a view, such as play/pause in media controls. **Why:** Double tap helps most in a nonscrolling view when it triggers the most-used action. · P purpose, simplicity · L interaction, value · S interact · M -/-/-/-

### Apple In-App Purchase (`apple-in-app-purchase`)

- `apple-in-app-purchase/platform-considerations/watchos/clearly-describe-the-differences-between-versions` [watchOS] **Do:** Be clear about how your watchOS app differs from versions on other devices, and don't imply identical experience. **Why:** Customers should not be misled about what each version includes. · P responsibility · L content, platform · S write · M t/-/-/-
- `apple-in-app-purchase/platform-considerations/watchos/consider-using-a-modal-sheet-to` [watchOS] **Do:** On Apple Watch, consider showing required subscription information in one modal sheet, which keeps the UI compact and has a default Close button. **Why:** One scrollable sheet keeps the app streamlined and easy to dismiss. · P simplicity, familiarity · L flow, platform · S compose, interact · M t/-/-/-
- `apple-in-app-purchase/platform-considerations/watchos/make-subscription-options-easy-to-compare` [watchOS] **Do:** On Apple Watch, present subscription options compactly with duration and discount info, for example one button per option, so they scan and compare easily. **Why:** People must grasp each option's terms before choosing, and the screen is small. · P simplicity, flexibility · L attention, platform · S compose · M t/-/-/-

### Game Center (`game-center`)

- `game-center/platform-considerations/watchos/be-aware-of-game-center-support` [watchOS] **Do:** On watchOS, remember there is no system Game Center UI to invoke; Game Center content appears on the connected iPhone. **Why:** The platform lacks supported Game Center UI. · P flexibility · L platform · S adapt · M -/-/-/-

### Maps (`maps`)

- `maps/platform-considerations/watchos/fit-the-map-interface-element-to` [watchOS] **Do:** On Apple Watch, size the map element to the screen so it is fully visible without scrolling. **Why:** The whole element must fit the display. · P flexibility · L platform · S compose, adapt · M -/-/-/-
- `maps/platform-considerations/watchos/show-the-smallest-region-that-encompasses` [watchOS] **Do:** On Apple Watch, show the smallest region that includes all points of interest. **Why:** The map element can't scroll, so everything important has to sit inside the shown region. · P flexibility, simplicity · L platform, attention · S compose, adapt · M -/-/-/-
