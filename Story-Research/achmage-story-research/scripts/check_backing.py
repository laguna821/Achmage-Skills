# -*- coding: utf-8 -*-
"""achmage-story-research 0.5.0: 판정표(받침.json)를 대본(대본.json)과 맞춰 검수하고, 요약과 시트를 만든다.

    python check_backing.py --backing 받침.json --script 대본.json --verbose
    python check_backing.py --backing 받침.json --script 대본.json --summary 받침_요약.md --sheet 받침시트.html

표준 라이브러리만 쓴다. 실패가 하나라도 있으면 종료 코드 1을 낸다.
"""
import argparse
import html
import io
import json
import os
import re
import sys
from collections import Counter

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

VERSION = "0.5.0"
STATUS = ["직접 확인", "직접 확인 (일부는 발췌로 확인)", "주소가 열리지 않음, 발췌로 확인", "주소가 열리지 않음, 보관 사본으로 확인"]
TIERS = ["1차 기록", "논문", "공식 통계", "전문가", "2차", "3차", "자기 발표"]
WEAK_TIERS = {"3차", "자기 발표"}
PRIMARY_TIERS = {"1차 기록", "논문", "공식 통계"}
VERDICTS = ["받쳐진다", "세다", "없다", "틀리다"]
STRENGTH = ["확정", "단일 출처", "다툼", "미확인"]
FIXES = ["구석 표기", "낱말", "조건", "갈아 끼우기", "빼기"]
HINGE_V = ["버틴다", "조건을 달면 버틴다", "못 버틴다"]
OPEN_LIC = ("퍼블릭 도메인", "공유 저작물", "CC0", "CC BY", "공공누리", "직접 제작", "이용 허락")
MEMO = re.compile(r"미확인|아님|못 엶|못 열|열지 못|계산|편집자|확인 필요|확인하지|재인용|출처 하나|단일 출처|=|÷|×")
HEDGE = re.compile(r"라고 한다|다고 한다|알려져 있다|일 수도|것으로 보인다|전해진다")

RESULTS = []
CHECKED = []


def add(code, level, msg, items=None):
    RESULTS.append({"code": code, "level": level, "msg": msg, "items": list(items or [])})


def mark(code):
    if code not in CHECKED:
        CHECKED.append(code)


def nchars(s):
    return len(re.sub(r"\s+", "", str(s or "")))


def L(x):
    if isinstance(x, list):
        return x
    return [] if x in (None, "") else [x]


def filled(x):
    return bool(str(x or "").strip())


def card_text(c):
    return " / ".join(str(x) for x in (c.get("lines") or []))


def stating(script):
    """판정을 받아야 하는 카드와, 받으면 좋은 표기 카드."""
    need, notes = [], []
    for c in script.get("cards") or []:
        kind, lines = c.get("kind"), c.get("lines") or []
        if not lines:
            continue
        n = nchars("".join(lines))
        if kind in ("편집", "인용"):
            if n <= 6 or (c.get("turn") and n <= 9):
                continue
            if kind == "편집" and "".join(lines).strip().endswith("?"):
                continue
            need.append(c.get("id"))
        elif kind == "표기":
            if n >= 12 and not re.search(r"참고|출처", "".join(lines)):
                notes.append(c.get("id"))
    return need, notes


