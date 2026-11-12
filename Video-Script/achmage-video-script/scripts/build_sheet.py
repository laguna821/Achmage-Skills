#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""대본 JSON을 검수하고 가편집 시트 HTML을 만든다.

사용법:
    python build_sheet.py --scripts a.json [b.json ...] --out sheet.html [--title "가편집 시트"]
    python build_sheet.py --scripts a.json --lint-only

표준 라이브러리만 쓴다. 검수 규칙의 뜻은 references/05-검수.md 에 있다.
"""
import argparse
import datetime
import json
import os
import re
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

FAMILIES = {
    "A1": "에세이형", "A2": "사건에서 개념으로", "A3": "다시 보기", "B": "사건 중계형",
    "C": "인물·사물 서사형", "D1": "발견 전달형", "D2": "개념 설명형", "L": "구획형",
}
KINDS = ("편집", "인용", "표기", "제목", "이름", "무문장")
VISUAL_TYPES = ("실사", "기록", "재연", "일러스트", "도해", "타이포", "스톡")
ENDING_TYPES = ("질문", "인용", "사실", "선언")
CONNECTIVES_KO = (
    "그런데", "그러나", "하지만", "그리고", "그렇다면", "이는", "반면", "한편", "그럼에도",
    "결국", "그래서", "다행히", "그러자", "이때", "그뿐만 아니라", "그뿐 아니라", "그래도",
    "그러니까", "그렇게", "그로부터", "그중", "오히려", "정작", "문제는", "다만", "단",
)
CONNECTIVES_EN = ("but", "and yet", "yet", "so", "however", "then", "still", "instead", "and", "now", "today", "usually", "until")
EVALUATIVE_KO = (
    "놀라운", "놀랍게도", "놀랍다", "안타까운", "안타깝", "충격적", "대단한", "위대한", "감동적",
    "훌륭한", "끔찍한", "황당한", "멋진", "아름다운", "슬픈", "경이로운", "엄청난", "무려", "기적",
)
EVALUATIVE_EN = ("amazing", "incredible", "shocking", "stunning", "sadly", "unfortunately", "awesome", "heartbreaking")
PREACH_KO = (
    "해야 한다", "해야 합니다", "해야만 한다", "해야만 합니다", "합시다", "기억하자", "기억합시다",
    "잊지 말자", "잊지 맙시다", "잊지 말아야", "명심하자", "바랍니다", "해야 할 때", "필요가 있다",
)
PREACH_EN = ("we must", "we should", "you should", "let's ", "remember to", "don't forget")

LEVEL_ORDER = {"실패": 0, "주의": 1, "통과": 2}


PUNCT_RE = re.compile(r"[\s\"'“”‘’「」『』.,!?…‥·:;()\[\]/~\-]")


def nchars(text):
    """글자 수. 공백과 문장부호는 세지 않는다."""
    return len(PUNCT_RE.sub("", text or ""))


def nwords(text):
    return len((text or "").split())


def card_text(card):
    return " ".join(card.get("lines") or [])


def strip_tail(s):
    return re.sub(r"[\"'’”」』)\]\s]+$", "", (s or "").strip())


def is_open_card(card, lang):
    """문장이 끝나지 않은 채 다음 카드로 넘기는 카드인가."""
    lines = card.get("lines") or []
    if not lines:
        return False
    last = strip_tail(lines[-1])
    if not last:
        return False
    if last.endswith(("…", "...", ",", ":", "‥")):
        return True
    if lang == "en":
        return not last.endswith((".", "?", "!"))
    if last.endswith(("?", "!", ".")):
        return False
    return not re.search(r"(다|요|까|죠|네요|군요|지요)$", last)


HANDOFF_RE = re.compile(
    r"(에서|에게|으로|부터|까지|보다|처럼|이라면|라면|지만|는데|은데|인데|더니|으며|면서|하고|이고|하자|이자|하면|으면|다면|려고|도록|어서|아서|해서|하여|이며|"
    r"하는|되는|있는|없는|같은|라는|다는|했던|하던|"
    r"을|를|은|는|의|와|과|도|만|에|로|고|며|면|자|서|던|니)$")
# 조사나 어미처럼 보이지만 명사인 낱말. 넘김으로 잘못 세지 않게 먼저 걸러 낸다.
NOUN_EXC_RE = re.compile(
    r"(글자|문자|숫자|의자|상자|부자|여자|남자|과자|모자|액자|학자|기자|환자|독자|저자|"
    r"미만|불만|낭만|온도|정도|속도|지도|태도|제도|각도|강도|빈도|밀도|고도|용도|의도|"
    r"문서|순서|질서|도서|비서|부서|증서|어머니|할머니|주머니|바구니|"
    r"결과|효과|사과|학과|성과|광고|창고|경고|보고|사고|최고|참고|도로|진로|통로|피로|위로|"
    r"커피|소리|자리|거리|머리|다리|우리|이야기)$")


def ending_class(card, lang):
    """카드가 어떻게 끝나는가: '끝맺음', '넘김'(연결어미·조사·쉼표로 다음 카드에 넘긴다), '명사'(명사로 멈춘다)."""
    if card.get("end") in ("넘김", "명사", "끝맺음"):
        return card.get("end")
    lines = card.get("lines") or []
    if not lines:
        return None
    last = strip_tail(lines[-1])
    if not last:
        return None
    if last.endswith(("…", "...", ",", ":", "‥")):
        return "넘김"
    if lang == "en":
        return "끝맺음" if last.endswith((".", "?", "!")) else "넘김"
    if last.endswith(("?", "!", ".")):
        return "끝맺음"
    if re.search(r"(다|요|까|죠|네요|군요|지요)$", last):
        return "끝맺음"
    if NOUN_EXC_RE.search(last):
        return "명사"
    if HANDOFF_RE.search(last):
        return "넘김"
    return "명사"


def src_list(card):
    s = card.get("src")
    if not s:
        return []
    return s if isinstance(s, list) else [s]


PREACH_RE = re.compile(r"((어|아|여|해|져|워|라)야\s?(한다|합니다|만|할|하는|겠다|겠습니다|해요|하지)|합시다|봅시다|하자|보자|하라|하세요|하십시오|마라|맙시다|말자|바랍니다|바란다)\s*$")


SPELLED_EN_RE = re.compile(
    r"\b(two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|"
    r"twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|million|billion|dozen|twice)\b", re.I)
CONT_PREFIX = ("(앞 장면 계속)", "(continues", "(continued", "(same")


def is_continuation(desc):
    return (desc or "").strip().lower().startswith(CONT_PREFIX)


def numeric_tokens(text, lang="ko"):
    """연도와 날짜가 아닌 수치 토큰. 영어는 네 자리 연도(1500~2099)를 빼고 글자로 쓴 수(one 제외)를 더한다."""
    out = []
    s = text or ""
    for m in re.finditer(r"\d[\d,\.]*", s):
        tail = s[m.end():m.end() + 3]
        if re.match(r"\s?(년대|년|월|일|세기)", tail):
            continue
        tok = m.group(0).rstrip(".,")
        if lang == "en" and re.fullmatch(r"(1[5-9]|20)\d\d", tok):
            continue
        out.append(tok)
    if lang == "en":
        out += [w.lower() for w in SPELLED_EN_RE.findall(s)]
    return out


def lint(script):
    meta = script.get("meta") or {}
    beats = script.get("beats") or []
    cards = script.get("cards") or []
    lang = meta.get("lang", "ko")
    fam = meta.get("family", "")
    acc = 0.0
    for c in cards:
        if c.get("t") is None:
            c["t"] = round(acc, 2)
        acc = float(c.get("t", 0)) + float(c.get("d", 0))
    results = []
    flags = {}

    def add(code, level, title, msg, card_ids=None):
        results.append({"code": code, "level": level, "title": title, "msg": msg, "cards": card_ids or []})
        if level != "통과":
            for cid in card_ids or []:
                flags.setdefault(cid, []).append({"code": code, "level": level, "title": title})

    def size(card):
        return nwords(card_text(card)) if lang == "en" else nchars(card_text(card))

    unit = "단어" if lang == "en" else "자"
    text_cards = [c for c in cards if c.get("kind") in ("편집", "인용", "이름")]
    edit_cards = [c for c in cards if c.get("kind") == "편집"]
    quote_cards = [c for c in cards if c.get("kind") == "인용"]
    silent_cards = [c for c in cards if c.get("kind") == "무문장"]
    total = 0.0
    if cards:
        total = float(cards[-1].get("t", 0)) + float(cards[-1].get("d", 0))
    target = float(meta.get("target_seconds") or 0)

    # ---------- 기본 꼴 ----------
    bad_kind = [c.get("id") for c in cards if c.get("kind") not in KINDS]
    if bad_kind:
        add("kind", "실패", "카드 구분", "kind 값이 규격에 없다 (편집, 인용, 표기, 제목, 이름, 무문장)", bad_kind)
    beat_ids = {b.get("id") for b in beats}
    bad_beat = [c.get("id") for c in cards if c.get("beat") not in beat_ids]
    if bad_beat:
        add("beat-ref", "실패", "비트 연결", "카드가 가리키는 비트가 beats에 없다", bad_beat)
    required_meta = ["title", "lang", "family", "family_reason", "target_seconds", "hook_mode", "logline",
                     "audience_belief", "axis_fact", "ending", "materials", "sources"]
    missing_meta = [k for k in required_meta if k not in meta or meta.get(k) in (None, "")]
    if missing_meta:
        add("meta", "실패", "설계 결정", "meta에 빠진 항목: " + ", ".join(missing_meta))
    else:
        add("meta", "통과", "설계 결정", "설계 결정 항목이 모두 적혀 있다")
    if fam not in FAMILIES:
        add("family", "실패", "갈래", "family 값이 규격에 없다: %r" % fam)

    # ---------- 시간 ----------
    overlap, gaps = [], []
    for a, b in zip(cards, cards[1:]):
        gap = float(b.get("t", 0)) - (float(a.get("t", 0)) + float(a.get("d", 0)))
        if gap < -0.05:
            overlap.append(b.get("id"))
        elif gap > 0.5:
            gaps.append(b.get("id"))
    if overlap:
        add("timing", "실패", "시각 이어짐", "앞 카드와 시간이 겹친다", overlap)
    elif gaps:
        add("timing", "주의", "시각 이어짐", "앞 카드와 0.5초 넘게 비어 있다. 문장 없는 구간이면 무문장 카드로 적는다", gaps)
    else:
        add("timing", "통과", "시각 이어짐", "카드의 시각이 빈틈없이 이어진다")
    if target:
        diff = abs(total - target) / target
        msg = "전체 %.0f초, 목표 %.0f초 (차이 %.0f%%)" % (total, target, diff * 100)
        add("duration", "실패" if diff > 0.25 else "주의" if diff > 0.10 else "통과", "전체 길이", msg)

    # ---------- 분량과 속도 ----------
    long_warn, long_fail, lines_fail, line_warn, line_fail = [], [], [], [], []
    lim_edit, lim_quote = ((13, 17), (20, 28)) if lang == "en" else ((36, 41), (51, 71))
    lw, lf = (7, 10) if lang == "en" else (19, 25)
    for c in text_cards:
        n = size(c)
        is_quote = c.get("kind") == "인용"
        warn_at, fail_at = lim_quote if is_quote else lim_edit
        if n >= fail_at:
            long_fail.append(c.get("id"))
        elif n >= warn_at:
            long_warn.append(c.get("id"))
        if len(c.get("lines") or []) >= (5 if is_quote else 4):
            lines_fail.append(c.get("id"))
        for ln in c.get("lines") or []:
            k = nwords(ln) if lang == "en" else nchars(ln)
            if k >= lf:
                line_fail.append(c.get("id"))
                break
            if k >= lw:
                line_warn.append(c.get("id"))
                break
    if long_fail:
        add("card-length", "실패", "카드 분량", "카드가 너무 길다. 둘로 나눈다 (편집 %d%s, 인용 %d%s 이상)" % (lim_edit[1], unit, lim_quote[1], unit), long_fail)
    if long_warn:
        add("card-length", "주의", "카드 분량", "카드가 길다 (편집 %d%s, 인용 %d%s 이상). 수식어를 장면으로 보낼 수 있는지 본다" % (lim_edit[0], unit, lim_quote[0], unit), long_warn)
    if not long_fail and not long_warn:
        add("card-length", "통과", "카드 분량", "모든 카드가 분량 안에 있다")
    if lines_fail:
        add("card-lines", "실패", "카드 줄 수", "한 카드에 줄이 너무 많다 (편집 4줄 이상)", lines_fail)
    if line_fail:
        add("line-length", "실패", "줄 길이", "한 줄이 %d%s 이상이다" % (lf, unit), line_fail)
    if line_warn:
        add("line-length", "주의", "줄 길이", "한 줄이 %d%s 이상이다. 의미 덩어리에서 한 번 더 끊는다" % (lw, unit), line_warn)
    if not line_fail and not line_warn:
        add("line-length", "통과", "줄 길이", "모든 줄이 %d%s 이내다" % (lw - 1, unit))

    speed_warn, speed_fail, dur_warn = [], [], []
    warn_speed, fail_speed = (2.5, 3.6) if lang == "en" else (3.5, 5.0)
    min_d = 1.5 if fam == "B" else 2.0
    for c in text_cards:
        d = float(c.get("d", 0)) or 0.001
        extra = (nwords(c.get("label")) if lang == "en" else nchars(c.get("label"))) if c.get("label") else 0
        sp = (size(c) + extra * 0.5) / d  # 구석 표기는 훑어 읽는 작은 글씨라 절반만 센다
        if sp > fail_speed:
            speed_fail.append(c.get("id"))
        elif sp > warn_speed:
            speed_warn.append(c.get("id"))
        single_word = len(c.get("lines") or []) == 1 and nchars(card_text(c)) <= 8
        if (d < min_d and not single_word) or d > 12:
            dur_warn.append(c.get("id"))
    if speed_fail:
        add("read-speed", "실패", "읽는 속도", "읽을 시간이 모자란다 (구석 표기는 절반으로 쳐서 초당 %.1f%s 초과)" % (fail_speed, unit), speed_fail)
    if speed_warn:
        add("read-speed", "주의", "읽는 속도", "읽을 시간이 빠듯하다 (초당 %.1f%s 초과)" % (warn_speed, unit), speed_warn)
    if not speed_fail and not speed_warn:
        add("read-speed", "통과", "읽는 속도", "모든 카드를 읽을 시간이 충분하다")
    if dur_warn:
        add("card-duration", "주의", "카드 노출 시간", "노출이 %.1f초 미만이거나 12초를 넘는다" % min_d, dur_warn)

    edit_size = sum(size(c) for c in edit_cards)
    quote_size = sum(size(c) for c in quote_cards)
    density = edit_size / total if total else 0
    d_warn, d_fail = (1.6, 2.2) if lang == "en" else (3.4, 4.2)
    add("total-density", "실패" if density > d_fail else "주의" if density > d_warn else "통과", "전체 밀도",
        "편집 문장 %d%s ÷ %.0f초 = 초당 %.2f%s (기준 %.1f 이하)" % (edit_size, unit, total, density, unit, d_warn))
    if total >= 60 and fam != "B":
        if lang == "en":
            low = 0.95 if fam in ("A1", "A2", "A3") else 0.7 if fam in ("D1", "D2") else 0.75
            thin_avg, thin_note = 6, "기준 6~12단어"
        else:
            low = 2.0 if fam in ("A1", "A2", "A3") else 1.5 if fam in ("D1", "D2") else 1.6
            thin_avg, thin_note = 15, "기준 2줄 20~35자"
        if density < low:
            add("thin-density", "주의", "성긴 대본",
                "편집 문장이 초당 %.2f%s뿐이다 (이 갈래는 %.1f 이상). 사례나 근거가 모자라거나 카드가 지나치게 느리다" % (density, unit, low))
        else:
            add("thin-density", "통과", "성긴 대본", "편집 문장의 양이 길이에 견주어 모자라지 않는다")
        avg = edit_size / len(edit_cards) if edit_cards else 0
        if edit_cards and avg < thin_avg:
            add("thin-cards", "주의", "잘게 쪼갠 카드",
                "편집 카드 평균이 %.1f%s다 (%s). 한 줄짜리 조각 카드가 많다. 두 장을 한 장의 2줄 카드로 묶는다" % (avg, unit, thin_note))
        elif edit_cards:
            add("thin-cards", "통과", "잘게 쪼갠 카드", "편집 카드 평균 %.1f%s" % (avg, unit))
    all_size = sum(size(c) for c in cards if c.get("kind") != "무문장") + sum(
        (nwords(c.get("label")) if lang == "en" else nchars(c.get("label"))) for c in cards if c.get("label"))
    load = all_size / total if total else 0
    load_warn = 2.0 if lang == "en" else 4.0
    add("screen-load", "주의" if load > load_warn else "통과", "화면 글자 전체",
        "편집, 인용, 이름, 제목, 표기, 구석 표기를 모두 합쳐 %d%s, 초당 %.2f%s (기준 %.1f 이하)" % (all_size, unit, load, unit, load_warn))
    if fam in ("D1", "D2"):
        n = sum(1 for c in edit_cards if ending_class(c, lang) != "넘김")
        add("sentence-count", "실패" if n >= 12 else "주의" if n >= 9 else "통과", "문장 수",
            "편집 문장 약 %d개 (90초 설명형은 7개 안팎, 9개부터 주의). 다음 카드로 넘기지 않는 카드를 문장 하나로 센다" % n)
    lab_long, lab_fast, ttl_long, ov_long = [], [], [], []
    for c in cards:
        if c.get("kind") == "표기":
            n = size(c)
            d = float(c.get("d", 0)) or 0.001
            if n > (16 if lang == "en" else 34):
                lab_long.append(c.get("id"))
            elif n / d > (3.6 if lang == "en" else 6.0):
                lab_fast.append(c.get("id"))
        if c.get("kind") in ("제목", "이름") and size(c) > (8 if lang == "en" else 16):
            ttl_long.append(c.get("id"))
        if c.get("label") and nchars(c.get("label")) > (40 if lang == "en" else 30):
            ov_long.append(c.get("id"))
    if lab_long:
        add("label-length", "주의", "표기 카드 분량", "표기 카드가 길다 (%s 초과). 둘로 나누거나 줄인다" % ("16단어" if lang == "en" else "34자"), lab_long)
    if lab_fast:
        add("label-speed", "주의", "표기 카드 속도", "표기 카드를 읽을 시간이 모자란다 (초당 %s 초과)" % ("3.6단어" if lang == "en" else "6자"), lab_fast)
    if ttl_long:
        add("title-length", "주의", "제목·이름 카드 분량", "제목이나 이름 카드가 %s를 넘는다. 화면 제목은 짧게" % ("8단어" if lang == "en" else "16자"), ttl_long)
    if ov_long:
        add("overlay-length", "주의", "구석 표기 분량", "카드에 겹쳐 띄우는 작은 글씨(label)가 %d자를 넘는다 (공백과 문장부호 제외)" % (40 if lang == "en" else 30), ov_long)

    # ---------- 구조 ----------
    title_idx = next((i for i, c in enumerate(cards) if c.get("kind") == "제목"), None)
    title_t = float(cards[title_idx].get("t", 0)) if title_idx is not None else None
    if title_idx is None:
        if fam in ("A1", "A2", "A3"):
            add("title-card", "실패", "제목 카드", "제목 카드가 없다")
        else:
            add("title-card", "통과", "제목 카드", "이 갈래는 제목 카드가 없어도 된다")
    else:
        lo, hi = (25, 60) if fam == "A2" else (20, 60)
        if fam in ("A1", "A2", "A3") and not (lo <= title_t <= hi):
            add("title-card", "주의", "제목 카드", "제목이 %.0f초에 온다 (권장 %d~%d초)" % (title_t, lo, hi), [cards[title_idx].get("id")])
        else:
            add("title-card", "통과", "제목 카드", "제목이 %.0f초에 온다" % title_t)

    name_idx = next((i for i, c in enumerate(cards) if c.get("kind") == "이름"), None)
    if title_idx is not None:
        hook_cards = cards[:title_idx]
    elif name_idx is not None and meta.get("hook_mode") in ("감춤", "그림"):
        hook_cards = cards[:name_idx]
    else:
        hook_cards = [c for c in cards if float(c.get("t", 0)) < max(20.0, total * 0.15)]
    if meta.get("hook_mode") == "그림" and (meta.get("withhold") or []):
        terms = [t for t in meta.get("withhold") if t]
        leaked = [c.get("id") for c in hook_cards if any(t in card_text(c) for t in terms)]
        if leaked:
            add("withhold", "실패", "감출 낱말", "이름 카드 전에 감출 낱말이 나온다: " + ", ".join(terms), leaked)
        else:
            add("withhold", "통과", "감출 낱말", "이름 카드 전까지 감출 낱말(" + ", ".join(terms) + ")이 나오지 않는다")
    if meta.get("hook_mode") == "감춤":
        terms = [t for t in (meta.get("withhold") or []) if t]
        if not terms:
            add("withhold", "실패", "감출 낱말", "감춤형 훅인데 meta.withhold가 비어 있다")
        else:
            leaked = []
            for c in hook_cards:
                txt = card_text(c)
                if any(t in txt for t in terms):
                    leaked.append(c.get("id"))
            if leaked:
                add("withhold", "실패", "감출 낱말", "제목 전에 감출 낱말이 나온다: " + ", ".join(terms), leaked)
            else:
                add("withhold", "통과", "감출 낱말", "제목 전까지 감출 낱말(" + ", ".join(terms) + ")이 나오지 않는다")
        hook_text = [c for c in hook_cards if c.get("kind") == "편집"]
        if hook_text:
            last = hook_text[-1]
            lt = strip_tail(card_text(last))
            hypo = ("모른다" in lt) or lt.endswith("?") or ("일까" in lt) or ("는지도" in lt)
            if ending_class(last, lang) == "끝맺음" and not hypo:
                add("hook-close", "주의", "훅의 끝", "훅의 마지막 카드가 닫힌 서술이다. 예고형 명사구나 가설로 멈추는 편이 낫다", [last.get("id")])
            else:
                add("hook-close", "통과", "훅의 끝", "훅의 마지막 카드가 열려 있다")

    if meta.get("hook_mode") == "리드":
        first_text = next((c for c in cards if c.get("kind") in ("편집", "인용")), None)
        if not meta.get("lead"):
            add("lead", "주의", "리드", "리드형 훅인데 meta.lead(첫 문장에 말할 결과)가 비어 있다")
        elif first_text is not None and float(first_text.get("t", 0)) > 8:
            add("lead", "주의", "리드", "리드 문장이 %.0f초에야 나온다. 리드형은 첫 카드에서 결과를 말한다" % float(first_text.get("t", 0)), [first_text.get("id")])
        else:
            add("lead", "통과", "리드", "첫 문장이 결과를 먼저 말한다")
    if fam == "C":
        marks = 0
        for c in cards:
            blob = card_text(c) + " " + (c.get("label") or "")
            if lang == "en":
                hit = re.search(r"(\b(1[5-9]|20)\d\d\b|\b(years?|decades?|months?|days?|centur(y|ies))\s+(later|earlier|ago|on)\b|\bfor\s+\w+(\s+more)?\s+(years|decades)\b|\b(today|that year|the next year|the following year|by then)\b|\bat (age )?\d+\b)", blob, re.I)
            else:
                hit = re.search(r"(\d{3,4}\s?년|\d+\s?(살|세)\b|\d+\s?(살|세)에|그해|이듬해|\d+\s?년 뒤|\d+\s?일 뒤|오늘)", blob)
            if hit:
                marks += 1
        add("time-markers", "통과" if marks >= 3 else "주의", "시간 표지",
            "연도·나이·경과 표지가 든 카드 %d장 (서사형은 마디마다 시간 표지를 세운다. 3장 이상)" % marks)

    turn_cards = [c for c in cards if c.get("turn")]
    need = 2 if fam in ("A1", "A2", "A3") else 1 if fam in ("B", "C") else 0
    add("turns", "통과" if len(turn_cards) >= need else "주의", "꺾임",
        "꺾임 카드 %d장 (이 갈래는 %d장 이상)" % (len(turn_cards), need), [c.get("id") for c in turn_cards] if len(turn_cards) < need else [])
    if fam in ("A1", "A2", "A3") and total:
        if name_idx is not None:
            pos = float(cards[name_idx].get("t", 0)) / total
            ok = 0.28 <= pos <= 0.66
            add("name-position", "통과" if ok else "주의", "이름의 자리",
                "이름 카드가 전체의 %.0f%% 지점에 온다 (사례와 근거를 본 뒤, 30~65%%)" % (pos * 100), [] if ok else [cards[name_idx].get("id")])
        if fam in ("A1", "A3") and len(turn_cards) >= 2:
            pos = float(turn_cards[-1].get("t", 0)) / total
            ok = 0.50 <= pos <= 0.80
            add("second-turn", "통과" if ok else "주의", "둘째 꺾임의 자리",
                "마지막 꺾임이 전체의 %.0f%% 지점에 온다 (권장 55~75%%)" % (pos * 100), [] if ok else [turn_cards[-1].get("id")])
    conns = CONNECTIVES_EN if lang == "en" else CONNECTIVES_KO
    bad_turn = []
    for c in turn_cards:
        first = re.sub(r"^[\"'‘“「『(\[\s]+", "", (c.get("lines") or [""])[0])
        if not any(first.lower().startswith(w) for w in conns):
            bad_turn.append(c.get("id"))
    if bad_turn:
        add("turn-word", "주의", "꺾임의 접속어", "꺾임 카드의 첫 줄이 접속어로 시작하지 않는다", bad_turn)
    elif turn_cards:
        add("turn-word", "통과", "꺾임의 접속어", "꺾임 카드가 모두 접속어로 시작한다")
    else:
        add("turn-word", "통과", "꺾임의 접속어", "해당 없음 (꺾임 카드가 없다)")

    cls = [ending_class(c, lang) for c in edit_cards]
    n_edit = len(edit_cards) or 1
    closed_ratio = cls.count("끝맺음") / n_edit
    handoff_ratio = cls.count("넘김") / n_edit
    noun_ratio = cls.count("명사") / n_edit
    open_ratio = 1 - closed_ratio
    if edit_cards:
        msg = "편집 카드 %d장: 다음 카드로 넘김 %.0f%%, 명사로 멈춤 %.0f%%, 끝맺음 %.0f%%." % (len(edit_cards), handoff_ratio * 100, noun_ratio * 100, closed_ratio * 100)
        if closed_ratio > 0.70:
            add("card-endings", "주의", "카드의 끝", msg + (" 카드마다 문장이 끝난다. 한 문장을 2~3장에 나누고 앞 카드를 전치사구나 접속사 앞에서 끊는다" if lang == "en" else " 카드마다 문장이 끝난다. 한 문장을 2~3장에 나누고 앞 카드를 연결어미에서 끊는다"))
        elif closed_ratio < 0.12 and fam != "A2":
            add("card-endings", "주의", "카드의 끝", msg + (" 끝맺는 카드가 거의 없다. 영어는 문장이 끝나는 카드에 마침표를 찍는다 (02 11절). 마침표가 없으면 모두 넘김으로 센다" if lang == "en" else " 끝맺는 카드가 거의 없다. 결과와 판단은 '-다'로 세운다"))
        elif handoff_ratio < 0.15:
            add("card-endings", "주의", "카드의 끝", msg + " 다음 카드를 기다리게 하는 카드가 적다. 명사로 멈추는 카드만으로는 당기는 힘이 약하다")
        else:
            add("card-endings", "통과", "카드의 끝", msg)

    need_sil = 3 if total >= 180 else 1 if total >= 60 else 0
    add("silence", "통과" if len(silent_cards) >= need_sil else "주의", "문장 없는 구간",
        "무문장 카드 %d곳, 합계 %.0f초 (이 길이는 %d곳 이상)" % (len(silent_cards), sum(float(c.get("d", 0)) for c in silent_cards), need_sil))

    last_text_idx = None
    for i in range(len(cards) - 1, -1, -1):
        if cards[i].get("kind") in ("편집", "인용"):
            last_text_idx = i
            break
    last_text = cards[last_text_idx] if last_text_idx is not None else None
    if last_text is not None:
        prev = cards[last_text_idx - 1] if last_text_idx > 0 else None
        if prev is not None and prev.get("kind") == "무문장":
            add("pre-ending-pause", "통과", "마지막 한 줄 앞의 뜸", "마지막 한 줄 앞에 문장 없는 장면이 %.0f초 있다" % float(prev.get("d", 0)))
        elif total < 120:
            add("pre-ending-pause", "통과", "마지막 한 줄 앞의 뜸", "2분 미만이라 뜸은 선택이다")
        else:
            add("pre-ending-pause", "주의", "마지막 한 줄 앞의 뜸", "마지막 한 줄 바로 앞에 문장 없는 장면(3~6초)이 없다", [last_text.get("id")])

    # ---------- 문장 ----------
    multi_num = []
    for c in edit_cards:
        if c.get("compare"):
            continue
        if len(set(numeric_tokens(card_text(c), lang))) >= 2:
            multi_num.append(c.get("id"))
    if multi_num:
        add("numbers", "주의", "수치", "한 카드에 수치가 둘 이상이다. 나누거나, 일부러 맞세운 것이면 compare: true", multi_num)
    else:
        add("numbers", "통과", "수치", "수치가 한 카드에 하나씩이다")
    ev_words = EVALUATIVE_EN if lang == "en" else EVALUATIVE_KO
    ev = []
    for c in edit_cards:
        txt = card_text(c).lower()
        if any(w in txt for w in ev_words) or "!" in txt:
            ev.append(c.get("id"))
    if ev:
        add("evaluative", "주의", "평가 표현", "편집 문장에 평가 형용사나 느낌표가 있다. 인용이나 수치 대비에 맡길 수 있는지 본다", ev)
    else:
        add("evaluative", "통과", "평가 표현", "편집 문장에 평가 형용사와 느낌표가 없다")
    bad_em = []
    for c in cards:
        em = c.get("em")
        if em and em not in card_text(c) and em not in "".join(c.get("lines") or []):
            bad_em.append(c.get("id"))
    if bad_em:
        add("emphasis", "실패", "강조", "em이 카드 문장 안에 없는 구절이다", bad_em)
    if lang != "en":
        per = [c.get("id") for c in edit_cards if any(re.search(r"(?<![\d.])\.$", (ln or "").strip()) for ln in (c.get("lines") or []))]
        if per:
            add("period", "주의", "마침표", "편집 문장에는 마침표를 찍지 않는다", per)

    # ---------- 결말 ----------
    ending = meta.get("ending") or {}
    if ending.get("type") not in ENDING_TYPES:
        add("ending-type", "실패", "결말 유형", "meta.ending.type은 질문, 인용, 사실, 선언 가운데 하나여야 한다")
    else:
        add("ending-type", "통과", "결말 유형", "마지막 한 줄의 유형: " + ending.get("type"))
    if last_text is not None:
        lt = card_text(last_text)
        pre = PREACH_EN if lang == "en" else PREACH_KO
        hit = [w for w in pre if w in lt.lower()]
        if lang != "en":
            m_pre = PREACH_RE.search(strip_tail(lt).rstrip(".!"))
            if m_pre and m_pre.group(0).strip() not in hit:
                hit.append(m_pre.group(0).strip())
        if hit:
            lvl = "주의" if ending.get("type") == "선언" else "실패"
            add("ending-preach", lvl, "당부로 끝나는가", "마지막 한 줄에 당부·당위 표현이 있다: " + ", ".join(hit), [last_text.get("id")])
        else:
            add("ending-preach", "통과", "당부로 끝나는가", "마지막 한 줄이 당부나 요약이 아니다")
        kind = ending.get("callback_kind", "낱말")
        cb = (ending.get("callback") or "").strip()
        if kind == "없음":
            add("callback", "주의", "되받기", "되받기를 쓰지 않았다. 서사형의 후일담 결말이 아니면 훅을 되받는다")
        elif kind == "장면":
            first_cb = any((c.get("visual") or {}).get("callback") for c in cards if float(c.get("t", 0)) <= max(45.0, total * 0.25))
            last_cb = any((c.get("visual") or {}).get("callback") for c in cards if float(c.get("t", 0)) >= total * 0.80)
            if first_cb and last_cb:
                add("callback", "통과", "되받기", "첫 장면이 끝에서 다시 나온다: " + cb)
            else:
                add("callback", "주의", "되받기", "되받을 장면이 앞과 끝 양쪽에 표시되어 있지 않다 (visual.callback)")
        else:
            if title_idx is not None:
                early = [c for c in cards[:title_idx + 1] if c.get("kind") in ("편집", "인용", "제목")]
            else:
                early = [c for c in cards if c.get("kind") in ("편집", "인용") and float(c.get("t", 0)) <= min(45.0, max(15.0, total * 0.25))]
            tail_cards = [c for c in cards if c.get("kind") in ("편집", "인용")][-3:]
            def has_cb(c):
                t = " ".join(card_text(c).split())
                return bool(cb) and ((cb.lower() in t.lower()) if lang == "en" else (cb in t or cb in card_text(c)))
            in_early = any(has_cb(c) for c in early)
            in_tail = any(has_cb(c) for c in tail_cards)
            if cb and in_early and in_tail:
                add("callback", "통과", "되받기", "앞에서 심은 말을 끝에서 되받는다: " + cb)
            else:
                where = []
                if not in_early:
                    where.append("훅(제목까지, 제목이 없으면 앞 25%)")
                if not in_tail:
                    where.append("마지막 세 장")
                add("callback", "주의", "되받기", "되받는 낱말 '%s'이 %s에 없다" % (cb, "과 ".join(where)))

    # ---------- 사실과 장면 ----------
    src_ids = {s.get("id") for s in (meta.get("sources") or [])}
    q_missing = []
    for i, c in enumerate(cards):
        if c.get("kind") != "인용":
            continue
        nxt = cards[i + 1] if i + 1 < len(cards) else None
        run_continues = nxt is not None and nxt.get("kind") == "인용"
        if not src_list(c) or (not c.get("attribution") and not run_continues):
            q_missing.append(c.get("id"))
    if q_missing:
        add("quote-source", "실패", "인용의 출처", "인용 카드에 src가 있어야 하고, 이어지는 인용의 마지막 장에는 attribution이 있어야 한다", q_missing)
    elif quote_cards:
        add("quote-source", "통과", "인용의 출처", "인용 카드 %d장 모두 출처가 있고 화자 표기가 붙어 있다" % len(quote_cards))
    else:
        add("quote-source", "통과", "인용의 출처", "해당 없음 (인용 카드가 없다)")
    def form_ok(v):
        parts = [p for p in re.split(r"[·,+/\s]+|와|과|및", v or "") if p]
        return bool(parts) and all(p in ("원문", "번역", "줄임") for p in parts)
    bad_form = [c.get("id") for c in quote_cards if c.get("quote_form") and not form_ok(c.get("quote_form"))]
    if bad_form:
        add("quote-form", "주의", "인용의 꼴", "quote_form은 원문, 번역, 줄임을 쓴다. 둘 다이면 '번역·줄임'", bad_form)
    n_missing = [c.get("id") for c in edit_cards if numeric_tokens(card_text(c), lang) and not src_list(c)]
    if n_missing:
        add("number-source", "주의", "수치의 출처", "수치가 든 카드에 src가 없다", n_missing)
    elif any(numeric_tokens(card_text(c), lang) for c in edit_cards):
        add("number-source", "통과", "수치의 출처", "수치가 든 카드에 모두 출처가 붙어 있다 (%s)" % ("영어는 글자로 쓴 수도 센다. one은 세지 않는다" if lang == "en" else "한글로 쓴 수는 세지 못한다"))
    else:
        add("number-source", "통과", "수치의 출처", "해당 없음 (숫자로 쓴 수치가 든 카드가 없다)")
    bad_src = [c.get("id") for c in cards if any(s not in src_ids for s in src_list(c))]
    if bad_src:
        add("source-ref", "실패", "출처 연결", "카드의 src가 meta.sources에 없다", bad_src)
    unv = [c.get("id") for c in cards if "미확인" in (c.get("note") or "")]
    if unv:
        add("unverified", "주의", "확인하지 못한 사실", "미확인으로 표시된 카드가 있다. 제작 전에 확인한다", unv)
    bad_vis = [c.get("id") for c in cards if (c.get("visual") or {}).get("type") not in VISUAL_TYPES or not (c.get("visual") or {}).get("desc")]
    if bad_vis:
        add("visual", "실패", "장면 제안", "장면의 유형이나 내용이 빠졌다", bad_vis)
    else:
        add("visual", "통과", "장면 제안", "모든 카드에 장면 제안이 있다")
    scene_cards = [c for c in text_cards if (c.get("visual") or {}).get("type") != "타이포"]
    if scene_cards:
        carr = sum(1 for c in scene_cards if (c.get("visual") or {}).get("carries"))
        ratio = carr / len(scene_cards)
        add("carries", "통과" if ratio >= 0.7 else "주의", "장면이 맡는 정보",
            "타이포를 뺀 문장 카드 %d장 가운데 %d장(%.0f%%)에 '장면이 맡는 정보'가 적혀 있다" % (len(scene_cards), carr, ratio * 100))
    if beats:
        both = sum(1 for b in beats if b.get("scene") and b.get("text"))
        if both < len(beats) * 0.5:
            add("division", "주의", "분업 칸", "비트 %d개 가운데 %d개에만 '장면이 말할 것(scene)'과 '문장이 말할 것(text)'이 적혀 있다" % (len(beats), both))
        else:
            add("division", "통과", "분업 칸", "비트마다 장면과 문장의 몫이 나뉘어 적혀 있다")
    if cards:
        stock = sum(1 for c in cards if (c.get("visual") or {}).get("type") == "스톡") / len(cards)
        if stock > 0.4:
            add("stock-heavy", "주의", "스톡 비중", "대역 영상(스톡)이 %.0f%%다. 도해와 타이포의 몫을 늘린다. 문장이 말하는 바로 그 대상을 찍은 영상이면 유형은 실사다 (04 8절)" % (stock * 100))

    # ---------- 찾아 쓰는 영상 (영어 대본 시험과 실사 혼합 제작에서 나온 항목) ----------
    if any((c.get("visual") or {}).get("footage") for c in cards):
        fb_missing = []
        for c in cards:
            v = c.get("visual") or {}
            if v.get("type") not in ("실사", "스톡") or is_continuation(v.get("desc")):
                continue
            f = v.get("footage") or {}
            if not (f.get("search") or f.get("reuse") or f.get("source")):
                fb_missing.append(c.get("id"))
        real = [c for c in cards if (c.get("visual") or {}).get("type") == "실사" and ((c.get("visual") or {}).get("footage") or {}).get("search")]
        if real and not any(((c.get("visual") or {}).get("footage") or {}).get("fallback") for c in real):
            add("footage-fallback", "주의", "못 찾을 때의 대안", "찾아 쓰는 실사 영상 %d곳 가운데 못 찾을 때의 대안(visual.footage.fallback)을 적은 곳이 없다. 드문 대상일수록 대안을 적는다" % len(real), [c.get("id") for c in real][:4])
        if fb_missing:
            add("footage-brief", "주의", "찾을 영상의 조건", "찾아 쓰는 영상인데 visual.footage에 검색어(search), 다시 쓸 카드(reuse), 찾은 주소(source) 가운데 아무것도 없다", fb_missing)
        else:
            add("footage-brief", "통과", "찾을 영상의 조건", "찾아 쓰는 영상마다 검색어나 다시 쓸 카드가 적혀 있다")
    standin = [c.get("id") for c in cards if (c.get("visual") or {}).get("type") == "스톡" and re.search(r"(1[5-9]|20)\d\d", c.get("label") or "")]
    if standin:
        add("stand-in-label", "주의", "대역 영상의 표기", "대역 영상(스톡) 위에 연도가 든 구석 표기가 있다. 그 영상이 그때 그곳을 찍은 것으로 읽힐 수 있다. 표기를 도해나 타이포 카드로 옮기거나, 출처 표기임이 분명한지 확인하고 review_notes에 적는다", standin)

    # ---------- 제작 인계 (실제 제작 시험에서 나온 항목) ----------
    def raw_len(card):
        return sum(len(l) for l in (card.get("lines") or []))

    floor_short, attr_short = [], []
    floor_note = "단어 수/3 + 2초" if lang == "en" else "글자 수/7 + 2초, 공백과 문장부호 포함"
    for c in text_cards:
        d = float(c.get("d", 0))
        # 글자가 뜨고 지는 1.2초 + 읽는 시간(한국어 자당 1/7초, 영어 단어당 1/3초) + 여유 0.8초
        need = (nwords(card_text(c)) / 3.0 + 2.0) if lang == "en" else (raw_len(c) / 7.0 + 2.0)
        if lang == "en" and len(c.get("lines") or []) >= 3:
            need += 0.3  # 줄이 차례로 뜨는 시간 (실제 제작에서 3줄 카드가 0.2~0.4초 모자랐다)
        if d + 1e-6 < need:
            floor_short.append(c.get("id"))
        elif c.get("kind") == "인용" and c.get("attribution") and d + 1e-6 < need + 1.5:
            attr_short.append(c.get("id"))
    if floor_short:
        add("prod-read-floor", "주의", "제작 읽기 하한", "제작 도구의 읽기 하한(%s)보다 짧다. 글자가 뜨고 지는 시간을 빼면 읽을 시간이 모자란다" % floor_note, floor_short)
    else:
        add("prod-read-floor", "통과", "제작 읽기 하한", "모든 문장 카드가 제작 읽기 하한(%s)을 넘는다" % floor_note)
    if attr_short:
        add("attribution-time", "주의", "출처 표기 시간", "인용문을 읽고 나서 출처 표기를 볼 시간(1.5초)이 남지 않는다", attr_short)
    src_short = []
    for c in cards:
        if c.get("kind") != "표기":
            continue
        big = nwords(card_text(c)) >= 6 if lang == "en" else nchars(card_text(c)) >= 20
        need = (nwords(card_text(c)) / 3.0 + 2.0) if lang == "en" else (raw_len(c) / 7.0 + 2.0)
        if big and float(c.get("d", 0)) + 1e-6 < need:
            src_short.append(c.get("id"))
    if src_short:
        add("source-card-time", "주의", "참고 자료 카드의 시간", "참고 자료 카드도 읽는 글자다. 제작 읽기 하한(%s)보다 짧다. 시간을 늘리거나 두 장으로 나눈다" % floor_note, src_short)

    NARROW_RE = re.compile(r"줌인|다가가|다가간|다가선|확대|클로즈업|zoom in|close-up|closeup|push in", re.I)
    WIDE_RE = re.compile(r"줌아웃|물러나|물러난|넓어|넓힌|전경|전신|zoom out|pull back|wide", re.I)

    def end_frame(text, cur):
        last_n = max([m.end() for m in NARROW_RE.finditer(text)] or [-1])
        last_w = max([m.end() for m in WIDE_RE.finditer(text)] or [-1])
        if last_n < 0 and last_w < 0:
            return cur
        return "근접" if last_n > last_w else "전경"

    frame_now, carry = None, []
    for c in cards:
        v = c.get("visual") or {}
        desc, motion = v.get("desc") or "", v.get("motion") or ""
        cont = is_continuation(desc)
        if not cont:
            frame_now = None
        said = bool(v.get("frame") or motion or NARROW_RE.search(desc) or WIDE_RE.search(desc))
        if cont and frame_now == "근접" and not said:
            carry.append(c.get("id"))
        frame_now = v.get("frame") or end_frame(desc + " " + motion, frame_now)
    if carry:
        add("frame-carry", "주의", "화면 범위 이어받기", "앞 카드가 화면을 좁힌 채 끝났는데 이 카드는 '(앞 장면 계속)'이고 화면 범위를 적지 않았다. 새로 보일 것이 좁은 화면 밖에 있으면 visual.frame이나 motion에 화면이 넓어진다고 적는다", carry)

    PIC_RE = re.compile(r"(?:화면 속 글자|text in picture)\s*[:：]\s*([^.。]+)", re.I)
    pic_missing, pic_leak = [], []
    name_idx = next((i for i, c in enumerate(cards) if c.get("kind") in ("이름", "제목")), None)
    for i, c in enumerate(cards):
        v = c.get("visual") or {}
        listed = v.get("text_in_picture")
        m = PIC_RE.search(v.get("desc") or "")
        if m and not listed:
            pic_missing.append(c.get("id"))
        texts = [str(x) for x in (listed or [])] + ([m.group(1)] if m else [])
        if name_idx is not None and i < name_idx and any(w and w in t for w in (meta.get("withhold") or []) for t in texts):
            pic_leak.append(c.get("id"))
    if pic_leak:
        add("picture-text", "실패", "화면 속 글자", "감출 낱말이 이름이나 제목 카드 전에 그림 속 글자로 나온다", pic_leak)
    if pic_missing:
        add("picture-text-data", "주의", "화면 속 글자 목록", "visual.desc에만 적힌 화면 속 글자를 visual.text_in_picture 배열에도 적는다. 제작에서 오탈자와 읽히는 시점을 따로 본다", pic_missing)

    busy = []
    for c in cards:
        ev = (c.get("visual") or {}).get("events")
        if isinstance(ev, (int, float)) and ev > max(1, int(float(c.get("d", 0)) / 2.5)):
            busy.append(c.get("id"))
    if busy:
        add("event-load", "주의", "한 카드의 사건 수", "노출 시간에 견주어 장면의 사건이 많다 (2.5초에 하나가 기준). 카드를 나누거나 사건을 덜어 낸다", busy)

    def again(card):
        v = card.get("visual") or {}
        text = (v.get("desc") or "") + (v.get("motion") or "")
        low_text = text.lower()
        return bool(v.get("callback")) or bool((v.get("footage") or {}).get("reuse")) or any(p in low_text for p in CONT_PREFIX) or "첫 장면" in text or "first scene" in low_text or "opening clip" in low_text

    if meta.get("cast"):
        add("cast", "통과", "되풀이되는 대상", "되풀이되는 대상 %d개가 meta.cast에 적혀 있다" % len(meta.get("cast")))
    elif sum(1 for c in cards if again(c)) >= 3:
        add("cast", "주의", "되풀이되는 대상", "같은 대상이 여러 카드에 다시 나오는데 meta.cast가 없다. 대상의 생김새와 고정 조건(어느 쪽에 있는가, 무엇에 가려지는가)을 한 번 적어 둔다")

    offpos = [c.get("id") for c in text_cards if (c.get("pos") or "가운데") != "가운데"]
    if offpos:
        add("text-position", "주의", "화면 문장의 자리", "문장 자리가 가운데가 아닌 카드가 있다. 조사한 채널들은 모든 문장을 화면 가운데 한 자리에 띄운다. 까닭이 있으면 review_notes에 적는다", offpos)
    else:
        add("text-position", "통과", "화면 문장의 자리", "모든 문장이 화면 가운데 한 자리에 뜬다")
    music_cards = [c.get("id") for c in cards if re.search(r"음악|연주곡|music", c.get("sound") or "", re.I)]
    if music_cards and not meta.get("music_brief"):
        add("music-brief", "주의", "음악 기준", "소리 지시에 음악이 있는데 meta.music_brief가 없다. 분위기, 악기, 빠르기, 피할 것을 적어 공개 음원에서 고르게 한다", music_cards[:3])

    # ---------- 지표 ----------
    vis_count = {}
    for c in cards:
        vt = (c.get("visual") or {}).get("type") or "?"
        vis_count[vt] = vis_count.get(vt, 0) + 1
    closed_da = sum(1 for c in edit_cards if re.search(r"다$", strip_tail(card_text(c)).rstrip(".")))
    questions = sum(1 for c in edit_cards if strip_tail(card_text(c)).endswith("?") or re.search(r"까$", strip_tail(card_text(c))))
    metrics = {
        "unit": unit,
        "total_seconds": round(total, 1),
        "target_seconds": target,
        "cards_total": len(cards),
        "cards_edit": len(edit_cards),
        "cards_quote": len(quote_cards),
        "cards_silent": len(silent_cards),
        "silent_seconds": round(sum(float(c.get("d", 0)) for c in silent_cards), 1),
        "edit_size": edit_size,
        "quote_size": quote_size,
        "density": round(density, 2),
        "avg_card_size": round(edit_size / len(edit_cards), 1) if edit_cards else 0,
        "avg_card_seconds": round(sum(float(c.get("d", 0)) for c in edit_cards) / len(edit_cards), 1) if edit_cards else 0,
        "open_ratio": round(open_ratio * 100),
        "handoff_ratio": round(handoff_ratio * 100),
        "noun_ratio": round(noun_ratio * 100),
        "closed_ratio": round(closed_ratio * 100),
        "turns": len(turn_cards),
        "questions": questions,
        "closed_da": closed_da,
        "title_seconds": title_t,
        "visual_types": vis_count,
        "emphasis_chain": [c.get("em") for c in cards if c.get("em")],
    }
    summary = {"실패": 0, "주의": 0, "통과": 0}
    for r in results:
        summary[r["level"]] += 1
    results.sort(key=lambda r: LEVEL_ORDER[r["level"]])
    return {"results": results, "flags": flags, "metrics": metrics, "summary": summary}


def print_report(path, script, rep, verbose=False):
    meta = script.get("meta") or {}
    m = rep["metrics"]
    print("=" * 72)
    print("%s  [%s %s]" % (meta.get("screen_title") or meta.get("title"), meta.get("family"), FAMILIES.get(meta.get("family"), "?")))
    print(os.path.basename(path))
    print("길이 %s초 | 편집 카드 %d장 %d%s | 초당 %.2f%s | 카드 평균 %.1f%s %.1f초 | 넘김 %d%% 명사 %d%% 끝맺음 %d%% | 무문장 %d곳" % (
        ("%.0f" if abs(m["total_seconds"] - round(m["total_seconds"])) < 0.05 else "%.1f") % m["total_seconds"], m["cards_edit"], m["edit_size"], m["unit"], m["density"], m["unit"],
        m["avg_card_size"], m["unit"], m["avg_card_seconds"], m["handoff_ratio"], m["noun_ratio"], m["closed_ratio"], m["cards_silent"]))
    print("실패 %d / 주의 %d / 통과 %d" % (rep["summary"]["실패"], rep["summary"]["주의"], rep["summary"]["통과"]))
    for r in rep["results"]:
        if r["level"] == "통과" and not verbose:
            continue
        cards = (" [" + ", ".join(r["cards"]) + "]") if r["cards"] else ""
        print("  %s  %-16s %s%s" % (r["level"], r["code"], r["msg"], cards))
    if not verbose:
        passed = [r["code"] for r in rep["results"] if r["level"] == "통과"]
        print("  통과한 항목: " + ", ".join(passed))
        print("  (기준까지 보려면 --verbose)")


def print_cards(script):
    """가편집 시트를 열 수 없을 때 읽기 리허설용으로 카드를 시각 순서대로 뽑는다."""
    lang = (script.get("meta") or {}).get("lang", "ko")
    beats = {b.get("id"): b for b in (script.get("beats") or [])}
    last = None
    for c in script.get("cards") or []:
        if c.get("beat") != last:
            b = beats.get(c.get("beat")) or {}
            print("  -- %s: %s" % (b.get("name", c.get("beat")), b.get("job", "")))
            last = c.get("beat")
        t = float(c.get("t", 0))
        text = " / ".join(c.get("lines") or []) or "(문장 없이 장면만)"
        tag = c.get("kind", "")
        if c.get("kind") == "편집":
            tag += ":" + (ending_class(c, lang) or "")
        extra = ""
        if c.get("label"):
            extra += "  [구석: %s]" % c.get("label")
        if c.get("turn"):
            extra += "  (꺾임)"
        print("  %2d:%02d %4.1f초 %-9s %s%s" % (int(t // 60), int(t % 60), float(c.get("d", 0)), tag, text, extra))


def main():
    ap = argparse.ArgumentParser(description="대본 JSON 검수와 가편집 시트 빌드")
    ap.add_argument("--scripts", nargs="+", required=True, help="대본 JSON 파일들")
    ap.add_argument("--out", help="만들 HTML 경로")
    ap.add_argument("--title", default="가편집 시트", help="시트 제목")
    ap.add_argument("--lint-only", action="store_true", help="검수 결과만 출력")
    ap.add_argument("--verbose", action="store_true", help="통과한 항목도 기준과 함께 출력")
    ap.add_argument("--print-cards", action="store_true", help="카드를 시각 순서대로 출력 (읽기 리허설용. 편집 카드에는 끝의 분류가 붙는다)")
    args = ap.parse_args()

    cases = []
    failed = False
    for p in args.scripts:
        with open(p, "r", encoding="utf-8-sig") as f:
            script = json.load(f)
        rep = lint(script)
        print_report(p, script, rep, args.verbose)
        if args.print_cards:
            print_cards(script)
        if rep["summary"]["실패"]:
            failed = True
        cases.append({"file": os.path.basename(p), "script": script, "lint": rep})

    if args.lint_only or (args.print_cards and not args.out):
        sys.exit(1 if failed else 0)
    if not args.out:
        ap.error("--out 이 필요하다 (또는 --lint-only)")

    here = os.path.dirname(os.path.abspath(__file__))
    tpl_path = os.path.join(here, "..", "assets", "sheet-template.html")
    with open(tpl_path, "r", encoding="utf-8") as f:
        tpl = f.read()
    data = {
        "title": args.title,
        "built": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "families": FAMILIES,
        "cases": cases,
    }
    payload = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    if "/*__DATA__*/null" not in tpl:
        print("템플릿에 데이터 자리가 없다", file=sys.stderr)
        sys.exit(2)
    out_html = tpl.replace("/*__DATA__*/null", payload).replace("__SHEET_TITLE__", args.title)
    with open(args.out, "w", encoding="utf-8") as f:
        f.write(out_html)
    print("-" * 72)
    print("시트 저장: " + args.out)
    sys.exit(0)


if __name__ == "__main__":
    main()
