# Platform profile: macOS

Overview page: <https://developer.apple.com/design/human-interface-guidelines/designing-for-macos> · 136 platform-specific rules across 38 pages.

**Key numbers (from HIG tables):**

- Text size: default 13 pt, minimum 10 pt
- Control size: default 28x28 pt, minimum 20x20 pt

## Platform traits

- **Display:** On Mac, design for a large display, possibly several, including an iPad used via Sidecar.
- **Ergonomics:** On Mac, assume stationary use at a desk; on touch Macs treat touch as brief, intentional interaction rather than sustained work.
- **Inputs:** On Mac, put keyboard and pointer first while also supporting trackpad gestures, touch, Siri, Voice Control and game controllers.
- **App interactions:** On Mac, support both quick tasks and hours of deep focus, with smooth transitions between active and inactive states when switching apps.
- **System features:** On Mac, adopt system features like the menu bar, file management, full screen and Dock menus.

## Stated as not supported on this platform

`immersive-experiences`, `spatial-layout`, `workouts`, `lockups`, `activity-views`, `home-screen-quick-actions`, `ornaments`, `page-controls`, `digit-entry-views`, `virtual-keyboards`, `activity-rings`, `complications`, `status-bars`, `top-shelf`, `watch-faces`, `action-button`, `apple-pencil-and-scribble`, `camera-control`, `digital-crown`, `eyes`, `nearby-interactions`, `remotes`, `always-on`, `app-clips`, `augmented-reality`, `carekit`, `carplay`, `healthkit`, `id-verifier`, `imessage-apps-and-stickers`, `nfc`, `researchkit`, `tap-to-pay-on-iphone`

## Platform-specific rules on other pages

### Dark Mode (`dark-mode`)

- `dark-mode/platform-considerations/macos/include-some-transparency-in-custom-component` [macOS] **Do:** On macOS, give custom components with a visible background or bezel some transparency, only while in a neutral state. **Why:** Transparency picks up window background color during desktop tinting, producing harmony that persists when the wallpaper changes. · P craft, familiarity · L platform, attention · S express · M -/t/-/-

### Icons (`icons`)

- `icons/platform-considerations/macos/document-icons/design-simple-images-that-clearly-communicate` [macOS] **Do:** On macOS, give document icons plain shapes and a reduced palette of distinct colors that stay recognizable at every size, down to very small ones. **Why:** Document icons can appear tiny, so complex designs become unrecognizable. · P simplicity, craft · L attention, platform · S express · M -/-/-/-
- `icons/platform-considerations/macos/document-icons/designing-a-single-expressive-image-for` [macOS] **Do:** On macOS, consider a single rich background image, with no center image, to help people identify a document type. **Why:** A distinctive background helps people understand and recognize the document type. · P familiarity, delight · L attention, platform · S express · M -/-/-/-
- `icons/platform-considerations/macos/document-icons/consider-reducing-complexity-in-the-small` [macOS] **Do:** On macOS, simplify small document icon versions: use fewer, thicker lines aligned to the reduced pixel grid, and drop fine details at the smallest size. **Why:** Details that are crisp when large turn blurry and unrecognizable when small. · P simplicity, craft · L attention, platform · S express · M -/-/-/-
- `icons/platform-considerations/macos/document-icons/avoid-placing-important-content-in-the` [macOS] **Do:** On macOS, keep key content out of the background fill's top-right corner, and supply background images in each listed size and scale. **Why:** The system masks the image to the document shape and draws a folded corner over that spot. · P craft · L attention, platform · S express · M -/-/-/-
- `icons/platform-considerations/macos/document-icons/if-a-familiar-object-can-convey` [macOS] **Do:** On macOS, add a center image of a familiar object if it conveys the document type or app link; keep it simple, unambiguous, half the icon canvas, in the listed sizes. **Why:** A clear familiar object communicates the document's type or relationship with your app. · P familiarity, simplicity · L attention, platform · S express · M -/-/-/-
- `icons/platform-considerations/macos/document-icons/define-a-margin-that-measures-about` [macOS] **Do:** On macOS, leave a margin of roughly 10% of the canvas so the image fills about 80%, letting parts extend into it only for optical alignment. · P craft · L attention, platform · S express, compose · M -/-/-/-
- `icons/platform-considerations/macos/document-icons/specify-a-succinct-term-if-it` [macOS] **Do:** On macOS, replace an unfamiliar file extension on the document icon with a short descriptive term, such as scene for a SceneKit file. **Why:** A clearer term helps people understand the document type. · P simplicity, familiarity · L content, platform · S write, express · M -/-/-/-

### Layout (`layout`)

- `layout/platform-considerations/macos/avoid-placing-controls-or-critical-information` [macOS] **Do:** On macOS, don't put controls or critical information along a window's bottom edge. **Why:** People often drag windows so the bottom edge falls below the screen. · P craft, flexibility · L platform, attention · S compose · M -/t/-/-
- `layout/platform-considerations/macos/avoid-displaying-content-behind-the-camera` [macOS] **Do:** On macOS, keep content out of the area behind the camera housing at the window's top edge. · P craft, flexibility · L platform, attention · S compose · M -/-/-/-

### Materials (`materials`)

- `materials/platform-considerations/macos/choose-when-to-allow-vibrancy-in` [macOS] **Do:** On macOS, decide deliberately where custom views and controls use vibrancy, testing in varied contexts to see where it helps. **Why:** Vibrancy makes foreground content stand out on any background, but only testing shows where it improves communication. · P craft, familiarity · L attention, platform · S express · M -/t/-/-
- `materials/platform-considerations/macos/choose-a-background-blending-mode-that` [macOS] **Do:** On macOS, select between the behind-window and within-window blending modes to suit your interface design. · P craft · L attention, platform · S express · M -/t/-/-

### Privacy (`privacy`)

