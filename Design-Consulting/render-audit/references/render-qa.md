# Render QA — 렌더 실측 4계층 (render-audit 정본 규칙)

> **소유 (v3.6, 2026-08-30).** 이 파일은 `render-audit` [[render-audit]]
> 스킬의 정본 규칙이다. v3.0–v3.5 동안 `component-consulting-v3`
> `references/render-qa.md` (Step 7.5) 였고, v3.6 에서 검사관 직무
> 분리와 함께 이관됐다 — 발동·모드(full 기본)·출력 규율은 render-audit
> SKILL.md 가, 계층별 판정 기준은 이 파일이 정본이다.

> **존재 이유 (2026-08-28).** 실전 1호(한림 AI교육 리뷰 무기고 페이지)에서
> 저자가 육안으로 잡아낸 결함 3건 — 부유 도형이 고정 nav·콘텐츠와 겹침,
> blend 섹션 텍스트가 이미지에 묻힘(V8-04 "밝은 사진 위 회색 글자 금지"
> 위반), 라이트 지면 3연속 단조 — 를 **빌드의 어떤 정적 검사도 잡지
> 못했다.** Step 7 은 코드를 읽고, 이 결함들은 **렌더된 픽셀**에서만
> 존재한다. 그래서 렌더 실측 레이어가 따로 필요하다.
>
> **권한 배분**: `impeccable` [[impeccable]] 과 `ui-ux-pro-max` 는 *규칙의
> 정본*이다 (대비 하한·회색 글자 금지·배너 블라인드). 그러나 둘 다 실행
> 검사기가 아니다 — **규칙은 인용하고, 실행은 v3 가 소유한다.** 이것이
> 이 레이어가 "연계" 가 아니라 "신설" 인 이유다.

**발동**: render-audit SKILL §0 — (1) component-consulting-v3 처방문의
§ Render QA 인수인계 계약 (그쪽에서는 Step 7 정적 검증 통과 + 빌드가
로컬 프리뷰에서 렌더된 직후), (2) OS 안의 모든 프론트엔드 빌드의 완료
선언 직전, (3) 사용자 직접 호출. **빌드 없는 처방-전용 모드에서는
스킵을 선언**하고, 빌드 세션이 열리면 그 세션이 이 레이어를 승계한다.
게이트 등급: **밀도 하한과 동급 블로킹** — 위반 발견 시 REVISE 루프
(소스 수리 → 재검사), PASS 전에는 산출물을 완료로 선언하지 않는다.

**스킴 의무 (v3.4 — F15)**: 페이지가 다크 스킴을 배선했다면 **RQ1·RQ2·
RQ3 전부 라이트/다크 두 스킴에서** 실행한다 — 초판은 RQ3 만 2스킴이었고,
그 비대칭 속에서 다크 전용 위반(onink-key 반전 3.7:1, 수리의 다크 역효과
1.01:1)이 우연으로만 잡혔다. 검사 시 트랜지션을 끄고 측정한다
(`*{transition:none}` 주입 — pane 미표시 상태에서 트랜지션이 동결되어
측정을 오염시킨 실측).

3계층이며 순서대로 실행한다 — 싼 검사가 먼저, 비싼 검사가 나중이다.

**실행 하네스 (v3.5, v3.6 이관)**: 정본은 이 스킬의
`scripts/render-qa-harness.js` — 프리뷰에서 로드 후 `RQ1()` ·
`await RQ2ALL()` · `await RQOBSALL()`. 부록의 임베드 스크립트는 이동식
폴백이며, **둘을 고치면 같이 고친다**. 하네스 자체도 검사 대상이다 —
실전 3호에서 하네스 결함 3건(F36 선택자 오탐 · F38 색 파서 오독 · F39
스크림 표 비동기)이 거짓 위반 9건과 거짓 FAIL 13건을 만들어 진짜 위반을
묻었다. 거짓이 많으면 실행자가 목록 전체를 불신한다.

---

## RQ1 — 구조 검사 (결정론 · getBoundingClientRect)

브라우저에서 JS 로 실측한다 (부록 하네스). 전부 이분 판정 — 모델의
심미 판단이 개입하지 않는다.

