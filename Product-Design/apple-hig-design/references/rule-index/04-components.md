# Rule index: Components

Source: Apple Human Interface Guidelines, collected 2026-11-04. 64 pages, 767 entries.

Each line is our own summary of one HIG rule, not Apple's wording. Open the page link for the original text.

Legend: **P** principles behind the rule (why) · **L** lenses · **S** work stages · **M** media fit for mobile / web / slides / cards (d = direct, t = transfer, - = none) · [Platform] marks platform-specific rules · **Term** entries are definitions, not rules.

## Charts (`charts`)

Content · <https://developer.apple.com/design/human-interface-guidelines/charts>

### Marks

- `charts/marks/choose-a-mark-type-based-on` **Do:** Select bar, line, point or other marks according to what you want people to learn from the data. **Why:** Each mark type conveys a different kind of insight, such as comparison, trend or individual values. · P simplicity, purpose · L attention, content · S express, compose · M d/d/d/d
- `charts/marks/consider-combining-mark-types-when-it` **Do:** Layer different marks together, such as points on a line, when the mix makes the chart easier to understand. **Why:** The line shows the overall trend while points call out single values. · P simplicity · L attention · S compose · M d/d/d/d
### Axes

- `charts/axes/use-a-fixed-or-dynamic-axis` **Do:** Fix the axis range when set minimum and maximum values carry meaning; let it adapt to the data when values vary widely. **Why:** People expect a charge meter to span empty to full, while varied data benefits from marks filling the plot. · P simplicity, familiarity · L attention, content · S compose · M d/d/d/d
- `charts/axes/define-the-value-of-the-lower` **Do:** Choose the axis lower bound to suit the mark type and the chart's job, for example zero for bars but not when it hides small differences. **Why:** Zero lets bar heights be compared, but can bury meaningful differences far from zero. · P simplicity, purpose · L attention · S compose · M d/d/d/d
- `charts/axes/prefer-familiar-sequences-of-values-in` **Do:** Label ticks and grid lines with familiar number sequences, such as steps of five, rather than odd intervals. **Why:** Common sequences are understood instantly, while unusual ones make people stop and work out the spacing. · P familiarity, simplicity · L attention, content · S compose · M d/d/d/d
- `charts/axes/tailor-the-appearance-of-grid-lines` **Do:** Tune grid line and label density and weight to the chart's context and tasks, using fewer and lighter ones when data inspection is possible. **Why:** Too many lines overwhelm the data, while too few make values hard to estimate. · P simplicity · L attention · S compose, express · M d/d/d/d
### Descriptive content

- `charts/descriptive-content/write-descriptions-that-help-people-understand` **Do:** Give charts informative titles and labels that explain what the chart is for before people dig into details. **Why:** VoiceOver users and some people with cognitive disabilities depend on this context to decide whether to explore. · P flexibility, simplicity · L inclusion, content · S write, include · M d/d/t/t
- `charts/descriptive-content/summarize-the-main-message-of-your` **Do:** State the chart's key takeaway in a short summary, like a title and subtitle, so it can be grasped quickly. **Why:** Not everyone can or will study the details, so the main point must be easy to get. · P simplicity, flexibility · L content, attention · S write · M d/d/d/d
### Best practices

- `charts/best-practices/establish-a-consistent-visual-hierarchy-that` **Do:** Keep a consistent hierarchy in which the data stands out most and descriptions and axes support it quietly. **Why:** The data is the focus, and supporting elements shouldn't compete with it. · P simplicity · L attention · S compose · M d/d/d/d
- `charts/best-practices/in-a-compact-environment-maximize-the` **Do:** In compact spaces, widen the plot area by shortening vertical-axis labels, moving units to the title, and tucking long labels inside the plot when safe. **Why:** More horizontal room lets people examine the chart comfortably. · P flexibility, simplicity · L attention, content · S adapt, compose · M d/t/t/t
- `charts/best-practices/make-every-chart-in-your-app` **Do:** Make every chart usable by everyone, including supporting VoiceOver with labels for chart components and optionally Audio Graphs. **Why:** Charts must work for people regardless of how they perceive content. · P flexibility · L inclusion · S include · M d/d/t/t
- `charts/best-practices/let-people-interact-with-the-data` **Do:** Offer optional exploration of chart data, but show the critical information without needing any interaction. **Why:** People mostly care about the main view, and extra detail is a bonus for those who want it. · P agency, simplicity · L interaction, value · S interact · M d/d/-/-
- `charts/best-practices/make-it-easy-for-everyone-to` **Do:** When chart marks are too small to hit, make the whole plot area the target so people can scrub to see values. **Why:** Tiny marks are hard for people with limited motor control and annoying for everyone. · P flexibility · L interaction, inclusion · S interact · M d/d/-/-
- `charts/best-practices/make-an-interactive-chart-easy-to` **Do:** Provide a logical, predictable keyboard or Switch Control path through an interactive chart, or let focus move among subsets for large data. **Why:** By default these inputs step through elements linearly, which can be awkward for chart data. · P flexibility · L inclusion, interaction · S include, interact · M t/d/-/-
- `charts/best-practices/help-people-notice-important-changes-in` **Do:** Make people aware of important changes to marks or axes, using animation plus other cues for VoiceOver users and those who disable animation. **Why:** Unnoticed changes lead to misreading the chart. · P flexibility, responsibility · L attention, inclusion · S interact, include · M d/d/-/-
- `charts/best-practices/align-a-chart-with-surrounding-interface` **Do:** Line up a chart's leading edge with neighboring views, using trailing-side labels, a shifted Y axis or ticks to keep the edge tidy. **Why:** A clean, aligned edge keeps the layout orderly and labels clearly attached. · P craft, simplicity · L attention · S compose · M d/d/d/d
### Color

- `charts/color/avoid-relying-solely-on-color-to` **Do:** Back up color with other cues like shapes or patterns when distinguishing data or conveying essential chart information. **Why:** People who can't tell colors apart must still be able to use the chart. · P flexibility · L inclusion, attention · S express, include · M d/d/d/d
- `charts/color/aid-comprehension-by-adding-visual-separation` **Do:** Put small gaps between adjacent colored segments, such as in stacked bars, to separate them. **Why:** Separators help people tell individual segments apart. · P craft, simplicity · L attention · S express · M d/d/d/d
### Enhancing the accessibility of a chart

- `charts/enhancing-the-accessibility-of-a-chart/consider-using-audio-graphs-to-give` **Do:** Give VoiceOver users a chart title and summary, and if not using Audio Graphs, describe chart type, axes and bounds, with labels per important element. **Why:** Charts need richer descriptions than a single image label so people grasp their purpose and features. · P flexibility · L inclusion, content · S include · M t/t/-/-
- `charts/enhancing-the-accessibility-of-a-chart/write-accessibility-labels-that-support-the` **Do:** Write chart accessibility labels that match its purpose: summarize stretches for overall trends, or label each mark when exact values matter. **Why:** The right level of detail depends on what the chart is meant to tell people. · P flexibility, purpose · L inclusion, content · S write, include · M t/t/-/-
- `charts/enhancing-the-accessibility-of-a-chart/hide-visible-text-labels-for-axes` **Do:** Keep visible axis and tick text out of what assistive technologies read. **Why:** Those users get values and trends from the accessibility labels and Audio Graphs instead. · P flexibility, simplicity · L inclusion · S include · M t/t/-/-
### Platform considerations > watchOS

- `charts/platform-considerations/watchos/in-general-avoid-requiring-complex-chart` [watchOS] **Do:** On Apple Watch, avoid charts that need complex interaction; favor glanceable info and put deeper exploration in a companion app on another platform. **Why:** Small-screen users want quick information, while larger devices suit richer exploration. · P flexibility, simplicity · L platform, interaction · S adapt · M t/-/-/-

## Image views (`image-views`)

Content · <https://developer.apple.com/design/human-interface-guidelines/image-views>

### Best practices

- `image-views/best-practices/use-an-image-view-when-the` **Do:** Use a plain image view just to show a picture; if it must be tappable, use a system button holding the image. **Why:** Each element should do its own job rather than mimic another. · P familiarity, simplicity · L interaction, platform · S compose · M t/t/-/-
- `image-views/best-practices/if-you-want-to-display-an` **Do:** Choose symbols or interface icons instead of image views for icons in your interface. **Why:** They are vector-based, can take different colors and opacities, and follow people's accent color. · P familiarity, craft · L attention · S express · M t/t/-/-
### Content

- `image-views/content/take-care-when-overlaying-text-on` **Do:** Make sure overlaid text contrasts clearly with the picture, using a text shadow or background layer when needed. **Why:** Putting text on images can hurt both the image's clarity and text legibility. · P flexibility, craft · L attention · S express · M d/d/d/d
- `image-views/content/aim-to-use-a-consistent-size` **Do:** Prepare all frames of an animated image sequence at one size and shape so the system doesn't rescale them. **Why:** Uniform sizes avoid scaling work and generally perform better. · P craft · L interaction · S interact · M t/t/-/-
### Platform considerations > macOS

- `image-views/platform-considerations/macos/if-your-app-needs-an-editable` [macOS] **Do:** On Mac, use an image well when an image must be editable. **Why:** It supports copy, paste, dragging and clearing content with the Delete key. · P familiarity · L interaction, platform · S compose · M -/t/-/-
- `image-views/platform-considerations/macos/use-an-image-button-instead-of` [macOS] **Do:** On Mac, use an image button, not an image view, when a picture should be clickable. **Why:** An image button is meant to trigger an immediate action. · P familiarity · L interaction, platform · S compose · M t/t/-/-
### Platform considerations > watchOS

- `image-views/platform-considerations/watchos/use-swiftui-to-create-animations-when` [watchOS] **Do:** On Apple Watch, prefer SwiftUI for animation, resorting to WatchKit image sequences only if needed. · P craft · L platform · S interact · M -/-/-/-

## Text views (`text-views`)

Content · <https://developer.apple.com/design/human-interface-guidelines/text-views>

### Best practices

- `text-views/best-practices/use-a-text-view-when-you` **Do:** Use a text view for long, editable or specially formatted text; use a label or text field for small amounts. **Why:** Text views offer the most options but are more than short text requires. · P simplicity · L interaction, content · S compose · M t/t/-/-
- `text-views/best-practices/keep-text-legible` **Do:** Keep text readable even with creative styling, adopt Dynamic Type, and test with accessibility options such as bold text. **Why:** Readability matters more than styling, and people change text settings. · P flexibility · L inclusion, attention · S express, include · M d/d/t/t
- `text-views/best-practices/make-useful-text-selectable` **Do:** Let people select and copy useful text such as error messages, serial numbers or IP addresses. **Why:** People may want to paste that information elsewhere. · P agency · L interaction · S interact · M d/d/-/-
### Platform considerations > iOS, iPadOS

- `text-views/platform-considerations/ios-ipados/show-the-appropriate-keyboard-type` [iOS, iPadOS] **Do:** On iPhone and iPad, show the keyboard type that fits the content being typed. **Why:** The right keyboard streamlines data entry. · P simplicity, familiarity · L interaction, platform · S interact · M d/t/-/-

## Web views (`web-views`)

Content · <https://developer.apple.com/design/human-interface-guidelines/web-views>

### Best practices

- `web-views/best-practices/support-forward-and-back-navigation-when` **Do:** When people may visit several pages in a web view, enable forward and back navigation and include controls for it. **Why:** This isn't available by default, and people expect to move between pages. · P agency · L flow, interaction · S structure, interact · M d/t/-/-
- `web-views/best-practices/avoid-using-a-web-view-to` **Do:** Use a web view for brief in-app access to a site, not to rebuild a full web browser. **Why:** Safari is where people browse, so copying it is unnecessary. · P simplicity, familiarity · L value, platform · S define · M t/-/-/-

## Boxes (`boxes`)

Layout and organization · <https://developer.apple.com/design/human-interface-guidelines/boxes>

### Best practices

- `boxes/best-practices/prefer-keeping-a-box-relatively-small` **Do:** Keep a box small relative to its containing window or screen. **Why:** A box close to full size separates grouped content poorly and crowds other content. · P simplicity · L attention · S compose · M d/d/t/t
- `boxes/best-practices/consider-using-padding-and-alignment-to` **Do:** Show subgroups inside a box with padding and alignment rather than nested boxes. **Why:** Extra borders make the interface feel busy and constrained. · P simplicity · L attention · S compose · M d/d/d/d
### Content

- `boxes/content/provide-a-succinct-introductory-title-if` **Do:** Add a short intro title to a box when it clarifies the contents. **Why:** It adds detail about how items relate and helps VoiceOver users anticipate the content. · P simplicity, flexibility · L content, interaction · S write · M d/d/t/t
- `boxes/content/if-you-need-a-title-write` **Do:** Write box titles as brief descriptive phrases in sentence-style capitalization, with no closing punctuation except a colon in settings panes. **Why:** A brief phrase keeps the title concise and consistent. · P simplicity · L content · S write · M d/d/d/d

## Collections (`collections`)

Layout and organization · <https://developer.apple.com/design/human-interface-guidelines/collections>

### Best practices

- `collections/best-practices/use-the-standard-row-or-grid` **Do:** Stick with the default row or grid layout for collections wherever possible. **Why:** These simple layouts are expected, and custom ones can confuse or draw needless attention. · P familiarity, simplicity · L attention, interaction · S compose · M d/d/t/t
- `collections/best-practices/consider-using-a-table-instead-of` **Do:** Present text content in a scrollable list or table instead of a collection. **Why:** Textual information is simpler and faster to scan in a list. · P simplicity · L content, attention · S compose · M d/d/t/t
- `collections/best-practices/make-it-easy-to-choose-an` **Do:** Make items easy to reach and pick, with enough padding around images so focus or hover effects are visible and nothing overlaps. **Why:** Hard-to-reach items frustrate people before they get to content. · P agency · L interaction · S compose, interact · M d/d/-/-
- `collections/best-practices/add-custom-interactions-when-necessary` **Do:** Add custom gestures for extra actions if needed, building on the defaults of tap to select, hold to edit and swipe to scroll. **Why:** Standard gestures cover basics, but some apps need more. · P agency, familiarity · L interaction · S interact · M d/t/-/-
- `collections/best-practices/consider-using-animations-to-provide-feedback` **Do:** Use animations to show that items are inserted, deleted or reordered in a collection. **Why:** Motion gives feedback about what changed. · P familiarity, delight · L interaction · S interact · M d/d/-/-
### Platform considerations > iOS, iPadOS

- `collections/platform-considerations/ios-ipados/use-caution-when-making-dynamic-layout` [iOS, iPadOS] **Do:** On iOS and iPadOS, change a collection's layout dynamically only with care, preferably in response to an explicit action. **Why:** Changes should make sense and be easy to follow, and shifts while people interact are disorienting. · P familiarity, simplicity · L interaction, platform · S interact · M d/d/-/-

## Column views (`column-views`)

Layout and organization · <https://developer.apple.com/design/human-interface-guidelines/column-views>

### Best practices

- `column-views/best-practices/show-the-root-level-of-your` **Do:** Put the top tier of your data hierarchy in the leftmost column. **Why:** People know they can scroll back there to restart navigation from the top. · P familiarity, agency · L flow · S structure · M t/t/-/-
- `column-views/best-practices/consider-showing-information-about-the-selected` **Do:** When a selected item has nothing nested, show details or a preview of that item. **Why:** It gives useful information instead of an empty area. · P purpose · L value, content · S compose · M t/t/-/-
- `column-views/best-practices/let-people-resize-columns` **Do:** Let people resize columns, especially when some item names are too long for the default width. **Why:** People can reveal clipped content. · P agency, flexibility · L interaction · S interact · M -/t/-/-

## Disclosure controls (`disclosure-controls`)

Layout and organization · <https://developer.apple.com/design/human-interface-guidelines/disclosure-controls>

### Best practices

- `disclosure-controls/best-practices/use-a-disclosure-control-to-hide` **Do:** Hide detailed options behind a disclosure control, keeping the most-used controls always visible at the top. **Why:** People find essential information quickly without being overwhelmed. · P simplicity · L attention, flow · S compose · M d/d/t/t
### Disclosure triangles

- `disclosure-controls/disclosure-triangles/provide-a-descriptive-label-when-using` **Do:** Label a disclosure triangle with what it reveals or hides, for example "Advanced Options." **Why:** A descriptive label tells people what is behind it. · P simplicity · L content · S write · M t/d/-/-
### Disclosure buttons

- `disclosure-controls/disclosure-buttons/place-a-disclosure-button-near-the` **Do:** Position a disclosure button close to the content it expands and collapses. **Why:** It makes the link between control and revealed choices clear. · P familiarity, simplicity · L attention · S compose · M d/d/-/-
- `disclosure-controls/disclosure-buttons/use-no-more-than-one-disclosure` **Do:** Use only one disclosure button in any single view. **Why:** Several add complexity and confuse people. · P simplicity · L interaction · S compose · M t/d/-/-

## Labels (`labels`)

Layout and organization · <https://developer.apple.com/design/human-interface-guidelines/labels>

### Best practices

- `labels/best-practices/use-a-label-to-display-a` **Do:** Use a label for a small piece of non-editable text; use a text field to edit short text and a text view for large text. **Why:** Matching the element to the content keeps things simple. · P simplicity · L interaction, content · S compose · M d/d/t/t
- `labels/best-practices/prefer-system-fonts` **Do:** Favor system fonts for labels, and keep custom styling legible. **Why:** Labels support Dynamic Type by default where available. · P flexibility, familiarity · L inclusion, attention · S express · M d/d/t/t
- `labels/best-practices/use-system-provided-label-colors-to` **Do:** Use the system label colors to show different levels of text importance. **Why:** The four colors give text varying degrees of visual prominence. · P simplicity, familiarity · L attention · S express · M d/d/d/d
- `labels/best-practices/make-useful-label-text-selectable` **Do:** Let people select and copy useful label text, such as an error message, location or IP address. **Why:** They may want to paste it elsewhere. · P agency · L interaction · S interact · M d/d/-/-

## Lists and tables (`lists-and-tables`)

Layout and organization · <https://developer.apple.com/design/human-interface-guidelines/lists-and-tables>

### Best practices

- `lists-and-tables/best-practices/prefer-displaying-text-in-a-list` **Do:** Prefer a list or table for text; use a collection when items differ widely in size or when many images are shown. **Why:** Rows make text easy to scan and read. · P simplicity · L attention, content · S compose · M d/d/t/t
- `lists-and-tables/best-practices/let-people-edit-a-table-when` **Do:** Allow editing of tables when it makes sense, such as reordering even if adding or removing isn't possible. **Why:** People appreciate being able to rearrange lists. · P agency · L interaction · S interact · M d/d/-/-
- `lists-and-tables/best-practices/provide-appropriate-feedback-when-people-select` **Do:** Show selection feedback that suits the list: persistent highlight for hierarchy navigation, brief highlight plus a checkmark for option lists. **Why:** Different tables need different cues about the path or the chosen state. · P familiarity · L interaction · S interact · M d/d/-/-
### Content

- `lists-and-tables/content/keep-item-text-succinct-so-row` **Do:** Keep list item text brief, or show only titles and reveal full content in a detail view. **Why:** Short text reduces truncation and wrapping, so rows are easier to scan. · P simplicity · L content · S write · M d/d/d/d
- `lists-and-tables/content/consider-ways-to-preserve-readability-of` **Do:** Keep clipped text recognizable, for example by placing an ellipsis in the middle so start and end remain visible. **Why:** Narrow tables shouldn't make items indistinguishable. · P simplicity · L content · S write · M d/d/t/t
- `lists-and-tables/content/use-descriptive-column-headings-in-a` **Do:** Give multicolumn tables column headings using nouns or short noun phrases in title-style capitalization, without ending punctuation; if single-column lacks a heading, add a label or header. **Why:** Headings give people context about the data. · P simplicity, familiarity · L content · S write · M d/d/t/t
### Style

- `lists-and-tables/style/choose-a-table-or-list-style` **Do:** Pick a table or list style that fits your data and the platform, since styles convey grouping, hierarchy or specific experiences. **Why:** Different styles help communicate structure on each platform. · P familiarity, flexibility · L platform, attention · S compose · M d/t/-/-
- `lists-and-tables/style/choose-a-row-style-that-fits` **Do:** Pick a row style matching the information in each row, for example a small leading image with a short label. **Why:** Rows should be arranged to suit their content. · P simplicity · L attention · S compose · M d/d/-/-
### Platform considerations > iOS, iPadOS, visionOS

- `lists-and-tables/platform-considerations/ios-ipados-visionos/use-an-info-button-only-to` [iOS, iPadOS, visionOS] **Do:** On iOS, iPadOS and visionOS, use an info button only to reveal more about a row; use a disclosure indicator to drill into subviews. **Why:** The info button doesn't provide hierarchical navigation. · P familiarity · L interaction, platform · S compose · M d/t/-/-
- `lists-and-tables/platform-considerations/ios-ipados-visionos/avoid-adding-an-index-to-a` [iOS, iPadOS, visionOS] **Do:** On these platforms, don't add an alphabetical index to a table whose rows have trailing controls like disclosure indicators. **Why:** Both sit on the trailing side, so people may trigger one while aiming for the other. · P flexibility · L interaction · S compose · M d/-/-/-
### Platform considerations > macOS

- `lists-and-tables/platform-considerations/macos/when-it-provides-value-let-people` [macOS] **Do:** On Mac, let people click a column heading to sort the table, and reverse the order if it is already sorted. **Why:** Sorting by column helps people find data when it adds value. · P agency · L interaction · S interact · M t/d/-/-
- `lists-and-tables/platform-considerations/macos/let-people-resize-columns` [macOS] **Do:** On Mac, allow resizing of table columns. **Why:** Data widths vary, and people can focus on areas or reveal clipped data. · P agency · L interaction, platform · S interact · M -/t/-/-
- `lists-and-tables/platform-considerations/macos/consider-using-alternating-row-colors-in` [macOS] **Do:** On Mac, consider alternating row colors in multicolumn tables. **Why:** They help people follow a row's values across columns, especially in wide tables. · P simplicity · L attention · S express · M t/d/t/-
- `lists-and-tables/platform-considerations/macos/use-an-outline-view-instead-of` [macOS] **Do:** On Mac, use an outline view rather than a table view for hierarchical data. **Why:** It adds disclosure triangles to expose nested levels. · P familiarity · L platform, attention · S compose · M t/d/-/-
### Platform considerations > tvOS

- `lists-and-tables/platform-considerations/tvos/confirm-that-images-near-a-table` [tvOS] **Do:** On Apple TV, check that images beside table rows look right when a focused row grows and gets rounded corners; don't add your own corner masks. **Why:** Focus effects change the row's corners, which affects neighboring images. · P craft · L platform, attention · S express · M -/-/-/-
### Platform considerations > watchOS

- `lists-and-tables/platform-considerations/watchos/when-possible-limit-the-number-of` [watchOS] **Do:** On Apple Watch, limit row counts, listing the most relevant items and offering a way to see more. **Why:** Short lists are easy to scan, but people may worry if expected items are missing. · P simplicity, flexibility · L platform, content · S compose · M t/-/-/-
- `lists-and-tables/platform-considerations/watchos/constrain-the-length-of-detail-views` [watchOS] **Do:** On Apple Watch, keep detail views short if you want vertical page-based navigation between rows. **Why:** Scrolling detail views block that swipe navigation, which saves time. · P simplicity · L flow, platform · S structure · M -/-/-/-

## Lockups (`lockups`)

Layout and organization · <https://developer.apple.com/design/human-interface-guidelines/lockups>

### Best practices

- `lockups/best-practices/allow-adequate-space-between-lockups` **Do:** On Apple TV, leave enough gap between lockups for a focused one to grow without overlapping others. **Why:** A focused lockup enlarges. · P craft · L attention · S compose · M -/t/-/-
- `lockups/best-practices/use-consistent-lockup-sizes-within-a` **Do:** Keep lockups in a row or group the same size. **Why:** Matching widths and heights look more appealing. · P craft · L attention · S compose · M t/t/t/t
### Monograms

- `lockups/monograms/prefer-images-over-initials` **Do:** When showing people in monograms, prefer a photo over initials. **Why:** An image creates a more personal connection than text. · P delight · L content · S express · M t/t/t/t

## Outline views (`outline-views`)

Layout and organization · <https://developer.apple.com/design/human-interface-guidelines/outline-views>

### Best practices

- `outline-views/best-practices/use-a-table-instead-of-an` **Do:** Use a plain table instead of an outline view for non-hierarchical data. **Why:** An outline view is intended for hierarchy. · P simplicity, familiarity · L attention · S compose · M t/t/-/-
- `outline-views/best-practices/expose-data-hierarchy-in-the-first` **Do:** Show hierarchy only in an outline view's first column, using other columns for attributes. **Why:** It keeps the structure readable. · P simplicity · L attention · S compose · M -/t/-/-
- `outline-views/best-practices/use-descriptive-column-headings-to-provide` **Do:** Give outline view columns descriptive headings of nouns or short noun phrases, without trailing colons, and add a label if a single column has none. **Why:** Headings give context to the data. · P simplicity, familiarity · L content · S write · M t/d/-/-
- `outline-views/best-practices/consider-letting-people-click-column-headings` **Do:** Consider click-to-sort column headings in outline views, sorting within each hierarchy level when the primary heading is used. **Why:** People can reorder data by any column. · P agency · L interaction · S interact · M t/d/-/-
- `outline-views/best-practices/let-people-resize-columns` **Do:** Let people resize outline view columns. **Why:** Data width varies, and wider data should be reachable. · P agency, flexibility · L interaction · S interact · M -/d/-/-
- `outline-views/best-practices/make-it-easy-for-people-to` **Do:** Make expanding and collapsing nested containers easy, for example with a modifier-click to open all subfolders. **Why:** It speeds up exploring the hierarchy. · P agency · L interaction · S interact · M t/d/-/-
- `outline-views/best-practices/retain-peoples-expansion-choices` **Do:** Remember which levels people expanded in an outline view and restore them next time. **Why:** People won't have to navigate back to the same place. · P agency, simplicity · L flow · S interact · M d/d/-/-
- `outline-views/best-practices/consider-using-alternating-row-colors-in` **Do:** Consider alternating row colors in wide multi-column outline views. **Why:** They help people track row values across columns. · P simplicity · L attention · S express · M t/d/-/-
- `outline-views/best-practices/let-people-edit-data-if-it` **Do:** Allow editing when appropriate: single-click to edit a cell, with other behaviors like double-click to open, and optional row reorder, add and remove. **Why:** People expect to edit cells directly. · P agency, familiarity · L interaction · S interact · M t/d/-/-
- `outline-views/best-practices/consider-using-a-centered-ellipsis-to` **Do:** Truncate cell text with an ellipsis in the middle instead of clipping it. **Why:** Keeping the start and end makes text more distinct and recognizable. · P simplicity · L content · S express · M d/d/t/t
- `outline-views/best-practices/consider-offering-a-search-field-to` **Do:** Offer a toolbar search field for finding values in long outline views. **Why:** It helps people find values fast. · P agency · L interaction, flow · S structure, interact · M t/d/-/-

## Split views (`split-views`)

Layout and organization · <https://developer.apple.com/design/human-interface-guidelines/split-views>

### Best practices

- `split-views/best-practices/to-support-navigation-persistently-highlight-the` **Do:** In a split view, keep the current selection highlighted in every pane leading to the detail view. **Why:** The highlight clarifies relationships between panes and keeps people oriented. · P familiarity, simplicity · L flow, attention · S interact · M t/d/-/-
- `split-views/best-practices/consider-letting-people-drag-and-drop` **Do:** Consider drag and drop between split view panes. **Why:** Multiple hierarchy levels are visible, so moving content by dragging is convenient. · P agency · L interaction · S interact · M t/d/-/-
### Platform considerations > iOS

- `split-views/platform-considerations/ios/prefer-using-a-split-view-in` [iOS] **Do:** On iOS, favor split views in regular size environments, not compact ones like iPhone portrait. **Why:** Narrow space makes panes wrap or truncate and hard to use. · P flexibility · L platform · S adapt · M d/t/-/-
### Platform considerations > iPadOS

- `split-views/platform-considerations/ipados/account-for-narrow-compact-and-intermediate` [iPadOS] **Do:** On iPad, design split views for narrow, compact and intermediate widths, keeping panes logically navigable. **Why:** iPad windows resize fluidly. · P flexibility · L platform, flow · S adapt · M d/d/-/-
### Platform considerations > macOS

- `split-views/platform-considerations/macos/set-reasonable-defaults-for-minimum-and` [macOS] **Do:** On Mac, set sensible minimum and maximum pane sizes so the divider stays visible. **Why:** A pane that gets too small can make the divider vanish and hard to use. · P craft · L interaction · S compose · M -/d/-/-
- `split-views/platform-considerations/macos/consider-letting-people-hide-a-pane` [macOS] **Do:** On Mac, consider letting people hide a pane, such as hiding side panes during editing. **Why:** It cuts distraction and gives editing more space. · P agency · L interaction · S interact · M -/d/-/-
- `split-views/platform-considerations/macos/provide-multiple-ways-to-reveal-hidden` [macOS] **Do:** On Mac, give several ways to bring back a hidden pane, such as a toolbar button or a menu command with a shortcut. **Why:** People can restore it however they prefer. · P agency, flexibility · L interaction · S interact · M -/d/-/-
- `split-views/platform-considerations/macos/prefer-the-thin-divider-style` [macOS] **Do:** On Mac, use the thin divider unless you have a specific reason for a thicker one. **Why:** It gives content maximum space while staying easy to use. · P simplicity · L attention · S express · M -/d/-/-
### Platform considerations > tvOS

- `split-views/platform-considerations/tvos/choose-a-split-view-layout-that` [tvOS] **Do:** On Apple TV, pick a split view proportion that balances the panes, either the default or half and half. **Why:** Balanced panes look right. · P craft · L attention · S compose · M -/-/-/-
- `split-views/platform-considerations/tvos/display-a-single-title-above-a` [tvOS] **Do:** On Apple TV, put one title above the split view describing the whole content, not titles per pane. **Why:** People already understand how split views work. · P simplicity · L content · S write · M t/t/-/-
- `split-views/platform-considerations/tvos/choose-the-titles-alignment-based-on` [tvOS] **Do:** On Apple TV, center the title when the secondary pane holds a collection; place it above the primary view when it holds one main view. **Why:** Placement should suit the content and give it room. · P craft · L attention · S compose · M t/t/-/-
### Platform considerations > visionOS

- `split-views/platform-considerations/visionos/to-display-supplementary-information-prefer-a` [visionOS] **Do:** On visionOS, use a split view rather than opening a new window for supplementary info. **Why:** It keeps context and avoids confusion. · P agency · L flow · S structure · M t/t/-/-
### Platform considerations > watchOS

- `split-views/platform-considerations/watchos/automatically-display-the-most-relevant-detail` [watchOS] **Do:** On Apple Watch, open with the most relevant detail view, based on location, time or recent actions. **Why:** People see the most pertinent information at launch. · P purpose, agency · L value, flow · S structure · M t/-/-/-
- `split-views/platform-considerations/watchos/if-your-app-displays-multiple-detail` [watchOS] **Do:** On Apple Watch, put multiple detail pages in a vertical tab view navigated with the Digital Crown, showing a page indicator. **Why:** The Digital Crown scrolls between tabs, and the indicator shows position. · P familiarity · L platform · S structure · M -/-/-/-

## Tab views (`tab-views`)

Layout and organization · <https://developer.apple.com/design/human-interface-guidelines/tab-views>

### Best practices

