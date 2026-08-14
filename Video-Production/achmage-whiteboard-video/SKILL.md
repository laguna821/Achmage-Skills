---
name: achmage-whiteboard-video
description: 한국어 마크다운·강의 원고를 장면별 화이트보드 이미지, 선 추적 애니메이션, ElevenLabs 또는 Typecast 음성, 동적 길이, 번인 자막이 포함된 4K 강의 영상으로 제작한다. 사용자가 강의 노트나 SRT로 올인원 동영상 제작, 화이트보드 시퀀스, TTS 오디션, 자막 합성, 편집 가능한 영상 패키지를 요청할 때 사용한다.
---

# Achmage 화이트보드 비디오

기본 목표는 마크다운 한 편에서 음성·자막이 포함된 단일 4K MP4를 만드는 것이다. 새 프로젝트에서 사람에게 묻는 단계는 음성 오디션 한 번만 둔다. 음성이 승인되면 이미지 생성부터 최종 병합까지 추가 승인 없이 계속한다.

## 기본 절차

1. 처음 실행하는 컴퓨터에서는 Windows의 `setup.cmd` 또는 macOS의 `setup.sh`를 실행한다.
2. `autobuild <마크다운> --project <폴더> --scenes all`을 실행한다.
3. `workflow-state.json`이 `needsSceneDesign`이면 원문을 읽고 장면 계획, `voiceover.script`, 화면 문장, 이미지 프롬프트를 작성한다. 1시간 목표가 있으면 말하기 속도와 장면 수를 먼저 맞춘다.
4. 장면 JSON은 `references/scene-schema.md`, 이미지 프롬프트는 `references/image-prompts.md`를 따른다. 음성 대본은 사람 승인 없이 `approved`로 저장한다.
5. `autobuild`를 다시 실행해 내용에 맞는 음성 3명을 추천하고 상위 2명의 짧은 오디션을 생성한다.
6. 오디션 파일, 후보 이름, 전체 예상 TTS 크레딧과 라이선스 상태를 사용자에게 한 번에 보여주고 한 명을 고르게 한다. 이것이 유일한 기본 승인 게이트다.
7. 선택을 받으면 `approve-voice --voice-id <ID>`를 실행한다. 이후에는 추가 승인을 요청하지 않는다.
8. 상태가 `needsImages`이면 Codex 네이티브 이미지 생성 도구로 누락 장면마다 이미지 한 장을 만들고 `attach-image`로 연결한다. 외부 이미지 API나 API 키를 사용하지 않는다.
9. 모든 이미지가 준비되면 `resume`을 실행한다. 스크립트가 TTS 캐시, 동적 길이 렌더, 자막, 4K 병합과 검증을 끝낸다.
10. 최종 폴더의 `*-4k-captioned.mp4`와 `build-report.json`을 사용자에게 전달한다.

## 이미지 원칙

- 장면마다 네이티브 이미지 한 장을 생성한다. 이미지 모델에는 실제 한글을 그리게 하지 않는다.
- 프롬프트에 `no text, no letters, no numbers, no logo, no watermark`와 넓은 텍스트 안전 영역을 명시한다.
- 실제 한글은 번들된 Noto Sans KR로 합성한다.
- 기본 테마는 `achmage-newsroom-light`, 기본 삽화 모션은 `line-trace`다. 장면별로 `marker-wipe`를 선택할 수 있다.
- 기본 자동 제작에서는 앵커 이미지 승인을 별도 게이트로 두지 않는다. 사용자가 명시적으로 요청할 때만 미리보기와 앵커 승인을 추가한다.

## 음성·비용 원칙

