#!/usr/bin/env python3
"""build_component_corpus.py — build the component-consulting-v3 corpus.

Reads fetched sources from the airlock, classifies deterministically,
merges the hand-curated knowledge of component-consulting-v2's 332-entry
library (preserve_signature / reskin_cost / watch_out / ats_verdict /
mcgl_move — Korean annotations preserved verbatim), and emits:

  corpus/vendor/uiverse/{Category}.jsonl      (atom bundles, code inline)
  corpus/vendor/smoothui/{name}.tsx           (+ multi-file dirs)
  corpus/vendor/magicui/{name}.tsx
  corpus/vendor/tailark/{kit}/{family}/{n}.tsx
  corpus/vendor/LICENSES/{source}/LICENSE + NOTICE.md
  corpus/index/components.jsonl               (1 row = 1 component)
  corpus/index/views/by-intent/i01..i12.jsonl (sections only)
  corpus/index/views/by-type/{type}.jsonl
  corpus/index/views/by-altitude/{alt}.jsonl
  corpus/index/views/deck-safe.jsonl
  corpus/index/aliases.json
  corpus/index/legacy-unmatched.jsonl         (v2 rows with no vendored match)
  corpus/index/corpus-manifest.json

No network. No execution of fetched code. Attribution comments are never
stripped (Uiverse `From Uiverse.io by {author}`).

Usage:
  python build_component_corpus.py [--airlock DIR] [--vault DIR] [--dry-run]
"""
import argparse
import io
import json
import re
import sys
from datetime import date
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

DEFAULT_AIRLOCK = Path.home() / "AppData/Local/hermes/achmage-airlock/component-corpus-v3"
DEFAULT_VAULT = Path(__file__).resolve().parents[3]  # …/Achmage_OS (V2_LIB 용)
SKILL_ROOT = Path(__file__).resolve().parents[1]     # v3.6 H8: 스킬 루트 자기 도출
V2_LIB = "20_Master-Skills/component-consulting-v2/references/component-library"

CORPUS_VERSION = "3.0.0"
TODAY = date.today().isoformat()

