---
type: documentation
aliases:
  - 최종 덱 테마 이식 계약
description: "Contract for porting an approved deck style (v1/v3/v8/v9-v14) onto the shared CMDSPACE deck core (deck-core.js/css) and shared 24-slide content. Defines deliverables, markup classes, engine modes, aspect/theme requirements, theme hooks, verification gate, and DESIGN.md/NOTES.md formats. Read before building or reviewing any theme under final/themes/."
author:
  - "[[구요한]]"
model: "claude-fable-5-1[1m]"
effort: "xhigh"
date created: 2026-09-09
date modified: 2026-09-09
tags:
  - deck
  - design-system
  - contract
CMDS: "[[📚 731 Digital Art and Design]]"
index: "[[🏷 Lecture Notes]]"
---

# 최종 덱 테마 이식 계약 (final/CONTRACT.md · R1)

## 0. 구조 한 줄

`core/`(공용 프레젠터 엔진) + `content.html`(공용 24장 정본) + `themes/{slug}/`(스타일 층) → `python3 build.py` → `dist/{slug}/index.html` **단일 파일**. 테마는 CSS(+소량 JS)로 승인된 원본 덱의 시각 언어를 **충실히** 옮긴다. 코어·콘텐츠·빌더는 테마가 수정하지 않는다(필요한 변경은 NOTES.md에 요청으로 남긴다).

## 1. 산출물 (themes/{slug}/)

| 파일 | 필수 | 내용 |
|------|:--:|------|
| `theme.json` | ✅ | `{"name","engine":"stage"\|"scroll","source":"v9-section-drawing","lineage":"v7 Cinema","description"(영문 1문장),"whenToUse"(한국어 1~2문장),"signature":[5개 결정 한 줄씩],"palette":{"light":{...},"dark":{...}}}` |
| `theme.css` | ✅ | 슬라이드 내부 전부 + 패널 변수(`--dk-*`) 덮어쓰기. 400~900줄 권고. 라이트·다크 둘 다 |
| `theme.js` | 선택 | `window.DeckTheme = { init, slide, step, layout, theme, aspect, mode }` 훅. 장식 DOM 주입(눈금자·마스트헤드·상태 스트립·틱 등)은 여기서 |
| `DESIGN.md` | ✅ | 남이 복사해서 쓰는 설계 문서 (§6 형식) |
| `NOTES.md` | ✅ | 이식 기록·검증 결과·잔여 이슈·코어에 요청할 변경 (§7 형식) |

## 2. 코어가 제공하는 것 (읽고 쓸 것: `core/deck-core.css`, `core/deck-core.js`)

- 토큰: `--cmds-green #134538` · `--cmds-pink #E985A2` · `--bg --fg --muted --line --accent --accent-on` (라이트/다크 자동 스왑, `html[data-theme]`) · `--font-sans/--font-display/--font-mono`.
- 엔진: `html[data-engine="stage"]` = `#deck` 1920×`var(--stage-h)`(1080 또는 **1200**) 캔버스가 `--dk-scale`로 레터박스. `.slide[data-active]`만 `display:flex; flex-direction:column`. / `html[data-engine="scroll"]` = `#deck`이 스냅 스크롤 컨테이너(`--dk-w`×`--dk-h`), `.slide{height:var(--dk-h)}`. **100vh 쓰지 말고 `var(--dk-h)`**.
- 비율: `html[data-aspect="16x9"|"16x10"|"free"(scroll만)]`. **두 비율 모두에서 깨지면 안 된다** — 세로 여분은 `.foot{margin-top:auto}` 식으로 흡수.
- 모드: `html[data-mode="browse"|"stage"|"panels"|"notes"]`. 코어 패널(`.dk-top .dk-bottom #dk-notes`)은 코어가 그린다. 테마는 `--dk-panel-bg --dk-panel-fg --dk-panel-line --dk-panel-h --dk-notes-w --dk-font --dk-accent`로 **재스킨만** 한다(구조 변경·숨김 금지 — 9종 공통 UX).
- 순차 공개: `[data-step]` + `.in` (코어 기본 모션은 12px 상승 페이드; 테마가 `html.js [data-step]`를 덮어써 자기 모션을 정의해도 됨. `@media (prefers-reduced-motion)`은 코어가 처리). 카운터 `[data-count]`.
- 인쇄: `@media print`에서 코어가 모든 슬라이드를 1920×H 페이지로 쌓고 `[data-step]`을 강제 공개. 테마는 자기 장식(고정 위치 크롬·필터·블렌드)이 인쇄에서 깨지지 않게만 처리.
- API: `window.CmdsDeck` (`go, advance, back, state(), slides, notes, meta, engine, sectionName(i), slideTitle(i), say(msg)`).
- 훅 시그니처: `init(api)` · `slide(i, el, api)` · `step(i, n, total)` · `layout({engine,mode,aspect,w,h})` · `theme("light"|"dark")` · `aspect(a)` · `mode(m)`.

