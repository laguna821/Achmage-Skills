"""A physical, single-page poster composer. Coordinates are shared by all exports."""
from pathlib import Path
import base64, hashlib, html, io, json, math, re, subprocess, sys, unicodedata

ROOT=Path(__file__).resolve().parents[1]
VERSION='1.0.0-rc.6'
C={'navy':'#002E6E','blue':'#0066B3','teal':'#00B5AD','white':'#FFFFFF','ink':'#0F1620','muted':'#4A5563','line':'#CDD3DA','pale':'#D9E8F4','soft':'#FAFBFC'}
SIZES={'A0':[841,1189],'A1':[594,841],'A2':[420,594],'A3':[297,420],'A4':[210,297]}
class FitError(ValueError):pass

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(path):
    def pairs(items):
        result={}
        for k,v in items:
            if k in result:raise ValueError('중복 JSON 키: '+k)
            result[k]=v
        return result
    return json.loads(Path(path).read_text(encoding='utf-8-sig'),object_pairs_hook=pairs)

def fonts():
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    for weight in (400,700,800):
        name='P'+str(weight)
        if name not in pdfmetrics.getRegisteredFontNames():pdfmetrics.registerFont(TTFont(name,str(ROOT/'assets/fonts'/f'Pretendard{weight}.ttf')))

def text(value):
    if not isinstance(value,str):raise ValueError('텍스트 필드는 문자열이어야 합니다.')
    value=unicodedata.normalize('NFC',value).strip()
    if any(ord(ch)<32 and ch!='\n' for ch in value):raise ValueError('지원하지 않는 제어문자')
    return value

def width(value,size,weight):
    from reportlab.pdfbase import pdfmetrics
    return pdfmetrics.stringWidth(value,'P'+str(weight),size)

def wrap(value,maxwidth,size,weight):
    lines=[]
    for paragraph in value.split('\n'):
        line=''
        for word in re.findall(r'\S+\s*',paragraph):
            if width(line+word.rstrip(),size,weight)<=maxwidth:
                line+=word;continue
            if line.strip():lines.append(line.rstrip());line=''
            if width(word.rstrip(),size,weight)<=maxwidth:line=word;continue
            for char in word:
                if width(line+char,size,weight)>maxwidth and line:
                    lines.append(line.rstrip());line=''
                if width(char,size,weight)>maxwidth:raise FitError('문자 한 개도 들어가지 않는 열 폭')
                line+=char
        lines.append(line.rstrip())
    return lines

def luminance(color):
    rgb=[int(color[i:i+2],16)/255 for i in (1,3,5)]
    rgb=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in rgb]
    return sum(x*y for x,y in zip(rgb,[.2126,.7152,.0722]))
def contrast(a,b):
    a,b=sorted([luminance(a),luminance(b)],reverse=True)
    return (a+.05)/(b+.05)

