---
slug: ornaments
title: "Ornaments"
kind: component
group: "Menus and actions"
platforms: [visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/ornaments
---

# Ornaments

**In one line:** A visionOS element attached to the edge of a window that holds frequently needed controls or information outside the window's content.

## Why it exists
A window's content can fill up fast. An ornament keeps key controls beside the window, so people always know where to find them without crowding the content `ornaments/best-practices/consider-using-an-ornament-to-present`. Each ornament also adds visual weight, so use them with restraint `ornaments/best-practices/if-you-need-to-display-multiple`.

## Use it when
- Controls or information are needed often and should stay next to the window `ornaments/best-practices/consider-using-an-ornament-to-present`
- You need a toolbar or tab bar: the system's versions already present as ornaments `ornaments/best-practices/use-system-provided-toolbars-and-tab`

## Don't use it when
- Several ornaments would unbalance the window or distract from content: limit the number and move elements back into the window `ornaments/best-practices/if-you-need-to-display-multiple`
- A system toolbar or tab bar already does the job: use [Toolbars](toolbars.md) instead of building a custom one `ornaments/best-practices/use-system-provided-toolbars-and-tab`
- Immersive content such as video or photos is showing: hide the ornament only then, otherwise keep it visible `ornaments/best-practices/in-general-keep-an-ornament-visible`

## Cost to the user
Ornaments take space around the window and can distract or make an app feel more complicated if too many are used `ornaments/best-practices/if-you-need-to-display-multiple`.

## Principles at stake
- **Familiarity:** steady location and system toolbars and tab bars `ornaments/best-practices/in-general-keep-an-ornament-visible` `ornaments/best-practices/use-system-provided-toolbars-and-tab`
- **Simplicity:** few ornaments, borderless buttons on glass `ornaments/best-practices/if-you-need-to-display-multiple` `ornaments/best-practices/consider-using-borderless-buttons-in-an`
- **Craft:** balanced, no wider than the window `ornaments/best-practices/aim-to-keep-an-ornaments-width`

## Key rules
- Place frequently needed controls or info in an ornament attached to the window `ornaments/best-practices/consider-using-an-ornament-to-present`
- Keep it visible, hiding only during immersive content `ornaments/best-practices/in-general-keep-an-ornament-visible`
- With multiple ornaments, balance the window, limit the total, and fold elements back into the window if one is removed `ornaments/best-practices/if-you-need-to-display-multiple`
- Make an ornament no wider than its window, so it does not collide with a side tab bar `ornaments/best-practices/aim-to-keep-an-ornaments-width`
- Consider borderless buttons, since the glass background makes borders unnecessary `ornaments/best-practices/consider-using-borderless-buttons-in-an`
- Use built-in toolbars and tab bars unless you need custom components `ornaments/best-practices/use-system-provided-toolbars-and-tab`

## Platform differences
- **visionOS:** the only supported platform.
- **Not available on:** iOS, iPadOS, macOS, tvOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG none]; the bundle tags only a loose transfer for mobile `ornaments/best-practices/consider-using-an-ornament-to-present`
- **Desktop web:** [HIG none]
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Toolbars](toolbars.md) · [Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
