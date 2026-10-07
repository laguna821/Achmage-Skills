# Motion Art Director — 자체 제작 데모

[브라우저·모바일 공개 갤러리](https://motion-art-director-review-oct05.achmage2.chatgpt.site/) · [스킬 설치](../../motion-art-director) · [검증 범위](../../motion-art-director/VALIDATION.md)

| 파일 | 내용 |
|---|---|
| [city-pulse-180-v1.mp4](city-pulse-180-v1.mp4) | 도시의 맥박:180초·45컷·1080p30, 서울·부산 촬영 자료 + 자체 SVG·타이포 |
| [grandeur-150.mp4](grandeur-150.mp4) | 150초·720p30 모바일 자동차 연구작. 1080p본은 Release 첨부 |
| [ending-12.mp4](ending-12.mp4) | 정지·음악 종료·정적·로고 효과음, 12초·1080p |
| [book.mp4](book.mp4) | 책 제작 150초·1080p, SVG·자체 작곡·효과음 |
| [flight.mp4](flight.mp4) | 항공 안내표→지도·항로→비행기, 15초·1080p |
| [water.mp4](water.mp4) | 체로 입자를 거르는 원리, 12초·1080p |

원본 사용자 레퍼런스 영상은 포함하지 않습니다. 책·항공·체 거르기는 공통 스킬의 examples/에 승인 기록을 제거한 편집 가능한 프로젝트가 있습니다. 자동차 연구작의 형상은 직접 작성한 Three.js/SwiftShader 기하이며 완성 실차 CAD 모델이 아닙니다. 생성 원화·공식 카탈로그·음악 원곡은 공통 패키지에 포함하지 않습니다.

## 크레딧과 재사용

### 도시의 맥박

[본편·장면별 탐색·기법과 검수 기록](https://motion-art-director-review-oct05.achmage2.chatgpt.site/city?v=13#film) · [편집 가능한 프로젝트](city-pulse-180-source.project.json) · [출력 검사](city-pulse-180-verification.json).

- 음악: **The Lift — Kevin MacLeod (incompetech.com)**, [원곡](https://incompetech.com/music/royalty-free/index.html?Search=Search&isrc=USUAN1500066), [CC BY4.0](https://creativecommons.org/licenses/by/4.0/). 발췌·페이드·음량 변화·사건 효과음·합성 환경음과 혼합. 크레딧과 변경 고지를 유지합니다.
- 촬영 자료: [서울역 야간 / Timo Volz](https://www.pexels.com/video/a-busy-city-street-at-night-with-many-cars-26690702/), [부산 해안열차 / 정규송 Nui MALAMA](https://www.pexels.com/video/scenic-tram-ride-by-the-ocean-in-busan-35003236/), [남산 새벽 / Giang](https://www.pexels.com/video/the-sun-rising-behind-the-namsan-tower-7855642/), FREE VIDEO HAPPY의 [도심 교차로](https://www.pexels.com/video/bustling-daytime-intersection-in-seoul-korea-31727051/)·[시장](https://www.pexels.com/video/bustling-street-market-in-seoul-south-korea-36718310/)·[청계천](https://www.pexels.com/video/cheonggyecheon-stream-in-seoul-during-spring-31758112/). [Pexels License](https://www.pexels.com/license/)에 따라 발췌·크롭·합성. 원본 영상은 이 저장소에 재배포하지 않습니다.
- 지도: [Natural Earth50m](https://github.com/nvkelso/natural-earth-vector), public domain. 연결선은 실제 철도 노선이 아닌 개념 표현입니다.
- 새 SVG·타이포·절차적 환경음·효과음 코드: MIT. 환경음과 효과음은 실제 장소의 녹음이 아닙니다.
- 여러 시기에 촬영된 서울·부산 자료를 편집한 독립 작품입니다. 기관의 공식 광고·같은 날의 실제 기록·영상 속 인물의 추천을 뜻하지 않습니다.

이 혼합 작품에 포함된 외부 촬영·음악에는 위 개별 조건이 적용됩니다. 아래 기존 자체 제작 데모의 일반 고지만으로 외부 자산의 조건을 대체하지 않습니다. 사용자 대화·승인 기록·원본 레퍼런스는 포함하지 않았습니다.

자체 제작 영상/그림: Achmage, 2026, 저장소 기본 Apache-2.0. 다음 제3자 구성요소에는 별도 조건이 적용됩니다.

- 자동차/엔딩 음악: **“Exit the Premises” Kevin MacLeod (incompetech.com)** — [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). [원곡](https://incompetech.com/music/royalty-free/index.html?Search=Search&isrc=USUAN1500029). Edited excerpts; tempo adjusted from 128 to 144 BPM; mixed with original synthesized effects. 재배포할 때 제목·저자·라이선스 링크·변경 고지를 유지합니다.
- 로고: [Hyundai Motor Company / Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Hyundai_Motor_Company_logo.svg). 표시색 변경·등장 애니메이션 적용. 상표 권리는 권리자에게 있으며, 현대자동차의 공식 광고나 승인을 의미하지 않습니다.
- 서체·지도·효과 도감: [스킬 외부 고지](../../motion-art-director/THIRD_PARTY_NOTICES.md).
- 책·항공·체 거르기 음악/효과음은 로컬 합성입니다.

자동 디코딩·신호 검사와 인간의 전체 감상 검토는 별개입니다. [자동차 측정](grandeur-qa.json) · [책 측정](book-review.json).

## 이전 음악 비교·분리 음향

이 폴더의 추가 MP4/M4A는 갤러리의 이전 실험과 분리 청취 파일입니다. [작품별 문맥과 출처](https://motion-art-director-review-oct05.achmage2.chatgpt.site/experiments.html) · [12초 음악 비교](https://motion-art-director-review-oct05.achmage2.chatgpt.site/music.html).

- car-review.mp4 및 car-catalyst.m4a: “Catalyst” by Scott Buckley — https://www.scottbuckley.com.au/library/catalyst/ .
- car-phase-shift.m4a: “Phase Shift” by Scott Buckley — https://www.scottbuckley.com.au/library/phase-shift/ .
- car-signal-to-noise.m4a: “Signal to Noise” by Scott Buckley — https://www.scottbuckley.com.au/library/signal-to-noise/ .
- 위 Scott Buckley 음악 모두 CC BY 4.0 https://creativecommons.org/licenses/by/4.0/ . Edited excerpts, fades, gain changes and original synthesized SFX.
- deep-dirty-12 MP4/M4A: “Deep and Dirty” Kevin MacLeod (incompetech.com), https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1900021 , CC BY 4.0. Edited excerpt and gain changes.
- shiny-tech-12 MP4/M4A: “Shiny Tech II” Kevin MacLeod (incompetech.com), https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100077 , CC BY 4.0. Edited excerpt and gain changes.
- exit-premises-12 MP4/M4A 및 grandeur-music.m4a: 위 Exit the Premises 크레딧·CC BY 4.0·144 BPM 편집 조건 적용.
- music-only.m4a·sfx-only.m4a는 책 제작용 자체 합성 음원. car-sfx.m4a·grandeur-sfx.m4a는 자체 합성 효과음이며 실제 차량 녹음이 아닙니다.

미디어는 GitHub Pages의 Range 응답으로 제공하며 갤러리에서 로그인 없이 재생·탐색합니다.


### City v4 and coffee transfer revision

- [City180 v4](city-pulse-180-v4.mp4):14 action/continuity cuts revised; synthetic river bed removed; preserve prior film.
- [Coffee30](coffee-transfer-30-v1.mp4): fresh seven-scene SVG work, new88-note score and object foley; no generated images.
- [Actual revision tests and output report](city-coffee-revision-report.json): text/music/source edits, interruption/resume and original hashes.
- [Gallery](https://motion-art-director-review-oct05.achmage2.chatgpt.site/coffee.html).

Technical verification does not imply full human listening/aesthetic approval, blind independent-agent transfer, complete3.1 release or physical16GB notebook validation. Existing footage/music credits remain in the city project and gallery. Source footage is relinked, not republished as raw stock.

## 단어·음성 동기화 12초 시제품

[모바일 비교 페이지](https://motion-art-director-review-oct05.achmage2.chatgpt.site/word-sync.html) · [정상 MP4](sync-parcel-12-v3-normal.mp4) · [검증 기록](sync-parcel-12-v3-report.json). 네 개의 새 SVG 장면과 직접 쓴 한국어 문장, 로컬 합성 음성, 새 절차적 드럼·베이스·전환음으로 단어의 시점을 시험합니다. ±1·2·4프레임 비교는 전체 믹스를 이동한 의도적 불량 예시입니다. 실제 노래 정렬·미감·전체 청취 합격을 뜻하지 않습니다.