| # | 검사 | 위반 조건 |
|---|---|---|
| RQ1-1 | **blend 침범** | `blend-left/right` 섹션에서 텍스트 블록 bbox 의 수평 중심이 **이미지 마스크 쪽 절반**에 위치 (blend-left → 좌반, blend-right → 우반). 텍스트는 마스크 반대편이 계약이다 (image-prescription I2) |
| RQ1-2 | **무-트리트먼트 층1 위 텍스트** | 트리트먼트 층(`::after` 스크림) 없는 raw 배경 요소(무필터 crop-shape 포함) 내부에 텍스트 노드 존재. 크롭은 텍스트 비허용 컨테이너다 |
| RQ1-3 | **도형-콘텐츠 겹침** | absolute/부유 장식 도형(behind-shape·crop 계열·`aria-hidden` 장식)의 bbox 가 텍스트·표·카드 bbox 와 교차 (safe-zone [[image-prescription]] I2.6). **전면 배경 레이어는 제외 (v3.4 — F16)**: 요소 면적이 소속 섹션의 ≥85% 이고 z-order 가 콘텐츠 아래면 "배경"으로 분류 — safe-zone 은 섹션보다 작은 유계 도형에만 적용된다. 의사요소 배경(`::before/::after`)과 DOM 배경을 같은 규칙으로 취급 (검출 여부가 구현 방식에 흔들리면 규칙이 아니라 사고다 — 실측 오탐 15건) |
| RQ1-4 | **fixed-nav 경로** | 부유 도형이 섹션 상단에서 고정 nav 밴드 높이(nav bottom + 24px) 안에서 시작 (I2.6-1) — RQ1-3 과 같은 배경 레이어 제외 적용 |
| RQ1-5 | **슬라이드 단위 실측** | 예외 미선언 섹션의 렌더 높이 < `100svh × 0.98` (SKILL Step 5 슬라이드 단위 법) |
| RQ1-6 | **밝기 3연속** | 섹션 배경 실측 휘도를 **페이지-상대 정규화(min–max → 3분위)** 로 D/M/L 분류했을 때 동일 밝기 3연속 (I4 v3.4) — **두 스킴 각각** 검사. 절대 임계 분류는 라이트 스킴 근사로만 허용 |
| RQ1-7 | **가로 스크롤** | `document.documentElement.scrollWidth > clientWidth` — 375 / 768 / 1440 3폭 전부 |
| RQ1-8 | **에지 정렬·충전 (v3.4 — [[grid-prescription]] G2·G3)** | 섹션 콘텐츠 박스 좌 에지의 고유 x 값(±2px 클러스터) 개수 > 선언 폭 토큰 수 — 표류 섹션 존재. 그리드 컨테이너 실폭 대비 트랙+갭 합 < .96 — 미충전 |
| RQ1-9 | **리크롭 배선 (v3.5 — F41)** | 모바일 폭에서, `--raw-pos-m` 를 선언한 씬 섹션의 층1 `background-position` 계산값이 선언값과 불일치 — 그리고 선언 총수를 처방문 씬 테이블과 대조(선언 N ≠ 처방 N = 위반). "emit 은 검사하는데 바인딩은 검사 안 한다"의 3번째 재발(F19 역할 시트 · F20 비트 필드 · F41 리크롭)이 이 항목의 존재 이유 — 실측: `--raw-pos-m` 8행을 처방 테이블에 적고 Step 8 을 통과한 채 빌드에 하나도 배선하지 않았다 |

**선택자 계약** (빌드가 지켜야 하네스가 잡는다): 씬 섹션은
`raw5-*`/`band--*` 클래스를, 장식 도형은 `aria-hidden="true"` 를,
슬라이드 단위 예외는 `data-slide-exempt` 를 선언한다. 계약을 안 지킨
빌드는 RQ1 을 통과한 것이 아니라 **검사를 회피한 것**이다.

## RQ2 — 픽셀 대비 실측 (canvas · localhost same-origin)

구조가 통과해도 스크림 농도가 얕으면 글자는 묻힌다. 텍스트 뒤 **유효
배경**(이미지 픽셀 × 스크림 알파 합성)의 휘도를 canvas 로 샘플링해
대비율을 계산한다 — localhost 프리뷰는 same-origin 이라 가능하다
(원격 이미지는 CORS 로 불가 — 프리뷰 서버에서 실행하는 이유).

