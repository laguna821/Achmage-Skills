# Icons: open icons with a unified Apple-style spec

House decision: never use SF Symbols in any deliverable, including native Apple apps. Use Lucide (ISC license, lucide-static 1.67.0, 2,296 icons) as the base set, and make every icon, imported or newly drawn, pass the spec below. The HIG asks for consistency in size, level of detail, stroke weight and perspective, not for a particular icon library.

## Spec (every icon must pass)

| # | Rule | Basis |
| --- | --- | --- |
| 1 | Keep size, level of detail, stroke weight and perspective consistent within a deliverable. Do not mix sets; draw missing icons to the same spec. | [HIG] Icons: visual consistency |
| 2 | Match stroke weight to the adjacent text weight. Starting values on the 24 px grid: Pretendard 300 = 1.5, 400 = 1.75, 500 = 2, 600 = 2.25, 700 = 2.5 (calibrate by rendering). | [HIG] match icon and text weights + [House] values |
| 3 | Scale meaningful icons with the text they accompany; size icons in em relative to that text. | [HIG] Typography |
| 4 | Keep icons recognizable and highly simplified. | [HIG] Icons |
| 5 | Add padding to asymmetric icons so they look centered. | [HIG] Icons: optical alignment |
| 6 | Make a filled selected-state variant only when needed, by filling the same outline. | [HIG] Icons: selected state only if necessary |
| 7 | Use the HIG standard metaphor for standard actions (table below). | [HIG] Icons > Standard icons, Buttons |
| 8 | Put text inside an icon only when it is essential; prefer a short text label when it is clearer than an icon. | [HIG] Icons, Buttons |
| 9 | Give every icon an accessibility label. | [HIG] Icons |
| 10 | Never imitate Apple hardware; never use emoji in place of an icon. | [HIG] Icons, Home Screen quick actions |
| 11 | For right-to-left languages, flip icons that show direction or reading order; do not flip real-world objects. | [HIG] Right to left |
| 12 | Default to one color; for hierarchy, lower the opacity of secondary strokes; use color only with a clear purpose. | [HIG transfer] SF Symbols rendering modes, [HIG] Color |
| 13 | Animate icons only with a clear purpose, and sparingly. | [HIG transfer] SF Symbols animations |
| 14 | Check icons in light and dark appearances. | [HIG] Dark Mode |
| 15 | Deliver SVG with viewBox 0 0 24 24, currentColor, round line caps and joins. | [HIG] vector formats + [House] |

Conflict to disclose: the HIG prefers SF Symbols in several places (tab bars, toolbars, widgets, Dark Mode). Follow the house rule and note the difference in the rationale.

## Standard actions mapped to Lucide

From the HIG standard icons tables (53 actions). Match: direct = same metaphor, partial = same meaning but different drawing, create = draw a new icon to the spec (the Lucide name is the fallback).

