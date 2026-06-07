# 04_HTML_RENDERER_RUNTIME_QA.md

# HTML Renderer, Runtime & QA v4

이 문서는 raw image 5장이 승인된 뒤 HTML PPT를 만드는 렌더러다.

---

## 0. Renderer Unlock Condition

HTML 렌더러는 아래 조건을 만족할 때만 활성화된다.

1. raw image 5장이 있다.
2. 사용자가 이미지를 확인했다.
3. 사용자가 “HTML로 진행” 또는 동등한 명시 승인을 했다.
4. 이미지 일부 수정 요청이 끝났다.

아래 상황에서는 렌더링하지 않는다.

1. raw image가 없다.
2. raw image가 1~4장뿐이다.
3. 사용자가 이미지 수정을 요청 중이다.
4. placeholder 이미지로 완성본을 만들어야 한다.
5. 사용자가 구조만 요청했는데 완성 HTML을 만들려고 한다.

---

## 1. Canonical Runtime

모든 HTML PPT는 1920×1080 고정 캔버스다.

```html
<body>
  <div id="viewport">
    <section class="slide active" data-slide="1">
      <div class="slide-shell">
        <div class="topbar">...</div>
        <main class="content">...</main>
        <div class="footerbar">...</div>
      </div>
    </section>
  </div>

  <div id="controller" class="auto-hide">...</div>
  <div class="touch-zone left"></div>
  <div class="touch-zone right"></div>
</body>
```

```css
#viewport{
  position:fixed;
  inset:0;
  display:flex;
  align-items:center;
  justify-content:center;
  background:#000;
  overflow:hidden;
}
.slide{
  position:absolute;
  top:50%;left:50%;
  width:1920px;height:1080px;
  transform:translate(-50%,-50%) scale(var(--deck-scale,1));
  transform-origin:center center;
  display:none;
  overflow:hidden;
}
.slide.active{display:block;}
.slide-shell{position:relative;width:100%;height:100%;}
```

---

## 2. Raw5 Binding

HTML `:root`에는 반드시 아래가 있어야 한다.

```css
:root{
  --img1:url("...");
  --img2:url("...");
  --img3:url("...");
  --img4:url("...");
  --img5:url("...");
}
.img1{background-image:var(--img1)}
.img2{background-image:var(--img2)}
.img3{background-image:var(--img3)}
.img4{background-image:var(--img4)}
.img5{background-image:var(--img5)}
```

금지:

- 빈 `url()`
- `background-image:none`
- 이미지 없이 `.img1` 클래스만 만들기
- 다른 외부 이미지를 몰래 추가하기

---

## 3. Background Shorthand Guard

`background:` shorthand는 기존 `background-image`를 지울 수 있다.

금지 CSS:

```css
.grid-panel{background:rgba(255,255,255,.8);}
.panel.image{background:#fff;}
.material-image-card::before{background:#000;}
```

권장 CSS:

```css
.grid-panel{background-color:rgba(255,255,255,.8);}
.panel.image{background-image:var(--img1);background-color:#fff;}
.material-image-card::before{background-image:var(--card-img);}
```

---

## 4. Forbidden TOC / Navigation Harness

### 4-1. 왼쪽 하단 TOC 금지

아래 UI는 만들지 않는다.

- 왼쪽 하단 슬라이드 번호 목록
- 화면 아래에 늘어선 1,2,3,4 버튼
- slide thumbnails strip
- table of contents rail
- 항상 보이는 페이지 목록

강제 CSS:

```css
#toc,.toc,.slide-index,.thumb-strip,.slide-dots,.page-list{
  display:none!important;
  visibility:hidden!important;
  pointer-events:none!important;
}
```

### 4-2. 네비게이션 자동 숨김

우측 하단 네비게이션은 이동 직후 짧게 보이고 자동으로 사라져야 한다.

```css
#controller{
  position:fixed;
  right:22px;
  bottom:20px;
  z-index:9999;
  opacity:0;
  transform:translateY(12px);
  pointer-events:none;
  transition:opacity .18s ease, transform .18s ease;
}
#controller.is-visible,
#controller:hover{
  opacity:1;
  transform:translateY(0);
  pointer-events:auto;
}
```

```js
let navTimer;
function showController(){
  const c=document.getElementById('controller');
  if(!c) return;
  c.classList.add('is-visible');
  clearTimeout(navTimer);
  navTimer=setTimeout(()=>c.classList.remove('is-visible'),900);
}
function go(n){
  // slide change logic
  showController();
}
```

