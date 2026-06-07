# 08_HARNESS_QA_AND_PATCH_RULES.md

# Harness QA & Patch Rules v4

하네스는 “반복 가능한 제작 라인”이다. 같은 요청을 다른 AI가 받아도 비슷한 품질을 내도록, 실패를 금지 규칙과 패치 규칙으로 고정한다.

---

## 1. Absolute No-Harness

아래 항목은 절대 만들지 않는다.

### 1-1. 왼쪽 하단 TOC / 번호 줄

금지:

- 왼쪽 하단에 슬라이드 번호를 늘어놓기
- 하단 전체에 작은 번호 버튼 만들기
- table of contents rail
- slide thumbnail strip
- page dots

강제:

```css
#toc,.toc,.slide-index,.thumb-strip,.slide-dots,.page-list{
  display:none!important;
  visibility:hidden!important;
  pointer-events:none!important;
}
```

### 1-2. 항상 보이는 네비게이션

금지:

- 우측 하단 네비가 계속 보이는 것
- 화면을 가리는 큰 컨트롤러

강제:

- 이동 직후에만 보이고 0.9~1.2초 후 사라진다.
- hover 또는 touch 시 잠깐 보인다.

### 1-3. 이미지 확인 전 HTML 생성

금지:

- raw image 5장 생성 후 바로 HTML 제작
- 사용자의 “좋아 보여”를 승인으로 간주
- 수정할 이미지가 남아 있는데 HTML 제작

### 1-4. 생성 이미지 안 텍스트

금지:

- 로고
- 읽을 수 있는 간판
- 숫자
- 표
- UI 라벨
- 차트
- 프레젠테이션 문구

### 1-5. 사진 위 회색 글자

금지:

- 사진 위에 회색 본문
- 배경과 명도 차이가 작은 글자
- 얇은 폰트의 긴 문장

---

## 2. Mode별 Harness

### V7 Harness

```text
밝은 배경, 네이비 텍스트, 정보 구조 우선, 이미지는 CSS 편집 재료.
```

검사:

- `--img1~--img5` 있음
- V7 기법 recipe 적용
- 카드 배경은 밝고 정돈됨
- 이미지가 텍스트를 덮지 않음

실패:

- 너무 어두운 배경
- 이미지가 너무 강함
- 카드가 어수선함

### V8 Harness

```text
V8은 3~4개 배경 모드만 반복하는 다크 브루탈 키노트다.
```

검사:

- 모든 슬라이드에 `.bg-stage` 구조
- `.bg-full`, `.bg-treatment`, `.bg-grid`, `.slide-ui` 분리
- 모드 수가 제한됨
- 형광 그린 포인트 일관

실패:

- 디자인 기법이 너무 많음
- 유리 카드, 콜라주, 복잡한 표면 효과 남발
- 키노트가 리포트처럼 빽빽해짐

### University AX Harness

```text
AX 덱은 12컬럼 정보 그리드가 디자인이다.
```

검사:

- summary / compare / kpi / roadmap / dashboard grid 사용
- KPI는 HTML/SVG
- 이미지 보조
- 카드 높이와 span 정리

실패:

- 정보보다 사진이 강함
- 그리드가 무너짐
- 카드 높이 불균형

### Street Editorial Harness

```text
Street Editorial은 종이색 배경 + 굵은 제목 + 코랄 포인트 + 어두운 이미지 창문 카드다.
```

검사:

- 카드 안 이미지가 보임
- 사진 위 텍스트 대비 충분
- Surface FX 카드에 진짜 SVG chart
- 하프톤/그레인 효과가 글자를 해치지 않음
- 마지막 카드 안 이미지가 보임

실패:

- material card가 검은 상자
- 회색 글자라 안 읽힘
- 차트가 장식선뿐
- 하프톤이 글자를 먹음

---

## 3. Feedback → Patch Mapping