- `privacy/platform-considerations/macos/sign-your-app-with-a-valid` [macOS] **Do:** On macOS, if distributing outside the store, sign the app with a valid Developer ID. **Why:** Signing identifies you as an Apple developer and confirms the app is safe to use. · P responsibility · L trust, platform · S include · M -/-/-/-
- `privacy/platform-considerations/macos/protect-peoples-data-with-app-sandboxing` [macOS] **Do:** On macOS, sandbox your app; it is required for Mac App Store submission. **Why:** Sandboxing grants needed access to resources and user data while shielding the app from malware. · P responsibility · L trust, platform · S include · M -/-/-/-
- `privacy/platform-considerations/macos/avoid-making-assumptions-about-who-is` [macOS] **Do:** On macOS, don't assume a single signed-in person. **Why:** With fast user switching, several people can be active on the same system. · P responsibility, flexibility · L trust, platform · S include · M -/t/-/-

### Typography (`typography`)

- `typography/platform-considerations/macos/when-necessary-use-dynamic-system-font` [macOS] **Do:** On macOS, use dynamic system font variants when text should look like that in standard controls. **Why:** They give text the look of system controls, matching other apps on the platform. · P familiarity, craft · L platform · S express · M -/t/-/-

### Drag and drop (`drag-and-drop`)

- `drag-and-drop/platform-considerations/macos/consider-letting-people-drag-content-from` [macOS] **Do:** On macOS, consider letting people drag content into the Finder, in a format your app can reopen later. **Why:** The exported item can be shared or dragged back into the app. · P familiarity · L interaction, platform · S interact, adapt · M t/d/-/-
- `drag-and-drop/platform-considerations/macos/let-people-drag-selected-content-from` [macOS] **Do:** On macOS, let people drag a background selection out of an inactive window without activating that window first. **Why:** People expect to drag it into the active window without bringing the inactive one forward. · P familiarity, agency · L interaction, platform · S interact, adapt · M t/d/-/-
- `drag-and-drop/platform-considerations/macos/when-possible-let-people-drag-individual` [macOS] **Do:** On macOS, when possible, let people drag an unselected item from an inactive window while keeping its existing background selection. **Why:** Dragging one item shouldn't disturb a selection that is already there. · P familiarity, agency · L interaction, platform · S interact, adapt · M t/d/-/-
- `drag-and-drop/platform-considerations/macos/consider-displaying-a-badge-during-multi` [macOS] **Do:** On macOS, consider a number badge during multi-item drags, updating it if the destination accepts only some items. **Why:** It shows how many items are being dragged or accepted. · P familiarity · L attention, interaction, platform · S interact, adapt · M t/d/-/-
- `drag-and-drop/platform-considerations/macos/consider-changing-the-pointer-appearance-to` [macOS] **Do:** On macOS, consider changing the pointer to signal the result of a drop, such as copy, link, disappearing, or not allowed. **Why:** The pointer tells people what will happen when they drop. · P familiarity · L interaction, platform · S interact, adapt · M t/d/-/-
- `drag-and-drop/platform-considerations/macos/as-much-as-possible-let-people` [macOS] **Do:** On macOS, let people select and start dragging in one continuous motion where possible. **Why:** People like not having to pause between selecting and dragging. · P agency · L interaction, platform · S interact, adapt · M t/d/-/-

### Entering data (`entering-data`)

- `entering-data/platform-considerations/macos/consider-using-an-expansion-tooltip-to` [macOS] **Do:** On macOS, consider an expansion tooltip that reveals the full text of a clipped or truncated field value. **Why:** Small fields can't display everything people entered. · P flexibility · L interaction, platform · S interact, compose · M t/d/-/-

### File management (`file-management`)

- `file-management/platform-considerations/macos/custom-file-management/make-your-custom-file-opening-interface` [macOS] **Do:** On macOS, make a custom file-opening interface convenient, with options like open recent, filtering, and opening several documents at once. **Why:** Extra conveniences help people reach their files faster. · P agency · L interaction, platform · S compose, interact · M t/d/-/-
- `file-management/platform-considerations/macos/custom-file-management/provide-a-save-interface-to-let` [macOS] **Do:** On macOS, provide a save interface that lets people rename a file and change its format or location, defaulting to a logical place. **Why:** This lets people put the document where they want. · P agency · L interaction, platform · S compose, interact · M t/d/-/-
- `file-management/platform-considerations/macos/custom-file-management/consider-extending-the-functionality-of-the` [macOS] **Do:** On macOS, consider adding a custom accessory view with useful options to the Save dialog. **Why:** It places relevant settings right where people save, like including attachments for Mail messages. · P agency · L interaction, platform · S compose, interact · M t/d/-/-
- `file-management/platform-considerations/macos/finder-sync-extensions/help-people-avoid-losing-work-if` [macOS] **Do:** On macOS, if autosaving is turned off, show unsaved changes and offer a save dialog on close, quit, log out, or restart. **Why:** This prevents people from losing work. · P agency, responsibility · L flow, trust · S interact, adapt · M t/d/-/-
- `file-management/platform-considerations/macos/finder-sync-extensions/when-autosaving-is-off-make-sure` [macOS] **Do:** On macOS, show a dot on the close button and Window menu item only when autosaving is off and changes are unsaved. **Why:** With autosave on, the dot wrongly suggests people must act to avoid losing work. · P familiarity, responsibility · L attention, trust · S interact, adapt · M t/d/-/-

### Going full screen (`going-full-screen`)

- `going-full-screen/platform-considerations/macos/use-the-system-provided-full-screen` [macOS] **Do:** On macOS, use the system's full-screen support. **Why:** It makes the window work in every context, including areas like a camera housing. · P familiarity, flexibility · L platform · S adapt · M t/d/-/-
- `going-full-screen/platform-considerations/macos/in-a-game-dont-change-the` [macOS] **Do:** On macOS games, don't change the display mode when players enter full screen. **Why:** People expect to control their display mode, and changing it doesn't improve performance. · P agency · L interaction, platform · S interact, adapt · M -/-/-/-
- `going-full-screen/platform-considerations/macos/always-let-people-choose-when-to` [macOS] **Do:** On macOS, let people choose when to enter full screen using the standard button, menu item, or shortcut, and avoid a custom window-mode menu. **Why:** This keeps entry under people's control and in the familiar standard places. · P agency, familiarity · L interaction, platform · S interact, adapt · M t/d/-/-

