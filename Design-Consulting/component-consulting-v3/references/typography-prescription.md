# Typography Prescription — 폰트 semantic 처방 레이어

> **존재 이유 (2026-08-28).** 실전 1호에서 이 레이어의 부재가 낳은 실측:
> 한 페이지에 **임의 font-size 19종**(11 · 11.5 · 12 · 12.5 · 13 · 13.5 ·
> 14 · 14.5 · 15 · 15.5 · 17 · 17.5 · 18 · 19px + clamp 변형들) + 고딕·명조
> 혼용 — "size invented inline" 안티패턴의 전형. 전문 UX/UI 가 목업 전에
> 폰트 정의 시트만 몇 주씩 깎는 이유가 바로 이 레이어다. 색의 폐집합 법
> (visual-identity V2)과 동급의 **블로킹 레이어**로 신설한다.
>
> **원천**: typescale.com (8 비율 체계) · designcode.io Typographic Scales
> (맥락별 비율·6단계·반응형) · Material 3 type-scale tokens (역할 토큰
> 분류) · KRDS 한국 정부 디자인시스템 (400/700 2무게 표준) · Pretendard
> (9무게 가변, 한국 웹 사실상 표준 — orioncactus/pretendard) · 내부 정본
> `hallym-ppt-v2-DESIGN.md` (Pretendard 단일 + weight ladder 로 72장) ·
> impeccable typography (reflex 기각 절차·단계비 ≥1.25).

**발동**: Step 2 에서 visual-identity 와 함께 — DESIGN.md 없으면 이
절차로 도출→emit, 있으면 그 typography 를 소비하되 T6 감사는 항상 실행.

---

## T1 — 패밀리 법: 단일이 기본값이다

