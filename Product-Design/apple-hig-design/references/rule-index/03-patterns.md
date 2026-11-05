# Rule index: Patterns

Source: Apple Human Interface Guidelines, collected 2026-11-04. 25 pages, 301 entries.

Each line is our own summary of one HIG rule, not Apple's wording. Open the page link for the original text.

Legend: **P** principles behind the rule (why) · **L** lenses · **S** work stages · **M** media fit for mobile / web / slides / cards (d = direct, t = transfer, - = none) · [Platform] marks platform-specific rules · **Term** entries are definitions, not rules.

## Charting data (`charting-data`)

<https://developer.apple.com/design/human-interface-guidelines/charting-data>

### Best practices

- `charting-data/best-practices/use-a-chart-when-you-want` **Do:** Use a chart to spotlight the key takeaway from data that matters to your audience. **Why:** Charts draw the eye, so that prominence should be used to show what people can learn. · P purpose · L value, attention · S define, compose · M d/d/t/d
- `charting-data/best-practices/keep-a-chart-simple-letting-people` **Do:** Keep charts uncluttered and let people reveal extra detail on demand rather than showing everything at once. **Why:** Too much data overwhelms the chart and hides the relationships you want to show. · P simplicity, agency · L attention, interaction · S compose, interact · M d/d/t/t
- `charting-data/best-practices/make-every-chart-in-your-app` **Do:** Give every chart accessibility labels for its values and parts, plus accessible elements for interacting with it. **Why:** Charts communicate visually, so people using assistive tools need a non-visual route to the data. · P flexibility · L inclusion, interaction · S include, interact · M d/d/-/-
### Designing effective charts

- `charting-data/designing-effective-charts/in-general-prefer-using-common-chart` **Do:** Choose widely known chart types, such as bar or line charts, when you can. **Why:** People already know how to read common chart types. · P familiarity · L attention · S express · M d/d/t/d
- `charting-data/designing-effective-charts/if-you-need-to-create-a` **Do:** When a chart presents data in an unfamiliar way, teach people how to read it, for example by animating its parts one at a time. **Why:** An unfamiliar chart form can't be read from prior knowledge, so people need guidance. · P familiarity · L content · S write · M d/d/t/d
- `charting-data/designing-effective-charts/examine-the-data-from-multiple-levels` **Do:** Study the data at overall, mid, and individual-point levels to find details worth showing in the chart. **Why:** Each level reveals different useful information, such as totals, subsets, or notable points. · P purpose · L value · S define, compose · M d/d/t/t
- `charting-data/designing-effective-charts/aid-comprehension-by-adding-descriptive-text` **Do:** Add titles, subtitles, and annotations to charts, including a short headline or summary. **Why:** Descriptive text stresses the key information and lets people grasp it at a glance. · P simplicity · L attention, content · S write, express · M d/d/t/d
- `charting-data/designing-effective-charts/match-the-size-of-a-chart` **Do:** Size each chart to suit its purpose, topic, and detail, big enough for readable labels and any interaction. **Why:** Details and descriptive text must stay easy to read, and interactive features need room. · P flexibility · L attention, interaction · S compose, adapt · M d/d/t/t
- `charting-data/designing-effective-charts/prefer-consistency-across-multiple-charts-deviating` **Do:** Keep similar charts consistent in type and style, changing them only to point out differences. **Why:** Different looks suggest charts are unrelated, while consistency lets people reuse what they learned. · P familiarity · L attention · S compose, express · M d/d/t/d
- `charting-data/designing-effective-charts/maintain-continuity-among-multiple-charts-that` **Do:** For multiple charts of one dataset, keep the same chart type, colors, annotations, layout, and descriptive text. **Why:** Consistency signals that the data is still the same dataset. · P familiarity · L attention · S compose, express · M d/d/t/d

## Collaboration and sharing (`collaboration-and-sharing`)

<https://developer.apple.com/design/human-interface-guidelines/collaboration-and-sharing>

### Best practices

- `collaboration-and-sharing/best-practices/place-the-share-button-in-a` **Do:** Put a Share button somewhere easy to reach, such as a toolbar, so sharing or collaboration is simple to begin. **Why:** Easy access to the entry point makes starting to share convenient. · P familiarity, agency · L interaction, platform · S compose, interact · M d/d/-/-
- `collaboration-and-sharing/best-practices/if-necessary-customize-the-share-sheet` **Do:** Customize the system share sheet or popover only as needed to offer the sharing types your app supports. **Why:** Sharing options should reflect what your app can actually do. · P familiarity · L interaction, platform · S compose, interact · M t/d/-/-
- `collaboration-and-sharing/best-practices/write-succinct-phrases-that-summarize-the` **Do:** Write short phrases that sum up the sharing permissions your app offers. **Why:** The system shows this summary on a button that opens the sharing options. · P simplicity · L content · S write · M d/d/-/-
- `collaboration-and-sharing/best-practices/provide-a-set-of-simple-sharing` **Do:** Offer a small set of simple sharing choices, like who has access and whether they can edit or only read. **Why:** Simple options make setting up collaboration quicker. · P simplicity · L flow, interaction · S compose, interact · M t/d/-/-
- `collaboration-and-sharing/best-practices/prominently-display-the-collaboration-button-as` **Do:** Show the Collaboration button prominently once collaboration begins, ideally beside the Share button. **Why:** It reminds people the content is shared and shows who is sharing it. · P familiarity · L attention, trust · S compose, interact · M t/d/-/-
- `collaboration-and-sharing/best-practices/provide-custom-actions-in-the-collaboration` **Do:** Add custom items to the collaboration popover only when they are truly needed. **Why:** The popover already has set sections for collaborators and management, so extras add clutter. · P simplicity · L interaction, value · S compose, structure · M t/d/-/-
- `collaboration-and-sharing/best-practices/if-it-makes-sense-in-your` **Do:** Where it fits your app, rename the collaboration-management button to something more suitable. **Why:** The default title may not match your app, and the button opens the settings and membership view. · P familiarity · L content · S write · M t/d/-/-
- `collaboration-and-sharing/best-practices/consider-posting-collaboration-event-notifications-in` **Do:** Consider posting collaboration events to Messages, naming the event type and including a link that opens the relevant view. **Why:** Notifying people about changes and mentions keeps them aware, and the link takes them to the right place. · P responsibility · L flow, trust · S interact, write · M t/d/-/-

## Drag and drop (`drag-and-drop`)

<https://developer.apple.com/design/human-interface-guidelines/drag-and-drop>

### Best practices

- `drag-and-drop/best-practices/as-much-as-possible-support-drag` **Do:** Support drag and drop in as many places in your app as you reasonably can. **Why:** People know drag and drop and try it everywhere. · P familiarity · L interaction · S interact · M d/d/-/-
- `drag-and-drop/best-practices/offer-alternative-ways-to-accomplish-drag` **Do:** Provide other ways to do drag-and-drop tasks, such as menu commands for copying and moving. **Why:** Dragging can be inconvenient or impossible for some people. · P flexibility, agency · L inclusion, interaction · S interact, compose · M d/d/-/-
- `drag-and-drop/best-practices/determine-when-dragging-and-dropping-content` **Do:** Decide whether a drag inside your app moves or copies: move within the same container, copy between different ones. **Why:** Follow the behavior most people expect before changing these defaults. · P familiarity · L interaction · S interact · M d/d/-/-
- `drag-and-drop/best-practices/support-multi-item-drag-and-drop` **Do:** Support dragging several items at once where it makes sense. **Why:** Moving a group is more convenient than dragging each item separately. · P agency · L interaction · S interact · M t/d/-/-
- `drag-and-drop/best-practices/prefer-letting-people-undo-a-drag` **Do:** Let people undo a drag-and-drop, and consider confirming first if it can't be undone. **Why:** People sometimes drop content in the wrong place and want to get back to the earlier state. · P agency · L flow, interaction · S interact · M d/d/-/-
- `drag-and-drop/best-practices/consider-offering-multiple-versions-of-dragged` **Do:** Offer dragged content in several versions ordered from best to lowest fidelity. **Why:** The destination can then pick the highest-quality version it accepts. · P flexibility · L interaction · S interact · M t/d/-/-
- `drag-and-drop/best-practices/consider-supporting-spring-loading` **Do:** Consider spring loading so dragging content over a button or segmented control activates it. **Why:** It gives a convenient way to reach a control mid-drag, like moving an event to another date. · P agency · L interaction · S interact · M t/d/-/-
### Providing feedback

- `drag-and-drop/providing-feedback/display-a-drag-image-as-soon` **Do:** Show a translucent drag image once a selection is dragged a short distance, and keep it until the drop. **Why:** Translucency tells it apart from the original and lets people see destinations beneath it. · P familiarity · L attention, interaction · S interact · M d/d/-/-
- `drag-and-drop/providing-feedback/if-it-adds-clarity-modify-the` **Do:** Adjust the drag image when it helps people anticipate the outcome, for example showing default size or grouping multiple items. **Why:** It lets people predict the result and confirm they haven't missed an item. · P familiarity · L attention, interaction · S interact · M d/d/-/-
- `drag-and-drop/providing-feedback/show-people-whether-a-destination-can` **Do:** Show cues like highlights or an insertion point only when the destination can accept the item; otherwise show nothing or a not-allowed image. **Why:** Feedback tells people whether a drop will work, and cues should appear only while the content is positioned over the target. · P familiarity · L attention, interaction · S interact · M d/d/-/-
- `drag-and-drop/providing-feedback/when-people-drop-an-item-on` **Do:** Give visual feedback when a drop fails or lands on an invalid destination, such as returning the item or fading it away. **Why:** People need to see that the drop did not succeed. · P familiarity · L interaction · S interact · M d/d/-/-
### Accepting drops

- `drag-and-drop/accepting-drops/scroll-the-contents-of-a-destination` **Do:** Auto-scroll a long destination container while an item is dragged over it. **Why:** It helps people find the right drop spot. · P agency · L interaction · S interact · M d/d/-/-
- `drag-and-drop/accepting-drops/when-theres-a-choice-pick-the` **Do:** When a drop offers several versions, take the richest one your app can handle, falling back to a simpler one. **Why:** Richer content keeps more of the original value when the app supports it. · P simplicity · L interaction · S interact · M t/d/-/-
- `drag-and-drop/accepting-drops/extract-only-the-relevant-portion-of` **Do:** Keep only the relevant part of dropped content when needed. **Why:** Showing just what is needed avoids excess, as when Mail shows only a contact's name and email. · P simplicity · L content · S interact · M t/d/-/-
- `drag-and-drop/accepting-drops/when-a-physical-keyboard-is-attached` **Do:** When a physical keyboard is attached, check at drop time whether Option is held to make same-container drags copy instead of move. **Why:** Holding Option forces a copy; releasing before the drop makes it a move. · P familiarity · L interaction, platform · S interact · M t/d/-/-
- `drag-and-drop/accepting-drops/provide-feedback-when-dropped-content-needs` **Do:** Show progress or a placeholder when dropped content takes time to transfer. **Why:** People can estimate the wait and know where the content will appear. · P familiarity · L flow, interaction · S interact · M d/d/-/-
- `drag-and-drop/accepting-drops/provide-feedback-when-dropped-content-initiates` **Do:** When content dropped on a control starts a task such as printing, show that it began and report progress. **Why:** People should know the action started and how it is going. · P familiarity · L interaction · S interact · M d/d/-/-
- `drag-and-drop/accepting-drops/apply-appropriate-styling-to-dropped-text` **Do:** Keep dropped text's original styling when source and destination support the same styles; otherwise use the destination's style. **Why:** Matching styles keeps the text consistent with where it lands. · P familiarity · L content · S interact, express · M d/d/-/-
- `drag-and-drop/accepting-drops/after-a-drop-maintain-the-contents` **Do:** After a drop, leave the content selected in the destination and update selection in the source as needed. **Why:** People expect to act on dropped content right away. · P familiarity · L interaction · S interact · M d/d/-/-
### Platform considerations > iOS, iPadOS

