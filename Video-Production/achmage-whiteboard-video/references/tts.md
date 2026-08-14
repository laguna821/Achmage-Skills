# TTS, 오디션과 자막

## 키 보관

API 키는 환경변수에서만 읽는다. 채팅, 프로젝트 JSON, 로그와 명령행 인수에 키를 쓰지 않는다.

Windows에서는 현재 사용자 범위 환경변수에 저장하고 Codex 앱을 다시 연다.

```powershell
$secret = Read-Host "ElevenLabs API 키" -AsSecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
try {
  $plain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
  [Environment]::SetEnvironmentVariable("ELEVENLABS_API_KEY", $plain, "User")
} finally {
  if ($ptr -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
  Remove-Variable plain, ptr, secret -ErrorAction SilentlyContinue
}
```

- ElevenLabs: `ELEVENLABS_API_KEY`
- Typecast: `TYPECAST_API_KEY`

macOS에서는 현재 셸의 비공개 환경변수나 운영체제 비밀 저장소를 사용한다.

## 승인 게이트

1. `tts recommend`가 원문과 대본의 뉴스·교육·기술·스토리텔링 성격을 분석해 후보 3명을 고른다.
2. 기본·개인·기존 클론 음성을 포함하고, 필요하면 `--gender male|female|any`로 제한한다.
3. `tts audition`은 동일한 60자 이하 문장으로 최대 2명만 생성한다.
4. `approve-voice`는 선택 화자, 모델, 설정, 콘텐츠 해시와 예상 비용을 함께 승인한다.
5. 승인 후에는 대본과 설정이 같으면 오디션을 반복하지 않는다. 예상 비용이 10% 넘게 늘면 안전 정지한다.

오디션 승인은 별도의 대본 승인이나 이미지 승인과 합치지 않는다. 기본 자동 모드의 유일한 사람 확인 단계다.

## 비용 보호

- `pilot` 모드는 기본 누적 상한 1,500크레딧과 계정 75% 잔여 보호선을 사용한다.
- `production` 모드는 프로젝트에 설정한 상한을 사용한다.
- 오디션은 기본 120크레딧 이내다.
- 같은 대본·화자·모델·설정·앞뒤 문맥은 해시 캐시를 재사용한다.
- POST 요청은 네트워크 단절이나 5xx 뒤 자동 재시도하지 않는다.
- 응답의 실제 문자 비용과 구독 사용량 차이를 로컬 원장에 기록한다.

## 길이와 음질

장면 길이는 다음 값 중 큰 값을 출력 fps 프레임 경계로 올림한다.

`기준 장면 길이` 또는 `앞 1.25초 + 실제 음성 + 뒤 1.75초`

원본 이벤트 시간은 수정하지 않고 매 렌더마다 다시 배치한다. 음성은 약 -16 LUFS, true peak -1.5dB로 정규화한 뒤 AAC-LC 48kHz 192kbps 스테레오로 결합한다.

`targetDurationMs`가 있으면 TTS 뒤 실제 합계가 목표의 ±5%인지 4K 렌더 전에 확인한다. 벗어나면 Codex가 장면 대본을 조정하고 변경된 장면만 다시 처리한다.

## 자막

- 화면 자막은 `voiceover.script` 원문을 사용한다.
- TTS에는 `pronunciationOverrides`를 적용할 수 있지만 자막 철자는 바꾸지 않는다.
- 원문 문자 타임스탬프를 우선한다. 로마자 정렬만 남은 예전 캐시는 전체 발화 시간에 맞춰 한국어 대본을 비례 배치한다.
- 기본 분할은 최대 2줄, 한 줄 22자, 1–6초다.
- 장면별 SRT와 통합 SRT는 캐시에 보존하고, 기본 4K 완성본에는 자막을 번인한다.

## 공개 범위

무료 또는 확인 불가능한 계정은 로컬 검수용으로 기록한다. `commercial` 빌드는 모든 장면의 음성 매니페스트가 상업 사용 가능일 때만 허용한다. 공급자 요금과 약관은 바뀔 수 있으므로 공개 전 공식 문서를 확인한다.

- ElevenLabs 모델: https://elevenlabs.io/docs/overview/models
- ElevenLabs 타임스탬프 TTS: https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps
- ElevenLabs 구독 조회: https://elevenlabs.io/docs/api-reference/user/subscription/get
- ElevenLabs 음성 목록: https://elevenlabs.io/docs/api-reference/voices/search
- ElevenLabs 라이선스: https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform
- Typecast 빠른 시작: https://typecast.ai/docs/quickstart
- Typecast API 요금: https://typecast.ai/pricing/api/