### Offering help (`offering-help`)

- `offering-help/platform-considerations/macos-visionos/describe-only-the-control-that-people` [macOS, visionOS] **Do:** In a tooltip, describe only the control the person asked about, not neighboring controls or broader tasks. **Why:** People checking one control want help with that control only. · P simplicity, purpose · L content · S write · M t/d/-/-
- `offering-help/platform-considerations/macos-visionos/explain-the-action-or-task-the` [macOS, visionOS] **Do:** Make a tooltip state the action or task the control triggers, often starting with a verb. **Why:** Describing the outcome tells people what the control does. · P simplicity, familiarity · L content · S write · M t/d/-/-
- `offering-help/platform-considerations/macos-visionos/in-general-avoid-repeating-a-controls` [macOS, visionOS] **Do:** Generally don't restate a control's own name inside its tooltip. **Why:** Repeating the name wastes space and seldom adds meaning. · P simplicity · L content · S write · M t/d/-/-
- `offering-help/platform-considerations/macos-visionos/be-brief` [macOS, visionOS] **Do:** Keep tooltips very short, within roughly 60 to 75 characters, using fragments if useful; if long text is needed, simplify the interface. **Why:** Short text is direct, and localization can change text length. · P simplicity, flexibility · L content, inclusion · S write · M t/d/-/-
- `offering-help/platform-considerations/macos-visionos/use-sentence-case` [macOS, visionOS] **Do:** Write tooltips in sentence case, and drop final punctuation on full sentences unless your app's style needs it. **Why:** Sentence case feels casual and approachable. · P delight, familiarity · L content · S write · M t/d/-/-
- `offering-help/platform-considerations/macos-visionos/consider-offering-context-sensitive-tooltips` [macOS, visionOS] **Do:** Consider tooltip text that changes with a control's state. **Why:** Different states may need different descriptions. · P purpose, flexibility · L content, interaction · S write, interact · M t/d/-/-

### Printing (`printing`)

- `printing/platform-considerations/macos/if-your-macos-app-offers-app` [macOS] **Do:** On macOS, if your app has print options the system lacks, add a custom print panel category named for your app. **Why:** Relevant extras improve the print experience, as with Keynote's presentation-specific options. · P purpose, familiarity · L platform, interaction · S compose · M t/-/-/-
- `printing/platform-considerations/macos/if-your-app-supports-document-specific` [macOS] **Do:** On macOS, offer a page setup dialog for document-specific page settings, without duplicating options the system already handles. **Why:** Rarely changed per-document settings fit there, and the system already covers things like orientation. · P simplicity, familiarity · L platform · S compose · M t/-/-/-
- `printing/platform-considerations/macos/make-sure-interdependencies-between-options-are` [macOS] **Do:** On macOS, make clear how print options depend on each other, such as unavailable choices when double-sided printing is on. · P simplicity, craft · L platform, interaction · S interact · M t/-/-/-
- `printing/platform-considerations/macos/separate-advanced-features-from-frequently-used` [macOS] **Do:** On macOS, hide advanced options behind a disclosure control labeled Advanced Options, apart from commonly used ones. **Why:** Keeping rare features out of view reduces clutter. · P simplicity, agency · L platform, attention · S compose · M t/-/-/-
- `printing/platform-considerations/macos/consider-letting-people-preview-the-effect` [macOS] **Do:** On macOS, consider previewing a setting's effect, such as updating a thumbnail when a tone control changes. · P agency, delight · L platform, interaction · S interact · M t/-/-/-
- `printing/platform-considerations/macos/consider-storing-modified-settings-with-the` [macOS] **Do:** On macOS, consider saving modified print settings with the document, or at least until it is closed. **Why:** People may want to print the document again. · P agency, craft · L platform, flow · S interact · M t/-/-/-

### Settings (`settings`)

- `settings/platform-considerations/macos/include-a-settings-item-in-the` [macOS] **Do:** On macOS, put settings in the App menu, not a toolbar button; document-level options go in the File menu. **Why:** Toolbar buttons take space from frequently used commands. · P familiarity, simplicity · L platform, interaction · S structure, compose · M t/-/-/-
- `settings/platform-considerations/macos/dim-a-settings-windows-minimize-and` [macOS] **Do:** On macOS, dim the minimize and maximize buttons of a settings window. **Why:** It opens quickly by shortcut and sizes itself to each pane, so those buttons add little. · P familiarity, simplicity · L platform, interaction · S compose · M t/-/-/-
- `settings/platform-considerations/macos/in-your-settings-window-use-a` [macOS] **Do:** On macOS, give the settings window a fixed toolbar that stays visible and marks the active button. **Why:** A stable interface helps people navigate and find settings. · P familiarity, craft · L platform, flow · S compose · M t/-/-/-
- `settings/platform-considerations/macos/update-the-windows-title-to-reflect` [macOS] **Do:** On macOS, make the settings window title match the visible pane, or use App Name Settings if there's one pane. · P familiarity, simplicity · L platform, content · S write · M t/-/-/-
- `settings/platform-considerations/macos/restore-the-most-recently-viewed-pane` [macOS] **Do:** On macOS, reopen the settings window on the pane used last. **Why:** People often adjust related settings repeatedly. · P agency, simplicity · L platform, flow · S interact · M t/-/-/-

### Undo and redo (`undo-and-redo`)

- `undo-and-redo/platform-considerations/macos/place-undo-and-redo-commands-in` [macOS] **Do:** On macOS, put undo and redo at the top of Edit and support the standard shortcuts. **Why:** Mac users expect them there and with those shortcuts. · P familiarity · L platform, interaction · S structure, interact · M t/d/-/-

### Image views (`image-views`)

