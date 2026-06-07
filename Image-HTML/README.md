# Image-HTML — Raw5 이미지 임베드 HTML 덱

이미지를 **배경 재료**로만 쓰고 텍스트·숫자·차트는 전부 **HTML/SVG**로 유지하는 1920×1080 HTML 발표 덱(HTML PPT / 카드뉴스 / 키노트) 제작 **스킬**과 **예시 모음**.

> **핵심 원칙: 이미지는 재료이고, HTML은 진실이다 (images are material; HTML is truth).**
> AI가 만든 raw 이미지 **5장**을 CSS 변수(`--img1`~`--img5`)에 묶어 모든 슬라이드에서 재사용하고(wash / blend / tone / grid / mask / material-image-card 기법), 모든 글자·수치·차트는 선명한 HTML/SVG로 둔다. 그래서 덱은 어떤 확대에서도 또렷하고, 편집·접근성이 살아 있다.

---

## 📁 `raw-5-html/` — Claude 스킬

GPTs용 **"Raw5 v4" 프롬프트 팩**을 Claude(Claude Code / claude.ai) **스킬**로 포팅한 것. Python 오케스트레이션 없이 문서만 읽고 LLM이 판단한다.

| 항목 | 내용 |
|---|---|
| `SKILL.md` | 역할 + **3단계 워크플로우** + 품질 하네스 + eval QA |
| `references/` | 라우터 · 덱 기획 · 이미지 디렉터 · 런타임/QA · CSS 기법 · 플레이북 · 하네스 · 마스터 프롬프트 (8개) |
| `assets/example/democracy-deck.html` | 이 스킬로 만든 30장 V7 예시 (+ 외부 `assets/imgN.png`) |
| `assets/example/mode-references/` | 4개 모드 정전 예시 (자체완결 data-URI) |

### 3단계 워크플로우 (절대 합치지 않음)
1. **Deck Plan** — 주제/청중/모드 인터뷰 → 슬라이드별 `message` 표 + raw5 5역할 전략
2. **Raw5 이미지 프롬프트 (HARD STOP)** — 이미지 5장 프롬프트만 emit하고 **반드시 멈춤**. 사용자가 이미지를 만들어 `assets/`에 `img1~5.png`로 저장 → "진행"
3. **HTML 빌드** — `democracy-deck.html`의 런타임(1920×1080 fit-scale + 자동숨김 nav + 키보드/스와이프)을 재사용, 슬라이드만 교체. 배치 빌드.

### 디자인 4모드
**V7** 밝은 리포트 · **V8** 다크 브루탈리스트 · **University AX** 정보 그리드 · **Street** 에디토리얼.

### 설치 / 사용
- Claude Code: `raw-5-html/`를 스킬 디렉토리에 두면 `SKILL.md`의 description으로 트리거된다.
- 또는 `SKILL.md`를 직접 읽혀 위 3단계를 따르게 한다.

---

## 📁 `examples/` — 샘플 덱 & 출처

| 경로 | 내용 |
|---|---|
| `*.html` (7개) | M5.5 정전 샘플 덱 5개(ai_planner **V8** · university_ax · seongsu · ai_news · hallym) + CSS 치트시트 2개. 모두 단일 파일 자체완결 |
| `gpts-prompt-pack/` | 원본 **GPTs Raw5 v4** 프롬프트 팩(00~09 + README + CHANGELOG). 스킬의 출처 |
| `democracy/` | "민주주의는 다수결이 아니다" — 30장 **V7** 덱 (deck + img1~5) |
| `behavioral-economics/` | "비합리적인 당신을 위한 행동경제학" — 30장 **V8 다크** 덱. cold-start 검증으로 from-scratch 제작 (deck + img1~5) |

> `democracy` 덱은 `raw-5-html/`(스킬이 스캐폴드로 사용)과 `examples/` 양쪽에 있다 — 스킬이 **자체완결**로 작동하기 위함.

브라우저에서 각 `*.html`을 열면(이미지 있는 덱은 폴더째) 바로 재생된다. 키보드 ←/→ · 스와이프 · 화면 양끝 탭으로 넘긴다.

---

## 라이선스 / 크레딧

- **License**: Apache-2.0 (repo 루트 `LICENSE`)
- **Raw5 방법론 · 프롬프트 팩**: 안창현 (Achmage)
- **Claude 스킬 포팅 · 검증**: 2026