- `drag-and-drop/platform-considerations/ios-ipados/let-people-perform-multiple-simultaneous-drag` [iOS, iPadOS] **Do:** On iOS and iPadOS, allow several drag activities at the same time, such as adding items to a drag already in progress. **Why:** People can gather as many items as they can hold and drop them together. · P agency · L interaction, platform · S interact, adapt · M t/-/-/-
### Platform considerations > macOS

- `drag-and-drop/platform-considerations/macos/consider-letting-people-drag-content-from` [macOS] **Do:** On macOS, consider letting people drag content into the Finder, in a format your app can reopen later. **Why:** The exported item can be shared or dragged back into the app. · P familiarity · L interaction, platform · S interact, adapt · M t/d/-/-
- `drag-and-drop/platform-considerations/macos/let-people-drag-selected-content-from` [macOS] **Do:** On macOS, let people drag a background selection out of an inactive window without activating that window first. **Why:** People expect to drag it into the active window without bringing the inactive one forward. · P familiarity, agency · L interaction, platform · S interact, adapt · M t/d/-/-
- `drag-and-drop/platform-considerations/macos/when-possible-let-people-drag-individual` [macOS] **Do:** On macOS, when possible, let people drag an unselected item from an inactive window while keeping its existing background selection. **Why:** Dragging one item shouldn't disturb a selection that is already there. · P familiarity, agency · L interaction, platform · S interact, adapt · M t/d/-/-
- `drag-and-drop/platform-considerations/macos/consider-displaying-a-badge-during-multi` [macOS] **Do:** On macOS, consider a number badge during multi-item drags, updating it if the destination accepts only some items. **Why:** It shows how many items are being dragged or accepted. · P familiarity · L attention, interaction, platform · S interact, adapt · M t/d/-/-
- `drag-and-drop/platform-considerations/macos/consider-changing-the-pointer-appearance-to` [macOS] **Do:** On macOS, consider changing the pointer to signal the result of a drop, such as copy, link, disappearing, or not allowed. **Why:** The pointer tells people what will happen when they drop. · P familiarity · L interaction, platform · S interact, adapt · M t/d/-/-
- `drag-and-drop/platform-considerations/macos/as-much-as-possible-let-people` [macOS] **Do:** On macOS, let people select and start dragging in one continuous motion where possible. **Why:** People like not having to pause between selecting and dragging. · P agency · L interaction, platform · S interact, adapt · M t/d/-/-
### Platform considerations > visionOS

- `drag-and-drop/platform-considerations/visionos/when-possible-launch-your-app-to` [visionOS] **Do:** On visionOS, when possible, open your app to handle content dropped into empty space. **Why:** Dropping content in open space can launch the app that handles it. · P agency · L interaction, platform · S interact, adapt · M -/-/-/-

## Entering data (`entering-data`)

<https://developer.apple.com/design/human-interface-guidelines/entering-data>

### Best practices

- `entering-data/best-practices/get-information-from-the-system-whenever` **Do:** Collect information from the system rather than asking people to type what you can gather automatically. **Why:** Avoids needless effort for people. · P simplicity · L flow, value · S structure, write · M d/d/-/-
- `entering-data/best-practices/be-clear-about-the-data-you` **Do:** Make clear what data a field needs, with placeholder prompts or labels, and prefill sensible defaults. **Why:** Defaults reduce decisions and speed up entry. · P simplicity · L content · S interact, write · M d/d/-/-
- `entering-data/best-practices/use-a-secure-text-entry-field` **Do:** Use a secure field that hides characters as people type when collecting sensitive data. **Why:** Obscured input protects sensitive information. · P responsibility · L trust · S interact, include · M d/d/-/-
- `entering-data/best-practices/never-prepopulate-a-password-field` **Do:** Never prefill a password field; require entry or biometric or keychain sign-in. **Why:** Prefilled passwords undermine account security. · P responsibility · L trust · S interact, include · M d/d/-/-
- `entering-data/best-practices/when-possible-offer-choices-instead-of` **Do:** Offer choices such as pickers or menus instead of free text entry when possible. **Why:** Choosing from a list is easier and faster than typing. · P simplicity · L interaction · S compose, interact · M d/d/-/-
- `entering-data/best-practices/as-much-as-possible-let-people` **Do:** Let people supply data by dragging it in or pasting it wherever practical. **Why:** These actions ease data entry and make the app feel connected to the rest of the system. · P familiarity, agency · L interaction · S interact · M d/d/-/-
- `entering-data/best-practices/dynamically-validate-field-values` **Do:** Validate values as people enter them and flag problems immediately so they can fix them on the spot. **Why:** Going back to correct errors after a long form is frustrating. · P agency · L interaction · S interact · M d/d/-/-
- `entering-data/best-practices/when-data-entry-is-necessary-make` **Do:** Make it plain that required data must be entered before continuing, for example by enabling Next only after the needed fields are filled. **Why:** Gating the button shows people what is needed to proceed. · P simplicity · L flow, interaction · S interact, compose · M d/d/-/-
### Platform considerations > macOS

- `entering-data/platform-considerations/macos/consider-using-an-expansion-tooltip-to` [macOS] **Do:** On macOS, consider an expansion tooltip that reveals the full text of a clipped or truncated field value. **Why:** Small fields can't display everything people entered. · P flexibility · L interaction, platform · S interact, compose · M t/d/-/-

## Feedback (`feedback`)

<https://developer.apple.com/design/human-interface-guidelines/feedback>

### Best practices

- `feedback/best-practices/make-sure-all-feedback-is-accessible` **Do:** Deliver feedback through several channels, such as color, text, sound, and haptics, so it is accessible. **Why:** Multiple channels reach more people, including those who mute the device or look away. · P flexibility · L inclusion, interaction · S interact, express · M d/d/-/-
- `feedback/best-practices/consider-integrating-status-feedback-into-your` **Do:** Consider placing status feedback right next to the items it describes in the interface. **Why:** People get key information without taking action or leaving their context. · P simplicity · L attention, content · S compose, interact · M d/d/t/t
- `feedback/best-practices/use-alerts-to-deliver-critical-and` **Do:** Use alerts only for critical information, ideally something people can act on. **Why:** Alerts interrupt, so interruption must match importance, and overuse weakens them. · P simplicity · L flow, attention · S interact, compose · M d/d/-/-
- `feedback/best-practices/warn-people-when-they-initiate-a` **Do:** Warn people before tasks that could cause unexpected, irreversible data loss, but not when loss is the expected result of the action. **Why:** Unneeded warnings add noise; a warning matters only when the loss would surprise. · P responsibility · L trust, flow · S interact · M d/d/-/-
- `feedback/best-practices/when-it-makes-sense-confirm-that` **Do:** Confirm completion of significant tasks, such as a payment, but keep this for sufficiently important actions. **Why:** People expect success, so they only need to hear about important outcomes. · P familiarity · L interaction · S interact, write · M d/d/-/-
- `feedback/best-practices/show-people-when-a-command-cant` **Do:** When a command can't be performed, tell people and explain why. **Why:** People need to understand the failure, for example identical start and end points for directions. · P familiarity · L content · S interact, write · M d/d/-/-
### Platform considerations > watchOS

- `feedback/platform-considerations/watchos/avoid-displaying-an-indeterminate-progress-indicator` [watchOS] **Do:** On watchOS, don't show an indeterminate loading indicator; tell people they'll be notified when the process finishes. **Why:** An animated indicator suggests they must keep watching the screen. · P simplicity · L flow, interaction · S interact, adapt · M -/-/-/-

## File management (`file-management`)

<https://developer.apple.com/design/human-interface-guidelines/file-management>

### Creating and opening files

- `file-management/creating-and-opening-files/use-app-menus-and-keyboard-shortcuts` **Do:** On iPadOS and macOS, offer New and Open through app menus and keyboard shortcuts. **Why:** People expect to use familiar menu commands to create and open documents. · P familiarity · L interaction, platform · S compose, interact · M t/d/-/-
- `file-management/creating-and-opening-files/if-your-app-requires-a-custom` **Do:** If you need a custom file browser, keep it consistent with the platform's file system structure, even if you start at the most relevant spot. **Why:** People who know Finder and Files already understand the basic layout. · P familiarity · L flow, platform · S structure, interact · M t/d/-/-
### Saving work

- `file-management/saving-work/help-people-be-confident-that-their` **Do:** Preserve people's work automatically, saving periodically and on closing or switching apps, so they don't need to save manually. **Why:** This gives people confidence their work is kept unless they cancel or delete. · P agency · L flow, trust · S interact · M d/d/-/-
- `file-management/saving-work/hide-file-extensions-by-default-but` **Do:** Hide file extensions by default, let people choose to show them, and reflect that choice in every save or open interface. **Why:** Consistency across interfaces keeps the chosen setting respected. · P agency · L content, interaction · S interact, compose · M t/d/-/-
### Quick Look previews

- `file-management/quick-look-previews/use-a-quick-look-viewer-to` **Do:** Add a Quick Look viewer so people can preview files your app can't open without leaving it. **Why:** People who attach or handle unsupported files can still look at them in place. · P agency · L flow, interaction · S interact · M t/d/-/-
- `file-management/quick-look-previews/consider-implementing-a-quick-look-generator` **Do:** Consider a Quick Look generator when your app creates its own file types. **Why:** It lets other apps and system search show previews, helping people find documents. · P familiarity · L flow, value · S define · M t/-/-/-
### Platform considerations > iOS, iPadOS > Document launcher

- `file-management/platform-considerations/ios-ipados/document-launcher/assign-the-title-cards-buttons-to` [iOS, iPadOS] **Do:** On iOS and iPadOS, map the title card buttons to the app's most important functions, with the primary one usually creating a document. **Why:** Focuses the launch surface on the key actions. · P purpose · L value, attention · S compose · M t/d/-/-
- `file-management/platform-considerations/ios-ipados/document-launcher/provide-a-background-thats-clearly-distinct` [iOS, iPadOS] **Do:** On iOS and iPadOS, use a plain background that stands apart from the accessories and title card, avoiding complex images or patterns. **Why:** Busy backgrounds distract from the foreground elements. · P simplicity · L attention · S express · M t/d/-/-
- `file-management/platform-considerations/ios-ipados/document-launcher/be-mindful-of-accessory-placement` [iOS, iPadOS] **Do:** On iOS and iPadOS, place accessories carefully so the app name and buttons stay visible, avoid clutter, and test the overall look. **Why:** Too many accessories crowd the title card. · P craft · L attention · S compose, express · M t/d/-/-
- `file-management/platform-considerations/ios-ipados/document-launcher/use-animation-sparingly` [iOS, iPadOS] **Do:** On iOS and iPadOS, animate accessories sparingly, using gentle repeating motion that subtly enhances content. **Why:** Too much motion can confuse or disorient people. · P simplicity, delight · L attention · S express, interact · M t/d/-/-
### Platform considerations > iOS, iPadOS > File provider app extension

- `file-management/platform-considerations/ios-ipados/file-provider-app-extension/when-someone-uses-your-file-provider` [iOS, iPadOS] **Do:** On iOS and iPadOS, have a file provider extension list only documents suited to the current context, with helpful details like dates and sizes. **Why:** Relevant files only keeps choices focused. · P simplicity · L value, flow · S compose · M t/d/-/-
- `file-management/platform-considerations/ios-ipados/file-provider-app-extension/let-people-select-a-destination-when` [iOS, iPadOS] **Do:** On iOS and iPadOS, let people choose a destination when exporting or moving documents, unless everything lives in one directory. **Why:** Navigation to a specific location gives them control over placement. · P agency · L flow · S structure, interact · M t/d/-/-
- `file-management/platform-considerations/ios-ipados/file-provider-app-extension/avoid-including-a-custom-top-toolbar` [iOS, iPadOS] **Do:** On iOS and iPadOS, don't add your own top toolbar in a file provider extension. **Why:** The modal view already has a toolbar, so a second one confuses and wastes space. · P simplicity · L platform · S compose · M t/-/-/-
### Platform considerations > macOS > Custom file management