- `tab-views/best-practices/use-a-tab-view-to-present` **Do:** Use a tab view for closely related areas of content. **Why:** People expect tabs to hold similar or related content. · P familiarity · L flow · S structure · M t/d/-/-
- `tab-views/best-practices/make-sure-the-controls-within-a` **Do:** Make controls in a tab pane act only on that pane's content. **Why:** Panes are mutually exclusive and should be self-contained. · P simplicity, familiarity · L interaction · S compose · M t/d/-/-
- `tab-views/best-practices/provide-a-label-for-each-tab` **Do:** Name each tab with a noun or short noun phrase in title-style capitalization describing its pane's contents. **Why:** A good label helps people predict contents before opening a tab. · P simplicity · L content · S write · M d/d/-/-
- `tab-views/best-practices/avoid-using-a-pop-up-button` **Do:** Avoid a pop-up button to switch tabs, unless too many panes to show as tabs. **Why:** Tabs need one click and show all choices at once. · P simplicity · L interaction · S compose · M t/d/-/-
- `tab-views/best-practices/avoid-providing-more-than-six-tabs` **Do:** Keep tab views to six tabs or fewer; for more, consider presenting options in a pop-up button menu. **Why:** More than that is overwhelming and creates layout problems. · P simplicity · L attention · S structure · M t/d/-/-
### Anatomy

- `tab-views/anatomy/in-general-inset-a-tab-view` **Do:** On Mac, inset a tab view with window-body margin on all sides, rather than extending to the window edges. **Why:** The layout looks clean and leaves room for unrelated controls. · P craft · L attention · S compose · M -/d/-/-

## Activity views (`activity-views`)

Menus and actions · <https://developer.apple.com/design/human-interface-guidelines/activity-views>

### Best practices

- `activity-views/best-practices/avoid-creating-duplicate-versions-of-common` **Do:** Don't recreate system actions, such as Print, in an activity view; give similar custom actions a distinct specific title. **Why:** Duplicates are confusing since people can't tell yours from the system's. · P familiarity, simplicity · L content · S structure · M t/t/-/-
- `activity-views/best-practices/consider-using-a-symbol-to-represent` **Do:** Use a symbol for custom activities, or center a custom icon in about a 70x70 pixel area. **Why:** SF Symbols offers configurable symbols for concepts in an activity view. · P familiarity, craft · L attention · S express · M t/-/-/-
- `activity-views/best-practices/write-a-succinct-descriptive-title-for` **Do:** Give custom actions a short verb or verb phrase title without company or product name. **Why:** Long titles get wrapped and perhaps truncated. · P simplicity · L content · S write · M t/t/-/-
- `activity-views/best-practices/make-sure-activities-are-appropriate-for` **Do:** Show only activities relevant to the current context, excluding system ones that don't apply and choosing which custom ones to show. **Why:** It keeps the activity view applicable. · P simplicity, purpose · L value · S structure · M t/t/-/-
- `activity-views/best-practices/use-the-share-button-to-display` **Do:** Open the activity view from the Share button, not a different control. **Why:** People are used to this and a second route would confuse them. · P familiarity · L interaction · S compose · M d/t/-/-
### Share and action extensions

- `activity-views/share-and-action-extensions/if-necessary-create-a-custom-interface` **Do:** For extensions, use the system composition view for sharing; for action extensions, show your app name and app interface elements when presenting a custom UI. **Why:** People know the standard experience, and app cues show the extension is related to your app. · P familiarity · L interaction, content · S compose · M t/-/-/-
- `activity-views/share-and-action-extensions/streamline-and-limit-interaction` **Do:** Let extensions finish tasks in few steps, like posting with one tap. **Why:** People appreciate speed. · P simplicity, agency · L interaction, flow · S interact · M t/t/-/-
- `activity-views/share-and-action-extensions/avoid-placing-a-modal-view-above` **Do:** Don't stack extra modal views above an extension; an alert is acceptable if needed. **Why:** The extension is already displayed modally. · P agency · L flow · S interact · M t/t/-/-
- `activity-views/share-and-action-extensions/if-necessary-provide-an-image-that` **Do:** Add an image that conveys an extension's purpose if needed; a share extension shows the app icon, and an action extension should use a clear symbol or icon. **Why:** It gives confidence about who provided it and what it does. · P familiarity · L attention · S express · M t/-/-/-
- `activity-views/share-and-action-extensions/use-your-main-app-to-denote` **Do:** Let long extension tasks continue in the background and show progress in your main app; notify only for problems, not completion. **Why:** The activity view closes immediately after the task is finished. · P agency, simplicity · L flow, trust · S interact · M t/t/-/-

## Buttons (`buttons`)

Menus and actions · <https://developer.apple.com/design/human-interface-guidelines/buttons>

### Best practices

- `buttons/best-practices/make-buttons-easy-for-people-to` **Do:** Give buttons enough surrounding space and a hit region of at least 44x44 pt (60x60 in visionOS). **Why:** It helps tell them apart and makes them easy to activate with any input method. · P flexibility, craft · L inclusion, interaction · S compose · M d/d/-/-
- `buttons/best-practices/always-include-a-press-state-for` **Do:** Give every custom button a press state. **Why:** Otherwise the button feels unresponsive and people doubt their input registered. · P familiarity · L interaction · S interact · M d/d/-/-
### Style

- `buttons/style/in-general-use-a-button-that` **Do:** Style the most likely action in a view as prominent, keeping prominent buttons to one or two. **Why:** Color draws attention, but too many raise cognitive load. · P purpose, simplicity · L attention · S compose, express · M d/d/t/t
- `buttons/style/use-style-not-size-to-visually` **Do:** Make options equal in size and use style to signal the preferred one, with a more prominent style for it. **Why:** Same-sized buttons form a set, while different sizes look confusing and inconsistent. · P simplicity, familiarity · L attention · S express · M d/d/t/t
- `buttons/style/avoid-applying-a-similar-color-to` **Do:** Don't color button labels similarly to the content beneath; with colorful content, keep default monochrome labels. **Why:** Similar colors reduce contrast between controls and content. · P simplicity · L attention · S express · M t/t/-/-
### Content

- `buttons/content/ensure-that-each-button-clearly-communicates` **Do:** Make sure every button's purpose is obvious through a symbol, a text label or both. **Why:** People need to understand what it does. · P simplicity, familiarity · L content, interaction · S compose, write · M d/d/t/t
- `buttons/content/try-to-associate-familiar-actions-with` **Do:** Use familiar icons for familiar actions, preferably standard symbols. **Why:** People can predict what a recognized icon does. · P familiarity · L content, attention · S express · M d/d/d/d
- `buttons/content/consider-using-text-when-a-short` **Do:** Use a short label, ideally starting with a verb, when words are clearer than an icon. **Why:** A short specific label removes guesswork about what the button does. · P simplicity · L content, attention · S write, compose · M d/d/t/t
### Role

- `buttons/role/assign-the-primary-role-to-the` **Do:** Give the primary role to the button people most likely choose, so Return confirms it and can close temporary views. **Why:** It lets people confirm choices fast. · P agency, familiarity · L interaction · S interact · M d/d/-/-
- `buttons/role/dont-assign-the-primary-role-to` **Do:** Don't make a destructive button the primary one, even if it's the most likely choice. **Why:** Prominent buttons are sometimes chosen unread, which could cost people their content. · P responsibility, agency · L interaction, trust · S interact · M d/d/-/-
### Platform considerations > iOS, iPadOS

- `buttons/platform-considerations/ios-ipados/configure-a-button-to-display-an` [iOS, iPadOS] **Do:** On iOS and iPadOS, show an activity indicator in a button for actions that take time, optionally changing its label. **Why:** It saves space and explains the delay. · P familiarity, simplicity · L interaction, flow · S interact · M d/d/-/-
### Platform considerations > macOS > Push buttons

- `buttons/platform-considerations/macos/push-buttons/use-a-flexible-height-push-button` [macOS] **Do:** On Mac, use a flexible-height push button only for tall or multi-line content; otherwise a standard one. **Why:** They match regular buttons visually. · P simplicity, familiarity · L platform · S compose · M -/t/-/-
- `buttons/platform-considerations/macos/push-buttons/append-a-trailing-ellipsis-to-the` [macOS] **Do:** On Mac, end a push button's title with an ellipsis when it opens another window, view or app. **Why:** An ellipsis signals more input will be requested. · P familiarity · L content, platform · S write · M -/t/-/-
- `buttons/platform-considerations/macos/push-buttons/consider-supporting-spring-loading` [macOS] **Do:** On Mac, consider spring loading so dragged items can activate a button via force click without dropping. **Why:** People can continue dragging for further actions. · P agency, flexibility · L interaction · S interact · M -/-/-/-
### Platform considerations > macOS > Square buttons

- `buttons/platform-considerations/macos/square-buttons/use-square-buttons-in-a-view` [macOS] **Do:** On Mac, place square buttons within a view, not in toolbars or status bars; use toolbar items there. **Why:** Square buttons aren't intended for the window frame. · P familiarity · L platform · S compose · M -/t/-/-
- `buttons/platform-considerations/macos/square-buttons/prefer-using-a-symbol-in-a` [macOS] **Do:** On Mac, use symbols in square buttons. **Why:** They get appropriate coloring automatically by state and interaction. · P familiarity, simplicity · L attention · S express · M -/t/-/-
- `buttons/platform-considerations/macos/square-buttons/avoid-using-labels-to-introduce-square` [macOS] **Do:** On Mac, don't add introductory labels to square buttons. **Why:** They are tied to a specific view, so their purpose is clear. · P simplicity · L content · S write · M -/t/-/-
### Platform considerations > macOS > Help buttons

- `buttons/platform-considerations/macos/help-buttons/use-the-system-provided-help-button` [macOS] **Do:** On Mac, open your help documentation with the system help button. **Why:** People recognize it and know it opens help. · P familiarity · L interaction · S compose · M -/t/-/-
- `buttons/platform-considerations/macos/help-buttons/when-possible-open-the-help-topic` [macOS] **Do:** On Mac, open the help topic for the current context, or the top of your help if none matches. **Why:** It takes people to relevant help. · P agency, purpose · L flow · S interact · M t/d/-/-
- `buttons/platform-considerations/macos/help-buttons/include-no-more-than-one-help` [macOS] **Do:** On Mac, place only one help button per window. **Why:** Multiple ones make results unpredictable. · P simplicity, familiarity · L interaction · S compose · M -/t/-/-
- `buttons/platform-considerations/macos/help-buttons/position-help-buttons-where-people-expect` [macOS] **Do:** On Mac, put help buttons in expected spots, such as the lower corner opposite dismissal buttons in dialogs or lower corners in settings. **Why:** People look there. · P familiarity · L attention · S compose · M -/t/-/-
- `buttons/platform-considerations/macos/help-buttons/use-a-help-button-within-a` [macOS] **Do:** On Mac, put a help button inside the view rather than the toolbar or status bar. **Why:** Help buttons belong in the view content. · P familiarity · L platform · S compose · M -/t/-/-
- `buttons/platform-considerations/macos/help-buttons/avoid-displaying-text-that-introduces-a` [macOS] **Do:** On Mac, skip descriptive text introducing a help button. **Why:** People already know what it does. · P simplicity · L content · S write · M -/t/-/-
### Platform considerations > macOS > Image buttons

- `buttons/platform-considerations/macos/image-buttons/use-an-image-button-in-a` [macOS] **Do:** On macOS, put image buttons inside a view's content area rather than the window frame; in a toolbar, use a toolbar item. **Why:** Toolbars and status bars have their own component for this, so an image button there departs from the convention. · P familiarity · L platform, interaction · S compose · M -/t/-/-
- `buttons/platform-considerations/macos/image-buttons/include-about-10-pixels-of-padding` [macOS] **Do:** On macOS, leave roughly 10 pixels of padding between an image and its button edges, and skip the system border. **Why:** The button's edges set the clickable area even when invisible, so padding lets imprecise clicks still register. · P craft, flexibility · L interaction, platform · S compose · M t/d/-/-
- `buttons/platform-considerations/macos/image-buttons/if-you-need-to-include-a` [macOS] **Do:** On macOS, when an image button needs a label, place the label underneath the image. · P familiarity · L platform, attention · S compose · M t/t/-/-
### Platform considerations > visionOS

- `buttons/platform-considerations/visionos/prefer-buttons-that-have-a-discernible` [visionOS] **Do:** On visionOS, enclose buttons in a contrasting filled shape, except inside toolbars, menus, alerts or ornaments; use thin material over glass windows, glass material when floating. **Why:** A button inside a contrasting filled shape is easier to see. · P flexibility, craft · L attention, platform · S express · M -/-/-/-
- `buttons/platform-considerations/visionos/avoid-creating-a-custom-button-that` [visionOS] **Do:** On visionOS, don't style a custom button with a white fill and dark text or icons. **Why:** The system uses that exact look to show a toggled-on state. · P familiarity · L platform, interaction · S express · M -/-/-/-
- `buttons/platform-considerations/visionos/in-general-prefer-circular-or-capsule` [visionOS] **Do:** On visionOS, favor circular or capsule buttons, and use a capsule when a button stands alone. **Why:** Eyes drift toward corners; rounder shapes make it easier to keep looking at the center. · P flexibility, craft · L platform, interaction · S express · M -/-/-/-
- `buttons/platform-considerations/visionos/provide-enough-space-around-a-button` [visionOS] **Do:** On visionOS, keep button centers at least 60 pts apart, add 4 pts padding to buttons 60 pts or larger, and avoid stacking small buttons. **Why:** Spacing makes buttons easy to look at and stops hover effects from overlapping. · P flexibility, craft · L interaction, platform · S compose · M -/-/-/-
- `buttons/platform-considerations/visionos/choose-the-right-shape-if-you` [visionOS] **Do:** On visionOS, use rounded rectangles for vertical stacks of text buttons and capsules for horizontal rows. · P familiarity, craft · L platform, attention · S compose · M -/-/-/-
- `buttons/platform-considerations/visionos/use-standard-controls-to-take-advantage` [visionOS] **Do:** On visionOS, rely on standard controls so people hear the click sounds they already recognize. **Why:** Sound feedback matters more here because the system produces no haptics. · P familiarity, flexibility · L interaction, platform · S interact · M -/-/-/-
### Platform considerations > watchOS

- `buttons/platform-considerations/watchos/use-a-toolbar-to-place-buttons` [watchOS] **Do:** On Apple Watch, place corner buttons through a toolbar so the system adjusts the time and title around them. **Why:** The system handles spacing and gives toolbar buttons a Liquid Glass look that separates them from content. · P familiarity, craft · L platform, attention · S compose · M -/-/-/-
- `buttons/platform-considerations/watchos/prefer-buttons-that-span-the-width` [watchOS] **Do:** On Apple Watch, give primary actions full-width buttons; if two share a row, match heights and use images or short titles. **Why:** Full-width buttons look better and are easier to tap. · P flexibility, simplicity · L interaction, platform · S compose · M t/-/-/-
- `buttons/platform-considerations/watchos/use-toolbar-buttons-to-provide-either` [watchOS] **Do:** On Apple Watch, use toolbar buttons for links to related areas or for contextual actions tied to the current content. **Why:** They offer extra information or secondary actions related to the view. · P simplicity, familiarity · L flow, platform · S structure · M -/-/-/-
- `buttons/platform-considerations/watchos/use-the-same-height-for-vertical` [watchOS] **Do:** On Apple Watch, make stacked text buttons the same height whether their labels take one line or two. **Why:** Identical heights keep the look consistent. · P craft, familiarity · L attention, platform · S compose · M -/-/-/-

## Context menus (`context-menus`)

Menus and actions · <https://developer.apple.com/design/human-interface-guidelines/context-menus>

### Best practices

- `context-menus/best-practices/prioritize-relevancy-when-choosing-items-to` **Do:** Fill a context menu with the commands most likely needed in the current context, leaving out advanced or rarely used ones. **Why:** A context menu exists for quick access to what people probably need right now. · P purpose, simplicity · L value, interaction · S compose · M d/d/-/-
- `context-menus/best-practices/aim-for-a-small-number-of` **Do:** Keep the number of items in a context menu small. **Why:** A long menu is hard to scan and scroll. · P simplicity · L attention, interaction · S compose · M d/d/-/-
- `context-menus/best-practices/support-context-menus-consistently-throughout-your` **Do:** Offer context menus uniformly across the app rather than on some items and not others. **Why:** Inconsistent support leaves people unsure where the feature works and suspecting something is broken. · P familiarity · L interaction · S interact · M d/d/-/-
- `context-menus/best-practices/always-make-context-menu-items-available` **Do:** Make every context menu command reachable elsewhere too, such as a toolbar or menu bar. **Why:** Context menus are hidden shortcuts; other routes keep commands reachable for people who don't open them. · P agency, flexibility · L interaction, inclusion · S structure, interact · M d/d/-/-
- `context-menus/best-practices/if-you-need-to-use-submenus` **Do:** If submenus are needed, nest only one level deep and title each so people can guess its contents before opening. **Why:** Deeper nesting complicates the experience and is hard to navigate. · P simplicity · L flow, content · S structure, write · M d/d/-/-
- `context-menus/best-practices/hide-unavailable-menu-items-dont-dim` **Do:** Remove inapplicable context menu items instead of dimming them; on macOS, Cut, Copy and Paste may appear dimmed. **Why:** A context menu shows only actions relevant to the selected content, unlike a regular menu that teaches what exists. · P simplicity, familiarity · L attention, interaction · S interact · M d/d/-/-
- `context-menus/best-practices/aim-to-place-the-most-frequently` **Do:** Put the most-used items nearest the point where the menu opens, flipping the order if the menu opens above the content. **Why:** People tend to start reading from the part closest to their finger or pointer. · P simplicity, flexibility · L attention, interaction · S compose · M d/d/-/-
- `context-menus/best-practices/show-keyboard-shortcuts-in-your-apps` **Do:** Display keyboard shortcuts in the main menus, not within context menus. **Why:** Context menus already serve as a shortcut to task commands, so listing keys again is redundant. · P simplicity · L interaction, content · S compose · M -/t/-/-
- `context-menus/best-practices/follow-best-practices-for-using-separators` **Do:** Use separators to group context menu items, with no more than about three groups. **Why:** Grouping helps people scan the menu faster. · P simplicity · L attention · S compose · M d/d/-/-
- `context-menus/best-practices/in-ios-ipados-and-visionos-warn` **Do:** On iOS, iPadOS and visionOS, put data-destroying items like Delete last in the menu and mark them as destructive. **Why:** Flagging them, with red text from the system, warns people before they lose data. · P responsibility, agency · L trust, interaction · S interact · M d/t/-/-
### Content

- `context-menus/content/include-a-title-in-a-context` **Do:** Give a context menu a title only when it clarifies what the menu will affect, such as the count of selected items. **Why:** A title can remind people that a chosen command applies to everything they selected. · P simplicity, responsibility · L content · S write · M d/d/-/-
- `context-menus/content/represent-menu-item-actions-with-familiar` **Do:** Mark menu actions with the same icons the system uses for common commands like Copy, Share and Delete, everywhere. **Why:** Familiar icons help people recognize common actions across the app. · P familiarity · L content, attention · S express · M d/d/-/-
### Platform considerations > iOS, iPadOS

- `context-menus/platform-considerations/ios-ipados/provide-either-a-context-menu-or` [iOS, iPadOS] **Do:** On iOS and iPadOS, attach either a context menu or an edit menu to an item, never both. **Why:** Both together confuse people and make it hard for the system to tell what they intend. · P simplicity, familiarity · L interaction, platform · S interact · M d/t/-/-
- `context-menus/platform-considerations/ios-ipados/in-ipados-consider-using-a-context` [iOS, iPadOS] **Do:** On iPadOS, consider letting people create new objects through a context menu opened by long press or secondary click. · P agency, familiarity · L interaction, platform · S interact · M t/t/-/-
- `context-menus/platform-considerations/ios-ipados/prefer-a-graphical-preview-that-clarifies` [iOS, iPadOS] **Do:** On iOS and iPadOS, show a preview of the targeted content with the menu so its commands clearly apply to the right item. **Why:** The preview helps people confirm they're working on the item they intended. · P responsibility, familiarity · L attention, platform · S express · M d/t/-/-
- `context-menus/platform-considerations/ios-ipados/ensure-that-your-preview-looks-good` [iOS, iPadOS] **Do:** On iOS and iPadOS, match the preview's clipping path to its image shape so corners and contours stay steady while it animates. **Why:** Otherwise the shape appears to change during the reveal animation. · P craft, delight · L attention, platform · S express, interact · M d/-/-/-
### Platform considerations > visionOS

- `context-menus/platform-considerations/visionos/consider-using-a-context-menu-instead` [visionOS] **Do:** On visionOS, show frequently used functions in a context menu instead of opening a separate panel or inspector window. **Why:** Fewer separate windows or views keep people's space uncluttered. · P simplicity · L flow, platform · S structure · M -/-/-/-
- `context-menus/platform-considerations/visionos/in-general-avoid-letting-a-context` [visionOS] **Do:** On visionOS, keep a context menu no taller than its window, and size the item count to how people use the app. **Why:** A taller menu could cover system controls above and below the window; specialist users tolerate long menus, simple-task users prefer short ones. · P flexibility, simplicity · L platform, attention · S compose · M -/-/-/-

## Dock menus (`dock-menus`)

Menus and actions · <https://developer.apple.com/design/human-interface-guidelines/dock-menus>

### Best practices

- `dock-menus/best-practices/make-custom-dock-menu-items-available` **Do:** On macOS, offer each custom Dock menu command in other places too, such as menu bar menus or the interface. **Why:** Not everyone uses the Dock menu. · P flexibility, agency · L platform, interaction · S structure · M -/-/-/-
- `dock-menus/best-practices/prefer-high-value-custom-items-for` **Do:** On macOS, fill the Dock menu with valuable items like open windows and top actions useful when the app isn't frontmost. **Why:** These give a convenient way to jump to a window or act without opening the app first. · P purpose, simplicity · L value, platform · S define, compose · M -/-/-/-

## Edit menus (`edit-menus`)

Menus and actions · <https://developer.apple.com/design/human-interface-guidelines/edit-menus>

### Best practices

- `edit-menus/best-practices/prefer-the-system-provided-edit-menu` **Do:** Use the built-in edit menu rather than building a custom one with the same commands. **Why:** People already know the system component, so a duplicate is redundant and likely to confuse. · P familiarity, simplicity · L interaction · S compose · M d/t/-/-
- `edit-menus/best-practices/let-people-reveal-an-edit-menu` **Do:** Open the edit menu with the system's standard gestures for each platform, never a custom one. **Why:** People dislike learning a custom interaction for a standard task. · P familiarity · L interaction, platform · S interact · M d/t/-/-
- `edit-menus/best-practices/offer-commands-that-are-relevant-in` **Do:** Show only commands that apply right now, hiding or dimming ones like Copy without a selection or Paste with nothing to paste. · P simplicity, familiarity · L interaction, attention · S interact · M d/t/-/-
- `edit-menus/best-practices/list-custom-commands-near-relevant-system` **Do:** Place custom commands right after related system commands, and keep their count modest. **Why:** This preserves the order people expect and avoids overwhelming them. · P familiarity, simplicity · L attention, interaction · S compose · M d/t/-/-
- `edit-menus/best-practices/when-it-makes-sense-let-people` **Do:** Where sensible, allow selecting and copying static text such as captions or statuses, but not control labels. **Why:** People like pasting static content into messages, notes or searches. · P agency · L interaction, content · S interact · M d/d/-/-
- `edit-menus/best-practices/support-undo-and-redo-when-possible` **Do:** Support undo and redo for edit menu actions whenever you can. **Why:** Edit menu actions run without confirmation, so undo and redo let people recover an earlier state. · P agency · L flow, interaction · S interact · M d/d/-/-
- `edit-menus/best-practices/in-general-avoid-implementing-other-controls` **Do:** Generally avoid adding extra controls that duplicate edit menu commands. **Why:** People expect the edit menu or standard shortcuts, and duplicates crowd the interface, leaving less room for less familiar actions. · P simplicity, familiarity · L attention, interaction · S compose · M d/d/-/-
- `edit-menus/best-practices/differentiate-different-types-of-deletion-commands` **Do:** When needed, make deletion variants distinct, such as Delete versus Cut, which also copies the content to the pasteboard. · P simplicity, familiarity · L content, interaction · S write, interact · M d/d/-/-
### Content

- `edit-menus/content/create-short-labels-for-custom-commands` **Do:** Name custom commands with a verb or brief verb phrase that tersely states the action. **Why:** Short verb labels convey the action concisely. · P simplicity · L content · S write · M d/d/t/t
### Platform considerations > iOS, iPadOS

- `edit-menus/platform-considerations/ios-ipados/ensure-your-edit-menu-works-well` [iOS, iPadOS] **Do:** On iOS and iPadOS, check that your edit menu works in both the compact horizontal and vertical styles. **Why:** The system picks the style based on touch gestures versus keyboard or pointer input. · P flexibility · L interaction, platform · S adapt · M d/-/-/-
- `edit-menus/platform-considerations/ios-ipados/adjust-an-edit-menus-placement-if` [iOS, iPadOS] **Do:** On iOS and iPadOS, reposition the edit menu if the default spot would cover important content or interface parts. **Why:** Default placement may hide important content. · P craft, flexibility · L attention, platform · S compose · M d/-/-/-

## Home Screen quick actions (`home-screen-quick-actions`)

Menus and actions · <https://developer.apple.com/design/human-interface-guidelines/home-screen-quick-actions>

### Best practices

- `home-screen-quick-actions/best-practices/create-quick-actions-for-compelling-high` **Do:** Offer quick actions for valuable tasks, at least one useful action and up to four in total. **Why:** People expect every app to offer at least one useful quick action that saves opening the app first. · P purpose · L value, platform · S define · M t/-/-/-
- `home-screen-quick-actions/best-practices/avoid-making-unpredictable-changes-to-quick` **Do:** If quick actions update dynamically with location, activity, time or settings, make the changes predictable to people. **Why:** Predictable changes keep actions relevant without surprising people. · P familiarity, simplicity · L interaction, platform · S interact · M t/-/-/-
- `home-screen-quick-actions/best-practices/for-each-quick-action-provide-a` **Do:** Title each quick action briefly so its result is obvious; add a subtitle for context, omit the app name, avoid truncation and plan for localization. **Why:** A clear title lets people understand what happens when they pick the action. · P simplicity, flexibility · L content, inclusion · S write · M t/-/-/-
- `home-screen-quick-actions/best-practices/provide-a-familiar-interface-icon-for` **Do:** Give every quick action a recognizable interface icon, preferably an SF Symbol; custom ones should follow the Quick Action Icon Template. **Why:** Familiar icons make common actions easy to recognize. · P familiarity, craft · L content, platform · S express · M t/-/-/-
- `home-screen-quick-actions/best-practices/dont-use-an-emoji-in-place` **Do:** Don't substitute an emoji for a symbol or interface icon in a quick action. **Why:** Emojis are full color, while quick action symbols are single-color and adapt in Dark Mode to keep contrast. · P craft, flexibility · L attention, inclusion · S express · M t/-/-/-

## Menus (`menus`)

Menus and actions · <https://developer.apple.com/design/human-interface-guidelines/menus>

### Labels

- `menus/labels/for-each-menu-item-write-a` **Do:** Word each menu item clearly and briefly, starting action items with a verb and matching your product's tone. **Why:** Clear verb labels tell people what each item does. · P simplicity · L content · S write · M d/d/-/-
- `menus/labels/to-be-consistent-with-platform-experiences` **Do:** Capitalize menu labels in title style, even if a game otherwise writes in a different style. **Why:** It keeps labels consistent with what people see across the platform. · P familiarity · L content · S write · M d/d/t/t
- `menus/labels/remove-articles-like-a-an-and` **Do:** Drop articles such as a, an and the from English menu labels. **Why:** They lengthen labels while rarely helping understanding. · P simplicity · L content · S write · M d/d/d/d
- `menus/labels/show-people-when-a-menu-item` **Do:** Make unavailable menu items look inactive, usually dimmed, and keep a menu openable even when all its items are unavailable. **Why:** People can then open the menu and learn which commands exist. · P familiarity, agency · L interaction, attention · S interact · M d/d/-/-
- `menus/labels/append-an-ellipsis-to-a-menu` **Do:** End a menu item's label with an ellipsis when the action needs more input or choices before it completes. **Why:** The ellipsis signals that another step, usually in a different view, is coming. · P familiarity, responsibility · L content, interaction · S write · M d/d/-/-
### Icons

- `menus/icons/represent-common-actions-consistently` **Do:** Use the system's standard icons for common actions like Share, Print and Search. **Why:** Standard icons make the app easier to use and more familiar. · P familiarity · L interaction, content · S express · M d/d/-/-
- `menus/icons/use-menu-item-icons-sparingly-and` **Do:** Add menu icons selectively, for key actions, locations, devices, visual concepts or user content, and skip them when none clearly fits. **Why:** Icons speed up finding items and clarify effects, but unrelated symbols add noise. · P simplicity, purpose · L attention, content · S express · M d/d/-/-
- `menus/icons/apply-a-uniform-visual-treatment-across` **Do:** Within one menu group, give every item an icon or none of them. **Why:** Uniform treatment gives visual consistency and balance. · P craft, familiarity · L attention · S express · M d/d/-/-
### Organization

- `menus/organization/prefer-listing-important-or-frequently-used` **Do:** List important or frequently used menu items at the top. **Why:** People begin scanning at the top, so they can find what they need without reading everything. · P simplicity, purpose · L attention, value · S compose · M d/d/d/d
- `menus/organization/consider-grouping-logically-related-items` **Do:** Cluster logically related menu items and divide the groups with separators. **Why:** Grouping helps people remember where commands are and see the groups. · P simplicity, familiarity · L attention · S compose · M d/d/d/d
- `menus/organization/prefer-keeping-all-logically-related-commands` **Do:** Keep related commands in one group even when some are used far less than others. **Why:** People expect to find a rarely used variant alongside its familiar, more common siblings. · P familiarity, simplicity · L attention, interaction · S compose · M d/d/-/-
- `menus/organization/be-mindful-of-menu-length` **Do:** Keep menus short by splitting them or using a submenu; long menus are fine for user-defined or generated content, scrolling included. **Why:** Long menus cost time and attention, so people may miss the command they want; users expect growing lists to hold everything they add. · P simplicity · L attention, interaction · S compose · M d/d/-/-
### Submenus

- `menus/submenus/use-submenus-sparingly` **Do:** Use submenus rarely, for example when a term repeats across more than two items in a group, and reuse that term in the parent label. **Why:** Each submenu adds complexity and hides its items; the shared term lets people predict the contents. · P simplicity · L flow, content · S structure · M d/d/-/-
- `menus/submenus/limit-the-depth-and-length-of` **Do:** Limit submenus to one level and, past roughly five items, make a separate menu instead. **Why:** Opening several nested levels is difficult for people. · P simplicity · L flow, interaction · S structure · M d/d/-/-
- `menus/submenus/make-sure-a-submenu-remains-available` **Do:** Keep a submenu item openable even if everything nested inside it is unavailable. **Why:** Opening it is how people find out which commands sit inside. · P familiarity, agency · L interaction · S interact · M d/d/-/-
- `menus/submenus/prefer-using-a-submenu-to-indenting` **Do:** Show item relationships with a submenu, not by indenting menu items. **Why:** Indentation clashes with the system and doesn't clearly convey the relationship. · P familiarity, simplicity · L attention · S compose · M d/d/-/-
### Toggled items

