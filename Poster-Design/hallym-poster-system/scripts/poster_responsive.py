"""Measured screen-only plans. Physical print composition is never modified."""
from collections import Counter

RATIOS=(.7,.8,.9,1.,1.1,1.2,1.3,1.4,1.5,1.6,1.7,16/9,1.9,2.,2.1,13/6,2.2,20/9,7/3,2.5,2.7)

def screen_plans(original):
    if 'groups' not in original.spec:return [],{'status':'paper-only','reason':'사진/차트 단순 모드는 종이 배치 유지'}
    from poster import Page,FitError,wrap,text,C
    from poster_hierarchy import compose
    expected=Counter(f['text'] for f in original.fields)
    plans=[];held=[]
    for ratio in RATIOS:
        width=1800. if ratio<.9 else 1400. if ratio<1.3 else 1000.
        class ScreenPage(Page):
            def __init__(self,spec):
                super().__init__(spec)
                self.w=width;self.h=width*ratio;self.items=[]
                self.rect(0,0,self.w,self.h,C['white'])
        try:
            # Spend screen height on readable type before allocating spare card area.
            profiles=[dict(name='screen-'+str(size),m=24,g=10,pad=10,title=size*2.6,h2=size+3,lead=size*1.4,body=size,label=size-2,note=max(15,size*.65),leading=1.2) for size in (30,28,26,24,22,20)]
            screen_spec={**original.spec,'density':'auto'}
            page,audit=compose(screen_spec,ScreenPage,FitError,wrap,text,C,profiles=profiles)
            if Counter(f['text'] for f in page.fields)!=expected:
                raise RuntimeError('화면 배치의 필드 보존 불일치')
            rows=[]
            for region in page.regions:
                found=next((r for r in rows if abs(r['y']-region['y'])<.1),None)
                if found is None:rows.append({'y':region['y'],'h':region['h']})
            page.screen_rows=rows
            plans.append((page,audit))
        except FitError as exc:held.append({'ratio':ratio,'reason':str(exc)})
    report={'status':'ready' if plans else 'paper-only','selection':'actual usable CSS viewport, no device model or inch detection',
        'plans':[{'ratio':p.h/p.w,'width':p.w,'height':p.h,'density':a['density'],'body':a['bodyFloor'],'fields':len(p.fields),'rows':p.screen_rows} for p,a in plans],
        'held':held,'adjustment':'only nonnegative spare row height and row/footer y offsets; uniform SVG scale',
        'limits':'actual hardware hinges and native image viewers are not controlled; physical PDF stays fixed'}
    return plans,report

def item_attributes(page,item):
    rows=getattr(page,'screen_rows',None)
    if not rows:return ''
    y=item['y'];attrs=f' data-original-y="{y}"'
    if item['type']=='rect' and item['x']==0 and y==0 and item['w']==page.w:
        return attrs+' data-page-background="true"'
    for n,row in enumerate(rows):
        if row['y']-.1<=y<row['y']+row['h']-.1:
            attrs+=f' data-row="{n}"'
            if item['type']=='rect' and abs(y-row['y'])<.1 and abs(item['h']-row['h'])<.1:
                attrs+=f' data-flex-height="{item["h"]}"'
            return attrs
    if y>=rows[-1]['y']+rows[-1]['h']-.1:attrs+=' data-footer="true"'
    return attrs

