# GPTs Raw5 HTML PPT Prompt Pack v4 — Full Design Modes + Harness QA

이 프롬프트 팩은 `Raw 5 이미지 → HTML PPT / UI / 카드뉴스`를 일관된 품질로 만들기 위한 GPTs Knowledge 팩이다.

v4는 기존 v3 stage-gate 팩을 기반으로 다음 네 가지 실제 시스템을 통합한다.

1. **V7 Bright Report / Strategy System**
   - Raw 5를 `--img1~--img5`로 등록
   - `.masked-word`, `.shape-mask-scene`, `.wash-scene`, `.blend-scene`, `.grid-scene`, `.tone-scene`, `.collage-scene` 등 이미지-as-HTML 기법
2. **V8 Dark Brutalist Background Stage**
   - `.bg-stage`, `.bg-full`, `.bg-treatment`, `.bg-grid`
   - `.mode-wash`, `.mode-tone`, `.mode-blend-left/right`
   - 다크 키노트는 3~4개 기법만 반복해서 단순하고 강하게 유지
3. **University AX Bright Information Grid**
   - `.summary-grid`, `.compare-grid`, `.kpi-grid`, `.roadmap-grid`, `.dashboard-grid`, `.timeline-grid`
   - 정보형 전략 덱의 12컬럼 그리드 구조
4. **Street Magazine Editorial / Seongsu Popup System**
   - 종이색 배경, 코랄 포인트, 굵은 Pretendard
   - `.material-image-card`, `.luma-mask-scene`, `.blend-if-scene.cover-text`, `.surface-fx-card.metric-window`, `.refract-glass-card`, `.lut-scene`, `.selective-accent-scene`, `.paper-grain-layer`, `.halftone-overlay`, `.depth-shadow-stack`, `.final-card`

---

## 파일 구성

1. `00_GPTS_AGENT_CORE.md`  
   GPTs 최상위 지시문. 역할, 절대 원칙, stage gate, design mode 선택 규칙.

2. `01_ROUTER_PIPELINE.md`  
   요청을 Plan / Raw5 / Render / Patch / CheatSheet 모드로 분기하는 상태 기계.

3. `02_DECK_PLANNER.md`  
   발표 내용을 top-down 구조로 바꾸고, design mode별 slide plan을 만드는 기획 엔진.

4. `03_RAW5_IMAGE_DIRECTOR.md`  
   Raw image 5장을 MECE하게 설계하는 이미지 디렉터. 모드별 raw5 역할 포함.

5. `04_HTML_RENDERER_RUNTIME_QA.md`  
   HTML 렌더링, 1920×1080 런타임, 자동 숨김 네비게이션, QA 기준.

6. `05_CSS_TECHNIQUE_SYSTEM.md`  
   V7 / V8 / AX / Street Editorial의 CSS 클래스 기법 총정리.

7. `06_STAGE_GATE_IMAGE_FIRST_WORKFLOW.md`  
   이미지 5장 생성 후 반드시 멈추는 hard-stop 워크플로우.

8. `07_DESIGN_MODE_PLAYBOOKS.md`  
   각 디자인 모드별 해야 할 것 / 하지 말아야 할 것 / 추천 기법 수 / 하네스.

9. `08_HARNESS_QA_AND_PATCH_RULES.md`  
   반복 실패를 막는 하네스 규칙, 피드백 → CSS recipe 패치 매핑.

10. `09_COPY_READY_MASTER_PROMPTS.md`  
    GPTs Instructions / user prompt / render request에 바로 붙여넣을 수 있는 템플릿.

11. `CHANGELOG_V4_FULL_MODE_HARNESS.md`  
    v4 변경점.

---

## GPTs에 넣는 방법

### Instructions에 넣을 것

- `00_GPTS_AGENT_CORE.md` 전체 또는 압축본
- `06_STAGE_GATE_IMAGE_FIRST_WORKFLOW.md`의 Hard Stop Rule
- `08_HARNESS_QA_AND_PATCH_RULES.md`의 Absolute No-Harness 항목

### Knowledge에 넣을 것

- `01_ROUTER_PIPELINE.md`
- `02_DECK_PLANNER.md`
- `03_RAW5_IMAGE_DIRECTOR.md`
- `04_HTML_RENDERER_RUNTIME_QA.md`
- `05_CSS_TECHNIQUE_SYSTEM.md`
- `07_DESIGN_MODE_PLAYBOOKS.md`
- `08_HARNESS_QA_AND_PATCH_RULES.md`
- `09_COPY_READY_MASTER_PROMPTS.md`

---

## 가장 중요한 v4 원칙

> 이미지는 재료이고, HTML은 진실이다.

- 이미지는 최대 5장만 쓴다.
- 텍스트, 숫자, 표, 차트, 출처는 HTML/SVG로 올린다.
- raw image 5장을 먼저 만들고 사용자 확인을 받은 뒤에만 HTML을 만든다.
- 슬라이드 왼쪽 하단에 table of contents, slide thumbnails, 번호 줄을 만들지 않는다.
- 우측 하단 네비게이션은 이동 직후에만 짧게 보이고 자동 숨김 처리한다.
- V8 다크 브루탈 덱은 욕심내지 말고 3~4개 기법만 반복한다.
- Street Editorial에서는 이미지 카드 안 raw 이미지가 반드시 보여야 한다.
- Surface FX 카드에는 장식선이 아니라 실제 SVG 차트가 들어가야 한다.

