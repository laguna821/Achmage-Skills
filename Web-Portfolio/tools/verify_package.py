"""Verify the published skill and ZIP using Python's standard library."""
from pathlib import Path, PurePosixPath
import hashlib, json, zipfile

BASE = Path(__file__).resolve().parents[1]
ROOT = BASE / "achmage-portfolio-site"
REPO = BASE.parent

def digest(data):
    return hashlib.sha256(data).hexdigest()

def verify():
    manifest = json.loads((BASE / "PACKAGE-MANIFEST.json").read_text(encoding="utf-8"))
    expected = manifest["files"]
    actual = {p.relative_to(ROOT).as_posix(): digest(p.read_bytes())
              for p in ROOT.rglob("*") if p.is_file()}
    if any(p.is_symlink() for p in ROOT.rglob("*")):
        raise ValueError("Skill contains a symlink")
    if actual != expected:
        raise ValueError("Skill file set or hash differs from the release manifest")
    for name in expected:
        p = PurePosixPath(name)
        if p.is_absolute() or ".." in p.parts:
            raise ValueError("Unsafe manifest path")
    metadata = json.loads((BASE / "downloads/artifacts.json").read_text(encoding="utf-8"))
    archive = BASE / "downloads" / metadata["file"]
    if (archive.stat().st_size, digest(archive.read_bytes())) != (metadata["bytes"], metadata["sha256"]):
        raise ValueError("ZIP metadata differs")
    if (BASE / "downloads/SHA256SUMS").read_text(encoding="ascii").strip() != metadata["sha256"] + "  " + archive.name:
        raise ValueError("ZIP checksum differs")
    with zipfile.ZipFile(archive) as z:
        names = z.namelist()
        expected_names = {ROOT.name + "/" + name for name in expected}
        if len(names) != len(set(names)) or set(names) != expected_names:
            raise ValueError("ZIP file set differs")
        for name, sha in expected.items():
            if digest(z.read(ROOT.name + "/" + name)) != sha:
                raise ValueError("ZIP file hash differs: " + name)
    plugin = json.loads((BASE / ".claude-plugin/plugin.json").read_text(encoding="utf-8"))
    market = json.loads((REPO / ".claude-plugin/marketplace.json").read_text(encoding="utf-8"))
    entries = [p for p in market["plugins"] if p["name"] == ROOT.name]
    if len(entries) != 1:
        raise ValueError("Expected exactly one marketplace entry")
    entry = entries[0]
    if plugin["name"] != ROOT.name or plugin["skills"] != ["./" + ROOT.name]:
        raise ValueError("Plugin skill path differs")
    if entry["source"] != "./Web-Portfolio":
        raise ValueError("Marketplace source differs")
    if len({manifest["version"], metadata["version"], plugin["version"], entry["version"]}) != 1:
        raise ValueError("Package versions differ")
    return {"passed": True, "name": ROOT.name, "version": manifest["version"],
            "files": len(expected), "zipBytes": archive.stat().st_size, "sha256": metadata["sha256"]}

if __name__ == "__main__":
    print(json.dumps(verify(), ensure_ascii=False))
