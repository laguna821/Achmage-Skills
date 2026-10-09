"""Semantic hierarchy compositor: measured, variable-span bento; no text deletion."""
import copy,math,re
from reportlab.pdfbase import pdfmetrics
from functools import lru_cache

def compose(spec,Page,FitError,wrap,text,C,profiles=None):
    permitted={'groups','title','titleLayout','kind','size','orientation','density','eyebrow','subtitle','authors','cta','footer','shareTitle','shareDescription','publishUrl'}
    unknown=set(spec)-permitted
    if unknown:raise ValueError('지원하지 않는 계층형 poster 필드: '+','.join(sorted(unknown)))
    for key in ('title','eyebrow','subtitle','authors','cta','footer','shareTitle','shareDescription'):
        if key in spec:text(spec[key])
    if not text(spec.get('title','')):raise ValueError('전체 제목이 필요합니다.')
    profiles=profiles or [
        dict(name='standard',m=40,g=20,pad=20,title=72,h2=28,lead=38,body=24,label=22,note=17,leading=1.3),
        dict(name='compact',m=32,g=14,pad=14,title=60,h2=25,lead=32,body=22,label=20,note=16,leading=1.25),
        dict(name='dense',m=24,g=8,pad=8,title=52,h2=23,lead=28,body=20,label=18,note=15,leading=1.20)]
    density=spec.get('density','auto')
    if density not in ('auto','standard','compact','dense'):raise ValueError('density 확인')
    groups=spec['groups']
    if not isinstance(groups,list) or not 2<=len(groups)<=14:raise FitError('의미 묶음은2~14개 필요합니다.')
    allowed={'title','kicker','lead','body','items','note','priority','span','tone'}
    for group in groups:
        if not isinstance(group,dict):raise ValueError('group은 객체여야 합니다.')
        if set(group)-allowed:raise ValueError('지원하지 않는 그룹 필드: '+str(set(group)-allowed))
        if not text(group.get('title','')):raise ValueError('모든 그룹 제목이 필요합니다.')
        for key in ('title','kicker','lead','body','note'):
            if key in group:text(group[key])
        priority=group.get('priority',3)
        if type(priority) is not int or priority not in (1,2,3,4):raise ValueError('priority는1~4 정수')
        span=group.get('span','auto')
        if span!='auto' and (type(span) is not int or span not in (2,3,4,6)):raise ValueError('span은auto/2/3/4/6')
        if group.get('tone','auto') not in ('auto','navy','blue','teal','pale','plain'):raise ValueError('tone 확인')
        if not isinstance(group.get('items',[]),list) or len(group.get('items',[]))>12:raise ValueError('items는12개 이하')
        for item in group.get('items',[]):
            if not isinstance(item,dict) or set(item)-{'label','text','note'}:raise ValueError('item 필드는label/text/note')
            for key in ('label','text','note'):
                if key in item:text(item[key])
    trials=[]
    for pr in profiles:
        if density!='auto' and density!=pr['name']:continue
        try:
            p=Page(spec);m=p.m=pr['m'];w=p.w-2*m;gap=pr['g'];pad=pr['pad']
            y=m
            header_w=w-(160 if pr['name'].startswith('screen-') else 0)
            if spec.get('eyebrow'):y=p.block('eyebrow',spec['eyebrow'],m,y,header_w,16,700,C['blue'],maxh=44)+12
            y=p.title_block(m,y,header_w,pr['title'],240,allow_fit=not pr['name'].startswith('screen-'))+12
            if spec.get('subtitle'):y=p.block('subtitle',spec['subtitle'],m,y,w,pr['label'],400,C['muted'],maxh=62)+8
            if spec.get('authors'):y=p.block('authors',spec['authors'],m,y,w,pr['note'],400,C['muted'],maxh=45)+8
            p.line(m,y,w,C['navy'],3);y+=18
            footer_h=68 if spec.get('cta') else 44
            # Fit explicit footer against its real line count; never hide it to make cards fit.
            footer_h=max(footer_h,20+len(wrap(text(spec.get('footer','')),w,15,400))*19+(34 if spec.get('cta') else 0))
            bottom=p.h-m-footer_h
            def tone_of(group):
                tone=group.get('tone','auto')
                return {1:'navy',2:'blue',3:'pale',4:'plain'}[group.get('priority',3)] if tone=='auto' else tone
            def palette(tone):
                if tone=='navy':return C['navy'],C['navy'],C['white'],C['white']
                if tone=='blue':return C['pale'],C['blue'],C['white'],C['ink']
                if tone=='teal':return '#D4F1EF',C['teal'],C['ink'],C['ink']
                if tone=='pale':return C['soft'],C['pale'],C['ink'],C['ink']
                return C['white'],C['white'],C['navy'],C['ink']
            def blocks(group):
                result=[]
                def add(key,value,role,size,weight):
                    if value:result.append(dict(key=key,value=text(value),role=role,size=size,weight=weight))
                add('kicker',group.get('kicker'),'kicker',pr['note'],700)
                add('title',group['title'],'heading',pr['h2'],700)
                add('lead',group.get('lead'),'lead',pr['lead'],800)
                add('body',group.get('body'),'body',pr['body'],400)
                for j,item in enumerate(group.get('items',[])):
                    if item.get('label') and item.get('text'):
                        result.append(dict(key=f'item-{j}',value=text(item['text']),label=text(item['label']),role='inline-item',size=pr['body'],weight=400))
                    else:
                        add(f'item-{j}-label',item.get('label'),'label',pr['label'],700)
                        add(f'item-{j}-text',item.get('text'),'body',pr['body'],400)
                    add(f'item-{j}-note',item.get('note'),'note',pr['note'],400)
                add('note',group.get('note'),'note',pr['note'],400)
                return result
            @lru_cache(None)
            def measure(i,cw):
                group=groups[i];yy=pad;pieces=[];header_end=0
                for b in blocks(group):
                    role=b['role'];leading=1.15 if role in ('heading','lead') else pr['leading']
                    if role=='inline-item':
                        lw=pdfmetrics.stringWidth(b['label'],'P700',pr['label'])+8
                        if lw<cw*.43:
                            first=wrap(b['value'],cw-2*pad-lw,b['size'],400)[0]
                            rest=b['value'][len(first):].lstrip()
                            restlines=wrap(rest,cw-2*pad,b['size'],400) if rest else []
                            bh=(1+len(restlines))*b['size']*leading
                            pieces.append({**b,'y':yy,'h':bh,'leading':leading,'labelw':lw,'first':first,'rest':rest})
                            yy+=bh+8;continue
                        # Long labels use separate lines, preserving hierarchy.
                        labelh=len(wrap(b['label'],cw-2*pad,pr['label'],700))*pr['label']*leading
                        pieces.append(dict(key=b['key']+'-label',value=b['label'],role='label',size=pr['label'],weight=700,y=yy,h=labelh,leading=leading))
                        yy+=labelh+4
                        b={k:v for k,v in b.items() if k!='label'};b['role']='body';role='body'
                    bh=len(wrap(b['value'],cw-2*pad,b['size'],b['weight']))*b['size']*leading
                    if role=='heading':
                        if header_end:raise ValueError('헤더 중복')
                        header_end=yy+bh+pad
                    pieces.append({**b,'y':yy,'h':bh,'leading':leading})
                    after=8 if role in ('heading','lead','body') else 4
                    if role=='heading':after=pad*2
                    yy+=bh+after
                return yy+pad-4,header_end,pieces
            @lru_cache(None)
            def solve(i):
                if i==len(groups):return 0.,[]
                choices=[]
                for spans in ((6,),(3,3),(4,2),(2,4),(2,2,2)):
                    n=len(spans)
                    if i+n>len(groups):continue
                    widths=[(w-gap*(n-1))*sp/6 for sp in spans]
                    valid=True;penalty=0
                    for k,(sp,cw) in enumerate(zip(spans,widths)):
                        gg=groups[i+k];want=gg.get('span','auto')
                        if want!='auto' and want!=sp:valid=False;break
                        # Critical messages may not be squeezed into a two-column micro tile.
                        if gg.get('priority',3)==1 and sp<4:valid=False;break
                        if sp==2 and len(''.join(b['value'] for b in blocks(gg)))>220:valid=False;break
                        pref={1:6,2:4,3:3,4:2}[gg.get('priority',3)]
                        penalty+=abs(sp-pref)*6
                    if not valid:continue
                    rh=max(measure(i+k,cw)[0] for k,cw in enumerate(widths))
                    future,rows=solve(i+n)
                    choices.append((rh+gap+penalty+future,[dict(start=i,spans=spans,widths=widths,h=rh)]+rows))
                return min(choices,key=lambda x:x[0]) if choices else (math.inf,[])
            _,rows=solve(0)
            need=sum(r['h'] for r in rows)+gap*max(0,len(rows)-1)
            if not rows or need>bottom-y-12:raise FitError(f'{pr["name"]}: 계층 카드 {need:.1f}, 가능한 높이 {bottom-y-12:.1f}')
            # Remaining area goes to semantically important rows; do not equalize all cards.
            spare=bottom-y-12-need
            weights=[max(1,5-min(groups[r['start']+k].get('priority',3) for k in range(len(r['spans'])))) for r in rows]
            p.regions=[];level_map={'heading':2,'lead':3,'label':4,'body':4,'note':5,'kicker':3}
            for r,rweight in zip(rows,weights):
                rh=r['h']+spare*rweight/sum(weights);x=m
                for k,(span,cw) in enumerate(zip(r['spans'],r['widths'])):
                    i=r['start']+k;group=groups[i];tone=tone_of(group);bg,hbg,hfg,fg=palette(tone)
                    _,header_end,pieces=measure(i,cw)
                    p.rect(x,y,cw,rh,bg)
                    if tone!='plain':p.rect(x,y,cw,header_end,hbg)
                    else:p.line(x,y,cw,C['navy'],2)
                    p.regions.append(dict(id=f'group-{i}',title=group['title'],priority=group.get('priority',3),tone=tone,span=span,x=x,y=y,w=cw,h=rh))
                    for b in pieces:
                        inside=b['role'] in ('kicker','heading')
                        color=hfg if inside else fg
                        actualbg=hbg if inside else bg
                        key=f'group-{i}-'+b['key']
                        start=len(p.fields)
                        if b['role']=='inline-item':
                            p.block(key+'-label',b['label'],x+pad,y+b['y'],b['labelw']-4,pr['label'],700,color,actualbg,maxh=b['h'],leading=b['leading'])
                            p.fields[-1].update(hierarchyLevel=4,semanticRole='label',group=i)
                            body_start=len(p.fields)
                            p.block(key+'-first',b['first'],x+pad+b['labelw'],y+b['y'],cw-2*pad-b['labelw'],b['size'],400,color,actualbg,maxh=b['size']*b['leading']+.1,leading=b['leading'])
                            if b['rest']:p.block(key+'-rest',b['rest'],x+pad,y+b['y']+b['size']*b['leading'],cw-2*pad,b['size'],400,color,actualbg,maxh=b['h']-b['size']*b['leading']+.1,leading=b['leading'])
                            lines=[line for f in p.fields[body_start:] for line in f['lines']]
                            p.fields[body_start:]=[dict(id=key+'-body',text=b['value'],lines=lines,size=b['size'],weight=400,hierarchyLevel=4,semanticRole='body',group=i)]
                            continue
                        p.block(key,b['value'],x+pad,y+b['y'],cw-2*pad,b['size'],b['weight'],color,actualbg,maxh=b['h']+.1,leading=b['leading'])
                        for field in p.fields[start:]:field['hierarchyLevel']=level_map[b['role']];field['semanticRole']=b['role'];field['group']=i
                    x+=cw+gap
                y+=rh+gap
            p.line(m,bottom,w,C['navy'],2)
            yy=bottom+12
            if spec.get('cta'):yy=p.block('cta',spec['cta'],m,yy,w,24,700,C['navy'],maxh=38)+4
            p.block('footer',spec.get('footer',''),m,yy,w,15,400,C['muted'],maxh=p.h-m-yy)
            for field in p.fields:
                if field['id']=='title':field['hierarchyLevel']=1;field['semanticRole']='poster-title'
            audit=p.audit()
            audit.update(layout='cmds-semantic-bento',gridColumns=6,density=pr['name'],layoutCandidates=trials,regions=len(groups),
                hierarchyLevels=sorted(set(f.get('hierarchyLevel',4) for f in p.fields)),
                distinctCardWidths=len(set(round(r['w'],1) for r in p.regions)),distinctCardAreas=len(set(round(r['w']*r['h'],0) for r in p.regions)),
                toneCount=len(set(r['tone'] for r in p.regions)),bodyFloor=pr['body'],smallestFontPt=min(f['size']*p.scale for f in p.fields))
            return p,audit
        except FitError as e:trials.append({'density':pr['name'],'reason':str(e)})
    raise FitError('계층형 배치 후보 모두 과밀: '+str(trials))

