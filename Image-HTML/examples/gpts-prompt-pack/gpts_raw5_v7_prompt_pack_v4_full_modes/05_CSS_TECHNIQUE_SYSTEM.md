# 05_CSS_TECHNIQUE_SYSTEM.md

# CSS Technique System v4

이 문서는 V7, V8, University AX, Street Magazine Editorial의 CSS 클래스 기법을 고정한다.

---

## 0. 공통 원칙

```css
:root{
  --img1:url("...");--img2:url("...");--img3:url("...");--img4:url("...");--img5:url("...");
}
.img1{background-image:var(--img1)}
.img2{background-image:var(--img2)}
.img3{background-image:var(--img3)}
.img4{background-image:var(--img4)}
.img5{background-image:var(--img5)}
```

- 이미지 5장을 넘기지 않는다.
- 이미지는 CSS background로 쓴다.
- 텍스트·숫자·차트는 HTML/SVG로 올린다.
- 공통 카드에 `background:` shorthand를 쓰지 않는다.
- 색상은 `background-color:`로 지정한다.

---

# A. V7 Bright Report / Strategy Techniques

## V7-01 `.masked-word`

글자 안에 이미지를 넣는다.

```css
.masked-word{
  font-size:150px;line-height:.88;font-weight:950;letter-spacing:-.09em;
  color:transparent;-webkit-background-clip:text;background-clip:text;
  background-size:cover;background-position:center;filter:contrast(1.15);
}
```

```html
<div class="masked-word" style="background-image:var(--img3)">성수</div>
```

Do:

- 짧은 단어에만 쓴다.
- 굵은 폰트에 쓴다.

Don't:

- 긴 문장에 쓰지 않는다.
- 얇은 폰트에 쓰지 않는다.

---

## V7-02 `.shape-mask-scene`

이미지를 원, 아치, 사선 등 도형으로 자른다.

```css
.shape-mask-scene{position:relative;overflow:hidden;}
.mask-circle{border-radius:50%;background-size:cover;background-position:center;}
.mask-arch{clip-path:polygon(0 20%,0 100%,100% 100%,100% 20%,88% 0,12% 0);background-size:cover;}
.mask-slant{clip-path:polygon(14% 0,100% 0,86% 100%,0 100%);background-size:cover;}
```

```html
<div class="shape-mask-scene">
  <div class="mask-arch img1"></div>
  <div class="mask-circle img4"></div>
</div>
```

---

## V7-03 `.behind-image-scene`

텍스트 뒤에 이미지를 희미하게 깐다.

```css
.behind-image-scene{position:relative;overflow:hidden;}
.faint-shape{position:absolute;right:80px;top:80px;width:600px;height:420px;opacity:.16;background-size:cover;clip-path:polygon(18% 0,82% 0,100% 50%,82% 100%,18% 100%,0 50%);}
.scrim{position:absolute;inset:0;background:linear-gradient(90deg,rgba(255,255,255,.95),rgba(255,255,255,.70));}
.behind-content{position:relative;z-index:2;}
```

---

## V7-04 `.frames-scene`

이미지를 다양한 프레임 안에 넣는다.

```css
.frames-scene{position:relative;}
.frame{position:absolute;background-size:cover;background-position:center;box-shadow:0 18px 48px rgba(15,41,82,.14);}
.frame.circle{border-radius:50%;}
.frame.rounded{border-radius:24px;}
.frame.slant{clip-path:polygon(14% 0,100% 0,86% 100%,0 100%);}
```

---

## V7-05 `.wash-scene`

이미지를 흐리고 낮은 투명도로 깔아 배경 질감으로 만든다.

```css
.wash-scene{position:relative;overflow:hidden;background-size:cover;background-position:center;}
.wash-scene:before{content:"";position:absolute;inset:-24px;background:inherit;background-size:cover;background-position:center;filter:blur(12px) saturate(.85);opacity:.22;transform:scale(1.04);}
.wash-layer{position:absolute;inset:0;background:rgba(250,246,236,.70);}
.wash-layer.strong{background:rgba(250,246,236,.84);}
.wash-content{position:relative;z-index:2;padding:54px;}
```

```html
<div class="wash-scene img2"><div class="wash-layer strong"></div><div class="wash-content">...</div></div>
```

---

## V7-06 `.blend-scene`

사진과 텍스트 영역을 자연스럽게 연결한다.

