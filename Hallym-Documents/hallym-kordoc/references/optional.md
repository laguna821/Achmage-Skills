# 선택 기능

핵심 작성에는 브라우저나 OCR 모델이 필요 없다. 선택 작업은 동봉 kordoc-workbench 0.2.0 실행기를 사용한다. read, form-analyze, template-analyze, compare, validate, lint, render, crop, tables, patch, redact, seal, ocr, capabilities를 hallym 실행기에 전달한다.

JSON 모드 계약은 ../core/references의 해당 문서를 필요한 경우에만 읽는다. HWP는 read·비교·분석 참고만 가능하고 patch/redact/seal은 HWPX만 가능하다. HWP로 결과를 저장하지 않는다.

OCR·수식 OCR·PDF 파싱·PNG 출력·PDF 출력은 별도 확장을 쓴다. 사용자의 해당 작업 요청이 있을 때만 필요한 의존성을 준비한다. KORDOC_OFFLINE=1이면 누락된 의존성은 다운로드하지 않고 실패한다. PDF 출력은 설치된 Edge/Chrome을 우선 탐지한다. 외부 처리 서버는 필요 없다.

이 스킬 v1의 환경 인증은 Windows 핵심 문서 작성 범위다. 선택 확장의 모든 기능, 웹, macOS/Linux가 검증되었다고 주장하지 않는다. 개인정보 마스킹은 텍스트 잔존 검사와 이미지 미검사 범위를 확인한다.
