"""Owned, offline presentation renderer. Public content AST in; static editable HTML out.

No source executable code is imported. schemaVersion=1 inputs remain accepted.
"""
import argparse, base64, copy, html, json, math, re
from pathlib import Path
from adapters.extract_reference import HTML_TAGS, SVG_TAGS, SVG_ATTRS

ROOT=Path(__file__).resolve().parent
TITLE_SIZES={'cover':230,'section':380,'divider':380,'ladder':130,'steps':150,'cards':150,'grid':150,'terminal':150,'table':110,'bars':110,'diagram':160,'toggle':170,'outro':180,'closing':180}
KINDS={'cover','divider','section','statement','quote','compare','ladder','table','diagram','cards','grid','stats','metrics','bars','steps','timeline','terminal','toggle','closing','outro','image'}
ROLES=set('headline kicker lead foot foot-note foot-src body-list steps step step-no step-title step-text hi ladder grid cols-3 cols-4 cards cell cell-no cell-title cell-text links stats stat num unit label tbl compare-tbl quote diagram dg-layer dg-arrow dg-loop dg-t dg-s dg-v compare col a b terminal prompt ok dim bars bar bar-label bar-track bar-val toggle toggle-ctl toggle-grid tg tg-a tg-b tg-desc tg-desc-a tg-desc-b toggle-verdict sub src src-paper src-post src-repo src-service src-standard src-talk src-vault src-wiki web qr image evidence timeline chart-data'.split())
def esc(x):return html.escape(str(x),quote=True)
def check_text(x,name,maximum=16000):
 if not isinstance(x,str) or len(x)>maximum:raise ValueError(name+' must be text <= '+str(maximum))
 return x
def node(t,roles=(),children=(),**kw):return {'type':t,'roles':list(roles),'children':list(children),**kw}
def text(n):return n if isinstance(n,str) else ''.join(text(c) for c in n.get('children',[]))
def walk(n):
 if isinstance(n,dict):
  yield n
  for c in n.get('children',[]):yield from walk(c)
def safe_url(url):
 check_text(url,'url',8000)
 if not url.startswith(('https://','http://','obsidian://','#')):raise ValueError('Unsafe URL')
 return url
def serial(data):return json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c').replace('>','\\u003e').replace('&','\\u0026')

def word_markup(value):
 parts=[]
 for word in re.split(r'(\s+)',check_text(value,'text')):
  if not word:continue
  if word.isspace():parts.append(esc(word));continue
  url=bool(re.match(r'^(?:https?://|(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}(?:/|$))',word))
  parts.append('<span class="word'+(' word-url' if url else '')+'">'+esc(word)+'</span>')
 return ''.join(parts)

def scope_svg_ids(svg,prefix):
 ids={item['geometry']['id']:prefix+item['geometry']['id'] for item in walk(svg) if item.get('geometry',{}).get('id')}
 for item in walk(svg):
  geometry=item.get('geometry',{})
  for key,value in list(geometry.items()):
   if key=='id':geometry[key]=ids[value]
   elif value.startswith('url(#') and value.endswith(')') and value[5:-1] in ids:geometry[key]='url(#'+ids[value[5:-1]]+')'