SCRIPT=r'''
(()=>{'use strict';const root=document.documentElement,stage=document.querySelector('#stage'),svg=document.querySelector('#poster'),view=document.querySelector('#view');
const templates=[...document.querySelectorAll('template[data-layout]')],paper=templates[0];let active=null,manualPaper=false,pending=0;
function usable(){const cs=getComputedStyle(stage);return {w:stage.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight),h:stage.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom)}}
function dock(visible){const handle=document.querySelector('#tools'),toggle=document.querySelector('#tools-toggle');
 const boxes=[...svg.querySelectorAll('text,image')].map(e=>e.getBoundingClientRect());
 const cs=getComputedStyle(stage),pad={t:parseFloat(cs.paddingTop),b:parseFloat(cs.paddingBottom),l:parseFloat(cs.paddingLeft),r:parseFloat(cs.paddingRight)};
 const positions=[{x:visible.x+visible.w-pad.r-44,y:visible.y+pad.t},{x:visible.x+pad.l,y:visible.y+pad.t},{x:visible.x+visible.w-pad.r-44,y:visible.y+visible.h-pad.b-44},{x:visible.x+pad.l,y:visible.y+visible.h-pad.b-44}];
 const clear=positions.find(p=>boxes.every(b=>p.x+44<=b.left||p.x>=b.right||p.y+44<=b.top||p.y>=b.bottom));
 const pos=clear||positions[0];handle.style.left=pos.x+'px';handle.style.top=pos.y+'px';handle.style.right='auto';
 const panel=document.querySelector('#secondary-tools');panel.style.top=pos.y>visible.y+visible.h/2?'auto':'48px';panel.style.bottom=pos.y>visible.y+visible.h/2?'48px':'auto';panel.style.right=pos.x>visible.x+visible.w/2?'0':'auto';panel.style.left=pos.x>visible.x+visible.w/2?'auto':'0';
 root.dataset.toolsClear=String(Boolean(clear));
}
function render(){pending=0;const vv=window.visualViewport;if(vv&&Math.abs(vv.scale-1)>.02)return;
 const visible={w:vv?.width||innerWidth,h:vv?.height||innerHeight,x:vv?.offsetLeft||0,y:vv?.offsetTop||0};
 for(const [key,value] of Object.entries(visible))root.style.setProperty('--visible-'+key,value+'px');
 if(root.dataset.zoom==='true'){dock(visible);return;}const {w,h}=usable();if(w<=0||h<=0)return;const ratio=h/w;
 const screenAllowed=!manualPaper&&w<=1024&&w>=240&&ratio>=.7&&ratio<=2.9;
 let selected=paper,extra=0; if(screenAllowed){const candidates=templates.slice(1).filter(t=>Number(t.dataset.height)/Number(t.dataset.width)<=ratio+.000001);
 candidates.sort((a,b)=>Number(b.dataset.height)/Number(b.dataset.width)-Number(a.dataset.height)/Number(a.dataset.width));
 if(candidates.length){selected=candidates[0];extra=Math.max(0,Number(selected.dataset.width)*ratio-Number(selected.dataset.height));}}
 if(active!==selected){svg.innerHTML=selected.content.querySelector('svg').innerHTML;active=selected;}
 const width=Number(selected.dataset.width),height=Number(selected.dataset.height)+extra,rows=JSON.parse(selected.dataset.rows||'[]');
 svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
 for(const element of svg.querySelectorAll('[data-original-y]')){let y=Number(element.dataset.originalY);if(element.hasAttribute('data-row'))y+=extra*Number(element.dataset.row)/rows.length;else if(element.hasAttribute('data-footer'))y+=extra;element.setAttribute('y',String(y));
 if(element.hasAttribute('data-flex-height'))element.setAttribute('height',String(Number(element.dataset.flexHeight)+extra/rows.length));
 if(element.hasAttribute('data-page-background'))element.setAttribute('height',String(height));}
 root.dataset.layout=selected===paper?'paper':'screen';root.dataset.screenPlan=selected.dataset.layout;
 root.dataset.layoutWidth=String(width);root.dataset.layoutHeight=String(height);root.dataset.layoutExtra=String(extra);
 root.dataset.effectiveBody=String(Number(selected.dataset.body||20)*Math.min(w/width,h/height));
 dock(visible);
 view.textContent=manualPaper?'화면':'종이';view.setAttribute('aria-pressed',String(manualPaper));
}
function schedule(){if(!pending)pending=requestAnimationFrame(render)}
view.addEventListener('click',()=>{manualPaper=!manualPaper;root.dataset.zoom='false';const z=document.querySelector('#zoom');z.setAttribute('aria-pressed','false');z.textContent='확대';render()});
document.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||e.target.isContentEditable||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(e.key.toLowerCase()==='v'){e.preventDefault();view.click()}if(e.key==='Escape'||e.key.toLowerCase()==='z')schedule()});
document.querySelector('#zoom').addEventListener('click',schedule);
if(typeof ResizeObserver!=='undefined')new ResizeObserver(schedule).observe(stage);window.addEventListener('resize',schedule);window.visualViewport?.addEventListener('resize',schedule);window.visualViewport?.addEventListener('scroll',schedule);window.addEventListener('orientationchange',schedule);
document.fonts.ready.then(schedule);render();
})();
'''
