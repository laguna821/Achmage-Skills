# 무료 라이선스 음원 편집 + 절차적 효과음

음악 품질을 로컬 합성만으로 보장하거나 Suno 수준이라고 약속하지 않는다. 권리자의 명시적 허용을 확인한 기존 음악을 편집하고, 작품의 사건에 맞춘 효과음을 새로 만든다. 별도 API 키가 필요 없다.

## 수집과 선택

새 작품의 다중 제공처 검색과 압축 기획 시청은 [preproduction.md](preproduction.md)를 먼저 사용한다. 초기에는 공급된 압축 원본과 AAC 시청본만 만들며 아래의 전체 WAV 스템 출력은 방향을 정한 제작 단계에서 수행한다. 음악/현장음/폴리 녹음 후보를 먼저 비교하고 절차적 합성음은 선택 기능으로 쓴다. 파일 형식과 음색 자연스러움을 별개로 검토한다.

곡마다 권리자 원문 페이지와 라이선스, 확인일, 파일 SHA256, 표시할 크레딧을 보관한다. 상업 공개와 수정이 필요한 작업은 두 조건 모두 허용되어야 한다. CC BY는 무료이지만 저작자 표시 의무가 있다. Content ID 경고가 절대 없다는 뜻도 아니다. `rights`의 불리언은 작가가 확인한 사실의 기록이며 권리를 자동 입증하지 않는다.

가능하면 성격이 다른 후보 3곡을 같은 대표 컷 구간에 편집해 비교한다. 장면 사건, 박자, 악기 밀도, 도입/상승/해소와 빈 공간을 비교하고 실제 청취 뒤 선택 이유를 남긴다. 링크나 스펙트럼만 확인했으면 청취 완료로 기록하지 않는다.

## 프로젝트와 실행

assets에 kind:audio, path, sha256와 rights:{commercial:true,adaptation:true,source_url,license_url,attribution}를 등록한다. visual_policy의 SVG 제약은 화면 자산에 적용하며 음원은 별도다.

audio.clips는 asset_id, bus(music 또는 sfx), start(영화 초), source_in(원본 초), duration, gain_db, fade_in, fade_out를 담는다. 범위를 벗어난 시간·권리 메타데이터 누락·파일 해시 불일치는 거부한다. 오버랩과 페이드로 크로스페이드할 수 있다. 자동 비트 검출·자동 화성 재편곡은 구현했다고 주장하지 않는다.

기존 `node scripts/motion.mjs audio project.json --out OUTPUT` 명령이 편집도 수행한다. music.wav, sfx.wav, mix.wav, 원 합성 버스, score.json, loudness 보고서, edit-decision-list.json을 보관한다. 최종 영화와 같은 타임라인을 사용한다. 음악 편집만 바꾸면 영상 컷 캐시는 유지되지만 최종 믹스와 MP4는 다시 만든다.

drive / wind / passby 효과음은 절차적 연출음이다. 실제 해당 차량 녹음이나 실제 엔진 소리로 표시하지 않는다. 귀로 듣고 효과음이 음악에 묻히는지, 장면 사건과 맞는지 확인한다. 48kHz 스테레오·LUFS·true peak 측정과 실제 모바일 청취는 별개다.

`pour`와 `grind`는 공통 객체 효과음이다. `pour`는 따로 감쇠하는 기포 공명을 겹치며, `grind`는 저주파 회전음과 짧은 입자 접촉음을 합성한다. `audio.cues`의 `time/duration/amp/pan`으로 액체의 수면 접촉 또는 분쇄날 회전에 연결한다. 둘 다 시드·절대 시각으로 재현되며 현장 녹음이나 자연스러운 질감이 검증됐다는 뜻은 아니다. 물 장면이라는 이유로 광대역 잡음 배경을 자동 추가하지 않는다. 컵·그릇의 수면 변화와 흐름 종료도 같은 사건 계획에서 확인한다.

차량의 지속적 가속·스키드에는 [precision-driving.md](precision-driving.md)의 `scene.driving` 곡선을 사용한다. 엔진·노면·타이어·지나감은 동작 데이터에서 자동 생성된다. `audio.mix: {music_gain_db:-2,sfx_gain_db:5,duck_sfx:true}`처럼 편집 버스 이득을 명시할 수 있다. `master_gain_db`는 로컬 합성 마스터 설정이며 외부 클립 믹스의 SFX 버스 이득을 대신하지 않는다. 효과음의 실제 가청성은 분리 파일과 최종 믹스를 모두 청취한다.
