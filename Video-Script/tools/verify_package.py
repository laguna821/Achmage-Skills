"""Check that the skill folder, PACKAGE-MANIFEST.json and the install ZIP agree.

Usage: python tools/verify_package.py   (run from Video-Script/ or anywhere)
Exit code 0 when every file and hash matches, 1 otherwise. Standard library only.
"""
import hashlib
import json
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NAME = "achmage-video-script"
SKILL = ROOT / NAME
MANIFEST = ROOT / "PACKAGE-MANIFEST.json"
SUMS = ROOT / "downloads" / "SHA256SUMS"
IGNORED = {"__pycache__"}


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def main():
    problems = []
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    expected = manifest["files"]

    found = {}
    for path in sorted(SKILL.rglob("*")):
        rel = path.relative_to(SKILL)
        if path.is_file() and not (set(rel.parts) & IGNORED):
            found[rel.as_posix()] = sha256(path.read_bytes())
    for name in sorted(set(expected) | set(found)):
        if name not in found:
            problems.append(f"missing in folder: {name}")
        elif name not in expected:
            problems.append(f"not in manifest: {name}")
        elif found[name] != expected[name]:
            problems.append(f"hash differs: {name}")

    zip_name = f"{NAME}-{manifest['version']}.zip"
    zip_path = ROOT / "downloads" / zip_name
    sums = dict(line.split()[::-1] for line in SUMS.read_text(encoding="utf-8").splitlines() if line.strip())
    if sums.get(zip_name) != sha256(zip_path.read_bytes()):
        problems.append(f"SHA256SUMS does not match {zip_name}")
    entries = {}
    with zipfile.ZipFile(zip_path) as archive:
        for info in archive.infolist():
            if info.is_dir():
                continue
            name = info.filename
            if not name.startswith(NAME + "/"):
                problems.append(f"zip entry outside {NAME}/: {name}")
                continue
            entries[name[len(NAME) + 1:]] = sha256(archive.read(info))
    for name in sorted(set(expected) | set(entries)):
        if name not in entries:
            problems.append(f"missing in zip: {name}")
        elif name not in expected:
            problems.append(f"zip has extra file: {name}")
        elif entries[name] != expected[name]:
            problems.append(f"zip hash differs: {name}")

    for line in problems:
        print(line)
    print(f"{len(expected)} files in manifest, {len(found)} in folder, {len(entries)} in zip, {len(problems)} problems")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())