def check(b, s, base):
    sources = b.get("sources") or []
    cards = b.get("cards") or []
    sid = {x.get("id"): x for x in sources}
    bid = {c.get("id"): c for c in cards}
    scards = s.get("cards") or []
    scid = {c.get("id"): c for c in scards}
    order = [c.get("id") for c in scards]

    mark("sources")
    bad = []
    if len(sources) < 3:
        bad.append("출처가 %d개다" % len(sources))
    for x in sources:
        for k in ("id", "label", "tier", "status", "checked"):
            if not filled(x.get(k)):
                bad.append("%s: %s 없음" % (x.get("id"), k))
        if filled(x.get("tier")) and x.get("tier") not in TIERS:
            bad.append("%s: tier 값(%s). 익명 웹은 출처가 될 수 없다" % (x.get("id"), x.get("tier")))
        if filled(x.get("status")) and x.get("status") not in STATUS:
            bad.append("%s: status 값" % x.get("id"))
    if bad:
        add("sources", "실패", "출처의 칸이 비었거나 값이 틀리다", bad[:15])
    mark("source-primary")
    prim = [x.get("id") for x in sources if x.get("tier") in PRIMARY_TIERS and str(x.get("status") or "").startswith("직접 확인")]
    if len(prim) < 2:
        add("source-primary", "주의", "1차 기록, 논문, 공식 통계를 직접 연 것이 %d개다. 초고가 기댄 글이 기대는 기록까지 올라간다" % len(prim))

    mark("coverage")
    need, notes = stating(s)
    skipped = {str(x.get("id")): x for x in L((b.get("meta") or {}).get("skipped")) if isinstance(x, dict) and filled(x.get("why"))}
    missing = [x for x in need if x not in bid and x not in skipped]
    ghost = [x for x in bid if x not in scid]
    bad = []
    if missing:
        bad.append("판정이 없는 카드: " + ", ".join(missing) + " (판정에서 뺄 까닭이 있으면 meta.skipped에 { id, why }로 적는다)")
    if ghost:
        bad.append("대본에 없는 카드 번호: " + ", ".join(str(x) for x in ghost))
    if bad:
        add("coverage", "실패", "진술하는 카드는 모두 판정을 받는다", bad)
    mark("coverage-notes")
    mn = [x for x in notes if x not in bid and x not in skipped]
    if mn:
        add("coverage-notes", "주의", "사실을 말하는 표기 카드가 판정을 받지 않았다", mn)

    mark("verdict")
    mark("evidence")
    mark("problem")
    mark("fix")
    mark("label")
    bv, be, bp, bf, bl = [], [], [], [], []
    for c in cards:
        i = c.get("id")
        if c.get("verdict") not in VERDICTS:
            bv.append("%s: verdict" % i)
            continue
        if filled(c.get("strength")) and c.get("strength") not in STRENGTH:
            bv.append("%s: strength" % i)
        for x in L(c.get("src")):
            if x not in sid:
                be.append("%s: 없는 출처 %s" % (i, x))
        if c.get("verdict") == "받쳐진다":
            if not L(c.get("src")) or not filled(c.get("where")) or not filled(c.get("evidence")):
                be.append("%s: 받쳐진다고 하려면 출처, 자리, 근거 대목이 있어야 한다" % i)
        else:
            if nchars(c.get("problem")) < 10:
                bp.append("%s: 무엇이 어떻게 다른지(problem)" % i)
            fx = c.get("fix")
            if fx not in FIXES:
                bf.append("%s: fix는 %s 가운데 하나" % (i, ", ".join(FIXES)))
            elif fx == "구석 표기" and not filled(c.get("label")):
                bf.append("%s: 구석 표기를 짚었으면 label을 적는다" % i)
            elif fx in ("낱말", "조건") and not filled(c.get("must_keep")):
                bf.append("%s: %s을 짚었으면 must_keep을 적는다" % (i, fx))
            elif fx == "갈아 끼우기":
                alts = [a for a in L(c.get("alternatives")) if isinstance(a, dict)]
                if not alts or any(not filled(a.get("fact")) or not L(a.get("src")) or not filled(a.get("evidence")) for a in alts):
                    bf.append("%s: 갈아 끼우기를 짚었으면 alternatives에 사실, 출처, 근거 대목을 적는다" % i)
                for a in alts:
                    for x in L(a.get("src")):
                        if x not in sid:
                            be.append("%s: 대안의 없는 출처 %s" % (i, x))
        if filled(c.get("label")) and (nchars(c.get("label")) > 20 or MEMO.search(str(c.get("label")))):
            bl.append("%s: %s" % (i, str(c.get("label"))[:30]))
    if bv:
        add("verdict", "실패", "판정은 %s, 세기는 %s 가운데 하나" % (", ".join(VERDICTS), ", ".join(STRENGTH)), bv)
    if be:
        add("evidence", "실패", "근거", be[:15])
    if bp:
        add("problem", "실패", "걸린 카드에는 무엇이 어떻게 다른지를 한두 문장으로 적는다", bp)
    if bf:
        add("fix", "실패", "걸린 카드마다 가장 가볍게 고칠 길을 하나 짚고 그 길에 필요한 칸을 채운다", bf)
    if bl:
        add("label", "실패", "구석 표기는 시청자가 읽는 글자다. 때, 곳, 사람이나 자료의 이름만 20자 이내로. 검수 메모를 적지 않는다", bl)

    mark("evidence-weak")
    weak = []
    for c in cards:
        if c.get("verdict") == "받쳐진다":
            tiers = [sid[x].get("tier") for x in L(c.get("src")) if x in sid]
            if tiers and all(t in WEAK_TIERS for t in tiers):
                weak.append("%s (%s)" % (c.get("id"), ", ".join(tiers)))
    if weak:
        add("evidence-weak", "주의", "3차 자료나 당사자 발표에만 기대어 받쳐진다고 했다. 그 자료가 기대는 기록을 열거나 세기를 낮춘다", weak)
    mark("evidence-single")
    sg = [c.get("id") for c in cards if c.get("verdict") == "받쳐진다" and c.get("strength") in ("단일 출처", "다툼")
          and not filled(c.get("label")) and not filled((scid.get(c.get("id")) or {}).get("label"))]
    if sg:
        add("evidence-single", "주의", "사실의 세기가 단일 출처나 다툼인데 받쳐진다고 했고 화면에 구석 표기가 없다. 문장 안의 조건이 그것을 싣고 있는지 본다", sg)

    mark("hedge")
    hd = [c.get("id") for c in cards if HEDGE.search(str(c.get("must_keep") or ""))]
    if hd:
        add("hedge", "주의", "흐리게 말하라고 권하지 않는다. 구석 표기, 낱말, 조건, 확인된 사실 가운데서 짚는다", hd)

    mark("hinges")
    hinges = [h for h in L(b.get("hinges")) if isinstance(h, dict)]
    hc = set(x for h in hinges for x in L(h.get("cards")))
    bad = []
    for h in hinges:
        if not filled(h.get("what")) or not filled(h.get("searched")) or not filled(h.get("found")) or h.get("verdict") not in HINGE_V:
            bad.append("'%s': 무엇으로 찾았나, 무엇이 나왔나, 판정(%s)" % (h.get("what"), ", ".join(HINGE_V)))
        if h.get("verdict") == "조건을 달면 버틴다" and not filled(h.get("condition")):
            bad.append("'%s': 어떤 조건인지(condition)" % h.get("what"))
    turns = [c.get("id") for c in scards if c.get("turn")]
    for t in turns:
        i = order.index(t)
        win = order[i:i + 5]
        if not any(x in hc for x in win):
            bad.append("꺾임 %s 뒤의 사실에 반대 서술을 찾은 기록이 없다" % t)
    last = [c.get("id") for c in scards if c.get("kind") in ("편집", "인용") and c.get("lines")]
    if last and last[-1] not in hc:
        bad.append("마지막 한 줄(%s)에 반대 서술을 찾은 기록이 없다" % last[-1])
    if bad:
        add("hinges", "실패", "꺾임마다, 마지막 한 줄에 그 사실의 이름으로 반대 서술을 찾아 hinges에 적는다", bad)
    mark("hinge-gap")
    ng = [str(h.get("what")) for h in hinges if "꺾임" in str(h.get("what")) and not filled(h.get("gap"))]
    if ng:
        add("hinge-gap", "주의", "꺾임이 무엇을 뒤집는지 보이는 카드가 초고에 있는지(gap)를 적는다", ng)

    mark("quotes")
    quotes = [q for q in L(b.get("quotes")) if isinstance(q, dict)]
    qc = {q.get("card"): q for q in quotes}
    bad = []
    for c in scards:
        if c.get("kind") == "인용" and c.get("lines"):
            q = qc.get(c.get("id"))
            if not q:
                bad.append("%s: 인용 카드의 원문 대조가 없다" % c.get("id"))
                continue
            for k in ("original", "speaker", "verified"):
                if not filled(q.get(k)):
                    bad.append("%s: %s 없음" % (c.get("id"), k))
            if filled(q.get("verified")) and not (str(q.get("verified")).startswith("원문 대조") or str(q.get("verified")).startswith("재인용")):
                bad.append("%s: verified는 '원문 대조' 또는 '재인용(원문 미확인)'" % c.get("id"))
    if bad:
        add("quotes", "실패", "인용 카드마다 원문, 말한 이, 대조 여부를 적는다", bad)
    mark("quote-requote")
    rq = [q.get("card") for q in quotes if str(q.get("verified")).startswith("재인용") and q.get("card") in hc]
    if rq:
        add("quote-requote", "주의", "꺾임이나 마지막 한 줄에 놓인 인용이 재인용이다. 원문을 찾거나 사람이 열게 unverified에 적는다", rq)

    mark("marks")
    bad = []
    dis = [g for g in L(b.get("disagreements")) if isinstance(g, dict)]
    dcards = set(x for g in dis for x in L(g.get("cards")))
    for c in cards:
        if c.get("strength") == "다툼" and c.get("id") not in dcards:
            bad.append("%s: 다툼인데 disagreements의 어느 줄에도 cards로 적혀 있지 않다" % c.get("id"))
    if any(c.get("strength") == "미확인" for c in cards) and not L(b.get("unverified")):
        bad.append("미확인인 사실이 있는데 unverified가 비었다")
    if bad:
        add("marks", "실패", "다툼과 미확인은 따로 적어 둔다", bad)

    mark("visuals")
    bad, warn = [], []
    for v in L(b.get("visuals")):
        if not isinstance(v, dict):
            continue
        name = v.get("id") or v.get("what")
        for k in ("what", "license", "use"):
            if not filled(v.get(k)):
                bad.append("%s: %s 없음" % (name, k))
        if not filled(v.get("url")) and not filled(v.get("file")):
            bad.append("%s: 주소나 파일" % name)
        if filled(v.get("use")) and v.get("use") not in ("근거", "화면 후보"):
            bad.append("%s: use는 '근거' 또는 '화면 후보'" % name)
        if filled(v.get("file")) and not os.path.isfile(os.path.join(base, str(v.get("file")))):
            warn.append("%s: 파일이 없다 (%s)" % (name, v.get("file")))
        if v.get("use") == "화면 후보" and filled(v.get("license")) and not str(v.get("license")).startswith(OPEN_LIC):
            warn.append("%s: 이용 조건이 열려 있지 않다 (%s). 대본은 도해로 제안한다" % (name, str(v.get("license"))[:30]))
    if bad:
        add("visuals", "실패", "화면 자료의 칸", bad[:12])
    elif warn:
        add("visuals", "주의", "화면 자료", warn[:12])

    mark("extras")
    bad = []
    for e in L(b.get("extras")):
        if isinstance(e, dict) and (not filled(e.get("what")) or not L(e.get("src")) or not filled(e.get("evidence")) or any(x not in sid for x in L(e.get("src")))):
            bad.append(str(e.get("what"))[:30])
    if bad:
        add("extras", "실패", "덤 재료에도 출처와 근거 대목을 적는다", bad)