- `image-views/platform-considerations/macos/if-your-app-needs-an-editable` [macOS] **Do:** On Mac, use an image well when an image must be editable. **Why:** It supports copy, paste, dragging and clearing content with the Delete key. · P familiarity · L interaction, platform · S compose · M -/t/-/-
- `image-views/platform-considerations/macos/use-an-image-button-instead-of` [macOS] **Do:** On Mac, use an image button, not an image view, when a picture should be clickable. **Why:** An image button is meant to trigger an immediate action. · P familiarity · L interaction, platform · S compose · M t/t/-/-

### Lists and tables (`lists-and-tables`)

- `lists-and-tables/platform-considerations/macos/when-it-provides-value-let-people` [macOS] **Do:** On Mac, let people click a column heading to sort the table, and reverse the order if it is already sorted. **Why:** Sorting by column helps people find data when it adds value. · P agency · L interaction · S interact · M t/d/-/-
- `lists-and-tables/platform-considerations/macos/let-people-resize-columns` [macOS] **Do:** On Mac, allow resizing of table columns. **Why:** Data widths vary, and people can focus on areas or reveal clipped data. · P agency · L interaction, platform · S interact · M -/t/-/-
- `lists-and-tables/platform-considerations/macos/consider-using-alternating-row-colors-in` [macOS] **Do:** On Mac, consider alternating row colors in multicolumn tables. **Why:** They help people follow a row's values across columns, especially in wide tables. · P simplicity · L attention · S express · M t/d/t/-
- `lists-and-tables/platform-considerations/macos/use-an-outline-view-instead-of` [macOS] **Do:** On Mac, use an outline view rather than a table view for hierarchical data. **Why:** It adds disclosure triangles to expose nested levels. · P familiarity · L platform, attention · S compose · M t/d/-/-

### Split views (`split-views`)

- `split-views/platform-considerations/macos/set-reasonable-defaults-for-minimum-and` [macOS] **Do:** On Mac, set sensible minimum and maximum pane sizes so the divider stays visible. **Why:** A pane that gets too small can make the divider vanish and hard to use. · P craft · L interaction · S compose · M -/d/-/-
- `split-views/platform-considerations/macos/consider-letting-people-hide-a-pane` [macOS] **Do:** On Mac, consider letting people hide a pane, such as hiding side panes during editing. **Why:** It cuts distraction and gives editing more space. · P agency · L interaction · S interact · M -/d/-/-
- `split-views/platform-considerations/macos/provide-multiple-ways-to-reveal-hidden` [macOS] **Do:** On Mac, give several ways to bring back a hidden pane, such as a toolbar button or a menu command with a shortcut. **Why:** People can restore it however they prefer. · P agency, flexibility · L interaction · S interact · M -/d/-/-
- `split-views/platform-considerations/macos/prefer-the-thin-divider-style` [macOS] **Do:** On Mac, use the thin divider unless you have a specific reason for a thicker one. **Why:** It gives content maximum space while staying easy to use. · P simplicity · L attention · S express · M -/d/-/-

### Buttons (`buttons`)

- `buttons/platform-considerations/macos/push-buttons/use-a-flexible-height-push-button` [macOS] **Do:** On Mac, use a flexible-height push button only for tall or multi-line content; otherwise a standard one. **Why:** They match regular buttons visually. · P simplicity, familiarity · L platform · S compose · M -/t/-/-
- `buttons/platform-considerations/macos/push-buttons/append-a-trailing-ellipsis-to-the` [macOS] **Do:** On Mac, end a push button's title with an ellipsis when it opens another window, view or app. **Why:** An ellipsis signals more input will be requested. · P familiarity · L content, platform · S write · M -/t/-/-
- `buttons/platform-considerations/macos/push-buttons/consider-supporting-spring-loading` [macOS] **Do:** On Mac, consider spring loading so dragged items can activate a button via force click without dropping. **Why:** People can continue dragging for further actions. · P agency, flexibility · L interaction · S interact · M -/-/-/-
- `buttons/platform-considerations/macos/square-buttons/use-square-buttons-in-a-view` [macOS] **Do:** On Mac, place square buttons within a view, not in toolbars or status bars; use toolbar items there. **Why:** Square buttons aren't intended for the window frame. · P familiarity · L platform · S compose · M -/t/-/-
- `buttons/platform-considerations/macos/square-buttons/prefer-using-a-symbol-in-a` [macOS] **Do:** On Mac, use symbols in square buttons. **Why:** They get appropriate coloring automatically by state and interaction. · P familiarity, simplicity · L attention · S express · M -/t/-/-
- `buttons/platform-considerations/macos/square-buttons/avoid-using-labels-to-introduce-square` [macOS] **Do:** On Mac, don't add introductory labels to square buttons. **Why:** They are tied to a specific view, so their purpose is clear. · P simplicity · L content · S write · M -/t/-/-
- `buttons/platform-considerations/macos/help-buttons/use-the-system-provided-help-button` [macOS] **Do:** On Mac, open your help documentation with the system help button. **Why:** People recognize it and know it opens help. · P familiarity · L interaction · S compose · M -/t/-/-
- `buttons/platform-considerations/macos/help-buttons/when-possible-open-the-help-topic` [macOS] **Do:** On Mac, open the help topic for the current context, or the top of your help if none matches. **Why:** It takes people to relevant help. · P agency, purpose · L flow · S interact · M t/d/-/-
- `buttons/platform-considerations/macos/help-buttons/include-no-more-than-one-help` [macOS] **Do:** On Mac, place only one help button per window. **Why:** Multiple ones make results unpredictable. · P simplicity, familiarity · L interaction · S compose · M -/t/-/-
- `buttons/platform-considerations/macos/help-buttons/position-help-buttons-where-people-expect` [macOS] **Do:** On Mac, put help buttons in expected spots, such as the lower corner opposite dismissal buttons in dialogs or lower corners in settings. **Why:** People look there. · P familiarity · L attention · S compose · M -/t/-/-
- `buttons/platform-considerations/macos/help-buttons/use-a-help-button-within-a` [macOS] **Do:** On Mac, put a help button inside the view rather than the toolbar or status bar. **Why:** Help buttons belong in the view content. · P familiarity · L platform · S compose · M -/t/-/-
- `buttons/platform-considerations/macos/help-buttons/avoid-displaying-text-that-introduces-a` [macOS] **Do:** On Mac, skip descriptive text introducing a help button. **Why:** People already know what it does. · P simplicity · L content · S write · M -/t/-/-
- `buttons/platform-considerations/macos/image-buttons/use-an-image-button-in-a` [macOS] **Do:** On macOS, put image buttons inside a view's content area rather than the window frame; in a toolbar, use a toolbar item. **Why:** Toolbars and status bars have their own component for this, so an image button there departs from the convention. · P familiarity · L platform, interaction · S compose · M -/t/-/-
- `buttons/platform-considerations/macos/image-buttons/include-about-10-pixels-of-padding` [macOS] **Do:** On macOS, leave roughly 10 pixels of padding between an image and its button edges, and skip the system border. **Why:** The button's edges set the clickable area even when invisible, so padding lets imprecise clicks still register. · P craft, flexibility · L interaction, platform · S compose · M t/d/-/-
- `buttons/platform-considerations/macos/image-buttons/if-you-need-to-include-a` [macOS] **Do:** On macOS, when an image button needs a label, place the label underneath the image. · P familiarity · L platform, attention · S compose · M t/t/-/-

