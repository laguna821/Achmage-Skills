# 네이티브 이미지 생성 프롬프트

장면마다 한 번씩 Codex 네이티브 이미지 생성 도구를 호출한다. 실제 한국어는 로컬 합성하므로 이미지에는 문자를 만들지 않는다.

## 기본 형식

```text
Use case: scientific-educational
Asset type: 16:9 whiteboard lecture illustration
Primary request: <장면의 시각적 사건과 세 요소>
Style/medium: sophisticated hand-drawn editorial whiteboard illustration, clean ink contours, sparse flat color accents
Composition/framing: wide 16:9 composition, clear visual hierarchy, generous protected title area across the top 20 percent
Color palette: charcoal ink, newsroom blue, restrained coral and amber accents, pale cool-gray paper
Constraints: one coherent scene, simple readable silhouettes, no text, no letters, no numbers, no logo, no watermark, no pseudo-writing, no UI labels
Avoid: photorealism, 3D render, dense background, decorative border, beige cast, Chinese characters, Korean characters
```

## 일관성

- 승인된 앵커 이미지를 이후 장면의 스타일 참조로 사용한다.
- 인물 비율, 선 굵기, 그림자 강도, 파랑·코럴·앰버 사용량을 고정한다.
- 텍스트 안전 영역에는 얼굴, 손, 핵심 사물을 배치하지 않는다.
- 화면을 세 칸으로 기계적으로 나누지 말고 한 장면 안에서 시선이 흐르게 한다.
- 생성 결과의 실제 크기를 `source.nativeWidth`와 `source.nativeHeight`에 기록한다.

## 실패 처리

- 가짜 글자나 숫자가 생기면 그 결과를 채택하지 말고 같은 장면만 다시 생성한다.
- 승인된 파일이 있으면 덮어쓰지 말고 `base-art-v2.png`처럼 버전을 올린다.
- 도구가 중단되면 `report`의 `pending` 장면부터 재개한다.