```css
.blend-scene{position:relative;display:grid;grid-template-columns:1.04fr .96fr;overflow:hidden;border-radius:30px;background:#fffaf1;}
.blend-image{position:relative;background-size:cover;background-position:center;}
.blend-image:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(250,246,236,0) 0%,rgba(250,246,236,.78) 72%,#fffaf1 100%);}
.blend-content{padding:72px 66px;display:flex;flex-direction:column;justify-content:center;}
```

---

## V7-07 `.grid-scene`

12컬럼 이미지/정보 카드 그리드.

```css
.grid-scene{display:grid;grid-template-columns:repeat(12,1fr);grid-template-rows:repeat(6,1fr);gap:18px;}
.grid-panel{border-radius:24px;background-size:cover;background-position:center;position:relative;overflow:hidden;box-shadow:var(--softShadow);border:1px solid rgba(17,16,14,.12);}
.grid-panel:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.38));}
.grid-panel span{position:absolute;left:22px;bottom:18px;color:#fff;font-size:22px;font-weight:950;z-index:2;}
```

주의:

- 이미지 패널은 반드시 `.img1~.img5` 또는 inline `background-image`를 가진다.
- 공통 패널 배경은 `background-color`를 쓴다.

---

## V7-08 `.overlap-scene`

이미지 카드와 float-card를 겹쳐 깊이를 만든다.

```css
.overlap-scene{position:relative;overflow:hidden;}
.layer-card{position:absolute;background-size:cover;background-position:center;border-radius:28px;box-shadow:0 28px 70px rgba(17,16,14,.22);border:1px solid rgba(255,255,255,.55);}
.float-card{position:absolute;z-index:10;background:rgba(255,253,248,.90);border:1px solid rgba(17,16,14,.15);box-shadow:0 24px 60px rgba(17,16,14,.18);border-radius:28px;padding:32px;}
```

---

## V7-09 `.title-image-scene`

타이틀과 큰 이미지를 한 화면에 통합한다.

```css
.title-image-scene{display:grid;grid-template-columns:.82fr 1.18fr;grid-template-rows:auto 1fr;gap:28px;}
.title-image-scene .masked-word{font-size:170px;}
.hero-side-image{grid-column:1/3;height:365px;border-radius:34px;background-size:cover;background-position:center;}
```

---

## V7-10 `.tone-scene`

브랜드 톤 오버레이를 이미지 위에 얹는다.

```css
.tone-scene{position:relative;overflow:hidden;background-size:cover;background-position:center;border-radius:30px;}
.tone-scene:after{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(17,16,14,.82),rgba(232,73,42,.48));mix-blend-mode:multiply;}
.tone-scene.blue:after{background:linear-gradient(135deg,rgba(15,45,94,.82),rgba(42,104,201,.50));}
.tone-content{position:relative;z-index:2;color:#fff;padding:64px;}
```

---

## V7-11 `.collage-scene`

도형 이미지와 float-card를 섞는 편집형 콜라주.

```css
.collage-scene{position:relative;overflow:hidden;}
.collage-scene .shape{position:absolute;background-size:cover;background-position:center;}
.shape.arch{clip-path:polygon(0 22%,0 100%,100% 100%,100% 22%,88% 0,12% 0);}
.shape.circle{border-radius:50%;}
.float-card.big{position:absolute;padding:28px 30px;background:rgba(255,255,255,.84);}
```

---

# B. V8 Dark Brutalist Techniques

## V8-01 `.bg-stage`

전면 배경 엔진.

```css
.bg-stage{background:#000;color:#f7fff7;}
.bg-full{position:absolute;inset:0;background-image:var(--bg-img);background-size:cover;background-position:center;filter:saturate(.9) contrast(1.08);}
.bg-treatment{position:absolute;inset:0;pointer-events:none;}
.bg-grid{position:absolute;inset:0;opacity:.42;mix-blend-mode:screen;background-image:linear-gradient(rgba(182,255,0,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(182,255,0,.11) 1px,transparent 1px);background-size:34px 34px;}
.slide-ui{position:relative;z-index:5;}
```

```html
<section class="slide bg-stage mode-tone img3"><div class="bg-full"></div><div class="bg-treatment"></div><div class="bg-grid"></div><div class="slide-ui">...</div></section>
```

Do:

- 모든 V8 슬라이드에 같은 구조를 쓴다.
- 이미지, 필터, 그리드, 정보 레이어를 분리한다.

Don't:

- 매 슬라이드마다 완전히 다른 구조를 만들지 않는다.
- 흰색 리포트 카드를 많이 넣지 않는다.

---

## V8-02 `.mode-wash`

