# 04 — Card Runtime CSS

The 1080×1440 card skeleton + the kept filter classes. **Copy this whole block into `cardnews-proof.html`'s `<style>`**, then set one preset's `:root` (from `03`) above it. This is the tool-safe version — no `backdrop-filter`, image kept visible at `brightness(.74)` (from raw5-deck's authoritative `.mcard`, not the raw S-01 snippet).

## Skeleton

```css
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css');
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --font:'Pretendard Variable',Pretendard,'Apple SD Gothic Neo','Noto Sans KR',system-ui,sans-serif;
  /* --card-text / --accent / --lut / tone vars come from the chosen preset (03) */
}
html,body{height:100%;margin:0}
body{background:#0b0b0c;font-family:var(--font);letter-spacing:-.02em;-webkit-font-smoothing:antialiased}

/* proof view = one-card-per-screen viewer (see "Responsive viewer" below); export slices each .card into its own 1080×1440 doc */
.deck{height:100vh;height:100dvh;overflow-y:auto;scroll-snap-type:y mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.deck::-webkit-scrollbar{width:0;height:0}
.slide{height:100vh;height:100dvh;display:flex;align-items:center;justify-content:center;scroll-snap-align:center;scroll-snap-stop:always}
.frame{position:relative;width:min(100vw,1080px,75dvh);aspect-ratio:3/4;overflow:hidden;background:#0b0b0c;box-shadow:0 8px 40px rgba(0,0,0,.5)}
.frame>.card{position:absolute;top:0;left:0;transform-origin:top left;transform:scale(var(--s,1))}

/* ONE card */
.card{position:relative;width:1080px;height:1440px;overflow:hidden;isolation:isolate;
  color:var(--card-text,#fff);background:#0b0b0c}

/* layer 1 — the photo (bound via style="--card-img:url('cards/cardNN.png')") */
.card-img{position:absolute;inset:0;z-index:-2;background-image:var(--card-img);
  background-size:cover;background-position:center;filter:var(--lut,none)}

/* layer 3 — content (layer 2 = the fx-* scrim, injected by the modifier class) */
.card-body{position:relative;z-index:2;width:100%;height:100%;
  padding:140px 84px 190px;display:flex;flex-direction:column}
.card-foot{position:absolute;left:84px;right:84px;bottom:84px;z-index:2;
  display:flex;justify-content:space-between;align-items:center;
  font-size:22px;font-weight:600;letter-spacing:.02em;opacity:.8}
.card-foot .pg{font-weight:800;color:var(--accent)}
```

`padding:140px …190px` + `foot bottom:84px` keeps the **safe zone 상하 ~135px** clear of Instagram's grid crop.

## Filter classes (pick ONE per card)

```css
/* — A: material image window (photo visible + dark scrim) — the workhorse */
.fx-material .card-img{filter:var(--lut) brightness(.74) saturate(.96) contrast(1.08);transform:scale(1.03)}
.fx-material::after{content:"";position:absolute;inset:0;z-index:-1;
  background:radial-gradient(circle at 22% 12%,rgba(255,255,255,.10),transparent 30%),
    linear-gradient(180deg,rgba(6,9,14,.10) 0%,rgba(6,9,14,.44) 48%,rgba(6,9,14,.86) 100%)}

/* — A: dark tone (heavier, for strong statements) */
.fx-tone-dark::after{content:"";position:absolute;inset:0;z-index:-1;
  background:linear-gradient(160deg,rgba(6,9,14,.55),rgba(6,9,14,.92))}

/* — A/any cover: blend-if (white type straight on photo) */
.fx-blendif .card-img{filter:var(--lut) contrast(1.12) brightness(.9)}
.fx-blendif::after{content:"";position:absolute;inset:0;z-index:-1;
  background:linear-gradient(180deg,rgba(4,5,6,.60),rgba(4,5,6,.20) 42%,rgba(4,5,6,.72))}

/* — A/any cover: halftone poster (uses --accent-mult) */
.fx-halftone::before{content:"";position:absolute;inset:0;z-index:-1;mix-blend-mode:multiply;
  background:linear-gradient(120deg,var(--accent-mult,rgba(232,73,42,.55)),rgba(17,16,14,.82))}
.fx-halftone::after{content:"";position:absolute;inset:0;z-index:0;opacity:.4;pointer-events:none;mix-blend-mode:multiply;
  background-image:radial-gradient(circle,rgba(17,16,14,.75) 1.3px,transparent 1.8px);background-size:10px 10px}

/* — A/closing: paper grain */
.fx-paper::before{content:"";position:absolute;inset:0;z-index:-1;
  background:linear-gradient(180deg,rgba(8,8,8,.35),rgba(8,8,8,.82))}
.fx-paper::after{content:"";position:absolute;inset:0;z-index:0;opacity:.12;pointer-events:none;mix-blend-mode:multiply;
  background-image:radial-gradient(rgba(17,16,14,.6) 1px,transparent 1px);background-size:4px 4px}

/* — B: brand tone (multiply, uses --tone-a/-b) */
.fx-tone::after{content:"";position:absolute;inset:0;z-index:-1;mix-blend-mode:multiply;
  background:linear-gradient(150deg,var(--tone-a,rgba(19,54,109,.78)),var(--tone-b,rgba(9,20,40,.88)))}

/* — B: blend fade to text zone (bottom) */
.fx-blend::after{content:"";position:absolute;inset:0;z-index:-1;
  background:linear-gradient(180deg,rgba(0,0,0,0) 30%,var(--blend-fade,rgba(9,20,40,.72)) 78%,var(--blend-fade-end,rgba(9,20,40,.98)) 100%)}

/* — C: light wash (blurred low-opacity photo behind a light panel; text is ink) */
.fx-wash .card-img{filter:var(--lut) blur(10px) saturate(.85);opacity:.5;transform:scale(1.06)}
.fx-wash::after{content:"";position:absolute;inset:0;z-index:-1;background:rgba(250,249,246,.72)}

/* — C: luma mask (photo up top, fades into a light text zone below; text is ink) */
.fx-luma .card-img{-webkit-mask-image:linear-gradient(180deg,#000 0%,rgba(0,0,0,.9) 42%,transparent 78%);
  mask-image:linear-gradient(180deg,#000 0%,rgba(0,0,0,.9) 42%,transparent 78%)}
.fx-luma::after{content:"";position:absolute;inset:0;z-index:-1;
  background:linear-gradient(180deg,rgba(250,249,246,0) 40%,rgba(250,249,246,.9) 76%,var(--paper,#faf9f6) 100%)}
```

## Type scale (portrait, tuned for 1440)

```css
.eyebrow{font-size:24px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;opacity:.82}
.kicker{font-size:28px;font-weight:600;opacity:.9;margin-bottom:14px}
.headline{font-size:88px;font-weight:900;line-height:1.03;letter-spacing:-.035em}
.headline .thin{font-weight:200}
.headline em{font-style:normal;color:var(--accent)}
.big-num{font-size:300px;font-weight:900;line-height:.84;letter-spacing:-.04em;color:var(--accent)}
.sub{font-size:34px;font-weight:400;line-height:1.6;opacity:.92;margin-top:26px}
.sub b{font-weight:800}
.body{font-size:32px;font-weight:400;line-height:1.62;opacity:.92}
.tag{font-size:22px;font-weight:800;letter-spacing:.3em;text-transform:uppercase;color:var(--accent)}
.push{margin-top:auto}   /* push a block to the bottom third */
```

- One line per size/weight — **never 3 identical-style lines in a row** (consulting-chart rule). Contrast heavy vs thin, ink vs accent.

## Layout patterns (put these in `.card-body`)

```html
<!-- COVER: eyebrow top, big headline bottom third -->
<section class="card fx-blendif" style="--card-img:url('cards/card01.png')">
  <div class="card-img"></div>
  <div class="card-body">
    <div class="eyebrow">시리즈 라벨</div>
    <div class="push">
      <h1 class="headline">멈추게 하는<br><em>한 줄</em></h1>
      <p class="sub">한 문장 부제</p>
    </div>
  </div>
  <div class="card-foot"><span>SERIES NAME</span><span class="pg">01</span></div>
</section>

<!-- POINT: eyebrow + headline top, body below -->
<section class="card fx-material" style="--card-img:url('cards/card02.png')">
  <div class="card-img"></div>
  <div class="card-body">
    <div class="eyebrow">POINT 01</div>
    <h2 class="headline" style="font-size:64px;margin-top:18px">주장 <em>한 줄</em></h2>
    <p class="body push">설명 두세 문장. 핵심어는 <b>굵게</b>.</p>
  </div>
  <div class="card-foot"><span>@handle</span><span class="pg">02</span></div>
</section>

<!-- DATA: metric-window = fx-material + inline SVG (chart is HTML/SVG, never baked in the photo) -->
<section class="card fx-material" style="--card-img:url('cards/card04.png')">
  <div class="card-img"></div>
  <div class="card-body">
    <div class="eyebrow">DATA</div>
    <div class="big-num">72%</div>
    <p class="sub">한 줄 해석</p>
    <svg class="push" viewBox="0 0 900 220" style="width:100%;height:220px">
      <rect x="0" y="150" width="640" height="16" rx="8" fill="var(--accent)"/>
      <rect x="0" y="184" width="360" height="16" rx="8" fill="rgba(255,255,255,.35)"/>
    </svg>
  </div>
  <div class="card-foot"><span>@handle</span><span class="pg">04</span></div>
</section>
```

## Forbidden-pattern guard (paste into the `<style>`)

```css
#toc,.toc,.slide-index,.page-list,.dots{display:none!important}
/* no backdrop-filter anywhere — it hangs headless capture */
```

## Responsive viewer (mobile HTML link)

The proof is **also the shareable product** — host the folder (GitHub Pages / any static host) and send the link. So it must behave like a phone card viewer: **one full card per screen, swipe/scroll snaps to the next** — no zooming, no free-scroll. The trick (raw5-deck's fit-scale, per card): keep each card a fixed 1080×1440 box, size a `.frame` to fit the screen, and scale the card by `frameWidth / 1080`. Layout/fonts never reflow — the whole card just shrinks.

Three required pieces:

1. **`<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`** in `<head>` — without it, mobile renders at ~980px and nothing fits. This is the #1 cause of "I had to zoom out."
2. Nest each card `.deck > .slide > .frame > section.card`: `.deck` = the snap scroller (`height:100dvh; overflow-y:auto; scroll-snap-type:y mandatory`, scrollbar hidden); `.slide` = a full-screen section that centers the card (`height:100dvh; display:flex; align-items:center; scroll-snap-align:center; scroll-snap-stop:always` → exactly one card per swipe); `.frame` = the card box sized to fit the screen: `width:min(100vw,1080px,75dvh)` + `aspect-ratio:3/4` (a whole 3:4 card fits by width on tall phones, by height on wide screens).
3. The fit script sets each card's `--s`:

```html
<div class="deck">
  <div class="slide"><div class="frame"><section class="card fx-blendif" style="--card-img:url('cards/card01.png')"> … </section></div></div>
  <div class="slide"><div class="frame"><section class="card fx-material" style="--card-img:url('cards/card02.png')"> … </section></div></div>
  …
</div>
<script>
(function(){
  function fit(){
    var f=document.querySelectorAll('.frame');
    for(var i=0;i<f.length;i++){ var c=f[i].firstElementChild; if(c) c.style.setProperty('--s', f[i].clientWidth/1080); }
  }
  window.addEventListener('resize',fit); window.addEventListener('orientationchange',fit);
  window.addEventListener('load',fit); fit();
})();
</script>
```

On a tall phone the 3:4 card is width-limited and centered with dark letterbox top/bottom (blends into the dark bg → reads as intentional); on wide screens it's height-limited. Hosting note: self-contained except the Pretendard CDN `@import` (fine online); upload `cards/` alongside the HTML so `url('cards/…')` resolves.

## Export contract (how `.card` becomes a PNG)

Each `<section class="card" …>` is self-sufficient: all its styling is class-based and its photo is bound inline via `--card-img`. `export-cards.ps1` (`05`) wraps a single card's markup in a minimal doc — same `<style>`, `body{width:1080px;height:1440px;overflow:hidden}` — and screenshots it at `1080×1440`. **The export doc contains no `.slide`/`.frame` wrapper and no `<script>`**, so `.frame>.card` (the absolute + scale rule) never matches → the card renders at native 1080×1440, unaffected by the responsive viewer. So: **keep every card's look expressible from classes + the one inline `--card-img`.** Don't rely on the `.deck`/`.slide`/`.frame` wrapper or sibling order for any card's appearance.
