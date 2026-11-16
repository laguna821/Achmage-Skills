# The Four-Color Theorem Gets a Rare New Proof

- 필자 / 매체 / 날짜: Gregory Barber (Contributing Writer, 페이지 메타데이터 기준) / Quanta Magazine / 2026-09-10
- URL: https://www.quantamagazine.org/the-four-color-theorem-gets-a-rare-new-proof-20260910/
- 유형: 본보기
- 분량(대략): 영어 약 2,350단어, 소제목 3개
- 읽은 범위: 전문
- 한 줄 요약: 지도 색칠 문제의 새 컴퓨터 증명을 발견의 순간(덴마크 해변)과 역사(1852, 1879, 1976, 1997)로 풀고, 새 증명의 가치를 "정리 자체"가 아니라 "더 빠른 알고리즘과 그래프 구조"에 둔다.

## 1. 질문
답하는 질문: 이미 증명된 4색 정리를 왜 다시 증명했으며, 새 증명은 무엇을 더 알려 주는가.
좁힘: "수학자들이 이미 풀린 문제로 돌아오는 이유"라는 일반 주제에서 "4색 병(four-color disease)"을 앓는 한 연구팀으로 좁힌다.

## 2. 발단
확인 못함. 글 안의 서술로는 2015년 덴마크 Nyborg 해변 학회에서 Kawarabayashi와 Thorup가 "작은 프로젝트는 못 하겠다"고 생각한 것이 시작으로 소개된다(Kawarabayashi의 회상 인용).

## 3. 취재와 자료
확인 못함.
관찰: 링크된 학술 자료 4건(1879년 Kempe 증명으로 보이는 JSTOR 링크, 1976 Appel와 Haken의 학회지 논문, 1997년 단순화 증명, 2026년 3월 arXiv 논문 2603.24880)과 연구자 소속 페이지 5건. 직접 인용된 사람 5명(Thomassen, Thorup, Gonthier, Gethner, Kawarabayashi는 회상 형태). 역사 인물의 글 인용 1건(De Morgan의 1852년 편지). 영상 링크 하나(David Richeson의 해설)가 기사에 삽입된다.

## 4. 축이 되는 사실이나 장면
세 단계의 사실이 쌓인다.
- 역사 장면: Kempe의 1879년 "증명"이 11년 뒤 Heawood에게 오류가 발견되지만 그의 색 교환법(Kempe chain)은 남았다(약 35% 지점).
- 숫자: 8,900개 구성을 줄이는 길 → 1976년 1,936에서 1,482개 → 1997년 633개 → 2026년 8,202개(약 70% 지점). 8,202는 더 커졌지만 병렬로 줄일 수 있어서 단계 수가 n 제곱에서 n log n으로 줄었다.
- 마지막 감정: Thomassen의 "컴퓨터 없는 증명을 원한다" 인용.
핵심 반전은 "새 증명이 더 복잡한데도 가치가 있다"는 점이다.

## 5. 구조
도입부: 일반 문장("어떤 수학 문제는 풀린 뒤에도 연구자를 따라다닌다")으로 시작해 4색 문제를 지도 색칠로 한 문장에 설명하고, 1879년 첫 증명의 오류, 1976년 컴퓨터 증명 논란, 1997년 단순화를 한꺼번에 압축한다. 핵심 문단("After nearly a decade of work ... yet another computer proof")은 앞에서 약 15% 지점이다. 곧바로 새 증명이 "더 복잡"하다는 외부 평가가 이어져 독자의 기대를 낮춘다.
구획 순서:
1. 서문: 문제의 내력 압축, 새 증명 발표 소식, 외부 전문가의 짧은 평가
2. "Computerized Controversy": 1852년 Guthrie의 발견, Kempe의 증명 논리를 도식과 함께 풀이, Heawood의 오류, 1976년 컴퓨터 증명에 대한 회의, 1997년의 수용
3. "Searching No-Man's Land": 2015년 해변, 기존 증명의 비효율, 평탄 영역을 찾는 아이디어, 대학원생 2명과 몇 달의 계산, 8,202개 구성, 효율 개선
4. "New Horizons": 의미(그래프 구조에 대한 새 이해), 도넛형 곡면 확장, "4색 병"이 계속된다는 결말
배경 설명: 2번 구획에 몰아 넣는다. 수학 설명(귀류법, 평면 그래프, 오일러의 성질, 불가피 집합, 환원 가능성)은 도식과 함께 단계적으로 풀고 변수 이름을 거의 쓰지 않는다.
순서의 원리: 시간순과 질문순이 합쳐진다. 역사가 현재로 수렴하는 구조이다.
결말: 인용 한 줄. Thomassen이 "I will never stop thinking about that"이라고 말하는 것으로 끝나고 필자 요약은 없다.