def fit_diagram_projection(n, flow, depth):
 """Project only a verified left-to-right node chain; preserve explicit return endpoints."""
 groups=[c for c in n.get('children',[]) if isinstance(c,dict)]
 if any(any(k.startswith('marker-') for k in item.get('geometry',{})) for item in walk(n)):return None
 if any(c.get('type')!='g' for c in groups):return None
 chain=[c for c in groups if 'dg-loop' not in c.get('roles',[])]
 if not chain or len(chain)%2!=1:return None
 layers=chain[::2];arrows=chain[1::2]
 if any('dg-layer' not in c.get('roles',[]) for c in layers) or any('dg-arrow' not in c.get('roles',[]) for c in arrows):return None
 boxes=[];titles=[]
 for layer in layers:
  rects=[c for c in layer.get('children',[]) if isinstance(c,dict) and c.get('type')=='rect']
  title=next((c for c in layer.get('children',[]) if isinstance(c,dict) and 'dg-t' in c.get('roles',[])),None)
  if len(rects)!=1 or title is None:return None
  if any(not isinstance(c,dict) or c.get('type') not in {'rect','text'} for c in layer.get('children',[])):return None
  g=rects[0].get('geometry',{})
  try:boxes.append(tuple(float(g[k]) for k in ('x','y','width','height')))
  except (KeyError,ValueError,TypeError):return None
  titles.append(title)
 directions=[]
 for i,arrow in enumerate(arrows):
  if any(not isinstance(c,dict) or c.get('type') not in {'path','text'} for c in arrow.get('children',[])):return None
  paths=[c for c in arrow.get('children',[]) if isinstance(c,dict) and c.get('type')=='path']
  if len(paths)!=1:return None
  m=re.fullmatch(r'M([\d.]+) ([\d.]+) H([\d.]+)(?: M([\d.]+) ([\d.]+) L([\d.]+) ([\d.]+) L([\d.]+) ([\d.]+))?',paths[0].get('geometry',{}).get('d',''))
  if not m:return None
  x,y,end=map(float,m.groups()[:3]);a,b=boxes[i],boxes[i+1]
  directions.append('none' if m.group(4) is None else 'forward')
  if m.group(4) is not None:
   hx,hy,tx,ty,bx,by=map(float,m.groups()[3:])
   if not (abs(tx-end)<.01 and abs(ty-y)<.01 and hx<end and bx<end and hy<y<by):return None
  if any(k.startswith('marker-') for k in paths[0].get('geometry',{})):return None
  if not (abs(x-a[0]-a[2])<=24 and abs(end-b[0])<=24 and a[1]<=y<=a[1]+a[3] and b[1]<=y<=b[1]+b[3] and end>x):return None
 extra=[]
 for loop in [c for c in groups if 'dg-loop' in c.get('roles',[])]:
  if any(not isinstance(c,dict) or c.get('type') not in {'path','text'} for c in loop.get('children',[])):return None
  pairs=[]
  for path in [c for c in loop.get('children',[]) if isinstance(c,dict) and c.get('type')=='path']:
   m=re.fullmatch(r'M([\d.]+) ([\d.]+) V([\d.]+) H([\d.]+) V([\d.]+)',path.get('geometry',{}).get('d',''))
   if not m:return None
   sx,sy,cy,ex,ey=map(float,m.groups())
   ends=[]
   for x,y in [(sx,sy),(ex,ey)]:
    match=[i for i,b in enumerate(boxes) if abs(x-(b[0]+b[2]/2))<2 and 0<=y-(b[1]+b[3])<=24]
    if len(match)!=1:return None
    ends.append(match[0])
   if cy<=max(sy,ey):return None
   pair=[]
   for index in ends:
    label=copy.deepcopy(titles[index]);label['type']='span';label['roles']=[];label.pop('geometry',None);label.pop('reveal',None)
    pair.append(render_node(label,depth+1))
   pairs.append(' — '.join(pair))
  if not pairs:return None
  extra.append('<li class="diagram-fit-rel" aria-label="귀환 연결">'+ ' · '.join(pairs)+'</li>')
 direction=iter(directions)
 projected=''.join(flow).replace('diagram-reading-','diagram-fit-')
 projected=re.sub('class="diagram-fit-link"',lambda m:m.group()+' data-direction="'+next(direction)+'"',projected)
 return projected+''.join(extra)