- `file-management/platform-considerations/macos/custom-file-management/make-your-custom-file-opening-interface` [macOS] **Do:** On macOS, make a custom file-opening interface convenient, with options like open recent, filtering, and opening several documents at once. **Why:** Extra conveniences help people reach their files faster. · P agency · L interaction, platform · S compose, interact · M t/d/-/-
- `file-management/platform-considerations/macos/custom-file-management/provide-a-save-interface-to-let` [macOS] **Do:** On macOS, provide a save interface that lets people rename a file and change its format or location, defaulting to a logical place. **Why:** This lets people put the document where they want. · P agency · L interaction, platform · S compose, interact · M t/d/-/-
- `file-management/platform-considerations/macos/custom-file-management/consider-extending-the-functionality-of-the` [macOS] **Do:** On macOS, consider adding a custom accessory view with useful options to the Save dialog. **Why:** It places relevant settings right where people save, like including attachments for Mail messages. · P agency · L interaction, platform · S compose, interact · M t/d/-/-
### Platform considerations > macOS > Finder Sync extensions

- `file-management/platform-considerations/macos/finder-sync-extensions/help-people-avoid-losing-work-if` [macOS] **Do:** On macOS, if autosaving is turned off, show unsaved changes and offer a save dialog on close, quit, log out, or restart. **Why:** This prevents people from losing work. · P agency, responsibility · L flow, trust · S interact, adapt · M t/d/-/-
- `file-management/platform-considerations/macos/finder-sync-extensions/when-autosaving-is-off-make-sure` [macOS] **Do:** On macOS, show a dot on the close button and Window menu item only when autosaving is off and changes are unsaved. **Why:** With autosave on, the dot wrongly suggests people must act to avoid losing work. · P familiarity, responsibility · L attention, trust · S interact, adapt · M t/d/-/-

## Going full screen (`going-full-screen`)

<https://developer.apple.com/design/human-interface-guidelines/going-full-screen>

### Best practices

- `going-full-screen/best-practices/support-full-screen-mode-when-it` **Do:** Offer full-screen mode when people benefit from focus or immersion, such as games, media, or in-depth tasks. **Why:** People value full screen to concentrate or immerse themselves. · P agency · L flow, value · S structure, compose · M t/d/-/-
- `going-full-screen/best-practices/if-necessary-adjust-your-layout-in` **Do:** In full-screen mode, adapt the layout, such as rebalancing proportions, but never resize the window through code. **Why:** Extra space should keep essential content prominent while being used well. · P flexibility · L attention · S compose, adapt · M t/d/-/-
- `going-full-screen/best-practices/continue-to-provide-access-to-essential` **Do:** Keep essential controls available, or easy to reveal, in full-screen mode, such as playback controls. **Why:** People should finish tasks without leaving full screen. · P agency · L interaction · S compose, interact · M t/d/-/-
- `going-full-screen/best-practices/except-in-games-let-people-reveal` **Do:** On iPadOS and macOS, let people reveal the Dock in full screen, except in games where accidental reveals can be suppressed. **Why:** People need quick access to other apps and Dock items. · P agency · L flow, platform · S compose, interact · M t/-/-/-
- `going-full-screen/best-practices/after-people-switch-away-from-your` **Do:** After someone returns to a full-screen experience, let them continue from their earlier point, for instance by pausing a game or slideshow while they were away. **Why:** Pausing prevents them from missing anything while away. · P agency · L flow · S interact · M t/d/-/-
- `going-full-screen/best-practices/let-people-choose-when-to-exit` **Do:** Let people decide when to leave full screen, rather than ending it automatically. **Why:** People don't expect it to end by itself after switching away or finishing an absorbing activity. · P agency · L flow, interaction · S interact · M t/d/-/-
- `going-full-screen/best-practices/prioritize-content-by-temporarily-hiding-toolbars` **Do:** Temporarily hide toolbars and navigation when content is the focus, and let people bring them back with a familiar gesture or action. **Why:** Hiding chrome creates a distraction-free environment. · P simplicity · L attention, interaction · S compose · M t/d/d/-
### Platform considerations > iOS, iPadOS

- `going-full-screen/platform-considerations/ios-ipados/consider-deferring-system-gestures-to-prevent` [iOS, iPadOS] **Do:** On iOS and iPadOS, consider deferring system gestures in full-screen apps to avoid accidental exits, keeping the default Home indicator behavior when possible. **Why:** The default behavior is familiar and what people expect. · P familiarity · L interaction, platform · S interact, adapt · M t/-/-/-
### Platform considerations > macOS

- `going-full-screen/platform-considerations/macos/use-the-system-provided-full-screen` [macOS] **Do:** On macOS, use the system's full-screen support. **Why:** It makes the window work in every context, including areas like a camera housing. · P familiarity, flexibility · L platform · S adapt · M t/d/-/-
- `going-full-screen/platform-considerations/macos/in-a-game-dont-change-the` [macOS] **Do:** On macOS games, don't change the display mode when players enter full screen. **Why:** People expect to control their display mode, and changing it doesn't improve performance. · P agency · L interaction, platform · S interact, adapt · M -/-/-/-
- `going-full-screen/platform-considerations/macos/always-let-people-choose-when-to` [macOS] **Do:** On macOS, let people choose when to enter full screen using the standard button, menu item, or shortcut, and avoid a custom window-mode menu. **Why:** This keeps entry under people's control and in the familiar standard places. · P agency, familiarity · L interaction, platform · S interact, adapt · M t/d/-/-

## Launching (`launching`)

<https://developer.apple.com/design/human-interface-guidelines/launching>

### Best practices

- `launching/best-practices/launch-instantly` **Do:** Make the app ready to use almost immediately on launch. **Why:** People want to interact right away and don't like waiting more than a couple of seconds. · P craft · L flow, interaction · S interact, express · M d/d/-/-
- `launching/best-practices/if-the-platform-requires-it-provide` **Do:** Provide a launch screen where the platform requires it, such as iOS, iPadOS, and tvOS. **Why:** The system shows it instantly, giving the impression of a fast, responsive experience. · P familiarity · L flow, platform · S interact, adapt · M t/-/-/-
- `launching/best-practices/if-you-need-a-splash-screen` **Do:** If you use a splash screen, show it at the start of onboarding, or right after launch if you have no onboarding. **Why:** It is a graphic for branding and necessary information. · P delight · L flow · S structure, express · M d/d/t/d
- `launching/best-practices/restore-the-previous-state-when-your` **Do:** Restore the earlier state on relaunch, including details like scroll position and window placement. **Why:** People shouldn't have to retrace steps to get back to where they were. · P agency · L flow · S structure, interact · M d/d/-/-
### Launch screens

- `launching/launch-screens/downplay-the-launch-experience` **Do:** Keep the launch screen understated; it is not onboarding, a splash screen, or a place for artistic expression. **Why:** Its only job is to make the app feel quick and ready. · P simplicity · L flow, attention · S interact, express · M t/-/-/-
- `launching/launch-screens/design-a-launch-screen-thats-nearly` **Do:** Make the launch screen nearly identical to the first screen, or a plain solid color if that is what appears first. **Why:** Mismatched elements cause an unpleasant flash between the two screens. · P craft, familiarity · L attention · S compose, express · M t/-/-/-
- `launching/launch-screens/avoid-including-text-on-your-launch` **Do:** Leave text off the launch screen even if the first screen has text. **Why:** Launch screen content is fixed, so text there won't be localized. · P flexibility · L inclusion, interaction · S compose, express · M t/-/-/-
- `launching/launch-screens/dont-advertise` **Do:** Don't advertise on the launch screen; skip logos and branding unless they are a fixed part of the first screen. **Why:** The launch screen is not a branding opportunity. · P responsibility, simplicity · L attention, trust · S compose, express · M t/-/-/-
### Platform considerations > iOS, iPadOS

- `launching/platform-considerations/ios-ipados/launch-in-the-appropriate-orientation` [iOS, iPadOS] **Do:** On iOS and iPadOS, launch in the device's current orientation if both are supported; otherwise launch in the one supported and ensure landscape-only interfaces respond correctly. **Why:** Matches how the device is held or the only orientation available. · P flexibility, familiarity · L interaction, platform · S interact, adapt · M t/-/-/-
### Platform considerations > tvOS

- `launching/platform-considerations/tvos/in-a-live-viewing-app-consider` [tvOS] **Do:** On tvOS live-viewing apps, consider starting playback automatically after a few seconds of inactivity. **Why:** People come to watch TV, so playing live content soon gets them to it. · P agency · L flow, platform · S interact · M -/-/-/-
### Platform considerations > visionOS

- `launching/platform-considerations/visionos/consider-launching-in-the-shared-space` [visionOS] **Do:** On visionOS, consider opening in the Shared Space first even for a fully immersive app, offering a control to enter the immersive experience. **Why:** A window gives context and loading time, and people like choosing when to go fully immersive. · P agency, flexibility · L flow, platform · S structure, adapt · M -/-/-/-

## Live-viewing apps (`live-viewing-apps`)

<https://developer.apple.com/design/human-interface-guidelines/live-viewing-apps>

### Best practices

- `live-viewing-apps/best-practices/feature-live-content-prominently-and-make` **Do:** Put live content up front and easy to reach, such as in the first tab, so playback takes at most one tap. **Why:** People come to watch, so the time to start playing should be short. · P purpose · L value, flow · S structure, compose · M t/d/-/-
- `live-viewing-apps/best-practices/let-people-tap-once-or-not` **Do:** Let people start playback with one tap or none, for example a Watch Now button on featured live content. **Why:** This gets viewers into full-screen watching immediately. · P agency · L flow, interaction · S interact · M t/d/-/-
- `live-viewing-apps/best-practices/make-sure-live-content-looks-live` **Do:** Make live content look live and distinct from on-demand content, for example by labeling it. **Why:** People need to tell live content apart from on-demand video. · P familiarity · L attention, content · S express · M t/d/-/-
- `live-viewing-apps/best-practices/consider-indicating-the-progress-of-currently` **Do:** Consider showing how far along in-progress live content is, such as with a progress bar. **Why:** People like knowing where they'll land when joining. · P familiarity · L attention · S compose, interact · M t/d/-/-
- `live-viewing-apps/best-practices/give-people-additional-actions-and-viewing` **Do:** Keep playback as the primary action and offer extra actions like record or restart, always in the same order. **Why:** Consistent order of actions lets people find them predictably. · P familiarity, simplicity · L flow, interaction · S compose, interact · M t/d/-/-
- `live-viewing-apps/best-practices/consider-using-a-content-footer-for` **Do:** Consider a content footer for browsing channels during playback, with a subtle treatment that keeps text legible. **Why:** It lets people browse without leaving live playback. · P simplicity · L attention, flow · S compose, structure · M t/d/-/-
- `live-viewing-apps/best-practices/provide-instant-visual-feedback-when-people` **Do:** Give immediate visual feedback when the channel changes. **Why:** It confirms arrival at the chosen channel and gives streaming content time to load. · P familiarity · L interaction · S interact · M t/d/-/-
- `live-viewing-apps/best-practices/match-audio-to-the-current-context` **Do:** Keep audio matched to the live context: it continues while browsing, but stops once people leave the live tab. **Why:** Leaving the live tab means leaving the live-viewing context. · P familiarity · L flow, interaction · S interact · M t/d/-/-
### EPG experience