- `menus/toggled-items/consider-using-a-changeable-label-that` **Do:** Use one menu item whose label flips, such as Show Map and Hide Map, rather than two separate items. **Why:** One item whose wording follows the current state avoids redundant entries. · P simplicity · L content, interaction · S write · M d/d/-/-
- `menus/toggled-items/include-a-verb-if-a-changeable` **Do:** Add a verb to a changeable label, like Turn HDR On, when people could mistake it for a state rather than an action. **Why:** Bare labels can leave people unsure whether they describe an action or a state. · P simplicity · L content · S write · M d/d/-/-
- `menus/toggled-items/if-necessary-display-both-menu-items` **Do:** When people benefit from seeing both options, list both items and leave only the applicable one available. **Why:** Seeing both actions or states together can help people. · P simplicity, agency · L content, interaction · S write, compose · M d/d/-/-
- `menus/toggled-items/consider-using-a-checkmark-to-show` **Do:** Mark attributes currently in effect with a checkmark in the menu. **Why:** Checkmarks are easy to scan for, so selected items stand out. · P familiarity, simplicity · L attention, interaction · S express · M d/d/-/-
- `menus/toggled-items/consider-offering-a-menu-item-that` **Do:** When several toggled attributes can stack, add one item like Plain that clears them all at once. **Why:** One command is faster than removing each attribute separately. · P agency, simplicity · L interaction · S interact · M d/d/-/-
### In-game menus

- `menus/in-game-menus/let-players-navigate-in-game-menus` **Do:** Let players move through game menus with the device's normal input, such as touch on iOS and iPadOS or gestures on visionOS. **Why:** People expect the same interactions they use for other menus on that device. · P familiarity · L interaction, platform · S interact · M d/t/-/-
- `menus/in-game-menus/make-sure-your-menus-remain-easy` **Do:** Check that menus stay easy to open and read on every supported platform, enlarging tap targets or changing presentation when scaled content gets too small. **Why:** Scaling to a smaller screen can make menus too tiny to read or hit. · P flexibility, craft · L inclusion, interaction · S adapt · M d/d/t/-
### Platform considerations > iOS, iPadOS

- `menus/platform-considerations/ios-ipados/choose-a-small-or-medium-menu` [iOS, iPadOS] **Do:** On iOS and iPadOS, use the medium layout for about three key actions and the small layout only for tightly related groups, with recognizable symbols. **Why:** These layouts streamline choices and let symbols identify actions without labels. · P simplicity, familiarity · L interaction, platform · S compose · M t/-/-/-
### Platform considerations > visionOS

- `menus/platform-considerations/visionos/prefer-displaying-a-menu-near-the` [visionOS] **Do:** On visionOS, show a menu close to the content it affects. **Why:** People look at an item before tapping, so a distant target could make them miss the effect. · P flexibility, craft · L interaction, platform · S compose · M -/-/-/-
- `menus/platform-considerations/visionos/prefer-the-subtle-breakthrough-effect-in` [visionOS] **Do:** On visionOS, default to the subtle breakthrough effect for menus over 3D content; use prominent or none only for specific needs. **Why:** Subtle blends the menu with the scene, keeping it usable; prominent can disturb or cause discomfort, and none can hide the menu. · P flexibility, craft · L attention, platform · S express · M -/-/-/-

## Ornaments (`ornaments`)

Menus and actions · <https://developer.apple.com/design/human-interface-guidelines/ornaments>

### Best practices

- `ornaments/best-practices/consider-using-an-ornament-to-present` **Do:** On visionOS, place frequently needed controls or info in an ornament attached to the window. **Why:** It stays beside its window, so people always know where to find it without clutter. · P familiarity, simplicity · L attention, platform · S compose · M -/t/-/-
- `ornaments/best-practices/in-general-keep-an-ornament-visible` **Do:** On visionOS, keep ornaments visible, hiding them only during immersive content like video or photos. **Why:** People value steady access to the controls. · P familiarity, agency · L interaction, platform · S interact · M -/-/-/-
- `ornaments/best-practices/if-you-need-to-display-multiple` **Do:** On visionOS, with multiple ornaments, balance the window visually, limit their total, and move elements back into the window if one is removed. **Why:** Ornaments can distract from content and add visual weight, making the app feel more complicated. · P simplicity, craft · L attention, platform · S compose · M -/-/-/-
- `ornaments/best-practices/aim-to-keep-an-ornaments-width` **Do:** On visionOS, make an ornament no wider than its window. **Why:** A wider ornament can collide with a tab bar or other vertical content at the window's side. · P craft · L attention, platform · S compose · M -/-/-/-
- `ornaments/best-practices/consider-using-borderless-buttons-in-an` **Do:** On visionOS, consider borderless buttons in ornaments, since the glass background may make borders unnecessary. **Why:** Placed directly on glass, a button is visible without a border and still gets the hover effect. · P simplicity, craft · L attention, platform · S express · M -/-/-/-
- `ornaments/best-practices/use-system-provided-toolbars-and-tab` **Do:** On visionOS, use the built-in toolbars and tab bars, which already become ornaments, unless you need custom components. **Why:** The system already presents them as ornaments, so building one yourself is unnecessary. · P familiarity, simplicity · L platform · S compose · M -/-/-/-

## Pop-up buttons (`pop-up-buttons`)

Menus and actions · <https://developer.apple.com/design/human-interface-guidelines/pop-up-buttons>

### Best practices

- `pop-up-buttons/best-practices/use-a-pop-up-button-to` **Do:** Use a pop-up button for a flat set of mutually exclusive options or states; choose a pull-down button for actions, multi-select or submenus. **Why:** A pop-up button suits choices that change content or the surrounding view. · P familiarity, simplicity · L interaction · S compose · M d/d/-/-
- `pop-up-buttons/best-practices/provide-a-useful-default-selection` **Do:** Preselect the option most people will likely want as the pop-up button's default. **Why:** Before any choice is made, the button shows the default, so a likely one saves effort. · P simplicity, agency · L interaction, value · S interact · M d/d/-/-
- `pop-up-buttons/best-practices/give-people-a-way-to-predict` **Do:** Let people anticipate a pop-up button's options without opening it, using an introductory label or a label describing its effect. **Why:** Context around the options helps people know what they'll find. · P simplicity, familiarity · L content · S write · M d/d/-/-
- `pop-up-buttons/best-practices/consider-using-a-pop-up-button` **Do:** Choose a pop-up button when space is tight and not every option must show at once. **Why:** It presents many choices in little space. · P simplicity, flexibility · L attention, interaction · S compose · M d/d/-/-
- `pop-up-buttons/best-practices/if-necessary-include-a-custom-option` **Do:** If useful, add a Custom entry in the menu for occasional extras, optionally with explanatory text beneath the list. **Why:** It keeps rarely needed items and controls from cluttering the interface. · P simplicity · L interaction, content · S compose, write · M d/d/-/-
### Platform considerations > iPadOS

- `pop-up-buttons/platform-considerations/ipados/within-a-popover-or-modal-view` [iPadOS] **Do:** On iPadOS in a popover or modal, consider a pop-up button rather than a disclosure indicator when a list item has a small, well-defined set of options. **Why:** People pick an option right away without going to a detail view. · P agency, simplicity · L flow, platform · S interact, structure · M t/t/-/-

## Pull-down buttons (`pull-down-buttons`)

Menus and actions · <https://developer.apple.com/design/human-interface-guidelines/pull-down-buttons>

### Best practices

- `pull-down-buttons/best-practices/use-a-pull-down-button-to` **Do:** Use a pull-down button's menu for commands tied to the button's action, such as picking what to add or sort by; use pop-up for non-command exclusive choices. **Why:** The menu refines the button's target or behavior without extra buttons in the interface. · P simplicity, purpose · L interaction · S compose · M d/d/-/-
- `pull-down-buttons/best-practices/avoid-putting-all-of-a-views` **Do:** Don't hide every action of a view inside one pull-down button. **Why:** Primary actions must be easy to discover, not buried behind a menu people must open first. · P simplicity, agency · L attention, interaction · S compose · M d/d/-/-
- `pull-down-buttons/best-practices/balance-menu-length-with-ease-of` **Do:** Give a pull-down menu at least three items; for one or two, use buttons, toggles or switches; avoid very long menus. **Why:** Opening a menu should feel worthwhile, while too many items slow down finding one. · P simplicity · L interaction, attention · S compose · M d/d/-/-
- `pull-down-buttons/best-practices/display-a-succinct-menu-title-only` **Do:** Add a short menu title to a pull-down button only when it contributes real meaning. **Why:** The button and descriptive items usually give enough context already. · P simplicity · L content · S write · M d/d/-/-
- `pull-down-buttons/best-practices/let-people-know-when-a-pull` **Do:** Flag destructive pull-down items (red text) and require confirmation, via action sheet on iOS or popover on iPadOS. **Why:** A confirmation shown elsewhere that needs deliberate dismissal helps prevent accidental data loss. · P responsibility, agency · L trust, interaction · S interact · M d/t/-/-
- `pull-down-buttons/best-practices/include-an-interface-icon-with-a` **Do:** Add an icon after a menu item's label when it clarifies meaning, preferably an SF Symbol. **Why:** SF Symbols feel familiar and stay aligned with text at every scale. · P familiarity, craft · L content, attention · S express · M d/d/-/-
### Platform considerations > iOS, iPadOS

- `pull-down-buttons/platform-considerations/ios-ipados/consider-using-a-more-pull-down` [iOS, iPadOS] **Do:** On iOS and iPadOS, put lower-priority items in a More pull-down button, weighing its compactness against reduced discoverability. **Why:** It saves room when space is tight, but the ellipsis doesn't tell people what's inside. · P simplicity, familiarity · L attention, platform · S compose · M d/d/-/-

## The menu bar (`the-menu-bar`)

Menus and actions · <https://developer.apple.com/design/human-interface-guidelines/the-menu-bar>

### Best practices

- `the-menu-bar/best-practices/support-the-default-system-defined-menus` **Do:** On macOS, include the standard system menus in their usual order and let the system supply standard item behavior. **Why:** People expect familiar menus in familiar order, and the system already implements many standard items. · P familiarity · L platform, interaction · S structure · M -/t/-/-
- `the-menu-bar/best-practices/always-show-the-same-set-of` **Do:** On macOS, always show the same menu bar items, disabling any that don't apply instead of hiding them. **Why:** Visible items teach people which actions the app supports even when unavailable. · P familiarity, agency · L interaction, platform · S interact · M -/t/-/-
- `the-menu-bar/best-practices/represent-menu-item-actions-with-familiar` **Do:** Use the system's own icons for actions like Copy, Share and Delete wherever they show up. **Why:** Familiar icons help people recognize common actions across the app. · P familiarity · L content, attention · S express · M -/t/-/-
- `the-menu-bar/best-practices/support-the-keyboard-shortcuts-defined-for` **Do:** Honor the standard keyboard shortcuts for standard menu items such as Copy, Paste, Save and Print; create custom shortcuts only when needed. **Why:** People expect the shortcuts they already know. · P familiarity, flexibility · L interaction, platform · S interact · M -/d/-/-
- `the-menu-bar/best-practices/prefer-short-one-word-menu-titles` **Do:** Name menu bar menus with a single short word where possible; if more are needed, use title-style capitalization. **Why:** One-word titles take little room and are easy to scan, which matters as display sizes and menu bar extras vary spacing. · P simplicity, flexibility · L content, attention · S write · M -/t/-/-
### App menu

- `the-menu-bar/app-menu/display-the-about-menu-item-first` **Do:** On macOS, put About first in the app menu, followed by a separator so it sits alone. · P familiarity · L platform, attention · S compose · M -/t/-/-
### Edit menu

- `the-menu-bar/edit-menu/determine-whether-find-menu-items-belong` **Do:** On macOS, decide whether Find items fit the Edit menu; if the app searches files or objects, the File menu may suit them better. **Why:** Where search belongs depends on what the app searches. · P familiarity, purpose · L platform, flow · S structure · M -/t/-/-
### View menu

- `the-menu-bar/view-menu/provide-a-view-menu-even-if` **Do:** On macOS, include a View menu even when it holds only the few view functions your app supports, such as full screen. · P familiarity · L platform, interaction · S structure · M -/t/-/-
- `the-menu-bar/view-menu/ensure-that-each-show-hide-item` **Do:** On macOS, title each show/hide item for the current state, such as Show Toolbar when hidden and Hide Toolbar when visible. **Why:** The label then states what choosing it will do right now. · P familiarity, simplicity · L content, interaction · S write · M -/t/-/-
### App-specific menus

- `the-menu-bar/app-specific-menus/provide-app-specific-menus-for-custom` **Do:** On macOS, list all custom commands in app-specific menu bar menus, even rare or advanced ones, regardless of where else they appear. **Why:** People check the menu bar for commands; it enables shortcuts and Full Keyboard Access, and leaving commands out makes them hard to find. · P familiarity, flexibility · L interaction, inclusion · S structure · M -/t/-/-
- `the-menu-bar/app-specific-menus/as-much-as-possible-reflect-your` **Do:** On macOS, order app-specific menus to mirror the app's hierarchy, like Mailbox, Message, then Format in Mail. **Why:** The order mirrors how the items contain one another, which makes it logical. · P simplicity, familiarity · L flow, attention · S structure · M -/t/-/-
- `the-menu-bar/app-specific-menus/aim-to-list-app-specific-menus` **Do:** On macOS, sort app-specific menus from the broadest or most used to the most specialized. **Why:** People expect menus toward the leading end to be more general than those at the trailing end. · P familiarity, simplicity · L attention, platform · S structure · M -/t/-/-
### Window menu

- `the-menu-bar/window-menu/provide-a-window-menu-even-if` **Do:** On macOS, always include a Window menu with Minimize and Zoom, even for single-window apps. **Why:** People using Full Keyboard Access can then trigger those functions from the keyboard. · P flexibility, familiarity · L inclusion, platform · S include · M -/t/-/-
- `the-menu-bar/window-menu/consider-including-menu-items-for-showing` **Do:** On macOS, consider Window menu items that show and hide panels, but skip panels, like font and color, the Format menu already covers. **Why:** Panels appear only when needed, and duplicating access the Format menu offers is unneeded. · P simplicity, familiarity · L interaction, platform · S structure · M -/t/-/-
### Dynamic menu items

- `the-menu-bar/dynamic-menu-items/avoid-making-a-dynamic-menu-item` **Do:** On macOS, treat dynamic menu items as shortcuts for advanced actions that can be done another way, never the sole route. **Why:** They are hidden by default, so people may never discover them. · P agency, flexibility · L interaction, inclusion · S interact · M -/t/-/-
- `the-menu-bar/dynamic-menu-items/use-dynamic-menu-items-primarily-in` **Do:** On macOS, place dynamic menu items mainly in menu bar menus, not contextual or Dock menus. **Why:** In those menus the items become even harder to discover. · P familiarity, agency · L interaction, platform · S interact · M -/t/-/-
- `the-menu-bar/dynamic-menu-items/require-only-a-single-modifier-key` **Do:** On macOS, reveal a dynamic menu item with just one modifier key. **Why:** Holding several keys while opening and choosing from a menu is physically awkward and lowers discoverability. · P flexibility, agency · L interaction, inclusion · S interact · M -/t/-/-
### Platform considerations > iPadOS

- `the-menu-bar/platform-considerations/ipados/because-the-menu-bar-is-often` [iPadOS] **Do:** On iPadOS, make every function reachable through the regular UI, including alternatives to dynamic menu items, and don't dump leftover features in the menu bar. **Why:** The menu bar is often hidden in full screen, and dynamic items need a hardware keyboard. · P agency, flexibility · L platform, flow · S adapt, structure · M t/-/-/-
- `the-menu-bar/platform-considerations/ipados/reserve-the-yourappname-settings-menu-item` [iPadOS] **Do:** On iPadOS, use the Settings menu item only to open the app's page in system Settings; link internal preferences via an item right below it. · P familiarity · L platform, flow · S structure · M -/-/-/-
- `the-menu-bar/platform-considerations/ipados/for-apps-with-tab-style-navigation` [iPadOS] **Do:** On iPadOS, for tab-based apps, consider listing each tab in the View menu, ideally with key bindings. **Why:** Tabs are different views, so the View menu offers another convenient way to switch. · P flexibility, agency · L flow, platform · S structure · M t/t/-/-
- `the-menu-bar/platform-considerations/ipados/consider-grouping-menu-items-into-submenus` [iPadOS] **Do:** On iPadOS, use submenus more readily than on Mac to group related items and save vertical space. **Why:** Rows are taller for easier tapping and some iPad screens are smaller. · P flexibility, simplicity · L platform, interaction · S adapt, compose · M t/-/-/-
### Platform considerations > macOS > Menu bar extras

- `the-menu-bar/platform-considerations/macos/menu-bar-extras/consider-using-a-symbol-to-represent` [macOS] **Do:** On macOS, represent a menu bar extra with an SF Symbol or custom icon drawn in black and clear, so the system can recolor it; menu bar height is 24 pt. **Why:** System recoloring keeps the icon looking right on dark and light menu bars and when selected. · P familiarity, craft · L platform, attention · S express · M -/-/-/-
- `the-menu-bar/platform-considerations/macos/menu-bar-extras/display-a-menu-not-a-popover` [macOS] **Do:** On macOS, show a menu when a menu bar extra is clicked; use a popover only if the functionality is too complex for a menu. · P familiarity, simplicity · L platform, interaction · S interact · M -/-/-/-
- `the-menu-bar/platform-considerations/macos/menu-bar-extras/let-people-not-your-app-decide` [macOS] **Do:** On macOS, let people choose whether your menu bar extra appears, typically in settings, and consider offering that during setup. **Why:** People should control their menu bar; offering it at setup helps them discover it. · P agency · L trust, platform · S interact · M -/-/-/-
- `the-menu-bar/platform-considerations/macos/menu-bar-extras/avoid-relying-on-the-presence-of` [macOS] **Do:** On macOS, don't depend on your menu bar extra being visible. **Why:** The system hides and shows extras regularly, and you can't know which others people display or where yours lands. · P flexibility, agency · L platform, flow · S structure · M -/-/-/-
- `the-menu-bar/platform-considerations/macos/menu-bar-extras/consider-exposing-app-specific-functionality-in` [macOS] **Do:** On macOS, also expose app functions another way, such as a Dock menu opened by Control-clicking the Dock icon. **Why:** People can hide or skip the menu bar extra, whereas the Dock menu exists whenever the app runs. · P agency, flexibility · L platform, interaction · S structure · M -/-/-/-

## Toolbars (`toolbars`)

Menus and actions · <https://developer.apple.com/design/human-interface-guidelines/toolbars>

### Best practices

- `toolbars/best-practices/choose-items-deliberately-to-avoid-overcrowding` **Do:** Limit toolbar items, and decide which move to overflow as width shrinks; on macOS and iPadOS, don't add your own overflow menu or let items overflow by default. **Why:** People must be able to tell items apart and activate them; the system supplies overflow automatically. · P simplicity, flexibility · L attention, interaction · S compose · M d/d/-/-
- `toolbars/best-practices/add-a-more-menu-to-contain` **Do:** Use a More menu only if necessary, holding the least important actions; put every action in the toolbar when possible. **Why:** Actions in the toolbar are visible, while a More menu hides them. · P simplicity · L attention, interaction · S compose · M d/d/-/-
- `toolbars/best-practices/in-ipados-and-macos-apps-consider` **Do:** On iPadOS and macOS, think about allowing toolbar customization, particularly in apps with numerous items, advanced features or lengthy sessions. **Why:** People favor different commands depending on work style and current project. · P agency, flexibility · L interaction, platform · S interact · M t/d/-/-
- `toolbars/best-practices/reduce-the-use-of-toolbar-backgrounds` **Do:** Skip custom toolbar backgrounds and tinted controls; let the content layer set the toolbar's color and use a scroll edge effect to separate it. **Why:** Custom looks can clash with system background effects; this approach shows personality without distracting from content. · P simplicity, delight · L attention · S express · M t/t/-/-
- `toolbars/best-practices/avoid-applying-a-similar-color-to` **Do:** Avoid toolbar labels sharing a color with the content behind them; with bright, colorful content, keep toolbars in their default single-tone look. **Why:** Similar colors reduce legibility of the toolbar items against the content. · P simplicity, craft · L attention · S express · M t/t/-/-
- `toolbars/best-practices/prefer-using-standard-components-in-a` **Do:** Use standard components in toolbars; any custom component should have corner radii concentric with the bar's corners. **Why:** Standard ones already match the bar's corner geometry. · P familiarity, craft · L attention, platform · S compose · M t/t/-/-
- `toolbars/best-practices/consider-temporarily-hiding-toolbars-for-a` **Do:** Optionally let people hide toolbars for a distraction-free view, in fitting contexts, and always give a dependable way to bring them back. **Why:** People sometimes want less interface to focus or see more content. · P agency, simplicity · L attention, flow · S interact · M d/d/-/-
### Titles

- `toolbars/titles/provide-a-useful-title-for-each` **Do:** Title each window usefully, but leave the title empty if it would be redundant. **Why:** Titles confirm where people are and tell apart multiple open windows. · P simplicity, familiarity · L content, flow · S write · M d/d/d/-
- `toolbars/titles/dont-title-windows-with-your-app` **Do:** Don't use the app's name as a window title. **Why:** The name says nothing about the content hierarchy or the current window or area. · P simplicity · L content · S write · M d/d/d/-
- `toolbars/titles/write-a-concise-title` **Do:** Use a word or brief phrase capturing the view's purpose, under 15 characters. **Why:** A short title leaves space for the other controls. · P simplicity · L content, attention · S write · M d/d/d/d
### Navigation

- `toolbars/navigation/use-the-standard-back-and-close` **Do:** Use the standard Back and Close buttons with their standard symbols, not text labels; any custom version must look, behave and be used consistently like them. **Why:** People already know Back retraces the hierarchy and Close dismisses a modal view. · P familiarity · L interaction, flow · S interact, express · M d/d/-/-
### Actions

- `toolbars/actions/provide-actions-that-support-the-main` **Do:** Put the commands people most likely need in the toolbar, whether most frequent or tied to the top-level objects they work with. **Why:** The toolbar should serve the main tasks people perform. · P purpose · L value, interaction · S define, compose · M d/d/-/-
- `toolbars/actions/make-sure-the-meaning-of-each` **Do:** Make every toolbar control's purpose obvious; favor simple, recognizable symbols over text, except for actions such as edit that symbols depict poorly. **Why:** People shouldn't have to guess or experiment to learn what an item does. · P simplicity, familiarity · L interaction, content · S express · M d/d/-/-
- `toolbars/actions/prefer-system-provided-symbols-without-borders` **Do:** Use system symbols without added borders in toolbars. **Why:** They are familiar, get proper coloring and vibrancy, and react consistently; the container is already visible and the system styles hover and selection. · P familiarity, simplicity · L attention, interaction · S express · M d/d/-/-
- `toolbars/actions/use-the-prominent-style-for-key` **Do:** Apply the prominent style to a key action like Done or Submit; designate only one primary action, at the trailing side. **Why:** It separates and tints the action, giving a clear focal point. · P simplicity, purpose · L attention · S express · M d/d/-/-
### Item groupings

- `toolbars/item-groupings/group-toolbar-items-logically-by-function` **Do:** Cluster toolbar items by what they do and how often they're used, as Keynote does with presentation, playback and insertion sections. · P simplicity · L attention · S compose · M d/d/-/-
- `toolbars/item-groupings/group-navigation-controls-and-critical-actions` **Do:** Give navigation controls and critical actions such as Done, Close or Save their own familiar sections that look clearly distinct. **Why:** This reflects their importance and helps people find and understand them. · P simplicity, familiarity · L attention, flow · S compose · M d/d/-/-
- `toolbars/item-groupings/keep-consistent-groupings-and-placement-across` **Do:** Keep toolbar groupings and positions the same on every platform. **Why:** People become familiar with the app and trust it behaves alike everywhere. · P familiarity, flexibility · L platform, trust · S adapt · M d/d/-/-
- `toolbars/item-groupings/minimize-the-number-of-groups` **Do:** Use few toolbar groups, generally three at most. **Why:** A toolbar with many groups feels crowded and confusing, despite the larger iPad and Mac space. · P simplicity · L attention · S compose · M d/d/-/-
- `toolbars/item-groupings/keep-actions-with-text-labels-separate` **Do:** Don't place a text-labeled action beside a symbol action in one group; separate text buttons with fixed space. **Why:** Adjacent items can look like one combined action, and neighboring text labels can run together. · P simplicity, craft · L attention, interaction · S compose · M d/d/-/-
### Platform considerations > iOS

- `toolbars/platform-considerations/ios/prioritize-only-the-most-important-items` [iOS] **Do:** On iOS, give the main toolbar only the essential actions and move the rest into a More menu. **Why:** Space is very limited. · P simplicity, purpose · L value, platform · S compose · M d/t/-/-
- `toolbars/platform-considerations/ios/use-a-large-title-to-help` [iOS] **Do:** On iOS, use a large title that shrinks to a standard one when scrolling starts and returns at the top. **Why:** It reminds people of their current location while they navigate and scroll. · P familiarity, flexibility · L flow, platform · S express, interact · M d/t/-/-
### Platform considerations > iPadOS

- `toolbars/platform-considerations/ipados/consider-combining-a-toolbar-with-a` [iPadOS] **Do:** On iPadOS, consider putting a toolbar and tab bar in the same top row. **Why:** It lets people switch among main areas while leaving the full window width for content. · P flexibility, simplicity · L flow, platform · S structure, compose · M t/t/-/-
### Platform considerations > macOS

- `toolbars/platform-considerations/macos/make-every-toolbar-item-available-as` [macOS] **Do:** On macOS, offer every toolbar item also as a menu bar command, though not every menu command needs a toolbar item. **Why:** The toolbar can be customized or hidden; not all menu commands merit toolbar space. · P agency, flexibility · L platform, interaction · S structure · M -/t/-/-
### Platform considerations > visionOS

- `toolbars/platform-considerations/visionos/prefer-using-a-system-provided-toolbar` [visionOS] **Do:** On visionOS, use the standard toolbar. **Why:** It looks consistent and familiar, suits eye and hand input, and the system positions it correctly relative to the window. · P familiarity, craft · L platform, interaction · S compose · M -/-/-/-
- `toolbars/platform-considerations/visionos/avoid-creating-a-vertical-toolbar` [visionOS] **Do:** On visionOS, don't build a vertical toolbar. **Why:** Tab bars there are vertical, so a vertical toolbar could confuse people. · P familiarity · L platform, interaction · S compose · M -/-/-/-
- `toolbars/platform-considerations/visionos/try-to-prevent-windows-from-resizing` [visionOS] **Do:** On visionOS, stop windows from shrinking narrower than the toolbar. **Why:** There is no menu bar listing actions, so the toolbar must always give reliable access to essential controls. · P flexibility, agency · L platform, interaction · S adapt · M -/-/-/-
- `toolbars/platform-considerations/visionos/if-your-app-can-enter-a` [visionOS] **Do:** On visionOS, when the app enters a modal state, show toolbar controls suited to that task, and bring back the standard window toolbar controls on exit. **Why:** Modal views need different controls than the main window, and the usual ones must return afterward. · P familiarity, flexibility · L interaction, platform · S interact · M t/t/-/-
- `toolbars/platform-considerations/visionos/avoid-using-a-pull-down-menu` [visionOS] **Do:** On visionOS, don't put a pull-down menu in a toolbar. **Why:** Such menus are hard to discover, add clutter, and can cover the standard window controls below the window's bottom edge. · P simplicity, familiarity · L interaction, platform · S compose · M t/t/-/-
### Platform considerations > watchOS

- `toolbars/platform-considerations/watchos/use-a-scrolling-toolbar-button-for` [watchOS] **Do:** On watchOS, offer an important but non-primary action as a scrolling toolbar button, such as compose at the top of an inbox. **Why:** A view can surface closely related important functionality even when it isn't the view's main purpose. · P purpose, simplicity · L value, platform · S compose · M t/t/-/-

## Path controls (`path-controls`)

Navigation and search · <https://developer.apple.com/design/human-interface-guidelines/path-controls>

### Best practices

- `path-controls/best-practices/use-a-path-control-in-the` **Do:** Place a path control inside the window's body area, never in a toolbar or status bar. **Why:** Path controls aren't designed for toolbars or status bars; Finder places its own in the window body. · P familiarity · L platform, interaction · S compose · M -/t/-/-

## Search fields (`search-fields`)

Navigation and search · <https://developer.apple.com/design/human-interface-guidelines/search-fields>

### Best practices

- `search-fields/best-practices/use-placeholder-text-to-help-people` **Do:** Use placeholder text in a search field to hint at what can be searched and to reinforce its scope. **Why:** It teaches people which kinds of content search covers. · P simplicity, familiarity · L content · S write · M d/d/-/-
- `search-fields/best-practices/if-possible-start-search-immediately-when` **Do:** Where feasible, begin searching as the person types so results update continuously. **Why:** Live refinement makes search feel more responsive as the query becomes more specific. · P agency, familiarity · L interaction · S interact · M d/d/-/-
- `search-fields/best-practices/consider-showing-suggested-search-terms` **Do:** Offer suggestions such as recent searches before typing, or predictive suggestions while typing. **Why:** Suggestions let people search faster, even if the search doesn't start right away. · P agency, simplicity · L interaction, flow · S interact · M d/d/-/-
- `search-fields/best-practices/simplify-search-results` **Do:** Rank the most relevant results first and consider grouping results into categories. **Why:** This reduces scrolling and helps people find what they want. · P simplicity, purpose · L attention, value · S compose · M d/d/-/-
- `search-fields/best-practices/consider-letting-people-filter-search-results` **Do:** Let people narrow search results, for example with a scope bar in the results area. **Why:** Filtering gives people a quick, easy way to reach what they need. · P agency · L interaction · S interact · M d/d/-/-
### Scope bars and tokens

- `search-fields/scope-bars-and-tokens/use-a-scope-bar-to-filter` **Do:** Use a scope bar to switch among clearly defined search categories, moving from broad to narrow, such as all mailboxes to the current one. **Why:** It lets people narrow a search from a wider scope to a more specific one. · P agency, familiarity · L interaction · S interact, compose · M d/d/-/-
- `search-fields/scope-bars-and-tokens/default-to-a-broader-scope-and` **Do:** Start searches at the widest scope and let people tighten it when they want. **Why:** A wide scope shows the whole set of results, guiding people sensibly if they later narrow it. · P agency, simplicity · L interaction, flow · S interact · M d/d/-/-
- `search-fields/scope-bars-and-tokens/use-tokens-to-filter-by-common` **Do:** Turn common search terms or items into tokens that can be selected and edited as one unit, to clarify a term or focus on certain attributes. **Why:** The enclosed visual treatment signals that the term acts as a single editable item. · P familiarity, agency · L interaction · S interact · M d/d/-/-
- `search-fields/scope-bars-and-tokens/consider-pairing-tokens-with-search-suggestions` **Do:** Show search suggestions alongside tokens. **Why:** People may not know which tokens exist, so suggestions teach them how tokens work. · P familiarity, simplicity · L interaction, content · S interact · M d/d/-/-
### Platform considerations > iOS > Search as a tab

- `search-fields/platform-considerations/ios/search-as-a-tab/choose-the-standard-tab-style-to` [iOS] **Do:** On iOS, use the standard search tab style, a dedicated landing page showing suggestions and content, for apps with rich content worth exploring. **Why:** It shows what's available before searching, grounding people and encouraging discovery. · P purpose, agency · L flow, platform · S structure · M d/t/-/-
- `search-fields/platform-considerations/ios/search-as-a-tab/choose-the-button-appearance-to-help` [iOS] **Do:** On iOS, use the button-style search tab when search should finish quickly: the keyboard opens with the field ready, and exiting returns to the previous tab. **Why:** It gives a brief, transient search that returns people straight to what they were doing. · P simplicity, agency · L flow, platform · S structure, interact · M d/t/-/-
### Platform considerations > iOS > Search in a toolbar