def render_node(n,depth=0,diagram_aux=True):
 if depth>32:raise ValueError('Content nesting too deep')
 if isinstance(n,str):return esc(check_text(n,'text'))
 if not isinstance(n,dict):raise ValueError('Semantic node must be an object')
 tag=n.get('type');roles=n.get('roles',[])
 if tag not in HTML_TAGS|SVG_TAGS:raise ValueError('Unsupported node type '+str(tag))
 if not isinstance(roles,list) or any(r not in ROLES for r in roles):raise ValueError('Unknown semantic role')
 attrs=[]
 if roles:attrs.append('class="'+' '.join('r-'+r for r in roles)+'"')
 if n.get('reveal'):attrs.append('data-step')
 if n.get('key') and 'staticText' not in n:attrs.append('data-key="'+esc(check_text(n['key'],'key',200))+'"')
 if n.get('url'):attrs.extend(['href="'+esc(safe_url(n['url']))+'"','rel="noopener noreferrer"','target="_blank"'])
 for key in ['title','aria-label','role']:
  if key in n:attrs.append(key+'="'+esc(check_text(n[key],key,1200))+'"')
 if 'value' in n:
  v=n['value']
  if type(v) not in (int,float) or not math.isfinite(v) or not 0<=v<=100:raise ValueError('Bar value must be 0–100')
  attrs.append('style="--bar-value:'+str(v)+'%"')
 if 'fontFit' in n:
  if type(n['fontFit']) not in (int,float) or not 36<=n['fontFit']<=400:raise ValueError('Invalid font fit')
  if type(n.get('fontBase',n['fontFit'])) not in (int,float) or not 36<=n.get('fontBase',n['fontFit'])<=400:raise ValueError('Invalid font base')
  attrs.append('style="--fit-size:'+str(n['fontFit'])+'px"')
  attrs.append('data-fit-base-size="'+str(n.get('fontBase',n['fontFit']))+'"')
 if 'view' in n:
  if n['view'] not in {'delegate','keep'}:raise ValueError('Unknown paired view')
  attrs.append('data-view="'+n['view']+'"')
 if tag=='button':attrs.append('type="button"')
 if tag=='th':
  scope=n.get('scope','col')
  if scope not in {'col','row'}:raise ValueError('Invalid table scope')
  attrs.append('scope="'+scope+'"')
 if tag=='svg':attrs.append('xmlns="http://www.w3.org/2000/svg"')
 for k,v in n.get('geometry',{}).items():
  if tag not in SVG_TAGS or k not in SVG_ATTRS:raise ValueError('Invalid SVG geometry')
  if k in {'fill','stroke'} and not re.fullmatch(r'(none|currentColor|#[a-fA-F0-9]{3,8})',v):raise ValueError('Unsafe SVG paint')
  if k.startswith('marker-') and not re.fullmatch(r'url\(#[\w-]+\)',v):raise ValueError('External SVG marker')
  key={'viewbox':'viewBox','markerwidth':'markerWidth','markerheight':'markerHeight','refx':'refX','refy':'refY'}.get(k,k)
  attrs.append(key+'="'+esc(check_text(v,'geometry',40000))+'"')
 if 'toggle-verdict' in roles:
  parts=[]
  for side in ['delegate','keep']:
   key=n.get('translationAttrs',{}).get('data-'+side,'')
   parts.append('<span data-verdict="'+side+'"'+(' data-key="'+esc(key)+'"' if key else '')+'>'+esc(n.get(side,''))+'</span>')
  inside=''.join(parts)
 else:inside=''.join(render_node(c,depth+1) for c in n.get('children',[]))
 if {'step-title','cell-title'}&set(roles):
  inside=''.join(word_markup(c) if isinstance(c,str) else render_node(c,depth+1) for c in n.get('children',[]))
 if 'staticText' in n:
  key=esc(n.get('key',''))
  inside='<span class="runtime-only"'+(' data-key="'+key+'"' if key else '')+'>'+inside+'</span><span class="static-only"'+(' data-key="'+key+'.static"' if key else '')+'>'+esc(check_text(n['staticText'],'static text'))+'</span>'
 opening='<'+tag+(' '+' '.join(attrs) if attrs else '')+'>'
 result=opening if tag=='br' else opening+inside+'</'+tag+'>'
 if tag=='svg' and 'diagram' in roles and diagram_aux:
  flow=[]
  group_position=0
  for child in n.get('children',[]):
   if not isinstance(child,dict):continue
   if child.get('type')=='g':group_position+=1
   labels=[copy.deepcopy(c) for c in child.get('children',[]) if isinstance(c,dict) and c.get('type')=='text']
   for label in labels:label['type']='span';label.pop('geometry',None);label.pop('reveal',None)
   if labels or 'dg-arrow' in child.get('roles',[]):flow.append('<li class="diagram-reading-'+('loop' if 'dg-loop' in child.get('roles',[]) else 'link' if 'dg-arrow' in child.get('roles',[]) else 'node')+(' fit-emphasis' if group_position==3 and 'dg-layer' in child.get('roles',[]) else '')+'">'+''.join(render_node(label,depth+1) for label in labels)+'</li>')
  fit_flow=fit_diagram_projection(n,flow,depth)
  if fit_flow is not None:
   result=result.replace('<svg ','<svg data-fit-projection="linear" ',1)
   result+='<ul class="diagram-fit" aria-label="도식의 세로 보기">'+fit_flow+'</ul>'
  else:result=result.replace('<svg ','<svg data-fit-projection="unverified" ',1)
  detail=copy.deepcopy(n)
  for item in walk(detail):item.pop('reveal',None)
  scope_svg_ids(detail,'zoom-')
  result+='<details class="diagram-zoom"><summary data-ui="diagramZoom">도식 확대</summary><div class="diagram-pan" tabindex="0" role="region" aria-label="확대 도식 · 좌우 이동">'+render_node(detail,depth+1,False)+'</div></details><ul class="diagram-reading" aria-label="도식의 글자 풀이">'+''.join(flow)+'</ul>'
 return result

