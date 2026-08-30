#!/usr/bin/env python3
"""verify_corpus.py — gate checks for the component-consulting-v3 corpus.

Checks (per external-ingest-security "Vendored Component Corpus Exception"):
  1. LICENSE + NOTICE present for every vendored source
  2. every index row: valid schema enums, license in policy, id unique
  3. vendored rows: code_path resolves to a real file / bundle member
  4. attribution: 100% of uiverse rows carry an author; sources carry authors
  5. no secrets (token/key patterns) and no absolute local paths in vendor
  6. views/index consistency (row counts, projection ids ⊂ index ids)
  7. manifest consistency (counts match reality)
  8. usable-flag law: license non-permissive or ats_verdict==cut → usable false
  9. annotation-enum law (v3.5, F31): "ATS-banned" in preserve_signature →
     ats_verdict must be SET ('cut' or 'conditional' — 큐레이터의 conditional
     은 존중한다; 죄는 공란이다). 주석은 게이트가 아니다 — 게이트는 enum 이다.
     (실측: 이 검사가 없던 3.0.0 에서 11행이 주석만 든 채 기본 질의에 노출)
  10. slop-scan presence law (v3.6, H5): 리빌드는 slop_flags 를 지우는데
      v3.5 에는 그것을 무는 게이트가 없었다 — manifest 의 slop_scan 기록이
      존재하고, 그 카운트가 실제 행들의 플래그 총계와 일치해야 한다. 스캔
      안 했거나 리빌드로 지워진 코퍼스 = FAIL (scan_slop.py --write 재실행).
      플래그 이름은 slop_policy.py 어휘 밖이면 FAIL (H4 단일 정본).

Exit 0 = PASS, 1 = FAIL (violations listed).
Usage: python verify_corpus.py [--skill DIR] [--strict]
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
from slop_policy import ALL_FLAGS  # noqa: E402  (H4 단일 정본)

PERMISSIVE = {"MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "ISC"}
ALTITUDES = {"atom", "molecule", "section"}
FRAMEWORKS = {"css", "html", "react", "vue", "agnostic"}
VERDICTS = {None, "pass", "cut", "conditional"}
INTENTS = {f"I{i}" for i in range(1, 13)}

SECRET_PAT = re.compile(
    r"(sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|"
    r"xox[baprs]-[A-Za-z0-9-]{10,}|-----BEGIN (?:RSA |EC )?PRIVATE KEY)")
ABSPATH_PAT = re.compile(r"[A-Za-z]:\\Users\\|/Users/[a-z0-9_]+/|/home/[a-z0-9_]+/")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--skill", default=None,
                    help="skill dir override (default: derived from __file__)")
    ap.add_argument("--strict", action="store_true")
    args = ap.parse_args()
    skill = Path(args.skill) if args.skill else SKILL_DIR
    vendor, index = skill / "corpus/vendor", skill / "corpus/index"
    errs, warns = [], []

    # 1 — licenses
    for src in ("uiverse", "smoothui", "magicui", "tailark"):
        for f in ("LICENSE", "NOTICE.md"):
            if not (vendor / "LICENSES" / src / f).is_file():
                errs.append(f"[license] missing {src}/{f}")

    # load index
    rows = [json.loads(l) for l in
            io.open(index / "components.jsonl", encoding="utf-8")]
    ids = [r["id"] for r in rows]
    if len(ids) != len(set(ids)):
        errs.append(f"[index] duplicate ids: {len(ids) - len(set(ids))}")

    # bundle membership cache for uiverse
    bundles = {}
    for bf in (vendor / "uiverse").glob("*.jsonl"):
        bundles[bf.stem] = {json.loads(l)["id"]
                            for l in io.open(bf, encoding="utf-8")}

    n_attr = 0
    for r in rows:
        rid = r["id"]
        if r["altitude"] not in ALTITUDES:
            errs.append(f"[schema] {rid}: altitude {r['altitude']}")
        if r["framework"] not in FRAMEWORKS:
            errs.append(f"[schema] {rid}: framework {r['framework']}")
        if r.get("ats_verdict") not in VERDICTS:
            errs.append(f"[schema] {rid}: ats_verdict {r['ats_verdict']}")
        it = r.get("intent")
        if it and it.get("primary") not in INTENTS:
            errs.append(f"[schema] {rid}: intent {it}")
        lic_ok = r.get("license") in PERMISSIVE
        # 8 — usable law
        if not lic_ok and r.get("usable"):
            errs.append(f"[usable] {rid}: license={r.get('license')} but usable")
        if r.get("ats_verdict") == "cut" and r.get("usable"):
            errs.append(f"[usable] {rid}: ats_verdict=cut but usable")
        # 9 — annotation-enum law (F31): 공란만 죄다 (conditional 은 큐레이터 판단)
        if "ATS-banned" in (r.get("preserve_signature") or "") \
                and r.get("ats_verdict") not in ("cut", "conditional"):
            errs.append(f"[ats] {rid}: 'ATS-banned' annotation but "
                        f"ats_verdict={r.get('ats_verdict')}")
        # 3 — code_path resolution
        if r["vendored"]:
            cp = r["code_path"]
            if cp is None:
                errs.append(f"[code] {rid}: vendored but no code_path")
                continue
            if "#" in cp:
                bundle, member = cp.split("#", 1)
                cat = Path(bundle).stem
                if rid not in bundles.get(cat, set()):
                    errs.append(f"[code] {rid}: not in bundle {cat}")
            else:
                p = skill / cp
                ok = p.is_dir() if cp.endswith("/") else p.is_file()
                if not ok:
                    errs.append(f"[code] {rid}: missing {cp}")
            if not lic_ok:
                errs.append(f"[license] {rid}: vendored with license "
                            f"{r.get('license')}")
        # 4 — attribution
        if r.get("author"):
            n_attr += 1
        elif r["vendored"]:
            errs.append(f"[attr] {rid}: vendored without author")

    # 5 — secrets / abs paths in vendored text
    scanned = 0
    for f in vendor.rglob("*"):
        if not f.is_file() or f.suffix not in (".tsx", ".jsonl", ".html", ".md", ""):
            continue
        txt = f.read_text(encoding="utf-8", errors="replace")
        scanned += 1
        if SECRET_PAT.search(txt):
            errs.append(f"[secret] pattern in {f.relative_to(skill)}")
        m = ABSPATH_PAT.search(txt)
        if m:
            errs.append(f"[abspath] {m.group(0)!r} in {f.relative_to(skill)}")

    # 6 — views consistency
    idset = set(ids)
    for vf in (index / "views").rglob("*.jsonl"):
        for ln in io.open(vf, encoding="utf-8"):
            vid = json.loads(ln)["id"]
            if vid not in idset:
                errs.append(f"[views] {vf.name}: unknown id {vid}")
                break
    n_int = sum(1 for r in rows if r.get("intent"))
    n_int_view = sum(1 for vf in (index / "views/by-intent").glob("*.jsonl")
                     for _ in io.open(vf, encoding="utf-8"))
    if n_int != n_int_view:
        errs.append(f"[views] intent rows {n_int} != by-intent lines {n_int_view}")

    # 7 — manifest
    man = json.loads((index / "corpus-manifest.json").read_text(encoding="utf-8"))
    if man["total_components"] != len(rows):
        errs.append(f"[manifest] total {man['total_components']} != {len(rows)}")
    if man["vendored"] != sum(1 for r in rows if r["vendored"]):
        errs.append("[manifest] vendored count mismatch")

    # 10 — slop-scan presence law (v3.6, H5)
    row_counts = {}
    unknown_flagged = 0
    for r in rows:
        for f in (r.get("slop_flags") or []):
            row_counts[f] = row_counts.get(f, 0) + 1
            if f not in ALL_FLAGS and unknown_flagged < 10:
                errs.append(f"[slop] {r['id']}: unknown flag {f!r} "
                            f"(not in slop_policy)")
                unknown_flagged += 1
    ss = man.get("slop_scan")
    if not ss:
        errs.append("[slop] manifest has no slop_scan record — run "
                    "scan_slop.py --write after every (re)build")
    elif ss.get("flags") != row_counts:
        errs.append(f"[slop] manifest slop_scan.flags {ss.get('flags')} != "
                    f"row totals {row_counts} — re-run scan_slop.py --write")

    print(f"rows={len(rows)} vendored={sum(1 for r in rows if r['vendored'])} "
          f"attributed={n_attr} files_scanned={scanned}")
    if warns:
        print(f"WARNINGS ({len(warns)}):")
        for w in warns[:20]:
            print("  ", w)
    if errs:
        print(f"FAIL — {len(errs)} violation(s):")
        for e in errs[:40]:
            print("  ", e)
        if len(errs) > 40:
            print(f"   … and {len(errs) - 40} more")
        return 1
    print("PASS — corpus verified.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
