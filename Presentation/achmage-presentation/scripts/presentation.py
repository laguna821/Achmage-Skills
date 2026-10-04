#!/usr/bin/env python3
"""Portable entrypoint. No Achmage imports, personal paths or hidden installation."""
import argparse, hashlib, importlib.metadata, json, os, shutil, subprocess, sys
from pathlib import Path
sys.dont_write_bytecode=True
for stream in (sys.stdout,sys.stderr):
    if hasattr(stream,"reconfigure"):stream.reconfigure(encoding="utf-8",errors="replace")
ROOT=Path(__file__).resolve().parents[1]
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def read(p): return json.loads(p.read_text(encoding="utf-8"))
def emit(data,path=None):
    text=json.dumps(data,ensure_ascii=False,indent=2)+"\n"
    if path:
        path=Path(path).resolve()
        if path.is_relative_to(ROOT):raise ValueError("Keep reports outside the installed package")
        path.parent.mkdir(parents=True,exist_ok=True);path.write_text(text,encoding="utf-8")
    print(text)
def contained(rel):
    p=(ROOT/rel).resolve()
    if not p.is_relative_to(ROOT) or not p.is_file():raise ValueError("Missing or unsafe package path: "+rel)
    return p
def integrity():
    lock=read(ROOT/"bundle.lock.json")
    if lock.get("version")!="1.0.0":raise ValueError("Unsupported bundle lock")
    expected={"component-consulting-v3","consulting-pptx-skill","hallym-ppt-system","frontend-design-impeccable","ui-ux-pro-max","render-audit"}
    if set(lock.get("members",{}))!=expected:raise ValueError("Incomplete six-member set")
    for rel,digest in lock["files"].items():
        if sha(contained(rel))!=digest:raise ValueError("Changed package file: "+rel)
    actual={p.relative_to(ROOT).as_posix() for p in ROOT.rglob("*") if p.is_file() and not any(x in {"__pycache__","node_modules",".git"} for x in p.relative_to(ROOT).parts) and p.name!="bundle.lock.json"}
    if actual!=set(lock["files"]):raise ValueError("Package inventory differs from lock: "+str(sorted(actual^set(lock["files"]))[:10]))
    engine=read(ROOT/"engine.lock.json")
    canonical=json.dumps(engine["files"],ensure_ascii=False,sort_keys=True,indent=2)+"\n"
    if hashlib.sha256(canonical.encode()).hexdigest()!=engine["packageSha256"]:raise ValueError("Engine manifest mismatch")
    for rel,digest in engine["files"].items():
        if sha(contained("engine/"+rel))!=digest:raise ValueError("Unreviewed engine change: "+rel)
    return {"bundleVersion":lock["version"],"releaseStatus":lock.get("releaseStatus","unreviewed"),"releaseBlockers":lock.get("releaseBlockers",[]),"bundleLockSha256":sha(ROOT/"bundle.lock.json"),"engineSha256":engine["packageSha256"],"memberCount":len(expected),"filesChecked":len(lock["files"])}
def run(args):
    p=subprocess.run([str(x) for x in args],env={**os.environ,"PYTHONDONTWRITEBYTECODE":"1"},capture_output=True,text=True,encoding="utf-8",errors="replace")
    if p.returncode:raise RuntimeError(p.stdout+p.stderr)
    return p.stdout
def node():
    path=shutil.which("node")
    if not path:raise RuntimeError("Node20+ required; no automatic installation performed")
    major=int(run([path,"--version"]).strip().lstrip("v").split(".")[0])
    if major<20:raise RuntimeError("Node20+ required")
    return path
def converter(explicit):
    path=explicit or os.environ.get("ACHMAGE_PRESENTATION_PDF")
    if path:return [path]
    try: importlib.metadata.version("weasyprint")
    except importlib.metadata.PackageNotFoundError:
        path=shutil.which("weasyprint")
        if path:return [path]
        raise RuntimeError("Install requirements.txt and WeasyPrint platform dependencies, or pass --converter")
    return [sys.executable,"-B","-m","weasyprint"]
