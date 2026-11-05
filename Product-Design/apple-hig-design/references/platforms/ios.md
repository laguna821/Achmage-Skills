# Platform profile: iOS

Overview page: <https://developer.apple.com/design/human-interface-guidelines/designing-for-ios> · 70 platform-specific rules across 37 pages.

**Key numbers (from HIG tables):**

- Text size: default 17 pt, minimum 11 pt
- Control size: default 44x44 pt, minimum 28x28 pt

## Platform traits

- **Display:** On iPhone, design for a medium-size, high-resolution display.
- **Ergonomics:** On iPhone, account for one- or two-handed use, switching between orientations, and a viewing distance of a foot or two.
- **Inputs:** On iPhone, support multi-touch gestures, virtual keyboards and voice, and consider personal data, motion sensors and spatial interaction.
- **App interactions:** On iPhone, support both brief check-ins and long sessions, and make switching between many open apps smooth.
- **System features:** On iPhone, adopt system features like widgets, Home Screen quick actions, Spotlight, Shortcuts and activity views.

## Stated as not supported on this platform

`immersive-experiences`, `spatial-layout`, `column-views`, `lockups`, `outline-views`, `tab-views`, `dock-menus`, `ornaments`, `the-menu-bar`, `path-controls`, `token-fields`, `panels`, `windows`, `combo-boxes`, `digit-entry-views`, `image-wells`, `rating-indicators`, `complications`, `top-shelf`, `watch-faces`, `apple-pencil-and-scribble`, `digital-crown`, `eyes`, `focus-and-selection`, `remotes`, `mac-catalyst`

## Platform-specific rules on other pages

### Dark Mode (`dark-mode`)

- `dark-mode/platform-considerations/ios-ipados/prefer-the-system-background-colors` [iOS, iPadOS] **Do:** On iOS and iPadOS, use the system background colors instead of custom ones. **Why:** They switch from base to elevated automatically for foreground layers like popovers and sheets, and separate apps and windows in multitasking. · P familiarity, flexibility · L platform, attention · S express · M t/t/-/-

### Drag and drop (`drag-and-drop`)

- `drag-and-drop/platform-considerations/ios-ipados/let-people-perform-multiple-simultaneous-drag` [iOS, iPadOS] **Do:** On iOS and iPadOS, allow several drag activities at the same time, such as adding items to a drag already in progress. **Why:** People can gather as many items as they can hold and drop them together. · P agency · L interaction, platform · S interact, adapt · M t/-/-/-

### File management (`file-management`)

- `file-management/platform-considerations/ios-ipados/document-launcher/assign-the-title-cards-buttons-to` [iOS, iPadOS] **Do:** On iOS and iPadOS, map the title card buttons to the app's most important functions, with the primary one usually creating a document. **Why:** Focuses the launch surface on the key actions. · P purpose · L value, attention · S compose · M t/d/-/-
- `file-management/platform-considerations/ios-ipados/document-launcher/provide-a-background-thats-clearly-distinct` [iOS, iPadOS] **Do:** On iOS and iPadOS, use a plain background that stands apart from the accessories and title card, avoiding complex images or patterns. **Why:** Busy backgrounds distract from the foreground elements. · P simplicity · L attention · S express · M t/d/-/-
- `file-management/platform-considerations/ios-ipados/document-launcher/be-mindful-of-accessory-placement` [iOS, iPadOS] **Do:** On iOS and iPadOS, place accessories carefully so the app name and buttons stay visible, avoid clutter, and test the overall look. **Why:** Too many accessories crowd the title card. · P craft · L attention · S compose, express · M t/d/-/-
- `file-management/platform-considerations/ios-ipados/document-launcher/use-animation-sparingly` [iOS, iPadOS] **Do:** On iOS and iPadOS, animate accessories sparingly, using gentle repeating motion that subtly enhances content. **Why:** Too much motion can confuse or disorient people. · P simplicity, delight · L attention · S express, interact · M t/d/-/-
- `file-management/platform-considerations/ios-ipados/file-provider-app-extension/when-someone-uses-your-file-provider` [iOS, iPadOS] **Do:** On iOS and iPadOS, have a file provider extension list only documents suited to the current context, with helpful details like dates and sizes. **Why:** Relevant files only keeps choices focused. · P simplicity · L value, flow · S compose · M t/d/-/-
- `file-management/platform-considerations/ios-ipados/file-provider-app-extension/let-people-select-a-destination-when` [iOS, iPadOS] **Do:** On iOS and iPadOS, let people choose a destination when exporting or moving documents, unless everything lives in one directory. **Why:** Navigation to a specific location gives them control over placement. · P agency · L flow · S structure, interact · M t/d/-/-
- `file-management/platform-considerations/ios-ipados/file-provider-app-extension/avoid-including-a-custom-top-toolbar` [iOS, iPadOS] **Do:** On iOS and iPadOS, don't add your own top toolbar in a file provider extension. **Why:** The modal view already has a toolbar, so a second one confuses and wastes space. · P simplicity · L platform · S compose · M t/-/-/-

