"""Build and verify the standalone poster ZIP; no network or credentials."""
from pathlib import Path
import hashlib, json, sys, zipfile

BASE=Path(__file__).resolve().parents[1]
ROOT=BASE/'hallym-poster-system'
sys.path.insert(0,str(ROOT/'scripts'))
from verify_package import files, verify
VERSION='1.2.0-rc.5'
ZIP=BASE/'downloads'/f'hallym-poster-system-{VERSION}.zip'
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def write(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
def build():
    write(ROOT/'PACKAGE-MANIFEST.json',{'schemaVersion':1,'name':ROOT.name,'version':VERSION,'files':files()})
    ZIP.parent.mkdir(parents=True,exist_ok=True)
    with zipfile.ZipFile(ZIP,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
        for p in sorted(ROOT.rglob('*')):
            if not p.is_file() or '__pycache__' in p.parts or p.suffix=='.pyc':continue
            info=zipfile.ZipInfo(ROOT.name+'/'+p.relative_to(ROOT).as_posix(),(2026,10,9,0,0,0))
            info.compress_type=zipfile.ZIP_DEFLATED
            info.external_attr=0o100644<<16
            z.writestr(info,p.read_bytes(),compresslevel=9)
    (ZIP.parent/'SHA256SUMS').write_text(digest(ZIP)+'  '+ZIP.name+'\n',encoding='ascii',newline='\n')
    write(ZIP.parent/'artifacts.json',{'version':VERSION,'file':ZIP.name,'sha256':digest(ZIP),'bytes':ZIP.stat().st_size,'format':'ZIP; hallym-poster-system root directory','runtime':'Python 3.11; requirements.txt installed separately'})
def check():
    result=verify()
    manifest=json.loads((ROOT/'PACKAGE-MANIFEST.json').read_text(encoding='utf-8'))
    expected={ROOT.name+'/'+n:h for n,h in manifest['files'].items()}
    expected[ROOT.name+'/PACKAGE-MANIFEST.json']=digest(ROOT/'PACKAGE-MANIFEST.json')
    with zipfile.ZipFile(ZIP) as z:
        names=z.namelist()
        if len(names)!=len(set(names)) or set(names)!=set(expected):raise ValueError('ZIP file set mismatch')
        for n,h in expected.items():
            if hashlib.sha256(z.read(n)).hexdigest()!=h:raise ValueError('ZIP bytes mismatch: '+n)
    meta=json.loads((ZIP.parent/'artifacts.json').read_text(encoding='utf-8'))
    if (meta['sha256'],meta['bytes'])!=(digest(ZIP),ZIP.stat().st_size):raise ValueError('ZIP metadata mismatch')
    if (ZIP.parent/'SHA256SUMS').read_text().strip()!=digest(ZIP)+'  '+ZIP.name:raise ValueError('SHA256SUMS mismatch')
    print(json.dumps({**result,'zipFiles':len(expected),'bytes':ZIP.stat().st_size,'sha256':digest(ZIP)}))
if __name__=='__main__':
    if sys.argv[1:]==['--build']:build()
    elif sys.argv[1:]!=['--check']:raise SystemExit('Use --build or --check')
    check()

