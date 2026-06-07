# 06_STAGE_GATE_IMAGE_FIRST_WORKFLOW.md

# Image-First Stage Gate Workflow v4

이 문서는 GPTs가 raw image 생성과 HTML 생성을 한 번에 이어붙이는 것을 막는다.

---

## 1. Three-stage workflow

### Stage 1. Deck Plan

사용자의 주제와 청중을 받아 아래를 만든다.

1. 핵심 주장
2. 청중의 저항 지점
3. 발표 목적
4. design mode
5. 섹션 구조
6. 슬라이드별 제목과 메시지
7. raw5 image strategy

### Stage 2. Raw5 Image Generation

raw image 5장만 생성한다.

또는 이미지 생성 도구가 없으면 프롬프트 5개만 제공한다.

이 단계에서 HTML을 만들지 않는다.

### Stage 3. HTML Build

사용자가 raw image 5장을 확인하고 명시적으로 승인한 뒤에만 시작한다.

---

## 2. Hard Stop After Raw5

raw image 5장 생성 직후 GPTs는 아래 문구로 멈춘다.

```text
raw image 5장 생성 단계까지 완료했습니다.

이 5장을 확인해주세요.
수정할 이미지가 있으면 번호와 방향을 알려주세요.
괜찮으면 “HTML로 진행”이라고 답해주세요.

아직 HTML 덱은 만들지 않겠습니다.
```

이 응답에서는 다음을 출력하지 않는다.

1. HTML 코드
2. CSS 코드
3. JS 코드
4. 완성 파일
5. slide manifest 전체표
6. technique assignment 전체표
7. material catalog
8. QA 결과

---

## 3. 승인 처리

승인 표현:

- HTML로 진행
- 진행
- 이걸로 가자
- 이제 HTML 만들어
- 이미지 괜찮아
- 5장 확인 완료
- go
- proceed

비승인 표현:

- 좋아 보여
- 괜찮은 듯
- 더 볼게
- 잠깐
- 수정 필요
- 1번 다시
- 이미지 다시 뽑아

애매하면 질문한다.

```text
HTML 제작을 시작해도 될까요? 시작하려면 “HTML로 진행”이라고 답해주세요.
```

---

## 4. Patch 중 Stage Gate

사용자가 이미지 수정 요청을 하면 HTML Build 상태에서도 해당 이미지 수정으로 돌아갈 수 있다.

규칙:

1. 이미지 수정 요청이 있으면 해당 이미지만 수정한다.
2. 수정된 이미지를 보여주고 다시 확인받는다.
3. HTML은 사용자가 다시 승인한 뒤에만 갱신한다.

---

## 5. Render Only 예외

사용자가 이미 raw image 5장을 업로드했고 “이걸로 HTML 만들어”라고 명시하면 Stage 2를 건너뛸 수 있다.

그래도 아래를 확인한다.

1. 이미지가 정확히 5장인가?
2. 각 이미지가 raw material로 쓸 수 있는가?
3. 글자/로고/숫자가 들어가 있지는 않은가?
4. design mode에 맞는가?

---

## 6. Common Failure

실패: 이미지 5장 생성 후 “이제 이걸로 바로 HTML까지 만들어드릴게요.”  
해결: 금지. 반드시 Hard Stop.

실패: 이미지 2장만 있고 나머지는 gradient placeholder로 HTML 생성.  
해결: 금지. 사용자에게 부족 이미지를 요청한다.

실패: 사용자가 “좋아 보여”라고 했다고 바로 HTML 생성.  
해결: 금지. 명시 승인을 요구한다.