- **절차 0 — 배경 스택 수집 (v3.5, F37)**: 텍스트에서 섹션까지 조상을
  올라가며 배경을 모은다. **불투명(α≥.98) 배경을 만나면 씬 샘플링 없이
  그 색으로 정확 계산한다**(= `solid` — 근사가 아니라 실측이므로 FAIL 은
  즉시 수리 대상). 반투명 패널은 씬 픽셀 위에 순서대로 합성한다
  (= `scene+panel`). 실측: 이 구분이 없던 초판은 카드
  (`background:var(--paper)`) 뒤의 이미지를 샘플링해 종이 위 글자를 "씬
  위 글자"로 오판했고, solid/scene 분리가 생기자 수리 우선순위가 비로소
  정해졌다.
- **절차**: 대상 텍스트 bbox → 그 뒤 배경 이미지의 대응 영역을 canvas
  에 그리기 → 스크림 그라디언트/오버레이를 합성(다크 스크림이 CSS 에서
  `mix-blend-mode:multiply` 면 canvas 도 `multiply` 로 — source-over
  근사보다 충실) → 영역 내 **최악(밝은 배경 위 밝은 글자면 최대, 어두운
  글자면 최소) 휘도 픽셀** 기준으로 텍스트 색과 WCAG 대비율 계산.
- **동기화 의무 (v3.5, F39)**: 스크림 파라미터는 CSS 와 샘플러 표 두
  곳에 존재한다. **CSS 를 수리하면 샘플러 표를 같이 고친다** — 고치지
  않으면 수리 후에도 같은 수치가 나오며, 그것을 "수리가 안 먹혔다"로
  오독하게 된다 (실측 3회 반복). 장기 해법: 스크림 알파를 CSS 커스텀
  프로퍼티로 노출해 샘플러가 `getComputedStyle` 로 읽기.
- **하한 (ui-ux-pro-max Priority 1 인용)**: 본문 **≥ 4.5:1** · 대형
  텍스트(24px+ 또는 18.66px bold+) **≥ 3:1**. 씬 위 텍스트는
  image-prescription I2 의 상향 목표(**≥ 7:1**)를 권장치로 함께 리포트.
- 판정은 **최악 픽셀**로 한다 — 평균은 그라디언트 스크림에서 거짓
  안심을 준다.
- 근사의 방향성: source-over 균일-최소-알파 근사는 실제(방향성
  그라디언트·multiply)보다 배경을 **밝게** 계산하므로, 밝은-글자-
  다크-스크림과 텍스트-쪽-고농도-blend 에서 대비를 **과소평가**한다
  — 즉 근사는 **엄격한 쪽으로 치우친 필터**다(거짓 경보 있음, 거짓
  통과 희박). 근사 FAIL = 즉시 결함이 아니라 **RQ3 육안 회부 대상**;
  근사 PASS 는 신뢰한다. 단, 이미지·스크림 없이도 정적 색상만으로
  하한 미달인 건(예: faint 라벨 3.8:1)은 근사가 아니라 실측이다 —
  즉시 수리.

## RQ2-OBS — 씬 관측성·커버리지 회계 (v3.5 신설 — F42·F43·F45)

> **존재 이유 (실전 3호, 저자 육안 발견).** RQ2 는 "글자가 읽히는가"만
> 재고, 그 검사는 **스크림을 올리는 쪽으로만** 당긴다. 반대 방향
> ("이미지가 살았는가", I1.5)은 육안 항목뿐이라 이 압력을 못 이긴다 —
> 실측: RQ2 수리 4루프 동안 스크림이 단조 상승(luma 55/72%→84%)해 씬
> 2곳이 죽었고, 다크 스킴 실효 무텍스처가 **9/15** 까지 불었는데 아무
> 게이트도 안 울렸다. 처방상 무이미지는 3곳이었다 — 라벨을 세는 동안
> 지면이 비어 간 것이다. RQ2 와 이 검사가 **양쪽에서 조여야** 스크림
> 값이 수렴한다.

RQ2 와 같은 합성 캔버스에서 섹션별 **텍스처 에너지**(휘도 표준편차
×1000)를 잰다. 실행: `RQOBSALL()` — **두 스킴 각각**.

- **관측 판정**: sd < **8** 이면 그 지면은 사실상 평면이다 (경험 임계 —
  실전 3호 1런 보정값, 재보정 시 기록). 배경이 무이미지라도 **콘텐츠
  이미지**(인라인 `<img>`·crop 도형, bbox >10,000px²)가 실재하면 textured
  로 회계한다.