| Group | Action | SF Symbol (reference only) | Lucide | Match | Note |
| --- | --- | --- | --- | --- | --- |
| Editing | Cut | `scissors` | `scissors` | direct |  |
| Editing | Copy | `document.on.document` | `files` | direct | Lucide `copy` (two squares) is a different metaphor |
| Editing | Paste | `document.on.clipboard` | `clipboard-paste` | partial | HIG shows a document on a clipboard; candidate for a custom icon |
| Editing | Done | `checkmark` | `check` | direct |  |
| Editing | Save | `checkmark` | `check` | direct |  |
| Editing | Cancel | `xmark` | `x` | direct |  |
| Editing | Close | `xmark` | `x` | direct |  |
| Editing | Delete | `trash` | `trash-2` | direct |  |
| Editing | Undo | `arrow.uturn.backward` | `undo-2` | direct |  |
| Editing | Redo | `arrow.uturn.forward` | `redo-2` | direct |  |
| Editing | Compose | `square.and.pencil` | `square-pen` | direct |  |
| Editing | Duplicate | `plus.square.on.square` | `copy-plus` | direct |  |
| Editing | Rename | `pencil` | `pencil` | direct |  |
| Editing | Move to | `folder` | `folder` | direct |  |
| Editing | Folder | `folder` | `folder` | direct |  |
| Editing | Attach | `paperclip` | `paperclip` | direct |  |
| Editing | Add | `plus` | `plus` | direct |  |
| Editing | More | `ellipsis` | `ellipsis` | direct |  |
| Selection | Select | `checkmark.circle` | `circle-check` | direct |  |
| Selection | Deselect | `xmark` | `x` | direct |  |
| Selection | Close | `xmark` | `x` | direct |  |
| Selection | Delete | `trash` | `trash-2` | direct |  |
| Text formatting | Superscript | `textformat.superscript` | `superscript` | partial | HIG uses the letter A with a raised 1; Lucide uses x² |
| Text formatting | Subscript | `textformat.subscript` | `subscript` | partial | HIG uses the letter A with a lowered 1; Lucide uses x₂ |
| Text formatting | Bold | `bold` | `bold` | direct |  |
| Text formatting | Italic | `italic` | `italic` | direct |  |
| Text formatting | Underline | `underline` | `underline` | direct |  |
| Text formatting | Align Left | `text.alignleft` | `text-align-start` | direct |  |
| Text formatting | Center | `text.aligncenter` | `text-align-center` | direct |  |
| Text formatting | Justified | `text.justify` | `text-align-justify` | direct |  |
| Text formatting | Align Right | `text.alignright` | `text-align-end` | direct |  |
| Search | Search | `magnifyingglass` | `search` | direct |  |
| Search | Find | `text.page.badge.magnifyingglass` | `file-search-2` | direct |  |
| Search | Find and Replace | `text.page.badge.magnifyingglass` | `file-search-2` | direct |  |
| Search | Find Next | `text.page.badge.magnifyingglass` | `file-search-2` | direct |  |
| Search | Find Previous | `text.page.badge.magnifyingglass` | `file-search-2` | direct |  |
| Search | Use Selection for Find | `text.page.badge.magnifyingglass` | `file-search-2` | direct |  |
| Search | Filter | `line.3.horizontal.decrease` | `list-filter` | direct | Lucide `funnel` is a different metaphor |
| Sharing and exporting | Share | `square.and.arrow.up` | `share` | direct | Lucide `share-2` (connected nodes) is a different metaphor |
| Sharing and exporting | Export | `square.and.arrow.up` | `share` | direct | Lucide `share-2` (connected nodes) is a different metaphor |
| Sharing and exporting | Print | `printer` | `printer` | direct |  |
| Users and accounts | Account | `person.crop.circle` | `circle-user-round` | direct |  |
| Users and accounts | User | `person.crop.circle` | `circle-user-round` | direct |  |
| Users and accounts | Profile | `person.crop.circle` | `circle-user-round` | direct |  |
| Ratings | Dislike | `hand.thumbsdown` | `thumbs-down` | direct |  |
| Ratings | Like | `hand.thumbsup` | `thumbs-up` | direct |  |
| Layer ordering | Bring to Front | `square.3.layers.3d.top.filled` | `layers` | create | needs a three-layer stack with the top layer filled; `layers` is the fallback |
| Layer ordering | Send to Back | `square.3.layers.3d.bottom.filled` | `layers` | create | needs a three-layer stack with the bottom layer filled; `layers` is the fallback |
| Layer ordering | Bring Forward | `square.2.layers.3d.top.filled` | `layers-2` | create | needs a two-layer stack with the top layer filled; `layers-2` is the fallback |
| Layer ordering | Send Backward | `square.2.layers.3d.bottom.filled` | `layers-2` | create | needs a two-layer stack with the bottom layer filled; `layers-2` is the fallback |
| Other | Alarm | `alarm` | `alarm-clock` | direct |  |
| Other | Archive | `archivebox` | `archive` | direct |  |
| Other | Calendar | `calendar` | `calendar` | direct |  |

## Creating a new icon

1. Look first in the standard actions table and in Lucide (system first).
2. If nothing fits, draw an SVG to the spec: 24 px grid, round caps and joins, the same corner radius and padding as Lucide; combine Lucide parts where possible.
3. Render it at 16, 20 and 24 px next to Pretendard text and check weight, optical centering, simplicity, and light and dark appearances.
4. Record its meaning, accessibility label and any Lucide source. Keep the ISC notice when modifying a Lucide icon.

## Using Lucide

- Web: `lucide-static` SVG files or the `lucide` packages; set `stroke-width` from rule 2 and `color` from the surrounding text.
- License: ISC; keep the copyright notice when you redistribute icon files.
