#!/usr/bin/env python3
"""Build deterministic complete ZIP from the reviewed lock; no downloads."""
import argparse,json,sys,zipfile,hashlib
from pathlib import Path
sys.dont_write_bytecode=True
from presentation import ROOT,integrity
ap=argparse.ArgumentParser();ap.add_argument("--output",type=Path,required=True);a=ap.parse_args()
info=integrity();out=a.output.resolve()
if out.is_relative_to(ROOT):raise SystemExit("Write release artifacts outside the source package")
out.parent.mkdir(parents=True,exist_ok=True)
lock=json.loads((ROOT/"bundle.lock.json").read_text(encoding="utf-8"))
if lock.get("releaseStatus")!="approved":raise SystemExit("Release blocked: "+str(lock.get("releaseBlockers",["Unreviewed candidate"])))
with zipfile.ZipFile(out,"w",compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for rel in sorted([*lock["files"],"bundle.lock.json"]):
        zi=zipfile.ZipInfo("achmage-presentation/"+rel,(2026,10,4,0,0,0));zi.compress_type=zipfile.ZIP_DEFLATED;zi.external_attr=0o644<<16
        z.writestr(zi,(ROOT/rel).read_bytes())
digest=hashlib.sha256(out.read_bytes()).hexdigest()
out.with_suffix(out.suffix+".sha256").write_text(digest+"  "+out.name+"\n",encoding="utf-8")
print(json.dumps({**info,"status":"packaged","zip":str(out),"sha256":digest,"bytes":out.stat().st_size},ensure_ascii=False))