- `search-fields/platform-considerations/ios/search-in-a-toolbar/place-search-at-the-bottom-if` [iOS] **Do:** On iOS, put search in a bottom toolbar when there's room, either alone or alongside other controls, especially when search is a priority. **Why:** A bottom position keeps search easy to reach. · P purpose, flexibility · L attention, platform · S compose · M d/t/-/-
- `search-fields/platform-considerations/ios/search-in-a-toolbar/place-search-at-the-top-when` [iOS] **Do:** On iOS, put search at the top when bottom content matters or there is no bottom toolbar. **Why:** A bottom search field could cover content needed for the app's primary function, like stacked passes. · P purpose, simplicity · L attention, platform · S compose · M d/t/-/-
### Platform considerations > iOS > Search as an inline field

- `search-fields/platform-considerations/ios/search-as-an-inline-field/place-search-as-an-inline-field` [iOS] **Do:** On iOS, place a search field inline next to the content it searches when it filters one view, or when the app has several search fields. **Why:** Proximity shows the search applies to that content rather than globally. · P familiarity, simplicity · L attention, platform · S compose · M d/d/-/-
- `search-fields/platform-considerations/ios/search-as-an-inline-field/when-at-the-top-position-an` [iOS] **Do:** On iOS, put a top inline search field above its list, and consider pinning it to the top toolbar on scroll. **Why:** This keeps it visibly different from search placed elsewhere. · P familiarity, simplicity · L attention, platform · S compose · M d/d/-/-
### Platform considerations > iPadOS, macOS

- `search-fields/platform-considerations/ipados-macos/put-a-search-field-at-the` [iPadOS, macOS] **Do:** On iPad and Mac, place search at the toolbar's trailing end, especially for split-view apps or when results show in the detail view. **Why:** It is a familiar spot, uses space well, and lets people browse results while keeping their selection visible. · P familiarity, craft · L platform, attention · S compose · M t/d/-/-
- `search-fields/platform-considerations/ipados-macos/include-search-at-the-top-of` [iPadOS, macOS] **Do:** On iPad and Mac, put search at the top of the sidebar when it filters sidebar content or navigation, so deep sections surface quickly. **Why:** It offers a simple way to search, preview and reach buried sections, and separates the filtered sidebar from the neighboring view. · P simplicity, familiarity · L flow, platform · S structure, compose · M t/d/-/-
- `search-fields/platform-considerations/ipados-macos/include-search-as-an-item-in` [iPadOS, macOS] **Do:** On iPad and Mac, give search its own sidebar or tab bar item when it comes with rich suggestions or categories and browsing blends with searching. **Why:** A dedicated area gives rich content room, unifies discovery, and keeps search reachable from every section. · P purpose, familiarity · L flow, platform · S structure · M d/d/-/-
- `search-fields/platform-considerations/ipados-macos/in-a-search-field-in-a` [iPadOS, macOS] **Do:** When someone opens a dedicated search area, focus the field immediately; on iPad with only a virtual keyboard, leave it unfocused. **Why:** Immediate focus speeds searching and makes the field easy to find, but a virtual keyboard could unexpectedly cover the view. · P agency, flexibility · L interaction, platform · S interact · M d/d/-/-
- `search-fields/platform-considerations/ipados-macos/account-for-window-resizing-with-the` [iPadOS, macOS] **Do:** Plan where the search field sits as the window resizes; in compact iPad views, keep it where it is most useful, such as above the content list. **Why:** Search should stay available where it is most contextually useful when the window changes size. · P flexibility · L platform, flow · S adapt · M t/d/-/-
### Platform considerations > tvOS

- `search-fields/platform-considerations/tvos/provide-suggestions-to-make-searching-easier` [tvOS] **Do:** On tvOS, supply suggestions that are popular or fit the context, plus recent searches if any. **Why:** People don't want to type much on tvOS, so suggestions ease searching. · P flexibility, simplicity · L interaction, platform · S interact · M t/t/-/-

## Sidebars (`sidebars`)

Navigation and search · <https://developer.apple.com/design/human-interface-guidelines/sidebars>

### Best practices

- `sidebars/best-practices/extend-visually-rich-content-beneath-the` **Do:** Let visually rich content run beneath a floating sidebar, by horizontal scrolling or a background extension effect that mirrors nearby content. **Why:** Content passing under the sidebar reinforces its separation as a layer floating above the content. · P craft, delight · L attention · S express, compose · M t/t/-/-
- `sidebars/best-practices/when-possible-let-people-customize-the` **Do:** Where possible, let people choose which areas appear in the sidebar and in what order. **Why:** People are best placed to decide which areas matter most to them. · P agency · L interaction, flow · S interact, structure · M t/d/-/-
- `sidebars/best-practices/group-hierarchy-with-disclosure-controls-if` **Do:** For content-heavy apps, nest sidebar hierarchy under disclosure controls. **Why:** Collapsible groups keep the sidebar's vertical length manageable. · P simplicity · L flow, attention · S structure, compose · M d/d/-/-
- `sidebars/best-practices/consider-using-familiar-symbols-to-represent` **Do:** Represent sidebar items with familiar SF Symbols; for custom icons, build a custom symbol instead of a bitmap. **Why:** SF Symbols are a broad, customizable set that people recognize. · P familiarity, craft · L content, attention · S express · M d/d/t/t
- `sidebars/best-practices/consider-letting-people-hide-the-sidebar` **Do:** Let people show and hide the sidebar via familiar platform interactions (edge swipe on iPad, button or View menu commands on Mac), but don't hide it by default. **Why:** Hiding makes room for content or reduces distraction, while a visible default keeps the sidebar discoverable. · P agency, flexibility · L interaction, platform · S interact · M t/d/-/-
- `sidebars/best-practices/in-general-show-no-more-than` **Do:** Limit sidebar hierarchy to two levels; for deeper data, add a content list between the sidebar and detail view in a split view. **Why:** Deeper nesting makes the sidebar unwieldy, so a middle list handles extra depth. · P simplicity · L flow · S structure · M d/d/-/-
- `sidebars/best-practices/if-you-need-to-include-two` **Do:** Title each sidebar group with short, descriptive labels and cut unnecessary words. **Why:** Brief labels keep two-level sidebars easy to scan. · P simplicity · L content · S write · M d/d/d/d
- `sidebars/best-practices/make-sure-any-sidebar-icon-colors` **Do:** Let sidebar icons follow the accent color, including a user's chosen system accent on Mac; use fixed colors sparingly to clarify meaning or flag importance. **Why:** People expect their chosen accent color everywhere, and sparse fixed colors act as a cue, like the yellow VIP icon. · P familiarity, simplicity · L attention, platform · S express · M d/d/d/d
### Platform considerations > iOS, iPadOS

- `sidebars/platform-considerations/ios-ipados/consider-using-a-tab-bar-first` [iOS, iPadOS] **Do:** On iPhone and iPad, start with a tab bar; if more areas are needed than fit, use its convertible sidebar-style form for less-used content. **Why:** A tab bar leaves more room for content and is flexible enough for most apps' main areas. · P simplicity, flexibility · L flow, platform · S structure · M d/t/-/-
- `sidebars/platform-considerations/ios-ipados/if-necessary-apply-the-correct-appearance` [iOS, iPadOS] **Do:** When not building with SwiftUI, apply the sidebar appearance of a collection view list layout so the sidebar looks correct. · P craft, familiarity · L platform · S express · M -/-/-/-
### Platform considerations > macOS

- `sidebars/platform-considerations/macos/consider-automatically-hiding-and-revealing-a` [macOS] **Do:** On Mac, consider collapsing the sidebar automatically when its window gets smaller, and revealing it again when there's room. **Why:** Collapsing frees space for the main content in a small window. · P flexibility · L platform, interaction · S adapt · M t/d/-/-
- `sidebars/platform-considerations/macos/avoid-putting-critical-information-or-actions` [macOS] **Do:** On Mac, keep vital information and actions away from the sidebar's lower end. **Why:** People often move windows so the bottom edge is off-screen. · P flexibility, craft · L attention, platform · S compose · M t/d/-/-
### Platform considerations > visionOS

- `sidebars/platform-considerations/visionos/if-your-apps-hierarchy-is-deep` [visionOS] **Do:** On visionOS, for a deep hierarchy, put a sidebar inside a tab for secondary navigation, and make sidebar choices not switch the open tab. **Why:** The sidebar handles navigation within a tab without disturbing tab-level navigation. · P familiarity, simplicity · L flow, platform · S structure · M t/t/-/-

## Tab bars (`tab-bars`)

Navigation and search · <https://developer.apple.com/design/human-interface-guidelines/tab-bars>

### Best practices

- `tab-bars/best-practices/use-a-tab-bar-to-support` **Do:** Use tabs only to move between top-level sections; put controls that act on the current view in a toolbar. **Why:** Tabs are for navigation, so keeping actions elsewhere preserves what people expect from them. · P familiarity, simplicity · L flow · S structure · M d/t/-/-
- `tab-bars/best-practices/make-sure-the-tab-bar-is` **Do:** Keep the tab bar on screen as people move between sections, except when a temporary modal view covers it. **Why:** Hiding it can make people forget which area they're in; a modal is temporary and self-contained. · P familiarity, simplicity · L flow, attention · S structure · M d/t/-/-
- `tab-bars/best-practices/use-the-appropriate-number-of-tabs` **Do:** Choose the tab count by weighing added complexity against how often each section is needed; fewer is easier, and complex structures may suit a sidebar or adaptive tab bar. **Why:** Tabs reflect the app's hierarchy, and navigating among fewer is generally easier. · P simplicity, purpose · L flow, value · S structure · M d/t/-/-
- `tab-bars/best-practices/avoid-overflow-tabs` **Do:** Minimize situations where tabs collapse into a More tab, which happens when device size or orientation limits visible tabs on iOS and iPadOS. **Why:** A More tab makes hidden content harder to reach and notice. · P simplicity, flexibility · L flow, attention · S structure, adapt · M d/t/-/-
- `tab-bars/best-practices/dont-disable-or-hide-tab-bar` **Do:** Keep every tab button visible and enabled even when its content is unavailable; if a section is empty, explain why. **Why:** Buttons that come and go make the interface seem unstable and unpredictable. · P familiarity, responsibility · L interaction, content · S interact, write · M d/t/-/-
- `tab-bars/best-practices/include-tab-labels-to-help-with` **Do:** Add a label with each tab icon, using a single word where possible, to describe the tab's content or function. **Why:** Clear labels help people navigate. · P simplicity, familiarity · L content, flow · S write · M d/d/-/-
- `tab-bars/best-practices/consider-using-sf-symbols-to-provide` **Do:** Use SF Symbols for tab bar icons, preferring filled styles, so they adapt between compact and regular layouts. **Why:** The symbols are familiar, scale, and adapt automatically to device and orientation; filled styles match the platform. · P familiarity, flexibility · L platform, attention · S express · M d/t/-/-
- `tab-bars/best-practices/use-a-badge-to-indicate-that` **Do:** Mark a tab with a badge only when the section holds new or updated critical information that warrants attention. **Why:** Reserving badges for critical items keeps their impact and meaning from being diluted. · P simplicity, responsibility · L attention, trust · S express, interact · M d/d/-/-
- `tab-bars/best-practices/avoid-applying-a-similar-color-to` **Do:** Don't give tab labels a color close to the content layer's background; with colorful content, go monochrome or pick a clearly distinct accent. **Why:** Similar colors reduce visual separation between tab labels and the content behind them. · P craft, simplicity · L attention · S express · M d/d/t/t
### Platform considerations > iPadOS

- `tab-bars/platform-considerations/ipados/prefer-a-tab-bar-for-navigation` [iPadOS] **Do:** On iPad, make a tab bar the default navigation, and let people switch it to a sidebar when the app is more complex. **Why:** A tab bar keeps the most-used sections one tap away; a sidebar can expose a wider set of destinations. · P simplicity, familiarity · L flow, platform · S structure · M t/t/-/-
- `tab-bars/platform-considerations/ipados/let-people-customize-the-tab-bar` [iPadOS] **Do:** On iPad, in apps with many sections, let people add or remove tab bar items; keep the default list to a handful so compact and regular sizes stay consistent. **Why:** People can surface their favorites, and a short default preserves continuity between view sizes. · P agency, flexibility · L interaction, platform · S interact, structure · M t/t/-/-
### Platform considerations > tvOS

- `tab-bars/platform-considerations/tvos/be-aware-of-tab-bar-scrolling` [tvOS] **Do:** On tvOS, expect the tab bar to scroll away on single-view tabs but stay pinned with split views, and know that Menu returns focus to it. **Why:** This is how the system behaves by default, so designs should account for it. · P familiarity, flexibility · L flow, platform · S interact · M -/-/-/-
- `tab-bars/platform-considerations/tvos/in-a-live-viewing-app-organize` [tvOS] **Do:** On tvOS, in live-streaming apps, order tabs as live content first, then recorded content such as cloud DVR, then everything else. **Why:** A consistent tab order gives the best experience in live-viewing apps. · P familiarity · L flow, platform · S structure · M t/t/-/-
### Platform considerations > visionOS

- `tab-bars/platform-considerations/visionos/supply-a-symbol-and-a-text` [visionOS] **Do:** On visionOS, give every tab both a symbol and a short text label. **Why:** Labels appear when people look at the bar, and brevity lets them be read at a glance. · P simplicity, flexibility · L content, platform · S write, express · M t/t/-/-
- `tab-bars/platform-considerations/visionos/if-it-makes-sense-in-your` [visionOS] **Do:** On visionOS, for a deep hierarchy, consider a sidebar inside a tab for secondary navigation, without letting sidebar selections change the open tab. **Why:** The sidebar handles deeper navigation within a tab while the tab stays stable. · P familiarity, simplicity · L flow, platform · S structure · M t/t/-/-

## Token fields (`token-fields`)

Navigation and search · <https://developer.apple.com/design/human-interface-guidelines/token-fields>

### Best practices

- `token-fields/best-practices/add-value-with-a-context-menu` **Do:** Attach a context menu to tokens offering extra options or details about the token. **Why:** People often benefit from additional options or information about a token. · P purpose, agency · L interaction, value · S interact · M t/d/-/-
- `token-fields/best-practices/consider-providing-additional-ways-to-convert` **Do:** Besides the default comma, consider extra shortcuts, like pressing Return, that turn typed text into a token. **Why:** More ways to trigger conversion suit different typing habits. · P agency, flexibility · L interaction · S interact · M t/d/-/-
- `token-fields/best-practices/consider-customizing-the-delay-the-system` **Do:** If your app suggests tokens, tune the delay before suggestions appear to a comfortable level rather than relying on instant display. **Why:** Suggestions that show up too quickly can distract people while typing. · P craft, agency · L interaction, attention · S interact · M t/d/-/-

## Action sheets (`action-sheets`)

Presentation · <https://developer.apple.com/design/human-interface-guidelines/action-sheets>

### Best practices

- `action-sheets/best-practices/use-an-action-sheet-not-an` **Do:** Use an action sheet, not an alert, to give choices tied to an action the person chose on purpose, like saving or deleting a draft on cancel. **Why:** An alert gives no extra choices and is usually unexpected, reporting a problem or change. · P familiarity, agency · L interaction, flow · S interact · M d/d/-/-
- `action-sheets/best-practices/use-action-sheets-sparingly` **Do:** Show action sheets only when needed. **Why:** They interrupt the current task, so overuse weakens attention to them. · P simplicity, agency · L flow, attention · S interact · M d/d/-/-
- `action-sheets/best-practices/aim-to-keep-titles-short-enough` **Do:** Write action sheet titles short enough to fit on one line. **Why:** Long titles are slow to read and may be cut off or force scrolling. · P simplicity · L content · S write · M d/d/-/-
- `action-sheets/best-practices/provide-a-message-only-if-necessary` **Do:** Add a message to an action sheet only when truly needed. **Why:** The title and the current action usually explain the choices well enough. · P simplicity · L content · S write · M d/d/-/-
- `action-sheets/best-practices/if-necessary-provide-a-cancel-button` **Do:** When an action could destroy data, include a Cancel button at the bottom of the sheet (upper left in watchOS). **Why:** People need a way to reject a data-destroying action. · P agency, responsibility · L interaction, flow · S interact · M d/d/-/-
- `action-sheets/best-practices/make-destructive-choices-visually-prominent` **Do:** Style destructive buttons with the destructive style and put them at the top of the action sheet. **Why:** The top is where they are most noticeable. · P responsibility, familiarity · L attention, interaction · S express, compose · M d/d/-/-
### Platform considerations > iOS, iPadOS

- `action-sheets/platform-considerations/ios-ipados/use-an-action-sheet-not-a` [iOS, iPadOS] **Do:** On iPhone and iPad, use an action sheet rather than a menu for choices tied to an action. **Why:** People expect an action sheet to appear after an action needing clarification, and a menu only when they ask for one. · P familiarity · L interaction, platform · S interact · M d/t/-/-
- `action-sheets/platform-considerations/ios-ipados/avoid-letting-an-action-sheet-scroll` [iOS, iPadOS] **Do:** On iPhone and iPad, keep the action sheet short enough that it doesn't need to scroll. **Why:** More buttons cost more time and effort, and scrolling risks accidental taps. · P simplicity, craft · L interaction · S compose, interact · M d/d/-/-
### Platform considerations > watchOS

- `action-sheets/platform-considerations/watchos/avoid-displaying-more-than-four-buttons` [watchOS] **Do:** On watchOS, limit an action sheet to four buttons total, counting the required Cancel, so at most three other choices. **Why:** Fewer buttons let people see all options at once. · P simplicity, flexibility · L interaction, platform · S compose · M t/-/-/-

## Alerts (`alerts`)

Presentation · <https://developer.apple.com/design/human-interface-guidelines/alerts>

### Best practices

- `alerts/best-practices/use-alerts-sparingly` **Do:** Use alerts rarely, and make each one carry only essential information and useful actions. **Why:** Alerts interrupt the task, so restraint keeps people paying attention to them. · P simplicity, agency · L flow, content · S interact · M d/d/-/-
- `alerts/best-practices/avoid-using-an-alert-merely-to` **Do:** Don't use an alert just to inform; show purely informational messages in context instead, such as an indicator people can open. **Why:** People dislike being interrupted by information they can't act on. · P agency, simplicity · L flow, content · S interact, write · M d/d/-/-
- `alerts/best-practices/avoid-displaying-alerts-for-common-undoable` **Do:** Don't confirm routine actions people can undo, even destructive ones; save alerts for rare actions that can't be reversed. **Why:** People act on purpose and undo already protects them, so an alert only interrupts; a rare irreversible action may be an accident worth catching. · P agency, simplicity · L flow, interaction · S interact · M d/d/-/-
- `alerts/best-practices/avoid-showing-an-alert-when-your` **Do:** Don't open the app with an alert; make news discoverable another way, and for startup problems show cached or placeholder data with a quiet label. **Why:** Greeting people with an interruption gets in their way when they just want to start. · P agency, simplicity · L flow, trust · S interact, structure · M d/d/-/-
### Content

- `alerts/content/in-all-alert-copy-be-direct` **Do:** Write alert text plainly in a neutral, friendly tone; avoid being vague, blaming, or downplaying how serious the issue is. **Why:** Alerts often describe problems and serious situations, so honesty and clarity matter. · P simplicity, responsibility · L content · S write · M d/d/d/d
- `alerts/content/write-a-title-that-clearly-and` **Do:** Title the alert with a specific, concise statement of what happened, where, and why; skip vague titles like "Error", and keep it within two lines with correct capitalization and punctuation. **Why:** People must grasp the situation quickly. · P simplicity · L content · S write · M d/d/d/d
- `alerts/content/include-informative-text-only-if-it` **Do:** Add alert body text only if it adds value; keep it very short, in complete sentences with sentence-style capitalization and punctuation. **Why:** Extra text that adds nothing clutters the alert. · P simplicity · L content · S write · M d/d/d/d
- `alerts/content/avoid-explaining-alert-buttons` **Do:** Don't describe what alert buttons do when text and titles are clear; if needed, say "choose" and use the button's exact title without quotes. **Why:** Clear wording makes explanation redundant, and "choose" suits any device or input method. · P simplicity, flexibility · L content · S write · M d/d/d/d
- `alerts/content/if-supported-include-a-text-field` **Do:** Put a text field in an alert only when the person's input is needed to resolve the situation, such as a secure field for a password. **Why:** An input field should appear only when resolving the situation requires it. · P simplicity · L interaction, content · S interact · M d/d/-/-
### Buttons

- `alerts/buttons/create-succinct-logical-button-titles` **Do:** Name alert buttons with one or two words, preferably verbs tied to the alert text; use OK only for informational alerts, never Yes/No, and Cancel for cancelling. **Why:** Titles that describe the result make the choice clear and consistent. · P simplicity, familiarity · L content, interaction · S write · M d/d/-/-
- `alerts/buttons/avoid-using-ok-as-the-default` **Do:** Reserve OK as the default alert button for purely informational alerts; otherwise use a specific verb like Erase or Delete. **Why:** OK is ambiguous when confirming an action, while a specific title tells people what they are doing. · P simplicity, responsibility · L content · S write · M d/d/-/-
- `alerts/buttons/place-buttons-where-people-expect` **Do:** Put the most likely choice, which is also the default, on the trailing side of a row or top of a stack; Cancel goes leading or at the bottom. **Why:** Consistent placement matches where people expect buttons. · P familiarity · L interaction, attention · S compose · M d/d/-/-
- `alerts/buttons/use-the-destructive-style-to-identify` **Do:** Apply destructive styling only to a button performing a destructive action the person didn't deliberately choose; skip it for a deliberately chosen one like Empty Trash. **Why:** For intended actions, quick confirmation beats reaffirming danger; for unintended ones, highlighting helps people catch it. · P responsibility, agency · L attention, interaction · S express, interact · M d/d/-/-
- `alerts/buttons/if-theres-a-destructive-action-include` **Do:** With a destructive action, include a button titled Cancel that isn't the default; if you want people to read the alert, make no button default, and use Done for a lone default button. **Why:** People need a safe way out, and a default Cancel or automatic Return press discourages reading. · P responsibility, agency · L interaction, content · S interact, write · M d/d/-/-
- `alerts/buttons/provide-alternative-ways-to-cancel-an` **Do:** Where sensible, let people dismiss alerts by quick alternatives like Escape or Command-Period on a keyboard, leaving for the Home Screen, or Menu on the tvOS remote. **Why:** People appreciate keyboard shortcuts and other fast ways to cancel. · P agency, flexibility · L interaction, inclusion · S interact · M d/d/-/-
### Platform considerations > iOS, iPadOS

- `alerts/platform-considerations/ios-ipados/use-an-action-sheet-not-an` [iOS, iPadOS] **Do:** On iPhone and iPad, offer extra choices for an intentional action in an action sheet rather than an alert, such as delete, save or keep editing a draft. **Why:** An alert can confirm or cancel but offers no further choices related to the action. · P familiarity, agency · L interaction, platform · S interact · M d/d/-/-
- `alerts/platform-considerations/ios-ipados/when-possible-avoid-displaying-an-alert` [iOS, iPadOS] **Do:** On iPhone and iPad, keep alerts from scrolling with short titles and a brief message only if necessary. **Why:** Large text sizes can make an alert scroll, so brevity reduces that chance. · P simplicity, flexibility · L content, inclusion · S write, adapt · M d/d/-/-
### Platform considerations > macOS

- `alerts/platform-considerations/macos/use-a-caution-symbol-sparingly` [macOS] **Do:** On Mac, use the caution symbol only when extra attention is truly needed, such as risk of unexpected data loss; not for save or empty-trash tasks. **Why:** Frequent use dilutes its significance. · P responsibility, simplicity · L attention, trust · S express · M d/d/d/d

## Page controls (`page-controls`)

Presentation · <https://developer.apple.com/design/human-interface-guidelines/page-controls>

### Best practices

- `page-controls/best-practices/use-page-controls-to-represent-movement` **Do:** Use page controls only for moving through an ordered sequence of pages; use a sidebar or split view for hierarchical or nonsequential structures. **Why:** Page controls don't convey hierarchical or nonsequential relationships. · P familiarity, simplicity · L flow, interaction · S structure · M d/d/t/t
- `page-controls/best-practices/center-a-page-control-at-the` **Do:** Place the page control horizontally centered near the bottom of the view or window. **Why:** A fixed spot means people always know where to find it. · P familiarity, craft · L attention, interaction · S compose · M d/d/d/d
- `page-controls/best-practices/although-page-controls-can-handle-any` **Do:** Avoid showing many page dots; past about ten peer pages, use another layout such as a grid that allows any-order navigation. **Why:** More than roughly ten dots are hard to count at a glance. · P simplicity · L attention, flow · S compose, structure · M d/d/d/d
### Customizing indicators

- `page-controls/customizing-indicators/make-sure-custom-indicator-images-are` **Do:** Keep custom indicator images simple: no intricate shapes, negative space, text or inner lines; consider simple SF Symbols or your own icons. **Why:** Such details turn muddy and unreadable at very small sizes. · P simplicity, craft · L attention · S express · M d/d/t/t
- `page-controls/customizing-indicators/customize-the-default-indicator-image-only` **Do:** Swap the default indicator image only if the new one adds meaning, like a bookmark symbol when every page holds bookmarks. **Why:** A change should reinforce what the page control means. · P simplicity, purpose · L attention, content · S express · M d/d/t/t
- `page-controls/customizing-indicators/avoid-using-more-than-two-different` **Do:** Use at most two kinds of indicator image, e.g. one unique symbol for a special page like current location. **Why:** Many distinct images force people to memorize meanings and look messy even when each is clear. · P simplicity, craft · L attention, interaction · S express · M d/d/t/t
- `page-controls/customizing-indicators/avoid-coloring-indicator-images` **Do:** Leave indicator coloring to the system rather than applying custom colors. **Why:** Custom colors can weaken the contrast marking the current page, hurting visibility across contexts. · P craft, familiarity · L attention, interaction · S express · M d/d/t/t
### Platform considerations > iOS, iPadOS

- `page-controls/platform-considerations/ios-ipados/avoid-animating-page-transitions-during-scrubbing` [iOS, iPadOS] **Do:** On iPhone and iPad, animate the scrolling transition only for taps, not while scrubbing, and pick the background style (automatic, prominent, minimal) to match the control's role. **Why:** Fast scrubbing with animated transitions makes the app lag and flash distractingly. · P craft, delight · L interaction, platform · S interact · M d/d/-/-
- `page-controls/platform-considerations/ios-ipados/avoid-supporting-the-scrubber-when-you` [iOS, iPadOS] **Do:** On iPhone and iPad, to allow scrubbing pages, pick the automatic or prominent background style rather than minimal. **Why:** The minimal style gives no visual feedback while scrubbing. · P craft, agency · L interaction, platform · S interact · M d/d/-/-
### Platform considerations > tvOS

- `page-controls/platform-considerations/tvos/use-page-controls-on-collections-of` [tvOS] **Do:** On tvOS, use page controls for sets of full-screen, content-rich peer pages, without extra controls on them. **Why:** Added controls make it hard to keep focus when moving between pages. · P familiarity, simplicity · L interaction, platform · S structure, compose · M t/t/t/-
### Platform considerations > watchOS

- `page-controls/platform-considerations/watchos/use-vertical-pagination-to-separate-multiple` [watchOS] **Do:** On watchOS, split multiple views into vertical pages that each have a clear purpose, navigated by Digital Crown scrolling. **Why:** On watchOS this works better than horizontal paging or deep hierarchical navigation. · P simplicity, purpose · L flow, platform · S structure · M t/-/-/-
- `page-controls/platform-considerations/watchos/consider-limiting-the-content-of-an` [watchOS] **Do:** On watchOS, try to fit each page within one screen height; use variable-height pages carefully, placed after fixed-height ones if possible. **Why:** The constraint gives each page a distinct purpose and a more glanceable design. · P simplicity, purpose · L attention, platform · S compose · M t/-/t/t

## Panels (`panels`)

Presentation · <https://developer.apple.com/design/human-interface-guidelines/panels>

### Best practices

- `panels/best-practices/use-a-panel-to-give-people` **Do:** Use a panel for quick access to controls or information relating to the content being worked on, such as settings for the selected item. **Why:** It keeps relevant tools close to the work at hand. · P agency, purpose · L interaction, value · S compose · M -/t/-/-
- `panels/best-practices/consider-using-a-panel-to-present` **Do:** Consider a panel for an inspector that updates with the selection; use a regular window for an Info window with fixed contents, or a split view pane as an alternative. **Why:** Inspectors follow the current selection, whereas Info windows keep unchanged contents. · P familiarity, simplicity · L interaction, platform · S compose · M -/t/-/-
- `panels/best-practices/prefer-simple-adjustment-controls-in-a` **Do:** Favor sliders and steppers in panels over controls needing typed text or picking items first. **Why:** Typing and selecting take several steps, while sliders and steppers give more direct control. · P simplicity, agency · L interaction · S interact, compose · M -/t/-/-
- `panels/best-practices/write-a-brief-title-that-describes` **Do:** Give a floating panel a title bar with a short noun or noun phrase in title case that names its purpose, such as Fonts or Inspector. **Why:** The title bar lets people reposition the panel, and a brief noun helps them recognize it. · P simplicity, familiarity · L content · S write · M -/t/-/-
- `panels/best-practices/show-and-hide-panels-appropriately` **Do:** When the app becomes active, bring all its open panels forward regardless of which window opened them; hide them when it is inactive. · P familiarity, craft · L interaction, platform · S interact · M -/t/-/-
- `panels/best-practices/avoid-including-panels-in-the-window` **Do:** Keep panels out of the Window menu's document list; commands that show or hide panels there are fine. **Why:** Panels aren't documents or standard app windows, so they don't belong in that list. · P familiarity · L flow, platform · S structure · M -/t/-/-
- `panels/best-practices/in-general-avoid-making-a-panels` **Do:** Usually leave the minimize button off panels. **Why:** Panels show only when needed and vanish when the app is inactive, so minimizing is rarely useful. · P simplicity, familiarity · L interaction, platform · S interact · M -/t/-/-
- `panels/best-practices/refer-to-panels-by-title-in` **Do:** Name panels by their titles in menus and help, without the word panel ("Show Fonts"); in help, add "window" to the title if clearer. **Why:** Introducing panel as a separate window type can confuse people. · P simplicity, familiarity · L content · S write · M -/t/-/-
### HUD-style panels

- `panels/hud-style-panels/prefer-standard-panels` **Do:** Default to standard panels; use a HUD only in media apps, when a standard panel would hide essential content, or when no controls are needed beyond a disclosure triangle. **Why:** A HUD without logical reason can distract or confuse, may not match the appearance setting, and most system controls don't suit it. · P familiarity, simplicity · L attention, platform · S compose, express · M -/t/-/-
- `panels/hud-style-panels/maintain-one-panel-style-when-your` **Do:** Keep the same panel style when the app switches modes, e.g. stay with a HUD after leaving full screen. **Why:** Consistent style across modes keeps the experience familiar. · P familiarity · L attention, platform · S express · M -/t/-/-
- `panels/hud-style-panels/use-color-sparingly-in-huds` **Do:** Limit HUD color to small touches of high-contrast color that highlight important information. **Why:** Too much color in a HUD's dark appearance is distracting. · P simplicity, craft · L attention · S express · M -/t/d/d
- `panels/hud-style-panels/keep-huds-small` **Do:** Keep HUDs compact so they don't cover the content they adjust or compete with it for attention. **Why:** HUDs are meant to be unobtrusively useful; a large one defeats that purpose. · P simplicity, purpose · L attention · S compose · M -/t/-/-

