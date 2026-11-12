# 예제: 대본에서 출발해 끝까지 만든 영상 두 편

웹에서 보기: https://laguna821.github.io/Achmage-Skills/Video-Script/examples/

| 폴더 | 무엇 | 길이 | 언어 | 화면 재료 |
|---|---|---|---|---|
| [`norman-door/`](norman-door) | 노먼 도어: 또 틀렸다, 그런데 누가? | 90초, 카드 16장 | 한국어 | 코드로 그린 그림, 도해, 타이포 |
| [`espresso/`](espresso) | Espresso Is Older Than Its Crema | 150초, 카드 30장 | 영어 | Pexels 실사 영상, 공유 저작물 특허 도면, 벡터 도해, 타이포 |
| [`english-scripts/`](english-scripts) | 영어 대본 세 편의 가편집 시트와 대본 둘(Desire Paths, Cheonggyecheon) | 90초, 89초 | 영어 | 대본만 |

두 영상 모두 이 스킬로 대본을 쓰고, 같은 저장소의 [Motion Art Director](../../Video-Production/motion-art-director) 4.1.0으로 렌더했습니다. 폴더마다 다음이 있습니다.

- 완성본 mp4 (1920x1080, 30fps)
- 대본 JSON: 스킬의 `references/06` 규격. 스킬의 `scripts/build_sheet.py`로 다시 검수하고 시트를 만들 수 있습니다
- `rough-cut-sheet.html`: 가편집 시트. 브라우저에서 바로 열립니다(외부 자원 없음)
- `production-notes.md`: 제작 순서, 대본과 다르게 만든 곳, 검수 결과, 남은 문제
- `credits.md`: 인용, 촬영 자료, 도면, 음악, 효과음의 출처와 조건

## 직접 다시 해 보기

```bash
cd Video-Script/examples/espresso
python ../../achmage-video-script/scripts/build_sheet.py --scripts script.json --lint-only --verbose
python ../../achmage-video-script/scripts/build_sheet.py --scripts script.json --out my-sheet.html --title "Espresso"
```

## 두 편에서 스킬로 돌아온 것

- 노먼 도어: 화면 문장의 자리와 모양(가운데, 가는 흰 글씨, 굵기로만 강조), 음악은 공개 녹음에서 고른다는 규칙, 제작 인계 칸(되풀이되는 대상, 화면 범위, 화면 속 글자, 사건 수)과 제작 읽기 하한.
- Espresso: 영어 대본의 카드 끝(마침표) 규칙과 분량표, 찾아 쓰는 영상의 유형(대상을 찍었으면 실사, 비슷한 것이면 대역), 못 찾을 때의 대안(`visual.footage.fallback`), 참고 자료 카드의 시간, 3줄 카드의 읽기 하한.

예제의 영상과 자료는 스킬의 MIT 라이선스가 아니라 각자의 조건을 따릅니다. [`../ASSET-NOTICE.md`](../ASSET-NOTICE.md)를 보세요.