def adapt_v1(spec,base):
 out=copy.deepcopy(spec);out['schemaVersion']=2
 for i,s in enumerate(out['slides']):
  k=s.get('kind','statement');s['id']=s.get('id','slide-'+str(i+1));s['variant']='legacy'
  title_parts=[]
  for j,line in enumerate(s['title'].splitlines()):
   if j:title_parts.append(node('br'))
   title_parts.append(line)
  nodes=[node('p',['kicker'],[s.get('eyebrow',k.upper())]),node('h2',['headline'],title_parts)]
  if s.get('body'):nodes.append(node('p',['lead'],[s['body']]))
  rows=s.get('items',[])
  if k=='compare':
   if len(rows)!=2:raise ValueError('compare needs 2 items')
   nodes.append(node('div',['compare'],[node('div',['col',side],[node('h3',[],[r['label']]),node('ul',[],[node('li',[],[r['text']])])]) for side,r in zip(['a','b'],rows)]))
  elif k in {'steps','timeline'}:
   nodes.append(node('div',['steps'],[node('div',['step'],[node('span',['step-no'],[str(j+1).zfill(2)]),node('span',['step-title'],[r['label']]),node('span',['step-text'],[r['text']])]) for j,r in enumerate(rows)]))
  elif k=='metrics':
   nodes.append(node('div',['stats'],[node('div',['stat'],[node('span',['num'],[r['value']]),node('span',['label'],[r['label']+' · '+r['text']])]) for r in rows]))
  elif k=='bars':
   vals=[r['value'] for r in rows]
   if not vals or any(type(v) not in (int,float) or not math.isfinite(v) or v<0 for v in vals) or max(vals)<=0:raise ValueError('bars require finite nonnegative data')
   description=check_text(s.get('chartDescription',s['title']),'chart description',1200)
   nodes.append(node('div',['bars'],[node('div',['bar'],[node('span',['bar-label'],[r['label']]),node('span',['bar-track'],[node('i')]),node('span',['bar-val'],[str(r['value'])+' '+s['unit']])],value=100*r['value']/max(vals)) for r in rows],role='group',**{'aria-label':description}))
   nodes.append(node('table',['chart-data'],[node('caption',[],[description+' · 단위: '+s['unit']]),node('thead',[],[node('tr',[],[node('th',[],['항목']),node('th',[],['값 ('+s['unit']+')'])])]),node('tbody',[],[node('tr',[],[node('th',[],[r['label']],scope='row'),node('td',[],[str(r['value'])])]) for r in rows])]))
  elif k=='image':
   file=(base/s.get('image','')).resolve()
   if not file.is_relative_to(base.resolve()) or not file.is_file():raise ValueError('Image must be local to spec')
   data=file.read_bytes();mime='image/png' if data.startswith(b'\x89PNG\r\n\x1a\n') else 'image/jpeg' if data.startswith(b'\xff\xd8\xff') else None
   if not mime or len(data)>12*1024*1024:raise ValueError('Invalid PNG/JPEG')
   s['imageData']='data:'+mime+';base64,'+base64.b64encode(data).decode();s['alt']=check_text(s.get('alt',''),'alt',500)
  if s.get('quote'):nodes.append(node('blockquote',['quote'],[node('p',[],[s['quote']])]))
  if s.get('detail'):nodes.append(node('p',['evidence'],[s['detail']]))
  nodes.append(node('div',['foot'],[node('span',['foot-src'],[s.get('source','')])]))
  s['nodes']=nodes
 return out