### Going full screen (`going-full-screen`)

- `going-full-screen/platform-considerations/ios-ipados/consider-deferring-system-gestures-to-prevent` [iOS, iPadOS] **Do:** On iOS and iPadOS, consider deferring system gestures in full-screen apps to avoid accidental exits, keeping the default Home indicator behavior when possible. **Why:** The default behavior is familiar and what people expect. · P familiarity · L interaction, platform · S interact, adapt · M t/-/-/-

### Launching (`launching`)

- `launching/platform-considerations/ios-ipados/launch-in-the-appropriate-orientation` [iOS, iPadOS] **Do:** On iOS and iPadOS, launch in the device's current orientation if both are supported; otherwise launch in the one supported and ensure landscape-only interfaces respond correctly. **Why:** Matches how the device is held or the only orientation available. · P flexibility, familiarity · L interaction, platform · S interact, adapt · M t/-/-/-

### Playing audio (`playing-audio`)

- `playing-audio/platform-considerations/ios-ipados/use-the-systems-sound-services-to` [iOS, iPadOS] **Do:** On iOS and iPadOS, play short sounds and vibrations through the system's sound services. · P familiarity, craft · L platform, interaction · S interact · M t/-/-/-

### Undo and redo (`undo-and-redo`)

- `undo-and-redo/platform-considerations/ios-ipados/avoid-redefining-standard-gestures-for-undo` [iOS, iPadOS] **Do:** On iOS and iPadOS, don't redefine standard undo and redo gestures like the three-finger swipe or shake. **Why:** Redefining standard gestures confuses people and makes the interface unpredictable. · P familiarity · L interaction, platform · S interact · M d/t/-/-
- `undo-and-redo/platform-considerations/ios-ipados/briefly-and-precisely-describe-the-operation` [iOS, iPadOS] **Do:** On iOS and iPadOS, supply a word or two naming what is being undone or redone, since the alert adds its own prefix. · P simplicity, familiarity · L content, platform · S write · M d/t/-/-

### Text views (`text-views`)

- `text-views/platform-considerations/ios-ipados/show-the-appropriate-keyboard-type` [iOS, iPadOS] **Do:** On iPhone and iPad, show the keyboard type that fits the content being typed. **Why:** The right keyboard streamlines data entry. · P simplicity, familiarity · L interaction, platform · S interact · M d/t/-/-

### Collections (`collections`)

- `collections/platform-considerations/ios-ipados/use-caution-when-making-dynamic-layout` [iOS, iPadOS] **Do:** On iOS and iPadOS, change a collection's layout dynamically only with care, preferably in response to an explicit action. **Why:** Changes should make sense and be easy to follow, and shifts while people interact are disorienting. · P familiarity, simplicity · L interaction, platform · S interact · M d/d/-/-

### Lists and tables (`lists-and-tables`)

- `lists-and-tables/platform-considerations/ios-ipados-visionos/use-an-info-button-only-to` [iOS, iPadOS, visionOS] **Do:** On iOS, iPadOS and visionOS, use an info button only to reveal more about a row; use a disclosure indicator to drill into subviews. **Why:** The info button doesn't provide hierarchical navigation. · P familiarity · L interaction, platform · S compose · M d/t/-/-
- `lists-and-tables/platform-considerations/ios-ipados-visionos/avoid-adding-an-index-to-a` [iOS, iPadOS, visionOS] **Do:** On these platforms, don't add an alphabetical index to a table whose rows have trailing controls like disclosure indicators. **Why:** Both sit on the trailing side, so people may trigger one while aiming for the other. · P flexibility · L interaction · S compose · M d/-/-/-

