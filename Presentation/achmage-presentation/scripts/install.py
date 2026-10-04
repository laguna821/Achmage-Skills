#!/usr/bin/env python3
"""Install the complete private-member bundle, without overwriting existing skills."""
import argparse,json,os,sys,tempfile,shutil
from pathlib import Path
sys.dont_write_bytecode=True
from presentation import ROOT,integrity,sha
ap=argparse.ArgumentParser(description=__doc__)
ap.add_argument("--agent",choices=["codex","claude","gemini"])
ap.add_argument("--dest",type=Path,help="Parent skills directory; exact package folder is appended")
a=ap.parse_args()
if not a.agent and not a.dest:ap.error("Choose --agent or explicit --dest")
base=integrity()
locations={"codex":Path(os.environ.get("CODEX_HOME",str(Path.home()/".codex")))/"skills","claude":Path.home()/".claude/skills","gemini":Path.home()/".gemini/skills"}
parent=(a.dest or locations[a.agent]).expanduser().resolve()
target=parent/"achmage-presentation"
if target.exists() or target.is_symlink():raise SystemExit("Existing installation untouched: "+str(target)+". Choose a fresh --dest or explicitly manage an upgrade.")
if target.is_relative_to(ROOT) or ROOT.is_relative_to(target):raise SystemExit("Installation must not contain or be inside the source package")
parent.mkdir(parents=True,exist_ok=True)
stage=Path(tempfile.mkdtemp(prefix=".achmage-presentation-install-",dir=parent)).resolve()
assert stage.parent==parent and stage.name.startswith(".achmage-presentation-install-")
lock=json.loads((ROOT/"bundle.lock.json").read_text(encoding="utf-8"))
try:
    for rel in [*lock["files"],"bundle.lock.json"]:
        src=ROOT/rel;dst=stage/rel
        dst.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(src,dst)
        if sha(src)!=sha(dst):raise RuntimeError("Copy verification failed: "+rel)
    # Keep partial staging on failure for diagnosis; never recursively delete caller paths.
    stage.rename(target)
except Exception:
    print("Installation did not finish; inspect owned staging: "+str(stage),file=sys.stderr)
    raise
print(json.dumps({**base,"status":"installed","path":str(target),"agent":a.agent,"modifiedGlobalInstructions":False},ensure_ascii=False))