def render_slide(s,i,total,theme='light'):
 kind=s.get('kind','statement')
 if kind not in KINDS:raise ValueError('Unknown slide kind '+str(kind))
 sid=s.get('id','slide-'+str(i+1))
 if not re.fullmatch(r'[a-zA-Z][\w-]{0,80}',sid):raise ValueError('Invalid slide ID')
 variant=s.get('variant','')
 if variant not in {'','legacy','emphatic-statement','long-statement','compact-section'}:raise ValueError('Unknown variant')
 parts=copy.deepcopy(s.get('nodes',[]))
 if not isinstance(parts,list) or len(parts)>100:raise ValueError('Invalid slide nodes')
 # SVG presentation attributes are portable across browser and paged-media engines.
 palette={'ink':'#ffffff','primary':'#ffffff','muted':'#bccbdf','blue':'#4d9ed1','line':'#4a6283','surface':'#001a44','emphasis':'#002e6e','emphasisInk':'#ffffff','emphasisLine':'#4d9ed1'} if theme=='dark' else {'ink':'#111827','primary':'#002e6e','muted':'#485565','blue':'#0066b3','line':'#cbd3dd','surface':'#ffffff','emphasis':'#002e6e','emphasisInk':'#ffffff','emphasisLine':'#002e6e'}
 all_svgs=[n for part in parts for n in walk(part) if n.get('type')=='svg']
 for index,svg in enumerate(all_svgs):scope_svg_ids(svg,sid+'-'+str(index)+'-')
 for part in parts:
  for svg in [n for n in walk(part) if n.get('type')=='svg' and 'diagram' in n.get('roles',[])]:
   groups=[n for n in svg['children'] if isinstance(n,dict) and n.get('type')=='g']
   for index,g in enumerate(groups):
    hi=index==2 and 'dg-layer' in g.get('roles',[])
    for n in walk(g):
     geom=n.setdefault('geometry',{}) if n['type'] in {'rect','path','text'} else None
     if n['type']=='rect':geom.update({'fill':palette['emphasis'] if hi else 'none','stroke':palette['emphasisLine'] if hi else palette['ink'],'stroke-width':'1.5'})
     elif n['type']=='path':geom.update({'fill':'none','stroke':palette['blue'] if 'dg-arrow' in g.get('roles',[]) else palette['line'],'stroke-width':'3' if 'dg-arrow' in g.get('roles',[]) else '1.5'})
     elif n['type']=='text':
      role=n.get('roles',[]);fs='38' if 'dg-t' in role else '16' if 'dg-s' in role else '17' if 'dg-loop' in g.get('roles',[]) else '14'
      fill=palette['emphasisInk'] if hi else palette['ink'] if 'dg-t' in role else palette['muted'] if 'dg-s' in role or 'dg-loop' in g.get('roles',[]) else palette['blue']
      geom.update({'fill':fill,'font-family':'Pretendard Variable','font-size':fs,'font-weight':'800' if 'dg-t' in role else '400'})
 # Fixed-font offline measurement gives print/no-JS a useful fit before JS can run.
 # Live typography is measured again by the browser after fonts and language changes.
 from PIL import ImageFont
 size={'emphatic-statement':200,'long-statement':102,'compact-section':92,'legacy':110}.get(variant,TITLE_SIZES.get(kind,140))
 for part in parts:
  for item in walk(part):
   if 'headline' not in item.get('roles',[]) and not (kind=='quote' and item.get('type')=='p'):continue
   def lines(n):
    if isinstance(n,str):return n
    if 'sub' in n.get('roles',[]):return ''
    return '\n' if n.get('type')=='br' else ''.join(lines(c) for c in n.get('children',[]))
   font=ImageFont.truetype(str(ROOT/'fonts'/'PretendardVariable.woff2'),size)
   font.set_variation_by_axes([800]);width=max((font.getlength(line)-max(0,len(line)-1)*size*.045 for line in lines(item).splitlines()),default=0)
   item['fontBase']=size;item['fontFit']=max(min(size,92),min(size,math.floor(size*1690/width))) if width else size
 top=[];foot=[]
 for part in parts:
  (foot if isinstance(part,dict) and 'foot' in part.get('roles',[]) else top).append(render_node(part))
 if s.get('imageData'):
  if not re.fullmatch(r'data:image/(png|jpeg);base64,[A-Za-z0-9+/=]+',s['imageData']):raise ValueError('Invalid image data')
  top.append('<figure class="r-image"><img src="'+s['imageData']+'" alt="'+esc(s['alt'])+'"><figcaption>'+esc(s.get('caption',''))+'</figcaption></figure>')
 ticks=''.join('<i'+(' class="filled"' if j<=i else '')+'></i>' for j in range(total))
 dense=any(n.get('type')=='tbody' and sum(isinstance(c,dict) and c.get('type')=='tr' for c in n.get('children',[]))>=7 for part in parts for n in walk(part))
 return '<section class="slide kind-'+kind+(' variant-'+variant if variant else '')+(' has-dense-table' if dense else '')+'" id="'+sid+'" data-slide="'+str(i+1)+'" data-kind="'+kind+'" data-section-group="'+esc(s.get('sectionName',''))+'" data-title="'+esc(s.get('title',''))+'" aria-label="'+esc(str(i+1)+' / '+str(total)+' '+s.get('title',''))+'"><div class="sheet-body"'+(' tabindex="0" role="region" aria-label="표 · 좌우 이동"' if kind=='table' else '')+'>'+''.join(top)+'</div><div class="sheet-evidence">'+''.join(foot)+'</div><footer class="sheet-footer" aria-label="'+esc('진행 '+str(i+1)+' / '+str(total))+'"><span class="progress-ticks" aria-hidden="true" style="--tick-count:'+str(total)+'">'+ticks+'</span><span class="sheet-number">'+str(i+1).zfill(2)+' / '+str(total).zfill(2)+'</span></footer></section>'

