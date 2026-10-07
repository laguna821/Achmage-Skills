# 페달 — 180초 편집 리메이크

[모바일 감상·음악 비교·진단본](https://motion-art-director-review-oct05.achmage2.chatgpt.site/pedal/film/) · [편집 프로젝트](pedal-180-editorial-v4.project.json) · [검증 보고서](pedal-180-editorial-v4-verification.json)

97컷을9개 이야기 흐름으로 구성했습니다. 실사83.63초와 정밀 벡터96.37초를 결합하며,103–117초 음악 감쇠와172초 음악 종료·175초 제목의 원래 편집을 유지합니다. 단순히 컷 수가 많다고 미감 통과로 판단하지 않습니다.

## 설치

개발 빌드 [290d166 ZIP](motion-art-director-development-290d166.zip)을 새 경로에 풀고 기존 설치를 보존합니다. Node20+, FFmpeg/FFprobe, Chromium/Playwright 및 NumPy 환경을 설정합니다. Blender·유료AI API·전용GPU가 필요하지 않습니다. 기존 패키지 버전을 유지한 개발 빌드이며 전체3.1 Release 완료를 뜻하지 않습니다.

~~~text
node motion-art-director/scripts/install.mjs --agent codex --dest ./my-skills
# Claude Code: --agent claude --dest ./my-claude-skills
node my-skills/motion-art-director/scripts/motion.mjs doctor
~~~

패키지 README의 환경 설치·setup 안내를 따릅니다. 영상 원본은 저작권자 허용 다운로드로 별도 확보해야 합니다. 프로젝트 assets의 rights.source_url에서 구하고 SHA256을 확인한 뒤 프로젝트 옆 reconnect/에 배치합니다. 원본 MP4는 이 배포에 동봉하지 않습니다.

## 제작과 검토

~~~text
node my-skills/motion-art-director/scripts/motion.mjs validate pedal-180-editorial-v4.project.json
node my-skills/motion-art-director/scripts/motion.mjs plan pedal-180-editorial-v4.project.json --out my-plan
node my-skills/motion-art-director/scripts/motion.mjs styleframe pedal-180-editorial-v4.project.json --time 56.2 --out my-frame
node my-skills/motion-art-director/scripts/motion.mjs approve pedal-180-editorial-v4.project.json --by owner --note "연출안 확인" --expected-hash PLAN_HASH
node my-skills/motion-art-director/scripts/motion.mjs roughcut pedal-180-editorial-v4.project.json --out my-film
node my-skills/motion-art-director/scripts/motion.mjs render pedal-180-editorial-v4.project.json --out my-film
node my-skills/motion-art-director/scripts/motion.mjs rhythm-audit pedal-180-editorial-v4.project.json --out my-review
~~~

PLAN_HASH는 바로 앞 plan 명령이 반환한 hash로 바꿉니다. 공개 프로젝트에는 실제 사용자 승인 기록을 넣지 않았습니다. 제작자의 확인을 새로 기록합니다. 수정은 원본을 복사한 새 프로젝트에서 진행하고, 승인 상태를 다시 확인합니다. 음량만 수정하면 그림 캐시는 유지하고, 타격 사건 교정은 rhythm-review에서 내보낸 JSON을 rhythm-compile --events로 적용합니다. 렌더 도중 런타임 코드를 수정하지 않습니다.

## 인코딩 음향 시계 검사

~~~text
ffmpeg -i final.mp4 -vn -ar 48000 -ac 2 -c:a pcm_s16le decoded.wav
python my-skills/motion-art-director/scripts/audio_clock_audit.py mix.wav decoded.wav --windows 15,80,140 --out audio-clock.json
~~~

원본 타격·컷 시작·전환 도착·글자 착지는 별도로 검사합니다. 숫자 일치는 사람의 박자감·전체 청취·미감 승인을 대체하지 않습니다. 순수 단음처럼 주기가 반복되는 구간은 상관 분석이 모호할 수 있어 시작 엔벌로프와 정적 경계를 따로 확인합니다.

## 출처

음악: “The Lift” Kevin MacLeod ([incompetech](https://incompetech.com/music/royalty-free/index.html?Search=Search&isrc=USUAN1500066)), [CC BY4.0](https://creativecommons.org/licenses/by/4.0/). 원곡100–272초 발췌·페이드·음량 편집 및 새 합성 접촉음. 사진/생성AI 이미지를 사용하지 않았습니다. 영상은 Pexels / RDNE Stock project, Pavel Danilyuk, Stephen Pierce의 허용된 소재이며 개별 기록은 프로젝트에 있습니다. 여러 라이더를 연결한 창작으로 한 선수의 경기 기록이 아닙니다.

## 긴 영상의 음량 수정

중간 캐시가 정리돼도 검증된 완성본에서 영상 트랙을 그대로 재사용할 수 있습니다. 새 프로젝트의 연출·음원 변경을 확인한 뒤 실행합니다. 그림·엔진·원본 해시가 달라지면 거부합니다.

~~~text
node my-skills/motion-art-director/scripts/motion.mjs remix revised.project.json --from PRIOR_COMPLETED_RUN --out new-remix
~~~

180초 실제 음량 수정에서 그림0프레임 재렌더, 영상 비트스트림 동일, 이전 본편 보존을 확인했습니다. 공개 웹 MP4는 용량 제한에 맞춘1080p 배포 인코딩이며 로컬 고화질 마스터는 별도 보존됩니다.