- `live-viewing-apps/epg-experience/prominently-display-current-information-and-make` **Do:** When the EPG opens, make the current program, channel, and time stand out so people can jump back to playback. **Why:** They can return to the current channel instantly. · P simplicity · L attention, flow · S compose · M t/d/-/-
- `live-viewing-apps/epg-experience/make-browsing-the-epg-effortless` **Do:** Make the EPG easy to page, scroll, or jump through, and consider a My Channels or Favorites group. **Why:** An EPG holds a lot of information, so people need quick routes to what they watch most. · P simplicity · L flow, interaction · S compose, interact · M t/d/-/-
- `live-viewing-apps/epg-experience/group-content-into-familiar-categories-to` **Do:** Organize content into familiar categories, and mirror those categories in the content footer. **Why:** Recognizable groupings make content easier to find. · P familiarity · L flow, content · S structure, compose · M t/d/-/-
- `live-viewing-apps/epg-experience/let-people-browse-the-epg-without` **Do:** Let people browse the EPG while their current content keeps playing, for example in picture-in-picture or the background. **Why:** They don't have to give up what they're watching. · P agency · L flow · S compose, interact · M t/d/-/-
### Cloud DVR

- `live-viewing-apps/cloud-dvr/let-people-start-and-stop-recording` **Do:** Put record start and stop controls in the info panel so people can use them directly. **Why:** While watching live, people want to begin recording right away. · P agency · L interaction · S interact · M t/d/-/-
- `live-viewing-apps/cloud-dvr/let-people-record-a-future-program` **Do:** Let people record a future program from a details view, with a choice of that program only or all future episodes. **Why:** Details help them decide, and the choice gives control over scope. · P agency · L flow, interaction · S compose, interact · M t/d/-/-
- `live-viewing-apps/cloud-dvr/help-people-adapt-the-recording-experience` **Do:** Let people define exactly what to record, like only the current episode, only new ones, or games for certain teams. **Why:** People have different recording needs. · P flexibility, agency · L interaction · S interact · M t/d/-/-
- `live-viewing-apps/cloud-dvr/allow-playback-and-other-content-specific` **Do:** In the cloud DVR area, let people play or delete content from its details view and adjust recording settings if relevant. **Why:** Content-specific actions should be available where the content is shown. · P agency · L interaction · S compose, interact · M t/d/-/-
- `live-viewing-apps/cloud-dvr/consider-offering-a-control-that-lets` **Do:** Consider a control for managing cloud DVR settings, such as deleting watched or old recordings and automatic storage management. **Why:** It helps people avoid running out of space. · P agency · L interaction · S compose, interact · M t/d/-/-

## Loading (`loading`)

<https://developer.apple.com/design/human-interface-guidelines/loading>

### Best practices

- `loading/best-practices/show-something-as-soon-as-possible` **Do:** Show something right away while loading, such as placeholders, then replace them as content arrives. **Why:** A blank wait can look like an app problem. · P simplicity · L flow · S interact · M d/d/t/-
- `loading/best-practices/let-people-do-other-things-in` **Do:** Let people do other things while content loads, by loading in the background. **Why:** They keep access to other actions instead of just waiting. · P agency · L flow · S interact · M d/d/-/-
- `loading/best-practices/if-loading-takes-an-unavoidably-long` **Do:** If a long load is unavoidable, show something interesting like tips or hints, timed to the remaining wait. **Why:** Content that is too short or repeated feels poor; accurate timing avoids both. · P delight · L flow · S interact · M d/d/-/-
- `loading/best-practices/improve-installation-and-launch-time-by` **Do:** Download large assets in the background at nondisruptive times, such as right after installation or during updates, to speed up install and launch. **Why:** This improves installation and launch time. · P craft · L flow · S interact · M -/-/-/-
### Showing progress

- `loading/showing-progress/clearly-communicate-that-content-is-loading` **Do:** Show that loading is happening and how long it may take; use a determinate indicator when the duration is known. **Why:** Content that takes more than a moment needs visible, honest progress. · P familiarity · L flow · S interact · M d/d/-/-
- `loading/showing-progress/for-games-consider-creating-a-custom` **Do:** For games, consider a custom loading view with animations and elements that fit the game's style. **Why:** Standard progress indicators can feel out of place in a game. · P delight · L attention · S express · M t/d/-/-
### Platform considerations > watchOS

- `loading/platform-considerations/watchos/as-much-as-possible-avoid-showing` [watchOS] **Do:** On watchOS, avoid loading indicators where possible, but show one rather than a blank screen if a load takes a second or two. **Why:** People expect quick interactions with Apple Watch. · P simplicity · L flow, interaction · S interact, adapt · M -/-/-/-

## Managing accounts (`managing-accounts`)

<https://developer.apple.com/design/human-interface-guidelines/managing-accounts>

### Best practices

- `managing-accounts/best-practices/explain-the-benefits-of-creating-an` **Do:** If an account is required, explain its benefits and how to sign up in a short, friendly message in the sign-in view. **Why:** People should understand why an account is needed. · P responsibility · L trust, content · S interact, write · M d/d/-/-
- `managing-accounts/best-practices/delay-sign-in-for-as-long` **Do:** Postpone sign-in as long as possible, letting people explore the app's value first. **Why:** People often leave when forced to sign in before doing anything useful. · P agency · L flow, value · S structure, interact · M d/d/-/-
- `managing-accounts/best-practices/if-you-dont-use-sign-in` **Do:** On iOS, iPadOS, macOS, and visionOS, if you don't use Sign in with Apple, prefer passkeys for accounts. **Why:** Passkeys simplify sign-up and sign-in by removing passwords. · P simplicity · L trust, platform · S structure, interact · M t/d/-/-
- `managing-accounts/best-practices/always-identify-the-authentication-method-you` **Do:** Name the actual authentication method on sign-in buttons, such as "Sign In with Face ID", not a generic "Sign In". **Why:** Specific labels tell people exactly how they will authenticate. · P familiarity · L content · S write · M d/d/-/-
- `managing-accounts/best-practices/refer-only-to-authentication-methods-that` **Do:** Mention only authentication methods the current device supports, checking capabilities and using matching terms. **Why:** Referring to something unavailable misleads people. · P familiarity, flexibility · L content, trust · S write · M t/d/-/-
- `managing-accounts/best-practices/in-general-avoid-offering-an-app` **Do:** Generally don't add an in-app setting to opt in to biometric authentication. **Why:** People enable it at the system level, so an app setting is redundant and confusing. · P simplicity · L interaction, trust · S interact · M t/d/-/-
- `managing-accounts/best-practices/avoid-using-the-term-passcode-to` **Do:** Don't use the word passcode for account authentication in your interface. **Why:** People may think you're asking for their device passcode. · P familiarity · L content, trust · S write · M d/d/-/-
### Deleting accounts

- `managing-accounts/deleting-accounts/provide-a-clear-way-to-initiate` **Do:** Provide a clear way in the app to start account deletion, or a prominent direct link to the website that does it. **Why:** People must be able to find deletion easily, not buried in policy pages. · P agency, responsibility · L trust, flow · S structure, interact · M d/d/-/-
- `managing-accounts/deleting-accounts/provide-a-consistent-account-deletion-experience` **Do:** Make account deletion equally simple in the app and on the website. **Why:** One version shouldn't be longer or more complicated than the other. · P familiarity · L flow, interaction · S structure, interact · M d/d/-/-
- `managing-accounts/deleting-accounts/consider-letting-people-schedule-account-deletion` **Do:** Consider letting people schedule account deletion for later, and also offer immediate deletion. **Why:** People may want to use remaining services or wait for subscription renewal first. · P agency · L flow, interaction · S interact · M d/d/-/-
- `managing-accounts/deleting-accounts/tell-people-when-account-deletion-will` **Do:** Tell people when account deletion will finish and notify them when it has. **Why:** Deletion can take a while, so they need status updates to know what to expect. · P responsibility · L trust, flow · S interact, write · M d/d/-/-
- `managing-accounts/deleting-accounts/if-you-support-in-app-purchases` **Do:** With in-app purchases, explain how billing and cancellation work after an account is deleted. **Why:** Subscriptions may keep billing after deletion unless cancelled, which people need to understand. · P responsibility · L trust, content · S interact, write · M d/d/-/-
### TV provider accounts

- `managing-accounts/tv-provider-accounts/avoid-displaying-a-sign-out-option` **Do:** Skip the in-app sign-out option when sign-in is handled by the system; if one must exist, send people to Settings > TV Provider. **Why:** The system-level sign-in is managed there. · P familiarity · L interaction, platform · S structure, interact · M -/-/-/-
- `managing-accounts/tv-provider-accounts/never-instruct-people-to-sign-out` **Do:** Never tell people to sign out through privacy controls. **Why:** Those settings manage which apps can reach a TV provider account, not sign-out. · P responsibility · L content, trust · S write · M -/-/-/-
### Platform considerations > tvOS

- `managing-accounts/platform-considerations/tvos/prefer-letting-people-use-another-device` [tvOS] **Do:** On tvOS, prefer letting people sign up or authenticate using another device. **Why:** With associated domains configured, Apple TV can work with other devices to suggest credentials safely. · P simplicity · L trust, platform · S structure, interact · M t/-/-/-
- `managing-accounts/platform-considerations/tvos/when-people-are-signed-in-to` [tvOS] **Do:** On tvOS, with a shared account, don't make people pick a profile each time they become the current user. **Why:** The app can use the current user's profile automatically while keeping data separate. · P simplicity · L flow, platform · S structure, interact · M -/-/-/-
- `managing-accounts/platform-considerations/tvos/minimize-data-entry` [tvOS] **Do:** On tvOS, minimize data entry: for larger input, send people to a website on another device, and use the email keyboard screen for emails. **Why:** Typing on this platform is burdensome; the email screen lists recent addresses. · P simplicity · L interaction, platform · S interact, adapt · M t/-/-/-

## Managing notifications (`managing-notifications`)

<https://developer.apple.com/design/human-interface-guidelines/managing-notifications>

### Best practices

- `managing-notifications/best-practices/build-trust-by-accurately-representing-the` **Do:** Set each notification's interruption level honestly, matching its real urgency. **Why:** People can adjust or disable notifications, so overstating urgency erodes trust. · P responsibility · L trust · S interact, write · M d/d/-/-
- `managing-notifications/best-practices/use-the-time-sensitive-interruption-level` **Do:** Reserve the Time Sensitive level for notifications about events happening now or within an hour. **Why:** This helps people see why such notifications should break through a Focus or schedule. · P responsibility · L trust · S interact, write · M d/d/-/-
### Sending marketing notifications

- `managing-notifications/sending-marketing-notifications/never-use-the-time-sensitive-interruption` **Do:** Never use Time Sensitive level for marketing notifications. **Why:** Even if people agreed to marketing messages, those must not break through Focus or scheduled delivery. · P responsibility · L trust · S interact, include · M d/d/-/-
- `managing-notifications/sending-marketing-notifications/get-peoples-permission-if-you-want` **Do:** Get explicit permission before sending promotional notifications, explaining what you'll send with a clear opt-in or opt-out. **Why:** Explicit consent is required for marketing messages. · P responsibility · L trust · S interact, include · M d/d/-/-
- `managing-notifications/sending-marketing-notifications/make-sure-people-can-manage-their` **Do:** Provide an in-app settings screen where people can change their notification choices. **Why:** People need to be able to revise their choice after granting permission. · P agency, responsibility · L trust, interaction · S interact, include · M d/d/-/-

## Modality (`modality`)

<https://developer.apple.com/design/human-interface-guidelines/modality>

### Best practices

