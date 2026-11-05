---
slug: mac-catalyst
title: "Mac Catalyst"
kind: technology
group: "Technologies"
platforms: [iPadOS, macOS]
source: https://developer.apple.com/design/human-interface-guidelines/mac-catalyst
---

# Mac Catalyst

**In one line:** A way to bring an iPad app to the Mac, which then needs layout, controls and style that feel native to Mac.

## Why it exists
Mac people expect toolbars, menus, keyboard support and resizable windows. A straight iPad port ignores that. The guidance asks you to prepare the iPad app, then reshape it for the Mac so it feels familiar there (Familiarity, Craft) `mac-catalyst/integrate-the-mac-experience/layout/as-much-as-possible-adopt-a` `mac-catalyst/choose-an-idiom/when-you-adopt-the-mac-idiom`.

## Use it when
- You have an iPad app and want a Mac version: audit the whole layout once you adopt the Mac idiom `mac-catalyst/choose-an-idiom/when-you-adopt-the-mac-idiom`
- The iPad app moves through pages by swipe: add Next and Previous buttons for Mac pointer and keyboard users `mac-catalyst/integrate-the-mac-experience/navigation/offer-multiple-ways-to-move-between`

## Don't use it when
- You are on iOS, tvOS, visionOS or watchOS: not supported
- Your appearance customizations lack a macOS equivalent: limit them to what macOS supports `mac-catalyst/choose-an-idiom/limit-your-appearance-customizations-to-standard`
- Controls sit on the side or bottom edges for thumb reach: move them, since a Mac has no such benefit `mac-catalyst/integrate-the-mac-experience/layout/relocate-buttons-from-the-side-and`

## Cost to the user
Done well, Mac people notice nothing odd. Done poorly, they meet oversized text, controls far from where Mac apps keep commands, and missing menu access `mac-catalyst/choose-an-idiom/adjust-font-sizes-as-needed` `mac-catalyst/integrate-the-mac-experience/layout/consider-moving-controls-from-the-main`.

## Principles at stake
- **Familiarity:** toolbar, menu bar, View menu and a macOS-style app icon `mac-catalyst/integrate-the-mac-experience/layout/consider-moving-controls-from-the-main` `mac-catalyst/integrate-the-mac-experience/app-icons/create-a-macos-version-of-your`
- **Flexibility:** more than one way to navigate, and text styles that adapt `mac-catalyst/integrate-the-mac-experience/navigation/offer-multiple-ways-to-move-between` `mac-catalyst/choose-an-idiom/adjust-font-sizes-as-needed`
- **Craft:** check that views and images look right at Mac size `mac-catalyst/choose-an-idiom/make-sure-views-and-images-look`

## Key rules
- Audit the full layout when you adopt the Mac idiom; consider a separate asset catalog for Mac `mac-catalyst/choose-an-idiom/when-you-adopt-the-mac-idiom`
- Use text styles, not fixed sizes, and adjust sizes for Mac `mac-catalyst/choose-an-idiom/adjust-font-sizes-as-needed`
- Check that views and images look good in the Mac build `mac-catalyst/choose-an-idiom/make-sure-views-and-images-look`
- Customize appearance only in ways macOS supports `mac-catalyst/choose-an-idiom/limit-your-appearance-customizations-to-standard`
- If iPad uses a split view or segmented control instead of a tab bar, list top-level items in the View menu `mac-catalyst/integrate-the-mac-experience/navigation/make-sure-people-retain-access-to`
- Add Next and Previous buttons beside swipe gestures `mac-catalyst/integrate-the-mac-experience/navigation/offer-multiple-ways-to-move-between`
- Provide a macOS app icon in the lifelike style Mac people expect `mac-catalyst/integrate-the-mac-experience/app-icons/create-a-macos-version-of-your`
- Move iPad main-UI controls into the Mac toolbar and list their commands in the menu bar `mac-catalyst/integrate-the-mac-experience/layout/consider-moving-controls-from-the-main`
- Put key actions and content high in the window `mac-catalyst/integrate-the-mac-experience/layout/as-much-as-possible-adopt-a`
- Move buttons off side and bottom edges `mac-catalyst/integrate-the-mac-experience/layout/relocate-buttons-from-the-side-and`

## Anatomy and content
Prepare the iPad app first. Support drag and drop, keyboard navigation and shortcuts, scaling for Split View, Slide Over and Picture in Picture, and multiple scenes (which become Mac windows); check that essentials do not depend on capabilities a Mac lacks. These are listed as preparation steps on the page, not as numbered rules.

## Platform differences
- **iPadOS, macOS:** this card is about the move between them; the guidance above covers it.
- **Not available on:** iOS, tvOS, visionOS, watchOS.

## In other media
- **Mobile (any OS) and mobile web:** [HIG none] for Catalyst itself
- **Desktop web:** [HIG transfer] when a touch layout moves to desktop web, put key actions high, move edge buttons to a toolbar, and add keyboard and pointer routes `mac-catalyst/integrate-the-mac-experience/layout/as-much-as-possible-adopt-a` `mac-catalyst/integrate-the-mac-experience/layout/relocate-buttons-from-the-side-and`
- **Slides:** [HIG none]
- **Card news:** [HIG none]

## Related
[Designing for macOS](https://developer.apple.com/design/human-interface-guidelines/designing-for-macos)
