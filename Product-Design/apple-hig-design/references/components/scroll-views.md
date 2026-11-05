---
slug: scroll-views
title: "Scroll views"
kind: component
group: "Presentation"
platforms: [iOS, iPadOS, macOS, tvOS, visionOS, watchOS]
source: https://developer.apple.com/design/human-interface-guidelines/scroll-views
---

# Scroll views

**In one line:** A container that lets people move content larger than the visible area, vertically or horizontally.

## Why it exists
Content rarely fits one screen. A scroll view lets people reach the rest with gestures and keys they already know, so it should behave the way they expect `scroll-views/best-practices/support-default-scrolling-gestures-and-keyboard`. The main design duty is to make it obvious that more content exists `scroll-views/best-practices/make-it-apparent-when-content-is`. Familiarity and Craft lead here.

## Use it when
- Content is bigger than the view and people must pan through it `scroll-views/best-practices/support-default-scrolling-gestures-and-keyboard`
- Content is a sequence that suits fixed page-by-page movement `scroll-views/best-practices/consider-supporting-page-by-page-scrolling`
- A scroll view sits behind floating controls and needs a scroll edge effect for legibility `scroll-views/scroll-edge-effects/only-use-a-scroll-edge-effect`
- Zoomable content needs sensible limits `scroll-views/best-practices/if-you-support-zoom-set-appropriate`

## Don't use it when
- Another scroll view already scrolls in the same direction: do not nest them `scroll-views/best-practices/avoid-putting-a-scroll-view-inside`
- You want a decorative edge effect: skip it, since it belongs only behind floating elements `scroll-views/scroll-edge-effects/only-use-a-scroll-edge-effect`
- Pages are discrete, ordered and few: pair with [Page controls](page-controls.md) rather than a bare scroll indicator `scroll-views/platform-considerations/ios-ipados/consider-showing-a-page-control-when`

## Cost to the user
Scrolling is low cost when it is predictable. Hidden content, nested same-direction scrolling, or custom behavior costs attention and can leave people unaware of what is off screen `scroll-views/best-practices/make-it-apparent-when-content-is` `scroll-views/best-practices/avoid-putting-a-scroll-view-inside`.

## Principles at stake
- **Familiarity:** standard gestures, shortcuts and elastic indicators `scroll-views/best-practices/support-default-scrolling-gestures-and-keyboard`
- **Craft:** partial content at the edge, page overlap, restrained edge effects `scroll-views/best-practices/consider-supporting-page-by-page-scrolling` `scroll-views/scroll-edge-effects/prefer-the-automatic-scroll-edge-effect`
- **Agency:** automatic scrolling helps only when relevant content is out of sight `scroll-views/best-practices/in-some-cases-scroll-automatically-to`

## Key rules
- Support default scrolling gestures and keyboard shortcuts `scroll-views/best-practices/support-default-scrolling-gestures-and-keyboard`
- Show that content continues, for example with a partly visible item at the edge `scroll-views/best-practices/make-it-apparent-when-content-is`
- Do not nest scroll views in the same direction; mixed directions are fine `scroll-views/best-practices/avoid-putting-a-scroll-view-inside`
- For page-by-page scrolling, overlap slightly to preserve context `scroll-views/best-practices/consider-supporting-page-by-page-scrolling`
- Scroll automatically to a search match, a hidden insertion point, or past an edge during selection `scroll-views/best-practices/in-some-cases-scroll-automatically-to`
- Set sensible minimum and maximum zoom scales `scroll-views/best-practices/if-you-support-zoom-set-appropriate`
- Prefer the automatic scroll edge effect; test the soft style for control legibility `scroll-views/scroll-edge-effects/prefer-the-automatic-scroll-edge-effect`
- Use one edge effect per view; split-view panes may each have one with matching heights `scroll-views/scroll-edge-effects/apply-one-scroll-edge-effect-per`

## Platform differences
- **iOS, iPadOS:** in paged scrolling, consider a page control and hide the scroll indicator on that axis `scroll-views/platform-considerations/ios-ipados/consider-showing-a-page-control-when`
- **macOS:** in tight panels use small or mini scroll bars and size all panel controls alike `scroll-views/platform-considerations/macos/if-necessary-use-small-or-mini`
- **visionOS:** widen tight margins for the thicker indicator; add Look to Scroll to reading and browsing views, but not to dense or control-heavy ones; keep it consistent across similar views, give it clear scroll areas, and remove parallax-style effects first `scroll-views/platform-considerations/visionos/if-necessary-account-for-the-size` `scroll-views/platform-considerations/visionos/look-to-scroll/support-look-to-scroll-for-reading` `scroll-views/platform-considerations/visionos/look-to-scroll/avoid-using-look-to-scroll-for` `scroll-views/platform-considerations/visionos/look-to-scroll/maintain-consistency-across-content` `scroll-views/platform-considerations/visionos/look-to-scroll/define-clear-scroll-areas-within-your` `scroll-views/platform-considerations/visionos/look-to-scroll/if-your-app-uses-custom-scroll`
- **watchOS:** scroll vertically with the Digital Crown; stack tab views for full-screen pages; keep pages one screen tall where possible `scroll-views/platform-considerations/watchos/prefer-vertically-scrolling-content` `scroll-views/platform-considerations/watchos/use-tab-views-to-provide-page` `scroll-views/platform-considerations/watchos/when-displaying-paged-content-consider-limiting`
- **tvOS:** no additional considerations.

## In other media
- **Mobile (any OS) and mobile web:** [HIG] standard scrolling, visible continuation and no same-direction nesting apply `scroll-views/best-practices/avoid-putting-a-scroll-view-inside`
- **Desktop web:** [HIG] same rules, plus keyboard scrolling `scroll-views/best-practices/support-default-scrolling-gestures-and-keyboard`
- **Slides:** [HIG transfer] a cut-off item at the edge hints at more content `scroll-views/best-practices/make-it-apparent-when-content-is`
- **Card news:** [HIG transfer] a partly visible next card signals a swipeable series `scroll-views/best-practices/make-it-apparent-when-content-is`

## Related
[Page controls](page-controls.md) · [Sidebars](sidebars.md) · [Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