### The menu bar (`the-menu-bar`)

- `the-menu-bar/platform-considerations/macos/menu-bar-extras/consider-using-a-symbol-to-represent` [macOS] **Do:** On macOS, represent a menu bar extra with an SF Symbol or custom icon drawn in black and clear, so the system can recolor it; menu bar height is 24 pt. **Why:** System recoloring keeps the icon looking right on dark and light menu bars and when selected. · P familiarity, craft · L platform, attention · S express · M -/-/-/-
- `the-menu-bar/platform-considerations/macos/menu-bar-extras/display-a-menu-not-a-popover` [macOS] **Do:** On macOS, show a menu when a menu bar extra is clicked; use a popover only if the functionality is too complex for a menu. · P familiarity, simplicity · L platform, interaction · S interact · M -/-/-/-
- `the-menu-bar/platform-considerations/macos/menu-bar-extras/let-people-not-your-app-decide` [macOS] **Do:** On macOS, let people choose whether your menu bar extra appears, typically in settings, and consider offering that during setup. **Why:** People should control their menu bar; offering it at setup helps them discover it. · P agency · L trust, platform · S interact · M -/-/-/-
- `the-menu-bar/platform-considerations/macos/menu-bar-extras/avoid-relying-on-the-presence-of` [macOS] **Do:** On macOS, don't depend on your menu bar extra being visible. **Why:** The system hides and shows extras regularly, and you can't know which others people display or where yours lands. · P flexibility, agency · L platform, flow · S structure · M -/-/-/-
- `the-menu-bar/platform-considerations/macos/menu-bar-extras/consider-exposing-app-specific-functionality-in` [macOS] **Do:** On macOS, also expose app functions another way, such as a Dock menu opened by Control-clicking the Dock icon. **Why:** People can hide or skip the menu bar extra, whereas the Dock menu exists whenever the app runs. · P agency, flexibility · L platform, interaction · S structure · M -/-/-/-

### Toolbars (`toolbars`)

- `toolbars/platform-considerations/macos/make-every-toolbar-item-available-as` [macOS] **Do:** On macOS, offer every toolbar item also as a menu bar command, though not every menu command needs a toolbar item. **Why:** The toolbar can be customized or hidden; not all menu commands merit toolbar space. · P agency, flexibility · L platform, interaction · S structure · M -/t/-/-

### Search fields (`search-fields`)

- `search-fields/platform-considerations/ipados-macos/put-a-search-field-at-the` [iPadOS, macOS] **Do:** On iPad and Mac, place search at the toolbar's trailing end, especially for split-view apps or when results show in the detail view. **Why:** It is a familiar spot, uses space well, and lets people browse results while keeping their selection visible. · P familiarity, craft · L platform, attention · S compose · M t/d/-/-
- `search-fields/platform-considerations/ipados-macos/include-search-at-the-top-of` [iPadOS, macOS] **Do:** On iPad and Mac, put search at the top of the sidebar when it filters sidebar content or navigation, so deep sections surface quickly. **Why:** It offers a simple way to search, preview and reach buried sections, and separates the filtered sidebar from the neighboring view. · P simplicity, familiarity · L flow, platform · S structure, compose · M t/d/-/-
- `search-fields/platform-considerations/ipados-macos/include-search-as-an-item-in` [iPadOS, macOS] **Do:** On iPad and Mac, give search its own sidebar or tab bar item when it comes with rich suggestions or categories and browsing blends with searching. **Why:** A dedicated area gives rich content room, unifies discovery, and keeps search reachable from every section. · P purpose, familiarity · L flow, platform · S structure · M d/d/-/-
- `search-fields/platform-considerations/ipados-macos/in-a-search-field-in-a` [iPadOS, macOS] **Do:** When someone opens a dedicated search area, focus the field immediately; on iPad with only a virtual keyboard, leave it unfocused. **Why:** Immediate focus speeds searching and makes the field easy to find, but a virtual keyboard could unexpectedly cover the view. · P agency, flexibility · L interaction, platform · S interact · M d/d/-/-
- `search-fields/platform-considerations/ipados-macos/account-for-window-resizing-with-the` [iPadOS, macOS] **Do:** Plan where the search field sits as the window resizes; in compact iPad views, keep it where it is most useful, such as above the content list. **Why:** Search should stay available where it is most contextually useful when the window changes size. · P flexibility · L platform, flow · S adapt · M t/d/-/-

### Sidebars (`sidebars`)

- `sidebars/platform-considerations/macos/consider-automatically-hiding-and-revealing-a` [macOS] **Do:** On Mac, consider collapsing the sidebar automatically when its window gets smaller, and revealing it again when there's room. **Why:** Collapsing frees space for the main content in a small window. · P flexibility · L platform, interaction · S adapt · M t/d/-/-
- `sidebars/platform-considerations/macos/avoid-putting-critical-information-or-actions` [macOS] **Do:** On Mac, keep vital information and actions away from the sidebar's lower end. **Why:** People often move windows so the bottom edge is off-screen. · P flexibility, craft · L attention, platform · S compose · M t/d/-/-