def main():
    ap=argparse.ArgumentParser(description=__doc__);sub=ap.add_subparsers(dest="command",required=True)
    d=sub.add_parser("doctor");d.add_argument("--report");d.add_argument("--converter")
    r=sub.add_parser("render");r.add_argument("spec",type=Path);r.add_argument("--output",type=Path,required=True);r.add_argument("--theme",choices=["light","dark"]);r.add_argument("--aspect",choices=["16x9","16x10"])
    e=sub.add_parser("export-pdf");e.add_argument("html",type=Path);e.add_argument("--output",type=Path,required=True);e.add_argument("--converter")
    v=sub.add_parser("verify");v.add_argument("--observations",type=Path,required=True);v.add_argument("--sources",type=Path);v.add_argument("--slide-count",type=int,required=True);v.add_argument("--languages",default="ko");v.add_argument("--html",type=Path,nargs="+",required=True);v.add_argument("--report",type=Path)
    a=ap.parse_args();base=integrity()
    if sys.version_info<(3,11):raise RuntimeError("Python3.11+ required")
    if a.command=="doctor":
        checks={"python":sys.version.split()[0],"node":None,"pillow":None,"pdf":None};missing=[]
        try:checks["node"]=run([node(),"--version"]).strip()
        except Exception as ex:missing.append(str(ex))
        try:
            checks["pillow"]=importlib.metadata.version("pillow")
            from PIL import ImageFont
            font=ImageFont.truetype(str(ROOT/"engine/fonts/PretendardVariable.woff2"),48);font.set_variation_by_axes([800]);font.getlength("한글")
        except Exception as ex:missing.append("Pillow/font support: "+str(ex))
        pdfcmd=None
        try:
            pdfcmd=converter(a.converter);version=run(pdfcmd+["--version"]).strip()
            checks["pdf"]={"command":pdfcmd,"version":version,"status":"available" if version.endswith("70.0") else "unsupported-version"}
        except Exception as ex:checks["pdf"]={"command":pdfcmd,"status":"unavailable","diagnostic":str(ex)}
        emit({**base,"status":"ready-for-html" if not missing else "incomplete","checks":checks,"missing":missing,"notReviewed":["browser capture capability","PDF output","physical iPhone","independent reviewer availability"]},a.report)
        return 0 if not missing else 2
    if a.command=="render":
        spec=a.spec.resolve();out=a.output.resolve()
        if out.is_relative_to(ROOT):raise ValueError("Keep outputs outside the installed package")
        if spec==out or spec==out.with_suffix(".render.json"):raise ValueError("Render cannot overwrite source JSON")
        out.parent.mkdir(parents=True,exist_ok=True)
        args=[sys.executable,"-B",ROOT/"engine/render.py",spec,"--output",out]
        if a.theme:args+=["--theme",a.theme]
        if a.aspect:args+=["--aspect",a.aspect]
        run(args);struct=json.loads(run([node(),ROOT/"engine/qa.cjs",out]))
        emit({**base,"status":"draft-rendered","inputSha256":sha(spec),"html":str(out),"htmlSha256":sha(out),"structural":struct,"notReviewed":["browser geometry","visual review","content review","PDF"]},out.with_suffix(".render.json"))
    elif a.command=="export-pdf":
        source=a.html.resolve();out=a.output.resolve()
        if out.is_relative_to(ROOT):raise ValueError("Keep outputs outside the installed package")
        if source in (out,out.with_suffix(".pdf.json")):raise ValueError("PDF or its receipt cannot overwrite HTML")
        # Current static renderer uses a pinned converter, no webpage script execution.
        cmd=converter(a.converter);version=run(cmd+["--version"]).strip()
        if not version.endswith("70.0"):raise ValueError("Reference PDF converter must be WeasyPrint70.0; other backends need separate validation")
        out.parent.mkdir(parents=True,exist_ok=True);run(cmd+[source,out])
        if not out.read_bytes().startswith(b"%PDF"):raise ValueError("Converter did not produce PDF")
        emit({**base,"status":"pdf-exported-unreviewed","inputSha256":sha(source),"pdfSha256":sha(out),"converter":version,"converterCommand":cmd,"notReviewed":["every-page visual and semantic inspection"]},out.with_suffix(".pdf.json"))
    else:
        bind=a.sources or a.observations.with_suffix(".sources.json")
        if a.report and a.report.resolve() in {p.resolve() for p in [bind,a.observations,*a.html]}:raise ValueError("Verification report cannot overwrite input evidence")
        meta=read(bind)
        if meta.get("errors"):raise ValueError("Capture recorded browser errors")
        if meta.get("observationsSha256")!=sha(a.observations):raise ValueError("Observation file is not bound to the capture sources")
        if meta.get("engineSha256")!=base["engineSha256"]:raise ValueError("Observation engine mismatch")
        expected={p.resolve().name:sha(p.resolve()) for p in a.html}
        if len(expected)!=len(a.html):raise ValueError("HTML filenames must be distinct")
        if meta.get("html")!=expected:raise ValueError("Observation inputs changed or incomplete")
        rows=read(a.observations)
        if not isinstance(rows,list) or not rows:raise ValueError("Empty observations")
        structural=json.loads(run([node(),ROOT/"engine/qa.cjs",*a.html]))
        geometry=json.loads(run([node(),ROOT/"engine/adapters/check_mobile_matrix.js",a.observations,str(a.slide_count),a.languages]))
        emit({**base,"status":"geometry-pass","observationsSha256":sha(a.observations),"inputs":expected,"structural":structural,"geometry":geometry,"notReviewed":["semantic/content correctness","every-slide visual judgment","PDF","physical iPhone","independent execution authenticity"]},a.report)
    return 0
if __name__=="__main__":
    try:sys.exit(main())
    except Exception as ex:
        print(json.dumps({"status":"error","message":str(ex)},ensure_ascii=False),file=sys.stderr);sys.exit(1)