## Popovers (`popovers`)

Presentation · <https://developer.apple.com/design/human-interface-guidelines/popovers>

### Best practices

- `popovers/best-practices/use-a-popover-to-expose-a` **Do:** Limit a popover to a few related tasks and little information, like changing an event's date or calendar. **Why:** It closes after interaction, so people can carry on with what they were reviewing. · P simplicity, agency · L interaction, flow · S interact, compose · M d/d/-/-
- `popovers/best-practices/consider-using-popovers-when-you-want` **Do:** Present temporary content in a popover instead of a sidebar or panel to save room. **Why:** Sidebars and panels consume lots of space, and a popover streamlines the interface. · P simplicity · L attention, flow · S compose · M d/d/-/-
- `popovers/best-practices/position-popovers-appropriately` **Do:** Aim the popover arrow directly at the element that opened it, and avoid covering that element or essential content. **Why:** Clear pointing and visible context keep the popover tied to its source. · P craft, simplicity · L attention · S compose · M d/d/-/-
- `popovers/best-practices/use-a-close-button-for-confirmation` **Do:** Add a Close, Cancel or Done button only when it clarifies something like saving; otherwise dismiss on outside click or item selection, and stay open for multi-select until explicit dismissal. **Why:** Extra close buttons add nothing unless they clarify the outcome. · P simplicity, agency · L interaction · S interact · M d/d/-/-
- `popovers/best-practices/always-save-work-when-automatically-closing` **Do:** Preserve people's work when a nonmodal popover closes automatically; discard it only after an explicit Cancel. **Why:** Clicking or tapping outside can dismiss it unintentionally. · P agency, responsibility · L interaction, trust · S interact · M d/d/-/-
- `popovers/best-practices/show-one-popover-at-a-time` **Do:** Show a single popover at once, never stack popovers from each other, and close the open one before opening another. **Why:** Several popovers clutter the interface and confuse people. · P simplicity · L flow, attention · S interact, compose · M d/d/-/-
- `popovers/best-practices/dont-show-another-view-over-a` **Do:** Let nothing appear above a popover except an alert. · P simplicity, familiarity · L flow, attention · S compose · M d/d/-/-
- `popovers/best-practices/when-possible-let-people-close-one` **Do:** Allow switching from one popover to another with a single click or tap, especially when multiple bar buttons each open one. **Why:** Extra gestures are unwanted when people move among several popovers. · P agency, simplicity · L interaction · S interact · M d/d/-/-
- `popovers/best-practices/avoid-making-a-popover-too-big` **Do:** Size a popover just big enough for its content and its pointer to the source; the system may adjust it to fit. · P simplicity, craft · L attention · S compose · M d/d/-/-
- `popovers/best-practices/provide-a-smooth-transition-when-changing` **Do:** Animate any resizing between condensed and expanded popover views. **Why:** Animating avoids making it seem that a different popover took the old one's place. · P craft, familiarity · L interaction, attention · S interact · M d/d/-/-
- `popovers/best-practices/avoid-using-the-word-popover-in` **Do:** In help text, describe the task or selection rather than the word popover, e.g. "Select the Show button." **Why:** Naming the task is more direct than naming a component type. · P simplicity · L content · S write · M d/d/d/d
- `popovers/best-practices/avoid-using-a-popover-to-show` **Do:** Don't deliver warnings in popovers; use an alert. **Why:** People can overlook a popover or close it by accident. · P responsibility, agency · L trust, interaction · S interact · M d/d/-/-
### Platform considerations > iOS, iPadOS

- `popovers/platform-considerations/ios-ipados/avoid-displaying-popovers-in-compact-views` [iOS, iPadOS] **Do:** On iPhone and iPad, reserve popovers for wide views and adapt to the content area's size class; in compact views, use a full-screen modal like a sheet. **Why:** Compact views should use all available screen space. · P flexibility · L platform, flow · S adapt · M d/d/-/-
### Platform considerations > macOS

- `popovers/platform-considerations/macos/consider-letting-people-detach-a-popover` [macOS] **Do:** On Mac, consider allowing a popover to be detached into a panel. **Why:** People may want it to stay visible while viewing other information. · P agency, flexibility · L interaction, platform · S interact · M -/t/-/-
- `popovers/platform-considerations/macos/make-minimal-appearance-changes-to-a` [macOS] **Do:** On Mac, make a detached popover's panel look much like the original popover. **Why:** A similar look helps people keep their context. · P familiarity · L attention, platform · S express · M -/t/-/-

## Scroll views (`scroll-views`)

Presentation · <https://developer.apple.com/design/human-interface-guidelines/scroll-views>

### Best practices

- `scroll-views/best-practices/support-default-scrolling-gestures-and-keyboard` **Do:** Support the standard scrolling gestures and keyboard shortcuts; with custom scrolling, give indicators the usual elastic behavior. **Why:** People know the systemwide scrolling behavior and expect it everywhere. · P familiarity · L interaction · S interact · M d/d/-/-
- `scroll-views/best-practices/make-it-apparent-when-content-is` **Do:** Show clearly that content continues beyond the view, e.g. by revealing partial content at the edge. **Why:** Scroll indicators aren't always visible, and pointing out more content is considerate. · P familiarity, agency · L attention, interaction · S compose · M d/d/t/t
- `scroll-views/best-practices/avoid-putting-a-scroll-view-inside` **Do:** Don't nest scroll views scrolling in the same direction; mixing horizontal inside vertical, or the reverse, is fine. **Why:** Same-direction nesting makes the interface unpredictable and hard to control. · P simplicity, familiarity · L interaction · S compose, interact · M d/d/-/-
- `scroll-views/best-practices/consider-supporting-page-by-page-scrolling` **Do:** Where it suits the content, offer scrolling a fixed page at a time, with a small overlap such as a line of text to preserve context. **Why:** Some people prefer fixed-size steps, and overlap helps them keep their place. · P agency, flexibility · L interaction · S interact · M d/d/t/-
- `scroll-views/best-practices/in-some-cases-scroll-automatically-to` **Do:** Scroll automatically when relevant content is out of sight, e.g. to a search match, a hidden insertion point, or in the direction a selecting pointer moves past the edge. **Why:** Automatic scrolling helps people find their place when what they need is hidden. · P agency, familiarity · L interaction, flow · S interact · M d/d/-/-
- `scroll-views/best-practices/if-you-support-zoom-set-appropriate` **Do:** When zoom is supported, set sensible minimum and maximum scales, avoiding extremes like one character filling the screen. **Why:** Extreme zoom levels make little sense in most situations. · P craft, simplicity · L interaction · S interact · M d/d/-/-
### Scroll edge effects

- `scroll-views/scroll-edge-effects/prefer-the-automatic-scroll-edge-effect` **Do:** Use the default automatic scroll edge effect where possible; if choosing the soft style, test thoroughly that controls stay legible. **Why:** Automatic gives a more opaque separation for busy toolbars, text outside Liquid Glass controls, and pinned headers. · P craft, familiarity · L attention, platform · S express · M t/t/-/-
- `scroll-views/scroll-edge-effects/only-use-a-scroll-edge-effect` **Do:** Apply a scroll edge effect only when a scroll view sits behind floating interface elements, not as decoration. **Why:** Its job is to keep controls visually distinct, not to block or darken content. · P simplicity, craft · L attention · S express · M t/t/-/-
- `scroll-views/scroll-edge-effects/apply-one-scroll-edge-effect-per` **Do:** Use one scroll edge effect per view; in iPad and Mac split views each pane may have one, with matching heights. **Why:** Matching heights keep the panes aligned. · P craft, simplicity · L attention, platform · S express, compose · M t/t/-/-
### Platform considerations > iOS, iPadOS

- `scroll-views/platform-considerations/ios-ipados/consider-showing-a-page-control-when` [iOS, iPadOS] **Do:** On iPhone and iPad, in paged scrolling, consider a page control for count and position, and hide the scroll indicator on the same axis. **Why:** Showing both would be redundant controls that confuse people. · P simplicity, familiarity · L interaction, attention · S interact, compose · M d/d/t/t
### Platform considerations > macOS

- `scroll-views/platform-considerations/macos/if-necessary-use-small-or-mini` [macOS] **Do:** On Mac, when space is tight in a panel, use small or mini scroll bars, and make every control in that panel the same size. **Why:** Smaller bars let panels coexist with other windows when space is limited. · P craft, flexibility · L platform, attention · S compose · M -/t/-/-
### Platform considerations > visionOS

- `scroll-views/platform-considerations/visionos/if-necessary-account-for-the-size` [visionOS] **Do:** On visionOS, widen tight content margins if needed so the slightly thicker scroll indicator doesn't overlap content. **Why:** The indicator is a bit thicker than on iOS and could overlap content. · P craft · L attention, platform · S compose · M -/-/-/-
### Platform considerations > visionOS > Look to Scroll

- `scroll-views/platform-considerations/visionos/look-to-scroll/support-look-to-scroll-for-reading` [visionOS] **Do:** On visionOS, add Look to Scroll to each reading or browsing scroll view, since it isn't on by default. **Why:** It gives a comfortable, hands-free experience for reading and browsing. · P flexibility, agency · L interaction, platform · S interact · M -/-/-/-
- `scroll-views/platform-considerations/visionos/look-to-scroll/avoid-using-look-to-scroll-for` [visionOS] **Do:** On visionOS, skip Look to Scroll in views with controls or dense information needing fast, precise scrolling, like a notes list; keep standard gestures. **Why:** Quick, precise scrolling suits standard gestures better. · P craft, familiarity · L interaction, platform · S interact · M -/-/-/-
- `scroll-views/platform-considerations/visionos/look-to-scroll/maintain-consistency-across-content` [visionOS] **Do:** On visionOS, if one view offers Look to Scroll, offer it in all similar views, such as every video collection. **Why:** People then know what to expect. · P familiarity · L interaction, platform · S interact · M -/-/-/-
- `scroll-views/platform-considerations/visionos/look-to-scroll/define-clear-scroll-areas-within-your` [visionOS] **Do:** On visionOS, make Look to Scroll views full window width or height; if inset, mark clear boundaries. **Why:** Full-size views give ample room and clear edges, so people know where to look. · P craft, familiarity · L interaction, platform · S compose · M -/-/-/-
- `scroll-views/platform-considerations/visionos/look-to-scroll/if-your-app-uses-custom-scroll` [visionOS] **Do:** On visionOS, remove scroll-position-driven effects such as parallax and animations before enabling Look to Scroll. **Why:** They can make Look to Scroll behave unexpectedly. · P craft · L interaction, platform · S interact · M -/-/-/-
### Platform considerations > watchOS

- `scroll-views/platform-considerations/watchos/prefer-vertically-scrolling-content` [watchOS] **Do:** On Apple Watch, lay out content to scroll vertically so the Digital Crown scrolls it when taller than the display. **Why:** People are used to using the Digital Crown for navigation in Apple Watch apps. · P familiarity · L interaction, platform · S interact, compose · M t/-/-/-
- `scroll-views/platform-considerations/watchos/use-tab-views-to-provide-page` [watchOS] **Do:** On watchOS, stack tab views vertically to give full-screen pages navigated with the Digital Crown, with the system's page indicator. **Why:** The indicator shows where people are within a page and the set of pages. · P familiarity, simplicity · L interaction, platform · S structure, interact · M -/-/-/-
- `scroll-views/platform-considerations/watchos/when-displaying-paged-content-consider-limiting` [watchOS] **Do:** On watchOS, try to keep each page to one screen height; use variable-height pages carefully, after fixed-height ones. **Why:** The limit clarifies each page's purpose and makes the design glanceable; long pages still work via the expanding indicator. · P simplicity, purpose · L attention, platform · S compose · M t/-/t/t

## Sheets (`sheets`)

Presentation · <https://developer.apple.com/design/human-interface-guidelines/sheets>

### Best practices

- `sheets/best-practices/for-complex-or-prolonged-user-flows` **Do:** For long or complex flows, use alternatives to sheets: full-screen modal on iOS and iPadOS, a new window or full screen on Mac, a Full Space on visionOS. **Why:** These suit multistep tasks, media viewing and self-contained work better than a sheet. · P flexibility, agency · L flow, platform · S structure, adapt · M d/t/-/-
- `sheets/best-practices/display-only-one-sheet-at-a` **Do:** Keep to one sheet at a time on the main interface. If an action inside a sheet needs another sheet, dismiss the first, then optionally reopen it later. **Why:** Closing a sheet should return to the parent view; sheet-to-sheet returns make people lose track of where they are. · P simplicity, familiarity · L flow · S structure, interact · M d/d/-/-
- `sheets/best-practices/use-a-nonmodal-view-when-you` **Do:** For supplementary items affecting the main task, use a nonmodal view: split view on visionOS, panel on macOS, nonmodal sheet on iOS and iPadOS. **Why:** People can reach needed information and actions while still working in the main window. · P agency, flexibility · L flow, platform · S structure · M d/t/-/-
- `sheets/best-practices/provide-an-alternative-to-the-done` **Do:** Pair a Done button with Cancel or with Back for a previous step, but don't show all three together. **Why:** A Done-only sheet implies finishing is the sole exit, which feels restrictive or misleading. · P agency · L interaction, flow · S interact · M d/d/-/-
### Platform considerations > iOS, iPadOS

- `sheets/platform-considerations/ios-ipados/in-an-iphone-app-consider-supporting` [iOS, iPadOS] **Do:** In iPhone apps, consider a medium detent that shows the most relevant content first and expands for more; skip it if the content works best at full height. **Why:** Progressive disclosure shows key items without resizing, but creation sheets need full room. · P simplicity, purpose · L flow, platform · S interact, compose · M d/t/-/-
- `sheets/platform-considerations/ios-ipados/include-a-grabber-in-a-resizable` [iOS, iPadOS] **Do:** On iOS and iPadOS, add a grabber to any resizable sheet so people can drag it or tap it to step through sizes. **Why:** It signals that resizing is possible and also works with VoiceOver, so people can resize without seeing the screen. · P flexibility, familiarity · L interaction, inclusion · S interact, include · M d/t/-/-
- `sheets/platform-considerations/ios-ipados/support-swiping-to-dismiss-a-sheet` [iOS, iPadOS] **Do:** On iOS and iPadOS, let people swipe a sheet down to close it; if unsaved changes exist, confirm with an action sheet. **Why:** People expect a vertical swipe to dismiss a sheet, and a confirmation prevents losing unsaved work. · P familiarity, agency · L interaction, platform · S interact · M d/t/-/-
- `sheets/platform-considerations/ios-ipados/prefer-using-the-page-or-form` [iOS, iPadOS] **Do:** In an iPadOS app, favor the page or form sheet presentation styles. **Why:** Each uses a default size and centers content over a dimmed background, giving a consistent experience. · P familiarity · L platform · S compose · M t/-/-/-
### Platform considerations > macOS

- `sheets/platform-considerations/macos/present-a-sheet-in-a-reasonable` [macOS] **Do:** On macOS, open sheets at a default size that fits their content, and allow resizing where people may want to expand the content. **Why:** People don't normally expect to resize sheets, but sometimes a larger view helps them see content more clearly. · P familiarity, flexibility · L platform, interaction · S compose, adapt · M -/t/-/-
- `sheets/platform-considerations/macos/let-people-interact-with-other-app` [macOS] **Do:** On macOS, ensure people can bring other app windows forward even while a sheet is still open on its parent window. **Why:** People shouldn't be forced to dismiss the sheet before working in a different window of the app. · P agency · L flow, platform · S interact · M -/t/-/-
- `sheets/platform-considerations/macos/use-a-panel-instead-of-a` [macOS] **Do:** On macOS, use a panel rather than a sheet when people must give input repeatedly and watch each outcome, like find and replace. **Why:** A panel lets people trigger actions one at a time and check each result for correctness. · P agency, purpose · L flow, interaction · S structure, interact · M -/t/-/-
### Platform considerations > visionOS

- `sheets/platform-considerations/visionos/avoid-displaying-a-sheet-that-emerges` [visionOS] **Do:** On visionOS, don't slide a sheet up from a window's bottom edge; center it in the person's field of view. **Why:** Centering makes the sheet easier to see. · P flexibility · L platform, attention · S compose · M -/-/-/-
- `sheets/platform-considerations/visionos/present-a-sheet-in-a-default` [visionOS] **Do:** On visionOS, size a sheet so it doesn't cover most of its window, optionally allowing people to resize it. **Why:** A modest size helps people keep their bearings in the underlying context. · P flexibility · L platform, flow · S compose, adapt · M -/-/-/-
### Platform considerations > watchOS

- `sheets/platform-considerations/watchos/use-a-sheet-only-when-your` [watchOS] **Do:** On Apple Watch, use a sheet only if the modal task needs custom titling or custom content; for key information or choices, use an alert or action sheet. **Why:** Alerts and action sheets already suit conveying important information and presenting choices. · P simplicity, familiarity · L platform, flow · S structure · M -/-/-/-
- `sheets/platform-considerations/watchos/keep-sheet-interactions-brief-and-occasional` [watchOS] **Do:** On Apple Watch, treat a sheet as a short, infrequent interruption for an important task, never as a way to browse content. **Why:** Sheets interrupt the current workflow, so they should be reserved for something that warrants it. · P simplicity, agency · L flow, platform · S structure, interact · M -/-/-/-
- `sheets/platform-considerations/watchos/if-you-change-the-default-label` [watchOS] **Do:** On Apple Watch, if you replace the default sheet label, use an SF Symbol for the action and avoid text that resembles a back button or page title. **Why:** Misleading labels suggest hierarchical navigation, and title-like text leaves people unsure how to dismiss the sheet. · P familiarity, simplicity · L platform, content · S express, write · M -/-/-/-

## Windows (`windows`)

Presentation · <https://developer.apple.com/design/human-interface-guidelines/windows>

### Best practices

- `windows/best-practices/make-sure-that-your-windows-adapt` **Do:** Design windows to adapt smoothly across sizes so multitasking and multiwindow use work well. **Why:** Fluid resizing supports people who work across several windows or share the screen with other apps. · P flexibility · L platform, flow · S adapt, compose · M t/d/-/-
- `windows/best-practices/choose-the-right-moment-to-open` **Do:** Open a new window only when it helps, such as showing a new message beside an existing one; don't make it the default. **Why:** Separate windows aid multitasking and context, but too many create clutter and make the app harder to navigate. · P simplicity, agency · L flow · S structure · M t/d/-/-
- `windows/best-practices/consider-providing-the-option-to-view` **Do:** Offer an explicit command, such as in a context menu or File menu, to view content in a new window. **Why:** Giving people the choice lets them view content in multiple ways without forcing new windows by default. · P agency, flexibility · L flow, interaction · S structure, interact · M t/d/-/-
- `windows/best-practices/avoid-creating-custom-window-ui` **Do:** Rely on system-provided windows; don't build custom frames or controls or imitate the system look. **Why:** System windows are recognized and understood, and an imperfect imitation makes the app feel broken. · P familiarity, craft · L platform, interaction · S express, compose · M t/t/-/-
- `windows/best-practices/use-the-term-window-in-user` **Do:** Call app windows "window" in user-facing text, not "scene" or other terms. **Why:** The system uses "window" for every type, so other terms are likely to confuse people. · P familiarity, simplicity · L content · S write · M d/d/-/-
### Platform considerations > iPadOS

- `windows/platform-considerations/ipados/make-sure-window-controls-dont-overlap` [iPadOS] **Do:** On iPadOS, shift leading-edge toolbar buttons inward when window controls appear so they aren't hidden. **Why:** Windowed apps show controls at the toolbar's leading edge, which can cover buttons placed there. · P craft, flexibility · L platform, interaction · S compose, adapt · M t/-/-/-
- `windows/platform-considerations/ipados/consider-letting-people-use-a-gesture` [iPadOS] **Do:** On iPadOS, consider a gesture such as pinch to expand an item into its own window; single-file viewing still requires multiwindow support. **Why:** A gesture offers a quick, natural path to opening content separately. · P agency, familiarity · L interaction, platform · S interact · M t/-/-/-
### Platform considerations > macOS > macOS window states

- `windows/platform-considerations/macos/macos-window-states/make-sure-custom-windows-use-the` [macOS] **Do:** On macOS, make custom windows adopt the system appearance for each window state, updating backgrounds and buttons yourself when you skip system components. **Why:** People use these visual differences to tell which window is in front and will receive their input. · P familiarity, craft · L attention, platform · S express, interact · M -/t/-/-
- `windows/platform-considerations/macos/macos-window-states/avoid-putting-critical-information-or-actions` [macOS] **Do:** On macOS, keep crucial information and actions out of a window's bottom bar; if you use one, limit it to a little related info and put more in an inspector. **Why:** People often move windows so the bottom edge is hidden, and a bottom bar has little room. · P simplicity, flexibility · L attention, platform · S compose · M -/t/-/-
### Platform considerations > visionOS > visionOS windows

- `windows/platform-considerations/visionos/visionos-windows/prefer-using-a-window-to-present` [visionOS] **Do:** On visionOS, use a window for familiar interfaces and tasks, saving immersive experiences for meaningful content; use a volume for bounded 3D items. **Why:** A comfortable, known interface helps people feel at home in the app. · P familiarity · L platform · S structure, compose · M -/-/-/-
- `windows/platform-considerations/visionos/visionos-windows/retain-the-windows-glass-background` [visionOS] **Do:** On visionOS, keep the default glass background on windows instead of removing it or making it opaque. **Why:** Glass blends content into the surroundings and conveys scale; without it text is less legible and elements seem unrelated, while opaque feels heavy and hides surroundings. · P craft, flexibility · L attention, platform · S express · M -/-/-/-
- `windows/platform-considerations/visionos/visionos-windows/choose-an-initial-window-size-that` [visionOS] **Do:** On visionOS, pick an opening window size that leaves little unused space inside. **Why:** Excess empty area makes a window look needlessly large and hides other things in the person's space. · P simplicity, craft · L platform, attention · S compose · M -/-/-/-
- `windows/platform-considerations/visionos/visionos-windows/aim-for-an-initial-shape-that` [visionOS] **Do:** On visionOS, give a window an opening shape matching its content, wide for slides, tall for long pages or tall games. **Why:** The shape should reflect the proportions of what the window shows. · P flexibility, craft · L platform, attention · S compose · M -/-/-/-
- `windows/platform-considerations/visionos/visionos-windows/choose-a-minimum-and-maximum-size` [visionOS] **Do:** On visionOS, set minimum and maximum window sizes and verify the layout holds up across that range. **Why:** Without limits, people could shrink windows until elements overlap or enlarge them until the app becomes unusable. · P flexibility, craft · L platform, interaction · S adapt, compose · M -/-/-/-
- `windows/platform-considerations/visionos/visionos-windows/minimize-the-depth-of-3d-content` [visionOS] **Do:** On visionOS, keep 3D content in a window shallow; use a volume for content with greater depth. **Why:** The system clips 3D content extending too far from the window surface. · P craft · L platform · S compose · M -/-/-/-
### Platform considerations > visionOS > visionOS volumes

- `windows/platform-considerations/visionos/visionos-volumes/prefer-using-a-volume-to-display` [visionOS] **Do:** On visionOS, show rich 3D content in a volume, and use a window for a familiar UI-centered interface. **Why:** Each container fits a different kind of content best. · P purpose, familiarity · L platform · S structure, compose · M -/-/-/-
- `windows/platform-considerations/visionos/visionos-volumes/place-2d-content-so-it-looks` [visionOS] **Do:** On visionOS, position 2D content in a volume so it reads well from any viewing angle, using an attachment to anchor it to 3D content. **Why:** As viewers move around, a flat item's apparent position can shift in confusing ways. · P flexibility, craft · L platform · S compose · M -/-/-/-
- `windows/platform-considerations/visionos/visionos-volumes/in-general-use-dynamic-scaling` [visionOS] **Do:** On visionOS, normally use dynamic scaling for volumes; choose fixed scaling when content stands for a real-world object. **Why:** Dynamic scaling keeps content legible and easy to use at a distance. · P flexibility · L platform, attention · S adapt, express · M -/-/-/-
- `windows/platform-considerations/visionos/visionos-volumes/take-advantage-of-the-default-baseplate` [visionOS] **Do:** On visionOS, use the default baseplate glow to show a volume's edges, unless content is full bleed or you supply a custom baseplate. **Why:** The glow reveals the volume's bounds and keeps the resize control easy to find when content doesn't fill it. · P craft, familiarity · L platform, attention · S express · M -/-/-/-
- `windows/platform-considerations/visionos/visionos-volumes/consider-offering-high-value-content-in` [visionOS] **Do:** On visionOS, consider one ornament to hold important views or controls, placed on a different edge from the toolbar or tab bar. **Why:** An ornament reduces clutter and elevates key items, but extra ones would overshadow the main content. · P simplicity, purpose · L platform, attention · S compose · M -/-/-/-
- `windows/platform-considerations/visionos/visionos-volumes/choose-an-alignment-that-supports-the` [visionOS] **Do:** On visionOS, keep a volume parallel to the floor for lightly used content, and tilt it to follow the viewer's gaze for content they interact with more. **Why:** A tilting volume stays comfortable to use for a viewer who is lying back. · P flexibility · L platform, interaction · S interact, adapt · M -/-/-/-

## Color wells (`color-wells`)

Selection and input · <https://developer.apple.com/design/human-interface-guidelines/color-wells>

### Best practices

- `color-wells/best-practices/consider-the-system-provided-color-picker` **Do:** Prefer the built-in system color picker for choosing colors. **Why:** It gives a consistent, familiar experience across iOS, iPadOS, and macOS, and lets people keep saved colors available in every app. · P familiarity · L interaction, platform · S compose, interact · M t/t/-/-

## Combo boxes (`combo-boxes`)

Selection and input · <https://developer.apple.com/design/human-interface-guidelines/combo-boxes>

### Best practices

- `combo-boxes/best-practices/populate-the-field-with-a-meaningful` **Do:** Pre-fill the combo box with a sensible default drawn from its list, ideally one that hints at the hidden choices; it needn't be the first item. **Why:** A default that points to the concealed options helps people understand what the field offers. · P familiarity, simplicity · L interaction, content · S interact · M t/d/-/-
- `combo-boxes/best-practices/use-an-introductory-label-to-let` **Do:** Add a lead-in label telling people what kind of items to expect, in title-style capitalization ending with a colon. **Why:** A label sets expectations about the contents of the list. · P simplicity, familiarity · L content · S write · M t/d/-/-
- `combo-boxes/best-practices/provide-relevant-choices` **Do:** Offer the most likely options in the list while still allowing a custom entry. **Why:** People value both the convenience of picking a common choice and the freedom to type their own. · P agency, simplicity · L interaction, value · S interact · M t/d/-/-
- `combo-boxes/best-practices/make-sure-list-items-arent-wider` **Do:** Keep list items no wider than the text field. **Why:** Overly wide items get truncated, which is hard to read. · P craft · L attention · S compose · M t/d/-/-

## Digit entry views (`digit-entry-views`)

Selection and input · <https://developer.apple.com/design/human-interface-guidelines/digit-entry-views>

### Best practices

- `digit-entry-views/best-practices/use-secure-digit-fields` **Do:** Use secure digit fields, which mask digits with asterisks, whenever the app asks for sensitive data. **Why:** Masking keeps entered sensitive digits from showing onscreen. · P responsibility · L trust · S include, interact · M d/d/-/-
- `digit-entry-views/best-practices/clearly-state-the-purpose-of-the` **Do:** Give the digit entry view a title and prompt that explain why the digits are needed. **Why:** People should understand the reason before entering numbers. · P responsibility, simplicity · L content, trust · S write · M d/d/-/-

## Image wells (`image-wells`)

Selection and input · <https://developer.apple.com/design/human-interface-guidelines/image-wells>

### Best practices

- `image-wells/best-practices/revert-to-a-default-image-when` **Do:** If an image well must always hold an image, show the default image again once people clear its content. **Why:** It avoids leaving a required slot empty. · P agency, familiarity · L interaction · S interact · M t/t/-/-
- `image-wells/best-practices/if-your-image-well-supports-copy` **Do:** When an image well supports copy and paste, keep the standard Edit menu items and keyboard shortcuts available. **Why:** People expect to use those menu items or shortcuts with an image well. · P familiarity · L interaction, platform · S interact · M t/t/-/-

## Pickers (`pickers`)

Selection and input · <https://developer.apple.com/design/human-interface-guidelines/pickers>

### Best practices

- `pickers/best-practices/consider-using-a-picker-to-offer` **Do:** Use a picker for mid-length to long lists; use a pull-down button for short ones, and a list or table for very large sets. **Why:** A picker suits scrolling many items but adds visual weight to short lists; lists and tables handle huge sets, with indexes for quick jumps. · P simplicity, familiarity · L interaction, attention · S compose · M d/t/-/-
- `pickers/best-practices/use-predictable-and-logically-ordered-values` **Do:** Order picker values logically, like an alphabetized country list, so hidden values can be anticipated. **Why:** Predictable ordering lets people move through the items quickly even when most are out of view. · P simplicity, familiarity · L interaction, content · S interact · M d/t/-/-
- `pickers/best-practices/avoid-switching-views-to-show-a` **Do:** Show a picker in context, near the field being edited, such as at the bottom of the window or in a popover, rather than switching views. **Why:** Staying near the field keeps people oriented in what they're editing. · P agency, simplicity · L flow, interaction · S interact, compose · M d/t/-/-
- `pickers/best-practices/consider-providing-less-granularity-when-specifying` **Do:** In a date picker, consider a larger minute interval that divides evenly into 60, such as quarter-hour steps. **Why:** Fewer minute values than the default 60 make choosing quicker. · P simplicity · L interaction · S interact · M d/t/-/-
### Platform considerations > iOS, iPadOS

- `pickers/platform-considerations/ios-ipados/use-a-compact-date-picker-when` [iOS, iPadOS] **Do:** On iOS and iPadOS, use the compact date picker when space is tight; it shows the value as a button that opens a calendar-style editor. **Why:** It saves room while still giving a familiar editor for multiple date and time changes. · P simplicity, flexibility · L platform, interaction · S compose, adapt · M d/t/-/-
### Platform considerations > macOS

- `pickers/platform-considerations/macos/choose-a-date-picker-style-that` [macOS] **Do:** On macOS, use the textual date picker for tight space and precise entries; use graphical for browsing a calendar, choosing ranges, or a clock look. **Why:** Each style fits a different situation of space and selection behavior. · P flexibility, familiarity · L platform, interaction · S compose · M -/t/-/-

## Segmented controls (`segmented-controls`)

Selection and input · <https://developer.apple.com/design/human-interface-guidelines/segmented-controls>

### Best practices