### Alerts (`alerts`)

- `alerts/platform-considerations/macos/use-a-caution-symbol-sparingly` [macOS] **Do:** On Mac, use the caution symbol only when extra attention is truly needed, such as risk of unexpected data loss; not for save or empty-trash tasks. **Why:** Frequent use dilutes its significance. · P responsibility, simplicity · L attention, trust · S express · M d/d/d/d

### Popovers (`popovers`)

- `popovers/platform-considerations/macos/consider-letting-people-detach-a-popover` [macOS] **Do:** On Mac, consider allowing a popover to be detached into a panel. **Why:** People may want it to stay visible while viewing other information. · P agency, flexibility · L interaction, platform · S interact · M -/t/-/-
- `popovers/platform-considerations/macos/make-minimal-appearance-changes-to-a` [macOS] **Do:** On Mac, make a detached popover's panel look much like the original popover. **Why:** A similar look helps people keep their context. · P familiarity · L attention, platform · S express · M -/t/-/-

### Scroll views (`scroll-views`)

- `scroll-views/platform-considerations/macos/if-necessary-use-small-or-mini` [macOS] **Do:** On Mac, when space is tight in a panel, use small or mini scroll bars, and make every control in that panel the same size. **Why:** Smaller bars let panels coexist with other windows when space is limited. · P craft, flexibility · L platform, attention · S compose · M -/t/-/-

### Sheets (`sheets`)

- `sheets/platform-considerations/macos/present-a-sheet-in-a-reasonable` [macOS] **Do:** On macOS, open sheets at a default size that fits their content, and allow resizing where people may want to expand the content. **Why:** People don't normally expect to resize sheets, but sometimes a larger view helps them see content more clearly. · P familiarity, flexibility · L platform, interaction · S compose, adapt · M -/t/-/-
- `sheets/platform-considerations/macos/let-people-interact-with-other-app` [macOS] **Do:** On macOS, ensure people can bring other app windows forward even while a sheet is still open on its parent window. **Why:** People shouldn't be forced to dismiss the sheet before working in a different window of the app. · P agency · L flow, platform · S interact · M -/t/-/-
- `sheets/platform-considerations/macos/use-a-panel-instead-of-a` [macOS] **Do:** On macOS, use a panel rather than a sheet when people must give input repeatedly and watch each outcome, like find and replace. **Why:** A panel lets people trigger actions one at a time and check each result for correctness. · P agency, purpose · L flow, interaction · S structure, interact · M -/t/-/-

### Windows (`windows`)

- `windows/platform-considerations/macos/macos-window-states/make-sure-custom-windows-use-the` [macOS] **Do:** On macOS, make custom windows adopt the system appearance for each window state, updating backgrounds and buttons yourself when you skip system components. **Why:** People use these visual differences to tell which window is in front and will receive their input. · P familiarity, craft · L attention, platform · S express, interact · M -/t/-/-
- `windows/platform-considerations/macos/macos-window-states/avoid-putting-critical-information-or-actions` [macOS] **Do:** On macOS, keep crucial information and actions out of a window's bottom bar; if you use one, limit it to a little related info and put more in an inspector. **Why:** People often move windows so the bottom edge is hidden, and a bottom bar has little room. · P simplicity, flexibility · L attention, platform · S compose · M -/t/-/-

### Pickers (`pickers`)

- `pickers/platform-considerations/macos/choose-a-date-picker-style-that` [macOS] **Do:** On macOS, use the textual date picker for tight space and precise entries; use graphical for browsing a calendar, choosing ranges, or a clock look. **Why:** Each style fits a different situation of space and selection behavior. · P flexibility, familiarity · L platform, interaction · S compose · M -/t/-/-

### Segmented controls (`segmented-controls`)

- `segmented-controls/platform-considerations/macos/consider-using-introductory-text-to-clarify` [macOS] **Do:** On macOS, add intro text to clarify a segmented control; with symbol segments, add a label under each, and give each segment a tooltip if the app uses them. **Why:** Symbols alone can leave a segment's meaning unclear. · P simplicity, flexibility · L content, platform · S write, include · M -/t/-/-
- `segmented-controls/platform-considerations/macos/use-a-tab-view-in-the` [macOS] **Do:** On macOS, switch views in the main window area with a tab view; reserve segmented controls for toolbars or inspector panes. **Why:** A tab view supports efficient view switching in the main area. · P familiarity · L flow, platform · S structure, compose · M -/t/-/-
- `segmented-controls/platform-considerations/macos/consider-supporting-spring-loading` [macOS] **Do:** On a Mac with a Magic Trackpad, consider spring loading so dragged items can activate a segment by force click without being dropped. **Why:** People can activate a segment mid-drag and keep dragging afterward. · P agency, flexibility · L interaction, platform · S interact · M -/-/-/-

### Sliders (`sliders`)

- `sliders/platform-considerations/macos/consider-giving-live-feedback-as-the` [macOS] **Do:** On macOS, show results in real time while a slider moves, like Dock icons rescaling as the Size slider changes. **Why:** Live feedback lets people see the effect as it happens. · P familiarity, delight · L interaction, platform · S interact · M d/d/-/-
- `sliders/platform-considerations/macos/choose-a-slider-style-that-matches` [macOS] **Do:** On macOS, use a horizontal slider between fixed endpoints and a circular slider for values that repeat or keep going, like rotation. **Why:** The style should match what people expect for the type of value. · P familiarity · L interaction, platform · S compose, interact · M t/d/-/-
- `sliders/platform-considerations/macos/consider-using-a-label-to-introduce` [macOS] **Do:** On macOS, consider a lead-in label for a slider, in sentence-style capitalization ending with a colon. **Why:** A label tells people what the slider controls. · P simplicity, familiarity · L content, platform · S write · M -/d/-/-
- `sliders/platform-considerations/macos/use-tick-marks-to-increase-clarity` [macOS] **Do:** On macOS, add tick marks to sliders. **Why:** They convey the measurement scale and make specific values easier to find. · P craft, simplicity · L attention, platform · S express, compose · M t/d/-/-
- `sliders/platform-considerations/macos/consider-adding-labels-to-tick-marks` [macOS] **Do:** On macOS, label tick marks with numbers or words where useful, often just the ends; label periodically for nonlinear scales and show the thumb value in a tooltip. **Why:** Labels add clarity, but labeling every tick is only needed to prevent confusion. · P simplicity, flexibility · L content, platform · S write, express · M t/d/-/-

