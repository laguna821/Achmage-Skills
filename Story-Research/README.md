# Story-Research: Achmage Story Research (0.5.0)

이미 쓰인 영상 대본의 초고를 받아, **카드 한 장 한 장을 원자료까지 추적해서 받쳐 주는** 스킬입니다. 선배가 쓴 원고를 받아 든 수습 취재 기자의 일을 합니다. 판정하고, 근거를 대고, 문장을 건드리지 않고 받칠 길을 짚어 주고, 화면에 쓸 자료를 모아 옵니다. 대본을 쓰거나 고쳐 쓰지 않습니다. 그것은 [`achmage-video-script`](../Video-Script)가 합니다.

## 왜 뒤에서 받치나

처음에는 이 스킬이 대본 앞에 섰습니다. 주제를 조사해 이야기를 정하고 화면 문장까지 써서 대본 스킬에 넘겼습니다. 두 주제로 세 방식을 견준 시험의 결과는 이랬습니다.

| | 대본 스킬만 | 취재를 앞에 (옛 판) | 취재를 앞에 (이야기 중심 판) | 쓰고 나서 받치기 |
| --- | --- | --- | --- | --- |
| 근거가 받치는 카드 | 44~48% | 91~92% | 88~90% | 94% |
| 읽는 맛 (누가 썼는지 모르는 독자 둘) | 주제에 따라 1위 또는 중간 | 두 주제 모두 뒤쪽 | 주제에 따라 갈림 | 초고 다음, 취재를 앞에 둔 두 편보다 위 |

취재를 앞에 두면 사실은 단단했지만, 이야기와 문장을 미리 정해 넘기는 만큼 쓰는 쪽의 자유가 사라졌습니다. 그래서 이야기를 찾는 일은 대본 스킬로 옮겼고(achmage-video-script 1.3.0), 이 스킬은 쓴 뒤에 받칩니다. 시험의 범위와 한계는 [VALIDATION.md](VALIDATION.md)에 있습니다.

## 무엇을 하나

| 항목 | 내용 |
| --- | --- |
| 받는 것 | `achmage-video-script`가 쓴 `대본.json` (초고) |
| 카드별 판정 | 진술하는 카드마다 원자료를 열어 `받쳐진다`, `세다`, `없다`, `틀리다`로 판정하고 근거 대목을 원어 그대로 적습니다. 초고가 기댄 글이 요약이나 재인용이면 그 글이 기대는 기록까지 올라갑니다 |
| 가볍게 고칠 길 | 걸린 카드마다 문장과 장면을 가장 덜 건드리는 길을 하나 짚습니다: 구석 표기, 낱말, 조건, 갈아 끼우기, 빼기의 차례. 대안 문장은 써 주지 않고 사실과 근거, 꼭 들어가야 하는 조건, 구석에 달 출처 이름을 줍니다 |
| 꺾임 뒤집어 보기 | 꺾임마다, 핵심 사실마다, 마지막 한 줄마다 그 사실의 이름으로 반대 서술을 찾고 버티는지 적습니다 |
| 인용 대조 | 화면의 인용문을 처음 실린 자료와 글자 단위로 맞추고, 말한 때와 적힌 때, 재인용 여부를 적습니다 |
| 덤 재료와 화면 자료 | 원자료에서 만난 좋은 재료를 적고, 근거가 보이는 쪽과 화면에 쓸 수 있는 자료를 갈무리해 이용 조건과 함께 적습니다 |
| 돌려주는 것 | `받침.json`(판정표), `받침_요약.md`, `받침시트.html`, `화면자료/` |
| 검수 | `scripts/check_backing.py`: 판정표를 대본과 맞춰 19항목을 검사하고 요약과 시트를 만듭니다. Python 3 표준 라이브러리만 씁니다 |
| 사례집 | `references/casebook/`: 규칙의 근거가 된 조사. 묶음 분석 9편, 이야기로 다시 읽기 1편, 자료별 노트 117건 |

하지 않는 것: 대본을 고쳐 쓰지 않습니다. 이야기를 바꾸자고 하지 않습니다. "~라고 한다", "알려져 있다"로 흐리게 말하라고 권하지 않습니다. 화면 구석에 "미확인" 같은 검수 메모를 달라고 하지 않습니다. 사람을 만나 묻는 취재는 범위 밖입니다.

## 설치

필요한 것: Python 3.9 이상(검수와 요약), 그리고 웹을 열 수 있는 에이전트. 다른 패키지는 필요 없습니다.

```text
# A: Claude Code 플러그인 마켓플레이스
/plugin marketplace add laguna821/Achmage-Skills
/plugin install achmage-story-research@achmage-skills
```

```bash
# B: npx
npx skills add laguna821/Achmage-Skills --skill achmage-story-research

# C: 수동 복사 (Claude Code 예시, Codex는 ~/.codex/skills/)
git clone https://github.com/laguna821/Achmage-Skills
cp -r Achmage-Skills/Story-Research/achmage-story-research ~/.claude/skills/achmage-story-research
```

D: 설치 ZIP: [downloads/achmage-story-research-0.5.0.zip](downloads/achmage-story-research-0.5.0.zip) (SHA-256: [downloads/SHA256SUMS](downloads/SHA256SUMS)). 압축을 풀면 `achmage-story-research/` 폴더 하나가 나옵니다.

## 이렇게 요청하세요

- "이 대본 초고 받쳐줘", "카드마다 출처 확인해줘"
- "이 대본 팩트체크하고 고칠 길 알려줘"
- "꺾임이랑 마지막 줄이 버티는지 반대 자료 찾아봐"
- "이 대본에 쓸 화면 자료 모아줘"

초고가 아직 없으면 먼저 `achmage-video-script`로 초고를 씁니다. 판정표가 나오면 `achmage-video-script`의 9단계가 그것으로 걸린 카드만 고칩니다.

## 패키지 구성

| 경로 | 내용 |
| --- | --- |
| [`achmage-story-research/`](achmage-story-research) | 스킬 본체: `SKILL.md`, `references/`(규칙 7개와 사례집 `casebook/` 129개 파일), `scripts/check_backing.py`, `agents/openai.yaml` |
| [`downloads/`](downloads) | 설치 ZIP과 SHA-256 |
| [`PACKAGE-MANIFEST.json`](PACKAGE-MANIFEST.json) | 스킬 파일별 SHA-256 |
| [`tools/verify_package.py`](tools/verify_package.py) | 폴더, 매니페스트, ZIP이 서로 같은지 확인 |
| [`VALIDATION.md`](VALIDATION.md) | 확인한 것과 확인하지 않은 것 |
| [`ASSET-NOTICE.md`](ASSET-NOTICE.md) | 이 분류에 든 것과 들지 않은 것 |

## 판 기록

- 0.5.0 (2026-11-16): 첫 공개판. 내부 시험판 0.1~0.4.1은 대본 앞에서 이야기를 정해 넘기는 스킬이었습니다. 세 방식 비교 시험의 결과로 역할을 바꿔, 쓰인 초고를 뒤에서 받치는 스킬이 됐습니다. 이야기를 찾는 부분은 achmage-video-script 1.3.0으로 옮겼습니다.

## 라이선스

스킬의 글과 코드는 MIT입니다. 사례집의 인용에는 MIT가 적용되지 않습니다. 인용의 범위와 삭제 요청 방법은 [NOTICE.md](achmage-story-research/NOTICE.md)에 적었습니다. 매체 이름은 조사의 출처를 밝히기 위한 것이며, 해당 매체는 이 프로젝트와 관계가 없습니다.