- API 키는 `ELEVENLABS_API_KEY` 또는 `TYPECAST_API_KEY` 환경변수에서만 읽는다. 채팅, JSON, 로그, 명령행 인수에 키를 쓰지 않는다.
- 기본·개인·기존 클론 음성을 추천 대상으로 포함한다. 음성 복제 생성은 하지 않는다.
- 같은 대본·화자·모델·설정은 캐시를 재사용한다. POST 실패는 중복 과금 위험 때문에 자동 재시도하지 않는다.
- 오디션 승인은 화자·모델·설정·대본 해시와 승인 비용 상한을 잠근다. 예상 비용이 승인 시점보다 10% 이상 늘면 안전 정지한다.
- `pronunciationOverrides`는 TTS 입력에만 적용하고 화면 자막에는 원문을 유지한다.
- 무료 계정 또는 라이선스를 확인할 수 없는 음성은 로컬 검수용으로만 표시한다. 공개·상업 목적은 공급자의 현재 권한을 확인하고 허용되지 않으면 중단한다.
- 자세한 키 설정, 요금과 공급자 차이는 `references/tts.md`를 읽는다.

## 자막·출력 원칙

- TTS의 원문 문자 타임스탬프를 우선 사용한다. 예전 캐시에 로마자 정렬만 있으면 음성 길이에 맞춰 한국어 대본 타이밍을 비례 보정한다.
- 자막은 최대 2줄, 한 줄 약 22자, 1–6초 단위로 나눈다.
- Noto Sans KR, 반투명 차콜 배경과 자막 안전 영역을 사용한다. `protectedRegions`와 겹치면 위아래 중 덜 가리는 위치를 선택한다.
- 기본 결과는 음성·번인 자막을 포함한 3840×2160 H.264 High/AAC 48kHz MP4 한 편이다.
- 편집 자료는 사용자가 요청할 때만 `export-edit-package`로 내보낸다. 기존 캐시만 사용하므로 TTS나 이미지 생성 호출을 다시 하지 않는다.
- 편집 패키지는 자막 없는 음성 포함 4K 영상, 통합 SRT, 장면별 MP4·SRT, 편집 인덱스, 대본과 발음표를 포함한다.

## 상태 처리

- `needsSceneDesign`: Codex가 원문을 장면·대본·프롬프트로 설계한다.
- `awaitingVoiceApproval`: 오디션을 보여주고 사용자의 화자 선택만 기다린다.
- `needsImages`: Codex 네이티브 이미지 생성으로 누락 이미지들을 채운다.
- `needsDurationAdjustment`: 목표 시간 ±5% 안에 들도록 장면 대본을 자동 조정한 뒤 변경된 장면만 다시 합성한다.
- `needsCostReapproval`: 승인 비용을 10% 넘었으므로 사용자에게 새 예상량을 알려야 한다.
- `complete`: 최종 MP4와 보고서를 전달한다.

중단 후에는 완성 파일을 덮어쓰거나 TTS를 재호출하지 말고 `resume`으로 이어간다.

## 주요 명령

```text
PY scripts/whiteboard.py autobuild <원문.md> --project <프로젝트> --scenes all [--target-minutes 60]
PY scripts/whiteboard.py tts recommend --project <프로젝트> --scenes all
PY scripts/whiteboard.py tts audition --project <프로젝트> --voice-ids <ID1,ID2> --confirm-spend 120
PY scripts/whiteboard.py approve-voice --project <프로젝트> --voice-id <ID>
PY scripts/whiteboard.py attach-image --project <프로젝트> --scene 1 --image <생성 이미지>
PY scripts/whiteboard.py resume --project <프로젝트>
PY scripts/whiteboard.py finalize-all-in-one --project <프로젝트> --scenes all
PY scripts/whiteboard.py export-edit-package --project <프로젝트> --scenes all
PY scripts/whiteboard.py package-skill --output <achmage-whiteboard-video.zip>
```

기존 무음 제작, 미리보기 편집기, v1 변환과 모션 세부 사항은 관련 명령의 `--help` 및 `references/` 문서를 사용한다.

## 완료 기준

- 기본 최종 폴더에는 `*-4k-captioned.mp4`와 `build-report.json`이 있다.
- 완성본은 3840×2160, H.264 High, `yuv420p`, AAC 48kHz이며 음성·자막을 포함한다.
- 장면 음성 앞뒤 여백과 영상·음성 PTS가 검증된다.
- API 키와 개인 경로는 클린 패키지에 포함되지 않는다.
- `package-skill` 결과에는 프로젝트, `.venv`, 캐시, 오디션, 원장과 출력 영상이 없다.