## 3. 콘텐츠 마크업 계약 (`content.html` — 24장, 수정 금지)

슬라이드 종류(`section.slide.k-*`)와 내부 클래스. 테마는 **전부** 스타일해야 한다.

| kind | 슬라이드 | 내부 |
|------|---------|------|
| `k-cover` | 01 | `.kicker .headline .lead .foot(.foot-note .foot-src)` |
| `k-section` | 03 09 14 20 | `.kicker .headline(.sub) .lead` |
| `k-statement` | 04 17 | `.headline(em)` `.lead` `ul.body-list li[data-step]`(17만) |
| `k-steps` | 05 | `.steps > .step[data-step] > .step-no .step-title .step-text` (4열) |
| `k-ladder` | 15 | `.steps.ladder > .step(.hi)` (세로 4단) |
| `k-grid` | 02 06 22 | `.grid.cols-4` / `.grid.cols-3.nine(.constellation)` > `.cell > .cell-no .cell-title .cell-text` |
| `k-cards` | 21 | `.grid.cols-3.cards > .cell[data-step]` |
| `k-stats` | 07 | `.stats > .stat > .num[data-count] .unit .label` + `.lead` |
| `k-table` | 08 16 | `table.tbl(.compare-tbl)` thead/tbody, `td.hi th.hi` |
| `k-quote` | 10 | `blockquote.quote > p + cite` + `.lead` |
| `k-diagram` | 11 | `svg.diagram` viewBox 1200×420: `g.dg-layer[data-step] rect+text.dg-t+text.dg-s` · `g.dg-arrow[data-step] path+text.dg-v` · `g.dg-loop[data-step]` |
| `k-compare` | 12 | `.compare > .col.a/.col.b > h3 + ul` |
| `k-terminal` | 13 | `pre.terminal > code` (`.prompt .dim .ok`) |
| `k-timeline` | 18 | `.timeline > .tick[data-step] > .tick-when .tick-lv .tick-what` (5) |
| `k-bars` | 19 | `.bars > .bar(.hi)[data-step][style=--w:N] > .bar-label(b) .bar-track>i .bar-val` + `.lead` |
| `k-toggle` | 23 | `.toggle[data-view=note\|harness] > .toggle-ctl button[data-view] · .toggle-grid > .tg > .tg-a .tg-b .tg-desc · p.toggle-verdict` (`note`면 `.tg-a`만, `harness`면 `.tg-b`만 보이게) |
| `k-outro` | 24 | `.grid.cols-3.links` + `.lead` + `.foot` |

슬라이드 메타(모든 테마가 쓸 수 있고 **blueprint는 반드시 표시**): `data-section`(0/A/B/C/D/Z) `data-section-name` `data-kind` `data-source`(볼트 정본) `data-title`. 덱 메타는 `#deck-meta` JSON(`title subtitle author rev sections`).

## 4. 필수 요건