- `modality/best-practices/present-content-modally-only-when-theres` **Do:** Use a modal presentation only when it clearly helps people concentrate or decide something that affects their content or device. **Why:** Modality pulls people out of their current context and demands an action to leave, so it must earn that cost. · P simplicity, agency · L flow, attention · S structure · M d/d/-/-
- `modality/best-practices/aim-to-keep-modal-tasks-simple` **Do:** Keep tasks inside a modal view uncomplicated, brief, and efficient. **Why:** Overly complex modal tasks make people lose track of the task they set aside, especially when context is hidden. · P simplicity, agency · L flow · S interact · M d/d/-/-
- `modality/best-practices/take-care-to-avoid-creating-a` **Do:** Don't let a modal task grow into a mini app. If it needs subviews, offer one linear path and avoid buttons that look like the dismiss button. **Why:** Layered views inside a modal make people forget how to go back, and lookalike buttons confuse dismissal. · P simplicity, agency · L flow, interaction · S structure, interact · M d/d/-/-
- `modality/best-practices/consider-using-a-full-screen-modal` **Do:** Consider a full-screen modal for immersive content or involved, multistep tasks such as editing media or marking up a document. **Why:** Filling the display cuts distractions, helping with videos, photos, camera views and longer tasks. · P simplicity, purpose · L attention, flow · S compose · M d/d/-/-
- `modality/best-practices/always-give-people-an-obvious-way` **Do:** Always provide a clear way to close a modal view, following the dismissal convention of each platform people already know. **Why:** People expect a familiar dismiss spot per platform, such as a toolbar button or a swipe down. · P familiarity, agency · L interaction, flow · S interact · M d/d/-/-
- `modality/best-practices/when-necessary-help-people-avoid-data` **Do:** If closing a modal view could discard user-created content, explain the risk first and offer ways to resolve it, such as saving. **Why:** Dismissing by gesture or button could silently lose work people made. · P agency, responsibility · L flow, trust · S interact · M d/d/-/-
- `modality/best-practices/make-it-easy-to-identify-a` **Do:** Give a modal view a title or short guidance text that names its task. **Why:** People leave their previous context and may not return soon, so naming the task helps them keep their place. · P simplicity, agency · L content, flow · S write, structure · M d/d/-/-
- `modality/best-practices/let-people-dismiss-a-modal-view` **Do:** Have people close one modal view before showing another; avoid stacking modal views. **Why:** Several visible modals create clutter, look disorganized, and raise the mental load of remembering prior context. · P simplicity, agency · L attention, flow · S structure, compose · M d/d/-/-

## Multitasking (`multitasking`)

<https://developer.apple.com/design/human-interface-guidelines/multitasking>

### Best practices

- `multitasking/best-practices/pause-activities-that-require-peoples-attention` **Do:** Pause attention-demanding activity such as a game or media viewing when people switch away, and let them resume as if they never left. **Why:** People shouldn't miss anything while they are in another app. · P agency, familiarity · L flow · S interact · M d/-/-/-
- `multitasking/best-practices/respond-smoothly-to-audio-interruptions` **Do:** Handle audio interruptions gracefully: pause indefinitely for primary audio like music or podcasts, and lower or pause briefly for short interruptions. **Why:** People expect the app to react in these ways when other audio takes over. · P familiarity, agency · L flow, interaction · S interact · M d/-/-/-
- `multitasking/best-practices/finish-user-initiated-tasks-in-the` **Do:** Let tasks people started, like downloads or video processing, keep running in the background and finish before the app suspends. **Why:** People expect started tasks to complete even after they switch away. · P agency, familiarity · L flow · S interact · M d/t/-/-
- `multitasking/best-practices/use-notifications-sparingly` **Do:** Send notifications sparingly: notify on completion of important or time-sensitive tasks, but skip routine or secondary ones. **Why:** A completion alert helps people return for the next step, but they don't need instant news of minor tasks. · P responsibility, simplicity · L trust, flow · S interact · M d/t/-/-
### Platform considerations > visionOS

- `multitasking/platform-considerations/visionos/avoid-interfering-with-the-system-provided` [visionOS] **Do:** On visionOS, leave window edges visually unchanged so the system's feathered mask on windows people look away from stays visible. **Why:** Altering edges would interfere with the system feedback that marks a window's changed state. · P familiarity, craft · L platform, attention · S express · M -/-/-/-
- `multitasking/platform-considerations/visionos/dont-pause-a-windows-video-playback` [visionOS] **Do:** On visionOS, keep a window's video playing when people look elsewhere. **Why:** People expect playback started in one window to continue while they work in another, as on macOS. · P familiarity, agency · L platform, interaction · S interact · M -/-/-/-
- `multitasking/platform-considerations/visionos/be-prepared-for-situations-where-your` [visionOS] **Do:** On visionOS, expect your audio to duck when people look to another app and yours isn't the Now Playing app. **Why:** The system lowers audio for apps that aren't Now Playing once attention moves away. · P flexibility, familiarity · L platform · S interact · M -/-/-/-

## Offering help (`offering-help`)

<https://developer.apple.com/design/human-interface-guidelines/offering-help>

### Best practices

- `offering-help/best-practices/let-your-apps-tasks-inform-the` **Do:** Match help to the kind of task: inline guidance for one or two steps, tutorials for complex ones, tied to the current action and easy to skip. **Why:** Help is most useful when it fits what people are doing right now and doesn't get in their way. · P purpose, simplicity · L flow, content · S define, structure · M d/t/-/-
- `offering-help/best-practices/use-relevant-and-consistent-language-and` **Do:** Keep help wording and images fitting the current context and platform, for example no game-controller images for Siri Remote users or "click" on iPhone. **Why:** Mismatched terms or visuals make guidance inappropriate for the device people are using. · P familiarity, flexibility · L content, inclusion · S write · M d/d/t/t
- `offering-help/best-practices/make-sure-all-help-content-is` **Do:** Make sure every piece of help content follows inclusion guidance. · P flexibility · L inclusion, content · S write, include · M d/d/d/d
- `offering-help/best-practices/avoid-bloating-your-help-content-by` **Do:** Skip explaining standard components; describe what a control does in your app instead, and use animation or graphics to orient people to unusual controls. **Why:** Lengthy explanation of familiar patterns bloats help, while unfamiliar input needs a fast orientation. · P simplicity, familiarity · L content, attention · S write · M d/d/t/t
### Creating tips

- `offering-help/creating-tips/use-the-most-appropriate-tip-type` **Do:** Pick a popover tip to keep content flow, or an inline tip to keep nearby info visible; use annotation style for a specific element, hint style otherwise. **Why:** Each tip type trades off content flow against visibility of surrounding information. · P familiarity, simplicity · L attention, flow · S compose · M d/t/-/-
- `offering-help/creating-tips/use-tips-for-simple-features` **Do:** Reserve tips for features that are easy to describe and take only a few steps. **Why:** A feature needing many actions is too complicated for a tip. · P simplicity, purpose · L content, value · S define, write · M d/d/-/-
- `offering-help/creating-tips/make-tips-short-actionable-and-engaging` **Do:** Write tips as one or two direct, action-oriented sentences about what a feature does and how to use it, without promotional or off-topic content. **Why:** A tip aims to encourage trying a feature, and unrelated promotion works against that. · P simplicity, delight · L content · S write · M d/d/d/t
- `offering-help/creating-tips/define-rules-to-help-ensure-your` **Do:** Control when tips appear with eligibility rules, show one only to people who might benefit, and space multiple tips at a reasonable frequency. **Why:** Not every tip suits everyone; people who already used a feature won't appreciate being told about it. · P purpose, responsibility · L trust, flow · S interact · M d/t/-/-
- `offering-help/creating-tips/if-theres-an-image-or-symbol` **Do:** Show the symbol or image people link with the feature in a tip, preferably filled, and don't repeat an image the tip already points to. **Why:** A familiar symbol signals what the tip is about, such as a star for favorites. · P familiarity, craft · L attention, content · S express · M d/t/-/t
- `offering-help/creating-tips/use-buttons-to-direct-people-to` **Do:** Add a button to a tip that jumps to relevant settings or further resources like a setup flow. **Why:** It takes people straight to adjustments or extra information they may want. · P agency, simplicity · L interaction, flow · S interact, compose · M d/d/-/-
### Platform considerations > macOS, visionOS

- `offering-help/platform-considerations/macos-visionos/describe-only-the-control-that-people` [macOS, visionOS] **Do:** In a tooltip, describe only the control the person asked about, not neighboring controls or broader tasks. **Why:** People checking one control want help with that control only. · P simplicity, purpose · L content · S write · M t/d/-/-
- `offering-help/platform-considerations/macos-visionos/explain-the-action-or-task-the` [macOS, visionOS] **Do:** Make a tooltip state the action or task the control triggers, often starting with a verb. **Why:** Describing the outcome tells people what the control does. · P simplicity, familiarity · L content · S write · M t/d/-/-
- `offering-help/platform-considerations/macos-visionos/in-general-avoid-repeating-a-controls` [macOS, visionOS] **Do:** Generally don't restate a control's own name inside its tooltip. **Why:** Repeating the name wastes space and seldom adds meaning. · P simplicity · L content · S write · M t/d/-/-
- `offering-help/platform-considerations/macos-visionos/be-brief` [macOS, visionOS] **Do:** Keep tooltips very short, within roughly 60 to 75 characters, using fragments if useful; if long text is needed, simplify the interface. **Why:** Short text is direct, and localization can change text length. · P simplicity, flexibility · L content, inclusion · S write · M t/d/-/-
- `offering-help/platform-considerations/macos-visionos/use-sentence-case` [macOS, visionOS] **Do:** Write tooltips in sentence case, and drop final punctuation on full sentences unless your app's style needs it. **Why:** Sentence case feels casual and approachable. · P delight, familiarity · L content · S write · M t/d/-/-
- `offering-help/platform-considerations/macos-visionos/consider-offering-context-sensitive-tooltips` [macOS, visionOS] **Do:** Consider tooltip text that changes with a control's state. **Why:** Different states may need different descriptions. · P purpose, flexibility · L content, interaction · S write, interact · M t/d/-/-

## Onboarding (`onboarding`)

<https://developer.apple.com/design/human-interface-guidelines/onboarding>

### Best practices

- `onboarding/best-practices/teach-through-interactivity` **Do:** During onboarding, let people try the task safely themselves instead of only showing instructions. **Why:** People grasp and remember more when they actually perform what they are learning. · P agency · L flow, interaction · S structure, interact · M d/d/-/-
- `onboarding/best-practices/consider-providing-a-collection-of-context` **Do:** Prefer several context-specific tips over a single onboarding flow, placing instructions near the interface area they refer to. **Why:** Contextual tips teach while people work and let them focus on one action at a time. · P purpose, simplicity · L flow, content · S structure, write · M d/d/-/-
- `onboarding/best-practices/if-you-need-to-present-a` **Do:** If onboarding must come first, make it short and enjoyable, without asking people to memorize much. **Why:** Quick, entertaining onboarding gets completed, while too much teaching overwhelms and is forgotten. · P simplicity, delight · L flow, content · S structure, write · M d/d/t/t
- `onboarding/best-practices/if-it-makes-sense-to-offer` **Do:** Make a separate tutorial skippable; don't show it again after a skip, but keep it findable in help, account, or settings. **Why:** Letting people skip respects their choice, and they may want it later. · P agency · L flow · S structure · M d/d/-/-
- `onboarding/best-practices/keep-onboarding-content-focused-on-the` **Do:** Keep onboarding about your own app or game, not about how to use the system or device. **Why:** People come to learn about your experience, not the device. · P purpose, simplicity · L value, content · S define, write · M d/d/d/t
### Additional content

- `onboarding/additional-content/briefly-display-a-splash-screen-if` **Do:** If a splash screen is needed, make it a beautiful, concise graphic shown just long enough to take in at a glance. **Why:** A longer display would feel like it delays people. · P simplicity, delight · L flow, attention · S express · M d/d/t/-
- `onboarding/additional-content/dont-let-large-downloads-hinder-onboarding` **Do:** Bundle enough content with the app so onboarding and first use don't wait on large downloads. **Why:** People want to start using the app right after first launch. · P agency, craft · L flow · S structure, interact · M d/t/-/-
- `onboarding/additional-content/avoid-displaying-licensing-details-within-your` **Do:** Leave licensing and legal agreements out of onboarding, since the App Store shows them; if you must include them, blend them in without disruption. **Why:** They can be read before downloading, and onboarding shouldn't be disrupted. · P simplicity, responsibility · L flow, trust · S structure · M d/t/-/-
### Additional requests

