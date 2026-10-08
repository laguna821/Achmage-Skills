---
name: hallym-kordoc
description: 한림대학교 보고서·회의록·신청서·증빙 문서를 업무에 맞게 선택하고 작성해 HWPX로 완성한다. PBL, 글로컬, RISE, 연구, 수업, 교원, 대학원, 본부 업무와 개인 양식 등록·재사용에 사용한다.
---

# hallym-kordoc

한국어로 응답한다. 이 폴더의 scripts/run.mjs와 동봉 core를 사용한다. 다른 kordoc 설치, Obsidian, HanMark가 필요하지 않다. Node 20 이상이 필요하다. 없으면 setup.ps1으로 고정 런타임을 준비한다. 실행 정책은 바꾸지 않는다.

## 문서 만들기

1. 사용자의 요청과 주어진 자료를 읽는다. HWP는 read로 참고만 하고 수정·출력하지 않는다. 새 양식과 한글 산출물은 HWPX다.
2. 아래 실행기에 mode:resolve, prompt, 알고 있는 context(program, department, term, stage, level)를 전달한다. 반환 recipe의 필드·목차·출처·양식 상태만 읽는다. 모호한 사업이나 서로 다른 서식은 한 번에 구분 질문한다. familyId는 사용자가 지정했거나 의미를 확인했을 때만 지정한다.
3. 알려진 사실을 values의 고유 ID에 대응하고 recipe.sections에 따라 sections의 Markdown 본문을 작성한다. 짧은 값을 채우는 고정 신청서는 values만 쓴다. 긴 보고서·표는 sections/tables 또는 markdownFile을 쓴다. AI가 글을 작성하고 실행기가 조판한다.
4. 필수 사실이 부족하면 질문을 묶는다. 요청이 초안이면 미입력을 드러내고 진행할 수 있다. 이름·날짜·금액·실적·평가·동의·서명을 만들지 않는다. 안내 문구의 예시나 한도를 실제 지급액으로 쓰지 않는다.
5. mode:compose를 새 outputDir로 실행한다. result의 status, missingFields, skipped, warnings와 templateStatus를 확인한다. 부분 결과는 완료라고 말하지 않는다. 공식 서식 부재는 초안으로 명시하고 계속 작성한다. reference-reconstructed도 기관 승인 양식이라는 뜻은 아니다.
6. document.md, document.hwpx, preview.html을 사용자에게 전달한다. 한컴에서 직접 확인하지 않았으면 열기·편집·저장 검증을 했다고 주장하지 않는다.

실행: node "<이 스킬 경로>/scripts/run.mjs" request.json
표준입력 JSON도 지원한다. 출력은 JSON 한 개이며 종료코드 0 성공 / 2 부분 처리 / 1 실패다.
한 번에 작성 가능한 요청은 초안 승인 단계를 추가하지 않고 완성한다.

## 양식과 기능

- 공용 34개 문서군: mode:catalog. 모든 세부 변형을 갖춘 것은 아니다. 대표와 다른 업무는 공식 양식 미적용 초안을 작성한다. 학부와 대학원, 사업과 학기를 섞지 않는다.
- 고정 신청서의 중복 표시명은 responsible.name, adviser.name처럼 고유 ID로 구분한다.
- 일반 보고서·회의록은 한림대 공통 스타일. 신청서·증빙은 항목 순서와 필수 문구·서명란을 참고해 재구성한 HWPX를 사용한다.
- 개인 양식은 명시적인 등록 요청 때만 저장하고, 이후 연결한 업무/조건에서만 자동 선택한다. [개인 양식](references/private-templates.md)을 읽는다.
- JSON 예제·가변 표·일괄 작업·오류: [실행 계약](references/requests.md).
- 읽기, OCR, 비교, HWPX 편집·마스킹·날인 등 부가 작업: [선택 기능](references/optional.md).
- 원본은 덮어쓰지 않는다. 공개 패키지에 개인 양식이나 작성 완료 문서를 넣지 않는다.