1. **원본 충실**: 원본 `../vN-*/index.html`과 `NOTES.md`를 읽고 시그니처 결정(색·타이포 스케일·격자·크롬·모션·진행 표시)을 옮긴다. 원본에 없는 새 장식을 발명하지 않는다. 원본 NOTES의 "수정 이력·잔여 결함"을 체크리스트로 삼아 재발시키지 않는다.
2. **CI**: 색은 두 토큰과 그 톤·투명도 변주만. 폰트는 SF Pro + Pretendard(모노는 SF Mono/JetBrains Mono). Anti-Slop 부정 목록(DESIGN.md §2) 준수.
3. **비율 2종 × 테마 2종 = 4조합 전부** 깨짐 0. 세로 1200에서 빈 공간이 어색하면 간격 변수로 흡수(예: `html[data-aspect="16x10"] .slide{--pad-y:…}`).
4. **한국어 조판**: `word-break:keep-all` 유지, 헤드라인 줄바꿈은 `<br/>`가 이미 있음 — 폰트 크기는 1920 폭 기준 헤드라인 최대 폭이 넘치지 않게.
5. **패널 재스킨**: 코어 패널이 테마와 이질적이지 않게 `--dk-*` 변수를 반드시 설정. 자기 진행 표시(점·눈금·틱·폴리오)는 슬라이드 안에 둔다(코어 패널과 중복돼도 됨 — 패널은 stage 모드에서 숨겨짐).
6. **훅 사용**: 상태 동기가 필요한 장식(v13 상태 스트립, v9 눈금자 하이라이트, v1 점 진행, v11 폴리오, v14 틱, v10 씬 슬레이트)은 `theme.js` 훅으로 코어 상태를 읽어 그린다. 자체 키 리스너·자체 슬라이드 이동 로직 금지.
7. **의존성 0**: 외부 폰트·CDN·이미지 금지. 로고는 CSS/SVG 인라인 텍스트 마크로 대체.

## 5. 검증 게이트 (제출 전 필수, 결과를 NOTES.md에)

```bash
cd "<final>"
python3 build.py --themes {slug}
python3 tools/verify.py dist/{slug}/index.html --aspects 16x9,16x10 --themes light,dark
# → overflow=0 overlap=0 이어야 통과. 오탐이면 NOTES.md에 근거와 함께 기록.
# 스크린샷 dist/{slug}/shots/{aspect}-{theme}-sNN.png 를 24장 × (최소 16x9 light·dark) 직접 열어 눈으로 확인.
python3 tools/smoke.py dist/{slug}/index.html   # 콘솔 에러 0
```
추가로 `?print=1` 로 열어 인쇄 레이아웃 확인(장식이 페이지를 덮지 않는지).

## 6. DESIGN.md 형식 (남이 복사해 쓰는 문서 · 볼트 frontmatter 7필드 + model/effort)

`# {이름} — DESIGN` → ①한 줄 정의 ②언제 쓰나 / 쓰지 말 것 ③시그니처 결정 5개(각각 "무엇·왜·어떻게(CSS 값)") ④토큰 표(색 라이트/다크 · 타이포 스케일 px · 간격 · 선 굵기) ⑤콘텐츠 클래스 → 이 테마의 해석 표(§3의 kind 전부) ⑥모션·순차 공개 규칙 ⑦크롬·진행 표시 ⑧금지 목록 ⑨복사해서 쓰는 법(theme.css를 다른 콘텐츠에 얹는 절차 3줄, 필요한 마크업 계약 요약) ⑩계보·출처.

## 7. NOTES.md 형식

frontmatter(type note · description 영문 · model/effort) → `## 이식 요약`(원본 대비 유지/변경/포기 표) → `## 사용자 요청 수정`(해당 시) → `## 검증`(verify 수치 4조합 · 스모크 · 인쇄 · 눈으로 본 문제) → `## 잔여 이슈` → `## 코어/콘텐츠에 요청할 변경`(있으면).