- **커버리지 회계 (F42)**: 처방문에 "무이미지 N/총" 을 명기하고, 빌드 후
  스킴별 실효 저질감 수를 실측한다. **상한: 실효 저질감 ≤ ⌈총/3⌉** —
  초과 = REVISE. I1.5-4 의 "연속 2 초과 재심사"는 라벨 기준이라 단독
  배치로 우회된다 — 이 회계는 총량·실효 기준이다.
- **질감 런 (F45)**: 실측 저질감 **3연속 = 위반** — 기법 라벨이 다양해도
  픽셀이 같은 "빈 지면"이면 독자에게는 단조다 (실측: 라벨은
  card-window/luma/무/wash012 로 다양한 구간이 픽셀로는 {0·8.9·1.9·0·0.6}
  이었다). 밝기 축(RQ1-6)·기법 라벨 축(I4)과 독립인 **제3축**이다.
- **한계 (기록)**: horizon 기법의 상부 평면은 계약(착지감)이라 전-섹션
  sd 가 하부 띠로 부풀 수 있다 — 시퀀스 육안(RQ3)이 보완한다.
- **전면 면제 (v3.6 — H6)**: 씬 처방 자체가 스킵 선언된 **순수 문서형
  페이지**(image-prescription Step 3.5 스킵 선언과 연동 — 레퍼런스
  문서·법적 고지·긴 산문 등 R2 장르 판정이 근거)는 RQ2-OBS 를 통째로
  면제한다 — 무이미지가 설계값인 지면에 커버리지 상한을 적용하면
  게이트가 이미지를 강요하는 역방향 하네스가 된다. 면제는 **선언으로만**:
  처방문/호출 계약에 `RQ2-OBS exempt: 문서형 (R2 근거)` 를 명기하고,
  검사 보고서 "Not reviewed" 절에 기재한다. 선언 없는 미실행은 면제가
  아니라 검사 회피다.
- **임계 재보정 (v3.6 — H6)**: sd < 8 은 실전 3호 1런의 경험 보정값이다
  — 페이지의 씬 재료(블러 강도·스크림 농도·이미지 콘트라스트)에 따라
  재보정할 수 있되, (a) 재보정 값 + 근거(그 페이지의 sd 실측 분포)
  (b) 재보정으로 판정이 바뀌는 섹션 목록을 보고서에 기록한다
  (`RQOBS({threshold: n})`). 임계를 조용히 낮춰 PASS 를 사는 것은
  재보정이 아니다.

위반 = REVISE. 단 **수리 방향이 RQ2 와 반대**임을 기억하라: 스크림을
내리면 RQ2 가, 올리면 RQ2-OBS 가 문다. 양쪽 다 통과 못 하는 지점이
나오면 스크림이 아니라 **구도**가 문제다 — 텍스트에 지면 패널을 주거나
(V8-05), `--raw-pos` 로 이미지의 조용한 영역을 텍스트 뒤로 옮긴다
(실전 3호 `#collective`·`#frame` 실증).

## RQ3 — 멀티모달 스크린샷 순회 (모델 육안)

이번 결함들을 실제로 잡아낸 것은 저자의 눈이었다 — 그 검수를
자동화한다. **섹션별 캡처를 라이트/다크 두 스킴 모두** 순회하며 모델이
육안 판정한다 (다크 스킴 누락이 실전 1호의 알려진 부채였다).

