# 모바일 · 인쇄 포스터

[1.3.0-rc.1 편집 포스터 후보](hallym-poster-system/references/EDITORIAL.md): 글·표·도식 혼합과 A2 한영 예시4개를 추가합니다. 기존 legacy/series 동작과 이전 배포본은 보존합니다.

- [1.3.0-rc.1 전체 ZIP](downloads/hallym-poster-system-1.3.0-rc.1.zip)
- [편집 포스터 원고와 SVG](hallym-poster-system/examples/editorial/)
- [A2 PDF·HTML 시험본](examples/editorial-v1.3.0-rc.1/)

새 모드는 검토 후보입니다. 실제 프린터·iOS·Android·카카오 공유 성공을 주장하지 않습니다. A4 포트폴리오 예시는 PDF 대신 웹·세로 HTML로 제공하고, 포스터 산출물은 이 저장소에서 관리합니다.

## 이전 배포본
[Hallym Poster System 1.2.0-rc.5](hallym-poster-system/) — 완결된 모바일 HTML 포스터와 독립 편집 A2 PDF.
4초 순환·라이트/다크 교차·안정된 화면 폭·작은 도구 메뉴·카카오 공유 미리보기를 포함합니다.

- [전체 설치 ZIP](downloads/hallym-poster-system-1.2.0-rc.5.zip)
- [설치·사용 안내](hallym-poster-system/README.md)
- [검증 범위](hallym-poster-system/VALIDATION.md)
- [SHA256](downloads/SHA256SUMS)
- [공개 시험본](https://achmage-slides.vercel.app/experiments/pkm-speaker-posters-2026/)

ZIP은 엔진·폰트·출처·회귀 검사 전체를 포함하며 Python 의존성은 requirements.txt로 설치합니다.
Achmage OS와 MCP는 필수가 아닙니다.

개발자는 python tools/release.py --build 후 python tools/release.py --check를 실행합니다.