- `onboarding/additional-requests/postpone-nonessential-setup-flows-or-customization` **Do:** Delay nonessential setup or customization and supply sensible defaults so people can start using the app immediately. **Why:** Defaults remove the need for extra configuration before use. · P agency, simplicity · L flow · S structure · M d/d/-/-
- `onboarding/additional-requests/if-your-app-or-game-needs` **Do:** If the app needs private data to work at all, consider asking during onboarding with the reason and benefits explained; otherwise ask when the feature is first used. **Why:** Onboarding gives room to show why permission is needed and what people gain. · P responsibility · L trust, flow · S include, interact · M d/d/-/-
- `onboarding/additional-requests/prefer-letting-people-experience-your-app` **Do:** Let people experience the app before asking for ratings or purchases. **Why:** People respond more positively after they become engaged. · P agency, responsibility · L trust, flow · S interact, structure · M d/d/-/-

## Playing audio (`playing-audio`)

<https://developer.apple.com/design/human-interface-guidelines/playing-audio>

### Overview

- `playing-audio/silence` **Term: Silence.** In silent mode, play only audio people explicitly start, such as media, alarms, or messaging audio, and mute nonessential sounds like effects and keyboard clicks.
- `playing-audio/volume` **Term: Volume.** Make system volume settings govern all your app's sound, including effects; only iPhone ringer volume is adjusted separately in Settings.
- `playing-audio/headphones` **Term: Headphones.** Reroute sound automatically when headphones connect and pause playback immediately when they disconnect.
### Best practices

- `playing-audio/best-practices/adjust-levels-automatically-when-necessary-dont` **Do:** Adjust only relative levels within your own mix; never alter overall volume. **Why:** The system volume always determines final output. · P familiarity, craft · L interaction · S interact · M t/-/-/-
- `playing-audio/best-practices/permit-rerouting-of-audio-when-possible` **Do:** Support choosing another audio output device unless there's a strong reason not to. **Why:** People often want sound on other speakers, such as a stereo, car radio, or Apple TV. · P agency, flexibility · L interaction · S interact · M d/t/-/-
- `playing-audio/best-practices/use-the-system-provided-volume-view` **Do:** Use the system volume view for audio adjustment; you may restyle its slider. **Why:** It already includes a volume slider and an output rerouting control. · P familiarity, craft · L interaction · S interact, compose · M t/-/-/-
- `playing-audio/best-practices/choose-an-audio-category-that-fits` **Do:** Choose the audio category that matches how your app uses sound, so mixing, background play and silent-switch behavior meet expectations, e.g. not stopping other apps' music needlessly. **Why:** The category determines these behaviors, and fitting expectations avoids disrupting listeners. · P familiarity, flexibility · L interaction, platform · S interact · M t/-/-/-
- `playing-audio/best-practices/respond-to-audio-controls-only-when` **Do:** Respond to outside audio controls only when sensible: while playing audio, in an audio context, or connected via Bluetooth or AirPlay; otherwise don't stop current audio. **Why:** People can control audio from Control Center or headphones whether the app is foreground or background. · P agency, familiarity · L interaction, flow · S interact · M d/t/-/-
- `playing-audio/best-practices/avoid-repurposing-audio-controls` **Do:** Don't change what a standard audio control means; if you don't support a control, ignore it. **Why:** People expect audio controls to behave the same in every app. · P familiarity · L interaction · S interact · M d/t/-/-
- `playing-audio/best-practices/consider-creating-custom-audio-player-controls` **Do:** Build custom audio player controls only for commands the system lacks, such as custom skip steps or related content like a sports score. **Why:** The system controls are the default, so custom ones should add something missing. · P purpose, familiarity · L interaction, value · S interact · M d/t/-/-
- `playing-audio/best-practices/let-other-apps-know-when-your` **Do:** When your short audio interrupts other apps, signal when you finish so they can resume. **Why:** Other apps need to know when they may continue. · P responsibility, agency · L trust, flow · S interact · M t/-/-/-
### Handling interruptions

- `playing-audio/handling-interruptions/determine-how-to-respond-to-audio` **Do:** Decide how your app handles audio-session interruptions, for example blocking call interruption during recording unless accepted, or ending a VoIP call when the iPad Smart Folio closes. **Why:** Some tasks shouldn't be cut off, and some hardware events should end an activity. · P agency, flexibility · L flow, interaction · S interact · M t/-/-/-
- `playing-audio/handling-interruptions/when-an-interruption-ends-determine-whether` **Do:** After an interruption ends, decide on automatic resume by interruption type (resumable, like a call, or not, like a new playlist) and by your app's type. **Why:** Resuming appropriately depends on whether the interruption can be resumed and what the app does. · P agency, familiarity · L flow · S interact · M t/-/-/-
### Platform considerations > iOS, iPadOS

- `playing-audio/platform-considerations/ios-ipados/use-the-systems-sound-services-to` [iOS, iPadOS] **Do:** On iOS and iPadOS, play short sounds and vibrations through the system's sound services. · P familiarity, craft · L platform, interaction · S interact · M t/-/-/-
### Platform considerations > visionOS

- `playing-audio/platform-considerations/visionos/prefer-playing-sound` [visionOS] **Do:** On visionOS, include sound, especially in immersive moments, and look for meaningful sounds that help navigation and convey space. **Why:** Silent apps can feel lifeless or broken when people wear the device with sound audible. · P delight, flexibility · L platform, attention · S express, define · M -/-/-/-
- `playing-audio/platform-considerations/visionos/design-custom-sounds-for-custom-ui` [visionOS] **Do:** On visionOS, give custom UI elements their own sounds for feedback and spatial feel. **Why:** System elements play sound to help people find them and get feedback, so custom ones should match. · P familiarity, delight · L platform, interaction · S interact, express · M -/-/-/-
- `playing-audio/platform-considerations/visionos/use-spatial-audio-to-create-an` [visionOS] **Do:** On visionOS, use Spatial Audio, mixing ambient sounds with sounds from specific objects, to make immersive experiences lifelike. **Why:** Spatial Audio is perceived all around, anchoring people in a virtual world. · P delight, flexibility · L platform, attention · S express · M -/-/-/-
- `playing-audio/platform-considerations/visionos/consider-defining-a-range-of-places` [visionOS] **Do:** On visionOS, consider where sounds should seem to originate so people can locate sound sources, including moving windows. **Why:** Spatial Audio lets people locate what makes a sound, even as it moves. · P familiarity, delight · L platform, attention · S express · M -/-/-/-
- `playing-audio/platform-considerations/visionos/consider-varying-sounds-that-people-could` [visionOS] **Do:** On visionOS, vary sounds that might feel repetitive, for instance by randomizing pitch and volume of a single file during playback. **Why:** Slight variation mimics real-world differences, as with the system keyboard. · P delight, craft · L platform · S express · M -/-/-/-
- `playing-audio/platform-considerations/visionos/decide-whether-you-need-to-play` [visionOS] **Do:** On visionOS, decide whether a sound is fixed to the wearer or tracked to an object; generally prefer tracked sound for realism. **Why:** Fixed sound seems aimed at the listener, while tracked sound seems to come from an object and changes with distance. · P craft, delight · L platform · S express · M -/-/-/-
### Platform considerations > watchOS

- `playing-audio/platform-considerations/watchos/use-the-recommended-encoding-values-for` [watchOS] **Do:** On watchOS, encode audio with the recommended 64 kbps HE-AAC format. **Why:** It gives good quality with lower data needs. · P craft, flexibility · L platform · S express · M -/-/-/-
- `playing-audio/platform-considerations/watchos/consider` [watchOS] **Do:** On watchOS, consider adding a Now Playing view that lets people manage recent or active sound while staying in your app. **Why:** The system view shows the active audio source and selects it automatically. · P agency, familiarity · L platform, interaction · S structure, interact · M -/-/-/-

## Playing haptics (`playing-haptics`)

<https://developer.apple.com/design/human-interface-guidelines/playing-haptics>

### Best practices

- `playing-haptics/best-practices/use-system-provided-haptic-patterns-according` **Do:** Use system haptic patterns only for their documented meanings; otherwise use a generic or custom pattern. **Why:** The system plays standard haptics the same way on standard controls, which is how people come to recognize them. · P familiarity · L interaction · S interact · M d/t/-/-
- `playing-haptics/best-practices/use-haptics-consistently-throughout-your-app` **Do:** Use haptics consistently so each one has a clear cause-and-effect link to the action that triggers it. **Why:** Haptics without a clear cause seem confusing and gratuitous. · P familiarity, simplicity · L interaction · S interact · M d/t/-/-
- `playing-haptics/best-practices/prefer-using-haptics-to-complement-other` **Do:** Use haptics to support visual and audio feedback, matching their intensity and sharpness to the animation, and syncing sound where useful. **Why:** Harmony among visual, auditory and tactile feedback makes experiences coherent and natural. · P delight, familiarity · L interaction, attention · S interact · M d/t/-/-
- `playing-haptics/best-practices/avoid-overusing-haptics` **Do:** Don't overuse haptics; user-test to find a balance, since the best ones go unnoticed but are missed when off. **Why:** A haptic that feels right occasionally can become tiresome when frequent. · P simplicity, craft · L interaction · S interact · M d/t/-/-
- `playing-haptics/best-practices/in-most-apps-prefer-playing-short` **Do:** In most apps, play brief haptics for discrete events; long-running haptics fit mainly gameplay flow. **Why:** Long haptics dilute feedback meaning and distract from the task. · P simplicity, craft · L interaction, attention · S interact · M d/t/-/-
- `playing-haptics/best-practices/make-haptics-optional` **Do:** Let people turn haptics off or mute them, and keep the app enjoyable without them. **Why:** Not everyone wants or can use haptic feedback. · P agency, flexibility · L interaction, inclusion · S interact · M d/t/-/-
- `playing-haptics/best-practices/be-aware-that-playing-haptics-might` **Do:** Check that haptic vibration doesn't interfere with features like the camera, gyroscope, or microphone. **Why:** Haptics produce enough physical force to be felt, which could disrupt those features. · P responsibility, craft · L interaction, trust · S interact · M d/t/-/-

## Playing video (`playing-video`)

<https://developer.apple.com/design/human-interface-guidelines/playing-video>

### Best practices

- `playing-video/best-practices/use-the-system-video-player-to` **Do:** Use the system video player for a familiar, convenient experience; if you need a custom one, model it on the system player's behavior and look. **Why:** Consistent interactions let people concentrate on content and understand it instantly. · P familiarity · L interaction · S compose, interact · M d/t/-/-
- `playing-video/best-practices/always-display-video-content-at-its` **Do:** Display video at its original aspect ratio, without letterbox or pillarbox padding baked into the frame. **Why:** Embedded padding can shrink video and break correct display in various modes. · P craft · L attention · S express · M d/d/t/t
- `playing-video/best-practices/provide-additional-information-when-it-adds` **Do:** Offer extra video info (image, title, description) when it adds value, and keep it from covering playback. · P purpose, simplicity · L content, attention · S compose, write · M d/-/-/-
- `playing-video/best-practices/support-the-interactions-people-expect-regardless` **Do:** Support expected controls on each input device, such as Space for play and pause on a keyboard and familiar Siri Remote gestures on Apple TV. **Why:** People expect the same media interactions whatever device controls playback. · P familiarity, flexibility · L interaction · S interact · M d/d/-/-
- `playing-video/best-practices/if-people-need-to-access-playback` **Do:** In tvOS, if viewers need playback options or content info, add a transport control or a custom content tab with only the most useful actions, each within a step or two. **Why:** People open them mid-video, so they must be quick to use and quick to leave. · P simplicity, agency · L interaction, flow · S compose, interact · M -/-/-/-
- `playing-video/best-practices/avoid-allowing-audio-from-different-sources` **Do:** Prevent audio from different sources from overlapping when viewers switch modes, such as full screen to PiP. **Why:** Mixed audio is unpleasant and frustrating. · P craft, familiarity · L interaction, flow · S interact · M t/-/-/-
### Integrating with the TV app