| 사용자 피드백 | 내부 원인 | 패치 위치 |
|---|---|---|
| 왼쪽 하단 번호 빼 | forbidden TOC visible | `#toc`, `.slide-index`, `.thumb-strip` 제거 |
| 네비게이션 v8처럼 숨겨 | controller always visible | `#controller` opacity + JS timer |
| 글자가 안 보여 | text contrast failure | overlay, color, shadow 수정 |
| 사진 위 회색 글씨 안 보여 | low contrast body | 흰색/검정 전환, scrim 추가 |
| 카드 안 이미지가 안 보여 | material image hidden | `::before opacity:1`, `blur(2px)`, `brightness(.55~.70)` |
| 그냥 검은 카드 같아 | scrim too strong | `::after` alpha 낮춤 |
| 그래프가 그래프 같지 않아 | fake chart | 실제 SVG polyline/bar/donut/funnel 삽입 |
| V8이 너무 복잡해 | overdesigned V8 | technique 수 줄임, card 수 줄임 |
| AX가 산만해 | grid failure | 12컬럼 span 재정렬 |
| 하프톤 글자 안 보여 | pattern over text | 텍스트 z-index, white text, shadow |
| 마지막 카드 이미지 안 보여 | final-card hidden image | `final-card::before` 밝기/blur/opacity 수정 |
| 이미지칸 빈 네모 | background shorthand reset | `background-color`로 변경, image binding 검사 |

---

## 4. CSS QA Queries

HTML을 만들고 나면 내부적으로 아래를 검색한다.

```text
#toc
.slide-index
.thumb-strip
.slide-dots
background:
background-image:none
placeholder
lorem
```

`background:`가 모두 금지는 아니다. 하지만 이미지 패널, `.imgN`, `.material-image-card::before`, `.final-card::before` 근처에 있으면 위험하다.

---

## 5. Contrast QA

사진 위 텍스트 검사:

1. 텍스트 색이 흰색 또는 검정인가?
2. 본문이 회색이면 뒤에 충분한 스크림이 있는가?
3. 텍스트 그림자가 있는가?
4. 배경 사진이 너무 밝거나 복잡하지 않은가?
5. 한 슬라이드에 너무 많은 텍스트가 사진 위에 올라가지는 않았는가?

권장 값:

```css
.photo-title{color:#fff;text-shadow:0 4px 26px rgba(0,0,0,.62);}
.photo-body{color:rgba(255,255,255,.90);text-shadow:0 3px 20px rgba(0,0,0,.56);}
.dark-scrim{background:linear-gradient(90deg,rgba(0,0,0,.86),rgba(0,0,0,.28));}
```

---

## 6. Material Card QA

합격:

- 카드 안 raw 이미지 윤곽이 보인다.
- 텍스트는 흰색으로 읽힌다.
- blur는 2~6px 정도다.
- 카드가 어두운 창문처럼 보인다.

실패:

- 카드가 그냥 검은 상자다.
- 이미지가 너무 흐리다.
- 스크림이 이미지를 완전히 막는다.

권장 패치:

```css
.material-image-card::before{
  opacity:1;
  filter:brightness(.60) saturate(.94) contrast(1.18) blur(2px);
}
.material-image-card::after{
  background:linear-gradient(180deg,rgba(5,7,10,.18),rgba(5,7,10,.46),rgba(5,7,10,.76));
}
```

---

## 7. SVG Chart QA

Surface FX 카드가 KPI 카드라면 반드시 실제 차트를 넣는다.

합격 요소:

- `<svg class="metric-chart">`
- `polyline` 또는 `path` 선형 차트
- `rect` 막대 차트
- `circle` 도넛 차트
- `polygon` 또는 `path` 퍼널 차트
- 임의 수치와 제목이 있음

실패:

- 그냥 사선 하나
- 차트처럼 생긴 장식선
- 숫자와 시각화가 관계 없음

---

## 8. Delivery QA

파일 제공 전 최종 체크:

```text
[ ] HTML 파일이 실제 생성되었는가?
[ ] sandbox 링크가 정확한가?
[ ] 파일명에 버전이 있는가?
[ ] 사용자가 요청한 기준 버전을 반영했는가?
[ ] 수정 실패나 불확실한 점이 있으면 숨기지 않았는가?
```

---

## 9. Patch Response Rule

패치 후 장황하게 설명하지 않는다. 사용자가 확인할 수 있게 링크를 먼저 제공한다.

```text
수정했습니다.

반영한 부분:
- ...
- ...

[다운로드](sandbox:/mnt/data/filename.html)
```

