"""Extract public content into inert semantic nodes; never imports executable source."""
import argparse, hashlib, json, re
from html.parser import HTMLParser
from pathlib import Path

VOID={'br','hr','img','meta','link','input','wbr','source','area','base','embed','param','track','col'}
class Tree(HTMLParser):
 def __init__(self):
  super().__init__(convert_charrefs=True);self.root={'tag':'root','attrs':{},'children':[]};self.stack=[self.root]
 def handle_starttag(self,t,a):
  n={'tag':t,'attrs':dict(a),'children':[]};self.stack[-1]['children'].append(n)
  if t not in VOID:self.stack.append(n)
 def handle_startendtag(self,t,a):
  self.stack[-1]['children'].append({'tag':t,'attrs':dict(a),'children':[]})
 def handle_endtag(self,t):
  for i in range(len(self.stack)-1,0,-1):
   if self.stack[i]['tag']==t:self.stack=self.stack[:i];break
 def handle_data(self,s):self.stack[-1]['children'].append(s)
def walk(n):
 if isinstance(n,dict):
  yield n
  for c in n['children']:yield from walk(c)
def text_of(n):return n if isinstance(n,str) else ''.join(text_of(c) if not (isinstance(c,dict) and c['tag']=='br') else '\n' for c in n['children'])
HTML_TAGS={'p','h1','h2','h3','div','span','ul','ol','li','b','strong','em','i','br','blockquote','cite','table','caption','thead','tbody','tr','th','td','pre','code','a','button'}
SVG_TAGS={'svg','g','rect','path','text','tspan','line','polyline','polygon','circle','defs','marker','title','desc'}
SVG_ATTRS={'viewbox','x','y','x1','y1','x2','y2','width','height','d','rx','ry','r','cx','cy','points','fill','stroke','stroke-width','stroke-dasharray','text-anchor','dominant-baseline','marker-end','marker-start','markerwidth','markerheight','refx','refy','orient','shape-rendering','id','font-family','font-size','font-weight','letter-spacing'}
def semantic(n):
 if isinstance(n,str):return n
 t,a=n['tag'],n['attrs']
 if t not in HTML_TAGS|SVG_TAGS:raise ValueError('Unsupported public content tag '+t)
 out={'type':t,'roles':a.get('class','').split(),'children':[semantic(c) for c in n['children']]}
 for k,v in a.items():
  if k=='data-step':out['reveal']=True
  elif k=='data-i18n':out['key']=v
  elif k=='data-i18n-attr':out['translationAttrs']=dict(pair.split('=',1) for pair in v.split(';'))
  elif k=='href':
   if not v.startswith(('https://','http://','obsidian://','#')):raise ValueError('Blocked content link')
   out['url']=v
  elif k in {'title','aria-label','role'}:out[k]=v
  elif k in {'data-view','data-delegate','data-keep','data-i18n-delegate','data-i18n-keep'}:out[k[5:]]=v
  elif t in SVG_TAGS and k in SVG_ATTRS:
   if ('url(' in (v or '') and not re.fullmatch(r'url\(#[\w-]+\)',v)):raise ValueError('External SVG reference')
   out.setdefault('geometry',{})[k]=v
  elif k=='style':
   m=re.fullmatch(r'\s*--w:\s*([\d.]+)\s*;?\s*',v)
   if m:out['value']=float(m[1])
   elif v:out['sourceStyleOmitted']=v
 return out
def convert(source):
 raw=source.read_bytes();p=Tree();p.feed(raw.decode('utf-8'))
 nodes=list(walk(p.root));slides=[n for n in nodes if n['tag']=='section' and 'slide' in n['attrs'].get('class','').split()]
 dictionary=next(n for n in nodes if n['tag']=='script' and n['attrs'].get('id')=='deck-i18n-dict')
 langs=json.loads(text_of(dictionary))
 data={'schemaVersion':2,'title':'같은 AI, 다른 연구 · Hallym 보존 검증 세트','audience':'기조강연 청중 및 발표 엔진 검토자','purpose':'원본 공개 39장의 구조와 의미를 보존한 브랜드·동작 검증','theme':'light','aspect':'16x9','contentPolicy':'reference-unchanged','reference':{'url':'https://labs.cmdspace.work/hallym-0921/deck/','sha256':hashlib.sha256(raw).hexdigest(),'privateNotes':'excluded','executableSource':'excluded'},'translations':langs,'slides':[]}
 coverage=[]
 for i,s in enumerate(slides):
  a=s['attrs'];sid=a['id'];parts=[semantic(c) for c in s['children'] if not isinstance(c,str) or c.strip()]
  slide={'id':sid,'kind':a.get('data-kind','statement'),'title':a.get('data-title',sid),'section':a.get('data-section',''),'sectionName':a.get('data-section-name',''),'source':a.get('data-source',''),'nodes':parts}
  # Explicit semantic variants replace source selectors tied to slide numbers.
  if sid=='s17':slide['variant']='emphatic-statement'
  if sid=='s22':slide['variant']='long-statement'
  if sid=='s16':slide['variant']='compact-section'
  if sid in {'s06','s27','s33'}:slide['gridColumns']=4;slide['spaceIntent']='source 3-of-4 rhythm preserved'
  if any(n['attrs'].get('data-i18n')==sid+'.kicker' for n in walk(s)):slide['hasMast']=True
  data['slides'].append(slide)
  coverage.append({'sourceSlide':sid,'sourceKind':slide['kind'],'component':slide['kind'],'revealCount':sum('data-step' in n['attrs'] for n in walk(s)),'keys':[n['attrs']['data-i18n'] for n in walk(s) if 'data-i18n' in n['attrs']],'elements':sorted({c for n in walk(s) for c in n['attrs'].get('class','').split()}),'invariants':['content-order','type-hierarchy','shared-edges','segmented-footer','public-source-attribution','reveal-sequence']+(['paired-four-column-relation'] if slide['kind']=='toggle' else [])})
 hints_path=Path(__file__).with_name('reference-layout-hints.json')
 if hints_path.is_file():
  hints=json.loads(hints_path.read_text(encoding='utf-8'))
  if hints['sourceSha256']==data['reference']['sha256']:data['layoutHints']=hints['layoutHints']
 return data,coverage
def main():
 ap=argparse.ArgumentParser();ap.add_argument('source',type=Path);ap.add_argument('--output',type=Path,required=True);a=ap.parse_args();d,c=convert(a.source);a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf-8');a.output.with_name('reference-coverage.json').write_text(json.dumps({'source':d['reference'],'slides':c,'totalReveals':sum(x['revealCount'] for x in c)},ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps({'slides':len(c),'reveals':sum(x['revealCount'] for x in c),'kinds':sorted({s['kind'] for s in d['slides']})},ensure_ascii=False))
if __name__=='__main__':main()
