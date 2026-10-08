# 단어의 소리와 화면 착지

노래·랩·스포큰 워드의 빠른 타이포는 BPM만으로 배치하지 않는다. 먼저 사용 가능한 음원과 원문을 고정한 뒤, `sync_score.version = "word-impact-v1"`로 원본 샘플 좌표와 출력 프레임을 연결한다. 일반 자막의 읽기 계약은 유지하고, 이 계약의 짧은 단어 강조를 모든 정보 문장의 읽기 시간으로 대신하지 않는다.

## 기획

- 문장의 뜻을 실제 물체·행동으로 정한다. 단어의 목록만 화면 가운데 바꾸는 방식으로 끝내지 않는다.
- 음성 onset(발성 시작), anchor(화면이 맞아야 할 강세·공격점), release(마지막 소리가 끝나는 시점)를 구분한다. 자음 시작과 귀에 꽂히는 모음의 강세는 다를 수 있다.
- 준비 동작과 착지, 읽기 유지, 퇴장을 별도로 정한다. `prepare_frames=0`은 즉시 등장이다. 준비가 있으면 착지 전에 움직이되 착지 시점을 바꾸지 않는다.
- 마지막 단어가 끝나기 전에 다음 장면에 삼켜지지 않도록 phrase.release_frame을 둔다. 다음 장면의 도착 프레임, 연결 대상, 정규화 앵커와 의미를 작성한다. 좌표 일치는 매끄러운 운동의 증명이 아니므로 실제 전환 구간을 따로 본다.
- 반복되는 대상은 최초 상태·변화·회수 이유를 기획에 적는다. 이 버전의 컴파일러는 반복 서사나 카메라 경로를 자동 생성하지 않는다.

## 실행

프로젝트3.1의 오디오 voice clip과 기존 text layer를 사용한다. `source`는 asset_id/sha256/sample_rate/onset_sample/anchor_sample/release_sample을 갖는다. clip_index는 `audio.clips`의 실제 음성 구간을 가리킨다. 실제 사용 구간과 speed를 적용해 원본 시각을 출력 시각으로 변환하고 가장 가까운 프레임으로 양자화한다. 보고서에 남는 quantization_ms는 30fps의 반 프레임 이내 오차이며 지각적 합격 기준은 아니다.

```sh
node scripts/motion.mjs sync-compile draft.project.json --out compiled.project.json
node scripts/motion.mjs sync-audit compiled.project.json --out review
node scripts/motion.mjs sync-audit compiled.project.json --movie final.mp4 --out encoded-review
```

새 출력은 원본 프로젝트와 같은 폴더에 둔다. 상대 자산 경로를 보존하기 위한 조건이다. 컴파일은 입력을 덮어쓰지 않고 일반 SVG/Skia용 x/y/scale/opacity/keyframes를 작성한다. 이전 승인은 제거한다. 사용자는 이 구체적인 결과를 검토할 수 있다. 음원 구간·속도·해시·큐 또는 생성된 키프레임이 바뀌면 stale 검사로 렌더를 막고 새 파일로 컴파일한다. 승인과 기존 출력은 자동으로 옮기지 않는다.

`source.method`는 isolated-speech / forced-alignment / manual-listening이다. 별도 단어 파일의 에너지 검출, 자동 정렬, 자막 시점은 지각적 강세의 확정값이 아니다. confidence와 evidence를 남기고 실제 청취 전에는 그 상태를 유지한다. TTS나 정렬 서비스는 필수 의존성이 아니며 사용 가능한 녹음·음원과 교정된 타이밍을 입력하면 된다. 노래 생성 모델을 포함하지 않는다.

## 반례와 한계

- ±1·2·4프레임을 주입하고 프로젝트에서 정한 tolerance_frames에 대해 검출한다. 보편적 지각 허용치를 선언하지 않는다.
- 음원 교체·잘못된 source_in·speed 변경·클립 재배치·마지막 단어 잘림·다음 장면 지연·세로판만 늦는 경우를 검사한다.
- 생성 keyframe과 명세를 따로 바꿔도 불일치를 잡는다. score 메타데이터만 믿지 않는다.
- 최종 인코딩본의 착지 전/당일/다음 프레임과 장면 경계를 순차 디코딩한다. 순서를 바꾼 직접 시점 렌더도 비교한다.
- 원곡 그대로의 노래 정렬, 전체 청취, 의도와 음악의 적합성은 별도 검토 항목이다. 로컬 음성 시험은 가창 동기화나 SUNO 수준 음악 품질을 검증하지 않는다.

기획 근거: R018의 단어 타격·프레이즈 연결, R019의 대상 회수·대비, R020의 실행·오류 주입. 원본 레퍼런스 음악이나 가사는 패키지에 포함하지 않는다.
