#!/usr/bin/env python3
"""corpus_query.py — deterministic retrieval over the v3 component corpus.

The prescription-time interface: no network, no memory, no guessing.

Examples:
  python corpus_query.py --intent I3 --altitude section --limit 8
  python corpus_query.py --type button --tags neumorphism --deck-safe
  python corpus_query.py --type hero --source tailark --fields id,name,code_path
  python corpus_query.py --extract "uiverse:Buttons/0x3ther_afraid-eagle-38" --out btn.html
  python corpus_query.py --show "smoothui:pricing-1"          # print code
  python corpus_query.py --stats                              # pool overview

Filters AND together. `--tags` matches ANY of the given style tags.
`--usable-only` (default on) hides license-blocked / ats-cut rows;
pass --include-unusable to see them (they print with a ⛔ marker).

Slop flags (v3.5, F31-b — `scan_slop.py` 가 스탬프): BAN 급
(`gradient-text`·`auto-advance`) 행은 기본 숨김 — --include-slop 로 열람
(🚫 마커). WARN 급(`auto-cycle`·`clip-text`·`initial-hidden`)은 표시되되
⚠ 마커가 붙는다 — 처방 가능하지만 이식 시 해당 함정을 처리해야 한다
(recomposition 모션 이식 절 참조).
"""
import argparse
import io
import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

# v3.6 (H8 이식성): 스크립트는 스킬 폴더 안에 산다 — 스킬 루트를 자기
# 위치에서 도출하므로 vault 밖(GitHub 스탠드얼론)에서도 동작한다.
SKILL_DIR = Path(__file__).resolve().parents[1]
# v3.6 (H4): BAN/WARN 플래그 정의는 slop_policy.py 단일 정본
# (runpy 경유 실행 대비 — 자기 디렉토리를 import 경로에 보장)
sys.path.insert(0, str(Path(__file__).resolve().parent))
from slop_policy import BAN_FLAGS  # noqa: E402


def load_rows(index: Path):
    return [json.loads(l) for l in
            io.open(index / "components.jsonl", encoding="utf-8")]


def get_code(skill: Path, r: dict) -> str:
    cp = r.get("code_path")
    if not cp:
        raise SystemExit(f"{r['id']}: index-only entry (no vendored code); "
                         f"source_url = {r.get('source_url')}")
    if "#" in cp:
        bundle, member = cp.split("#", 1)
        for ln in io.open(skill / bundle, encoding="utf-8"):
            b = json.loads(ln)
            if b["id"].endswith("/" + member) or b["id"] == r["id"]:
                return b["code"]
        raise SystemExit(f"{r['id']}: not found in bundle {bundle}")
    p = skill / cp
    if cp.endswith("/"):
        parts = []
        for f in sorted(p.glob("*")):
            parts.append(f"// ── {f.name} " + "─" * 40 + "\n"
                         + f.read_text(encoding="utf-8"))
        return "\n\n".join(parts)
    return p.read_text(encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--skill", default=None,
                    help="skill dir override (default: derived from __file__)")
    ap.add_argument("--intent", help="I1..I12 (primary or secondary)")
    ap.add_argument("--type", dest="ctype", help="canonical_type (or alias)")
    ap.add_argument("--altitude", choices=["atom", "molecule", "section"])
    ap.add_argument("--source")
    ap.add_argument("--tags", help="comma-separated style tags (ANY-match)")
    ap.add_argument("--deck-safe", action="store_true")
    ap.add_argument("--framework")
    ap.add_argument("--include-unusable", action="store_true")
    ap.add_argument("--include-slop", action="store_true",
                    help="show BAN-flagged rows (gradient-text/auto-advance)")
    ap.add_argument("--limit", type=int, default=20)
    ap.add_argument("--fields",
                    default="id,name,canonical_type,altitude,deck_safe,"
                            "preserve_signature,code_path")
    ap.add_argument("--json", action="store_true", help="full rows as JSONL")
    ap.add_argument("--extract", metavar="ID", help="write one component's code")
    ap.add_argument("--out", help="output file for --extract")
    ap.add_argument("--show", metavar="ID", help="print one component's code")
    ap.add_argument("--stats", action="store_true")
    args = ap.parse_args()

    skill = Path(args.skill) if args.skill else SKILL_DIR
    index = skill / "corpus/index"
    rows = load_rows(index)
    by_id = {r["id"]: r for r in rows}

    if args.show or args.extract:
        rid = args.show or args.extract
        r = by_id.get(rid)
        if not r:
            cands = [i for i in by_id if rid.lower() in i.lower()][:5]
            raise SystemExit(f"unknown id {rid!r}; close: {cands}")
        code = get_code(skill, r)
        if args.show:
            print(f"// {r['id']}  ·  {r['source_url']}  ·  {r['license']}  "
                  f"·  by {r.get('author')}")
            print(code)
        else:
            out = Path(args.out or (r["slug"] + (".html" if r["framework"] in
                                                 ("css", "html") else ".tsx")))
            out.write_text(code, encoding="utf-8", newline="\n")
            print(f"wrote {out}  ({len(code)} chars)  license={r['license']} "
                  f"author={r.get('author')}")
        return 0

    if args.stats:
        man = json.loads((index / "corpus-manifest.json").read_text(encoding="utf-8"))
        print(json.dumps(man, indent=2, ensure_ascii=False))
        return 0

    # resolve type aliases
    ctype = args.ctype
    if ctype:
        al = json.loads((index / "aliases.json").read_text(encoding="utf-8"))
        rev = {a: c for c, alist in al["aliases"].items() for a in alist}
        ctype = rev.get(ctype, ctype)

    tags = [t.strip().lower() for t in args.tags.split(",")] if args.tags else None
    out = []
    for r in rows:
        if not args.include_unusable and not r.get("usable"):
            continue
        if not args.include_slop and not args.include_unusable \
                and set(r.get("slop_flags") or []) & BAN_FLAGS:
            continue
        if args.intent:
            it = r.get("intent") or {}
            if it.get("primary") != args.intent and \
               args.intent not in (it.get("secondary") or []):
                continue
        if ctype and r.get("canonical_type") != ctype:
            continue
        if args.altitude and r.get("altitude") != args.altitude:
            continue
        if args.source and r.get("source") != args.source:
            continue
        if args.deck_safe and not r.get("deck_safe"):
            continue
        if args.framework and r.get("framework") != args.framework:
            continue
        if tags and not any(t in (r.get("style_tags") or []) for t in tags):
            continue
        out.append(r)

    print(f"# {len(out)} match(es)" +
          (f", showing {args.limit}" if len(out) > args.limit else ""))
    fields = [f.strip() for f in args.fields.split(",")]
    for r in out[: args.limit]:
        if args.json:
            print(json.dumps(r, ensure_ascii=False))
        else:
            sf = set(r.get("slop_flags") or [])
            mark = ("⛔ " if not r.get("usable")
                    else "🚫 " if sf & BAN_FLAGS
                    else "⚠ " if sf else "")
            line = " | ".join(str(r.get(f, "")) for f in fields)
            if sf and "slop_flags" not in fields:
                line += " | slop:" + ",".join(sorted(sf))
            print(mark + line)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