다크 워시 모드.

```css
.mode-wash .bg-full{filter:blur(8px) saturate(.75) contrast(1.02);opacity:.38;transform:scale(1.08);}
.mode-wash .bg-treatment{background:linear-gradient(180deg,rgba(0,0,0,.83),rgba(0,0,0,.92));}
```

---

## V8-03 `.mode-tone.neon`

다크 톤 / 네온 모드.

```css
.mode-tone .bg-treatment{background:linear-gradient(135deg,rgba(0,0,0,.92),rgba(7,30,7,.70)),radial-gradient(circle at 78% 22%,rgba(182,255,0,.26),transparent 31%);mix-blend-mode:multiply;}
.mode-tone.neon .bg-treatment{background:linear-gradient(135deg,rgba(0,0,0,.88),rgba(5,30,5,.62)),radial-gradient(circle at 72% 18%,rgba(182,255,0,.42),transparent 29%);}
```

---

## V8-04 `.mode-blend-left/right`

좌우 블렌드.

```css
.mode-blend-left .bg-treatment{background:linear-gradient(90deg,rgba(0,0,0,.18) 0%,rgba(0,0,0,.58) 42%,rgba(0,0,0,.96) 72%,rgba(0,0,0,1) 100%);}
.mode-blend-right .bg-treatment{background:linear-gradient(90deg,rgba(0,0,0,1) 0%,rgba(0,0,0,.96) 28%,rgba(0,0,0,.58) 58%,rgba(0,0,0,.18) 100%);}
```

Do:

- 글자를 어두운 쪽에 둔다.
- 사진이 좋은 쪽은 살린다.

Don't:

- 밝은 사진 영역 위에 회색 글자를 올리지 않는다.

---

## V8-05 `.grid-card` / `.brutal-card`

강한 정보 카드.

```css
.grid-card{background:rgba(10,14,10,.78);border:1px solid rgba(182,255,0,.34);box-shadow:0 22px 60px rgba(0,0,0,.46);padding:28px;border-radius:0;}
.grid-card b{color:#b6ff00;font-size:36px;font-weight:950;}
.brutal-card{background:#0b0d0b;border:2px solid #b6ff00;box-shadow:10px 10px 0 #000;color:#fff;}
```

V8 harness:

- 3~4개 기법만 반복한다.
- 디자인적 욕심을 내지 않는다.
- 큰 메시지, 짧은 본문, 강한 반복이 핵심이다.

---

# C. University AX Information Grid Techniques

## AX-01 밝은 전략 덱 쉘

```css
:root{--bg:#eef2f8;--paper:#f9fbfe;--text:#0b2345;--muted:#5f6f86;--line:#d8e2f0;--accent:#143f7d;--blue:#2b66b1;--shadow:0 20px 60px rgba(23,42,79,.12);}
.panel{background:rgba(255,255,255,.86);border:1px solid var(--line);border-radius:24px;box-shadow:var(--shadow);padding:28px;}
```

---

## AX-02 `.summary-grid`

```css
.summary-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:18px;}
.summary-grid .panel:nth-child(1){grid-column:1/5;grid-row:1/4;}
.summary-grid .panel:nth-child(2){grid-column:5/10;grid-row:1/2;}
.summary-grid .panel:nth-child(3){grid-column:10/13;grid-row:1/2;}
.summary-grid .panel:nth-child(4){grid-column:10/13;grid-row:2/3;}
.summary-grid .panel:nth-child(5){grid-column:5/13;grid-row:3/4;}
```

---

## AX-03 `.compare-grid`

```css
.compare-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:18px;}
.compare-grid .panel:nth-child(1){grid-column:1/4;}
.compare-grid .panel:nth-child(2){grid-column:4/7;}
.compare-grid .panel:nth-child(3){grid-column:7/13;grid-row:1/3;min-height:280px;}
.compare-grid .panel:nth-child(4){grid-column:1/7;}
```

---

## AX-04 `.kpi-grid`

```css
.kpi-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:18px;}
.kpi-grid .panel:nth-child(1){grid-column:1/7;grid-row:1/3;}
.kpi-grid .panel:nth-child(2){grid-column:7/13;grid-row:1/2;min-height:240px;}
.kpi-grid .panel:nth-child(3){grid-column:7/10;}
.kpi-grid .panel:nth-child(4){grid-column:10/13;}
.panel.metric{display:flex;flex-direction:column;justify-content:center;}
```

---

## AX-05 `.roadmap-grid`

