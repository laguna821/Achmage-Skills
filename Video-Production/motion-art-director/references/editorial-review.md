# 컷 의도와 적대적 검수

새 작품은 `editorial_plan.version = "shot-intent-v1"`을 작성한다. contracts/editorial.schema.json의 모든 shots를 실제 scene_id에 연결한다. 이전 프로젝트에 없다는 이유로 실행을 막거나 승인 기록을 자동 변경하지 않는다. 이전 결과는 새 기획 검수를 통과한 것으로 표시하지 않는다.

## 기획 순서

1. 컷의 목적을 정하고 action / observation / type / pause 중 하나를 고른다.
2. subject_layers에 실제 그릴 대상을 연결하고 framing, layout, purpose를 쓴다. 모든 컷을 같은 중심 제목+설명 구도로 만들지 않는다.
3. action에 구체적인 verb와 before/contact/after를 적는다. 각 단계는 **컷 내부 초 단위 시점**과 **화면에서 구별되는 상태**를 갖는다. action/type은 changed_layers, observation/pause는 hold_reason을 쓴다. 관찰 컷의 contact는 충돌이 아니라 관찰의 중심 순간이다.
4. motion.driver를 subject / type / camera / none에서 고른다. 카메라는 바라볼 대상과 도착 구도가 있을 때 사용한다. steady_windows로 쉬는 구간을 남긴다. “더 역동적”을 모든 컷의 흔들림으로 해석하지 않는다.
5. typography에 meaning / information / accent / none 역할과 실제 text 레이어를 적는다. 단어가 바뀌어도 같은 팝업을 반복하면 의미 연출이 달라진 것이 아니다.
6. sound에 music_role, ambience_role, events를 쓴다. 사건 큐는 고유 cue_id, visible_event, 로컬 at와 연결한다. 허용 오차는 기본 80ms, 최대 250ms다. 효과음이 필요 없으면 no_sync_reason을 쓴다. 음악의 악센트는 모든 컷에 의무적으로 맞추지 않는다.
7. bridge는 실제 다음 scene을 가리킨다. match-action / match-shape는 outgoing/incoming 레이어, 로컬 at, 정규화 anchor, 화면 좌표 기준 velocity를 쓴다. 오른쪽은 +x, 아래는 +y. same-object와 visual-analogy를 구분한다. 실제로 서로 다른 대상을 같은 물체라고 주장하지 않는다. 반대 방향은 reversal_reason이 있어야 하며 실제 축 변경이 이해되는지 검토한다. sound-bridge는 실제 컷 경계를 넘는 큐를 연결한다. 명확한 대비 컷이나 관찰 뒤 전환에는 contrast-cut / hold-cut을 쓰면 된다. 마지막 컷은 end다.

## 실행과 증거

```sh
node scripts/motion.mjs plan project.json --out review-plan
node scripts/motion.mjs direction-review project.json --out review-intent
node scripts/motion.mjs direction-review project.json --movie final.mp4 --out review-v1
```

direction-review는 장면 누락, 범용 문장, 반복 원본 구간, 카메라 연속을 보고한다. 2초 이상 원본 구간 중복과 같은 layout 3회는 검토 신호이며 자동 불합격이 아니다. before/contact/after 상태는 영상 프레임과 대조한다. 새 계약이 없으면 컷 처음·중간·마지막을 추출한다.

증거는 최종 CFR 영상의 **0부터 시작하는 프레임 번호**로 처음부터 디코딩한다. 입력 -ss 빠른 탐색 스틸이 다른 시점 그림을 돌려준 사례가 있으므로 그것만으로 타이밍 결함을 확정하지 않는다. 최대 300개, 폭 480px 기본의 순차 추출이며 전체 프레임을 메모리에 쌓지 않는다. 파일 해시와 프레임 번호를 기록하고 기존 증거는 덮어쓰지 않는다.

## 반드시 넣는 반례

- SVG의 수평·수직 열린 경로에 objectBoundingBox 그라디언트를 stroke로 적용해 실제 출력에서 선이 사라진다. 기어의 스포크처럼 높이가 0인 경로는 userSpaceOnUse 그라디언트나 검증한 단색 stroke를 사용하고 인코딩된 프레임에서 확인한다.
- 타이어의 중심+명목 반지름만으로 접지를 판단한다. 외곽 stroke 두께까지 포함한 최하단과 지면을 대조한다. 그림자의 존재만으로 접지를 통과시키지 않는다.