class Page:
    def __init__(self,spec):
        fonts();self.spec=spec;self.items=[];self.fields=[];self.serial=0
        size=spec.get('size','A2' if spec.get('kind','event')!='research' else 'A1')
        if isinstance(size,str):
            if size not in SIZES:raise ValueError('size는 A0~A4 또는 [가로mm,세로mm]')
            size=SIZES[size][:]
        if not isinstance(size,list) or len(size)!=2 or any(not isinstance(v,(int,float)) or not math.isfinite(v) or not 150<=v<=1300 for v in size):raise ValueError('캔버스는 각 변 150~1300mm 범위')
        if spec.get('orientation','portrait') not in ('portrait','landscape'):raise ValueError('orientation 확인')
        if spec.get('orientation')=='landscape':size=sorted(size,reverse=True)
        if size[0]>=size[1]:raise ValueError('세로 길이가 더 긴 포스터 규격이 필요합니다.')
        self.mm=size;self.w=1000.;self.h=1000*size[1]/size[0];self.scale=size[0]*72/25.4/1000
        self.m=54.;self.body=20 if spec.get('kind','event')=='event' else 18
        self.rect(0,0,self.w,self.h,C['white'])
    def rect(self,x,y,w,h,color):self.items.append(dict(type='rect',x=x,y=y,w=w,h=h,color=color))
    def line(self,x,y,w,color=C['line'],thickness=1):self.rect(x,y,w,thickness,color)
    def title_block(self,x,y,w,size,maxh,allow_fit=True):
        mode=self.spec.get('titleLayout','auto')
        if mode not in ('auto','preserve'):raise ValueError('titleLayout: auto/preserve')
        value=text(self.spec['title'])
        if mode=='auto':
            value=re.sub(r'\s*\n\s*',' ',value)
            # Prefer one line on paper without reducing the established title floor.
            # Screen plans keep their type size and wrap to protect phone legibility.
            fitted=math.floor(w/max(width(value,1,800),.001)*2)/2
            if allow_fit and fitted>=52:size=min(size,fitted)
        return self.block('title',value,x,y,w,size,800,maxh=maxh,leading=1.14)
    def block(self,key,value,x,y,w,size=20,weight=400,color=C['ink'],bg=C['white'],maxh=None,leading=1.32):
        value=text(value)
        if not value:return y
        # Font coverage must fail visibly, rather than silently drawing .notdef boxes.
        from reportlab.pdfbase import pdfmetrics
        face=pdfmetrics.getFont('P'+str(weight)).face
        missing=sorted({ch for ch in value if not ch.isspace() and ord(ch) not in face.charToGlyph})
        if missing:raise FitError(key+' 글꼴에 없는 문자: '+''.join(missing))
        lines=wrap(value,w,size,weight);height=len(lines)*size*leading
        if maxh is not None and height>maxh+.1:raise FitError(f'{key}: 필요한 높이 {height:.1f}, 가능한 높이 {maxh:.1f}. 문구/배치/규격을 조정하세요.')
        if contrast(color,bg)<4.5:raise FitError(key+' 글자 대비 부족')
        self.fields.append({'id':key,'text':value,'lines':lines,'size':size,'weight':weight})
        for n,line in enumerate(lines):
            if line:self.items.append(dict(type='text',field=key,text=line,x=x,y=y+n*size*leading,w=width(line,size,weight),h=size*1.1,size=size,weight=weight,color=color,bg=bg))
        return y+height
    def image(self,path,x,y,w,h,key):
        from PIL import Image,ImageOps
        path=Path(path).resolve()
        with Image.open(path) as raw:
            if getattr(raw,'n_frames',1)!=1:raise FitError('단일 프레임 이미지를 제공해 주세요.')
            im=ImageOps.exif_transpose(raw).convert('RGBA')
            iw,ih=im.size
            ratio=min(w/iw,h/ih);rw,rh=iw*ratio,ih*ratio
            buf=io.BytesIO();im.save(buf,format='PNG')
        self.items.append(dict(type='image',x=x+(w-rw)/2,y=y+(h-rh)/2,w=rw,h=rh,data=base64.b64encode(buf.getvalue()).decode(),source=str(path),sha256=sha(path),field=key,pixelSize=[iw,ih]))
    def chart(self,chart,x,y,w,h):
        values=chart.get('values',[]);labels=chart.get('labels',[])
        if not 1<=len(values)<=6 or len(values)!=len(labels) or any(not isinstance(v,(int,float)) or not math.isfinite(v) or v<0 for v in values) or not max(values):raise FitError('차트는 비음수 수치 1~6개와 같은 수의 이름이 필요합니다.')
        self.block('figure-title',chart['title'],x,y,w,24,700,maxh=65)
        top=y+70;row=(h-110)/len(values);labelw=w*.3;barw=w*.53
        if row<32:raise FitError('차트 행 높이 부족')
        for i,(label,value) in enumerate(zip(labels,values)):
            yy=top+i*row
            self.block(f'chart-label-{i}',label,x,yy,labelw-12,17,maxh=row-4)
            self.rect(x+labelw,yy+1,barw*value/max(values),19,C['blue'] if i%2==0 else C['navy']);self.items[-1]['role']='data-bar'
            self.block(f'chart-value-{i}',str(value),x+labelw+barw+10,yy,w-labelw-barw-10,17,700,maxh=row-4)
        self.block('figure-caption',chart.get('caption',''),x,y+h-32,w,14,color=C['muted'],maxh=32)
    def audit(self):
        issues=[];content=[i for i in self.items if i['type'] in ('text','image')]
        for i in content:
            if i['x']<self.m-1 or i['y']<0 or i['x']+i['w']>self.w-self.m+1 or i['y']+i['h']>self.h-self.m+1:issues.append({'code':'out_of_bounds','field':i.get('field')})
        for n,a in enumerate(content):
            for b in content[n+1:]:
                if min(a['x']+a['w'],b['x']+b['w'])-max(a['x'],b['x'])>.5 and min(a['y']+a['h'],b['y']+b['h'])-max(a['y'],b['y'])>.5:issues.append({'code':'content_overlap','fields':[a.get('field'),b.get('field')]})
        title=[i for i in content if i.get('field')=='title']
        if not title or min(i['y'] for i in title)>self.h*.2:issues.append({'code':'title_not_at_top'})
        if issues:raise FitError(json.dumps(issues,ensure_ascii=False))
        return {'onePagePlanned':True,'bounds':'passed','contentOverlap':'passed','textContrastMinimum':4.5,'titleAtTop':True,'visualReview':'pending'}

