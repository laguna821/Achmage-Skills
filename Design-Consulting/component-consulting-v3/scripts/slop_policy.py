"""slop_policy.py — slop-flag policy, single source of truth (v3.6, H4).

동인: v3.5 는 BAN_FLAGS 를 scan_slop.py 와 corpus_query.py 에 각각
정의했다 — 이중 정의는 한쪽만 고쳐지는 순간 스캐너가 스탬프한 플래그를
질의기가 못 숨기는(또는 그 역) 드리프트를 만든다. 게이트의 어휘는 한
곳에만 산다. scan_slop / corpus_query / verify_corpus 모두 여기서
import 한다.

플래그 의미는 scan_slop.py docstring 이 정본:
  BAN  — 기본 숨김 (corpus_query --include-slop 로만 열람)
  WARN — 표시하되 ⚠ 마커 (처방 가능, 이식 시 함정 처리 의무)
"""

BAN_FLAGS = {"gradient-text", "auto-advance"}
WARN_FLAGS = {"auto-cycle", "clip-text", "initial-hidden"}
ALL_FLAGS = BAN_FLAGS | WARN_FLAGS

# 자동 전환이 '콘텐츠 캐러셀'이 되는 canonical_type — 이 밖(effect·spinner·
# text-effect 등)의 타이머 순환은 프레임/글자 순환이라 WARN(auto-cycle).
CONTENT_TYPES = {"testimonials", "team", "carousel", "logo-cloud", "hero",
                 "features", "content", "card", "stats", "cta", "image-gallery"}
