#!/usr/bin/env python3
"""fetch_sources.py — component-consulting-v3 corpus fetcher (airlock stage).

Downloads the four vendorable sources into the airlock (NEVER into the
Dropbox vault), pinned to exact commits / snapshot dates, and records a
fetch manifest. Per external-ingest-security "Vendored Component Corpus
Exception": fetch is airlock-only, nothing is executed or installed.

Sources:
  uiverse   github.com/uiverse-io/galaxy      (MIT, tarball @ pinned commit)
  tailark   github.com/tailark/blocks         (MIT, tarball @ pinned commit)
  smoothui  smoothui.dev/r/registry.json      (MIT, inline content registry)
  magicui   magicui.design/r/registry.json    (MIT, index + per-item JSON)

Usage:
  python fetch_sources.py [--airlock DIR] [--skip-existing]
"""
import argparse
import concurrent.futures
import hashlib
import io
import json
import sys
import tarfile
import time
import urllib.request
from datetime import date
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

DEFAULT_AIRLOCK = Path.home() / "AppData/Local/hermes/achmage-airlock/component-corpus-v3"

PINS = {
    "uiverse": {
        "repo": "uiverse-io/galaxy",
        "commit": "adbd2adde0a299a3956ea288fb444ec01891ca41",
        "license": "MIT",
    },
    "tailark": {
        "repo": "tailark/blocks",
        "commit": "8139698115c1341bfd2e3e286c04bb4d8146f472",
        "license": "MIT",
    },
    "smoothui": {
        "registry": "https://smoothui.dev/r/registry.json",
        "license_url": "https://raw.githubusercontent.com/educlopez/smoothui/main/LICENSE",
        "license": "MIT",
    },
    "magicui": {
        "registry": "https://magicui.design/r/registry.json",
        "item_url": "https://magicui.design/r/{name}.json",
        "license_urls": [
            "https://raw.githubusercontent.com/magicuidesign/magicui/main/LICENSE",
            "https://raw.githubusercontent.com/magicuidesign/magicui/main/LICENSE.md",
        ],
        "license": "MIT",
    },
}

UA = {"User-Agent": "AchmageOS-corpus-fetch/1.0 (component-consulting-v3; airlock stage)"}


def http_get(url: str, retries: int = 3, timeout: int = 60) -> bytes:
    last = None
    for i in range(retries):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read()
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(1.5 * (i + 1))
    raise RuntimeError(f"GET failed after {retries}: {url} ({last})")


def sha256(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()


def fetch_tarball(name: str, repo: str, commit: str, dest: Path, skip: bool) -> dict:
    out_dir = dest / name
    marker = out_dir / ".fetched"
    if skip and marker.exists():
        print(f"  [{name}] skip (already fetched)")
        return json.loads(marker.read_text(encoding="utf-8"))
    url = f"https://codeload.github.com/{repo}/tar.gz/{commit}"
    print(f"  [{name}] tarball {url}")
    blob = http_get(url, timeout=300)
    digest = sha256(blob)
    out_dir.mkdir(parents=True, exist_ok=True)
    # SAFE extraction: reject absolute paths / traversal; extract as inert text only.
    with tarfile.open(fileobj=io.BytesIO(blob), mode="r:gz") as tf:
        for m in tf.getmembers():
            p = Path(m.name)
            if p.is_absolute() or ".." in p.parts:
                raise RuntimeError(f"unsafe tar member: {m.name}")
        tf.extractall(out_dir, filter="data")
    info = {
        "source": name, "repo": repo, "commit": commit,
        "tarball_sha256": digest, "retrieved_at": date.today().isoformat(),
        "bytes": len(blob),
    }
    marker.write_text(json.dumps(info, indent=2), encoding="utf-8")
    print(f"  [{name}] {len(blob):,} bytes  sha256={digest[:16]}…")
    return info


def fetch_smoothui(dest: Path, skip: bool) -> dict:
    out = dest / "smoothui"
    marker = out / ".fetched"
    if skip and marker.exists():
        print("  [smoothui] skip (already fetched)")
        return json.loads(marker.read_text(encoding="utf-8"))
    out.mkdir(parents=True, exist_ok=True)
    reg = http_get(PINS["smoothui"]["registry"])
    (out / "registry.json").write_bytes(reg)
    lic = http_get(PINS["smoothui"]["license_url"])
    (out / "LICENSE").write_bytes(lic)
    info = {
        "source": "smoothui", "registry_url": PINS["smoothui"]["registry"],
        "registry_sha256": sha256(reg), "retrieved_at": date.today().isoformat(),
        "bytes": len(reg),
    }
    marker.write_text(json.dumps(info, indent=2), encoding="utf-8")
    print(f"  [smoothui] registry {len(reg):,} bytes + LICENSE")
    return info


def fetch_magicui(dest: Path, skip: bool) -> dict:
    out = dest / "magicui"
    marker = out / ".fetched"
    if skip and marker.exists():
        print("  [magicui] skip (already fetched)")
        return json.loads(marker.read_text(encoding="utf-8"))
    (out / "items").mkdir(parents=True, exist_ok=True)
    reg_b = http_get(PINS["magicui"]["registry"])
    (out / "registry.json").write_bytes(reg_b)
    reg = json.loads(reg_b.decode("utf-8"))
    names = [i["name"] for i in reg["items"]
             if i.get("type") == "registry:ui"]
    print(f"  [magicui] {len(names)} registry:ui items → per-item fetch")
    failed = []

    def one(n: str):
        try:
            b = http_get(PINS["magicui"]["item_url"].format(name=n))
            (out / "items" / f"{n}.json").write_bytes(b)
            return n, len(b)
        except Exception as e:  # noqa: BLE001
            failed.append((n, str(e)))
            return n, -1

    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
        list(ex.map(one, names))
    lic = None
    for u in PINS["magicui"]["license_urls"]:
        try:
            lic = http_get(u)
            break
        except Exception:  # noqa: BLE001
            continue
    if lic:
        (out / "LICENSE").write_bytes(lic)
    info = {
        "source": "magicui", "registry_url": PINS["magicui"]["registry"],
        "registry_sha256": sha256(reg_b), "retrieved_at": date.today().isoformat(),
        "items_fetched": len(names) - len(failed), "items_failed": failed,
        "license_fetched": bool(lic),
    }
    marker.write_text(json.dumps(info, indent=2), encoding="utf-8")
    print(f"  [magicui] fetched {info['items_fetched']}/{len(names)}"
          + (f"  FAILED: {failed}" if failed else ""))
    return info


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--airlock", default=str(DEFAULT_AIRLOCK))
    ap.add_argument("--skip-existing", action="store_true")
    args = ap.parse_args()
    dest = Path(args.airlock)
    dest.mkdir(parents=True, exist_ok=True)
    print(f"airlock: {dest}")

    manifest = {"fetched_at": date.today().isoformat(), "sources": {}}
    manifest["sources"]["uiverse"] = fetch_tarball(
        "uiverse", PINS["uiverse"]["repo"], PINS["uiverse"]["commit"], dest, args.skip_existing)
    manifest["sources"]["tailark"] = fetch_tarball(
        "tailark", PINS["tailark"]["repo"], PINS["tailark"]["commit"], dest, args.skip_existing)
    manifest["sources"]["smoothui"] = fetch_smoothui(dest, args.skip_existing)
    manifest["sources"]["magicui"] = fetch_magicui(dest, args.skip_existing)

    (dest / "fetch-manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    print("fetch-manifest.json written. Nothing was executed or installed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
