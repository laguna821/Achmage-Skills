---
version: alpha
name: SURGE GT-e — Kinetic Premium EV
description: Motion-first dark automotive design system for a fictional premium EV. The interface behaves like live current — velocity-reactive, charged accent pulses, one pinned acceleration showstopper. Warm-graphite ground tempers the kinetic energy into restraint. Scaffolded by component-consulting (no prior DESIGN.md existed).

colors:
  void:        "#0A0B0C"      # warm near-black ground (never pure #000)
  void-2:      "#121417"      # raised panel surface
  carbon:      "#1C2024"      # hairline cards / dividers ground
  graphite:    "#2B3036"      # mid structural lines
  ash:         "#6E7681"      # muted secondary text
  bone:        "#E9E3D6"      # PRIMARY text — warm paper (NOT pure white, NOT cool silver)
  white-hot:   "#F6F4EF"      # reserved: headline peaks only
  charge:      "#C6F24E"      # SIGNATURE — electric lime-volt, "the current". Fires on interaction/velocity only
  charge-deep: "#7FA814"      # charge pressed / on-light state
  ember:       "#FF5A2C"      # secondary HEAT accent — brake/regen/thermal moments ONLY
  signal:      "#1F6FEB"      # rare telemetry blue — <3 uses total, never a gradient

typography:
  display-mega:
    fontFamily: '"Anton", sans-serif'
    fontSize: clamp(56px, 13vw, 220px)
    fontWeight: 400
    lineHeight: 0.84
    letterSpacing: -0.02em
  display-serif:
    fontFamily: '"Fraunces", Georgia, serif'
    fontSize: clamp(40px, 8vw, 140px)
    fontWeight: 340
    lineHeight: 0.94
    letterSpacing: -0.02em
    fontVariation: "'opsz' 144, 'WONK' 1"
  display-var:
    fontFamily: '"Roboto Flex", sans-serif'
    fontSize: clamp(32px, 6vw, 90px)
    fontWeight: 1000
    lineHeight: 0.92
    letterSpacing: -0.03em
    fontVariation: "'wght' 1000, 'wdth' 151"
  eyebrow:
    fontFamily: '"JetBrains Mono", monospace'
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.28em
    textTransform: uppercase
  body:
    fontFamily: '"Roboto Flex", sans-serif'
    fontSize: clamp(16px, 1.15vw, 19px)
    fontWeight: 380
    lineHeight: 1.6
  data:
    fontFamily: '"JetBrains Mono", monospace'
    fontSize: clamp(13px, 1vw, 15px)
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.04em
    fontFeature: '"tnum" 1, "zero" 1'

spacing:
  unit: 8px
  gutter: 24px
  edge: clamp(20px, 4vw, 72px)
  section: clamp(120px, 16vh, 240px)

rounded:
  none: 0px
  sm: 2px
  pill: 999px
  full: 50%

components:
  nav:
    background: transparent
    borderBottom: "1px solid {colors.carbon}"
    color: "{colors.bone}"
    mixBlendMode: difference
  cta-magnetic:
    background: "{colors.charge}"
    color: "{colors.void}"
    borderRadius: "{rounded.pill}"
    fontFamily: "{typography.eyebrow.fontFamily}"
    letterSpacing: 0.18em
    hover: "fill sweeps L→R via clip-path + magnetic-follow"
    active: "scale 0.96 + {colors.charge-deep}"
  spec-readout:
    background: "{colors.void-2}"
    border: "1px solid {colors.graphite}"
    borderRadius: "{rounded.sm}"
    color: "{colors.charge}"
    font: "{typography.data}"
  hotspot:
    ring: "1px solid {colors.charge}"
    pulse: "scale 1→1.8 + opacity 1→0, 2.4s loop, pauses on hover"
  cursor:
    blendMode: difference
    velocitySkew: true
---

# SURGE GT-e — DESIGN.md

> Scaffolded by `component-consulting` because the brief had **no DESIGN.md**.
> Archetype: premium-agency / automotive-cinematic. Built: `./index.html`.

## Overview
Charged tension + forward thrust, **held composed**. The page should feel like standing beside an awake powertrain — mostly silent warm-dark, energy that is **kinetic, not luminous**.

## Colors
Warm near-black `void`; **bone/paper text — never white, never cool-silver** (the warmth is the anti-cliché against the cold purple-blue "tech" floor). One signature `charge` lime that behaves like current — it fires on interaction and scroll velocity, **never ambient glow**. `ember` for heat moments only; `signal` blue rationed to <3 uses.

## Typography
Three deliberately-mismatched voices in tension: **Anton** (hyper-condensed kinetic display), **Fraunces** (light optical serif — the *calm* counterweight), **Roboto Flex** (variable `wght`/`wdth` animate on scroll velocity), **JetBrains Mono** (telemetry). Type power = scale + weight-axis animation + mono/serif contrast. **Never gradient-clip.**

## Layout
Asymmetric, instrument-panel logic. Headlines bleed off the left edge; telemetry pins right. The hero act is **horizontal**; everything else vertical. Enormous `section` air so each act shouts alone.

## Elevation & Depth
Depth from **parallax z-layers + motion only**. No shadows, no glass blur. Cinematic (planes), not material (cards on shadows).

## Shapes
Hard machined edges (`rounded.none`). The only curves: the pill CTA and the circular speedo dial.

## Components
Magnetic CTA (real states), spec-readout chips, pulsing hotspots, velocity-skew cursor, scroll-tied speedometer SVG, hairline rules.

## Do's and Don'ts
- **Do** ration lime to interaction/velocity peaks; keep type power in scale/weight/mono-serif contrast; honor `prefers-reduced-motion`.
- **Don't** render a 3/4 glow hero; use purple→blue gradients / glass / ambient glow; add decorative side-stripes; or animate without the current/acceleration meaning.
