---
name: render-audit
description: >
  Render-measured QA auditor for built frontend pages. Runs four layers
  against the RENDERED page (never just the source): RQ1 deterministic
  structure checks (getBoundingClientRect, 9 items), RQ2 pixel-contrast
  measurement (canvas worst-pixel WCAG), RQ2-OBS scene observability &
  coverage accounting (texture-energy sd — the dual pull that stops
  scrim monotone escalation), RQ3 multimodal screenshot traversal with a
  mandatory section×scheme matrix. FULL sweep (3 widths × 2 schemes, all
  layers) is the DEFAULT and auto-invoked; a reduced "fast" run is legal
  only by explicit declaration. Findings follow audit discipline:
  severity HIGH/MED/LOW, evidence not taste, cap 15, honest "Not
  reviewed" listing. Use whenever a frontend build is about to be
  declared complete, when a component-consulting-v3 prescription's
  Render QA hand-off contract names this skill, or when the user asks
  "렌더 검사", "render QA", "화면 실측 검사", "audit this page".
license: MIT
version: "1.0.1"
---

# Render Audit — 렌더 실측 검사관

> **직무 선언.** 이 스킬은 **검사관(auditor)** 이다 — 처방하지 않고,
> 빌드하지 않고, 수리하지 않는다. 렌더된 픽셀을 실측하고 판정만 내린다.
> 수리는 호출자(빌드 세션)의 일이고, 이 스킬은 수리 후 **재검사**로
> 돌아온다. 계보: `component-consulting-v3` [[component-consulting-v3]]
> Step 7.5 에서 v3.6 때 분리 (한 스킬에 컨설턴트와 검사관 두 직무가
> 묶여 있던 §5 자기모순의 해소). 이제 **OS 공용** — 어떤 프론트엔드
> 빌드 세션이든 호출할 수 있다.

## §0 — 발동 (when this skill runs)

1. **인수인계 계약 (자동·블로킹)** — `component-consulting-v3`
   [[component-consulting-v3]] 의 처방문에는 § Render QA 인수인계
   계약이 있다 (RAW OK 와 동급의 HARD 계약). 그 처방을 빌드하는
   세션은 **완료 선언 전에 이 스킬의 full 검사를 반드시 실행**한다 —
   계약 불이행 = 완료 선언 금지.
2. **빌드 완료 직전 (자동)** — 처방 출신이 아니어도, OS 안에서
   프론트엔드 산출물(라이브 페이지·HTML 덱)이 "완료" 로 선언되기
   직전이 발동 시점이다. 렌더 가능한 산출물에 검사 없는 완료 선언은
   없다.
3. **사용자 직접 호출** — "렌더 검사", "render QA", "이 페이지 실측
   검사해줘".

**전제**: 산출물이 로컬 프리뷰에서 렌더된 상태. 빌드 없는 처방-전용
세션에서는 발동하지 않는다 — 그 세션은 스킵을 선언하고, 빌드 세션이
계약을 승계한다.

## §1 — 모드: full 이 기본값이다

| 모드 | 내용 | 발동 |
|---|---|---|
| **full** (기본) | RQ1 **3폭**(375/768/1440) × **2스킴**(light/dark) + RQ2ALL + RQOBSALL + RQ3 섹션×스킴 매트릭스 **전수** | 자동 — 선언 불요 |
| fast | 축소 조합 (예: 1440 라이트 + 다크 스팟) | **명시 선언 시에만** |

**fast 는 선언식 예외다** — "조용한 압축 금지"(v3 Step 7 처방 완결성
게이트)와 동형: 강도 하향은 금지가 아니라 **선언 대상**이다. fast 로
가려면 검사 보고서 머리에 3가지를 쓴다:

1. **근거** — 왜 축소하는가 (예: 단일 섹션 핫픽스 재검).
2. **생략 조합 열거** — 안 돈 폭×스킴×계층을 전부 나열.
3. **잔여 리스크 1줄** — 생략이 못 잡는 결함 부류.

선언 없는 축소 실행은 fast 가 아니라 **검사 회피**이며, PASS 로
기록할 수 없다. 이 스킬의 실제 호출 프로필은 외부 공개 프로덕션
(신청 페이지 Vercel 배포 등)이다 — 외부 독자는 토큰 비용이 아니라
마감을 본다. 그래서 전수가 기본값이다.

## §2 — 실행 절차

정본 규칙: `references/render-qa.md` [[render-qa]] (4계층의 판정
기준·위반 조건·존재 이유 전부). 실행 하네스:
`scripts/render-qa-harness.js` (RQ1 / RQ2·RQ2ALL / RQOBS·RQOBSALL).

1. **계약 수취** — 호출 계약(처방문 § Render QA 인수인계)에서 페이지별
   파라미터를 받는다: **SCRIM 표** (씬 클래스별 c/a/op/mul/blur) +
   **DECLARED_WIDTH_TOKENS** (G1 폭 토큰 수) + 씬 테이블 (`--raw-pos-m`
   선언 수 대조용) + RQ2-OBS 면제 선언 여부. **계약이 이를 동봉하지
   않았으면** CSS 에서 재구성하되, 재구성했다는 사실과 재구성 값을
   보고서에 기록한다 (F39 — 표 비동기는 "수리가 안 먹혔다" 오독을
   만든다).