def tally():
    f = sum(1 for r in RESULTS if r["level"] == "실패")
    w = sum(1 for r in RESULTS if r["level"] == "주의")
    hit = set(r["code"] for r in RESULTS)
    return f, w, [c for c in CHECKED if c not in hit]


def print_results(verbose):
    f, w, p = tally()
    print("실패 %d / 주의 %d / 통과 %d" % (f, w, len(p)))
    for lv in ("실패", "주의"):
        for r in RESULTS:
            if r["level"] == lv:
                line = "  %s  %s %s" % (lv, r["code"], r["msg"])
                if r["items"]:
                    line += " [" + "; ".join(str(x) for x in r["items"]) + "]"
                print(line)
    if verbose:
        print("  통과한 항목: " + ", ".join(p))


def need_of(c):
    fx = c.get("fix")
    if fx == "구석 표기":
        return "구석에 「%s」" % c.get("label")
    if fx in ("낱말", "조건"):
        return str(c.get("must_keep") or "")
    if fx == "갈아 끼우기":
        return " / ".join(str(a.get("fact")) for a in L(c.get("alternatives")) if isinstance(a, dict))
    return ""


def cell(x):
    return str(x if x is not None else "").replace("|", "/").replace("\n", " ")


def summary(b, s, path):
    cards = b.get("cards") or []
    cnt = Counter(c.get("verdict") for c in cards)
    f, w, p = tally()
    o = ["# 받침 요약: %s" % cell((b.get("meta") or {}).get("title") or (s.get("meta") or {}).get("title") or ""), ""]
    o.append("이 파일은 `받침.json`에서 검사기가 만든 것이다. 고칠 것이 있으면 판정표를 고치고 다시 만든다.")
    o += ["", "초고의 이야기: %s" % cell((b.get("meta") or {}).get("story") or ""), ""]
    o += ["## 판정 집계", "", "| 판정 | 카드 수 |", "|---|---|"]
    o += ["| %s | %d |" % (v, cnt.get(v, 0)) for v in VERDICTS]
    o += ["| 합계 | %d |" % len(cards), "", "검수: 실패 %d / 주의 %d / 통과 %d" % (f, w, len(p)), ""]
    for r in RESULTS:
        o.append("- %s `%s`: %s %s" % (r["level"], r["code"], r["msg"], "; ".join(str(x) for x in r["items"])))
    flagged = [c for c in cards if c.get("verdict") in ("틀리다", "없다", "세다")]
    flagged.sort(key=lambda c: ["틀리다", "없다", "세다"].index(c.get("verdict")))
    o += ["", "## 고쳐야 하는 카드", ""]
    if flagged:
        o += ["| 카드 | 판정 | 화면 문장 | 무엇이 다른가 | 고칠 길 | 채울 것 |", "|---|---|---|---|---|---|"]
        o += ["| %s | %s | %s | %s | %s | %s |" % (cell(c.get("id")), c.get("verdict"), cell(c.get("text")), cell(c.get("problem")), cell(c.get("fix")), cell(need_of(c))) for c in flagged]
    else:
        o.append("없다.")
    o += ["", "## 꺾임과 마지막 한 줄", ""]
    for h in L(b.get("hinges")):
        o.append("- **%s** (%s): %s%s" % (cell(h.get("what")), ", ".join(str(x) for x in L(h.get("cards"))), cell(h.get("verdict")), (". 조건: " + cell(h.get("condition"))) if filled(h.get("condition")) else ""))
        o.append("  - 찾은 것: %s" % cell(h.get("found")))
        if filled(h.get("gap")):
            o.append("  - 뒤집히는 것이 보이는가: %s" % cell(h.get("gap")))
    o += ["", "## 인용", ""]
    if L(b.get("quotes")):
        o += ["| 카드 | 화면 | 원문 | 말한 이 | 출전 | 대조 |", "|---|---|---|---|---|---|"]
        o += ["| %s | %s | %s | %s | %s | %s |" % tuple(cell(q.get(k)) for k in ("card", "screen", "original", "speaker", "where", "verified")) for q in L(b.get("quotes"))]
    if L(b.get("disagreements")):
        o += ["", "## 자료끼리 갈리는 곳", ""]
        for g in L(b.get("disagreements")):
            o.append("- %s (%s): %s. 처리: %s" % (cell(g.get("about")), ", ".join(str(x) for x in L(g.get("cards"))), " / ".join(cell(x.get("says")) for x in L(g.get("positions")) if isinstance(x, dict)), cell(g.get("handling"))))
    o += ["", "## 덤 재료", ""]
    for e in L(b.get("extras")):
        o.append("- %s%s" % (cell(e.get("what")), (" (맞는 자리: %s)" % cell(e.get("fits"))) if filled(e.get("fits")) else ""))
    o += ["", "## 화면 자료", ""]
    if L(b.get("visuals")):
        o += ["| 카드 | 무엇 | 쓰임 | 소장처 | 이용 조건 | 파일 |", "|---|---|---|---|---|---|"]
        o += ["| %s | %s | %s | %s | %s | %s |" % tuple(cell(v.get(k)) for k in ("card", "what", "use", "holder", "license", "file")) for v in L(b.get("visuals"))]
    o += ["", "## 사람이 직접 확인해야 하는 것", ""]
    for u in L(b.get("unverified")):
        o.append("- %s. 까닭: %s. 무엇을 열면 되나: %s%s" % (cell(u.get("what")), cell(u.get("why")), cell(u.get("needed")), (" (카드 %s)" % ", ".join(str(x) for x in L(u.get("cards")))) if L(u.get("cards")) else ""))
    o += ["", "## 연 자료", "", "| 번호 | 자료 | 등급 | 상태 |", "|---|---|---|---|"]
    o += ["| %s | %s | %s | %s |" % tuple(cell(x.get(k)) for k in ("id", "label", "tier", "status")) for x in b.get("sources") or []]
    io.open(path, "w", encoding="utf-8", newline="\n").write("\n".join(o) + "\n")