## 6. 근거를 보이는 방식
- 출처: 논문은 동사나 명사구에 링크("first purported proof", "simpler computer-assisted proof", "posted online in March 2026")한다. 날짜는 월까지 적는다. 새 증명은 11월 FOCS 학회에서 발표될 예정이라고 명시한다.
- 수치: 구성 개수는 시기마다 정확히 적는다(8,900, 1,936, 1,482, 633, 8,202). 비효율은 n 제곱 대 n log n. 비교는 항상 앞선 증명과의 대비로 쓴다.
- 인용의 역할: 문제의 매력은 Thomassen이("a problem that even a child can understand"), 컴퓨터 증명에 대한 과거 공포는 Gethner가, 새 증명에 대한 반가움은 컴퓨터 과학자 Gonthier가 말한다. 필자는 수학 설명과 연결 서술만 맡는다.
- 반론과 불확실성: 새 증명이 "in some ways even more complicated"라는 부정적 평가를 서문에 넣는다. 컴퓨터 증명에 대한 역사적 회의도 장면으로 처리한다. "Thorup는 얼마나 걸릴지 몰랐다"처럼 연구자의 순진함도 인용으로 둔다.
- 주장의 세기: "opening up the potential for progress", "Though obstacles remain"처럼 가능성의 말투로 멈춘다. 확장 결과는 "making it possible to prove ... theorems about them as well"라고 하면서 구체 성과는 말하지 않는다.

## 7. 덜어낸 것
확인 못함.

## 8. 화면으로 옮길 수 있는 재료
- Mark Belan/Quanta의 구성(불가피 집합) 도식, Kempe 교환 도식.
- 연구자 사진(Courtesy of Mikkel Thorup, Yuta Inoue).
- De Morgan의 1852년 편지(공개 영역 이미지로 표기됨).
- 일리노이 대학 우체국 소인 "FOUR COLORS SUFFICE"(본문에 언급, 이미지는 확인 못함).
- arXiv 2603.24880 초록과 논문 첫 장(공개 논문).
- David Richeson 해설 영상 링크.

## 9. 앞단 스킬로 가져갈 규칙
1. 오래된 문제는 "지금 일어난 새 소식"을 앞 15% 안에 넣어 시청자에게 왜 지금인지 알린다. 근거: 서문의 "After nearly a decade of work".
2. 수치 비교는 같은 단위의 연속 목록으로 제시한다(8,900 → 1,936 → 1,482 → 633 → 8,202). 근거: 구획 2와 3.
3. 복잡한 설명은 시청자가 이미 가진 장면에서 시작한다(지도 한 장, 국가 하나를 지우기). 근거: Kempe 논리 풀이.
4. 새 결과의 가치는 "헤드라인이 아닌 부산물"에 둘 수 있다고 한 문장으로 말한다. 근거: "greatest value ... lies less with its headline result".
5. 틀렸던 이전 시도도 이름과 연도로 남긴다. 근거: Kempe와 Heawood.
6. 마지막 줄은 인용으로 둔다. 근거: Thomassen의 마지막 말.

## 10. 한계와 불확실
- 필자 정보는 페이지 메타데이터에서 확인한 이름이다.
- 링크 앵커 순서로 어느 링크가 무엇인지 추정했다. 논문 내용은 직접 열어 확인하지 않았다.
- 수학적 서술의 정확성은 평가하지 않았다.