```css
.roadmap-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:18px;}
.roadmap-grid .panel:nth-child(1){grid-column:1/4;}
.roadmap-grid .panel:nth-child(2){grid-column:4/7;}
.roadmap-grid .panel:nth-child(3){grid-column:7/10;}
.roadmap-grid .panel:nth-child(4){grid-column:10/13;}
.roadmap-grid .panel:nth-child(5){grid-column:1/13;min-height:250px;}
.roadmap-step span{display:inline-flex;width:44px;height:44px;border-radius:50%;background:#123d7c;color:#fff;align-items:center;justify-content:center;font-weight:900;margin-bottom:12px;}
```

---

## AX-06 `.dashboard-grid`

```css
.dashboard-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:18px;}
.dashboard-grid .panel:nth-child(1){grid-column:1/8;grid-row:1/3;min-height:360px;}
.dashboard-grid .panel:nth-child(2){grid-column:8/10;}
.dashboard-grid .panel:nth-child(3){grid-column:10/12;}
.dashboard-grid .panel:nth-child(4){grid-column:12/13;}
.dashboard-grid .panel:nth-child(5){grid-column:8/13;}
```

AX harness:

- 정보 밀도는 높이되 카드 질서가 우선이다.
- 이미지는 보조다.
- KPI와 로드맵은 HTML/SVG로 만든다.

---

# D. Street Magazine Editorial Techniques

## S-01 `.material-image-card`

어두운 이미지 창문 카드. 핵심은 유리가 아니라 **카드 속 raw 이미지가 보이는 어두운 창문**이다.

```css
.material-card-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.material-image-card{--card-img:var(--img1);position:relative;isolation:isolate;overflow:hidden;min-height:232px;padding:26px 28px;border-radius:30px;background:rgba(6,8,12,.38);color:#fff;border:1px solid rgba(255,255,255,.22);box-shadow:0 24px 64px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.18),inset 0 -1px 0 rgba(0,0,0,.50);backdrop-filter:blur(6px) saturate(1.08);}
.material-image-card::before{content:"";position:absolute;inset:-8px;z-index:-2;background-image:var(--card-img);background-size:cover;background-position:center;opacity:1;filter:brightness(.60) saturate(.94) contrast(1.18) blur(2px);transform:scale(1.035);}
.material-image-card::after{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(circle at 20% 12%,rgba(255,255,255,.18),transparent 28%),linear-gradient(180deg,rgba(5,7,10,.18) 0%,rgba(5,7,10,.46) 42%,rgba(5,7,10,.76) 100%);}
.material-image-card h3,.material-image-card p{position:relative;z-index:2;color:#fff;text-shadow:0 3px 20px rgba(0,0,0,.52);}
```

```html
<article class="material-image-card" style="--card-img:var(--img2)"><span>02</span><h3>대기 신호</h3><p>줄이 불편보다 기대를 만드는가.</p></article>
```

Don't:

- `opacity:.12`처럼 이미지가 안 보이게 만들지 않는다.
- blur를 18px 이상으로 키워 검은 카드처럼 만들지 않는다.

---

## S-02 `.luma-mask-scene`

밝기 기반 페이드.

```css
.luma-mask-scene{position:relative;overflow:hidden;border-radius:30px;background:#fffaf1;}
.luma-img{position:absolute;inset:0;background-size:cover;background-position:center;-webkit-mask-image:linear-gradient(90deg,#000 0%,rgba(0,0,0,.88) 42%,rgba(0,0,0,0) 78%);mask-image:linear-gradient(90deg,#000 0%,rgba(0,0,0,.88) 42%,rgba(0,0,0,0) 78%);}
.luma-fog{position:absolute;inset:0;background:linear-gradient(90deg,rgba(250,246,236,0),rgba(250,246,236,.86) 74%,#fffaf1 100%);}
.luma-content{position:absolute;right:72px;top:110px;width:780px;z-index:2;}
```

---

## S-03 `.blend-if-scene.cover-text`

잡지 커버형 사진 위 텍스트. 카드 없이 글자를 바로 얹는다.

