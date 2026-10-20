"""Measured one-sheet editorial composition; optional path, legacy writers unchanged."""
from pathlib import Path
from xml.etree import ElementTree as ET
import base64,hashlib,html,io,json,math,re
from reportlab.pdfgen.canvas import Canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics import renderPDF,renderSVG
from svglib.svglib import svg2rlg
from pypdf import PdfReader,PdfWriter

ROOT=Path(__file__).resolve().parents[1]
VERSION='1.3.0-rc.1'
MM=72/25.4
COLORS={'ink':'#16334A','muted':'#526573','blue':'#2363A0','teal':'#087F7B','line':'#BFCED3','wash':'#EFF5F5'}
class LayoutError(ValueError):pass

def digest(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def esc(t):return html.escape(str(t),quote=True)
def fonts():
    from svglib.fonts import register_font
    for weight in (400,700,800):
        name='P'+str(weight)
        if name not in pdfmetrics.getRegisteredFontNames():pdfmetrics.registerFont(TTFont(name,str(ROOT/f'assets/fonts/Pretendard{weight}.ttf')))
        # svglib2.3 has its own registry; ReportLab registration alone falls back.
        result=register_font(name,font_path=str(ROOT/f'assets/fonts/Pretendard{weight}.ttf'),rlgFontName=name)
        if result!=(name,True):raise ValueError('SVG font registration failed: '+name)
        register_font(name,font_path=str(ROOT/f'assets/fonts/Pretendard{700 if weight==400 else weight}.ttf'),weight='bold',rlgFontName='P700' if weight==400 else name)

def wrap(text,width,size,weight=400):
    if width<=0:raise LayoutError('Non-positive column width')
    lines=[]
    for paragraph in str(text).split('\n'):
        line=''
        # Preserve words where possible, split only an overlong unbroken token.
        for token in re.findall(r'\S+\s*',paragraph):
            if line and pdfmetrics.stringWidth(line+token,'P'+str(weight),size)>width:lines.append(line.rstrip());line=''
            if pdfmetrics.stringWidth(token,'P'+str(weight),size)>width:
                for char in token:
                    if line and pdfmetrics.stringWidth(line+char,'P'+str(weight),size)>width:lines.append(line.rstrip());line=''
                    line+=char
            else:line+=token
        lines.append(line.rstrip())
    return lines

def prepare_svg(file,asset_root):
    file=(asset_root/file).resolve()
    if asset_root.resolve() not in file.parents:raise ValueError('Figure must be under assetRoot')
    if file.suffix.lower()!='.svg' or file.stat().st_size>2*1024*1024:raise ValueError('Bounded static SVG required')
    raw=file.read_text(encoding='utf-8')
    if '<!DOCTYPE' in raw.upper() or '<!ENTITY' in raw.upper():raise ValueError('SVG declarations prohibited')
    tree=ET.fromstring(raw)
    allowed={'svg','g','defs','marker','path','rect','circle','ellipse','line','polyline','polygon','text','tspan','title','desc','clipPath','style'}
    variables={'--pele-bg':'#FFFFFF','--pele-fg':'#16334A','--pele-surface':'#EFF5F5','--pele-line':'#526573','--pele-border':'#7295A5','--pele-node':'#EFF5F5','--pele-font':'P400'}
    for declaration in tree.get('style','').split(';'):
        if declaration.strip().startswith('--') and ':' in declaration:
            k,v=declaration.split(':',1);variables[k.strip()]=v.strip()
    def resolve_vars(value):
        for _ in range(24):
            def replace(m):
                key,fallback=m[1],m[2]
                if key not in variables and fallback is None:raise ValueError('Unresolved SVG variable: '+key)
                return variables.get(key,fallback).strip()
            updated=re.sub(r'var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*))?\)',replace,value)
            if updated==value:break
            value=updated
        if 'var(' in value:raise ValueError('Unresolved or cyclic SVG variables')
        return value
    if tree.get('viewBox'):
        dims=[float(x) for x in re.split(r'[,\s]+',tree.get('viewBox').strip())]
        if len(dims)!=4 or not all(math.isfinite(x) for x in dims) or min(dims[2:])<=0:raise ValueError('Invalid SVG viewBox')
        tree.set('width',str(dims[2]));tree.set('height',str(dims[3]))
        # Intrinsic print dimensions come from viewBox, not responsive web CSS.
        tree.set('style',';'.join(d for d in tree.get('style','').split(';') if d.split(':',1)[0].strip().lower() not in ('height','width','max-width','max-height')))
    shorthand=re.search(r'(?:^|;)\s*font\s*:\s*([0-9.]+)px\s+',tree.get('style',''))
    if shorthand:
        tree.set('font-size',shorthand[1])
        tree.set('style',';'.join(d for d in tree.get('style','').split(';') if d.split(':',1)[0].strip().lower()!='font'))
    texts=[]
    for e in tree.iter():
        tag=e.tag.split('}')[-1]
        if tag not in allowed:raise ValueError('Unsupported SVG element: '+tag)
        for key,value in list(e.attrib.items()):
            local=key.split('}')[-1]
            if local.lower().startswith('on') or local in ('href','src','filter'):raise ValueError('External or active SVG prohibited')
            if re.search(r'url\s*\(',value,re.I) and not re.fullmatch(r'url\(#[A-Za-z0-9_.:-]+\)',value,re.I):raise ValueError('External SVG URL')
            if re.search(r'@import|javascript\s*:|expression\s*\(',value,re.I):raise ValueError('Active SVG style')
            value=resolve_vars(value)
            e.set(key,value)
        if tag in ('text','tspan'):
            if e.text and e.text.strip():texts.append(e.text.strip())
            weight=e.get('font-weight','400');family='P700' if weight in ('bold','600','650','700','750','800','900') else 'P400'
            e.set('font-family',family)
        if tag=='style':
            # Use explicit attributes from the static figure. No imported CSS.
            if re.search(r'@import|url\s*\(|expression\s*\(|javascript\s*:',e.text or '',re.I):raise ValueError('External SVG style')
            e.text=resolve_vars(e.text or '').replace('Pretendard Variable','P400').replace('Pretendard','P400')
    data=ET.tostring(tree,encoding='unicode')
    drawing=svg2rlg(io.BytesIO(data.encode('utf-8')))
    if not drawing or not drawing.width or not drawing.height:raise ValueError('Cannot decode SVG geometry')
    return drawing,texts,digest(file)

def drawing_text_sizes(drawing):
    sizes=[]
    def visit(node,scale):
        t=getattr(node,'transform',None)
        if t:scale*=min(math.hypot(t[0],t[1]),math.hypot(t[2],t[3]))
        if hasattr(node,'text') and str(node.text).strip():sizes.append(float(node.fontSize)*scale)
        for child in getattr(node,'contents',[]):visit(child,scale)
    visit(drawing,1)
    return sizes

class Composer:
    def __init__(self,spec,out,asset_root):
        self.s=spec;self.out=out;self.asset_root=asset_root
        self.a2=spec.get('size','A2')=='A2'
        if spec.get('size','A2') not in ('A2','A4'):raise ValueError('Editorial size A2/A4')
        self.wmm,self.hmm=(420,594) if self.a2 else (210,297)
        self.bleed=2 if self.a2 else 0
        self.W=(self.wmm+2*self.bleed)*MM;self.H=(self.hmm+2*self.bleed)*MM
        self.margin=(spec.get('marginMm',26 if self.a2 else 14)+self.bleed)*MM
        self.x=self.margin;self.y=self.margin;self.cw=self.W-2*self.margin
        self.bottom=self.H-self.margin
        self.body=spec.get('bodySizePt',21 if self.a2 else 11)
        if self.body<(18 if self.a2 else 11):raise ValueError('Body below profile reading floor')
        self.small=18 if self.a2 else 9
        self.items=[];self.fields=[];self.audit=[]
        self.cv=Canvas(str(out/'poster.pdf'),pagesize=(self.W,self.H),invariant=1,pageCompression=1)
        self.cv.setTitle(spec['title']);self.cv.setCreator('Achmage editorial '+VERSION)
    def line(self,x,y,w,color=None):
        color=color or COLORS['line'];self.cv.setStrokeColorRGB(*rgb(color));self.cv.setLineWidth(.6 if not self.a2 else 1.1);self.cv.line(x,self.H-y,x+w,self.H-y)
        self.items.append(f'<line x1="{x}" y1="{y}" x2="{x+w}" y2="{y}" stroke="{color}" stroke-width=".8"/>')
    def text(self,text,x,y,w,size=None,weight=400,color=None,field=None,leading=1.42,draw=True):
        size=size or self.body;color=color or COLORS['ink'];ll=wrap(text,w,size,weight)
        if draw:
            self.cv.setFillColorRGB(*rgb(color));self.cv.setFont('P'+str(weight),size)
            for n,line in enumerate(ll):
                yy=y+n*size*leading;baseline=yy+size*.84
                self.cv.drawString(x,self.H-baseline,line)
                self.items.append(f'<text x="{x}" y="{baseline}" font-family="P{weight}" font-size="{size}" fill="{color}">{esc(line)}</text>')
            if field:self.fields.append({'id':field,'text':str(text),'sizePt':size})
        return y+len(ll)*size*leading
    def table(self,t,x,y,w,draw=True):
        headers=t['headers'];rows=t['rows'];weights=t.get('widths',[1]*len(headers))
        if not headers or len(weights)!=len(headers) or any(not isinstance(z,(int,float)) or z<=0 for z in weights):raise ValueError('Invalid table columns')
        widths=[w*z/sum(weights) for z in weights];size=self.small;pad=5 if not self.a2 else 10
        for r,row in enumerate([headers]+rows):
            if len(row)!=len(headers):raise ValueError('Table row width mismatch')
            h=max(len(wrap(cell,cw-pad*2,size,700 if r==0 else 400)) for cell,cw in zip(row,widths))*size*1.4+pad*2
            if draw:self.line(x,y,w)
            xx=x
            for j,(cell,cw) in enumerate(zip(row,widths)):
                self.text(cell,xx+pad,y+pad,cw-pad*2,size,700 if r==0 else 400,field=f'table-{len(self.fields)}' if draw else None,draw=draw);xx+=cw
            y+=h
        if draw:self.line(x,y,w)
        return y+size*.8
    def section(self,b,x,y,w,draw=True):
        if b.get('title'):y=self.text(b['title'],x,y,w,self.body*1.12,700,COLORS['teal'],b.get('id','section')+'-title',draw=draw)+self.body*.4
        for n,text in enumerate(b.get('body',[])):
            y=self.text(text,x,y,w,field=b.get('id','section')+'-'+str(n),draw=draw)+self.body*.45
        if b.get('table'):y=self.table(b['table'],x,y,w,draw)
        if b.get('figure'):y=self.figure(b['figure'],x,y,w,draw)
        return y
    def figure(self,f,x,y,w,draw=True):
        drawing,texts,sha=prepare_svg(Path(f['asset']),self.asset_root)
        bounds=drawing.getBounds()
        if bounds and (bounds[0]<-.5 or bounds[1]<-.5 or bounds[2]>drawing.width+.5 or bounds[3]>drawing.height+.5):raise LayoutError('Figure content exceeds its viewBox; recompose the source so PDF and SVG cannot clip differently')
        h=w*drawing.height/drawing.width
        maximum=f.get('heightMm',140 if self.a2 else 64)*MM
        if h>maximum:
            scale=maximum/h;ww=w*scale;hh=maximum
        else:ww=w;hh=h
        factor=ww/drawing.width
        sizes=drawing_text_sizes(drawing)
        if sizes and min(sizes)*factor<self.small-.01:raise LayoutError(f'Figure labels {min(sizes)*factor:.2f}pt below {self.small}pt; recompose the figure or give it more space')
        if draw:
            self.cv.saveState();self.cv.translate(x+(w-ww)/2,self.H-y-hh);self.cv.scale(factor,factor);renderPDF.draw(drawing,self.cv,0,0);self.cv.restoreState()
            # Both backends consume the same normalized ReportLab geometry. Source CSS never leaks to the page.
            normalized=ET.fromstring(renderSVG.drawToString(drawing))
            for e in normalized.iter():e.tag=e.tag.split('}')[-1]
            prefix='figure-'+str(len(self.audit))+'-'
            for e in normalized.iter():
                if 'id' in e.attrib:e.set('id',prefix+e.get('id'))
                for k,v in list(e.attrib.items()):e.set(k,re.sub(r'url\(#([^)]*)\)',lambda m:'url(#'+prefix+m[1]+')',v))
            normalized.set('x',str(x+(w-ww)/2));normalized.set('y',str(y));normalized.set('width',str(ww));normalized.set('height',str(hh))
            normalized.set('viewBox',f'0 0 {drawing.width} {drawing.height}')
            self.items.append(ET.tostring(normalized,encoding='unicode'))
            self.audit.append({'figureSha256':sha,'widthPt':ww,'heightPt':hh,'textRuns':len(texts),'scale':factor,'minimumLabelPt':min(sizes)*factor if sizes else None,'sharedNormalizedGeometry':True})
            self.fields.extend({'id':'figure-label','text':t,'sizePt':min(sizes)*factor if sizes else None} for t in texts)
        y+=hh+self.small*.5
        if f.get('caption'):y=self.text(f['caption'],x,y,w,self.small,400,COLORS['muted'],'figure-caption',draw=draw)+self.small*.5
        return y
    def compose(self):
        s=self.s;x=self.x;y=self.y;w=self.cw
        y=self.text(s.get('eyebrow','ACHMAGE / EVIDENCE NOTES'),x,y,w,self.small,700,COLORS['teal'],'eyebrow')+self.small*.8
        self.line(x,y,w,COLORS['ink']);y+=self.body*.8
        y=self.text(s['title'],x,y,w,52 if self.a2 else 25,800,field='title',leading=1.14)+self.body*.65
        if s.get('subtitle'):y=self.text(s['subtitle'],x,y,w,self.body*1.05,700,COLORS['teal'],'subtitle')+self.body*.55
        if s.get('metadata'):y=self.text('  ·  '.join(s['metadata']),x,y,w,self.small,400,COLORS['muted'],'metadata')+self.body*.8
        if s.get('abstract'):y=self.text(s['abstract'],x,y,w,self.body,400,field='abstract')+self.body*.8
        if s.get('figure'):y=self.figure(s['figure'],x,y,w)+self.body*.45
        source_sections=s.get('sections',[])
        if len({b['id'] for b in source_sections})!=len(source_sections):raise ValueError('Duplicate section ID; content must not be overwritten')
        sections={b['id']:b for b in source_sections}
        rows=s.get('rows',[[k] for k in sections])
        refs=[k for row in rows for k in row]
        if len(refs)!=len(set(refs)) or set(refs)!=set(sections):raise ValueError('Every section occurs once in editorial rows')
        gap=(9 if self.a2 else 6)*MM
        footer_h=self.small*max(3,len(s.get('references',[]))+1)*1.5
        for row in rows:
            if not 1<=len(row)<=2:raise ValueError('Editorial rows contain one or two columns')
            colw=(w-gap*(len(row)-1))/len(row)
            end=max(self.section(sections[k],x+i*(colw+gap),y+self.body*.45,colw,False) for i,k in enumerate(row))
            if end>self.bottom-footer_h:raise LayoutError(f'Editorial overflow: need {(end+footer_h-self.bottom)/MM:.1f}mm more; re-edit columns/content, never shrink below reading floor')
            self.line(x,y-self.body*.2,w)
            for i,k in enumerate(row):self.section(sections[k],x+i*(colw+gap),y+self.body*.45,colw)
            y=end+self.body*1.1
        y=max(y,self.bottom-footer_h)
        self.line(x,y,w,COLORS['ink']);y+=self.small*.7
        for i,ref in enumerate(s.get('references',[])):
            y=self.text(ref,x,y,w,self.small,400,COLORS['muted'],'reference-'+str(i),leading=1.3)+self.small*.2
        if y>self.bottom+self.small:raise LayoutError('References overflow; preserve references and re-edit the page')
        self.cv.showPage();self.cv.save()
        reader=PdfReader(self.out/'poster.pdf');writer=PdfWriter();page=reader.pages[0]
        b=self.bleed*MM
        page.trimbox.lower_left=(b,b);page.trimbox.upper_right=(self.W-b,self.H-b)
        page.bleedbox.lower_left=(0,0);page.bleedbox.upper_right=(self.W,self.H)
        writer.add_page(page)
        from poster_series import remove_unpainted_fonts,paper_preflight
        remove_unpainted_fonts(writer.pages[0],writer)
        writer.add_metadata({'/Title':s['title'],'/Creator':'Achmage editorial '+VERSION})
        with (self.out/'poster.pdf').open('wb') as stream:writer.write(stream)
        svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.W} {self.H}" role="img" aria-label="{esc(s["title"])}"><title>{esc(s["title"])}</title><rect width="100%" height="100%" fill="white"/>'+''.join(self.items)+'</svg>'
        (self.out/'paper.svg').write_text(svg,encoding='utf-8')
        fontcss=''.join('@font-face{font-family:P'+str(v)+';src:url(data:font/woff2;base64,'+base64.b64encode((ROOT/f'assets/fonts/Pretendard{v}.woff2').read_bytes()).decode()+') format("woff2")}' for v in (400,700,800))
        reading_counter=iter(range(10000))
        def reading_figure(f):
            d,texts,_=prepare_svg(Path(f['asset']),self.asset_root)
            normalized=ET.fromstring(renderSVG.drawToString(d))
            for e in normalized.iter():e.tag=e.tag.split('}')[-1]
            prefix='reading-'+str(next(reading_counter))+'-'
            for e in normalized.iter():
                if 'id' in e.attrib:e.set('id',prefix+e.get('id'))
                for k,v in list(e.attrib.items()):e.set(k,re.sub(r'url\(#([^)]*)\)',lambda m:'url(#'+prefix+m[1]+')',v))
            normalized.set('role','img');normalized.set('aria-label',f.get('caption',s['title']))
            labels='<details><summary>'+('도표의 텍스트' if s.get('language','ko')=='ko' else 'Figure text')+'</summary><ul>'+''.join('<li>'+esc(t)+'</li>' for t in texts)+'</ul></details>'
            return '<figure><div class="reading-figure">'+ET.tostring(normalized,encoding='unicode')+'</div><figcaption>'+esc(f.get('caption',''))+'</figcaption>'+labels+'</figure>'
        transcript='<header><p>'+esc(s.get('eyebrow',''))+'</p><h1>'+esc(s['title'])+'</h1><p>'+esc(s.get('subtitle',''))+'</p><p>'+esc(' · '.join(s.get('metadata',[])))+'</p></header>'
        if s.get('abstract'):transcript+='<p>'+esc(s['abstract'])+'</p>'
        if s.get('figure'):transcript+=reading_figure(s['figure'])
        for block in source_sections:
            transcript+='<section><h2>'+esc(block.get('title',''))+'</h2>'+''.join('<p>'+esc(p)+'</p>' for p in block.get('body',[]))
            if block.get('table'):
                t=block['table'];transcript+='<div class="reading-table"><table><thead><tr>'+''.join('<th scope="col">'+esc(c)+'</th>' for c in t['headers'])+'</tr></thead><tbody>'+''.join('<tr>'+''.join(('<th scope="row">' if i==0 else '<td>')+esc(c)+('</th>' if i==0 else '</td>') for i,c in enumerate(row))+'</tr>' for row in t['rows'])+'</tbody></table></div>'
            if block.get('figure'):transcript+=reading_figure(block['figure'])
            transcript+='</section>'
        transcript+='<footer><h2>'+('근거' if s.get('language','ko')=='ko' else 'References')+'</h2><ul>'+''.join('<li>'+esc(r)+'</li>' for r in s.get('references',[]))+'</ul></footer>'
        markup='<!doctype html><html lang="'+esc(s.get('language','ko'))+'"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(s['title'])+'</title><style>'+fontcss+'body{margin:0;background:#e8eef1;color:#16334a;font-family:P400}main{max-width:1100px;margin:58px auto 24px;padding:0 5vw}svg{display:block;width:100%;height:auto;background:white}nav{position:fixed;top:8px;right:8px}button,a{min-height:44px;min-width:44px}#reading{max-width:70ch;margin:auto;line-height:1.6;background:white;padding:24px}#reading[hidden]{display:none}@media print{nav,#reading{display:none}body,main{margin:0;padding:0;background:white}svg{width:100%}}</style><nav><button id="tools" aria-expanded="false" aria-controls="options">⋯</button><span id="options" hidden><a href="poster.pdf">PDF</a> <button id="read">'+('읽기' if s.get('language','ko')=='ko' else 'Read')+'</button> <button id="print">Print</button></span></nav><main>'+svg+'<article id="reading" hidden>'+transcript+'</article></main><script>const t=document.getElementById("tools"),o=document.getElementById("options");t.onclick=()=>{o.hidden=!o.hidden;t.setAttribute("aria-expanded",String(!o.hidden))};document.getElementById("read").onclick=()=>{document.getElementById("reading").hidden=!document.getElementById("reading").hidden};document.getElementById("print").onclick=()=>print();document.addEventListener("keydown",e=>{if(e.key==="Escape"){o.hidden=true;t.setAttribute("aria-expanded","false");t.focus()}});</script></html>'
        physical_css=f'@page{{size:{self.wmm+2*self.bleed}mm {self.hmm+2*self.bleed}mm;margin:0}}@media print{{main{{max-width:none}}main>svg{{width:{self.wmm+2*self.bleed}mm;height:{self.hmm+2*self.bleed}mm}}}}'
        markup=markup.replace('</style>',physical_css+'</style>')
        markup=markup.replace('<button id="read">','<button id="theme" aria-pressed="false">T · Theme</button><button id="zoom" aria-pressed="false">Z · Zoom</button><button id="read" aria-pressed="false">')
        markup=markup.replace('<button id="tools" aria-expanded=', '<button id="tools" aria-label="Poster tools" aria-expanded=')
        markup=markup.replace('</style>','body{--viewer-bg:#e8eef1;--viewer-ink:#16334a;background:var(--viewer-bg);color:var(--viewer-ink)}body[data-theme=dark]{--viewer-bg:#071b2e;--viewer-ink:#eef5fc}nav{z-index:5;max-width:calc(100vw - 16px)}#options{background:var(--viewer-bg);border:1px solid #8ea6b5;border-radius:8px;padding:8px;display:flex;flex-wrap:wrap;gap:6px;max-width:min(520px,calc(100vw - 16px))}#options[hidden]{display:none}nav button,nav a{font:inherit;color:inherit;background:var(--viewer-bg);border:1px solid #8ea6b5;border-radius:6px;padding:8px;display:inline-flex;align-items:center;justify-content:center}main{margin:56px auto 12px;padding:0 12px;max-width:none}main>svg{height:calc(100dvh - 72px);width:auto;max-width:100%;margin:auto}body.zoomed main{width:1200px;padding:0 24px}body.zoomed main>svg{width:1152px;max-width:none;height:auto}#reading{background:var(--viewer-bg)}body.reading main>svg{display:none}@media print{body.zoomed main{width:auto;padding:0}body.reading main>svg{display:block}nav{display:none}}'+physical_css+'</style>')
        markup=markup.replace('svg{display:block;width:100%;height:auto;background:white}','main>svg{display:block;width:100%;height:auto;background:white}').replace('svg{width:100%}','main>svg{width:100%}')
        fit_css=f'body main>svg{{width:min(100%,calc((100dvh - 72px)*{self.W/self.H}));height:auto;max-width:none}}#options{{position:fixed;right:8px;top:56px;max-width:360px}}@media(max-width:1200px){{body main>svg{{width:min(100%,calc((100dvh - 200px)*{self.W/self.H}))}}#options{{top:auto;bottom:8px;max-width:calc(100vw - 16px)}}}}@media print{{html,body,body main,body.zoomed main,body.reading main{{margin:0!important;padding:0!important;width:{self.wmm+2*self.bleed}mm!important;max-width:none!important;height:auto!important;background:white!important}}body main>svg,body.zoomed main>svg,body.reading main>svg{{display:block!important;width:{self.wmm+2*self.bleed}mm!important;height:{self.hmm+2*self.bleed}mm!important;max-width:none!important;margin:0!important}}nav,#reading{{display:none!important}}}}'
        markup=markup.replace('</style>',fit_css+'</style>')
        reading_css='#reading{max-width:76ch;box-sizing:border-box}#reading h1{font-family:P800;font-size:clamp(26px,5vw,42px);line-height:1.22}#reading h2{font-family:P700;font-size:22px;color:#087f7b;margin-top:32px}#reading p,#reading li{font-size:18px;line-height:1.75}#reading figure{margin:24px 0}#reading figcaption,#reading summary{font-size:15px;line-height:1.6}.reading-figure,.reading-table{overflow:auto;max-width:100%}.reading-figure>svg{width:100%;height:auto;background:white}.reading-table table{width:100%;border-collapse:collapse;font-size:16px}.reading-table th,.reading-table td{padding:12px;border-bottom:1px solid #aabcc8;text-align:left;vertical-align:top}body.reading.zoomed main{width:auto;padding:0 12px}body.reading.zoomed .reading-figure>svg{width:1100px;max-width:none}@media(max-width:600px){#reading{padding:16px}}'
        reading_css+='#reading{overflow-wrap:anywhere}'
        markup=markup.replace('</style>',reading_css+'</style>')
        viewer='<script>const z=document.getElementById("zoom"),th=document.getElementById("theme"),rd=document.getElementById("read");function theme(){const dark=document.body.dataset.theme!=="dark";document.body.dataset.theme=dark?"dark":"light";th.setAttribute("aria-pressed",String(dark));try{localStorage.setItem("achmage-editorial-theme",dark?"dark":"light")}catch{}}try{document.body.dataset.theme=localStorage.getItem("achmage-editorial-theme")==="dark"?"dark":"light";th.setAttribute("aria-pressed",String(document.body.dataset.theme==="dark"))}catch{}th.onclick=theme;z.onclick=()=>{const on=document.body.classList.toggle("zoomed");z.setAttribute("aria-pressed",String(on))};rd.onclick=()=>{const on=document.body.classList.toggle("reading");document.getElementById("reading").hidden=!on;rd.setAttribute("aria-pressed",String(on))};document.addEventListener("click",e=>{if(!e.target.closest("nav")){o.hidden=true;t.setAttribute("aria-expanded","false")}});document.addEventListener("keydown",e=>{if(e.target.closest("button,a,input,textarea,select"))return;if(e.key.toLowerCase()==="t")theme();if(e.key.toLowerCase()==="z")z.click()});</script>'
        markup=markup.replace('</html>',viewer+'</html>')
        (self.out/'poster.html').write_text(markup,encoding='utf-8')
        norm=lambda v:re.sub(r'\s+','',v)
        pdf=PdfReader(self.out/'poster.pdf');text=norm(pdf.pages[0].extract_text() or '')
        missing=[f for f in self.fields if norm(f['text']) not in text]
        if missing:raise ValueError('PDF text lost: '+str(missing[:3]))
        preflight=paper_preflight(self.out/'poster.pdf')
        result={'version':VERSION,'status':'generated-awaiting-visual-review','pages':len(pdf.pages),'trimMm':[self.wmm,self.hmm],'bodySizePt':self.body,'captionFloorPt':self.small,'textFields':len(self.fields),'pdfTextPreserved':True,'figures':self.audit,'preflight':preflight,'printStatus':'needs-print-profile','outputs':{n:digest(self.out/n) for n in ('poster.pdf','paper.svg','poster.html')}}
        (self.out/'result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
        return result

def rgb(color):return tuple(int(color[i:i+2],16)/255 for i in (1,3,5))
def run(req):
    fonts();out=Path(req['outputDir']).resolve()
    if out.exists():raise FileExistsError('New output directory required')
    spec=req['poster']['editorial'];asset_root=Path(req.get('assetRoot','.')).resolve()
    out.mkdir(parents=True)
    try:return Composer(spec,out,asset_root).compose()
    except Exception as exc:
        (out/'error.json').write_text(json.dumps({'generated':False,'type':type(exc).__name__,'message':str(exc),'partialArtifacts':'Not deliverable'},ensure_ascii=False,indent=2),encoding='utf-8');raise
