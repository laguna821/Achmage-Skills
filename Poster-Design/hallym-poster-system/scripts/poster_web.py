"""Offline HTML controls and static Open Graph assets. No network or publication."""
from pathlib import Path
import base64,hashlib,html,io,json,ipaddress
from urllib.parse import urlsplit,urljoin
ROOT=Path(__file__).resolve().parents[1]
DARK={'#FFFFFF':'#101B2C','#D4F1EF':'#193C3D','#FAFBFC':'#18283D','#D9E8F4':'#20354F','#0F1620':'#F5F8FC','#4A5563':'#BECDDF','#CDD3DA':'#40536C','#0066B3':'#85C8FF','#002E6E':'#002E6E','#00B5AD':'#00B5AD'}

def dark_background(color):
    # Blue ink becomes light blue, but a white-on-blue header keeps its dark fill.
    return color if color=='#0066B3' else DARK.get(color,color)

def share_config(spec):
    url=spec.get('publishUrl')
    if url:
        p=urlsplit(url)
        if p.scheme!='https' or not p.hostname or p.username or p.password or p.query or p.fragment or p.hostname in ('localhost','example.com') or p.hostname.endswith(('.local','.test','.invalid')):raise ValueError('publishUrl에는 실제 공개 HTTPS 페이지 주소를 넣으세요.')
        try:
            if not ipaddress.ip_address(p.hostname).is_global:raise ValueError('publishUrl은 공개 주소여야 합니다.')
        except ValueError as e:
            if '공개' in str(e):raise
    name='og-'+hashlib.sha256(json.dumps(spec,sort_keys=True,ensure_ascii=False).encode()).hexdigest()[:12]+'.png'
    return {'status':'metadata-ready-online-unverified' if url else 'needs-publish-url','pageUrl':url,'imageFile':name,'imageUrl':urljoin(url,name) if url else None,'kakaoPreview':'not-verified'}

def validate_share(spec,error=ValueError):
    from reportlab.pdfbase import pdfmetrics
    from poster import fonts,wrap
    fonts()
    for name,value in [('shareTitle',spec.get('shareTitle',spec['title'])),('eyebrow',spec.get('eyebrow','POSTER'))]:
        if not isinstance(value,str):raise error(name+' 문자열 필요')
        face=pdfmetrics.getFont('P800').face
        missing=sorted({ch for ch in value if not ch.isspace() and ord(ch) not in face.charToGlyph})
        if missing:raise error(name+' 공유 이미지 글꼴 미지원: '+''.join(missing))
    if len(wrap(spec.get('shareTitle',spec['title']),740,56,800))>5:raise error('공유 썸네일 제목이 깁니다. shareTitle을 짧게 정해주세요.')
    if pdfmetrics.stringWidth(spec.get('eyebrow','POSTER'),'P700',23)>740:raise error('공유 이미지 eyebrow가 너무 깁니다.')

def export_share(p,out):
    from PIL import Image,ImageDraw,ImageFont
    s=share_config(p.spec);im=Image.new('RGB',(1200,630),'#FFFFFF');d=ImageDraw.Draw(im)
    d.rectangle((0,0,24,630),fill='#00B5AD');d.rectangle((850,0,1200,630),fill='#002E6E')
    def font(size,weight=700):return ImageFont.truetype(str(ROOT/'assets/fonts'/f'Pretendard{weight}.ttf'),size)
    title=p.spec.get('shareTitle',p.spec['title'])
    lines=[]
    for paragraph in title.split('\n'):
        line=''
        for ch in paragraph:
            if d.textlength(line+ch,font=font(56,800))>740:
                lines.append(line);line=''
            line+=ch
        lines.append(line)
    if len(lines)>5:raise ValueError('공유 썸네일 제목이 깁니다. shareTitle을 짧게 정해주세요.')
    d.text((64,56),p.spec.get('eyebrow','POSTER'),font=font(23),fill='#0066B3')
    y=140
    for line in lines:d.text((64,y),line,font=font(56,800),fill='#002E6E');y+=74
    d.text((64,552),'전체 포스터 보기',font=font(26),fill='#4A5563')
    # Identifiable poster silhouette; no clipped reproduction of a long portrait poster.
    d.rectangle((898,116,1152,494),fill='#FAFBFC')
    d.rectangle((920,142,1128,199),fill='#002E6E')
    d.rectangle((920,219,1018,306),fill='#D9E8F4');d.rectangle((1030,219,1128,306),fill='#D9E8F4')
    d.rectangle((920,326,1128,408),fill='#0066B3');d.rectangle((920,428,1128,467),fill='#D9E8F4')
    im.save(out/s['imageFile'])
    (out/'share-manifest.json').write_text(json.dumps(s,ensure_ascii=False,indent=2),encoding='utf-8')

