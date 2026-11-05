---
tree: choosing-values
title: "Choosing a value or option"
members: [toggles, segmented-controls, pickers, pop-up-buttons, pull-down-buttons, menus, sliders, steppers]
---

# Decision tree: Choosing a value or option

**Use this when:** People must set a value, pick from options or flip a state, and you need to pick the control.
**Members:** [Toggles](../components/toggles.md) · [Segmented controls](../components/segmented-controls.md) · [Pickers](../components/pickers.md) · [Pop-up buttons](../components/pop-up-buttons.md) · [Pull-down buttons](../components/pull-down-buttons.md) · [Menus](../components/menus.md) · [Sliders](../components/sliders.md) · [Steppers](../components/steppers.md)
**Related patterns:** [Settings](https://developer.apple.com/design/human-interface-guidelines/settings) · [Entering data](https://developer.apple.com/design/human-interface-guidelines/entering-data)

## Start with the need
1. **Does the person need to set this at all, or can the app know it?**
   - The system can detect it (a connected controller, Dark Mode) → no control; collect it automatically `settings/best-practices/avoid-using-settings-to-ask-for` `entering-data/best-practices/get-information-from-the-system-whenever`
   - It must be asked → go to 2
2. **Where does the choice live?**
   - It changes the task on screen (a filter, an order, visibility) → put the control in that screen, not in a settings area `settings/task-specific-options/when-possible-prefer-letting-people-modify`
   - It is general and rarely changed → settings area; keep the count low and defaults good `settings/general-settings/put-general-infrequently-changed-settings-in` `settings/best-practices/minimize-the-number-of-settings-you` `settings/best-practices/aim-to-provide-default-settings-that`
   - Either way → go to 3
3. **What kind of value is it?**
   - Two opposing states (on/off) → go to 4
   - One of several named options → go to 5
   - A number or amount → go to 7
   - Commands, not a value → go to 6
4. **Is it a plain yes or no for content or a view?**
   - Yes, in an iOS or iPadOS list row → [switch](../components/toggles.md) `toggles/platform-considerations/ios-ipados/use-the-switch-toggle-style-only`
   - Yes, on iOS or iPadOS outside a list → toggle-like button, highlighted when active `toggles/platform-considerations/ios-ipados/outside-of-a-list-use-a`
   - Yes, on macOS and you want to stress it or switch a group → switch; otherwise a checkbox `toggles/platform-considerations/macos/switches/prefer-a-switch-for-settings-that` `toggles/platform-considerations/macos/radio-buttons/to-present-a-single-setting-that`
   - Several independent on/off choices on macOS → checkboxes `toggles/platform-considerations/macos/radio-buttons/prefer-a-set-of-radio-buttons`
   - No, it is an action or a list pick → go to 5 or 6 `toggles/best-practices/use-a-toggle-to-help-people`
5. **How many mutually exclusive options, and how much room?**
   - Closely related, few, and the selection should stay visible → [segmented control](../components/segmented-controls.md), about five on iPhone and five to seven when wide `segmented-controls/best-practices/consider-a-segmented-control-when-its` `segmented-controls/best-practices/limit-the-number-of-segments-in`
   - Space is tight, flat set, show the current one → [pop-up button](../components/pop-up-buttons.md) with a sensible default and a predictive label `pop-up-buttons/best-practices/consider-using-a-pop-up-button` `pop-up-buttons/best-practices/provide-a-useful-default-selection` `pop-up-buttons/best-practices/give-people-a-way-to-predict`
   - Mid-length to long, ordered list (or a date and time) → [picker](../components/pickers.md), shown in context `pickers/best-practices/consider-using-a-picker-to-offer` `pickers/best-practices/avoid-switching-views-to-show-a`
   - On macOS, more than two exclusive options but not many → radio buttons; past about five, a pop-up button `toggles/platform-considerations/macos/checkboxes/consider-using-radio-buttons-if-you` `toggles/platform-considerations/macos/radio-buttons/avoid-listing-too-many-radio-buttons`
   - Very large set → a list or table, not a picker `pickers/best-practices/consider-using-a-picker-to-offer`
   - Free text would do but a set exists → offer choices instead of typing `entering-data/best-practices/when-possible-offer-choices-instead-of`
6. **Are these commands tied to a button's action?**
   - Yes, at least three, and primary actions stay visible → [pull-down button](../components/pull-down-buttons.md) `pull-down-buttons/best-practices/use-a-pull-down-button-to` `pull-down-buttons/best-practices/balance-menu-length-with-ease-of`
   - One or two → plain buttons, toggles or switches `pull-down-buttons/best-practices/balance-menu-length-with-ease-of`
   - A larger set of commands to save space → [menu](../components/menus.md): short, grouped, important first `menus/organization/be-mindful-of-menu-length` `menus/organization/prefer-listing-important-or-frequently-used`
   - Lower-priority items on iOS or iPadOS → a More pull-down, accepting less discoverability `pull-down-buttons/platform-considerations/ios-ipados/consider-using-a-more-pull-down`
7. **How precise must the number be?**
   - Rough position in a range, adjusted by feel → [slider](../components/sliders.md) `sliders/best-practices/use-familiar-slider-directions`
   - Small changes to a visible value → [stepper](../components/steppers.md), with the value shown beside it `steppers/best-practices/make-the-value-that-a-stepper` `steppers/best-practices/consider-pairing-a-stepper-with-a`
   - Wide range and an exact value → slider plus text field plus stepper `sliders/best-practices/consider-supplementing-a-slider-with-a`
   - Volume on iOS or iPadOS → a volume view, not a plain slider `sliders/platform-considerations/ios-ipados/dont-use-a-slider-to-adjust`
   - A date or time → a picker; consider quarter-hour minute steps `pickers/best-practices/consider-providing-less-granularity-when-specifying`

## At a glance
| Component | Shows all options | Value kind | Opens a menu or view | Best for | Avoid when |
| --- | --- | --- | --- | --- | --- |
| Toggles | Both states | Two opposing states | No | Settings on or off `toggles/best-practices/use-a-toggle-to-help-people` | Choosing from a list |
| Segmented controls | Yes | One of a few related | No | Grouped options with visible selection `segmented-controls/best-practices/consider-a-segmented-control-when-its` | Many segments, mixed action and selection |
| Pickers | Scrolling set | One of mid to long list | Inline or in context | Ordered values, dates `pickers/best-practices/consider-using-a-picker-to-offer` | Short lists |
| Pop-up buttons | Current only | One of a flat set | Menu | Tight space `pop-up-buttons/best-practices/use-a-pop-up-button-to` | Actions, multi-select, submenus |
| Pull-down buttons | No | Commands | Menu | Actions tied to a button `pull-down-buttons/best-practices/use-a-pull-down-button-to` | One or two items |
| Menus | No | Commands or choices | Menu | Many items in little space `menus/organization/be-mindful-of-menu-length` | Burying primary actions |
| Sliders | Range | Continuous number | No | Rough adjustment `sliders/best-practices/use-familiar-slider-directions` | Exact numbers alone |
| Steppers | No value shown | Number in small steps | No | Small tweaks `steppers/best-practices/consider-pairing-a-stepper-with-a` | Value not shown nearby |

## Platform notes
- **iOS, iPadOS:** switches only in list rows; segmented controls for related subviews, tab bars for separate sections `toggles/platform-considerations/ios-ipados/use-the-switch-toggle-style-only` `segmented-controls/platform-considerations/ios-ipados/consider-a-segmented-control-to-switch`
- **iPadOS:** in a popover or modal, a pop-up button beats a disclosure indicator for a small defined set `pop-up-buttons/platform-considerations/ipados/within-a-popover-or-modal-view`
- **macOS:** switches, checkboxes and radio buttons stay in the window body; segmented controls belong in toolbars or inspector panes; sliders get live feedback and tick marks `toggles/platform-considerations/macos/use-switches-checkboxes-and-radio-buttons` `segmented-controls/platform-considerations/macos/use-a-tab-view-in-the` `sliders/platform-considerations/macos/consider-giving-live-feedback-as-the`
- **tvOS, watchOS:** pop-up buttons, pull-down buttons and steppers are unavailable; tvOS also lacks sliders, watchOS lacks segmented controls (see the cards).

## Common mistakes
- **Using a toggle for a list pick or action:** use a pop-up or pull-down button `toggles/best-practices/use-a-toggle-to-help-people`
- **A pull-down for a flat exclusive choice:** use a pop-up button `pop-up-buttons/best-practices/use-a-pop-up-button-to`
- **A stepper with no visible value:** show the value beside it `steppers/best-practices/make-the-value-that-a-stepper`
- **Too many segments, or mixing action and selection segments:** cut segments, keep one kind `segmented-controls/best-practices/limit-the-number-of-segments-in` `segmented-controls/best-practices/keep-control-types-consistent-within-a`
- **Hiding every action in one pull-down:** keep primary actions visible `pull-down-buttons/best-practices/avoid-putting-all-of-a-views`
- **Showing a picker in a new view:** show it near the field `pickers/best-practices/avoid-switching-views-to-show-a`

## In other media
- **Mobile (any OS) and mobile web:** [HIG transfer] same need-first logic; use iOS forms of each control, and keep on/off states distinct beyond color `toggles/best-practices/make-sure-the-visual-differences-in`
- **Desktop web:** [HIG transfer] macOS roles for checkbox, radio, switch, select and slider apply `toggles/platform-considerations/macos/radio-buttons/prefer-a-set-of-radio-buttons`
- **Slides and card news:** [HIG none] these controls are interactive; static media just lists options, where menu list wording rules may transfer `menus/labels/remove-articles-like-a-an-and`

## Not settled by the HIG
- Segmented control versus pop-up button for a few exclusive options: no threshold is given beyond space and visibility.
- Where "short" ends and "mid-length" begins for pickers, and the exact line between a picker and a pop-up button.
- Slider versus stepper for a bounded number, and whether a toggle or checkbox is better outside macOS.