### Split views (`split-views`)

- `split-views/platform-considerations/ios/prefer-using-a-split-view-in` [iOS] **Do:** On iOS, favor split views in regular size environments, not compact ones like iPhone portrait. **Why:** Narrow space makes panes wrap or truncate and hard to use. · P flexibility · L platform · S adapt · M d/t/-/-

### Buttons (`buttons`)

- `buttons/platform-considerations/ios-ipados/configure-a-button-to-display-an` [iOS, iPadOS] **Do:** On iOS and iPadOS, show an activity indicator in a button for actions that take time, optionally changing its label. **Why:** It saves space and explains the delay. · P familiarity, simplicity · L interaction, flow · S interact · M d/d/-/-

### Context menus (`context-menus`)

- `context-menus/platform-considerations/ios-ipados/provide-either-a-context-menu-or` [iOS, iPadOS] **Do:** On iOS and iPadOS, attach either a context menu or an edit menu to an item, never both. **Why:** Both together confuse people and make it hard for the system to tell what they intend. · P simplicity, familiarity · L interaction, platform · S interact · M d/t/-/-
- `context-menus/platform-considerations/ios-ipados/in-ipados-consider-using-a-context` [iOS, iPadOS] **Do:** On iPadOS, consider letting people create new objects through a context menu opened by long press or secondary click. · P agency, familiarity · L interaction, platform · S interact · M t/t/-/-
- `context-menus/platform-considerations/ios-ipados/prefer-a-graphical-preview-that-clarifies` [iOS, iPadOS] **Do:** On iOS and iPadOS, show a preview of the targeted content with the menu so its commands clearly apply to the right item. **Why:** The preview helps people confirm they're working on the item they intended. · P responsibility, familiarity · L attention, platform · S express · M d/t/-/-
- `context-menus/platform-considerations/ios-ipados/ensure-that-your-preview-looks-good` [iOS, iPadOS] **Do:** On iOS and iPadOS, match the preview's clipping path to its image shape so corners and contours stay steady while it animates. **Why:** Otherwise the shape appears to change during the reveal animation. · P craft, delight · L attention, platform · S express, interact · M d/-/-/-

### Edit menus (`edit-menus`)

- `edit-menus/platform-considerations/ios-ipados/ensure-your-edit-menu-works-well` [iOS, iPadOS] **Do:** On iOS and iPadOS, check that your edit menu works in both the compact horizontal and vertical styles. **Why:** The system picks the style based on touch gestures versus keyboard or pointer input. · P flexibility · L interaction, platform · S adapt · M d/-/-/-
- `edit-menus/platform-considerations/ios-ipados/adjust-an-edit-menus-placement-if` [iOS, iPadOS] **Do:** On iOS and iPadOS, reposition the edit menu if the default spot would cover important content or interface parts. **Why:** Default placement may hide important content. · P craft, flexibility · L attention, platform · S compose · M d/-/-/-

### Menus (`menus`)

- `menus/platform-considerations/ios-ipados/choose-a-small-or-medium-menu` [iOS, iPadOS] **Do:** On iOS and iPadOS, use the medium layout for about three key actions and the small layout only for tightly related groups, with recognizable symbols. **Why:** These layouts streamline choices and let symbols identify actions without labels. · P simplicity, familiarity · L interaction, platform · S compose · M t/-/-/-

### Pull-down buttons (`pull-down-buttons`)

- `pull-down-buttons/platform-considerations/ios-ipados/consider-using-a-more-pull-down` [iOS, iPadOS] **Do:** On iOS and iPadOS, put lower-priority items in a More pull-down button, weighing its compactness against reduced discoverability. **Why:** It saves room when space is tight, but the ellipsis doesn't tell people what's inside. · P simplicity, familiarity · L attention, platform · S compose · M d/d/-/-

### Toolbars (`toolbars`)