### Steppers (`steppers`)

- `steppers/platform-considerations/macos/for-large-value-ranges-consider-supporting` [macOS] **Do:** On macOS, for wide ranges, let Shift-click change the stepper by a bigger increment than usual, such as ten times. **Why:** It speeds up large changes to the value. · P flexibility, agency · L interaction, platform · S interact · M -/d/-/-

### Text fields (`text-fields`)

- `text-fields/platform-considerations/macos/consider-using-a-combo-box-if` [macOS] **Do:** On macOS, use a combo box when text entry should come with a list of choices. **Why:** A combo box is the component built for combining typing with a set of options. · P familiarity · L interaction, platform · S compose · M -/t/-/-

### Toggles (`toggles`)

- `toggles/platform-considerations/macos/use-switches-checkboxes-and-radio-buttons` [macOS] **Do:** On macOS, keep switches, checkboxes, and radio buttons inside the main window body rather than the toolbar, status bar, or frame. **Why:** This is the platform's expected placement for these controls. · P familiarity · L platform, interaction · S compose · M -/t/-/-
- `toggles/platform-considerations/macos/switches/prefer-a-switch-for-settings-that` [macOS] **Do:** On macOS, choose a switch for settings you want to stress, such as turning a whole group of settings on or off. **Why:** A switch carries more visual weight than a checkbox, so it suits controlling more functionality. · P simplicity, purpose · L attention, platform · S compose · M t/d/-/-
- `toggles/platform-considerations/macos/switches/within-a-grouped-form-consider-using` [macOS] **Do:** On macOS in a grouped form, use a mini switch for single-row settings; for a hierarchy, use a regular switch for the main setting and mini ones for subordinate settings. **Why:** A mini switch matches the height of buttons and controls, keeping row heights consistent. · P craft, simplicity · L attention, platform · S compose · M -/t/-/-
- `toggles/platform-considerations/macos/switches/in-general-dont-replace-a-checkbox` [macOS] **Do:** On macOS, keep existing checkboxes instead of swapping them for switches. **Why:** Staying with the checkbox you already use is the safer, consistent choice. · P familiarity · L platform · S compose · M -/t/-/-
- `toggles/platform-considerations/macos/checkboxes/use-a-checkbox-instead-of-a` [macOS] **Do:** On macOS, use checkboxes rather than switches to show a hierarchy of settings, aligning them on the leading edge and indenting dependent ones. **Why:** Checkboxes align well and express grouping and dependencies between parent and subordinate settings. · P simplicity, familiarity · L attention, platform · S compose · M -/d/-/-
- `toggles/platform-considerations/macos/checkboxes/consider-using-radio-buttons-if-you` [macOS] **Do:** On macOS, use radio buttons when there are more than two mutually exclusive options. **Why:** Radio buttons let each option carry its own distinct label beyond on and off. · P simplicity, familiarity · L content, platform · S compose, write · M -/d/-/-
- `toggles/platform-considerations/macos/checkboxes/consider-using-a-label-to-introduce` [macOS] **Do:** On macOS, introduce a checkbox group with a label if the relationship isn't clear, describing the set and lining its baseline up with the first checkbox. **Why:** A label makes the connection among the checkboxes understandable. · P simplicity · L content, attention · S write, compose · M -/d/-/-
- `toggles/platform-considerations/macos/checkboxes/accurately-reflect-a-checkboxs-state-in` [macOS] **Do:** On macOS, make a checkbox's look match its on, off, or mixed state, using mixed when a master checkbox governs subordinates with differing states. **Why:** The visible state needs to tell people truthfully what is set. · P familiarity, craft · L interaction, attention · S interact, express · M -/d/-/-
- `toggles/platform-considerations/macos/radio-buttons/prefer-a-set-of-radio-buttons` [macOS] **Do:** On macOS, use a radio button set for mutually exclusive choices, and checkboxes when several choices may be selected. **Why:** Radio buttons express single choice, while checkboxes allow multiple selection. · P familiarity · L interaction, platform · S compose · M -/d/-/-
- `toggles/platform-considerations/macos/radio-buttons/avoid-listing-too-many-radio-buttons` [macOS] **Do:** On macOS, don't list too many radio buttons; beyond about five options, consider a component such as a pop-up button. **Why:** A long list consumes space and can overwhelm people. · P simplicity · L attention, platform · S compose · M -/d/-/-
- `toggles/platform-considerations/macos/radio-buttons/to-present-a-single-setting-that` [macOS] **Do:** On macOS, show a lone on/off setting with a checkbox; only if that's unclear, use two radio buttons labeled with the states they control. **Why:** A checkmark's presence or absence reveals the current state at a glance. · P simplicity, familiarity · L interaction, platform · S compose · M -/d/-/-
- `toggles/platform-considerations/macos/radio-buttons/use-consistent-spacing-when-you-display` [macOS] **Do:** On macOS, when laying radio buttons out horizontally, size every slot to fit the longest label and reuse that spacing. **Why:** Equal spacing keeps the row tidy and uniform. · P craft · L attention, platform · S compose · M -/d/-/-

### Gauges (`gauges`)

- `gauges/platform-considerations/macos/consider-using-the-continuous-style-for` [macOS] **Do:** On macOS, use the continuous style for capacity indicators with large ranges. **Why:** With a big range, discrete segments become too small to be useful. · P craft, simplicity · L attention, platform · S express · M t/t/-/-
- `gauges/platform-considerations/macos/consider-changing-the-fill-color-to` [macOS] **Do:** On macOS, consider changing a capacity indicator's fill color at key levels, or use tiered colors in one indicator. **Why:** Color shifts highlight meaningful parts of the range, such as very low or very high. · P purpose, simplicity · L attention, platform · S express · M t/t/t/t

