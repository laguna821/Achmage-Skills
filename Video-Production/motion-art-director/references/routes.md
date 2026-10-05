# 출력 루트

영상편집: editable-scene.html + project.json + MP4 + music.wav/sfx.wav/mix.wav + SRT. 기본 예제의 SRT는 컷별 정확한 내용이며 자막 배치는 소비 편집기에서 조정 가능하다.
홍보: MP4 + poster.png. 가상 브랜드임을 명시하고 실제 브랜드 계약이 있으면 그 조건을 우선한다.
쇼츠: 별도 1080×1920 구성 + MP4 + SRT + cover.png. 플랫폼 UI 안전 영역을 검토하고 원문이 길면 별도 읽기 컷으로 재기획한다.
뉴스레터: 4초 640px 단회 GIF(loop extension 없음) + fallback.png + email-fragment.html. asset_base/web_url placeholders를 실제 게시 URL로 치환해야 배포 가능하다. GIF 첫 프레임도 메시지를 담도록 확인. 이메일마다 animation 지원이 다르므로 정적 대안과 웹 링크를 유지한다.
인포그래픽: self-contained SVG + PNG + MP4 + interactive.html. 시간/진행률/정지 API. 숫자와 단위·조건을 함께 표시한다.
썸네일: 2개 후보 PNG/JPEG/SVG. 작은 표시 크기에서 가독성 비교 후 선택.
덱·사이트: 승인 발표 엔진의 light/dark HTML + PDF와 별도 site.html. 덱의 발표/모바일 fit/읽기 모드와 PDF 내용 보존 검사. 사이트는 time 또는 ?scroll 모드, 재생은 사용자 조작으로 시작한다.

생성 파일은 exports/<approval hash>/<route>에 저장. manifest에 경로·sha256·용량 기록. 영상 승인과 루트별 UX/출력 검토는 따로 기록한다.