- `toolbars/platform-considerations/ios/prioritize-only-the-most-important-items` [iOS] **Do:** On iOS, give the main toolbar only the essential actions and move the rest into a More menu. **Why:** Space is very limited. · P simplicity, purpose · L value, platform · S compose · M d/t/-/-
- `toolbars/platform-considerations/ios/use-a-large-title-to-help` [iOS] **Do:** On iOS, use a large title that shrinks to a standard one when scrolling starts and returns at the top. **Why:** It reminds people of their current location while they navigate and scroll. · P familiarity, flexibility · L flow, platform · S express, interact · M d/t/-/-

### Search fields (`search-fields`)

- `search-fields/platform-considerations/ios/search-as-a-tab/choose-the-standard-tab-style-to` [iOS] **Do:** On iOS, use the standard search tab style, a dedicated landing page showing suggestions and content, for apps with rich content worth exploring. **Why:** It shows what's available before searching, grounding people and encouraging discovery. · P purpose, agency · L flow, platform · S structure · M d/t/-/-
- `search-fields/platform-considerations/ios/search-as-a-tab/choose-the-button-appearance-to-help` [iOS] **Do:** On iOS, use the button-style search tab when search should finish quickly: the keyboard opens with the field ready, and exiting returns to the previous tab. **Why:** It gives a brief, transient search that returns people straight to what they were doing. · P simplicity, agency · L flow, platform · S structure, interact · M d/t/-/-
- `search-fields/platform-considerations/ios/search-in-a-toolbar/place-search-at-the-bottom-if` [iOS] **Do:** On iOS, put search in a bottom toolbar when there's room, either alone or alongside other controls, especially when search is a priority. **Why:** A bottom position keeps search easy to reach. · P purpose, flexibility · L attention, platform · S compose · M d/t/-/-
- `search-fields/platform-considerations/ios/search-in-a-toolbar/place-search-at-the-top-when` [iOS] **Do:** On iOS, put search at the top when bottom content matters or there is no bottom toolbar. **Why:** A bottom search field could cover content needed for the app's primary function, like stacked passes. · P purpose, simplicity · L attention, platform · S compose · M d/t/-/-
- `search-fields/platform-considerations/ios/search-as-an-inline-field/place-search-as-an-inline-field` [iOS] **Do:** On iOS, place a search field inline next to the content it searches when it filters one view, or when the app has several search fields. **Why:** Proximity shows the search applies to that content rather than globally. · P familiarity, simplicity · L attention, platform · S compose · M d/d/-/-
- `search-fields/platform-considerations/ios/search-as-an-inline-field/when-at-the-top-position-an` [iOS] **Do:** On iOS, put a top inline search field above its list, and consider pinning it to the top toolbar on scroll. **Why:** This keeps it visibly different from search placed elsewhere. · P familiarity, simplicity · L attention, platform · S compose · M d/d/-/-

### Sidebars (`sidebars`)

- `sidebars/platform-considerations/ios-ipados/consider-using-a-tab-bar-first` [iOS, iPadOS] **Do:** On iPhone and iPad, start with a tab bar; if more areas are needed than fit, use its convertible sidebar-style form for less-used content. **Why:** A tab bar leaves more room for content and is flexible enough for most apps' main areas. · P simplicity, flexibility · L flow, platform · S structure · M d/t/-/-
- `sidebars/platform-considerations/ios-ipados/if-necessary-apply-the-correct-appearance` [iOS, iPadOS] **Do:** When not building with SwiftUI, apply the sidebar appearance of a collection view list layout so the sidebar looks correct. · P craft, familiarity · L platform · S express · M -/-/-/-

### Action sheets (`action-sheets`)

- `action-sheets/platform-considerations/ios-ipados/use-an-action-sheet-not-a` [iOS, iPadOS] **Do:** On iPhone and iPad, use an action sheet rather than a menu for choices tied to an action. **Why:** People expect an action sheet to appear after an action needing clarification, and a menu only when they ask for one. · P familiarity · L interaction, platform · S interact · M d/t/-/-
- `action-sheets/platform-considerations/ios-ipados/avoid-letting-an-action-sheet-scroll` [iOS, iPadOS] **Do:** On iPhone and iPad, keep the action sheet short enough that it doesn't need to scroll. **Why:** More buttons cost more time and effort, and scrolling risks accidental taps. · P simplicity, craft · L interaction · S compose, interact · M d/d/-/-

