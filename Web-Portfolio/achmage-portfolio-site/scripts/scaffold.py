"""Create a new portfolio project without installing packages or touching existing work."""
import argparse, json, shutil, os, sys
from pathlib import Path

EXCLUDED={'node_modules','dist','.build','.git','__pycache__','.env','.env.local'}

def scaffold(destination):
    source=Path(__file__).resolve().parents[1]/'assets'/'template'
    target=Path(destination).expanduser().resolve()
    if target==source or source in target.parents:
        raise ValueError('Destination must be outside the skill template.')
    if target.exists() and (not target.is_dir() or any(target.iterdir())):
        raise ValueError('Destination must be new or empty. Existing projects are never overwritten.')
    for parent, directories, files in os.walk(source):
        directories[:]=[name for name in directories if name not in EXCLUDED]
        for name in directories+files:
            if name not in EXCLUDED and (Path(parent)/name).is_symlink():
                raise ValueError('Template symlinks are not copied.')
    shutil.copytree(source,target,dirs_exist_ok=True,ignore=shutil.ignore_patterns(*EXCLUDED))
    return {'project':str(target),'sourceOnly':True,'next':['Edit content/portfolio.json and CONTENT-PLAN.md','npm ci --ignore-scripts --no-audit --no-fund','npm run check','npm run design:lint','npm run build']}

if __name__=='__main__':
    if hasattr(sys.stdout,'reconfigure'): sys.stdout.reconfigure(encoding='utf-8')
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dest',required=True)
    args=parser.parse_args()
    try: print(json.dumps(scaffold(args.dest),ensure_ascii=False))
    except ValueError as exc: parser.exit(2,str(exc)+'\n')
