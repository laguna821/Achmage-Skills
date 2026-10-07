# 개인 양식

개인 양식은 HALLYM_KORDOC_HOME 또는 ~/.hallym-kordoc/library에 저장한다. 설치본과 분리되며 공용 배포에 포함하지 않는다.

## 등록

{"schemaVersion":1,"mode":"template-register","input":"my-blank.hwpx","templateId":"my-pbl","name":"나의 PBL 양식","familyId":"pbl.meeting","analysisDir":"outputs/analyze-new-01","binding":{"familyId":"pbl.meeting","context":{"term":"2026-2"}}}

고유한 누름틀이 있으면 fixed, 없으면 profile로 등록한다. fixed는 필드 값만 바꾸고 원본 배치를 유지한다. 중복 누름틀 이름은 등록을 거절한다. 새 이름을 지어 연결하려면 원본을 참고해 깨끗한 HWPX를 먼저 만든다. source에 HWP를 직접 등록하지 않는다.

profile은 본문·표 스타일을 분석하고 새 Markdown을 조판한다. roleBindings와 tableRules는 동봉 core/references/templates.md에 따른다. 한 문서의 모든 직접 서식·중첩표를 완벽하게 재현한다고 말하지 않는다. fields:[{"id":"purpose","label":"목적","required":true}], sections:["추진 배경","계획"]로 이후 작성 규칙을 추가할 수 있다. 원본의 작성 완료 내용은 새 초안의 기본 본문으로 재사용하지 않는다.

원본 서식이 이미 본 스킬의 결과라면 공용 template-export 후 이를 등록하는 방법도 있다.
{"schemaVersion":1,"mode":"template-register","template":"exported.kordoc-template.json","binding":{"familyId":"pbl.meeting","context":{"term":"2026-2"}}}

같은 내용은 중복 등록하지 않는다. 다른 내용·버전은 새 해시로 보존한다. binding은 사용자가 이후 사용을 요청한 경우에만 지정한다. 빈 context는 해당 문서군 전체에 연결한다. 다른 문서군에는 적용되지 않는다. 같은 조건에 새 연결을 저장해도 이전 양식은 남는다.

## 새 세션

library-list로 저장을 확인한다. compose의 template에 해시를 주거나, 연결된 familyId와 context를 사용한다. 다운로드한 내보내기 파일은 template-register로 가져온다. 세션 임시 파일만 만든 상태를 영구 등록으로 설명하지 않는다.

출처·버전·양식 해시·미검증 항목은 result.json에 남는다. 개인 문서의 실제 내용을 공용 저장소로 보내지 않는다.