### Alerts (`alerts`)

- `alerts/platform-considerations/ios-ipados/use-an-action-sheet-not-an` [iOS, iPadOS] **Do:** On iPhone and iPad, offer extra choices for an intentional action in an action sheet rather than an alert, such as delete, save or keep editing a draft. **Why:** An alert can confirm or cancel but offers no further choices related to the action. · P familiarity, agency · L interaction, platform · S interact · M d/d/-/-
- `alerts/platform-considerations/ios-ipados/when-possible-avoid-displaying-an-alert` [iOS, iPadOS] **Do:** On iPhone and iPad, keep alerts from scrolling with short titles and a brief message only if necessary. **Why:** Large text sizes can make an alert scroll, so brevity reduces that chance. · P simplicity, flexibility · L content, inclusion · S write, adapt · M d/d/-/-

### Page controls (`page-controls`)

- `page-controls/platform-considerations/ios-ipados/avoid-animating-page-transitions-during-scrubbing` [iOS, iPadOS] **Do:** On iPhone and iPad, animate the scrolling transition only for taps, not while scrubbing, and pick the background style (automatic, prominent, minimal) to match the control's role. **Why:** Fast scrubbing with animated transitions makes the app lag and flash distractingly. · P craft, delight · L interaction, platform · S interact · M d/d/-/-
- `page-controls/platform-considerations/ios-ipados/avoid-supporting-the-scrubber-when-you` [iOS, iPadOS] **Do:** On iPhone and iPad, to allow scrubbing pages, pick the automatic or prominent background style rather than minimal. **Why:** The minimal style gives no visual feedback while scrubbing. · P craft, agency · L interaction, platform · S interact · M d/d/-/-

### Popovers (`popovers`)

- `popovers/platform-considerations/ios-ipados/avoid-displaying-popovers-in-compact-views` [iOS, iPadOS] **Do:** On iPhone and iPad, reserve popovers for wide views and adapt to the content area's size class; in compact views, use a full-screen modal like a sheet. **Why:** Compact views should use all available screen space. · P flexibility · L platform, flow · S adapt · M d/d/-/-

### Scroll views (`scroll-views`)

- `scroll-views/platform-considerations/ios-ipados/consider-showing-a-page-control-when` [iOS, iPadOS] **Do:** On iPhone and iPad, in paged scrolling, consider a page control for count and position, and hide the scroll indicator on the same axis. **Why:** Showing both would be redundant controls that confuse people. · P simplicity, familiarity · L interaction, attention · S interact, compose · M d/d/t/t

### Sheets (`sheets`)

- `sheets/platform-considerations/ios-ipados/in-an-iphone-app-consider-supporting` [iOS, iPadOS] **Do:** In iPhone apps, consider a medium detent that shows the most relevant content first and expands for more; skip it if the content works best at full height. **Why:** Progressive disclosure shows key items without resizing, but creation sheets need full room. · P simplicity, purpose · L flow, platform · S interact, compose · M d/t/-/-
- `sheets/platform-considerations/ios-ipados/include-a-grabber-in-a-resizable` [iOS, iPadOS] **Do:** On iOS and iPadOS, add a grabber to any resizable sheet so people can drag it or tap it to step through sizes. **Why:** It signals that resizing is possible and also works with VoiceOver, so people can resize without seeing the screen. · P flexibility, familiarity · L interaction, inclusion · S interact, include · M d/t/-/-
- `sheets/platform-considerations/ios-ipados/support-swiping-to-dismiss-a-sheet` [iOS, iPadOS] **Do:** On iOS and iPadOS, let people swipe a sheet down to close it; if unsaved changes exist, confirm with an action sheet. **Why:** People expect a vertical swipe to dismiss a sheet, and a confirmation prevents losing unsaved work. · P familiarity, agency · L interaction, platform · S interact · M d/t/-/-
- `sheets/platform-considerations/ios-ipados/prefer-using-the-page-or-form` [iOS, iPadOS] **Do:** In an iPadOS app, favor the page or form sheet presentation styles. **Why:** Each uses a default size and centers content over a dimmed background, giving a consistent experience. · P familiarity · L platform · S compose · M t/-/-/-