PROFILES={
 'standard':dict(m=48,g=24,pad=24,title=80,research=64,body=24,heading=24,core=32,small=18,sub=26,hgap=24,leading=1.32,tgap=12,footer=112),
 'compact':dict(m=40,g=16,pad=20,title=64,research=56,body=22,heading=24,core=28,small=17,sub=22,hgap=16,leading=1.26,tgap=12,footer=104),
 'dense':dict(m=32,g=12,pad=12,title=52,research=52,body=20,heading=20,core=24,small=16,sub=20,hgap=8,leading=1.20,tgap=8,footer=96)}
def compose(spec):
    if spec.get('kind','event') not in ('event','recruitment','research'):raise ValueError('kind: event, recruitment, research')
    if spec.get('orientation','portrait')!='portrait':raise ValueError('이 버전은 세로 포스터 전용입니다.')
    if 'groups' in spec:
        mixed=set(spec)&{'facts','sections','message','messageLabel','chart','image','figureCaption'}
        if mixed:raise ValueError('groups와 단순 배치 필드를 섞을 수 없습니다. 모든 정보를 groups로 옮기거나 단순 배치를 사용하세요: '+','.join(sorted(mixed)))
        from poster_hierarchy import compose as hierarchy_compose
        return hierarchy_compose(spec,Page,FitError,wrap,text,C)
    density=spec.get('density','auto')
    if density not in ('auto',*PROFILES):raise ValueError('density: auto/standard/compact/dense')
    trials=[]
    for name in PROFILES if density=='auto' else [density]:
        try:
            p,audit=compose_profile(spec,PROFILES[name])
            audit['density']=name;audit['layoutCandidates']=trials
            return p,audit
        except FitError as e:trials.append({'density':name,'reason':str(e)})
    raise FitError('허용 밀도 안에 배치할 수 없습니다: '+json.dumps(trials,ensure_ascii=False))