```css
.blend-if-scene{position:relative;overflow:hidden;border-radius:30px;background:#070707;}
.blend-if-scene .base,.blend-if-scene .highlight-pass,.blend-if-scene .shadow-pass{position:absolute;inset:0;background-size:cover;background-position:center;}
.blend-if-scene .base{filter:grayscale(.08) contrast(1.05);}
.blend-if-scene .highlight-pass{filter:brightness(1.28) contrast(1.18) saturate(.85);mix-blend-mode:screen;opacity:.42;mask-image:linear-gradient(90deg,#000,rgba(0,0,0,.5) 48%,transparent 75%);}
.blend-if-scene .shadow-pass{filter:brightness(.72) contrast(1.25);mix-blend-mode:multiply;opacity:.28;}
.blend-if-scene.cover-text::after{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(90deg,rgba(4,5,6,.86) 0%,rgba(4,5,6,.54) 44%,rgba(4,5,6,.24) 66%,rgba(4,5,6,.58) 100%);}
.blend-if-content{position:absolute;left:72px;top:84px;width:1050px;z-index:3;color:#fff;text-shadow:0 3px 24px rgba(0,0,0,.58);}
```

Do:

- 큰 흰색 제목을 사진 위에 바로 올린다.
- text-shadow와 어두운 overlay로 구분한다.

Don't:

- 회색 글자를 사진 위에 올리지 않는다.
- 뜬금없는 불투명 카드 위에 본문을 넣지 않는다.

---

## S-04 `.surface-fx-card.metric-window`

이미지 창문 KPI 차트 카드. 반드시 실제 SVG 차트를 넣는다.

```css
.surface-demo.metric-dashboard{display:grid;grid-template-columns:1fr 1fr;gap:24px;}
.surface-fx-card.metric-window{--card-img:var(--img1);position:relative;min-height:320px;padding:28px;border-radius:30px;overflow:hidden;display:flex;flex-direction:column;background:rgba(5,7,10,.40);color:#fff;border:1px solid rgba(255,255,255,.22);box-shadow:0 28px 70px rgba(0,0,0,.32),inset 0 1px 0 rgba(255,255,255,.18),inset 0 -1px 0 rgba(0,0,0,.54);}
.surface-fx-card.metric-window::before{content:"";position:absolute;inset:-10px;background-image:var(--card-img);background-size:cover;background-position:center;opacity:1;filter:brightness(.58) saturate(.94) contrast(1.18) blur(2px);transform:scale(1.03);z-index:0;}
.surface-fx-card.metric-window::after{content:"";position:absolute;inset:0;z-index:1;background:radial-gradient(circle at 18% 8%,rgba(255,255,255,.16),transparent 28%),linear-gradient(180deg,rgba(5,7,10,.20) 0%,rgba(5,7,10,.48) 42%,rgba(5,7,10,.78) 100%);}
.surface-fx-card.metric-window>*{position:relative;z-index:2;}
.metric-chart{width:100%;height:118px;margin-top:16px;border-radius:16px;background:rgba(255,255,255,.075);border:1px solid rgba(255,255,255,.14);}
.metric-chart .axis{stroke:rgba(255,255,255,.20);stroke-width:1;}
.metric-chart .grid-line{stroke:rgba(255,255,255,.12);stroke-width:1;}
.metric-chart .accent-stroke{stroke:#ff8a68;stroke-width:4;fill:none;stroke-linecap:round;stroke-linejoin:round;}
.metric-chart .bar{fill:#ff8a68;rx:7;}
```

```html
<article class="surface-fx-card metric-window" style="--card-img:var(--img2)">
  <div class="label">KPI</div><h3>평균 대기</h3><div class="stat">42분</div>
  <svg class="metric-chart" viewBox="0 0 320 118"><line class="grid-line" x1="20" y1="28" x2="300" y2="28"/><polyline class="accent-stroke" points="24,88 80,74 130,64 188,52 248,40 296,28"/></svg>
</article>
```

Don't:

- 그래프처럼 생긴 장식 벡터로 끝내지 않는다.
- 실제 `svg`, `polyline`, `rect`, `circle`, `path`가 있어야 한다.

---

## S-05 `.refract-glass-card`

굴절 글래스 카드.

```css
.refract-glass-card{position:relative;overflow:hidden;border-radius:34px;background:rgba(255,255,255,.26);border:1px solid rgba(255,255,255,.32);box-shadow:0 34px 90px rgba(17,16,14,.24),inset 0 1px 0 rgba(255,255,255,.40);backdrop-filter:blur(20px) saturate(1.18);color:#fff;}
.refract-glass-card.corner-refract{position:absolute;right:58px;bottom:58px;width:780px;margin:0;}
.refract-glass-card .inside{position:relative;z-index:2;padding:46px;}
```

---

## S-06 `.lut-scene`

여러 이미지를 하나의 색감으로 묶는다.