### Pickers (`pickers`)

- `pickers/platform-considerations/ios-ipados/use-a-compact-date-picker-when` [iOS, iPadOS] **Do:** On iOS and iPadOS, use the compact date picker when space is tight; it shows the value as a button that opens a calendar-style editor. **Why:** It saves room while still giving a familiar editor for multiple date and time changes. · P simplicity, flexibility · L platform, interaction · S compose, adapt · M d/t/-/-

### Segmented controls (`segmented-controls`)

- `segmented-controls/platform-considerations/ios-ipados/consider-a-segmented-control-to-switch` [iOS, iPadOS] **Do:** On iOS and iPadOS, use a segmented control for quick switching between closely related subviews; use a tab bar for fully separate app sections. **Why:** It switches related views fast, while separate sections belong in a tab bar. · P familiarity, simplicity · L flow, platform · S structure, compose · M d/d/-/-

### Sliders (`sliders`)

- `sliders/platform-considerations/ios-ipados/dont-use-a-slider-to-adjust` [iOS, iPadOS] **Do:** On iOS and iPadOS, offer volume control through a volume view, not a plain slider; it includes a level slider and an output device control. **Why:** The volume view is customizable and also covers changing the audio output device. · P familiarity · L interaction, platform · S interact · M t/-/-/-

### Text fields (`text-fields`)

- `text-fields/platform-considerations/ios-ipados/display-a-clear-button-in-the` [iOS, iPadOS] **Do:** On iOS and iPadOS, show a Clear button at the trailing end of a text field. **Why:** One tap erases the contents without repeated presses of Delete. · P agency, familiarity · L interaction, platform · S interact · M d/d/-/-
- `text-fields/platform-considerations/ios-ipados/use-images-and-buttons-to-provide` [iOS, iPadOS] **Do:** On iOS and iPadOS, use images or system buttons at the ends of a text field: leading end for the field's purpose, trailing end for extra features. **Why:** Consistent placement adds clarity and functionality to the field. · P familiarity, simplicity · L interaction, platform · S compose, express · M d/d/-/-

### Toggles (`toggles`)

- `toggles/platform-considerations/ios-ipados/use-the-switch-toggle-style-only` [iOS, iPadOS] **Do:** On iOS and iPadOS, use the switch style only inside a list row, without its own label. **Why:** The row's content already explains what the switch controls. · P familiarity, simplicity · L platform, interaction · S compose · M d/t/-/-
- `toggles/platform-considerations/ios-ipados/change-the-default-color-of-a` [iOS, iPadOS] **Do:** On iOS and iPadOS, recolor a switch only when needed, for example with your accent color, ensuring it contrasts enough with the uncolored state. **Why:** The default green works in most cases, and a custom color must still be perceptible. · P familiarity, flexibility · L attention, inclusion · S express · M d/d/-/-
- `toggles/platform-considerations/ios-ipados/outside-of-a-list-use-a` [iOS, iPadOS] **Do:** On iOS and iPadOS, outside lists use a toggle-like button, highlighted when active, instead of a switch, as the Phone filter button does. **Why:** The highlight shows the active state in the established pattern. · P familiarity · L interaction, platform · S compose, interact · M d/d/-/-
- `toggles/platform-considerations/ios-ipados/avoid-supplying-a-label-that-explains` [iOS, iPadOS] **Do:** On iOS and iPadOS, don't add a text label explaining a toggle-style button; let its icon and background states communicate. **Why:** The icon plus the alternate backgrounds already convey what the button does. · P simplicity · L content, interaction · S write, express · M d/d/-/-

### Virtual keyboards (`virtual-keyboards`)