def compose_profile(spec,pr):
    kind=spec.get('kind','event')
    if kind not in ('event','recruitment','research'):raise ValueError('kind: event, recruitment, research')
    if spec.get('orientation','portrait')!='portrait':raise ValueError('이 버전은 세로 포스터 전용입니다.')
    p=Page(spec);m=p.m=pr['m'];w=p.w-2*m;g=pr['g'];pad=pr['pad'];hg=pr['hgap'];y=m
    p.block('eyebrow',spec.get('eyebrow',''),m,y,w,pr['small'],700,C['blue'],maxh=48)
    y+=pr['small']*1.32+hg
    y=p.title_block(m,y,w,pr['title'] if kind!='research' else pr['research'],276)+hg
    y=p.block('subtitle',spec.get('subtitle',''),m,y,w,pr['sub'],400,color=C['muted'],maxh=104)
    if spec.get('authors'):y=p.block('authors',spec['authors'],m,y+(8 if spec.get('subtitle') else 0),w,pr['small'],400,color=C['muted'],maxh=65)
    y+=hg
    p.line(m,y,w,C['navy'],4);p.line(m,y+10,w);y+=hg+16
    tiles=[]
    for n,f in enumerate(spec.get('facts',[])):
        tiles.append(dict(id=f'fact-{n}',title=f['label'],body=f['value'],span=3,role='fact'))
    if spec.get('message'):tiles.append(dict(id='message',title=spec.get('messageLabel','핵심 결과' if kind=='research' else '함께할 이야기'),body=spec['message'],span=6,role='message'))
    if spec.get('chart'):tiles.append(dict(id='chart',chart=spec['chart'],span=6,role='chart'))
    if spec.get('image'):tiles.append(dict(id='figure',image=spec['image'],title=spec.get('figureCaption',''),span=6,role='image'))
    for n,s in enumerate(spec.get('sections',[])):
        span=s.get('span',3)
        if span not in (2,3,4,6):raise ValueError('section span: 2/3/4/6')
        tiles.append(dict(id=f'section-{n}',title=s['title'],body=s.get('body',''),span=span,role='section'))
    if not tiles or len(tiles)>16:raise FitError('본문 묶음은 1~16개로 정리하세요.')
    if kind=='research' and not spec.get('sections'):raise FitError('학술 포스터의 방법/근거/한계가 필요합니다.')
    rows=[];row=[];used=0
    for tile in tiles:
        if used+tile['span']>6:rows.append(row);row=[];used=0
        row.append(tile);used+=tile['span']
        if used==6:rows.append(row);row=[];used=0
    if row:rows.append(row)
    def measure(t,cw):
        if t['role']=='chart':return 300
        if t['role']=='image':return 300
        ts=pr['small'] if t['role']=='fact' else pr['heading']
        bs=pr['core'] if t['role'] in ('fact','message') else pr['body']
        t['ts'],t['bs']=ts,bs
        return 2*pad+len(wrap(text(t['title']),cw-2*pad,ts,700))*ts*1.25+pr['tgap']+len(wrap(text(t.get('body','')),cw-2*pad,bs,700 if t['role'] in ('fact','message') else 400))*bs*pr['leading']
    # Six-column measure, unequal spans; final incomplete rows stretch to the same edges.
    for row in rows:
        total=sum(t['span'] for t in row)
        for t in row:t['cw']=(w-g*(len(row)-1))*t['span']/total
    heights=[max(measure(t,t['cw']) for t in row) for row in rows]
    footer_h=pr['footer'] if spec.get('cta') else 64
    bottom=p.h-m-footer_h
    available=bottom-y-g*len(rows)
    if sum(heights)>available:raise FitError(f'본문 높이 {sum(heights):.0f} > 허용 {available:.0f}. 필수 정보를 유지하며 문구/칸 너비를 재구성하세요. 설정된 글자 하한 아래로 축소하지 않습니다.')
    extra=(available-sum(heights))/len(rows)
    p.regions=[]
    for row,rh in zip(rows,heights):
        rh+=extra;x=m
        for t in row:
            cw=t['cw'];role=t['role'];key=t['id']
            bg=C['navy'] if role=='message' else C['pale'] if role=='fact' else C['soft']
            p.rect(x,y,cw,rh,bg)
            p.regions.append(dict(id=key,x=x,y=y,w=cw,h=rh,role=role,span=t['span']))
            if role=='chart':p.chart(t['chart'],x+24,y+24,cw-48,rh-48)
            elif role=='image':
                p.image(t['image'],x+24,y+24,cw-48,rh-100,key)
                p.block('figure-caption',t['title'],x+24,y+rh-60,cw-48,16,color=C['muted'],bg=bg,maxh=40)
            else:
                color=C['white'] if role=='message' else C['ink']
                yy=p.block(key+'-title',t['title'],x+pad,y+pad,cw-2*pad,t['ts'],700,color,bg,maxh=rh-2*pad,leading=1.25)+pr['tgap']
                p.block(key+'-body',t.get('body',''),x+pad,yy,cw-2*pad,t['bs'],700 if role in ('fact','message') else 400,color,bg,maxh=y+rh-pad-yy,leading=pr['leading'])
            x+=cw+g
        y+=rh+g
    p.line(m,bottom,w,C['navy'],3)
    yy=bottom+20
    if spec.get('cta'):yy=p.block('cta',spec['cta'],m,yy,w,28,700,color=C['navy'],maxh=45)+8
    p.block('footer',spec.get('footer',''),m,yy,w,16,color=C['muted'],maxh=p.h-m-yy)
    audit=p.audit()
    audit.update({'layout':'cmds-portrait-bento','gridColumns':6,'regions':len(tiles),'smallestFontPt':min(i['size']*p.scale for i in p.items if i['type']=='text')})
    return p,audit
