---
slug: path-controls
title: "Path controls"
kind: component
group: "Navigation and search"
platforms: [macOS]
source: https://developer.apple.com/design/human-interface-guidelines/path-controls
---

# Path controls

**In one line:** A macOS control that shows the file system location of an item as a path.

## Why it exists
People working with files need to see where an item lives. A path control shows that location, in a familiar place inside the window body, as Finder does `path-controls/best-practices/use-a-path-control-in-the`.

## Use it when
- A Mac app needs to show the location of a file or folder (for broader file handling see [File management](https://developer.apple.com/design/human-interface-guidelines/file-management)) `path-controls/best-practices/use-a-path-control-in-the`

## Don't use it when
- You would place it in a toolbar or status bar: put it in the window's body area instead `path-controls/best-practices/use-a-path-control-in-the`

## Cost to the user
The HIG gives little here: it takes a small strip of space in the window body. [HIG none] for further attention or flow effects.

## Principles at stake
- **Familiarity:** it sits in the window body, where people expect to find it `path-controls/best-practices/use-a-path-control-in-the`

## Key rules
- Place a path control inside the window's body area, never in a toolbar or status bar `path-controls/best-practices/use-a-path-control-in-the`

## Platform differences
- **macOS:** the only supported platform.
- **Not available on:** iOS, iPadOS, tvOS, visionOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG none]
- **Desktop web:** [HIG transfer] a breadcrumb-like location display belongs in the content area, not in toolbar chrome `path-controls/best-practices/use-a-path-control-in-the`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Toolbars](toolbars.md) · [File management](https://developer.apple.com/design/human-interface-guidelines/file-management)
