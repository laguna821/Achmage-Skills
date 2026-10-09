"""Prepare only reviewed public artifacts; never authenticate, upload or mutate a repository."""
from pathlib import Path
import hashlib,html,json,re,shutil,sys
from urllib.parse import quote, urlsplit
from PIL import Image

def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def run(req):
    owner=req['owner'];repo=req.get('repository','slides');slug=req['slug']
    source_path=req.get('sourcePath','docs')
    if source_path not in ('','docs'):raise ValueError('Pages sourcePath는 확인된 루트(빈 문자열) 또는 docs만 지원합니다.')
    if not re.fullmatch(r'[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?',owner):raise ValueError('GitHub 계정명 확인')
    if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9._-]{0,99}',repo) or repo in ('.','..'):raise ValueError('저장소 이름 확인')
    if not re.fullmatch(r'[a-z0-9][a-z0-9-]{0,79}',slug):raise ValueError('slug는 영문 소문자/숫자/하이픈')
    source=Path(req['html']).resolve();preview=Path(req['preview']).resolve()
    raw=source.read_text(encoding='utf-8')
    if source.suffix.lower()!='.html' or '</head>' not in raw.lower():raise ValueError('완성된 HTML 파일 필요')
    # Only hash-pinned, flat font dependencies can supplement standalone HTML.
    public_files={};manifest_path=source.parent/'share-manifest.json'
    if manifest_path.exists():
        manifest=json.loads(manifest_path.read_text(encoding='utf-8'))
        if manifest.get('contract')=='poster-sharing-v1':
            if sha(source)!=manifest.get('publicHtmlSha256'):raise ValueError('Public HTML manifest hash mismatch')
            for name,expected in manifest.get('publicFiles',{}).items():
                if not re.fullmatch(r'pretendard-(?:400|700|800)\.woff2|pretendard-ofl\.txt',name):raise ValueError('Unsafe declared public asset')
                asset=source.parent/name
                if not asset.is_file() or sha(asset)!=expected:raise ValueError('Public asset manifest hash mismatch: '+name)
                public_files[name]=asset
            if sha(preview)!=manifest.get('imageSha256'):raise ValueError('Sharing preview manifest hash mismatch')
            if req.get('pdf') and sha(Path(req['pdf']))!=manifest.get('pdfSha256'):raise ValueError('PDF manifest hash mismatch')
    def declared(value,pdf_allowed=False):
        u=urlsplit(value)
        if u.scheme or u.netloc or u.fragment:return False
        if u.path in public_files and u.path.endswith('.woff2') and not u.query:return True
        if pdf_allowed and req.get('pdf') and u.path=='poster.pdf' and (not u.query or u.query=='v='+sha(Path(req['pdf']))[:12]):return True
        return False
    # Never copy neighboring source documents or recurse over an output folder.
    for val in re.findall(r'(?:src|href)\s*=\s*["\']([^"\']+)',raw,re.I):
        if val.startswith(('data:','#','https://','mailto:','tel:')) or declared(val,True):continue
        raise ValueError('외부/상대 자산을 먼저 단독 HTML에 내장하세요: '+val[:100])
    from html.parser import HTMLParser
    class Assets(HTMLParser):
        def handle_starttag(self,tag,attrs):
            a=dict(attrs)
            if tag.lower() in ('image','use','feimage'):
                for attr in ('href','xlink:href'):
                    if attr in a and not a[attr].startswith(('data:','#')):raise ValueError('내장되지 않은 SVG 자산: '+a[attr][:100])
            if tag.lower()=='object' and 'data' in a and not a['data'].startswith('data:'):raise ValueError('내장되지 않은 object 자산')
            for attr in ('src','srcset','poster'):
                if attr in a and not a[attr].startswith(('data:','#')):raise ValueError('내장되지 않은 자산: '+a[attr][:100])
            if tag=='link' and a.get('rel','').lower() in ('stylesheet','preload','modulepreload') and not a.get('href','').startswith('data:'):raise ValueError('외부 스타일/폰트 의존성')
    Assets().feed(raw)
    styles='\n'.join(re.findall(r'<style\b[^>]*>(.*?)</style>',raw,re.I|re.S)+re.findall(r'\bstyle\s*=\s*"([^"]*)"',raw,re.I)+re.findall(r"\bstyle\s*=\s*'([^']*)'",raw,re.I))
    for value in re.findall(r'\burl\(\s*([^)]*)\)',styles,re.I):
        value=value.strip().strip('"').strip("'")
        if not value.startswith(('data:','#')) and not declared(value):raise ValueError('내장되지 않은 CSS 자산: '+value[:100])
    if re.search(r'@import\s',styles,re.I):raise ValueError('CSS import를 내장해야 합니다.')
    pdf=Path(req['pdf']).resolve() if req.get('pdf') else None
    if pdf and pdf.read_bytes()[:5]!=b'%PDF-':raise ValueError('PDF 형식 확인')
    with Image.open(preview) as im:
        if im.format not in ('PNG','JPEG') or im.width<600 or im.height<300:raise ValueError('썸네일 PNG/JPEG 600×300 이상 필요')
        w,h=im.size;ext='.png' if im.format=='PNG' else '.jpg'
    base=f'https://{owner.lower()}.github.io/'
    url=base+(('' if repo.lower()==owner.lower()+'.github.io' else quote(repo)+'/'))+slug+'/'
    # Only the explicitly supplied PDF may become an external file link. The
    # poster's fonts/artwork remain embedded and keep the validation above.
    pdf_url=url+'poster.pdf?v='+sha(pdf)[:12] if pdf else None
    if pdf_url:
        def pdf_link(match):
            tag=match.group(0)
            if not re.search(r'\bdata-pdf-link(?:\s|=|>)',tag,re.I):return tag
            return re.sub(r'\bhref\s*=\s*([\"\']).*?\1',lambda m:'href="'+html.escape(pdf_url,quote=True)+'"',tag,flags=re.I)
        raw=re.sub(r'<a\b[^>]*>',pdf_link,raw,flags=re.I)
    name='og-'+sha(preview)[:12]+ext
    head_end=raw.lower().index('</head>')
    head=raw[:head_end];tail=raw[head_end:]
    head=re.sub(r'<meta\b[^>]*(?:property|name)\s*=\s*["\'](?:og:|twitter:)[^"\']*["\'][^>]*>','',head,flags=re.I)
    head=re.sub(r'<link\b[^>]*rel\s*=\s*["\']canonical["\'][^>]*>','',head,flags=re.I)
    title=html.escape(req['title'],quote=True);desc=html.escape(req.get('description',req['title']),quote=True)
    meta=f'<link rel="canonical" href="{url}"><meta property="og:type" content="website"><meta property="og:title" content="{title}"><meta property="og:description" content="{desc}"><meta property="og:url" content="{url}"><meta property="og:image" content="{url+name}"><meta property="og:image:width" content="{w}"><meta property="og:image:height" content="{h}"><meta property="og:image:alt" content="{title}">'
    out=Path(req['outputDir']).resolve()
    if out.exists():raise FileExistsError('새 게시 준비 폴더가 필요합니다.')
    pages_root=out/source_path
    dest=pages_root/slug;dest.mkdir(parents=True)
    # Put sharing metadata before the embedded fonts, which can be megabytes.
    # Link crawlers should not have to read the entire CSS to discover the card.
    anchor=re.search(r'<meta\b[^>]*charset\s*=[^>]*>',head,re.I) or re.search(r'<head\b[^>]*>',head,re.I)
    if not anchor:raise ValueError('HTML head 필요')
    head=head[:anchor.end()]+meta+head[anchor.end():]
    (dest/'index.html').write_text(head+tail,encoding='utf-8')
    shutil.copyfile(preview,dest/name)
    for filename,asset in public_files.items():shutil.copyfile(asset,dest/filename)
    if req.get('pdf'):
        pdf=Path(req['pdf']).resolve()
        if pdf.read_bytes()[:5]!=b'%PDF-':raise ValueError('PDF 형식 확인')
        shutil.copyfile(pdf,dest/'poster.pdf')
    # Existing Pages may derive its homepage from README via Jekyll. Adding
    # .nojekyll there would remove that homepage, so only stage it for a new repo.
    files=list(dest.iterdir())
    if req.get('newRepository'):
        (pages_root/'.nojekyll').write_text('',encoding='utf-8')
        files.append(pages_root/'.nojekyll')
    # Root index is for a NEW repository only. Existing gallery must be merged, never overwritten.
    (out/'new-repository-index.html').write_text(f'<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>포스터와 슬라이드</title><h1>포스터와 슬라이드</h1><a href="{slug}/">{title}</a></html>',encoding='utf-8')
    result={'status':'staged-not-published','targetRepository':owner+'/'+repo,'branch':req.get('branch','main'),'sourcePath':source_path,'expectedUrl':url,'pdfUrl':pdf_url,'pdfDelivery':'same-origin-file' if pdf else 'embedded','files':[{'path':p.relative_to(out).as_posix(),'sha256':sha(p)} for p in files],'newRepoRootIndex':'new-repository-index.html (new repository only; copy to '+(source_path+'/' if source_path else '')+'index.html)','excluded':'source docs, logs, signatures, configuration','onlineChecks':'pending: Pages, HTML/OG HTTP200, Kakao card'}
    (out/'publish-plan.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    return result
if __name__=='__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    try:print(json.dumps(run(json.loads(Path(sys.argv[1]).read_text(encoding='utf-8-sig'))),ensure_ascii=False,indent=2))
    except Exception as e:print(json.dumps({'status':'error','message':str(e)},ensure_ascii=False));sys.exit(1)