def export_pdf(p,target):
    from reportlab.pdfgen.canvas import Canvas
    from reportlab.lib.colors import HexColor
    from reportlab.lib.utils import ImageReader
    from reportlab.pdfbase import pdfmetrics
    canvas=Canvas(str(target),pagesize=(p.w*p.scale,p.h*p.scale),pageCompression=1)
    canvas.setTitle(text(p.spec['title']));canvas.setCreator('Hallym Poster System '+VERSION)
    canvas.scale(p.scale,p.scale)
    for i in p.items:
        if i['type']=='rect':
            canvas.setFillColor(HexColor(i['color']));canvas.rect(i['x'],p.h-i['y']-i['h'],i['w'],i['h'],fill=1,stroke=0)
        elif i['type']=='text':
            name='P'+str(i['weight']);asc=pdfmetrics.getAscent(name)*i['size']/1000
            canvas.setFont(name,i['size']);canvas.setFillColor(HexColor(i['color']));canvas.drawString(i['x'],p.h-i['y']-asc,i['text'])
        else:canvas.drawImage(ImageReader(io.BytesIO(base64.b64decode(i['data']))),i['x'],p.h-i['y']-i['h'],i['w'],i['h'],mask='auto')
    canvas.showPage();canvas.save()

def _run(req):
    if isinstance(req.get('poster'),dict) and req['poster'].get('series'):
        from poster_series import run as run_series
        return run_series(req)
    if req.get('mode')=='doctor':
        import importlib.util
        deps={n:bool(importlib.util.find_spec(n)) for n in ('reportlab','pypdf','pypdfium2','PIL')}
        return {'status':'ready' if all(deps.values()) else 'needs-setup','dependencies':deps,'version':VERSION,'exitCode':0 if all(deps.values()) else 2}
    if req.get('mode','poster-create')!='poster-create':raise ValueError('지원 mode: poster-create, doctor')
    spec=req.get('poster')
    if not isinstance(spec,dict):raise ValueError('poster 명세가 필요합니다.')
    dpi=req.get('dpi',150)
    if not isinstance(dpi,(int,float)) or not math.isfinite(dpi) or not 72<=dpi<=300:raise ValueError('dpi는 72~300')
    from poster_web import share_config, validate_share
    share_config(spec)
    out=Path(req['outputDir']).resolve()
    if out.exists():raise FileExistsError('새 결과 폴더가 필요합니다: '+str(out))
    try:
        p,audit=compose(spec)
        validate_share(spec, FitError)
    except FitError as exc:
        out.mkdir(parents=True,exist_ok=False)
        result={'skill':'hallym-poster-system','version':VERSION,'status':'needs-content-or-layout-adjustment','exitCode':2,'issues':[str(exc)],'generated':False,'next':'필수 정보는 보존하고 묶음/배치/제목 줄바꿈/요약안을 조정한다. 사용자 지정 규격은 허락 없이 바꾸지 않는다.'}
        (out/'result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8');return result
    if p.w*p.scale/72*dpi*p.h*p.scale/72*dpi>100_000_000:raise ValueError('PNG 픽셀 한도: dpi를 낮춰 주세요.')
    out.mkdir(parents=True,exist_ok=False)
    export_pdf(p,out/'poster.pdf')
    from poster_web import export_html, export_share
    export_share(p,out)
    export_html(p,out/'poster.html')
    import pypdfium2 as pdfium
    from pypdf import PdfReader
    reader=PdfReader(out/'poster.pdf')
    if len(reader.pages)!=1:raise RuntimeError('PDF 한 페이지 검증 실패')
    page=reader.pages[0]
    if abs(float(page.mediabox.width)-p.w*p.scale)>.05 or abs(float(page.mediabox.height)-p.h*p.scale)>.05:raise RuntimeError('실제 PDF 규격 불일치')
    extracted=page.extract_text() or ''
    norm=lambda s:re.sub(r'\s+','',s)
    missing=[f['id'] for f in p.fields if norm(f['text']) not in norm(extracted)]
    if missing:raise RuntimeError('PDF 텍스트 보존 실패: '+','.join(missing))
    dpi=req.get('dpi',150)
    if not isinstance(dpi,(int,float)) or not math.isfinite(dpi) or not 72<=dpi<=300:raise ValueError('dpi는 72~300')
    if p.w*p.scale/72*dpi*p.h*p.scale/72*dpi>100_000_000:raise ValueError('PNG 픽셀 한도: dpi를 낮춰 주세요.')
    with pdfium.PdfDocument(out/'poster.pdf') as doc:
        pg=doc[0];bitmap=pg.render(scale=dpi/72);bitmap.to_pil().save(out/'poster.png');bitmap.close();pg.close()
    # Query real UI UX database. Its web palette/fonts never override the pinned poster brand.
    query='academic research conference poster information hierarchy' if spec.get('kind')=='research' else 'university event recruitment poster information hierarchy'
    r=subprocess.run([sys.executable,'-X','utf8','-B',str(ROOT/'vendor/ui-ux-pro-max/scripts/search.py'),query,'--design-system','--json','-p','Hallym Poster'],capture_output=True,text=True,encoding='utf-8',timeout=30)
    if r.returncode:raise RuntimeError('UI UX Pro Max 조회 실패: '+r.stderr[-300:])
    advice=json.loads(r.stdout)
    (out/'design-advice.json').write_text(json.dumps({'uiUxProMax':advice,'applied':['information hierarchy','grouping','reading order'],'overrides':['Hallym palette and Pretendard remain fixed','no UI motion, hover or slide splitting'],'impeccable':['layout rhythm','typeset hierarchy','polish contrast and alignment'],'visualReview':'pending'},ensure_ascii=False,indent=2),encoding='utf-8')
    (out/'poster-spec.json').write_text(json.dumps(spec,ensure_ascii=False,indent=2),encoding='utf-8')
    (out/'layout.json').write_text(json.dumps({'pageMm':p.mm,'items':p.items,'fields':p.fields,'regions':p.regions},ensure_ascii=False,indent=2),encoding='utf-8')
    result={'skill':'hallym-poster-system','version':VERSION,'viewerVersion':VERSION,'rendererSha256':sha(Path(__file__)),'viewerSha256':sha(ROOT/'scripts/poster_web.py'),'status':'generated-awaiting-visual-review','exitCode':0,'pageMm':p.mm,'pages':1,'fieldsPreserved':len(p.fields),'checks':audit,'pdfTextPreserved':True,'fontEmbeddedInPDF':all(bool(f.get_object().get('/FontDescriptor',{}).get_object().get('/FontFile2')) for f in page['/Resources']['/Font'].values() if f.get_object().get('/Subtype')=='/TrueType'),'pngDpi':dpi,'sharing':share_config(spec),'printScope':'RGB PDF, exact trim size, no bleed or PDF/X/CMYK certification','outputs':[{ 'path':f.name,'sha256':sha(f)} for f in out.iterdir() if f.is_file()]}
    (out/'result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8');return result

def run(req):
    output=Path(req['outputDir']).resolve() if req.get('outputDir') else None
    existed=bool(output and output.exists())
    try:return _run(req)
    except Exception as exc:
        result={'skill':'hallym-poster-system','version':VERSION,'status':'error','exitCode':1,'generated':False,'type':type(exc).__name__,'message':str(exc),'partialArtifacts':'not deliverable; fix issue and use new output directory'}
        if output and not existed:
            output.mkdir(parents=True,exist_ok=True)
            (output/'result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
        return result

if __name__=='__main__':
    sys.stdout.reconfigure(encoding='utf-8');sys.stderr.reconfigure(encoding='utf-8')
    try:
        req={'mode':'doctor'} if sys.argv[1:]==['doctor'] else read(sys.argv[1]);result=run(req);print(json.dumps(result,ensure_ascii=False,indent=2));sys.exit(result.get('exitCode',0))
    except Exception as exc:print(json.dumps({'status':'error','exitCode':1,'type':type(exc).__name__,'message':str(exc)},ensure_ascii=False));sys.exit(1)