- 전후 상태를 다르게 적었지만 실제 레이어는 정지해 있다.
- 실사 열차가 왼쪽으로 가는데 다음 그래픽 열차는 오른쪽으로 간다.
- 카드를 대기 전부터 승인 표시가 켜져 있다.
- 물줄기는 있으나 수위·파문 등 받는 대상의 변화는 없다.
- 발이 보이지 않는데 박자마다 발소리를 넣고 접지 싱크로 설명한다.
- 조용한 관찰 장면에 전환음과 카메라 움직임을 기계적으로 추가한다.
- 같은 중심 팝업의 단어만 바꿔 기법 다양성으로 센다.
- 몸체/마스크/효과음이 서로 다른 사건 시간을 사용한다.
- 용기 안의 액체를 통째로 세로 확대해 수면이 두꺼워지거나 좁아지는 벽 밖으로 나온다. 수면 높이별 용기 안쪽 경계와 방울의 도착점을 함께 확인한다. 내용물의 변화와 용기/클립의 좌표계를 분리하고, 경로 변형 또는 고정 클립을 사용한다.
- 실제 현장 녹음과 합성 분위기음을 혼동한다.

## 음악과 소리 검토

선택 곡, 실제 사용 구간, 프레이즈/악센트 시점, 밀도 변화, 장면별 소리 역할을 적는다. BPM만으로 프레이즈의 위치를 추정하지 않는다. 같은 효과음을 반복할 때는 반복이 이야기의 모티프인지 확인한다. 접촉·쏟기·가속 등 대상 행동은 사건 시각과 연결하고, 보이지 않는 행동을 현장 동기음이라고 기록하지 않는다.

분위기음이 실제로 깔리는 컷은 sound.texture에 intended(원하는 질감), avoid(피할 질감), source_kind(synthetic/recording/mixed), 실제 asset_ids, status(pending/accepted/rejected)를 쓴다. accepted/rejected에는 실제 청취 근거 evidence가 필요하다. 기술 렌더는 비교를 위해 계속 가능하지만 pending/rejected 경고를 배포 청취 통과로 바꾸지 않는다. 명칭이 river라도 실제 강물처럼 들린다는 보장은 없다. 필터링한 노이즈가 TV 잡음처럼 들리면 먼저 제거한 비교본을 만들며, 음량을 낮추는 것만으로 질감 문제가 해결됐다고 주장하지 않는다.

스템·전체 믹스·AAC 최종본을 따로 확인한다. 파형·RMS·LUFS는 청취를 대체하지 않는다. 실제 소리를 들을 수 없는 검토에서는 청취 항목을 pending으로 남기고, 기획과 시각 사건·큐 시각·PCM 경계 검사만 수행했다고 명시한다.

## 판정의 한계와 수정 범위

accepted/rejected 청취 판정에는 lib/editorial.mjs의 ambienceFingerprint(project, scene)로 만든 signature를 저장한다. 음원 해시·구간·게인·믹스 계획이 바뀌면 다시 확인해야 한다. 서명은 기록이 어떤 음향 구성을 대상으로 했는지 고정할 뿐, 사람이 실제로 들었다는 사실을 자동 증명하지 않는다. 프로젝트 스키마에는 동일한 정의를 $defs.editorial로 포함해 오프라인 검증에서 외부 참조를 내려받지 않는다.

자동 검사는 **명세와 연결의 구조**를 확인한다. 문장을 읽었다고 실제 대상 식별, 물리적 설득력, 이동 방향 측정, 미감이나 음악 적합성이 입증되지 않는다. 3장 스틸은 중간 흔들림이나 모든 프레임의 오류를 잡지 못한다. 중요한 사건 주변을 추가 추출하고 전체 재생을 별도로 확인한다.

각 발견을 작품 수정 / 공통 기능 결함 / 검사 결함으로 나누고 시점·근거·수정안·재검수 조건을 쓴다. 기술적 성공, 관찰 결과, 청취, 사용자 취향은 서로 다른 상태로 보관한다. 사용자가 좋아한 컷을 보존하며 수정본의 다른 경로에 결과를 만든다. 전체 영상 재렌더는 필요할 때만 수행하고 캐시 소유권·활성 작업·용량 예산을 확인한다.