```css
.lut-scene .lut-img{position:relative;filter:grayscale(.08) saturate(.72) contrast(1.05) brightness(.96);}
.lut-scene .lut-img::after{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(23,64,114,.36),rgba(231,208,176,.12));mix-blend-mode:soft-light;}
```

---

## S-07 `.selective-accent-scene`

전체 이미지는 저채도, 한 색만 강조.

```css
.selective-accent-scene{position:relative;overflow:hidden;border-radius:30px;background:#fffaf1;}
.selective-accent-scene .base{position:absolute;inset:0;background-size:cover;background-position:center;filter:grayscale(.95) contrast(1.05) brightness(1.02);}
.selective-accent-scene .accent-layer{position:absolute;inset:0;background:radial-gradient(circle at 36% 38%,rgba(232,73,42,.68),rgba(232,73,42,.18) 16%,transparent 33%);mix-blend-mode:multiply;}
.selective-accent-scene.cover-bright::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(6,7,9,.36),rgba(6,7,9,.86) 58%,rgba(6,7,9,.94));z-index:1;}
.selective-accent-content{position:absolute;right:72px;top:108px;width:720px;z-index:2;color:#fff;text-shadow:0 3px 24px rgba(0,0,0,.55);}
```

---

## S-08 `.paper-grain-layer`

디지털 이미지를 인쇄물처럼 마감한다.

```css
.paper-grain-layer{position:relative;overflow:hidden;border-radius:30px;background-size:cover;background-position:center;}
.paper-grain-layer::before{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,rgba(10,10,10,.84),rgba(10,10,10,.66) 58%,rgba(10,10,10,.20)),radial-gradient(rgba(255,255,255,.18) 1px,transparent 1px);background-size:auto,3px 3px;}
.paper-content{position:relative;z-index:2;color:#fff;text-shadow:0 3px 24px rgba(0,0,0,.52);}
```

---

## S-09 `.halftone-overlay`

망점 포스터 오버레이.

```css
.halftone-overlay{position:relative;overflow:hidden;border-radius:30px;background-size:cover;background-position:center;}
.halftone-overlay::before{content:"";position:absolute;inset:0;background:linear-gradient(110deg,rgba(232,73,42,.80),rgba(17,16,14,.82)),radial-gradient(circle,rgba(255,255,255,.38) 1px,transparent 1.5px);background-size:auto,9px 9px;mix-blend-mode:multiply;}
.halftone-content{position:relative;z-index:2;color:#fff;}
.halftone-overlay.poster-corner .poster-note{position:absolute;right:64px;bottom:64px;width:680px;z-index:4;box-shadow:0 24px 70px rgba(0,0,0,.36);}
```

---

## S-10 `.depth-shadow-stack` / `.final-card`

최종 실행 캔버스. 어두운 배경 위에 긴 이미지 카드 5개를 세운다.

```css
.depth-shadow-stack{box-shadow:0 4px 10px rgba(0,0,0,.18),0 24px 60px rgba(0,0,0,.38),inset 0 1px 0 rgba(255,255,255,.06);}
.final-layout{height:100%;display:grid;grid-template-columns:.72fr 1.28fr;gap:42px;align-items:center;padding:58px;}
.final-card-grid{position:relative;z-index:2;display:grid;grid-template-columns:repeat(5,1fr);gap:20px;}
.final-card{--card-img:var(--img1);position:relative;min-height:530px;display:flex;flex-direction:column;justify-content:flex-end;padding:28px;border-radius:28px;overflow:hidden;background:rgba(5,7,10,.32);border:1px solid rgba(255,255,255,.24);box-shadow:0 24px 60px rgba(0,0,0,.38),inset 0 2px 0 rgba(255,255,255,.06);}
.final-card::before{content:"";position:absolute;inset:-8px;opacity:1;background-image:var(--card-img);background-size:cover;background-position:center;filter:brightness(.64) saturate(.98) contrast(1.16) blur(2px);transform:scale(1.035);}
.final-card::after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 22% 10%,rgba(255,255,255,.16),transparent 26%),linear-gradient(180deg,rgba(8,9,12,.14) 0%,rgba(8,9,12,.40) 48%,rgba(8,9,12,.74) 100%);}
.final-card>*{position:relative;z-index:2;color:#fff;text-shadow:0 4px 22px rgba(0,0,0,.62);}
```

Do:

- 카드 안 이미지가 보이게 한다.
- 5개 카드가 실행 단계로 읽히게 한다.

Don't:

- 카드 안 이미지를 완전히 검게 죽이지 않는다.

