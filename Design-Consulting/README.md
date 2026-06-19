# Design-Consulting — Component Consulting (buy, don't build)

AI가 만든 프론트엔드/HTML 덱이 **사이트의 메시지** · **DESIGN.md 토큰** · **distinctiveness 밴드**와 일치하도록, "어떤 오픈소스 UI 컴포넌트를 살지 / 어떻게 토큰에 remap 할지 / 어디에 배치할지"를 처방하는 **컨설팅 스킬**과 **쇼케이스 모음**.

> **컴포넌트 생성기가 아니라 컴포넌트 컨설턴트.** "buy, don't build"가 풀지 않은 절반 — *fit reasoning* — 을 채운다. 누구나 화려한 컴포넌트를 붙여넣을 수 있다. 가치는 그 앞단의 판단이다.

## 🎯 무엇을 하나

- **WHICH** — 각 job-slot(Hero / Proof / Social-proof / CTA …)에 어떤 검증된 갤러리 컴포넌트가 맞는가
- **HOW** — 그 컴포넌트를 DESIGN.md 토큰(색 · 타이포 · radius · spacing · elevation)에 어떻게 remap 하는가
- **WHERE** — 결정 여정(orient → thesis → proof → objection → CTA)에서 어디에 놓는가

두 실패 모드를 모두 탈출한다 — **floor**(average-AI: Inter 디스플레이 + 균등 3카드 그리드 + 보라→파랑 그라데이션 히어로)와 **ceiling**(flashy-for-its-own-sake: 진지한 페이지에 박은 dynamic-island pill / aurora spotlight). 목표는 그 사이의 밴드: *fit 해서 distinctive*, 외쳐서가 아니라.

## 🧮 5축 gates-first Fit Rubric

| Axis | Weight | 역할 |
|---|---|---|
| A — Token Fit | 0.35 | DESIGN.md 토큰과의 remap 거리(색/타이포/radius/elevation/spacing 5차원). 0–1차원=4 drop-in, 5차원 또는 토큰화 불가=0 reject |
| B — Message / Philosophy Fit | **GATE** | 컴포넌트의 수사적 의도 ↔ 사이트의 명시 의도의 각도. **B 0–1 → auto-reject** (Token Fit 4여도) |
| C — UX + Backend Honesty | 0.30 | `min(flow-fit, backend-honesty)`. 핵심 경로의 죽은 컨트롤 = reject ("작동 안 하는 예쁜 버튼") |
| D — Distinctiveness Band | 0.35 | 중간이 sweet spot(bland↔awwwards↔gratuitous). 페이지당 awwwards-밴드 **≤1** |
| E — House-System Override | **GATE** | 개인/하우스 시스템(예: ACH Thesis)이 있으면 generic 갤러리 픽을 **override**, +0.5 보너스 |

> **relational truth**: 같은 컴포넌트도 사이트마다 점수가 다르다 — dynamic-island pill 은 에디토리얼 리서치 포털에서 **0**, 소비자 SaaS 티커에서 **4**. Fit 은 컴포넌트만의 속성이 아니라 **컴포넌트 × 메시지 × 토큰**.

## 🔭 Live-Scan (검색은 진짜다)

갤러리를 기억에서 떠올리지 않는다. **DESCRIBE → NAME → SEARCH → TRIPLE-CHECK → BUY+CUSTOMIZE** 루프를 **WebFetch → WebSearch(`site:{gallery} {name}`) → 모델 지식 fallback**으로 ~15개 갤러리에 실행한다. fetch 한 페이지는 **untrusted data**로 다뤄 이름·링크만 추출하고 코드는 실행/설치하지 않는다(S0). 실증: magicui(79개, Orbiting Circles 포함) · smoothui(~80개, Dynamic Island) · component.gallery + uiverse(403 차단 → WebSearch fallback 이 uiverse "1,157 cards" 반환).

## 🖼 Showcases — 같은 스킬, 다른 메시지/토큰

### 1. 골목 베이커리 (Korean editorial · raw5 × component-consulting)
5장 raw 이미지 + 10개 구별되는 컴포넌트, Pretendard-only, 1920×1080 HTML 덱. raw5-deck 과의 fusion 증명.

https://laguna821.github.io/Achmage-Skills/Design-Consulting/examples/golmok-bakery-deck/

### 2. SURGE EV (cinematic premium-agency)
다크 시네마틱 EV 광고 랜딩 — GSAP/Lenis, scroll-driven, WebP. 컨설턴트가 consume 한 토큰은 `examples/surge-ev/DESIGN.md`.

https://laguna821.github.io/Achmage-Skills/Design-Consulting/examples/surge-ev/

### 3. Skill Landing (ACH Thesis · house-override mode)
이 스킬 자신의 awwwards 랜딩 — Axis E 하우스 오버라이드 예시(이미지 없는 순수 HTML). 실제 처방 리포트는 `examples/skill-landing-ach/consulting-report.md`.

https://laguna821.github.io/Achmage-Skills/Design-Consulting/examples/skill-landing-ach/

## 📁 `component-consulting/` — Claude 스킬

| 항목 | 내용 |
|---|---|
| `SKILL.md` | §0 거버닝 원칙(one-sentence test) + §1 blocking pre-flight + §2 7-step flow(live-scan 포함) + §3 결정적 리포트 + §4 3 hook 모드 + §5 분업 |
| `references/gallery-catalog.md` | ~15 갤러리 라우팅 + Live-Scan 프로토콜 + describe→name resolver + framework-fit(deck-safe) 플래그 |
| `references/fit-rubric.md` | 5축 gates-first rubric + aggregation + worked scorecard |
| `templates/prescription-output.md` | 결정적 6-섹션 리포트 스켈레톤 |

## 🚀 설치 (Installation)

```bash
# A — npx (가장 간단)
npx skills add laguna821/Achmage-Skills --skill component-consulting -a claude-code
```

```text
# B — 플러그인 마켓플레이스
/plugin marketplace add laguna821/Achmage-Skills
/plugin install component-consulting@achmage-skills
```

```bash
# C — 수동 복사
git clone https://github.com/laguna821/Achmage-Skills
cp -r Achmage-Skills/Design-Consulting/component-consulting ~/.claude/skills/component-consulting
```

설치 후 **"이 디자인에 어떤 컴포넌트 쓸까 / 컴포넌트 추천해줘 / pick UI components"** 라고 요청하거나, `DESIGN.md`가 존재하는 상태에서 자동 로드된다.

## License

- **Skill (`component-consulting/`)**: MIT (`SKILL.md`)
- **Repo / showcases**: Apache-2.0 (루트 `LICENSE`)
- **방법론 · 쇼케이스**: 안창현 (Achmage), 2026