- `playing-video/integrating-with-the-tv-app/ensure-a-smooth-transition-to-your` **Do:** When arriving from the TV app, immediately show your own black screen before playback, since the TV app fades to black and skips your launch screen. **Why:** This keeps visual continuity through the transition. · P craft, familiarity · L flow, platform · S interact · M -/-/-/-
- `playing-video/integrating-with-the-tv-app/show-the-expected-content-immediately` **Do:** Go straight to the chosen content after the transition, skipping splash screens, detail screens, and intro animations. **Why:** People expect playback to start as soon as the transition ends. · P agency, simplicity · L flow · S interact · M t/-/-/-
- `playing-video/integrating-with-the-tv-app/avoid-asking-people-if-they-want` **Do:** Resume playback automatically when possible rather than asking for confirmation. · P agency, simplicity · L flow, interaction · S interact · M t/-/-/-
- `playing-video/integrating-with-the-tv-app/play-or-pause-playback-when-people` **Do:** Toggle play and pause when Space is pressed on a connected Bluetooth keyboard. **Why:** People expect Space to control media playback on any keyboard. · P familiarity · L interaction, platform · S interact · M t/d/-/-
- `playing-video/integrating-with-the-tv-app/make-sure-content-plays-for-the` **Do:** Switch to the profile the TV app names before playing; if none is named, ask the viewer to pick one first. **Why:** Content should play for the right viewer, and the choice is then known later. · P responsibility, agency · L flow, trust · S interact · M t/-/-/-
- `playing-video/integrating-with-the-tv-app/use-the-previous-end-time-when` **Do:** When resuming a long clip, start where the viewer last stopped. **Why:** People can quickly continue where they left off. · P agency · L flow · S interact · M t/-/-/-
### Integrating with the TV app > Loading content

- `playing-video/integrating-with-the-tv-app/loading-content/avoid-displaying-loading-screens-when-possible` **Do:** Skip loading screens when possible; if loading takes over two seconds, use a black screen with a centered spinner and nothing else. **Why:** Fast-loading content doesn't need one, and a bare screen keeps the wait calm. · P simplicity, craft · L flow · S interact · M t/-/-/-
- `playing-video/integrating-with-the-tv-app/loading-content/start-playback-immediately` **Do:** Show a loading screen only until enough content is ready to begin playing, and load the rest in the background. **Why:** People want playback to begin without waiting for everything. · P agency, craft · L flow · S interact · M t/-/-/-
- `playing-video/integrating-with-the-tv-app/loading-content/minimize-loading-screen-content` **Do:** Keep loading screen branding or images minimal and keep the background black. **Why:** The black background gives a seamless transition into playback. · P simplicity, craft · L flow, attention · S express · M t/-/-/-
### Integrating with the TV app > Exiting playback

- `playing-video/integrating-with-the-tv-app/exiting-playback/show-a-contextually-relevant-screen` **Do:** When playback ends, show a detail view for the content with an option to resume; if none exists, show a menu listing it or your main menu. **Why:** The destination should relate to what the viewer just watched. · P agency, purpose · L flow · S structure · M t/-/-/-
- `playing-video/integrating-with-the-tv-app/exiting-playback/be-prepared-for-an-immediate-exit` **Do:** Prepare the exit view right after receiving a playback notification, in case people leave immediately after playback starts. · P craft, agency · L flow · S interact · M t/-/-/-
### Platform considerations > tvOS

- `playing-video/platform-considerations/tvos/defer-to-content-when-displaying-logos` [tvOS] **Do:** On tvOS, keep logos and noninteractive overlays small, short, and preferably translucent SDR, not large, bright, opaque graphics. **Why:** Big overlays distract from viewing, and some devices are prone to image retention. · P simplicity, craft · L attention · S express · M t/-/-/-
- `playing-video/platform-considerations/tvos/show-interactive-overlays-gracefully` [tvOS] **Do:** On tvOS, pause media after a delay of at least 0.5 seconds before an interactive overlay, and provide a clear way to dismiss it and resume. **Why:** Overlays should appear gracefully and let people return to viewing. · P agency, craft · L flow, interaction · S interact · M t/-/-/-
### Platform considerations > visionOS

- `playing-video/platform-considerations/visionos/help-people-stay-comfortable-when-playing` [visionOS] **Do:** On visionOS, aid comfort by letting people start videos themselves, using a small resizable window, and keeping their surroundings visible. **Why:** Comfort is helped even when the app doesn't control the video content. · P flexibility, agency · L platform, inclusion · S interact · M -/-/-/-
- `playing-video/platform-considerations/visionos/in-a-fully-immersive-experience-avoid` [visionOS] **Do:** In fully immersive visionOS experiences, keep virtual content from covering the default playback and transport controls near the player's bottom. **Why:** The system places the player predictably for optimal viewing. · P familiarity, craft · L platform, attention · S compose · M -/-/-/-
- `playing-video/platform-considerations/visionos/avoid-automatically-starting-a-fully-immersive` [visionOS] **Do:** On visionOS, don't automatically begin fully immersive video; let people choose. **Why:** People need control and dislike being launched into immersion without warning. · P agency, responsibility · L platform, flow · S interact · M -/-/-/-
- `playing-video/platform-considerations/visionos/create-a-thumbnail-track-if-you` [visionOS] **Do:** On visionOS, supply a thumbnail track for scrubbing, using thumbnails sized as recommended. **Why:** Thumbnails help people pick a section, and the set size improves performance. · P craft, agency · L platform, interaction · S interact · M -/-/-/-
- `playing-video/platform-considerations/visionos/avoid-expanding-an-inline-video-player` [visionOS] **Do:** On visionOS, don't stretch an inline video player to fill the window; keep window content visible around it. **Why:** Inline video is 2D, and visible surroundings avoid raising expectations of immersive playback. · P familiarity, craft · L platform, attention · S compose · M -/-/-/-
- `playing-video/platform-considerations/visionos/use-a-realitykit-video-player-if` [visionOS] **Do:** On visionOS, use a RealityKit video player for splash or transitional video that leads into the next experience. **Why:** Such video needs no playback controls or system integrations like dimming. · P simplicity, craft · L platform · S interact · M -/-/-/-
### Platform considerations > watchOS

- `playing-video/platform-considerations/watchos/keep-video-clips-short` [watchOS] **Do:** On watchOS, keep video clips short, preferably under 30 seconds. **Why:** Long clips use disk space and tire wrists held up. · P flexibility, craft · L platform · S express · M -/-/-/-
- `playing-video/platform-considerations/watchos/use-the-recommended-sizes-and-encoding` [watchOS] **Do:** On watchOS, use the recommended media sizes and encodings, and avoid scaling video clips. **Why:** Scaling hurts performance and looks poor. · P craft · L platform · S express · M -/-/-/-
- `playing-video/platform-considerations/watchos/avoid-creating-a-poster-image-that` [watchOS] **Do:** On watchOS, don't style a poster image to look like a system control. **Why:** People should see that tapping a movie element plays it, not mistake it for something else. · P familiarity, simplicity · L platform, attention · S express · M -/-/-/-
- `playing-video/platform-considerations/watchos/consider-creating-a-poster-image-that` [watchOS] **Do:** On watchOS, make poster images reflect the clip's contents and avoid unrelated or control-like images. **Why:** A relevant poster helps people decide whether to watch. · P familiarity, purpose · L platform, content · S express · M -/-/-/-

## Printing (`printing`)

<https://developer.apple.com/design/human-interface-guidelines/printing>

### Best practices

- `printing/best-practices/make-printing-discoverable` **Do:** Put print in standard system spots: a File menu item on macOS, a toolbar button opening an action sheet on iOS and iPadOS; on Mac, an optional toolbar button is fine. **Why:** Standard placement helps people find the print action. · P familiarity, flexibility · L platform, interaction · S structure, interact · M d/t/-/-
- `printing/best-practices/present-a-printing-option-only-when` **Do:** Dim or remove the print option when nothing can be printed or no printer is available, including on any custom print button. **Why:** Showing an unavailable action would mislead people. · P familiarity, simplicity · L interaction, platform · S interact · M d/t/-/-
- `printing/best-practices/present-relevant-printing-options` **Do:** Offer sensible print options, such as page range, copies, and two-sided, through the system view when the printer supports them. · P familiarity, simplicity · L interaction · S interact · M d/t/-/-
### Platform considerations > macOS

- `printing/platform-considerations/macos/if-your-macos-app-offers-app` [macOS] **Do:** On macOS, if your app has print options the system lacks, add a custom print panel category named for your app. **Why:** Relevant extras improve the print experience, as with Keynote's presentation-specific options. · P purpose, familiarity · L platform, interaction · S compose · M t/-/-/-
- `printing/platform-considerations/macos/if-your-app-supports-document-specific` [macOS] **Do:** On macOS, offer a page setup dialog for document-specific page settings, without duplicating options the system already handles. **Why:** Rarely changed per-document settings fit there, and the system already covers things like orientation. · P simplicity, familiarity · L platform · S compose · M t/-/-/-
- `printing/platform-considerations/macos/make-sure-interdependencies-between-options-are` [macOS] **Do:** On macOS, make clear how print options depend on each other, such as unavailable choices when double-sided printing is on. · P simplicity, craft · L platform, interaction · S interact · M t/-/-/-
- `printing/platform-considerations/macos/separate-advanced-features-from-frequently-used` [macOS] **Do:** On macOS, hide advanced options behind a disclosure control labeled Advanced Options, apart from commonly used ones. **Why:** Keeping rare features out of view reduces clutter. · P simplicity, agency · L platform, attention · S compose · M t/-/-/-
- `printing/platform-considerations/macos/consider-letting-people-preview-the-effect` [macOS] **Do:** On macOS, consider previewing a setting's effect, such as updating a thumbnail when a tone control changes. · P agency, delight · L platform, interaction · S interact · M t/-/-/-
- `printing/platform-considerations/macos/consider-storing-modified-settings-with-the` [macOS] **Do:** On macOS, consider saving modified print settings with the document, or at least until it is closed. **Why:** People may want to print the document again. · P agency, craft · L platform, flow · S interact · M t/-/-/-

## Ratings and reviews (`ratings-and-reviews`)

<https://developer.apple.com/design/human-interface-guidelines/ratings-and-reviews>

### Best practices

- `ratings-and-reviews/best-practices/ask-for-a-rating-only-after` **Do:** Request a rating only after people show engagement, such as finishing a level or key task, not at first launch or during onboarding. **Why:** Early on, people haven't grasped the app's value and may respond negatively. · P responsibility, agency · L trust, flow · S interact · M d/t/-/-
- `ratings-and-reviews/best-practices/avoid-interrupting-people-while-theyre-performing` **Do:** Don't ask for feedback mid-task or mid-game; choose natural breaks. **Why:** Interruptions feel like a burden and disrupt the experience. · P agency, responsibility · L trust, flow · S interact · M d/t/-/-
- `ratings-and-reviews/best-practices/avoid-pestering-people` **Do:** Space out rating requests, at least a week or two apart, and ask again after further engagement. **Why:** Repeated requests irritate people and can sour their opinion. · P responsibility, agency · L trust, flow · S interact · M d/t/-/-
- `ratings-and-reviews/best-practices/prefer-the-system-provided-prompt` **Do:** Use the system rating prompt, which is consistent, nonintrusive, and skips people who already gave feedback. **Why:** It handles checking for earlier feedback and shows a simple prompt people can dismiss. · P familiarity, responsibility · L trust, interaction · S interact · M t/-/-/-
- `ratings-and-reviews/best-practices/weigh-the-benefits-of-resetting-your` **Do:** Balance resetting the summary rating, which reflects the current version, against ending up with fewer ratings. **Why:** Fewer ratings can discourage some downloads. · P purpose, responsibility · L value, trust · S define · M t/-/-/-

## Searching (`searching`)

<https://developer.apple.com/design/human-interface-guidelines/searching>

### Best practices