PERMISSIVE = {"MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "ISC"}

# ---------------------------------------------------------------- taxonomy --

# uiverse category dir -> canonical type (component.gallery vocabulary where
# it exists; `pattern` is a documented extension type).
UIVERSE_TYPE = {
    "Buttons": "button", "Cards": "card", "Checkboxes": "checkbox",
    "Forms": "form", "Inputs": "text-input", "Notifications": "toast",
    "Patterns": "pattern", "Radio-buttons": "radio-button",
    "Toggle-switches": "toggle", "Tooltips": "tooltip", "loaders": "spinner",
}

# section family -> (canonical_type, primary intent, secondary, utility)
FAMILY_INTENT = {
    "hero-section": ("hero", "I1", [], False),
    "hero":         ("hero", "I1", [], False),
    "stats":        ("stats", "I2", [], False),
    "testimonials": ("testimonials", "I3", ["I12"], False),
    "faq":          ("faq", "I4", ["I8"], False),
    "faqs":         ("faq", "I4", ["I8"], False),
    "contact":      ("contact", "I4", ["I6"], False),
    "comparator":   ("comparator", "I5", [], False),
    "pricing":      ("pricing", "I5", [], False),
    "features":     ("features", "I9", [], False),
    "content":      ("content", "I9", ["I7"], False),
    "integrations": ("integrations", "I12", ["I9"], False),
    "team":         ("team", "I12", [], False),
    "logo-cloud":   ("logo-cloud", "I12", ["I3"], False),
    "cta":          ("cta", "I11", [], False),
    "call-to-action": ("cta", "I11", [], False),
    "footer":       ("footer", "I11", ["I12"], False),
    "header":       ("header", "I10", [], False),
    "login":        ("auth-form", "I6", [], True),
    "sign-up":      ("auth-form", "I6", [], True),
    "forgot-password": ("auth-form", "I6", [], True),
}

INTENT_IDS = [f"I{i}" for i in range(1, 13)]

# Curated alias map (component.gallery vocabulary authority + common synonyms;
# curated 2026-08-28). Keys are canonical, values are aliases.
ALIASES = {
    "hero": ["jumbotron", "masthead", "banner", "page-header"],
    "toast": ["notification", "snackbar", "alert-toast"],
    "drawer": ["off-canvas", "side-panel", "slide-out"],
    "modal": ["dialog", "lightbox", "overlay"],
    "carousel": ["image-slider", "gallery-slider", "slideshow"],
    "avatar": ["profile-image", "user-photo"],
    "breadcrumbs": ["breadcrumb-trail", "breadcrumb"],
    "tooltip": ["hint", "info-tip", "gloss"],
    "select": ["dropdown", "picker"],
    "dropdown-menu": ["menu", "context-menu"],
    "tabs": ["tab-bar", "tab-switcher"],
    "toggle": ["switch", "toggle-switch"],
    "spinner": ["loader", "loading-indicator", "activity-indicator"],
    "skeleton": ["placeholder", "shimmer", "ghost-loading"],
    "pagination": ["pager", "page-navigation"],
    "stepper": ["wizard", "step-indicator", "progress-steps"],
    "badge": ["chip", "tag", "pill", "label-badge"],
    "card": ["tile", "panel"],
    "accordion": ["disclosure", "collapse", "expander"],
    "progress-bar": ["progress", "meter"],
    "text-input": ["input", "input-field", "text-field"],
    "search-input": ["search-bar", "search-box", "search-field"],
    "button": ["cta-button", "action-button"],
    "checkbox": ["check-box", "tick-box"],
    "radio-button": ["radio", "option-button"],
    "table": ["data-table", "grid-table"],
    "footer": ["site-footer", "page-footer"],
    "header": ["site-header", "navbar", "navigation-bar", "top-bar"],
    "logo-cloud": ["logo-strip", "logo-marquee", "brand-wall"],
    "testimonials": ["reviews", "social-proof", "quotes-section"],
    "pricing": ["pricing-table", "plans", "tiers"],
    "stats": ["stats-strip", "kpi-row", "metrics-band", "counters"],
    "faq": ["frequently-asked-questions", "q-and-a", "questions"],
    "cta": ["call-to-action", "cta-band", "closing-call"],
    "features": ["feature-grid", "value-props", "capabilities"],
    "comparator": ["comparison-table", "versus", "before-after"],
    "bento": ["bento-grid", "mosaic-grid"],
    "marquee": ["ticker", "infinite-scroll-strip"],
    "empty-state": ["blank-slate", "zero-state"],
    "pattern": ["background-pattern", "texture", "backdrop"],
    "timeline": ["chronology", "history-line", "changelog-visual"],
}

# The component.gallery 60-type vocabulary (measured from its sitemap
# 2026-08-28) — retained as the naming authority for atoms/molecules.
CG_60 = [
    "accordion", "alert", "avatar", "badge", "breadcrumbs", "button",
    "button-group", "card", "carousel", "checkbox", "color-picker",
    "combobox", "date-input", "datepicker", "drawer", "dropdown-menu",
    "empty-state", "fieldset", "file", "file-upload", "footer", "form",
    "header", "heading", "hero", "icon", "image", "label", "link", "list",
    "modal", "navigation", "pagination", "popover", "progress-bar",
    "progress-indicator", "quote", "radio-button", "rating",
    "rich-text-editor", "search-input", "segmented-control", "select",
    "separator", "skeleton", "skip-link", "slider", "spinner", "stack",
    "stepper", "table", "tabs", "text-input", "textarea", "toast", "toggle",
    "tooltip", "tree-view", "video", "visually-hidden",
]

UIVERSE_COMMENT = re.compile(
    r"<!--\s*From Uiverse\.io by\s+(\S+)\s*-\s*Tags:\s*(.*?)-->", re.S)

# Molecule name → canonical type. Registry molecules (smoothui/magicui) carry
# their type in the component name; without this they all collapse to "effect"
# and `--type accordion` finds nothing even though the code is vendored.
# Ordered: first matching keyword wins, so put compound keys before their parts.
NAME_TYPE_RULES = [
    ("otp", "text-input"), ("file-upload", "file-upload"),
    ("searchable-dropdown", "combobox"), ("dropdown-menu", "dropdown-menu"),
    ("basic-dropdown", "dropdown-menu"), ("context-menu", "dropdown-menu"),
    ("combobox", "combobox"), ("accordion", "accordion"),
    ("notification-badge", "badge"), ("badge", "badge"),
    ("progress-bar", "progress-bar"), ("circular-progress", "progress-indicator"),
    ("scroll-progress", "progress-indicator"), ("progress", "progress-bar"),
    ("stepper", "stepper"), ("breadcrumb", "breadcrumbs"),
    ("pagination", "pagination"), ("tooltip", "tooltip"),
    ("popover", "popover"), ("drawer", "drawer"), ("dialog", "modal"),
    ("modal", "modal"), ("toast", "toast"), ("tabs", "tabs"),
    ("phototab", "tabs"), ("avatar", "avatar"), ("checkbox", "checkbox"),
    ("radio-group", "radio-button"), ("select", "select"),
    ("slider", "slider"), ("scrubber", "slider"), ("switchboard", "card"),
    ("product-card", "card"), ("tweet-card", "card"), ("glow-hover-card", "card"),
    ("magic-card", "card"), ("neon-gradient-card", "card"),
    ("expandable-cards", "card"), ("card", "card"), ("table", "table"),
    ("file-tree", "tree-view"), ("terminal", "code-block"),
    ("code-comparison", "code-block"), ("marquee", "marquee"),
    ("infinite-slider", "marquee"), ("bento", "bento"),
    ("number-ticker", "counter"), ("number-flow", "counter"),
    ("price-flow", "counter"), ("animated-tags", "badge"),
    ("skeleton", "skeleton"), ("loader", "spinner"), ("spinner", "spinner"),
    ("form", "form"), ("input", "text-input"), ("button", "button"),
    ("dock", "navigation"), ("sidebar", "navigation"),
    ("timeline", "timeline"), ("contribution-graph", "timeline"),
    ("carousel", "carousel"), ("photo-stack", "carousel"),
    ("globe", "map"), ("dotted-map", "map"), ("icon-cloud", "icon"),
    ("video", "video"), ("safari", "device-frame"), ("iphone", "device-frame"),
    ("android", "device-frame"), ("book", "device-frame"),
    ("pattern", "pattern"), ("grid-pattern", "pattern"),
    ("noise-texture", "pattern"), ("text", "text-effect"),
    ("letters", "text-effect"), ("typewriter", "text-effect"),
    ("scramble", "text-effect"), ("transition", "scene-transition"),
]


def type_from_name(name: str) -> str:
    """Derive a canonical type from a registry component name."""
    slug = norm_slug(name)
    for key, ctype in NAME_TYPE_RULES:
        if key in slug:
            return ctype
    return "effect"


def norm_slug(s: str) -> str:
    s = s.strip().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s


def clean_tags(raw: str) -> list:
    out = []
    for t in raw.split(","):
        t = t.strip().rstrip("*/").strip().lower()
        if t and t not in out:
            out.append(t)
    return out


def row(**kw) -> dict:
    """Canonical index row with every schema key present."""
    base = {
        "id": None, "name": None, "slug": None, "source": None,
        "source_url": None, "author": None, "license": None,
        "license_path": None, "code_path": None, "vendored": False,
        "framework": None, "deck_safe": False, "canonical_type": None,
        "altitude": None, "intent": None, "utility": False,
        "layout_affordances": None, "motion_profile": None,
        "slot_anatomy": None, "preserve_signature": None,
        "reskin_cost": None, "style_tags": [], "token_surface": None,
        "watch_out": None, "ats_verdict": None, "mcgl_move": None,
        "usable": True, "legacy_series": None, "note": None,
        "last_verified": TODAY, "corpus_version": CORPUS_VERSION,
    }
    base.update(kw)
    return base


# ------------------------------------------------------------- v2 library --

V2_KEYS = {
    "name", "url", "gallery", "canonical_type", "intent", "framework",
    "deck_safe", "free_tier", "license", "layout_affordances",
    "motion_profile", "slot_anatomy", "preserve_signature", "reskin_cost",
    "watch_out", "note", "ats_verdict", "mcgl_move", "variants",
    "manual_review", "utility",
}


def parse_v2_library(lib_dir: Path) -> list:
    """Lenient parser for the 12 intent files' YAML entry blocks."""
    entries = []
    for f in sorted(lib_dir.glob("i[0-9][0-9]-*.md")):
        text = f.read_text(encoding="utf-8")
        intent_id = "I" + str(int(f.name[1:3]))
        series = None
        for m in re.finditer(r"^## Series:\s*(.+?)\s*$|^```yaml\n(.*?)^```", text,
                             re.M | re.S):
            if m.group(1) is not None:
                series = norm_slug(m.group(1).split("(")[0])
                continue
            block = m.group(2)
            # split into entries on "- name:" at any indent
            parts = re.split(r"(?m)^\s*-\s+name:", block)
            for part in parts[1:]:
                lines = ("name:" + part).splitlines()
                e = {"_intent_file": intent_id, "_series": series}
                cur_key = None
                for ln in lines:
                    mm = re.match(r"^\s*([a-z_]+):\s*(.*)$", ln)
                    if mm and mm.group(1) in V2_KEYS:
                        cur_key = mm.group(1)
                        e[cur_key] = mm.group(2).strip().strip('"')
                    elif cur_key and re.match(r"^\s+- ", ln):
                        e[cur_key] = (e.get(cur_key) or "") + "|" + ln.strip()[2:]
                entries.append(e)
    return entries


def v2_match_key(e: dict) -> tuple:
    """(gallery, slug) matching key for a v2 entry."""
    g = (e.get("gallery") or "").strip().lower()
    url = e.get("url") or ""
    slug = None
    m = re.search(r"uiverse\.io/([^/\s]+)/([a-z0-9-]+)", url)
    if g == "uiverse" and m:
        return ("uiverse", f"{m.group(1)}_{m.group(2)}".lower())
    m = re.search(r"/(?:docs/components|r|components)/([a-z0-9-]+)", url)
    if m:
        slug = m.group(1)
    if not slug:
        slug = norm_slug(e.get("name") or "")
    return (g, slug)


def enrich_from_v2(r: dict, e: dict) -> None:
    for src, dst in (("preserve_signature", "preserve_signature"),
                     ("reskin_cost", "reskin_cost"),
                     ("watch_out", "watch_out"),
                     ("ats_verdict", "ats_verdict"),
                     ("mcgl_move", "mcgl_move"),
                     ("motion_profile", "motion_profile"),
                     ("slot_anatomy", "slot_anatomy"),
                     ("layout_affordances", "layout_affordances"),
                     ("note", "note")):
        v = e.get(src)
        if v and not r.get(dst):
            r[dst] = v
    r["legacy_series"] = f"{e['_intent_file']}/{e.get('_series')}"
    if not r.get("intent"):
        # inherit the v2 curators' intent classification (hand-curated value)
        r["intent"] = {"primary": e["_intent_file"], "secondary": []}
    # F31 (실전 3호): 큐레이터의 한국어 주석에만 있던 ATS 금지를 enum 으로 배선.
    # "주석은 게이트가 아니다 — 게이트는 enum 이다." 이 줄이 없으면 8행이
    # usable:true 로 기본 질의에 노출된다 (실측: smoothui:shine-text 가
    # SIGNATURE 후보 목록에 떴다).
    if (r.get("preserve_signature") and "ATS-banned" in r["preserve_signature"]
            and not r.get("ats_verdict")):
        r["ats_verdict"] = "cut"
    if r.get("ats_verdict") == "cut":
        r["usable"] = False


# ----------------------------------------------------------------- builds --

def build_uiverse(airlock: Path, vendor: Path, dry: bool):
    root = next((airlock / "uiverse").glob("galaxy-*"))
    rows, bundles = [], {}
    for cat, ctype in UIVERSE_TYPE.items():
        cdir = root / cat
        if not cdir.is_dir():
            continue
        bundle = []
        for f in sorted(cdir.glob("*.html")):
            code = f.read_text(encoding="utf-8", errors="replace")
            m = UIVERSE_COMMENT.search(code)
            author = m.group(1) if m else f.stem.split("_")[0]
            tags = clean_tags(m.group(2)) if m else []
            stem = f.stem
            rid = f"uiverse:{cat}/{stem}"
            r = row(
                id=rid, name=stem.replace("_", " "), slug=norm_slug(stem),
                source="uiverse",
                source_url=f"https://uiverse.io/{author}/{stem.split('_', 1)[-1]}",
                author=author, license="MIT",
                license_path="corpus/vendor/LICENSES/uiverse/LICENSE",
                code_path=f"corpus/vendor/uiverse/{cat}.jsonl#{stem}",
                vendored=True, framework="css", deck_safe=True,
                canonical_type=ctype, altitude="atom", style_tags=tags,
            )
            rows.append(r)
            bundle.append({"id": rid, "author": author, "tags": tags,
                           "bytes": len(code.encode("utf-8")), "code": code})
        bundles[cat] = bundle
    if not dry:
        out = vendor / "uiverse"
        out.mkdir(parents=True, exist_ok=True)
        for cat, bundle in bundles.items():
            with io.open(out / f"{cat}.jsonl", "w", encoding="utf-8",
                         newline="\n") as fh:
                for b in bundle:
                    fh.write(json.dumps(b, ensure_ascii=False) + "\n")
    return rows, root


def build_smoothui(airlock: Path, vendor: Path, dry: bool):
    reg = json.loads((airlock / "smoothui/registry.json").read_text(encoding="utf-8"))
    rows = []
    out = vendor / "smoothui"
    for item in reg["items"]:
        typ, name = item.get("type"), item.get("name")
        if typ not in ("registry:ui", "registry:block"):
            continue
        if name in ("shared", "lib", "data", "cli", "skill"):
            continue
        files = [f for f in item.get("files", []) if f.get("content")]
        if not files:
            continue
        is_block = typ == "registry:block"
        fam = re.sub(r"-?\d+$", "", name) if is_block else None
        fi = FAMILY_INTENT.get(fam or "", None)
        multi = len(files) > 1
        code_rel = (f"corpus/vendor/smoothui/{name}/" if multi
                    else f"corpus/vendor/smoothui/{name}.tsx")
        if not dry:
            if multi:
                d = out / name
                d.mkdir(parents=True, exist_ok=True)
                for f in files:
                    (d / Path(f["path"]).name).write_text(
                        f["content"], encoding="utf-8", newline="\n")
            else:
                out.mkdir(parents=True, exist_ok=True)
                (out / f"{name}.tsx").write_text(
                    files[0]["content"], encoding="utf-8", newline="\n")
        rows.append(row(
            id=f"smoothui:{name}", name=item.get("title") or name,
            slug=norm_slug(name), source="smoothui",
            source_url=f"https://smoothui.dev/r/{name}.json",
            author="Eduardo Calvo (educlopez)", license="MIT",
            license_path="corpus/vendor/LICENSES/smoothui/LICENSE",
            code_path=code_rel, vendored=True, framework="react",
            deck_safe=False,
            canonical_type=(fi[0] if fi else type_from_name(name)),
            altitude=("section" if is_block else "molecule"),
            intent=({"primary": fi[1], "secondary": fi[2]} if fi and is_block else None),
            utility=(fi[3] if fi else False),
        ))
    return rows


def build_magicui(airlock: Path, vendor: Path, dry: bool):
    rows = []
    out = vendor / "magicui"
    for jf in sorted((airlock / "magicui/items").glob("*.json")):
        item = json.loads(jf.read_text(encoding="utf-8"))
        name = item.get("name")
        files = [f for f in item.get("files", []) if f.get("content")]
        if not files:
            continue
        multi = len(files) > 1
        code_rel = (f"corpus/vendor/magicui/{name}/" if multi
                    else f"corpus/vendor/magicui/{name}.tsx")
        if not dry:
            if multi:
                d = out / name
                d.mkdir(parents=True, exist_ok=True)
                for f in files:
                    (d / Path(f["path"]).name).write_text(
                        f["content"], encoding="utf-8", newline="\n")
            else:
                out.mkdir(parents=True, exist_ok=True)
                (out / f"{name}.tsx").write_text(
                    files[0]["content"], encoding="utf-8", newline="\n")
        rows.append(row(
            id=f"magicui:{name}", name=item.get("title") or name,
            slug=norm_slug(name), source="magicui",
            source_url=f"https://magicui.design/docs/components/{name}",
            author="Magic UI (magicuidesign)", license="MIT",
            license_path="corpus/vendor/LICENSES/magicui/LICENSE",
            code_path=code_rel, vendored=True, framework="react",
            deck_safe=False, canonical_type=type_from_name(name),
            altitude="molecule",
        ))
    return rows


def build_tailark(airlock: Path, vendor: Path, dry: bool):
    root = next((airlock / "tailark").glob("blocks-*"))
    base = root / "registry/bases/radix"
    rows = []
    # single-file blocks: {kit}/blocks/{family}/{ordinal}.tsx
    # multi-file blocks:  {kit}/blocks/{family}/{ordinal}/{part}.tsx
    singles = sorted(base.glob("*/blocks/*/*.tsx"))
    multi_dirs = sorted({p.parent for p in base.glob("*/blocks/*/*/*.tsx")})
    blocks = [(p, False) for p in singles] + [(d, True) for d in multi_dirs]
    for src, multi in blocks:
        kit, _, family = src.relative_to(base).parts[:3]
        ordinal = src.stem if not multi else src.name
        fam_key = family if family in FAMILY_INTENT else norm_slug(family)
        fi = FAMILY_INTENT.get(fam_key)
        name = f"{kit}-{family}-{ordinal}"
        code_rel = (f"corpus/vendor/tailark/{kit}/{family}/{ordinal}/" if multi
                    else f"corpus/vendor/tailark/{kit}/{family}/{ordinal}.tsx")
        if not dry:
            if multi:
                d = vendor / "tailark" / kit / family / ordinal
                d.mkdir(parents=True, exist_ok=True)
                for part in sorted(src.glob("*.tsx")):
                    (d / part.name).write_text(
                        part.read_text(encoding="utf-8"),
                        encoding="utf-8", newline="\n")
            else:
                d = vendor / "tailark" / kit / family
                d.mkdir(parents=True, exist_ok=True)
                (d / f"{ordinal}.tsx").write_text(
                    src.read_text(encoding="utf-8"),
                    encoding="utf-8", newline="\n")
        rows.append(row(
            id=f"tailark:{kit}/{family}/{ordinal}", name=name,
            slug=norm_slug(name), source="tailark",
            source_url=f"https://tailark.com/{kit}",
            author="Tailark (Méschac Irung)", license="MIT",
            license_path="corpus/vendor/LICENSES/tailark/LICENSE",
            code_path=code_rel, vendored=True, framework="react",
            deck_safe=False,
            canonical_type=(fi[0] if fi else norm_slug(family)),
            altitude="section",
            intent=({"primary": fi[1], "secondary": fi[2]} if fi else None),
            utility=(fi[3] if fi else False),
        ))
    return rows, root


def build_index_only(v2_entries: list, matched_ids: set) -> tuple:
    """v2 entries from non-vendored galleries → index-only rows."""
    rows, unmatched = [], []
    for e in v2_entries:
        g = (e.get("gallery") or "").strip().lower()
        if g in ("uiverse", "smoothui", "magicui"):
            key = v2_match_key(e)
            if key not in matched_ids:
                unmatched.append(e)
            continue
        lic = (e.get("license") or "unknown").strip()
        lic_ok = lic in PERMISSIVE
        slug = norm_slug(e.get("name") or "")
        aff = e.get("layout_affordances") or ""
        alt = "section" if ("hero-scale" in aff or "wide-band" in aff) else "molecule"
        fw = (e.get("framework") or "react").strip()
        r = row(
            id=f"{g}:{slug}", name=e.get("name"), slug=slug, source=g,
            source_url=e.get("url"), author=None, license=lic,
            license_path=None, code_path=None, vendored=False,
            framework=fw, deck_safe=(fw in ("css", "html")),
            canonical_type=norm_slug(e.get("canonical_type") or "") or None,
            altitude=alt,
            intent={"primary": e["_intent_file"], "secondary": []},
            usable=lic_ok,
        )
        enrich_from_v2(r, e)
        if not lic_ok:
            r["usable"] = False
            r["watch_out"] = ((r.get("watch_out") or "") +
                              " [license non-permissive/unknown — manual review]").strip()
        rows.append(r)
    return rows, unmatched


# ------------------------------------------------------------------ emit --

NOTICE_TMPL = """# NOTICE — vendored corpus source: {src}

Upstream: {upstream}
License: MIT (full text in LICENSE alongside this file)
Pinned: {pin}
Retrieved: {retrieved} (airlock fetch, no execution, no installation)

Per-item author attribution is preserved inside the vendored files
({attr_note}). This corpus is inert reference data for the
component-consulting-v3 skill (risk class S1-vendored per
external-ingest-security "Vendored Component Corpus Exception").
"""


def emit_licenses(airlock: Path, vendor: Path, roots: dict, manifest: dict):
    lic_dir = vendor / "LICENSES"
    fetch = json.loads((airlock / "fetch-manifest.json").read_text(encoding="utf-8"))
    plans = {
        "uiverse": (roots["uiverse"] / "LICENSE",
                    "https://github.com/uiverse-io/galaxy",
                    f"commit {fetch['sources']['uiverse']['commit']}",
                    "each element file carries `<!-- From Uiverse.io by {author} … -->`"),
        "tailark": (roots["tailark"] / "LICENCE.md",
                    "https://github.com/tailark/blocks",
                    f"commit {fetch['sources']['tailark']['commit']}",
                    "repo-level MIT; blocks authored by the Tailark project"),
        "smoothui": (airlock / "smoothui/LICENSE",
                     "https://github.com/educlopez/smoothui",
                     f"registry snapshot {fetch['sources']['smoothui']['retrieved_at']}",
                     "registry items carry `author` field (Eduardo Calvo)"),
        "magicui": (airlock / "magicui/LICENSE",
                    "https://github.com/magicuidesign/magicui",
                    f"registry snapshot {fetch['sources']['magicui']['retrieved_at']}",
                    "repo-level MIT; components authored by the Magic UI project"),
    }
    for src, (lic_file, upstream, pin, attr) in plans.items():
        d = lic_dir / src
        d.mkdir(parents=True, exist_ok=True)
        (d / "LICENSE").write_text(
            lic_file.read_text(encoding="utf-8"), encoding="utf-8", newline="\n")
        (d / "NOTICE.md").write_text(
            NOTICE_TMPL.format(src=src, upstream=upstream, pin=pin,
                               retrieved=fetch["fetched_at"], attr_note=attr),
            encoding="utf-8", newline="\n")
        manifest["sources"][src]["upstream"] = upstream
        manifest["sources"][src]["pin"] = pin


def emit_views(rows: list, index_dir: Path):
    views = index_dir / "views"
    (views / "by-intent").mkdir(parents=True, exist_ok=True)
    (views / "by-type").mkdir(parents=True, exist_ok=True)
    (views / "by-altitude").mkdir(parents=True, exist_ok=True)

    def w(path: Path, rs):
        with io.open(path, "w", encoding="utf-8", newline="\n") as fh:
            for r in rs:
                fh.write(json.dumps(r, ensure_ascii=False) + "\n")

    PROJ = ("id", "name", "canonical_type", "altitude", "style_tags",
            "deck_safe", "usable", "code_path")

    def wc(path, rs):
        """Compact projection for the big views (join back via id)."""
        with io.open(path, "w", encoding="utf-8", newline=chr(10)) as fh:
            for r in rs:
                fh.write(json.dumps({k: r[k] for k in PROJ},
                                    ensure_ascii=False) + chr(10))

    for iid in INTENT_IDS:
        rs = [r for r in rows
              if r.get("intent") and r["intent"].get("primary") == iid]
        w(views / "by-intent" / f"i{int(iid[1:]):02d}.jsonl", rs)
    for t in sorted({r["canonical_type"] for r in rows if r["canonical_type"]}):
        wc(views / "by-type" / f"{t}.jsonl",
           [r for r in rows if r["canonical_type"] == t])
    for alt in ("atom", "molecule", "section"):
        wc(views / "by-altitude" / f"{alt}.jsonl",
           [r for r in rows if r["altitude"] == alt])
    wc(views / "deck-safe.jsonl", [r for r in rows if r["deck_safe"]])


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--airlock", default=str(DEFAULT_AIRLOCK))
    ap.add_argument("--vault", default=str(DEFAULT_VAULT))
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    airlock, vault = Path(args.airlock), Path(args.vault)
    skill = SKILL_ROOT
    vendor, index_dir = skill / "corpus/vendor", skill / "corpus/index"

    print(f"airlock: {airlock}\nvault:   {vault}\ndry-run: {args.dry_run}")

    print("— v2 library parse …")
    v2 = parse_v2_library(vault / V2_LIB)
    print(f"  v2 entries parsed: {len(v2)}")

    print("— uiverse …")
    ui_rows, ui_root = build_uiverse(airlock, vendor, args.dry_run)
    print(f"  atoms: {len(ui_rows)}")
    print("— smoothui …")
    sm_rows = build_smoothui(airlock, vendor, args.dry_run)
    print(f"  items: {len(sm_rows)} "
          f"(sections {sum(1 for r in sm_rows if r['altitude']=='section')})")
    print("— magicui …")
    mg_rows = build_magicui(airlock, vendor, args.dry_run)
    print(f"  items: {len(mg_rows)}")
    print("— tailark (radix base) …")
    tl_rows, tl_root = build_tailark(airlock, vendor, args.dry_run)
    print(f"  blocks: {len(tl_rows)}")

    vend_rows = ui_rows + sm_rows + mg_rows + tl_rows

    # --- merge v2 knowledge into vendored rows -----------------------------
    print("— merging v2 annotations …")
    by_key = {}
    for r in vend_rows:
        if r["source"] == "uiverse":
            stem = r["id"].split("/", 1)[1]
            by_key[("uiverse", stem.lower())] = r
        else:
            by_key[(r["source"], r["slug"])] = r
    matched_keys = set()
    matched = 0
    for e in v2:
        key = v2_match_key(e)
        r = by_key.get(key)
        if r is not None:
            enrich_from_v2(r, e)
            matched_keys.add(key)
            matched += 1
    print(f"  matched onto vendored rows: {matched}")

    io_rows, unmatched = build_index_only(v2, matched_keys)
    print(f"  index-only rows (non-vendored galleries): {len(io_rows)}")
    print(f"  legacy-unmatched (vendored galleries, no match): {len(unmatched)}")

    rows = vend_rows + io_rows
    ids = [r["id"] for r in rows]
    dupes = {i for i in ids if ids.count(i) > 1}
    if dupes:
        seen = set()
        uniq = []
        for r in rows:
            if r["id"] in seen:
                continue
            seen.add(r["id"])
            uniq.append(r)
        print(f"  deduped ids: {len(rows) - len(uniq)} ({sorted(dupes)[:5]}…)")
        rows = uniq

    print(f"— TOTAL corpus rows: {len(rows)} "
          f"(vendored {sum(1 for r in rows if r['vendored'])}, "
          f"index-only {sum(1 for r in rows if not r['vendored'])})")

    if args.dry_run:
        return 0

    index_dir.mkdir(parents=True, exist_ok=True)
    with io.open(index_dir / "components.jsonl", "w", encoding="utf-8",
                 newline="\n") as fh:
        for r in rows:
            fh.write(json.dumps(r, ensure_ascii=False) + "\n")
    with io.open(index_dir / "legacy-unmatched.jsonl", "w", encoding="utf-8",
                 newline="\n") as fh:
        for e in unmatched:
            fh.write(json.dumps(e, ensure_ascii=False) + "\n")

    emit_views(rows, index_dir)
    (index_dir / "aliases.json").write_text(
        json.dumps({"canonical_vocabulary_authority":
                    "component.gallery (60 types, sitemap 2026-08-28)",
                    "cg_60": CG_60,
                    "extension_types": ["pattern", "effect", "stats",
                                        "testimonials", "pricing", "faq",
                                        "contact", "comparator", "features",
                                        "content", "integrations", "team",
                                        "logo-cloud", "cta", "auth-form",
                                        "bento", "marquee", "timeline"],
                    "aliases": ALIASES},
                   indent=2, ensure_ascii=False),
        encoding="utf-8", newline="\n")

    manifest = {
        "corpus_version": CORPUS_VERSION, "built_at": TODAY,
        "total_components": len(rows),
        "vendored": sum(1 for r in rows if r["vendored"]),
        "index_only": sum(1 for r in rows if not r["vendored"]),
        "by_source": {s: sum(1 for r in rows if r["source"] == s)
                      for s in sorted({r["source"] for r in rows})},
        "by_altitude": {a: sum(1 for r in rows if r["altitude"] == a)
                        for a in ("atom", "molecule", "section")},
        "by_intent_primary": {
            iid: sum(1 for r in rows
                     if r.get("intent") and r["intent"].get("primary") == iid)
            for iid in INTENT_IDS},
        "v2_annotations_matched": matched,
        "legacy_unmatched": len(unmatched),
        "sources": {"uiverse": {}, "tailark": {}, "smoothui": {}, "magicui": {}},
    }
    emit_licenses(airlock, vendor, {"uiverse": ui_root, "tailark": tl_root},
                  manifest)
    (index_dir / "corpus-manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False),
        encoding="utf-8", newline="\n")
    print("— corpus written.")
    print(json.dumps(manifest["by_intent_primary"], ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
