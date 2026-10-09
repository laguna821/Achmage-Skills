"""Verify installed release bytes with the Python standard library."""
from pathlib import Path
import hashlib, json, sys

ROOT = Path(__file__).resolve().parents[1]
def files(root=ROOT):
    result = {}
    for p in sorted(root.rglob('*')):
        if '__pycache__' in p.parts or p.suffix == '.pyc':
            continue
        if p.is_symlink():
            raise ValueError('Unexpected symlink: '+str(p))
        if p.is_file() and p.name != 'PACKAGE-MANIFEST.json':
            result[p.relative_to(root).as_posix()] = hashlib.sha256(p.read_bytes()).hexdigest()
    return result

def verify(root=ROOT):
    expected = json.loads((root/'PACKAGE-MANIFEST.json').read_text(encoding='utf-8'))['files']
    actual = files(root)
    changed = sorted(k for k in expected.keys() & actual.keys() if expected[k] != actual[k])
    missing = sorted(expected.keys() - actual.keys())
    extra = sorted(actual.keys() - expected.keys())
    if changed or missing or extra:
        raise ValueError(json.dumps(dict(changed=changed, missing=missing, extra=extra), ensure_ascii=False))
    return {'status':'verified','files':len(actual),'version':'1.2.0-rc.5'}

if __name__ == '__main__':
    try:
        print(json.dumps(verify(),ensure_ascii=False))
    except (ValueError, OSError) as exc:
        print(str(exc), file=sys.stderr);sys.exit(1)