- `virtual-keyboards/platform-considerations/ios-ipados/use-the-keyboard-layout-guide-to` [iOS, iPadOS] **Do:** On iOS and iPadOS, use the keyboard layout guide so the keyboard fits the interface and key fields and buttons stay visible above it. **Why:** It makes the keyboard feel integrated and prevents it from covering important parts of the interface. · P craft, flexibility · L platform, attention · S compose, adapt · M d/t/-/-
- `virtual-keyboards/platform-considerations/ios-ipados/place-custom-controls-above-the-keyboard` [iOS, iPadOS] **Do:** On iOS and iPadOS, put only task-relevant custom controls above the keyboard, apply Liquid Glass if it matches the rest of the app, and use standard padding. **Why:** Controls should support the current task and look consistent with other views. · P purpose, craft · L platform, attention · S compose, express · M t/-/-/-

### Progress indicators (`progress-indicators`)

- `progress-indicators/platform-considerations/ios-ipados/refresh-content-controls/perform-automatic-content-updates` [iOS, iPadOS] **Do:** On iOS and iPadOS, refresh content on a regular schedule rather than relying on people to start every update. **Why:** People enjoy manual refresh but also expect periodic automatic updates and fresh data. · P agency, purpose · L flow, interaction · S interact · M d/t/-/-
- `progress-indicators/platform-considerations/ios-ipados/refresh-content-controls/supply-a-short-title-only-if` [iOS, iPadOS] **Do:** On iOS and iPadOS, give a refresh control a title only if it adds value, such as time of last update, and never to explain how to refresh. **Why:** The control's animation already shows content is loading, so a title is usually unnecessary. · P simplicity · L content, platform · S write · M d/t/-/-

### App Shortcuts (`app-shortcuts`)

- `app-shortcuts/platform-considerations/ios-ipados/order-shortcuts-based-on-importance` [iOS, iPadOS] **Do:** On iOS and iPadOS, list your most broadly useful App Shortcuts first. **Why:** Your ordering sets their initial appearance in Spotlight and Shortcuts, before the system reorders by usage. · P purpose, simplicity · L attention, platform · S compose · M t/-/-/-

### Widgets (`widgets`)

- `widgets/platform-considerations/ios-ipados/support-the-always-on-display-on` [iOS, iPadOS] **Do:** On iPhone, use gray levels with enough contrast and keep content legible when the Always-On display dims Lock Screen widgets. **Why:** Reduced luminance in the Always-On display can make content hard to see. · P flexibility · L inclusion, platform · S include, express · M t/-/-/-
- `widgets/platform-considerations/ios-ipados/offer-live-activities-to-show-real` [iOS, iPadOS] **Do:** Offer Live Activities when people need to follow a task or event with frequent updates for a limited time; widgets aren't real-time. Build both together and reuse code and design parts. **Why:** Widgets don't show real-time information, and the two features share frameworks and design traits. · P purpose, familiarity · L flow, platform · S define · M t/-/-/-
- `widgets/platform-considerations/ios-ipados/standby-and-carplay/limit-usage-of-rich-images-or` [iOS, iPadOS] **Do:** In StandBy, convey meaning without rich images or color; instead scale up and rearrange text for viewing from afar, and make the widget background removable. **Why:** StandBy is glanced at from a greater distance. · P flexibility, simplicity · L attention, platform · S express, adapt · M t/-/-/-

### Action button (`action-button`)

- `action-button/platform-considerations/ios/let-people-use-your-actions-without` [iOS] **Do:** On iOS, let actions work without leaving the current context, using lightweight options like Live Activities or custom snippets rather than opening the app. **Why:** People can complete a quick action without switching context, as with the Set Timer example. · P agency, flexibility · L flow, platform · S interact · M t/-/-/-

### Gestures (`gestures`)

- `gestures/platform-considerations/ios-ipados/consider-allowing-simultaneous-recognition-of-multiple` [iOS, iPadOS] **Do:** On iOS and iPadOS, consider recognizing several gestures at once if it helps, as in games with a joystick and firing buttons. **Why:** Simultaneous input matters in games but rarely in other apps. · P flexibility · L interaction, platform · S interact · M t/-/-/-

### SharePlay (`shareplay`)

- `shareplay/platform-considerations/ios-ipados-macos/support-picture-in-picture-for-shared` [iOS, iPadOS, macOS] **Do:** Let shared video continue in a Picture in Picture window on iPhone and iPad, or a window brought forward on Mac. **Why:** People can keep watching together while doing other things on their device. · P flexibility, agency · L flow, platform · S interact · M t/-/-/-
