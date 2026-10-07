#!/usr/bin/env python3
"""Reuse Node >=20, with a prepared runtime fallback. Setup is explicit."""
import json, os, platform, subprocess, sys, shutil
from pathlib import Path
root = Path(__file__).resolve().parent.parent
key = {"Windows": "win32", "Linux": "linux", "Darwin": "darwin"}.get(platform.system(), "unknown")
arch = {"AMD64": "x64", "x86_64": "x64", "arm64": "arm64", "aarch64": "arm64"}.get(platform.machine(), platform.machine())
node = None
prepared = Path.home()/'.kordoc-workbench'/'runtimes'/'v22.23.3'/('node-v22.23.3-'+('win' if key=='win32' else key)+'-'+arch)/('node.exe' if key=='win32' else 'bin/node')
for candidate in [os.environ.get('KORDOC_NODE'), shutil.which('node'), str(prepared), str(root/'runtime'/(key+'-'+arch)/('node.exe' if key=='win32' else 'bin/node'))]:
    if not candidate: continue
    try:
        version=subprocess.check_output([candidate,'-p','process.versions.node'],text=True).strip()
        if int(version.split('.')[0])>=20: node=Path(candidate); break
    except (OSError, ValueError, subprocess.CalledProcessError): pass
if node is None:
    print(json.dumps({"schemaVersion": 1, "status": "failed", "success": False, "files": [], "warnings": [], "skipped": {"edits": [], "fields": []}, "failure": {"code": "RUNTIME_UNAVAILABLE", "message": "Node >=20 required. Run setup.ps1 (Windows) or setup.sh (macOS/Linux)."}}))
    sys.exit(1)
args = [str(node), str(root / "scripts/run.mjs")] + sys.argv[1:]
try:
    result = subprocess.run(args, capture_output=True, env={**os.environ, "ORT_DISABLE_TELEMETRY": "1", "PATH":str(node.parent)+os.pathsep+os.environ.get('PATH','')})
    if result.stderr:
        sys.stderr.buffer.write(result.stderr)
    try:
        payload = json.loads(result.stdout)
        if not isinstance(payload, dict): raise ValueError("JSON object required")
    except (ValueError, UnicodeDecodeError):
        error = result.stderr.decode("utf-8", errors="replace")[:8192]
        code = "MISSING_DEPENDENCY" if "MODULE_NOT_FOUND" in error or "ERR_DLOPEN_FAILED" in error else "RUNTIME_EXECUTION_FAILED"
        payload = {"schemaVersion": 1, "status": "failed", "success": False, "files": [], "warnings": [], "skipped": {"edits": [], "fields": []}, "failure": {"code": code, "message": error or "Runtime did not return a JSON object"}}
        print(json.dumps(payload))
        sys.exit(1)
    sys.stdout.buffer.write(result.stdout)
    sys.exit(result.returncode)
except OSError as error:
    print(json.dumps({"schemaVersion": 1, "status": "failed", "success": False, "files": [], "warnings": [], "skipped": {"edits": [], "fields": []}, "failure": {"code": "RUNTIME_UNAVAILABLE", "message": str(error)}}))
    sys.exit(1)
