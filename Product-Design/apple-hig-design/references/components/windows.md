---
slug: windows
title: "Windows"
kind: component
group: "Presentation"
platforms: [iPadOS, macOS, visionOS]
source: https://developer.apple.com/design/human-interface-guidelines/windows
---

# Windows

**In one line:** The frame that holds an app's views and components, which people can resize, move and open in multiples.

## Why it exists
Windows let people arrange work to suit themselves, side by side with other apps or other windows. Using the system's own windows keeps behavior familiar and spares you from rebuilding controls `windows/best-practices/avoid-creating-custom-window-ui`. A window should adapt to any size so multitasking works `windows/best-practices/make-sure-that-your-windows-adapt`. Flexibility and Familiarity.

## Use it when
- An extra window helps, such as viewing a new message beside an existing one `windows/best-practices/choose-the-right-moment-to-open`
- People may want an explicit way to open content in a new window `windows/best-practices/consider-providing-the-option-to-view`
- On visionOS, the task is a familiar interface; use volumes for bounded 3D content `windows/platform-considerations/visionos/visionos-windows/prefer-using-a-window-to-present`

## Don't use it when
- Opening a window would be the default behavior: avoid it, and open one only when it helps `windows/best-practices/choose-the-right-moment-to-open`
- Rich 3D content is the main point on visionOS: use a volume (no card in this set; see the visionOS page) `windows/platform-considerations/visionos/visionos-volumes/prefer-using-a-volume-to-display`
- You are on iOS, tvOS or watchOS: not available (no HIG alternative named)

## Cost to the user
Extra windows add arrangement work and clutter, so open them by request, not by default `windows/best-practices/choose-the-right-moment-to-open`.

## Principles at stake
- **Flexibility:** adaptive sizing across multitasking `windows/best-practices/make-sure-that-your-windows-adapt`
- **Familiarity:** system windows, the word "window" in text `windows/best-practices/avoid-creating-custom-window-ui` `windows/best-practices/use-the-term-window-in-user`
- **Agency:** an explicit command to open a new window `windows/best-practices/consider-providing-the-option-to-view`

## Key rules
- Design windows to adapt smoothly to different sizes `windows/best-practices/make-sure-that-your-windows-adapt`
- Open new windows only at the right moment `windows/best-practices/choose-the-right-moment-to-open`
- Offer an explicit command (context menu or File menu) for a new window `windows/best-practices/consider-providing-the-option-to-view`
- Rely on system windows; do not build custom frames or imitate them `windows/best-practices/avoid-creating-custom-window-ui`
- Say "window" in user-facing text, not "scene" `windows/best-practices/use-the-term-window-in-user`
- On macOS, keep crucial actions out of the bottom bar; use an inspector for more `windows/platform-considerations/macos/macos-window-states/avoid-putting-critical-information-or-actions`
- On visionOS, keep the glass background `windows/platform-considerations/visionos/visionos-windows/retain-the-windows-glass-background`
- On visionOS, set an opening size with little unused space, a shape matching the content, and tested minimum and maximum sizes `windows/platform-considerations/visionos/visionos-windows/choose-an-initial-window-size-that` `windows/platform-considerations/visionos/visionos-windows/aim-for-an-initial-shape-that` `windows/platform-considerations/visionos/visionos-windows/choose-a-minimum-and-maximum-size`

## Platform differences
- **iPadOS:** shift leading toolbar buttons inward when window controls appear; consider a pinch gesture to open an item in its own window `windows/platform-considerations/ipados/make-sure-window-controls-dont-overlap` `windows/platform-considerations/ipados/consider-letting-people-use-a-gesture`
- **macOS:** custom windows must follow the system appearance for each window state; avoid critical items in the bottom bar `windows/platform-considerations/macos/macos-window-states/make-sure-custom-windows-use-the`
- **visionOS windows:** keep 3D content shallow `windows/platform-considerations/visionos/visionos-windows/minimize-the-depth-of-3d-content`
- **visionOS volumes:** place 2D content to read from any angle, usually dynamic scaling (fixed for real-world objects), use the baseplate glow, consider one ornament on a different edge from the toolbar or tab bar, and choose alignment by use `windows/platform-considerations/visionos/visionos-volumes/place-2d-content-so-it-looks` `windows/platform-considerations/visionos/visionos-volumes/in-general-use-dynamic-scaling` `windows/platform-considerations/visionos/visionos-volumes/take-advantage-of-the-default-baseplate` `windows/platform-considerations/visionos/visionos-volumes/consider-offering-high-value-content-in` `windows/platform-considerations/visionos/visionos-volumes/choose-an-alignment-that-supports-the`
- **Not available on:** iOS, tvOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG none] iPhone has no windows component
- **Desktop web:** [HIG transfer] browser windows or tabs: open new ones by explicit request, adapt to any size `windows/best-practices/make-sure-that-your-windows-adapt`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Panels](panels.md) · [Sheets](sheets.md) · [Sidebars](sidebars.md)
