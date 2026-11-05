---
tree: text-input
title: "Getting text and data from people"
members: [text-fields, text-views, search-fields, token-fields, combo-boxes, digit-entry-views, virtual-keyboards]
---

# Decision tree: Getting text and data from people

**Use this when:** you need people to type something, and you must pick the control, keyboard and supporting behavior.
**Members:** [Text fields](../components/text-fields.md) · [Text views](../components/text-views.md) · [Search fields](../components/search-fields.md) · [Token fields](../components/token-fields.md) · [Combo boxes](../components/combo-boxes.md) · [Digit entry views](../components/digit-entry-views.md) · [Virtual keyboards](../components/virtual-keyboards.md)
**Related patterns:** [Entering data](https://developer.apple.com/design/human-interface-guidelines/entering-data) · [Searching](https://developer.apple.com/design/human-interface-guidelines/searching)

## Start with the need
1. **Can the app get this information without asking?**
   - Yes (the system already has it) → ask for nothing and collect it automatically `entering-data/best-practices/get-information-from-the-system-whenever`
   - The person can drag or paste it in → support that path as well `entering-data/best-practices/as-much-as-possible-let-people`
   - No → go to 2
2. **Is the answer one of a few known options?**
   - Yes → offer a picker or menu, not free typing `entering-data/best-practices/when-possible-offer-choices-instead-of`
   - Mostly known options, but people may also need their own value (macOS) → [Combo boxes](../components/combo-boxes.md) `text-fields/platform-considerations/macos/consider-using-a-combo-box-if`
   - No, it is open-ended → go to 3
3. **Is the person looking for something that already exists in the app?**
   - Yes → [Search fields](../components/search-fields.md), with a hint of what can be searched `search-fields/best-practices/use-placeholder-text-to-help-people`. Choose placement by importance and platform `searching/best-practices/if-search-is-important-give-it`
   - Results should update as they type, with recent or predictive suggestions → `search-fields/best-practices/if-possible-start-search-immediately-when`, `search-fields/best-practices/consider-showing-suggested-search-terms`
   - Results need narrowing → scope bar (broad to narrow) or tokens `search-fields/scope-bars-and-tokens/use-a-scope-bar-to-filter`, `search-fields/scope-bars-and-tokens/use-tokens-to-filter-by-common`
   - No → go to 4
4. **Is it a short value such as a name, email or number?**
   - Yes → [Text fields](../components/text-fields.md) `text-fields/best-practices/use-a-text-field-to-request`. Add a placeholder and a separate label `text-fields/best-practices/show-a-hint-in-a-text`
   - Several values, such as email recipients, that people must pick, reorder or inspect one by one (macOS) → [Token fields](../components/token-fields.md) `token-fields/best-practices/consider-providing-additional-ways-to-convert`
   - No → go to 5
5. **Is it long, formatted or editable prose?**
   - Yes → [Text views](../components/text-views.md) `text-views/best-practices/use-a-text-view-when-you`
   - Text shown only for reading, such as an error message or serial number → still let people select and copy it `text-views/best-practices/make-useful-text-selectable`
   - No → go to 6
6. **Is the entry sensitive (password, PIN)?**
   - Password or other secret text → secure text field, never prefilled `text-fields/best-practices/use-secure-text-fields-to-hide`, `entering-data/best-practices/never-prepopulate-a-password-field`
   - Numeric code on Apple TV → [Digit entry views](../components/digit-entry-views.md) with secure digit fields and a stated purpose `digit-entry-views/best-practices/use-secure-digit-fields`, `digit-entry-views/best-practices/clearly-state-the-purpose-of-the`
   - Not sensitive → go to 7
7. **On a touch or TV device, how will they type?**
   - Standard content → declare what is being entered so the right [Virtual keyboard](../components/virtual-keyboards.md) layout appears `virtual-keyboards/best-practices/choose-a-keyboard-that-matches-the`
   - The action is obvious from context (search) → adjust the Return key `virtual-keyboards/best-practices/consider-customizing-the-return-key-type`
   - Standard layouts truly do not fit → custom input view or keyboard, only if it makes entry simpler `virtual-keyboards/custom-input-views/make-sure-your-custom-input-view`
   - Apple TV or Apple Watch → cut typing down, use buttons or option lists `text-fields/best-practices/minimize-text-entry-in-your-tvos`, `text-fields/platform-considerations/watchos/present-a-text-field-only-when`
8. **Must the entry be correct before continuing?**
   - Yes → validate as they type or at a sensible moment, and make required data plain `entering-data/best-practices/dynamically-validate-field-values`, `text-fields/best-practices/validate-fields-when-it-makes-sense`, `entering-data/best-practices/when-data-entry-is-necessary-make`
   - No → no extra gate; keep it simple.

## At a glance
| Component | Amount of text | Fixed choices | Platforms | Best for | Avoid when |
| --- | --- | --- | --- | --- | --- |
| Text fields | Short | None | All; fewer on tvOS and watchOS | Name, email, number | Long prose `text-fields/best-practices/use-a-text-field-to-request` |
| Text views | Long | None | Not limited in the card | Multi-line, formatted text | Small amounts `text-views/best-practices/use-a-text-view-when-you` |
| Search fields | Short query | Optional scope | All, placement varies | Finding content | Entering data `searching/best-practices/aim-to-make-your-apps-content` |
| Token fields | Short items | Suggestions | macOS only | Recipients, editable items | iOS, iPadOS, tvOS, visionOS, watchOS |
| Combo boxes | Short | Likely list plus custom | macOS only | Choice with free entry | Other platforms `combo-boxes/best-practices/provide-relevant-choices` |
| Digit entry views | Digits | None | tvOS only | PIN on full screen | Other platforms |
| Virtual keyboards | Any | None | Touch devices | Matching layout to content | Needless custom keyboards `virtual-keyboards/custom-input-views/make-sure-your-custom-input-view` |

## Platform notes
- **macOS:** combo boxes and token fields exist only here, and a combo box is the suggested step up when a text field needs a list `text-fields/platform-considerations/macos/consider-using-a-combo-box-if`
- **iOS and iPadOS:** a Clear button at the trailing end of a field, and the keyboard layout guide so the field stays visible above the keyboard `text-fields/platform-considerations/ios-ipados/display-a-clear-button-in-the`, `virtual-keyboards/platform-considerations/ios-ipados/use-the-keyboard-layout-guide-to`
- **iOS search:** a button-style search tab for quick searches, a standard search tab for rich content `search-fields/platform-considerations/ios/search-as-a-tab/choose-the-button-appearance-to-help`, `search-fields/platform-considerations/ios/search-as-a-tab/choose-the-standard-tab-style-to`
- **tvOS and watchOS:** typing is costly, so minimize it `text-fields/best-practices/minimize-text-entry-in-your-tvos`

## Common mistakes
- **Using a text field for long writing:** use a text view `text-fields/best-practices/use-a-text-field-to-request`
- **Placeholder as the only label:** add a separate label `text-fields/best-practices/show-a-hint-in-a-text`
- **Showing the wrong keyboard:** declare the content type `virtual-keyboards/best-practices/choose-a-keyboard-that-matches-the`
- **Prefilling or showing passwords:** hide and require entry `entering-data/best-practices/never-prepopulate-a-password-field`
- **Suggestions that pop in too fast:** tune the delay `token-fields/best-practices/consider-customizing-the-delay-the-system`
- **Search history shown without thought:** consider privacy and allow clearing `searching/best-practices/take-privacy-into-consideration-before-displaying`

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] match the input type to content, keep typing minimal, and keep the active field visible above the keyboard `virtual-keyboards/best-practices/choose-a-keyboard-that-matches-the`, `virtual-keyboards/platform-considerations/ios-ipados/use-the-keyboard-layout-guide-to`
- **Desktop web:** [HIG transfer] a combo box becomes an input with a suggestion list; token fields become chip inputs; the HIG does not specify web implementations `combo-boxes/best-practices/provide-relevant-choices`
- **Slides and card news:** [HIG none] no text entry is expected; if a mock form is shown, keep labels visible `text-fields/best-practices/show-a-hint-in-a-text`

## Not settled by the HIG
- Text field versus token field for lists of values: the HIG describes tokens only through Mail examples [HIG none]
- Combo box versus text field plus pull-down or picker: only the macOS hint above exists
- Where a text field becomes a text view: no length threshold is given