- `segmented-controls/best-practices/use-a-segmented-control-to-provide` **Do:** Use a segmented control for closely related options that modify an object, state, or view, such as attributes in an inspector or time ranges. **Why:** Putting related choices side by side shows how they belong together. · P familiarity, simplicity · L interaction, attention · S compose · M d/d/-/-
- `segmented-controls/best-practices/consider-a-segmented-control-when-its` **Do:** Choose a segmented control when functions should stay grouped together or the current selection needs to be obvious. **Why:** Unlike other button styles, it keeps its grouping at any size or location and shows at a glance which option is selected. · P simplicity, familiarity · L attention, interaction · S compose · M d/d/-/-
- `segmented-controls/best-practices/keep-control-types-consistent-within-a` **Do:** Within one segmented control, don't mix action segments with selection segments; keep every segment the same kind. **Why:** Mixing selection and action behavior confuses what the control does. · P familiarity, simplicity · L interaction · S interact, compose · M d/d/-/-
- `segmented-controls/best-practices/limit-the-number-of-segments-in` **Do:** Keep segment counts low: about five to seven in a wide interface and about five on iPhone. **Why:** Too many segments are hard to parse and slow to move through. · P simplicity · L interaction, attention · S compose · M d/d/-/-
- `segmented-controls/best-practices/in-general-keep-segment-size-consistent` **Do:** Make all segments the same width where you can, and keep icon and title widths similar too. **Why:** Equal widths make the control feel balanced. · P craft, simplicity · L attention · S compose, express · M d/d/-/-
### Content

- `segmented-controls/content/prefer-using-either-text-or-images` **Do:** Fill a segmented control with either text labels or images, not a combination. **Why:** Mixing the two makes the interface feel disconnected and confusing. · P simplicity, familiarity · L content, attention · S express, write · M d/d/-/-
- `segmented-controls/content/as-much-as-possible-use-content` **Do:** Give segments content of comparable size. **Why:** Segments share equal width, so content filling some but leaving others sparse looks unbalanced. · P craft · L attention · S compose · M d/d/-/-
- `segmented-controls/content/use-nouns-or-noun-phrases-for` **Do:** Label segments with nouns or noun phrases in title-style capitalization; text-labeled controls need no intro text. **Why:** Descriptive noun labels already tell people what each segment is. · P simplicity, familiarity · L content · S write · M d/d/-/-
### Platform considerations > iOS, iPadOS

- `segmented-controls/platform-considerations/ios-ipados/consider-a-segmented-control-to-switch` [iOS, iPadOS] **Do:** On iOS and iPadOS, use a segmented control for quick switching between closely related subviews; use a tab bar for fully separate app sections. **Why:** It switches related views fast, while separate sections belong in a tab bar. · P familiarity, simplicity · L flow, platform · S structure, compose · M d/d/-/-
### Platform considerations > macOS

- `segmented-controls/platform-considerations/macos/consider-using-introductory-text-to-clarify` [macOS] **Do:** On macOS, add intro text to clarify a segmented control; with symbol segments, add a label under each, and give each segment a tooltip if the app uses them. **Why:** Symbols alone can leave a segment's meaning unclear. · P simplicity, flexibility · L content, platform · S write, include · M -/t/-/-
- `segmented-controls/platform-considerations/macos/use-a-tab-view-in-the` [macOS] **Do:** On macOS, switch views in the main window area with a tab view; reserve segmented controls for toolbars or inspector panes. **Why:** A tab view supports efficient view switching in the main area. · P familiarity · L flow, platform · S structure, compose · M -/t/-/-
- `segmented-controls/platform-considerations/macos/consider-supporting-spring-loading` [macOS] **Do:** On a Mac with a Magic Trackpad, consider spring loading so dragged items can activate a segment by force click without being dropped. **Why:** People can activate a segment mid-drag and keep dragging afterward. · P agency, flexibility · L interaction, platform · S interact · M -/-/-/-
### Platform considerations > tvOS

- `segmented-controls/platform-considerations/tvos/consider-using-a-split-view-instead` [tvOS] **Do:** On Apple TV, use a split view rather than a segmented control on screens that filter content. **Why:** Moving between content and filter options is easy in a split view, while a segmented control may be harder to reach. · P familiarity, simplicity · L flow, platform · S structure, compose · M -/-/-/-
- `segmented-controls/platform-considerations/tvos/avoid-putting-other-focusable-elements-close` [tvOS] **Do:** On Apple TV, keep other focusable elements away from segmented controls. **Why:** Segments are selected on focus, so nearby elements can be focused by accident while switching segments. · P craft, flexibility · L interaction, platform · S compose, interact · M -/-/-/-

## Sliders (`sliders`)

Selection and input · <https://developer.apple.com/design/human-interface-guidelines/sliders>

### Best practices

- `sliders/best-practices/customize-a-sliders-appearance-if-it` **Do:** Restyle a slider's track, thumb, or end icons only when it adds value, such as hinting at what it adjusts. **Why:** Custom styling can blend with the app and communicate the slider's intent. · P delight, purpose · L attention · S express · M d/d/-/-
- `sliders/best-practices/use-familiar-slider-directions` **Do:** Place minimum values on the leading side and maximum on the trailing side of horizontal sliders; minimum at bottom and maximum at top for vertical ones. **Why:** People expect slider directions to be consistent across all apps. · P familiarity · L interaction · S interact, compose · M d/d/-/-
- `sliders/best-practices/consider-supplementing-a-slider-with-a` **Do:** For wide value ranges, pair a slider with a text field showing the exact value and a stepper for whole-number steps. **Why:** People like seeing the precise value and entering a specific one directly. · P flexibility, agency · L interaction · S interact, compose · M d/d/-/-
### Platform considerations > iOS, iPadOS

- `sliders/platform-considerations/ios-ipados/dont-use-a-slider-to-adjust` [iOS, iPadOS] **Do:** On iOS and iPadOS, offer volume control through a volume view, not a plain slider; it includes a level slider and an output device control. **Why:** The volume view is customizable and also covers changing the audio output device. · P familiarity · L interaction, platform · S interact · M t/-/-/-
### Platform considerations > macOS

- `sliders/platform-considerations/macos/consider-giving-live-feedback-as-the` [macOS] **Do:** On macOS, show results in real time while a slider moves, like Dock icons rescaling as the Size slider changes. **Why:** Live feedback lets people see the effect as it happens. · P familiarity, delight · L interaction, platform · S interact · M d/d/-/-
- `sliders/platform-considerations/macos/choose-a-slider-style-that-matches` [macOS] **Do:** On macOS, use a horizontal slider between fixed endpoints and a circular slider for values that repeat or keep going, like rotation. **Why:** The style should match what people expect for the type of value. · P familiarity · L interaction, platform · S compose, interact · M t/d/-/-
- `sliders/platform-considerations/macos/consider-using-a-label-to-introduce` [macOS] **Do:** On macOS, consider a lead-in label for a slider, in sentence-style capitalization ending with a colon. **Why:** A label tells people what the slider controls. · P simplicity, familiarity · L content, platform · S write · M -/d/-/-
- `sliders/platform-considerations/macos/use-tick-marks-to-increase-clarity` [macOS] **Do:** On macOS, add tick marks to sliders. **Why:** They convey the measurement scale and make specific values easier to find. · P craft, simplicity · L attention, platform · S express, compose · M t/d/-/-
- `sliders/platform-considerations/macos/consider-adding-labels-to-tick-marks` [macOS] **Do:** On macOS, label tick marks with numbers or words where useful, often just the ends; label periodically for nonlinear scales and show the thumb value in a tooltip. **Why:** Labels add clarity, but labeling every tick is only needed to prevent confusion. · P simplicity, flexibility · L content, platform · S write, express · M t/d/-/-
### Platform considerations > visionOS

- `sliders/platform-considerations/visionos/prefer-horizontal-sliders` [visionOS] **Do:** On visionOS, favor horizontal sliders over vertical ones. **Why:** Side-to-side gestures are generally easier than up-and-down ones. · P flexibility · L interaction, platform · S compose · M -/-/-/-
### Platform considerations > watchOS

- `sliders/platform-considerations/watchos/if-necessary-create-custom-glyphs-to` [watchOS] **Do:** On Apple Watch, design custom glyphs if needed to show what a slider does, since the default shows plus and minus signs. **Why:** Default symbols may not convey the slider's specific purpose. · P simplicity, familiarity · L platform, content · S express · M -/-/-/-

## Steppers (`steppers`)

Selection and input · <https://developer.apple.com/design/human-interface-guidelines/steppers>

### Best practices

- `steppers/best-practices/make-the-value-that-a-stepper` **Do:** Make sure it is evident which value a stepper changes by showing that value nearby. **Why:** A stepper shows no value of its own, so people could otherwise not tell what they're adjusting. · P simplicity, familiarity · L content, interaction · S compose, write · M d/d/-/-
- `steppers/best-practices/consider-pairing-a-stepper-with-a` **Do:** Pair a stepper with a text field when large changes are likely; alone it suits small adjustments. **Why:** People appreciate typing a specific number when values vary widely, as with print copies. · P flexibility, agency · L interaction · S interact, compose · M d/d/-/-
### Platform considerations > macOS

- `steppers/platform-considerations/macos/for-large-value-ranges-consider-supporting` [macOS] **Do:** On macOS, for wide ranges, let Shift-click change the stepper by a bigger increment than usual, such as ten times. **Why:** It speeds up large changes to the value. · P flexibility, agency · L interaction, platform · S interact · M -/d/-/-

## Text fields (`text-fields`)

Selection and input · <https://developer.apple.com/design/human-interface-guidelines/text-fields>

### Best practices

- `text-fields/best-practices/use-a-text-field-to-request` **Do:** Use a text field for short input like a name or email; use a text view for longer text. **Why:** Field size and type should match the amount of text expected. · P simplicity, familiarity · L interaction · S compose · M d/d/-/-
- `text-fields/best-practices/show-a-hint-in-a-text` **Do:** Put placeholder hint text, such as "Email", in an empty field, and also add a separate label describing the field. **Why:** Placeholder text vanishes once typing begins, so a label keeps reminding people what the field is for. · P simplicity, flexibility · L content, interaction · S write, compose · M d/d/-/-
- `text-fields/best-practices/use-secure-text-fields-to-hide` **Do:** Use secure text fields for sensitive entries such as passwords. **Why:** They hide private data as it is typed. · P responsibility · L trust · S include, interact · M d/d/-/-
- `text-fields/best-practices/to-the-extent-possible-match-the` **Do:** Size each text field to suit how much text is expected. **Why:** Field size lets people visually judge how much information to provide. · P simplicity, craft · L attention, content · S compose · M d/d/-/-
- `text-fields/best-practices/evenly-space-multiple-text-fields` **Do:** Space multiple fields so each clearly pairs with its label, stack them vertically when possible, and share widths among similar fields. **Why:** Clear spacing and consistent widths make it easy to see which input goes with which label and give an orderly layout. · P craft, simplicity · L attention · S compose · M d/d/-/-
- `text-fields/best-practices/ensure-that-tabbing-between-multiple-fields` **Do:** Make tabbing between fields follow a logical order; the system usually handles this itself. **Why:** People expect focus to move predictably from field to field. · P familiarity · L interaction · S interact · M t/d/-/-
- `text-fields/best-practices/validate-fields-when-it-makes-sense` **Do:** Check field input at a sensible moment and warn about invalid entries: for email, when leaving the field; for usernames or passwords, before leaving it. **Why:** Timing varies by context, and people must be told when entries aren't valid. · P agency, responsibility · L interaction, content · S interact · M d/d/-/-
- `text-fields/best-practices/use-a-number-formatter-to-help` **Do:** Use a number formatter so numeric fields accept only numbers and show them as decimals, percentages, or currency, without assuming one presentation. **Why:** Number formatting differs significantly by locale. · P flexibility, craft · L inclusion, interaction · S interact, include · M d/d/-/-
- `text-fields/best-practices/adjust-line-breaks-according-to-the` **Do:** Pick how overflowing text behaves per field: clip it, wrap by character or word, or truncate with an ellipsis at the start, middle, or end. **Why:** Different fields need different handling when text exceeds the field bounds. · P flexibility, craft · L attention, content · S compose, interact · M d/d/-/-
- `text-fields/best-practices/consider-using-an-expansion-tooltip-to` **Do:** Offer an expansion tooltip on pointer hover that reveals the full text of clipped or truncated content. **Why:** People can read the whole text even when the field cuts it off. · P agency, flexibility · L interaction · S interact · M -/d/-/-
- `text-fields/best-practices/in-ios-ipados-tvos-and-visionos` **Do:** On iOS, iPadOS, tvOS, and visionOS, show the keyboard type that matches the content being entered, such as numbers or URLs. **Why:** A matching keyboard streamlines data entry. · P familiarity, flexibility · L interaction, platform · S interact · M d/t/-/-
- `text-fields/best-practices/minimize-text-entry-in-your-tvos` **Do:** On Apple TV and Apple Watch, limit typing and gather information more efficiently, for example through buttons. **Why:** Long text or many fields take a lot of time on those devices. · P simplicity, agency · L interaction, platform · S interact · M t/-/-/-
### Platform considerations > iOS, iPadOS

- `text-fields/platform-considerations/ios-ipados/display-a-clear-button-in-the` [iOS, iPadOS] **Do:** On iOS and iPadOS, show a Clear button at the trailing end of a text field. **Why:** One tap erases the contents without repeated presses of Delete. · P agency, familiarity · L interaction, platform · S interact · M d/d/-/-
- `text-fields/platform-considerations/ios-ipados/use-images-and-buttons-to-provide` [iOS, iPadOS] **Do:** On iOS and iPadOS, use images or system buttons at the ends of a text field: leading end for the field's purpose, trailing end for extra features. **Why:** Consistent placement adds clarity and functionality to the field. · P familiarity, simplicity · L interaction, platform · S compose, express · M d/d/-/-
### Platform considerations > macOS

- `text-fields/platform-considerations/macos/consider-using-a-combo-box-if` [macOS] **Do:** On macOS, use a combo box when text entry should come with a list of choices. **Why:** A combo box is the component built for combining typing with a set of options. · P familiarity · L interaction, platform · S compose · M -/t/-/-
### Platform considerations > watchOS

- `text-fields/platform-considerations/watchos/present-a-text-field-only-when` [watchOS] **Do:** On Apple Watch, show a text field only when truly necessary and offer a list of options instead whenever possible. **Why:** Typing is costly on the watch, and choosing from options is easier. · P simplicity, agency · L interaction, platform · S interact · M t/-/-/-

## Toggles (`toggles`)

Selection and input · <https://developer.apple.com/design/human-interface-guidelines/toggles>

### Best practices

- `toggles/best-practices/use-a-toggle-to-help-people` **Do:** Use a toggle to flip between two opposing values for the state of content or a view; use another component, like a pop-up button, for other actions. **Why:** A toggle only manages the state of something and doesn't suit picking from a list. · P familiarity, simplicity · L interaction · S compose · M d/d/-/-
- `toggles/best-practices/clearly-identify-the-setting-view-or` **Do:** Make it clear what a toggle affects, usually through context, adding a label when needed; a toggle-like button should use a purposeful icon and change its background with state. **Why:** People must understand what they are turning on or off. · P simplicity, familiarity · L content, interaction · S write, compose · M d/d/-/-
- `toggles/best-practices/make-sure-the-visual-differences-in` **Do:** Make on and off states look clearly different through fill, background shape, or inner marks, and don't depend on color alone. **Why:** Not everyone can perceive color differences. · P flexibility, simplicity · L inclusion, attention · S express, include · M d/d/-/-
### Platform considerations > iOS, iPadOS

- `toggles/platform-considerations/ios-ipados/use-the-switch-toggle-style-only` [iOS, iPadOS] **Do:** On iOS and iPadOS, use the switch style only inside a list row, without its own label. **Why:** The row's content already explains what the switch controls. · P familiarity, simplicity · L platform, interaction · S compose · M d/t/-/-
- `toggles/platform-considerations/ios-ipados/change-the-default-color-of-a` [iOS, iPadOS] **Do:** On iOS and iPadOS, recolor a switch only when needed, for example with your accent color, ensuring it contrasts enough with the uncolored state. **Why:** The default green works in most cases, and a custom color must still be perceptible. · P familiarity, flexibility · L attention, inclusion · S express · M d/d/-/-
- `toggles/platform-considerations/ios-ipados/outside-of-a-list-use-a` [iOS, iPadOS] **Do:** On iOS and iPadOS, outside lists use a toggle-like button, highlighted when active, instead of a switch, as the Phone filter button does. **Why:** The highlight shows the active state in the established pattern. · P familiarity · L interaction, platform · S compose, interact · M d/d/-/-
- `toggles/platform-considerations/ios-ipados/avoid-supplying-a-label-that-explains` [iOS, iPadOS] **Do:** On iOS and iPadOS, don't add a text label explaining a toggle-style button; let its icon and background states communicate. **Why:** The icon plus the alternate backgrounds already convey what the button does. · P simplicity · L content, interaction · S write, express · M d/d/-/-
### Platform considerations > macOS

- `toggles/platform-considerations/macos/use-switches-checkboxes-and-radio-buttons` [macOS] **Do:** On macOS, keep switches, checkboxes, and radio buttons inside the main window body rather than the toolbar, status bar, or frame. **Why:** This is the platform's expected placement for these controls. · P familiarity · L platform, interaction · S compose · M -/t/-/-
### Platform considerations > macOS > Switches

- `toggles/platform-considerations/macos/switches/prefer-a-switch-for-settings-that` [macOS] **Do:** On macOS, choose a switch for settings you want to stress, such as turning a whole group of settings on or off. **Why:** A switch carries more visual weight than a checkbox, so it suits controlling more functionality. · P simplicity, purpose · L attention, platform · S compose · M t/d/-/-
- `toggles/platform-considerations/macos/switches/within-a-grouped-form-consider-using` [macOS] **Do:** On macOS in a grouped form, use a mini switch for single-row settings; for a hierarchy, use a regular switch for the main setting and mini ones for subordinate settings. **Why:** A mini switch matches the height of buttons and controls, keeping row heights consistent. · P craft, simplicity · L attention, platform · S compose · M -/t/-/-
- `toggles/platform-considerations/macos/switches/in-general-dont-replace-a-checkbox` [macOS] **Do:** On macOS, keep existing checkboxes instead of swapping them for switches. **Why:** Staying with the checkbox you already use is the safer, consistent choice. · P familiarity · L platform · S compose · M -/t/-/-
### Platform considerations > macOS > Checkboxes

- `toggles/platform-considerations/macos/checkboxes/use-a-checkbox-instead-of-a` [macOS] **Do:** On macOS, use checkboxes rather than switches to show a hierarchy of settings, aligning them on the leading edge and indenting dependent ones. **Why:** Checkboxes align well and express grouping and dependencies between parent and subordinate settings. · P simplicity, familiarity · L attention, platform · S compose · M -/d/-/-
- `toggles/platform-considerations/macos/checkboxes/consider-using-radio-buttons-if-you` [macOS] **Do:** On macOS, use radio buttons when there are more than two mutually exclusive options. **Why:** Radio buttons let each option carry its own distinct label beyond on and off. · P simplicity, familiarity · L content, platform · S compose, write · M -/d/-/-
- `toggles/platform-considerations/macos/checkboxes/consider-using-a-label-to-introduce` [macOS] **Do:** On macOS, introduce a checkbox group with a label if the relationship isn't clear, describing the set and lining its baseline up with the first checkbox. **Why:** A label makes the connection among the checkboxes understandable. · P simplicity · L content, attention · S write, compose · M -/d/-/-
- `toggles/platform-considerations/macos/checkboxes/accurately-reflect-a-checkboxs-state-in` [macOS] **Do:** On macOS, make a checkbox's look match its on, off, or mixed state, using mixed when a master checkbox governs subordinates with differing states. **Why:** The visible state needs to tell people truthfully what is set. · P familiarity, craft · L interaction, attention · S interact, express · M -/d/-/-
### Platform considerations > macOS > Radio buttons

- `toggles/platform-considerations/macos/radio-buttons/prefer-a-set-of-radio-buttons` [macOS] **Do:** On macOS, use a radio button set for mutually exclusive choices, and checkboxes when several choices may be selected. **Why:** Radio buttons express single choice, while checkboxes allow multiple selection. · P familiarity · L interaction, platform · S compose · M -/d/-/-
- `toggles/platform-considerations/macos/radio-buttons/avoid-listing-too-many-radio-buttons` [macOS] **Do:** On macOS, don't list too many radio buttons; beyond about five options, consider a component such as a pop-up button. **Why:** A long list consumes space and can overwhelm people. · P simplicity · L attention, platform · S compose · M -/d/-/-
- `toggles/platform-considerations/macos/radio-buttons/to-present-a-single-setting-that` [macOS] **Do:** On macOS, show a lone on/off setting with a checkbox; only if that's unclear, use two radio buttons labeled with the states they control. **Why:** A checkmark's presence or absence reveals the current state at a glance. · P simplicity, familiarity · L interaction, platform · S compose · M -/d/-/-
- `toggles/platform-considerations/macos/radio-buttons/use-consistent-spacing-when-you-display` [macOS] **Do:** On macOS, when laying radio buttons out horizontally, size every slot to fit the longest label and reuse that spacing. **Why:** Equal spacing keeps the row tidy and uniform. · P craft · L attention, platform · S compose · M -/d/-/-

## Virtual keyboards (`virtual-keyboards`)

Selection and input · <https://developer.apple.com/design/human-interface-guidelines/virtual-keyboards>

### Best practices

- `virtual-keyboards/best-practices/choose-a-keyboard-that-matches-the` **Do:** Present the keyboard layout that suits the content being edited, such as numbers and punctuation for numeric data, by declaring the input's meaning. **Why:** A matching keyboard eases entry, and declared semantics can also refine the corrections offered. · P familiarity, flexibility · L interaction · S interact · M d/d/-/-
- `virtual-keyboards/best-practices/consider-customizing-the-return-key-type` **Do:** Change the Return key's type when it clarifies the action, for example a search key when the app starts a search. **Why:** It keeps the experience consistent with other places where people begin a search. · P familiarity, simplicity · L interaction, content · S interact, write · M d/d/-/-
### Custom input views

- `virtual-keyboards/custom-input-views/make-sure-your-custom-input-view` **Do:** Ensure a custom input view fits your app's context, makes entry simple, and shows people why it's better than the system keyboard. **Why:** Otherwise people may wonder why they can't return to the system keyboard. · P purpose, familiarity · L interaction, value · S define, interact · M d/t/-/-
- `virtual-keyboards/custom-input-views/play-the-standard-keyboard-sound-while` **Do:** Play the standard key-click sound when people type in a custom input view. **Why:** People know that sound as feedback from the system keyboard and expect it here; they can turn it off in Settings. · P familiarity, delight · L interaction, platform · S interact · M t/-/-/-
### Custom keyboards

- `virtual-keyboards/custom-keyboards/provide-an-obvious-and-easy-way` **Do:** In a custom keyboard, give an evident, easy way to switch to other keyboards. **Why:** People know the Globe key switches keyboards and expect something equally intuitive. · P familiarity, flexibility · L interaction, inclusion · S interact · M t/-/-/-
- `virtual-keyboards/custom-keyboards/avoid-duplicating-system-provided-keyboard-features` **Do:** Don't repeat the Emoji/Globe or Dictation keys in a custom keyboard, since the system may already show them below it. **Why:** Your app can't affect those keys, and duplicates are likely to confuse people. · P simplicity, familiarity · L interaction, platform · S compose · M -/-/-/-
- `virtual-keyboards/custom-keyboards/consider-providing-a-keyboard-tutorial-in` **Do:** Provide instructions inside your app, not within the keyboard, for choosing, enabling, using, and leaving a new keyboard. **Why:** The standard keyboard is what people know, so picking up a different one costs them effort. · P agency, familiarity · L flow, content · S write, structure · M t/-/-/-
### Platform considerations > iOS, iPadOS

- `virtual-keyboards/platform-considerations/ios-ipados/use-the-keyboard-layout-guide-to` [iOS, iPadOS] **Do:** On iOS and iPadOS, use the keyboard layout guide so the keyboard fits the interface and key fields and buttons stay visible above it. **Why:** It makes the keyboard feel integrated and prevents it from covering important parts of the interface. · P craft, flexibility · L platform, attention · S compose, adapt · M d/t/-/-
- `virtual-keyboards/platform-considerations/ios-ipados/place-custom-controls-above-the-keyboard` [iOS, iPadOS] **Do:** On iOS and iPadOS, put only task-relevant custom controls above the keyboard, apply Liquid Glass if it matches the rest of the app, and use standard padding. **Why:** Controls should support the current task and look consistent with other views. · P purpose, craft · L platform, attention · S compose, express · M t/-/-/-

## Activity rings (`activity-rings`)

Status · <https://developer.apple.com/design/human-interface-guidelines/activity-rings>

### Best practices

- `activity-rings/best-practices/display-activity-rings-when-theyre-relevant` **Do:** Show Activity rings when your app deals with health or fitness, such as on workout metrics or summary screens. **Why:** People expect to find them in health and fitness apps, especially ones feeding HealthKit. · P purpose, familiarity · L value, platform · S define · M -/-/-/-
- `activity-rings/best-practices/use-activity-rings-only-to-show` **Do:** Reserve Activity rings for Move, Exercise, and Stand; don't copy or alter them for other data or imitate them for that progress. **Why:** They are designed to consistently represent progress in those specific areas. · P familiarity, responsibility · L trust, platform · S express · M -/-/-/-
- `activity-rings/best-practices/use-activity-rings-to-show-progress` **Do:** Show Activity rings for one person only, and make clear whose progress it is with a label, photo, or avatar. **Why:** Rings represent individual progress, so ownership must be unmistakable. · P familiarity, simplicity · L content, platform · S express, write · M -/-/-/-
- `activity-rings/best-practices/always-keep-the-visual-appearance-of` **Do:** Keep Activity rings looking identical everywhere: unchanged colors, black background, scaled properly, and adapt surrounding UI instead of the rings. **Why:** A consistent appearance gives a consistent experience. · P familiarity, craft · L attention, platform · S express · M -/-/-/-
- `activity-rings/best-practices/to-display-a-label-or-value` **Do:** Color Move, Exercise, and Stand labels and values with the colors matching their rings. **Why:** Matching colors tie each label and number to its ring. · P familiarity, craft · L attention, platform · S express · M -/-/-/-
- `activity-rings/best-practices/maintain-activity-ring-margins` **Do:** Leave an outer margin around Activity rings at least equal to the gap between rings, and keep other elements from cropping or covering it. **Why:** The rings need clear space to stay intact and legible. · P craft · L attention, platform · S compose · M -/-/-/-
- `activity-rings/best-practices/differentiate-other-ring-like-elements-from` **Do:** Separate any other ring-like graphics from Activity rings with padding, lines, labels, or differences in color and scale. **Why:** Mixed ring styles create a confusing interface. · P simplicity, familiarity · L attention, platform · S compose, express · M -/-/-/-
- `activity-rings/best-practices/dont-send-notifications-that-repeat-the` **Do:** Don't send notifications duplicating the Activity app's progress updates or embed rings in them; any mention of Activity should be unique to your app. **Why:** The system already sends those updates, so repeating them is confusing. · P responsibility, simplicity · L trust, content · S write, interact · M t/-/-/-
- `activity-rings/best-practices/dont-use-activity-rings-for-decoration` **Do:** Use Activity rings to convey information, never as decoration in labels or background graphics. **Why:** They exist to inform people, not to embellish a design. · P purpose, responsibility · L value, trust · S express · M -/-/-/-
- `activity-rings/best-practices/dont-use-activity-rings-for-branding` **Do:** Use Activity rings only to display Activity progress inside your app; keep them out of the app icon and marketing. **Why:** Their role is to report Activity progress, not to brand. · P purpose, responsibility · L trust, value · S express · M -/-/-/-

## Gauges (`gauges`)

Status · <https://developer.apple.com/design/human-interface-guidelines/gauges>

### Best practices

- `gauges/best-practices/write-succinct-labels-that-describe-the` **Do:** Use short labels naming the current value and both ends of a gauge's range. **Why:** VoiceOver reads visible labels so people can grasp the gauge without seeing the screen. · P simplicity, flexibility · L content, inclusion · S write, include · M d/d/t/t
- `gauges/best-practices/consider-filling-the-path-with-a` **Do:** Consider a gradient fill along the gauge path that reflects its meaning, like red to blue for hot to cold. **Why:** Color range helps communicate what the gauge measures. · P delight, simplicity · L attention · S express · M d/d/d/d
### Platform considerations > macOS

- `gauges/platform-considerations/macos/consider-using-the-continuous-style-for` [macOS] **Do:** On macOS, use the continuous style for capacity indicators with large ranges. **Why:** With a big range, discrete segments become too small to be useful. · P craft, simplicity · L attention, platform · S express · M t/t/-/-
- `gauges/platform-considerations/macos/consider-changing-the-fill-color-to` [macOS] **Do:** On macOS, consider changing a capacity indicator's fill color at key levels, or use tiered colors in one indicator. **Why:** Color shifts highlight meaningful parts of the range, such as very low or very high. · P purpose, simplicity · L attention, platform · S express · M t/t/t/t

## Progress indicators (`progress-indicators`)

Status · <https://developer.apple.com/design/human-interface-guidelines/progress-indicators>

### Best practices

- `progress-indicators/best-practices/when-possible-use-a-determinate-progress` **Do:** Prefer a determinate progress indicator over an indeterminate one whenever you can. **Why:** It lets people estimate duration and decide whether to wait, restart later, or abandon the task. · P agency, responsibility · L flow, interaction · S interact · M d/d/-/-
- `progress-indicators/best-practices/be-as-accurate-as-possible-when` **Do:** Report determinate progress accurately and even out its pace instead of racing to nearly done and then crawling. **Why:** Uneven jumps make people doubt the app is working and can feel deceptive. · P responsibility, craft · L trust, flow · S interact · M d/d/-/-
- `progress-indicators/best-practices/keep-progress-indicators-moving-so-people` **Do:** Keep progress indicators animating, and if a process stalls, give feedback explaining the problem and what to do. **Why:** A motionless indicator suggests a stalled process or frozen app. · P familiarity, responsibility · L interaction, flow · S interact · M d/d/-/-
- `progress-indicators/best-practices/when-possible-switch-a-progress-bar` **Do:** Once an indeterminate task's duration becomes known, switch its progress bar to determinate. **Why:** People prefer determinate indicators because they show what's happening and how long it will take. · P agency, responsibility · L flow, interaction · S interact · M d/d/-/-
- `progress-indicators/best-practices/dont-switch-from-the-circular-style` **Do:** Don't change a circular spinner into a progress bar partway through. **Why:** The two differ in shape and size, so swapping them disrupts the interface and confuses people. · P familiarity, craft · L attention, interaction · S interact, express · M d/d/-/-
- `progress-indicators/best-practices/if-its-helpful-display-a-description` **Do:** Add a short, accurate description of the task when it helps, avoiding vague words like loading or authenticating. **Why:** Vague terms rarely add value. · P simplicity, responsibility · L content · S write · M d/d/-/-
- `progress-indicators/best-practices/display-a-progress-indicator-in-a` **Do:** Put progress indicators in the same place each time. **Why:** A consistent spot helps people reliably find an operation's status across platforms or apps. · P familiarity · L attention, interaction · S compose · M d/d/-/-
- `progress-indicators/best-practices/when-its-feasible-let-people-halt` **Do:** Let people stop a process when possible: add Cancel if safe, and Pause as well if stopping could cause losses such as partial downloads. **Why:** People should be able to interrupt work without harm. · P agency · L flow, interaction · S interact · M d/d/-/-
- `progress-indicators/best-practices/let-people-know-when-halting-a` **Do:** If canceling would lose progress, show an alert letting people confirm the cancel or resume the process. **Why:** People should know about the loss before committing to it. · P agency, responsibility · L flow, trust · S interact, write · M d/d/-/-
### Platform considerations > iOS, iPadOS > Refresh content controls