def export_html(p,target):
    from reportlab.pdfbase import pdfmetrics
    definitions=''.join('@font-face{font-family:P;font-weight:'+str(n)+';src:url(data:font/woff2;base64,'+base64.b64encode((ROOT/'assets/fonts'/f'Pretendard{n}.woff2').read_bytes()).decode()+')}' for n in (400,700,800))
    light={};dark={};pieces=[];pairs=[]
    def fill(c,foreground=False,bg=None,role=None):
        key=('t' if foreground else 'b')+c[1:]+(bg[1:] if bg else '')+('bar' if role=='data-bar' else '')
        dc=(c if bg=='#00B5AD' else '#FFFFFF' if c=='#FFFFFF' else '#85C8FF' if c=='#002E6E' else DARK.get(c,c)) if foreground else dark_background(c)
        if role=='data-bar':dc='#85C8FF' if c=='#0066B3' else '#00B5AD'
        light[key]=c;dark[key]=dc
        return 'var(--'+key+')'
    from poster_responsive import screen_plans,item_attributes,SCRIPT
    mobile,screen_report=screen_plans(p)
    (target.parent/'responsive-layouts.json').write_text(json.dumps({'report':screen_report,'plans':[{'width':q.w,'height':q.h,'rows':q.screen_rows,'items':q.items,'fields':q.fields,'regions':q.regions} for q,a in mobile]},ensure_ascii=False),encoding='utf-8')
    def draw(page):
        pieces=[]
        for i in page.items:
            attrs=item_attributes(page,i)
            if i['type']=='rect':pieces.append(f'<rect{attrs} x="{i["x"]}" y="{i["y"]}" width="{i["w"]}" height="{i["h"]}" fill="{fill(i["color"],role=i.get("role"))}"/>')
            elif i['type']=='image':pieces.append(f'<image{attrs} x="{i["x"]}" y="{i["y"]}" width="{i["w"]}" height="{i["h"]}" href="data:image/png;base64,{i["data"]}"/>')
            else:
                asc=pdfmetrics.getAscent('P'+str(i['weight']))*i['size']/1000
                attrs=item_attributes(page,{**i,'y':i['y']+asc})
                pieces.append(f'<text{attrs} data-field="{html.escape(i["field"],quote=True)}" x="{i["x"]}" y="{i["y"]+asc}" font-family="P" font-size="{i["size"]}" font-weight="{i["weight"]}" fill="{fill(i["color"],True,i["bg"])}">{html.escape(i["text"])}</text>')
                dc=i['color'] if i['bg']=='#00B5AD' else '#FFFFFF' if i['color']=='#FFFFFF' else '#85C8FF' if i['color']=='#002E6E' else DARK.get(i['color'],i['color'])
                pairs.append((dc,dark_background(i['bg'])))
        return ''.join(pieces)
    original_art=draw(p)
    body_sizes=[f['size'] for f in p.fields if f.get('semanticRole')=='body' or f['id'].endswith('-body')]
    paper_body=min(body_sizes) if body_sizes else 0
    templates=f'<template data-layout="paper" data-width="{p.w}" data-height="{p.h}" data-body="{paper_body}"><svg>{original_art}</svg></template>'
    for n,(page,audit) in enumerate(mobile):
        rowdata=html.escape(json.dumps(page.screen_rows),quote=True)
        templates+=f'<template data-layout="screen-{n}" data-width="{page.w}" data-height="{page.h}" data-body="{audit["bodyFloor"]}" data-rows="{rowdata}"><svg>{draw(page)}</svg></template>'
    from poster import contrast
    if any(contrast(a,b)<4.5 for a,b in pairs):raise ValueError('다크 테마 글자 대비 검증 실패')
    variables=lambda v:';'.join('--'+k+':'+c for k,c in v.items())
    title=html.escape(p.spec['title'],quote=True)
    desc=html.escape(p.spec.get('shareDescription',p.spec.get('subtitle',p.spec.get('message','한 장 포스터'))),quote=True)
    share=share_config(p.spec)
    meta=f'<meta name="description" content="{desc}"><meta property="og:type" content="website"><meta property="og:title" content="{title}"><meta property="og:description" content="{desc}"><meta property="og:locale" content="ko_KR">'
    if share['pageUrl']:
        meta+=f'<link rel="canonical" href="{html.escape(share["pageUrl"],quote=True)}"><meta property="og:url" content="{html.escape(share["pageUrl"],quote=True)}"><meta property="og:image" content="{html.escape(share["imageUrl"],quote=True)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="{title}">'
    svg=f'<svg id="poster" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {p.w} {p.h}" role="img" aria-label="{title} — {desc}"><title id="poster-title">{title}</title><desc id="poster-desc">{desc}</desc>'+original_art+'</svg>'
    print_svg=f'<svg id="print-poster" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {p.w} {p.h}" aria-hidden="true">'+original_art+'</svg>'
    transcript=''.join(f'<section><p>{html.escape(f["text"]).replace(chr(10),"<br>")}</p></section>' for f in p.fields)
    pdf=base64.b64encode((target.parent/'poster.pdf').read_bytes()).decode()
    css=definitions+'''
:root{color-scheme:light;--desk:#E9EDF2;--chrome:#FFFFFF;--glass:rgba(255,255,255,.86);--chrome-ink:#002E6E;--paper:#FFFFFF;__LIGHT__}
:root[data-theme=dark]{color-scheme:dark;--desk:#070F1A;--chrome:#18283D;--glass:rgba(24,40,61,.88);--chrome-ink:#FFFFFF;--paper:#101B2C;__DARK__}
*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden}
body{background:var(--desk);font-family:P,sans-serif}
#stage{position:fixed;left:var(--visible-x,0px);top:var(--visible-y,0px);width:var(--visible-w,100%);height:100%;height:100svh;height:100dvh;height:var(--visible-h,100dvh);display:flex;align-items:center;justify-content:center;padding:max(8px,env(safe-area-inset-top)) max(8px,env(safe-area-inset-right)) max(8px,env(safe-area-inset-bottom)) max(8px,env(safe-area-inset-left))}
html[data-layout=screen] body{background:var(--paper)}
#print-poster{display:none}
#poster{display:block;width:100%;height:100%;max-width:100%;max-height:100%;flex:none}
html[data-zoom=true] #stage{display:block;overflow:auto;touch-action:pan-x pan-y}
html[data-zoom=true] #poster{width:max(100%,900px);height:auto;max-width:none;max-height:none}
#tools{position:fixed;right:max(8px,env(safe-area-inset-right));top:max(8px,env(safe-area-inset-top));z-index:5;color:var(--chrome-ink)}
#tools-toggle{display:grid;place-items:center;width:44px;height:44px;padding:0;border:0;border-radius:50%;background:transparent;color:inherit;font:700 22px P,sans-serif;cursor:pointer}
#tools-toggle:hover,#tools-toggle[aria-expanded=true]{background:var(--glass)}
#secondary-tools{position:absolute;right:0;top:48px;width:196px;max-height:calc(var(--visible-h,100dvh) - 72px);overflow:auto;padding:6px;background:var(--chrome);border:1px solid rgba(100,116,139,.35);border-radius:12px;box-shadow:0 8px 24px #0002}
#secondary-tools[hidden]{display:none}
#secondary-tools button,#secondary-tools a{display:flex;align-items:center;width:100%;min-height:44px;border:0;border-radius:6px;padding:8px 12px;background:transparent;color:inherit;text-decoration:none;text-align:left;font:600 14px P,sans-serif;cursor:pointer}
#secondary-tools button:hover,#secondary-tools a:hover{background:var(--glass)}
#tools :focus-visible{outline:3px solid #00B5AD;outline-offset:-3px}
.sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
#help{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:min(86vw,400px);max-height:calc(var(--visible-h,100dvh) - 32px);overflow:auto;padding:24px;background:var(--chrome);color:var(--chrome-ink);z-index:6;border:1px solid #64748B;font-size:15px;line-height:1.6}
#pdf-open{display:inline-flex;align-items:center;min-height:44px;color:inherit;text-underline-offset:3px}
.nojs-pdf{position:fixed;right:8px;bottom:8px;padding:12px;background:var(--chrome);color:var(--chrome-ink);z-index:9}#help button{min-height:44px}#help[hidden]{display:none}
@media(horizontal-viewport-segments:2),(vertical-viewport-segments:2){
#stage{left:env(viewport-segment-left 0 0,0px);top:env(viewport-segment-top 0 0,0px);width:env(viewport-segment-width 0 0,100%);height:env(viewport-segment-height 0 0,100dvh)}
}
@media(prefers-reduced-motion:reduce){*{transition:none!important}}
@page{size:__MMW__mm __MMH__mm;margin:0}
@media print{
:root,:root[data-theme=dark]{color-scheme:light;--paper:#FFFFFF;__LIGHT__}
html,body{width:__MMW__mm;height:__MMH__mm;overflow:hidden;margin:0;background:#FFFFFF}
#stage,html[data-zoom=true] #stage{position:static;display:block;width:__MMW__mm;height:__MMH__mm;padding:0;overflow:hidden}
#poster,html[data-zoom=true] #poster{display:none!important}
#print-poster{display:block!important;width:__MMW__mm;height:__MMH__mm;max-width:none;max-height:none;print-color-adjust:exact;-webkit-print-color-adjust:exact}
#tools,#help,.sr,.nojs-pdf{display:none!important}
}'''
    css=css.replace('__LIGHT__',variables(light)).replace('__DARK__',variables(dark)).replace('__MMW__',str(p.mm[0])).replace('__MMH__',str(p.mm[1]))
    js=r'''
(()=>{'use strict';const root=document.documentElement,tools=document.querySelector('#tools'),secondary=document.querySelector('#secondary-tools'),handle=document.querySelector('#tools-toggle'),theme=document.querySelector('#theme'),zoom=document.querySelector('#zoom'),help=document.querySelector('#help'),status=document.querySelector('#status');let timer,manual=false,keyboard=false;
// Published pages get a real HTTPS PDF link during staging. Offline HTML gets
// one Blob URL synchronously, before a click, with no fetch or delayed popup.
const pdfDownload=document.querySelector('#pdf-download'),pdfLinks=document.querySelectorAll('[data-pdf-link]');
try{let href=pdfDownload.getAttribute('href');if(href.startsWith('data:application/pdf;base64,')){const bytes=Uint8Array.from(atob(href.split(',')[1]),ch=>ch.charCodeAt(0));href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));root.dataset.pdfMode='embedded-blob'}else{root.dataset.pdfMode='published-file'}pdfLinks.forEach(link=>{link.href=href})}catch{status.textContent='PDF를 준비하지 못했습니다. 함께 받은 PDF 파일을 직접 열어 주세요.'}
function setTheme(value){root.dataset.theme=value;theme.setAttribute('aria-pressed',String(value==='dark'));theme.textContent=value==='dark'?'라이트':'다크';}
let saved;try{saved=localStorage.getItem('hallym-poster-theme')}catch{}
setTheme(saved==='dark'||saved==='light'?saved:matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
function closeTools(focus=false){secondary.hidden=true;handle.setAttribute('aria-expanded','false');if(focus)handle.focus()}
function wake(){secondary.hidden=false;handle.setAttribute('aria-expanded','true')}
handle.addEventListener('click',()=>{if(secondary.hidden){wake();theme.focus()}else closeTools(true)});
function toggleTheme(){manual=true;setTheme(root.dataset.theme==='dark'?'light':'dark');try{localStorage.setItem('hallym-poster-theme',root.dataset.theme)}catch{}status.textContent=root.dataset.theme==='dark'?'다크 모드':'라이트 모드';}
function toggleZoom(){root.dataset.zoom=String(root.dataset.zoom!=='true');zoom.setAttribute('aria-pressed',root.dataset.zoom);zoom.textContent=root.dataset.zoom==='true'?'한 장':'확대';}
theme.addEventListener('click',toggleTheme);zoom.addEventListener('click',toggleZoom);
document.querySelector('#print').addEventListener('click',async()=>{await document.fonts.ready;window.print()});
document.querySelector('#help-open').addEventListener('click',()=>{help.hidden=false;document.querySelector('#help-close').focus();wake()});
document.querySelector('#help-close').addEventListener('click',()=>{help.hidden=true;document.querySelector('#help-open').focus();wake()});
document.addEventListener('pointerdown',e=>{if(!tools.contains(e.target)&&help.hidden)closeTools()},{passive:true});
tools.addEventListener('focusout',()=>{queueMicrotask(()=>{if(!tools.contains(document.activeElement)&&help.hidden)closeTools()})});
document.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||e.target.isContentEditable||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
if(e.key.toLowerCase()==='t'){e.preventDefault();toggleTheme()}else if(e.key.toLowerCase()==='z'){e.preventDefault();toggleZoom()}else if(e.key==='Escape'){e.preventDefault();if(!help.hidden){help.hidden=true;closeTools(true)}else if(!secondary.hidden){closeTools(true)}else{root.dataset.zoom='false';zoom.setAttribute('aria-pressed','false');zoom.textContent='확대'}}});
matchMedia('(prefers-color-scheme:dark)').addEventListener?.('change',e=>{if(!manual&&!saved)setTheme(e.matches?'dark':'light')});
document.fonts.ready.then(()=>{root.dataset.fonts='ready'});closeTools();
})();'''
    js+=SCRIPT
    markup='<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>'+title+'</title><meta name="achmage-poster-viewer" content="1.0.0-rc.6">'+meta+'<style>'+css+'</style></head><body><main id="stage">'+svg+print_svg+'</main><nav id="tools" aria-label="포스터 보기 도구"><button id="tools-toggle" aria-label="포스터 도구 열기" aria-controls="secondary-tools" aria-expanded="false">⋯</button><div id="secondary-tools" hidden><button id="theme" aria-label="다크 라이트 전환 (T)" aria-pressed="false">다크</button><a id="pdf-download" data-pdf-link download="poster.pdf" target="_blank" rel="noopener" aria-label="PDF 다운로드 또는 열기" title="PDF 다운로드 또는 열기" href="data:application/pdf;base64,'+pdf+'">PDF 저장 · 열기</a><button id="zoom" aria-label="확대 또는 한 장 맞춤 (Z)" aria-pressed="false">확대</button><button id="view" aria-label="종이 또는 화면 배치 (V)" aria-pressed="false">종이</button><button id="print" aria-label="포스터 인쇄">인쇄</button><button id="help-open" aria-label="사용 도움말">?</button></div></nav><noscript><a class="nojs-pdf" data-pdf-link download="poster.pdf" href="data:application/pdf;base64,'+pdf+'">PDF 저장 · 열기</a></noscript><aside id="help" hidden><b>포스터 보기</b><p>모서리 ⋯ 버튼에서 테마·PDF·확대를 선택하세요.<br>바깥을 누르거나 Esc를 누르면 도구가 닫힙니다.<br>T: 다크·라이트 · Z: 확대·한 장 · V: 종이·화면<br>화면 배치는 실제 보이는 공간에 맞춰 다시 구성됩니다.<br>확대 상태에서는 스크롤해서 읽을 수 있어요.<br>PDF는 실제 종이 크기의 밝은 버전입니다.</p><p><a id="pdf-open" data-pdf-link href="#pdf-download" target="_blank" rel="noopener">PDF 새 탭에서 열기</a><br>저장 대신 PDF가 열리면:<br>iPhone: 공유 → 파일에 저장<br>Android Chrome: 더보기(⋮) → 다운로드</p><small>Layout adapted from Yohan Koo (CMDSPACE), deck.cmdspace.work. Hallym palette · Pretendard.</small><p><button id="help-close">닫기</button></p></aside><div id="status" class="sr" role="status"></div><article class="sr" aria-label="포스터 전체 텍스트">'+transcript+'</article>'+templates+'<script>'+js+'</script></body></html>'
    target.write_text(markup,encoding='utf-8')

