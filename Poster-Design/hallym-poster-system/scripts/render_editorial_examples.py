"""Render the four portable editorial fixtures outside the installed package."""
import argparse,json
from pathlib import Path
from editorial import run,ROOT
def main():
 p=argparse.ArgumentParser();p.add_argument('--out',type=Path,required=True);a=p.parse_args();base=a.out.resolve()
 if base==ROOT or ROOT in base.parents:p.error('Output must be outside the installed skill')
 examples=ROOT/'examples/editorial';reports=[]
 for name in ('methods-ko','methods-en','results-ko','results-en'):
  request=json.loads((examples/(name+'.json')).read_text(encoding='utf-8'))
  request.update(assetRoot=str(examples),outputDir=str(base/name))
  result=run(request);reports.append({'id':name,'result':result})
 (base/'manifest.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 print(json.dumps({'examples':len(reports),'out':str(base)}))
if __name__=='__main__':main()