### Progress indicators (`progress-indicators`)

- `progress-indicators/platform-considerations/macos/prefer-an-activity-indicator-spinner-to` [macOS] **Do:** On macOS, use a spinner for background operation status or tight spaces, such as inside a text field or next to a button. **Why:** Spinners are small and unobtrusive, suiting asynchronous tasks and small areas. · P simplicity, familiarity · L attention, platform · S compose, interact · M t/d/-/-
- `progress-indicators/platform-considerations/macos/avoid-labeling-a-spinning-progress-indicator` [macOS] **Do:** On macOS, don't attach a label to a spinner. **Why:** It generally appears after people start a process, so a label is usually unnecessary. · P simplicity · L content, platform · S write · M t/d/-/-

### Gestures (`gestures`)

- `gestures/platform-considerations/macos/keep-the-layout-and-size-of` [macOS] **Do:** On macOS with touch support, keep interface layout and element size unchanged. **Why:** Touch is secondary there, and people switch inputs often, so stability matters. · P familiarity, flexibility · L interaction, platform · S compose, adapt · M t/d/-/-
- `gestures/platform-considerations/macos/make-tap-targets-bigger-not-the` [macOS] **Do:** On macOS, enlarge tap targets rather than controls, using standard framework controls where possible. **Why:** Touch can start slightly outside visual bounds, and standard controls get an optimal target size. · P familiarity, flexibility · L interaction, platform · S compose · M t/d/-/-
- `gestures/platform-considerations/macos/consider-providing-expandable-controls` [macOS] **Do:** On macOS, consider a touch-sized temporary variant for small or dense controls that appears on tap and lingers briefly after release. **Why:** It keeps small controls usable by touch. · P flexibility, agency · L interaction, platform · S interact · M t/d/-/-
- `gestures/platform-considerations/macos/dont-use-touch-as-the-only` [macOS] **Do:** On macOS, ensure all functions work through keyboard and pointer, and give touch equivalents for pointer-only actions such as shift-drag or hover menus. **Why:** Touch shouldn't be the only route, and touch users shouldn't lose pointer-only actions. · P flexibility, agency · L inclusion, platform · S include, interact · M t/d/-/-
- `gestures/platform-considerations/macos/where-possible-align-with-gestures-people` [macOS] **Do:** On macOS, reuse gestures people know from iPhone, iPad, trackpad or Magic Mouse, after testing for conflicts with macOS system gestures. **Why:** Familiar gestures are quicker to adopt. · P familiarity, flexibility · L interaction, platform · S interact, adapt · M t/d/-/-
- `gestures/platform-considerations/macos/make-sure-custom-gestures-work-for` [macOS] **Do:** On macOS, make custom gestures work with touch and trackpad, adding modifier keys when needed. **Why:** Supporting both direct and indirect input reaches the widest audience. · P flexibility · L inclusion, platform · S interact, adapt · M t/d/-/-

### Pointing devices (`pointing-devices`)

- `pointing-devices/platform-considerations/macos/touch-support-for-hidden-controls/decide-which-hidden-controls-need-touch` [macOS] **Do:** On Mac, give touch access to hidden controls only if essential; skip tooltips and features touch can already do another way, and don't keep controls permanently visible just for touch. **Why:** Extra touch affordances add clutter, and gestures like swiping already cover tasks such as carousel scrolling. · P simplicity, purpose · L interaction, value · S interact · M t/t/-/-
- `pointing-devices/platform-considerations/macos/touch-support-for-hidden-controls/reveal-a-hidden-control-when-someone` [macOS] **Do:** On Mac touch displays, a tap near a hidden control reveals it, limited to controls relevant to current content; hide it after use or idle seconds. Sidebars and tab close buttons differ. **Why:** Showing too many controls at once overwhelms and distracts people. · P simplicity, agency · L interaction, attention · S interact · M t/t/-/-
- `pointing-devices/platform-considerations/macos/touch-support-for-hidden-controls/retain-the-current-selection-when-revealing` [macOS] **Do:** On Mac, when a tap reveals a hidden control, and when the revealed control is then tapped, preserve what is currently selected. **Why:** The control may operate on the selection, so altering it would make people redo their selection. · P agency · L interaction · S interact · M t/t/-/-
- `pointing-devices/platform-considerations/macos/touch-support-for-hidden-controls/make-essential-hidden-controls-available-in` [macOS] **Do:** On Mac, also put the most-needed hidden controls in a short context menu, which touch users can open with touch and hold. **Why:** A context menu offers a dependable path to a control without hunting for where it shows up. · P agency, simplicity · L interaction, flow · S interact · M t/d/-/-
- `pointing-devices/platform-considerations/macos/touch-support-for-hidden-controls/in-a-sidebar-reveal-hidden-controls` [macOS] **Do:** On Mac, treat a sidebar tap on a header or row like a click and show only that item's hidden controls. Tapping a hidden control's spot reveals it; a second tap activates. **Why:** Taps matching clicks keep behavior familiar, and revealing before activating prevents accidental actions. · P familiarity, agency · L interaction, platform · S interact · M t/t/-/-
- `pointing-devices/platform-considerations/macos/touch-support-for-hidden-controls/in-a-tabbed-window-reveal-the` [macOS] **Do:** On Mac, a tap anywhere in a tabbed window shows the selected tab's close button until a pointing device is used again; after closing by touch, show it on the new tab. · P familiarity · L interaction, platform · S interact · M -/t/-/-

### SharePlay (`shareplay`)

- `shareplay/platform-considerations/ios-ipados-macos/support-picture-in-picture-for-shared` [iOS, iPadOS, macOS] **Do:** Let shared video continue in a Picture in Picture window on iPhone and iPad, or a window brought forward on Mac. **Why:** People can keep watching together while doing other things on their device. · P flexibility, agency · L flow, platform · S interact · M t/-/-/-
