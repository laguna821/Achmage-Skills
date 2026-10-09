"""Poster series: semantic HTML scenes and independently composed A2 paper."""
from pathlib import Path
import base64, hashlib, html, io, json, math, re, shutil, subprocess, sys
from urllib.parse import urlparse
import xml.etree.ElementTree as ET
from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.colors import HexColor, CMYKColor, Color
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader, PdfWriter
from pypdf.generic import RectangleObject, DictionaryObject, NameObject, NumberObject, TextStringObject, ArrayObject, DecodedStreamObject, ContentStream
from PIL import Image, ImageCms, ImageDraw, ImageFont
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPDF
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.barcode.qr import QrCodeWidget

ROOT=Path(__file__).resolve().parents[1]
VERSION="1.2.0-rc.5"
PAPER_VERSION="1.2.0-rc.4" # unchanged paper renderer; preserve existing PDF bytes
MARGINS={"A":(30,40,30,30),"B":(20,25,20,20),"C":(50,60,40,40)}
MM=72/25.4
NAVY="#002E6E"
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def dump(p,x):Path(p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
def esc(s):return html.escape(str(s),quote=True)
def safe_url(u):
    if urlparse(u).scheme not in ("https","http"):raise ValueError("Public links require http(s)")
    return u
def strings(b):
    return [str(b[k]) for k in ("kicker","title","subtitle","body","note") if b.get(k)]+[str(t) for row in b.get("items",[]) for t in row if t]
def validate(s):
    if s.get("schemaVersion")!=2:raise ValueError("series-v2 requires schemaVersion 2; existing v1 outputs retain their pinned renderer")
    if not s.get("title") or not s.get("content") or not s.get("scenes"):raise ValueError("title/content/scenes required")
    ids=[b["id"] for b in s["content"]]
    if len(set(ids))!=len(ids):raise ValueError("Duplicate content id")
    if any(not re.fullmatch(r"[a-z0-9][a-z0-9-]*",x) for x in ids):raise ValueError("Stable content ids required")
    for b in s["content"]:
        if not b.get("title"):raise ValueError("Each content block needs a title")
        if any(not isinstance(row,list) or len(row)!=2 for row in b.get("items",[])):raise ValueError("items require two text columns")
        if "url" in b:safe_url(b["url"])
    if s.get("defaultTheme","alternating") not in ("alternating","authored","light","dark"):raise ValueError("Invalid default theme")
    scenes=s["scenes"]
    if len(scenes)>24 or len({x["id"] for x in scenes})!=len(scenes):raise ValueError("1–24 unique scenes required")
    for sc in scenes:
        if not re.fullmatch(r"[a-z0-9][a-z0-9-]*",sc["id"]):raise ValueError("Stable scene id required")
        if not sc.get("refs") or any(x not in ids for x in sc["refs"]):raise ValueError("Unknown scene content ref")
        if sc.get("theme","light") not in ("light","dark"):raise ValueError("Invalid theme")
        if isinstance(sc.get("seconds"),bool) or not isinstance(sc.get("seconds",4),(int,float)) or not math.isfinite(sc.get("seconds",4)) or not 1<=sc.get("seconds",4)<=120:raise ValueError("Scene duration 1–120 seconds")
    composition=s.get("composition",{})
    if composition.get("mode")!="complete-posters":raise ValueError("Complete poster composition required")
    shared=composition.get("sharedRefs",[])
    if not shared or any(x not in ids for x in shared):raise ValueError("Shared identity and essential information refs required")
    if not all(s.get("frame",{}).get(x) for x in ("title","date","place")):raise ValueError("Every poster requires event identity/date/place")
    first=next(b for b in s["content"] if b["id"]==shared[0])
    if first["title"]!=s["title"] or not first.get("body"):raise ValueError("First shared block must carry full poster title and key message")
    if len(shared)<2:raise ValueError("Shared participation or essential context block required")
    for sc in scenes:
        if len(set(sc["refs"]))!=len(sc["refs"]):raise ValueError("Duplicate refs within poster")
        if not set(shared)<=set(sc["refs"]):raise ValueError("Every poster must repeat shared essentials")
        if not sc.get("focus"):raise ValueError("Each complete poster needs an editorial focus")
    if len(scenes)>1:
        if len(composition.get("splitReason","").strip())<20:raise ValueError("Explain why one complete poster is insufficient")
        byid={b["id"]:b for b in s["content"]}
        weights=[]
        for sc in scenes:
            detail=set(sc["refs"])-set(shared)
            weight=sum(len("".join(strings(byid[k]))) for k in detail)
            if weight<160:raise ValueError("Sparse leftover page: redistribute full poster content")
            weights.append(weight)
        if min(weights)/max(weights)<.4:raise ValueError("Unbalanced poster detail: recompose the whole set")
        if len({tuple(sorted(set(sc["refs"])-set(shared))) for sc in scenes})!=len(scenes):raise ValueError("Repeated page without distinct detail is not additional content")
    covered={i for sc in scenes for i in sc["refs"]}
    pp=s["print"]
    if "rows" in pp and "pages" in pp:raise ValueError("Choose print.rows OR explicit print.pages")
    pages=pp.get("pages",[{"id":"paper","rows":pp.get("rows",[])}])
    if not 1<=len(pages)<=24 or len({p.get("id") for p in pages})!=len(pages):raise ValueError("Unique explicit print pages required")
    if len(pages)>1 and (pp.get("allowMultiplePages") is not True or len(pp.get("multiPageReason","").strip())<20):raise ValueError("A2 defaults to one independently edited sheet; multiple paper pages require explicit user reason")
    for page in pages:
        if not re.fullmatch(r"[a-z0-9][a-z0-9-]*",page.get("id","")):raise ValueError("Stable print page id required")
        refs=[i for row in page.get("rows",[]) for i in row]
        if not refs or any(i not in ids for i in refs) or len(refs)!=len(set(refs)):raise ValueError("Invalid print page refs")
        if any(not 1<=len(row)<=3 for row in page["rows"]):raise ValueError("Print rows require 1–3 blocks")
        if not set(shared)<=set(refs):raise ValueError("Every print poster must repeat shared essentials")
        if len(pages)>1 and not page.get("focus"):raise ValueError("Every print poster needs an editorial focus")
    print_refs={i for page in pages for row in page["rows"] for i in row}
    if covered!=set(ids) or print_refs!=set(ids):raise ValueError("All content must occur in screen AND print")
    if s["print"].get("margin","A") not in MARGINS:raise ValueError("Unknown margin preset")
    if s["print"].get("iccProfile"):PrintPalette(s["print"])
    if s.get("publishUrl"):public_url(s["publishUrl"])
    for a in s.get("logos",[]):
        if not a.get("source") or not a.get("role"):raise ValueError("Logo provenance and role required")
        if not a.get("fileDark") or not a.get("darkProvenance"):raise ValueError("Light/dark SVG pair and dark provenance required")
        for variant in ("file","fileDark"):
            file=Path(a[variant])
            if file.suffix.lower()!=".svg":raise ValueError("Series logos must be vector SVG")
            data=file.read_text(encoding="utf-8")
            if re.search(r"url\s*\(|@import|<!ENTITY",data,re.I):raise ValueError("SVG external styling/entities rejected")
            root=ET.fromstring(data)
            if any(el.tag.split("}")[-1] in ("script","foreignObject","image") for el in root.iter()):raise ValueError("Vector-only SVG required")
            if any(k.lower().startswith("on") or k.split("}")[-1]=="href" for el in root.iter() for k in el.attrib):raise ValueError("Active or external SVG rejected")
            if not any(el.tag.split("}")[-1] in ("path","circle","rect","polygon") for el in root.iter()):raise ValueError("No vector geometry")
    return s

def block_html(b):
    parts=[f'<article class="block {esc(b.get("style",""))}" data-content-id="{esc(b["id"])}">']
    if b.get("kicker"):parts.append(f'<p class="eyebrow">{esc(b["kicker"])}</p>')
    parts.append(f'<h2>{esc(b["title"])}</h2>')
    if b.get("subtitle"):parts.append(f'<p class="subtitle">{esc(b["subtitle"])}</p>')
    if b.get("body"):parts.append(f'<p class="body">{esc(b["body"]).replace(chr(10),"<br>")}</p>')
    if b.get("items"):
        parts.append(f'<dl class="items" style="--rows:{math.ceil(len(b["items"])/2)}">')
        for i,row in enumerate(b["items"]):parts.append(f'<div class="item" data-item="{i}"><dt>{esc(row[0])}</dt><dd>{esc(row[1])}</dd></div>')
        parts.append('</dl>')
    if b.get("note"):parts.append(f'<p class="note">{esc(b["note"])}</p>')
    if b.get("url"):parts.append(f'<a class="source-link" href="{esc(b["url"])}" target="_blank" rel="noopener">{esc(b.get("linkLabel","행사 정보"))} ↗</a>')
    parts.append("</article>")
    return "".join(parts)

def public_url(value):
    u=urlparse(value)
    if u.scheme!="https" or not u.hostname or "." not in u.hostname or u.username or u.password or u.query or u.fragment or not u.path.endswith("/") or u.hostname in ("localhost","example.com"):
        raise ValueError("publishUrl requires a real HTTPS directory URL without credentials/query/fragment")
    return value

def share_image(s,out):
    # Dedicated 2:1 share artwork; a print proof is not a link preview.
    im=Image.new("RGB",(1200,600),"#F6F8F7");d=ImageDraw.Draw(im)
    font=lambda size,w=700:ImageFont.truetype(str(ROOT/f"assets/fonts/Pretendard{w}.ttf"),size)
    d.rectangle((0,0,1200,12),fill="#00B5AD")
    d.rectangle((0,490,1200,600),fill=NAVY)
    def fit_lines(value,size,width):
        f=font(size);lines=[]
        for para in value.splitlines():
            line=""
            for c in para:
                if line and d.textlength(line+c,font=f)>width:lines.append(line.rstrip());line=""
                line+=c
            if line:lines.append(line.rstrip())
        return lines,f
    title=s.get("shareTitle",s["title"])
    for size in (66,62,58,54,50):
        lines,f=fit_lines(title,size,1072)
        if len(lines)<=3:break
    else:raise ValueError("Sharing title too long; provide a factual concise shareTitle")
    eyebrow=s["frame"]["title"]
    if d.textlength(eyebrow,font=font(26))>1072:raise ValueError("Sharing event label too long")
    d.text((64,49),eyebrow,font=font(26),fill="#0066B3")
    y=113
    for line in lines:d.text((64,y),line,font=f,fill="#143449");y+=size+12
    details=[s["frame"]["date"],s["frame"]["place"]]
    for i,line in enumerate(details):
        if d.textlength(line,font=font(27,400))>1072:raise ValueError("Sharing date/place too long")
        d.text((64,384+i*40),line,font=font(27,400),fill="#304B60")
    status=s.get("statusLabel","")
    if d.textlength(status,font=font(23,400))>760:raise ValueError("Sharing status label too long")
    d.text((64,530),status,font=font(23,400),fill="white")
    d.text((927,528),"HTML · A2 PDF",font=font(23),fill="#78E6DB")
    blob=io.BytesIO();im.save(blob,format="PNG",optimize=True);data=blob.getvalue()
    name="og-"+hashlib.sha256(data).hexdigest()[:12]+".png";(out/name).write_bytes(data)
    return {"imageFile":name,"imageSha256":sha(out/name),"width":1200,"height":600,"mime":"image/png","alt":" ".join(title.split())}

def sharing_metadata(s,share):
    if not s.get("publishUrl") or not share:return ""
    url=public_url(s["publishUrl"]);title=" ".join(s.get("shareTitle",s["title"]).split())
    values={"og:type":"website","og:locale":"ko_KR","og:title":title,"og:description":s.get("description",title),"og:url":url,"og:image":url+share["imageFile"],"og:image:secure_url":url+share["imageFile"],"og:image:type":share["mime"],"og:image:width":share["width"],"og:image:height":share["height"],"og:image:alt":share["alt"]}
    return '<link rel="canonical" href="'+esc(url)+'">'+"".join('<meta property="'+k+'" content="'+esc(v)+'">' for k,v in values.items())

def html_document(s,out,pdf_bytes,*,published=False,share=None):
    byid={b["id"]:b for b in s["content"]}
    fonts=""
    for w in (400,700,800):
        src=f"pretendard-{w}.woff2" if published else "data:font/woff2;base64,"+base64.b64encode((ROOT/f"assets/fonts/Pretendard{w}.woff2").read_bytes()).decode()
        fonts+="@font-face{font-family:Pretendard;font-style:normal;font-weight:"+str(w)+";font-display:swap;src:url("+src+") format('woff2');}"

    logos=[]
    for i,a in enumerate(s.get("logos",[])):
        light=base64.b64encode(Path(a["file"]).read_bytes()).decode()
        dark=base64.b64encode(Path(a["fileDark"]).read_bytes()).decode()
        logos.append(f'<span class="brand"><span class="brand-symbol" role="img" aria-label="{esc(a["name"])}"><img class="logo-light" src="data:image/svg+xml;base64,{light}" alt=""><img class="logo-dark" src="data:image/svg+xml;base64,{dark}" alt=""></span><span><small>{esc(a["role"])}</small><strong>{esc(a["name"])}</strong></span></span>')
    scenes=[]
    for n,sc in enumerate(s["scenes"]):
        scenes.append(f'<section class="scene" id="{esc(sc["id"])}" data-origin="{esc(sc["id"])}" data-theme="{sc.get("theme","light")}" data-seconds="{sc.get("seconds",4)}" aria-label="{esc(sc["label"])}"><div class="scene-inner poster-sheet"><div class="scene-heading"><span>{esc(sc["label"])}</span><span class="sequence">{n+1:02d}</span></div><div class="scene-content poster-layout">')
        for x in sc["refs"]:
            scenes.append(block_html(byid[x]))
            if x==s["composition"]["sharedRefs"][0]:
                scenes.append(f'<div class="poster-facts"><div><small>일시</small><strong>{esc(s["frame"]["date"])}</strong></div><div><small>장소</small><strong>{esc(s["frame"]["place"])}</strong></div></div>')
        scenes.append("</div></div></section>")
    reading="".join(block_html(b) for b in s["content"]).replace('<h2>','<h1>',1).replace('</h2>','</h1>',1)
    reading=f'<p>{esc(s["frame"]["date"])} · {esc(s["frame"]["place"])}</p>'+reading
    css=(ROOT/"scripts/series.css").read_text(encoding="utf-8")
    js=(ROOT/"scripts/series.js").read_text(encoding="utf-8")
    metadata=sharing_metadata(s,share)
    pdf_hash=hashlib.sha256(pdf_bytes).hexdigest()
    pdf=f"poster.pdf?v={pdf_hash[:12]}"
    config={"title":s["title"],"pdf":"" if published else base64.b64encode(pdf_bytes).decode(),"autoplay":s.get("autoplay",True),"composition":"complete-posters","defaultTheme":s.get("defaultTheme","alternating")}
    data=json.dumps(config,ensure_ascii=False).replace("<","\\u003c")
    initial=s.get("defaultTheme","alternating")
    initial=s["scenes"][0].get("theme","light") if initial=="authored" else "light" if initial=="alternating" else initial
    return f'''<!doctype html>
<html lang="ko" data-theme="{initial}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="{'#0c1c31' if initial=='dark' else '#f6f8f7'}">
<title>{esc(s["title"])}</title><meta name="description" content="{esc(s.get("description",s["title"]))}">
{metadata}<style>{fonts}{css}</style></head><body>
<a class="skip" href="#reading">전체 내용 읽기</a>
<div class="poster-shell">
<header class="frame top"><div class="brands">{"".join(logos)}</div><span class="frame-title">{esc(s["frame"]["title"])}</span><button id="tools-toggle" class="icon-button" aria-label="보기 설정" aria-controls="tools" aria-expanded="false">···</button>
<div id="tools" class="tools" hidden><p>보기 설정</p><label for="theme">전체 화면 테마</label><select id="theme"><option value="alternating">라이트 · 다크 교차 (기본)</option><option value="authored">포스터별 지정 테마</option><option value="light">라이트</option><option value="dark">다크</option></select>
<a id="pdf" href="{pdf}" target="_blank" rel="noopener">A2 PDF 보기 ↗</a><button id="read-open">전체 내용 크게 읽기</button><button id="copy-link">현재 포스터 링크 복사</button><a href="poster.pdf" download>PDF 파일 저장</a><small>PDF는 화면과 별도로 편집한 A2 종이 포스터입니다.</small></div></header>
<main id="stage" aria-roledescription="순환 포스터">{"".join(scenes)}</main>
<footer class="frame bottom"><div class="event-meta"><strong>{esc(s["frame"]["date"])}</strong><span>{esc(s["frame"]["place"])}</span><small>{esc(s.get("statusLabel",""))}</small></div><nav class="playback" aria-label="포스터 이동"><button id="prev" class="icon-button" aria-label="이전 포스터">‹</button><button id="scene-menu" class="counter" aria-label="포스터 목차" aria-controls="chapters" aria-expanded="false">1 / {len(scenes)}</button><button id="play" class="icon-button" aria-label="자동 순환 정지">Ⅱ</button><button id="next" class="icon-button" aria-label="다음 포스터">›</button></nav><button id="single-read" class="single-read">크게 읽기 ↗</button><div class="progress" aria-hidden="true"><i></i></div></footer>
</div>
<div id="chapters" class="chapters" hidden><strong>바로 보기</strong><div id="chapter-links"></div><button id="chapters-close">닫기</button></div>
<div id="reading" class="reading" role="dialog" aria-modal="true" aria-label="전체 내용 읽기"><header><strong>{esc(s["frame"]["title"])}</strong><button id="read-close">포스터로 돌아가기</button></header><main><p class="eyebrow">{esc(s.get("statusLabel",""))}</p>{reading}<a href="{pdf}" target="_blank" rel="noopener">A2 PDF 보기 ↗</a></main></div>
<p id="notice" class="notice" role="status" aria-live="polite"></p>
<script type="application/json" id="series-config">{data}</script><script>{js}</script></body></html>'''

def wrap(value,width,size,weight=400):
    result=[]
    for para in str(value).splitlines():
        line=""
        for word in para.split():
            joined=(line+" "+word).strip()
            if pdfmetrics.stringWidth(joined,"P"+str(weight),size)<=width:
                line=joined
            else:
                if line:result.append(line)
                line=""
                for char in word:
                    if line and pdfmetrics.stringWidth(line+char,"P"+str(weight),size)>width:
                        result.append(line);line=""
                    line+=char
        result.append(line)
    return result or [""]


class PrintPalette:
    """Convert vector/text colors through an explicit output ICC; never guess a press."""
    def __init__(self, pp):
        self.path=Path(pp["iccProfile"]) if pp.get("iccProfile") else None
        self.cache={}
        self.transform=None
        if self.path:
            data=self.path.read_bytes()
            if len(data)<128 or data[16:20]!=b"CMYK" or data[12:16]!=b"prtr":raise ValueError("CMYK output ICC required")
            profile=ImageCms.getOpenProfile(str(self.path))
            self.name=ImageCms.getProfileDescription(profile).strip()
            self.transform=ImageCms.buildTransformFromOpenProfiles(ImageCms.createProfile("sRGB"),profile,"RGB","CMYK",renderingIntent=1)
            self.digest=sha(self.path)
    def __call__(self, value):
        c=HexColor(value) if isinstance(value,str) else (Color(*value) if len(value)==3 else CMYKColor(*value)) if isinstance(value,(tuple,list)) else value
        if c is None or not self.transform or isinstance(c,CMYKColor):return c
        rgb=tuple(round(v*255) for v in (c.red,c.green,c.blue))
        if rgb==(0,0,0):return CMYKColor(0,0,0,1)
        if rgb not in self.cache:
            px=ImageCms.applyTransform(Image.new("RGB",(1,1),rgb),self.transform).getpixel((0,0))
            self.cache[rgb]=CMYKColor(*(v/255 for v in px),alpha=getattr(c,"alpha",1))
        return self.cache[rgb]
    def drawing(self,d):
        if self.transform:
            for attr in ("fillColor","strokeColor"):
                if hasattr(d,attr) and getattr(d,attr) is not None:setattr(d,attr,self(getattr(d,attr)))
            for child in getattr(d,"contents",[]):self.drawing(child)
        return d
    def embed(self,writer):
        if not self.transform:return
        stream=DecodedStreamObject();stream.set_data(self.path.read_bytes());stream[NameObject("/N")]=NumberObject(4)
        intent=DictionaryObject({NameObject("/Type"):NameObject("/OutputIntent"),NameObject("/S"):NameObject("/GTS_PDFX"),NameObject("/OutputConditionIdentifier"):TextStringObject(self.name),NameObject("/Info"):TextStringObject(self.name),NameObject("/DestOutputProfile"):writer._add_object(stream)})
        writer._root_object[NameObject("/OutputIntents")]=ArrayObject([writer._add_object(intent)])
    def audit(self):
        if not self.transform:return {"printStatus":"needs-print-profile","colorSpace":"RGB proof; output ICC not provided"}
        return {"printStatus":"prepared-cmyk","colorSpace":"ICC-managed CMYK","outputProfile":{"name":self.name,"sha256":self.digest,"assumption":"Printer/stock must confirm this output condition; not PDF/X certification"}}

def paper_preflight(path):
    reader=PdfReader(path);used_fonts=[];rgb=0;cmyk=0
    for page in reader.pages:
        for value in page["/Resources"].get("/Font",{}).values():
            font=value.get_object();descriptor=font.get("/FontDescriptor")
            embedded=bool(descriptor and any(descriptor.get_object().get(k) for k in ("/FontFile","/FontFile2","/FontFile3")))
            if not embedded:raise ValueError("Paper contains an unembedded font")
            used_fonts.append(str(font.get("/BaseFont")))
        for _,op in ContentStream(page.get_contents(),reader).operations:
            rgb+=op in (b"rg",b"RG");cmyk+=op in (b"k",b"K")
    return {"embeddedFonts":sorted(set(used_fonts)),"rgbOperators":rgb,"cmykOperators":cmyk}

def remove_unpainted_fonts(page,writer):
    stream=ContentStream(page.get_contents(),writer);current=None;stack=[];used=set()
    for values,op in stream.operations:
        if op==b"q":stack.append(current)
        elif op==b"Q":current=stack.pop() if stack else current
        elif op==b"Tf":current=values[0]
        elif op in (b"Tj",b"TJ",b"'",b'"') and current:
            used.add(current)
    fonts=page["/Resources"].get("/Font",{})
    if hasattr(fonts,"get_object"):fonts=fonts.get_object()
    unused=set(fonts)-used
    stream.operations=[(values,op) for values,op in stream.operations if not(op==b"Tf" and values[0] in unused)]
    for name in unused:del fonts[name]
    page[NameObject("/Contents")]=writer._add_object(stream)

def paper_single(s,out):
    for w in (400,700,800):
        if "P"+str(w) not in pdfmetrics.getRegisteredFontNames():pdfmetrics.registerFont(TTFont("P"+str(w),str(ROOT/f"assets/fonts/Pretendard{w}.ttf")))
    top,bottom,left,right=MARGINS[s["print"].get("margin","A")]
    W,H=424*MM,598*MM; trim_w=420*MM; x=(2+left)*MM; y=(2+top)*MM
    content_w=(420-left-right)*MM; bottom_limit=(2+594-bottom)*MM
    palette=PrintPalette(s["print"])
    academic=s["print"].get("layout")=="academic-one-sheet"
    cv=Canvas(str(out/"poster.pdf"),pagesize=(W,H),pageCompression=1,invariant=1,enforceColorSpace=palette if palette.transform else None)
    cv.setTitle(s["title"]);cv.setCreator("Hallym Poster Series "+PAPER_VERSION)
    cv.setFillColor(palette("#FAFCFD"));cv.rect(0,0,W,H,fill=1,stroke=0)
    audit=[]; fields=[]
    def rect(xx,yy,ww,hh,color):
        cv.setFillColor(palette(color));cv.rect(xx,H-yy-hh,ww,hh,fill=1,stroke=0)
    def lines(value,xx,yy,ww,size,weight=400,color="#132F4A",leading=1.38,field=None):
        ll=wrap(value,ww,size,weight)
        cv.setFillColor(CMYKColor(0,0,0,1) if palette.transform and size<=24 and color in ("#132F4A","#455A70","#526478") else palette(color));cv.setFont("P"+str(weight),size)
        for line in ll:
            cv.drawString(xx,H-yy-size*.82,line);yy+=size*leading
        if field:fields.append({"id":field,"text":str(value)})
        return yy
    # A restrained masthead, independent of the screen's fixed navy frame.
    brand_y=y; logo_regions=[]
    for a in s.get("logos",[]):
        label_w=max(pdfmetrics.stringWidth(a['name'],'P700',17),pdfmetrics.stringWidth(a['role'],'P400',10))
        lockup_w=17*MM+label_w
        if x+lockup_w>(2+left)*MM+content_w:raise ValueError('Logo strip overflow: design a compact lockup; do not spread or distort marks')
        logo_regions.append({'name':a['name'],'xMm':x/MM,'widthMm':lockup_w/MM,'heightMm':13,'gapAfterMm':12})
        drawing=svg2rlg(a["file"])
        if not drawing:raise ValueError("Cannot parse vector logo")
        palette.drawing(drawing)
        scale=min(13*MM/drawing.width,13*MM/drawing.height)
        drawing.scale(scale,scale);renderPDF.draw(drawing,cv,x,H-y-13*MM)
        lines(a["role"],x+17*MM,y+1*MM,100*MM,10,400,"#526478")
        lines(a["name"],x+17*MM,y+6*MM,100*MM,17,700)
        # A shared left-aligned logo strip: size each lockup from its actual text,
        # never distribute co-organizer marks over the width of the poster.
        x+=17*MM+label_w+12*MM
    x=(2+left)*MM;y+=22*MM
    rect(x,y,content_w,1.1*MM,NAVY);y+=9*MM
    y=lines(s.get("eyebrow",s["title"]),x,y,content_w,14,700,"#0066B3",field="eyebrow")+5*MM
    y=lines(s["title"],x,y,content_w,49,800,NAVY,1.14,field="title")+6*MM
    if s["print"].get("focus"):y=lines(s["print"]["focus"],x,y,content_w,22,700,"#0066B3",field="paper-focus")+4*MM
    y=lines(s["frame"]["date"]+"  ·  "+s["frame"]["place"],x,y,content_w,17,700,field="event-meta")+10*MM
    byid={b["id"]:b for b in s["content"]}
    size=s["print"].get("bodySizePt",18)
    def types(b):
        return [("kicker",12,700,"#0066B3"),("title",26 if academic else 28,800,NAVY),("subtitle",14,700,"#455A70"),("body",22 if b.get("style")=="speaker" else size,400,"#132F4A")]
    def measure(b,w):
        ht=0
        for k,sz,weight,_ in types(b):
            if b.get(k) and not ((k=='title' and b[k]==s['title']) or (k=='kicker' and b[k].casefold()==s.get('eyebrow','').casefold())):ht+=len(wrap(b[k],w,sz,weight))*sz*1.38+7
        for pair in b.get("items",[]):
            ht+=max(len(wrap(pair[0],w*.3,13,700))*17.94,len(wrap(pair[1],w*.66,size-1,400))*(size-1)*1.38)+5
        if b.get("note"):ht+=len(wrap(b["note"],w,12,400))*16.56+7
        if b.get("url"):ht+=24
        return ht+18
    for row in s["print"]["rows"]:
        gap=9*MM;colw=(content_w-gap*(len(row)-1))/len(row)
        heights=[measure(byid[k],colw) for k in row];rh=max(heights)
        if y+rh>bottom_limit-13*MM:raise ValueError("A2 content overflow: re-edit rows or choose margin B")
        for n,ident in enumerate(row):
            b=byid[ident];xx=x+n*(colw+gap);yy=y
            rect(xx,yy,colw,1.0*MM if academic else .45*MM,"#0066B3" if academic else "#A9BDC9");yy+=5*MM
            for k,sz,weight,color in types(b):
                if b.get(k) and not ((k=='title' and b[k]==s['title']) or (k=='kicker' and b[k].casefold()==s.get('eyebrow','').casefold())):yy=lines(b[k],xx,yy,colw,sz,weight,color,field=ident+"-"+k)+7
            for j,pair in enumerate(b.get("items",[])):
                a=lines(pair[0],xx,yy,colw*.3,13,700,field=f"{ident}-{j}-a")
                btm=lines(pair[1],xx+colw*.34,yy,colw*.66,size-1,field=f"{ident}-{j}-b")
                yy=max(a,btm)+5
            if b.get("note"):yy=lines(b["note"],xx,yy,colw,12,400,"#526478",field=ident+"-note")+7
            if b.get("url"):
                label=b.get("linkLabel","발표 원문 보기")+" ↗"
                ly=yy;yy=lines(label,xx,yy,colw,12,700,"#0066B3",field=ident+"-source")+7
                cv.linkURL(b["url"],(xx,H-yy,xx+colw,H-ly+2),relative=0)
            audit.append({"id":ident,"x":xx/MM,"y":y/MM,"width":colw/MM,"height":(yy-y)/MM,"withinSafeArea":yy<=bottom_limit})
        y+=rh+6*MM
    y=bottom_limit-6*MM
    lines(s.get("statusLabel",""),x,y,content_w*.55,10,700)
    if s.get("sourceUrl"):
        safe_url(s["sourceUrl"])
        if academic:
            # A printed sheet needs a scannable route, not only clickable PDF labels.
            code=QrCodeWidget(s["sourceUrl"],barLevel="M")
            bounds=code.getBounds();qrsize=22*MM;factor=qrsize/(bounds[2]-bounds[0])
            group=code.draw()
            def qr_colors(node):
                for attr in ("fillColor","strokeColor"):
                    c=getattr(node,attr,None)
                    if c is not None:setattr(node,attr,CMYKColor(0,0,0,0 if c.red>.9 else 1) if palette.transform else c)
                for child in getattr(node,"contents",[]):qr_colors(child)
            qr_colors(group)
            drawing=Drawing(qrsize,qrsize,transform=[factor,0,0,factor,0,0]);drawing.add(group)
            qx=x+content_w-qrsize;qy=bottom_limit-qrsize
            renderPDF.draw(drawing,cv,qx,H-qy-qrsize)
            lines("행사 기록 · 발표자료",qx-60*MM,qy+7*MM,58*MM,11,700)
            lines("QR로 원문 확인",qx-60*MM,qy+13*MM,58*MM,10,400)
            cv.linkURL(s["sourceUrl"],(qx,H-qy-qrsize,qx+qrsize,H-qy),relative=0)
        else:
            lines("행사 원문 · 프로그램 안내 ↗",x+content_w*.6,y,content_w*.4,10,700)
            cv.linkURL(s["sourceUrl"],(x+content_w*.6,H-y-15,x+content_w,H-y+3),relative=0)
    cv.showPage();cv.save()
    reader=PdfReader(out/"poster.pdf");pg=reader.pages[0]
    pg.trimbox=RectangleObject([2*MM,2*MM,422*MM,596*MM]);pg.bleedbox=RectangleObject([0,0,W,H])
    writer=PdfWriter();writer.add_page(pg);writer.add_metadata(reader.metadata);palette.embed(writer)
    remove_unpainted_fonts(writer.pages[0],writer)
    with (out/"poster.pdf").open("wb") as f:writer.write(f)
    pdf=PdfReader(out/"poster.pdf");text=pdf.pages[0].extract_text()
    norm=lambda t:re.sub(r"\s+","",t)
    missing=[f["id"] for f in fields if norm(f["text"]) not in norm(text)]
    if missing:raise ValueError("PDF text missing: "+",".join(missing))
    return {"pages":1,"trimMm":[420,594],"mediaMm":[424,598],"bleedMm":2,"marginPreset":s["print"].get("margin","A"),"fields":len(fields),"missingFields":missing,"regions":audit,"logoStrip":logo_regions,**palette.audit(),"vectorLogos":True}

def paper(s,out):
    pages=s["print"].get("pages")
    if not pages:return paper_single(s,out)
    # Paper composition is explicit, never inferred from screen scenes.
    writer=PdfWriter();audits=[]
    for n,page in enumerate(pages):
        part=json.loads(json.dumps(s));part["print"].pop("pages")
        part["print"].update(rows=page["rows"],focus=page["focus"])
        folder=out/("paper-part-"+str(n+1));folder.mkdir()
        a=paper_single(part,folder);reader=PdfReader(folder/"poster.pdf")
        writer.add_page(reader.pages[0]);a["id"]=page["id"];a["focus"]=page["focus"];a["page"]=n+1
        audits.append(a)
        (folder/"poster.pdf").unlink();folder.rmdir()
    writer.add_metadata({"/Title":s["title"],"/Creator":"Hallym Poster Series "+PAPER_VERSION});PrintPalette(s["print"]).embed(writer)
    with (out/"poster.pdf").open("wb") as f:writer.write(f)
    return {**audits[0],"pages":len(pages),"fields":sum(a["fields"] for a in audits),
        "missingFields":[x for a in audits for x in a["missingFields"]],
        "regions":[{**r,"page":a["page"]} for a in audits for r in a["regions"]],
        "pageAudits":audits,"composition":"explicit-independent-pages"}

def run(req):
    s=validate(req["poster"]["series"])
    out=Path(req["outputDir"]).resolve()
    if out.exists():raise FileExistsError("New output directory required")
    out.mkdir(parents=True)
    audit=paper(s,out)
    audit["preflight"]=paper_preflight(out/"poster.pdf")
    if audit["printStatus"]=="prepared-cmyk" and audit["preflight"]["rgbOperators"]:raise ValueError("RGB operator in prepared CMYK paper")
    query="academic research conference poster information hierarchy accessible carousel"
    proc=subprocess.run([sys.executable,"-X","utf8","-B",str(ROOT/"vendor/ui-ux-pro-max/scripts/search.py"),query,"--design-system","--json","-p","Poster Series"],capture_output=True,text=True,encoding="utf-8",timeout=30)
    if proc.returncode:raise RuntimeError("Design consultation failed")
    dump(out/"design-advice.json",{"query":query,"advice":json.loads(proc.stdout),"applied":["information hierarchy","speaker grouping","reading order"],"overrides":["Hallym brand/Pretendard","no fabricated urgency","four-second alternating cycle; width-first shared mobile fit; independent one-sheet paper; whole-poster theme; dual SVG logos"],"visualReview":"pending"})
    pdf=(out/"poster.pdf").read_bytes()
    share=share_image(s,out)
    public_files={}
    for w in (400,700,800):
        name=f"pretendard-{w}.woff2";shutil.copy2(ROOT/f"assets/fonts/Pretendard{w}.woff2",out/name);public_files[name]=sha(out/name)
    shutil.copy2(ROOT/"assets/fonts/Pretendard-OFL.txt",out/"pretendard-ofl.txt");public_files["pretendard-ofl.txt"]=sha(out/"pretendard-ofl.txt")
    document=html_document(s,out,pdf,published=True,share=share)
    (out/"poster.html").write_text(document,encoding="utf-8")
    (out/"poster-offline.html").write_text(html_document(s,out,pdf,share=share),encoding="utf-8")
    if len(document.encode())>256*1024 or len(document[:document.index("</head>")].encode())>64*1024:raise ValueError("Published HTML exceeds project sharing budget; reduce embedded artwork")
    dump(out/"share-manifest.json",{"contract":"poster-sharing-v1",**share,"publishUrl":s.get("publishUrl"),"publicHtmlSha256":sha(out/"poster.html"),"offlineHtmlSha256":sha(out/"poster-offline.html"),"publicFiles":public_files,"pdfSha256":sha(out/"poster.pdf"),"status":"assets-ready-live-verification-pending","actualKakaoPreview":"not-verified"})
    import pypdfium2 as pdfium
    with pdfium.PdfDocument(out/"poster.pdf") as doc:
        for n in range(len(doc)):
            bitmap=doc[n].render(scale=1.2);im=bitmap.to_pil();im.thumbnail((1200,1600))
            im.save(out/("poster-preview.png" if n==0 else f"poster-preview-{n+1:02d}.png"));bitmap.close()
    public_spec=json.loads(json.dumps(s))
    if public_spec["print"].get("iccProfile"):
        public_spec["print"]["iccSha256"]=sha(public_spec["print"].pop("iccProfile"))
        public_spec["print"]["outputProfile"]=audit.get("outputProfile",{})
    for a in public_spec.get("logos",[]):
        a["sha256"]=sha(a.pop("file"));a["darkSha256"]=sha(a.pop("fileDark"))
    dump(out/"poster-spec.json",public_spec)
    dump(out/"print-audit.json",audit)
    script_files=["poster_series.py","series.css","series.js"]
    hashes={f:sha(ROOT/"scripts"/f) for f in script_files}
    package_hash=hashlib.sha256(json.dumps(hashes,sort_keys=True).encode()).hexdigest()
    result={"skill":"hallym-poster-system","version":VERSION,"viewerVersion":VERSION,"status":"generated-awaiting-visual-review","exitCode":0,"pages":audit["pages"],"screenScenes":len(s["scenes"]),"contentBlocks":len(s["content"]),"print":audit,"rendererSha256":hashes["poster_series.py"],"viewerSha256":hashes["series.js"],"packageSha256":package_hash,"packageFiles":hashes,"actualMobile":"not-tested","researchRefs":s.get("researchRefs",[]),"outputs":[{"path":p.name,"sha256":sha(p)} for p in sorted(out.iterdir()) if p.is_file()]}
    dump(out/"result.json",result)
    return result