---

## 5. Touch / Keyboard Runtime

```js
document.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight' || e.key==='PageDown') go(current+1);
  if(e.key==='ArrowLeft' || e.key==='PageUp') go(current-1);
});

let startX=0;
document.addEventListener('touchstart',e=>{startX=e.touches[0].clientX;},{passive:true});
document.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-startX;
  if(Math.abs(dx)>50){ dx<0 ? go(current+1) : go(current-1); }
},{passive:true});

const left=document.querySelector('.touch-zone.left');
const right=document.querySelector('.touch-zone.right');
left?.addEventListener('click',()=>go(current-1));
right?.addEventListener('click',()=>go(current+1));
```

---

## 6. Text Contrast QA

사진 위 텍스트는 항상 대비를 확인한다.

금지:

- 사진 위 회색 본문
- 채도와 명도가 사진과 비슷한 텍스트
- 얇은 폰트로 사진 위에 긴 문장

권장:

```css
.photo-text-light{
  color:#fff;
  text-shadow:0 4px 24px rgba(0,0,0,.62);
}
.photo-text-dark{
  color:#11100e;
  text-shadow:0 1px 0 rgba(255,255,255,.45);
}
.photo-scrim-dark::after{
  content:"";
  position:absolute;
  inset:0;
  background:linear-gradient(90deg,rgba(0,0,0,.84),rgba(0,0,0,.22));
}
```

---

## 7. Mode별 렌더링 QA

### V7 QA

- `--img1~--img5`가 모두 있다.
- `.wash-scene`, `.blend-scene`, `.tone-scene` 등 V7 기법이 recipe대로 들어갔다.
- 밝은 배경에서 네이비 텍스트가 유지된다.
- 이미지가 정보 구조를 덮지 않는다.

### V8 QA

- 모든 슬라이드가 `.bg-stage` 구조를 쓴다.
- `.bg-full`, `.bg-treatment`, `.bg-grid`, `.slide-ui`가 분리되어 있다.
- 기법이 3~4개 정도로 반복된다.
- 형광 그린 포인트가 일관된다.
- 너무 많은 장식 기법이 들어가지 않았다.

### University AX QA

- `.summary-grid`, `.compare-grid`, `.kpi-grid`, `.roadmap-grid`, `.dashboard-grid`가 12컬럼 안에서 정리되어 있다.
- KPI, 표, 로드맵은 HTML/SVG다.
- 이미지가 핵심 정보를 가리지 않는다.

### Street Editorial QA

- 종이색 배경, 검정 굵은 제목, 코랄 포인트가 유지된다.
- `.material-image-card` 안 raw 이미지가 실제로 보인다.
- `.surface-fx-card.metric-window`는 실제 SVG 차트를 포함한다.
- 사진 위 텍스트는 흰색/검정으로 강하게 보인다.
- `.final-card` 안 이미지가 검은 상자로 사라지지 않는다.

---

## 8. QA Checklist Before File Delivery

HTML 파일을 제공하기 전 아래를 검사한다.

```text
[ ] 1920×1080 고정 캔버스인가?
[ ] 모든 slide가 data-slide를 갖는가?
[ ] raw image가 --img1~--img5에 들어갔는가?
[ ] 이미지칸 background-image가 none이 아닌가?
[ ] 왼쪽 하단 TOC/번호 목록이 없는가?
[ ] 우측 하단 controller가 자동 숨김인가?
[ ] 모바일 스와이프/엣지 탭이 있는가?
[ ] 사진 위 텍스트 대비가 충분한가?
[ ] V8이면 기법을 과하게 섞지 않았는가?
[ ] Street material card 안 이미지가 보이는가?
[ ] Surface FX 카드에 실제 SVG 차트가 있는가?
[ ] 파일명에 버전이 붙었는가?
```

---

## 9. Patch Output Format

수정본을 만들면 응답은 짧고 정확하게 한다.

```text
수정했습니다.

반영한 부분:
- 11번 material-image-card 내부 이미지 가시성 강화
- 14번 surface-fx-card 실제 SVG 차트 적용
- 왼쪽 하단 TOC 제거
- 우측 하단 네비 자동 숨김 유지

[수정본 HTML 다운로드](sandbox:/mnt/data/filename.html)
```