- `progress-indicators/platform-considerations/ios-ipados/refresh-content-controls/perform-automatic-content-updates` [iOS, iPadOS] **Do:** On iOS and iPadOS, refresh content on a regular schedule rather than relying on people to start every update. **Why:** People enjoy manual refresh but also expect periodic automatic updates and fresh data. · P agency, purpose · L flow, interaction · S interact · M d/t/-/-
- `progress-indicators/platform-considerations/ios-ipados/refresh-content-controls/supply-a-short-title-only-if` [iOS, iPadOS] **Do:** On iOS and iPadOS, give a refresh control a title only if it adds value, such as time of last update, and never to explain how to refresh. **Why:** The control's animation already shows content is loading, so a title is usually unnecessary. · P simplicity · L content, platform · S write · M d/t/-/-
### Platform considerations > macOS

- `progress-indicators/platform-considerations/macos/prefer-an-activity-indicator-spinner-to` [macOS] **Do:** On macOS, use a spinner for background operation status or tight spaces, such as inside a text field or next to a button. **Why:** Spinners are small and unobtrusive, suiting asynchronous tasks and small areas. · P simplicity, familiarity · L attention, platform · S compose, interact · M t/d/-/-
- `progress-indicators/platform-considerations/macos/avoid-labeling-a-spinning-progress-indicator` [macOS] **Do:** On macOS, don't attach a label to a spinner. **Why:** It generally appears after people start a process, so a label is usually unnecessary. · P simplicity · L content, platform · S write · M t/d/-/-

## Rating indicators (`rating-indicators`)

Status · <https://developer.apple.com/design/human-interface-guidelines/rating-indicators>

### Best practices

- `rating-indicators/best-practices/make-it-easy-to-change-rankings` **Do:** In ranked lists, let people change an item's rank in place rather than sending them to a separate edit screen. **Why:** Inline adjustment avoids extra navigation. · P agency, simplicity · L interaction, flow · S interact · M d/d/-/-
- `rating-indicators/best-practices/if-you-replace-the-star-with` **Do:** When swapping the star for your own rating symbol, make sure people can still tell it represents a rating. **Why:** The star is widely recognized for rankings, while other symbols may not suggest a rating scale. · P familiarity · L content, interaction · S express · M d/d/t/t

## App Shortcuts (`app-shortcuts`)

System experiences · <https://developer.apple.com/design/human-interface-guidelines/app-shortcuts>

### Best practices

- `app-shortcuts/best-practices/to-surface-common-types-of-app` **Do:** For common kinds of app functionality, adopt app schemas so the system can surface features; keep App Shortcuts for unique features or custom content. **Why:** Schemas let Siri and system experiences surface features without individual shortcuts, leaving shortcuts for areas schemas don't cover. · P familiarity, simplicity · L platform · S structure · M -/-/-/-
- `app-shortcuts/best-practices/offer-app-shortcuts-for-your-apps` **Do:** Provide App Shortcuts for the tasks people do most and that matter most, preferably ones finishable without leaving the current context. **Why:** Simple tasks done in place work best, though opening the app can help with multistep tasks. · P purpose, agency · L value, flow · S define · M t/-/-/-
- `app-shortcuts/best-practices/add-flexibility-by-letting-people-choose` **Do:** Let a shortcut take one optional parameter when sensible, and offer familiar, predictable values as the choices. **Why:** People won't have the list of values in front of them, so options must be easy to guess. · P flexibility, simplicity · L interaction, content · S interact · M -/-/-/-
- `app-shortcuts/best-practices/ask-for-clarification-in-response-to` **Do:** If a request lacks optional detail, ask a follow-up, proposing a likely default such as the most recent choice, plus a short list of alternatives. **Why:** A suggested default speeds things up while still letting people pick something else. · P agency, simplicity · L interaction, content · S interact · M t/t/-/-
- `app-shortcuts/best-practices/keep-voice-interactions-simple` **Do:** Keep spoken phrases short; if one sounds awkward aloud, trim it, and collect any truly required extra details in a later step. **Why:** A complicated phrase is hard to remember or say correctly. · P simplicity · L content, interaction · S write · M t/-/-/-
- `app-shortcuts/best-practices/make-app-shortcuts-discoverable-in-your` **Do:** Show occasional tips inside the app when people do common actions, so they learn a matching shortcut exists. **Why:** People use shortcuts for frequent tasks once they know the shortcut is available. · P agency, familiarity · L flow, content · S interact · M t/-/-/-
### Best practices > Responding to App Shortcuts

- `app-shortcuts/best-practices/responding-to-app-shortcuts/provide-enough-detail-for-interaction-on` **Do:** Put every critical piece of information into the full spoken dialogue of your App Shortcuts' responses. **Why:** On audio-only devices like AirPods and HomePod, people may be unable to see anything onscreen. · P flexibility · L inclusion, content · S include, write · M t/-/-/-
### Editorial guidelines

- `app-shortcuts/editorial-guidelines/provide-brief-memorable-activation-phrases-and` **Do:** Write short activation phrases that include your app name, and define natural alternative wordings people might say. **Why:** People speak the phrase to run the shortcut, so brevity makes it easier to remember. · P simplicity, flexibility · L content, interaction · S write · M t/-/-/-
- `app-shortcuts/editorial-guidelines/when-referring-to-app-shortcuts-or` **Do:** Write App Shortcuts and Shortcuts in title case, and always use the plural form of Shortcuts. · P familiarity · L content · S write · M t/t/t/t
- `app-shortcuts/editorial-guidelines/when-referring-to-individual-shortcuts-not` **Do:** Use lowercase when naming a single, individual shortcut as opposed to the App Shortcuts feature or the Shortcuts app. · P familiarity · L content · S write · M t/t/t/t
### Platform considerations > iOS, iPadOS

- `app-shortcuts/platform-considerations/ios-ipados/order-shortcuts-based-on-importance` [iOS, iPadOS] **Do:** On iOS and iPadOS, list your most broadly useful App Shortcuts first. **Why:** Your ordering sets their initial appearance in Spotlight and Shortcuts, before the system reorders by usage. · P purpose, simplicity · L attention, platform · S compose · M t/-/-/-

## Complications (`complications`)

System experiences · <https://developer.apple.com/design/human-interface-guidelines/complications>

### Best practices

- `complications/best-practices/identify-essential-dynamic-content-that-people` **Do:** On the watch face, show essential, changing information people want to glance at, rather than only a launcher. **Why:** People value relevant, always-current data more, and static complications may lose their prominent spot. · P purpose · L value, platform · S define · M t/-/-/-
- `complications/best-practices/support-all-complication-families-when-possible` **Do:** Support every complication family where you can; where no useful data fits, show an app-representing image like the icon that launches the app. **Why:** More supported families means your complications appear on more watch faces. · P flexibility · L platform, value · S adapt · M -/-/-/-
- `complications/best-practices/consider-creating-multiple-complications-for-each` **Do:** Consider offering several complications per family, perhaps with a preconfigured shareable watch face that uses them. **Why:** Multiple complications let people build a watch face around an app they love, ready to use without setup. · P flexibility, agency · L platform, value · S define · M -/-/-/-
- `complications/best-practices/define-a-different-deep-link-for` **Do:** Give each complication its own deep link that opens the most relevant part of the app. **Why:** Complications that all open the same place seem less useful. · P purpose, agency · L flow, platform · S structure · M t/t/-/-
- `complications/best-practices/keep-privacy-in-mind` **Do:** Help people stop potentially sensitive information on the watch face from being seen by anyone other than the wearer. **Why:** The Always-On display can leave watch face information visible to others nearby. · P responsibility · L trust, platform · S include · M t/-/-/-
- `complications/best-practices/carefully-consider-when-to-update-data` **Do:** Choose timeline entry times to match when each kind of data is most useful, since updates and stored entries are limited. **Why:** Update opportunities per day and stored entries are capped, so timing determines how useful the data is. · P purpose, craft · L value, platform · S define, interact · M -/-/-/-
### Visual design

- `complications/visual-design/choose-a-ring-or-gauge-style` **Do:** Pick closed, open, or segmented gauges based on data: closed for a share of a whole, open or segmented for ranges with arbitrary limits. **Why:** Each style communicates a particular kind of numerical value consistently. · P familiarity, simplicity · L attention, platform · S express · M t/t/t/t
- `complications/visual-design/make-sure-images-look-good-in` **Do:** Check complications in tinted mode: never rely on color alone for important information, and supply a tinted image variant when the full-color one degrades. **Why:** Tinted mode desaturates and applies one color, so people should receive the same information as in full color. · P flexibility, craft · L inclusion, attention · S express, adapt · M t/t/t/t
- `complications/visual-design/recognize-that-people-might-prefer-to` **Do:** Design knowing that people may choose tinted mode, where the system turns complications grayscale and tints them with a single wearer-chosen color. **Why:** Some wearers pick tinted mode over full color, so the design must still work that way. · P flexibility · L platform, attention · S express · M -/-/-/-
- `complications/visual-design/when-creating-complication-content-generally-use` **Do:** Draw complication content with lines at least two points wide, adjusting weight to the image's size and complexity. **Why:** Thin lines are hard to see at a glance, particularly when the wearer is moving. · P craft, flexibility · L attention, platform · S express · M t/t/t/t
- `complications/visual-design/provide-a-set-of-static-placeholder` **Do:** Supply static placeholder images for every complication, remembering their sizes can differ from your real images. **Why:** The system shows them when no data exists, such as right after install or in the complication carousel. · P craft, flexibility · L platform, flow · S express, interact · M -/-/-/-

## Controls (`controls`)

System experiences · <https://developer.apple.com/design/human-interface-guidelines/controls>

### Best practices

- `controls/best-practices/offer-controls-for-actions-that-provide` **Do:** Offer controls for actions with the greatest benefit that don't require opening your app, such as starting a Live Activity. **Why:** People stay informed seamlessly without navigating into the app. · P purpose, agency · L value, flow · S define · M t/-/-/-
- `controls/best-practices/update-controls-when-someone-interacts-with` **Do:** Refresh a control after interaction, on completion, or via push so it shows the true state and whether an action is still running. **Why:** The control should accurately reflect current state and progress. · P familiarity · L interaction · S interact · M t/t/-/-
- `controls/best-practices/choose-a-descriptive-symbol-that-suggests` **Do:** Use a symbol that signals what the control does, with distinct symbols for on and off states of toggles. **Why:** Depending on placement, the title and value may be hidden, so the symbol must carry the meaning. · P familiarity, simplicity · L content, interaction · S express · M t/t/-/-
- `controls/best-practices/use-symbol-animations-to-highlight-state` **Do:** Animate toggle symbols between on and off, and keep a button's symbol animating while a lasting action runs, stopping when done. **Why:** Animation makes state changes and in-progress actions visible. · P familiarity, delight · L interaction, attention · S interact · M t/t/-/-
- `controls/best-practices/select-a-tint-color-that-works` **Do:** Choose a tint color that fits your brand; the system applies it to an on-state toggle symbol and to the Dynamic Island readout. **Why:** The system uses this one color in several places, so it should represent your brand. · P delight, familiarity · L attention, platform · S express · M t/t/t/t
- `controls/best-practices/help-people-provide-additional-information-the` **Do:** If a control needs setup, such as picking which light, prompt for it when it's first added and allow reconfiguring later. **Why:** Some actions can't run until people supply details, and they may want to change them. · P agency · L flow, interaction · S interact · M t/t/-/-
- `controls/best-practices/provide-hint-text-for-the-action` **Do:** Give the Action button hint text built with verbs. **Why:** The hint helps people understand what pressing and holding will do. · P familiarity, simplicity · L content, interaction · S write · M -/-/-/-
- `controls/best-practices/if-your-control-title-or-value` **Do:** When a control's title or value changes with situation, add placeholder info describing what it does. **Why:** The system shows placeholders in the gallery or before assignment, telling people what the control does. · P familiarity, simplicity · L content · S write · M t/t/-/-
- `controls/best-practices/hide-sensitive-information-when-the-device` **Do:** Let the system redact a control's title and value on a locked device, and specify whether the symbol state is hidden too. **Why:** Personal or security-related information shouldn't be readable while the device is locked. · P responsibility · L trust · S include · M d/t/-/-
- `controls/best-practices/require-authentication-for-actions-that-affect` **Do:** Make people unlock or authenticate before using controls that affect security, like locking a door or starting a car. **Why:** Security-affecting actions must not be triggerable by just anyone. · P responsibility · L trust · S include, interact · M d/d/-/-
### Camera experiences on a locked device

- `controls/camera-experiences-on-a-locked-device/use-the-same-camera-ui-in` **Do:** Reuse the in-app camera interface for the camera experience launched from a control. **Why:** Shared UI draws on familiarity and makes the handoff into the app seamless after capture. · P familiarity · L flow, interaction · S compose · M t/-/-/-
- `controls/camera-experiences-on-a-locked-device/provide-instructions-for-adding-the-control` **Do:** Explain how people can add the control that opens the camera experience. **Why:** People need guidance to find and set up the control. · P agency, familiarity · L flow, content · S write, structure · M t/-/-/-

## Live Activities (`live-activities`)

System experiences · <https://developer.apple.com/design/human-interface-guidelines/live-activities>

### Best practices

- `live-activities/best-practices/offer-live-activities-for-tasks-and` **Do:** Use Live Activities for tasks and events with a clear start and end, lasting short to medium durations of at most eight hours. **Why:** They suit tracking activities that don't run beyond eight hours. · P purpose · L value · S define · M -/-/-/-
- `live-activities/best-practices/focus-on-important-information-that-people` **Do:** Show only the most useful information, concisely, and let people tap through to the app for more. **Why:** A glanceable surface needn't show everything; the app can provide deeper detail. · P simplicity, purpose · L value, attention · S define, compose · M t/t/d/d
- `live-activities/best-practices/dont-use-a-live-activity-to` **Do:** Keep ads and promotions out of Live Activities; show only information tied to the ongoing event or task. **Why:** Live Activities exist to keep people informed about ongoing events and tasks. · P responsibility, purpose · L trust, value · S define · M d/d/-/-
- `live-activities/best-practices/avoid-displaying-sensitive-information` **Do:** Show a harmless summary instead of sensitive content, or redact it, and let people choose whether sensitive data appears. **Why:** Live Activities are prominent and casual observers on the Lock Screen or Always-On display may see them. · P responsibility, agency · L trust · S include · M d/t/t/-
- `live-activities/best-practices/create-a-live-activity-that-matches` **Do:** Make the Live Activity reflect your app's look and personality in both dark and light appearances. **Why:** It becomes easier to recognize and visually tied to your app. · P delight, familiarity · L attention, platform · S express · M d/d/d/d
- `live-activities/best-practices/if-you-include-a-logo-mark` **Do:** Show a logo mark without a surrounding container, and avoid using the full app icon. **Why:** A bare mark blends better into the Live Activity layout. · P craft, simplicity · L attention · S express, compose · M t/t/t/t
- `live-activities/best-practices/dont-add-elements-to-your-app` **Do:** Avoid putting elements in your app that call attention to the Dynamic Island. **Why:** Your Live Activity or other items may occupy the Dynamic Island, so extra emphasis would clash. · P simplicity, responsibility · L attention, platform · S compose · M -/-/-/-
- `live-activities/best-practices/ensure-text-is-easy-to-read` **Do:** Use large text in medium weight or heavier, use small text rarely, and keep key information legible at a glance. **Why:** Glanceable surfaces need text that reads instantly. · P flexibility, simplicity · L attention, inclusion · S express · M d/d/d/d
### Best practices > Creating Live Activity layouts

- `live-activities/best-practices/creating-live-activity-layouts/adapt-to-different-screen-sizes-and` **Do:** Prepare layouts and assets for multiple devices and scale factors, using the Specifications values as guidance and sizing content appropriately. **Why:** Live Activities scale to different screens, so their on-screen size can vary. · P flexibility, craft · L platform · S adapt · M d/t/t/t
- `live-activities/best-practices/creating-live-activity-layouts/adjust-element-size-and-placement-for` **Do:** Use only as much space as the content needs, and size and position elements so they fit together well. **Why:** Efficient use of space presents the content clearly. · P simplicity, craft · L attention · S compose · M d/d/d/d
- `live-activities/best-practices/creating-live-activity-layouts/support-limited-width-presentations` **Do:** In narrow contexts, fit compact and minimal views in a 28pt circle using short abbreviations or graphics; a leading-only view is acceptable. **Why:** This prevents truncated text where width is limited, such as landscape iPhone. · P flexibility, simplicity · L platform, content · S adapt · M t/t/-/-
- `live-activities/best-practices/creating-live-activity-layouts/use-familiar-layouts-for-custom-views` **Do:** Start from the provided templates with default margins and recommended text sizes when building custom views. **Why:** They keep the content legible at a glance and consistent with surrounding visual language. · P familiarity, craft · L attention, platform · S compose · M t/t/t/t
- `live-activities/best-practices/creating-live-activity-layouts/use-consistent-margins-and-concentric-placement` **Do:** Keep even margins between rounded shapes and the edges, nest content concentrically, and match corner radii via ContainerRelativeShape instead of fixed values. **Why:** Matching margins prevent elements poking into the rounded outline and causing visual tension. · P craft · L attention · S compose · M t/t/t/t
- `live-activities/best-practices/creating-live-activity-layouts/when-separating-a-block-of-content` **Do:** Set apart a content block with an inset rounded container or a heavy divider line; never extend content all the way out to the Dynamic Island's border. **Why:** Content drawn to the edge clashes with the rounded boundary. · P craft, simplicity · L attention · S compose · M t/t/t/t
- `live-activities/best-practices/creating-live-activity-layouts/dynamically-change-the-height-of-your` **Do:** Shrink the Live Activity's height when little is shown and grow it as more details become available. **Why:** The height should match only the content actually present. · P simplicity, flexibility · L attention, flow · S compose, interact · M t/t/-/-
### Best practices > Choosing colors

- `live-activities/best-practices/choosing-colors/carefully-consider-using-a-custom-background` **Do:** Think twice before setting a custom background color or opacity; if you do on the Lock Screen, ensure enough contrast, especially for tints on dimmed Always-On displays. **Why:** Only the Lock Screen allows a custom background, and reduced luminance can weaken contrast. · P flexibility, craft · L attention, inclusion · S express · M t/t/d/d
- `live-activities/best-practices/choosing-colors/use-color-to-express-the-character` **Do:** On the Dynamic Island's black background, use bold colors for text and objects to carry your app's personality and brand. **Why:** Bold colors make the Live Activity recognizable at a glance, distinct from others, and clarify relationships between elements. · P delight, familiarity · L attention · S express · M d/d/d/d
- `live-activities/best-practices/choosing-colors/tint-your-live-activitys-key-line` **Do:** Pick a key line color that agrees with the other colors in your Live Activity. **Why:** On dark backgrounds the key line separates the Dynamic Island from other content, so it should look consistent. · P craft · L attention, platform · S express · M -/-/-/-
### Best practices > Adding transitions and animating content updates

- `live-activities/best-practices/adding-transitions-and-animating-content-updates/use-animations-to-reinforce-the-information` **Do:** Use animation, such as content-replace or custom scale, opacity, and movement transitions, to support the message and draw attention to updates. **Why:** Motion that mirrors the information, like score changes, makes updates noticeable. · P delight, simplicity · L attention, interaction · S express, interact · M d/d/d/-
- `live-activities/best-practices/adding-transitions-and-animating-content-updates/animate-layout-changes` **Do:** When the layout changes, animate existing elements to new positions instead of removing them and bringing them back. **Why:** Keeping as much of the previous layout as possible makes the change feel continuous. · P delight, familiarity · L flow, attention · S interact · M d/d/t/-
- `live-activities/best-practices/adding-transitions-and-animating-content-updates/try-to-avoid-overlapping-elements` **Do:** Prevent animated elements from colliding; sometimes fade some out and in at the new position, moving only the item that actually changes place. **Why:** Animating everything can cause pieces of the transition to collide. · P craft, simplicity · L attention · S interact · M d/d/t/-
### Best practices > Offering interactivity

- `live-activities/best-practices/offering-interactivity/make-sure-tapping-the-live-activity` **Do:** Make a tap land people directly on the related details and actions in the app, without further hunting. **Why:** People shouldn't have to navigate to find the relevant information. · P agency, simplicity · L flow · S structure · M d/d/-/-
- `live-activities/best-practices/offering-interactivity/focus-on-simple-direct-actions` **Do:** Add interactive elements only for essential, directly related actions done once or paused and resumed; prefer limiting it to a single element. **Why:** Controls consume room for useful information, and fewer controls reduce accidental taps on the wrong one. · P simplicity, purpose · L interaction, value · S compose, interact · M d/d/-/-
- `live-activities/best-practices/offering-interactivity/consider-letting-people-respond-to-event` **Do:** If people could reasonably respond to an update, include a button or toggle for it, like contacting a driver. **Why:** A direct action lets people respond right when the update arrives. · P agency, purpose · L interaction, value · S interact · M d/d/-/-
### Best practices > Starting, updating, and ending a Live Activity

- `live-activities/best-practices/starting-updating-and-ending-a-live-activity/start-live-activities-at-appropriate-times` **Do:** Start Live Activities when people expect them, and give them an easy way to switch one off in the matching in-app view. **Why:** Unexpected ones surprise people, and without easy control they may disable Live Activities in Settings altogether. · P agency, responsibility · L trust, flow · S interact, include · M d/t/-/-
- `live-activities/best-practices/starting-updating-and-ending-a-live-activity/offer-an-app-shortcut-that-starts` **Do:** Provide an App Shortcut that begins your Live Activity, for instance from the iPhone Action button. **Why:** App Shortcuts expose functionality to the system so it can be reached from different contexts. · P agency, flexibility · L interaction, platform · S interact · M -/-/-/-
- `live-activities/best-practices/starting-updating-and-ending-a-live-activity/update-a-live-activity-only-when` **Do:** Change the Live Activity only when its underlying content or status changes; otherwise leave the display alone. · P simplicity · L attention, trust · S interact · M d/d/-/-
- `live-activities/best-practices/starting-updating-and-ending-a-live-activity/alert-people-only-for-essential-updates` **Do:** Reserve alerts for crucial updates, don't alert often, and avoid sending push notifications for the same updates. **Why:** Alerts light up the screen and play sound, so overuse reduces the value of Live Activities. · P responsibility, simplicity · L trust, attention · S interact · M d/t/-/-
- `live-activities/best-practices/starting-updating-and-ending-a-live-activity/let-people-track-multiple-events-efficiently` **Do:** Cover several events in one Live Activity with a dynamic layout that rotates through them, not separate ones. **Why:** People then avoid jumping between different Live Activities to follow each event. · P simplicity, agency · L flow, attention · S structure, compose · M t/t/-/-
- `live-activities/best-practices/starting-updating-and-ending-a-live-activity/always-end-a-live-activity-immediately` **Do:** End a Live Activity the moment its task finishes and consider a custom dismissal time in proportion to its length, often 15 to 30 minutes. **Why:** A summary stays relevant only briefly, yet some surfaces keep ended activities visible for hours. · P simplicity, responsibility · L flow, trust · S interact · M t/-/-/-
### Presentation

- `live-activities/presentation/start-with-the-iphone-design-then` **Do:** Build the standard design for each presentation first, then add custom layouts for contexts like StandBy, CarPlay, or Apple Watch as needed. **Why:** Specific contexts benefit from tailored layouts, based on the Live Activity's functionality. · P flexibility · L platform · S adapt · M d/t/-/-
### Presentation > Compact presentation

- `live-activities/presentation/compact-presentation/focus-on-the-most-important-information` **Do:** In the compact view, show only the up-to-date, easy-to-grasp information essential to the activity, such as two team logos and a score. **Why:** The compact space is tiny, so only the essentials should fill it. · P simplicity, purpose · L value, attention · S define, compose · M t/t/t/t
- `live-activities/presentation/compact-presentation/ensure-unified-information-and-design-of` **Do:** Design the leading and trailing compact elements to read as one unit, with the same color and typography. **Why:** The camera cutout splits them, so consistent styling keeps them connected. · P craft, simplicity · L attention · S compose, express · M -/-/-/-
- `live-activities/presentation/compact-presentation/keep-content-as-narrow-as-possible` **Do:** Keep compact content narrow and tight to the TrueDepth camera, with no padding, and balance both sides using shortened units or less precise data. **Why:** This avoids covering key status bar information and keeps the layout balanced. · P craft, simplicity · L attention, platform · S compose · M -/-/-/-
- `live-activities/presentation/compact-presentation/link-to-relevant-app-content` **Do:** Tapping a compact Live Activity should open the related details in the app, with leading and trailing elements going to the same screen. **Why:** Consistent, direct destinations spare people from searching. · P agency, simplicity · L flow · S structure · M d/t/-/-
### Presentation > Minimal presentation

- `live-activities/presentation/minimal-presentation/ensure-that-your-live-activity-is` **Do:** Make the minimal view recognizable as your app, preferably showing fresh information, such as remaining time, rather than only a logo. **Why:** Live data is more useful than a static icon, as long as people can still identify the app. · P purpose, familiarity · L attention, value · S compose, express · M t/t/-/-
### Presentation > Expanded presentation

- `live-activities/presentation/expanded-presentation/maintain-the-relative-placement-of-elements` **Do:** Keep elements in the same relative positions as the Live Activity expands from compact or minimal to expanded. **Why:** Expansion should be predictable since the expanded view is just an enlarged version. · P familiarity, craft · L attention, flow · S compose · M t/t/-/-
- `live-activities/presentation/expanded-presentation/wrap-content-tightly-around-the-truedepth` **Do:** Place expanded content close to the TrueDepth camera without leaving large gaps around it. **Why:** It uses space efficiently and makes the camera less noticeable. · P craft, simplicity · L attention, platform · S compose · M -/-/-/-
### Presentation > Lock Screen presentation

- `live-activities/presentation/lock-screen-presentation/dont-replicate-notification-layouts` **Do:** Design a layout tailored to the information in the Live Activity instead of copying a notification's layout. · P purpose, simplicity · L attention, content · S compose · M t/t/-/-
- `live-activities/presentation/lock-screen-presentation/choose-colors-that-work-well-on` **Do:** Use custom backgrounds, tints, and opacity sparingly so the Live Activity suits a personalized Lock Screen while staying legible. **Why:** People personalize the Lock Screen with wallpapers, tint colors, and widgets. · P flexibility, craft · L attention, inclusion · S express · M t/t/t/t
- `live-activities/presentation/lock-screen-presentation/make-sure-your-design-assets-and` **Do:** Check your design, assets, and colors for contrast in Dark Mode and on a dimmed Always-On display; pick colors that work in both appearances, or one per appearance. **Why:** The system adapts colors in the reduced-luminance Always-On appearance, so results can differ from defaults. · P flexibility, craft · L inclusion, attention · S express, adapt · M d/d/d/d
- `live-activities/presentation/lock-screen-presentation/verify-the-generated-color-of-the` **Do:** Confirm the automatically generated dismiss button color fits your design, and adjust it if needed. **Why:** The system derives it from your background and foreground colors, so it may not match your intent. · P craft · L attention, platform · S express · M -/-/-/-
- `live-activities/presentation/lock-screen-presentation/use-standard-margins-to-align-your` **Do:** Use the standard 14-point Lock Screen margin to line up with notifications; tighter margins are fine for graphics or buttons, but don't crowd edges. **Why:** Crowding the edges makes the layout look cluttered. · P craft, familiarity · L attention, platform · S compose · M d/d/d/d
### Presentation > StandBy presentation

- `live-activities/presentation/standby-presentation/update-your-layout-for-standby` **Do:** Check assets at the larger StandBy scale and consider a custom layout that uses the extra room. **Why:** The Live Activity is enlarged there, so assets and space need attention. · P flexibility, craft · L platform · S adapt · M t/t/t/-
- `live-activities/presentation/standby-presentation/consider-using-the-default-background-color` **Do:** In StandBy, consider the default background color. **Why:** It blends with the device bezel, gives a softer look matching surroundings, and lets the system scale the activity a bit larger. · P delight, craft · L attention, platform · S express · M -/-/-/-
- `live-activities/presentation/standby-presentation/use-standard-margins-and-avoid-extending` **Do:** Keep standard margins and don't run graphics to the screen edge in StandBy. **Why:** Without margins, content is cut off as the activity scales up, which looks broken. · P craft · L attention, platform · S compose · M t/t/t/t
- `live-activities/presentation/standby-presentation/verify-your-design-in-night-mode` **Do:** Test your design in Night Mode and use colors that keep enough contrast under the red tint the system applies. **Why:** The red tint can reduce contrast between your colors. · P flexibility, craft · L inclusion, attention · S express, include · M t/t/t/t
### CarPlay

- `live-activities/carplay/consider-creating-a-custom-layout-if` **Do:** Declare support for the small supplemental activity family and craft a custom CarPlay layout when larger text or extra information would help. **Why:** The default CarPlay appearance may not suit content needing bigger text or more detail. · P flexibility · L platform · S adapt · M -/-/-/-
- `live-activities/carplay/carefully-consider-including-buttons-or-toggles` **Do:** If people may use the activity while driving, show timely content rather than buttons and toggles in a custom CarPlay layout. **Why:** CarPlay deactivates interactive elements. · P responsibility, flexibility · L interaction, platform · S adapt · M -/-/-/-
### Platform considerations > watchOS

- `live-activities/platform-considerations/watchos/consider-creating-a-custom-watchos-layout` [watchOS] **Do:** On Apple Watch, consider a custom layout rather than the automatic default view. **Why:** A tailored layout can show more information and add a button or toggle. · P flexibility · L platform · S adapt · M -/-/-/-
- `live-activities/platform-considerations/watchos/carefully-consider-including-buttons-or-toggles` [watchOS] **Do:** If people may start or watch the activity while driving, leave buttons and toggles out of your custom watchOS layout. **Why:** That layout is reused in CarPlay, where interactive elements are deactivated. · P flexibility, responsibility · L platform, interaction · S adapt · M -/-/-/-
- `live-activities/platform-considerations/watchos/focus-on-essential-information-and-significant` [watchOS] **Do:** Use Smart Stack space efficiently for the most helpful content: progress, timer-like controls, and significant updates. **Why:** Space on the watch is limited, so only the most useful items belong. · P simplicity, purpose · L value, platform · S define, compose · M -/-/-/-

## Notifications (`notifications`)

System experiences · <https://developer.apple.com/design/human-interface-guidelines/notifications>

### Best practices

- `notifications/best-practices/provide-concise-informative-notifications` **Do:** Give valuable information in as few words as possible. **Why:** People enable notifications to get quick updates. · P simplicity, purpose · L content, value · S write · M d/d/-/-
- `notifications/best-practices/avoid-sending-multiple-notifications-for-the` **Do:** Send one notification per matter, even if the person hasn't responded to it. **Why:** People respond when convenient; repeats clutter Notification Center and may lead them to switch off all your notifications. · P responsibility, simplicity · L trust · S interact · M d/d/-/-
- `notifications/best-practices/avoid-sending-a-notification-that-tells` **Do:** Don't instruct people to do tasks in the app via notifications; offer notification actions for simple tasks instead. **Why:** Instructions are hard to remember once the notification is dismissed. · P agency, simplicity · L content, interaction · S write · M d/d/-/-
- `notifications/best-practices/use-an-alert-not-a-notification` **Do:** Show error messages in an alert, not a notification. **Why:** People know both components, and picking the wrong one causes confusion. · P familiarity · L content, interaction · S interact, write · M d/d/-/-
- `notifications/best-practices/handle-notifications-gracefully-when-your-app` **Do:** While the app is in front, surface new information discreetly, like bumping a badge or quietly adding data to the current view. **Why:** A notification would be unnecessary and distracting for something people are already looking at. · P simplicity, agency · L attention, trust · S interact · M d/d/-/-
- `notifications/best-practices/avoid-including-sensitive-personal-or-confidential` **Do:** Leave private or confidential details out of notification text. **Why:** You can't know what people are doing when it arrives, and others might see it. · P responsibility · L trust · S include, write · M d/d/-/-
### Content