- `searching/best-practices/if-search-is-important-give-it` **Do:** If search matters, give it a prominent place, such as in a toolbar with key actions or a dedicated tab. **Why:** Important functions deserve prominent positions. · P purpose, simplicity · L attention, flow · S structure, compose · M d/t/-/-
- `searching/best-practices/aim-to-make-your-apps-content` **Do:** Let people search all content from one clear location, optionally adding local search in distinct sections that filters the current view. **Why:** People like one clearly identified place to find anything. · P simplicity, familiarity · L flow, interaction · S structure · M d/t/-/-
- `searching/best-practices/clearly-display-the-current-scope-of` **Do:** Reinforce the search scope with a descriptive placeholder, a scope bar, or a title. · P simplicity, familiarity · L content, attention · S write, compose · M d/d/-/-
- `searching/best-practices/provide-suggestions-to-make-searching-easier` **Do:** Offer recent searches before typing or predictive suggestions while typing. **Why:** People search faster and type less. · P agency, simplicity · L interaction, flow · S interact · M d/d/-/-
- `searching/best-practices/take-privacy-into-consideration-before-displaying` **Do:** Think about privacy before showing search history, and if shown, let people clear it. **Why:** Others may see the history, which people may not want. · P responsibility · L trust · S interact, include · M d/d/-/-
### Systemwide search

- `searching/systemwide-search/make-your-apps-content-searchable-in` **Do:** Make app content indexable in Spotlight with descriptive metadata. **Why:** Spotlight organizes it for fast, comprehensive searches. · P purpose, flexibility · L platform, value · S structure · M t/-/-/-
- `searching/systemwide-search/define-metadata-for-custom-file-types` **Do:** Supply a Spotlight File Importer plug-in to describe metadata of your custom file types. · P craft, flexibility · L platform · S structure · M -/-/-/-
- `searching/systemwide-search/use-spotlight-to-offer-advanced-file` **Do:** Use Spotlight for in-app advanced file search, such as a button that searches from the current selection and shows results in a custom view. · P purpose, agency · L platform, interaction · S interact · M t/-/-/-
- `searching/systemwide-search/prefer-using-the-system-provided-open` **Do:** Use the system open and save views, which include built-in search across the system. **Why:** They give people a familiar way to search and filter. · P familiarity · L interaction, platform · S compose · M t/-/-/-
- `searching/systemwide-search/implement-a-quick-look-generator-if` **Do:** If your app creates custom file types, implement a Quick Look generator. **Why:** It lets Spotlight and other apps show document previews. · P craft, flexibility · L platform · S structure · M -/-/-/-

## Settings (`settings`)

<https://developer.apple.com/design/human-interface-guidelines/settings>

### Best practices

- `settings/best-practices/aim-to-provide-default-settings-that` **Do:** Choose defaults that serve most people best, such as auto-tuning performance for the device, so they can begin without changing anything. **Why:** Good defaults remove the need for adjustments before enjoying the app. · P agency, simplicity · L interaction, value · S define, interact · M d/t/-/-
- `settings/best-practices/minimize-the-number-of-settings-you` **Do:** Keep the number of settings low. **Why:** Too many settings make an app less approachable and a given setting hard to find. · P simplicity, agency · L attention, flow · S define, compose · M d/t/-/-
- `settings/best-practices/make-settings-available-in-ways-people` **Do:** Open settings the ways people expect, like Command-Comma with a keyboard, or Esc in games. **Why:** Habitual shortcuts differ by context. · P familiarity, flexibility · L interaction, platform · S interact · M d/t/-/-
- `settings/best-practices/avoid-using-settings-to-ask-for` **Do:** Detect setup information automatically, such as a connected controller or Dark Mode, instead of asking in settings. · P simplicity, agency · L interaction, flow · S interact · M d/t/-/-
- `settings/best-practices/respect-peoples-systemwide-settings-and-avoid` **Do:** Honor systemwide settings and don't duplicate global options like accessibility, scrolling, or authentication in your own settings. **Why:** Duplicates imply the system settings may not apply and confuse people. · P familiarity, flexibility · L inclusion, interaction · S define, compose · M d/t/-/-
### General settings

- `settings/general-settings/put-general-infrequently-changed-settings-in` **Do:** Reserve your settings area for general options people seldom change, like window setup, game saves, key mappings, or account options. **Why:** Opening settings interrupts what people are doing. · P simplicity, purpose · L flow, value · S structure, compose · M d/t/-/-
### Task-specific options

- `settings/task-specific-options/when-possible-prefer-letting-people-modify` **Do:** Let people change task-specific options, like filters, ordering, or visibility, right in the affected screen instead of a settings area. **Why:** They're easier to find and use in context, and don't pull people away from the task. · P agency, purpose · L flow, interaction · S structure, interact · M d/t/-/-
### System settings

- `settings/system-settings/add-only-the-most-rarely-changed` **Do:** Place only rarely changed options in the system Settings app, and consider a button from your interface that opens it. · P simplicity, familiarity · L platform, flow · S structure · M t/-/-/-
### Platform considerations > macOS

- `settings/platform-considerations/macos/include-a-settings-item-in-the` [macOS] **Do:** On macOS, put settings in the App menu, not a toolbar button; document-level options go in the File menu. **Why:** Toolbar buttons take space from frequently used commands. · P familiarity, simplicity · L platform, interaction · S structure, compose · M t/-/-/-
- `settings/platform-considerations/macos/dim-a-settings-windows-minimize-and` [macOS] **Do:** On macOS, dim the minimize and maximize buttons of a settings window. **Why:** It opens quickly by shortcut and sizes itself to each pane, so those buttons add little. · P familiarity, simplicity · L platform, interaction · S compose · M t/-/-/-
- `settings/platform-considerations/macos/in-your-settings-window-use-a` [macOS] **Do:** On macOS, give the settings window a fixed toolbar that stays visible and marks the active button. **Why:** A stable interface helps people navigate and find settings. · P familiarity, craft · L platform, flow · S compose · M t/-/-/-
- `settings/platform-considerations/macos/update-the-windows-title-to-reflect` [macOS] **Do:** On macOS, make the settings window title match the visible pane, or use App Name Settings if there's one pane. · P familiarity, simplicity · L platform, content · S write · M t/-/-/-
- `settings/platform-considerations/macos/restore-the-most-recently-viewed-pane` [macOS] **Do:** On macOS, reopen the settings window on the pane used last. **Why:** People often adjust related settings repeatedly. · P agency, simplicity · L platform, flow · S interact · M t/-/-/-

## Undo and redo (`undo-and-redo`)

<https://developer.apple.com/design/human-interface-guidelines/undo-and-redo>

### Best practices

- `undo-and-redo/best-practices/help-people-predict-the-results-of` **Do:** Make undo and redo outcomes predictable, for example naming the result in the iPhone shake alert or menu labels like Undo Typing. **Why:** People can see what will happen before doing it. · P agency, familiarity · L interaction, content · S write, interact · M d/t/-/-
- `undo-and-redo/best-practices/show-the-results-of-an-undo` **Do:** Make the effect of each undo or redo visible, especially when it affects off-screen content. **Why:** Without a visible result, people may think nothing happened and repeat the action. · P agency, craft · L attention, flow · S interact · M d/t/-/-
- `undo-and-redo/best-practices/let-people-undo-multiple-times` **Do:** Allow repeated undo and redo without unneeded limits, back to a logical step like opening or saving. **Why:** People expect to reverse everything since that step. · P agency · L flow, interaction · S interact · M d/t/-/-
- `undo-and-redo/best-practices/consider-giving-people-the-option-to` **Do:** Consider letting people revert groups of related changes, or all changes since opening or saving, in one move. **Why:** It saves undoing every single adjustment. · P agency, simplicity · L flow, interaction · S interact · M d/t/-/-
- `undo-and-redo/best-practices/provide-undo-and-redo-buttons-only` **Do:** Rely on system-supported undo and redo triggers; if dedicated buttons are essential, use standard symbols in a toolbar. **Why:** People expect system methods like the Edit menu, shortcuts, or shake. · P familiarity, simplicity · L interaction · S compose, interact · M d/t/-/-
### Platform considerations > iOS, iPadOS

- `undo-and-redo/platform-considerations/ios-ipados/avoid-redefining-standard-gestures-for-undo` [iOS, iPadOS] **Do:** On iOS and iPadOS, don't redefine standard undo and redo gestures like the three-finger swipe or shake. **Why:** Redefining standard gestures confuses people and makes the interface unpredictable. · P familiarity · L interaction, platform · S interact · M d/t/-/-
- `undo-and-redo/platform-considerations/ios-ipados/briefly-and-precisely-describe-the-operation` [iOS, iPadOS] **Do:** On iOS and iPadOS, supply a word or two naming what is being undone or redone, since the alert adds its own prefix. · P simplicity, familiarity · L content, platform · S write · M d/t/-/-
### Platform considerations > macOS

- `undo-and-redo/platform-considerations/macos/place-undo-and-redo-commands-in` [macOS] **Do:** On macOS, put undo and redo at the top of Edit and support the standard shortcuts. **Why:** Mac users expect them there and with those shortcuts. · P familiarity · L platform, interaction · S structure, interact · M t/d/-/-

## Workouts (`workouts`)

<https://developer.apple.com/design/human-interface-guidelines/workouts>

### Best practices

- `workouts/best-practices/in-a-watchos-fitness-app-use` **Do:** In a watchOS fitness app, run workout sessions that surface the figures people want most, such as time, calories, or distance, with fitting controls. **Why:** The app stays on screen between wrist raises, so useful data should be visible. · P purpose, simplicity · L platform, value · S compose · M -/-/-/-
- `workouts/best-practices/avoid-distracting-people-from-a-workout` **Do:** On watchOS during a workout, don't show irrelevant information such as the workout list or other app areas. **Why:** Such information distracts people during exercise. · P simplicity, purpose · L platform, attention · S compose · M -/-/-/-
- `workouts/best-practices/use-a-distinct-visual-appearance-to` **Do:** On Apple Watch, give an in-progress workout screen a look of its own, such as live-updating values or a unique metrics layout. **Why:** People want to spot an active session instantly, and changing values signal that it is running. · P simplicity, familiarity · L attention · S express · M t/-/-/-
- `workouts/best-practices/provide-workout-controls-that-are-easy` **Do:** Make pause, resume and stop controls simple to locate and press, and clearly signal when a session begins or ends. **Why:** Clear feedback tells people the workout state without guessing. · P agency, familiarity · L interaction · S interact · M t/-/-/-
- `workouts/best-practices/help-people-understand-the-health-information` **Do:** When a sensor can't collect data mid-workout, tell people what is still being tracked, using wording close to the system Workout app. **Why:** Honest explanation prevents confusion about why some health readings are missing. · P responsibility, simplicity · L content, trust · S write · M t/-/-/-
- `workouts/best-practices/provide-a-summary-at-the-end` **Do:** End each session with a summary screen showing recorded results, and consider adding Activity rings so progress is easy to check. **Why:** It confirms the workout is over and lets people see what was captured. · P purpose, familiarity · L content, flow · S interact · M t/-/-/-
- `workouts/best-practices/discard-extremely-brief-workout-sessions` **Do:** When a session ends moments after starting, drop its data automatically or ask whether it should count as a workout. **Why:** Accidental tiny sessions would add meaningless entries; asking keeps control with the person. · P simplicity, agency · L value, flow · S interact · M t/-/-/-
- `workouts/best-practices/make-sure-text-is-legible-for` **Do:** For workouts involving movement, use big type, strong color contrast, and a layout that puts key info where it reads fastest. **Why:** People in motion can't study the screen, so text must be readable instantly. · P flexibility · L attention, inclusion · S express · M d/-/-/-
- `workouts/best-practices/use-activity-rings-correctly` **Do:** Show Activity rings only for the purpose Apple documents, keeping their colors and meanings identical to the Activity app. **Why:** People already associate these rings with specific meanings from the Activity app. · P familiarity · L platform, content · S express · M -/-/-/-