**순회 매트릭스 기록 의무 (v3.5 — F46).** RQ1·RQ2 는 위반 카운트라는
증적이 남지만 RQ3 는 증적 규약이 없어 "전부 재확인"이 선언만으로
통과된다 — F20 의 법칙("검사 없는 규칙은 실행 분산 앞에서 확률적으로만
지켜진다")이 **QA 층 자신에 적용된 사례**다. 실측: 실전 3호에서 다크
순회를 2섹션+스팟으로 갈음하고 "통과 (…등)"이라 기록했으며, 저자가
결함을 잡은 구간은 정확히 미순회 구간이었다. 따라서:

- **섹션 × 스킴 매트릭스**를 처방문 § Render QA 에 기록한다 — 순회한
  칸에만 ✓, **빈 칸 = 미실행**이다. "기록 없는 순회는 순회가 아니다."
- **캡처 충실도 규약**: 실사용 폭(≥1280 상당) 캡처 1회 이상 · 섹션
  전고(잘린 캡처로 판정 금지) · **풀페이지 다크 1회**. 프리뷰 페인이
  작아 실사용 크기를 재현 못 하면 그 한계를 매트릭스에 명기한다
  (실전 3호: 페인 464×405, 에뮬 실용 상한 1100×700 이 실측 한계였다).
- **스크롤 캡처 함정 + 우회 (v3.6 — F47 실측)**: 프리뷰 페인의 큰 에뮬
  (≥1280, 1100 포함)에서는 **스크롤 후 캡처가 본문 배경 단색으로 합성**
  된다 (DOM·visualViewport 는 정상 — 캡처 합성만 실패; JS/실입력 스크롤
  모두 동일). 정석 우회: 스크롤 0 고정 + **`body` 에
  `translateY(-section.offsetTop)`** 시프트로 대상 섹션을 뷰포트로
  끌어와 캡처하고, 검사 후 원복한다. fixed nav 는 시프트 캡처에
  비포함이므로 nav 겹침 판정(RQ1-4 류)은 이 캡처로 하지 않는다 — 한계를
  매트릭스에 명기.

체크리스트 (섹션마다):

- [ ] 텍스트가 이미지·도형에 묻힌 곳 없음 (V8-04: 밝은 사진 위 회색
      글자 금지 — impeccable 인용)
- [ ] 부유 도형·고정 UI·콘텐츠의 시각적 충돌 없음 (스크롤 중간 지점
      캡처 포함 — 정지 캡처가 못 보는 겹침이 스크롤에 있다)
- [ ] 인접 섹션과 밝기·질감이 구분됨 (단조 리듬은 픽셀에서 판정)
- [ ] 스크림·트리트먼트가 이미지를 죽이지 않음 (이중 하네스 징후 —
      I1.5)
- [ ] **데이터 강조 위계가 올바로 읽힘 (v3.4 — F19)**: 수치가 단위보다
      크고, 의미 페이로드가 role sheet 의 역할대로 렌더됨 — 실측: 사다리
      ·대비 검사를 전부 통과한 채 "283**시간**"(숫자 소, 단위 대)이
      배포됐고 저자 육안이 잡았다. 이 항목이 그 검수의 자동화 자리다
- [ ] **시그니처 관측성 스팟체크 (v3.4 — F22)**: 밀도 회계에 계상된
      시그니처를 하나씩 호명하며 "화면만 보고 어느 갤러리 부품인지
      알아볼 수 있는가"(recomposition 세탁 금지 조항) 확인 — 속성
      개수가 아니라 관측이 회계다
- [ ] 다크 스킴에서 위 전부 재확인 (라이트 기준 트리트먼트가 다크에서
      반전 실패하는 경우) — 콘텐츠가 JS 미실행 상태에서도 보이는지
      (진입 연출 숨김 기본값 금지, SKILL Step 7)도 이 순회에서 함께

## 게이트 · 기록

- 3계층 전부 PASS → 처방문에 **`§ Render QA`** 절을 append: 실행 폭
  3종 · RQ1 9항 결과 · RQ2 최악 대비율 표 · **RQ2-OBS 관측성 표(2스킴)와
  커버리지 회계** · RQ3 **섹션×스킴 매트릭스** · 발견-수리 이력.
- 위반 → **소스 수리** 후 해당 계층부터 재실행 (≤2 루프 권장, 3루프
  초과는 처방 자체의 결함 신호 — Step 5 배치로 회귀).
- 하네스 스크립트의 판정을 손으로 뒤집을 때는 사유를 기록한다
  (예외는 처방이지 침묵이 아니다).

---

## 부록 — RQ1 실행 하네스 (프리뷰 콘솔/javascript_tool 붙여넣기)

> **정본은 이 스킬의 `scripts/render-qa-harness.js`** (RQ1 9항 +
> RQ2/RQ2ALL + RQOBS/RQOBSALL 통합). 아래 임베드는 이동식 폴백 — 정본을
> 고치면 여기도 고친다. v3.5 에서 실측 결함 2건을 수술했다: 섹션 선택자
> (F36 — 인용 귀속용 중첩 `<footer>` 를 섹션으로 오인, 거짓 위반 9건이
> 진짜 1건을 묻음) · 색 파서 (F38 — `color-mix()` 가 계산되는
> `color(srgb 0.61 …)` 의 0–1 성분을 0–255 로 오독, 8.2:1 을 1.67:1 로
> 보고. **그럴듯한 거짓 FAIL 이라 진짜로 믿고 수리하게 된다**).

```js
(() => {
const V = [];
const nav = [...document.querySelectorAll('*')].find(e =>
  getComputedStyle(e).position === 'fixed' && e.getBoundingClientRect().top < 80 &&
  e.offsetHeight > 20 && e.offsetHeight < 120);
const navBand = nav ? nav.getBoundingClientRect().bottom + 24 : 0;
// F36: 페이지 수준 섹션만 — 중첩 <footer>/<section>(인용 귀속 등)은 섹션이 아니다
const secs = [...document.querySelectorAll('main > section, main > header, main > footer')];
const lum = (r,g,b) => { const f = v => { v/=255; return v<=.03928? v/12.92 : ((v+.055)/1.055)**2.4 };
  return .2126*f(r)+.7152*f(g)+.0722*f(b) };
// F38: 레거시 rgb()/rgba() 와 modern color(srgb r g b / a) 모두 파싱
const toRGBA = s => { if (!s) return null; const m = s.match(/[\d.]+(?:e-?\d+)?/g);
  if (!m) return null; const mod = /^color\(/.test(s.trim());
  let r = +m[0], g = +m[1], b = +m[2]; const a = m.length > 3 ? +m[3] : 1;
  if (mod) { r *= 255; g *= 255; b *= 255 } return { c: [r,g,b], a } };
const bgLum = el => { let e = el, c = null;      // alpha 0 이면 조상으로 (배경 미지정 섹션 = body 지면)
  while (e) { const q = toRGBA(getComputedStyle(e).backgroundColor);
    if (q && q.a > 0) { c = q.c; break } e = e.parentElement }
  c = c || [255,255,255];
  return lum(c[0],c[1],c[2]) };
const textBlocks = s => [...s.querySelectorAll('h1,h2,h3,h4,p,li,td,th,summary,.txt')]
  .filter(t => t.offsetHeight > 0 && t.textContent.trim().length > 2);
// 텍스트 "잉크" 실범위 — 블록 bbox 는 좌측 정렬 짧은 텍스트를 과대측정한다
const inkRect = t => { const r = document.createRange(); r.selectNodeContents(t);
  const b = r.getBoundingClientRect(); return b.width ? b : t.getBoundingClientRect() };
// RQ1-1 blend 침범
secs.filter(s => /raw5-blend/.test(s.className)).forEach(s => {
  const left = /blend-left/.test(s.className), r = s.getBoundingClientRect();
  textBlocks(s).forEach(t => { const tb = inkRect(t), cx = (tb.left+tb.right)/2;
    const inMask = left ? cx < r.left + r.width/2 : cx > r.left + r.width/2;
    if (inMask) V.push(['RQ1-1', s.id||s.className, t.tagName+': '+t.textContent.slice(0,30)]); });
});
// RQ1-2 무-트리트먼트 층1 위 텍스트 (crop 계열)
[...document.querySelectorAll('[class*="crop-"],[class*="crop "],.crop')].forEach(c => {
  if (c.textContent.trim().length > 2) V.push(['RQ1-2', c.className, c.textContent.slice(0,30)]);
});
// RQ1-3/4 부유 도형 safe-zone — 전면 배경 레이어(섹션 ≥85% 면적, 콘텐츠 아래)는 제외 (v3.4)
[...document.querySelectorAll('[aria-hidden="true"]')].filter(d => {
  const p = getComputedStyle(d).position;
  if (!((p==='absolute'||p==='fixed') && d.offsetWidth > 60)) return false;
  const sec = d.closest('section, header, footer'); if (!sec) return false;
  const db = d.getBoundingClientRect(), sb = sec.getBoundingClientRect();
  const cover = (db.width*db.height) / Math.max(1, sb.width*sb.height);
  return cover < .85;   // 배경 레이어는 safe-zone 대상 아님
}).forEach(d => {
  const db = d.getBoundingClientRect();
  const sec = d.closest('section, header, footer'); if (!sec) return;
  const sb = sec.getBoundingClientRect();
  if (navBand && db.top - sb.top < navBand - sb.top + 0.5 && db.top - sb.top < 120)
    V.push(['RQ1-4', d.className, 'starts in nav band']);
  textBlocks(sec).forEach(t => { const tb = t.getBoundingClientRect();
    if (t.contains(d)||d.contains(t)) return;
    if (tb.left < db.right && tb.right > db.left && tb.top < db.bottom && tb.bottom > db.top)
      V.push(['RQ1-3', d.className, 'overlaps '+t.tagName+': '+t.textContent.slice(0,30)]); });
});
// RQ1-5 슬라이드 단위
const svh = window.innerHeight;
secs.forEach(s => { if (s.dataset.slideExempt !== undefined) return;
  if (s.offsetHeight < svh * .98)
    V.push(['RQ1-5', s.id||s.className.slice(0,40), Math.round(s.offsetHeight)+'px < '+Math.round(svh*.98)]); });
// RQ1-6 밝기 3연속 — 페이지-상대 정규화 (v3.4): min–max → 3분위. 두 스킴 각각 실행
const lums = secs.map(bgLum);
const mn = Math.min(...lums), mx = Math.max(...lums), span = Math.max(1e-6, mx-mn);
const bands = secs.map((s,i) => { const t = (lums[i]-mn)/span;
  return { s: s.id||s.className.slice(0,28), b: t < 1/3 ? 'D' : t < 2/3 ? 'M' : 'L' } });
for (let i = 2; i < bands.length; i++)
  if (bands[i].b === bands[i-1].b && bands[i].b === bands[i-2].b)
    V.push(['RQ1-6', bands[i-2].s+'→'+bands[i].s, bands[i].b+' ×3']);
// RQ1-7 가로 스크롤
if (document.documentElement.scrollWidth > document.documentElement.clientWidth)
  V.push(['RQ1-7', 'document', document.documentElement.scrollWidth+'>'+document.documentElement.clientWidth]);
// RQ1-8 에지 정렬 (grid-prescription G2) — 섹션 콘텐츠 박스 좌 에지 클러스터
// 콘텐츠 박스 선택: .wrap 우선, 없으면 배경 레이어(aria-hidden)가 아닌 첫 div
const edges = [];
secs.forEach(s => { const w = s.querySelector(':scope > .wrap')
    || [...s.children].find(c => c.tagName === 'DIV' && !c.hasAttribute('aria-hidden'));
  if (!w) return; const x = Math.round(w.getBoundingClientRect().left);
  if (!edges.some(e => Math.abs(e - x) <= 2)) edges.push(x); });
const DECLARED_WIDTH_TOKENS = 3;   // 프로젝트의 폭 토큰 수로 조정 (wide/content/prose 기본 3)
if (edges.length > DECLARED_WIDTH_TOKENS)
  V.push(['RQ1-8', 'edges', edges.length + ' unique edges > ' + DECLARED_WIDTH_TOKENS + ' tokens: ' + edges.join(',')]);
// RQ1-9 리크롭 배선 (v3.5 — F41): 모바일 폭에서 --raw-pos-m 선언 vs 계산값
let rposmDeclared = 0;
const normPos = v => { const t = v.replace(/center/g,'50%').replace(/top|left/g,'0%')
  .replace(/bottom|right/g,'100%').trim().split(/\s+/); if (t.length===1) t.push('50%');
  return t.join(' ') };
secs.forEach(s => { const st = s.getAttribute('style') || '';
  const m = st.match(/--raw-pos-m:\s*([^;"]+)/); if (!m) return; rposmDeclared++;
  if (window.innerWidth > 767) return;
  const got = getComputedStyle(s,'::before').backgroundPosition;
  if (normPos(m[1]) !== normPos(got))
    V.push(['RQ1-9', s.id, 'declared ' + m[1].trim() + ' vs computed ' + got]); });
return { violations: V, brightness: bands.map(x => x.b).join(''), edges, n: V.length,
  rposmDeclared };   // 선언 수를 처방문 씬 테이블과 수동 대조할 것
})()
```

밝기 분류의 경계값(.18/.55)과 텍스트 블록 선택자는 프로젝트 실정에
맞게 조정 가능 — 조정했으면 기록한다. RQ2 캔버스 샘플러는 페이지별
스크림 구조에 종속되므로 정형 스크립트 대신 위 절차 규약을 따라
세션에서 작성한다.

## See Also

[[render-audit]] (SKILL — 발동·모드·출력 규율) ·
[[component-consulting-v3]] (처방 측 — Step 7.5 인수인계 계약) ·
[[image-prescription]] (I2.6 safe-zone · I4 밝기 교대) · [[fit-rubric]]
(Layout-rhythm pass — 처방 시점 검사, 본 레이어는 렌더 시점 실측) ·
`impeccable` [[impeccable]] · `ui-ux-pro-max` (대비 Priority 1 정본)