def build(spec,base):
 base=Path(base)
 if spec.get('schemaVersion') not in {1,2}:raise ValueError('schemaVersion must be 1 or 2')
 spec=adapt_v1(spec,base) if spec['schemaVersion']==1 else copy.deepcopy(spec)
 for key in ['title','audience','purpose']:check_text(spec.get(key),key,2000)
 slides=spec.get('slides',[])
 if not isinstance(slides,list) or not 1<=len(slides)<=500:raise ValueError('1–500 slides required')
 # Static delivery has no keyboard. Keep the original live instruction while
 # projecting the same explanatory sentence without a nonfunctional shortcut.
 for slide in slides:
  for part in slide.get('nodes',[]):
   for n in walk(part):
    if 'foot-note' in n.get('roles',[]) and text(n).endswith('M 키로 관점 전환.'):
     n['staticText']=text(n).removesuffix('M 키로 관점 전환.').rstrip()
     for entries in spec.get('translations',{}).values():
      if n.get('key') in entries:entries[n['key']+'.static']=entries[n['key']].removesuffix('Press M to switch views.').rstrip()
 ids=[s.get('id','slide-'+str(i+1)) for i,s in enumerate(slides)]
 if len(set(ids))!=len(ids):raise ValueError('Duplicate slide IDs')
 theme=spec.get('theme','light');aspect=spec.get('aspect','16x9')
 if theme not in {'light','dark'} or aspect not in {'16x9','16x10'}:raise ValueError('Invalid theme/aspect')
 css=(ROOT/'assets'/'deck.css').read_text(encoding='utf-8')+ '\n'+(ROOT/'assets'/'fit.css').read_text(encoding='utf-8')+'\n'+(ROOT/'assets'/'print.css').read_text(encoding='utf-8');js=(ROOT/'assets'/'state.js').read_text(encoding='utf-8')+'\n'+(ROOT/'assets'/'controller.js').read_text(encoding='utf-8')
 fonts=''
 for filename,family,weight in [('PretendardVariable.woff2','Pretendard Variable','100 900'),('JetBrainsMono.woff2','JetBrains Mono','400')]:
  fonts+='@font-face{font-family:"'+family+'";font-weight:'+weight+';font-style:normal;font-display:block;src:url(data:font/woff2;base64,'+base64.b64encode((ROOT/'fonts'/filename).read_bytes()).decode()+') format("woff2");}'
 overrides=[]
 for key,value in spec.get('brand',{}).items():
  if key not in {'primary','secondary','accent','surface','ink'} or not re.fullmatch(r'#[0-9A-Fa-f]{6}',value):raise ValueError('Invalid brand token')
  overrides.append('--'+key+':'+value)
 if overrides:css+='\nbody{'+ ';'.join(overrides)+'}'
 css+='\n@media print{.progress-ticks{gap:'+str(round(min(6,1554/(len(slides)*2)),3))+'px!important}}'
 if aspect=='16x10':css+='\n@page{size:20in 12.5in}@media print{.slide,body[data-mode=present] .slide{height:1200px!important}}'
 contents=''.join(render_slide(s,i,len(slides),theme) for i,s in enumerate(slides))
 translations=spec.get('translations',{})
 if not isinstance(translations,dict):raise ValueError('Invalid translations')
 for lang,entries in translations.items():
  if not re.fullmatch(r'[a-z]{2}(-[A-Z]{2})?',lang) or not isinstance(entries,dict):raise ValueError('Invalid language')
  for key,value in entries.items():check_text(value,'translation')
 hints=spec.get('layoutHints',{})
 if not isinstance(hints,dict):raise ValueError('layoutHints must be an object')
 allowed_layout={'compactCompare','wideLadderLabel','compactStats','denseBody','denseBars','diagramViewBoxTop'}
 for lang,entries in hints.items():
  if lang not in translations or not isinstance(entries,dict):raise ValueError('Layout hints need an existing language')
  for key,hint in entries.items():
   if not isinstance(hint,dict):raise ValueError('Invalid layout hint')
   if 'lines' in hint:
    lines=hint['lines']
    if set(hint)!={'lines'} or key not in translations[lang] or not isinstance(lines,list) or not 2<=len(lines)<=4 or any(not isinstance(x,str) for x in lines):raise ValueError('Invalid line break hint')
    norm=lambda s:' '.join(s.replace('|',' ').split())
    if norm(' '.join(lines))!=norm(translations[lang][key]):raise ValueError('Line break hint must preserve translated words')
   else:
    if key not in ids or not set(hint)<=allowed_layout:raise ValueError('Unknown semantic layout hint')
    for field,value in hint.items():
     if field=='diagramViewBoxTop':
      if type(value) not in (int,float) or not math.isfinite(value) or not 0<=value<=400:raise ValueError('Invalid viewBox crop')
     elif type(value) is not bool:raise ValueError('Layout flags must be booleans')
 # Notes are loaded at runtime by explicit user file selection; never embedded here.
 if spec.get('notes'):raise ValueError('Private notes must be loaded at runtime; do not embed notes in deliverable')
 config={'version':'2.0.0-candidate','ids':ids,'translations':translations,'layoutHints':hints,'title':spec['title'],'theme':theme,'aspect':aspect,'contentPolicy':spec.get('contentPolicy','authored'),'reference':spec.get('reference')}
 license_text='\n\n'.join((ROOT/'fonts'/f).read_text(encoding='utf-8') for f in ['Pretendard-OFL.txt','JetBrainsMono-OFL.txt'])
 return '''<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="generator" content="Achmage Presentation v2 candidate"><title>'''+esc(spec['title'])+'</title><style>'+fonts+css+'''</style></head><body data-mode="read" data-theme="'''+theme+'" data-aspect="'+aspect+'''"><a class="skip" href="#slides">본문으로 이동</a><header class="toolbar" hidden><button id="tools-toggle" aria-label="메뉴 펼치기" aria-expanded="false">메뉴</button><span class="deck-title">'''+esc(spec['title'])+'''</span><nav aria-label="발표 조작"><button id="index-toggle">목차</button><select id="mode-toggle" aria-label="보기 방식"><option value="fit">한 장 맞춤</option><option value="read">펼쳐 읽기</option><option value="present">발표 16:9</option></select><button id="theme-toggle">다크</button><button id="lang-toggle">한국어 · EN</button><button id="notes-toggle">노트</button><button id="help-toggle">도움말</button><button id="fullscreen">전체화면</button></nav></header><button id="chrome-toggle" hidden aria-label="조작 메뉴 표시" aria-expanded="true">메뉴</button><main id="slides" tabindex="-1">'''+contents+'''</main><aside id="notes-panel" hidden aria-label="발표자 노트"><h2 id="note-title"></h2><p id="note-keys"></p><label>내 노트 파일 열기<input id="notes-file" type="file" accept="application/json,.json"></label><p class="note-privacy">선택한 노트는 현재 창의 메모리에만 유지합니다. 파일을 다른 곳으로 보내지 않습니다.</p><pre id="note-content">열린 노트 없음</pre><button id="notes-clear">노트 지우기</button><p id="note-error" role="alert"></p></aside><footer class="controls" hidden><button id="previous" aria-label="이전 단계">←</button><output id="position" aria-live="polite"></output><button id="next" aria-label="다음 단계">→</button></footer><dialog id="index-dialog" aria-labelledby="index-title"><h2 id="index-title">슬라이드 찾기</h2><label for="deck-search">검색</label><input id="deck-search" type="search" autocomplete="off" aria-describedby="index-hint"><p id="index-hint">제목·본문·그룹 또는 장 번호로 검색 (예: S14)</p><div id="index-filters" role="group" aria-label="장표 유형"><button type="button" data-index-filter="all" aria-pressed="true">전체</button><button type="button" data-index-filter="section" aria-pressed="false">섹션</button><button type="button" data-index-filter="content" aria-pressed="false">내용</button></div><output id="index-count" aria-live="polite"></output><ol id="index-results"></ol><button data-close>닫기</button></dialog><dialog id="language-dialog" aria-labelledby="language-title"><h2 id="language-title">언어 · Language</h2><button data-language="ko">한국어</button>'''+''.join('<button data-language="'+esc(lang)+'">'+esc({'en':'English'}.get(lang,lang))+'</button>' for lang in translations)+'''<button data-close>닫기</button></dialog><dialog id="help-dialog" aria-labelledby="help-title"><h2 id="help-title">발표 도움말</h2><p>→ · Space 다음 단계 / ← 이전 단계</p><p>M 관점 전환 · I 목차 · L 언어 · T 테마 · P 한 장 맞춤/펼쳐 읽기/발표</p><p>N 노트 · A 화면비 · H 메뉴 · F 전체화면 · R 현재 장 초기화</p><p>인쇄는 전체 공개 상태와 양쪽 관점을 정적으로 보존합니다.</p><button data-close>닫기</button></dialog><noscript><p class="nojs-note">전체 읽기 · JavaScript 없이 모든 내용과 양쪽 관점을 읽을 수 있습니다.</p></noscript><script type="application/json" id="deck-config">'''+serial(config)+'</script><script type="text/plain" id="font-licenses">'+license_text.replace('</script','&lt;/script')+'</script><script>'+js+'</script></body></html>'

def main():
 ap=argparse.ArgumentParser();ap.add_argument('spec',type=Path);ap.add_argument('--output',type=Path,required=True);ap.add_argument('--theme',choices=['light','dark']);ap.add_argument('--aspect',choices=['16x9','16x10']);a=ap.parse_args();s=json.loads(a.spec.read_text(encoding='utf-8'))
 if a.theme:s['theme']=a.theme
 if a.aspect:s['aspect']=a.aspect
 result=build(s,a.spec.parent);a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(result,encoding='utf-8');print(json.dumps({'html':str(a.output),'slides':len(s['slides']),'standalone':True,'status':'candidate'},ensure_ascii=False))
if __name__=='__main__':main()