def sheet(b, s, path):
    e = html.escape
    bid = {c.get("id"): c for c in b.get("cards") or []}
    sid = {x.get("id"): x for x in b.get("sources") or []}
    f, w, p = tally()
    cnt = Counter(c.get("verdict") for c in b.get("cards") or [])
    h = ["<!doctype html><html lang='ko'><meta charset='utf-8'><title>받침 시트</title>",
         "<style>body{font-family:system-ui,'Malgun Gothic',sans-serif;max-width:1100px;margin:28px auto;padding:0 20px;line-height:1.6;color:#1b1b1b}"
         "table{border-collapse:collapse;width:100%;font-size:14px}td,th{border:1px solid #ddd;padding:6px 8px;vertical-align:top;text-align:left}th{background:#f4f4f4}"
         ".t{font-size:15px}.lab{color:#666;font-size:12px}.ev{color:#333;font-size:13px}.v받쳐진다{color:#176}.v세다{color:#a60}.v없다{color:#a33}.v틀리다{color:#c00;font-weight:700}"
         ".mute{color:#aaa}.fix{background:#fff7e0;padding:2px 6px;border-radius:3px}</style>",
         "<h1>받침 시트: %s</h1>" % e(str((s.get("meta") or {}).get("title") or "")),
         "<p>%s</p>" % " · ".join("%s %d" % (v, cnt.get(v, 0)) for v in VERDICTS),
         "<p>검수: 실패 %d / 주의 %d / 통과 %d</p>" % (f, w, len(p))]
    if RESULTS:
        h.append("<ul>" + "".join("<li>%s %s: %s %s</li>" % (r["level"], e(r["code"]), e(r["msg"]), e("; ".join(str(x) for x in r["items"]))) for r in RESULTS) + "</ul>")
    h.append("<table><tr><th>카드</th><th>화면 문장</th><th>판정</th><th>근거</th><th>고칠 길</th></tr>")
    for c in s.get("cards") or []:
        i = c.get("id")
        t = e(card_text(c)) or "<span class='mute'>(문장 없는 장면)</span>"
        if filled(c.get("label")):
            t += "<br><span class='lab'>구석: %s</span>" % e(str(c.get("label")))
        if filled(c.get("attribution")):
            t += "<br><span class='lab'>말한 이: %s</span>" % e(str(c.get("attribution")))
        k = bid.get(i)
        if not k:
            h.append("<tr><td>%s</td><td class='t'>%s</td><td class='mute'>판정 안 함</td><td></td><td></td></tr>" % (e(str(i)), t))
            continue
        srcs = "<br>".join("%s %s" % (e(str(x)), e(str((sid.get(x) or {}).get("label") or "")[:70])) for x in L(k.get("src")))
        ev = "<div class='ev'>%s<br>%s<br><span class='lab'>%s · %s</span></div>" % (e(str(k.get("evidence") or "")), srcs, e(str(k.get("where") or "")), e(str(k.get("strength") or "")))
        fx = ""
        if k.get("verdict") != "받쳐진다":
            fx = "<div>%s</div><div><span class='fix'>%s</span> %s</div>" % (e(str(k.get("problem") or "")), e(str(k.get("fix") or "")), e(need_of(k)))
        h.append("<tr><td>%s</td><td class='t'>%s</td><td class='v%s'>%s</td><td>%s</td><td>%s</td></tr>" % (e(str(i)), t, e(str(k.get("verdict"))), e(str(k.get("verdict"))), ev, fx))
    h.append("</table>")
    io.open(path, "w", encoding="utf-8", newline="\n").write("\n".join(h))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--backing", required=True, help="받침.json")
    ap.add_argument("--script", required=True, help="대본.json")
    ap.add_argument("--summary", help="만들 요약 Markdown 경로")
    ap.add_argument("--sheet", help="만들 HTML 경로")
    ap.add_argument("--verbose", action="store_true")
    a = ap.parse_args()
    b = json.load(io.open(a.backing, encoding="utf-8"))
    s = json.load(io.open(a.script, encoding="utf-8"))
    check(b, s, os.path.dirname(os.path.abspath(a.backing)))
    print_results(a.verbose)
    if a.summary:
        summary(b, s, a.summary)
        print("요약: %s" % a.summary)
    if a.sheet:
        sheet(b, s, a.sheet)
        print("시트: %s" % a.sheet)
    return 1 if tally()[0] else 0


if __name__ == "__main__":
    sys.exit(main())