1. **웹의 기본값은 고딕(산세리프) 단일 패밀리다.** 한국 웹 관행(KRDS ·
   토스류 프로덕트 · Pretendard 생태계)과 글로벌 관행("same family,
   different weights — foolproof, used by most major products") 이 일치
   한다. 내부 정본 hallym-ppt-v2 도 Pretendard 하나로 72장을 만든다.
2. **고딕·명조 혼용은 기본 금지.** 세리프(명조) 도입은 "증명 의무" —
   잡지형 에디토리얼 같은 명시적 편집 디자인 의도가 R2 장르에서 도출될
   때만, display 전용으로, 본문 침투 금지 조건으로 허용한다. "분위기"는
   사유가 아니다.

   > **impeccable 오버라이드 선언 (v3.4 — F9 동인, 2회 실전에서 충돌
   > 재현).** impeccable `typography_rules` 는 *"DO NOT use only one
   > font family… Pair a distinctive display font with a refined body
   > font"* 라고 하고, 본 T1 은 단일 패밀리를 기본값으로 세운다 —
   > **정면 충돌이며, 이 프로젝트에서는 T1 이 이긴다.** 근거: (a) 한국
   > 웹 정본(KRDS·Pretendard 생태계·hallym-ppt-v2 72장)과 본문-한국어
   > 페이지의 혼종 폴백 위험(V3 L4) (b) T1 은 실측 부채(임의 크기
   > 19종)를 동인으로 이 OS 안에서 나중에 쓰인 정본. **impeccable 에서
   > 승계하는 블록**: `reflex_fonts_to_reject` ·
   > `font_selection_procedure` Step 1–4 · slop bans · "vary across
   > projects". **오버라이드하는 블록**: "pair display+body" 조항
   > (특히 CJK 본문 페이지). 라틴 전용 display 를 순수 라틴 문자열
   > (워드마크·수치)에만 얹는 절충은 L4 가 허용하는 합법 경로로 남는다
   > — 채택 시 그 경계를 역할 시트에 명시할 것.
3. **가변(variable) 폰트 우선.** 무게 사다리가 곧 위계 수단이므로
   100–900 축을 가진 가변 폰트(Pretendard Variable 등)가 정답에
   가깝다. 단일 무게(400뿐) 페이스는 사다리를 못 만들므로 시스템
   패밀리 자격이 없다.
4. **혼종 폴백 금지** (visual-identity V3 승계): 본문 언어 글리프를 못
   덮는 패밀리는 그 언어 문자열에 쓸 수 없다. mono 는 코드·ID 등 기계
   문자열 전용 기능 스택(system mono)으로만.

## T2 — 스케일 법: 비율 하나, 사다리 하나, 예외 없음

1. **비율을 하나 선정한다** (typescale.com 체계):

   | 비율 | 이름 | 맥락 (designcode.io 매핑) |
   |---|---|---|
   | 1.067 / 1.125 | Minor/Major Second | 밀집 대시보드·모바일 (저대비) |
   | 1.200 / 1.250 | Minor/Major Third | **문서·프로덕트·에디토리얼 (중대비)** |
   | 1.333 | Perfect Fourth | 웹/앱 범용 인기 비율 |
   | 1.414 / 1.5 / 1.618 | Aug 4th / Perfect 5th / Golden | 마케팅·히어로 (고대비, 대화면) |

2. **base(본문) 크기에서 비율로 상하 전개**해 사다리 토큰을 만든다
   (`--fs-s, --fs-0 … --fs-7`). 역할 시트가 실제로 쓰는 단계는 **5–8개**
   (designcode: 헤딩 5 + 본문). 
3. **모든 `font-size` 는 사다리 토큰 참조여야 한다. 인라인 크기 발명 =
   위반.** "Define the scale once as CSS custom properties and reference
   them everywhere, so a size never gets invented inline."
4. **반응형도 사다리 안에서**: `clamp(하위스텝, vw, 상위스텝)` — clamp 의
   양 끝이 사다리 토큰이 아니면 위반. 필요시 브레이크포인트별 제2 비율
   (designcode) — 그것도 시트에 선언하고서만.

## T3 — 역할 시트 법: 시트가 목업보다 먼저다

Material 3 의 역할 토큰 방식: 크기를 직접 쓰지 않고 **역할**을 쓴다.
역할 = `{family, size-step, weight, line-height, letter-spacing}` 묶음.

최소 역할 세트 (M3 taxonomy 축약):

| Role | step | weight | lh | ls |
|---|---|---|---|---|
| display | 상위 2단 (clamp) | 최대무게 | 1.05–1.2 | 음수 최대 |
| headline | 중상위 | 상위무게 | 1.2–1.3 | 음수 |
| title | +1~2 | 중상위 | 1.3 | 미세 음수 |
| body / body-strong | base | 400 / 700 | 1.6–1.8 | 0 |
| label | −1단 | 700 | 1.4–1.5 | 한글 ≤.03em |
| caption/meta | −1단 | 400 | 1.4 | 0 |
| figures(수치) | 상위 (clamp) | 최대무게 | 1.05 | 음수 |

**이 시트를 design.md `typography:` 스키마로 emit 하는 것이 Step 2 의
산출물이다** — 컴포넌트 처방(Step 3~)은 시트 확정 후에만 진행한다.
전문 디자이너가 목업 전에 이 시트를 몇 주 깎는 이유: 시트가 흔들리면
이후의 모든 화면이 각자 크기를 발명하기 시작하고, 그 결과가 임의 19종
이다.

## T4 — 무게 사다리 법

- 위계의 1차 수단은 **weight** 다 (같은 크기 안에서 400↔700 로 위계).
  KRDS 표준은 regular 400 + bold 700 **2무게** — 무게 종수도 감산 대상.
- 페이지 전체 무게 종수 **≤4** (예: 400/700/800). 인접 위계는 size 나
  weight 중 **한 축**의 이동으로 구분 가능해야 한다.

## T5 — 페어링 법 (lh·ls 는 크기의 함수)

- line-height 는 역할 고정값: body 1.6–1.8 · heading 1.2–1.3 · display
  1.05–1.2. 크기가 커질수록 lh 는 내려가고 ls 는 음수로 커진다.
- 본문 행길이 45–75자(`ch`/`--w-prose`) — lh 와 행길이는 짝이다.
- 한글 ls 규칙은 visual-identity V4 승계 (장평 트래킹 금지).

## T6 — 감사 (실행 가능해야 법이다)

```bash
grep -oE "font-size:[^;}]+" page.html | sort | uniq -c
```

- 추출된 모든 값이 사다리 토큰(또는 사다리 양끝 clamp)인가 → **밖의 값
  1개라도 있으면 NO-GO**
- 로드된 패밀리 수 (link/@font-face) = 시트 선언과 일치하는가 (기본 1)
- `font-weight` 종수 ≤4 인가 — **그리고 시트가 선언한 무게 집합과
  일치하는가** (선언 밖 무게의 침투도 위반이다)
- lh 가 역할 범위 안인가, 본문 행길이 ≤75자인가
- **reject 목록 원문 대조 (v3.4 — F10)**: 선정 패밀리 전량(폴백·부모
  패밀리 포함)을 impeccable `reflex_fonts_to_reject` **원문을 열어**
  대조했는가 — 기억 대조 금지 (실측: 부모 패밀리 등재를 기억으로는
  놓칠 뻔했다)
- **역할 바인딩 감사 (v3.4 — F19/D1)**: 사다리 멤버십만으로는 위계
  역전을 못 잡는다 (실측: 카운트업 숫자가 fs-1, 단위가 fs-4 — 전부
  사다리 안 값인데 강조가 뒤집힘). 의미 페이로드 요소(핵심 수치·표제·
  판정어)가 **역할 시트의 해당 역할**(figures/display)로 렌더되는지
  대조한다 — 수치 요소의 computed size ≥ 인접 라벨/단위, figures 무게
  적용. 육안 확인은 render-qa RQ3 의 데이터 강조 항목과 페어.

## Self-check (SKILL §2 Step 8 병합분)

- 사다리 밖 font-size **0개**인가 (T6 grep 실측)?
- 패밀리가 단일인가 — 둘째 패밀리가 있다면 편집 의도가 R2 에서 증명되고
  display 전용으로 격리됐는가?
- 역할 시트가 design.md typography 로 emit 됐고, 모든 요소가 역할을
  통해서만 크기를 받는가?
- 무게 종수 ≤4, lh/ls 페어링 준수, CJK(V4) 준수?
