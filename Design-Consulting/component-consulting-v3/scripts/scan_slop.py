#!/usr/bin/env python3
"""scan_slop.py — static slop scanner + ATS annotation backfill (v3.5, F31/F31-b).

동인 (실전 3호 friction):
  F31   — `preserve_signature` 의 "ATS-banned" 한국어 주석이 enum 에 배선되지
          않은 행 8개가 `usable:true` 로 기본 질의에 노출됐다 (그 중
          `smoothui:shine-text` 는 Step 7 BAN 2 gradient-text 그 자체였다).
  F31-b — Step 7 슬롭 밴 목록(auto-advancing carousel 등)이 코퍼스 어느
          필드에도 인코딩돼 있지 않아, `smoothui:testimonials-1`(5초 자동
          전환 캐러셀)이 세 필드 전부 침묵한 채 후보로 나왔다.
          "주석은 게이트가 아니다 — 게이트는 enum 이다."

수행:
  1. 백필 — "ATS-banned" 주석 행의 `ats_verdict` 공란 → `cut` + `usable:false`.
  2. 슬롭 스캔 — vendored 코드를 정적 패턴으로 훑어 `slop_flags[]` 스탬프:
       BAN  gradient-text   bg-clip:text + gradient 공존 (Step 7 BAN 2).
                            파일 수준 공존 휴리스틱 — 이미지 클립 + 무관한
                            그라디언트가 한 파일에 있으면 오탐 가능(드묾),
                            --include-slop 로 복구 가능
       BAN  auto-advance    타이머 + `(x + 1) % …` 순환이 **콘텐츠 타입**
                            (testimonials/team/carousel/logo-cloud 등)에
                            있고 큐레이터 pass 가 아닐 때 (Step 7 슬롭 목록
                            "auto-advancing carousels")
       WARN auto-cycle      같은 패턴이지만 effect/spinner/text-effect 등 —
                            타이핑·스피너·트랜지션 데모의 프레임 순환은
                            캐러셀이 아니다 (1차 스캔 실측: 16건 중 12건이
                            이 부류 — 일괄 BAN 은 과차단이었다)
       WARN clip-text       bg-clip:text 단독 — 이미지 클립(V7-01 masked-word)
                            일 수 있어 밴이 아니라 경고
       WARN initial-hidden  `initial={{opacity:0…` — 콘텐츠 기본 숨김 (F35:
                            합법 이식 경로가 있으므로 경고)
     큐레이터 `ats_verdict: pass` 는 기계 BAN 을 WARN 으로 강등한다
     (사람이 코드를 보고 통과시킨 행을 기계가 숨기지 않는다).
     BAN 플래그 행은 corpus_query 가 기본 숨김 (--include-slop 로 열람).
  3. components.jsonl + views/**/*.jsonl 전 사본 일관 패치, manifest 에
     `slop_scan` 기록.

완벽할 필요는 없다 — 주석 대신 기계가 읽는 자리에 한 겹만 있어도 근접
사고가 사라진다. 리빌드 후 재실행 필수 (sources.md refresh 절차 4.5단계).

Usage: python scan_slop.py [--skill DIR] [--write]   (기본 dry-run)
"""
import argparse
import io
import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

# v3.6 (H8): 스킬 루트를 자기 위치에서 도출 — vault 밖에서도 동작
SKILL_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))
from slop_policy import BAN_FLAGS, CONTENT_TYPES  # noqa: E402  (H4 단일 정본)

BGCLIP = re.compile(r"background-clip\s*:\s*text|-webkit-background-clip\s*:\s*text"
                    r"|bg-clip-text|backgroundClip\s*:\s*['\"]?text", re.I)
GRAD = re.compile(r"gradient", re.I)
TIMER = re.compile(r"setInterval|setTimeout")
CYCLE = re.compile(r"\+\s*1\s*\)\s*%")
INITHIDE = re.compile(r"initial\s*[=:]\s*\{+\s*[^}]*opacity\s*:\s*0")

# BAN_FLAGS / CONTENT_TYPES — slop_policy.py 단일 정본에서 import (v3.6, H4)


def load_codes(skill: Path, rows: list) -> dict:
    """id → code for every vendored row (uiverse bundles preloaded)."""
    codes = {}
    bundles = {}
    for r in rows:
        cp = r.get("code_path")
        if not r.get("vendored") or not cp:
            continue
        if "#" in cp:
            bundle, member = cp.split("#", 1)
            if bundle not in bundles:
                bundles[bundle] = {}
                bp = skill / bundle
                if bp.is_file():
                    for ln in io.open(bp, encoding="utf-8"):
                        b = json.loads(ln)
                        bundles[bundle][b["id"]] = b.get("code", "")
            for bid, code in bundles[bundle].items():
                if bid == r["id"] or bid.endswith("/" + member):
                    codes[r["id"]] = code
                    break
        else:
            p = skill / cp
            if cp.endswith("/") and p.is_dir():
                codes[r["id"]] = "\n".join(
                    f.read_text(encoding="utf-8", errors="replace")
                    for f in sorted(p.glob("*")) if f.is_file())
            elif p.is_file():
                codes[r["id"]] = p.read_text(encoding="utf-8", errors="replace")
    return codes


