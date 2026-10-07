# 실행 계약

모든 요청은 schemaVersion:1, mode를 포함한다. 경로는 현재 작업 폴더 기준 또는 절대 경로다. outputDir는 존재하지 않는 새 폴더다. 요청 JSON을 UTF-8로 저장해 scripts/run.mjs에 전달한다.

## 선택 → 작성

{"schemaVersion":1,"mode":"resolve","prompt":"PBL 회의록 만들어줘","context":{"program":"pbl","term":"2026-1"}}

resolve의 recipe.fields는 값의 고유 ID, recipe.sections는 필요한 본문 제목이다. 반환된 templateHash와 상태를 참고한다. 공용 양식 사용은 familyId, 개인 양식 사용은 template(저장 해시 또는 내보낸 JSON 경로)로 지정한다.

{"schemaVersion":1,"mode":"compose","familyId":"pbl.meeting","context":{"term":"2026-1"},"values":{"account":"실험실습비","budget":"사용자가 알려준 금액","spent":"사용자가 알려준 금액","meeting.place":"사용자가 알려준 장소","meeting.date":"사용자가 알려준 일자","meeting.time":"사용자가 알려준 시간","professor.name":"사용자가 알려준 성명"},"sections":{"회의내용":"실제 논의·결정 사항","증빙서류 첨부란":"사용자가 제공한 증빙 목록"},"tables":{"회의참가자":[["소속","직위","성명"]]},"outputDir":"outputs/pbl-meeting-01"}

tables의 키는 목차 이름이며, 열 순서는 recipe.tables를 따른다. 정의되지 않은 표는 {"columns":["항목","내용"],"rows":[["...","..."]]}를 전달한다. 행 수가 달라도 다시 조판한다. 표가 없는 긴 보고서는 sections에 Markdown을 쓴다. 이미지가 있으면 images:{"figure.png":"파일 경로"}와 ![설명](figure.png)를 함께 전달한다. 없는 이미지는 오류다.

markdownFile도 가능하나 values는 별도로 전달한다. 필수 목차 제목을 포함해야 하며 고정 신청서는 지원하지 않는다. 확정 원고와 자산이 같아야 동일 바이트를 보장한다. AI 초안의 반복 동일성은 보장하지 않는다.

## 관리 / 일괄

catalog: 문서군 목록.
doctor: Node·글꼴·선택 기능.
template-export: familyId 또는 template와 outputDir.
library-list: 개인 라이브러리.
batch: jobs에 요청 목록, 최대 100개. 하위 outputDir가 없으면 부모 폴더 아래 job-1부터 만든다.

## 상태

success는 실행 결과가 완전하다는 뜻이다. templateStatus가 common-draft이면 성공한 초안이며 공식 양식 완성이 아니다. reference-reconstructed는 공개 서식을 참고해 재구성한 양식, private-unreviewed는 사용자가 등록한 미검토 양식이다. 실제 기관 접수나 한컴 검증과 구분한다.

partial: 미입력·미반영 필드, 건너뛴 편집, 조판 또는 미리보기 일부 문제.
failed: failure.code와 message 확인. OUTPUT_CONFLICT면 새 폴더 사용, HWP_REFERENCE_ONLY면 read로 참고 후 HWPX 작성. 임의로 원본을 덮어쓰거나 같은 오류를 반복하지 않는다.