2. **하네스 주입** — 프리뷰 콘솔/javascript_tool 에 하네스 로드,
   SCRIM 표·폭 토큰 수를 페이지 값으로 교체. 트랜지션 동결은 하네스가
   수행(`freezeMotion`).
3. **계층 순서대로** — 싼 검사가 먼저: RQ1(폭·스킴 순회) → RQ2ALL →
   RQOBSALL → RQ3(캡처 순회 + 매트릭스 기록). 각 계층의 위반 조건과
   한계는 [[render-qa]] 가 정본이다.
4. **판정** — 위반 = REVISE. 수리는 호출자가 하고, 이 스킬은 해당
   계층부터 재검사한다 (≤2 루프 권장; 3루프 초과는 검사가 아니라
   처방·배치의 결함 신호 — 호출자의 Step 5 로 회귀하라고 반환).

## §3 — 출력 규율 (audit discipline)

보고서는 **증거이지 취향이 아니다** (evidence, not taste). 형식:

```
# Render Audit — {page} · {mode: full|fast(+선언)} · {date}

## Verdict: PASS | REVISE

## Findings ({n} — 상한 15)
1. [HIGH] RQ2 dark #collective p.figure — 대비 2.1:1 < 4.5:1 (scene,
   최악 픽셀). evidence: RQ2ALL.dark.scene[0] · index.html:214
2. [MED]  RQ1-6 …
...

## Not reviewed
- {안 돈 폭×스킴 조합 / 스킵 선언된 계층 / 캡처 한계 — 전부 열거}

## Matrix (RQ3 — 섹션×스킴)
| section | light | dark |  ← 순회한 칸에만 ✓. 빈 칸 = 미실행.
```

규칙:

- **severity 3단** — HIGH: 하한 위반·콘텐츠 소실·계약 위반 (블로킹) /
  MED: 리듬·관측성·경계 사례 (REVISE 대상이나 정황 판단 여지) /
  LOW: 관찰·권고 (판정에 불산입).
- **모든 finding 에 실측 증거** — 수치(대비율·sd·px)와 위치
  (섹션 id·selector, 소스가 특정되면 `path:line`). 수치 없는 심미
  소감은 finding 이 아니다 — RQ3 육안 항목조차 "어느 캡처의 어느
  섹션에서 무엇이 보였는가" 로 쓴다.
- **상한 15** — 초과 시 severity 순 상위 15 + "외 {n}건" 총계. 긴
  목록은 실행자가 전체를 불신하게 만든다 (F36/F38 실측 — 거짓 위반이
  많으면 진짜가 묻힌다).
- **"Not reviewed" 정직** — 순회하지 않은 것을 순회한 것처럼 쓰지
  않는다. 기록 없는 순회는 순회가 아니다 (F46). fast 선언·캡처 한계·
  CORS 로 못 잰 원격 이미지 등 전부 이 절에.
- PASS 기록은 호출자의 처방문/산출물 문서에 `§ Render QA` 로 append
  된다 (매트릭스·관측성 표 포함) — append 위치는 호출자 소유.

## §4 — 경계 (division of labor)

- **이 스킬 소유**: 렌더 실측 실행 + 판정 + 보고서. 하네스와
  render-qa.md 정본 관리 (하네스 자신도 검사 대상이다 — F36 선택자
  오탐 · F38 색 파서 오독 · F39 표 비동기의 계보를 기억하라).
- **호출자 소유**: 처방·빌드·수리·PASS 기록 append. REVISE 를 받고
  무엇을 고칠지는 호출자의 판단이다 (단 RQ2↔RQ2-OBS 양방향 실패 =
  스크림이 아니라 구도 문제라는 힌트는 보고서가 준다).
- **규칙 정본 인용**: 대비 하한은 ui-ux-pro-max Priority 1, 회색 글자
  금지는 `impeccable` [[impeccable]] V8-04, 씬 계약은
  [[image-prescription]], 폭 기하는 [[grid-prescription]] — **규칙은
  인용하고 실행은 이 스킬이 소유한다**.
- **`component-consulting-v3`** [[component-consulting-v3]]: 처방
  시점 정적 검사(Step 7)까지가 그쪽 소유. "the consultant stops at
  the prescription" 은 이 분리로 참이 됐다.

## §5 — 하네스 조정 의무 (페이지별 2가지)

`scripts/render-qa-harness.js` 머리의 두 값은 페이지마다 다르다 —
조정했으면 보고서에 기록한다:

1. **SCRIM 표** — 페이지의 `.sc-*` 스크림 구조 복제본. CSS 를 수리하면
   이 표를 같이 고친다 (동기화 의무 — F39). 장기 해법: 스크림 알파를
   CSS 커스텀 프로퍼티로 노출해 `getComputedStyle` 로 읽기.
2. **DECLARED_WIDTH_TOKENS** — 프로젝트 폭 토큰 수 (G1).