def scan(code: str, row: dict = None):
    """→ (flags, demoted) — demoted = 큐레이터 pass 가 기계 BAN 을 WARN 으로
    강등한 플래그 목록 (H7 재검토 큐 재료)."""
    flags, demoted = [], []
    curator_pass = bool(row) and row.get("ats_verdict") == "pass"
    clip = bool(BGCLIP.search(code))
    if clip and GRAD.search(code):
        # 큐레이터 pass 는 기계 BAN 을 이긴다 — 사람이 보고 통과시킨 행
        if curator_pass:
            flags.append("clip-text")
            demoted.append("gradient-text")
        else:
            flags.append("gradient-text")
    elif clip:
        flags.append("clip-text")
    if TIMER.search(code) and CYCLE.search(code):
        content = bool(row) and row.get("canonical_type") in CONTENT_TYPES
        if content and not curator_pass:
            flags.append("auto-advance")
        else:
            flags.append("auto-cycle")
            if content and curator_pass:
                demoted.append("auto-advance")
    if INITHIDE.search(code):
        flags.append("initial-hidden")
    return flags, demoted


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--skill", default=None,
                    help="skill dir override (default: derived from __file__)")
    ap.add_argument("--write", action="store_true",
                    help="apply changes (default: dry-run report)")
    args = ap.parse_args()
    skill = Path(args.skill) if args.skill else SKILL_DIR
    index = skill / "corpus/index"

    rows = [json.loads(l) for l in
            io.open(index / "components.jsonl", encoding="utf-8")]

    # 1 — ATS annotation backfill (F31)
    backfilled = []
    for r in rows:
        ps = r.get("preserve_signature") or ""
        if "ATS-banned" in ps and not r.get("ats_verdict"):
            r["ats_verdict"] = "cut"
            r["usable"] = False
            backfilled.append(r["id"])

    # 2 — slop scan (F31-b)
    codes = load_codes(skill, rows)
    counts, ban_newly_visible, review_queue = {}, [], []
    for r in rows:
        code = codes.get(r["id"])
        if code is None:
            continue
        flags, demoted = scan(code, r)
        old = r.get("slop_flags") or []
        # H7 (v3.6) — 큐레이터-pass 강등 시효: pass 판정은 슬롭 밴 목록
        # (v3.5) 이전의 큐레이션이다. 기계 BAN 을 강등한 pass 행은
        # `slop_repass`(밴 목록 이후 재확인 날짜) 가 찍히기 전까지
        # 재검토 큐에 오른다 — 강등은 유지하되, 영구 침묵은 아니다.
        if demoted and not r.get("slop_repass"):
            review_queue.append((r["id"], demoted))
        if flags:
            r["slop_flags"] = flags
            for f in flags:
                counts[f] = counts.get(f, 0) + 1
            if (set(flags) & BAN_FLAGS) and r.get("usable") and not old:
                ban_newly_visible.append((r["id"], flags))
        elif "slop_flags" in r:
            del r["slop_flags"]

    print(f"rows={len(rows)}  scanned={len(codes)}")
    print(f"backfilled ats_verdict=cut: {len(backfilled)}")
    for i in backfilled:
        print(f"   {i}")
    print(f"slop flag counts: {counts}")
    print(f"BAN-flagged rows that were usable (now hidden by default): "
          f"{len(ban_newly_visible)}")
    for i, f in ban_newly_visible[:20]:
        print(f"   🚫 {i}  {f}")
    print(f"curator-pass demotions pending re-review (H7 — set `slop_repass: "
          f"YYYY-MM-DD` after re-confirming): {len(review_queue)}")
    for i, f in review_queue[:20]:
        print(f"   ⏳ {i}  demoted {f}")

    if not args.write:
        print("\n(dry-run — pass --write to apply)")
        return 0

    # 3 — write back: components.jsonl + every view copy, by id
    upd = {r["id"]: r for r in rows}

    def patch_file(p: Path, full: bool):
        out = []
        for ln in io.open(p, encoding="utf-8"):
            row = json.loads(ln)
            u = upd.get(row.get("id"))
            if u:
                if full:
                    row = u
                else:
                    for k in ("ats_verdict", "usable", "slop_flags"):
                        if k in u:
                            row[k] = u[k]
                        elif k in row and k == "slop_flags":
                            del row[k]
            out.append(json.dumps(row, ensure_ascii=False))
        p.write_text("\n".join(out) + "\n", encoding="utf-8", newline="\n")

    patch_file(index / "components.jsonl", full=True)
    n_views = 0
    for vf in (index / "views").rglob("*.jsonl"):
        patch_file(vf, full=False)
        n_views += 1

    man_p = index / "corpus-manifest.json"
    man = json.loads(man_p.read_text(encoding="utf-8"))
    man["slop_scan"] = {"flags": counts, "backfilled_ats": len(backfilled),
                        "curator_review_queue": sorted(i for i, _ in review_queue)}
    man_p.write_text(json.dumps(man, indent=2, ensure_ascii=False) + "\n",
                     encoding="utf-8", newline="\n")
    print(f"\nwrote components.jsonl + {n_views} view file(s) + manifest slop_scan")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
