---
tree: alerting-and-confirming
title: "Alerting, confirming and offering choices"
members: [alerts, action-sheets, sheets, popovers, menus, context-menus, edit-menus]
---

# Decision tree: Alerting, confirming and offering choices

**Use this when:** you need to warn someone, confirm an action, or offer choices, and must pick the lightest component that does the job.
**Members:** [Alerts](../components/alerts.md) · [Action sheets](../components/action-sheets.md) · [Sheets](../components/sheets.md) · [Popovers](../components/popovers.md) · [Menus](../components/menus.md) · [Context menus](../components/context-menus.md) · [Edit menus](../components/edit-menus.md)
**Related patterns:** [Modality](https://developer.apple.com/design/human-interface-guidelines/modality) · [Undo and redo](https://developer.apple.com/design/human-interface-guidelines/undo-and-redo) · [Feedback](https://developer.apple.com/design/human-interface-guidelines/feedback)

## Start with the need
1. **Does the person need to be told something, or do they want to do something?**
   - Only told, and no decision is needed → show it in context, not in an alert `alerts/best-practices/avoid-using-an-alert-merely-to` `feedback/best-practices/use-alerts-to-deliver-critical-and`
   - Told, and it is serious or needs a decision → go to 2
   - They want to act → go to 4
2. **Is this about data loss or a destructive action?**
   - The action is common and can be undone → no confirmation; support undo instead `alerts/best-practices/avoid-displaying-alerts-for-common-undoable` `undo-and-redo/best-practices/let-people-undo-multiple-times`
   - The loss is the expected result of the action → no warning `feedback/best-practices/warn-people-when-they-initiate-a`
   - Rare, irreversible, possibly accidental → go to 3
   - Something else (a problem, a blocked command) → go to 3, and explain why a command cannot run `feedback/best-practices/show-people-when-a-command-cant`
3. **Did the person deliberately start the action, and do they now choose how it ends?**
   - Yes, such as save or discard a draft → [Action sheet](../components/action-sheets.md): destructive choice on top, Cancel at the bottom `action-sheets/best-practices/use-an-action-sheet-not-an` `action-sheets/best-practices/make-destructive-choices-visually-prominent` `action-sheets/best-practices/if-necessary-provide-a-cancel-button`
   - No, a problem or urgent news → [Alert](../components/alerts.md): short title, verb buttons, Cancel not the default `alerts/best-practices/use-alerts-sparingly` `alerts/buttons/if-theres-a-destructive-action-include`
   - It needs one small input, like a password → [Alert](../components/alerts.md) with a text field `alerts/content/if-supported-include-a-text-field`
   - **Styling depends on the container (the Empty Trash case).** The HIG's own example is an Empty Trash alert confirmed with Return, that is, on Mac: use an alert, leave the Empty Trash button in the normal style so Return confirms the intended action `alerts/buttons/use-the-destructive-style-to-identify`, and skip the caution symbol `alerts/platform-considerations/macos/use-a-caution-symbol-sparingly`. On iPhone and iPad the same confirmation is an action sheet, and the action sheets page asks for the destructive style on destructive choices `action-sheets/best-practices/make-destructive-choices-visually-prominent`. The two pages are not reconciled for that case (see below): default to the page of the component you use, and say so. [House]
4. **Is it a command on a thing the person is pointing at?**
   - Selected or editable text and content → system [Edit menu](../components/edit-menus.md) `edit-menus/best-practices/prefer-the-system-provided-edit-menu`
   - Other item, a few likely commands, also reachable elsewhere → [Context menu](../components/context-menus.md) `context-menus/best-practices/prioritize-relevancy-when-choosing-items-to` `context-menus/best-practices/always-make-context-menu-items-available`
   - Neither, or a visible button should open it → go to 5
5. **Is it a list of commands or options that must fit little space?**
   - Yes → [Menu](../components/menus.md): short, grouped, important items first `menus/organization/be-mindful-of-menu-length` `menus/organization/prefer-listing-important-or-frequently-used`
   - A primary action would be buried → show a [Button](../components/buttons.md) `pull-down-buttons/best-practices/avoid-putting-all-of-a-views`
   - No, the person needs to edit or set a few things → go to 6
6. **Is it a few related settings or details, tied to one control?**
   - Yes, with room (wide view) → [Popover](../components/popovers.md) aimed at its source `popovers/best-practices/use-a-popover-to-expose-a` `popovers/best-practices/position-popovers-appropriately`
   - Compact iPhone or iPad view → full-screen modal such as a [Sheet](../components/sheets.md) `popovers/platform-considerations/ios-ipados/avoid-displaying-popovers-in-compact-views`
   - Not tied to a control, a focused scoped task → go to 7
7. **Is it a focused task that needs concentration, and how long is it?**
   - Short and scoped → [Sheet](../components/sheets.md) with Done plus Cancel or Back `sheets/best-practices/for-complex-or-prolonged-user-flows` `sheets/best-practices/provide-an-alternative-to-the-done`
   - Long or multistep → full-screen modal, new window or full screen `sheets/best-practices/for-complex-or-prolonged-user-flows` `modality/best-practices/consider-using-a-full-screen-modal`
   - Supplementary items that affect the main task → nonmodal view `sheets/best-practices/use-a-nonmodal-view-when-you`
   - Repeated input while watching results on Mac → [Panel](../components/panels.md) `sheets/platform-considerations/macos/use-a-panel-instead-of-a`
8. **Could closing lose what the person made?**
   - Yes → explain the risk and offer to save, using an action sheet for swipe dismissal `modality/best-practices/when-necessary-help-people-avoid-data` `sheets/platform-considerations/ios-ipados/support-swiping-to-dismiss-a-sheet`
   - A popover closes on its own → save the work; discard only on explicit Cancel `popovers/best-practices/always-save-work-when-automatically-closing`
   - No → close freely, always with an obvious way out `modality/best-practices/always-give-people-an-obvious-way`

## At a glance
| Component | Interrupts the task | Anchored to its source | Best number of options | Best for | Avoid when |
| --- | --- | --- | --- | --- | --- |
| Alerts | Yes, modal `alerts/best-practices/use-alerts-sparingly` | No | Few buttons, 1 or 2 words each `alerts/buttons/create-succinct-logical-button-titles` | Critical, rare, destructive | Informational only, common undoable actions |
| Action sheets | Yes, modal `action-sheets/best-practices/use-action-sheets-sparingly` | Tied to the started action | Short enough not to scroll; max four buttons on watchOS `action-sheets/platform-considerations/watchos/avoid-displaying-more-than-four-buttons` | Choices to finish a deliberate action | Problems, routine actions |
| Sheets | Yes, modal `sheets/best-practices/display-only-one-sheet-at-a` | Tied to the current context | A small task | Scoped focused tasks | Long flows, supplementary items |
| Popovers | Light, dismissible `popovers/best-practices/show-one-popover-at-a-time` | Yes, arrow to source | A few related tasks `popovers/best-practices/use-a-popover-to-expose-a` | Quick local settings | Warnings, compact views |
| Menus | On demand | Opened from a control or the menu bar | Short; one submenu level `menus/submenus/limit-the-depth-and-length-of` | Many commands in little space | Primary actions, deep hierarchy |
| Context menus | On demand | Yes, on an item | Small; about three groups `context-menus/best-practices/aim-for-a-small-number-of` | Likely commands for one item | Only route to a command |
| Edit menus | On demand | On selected content | Standard edit commands plus a few custom `edit-menus/best-practices/list-custom-commands-near-relevant-system` | Text and content editing | Duplicating it with a context menu on iOS |

## Platform notes
- **iOS, iPadOS:** choices for a deliberate action go in an action sheet, not an alert or menu. `alerts/platform-considerations/ios-ipados/use-an-action-sheet-not-an` `action-sheets/platform-considerations/ios-ipados/use-an-action-sheet-not-a`
- **iOS, iPadOS:** an item gets a context menu or an edit menu, not both. `context-menus/platform-considerations/ios-ipados/provide-either-a-context-menu-or`
- **macOS:** use a panel instead of a sheet for repeated input. `sheets/platform-considerations/macos/use-a-panel-instead-of-a`
- **watchOS:** action sheets are capped at four buttons; sheets only for custom titling or content. `action-sheets/platform-considerations/watchos/avoid-displaying-more-than-four-buttons` `sheets/platform-considerations/watchos/use-a-sheet-only-when-your`
- **visionOS:** action sheets are not available; popovers and context menus are. `popovers/best-practices/use-a-popover-to-expose-a`
- **tvOS, watchOS:** popovers are not available (see the card).

## Common mistakes
- **Alert for routine news or a launch notice:** show it in context, or use cached content. `alerts/best-practices/avoid-using-an-alert-merely-to` `alerts/best-practices/avoid-showing-an-alert-when-your`
- **Confirming common, undoable deletes:** drop the dialog and offer undo. `alerts/best-practices/avoid-displaying-alerts-for-common-undoable`
- **Yes and No buttons, or OK on a destructive alert:** name the action with a verb. `alerts/buttons/create-succinct-logical-button-titles` `alerts/buttons/avoid-using-ok-as-the-default`
- **Stacking modal views or popovers:** show one at a time. `sheets/best-practices/display-only-one-sheet-at-a` `popovers/best-practices/show-one-popover-at-a-time` `modality/best-practices/let-people-dismiss-a-modal-view`
- **Context menu as the only route to a command:** also offer it elsewhere. `context-menus/best-practices/always-make-context-menu-items-available`
- **Custom edit menu or duplicate edit buttons:** use the system menu. `edit-menus/best-practices/prefer-the-system-provided-edit-menu` `edit-menus/best-practices/in-general-avoid-implementing-other-controls`

## In other media
- **Mobile (any OS) and mobile web:** [HIG] bottom sheet for scoped tasks, action-sheet style choices for deliberate actions, full-screen when a popover would be cramped. `sheets/platform-considerations/ios-ipados/include-a-grabber-in-a-resizable` `popovers/platform-considerations/ios-ipados/avoid-displaying-popovers-in-compact-views`
- **Desktop web:** [HIG transfer] modal dialogs, anchored popups and right-click menus follow the same sparing, one-at-a-time and alternate-route rules. `popovers/best-practices/show-one-popover-at-a-time` `context-menus/best-practices/always-make-context-menu-items-available`
- **Slides and card news:** [HIG none] for these components; [HIG transfer] a warning's title and tone can follow the alert copy rules. `alerts/content/write-a-title-that-clearly-and` `alerts/content/in-all-alert-copy-be-direct`

## Not settled by the HIG
Treat these as [HIG none]: say the HIG is silent and ask the user, instead of guessing.
- **Action sheet or alert on macOS, tvOS and watchOS:** the "action sheet, not an alert" rule is stated only for iOS and iPadOS. One case is settled by example: the alerts page uses an Empty Trash alert confirmed with Return.
- **Action sheet or popover on iPad:** no rule chooses between them.
- **When a popover should become a sheet:** the HIG says to switch in compact views but gives no width threshold.
- **Menu or context menu on desktop and visionOS:** the only guidance is that a context menu is a shortcut and its commands must also be reachable elsewhere.
- **Context menu or edit menu outside iOS and iPadOS:** the "use one, not both" guidance is stated only for those platforms.
- **Sheet or popover for a scoped task on macOS:** no criterion beyond using a popover for a few related tasks tied to a control.
- **Destructive style in an iOS action sheet that confirms a deliberate action (such as Empty Trash):** the alerts page says a deliberately chosen destructive action needs no destructive style `alerts/buttons/use-the-destructive-style-to-identify`, while the action sheets page asks for it on destructive choices `action-sheets/best-practices/make-destructive-choices-visually-prominent`. Default to the action sheets rule (the component in use), state the alerts example, and let the owner decide. [HIG none]