- `notifications/content/create-a-short-title-if-it` **Do:** Write a brief title when it adds context, such as a headline or subject; if only generic, let the system show the app name. Use title-style capitalization without ending punctuation. **Why:** Short titles are readable at a glance, particularly where space is limited like on Apple Watch. · P simplicity · L content · S write · M d/d/-/-
- `notifications/content/write-succinct-easy-to-read-notification` **Do:** Write short complete sentences in sentence case with proper punctuation, and don't shorten the message yourself. **Why:** The system truncates automatically when needed. · P simplicity · L content · S write · M d/d/-/-
- `notifications/content/provide-generically-descriptive-text-to-display` **Do:** Supply a generic body text, in sentence case, that hints at the content without exposing details for when previews are hidden. **Why:** When previews are off, people see only the icon and a default title, and need context to decide whether to open it. · P responsibility, flexibility · L content, trust · S write, include · M d/t/-/-
- `notifications/content/avoid-including-your-app-name-or` **Do:** Don't put your app name or icon in the notification content. **Why:** The system already shows a large app icon, or the sender's image badged with your icon. · P simplicity · L content · S write · M d/d/-/-
- `notifications/content/consider-providing-a-sound-to-supplement` **Do:** Consider a short, distinctive, professionally made custom sound or a system sound, but never rely on it for important information. **Why:** Sound distinguishes your notifications and attracts attention, yet people may not hear it. · P delight, flexibility · L interaction, inclusion · S express, include · M d/d/-/-
### Notification actions

- `notifications/notification-actions/provide-beneficial-actions-that-make-sense` **Do:** Offer actions that save time on common tasks without opening the app, labeled with short title-case phrases stating the result, localization-aware, without app name or extras. **Why:** Brief labels avoid truncation, and useful actions spare people from launching the app. · P agency, simplicity · L interaction, content · S interact, write · M d/d/-/-
- `notifications/notification-actions/avoid-providing-an-action-that-merely` **Do:** Don't add an action button whose only effect is to open the app. **Why:** Tapping the notification already opens related content, so a duplicate button clutters and confuses. · P simplicity, familiarity · L interaction · S interact · M d/d/-/-
- `notifications/notification-actions/prefer-nondestructive-actions` **Do:** Favor actions that don't destroy anything; if one is unavoidable, give people enough context to avoid unintended results and mark it as destructive. **Why:** Without context, a destructive tap could have unwanted consequences. · P responsibility, agency · L interaction, trust · S interact · M d/d/-/-
- `notifications/notification-actions/provide-a-simple-recognizable-interface-icon` **Do:** Give every notification action a simple, recognizable interface icon, using or adapting an SF Symbol. **Why:** An icon reinforces meaning so people grasp the action instantly. · P familiarity, simplicity · L interaction, attention · S express · M d/d/-/-
### Badging

- `notifications/badging/use-a-badge-only-to-show` **Do:** Use a badge solely for the count of unread notifications, never for unrelated numbers like weather, dates, stock prices, or scores. · P familiarity, simplicity · L content, trust · S interact · M d/d/-/-
- `notifications/badging/make-sure-badging-isnt-the-only` **Do:** Don't depend on a badge alone for essential information; make important items easy to find once the app opens. **Why:** Badging can be switched off, so people relying on it could miss important messages. · P flexibility, responsibility · L trust, flow · S interact · M d/d/-/-
- `notifications/badging/keep-badges-up-to-date` **Do:** Refresh the badge count as soon as people open the related notifications; zeroing it clears them from Notification Center. **Why:** People shouldn't think new items exist, only to find all were already viewed. · P craft, responsibility · L trust, interaction · S interact · M d/d/-/-
- `notifications/badging/avoid-creating-a-custom-image-or` **Do:** Don't craft a custom image or component that looks or acts like a notification badge. **Why:** Those who disabled badges will be frustrated to see something that appears to be one. · P familiarity, responsibility · L trust, interaction · S express · M d/d/-/-
### Platform considerations > watchOS > Short looks

- `notifications/platform-considerations/watchos/short-looks/avoid-using-a-short-look-as` [watchOS] **Do:** On Apple Watch, deliver critical information through other means in addition to the short look. **Why:** A short look disappears quickly, leaving time only to see the topic and sender. · P flexibility, responsibility · L platform, trust · S interact · M -/-/-/-
- `notifications/platform-considerations/watchos/short-looks/keep-privacy-in-mind` [watchOS] **Do:** On Apple Watch, put only basic information in short looks and keep potentially sensitive details out of the title. **Why:** Short looks are meant to be discreet. · P responsibility · L trust, platform · S include, write · M -/-/-/-
### Platform considerations > watchOS > Long looks

- `notifications/platform-considerations/watchos/long-looks/consider-using-a-rich-custom-long` [watchOS] **Do:** On Apple Watch, consider a rich custom long look so people get what they need without launching the app; SwiftUI animations, SpriteKit, or SceneKit are options. **Why:** People can get information directly, with engaging, interruptible animation. · P purpose, delight · L value, platform · S compose, express · M -/-/-/-
- `notifications/platform-considerations/watchos/long-looks/at-the-minimum-provide-a-static` [watchOS] **Do:** On Apple Watch, always provide a static interface, ideally with a dynamic one; prepare static resources ahead and bundle them with the app. **Why:** The system falls back to static when the dynamic one can't load, such as when offline. · P flexibility, craft · L platform, flow · S adapt, interact · M -/-/-/-
- `notifications/platform-considerations/watchos/long-looks/choose-a-background-appearance-for-the` [watchOS] **Do:** On Apple Watch, set the sash to a custom color or blurred look; the blurred one suits a photo at the top of the content. **Why:** The translucent blurred sash appears to overlap the image. · P craft, delight · L attention, platform · S express · M -/-/-/-
- `notifications/platform-considerations/watchos/long-looks/choose-a-background-color-for-the` [watchOS] **Do:** On Apple Watch, pick the content background: default transparent, white at 18% opacity to match system notifications, or a brand color. · P craft, familiarity · L attention, platform · S express · M -/-/-/-
- `notifications/platform-considerations/watchos/long-looks/provide-up-to-four-custom-actions` [watchOS] **Do:** On Apple Watch, offer at most four custom actions under the content; the system adds Dismiss below and may reuse your iPhone app's registered actions. · P simplicity, familiarity · L interaction, platform · S interact · M -/-/-/-
### Platform considerations > watchOS > Double tap

- `notifications/platform-considerations/watchos/double-tap/keep-double-tap-in-mind-when` [watchOS] **Do:** On Apple Watch, list the most frequently used custom action first among responses. **Why:** Double tap triggers the first nondestructive action. · P purpose, agency · L interaction, platform · S interact · M -/-/-/-

## Snippets (`snippets`)

System experiences · <https://developer.apple.com/design/human-interface-guidelines/snippets>

### Best practices

- `snippets/best-practices/ensure-legibility` **Do:** Make sure custom content contrasts enough with the system background in light and dark, and keep content margins consistent. **Why:** A clear layout lets people interpret the snippet quickly and dependably. · P flexibility, craft · L attention, inclusion · S express, compose · M d/d/d/d
- `snippets/best-practices/keep-content-concise` **Do:** Keep snippet content brief with custom views no taller than 400 points, allow for people's text size setting, and deep-link to the app for extra result detail. **Why:** Snippets support lightweight, quick interactions, and text sizes vary between people. · P simplicity, flexibility · L content, inclusion · S compose, adapt · M d/d/t/t
- `snippets/best-practices/choose-a-descriptive-label-for-a` **Do:** Label a confirmation snippet's primary button with a specific action word, like Order, rather than OK or Proceed. **Why:** A descriptive label is clearer than generic wording. · P simplicity · L content, interaction · S write · M d/d/-/-
- `snippets/best-practices/communicate-a-snippets-purpose-visually` **Do:** Convey the snippet's purpose in the custom view and leave the spoken dialogue text out of its visual form. **Why:** The dialogue matters when people aren't looking, but repeating it visually duplicates the view's information. · P simplicity · L content, attention · S compose · M d/d/d/d

## Status bars (`status-bars`)

System experiences · <https://developer.apple.com/design/human-interface-guidelines/status-bars>

### Best practices

- `status-bars/best-practices/obscure-content-under-the-status-bar` **Do:** Keep the status bar readable and don't suggest content behind it is interactive; prefer a scroll edge effect with a blurred view behind it. **Why:** The transparent bar makes its info hard to see, and people may try using controls beneath it. · P familiarity, craft · L attention, interaction · S compose, express · M d/t/-/-
- `status-bars/best-practices/consider-temporarily-hiding-the-status-bar` **Do:** Consider hiding the status bar for a while when showing full-screen media. **Why:** The bar can distract from the media, and hiding it makes the experience more immersive. · P delight, simplicity · L attention · S express, interact · M d/t/t/-
- `status-bars/best-practices/avoid-permanently-hiding-the-status-bar` **Do:** Don't hide the status bar for good; let people bring it back with a simple, discoverable gesture such as a tap. **Why:** Without it people must leave the app to check the time or connectivity. · P agency, familiarity · L interaction, flow · S interact · M d/t/-/-

## Top Shelf (`top-shelf`)

System experiences · <https://developer.apple.com/design/human-interface-guidelines/top-shelf>

### Best practices

- `top-shelf/best-practices/help-people-jump-right-into-your` **Do:** Use Top Shelf to take people straight to content they care about, such as a primary play button plus a More Info button. **Why:** Top Shelf gives a direct route to the content people value most. · P agency, purpose · L flow, value · S structure · M -/-/-/-
- `top-shelf/best-practices/feature-new-content` **Do:** Highlight new releases, episodes, and upcoming titles, and skip promoting content people already bought, rented, or watched. · P purpose · L value · S define · M -/-/-/-
- `top-shelf/best-practices/personalize-peoples-favorite-content` **Do:** Tailor Top Shelf content with targeted recommendations, letting people resume playback or return to active gameplay. **Why:** People usually place their most-used apps there, so personalization fits. · P purpose, agency · L value, flow · S define · M -/-/-/-
- `top-shelf/best-practices/avoid-showing-advertisements-or-prices` **Do:** Don't fill Top Shelf with ads; emphasize new, exciting content and show prices only once people show interest. **Why:** People put the app there because it already won them over and may dislike many ads. · P responsibility, purpose · L trust, value · S define · M -/-/-/-
- `top-shelf/best-practices/showcase-compelling-dynamic-content-that-can` **Do:** Feature captivating dynamic content showing the newest or top-rated items, ideally with layered images; static images are a fallback. **Why:** People generally prefer a captivating dynamic experience that draws them in. · P delight, purpose · L attention, value · S express · M -/-/-/-
- `top-shelf/best-practices/if-you-dont-provide-the-recommended` **Do:** If you lack full-screen content, supply at least one static fallback image at the 2320x720 pt size, which tvOS flips and blurs. **Why:** The system shows a static image when full-screen content is unavailable. · P craft, flexibility · L platform · S adapt · M -/-/-/-
- `top-shelf/best-practices/avoid-implying-interactivity-in-a-static` **Do:** Design static Top Shelf images so they don't look interactive. **Why:** They can't receive focus, so they shouldn't mislead people. · P familiarity, simplicity · L interaction, attention · S express · M t/t/-/-
### Dynamic layouts > Carousel actions

- `top-shelf/dynamic-layouts/carousel-actions/provide-a-title` **Do:** Add a concise title such as a show, movie, or album name, plus an optional brief subtitle like dates or a series name. · P simplicity · L content · S write · M d/d/d/d
### Dynamic layouts > Carousel details

- `top-shelf/dynamic-layouts/carousel-details/provide-a-title-that-identifies-the` **Do:** Show the title of the currently playing content near the top, optionally with a short phrase or app attribution above it. **Why:** A top-placed title can be read at a glance. · P simplicity, craft · L content, attention · S write, compose · M t/t/d/d
### Dynamic layouts > Sectioned content row

- `top-shelf/dynamic-layouts/sectioned-content-row/provide-enough-content-to-constitute-a` **Do:** Load enough images to span the full screen width in a sectioned row, and include at least one label. **Why:** A label gives context and platform consistency. · P craft, familiarity · L attention, platform · S compose · M -/-/-/-
### Dynamic layouts > Sectioned content row > 16:9

- `top-shelf/dynamic-layouts/sectioned-content-row/169/be-aware-of-additional-scaling-when` **Do:** When mixing image sizes in a row, expect shorter images to scale up to the tallest one's height, such as 16:9 growing to 500 pixels. **Why:** Automatic scaling to match row height changes how mixed images look. · P craft · L attention, platform · S compose · M -/-/-/-
### Dynamic layouts > Sectioned content row > Scrolling inset banner

- `top-shelf/dynamic-layouts/sectioned-content-row/scrolling-inset-banner/provide-three-to-eight-images` **Do:** Include three to eight images in a scrolling banner. **Why:** Fewer than three feels ineffective, and over eight makes finding a particular image hard. · P simplicity, craft · L flow, interaction · S compose · M t/t/-/t
- `top-shelf/dynamic-layouts/sectioned-content-row/scrolling-inset-banner/if-you-need-text-add-it` **Do:** Build any text into the banner image itself, raise it on its own layer if layered, and repeat it in the image's accessibility label for VoiceOver. **Why:** This layout shows no labels beneath content, and assistive technology needs the text too. · P flexibility, craft · L inclusion, content · S express, include · M t/t/t/d

## Watch faces (`watch-faces`)

System experiences · <https://developer.apple.com/design/human-interface-guidelines/watch-faces>

### Best practices

- `watch-faces/best-practices/help-people-discover-your-app-by` **Do:** Share watch faces featuring several of your complications to showcase a curated experience and help people find your app. **Why:** People who add the face without the app are prompted to install it. · P purpose, agency · L value, platform · S define · M -/-/-/-
- `watch-faces/best-practices/display-a-preview-of-each-watch` **Do:** Show a preview for each shared watch face that highlights its advantages, framed by an illustrated or high-fidelity hardware bezel. **Why:** A preview helps people picture the benefits. · P craft, delight · L attention, platform · S express · M -/-/-/-
- `watch-faces/best-practices/aim-to-offer-shareable-watch-faces` **Do:** Offer shareable faces for all Apple Watch models, giving a similar configuration on older-compatible faces and labeling the devices each supports. **Why:** Some faces only exist on newer watches, and labels help people choose. · P flexibility · L inclusion, platform · S adapt · M -/-/-/-
- `watch-faces/best-practices/respond-gracefully-if-people-choose-an` **Do:** When someone picks an incompatible face, immediately provide a compatible alternative instead of an error, and warn in previews that a substitute may appear. **Why:** Offering an alternative avoids a dead end. · P agency, flexibility · L flow, interaction · S interact · M -/-/-/-

## Widgets (`widgets`)

System experiences · <https://developer.apple.com/design/human-interface-guidelines/widgets>

### Best practices

- `widgets/best-practices/choose-simple-ideas-that-relate-to` **Do:** Pick simple widget ideas tied to the app's core purpose, with timely content and relevant functionality prioritized. **Why:** People usually care most about what the app is mainly for, like current weather. · P purpose, simplicity · L value · S define · M t/t/-/-
- `widgets/best-practices/aim-to-create-a-widget-that` **Do:** Build widgets that quickly deliver wanted content, with useful actions and deep links; don't just copy the app icon. **Why:** An icon replica adds little value, so people may remove it from their screens. · P purpose, agency · L value, flow · S define · M t/t/-/-
- `widgets/best-practices/prefer-dynamic-information-that-changes-throughout` **Do:** Favor information that varies through the day, and find ways to keep content fresh. **Why:** Widgets that never seem to change may lose their prominent place; fresh content invites frequent viewing. · P purpose · L value, attention · S define · M t/t/-/-
- `widgets/best-practices/look-for-opportunities-to-surprise-and` **Do:** Seek chances for delight, such as a special visual treatment for meaningful days like birthdays or holidays. · P delight · L attention · S express · M t/t/t/t
- `widgets/best-practices/offer-widgets-in-multiple-sizes-when` **Do:** Provide extra sizes only when they add value, giving larger ones more layers of information and actions rather than stretched small content. **Why:** One widget in the best-fitting size beats offering all sizes. · P simplicity, purpose · L value, attention · S compose · M t/t/-/-
- `widgets/best-practices/balance-information-density` **Do:** Strike a balance in density: essential facts at a glance, extra details on a longer look; if crowded, enlarge the widget or swap text for graphics. **Why:** Sparse layouts seem needless, while crowded ones are hard to take in quickly. · P simplicity · L attention, value · S compose · M d/d/d/d
- `widgets/best-practices/display-only-the-information-thats-directly` **Do:** Show only data tied to the widget's main purpose; larger sizes may widen the range but should stay centered on that purpose. **Why:** Extra data must not make the primary purpose get lost. · P simplicity, purpose · L value, attention · S define, compose · M d/d/d/d
- `widgets/best-practices/use-brand-elements-thoughtfully` **Do:** Use brand colors, typefaces, and glyphs for recognition without overpowering useful content or looking out of place; add a small top-right logo only if needed. **Why:** Brand elements already make the widget recognizable, so a logo is rarely required. · P delight, simplicity · L attention · S express · M d/d/d/d
- `widgets/best-practices/choose-between-automatically-displaying-content-and` **Do:** Decide whether the widget configures itself or lets people tailor what shows, e.g. choose stocks to track versus automatic recent podcasts. **Why:** Some widgets need configuration to be useful, while others work well automatically. · P agency, purpose · L interaction, value · S define, interact · M t/t/-/-
- `widgets/best-practices/avoid-mirroring-your-widgets-appearance-within` **Do:** Don't put a lookalike of your widget inside your app if it doesn't act like the widget. **Why:** A fake widget misleads people, and they may then skip other ways of interacting because they expect widget behavior. · P familiarity, simplicity · L interaction, content · S interact · M t/d/-/-
- `widgets/best-practices/let-people-know-when-authentication-adds` **Do:** Tell people when signing in unlocks extra widget functionality, for example with a short sign-in prompt in the signed-out state. **Why:** People need to know that signing in adds value, or they won't realize what they're missing. · P responsibility, familiarity · L trust, content · S write, interact · M t/d/-/-
### Best practices > Updating widget content

- `widgets/best-practices/updating-widget-content/keep-your-widget-up-to-date` **Do:** Pick an update schedule that matches how often the data changes and when people need it; if they may look more often, show when it was last refreshed. **Why:** Updates should match real need, and a visible timestamp clarifies how current the content is. · P purpose, familiarity · L attention, flow · S interact · M t/d/-/-
- `widgets/best-practices/updating-widget-content/use-system-functionality-to-refresh-dates` **Do:** Let the system refresh dates and times automatically, and show content promptly instead of hiding old data behind placeholders. **Why:** Widget update opportunities are limited, so automatic date refresh saves them for real data changes. · P craft · L flow, interaction · S interact · M t/d/-/-
- `widgets/best-practices/updating-widget-content/use-animated-transitions-to-bring-attention` **Do:** Animate data changes briefly (up to two seconds, standard or custom) so people notice new information or altered content. **Why:** Motion tells people that something new is available or now looks different. · P delight, simplicity · L attention · S express, interact · M t/d/-/-
### Best practices > Adding interactivity

- `widgets/best-practices/adding-interactivity/offer-simple-relevant-functionality-and-reserve` **Do:** Keep widget actions simple and tied to the widget's content; leave complex tasks to the app. **Why:** A useful widget offers a quick way to finish a task directly related to what it shows. · P simplicity, purpose · L value, interaction · S compose · M t/d/-/-
- `widgets/best-practices/adding-interactivity/ensure-that-a-widget-interaction-opens` **Do:** When a widget is tapped or clicked, open the app straight to the related details or action instead of making people navigate there. **Why:** People shouldn't have to hunt for the relevant area after tapping. · P agency, familiarity · L flow, interaction · S structure, interact · M t/d/-/-
- `widgets/best-practices/adding-interactivity/offer-interactivity-while-remaining-glanceable-and` **Do:** Add interactive elements to widgets only where they fit, avoid app-like layouts, and size targets so taps are confident and accidental ones are unlikely. Inline accessory widgets have only one tap target. **Why:** Widgets should stay glanceable, and accidental actions result from cramped targets. · P simplicity, agency · L interaction, attention · S compose · M t/d/-/-
### Best practices > Choosing margins and padding

- `widgets/best-practices/choosing-margins-and-padding/in-general-use-standard-margins-to` **Do:** Use the standard widget margins so edges aren't crowded; tighter margins are acceptable for grouping content, and some contexts like the Mac desktop and Lock Screen use smaller ones. **Why:** Standard margins keep content legible and uncluttered. · P craft, simplicity · L attention · S compose · M t/d/-/-
- `widgets/best-practices/choosing-margins-and-padding/coordinate-the-corner-radius-of-your` **Do:** Apply the widget's corner radius to your content by using a container that adapts to it. **Why:** Content should look right inside the widget's rounded corners. · P craft, familiarity · L attention · S compose · M t/-/-/-
### Best practices > Displaying text in widgets

- `widgets/best-practices/displaying-text-in-widgets/prefer-using-the-system-font-text` **Do:** Favor the system font, text styles and SF Symbols; if you use a custom font, do it sparingly and keep it readable at a glance, for example only for large text. **Why:** System type fits any platform and scales well; symbols align with such text. · P familiarity, flexibility · L attention · S express · M t/d/-/-
- `widgets/best-practices/displaying-text-in-widgets/avoid-very-small-font-sizes` **Do:** Avoid text smaller than about 11 points in widgets. **Why:** Smaller text is too hard for many people to read. · P flexibility, craft · L attention, inclusion · S express · M t/d/-/-
- `widgets/best-practices/displaying-text-in-widgets/avoid-rasterizing-text` **Do:** Keep text as real text with styles rather than images of text, so it scales and VoiceOver can read it. Widgets support Dynamic Type from Large to AX5 on iOS, iPadOS and visionOS. **Why:** Real text scales and can be spoken aloud; rasterized text can't. · P flexibility · L inclusion · S express, include · M t/d/-/-
### Best practices > Using color

- `widgets/best-practices/using-color/use-color-to-enhance-a-widgets` **Do:** Use color to make a widget attractive without letting it pull attention away from the information. **Why:** Color draws the eye, but people should still absorb the content at a glance. · P simplicity, delight · L attention · S express · M t/d/-/-
- `widgets/best-practices/using-color/convey-meaning-without-relying-on-specific` **Do:** Don't rely on color alone for meaning; pair it with text and icons. **Why:** Widgets may appear monochrome or tinted, and watchOS can invert colors, so color-only meaning can vanish. · P flexibility · L inclusion, attention · S express, include · M t/d/-/-
- `widgets/best-practices/using-color/use-full-color-images-judiciously` **Do:** Use full-color images sparingly in widgets, since tinted and clear styles normally desaturate them. **Why:** Full-color imagery in those styles draws special attention and can make the widget feel out of place on the platform. · P familiarity, simplicity · L attention, platform · S express · M t/d/-/-
### Rendering modes > Full-color

- `widgets/rendering-modes/full-color/support-light-and-dark-appearances` **Do:** Use light backgrounds for light appearance and dark ones for dark, ideally with semantic system colors or asset-catalog color variants that adapt automatically. **Why:** Widgets should fit whichever appearance a person has chosen. · P flexibility, familiarity · L attention, inclusion · S express · M t/d/-/-
### Rendering modes > Accented

- `widgets/rendering-modes/accented/group-widget-components-into-an-accented` **Do:** In accented mode, sort widget elements into two sets, accent and primary; the system renders primary content white and tints accents, using the watch face color on Apple Watch. **Why:** The system divides the view hierarchy into two groups and tints each one itself. · P familiarity, craft · L attention, platform · S express · M t/-/-/-
### Rendering modes > Vibrant

- `widgets/rendering-modes/vibrant/offer-enough-contrast-to-ensure-legibility` **Do:** In vibrant rendering, remember that pixel opacity sets the blur effect strength and brightness sets vibrancy, so use brighter grays where you need more contrast. **Why:** Pixel opacity and brightness determine how strongly content shows against the Lock Screen material. · P flexibility, craft · L attention, inclusion · S express · M t/-/-/-
- `widgets/rendering-modes/vibrant/create-optimized-assets-for-the-best` **Do:** Render vibrant content at full opacity, with white or light gray for key items and darker grays for secondary ones, using opaque grays and checking grayscale contrast. **Why:** Opaque grayscale values give the best vibrant effect and a clear hierarchy. · P craft, simplicity · L attention · S express · M t/-/-/-
### Previews and placeholders

- `widgets/previews-and-placeholders/design-a-realistic-preview-to-display` **Do:** Show a realistic preview in the widget gallery, with simulated data if real data loads too slowly. **Why:** Showing what each widget type or size can do helps people decide with full information. · P purpose, responsibility · L value, trust · S define, write · M t/d/-/-
- `widgets/previews-and-placeholders/design-placeholder-content-that-helps-people` **Do:** Create placeholder content that mixes static components with semi-opaque stand-in shapes for dynamic content, so the widget is recognizable while data loads. **Why:** An installed widget shows placeholders during loading, and good ones help people identify it. · P craft, simplicity · L attention, flow · S interact, express · M t/d/-/-
- `widgets/previews-and-placeholders/write-a-succinct-widget-description` **Do:** Write a short gallery description that starts with an action verb, skips self-referential phrases like "This widget shows", and uses approachable sentence-style language. **Why:** The gallery description helps people understand what the widget does, so extra phrasing is wasted. · P simplicity · L content · S write · M t/d/-/-
- `widgets/previews-and-placeholders/group-your-widgets-sizes-together-and` **Do:** Group a widget's sizes under one entry with a single description. **Why:** Separate entries make each size look like a different widget; one description shows them as views of the same content. · P simplicity · L attention, content · S compose, write · M t/d/-/-
- `widgets/previews-and-placeholders/consider-coloring-the-add-button` **Do:** Consider giving the widget gallery's Add button a color matching your brand. **Why:** A branded color reminds people of the app. · P delight · L attention · S express · M t/-/-/-
### Platform considerations > iOS, iPadOS

- `widgets/platform-considerations/ios-ipados/support-the-always-on-display-on` [iOS, iPadOS] **Do:** On iPhone, use gray levels with enough contrast and keep content legible when the Always-On display dims Lock Screen widgets. **Why:** Reduced luminance in the Always-On display can make content hard to see. · P flexibility · L inclusion, platform · S include, express · M t/-/-/-
- `widgets/platform-considerations/ios-ipados/offer-live-activities-to-show-real` [iOS, iPadOS] **Do:** Offer Live Activities when people need to follow a task or event with frequent updates for a limited time; widgets aren't real-time. Build both together and reuse code and design parts. **Why:** Widgets don't show real-time information, and the two features share frameworks and design traits. · P purpose, familiarity · L flow, platform · S define · M t/-/-/-
### Platform considerations > iOS, iPadOS > StandBy and CarPlay

- `widgets/platform-considerations/ios-ipados/standby-and-carplay/limit-usage-of-rich-images-or` [iOS, iPadOS] **Do:** In StandBy, convey meaning without rich images or color; instead scale up and rearrange text for viewing from afar, and make the widget background removable. **Why:** StandBy is glanced at from a greater distance. · P flexibility, simplicity · L attention, platform · S express, adapt · M t/-/-/-
### Platform considerations > visionOS

- `widgets/platform-considerations/visionos/adapt-your-design-and-content-for` [visionOS] **Do:** On visionOS, treat widgets as part of a person's room and adapt design and content to that spatial setting, such as large type and high-resolution art readable across the room. **Why:** Widgets live among surroundings like living rooms and offices rather than floating alone. · P flexibility · L platform, attention · S adapt · M -/-/-/-
- `widgets/platform-considerations/visionos/test-your-widgets-across-the-full` [visionOS] **Do:** On visionOS, test widgets with all system color palettes and varied lighting, including every tint palette when you exclude elements from tinting, so tone and legibility stay consistent. **Why:** People customize tints and lighting, which can make untinted elements hard to read. · P flexibility, craft · L inclusion, attention · S include · M -/-/-/-
### Platform considerations > visionOS > Thresholds and sizes

- `widgets/platform-considerations/visionos/thresholds-and-sizes/design-a-responsive-layout-that-shows` [visionOS] **Do:** On visionOS, show a simplified larger-type widget without buttons or toggles at a distance and a more detailed smaller-type one nearby, keeping shared elements across both. **Why:** Viewing distance changes how much detail people can take in, and shared elements keep the transition continuous. · P flexibility, simplicity · L attention, platform · S compose, adapt · M -/-/-/-
- `widgets/platform-considerations/visionos/thresholds-and-sizes/offer-widget-family-sizes-that-fit` [visionOS] **Do:** On visionOS, choose widget sizes based on where people may put them, such as a wall, sideboard or desk. **Why:** Widgets have a lasting presence tied to real-world sizes and places. · P flexibility · L platform, value · S define, adapt · M -/-/-/-
- `widgets/platform-considerations/visionos/thresholds-and-sizes/display-content-in-a-way-that` [visionOS] **Do:** On visionOS, keep content legible across viewing distances as people can scale widgets by 75 to 125 percent; use clear hierarchy, strong type and high-resolution assets. **Why:** Resizing and distance change how readable a widget is. · P flexibility, craft · L attention, inclusion · S express, adapt · M -/-/-/-
### Platform considerations > visionOS > Mounting styles

- `widgets/platform-considerations/visionos/mounting-styles/choose-the-mounting-style-that-fits` [visionOS] **Do:** On visionOS, pick elevated mounting for content that should stand out and recessed for ambient or immersive content, or opt out of a style that doesn't fit. **Why:** Each style suits different kinds of content and experiences. · P purpose, flexibility · L platform, value · S define, express · M -/-/-/-
- `widgets/platform-considerations/visionos/mounting-styles/test-your-elevated-widget-designs-with` [visionOS] **Do:** On visionOS, check elevated widgets against each system frame width, since layout can't change per width and must remain balanced. **Why:** People can choose frame widths, and you can't tailor the layout to them. · P craft, flexibility · L attention, platform · S compose, adapt · M -/-/-/-
### Platform considerations > visionOS > Treatment styles

- `widgets/platform-considerations/visionos/treatment-styles/choose-the-paper-style-for-a` [visionOS] **Do:** On visionOS, use the paper style when a widget should look like a physical, print-like object that responds to ambient light. **Why:** The whole widget blends into the room as if it were a real object. · P delight, familiarity · L attention, platform · S express · M -/-/-/-
- `widgets/platform-considerations/visionos/treatment-styles/choose-the-glass-style-for-information` [visionOS] **Do:** On visionOS, use the glass style for information-rich widgets so foreground content stays sharp while the background adapts to surroundings. **Why:** Glass separates layers so key content remains legible regardless of ambient light. · P flexibility, delight · L attention, platform · S express · M -/-/-/-
### Platform considerations > watchOS

- `widgets/platform-considerations/watchos/provide-a-colorful-background-that-conveys` [watchOS] **Do:** On watchOS, replace the default black Smart Stack background with a color that carries meaning, such as red or green for a stock falling or rising. **Why:** A meaningful background color adds information at a glance. · P delight, purpose · L attention, platform · S express · M -/-/-/-
- `widgets/platform-considerations/watchos/encourage-the-system-to-display-or` [watchOS] **Do:** On watchOS, supply relevancy information so the system can show or raise your widget in the Smart Stack when it's most useful. **Why:** Relevance, such as location or workouts, lets the system surface the widget when people need it. · P purpose, flexibility · L value, platform · S define · M -/-/-/-
