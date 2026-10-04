/* Owned controller. No persistent storage, external assets, or network calls. */
(()=>{
 'use strict';
 const byId=id=>document.getElementById(id),body=document.body;
 const config=JSON.parse(byId('deck-config').textContent),slides=[...document.querySelectorAll('#slides>.slide')];
 const counts=slides.map(s=>s.querySelectorAll('[data-step]').length);
 let state=DeckModel.create(counts),notes=[],catalog=[],language='ko',indexFilter='all',chromeFocus=null,manualMode=false,fitScheduled=false,initialAnchorPending=true,readingObserver=null,readingGeneration=0,readingSuspended=false,anchorTransaction=null;
 const compact=matchMedia('(max-width:850px)'),reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
 const localText=new Map([...document.querySelectorAll('[data-key]')].map(n=>[n,n.innerHTML]));
 const originalViewBoxes=new Map([...document.querySelectorAll('.r-diagram')].map(n=>[n,n.getAttribute('viewBox')]));
 const qs=new URLSearchParams(location.search),dialogs=[...document.querySelectorAll('dialog')];
 const focusReturn=new WeakMap();
 function textMarkup(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])).replace(/\|/g,'<br>').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\*(.+?)\*/g,'<em>$1</em>');}
 function plainText(node){if(!node)return '';if(node.nodeType===3)return node.nodeValue;if(node.nodeType!==1)return '';if(node.matches('script,style,template,.diagram-zoom,.diagram-reading,.diagram-fit'))return '';if(node.tagName==='BR')return ' ';const value=[...node.childNodes].map(plainText).join('');return /^(P|DIV|LI|H[1-6]|TR|TH|TD|SPAN)$/.test(node.tagName)&&!node.classList.contains('word')?value+' ':value;}
 function normalized(value){return String(value).normalize('NFKC').replace(/\s+/g,' ').trim();}
 function currentHeading(slide){return normalized(plainText(slide.querySelector('.r-headline,.r-quote p'))||slide.dataset.title);}
 function rebuildCatalog(){catalog=slides.map((slide,i)=>{const title=currentHeading(slide),group=slide.dataset.sectionGroup||'',role=['section','divider'].includes(slide.dataset.kind)?'section':'content',text=normalized(plainText(slide.querySelector('.sheet-body')));return {index:i,title,group,role,preview:text,search:normalized(title+' '+text+' '+plainText(slide.querySelector('.sheet-evidence'))+' '+group+' '+slide.dataset.title).toLocaleLowerCase(language).replace(/,/g,'')};});renderIndex();}
 function renderIndex(){const query=normalized(byId('deck-search').value).toLocaleLowerCase(language).replace(/,/g,''),match=query.match(/^(?:s|#)?(\d+)$/),exact=match?Number(match[1])-1:null,tokens=query.split(' ').filter(Boolean),list=byId('index-results');list.replaceChildren();let group=null;const rows=catalog.filter(row=>(indexFilter==='all'||row.role===indexFilter)&&(match?row.index===exact:tokens.every(token=>row.search.includes(token))));for(const row of rows){if(row.group!==group){group=row.group;if(group){const heading=document.createElement('li');heading.className='index-group';heading.textContent=group;list.append(heading);}}const li=document.createElement('li'),button=document.createElement('button'),title=document.createElement('span'),preview=document.createElement('span');button.type='button';button.dataset.jump=String(row.index);button.dataset.indexRole=row.role;if(row.index===state.current)button.setAttribute('aria-current','page');title.textContent='S'+String(row.index+1).padStart(2,'0')+' · '+row.title;preview.className='index-preview';preview.textContent=row.preview.slice(0,180)+(row.preview.length>180?'…':'');button.append(title,preview);li.append(button);list.append(li);}if(!rows.length){const li=document.createElement('li');li.textContent=language==='en'?'No matching slides':'일치하는 슬라이드 없음';list.append(li);}document.querySelectorAll('[data-index-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.indexFilter===indexFilter)));byId('index-count').textContent=rows.length+' / '+slides.length;}
 function wrapWords(root){const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),texts=[];while(walker.nextNode())texts.push(walker.currentNode);for(const text of texts){const fragment=document.createDocumentFragment();for(const part of text.nodeValue.split(/(\s+)/)){if(!part)continue;if(/^\s+$/.test(part))fragment.append(document.createTextNode(part));else{const word=document.createElement('span');word.className='word'+(/^(?:https?:\/\/|(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}(?:\/|$))/.test(part)?' word-url':'');word.textContent=part;fragment.append(word);}}text.replaceWith(fragment);}}
 function updateNotes(){const s=slides[state.current],hasToggle=!!s.querySelector('.r-toggle');byId('note-title').textContent=currentHeading(s);byId('note-keys').textContent=(language==='en'?'Slide ':'현재 장 ')+(state.current+1)+' / '+slides.length+' · '+state.steps[state.current]+' / '+counts[state.current]+(hasToggle?' · '+(s.querySelector('.r-toggle-ctl button[data-view="'+state.views[state.current]+'"]')?.textContent||state.views[state.current]):'');byId('note-content').textContent=notes[state.current]|| (language==='en'?'No note loaded':'열린 노트 없음');}
 function paint(){
  const presenting=body.dataset.mode!=='read';
  slides.forEach((s,i)=>{s.classList.toggle('active',i===state.current);s.toggleAttribute('data-active',i===state.current);s.setAttribute('aria-hidden',String(presenting&&i!==state.current));s.setAttribute('aria-label',(i+1)+' / '+slides.length+' '+currentHeading(s));s.inert=presenting&&i!==state.current;
   [...s.querySelectorAll('[data-step]')].forEach((el,j)=>{const visible=body.dataset.mode!=='present'||j<state.steps[i];el.classList.toggle('revealed',j<state.steps[i]);el.setAttribute('aria-hidden',String(!visible));el.inert=!visible;});
   s.querySelectorAll('.r-diagram').forEach(diagram=>{const labels=[...diagram.querySelectorAll('.r-dg-t')].filter(el=>el.closest('[data-step]')?.getAttribute('aria-hidden')!=='true').map(el=>el.textContent);diagram.setAttribute('aria-label',currentHeading(s)+' · '+labels.join(' · '));});
   const toggle=s.querySelector('.r-toggle');if(toggle){toggle.dataset.view=state.views[i];toggle.querySelectorAll('.r-toggle-ctl button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===state.views[i])));}
  });
  byId('position').textContent=(state.current+1)+' / '+slides.length+(counts[state.current]&&body.dataset.mode==='present'?' · '+state.steps[state.current]+'/'+counts[state.current]:'');byId('previous').disabled=state.current===0&&(body.dataset.mode!=='present'||state.steps[0]<=1);byId('next').disabled=state.current===slides.length-1&&(body.dataset.mode!=='present'||state.steps[state.current]===counts[state.current]);
  byId('mode-toggle').value=body.dataset.mode;byId('notes-toggle').setAttribute('aria-pressed',String(body.dataset.notes==='open'));updateNotes();resize();
 }
 function dispatch(action){state=DeckModel.reduce(state,action);if(action.type==='next'||action.type==='previous'||action.type==='goto'){try{history.replaceState(null,'','#'+slides[state.current].id);}catch{} }paint();if(body.dataset.mode==='read'&&['next','previous','goto'].includes(action.type))slides[state.current].scrollIntoView({block:'start',behavior:'auto'});}
 function resize(){
  const v=window.visualViewport;
  // Preserve native pinch zoom. Only layout viewport changes refit the page.
  if(v&&v.scale>1.01)return;
  const top=v?.offsetTop||0,left=v?.offsetLeft||0,width=v?.width||innerWidth,height=v?.height||innerHeight;
  body.style.setProperty('--view-top',top+'px');body.style.setProperty('--view-left',left+'px');body.style.setProperty('--view-width',width+'px');body.style.setProperty('--view-bottom',Math.max(0,innerHeight-top-height)+'px');
  const toolbar=document.querySelector('.toolbar').getBoundingClientRect(),controls=document.querySelector('.controls').getBoundingClientRect(),active=slides[state.current];
  body.style.setProperty('--toolbar-height',toolbar.height+'px');
  body.style.setProperty('--controls-height',controls.height+'px');
  let stageTop=body.dataset.chrome==='hidden'?top:Math.max(top,toolbar.bottom),stageBottom=body.dataset.chrome==='hidden'?top+height:Math.min(top+height,controls.top);
  let stageLeft=left,stageWidth=width;
  if(body.dataset.notes==='open'){
   const notesRect=byId('notes-panel').getBoundingClientRect();
   if(compact.matches)stageBottom=Math.min(stageBottom,notesRect.top);else stageWidth=Math.max(1,notesRect.left-stageLeft);
  }
  body.style.setProperty('--stage-top',stageTop+'px');body.style.setProperty('--stage-left',stageLeft+'px');body.style.setProperty('--stage-width',Math.max(1,stageWidth)+'px');body.style.setProperty('--stage-height',Math.max(1,stageBottom-stageTop)+'px');
  if(body.dataset.mode==='present'){
   const h=body.dataset.aspect==='16x10'?1200:1080;
   body.style.setProperty('--scale',String(Math.max(.01,Math.min(stageWidth/1920,(stageBottom-stageTop)/h))));
  }else if(body.dataset.mode==='fit'){
   const availableWidth=Math.max(1,stageWidth-16),availableHeight=Math.max(1,stageBottom-stageTop-16);
   let best=null;
   for(const density of ['normal','compact'])for(const factor of [1,1.08,1.16,1.24,1.32]){
    const width=Math.min(availableWidth*factor,720);
    body.style.setProperty('--fit-width',width+'px');body.dataset.fitDensity=density;
    const naturalHeight=active.offsetHeight,scale=Math.min(1,availableWidth/active.offsetWidth,availableHeight/naturalHeight);
    if(!best||scale>best.scale+.001)best={width,density,naturalHeight,scale};
   }
   body.style.setProperty('--fit-width',best.width+'px');body.dataset.fitDensity=best.density;
   body.style.setProperty('--fit-scale',String(Math.max(.01,best.scale)));
   active.dataset.fitScale=String(best.scale);active.dataset.naturalHeight=String(best.naturalHeight);
  }
 }
 function fit(){
  fitScheduled=false;
  const probe=document.createElement('div');probe.inert=true;probe.setAttribute('aria-hidden','true');probe.style.cssText='position:fixed;left:0;top:0;width:1700px;height:1px;overflow:hidden;visibility:hidden;pointer-events:none;contain:layout style;';
  document.body.append(probe);
  try{for(const slide of slides){for(const heading of slide.querySelectorAll('.r-headline,.r-quote p')){
   const clone=heading.cloneNode(true),start=Number(heading.dataset.fitBaseSize)||140,floor=Math.min(start,92);let size=start;
   for(const element of [clone,...clone.querySelectorAll('*')]){element.removeAttribute('id');element.removeAttribute('data-key');element.removeAttribute('data-step');}
   clone.style.removeProperty('--fit-size');clone.style.cssText='display:block;width:1700px;max-width:none;min-width:0;margin:0;padding:0;border:0;font-family:"Pretendard Variable",sans-serif;font-weight:800;font-size:'+size+'px;line-height:1.04;letter-spacing:-.045em;white-space:nowrap;overflow-wrap:normal;word-break:keep-all;';
   clone.querySelectorAll('.r-sub').forEach(sub=>{sub.style.fontSize='64px';sub.style.whiteSpace='normal';});probe.replaceChildren(clone);
   for(let attempt=0;attempt<4&&clone.scrollWidth>clone.clientWidth+1;attempt++){size=Math.max(floor,Math.floor(size*clone.clientWidth/clone.scrollWidth*.995));clone.style.fontSize=size+'px';}
   heading.style.setProperty('--fit-size',size+'px');heading.dataset.fitOverflow=String(clone.scrollWidth>clone.clientWidth+1);heading.dataset.fitBase=String(start);heading.dataset.fitSize=String(size);
  }}}finally{probe.remove();}
  body.dataset.fitRevision=String(Number(body.dataset.fitRevision||0)+1);resize();
  if(initialAnchorPending&&(!document.fonts||document.fonts.status==='loaded')){readingObserver?.takeRecords();readingObserver?.disconnect();const generation=++readingGeneration;initialAnchorPending=false;if(body.dataset.mode==='read')slides[state.current].scrollIntoView({block:'start',behavior:'auto'});requestAnimationFrame(()=>{if(generation===readingGeneration&&!readingSuspended)startReadingObserver(generation);});}
 }
 function scheduleFit(){if(fitScheduled)return;fitScheduled=true;requestAnimationFrame(fit);}
 function setMode(mode){if(!['fit','read','present'].includes(mode))return;manualMode=true;body.dataset.mode=mode;paint();scheduleFit();if(mode==='read')slides[state.current].scrollIntoView({block:'start',behavior:'auto'});}
 function captureReadingAnchor(){
  if(body.dataset.mode!=='read'||initialAnchorPending)return null;
  const slide=slides[state.current],edge=document.querySelector('.toolbar').getBoundingClientRect().bottom+12;
  const candidates=[...slide.querySelectorAll('[data-key]')].filter(node=>!node.closest('.diagram-zoom,.diagram-reading')).map(node=>({node,rect:node.getBoundingClientRect()})).filter(item=>item.rect.height>0&&item.rect.bottom>edge&&item.rect.top<innerHeight).sort((a,b)=>Math.abs(a.rect.top-edge)-Math.abs(b.rect.top-edge));
  const node=candidates[0]?.node||slide;return {node,slide,offset:node.getBoundingClientRect().top,slideOffset:slide.getBoundingClientRect().top,toolbar:edge};
 }
 function startReadingObserver(generation){
  if(typeof IntersectionObserver!=='function'||initialAnchorPending||readingSuspended||dialogs.some(dialog=>dialog.open))return;
  const visibility=new Map();readingObserver=new IntersectionObserver(entries=>{
   if(generation!==readingGeneration||readingSuspended||dialogs.some(dialog=>dialog.open)||body.dataset.mode!=='read'||initialAnchorPending)return;
   entries.forEach(entry=>visibility.set(entry.target,entry));const best=[...visibility.values()].filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
   if(best){state={...state,current:slides.indexOf(best.target)};paint();}
  },{root:byId('slides'),threshold:[.2,.5,.8],rootMargin:'0px 0px -20% 0px'});slides.forEach(slide=>readingObserver.observe(slide));
 }
 function languageTo(code){
  if(code!=='ko'&&!Object.hasOwn(config.translations,code))return;
  anchorTransaction?.finish();
  const anchor=captureReadingAnchor(),generation=++readingGeneration;readingSuspended=true;readingObserver?.takeRecords();readingObserver?.disconnect();
  const scroller=byId('slides'),oldAnchor=scroller.style.overflowAnchor,trace=[];
  if(anchor)scroller.style.overflowAnchor='none';
  const record=phase=>{if(anchor)trace.push({phase,id:anchor.slide.id,top:anchor.node.getBoundingClientRect().top,current:slides[state.current].id,scrollY:byId('slides').scrollTop});body.dataset.anchorTrace=JSON.stringify(trace);};
  const transaction={cancelled:false,finish:()=>{if(anchorTransaction!==transaction)return;for(const event of ['wheel','touchstart','pointerdown','keydown'])window.removeEventListener(event,cancel,true);scroller.style.overflowAnchor=oldAnchor;record(transaction.cancelled?'cancelled':'settled');anchorTransaction=null;readingSuspended=false;readingObserver?.disconnect();startReadingObserver(generation);}};
  const cancel=event=>{if(event.type==='keydown'&&!['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key))return;transaction.cancelled=true;transaction.finish();};
  anchorTransaction=transaction;if(anchor)for(const event of ['wheel','touchstart','pointerdown','keydown'])window.addEventListener(event,cancel,{capture:true,passive:true});
  record('captured');
  try{
   language=code;document.documentElement.lang=code;body.dataset.language=code;const hints=config.layoutHints?.[code]||{};
   for(const [element,base] of localText){let value=config.translations[code]?.[element.dataset.key];if(hints[element.dataset.key]?.lines)value=hints[element.dataset.key].lines.join('|');element.innerHTML=typeof value==='string'?textMarkup(value):base;if(element.matches('.r-step-title,.r-cell-title')&&!element.querySelector('.word'))wrapWords(element);}
   slides.forEach(slide=>{const hint=hints[slide.id]||{};slide.dataset.layout=Object.keys(hint).filter(key=>hint[key]===true).join(' ');slide.querySelectorAll('.r-diagram').forEach(svg=>{const raw=originalViewBoxes.get(svg);svg.setAttribute('viewBox',raw);if(Number.isFinite(hint.diagramViewBoxTop)){const [x,y,w,h]=raw.split(/\s+/).map(Number),top=hint.diagramViewBoxTop;if(top>y&&top<y+h)svg.setAttribute('viewBox',[x,top,w,h-(top-y)].join(' '));}});});
   document.querySelectorAll('[data-ui=diagramZoom]').forEach(element=>element.textContent=code==='en'?'Enlarge diagram':'도식 확대');
   document.querySelectorAll('.diagram-pan').forEach(element=>element.setAttribute('aria-label',code==='en'?'Enlarged diagram · scroll horizontally':'확대 도식 · 좌우 이동'));
   document.querySelectorAll('.diagram-reading').forEach(element=>element.setAttribute('aria-label',code==='en'?'Diagram text reference':'도식의 글자 풀이'));
   byId('lang-toggle').textContent=code==='ko'?'한국어 · EN':'English · KO';rebuildCatalog();paint();scheduleFit();
   record('translated');
  }catch(error){transaction.cancelled=true;transaction.finish();throw error;}
  requestAnimationFrame(()=>{
   if(anchorTransaction!==transaction||generation!==readingGeneration)return;
   if(anchor&&body.dataset.mode==='read'&&!transaction.cancelled){
    const target=anchor.node.isConnected&&anchor.node.getBoundingClientRect().height>0?anchor.node:anchor.slide;
    const edge=document.querySelector('.toolbar').getBoundingClientRect().bottom+12,offset=(target===anchor.node?anchor.offset:anchor.slideOffset)+(anchor.offset>=anchor.toolbar?edge-anchor.toolbar:0);
    byId('slides').scrollBy(0,target.getBoundingClientRect().top-offset);record('restored');
   }
   requestAnimationFrame(transaction.finish);
  });
 }
 function openDialog(dialog,origin){
  if(dialogs.some(item=>item.open))return;
  anchorTransaction?.finish();const savedY=byId('slides').scrollTop,read=body.dataset.mode==='read',generation=++readingGeneration;
  readingSuspended=true;readingObserver?.takeRecords();readingObserver?.disconnect();
  if(dialog.id==='index-dialog'){indexFilter='all';byId('deck-search').value='';renderIndex();}
  focusReturn.set(dialog,origin||document.activeElement);
  if(dialog.showModal)dialog.showModal();else{dialog.setAttribute('open','');byId('slides').inert=true;}
  dialog.querySelector('input,button')?.focus({preventScroll:true});
  if(read){byId('slides').scrollTo(0,savedY);requestAnimationFrame(()=>{if(generation===readingGeneration&&dialog.open&&body.dataset.mode==='read')byId('slides').scrollTo(0,savedY);});}
 }
 function closeDialog(dialog){
  if(!dialog.open)return;
  if(dialog.close)dialog.close();else dialog.removeAttribute('open');
  paint();const target=focusReturn.get(dialog);if(target?.isConnected)target.focus({preventScroll:true});
  if(!anchorTransaction){const generation=++readingGeneration;readingSuspended=false;readingObserver?.disconnect();requestAnimationFrame(()=>{if(generation===readingGeneration)startReadingObserver(generation);});}
 }
 dialogs.forEach(d=>{d.addEventListener('cancel',e=>{e.preventDefault();closeDialog(d);});d.addEventListener('click',e=>{if(e.target.closest('[data-close]'))closeDialog(d);});d.addEventListener('keydown',e=>{if(d.id==='index-dialog'&&!e.isComposing&&!e.ctrlKey&&!e.metaKey&&!e.altKey){const search=e.target===byId('deck-search'),item=e.target.closest('[data-jump]'),items=[...d.querySelectorAll('[data-jump]')];if((search&&['ArrowDown','ArrowUp'].includes(e.key))||(item&&['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End'].includes(e.key))){e.preventDefault();const at=items.indexOf(e.target),next=e.key==='Home'?0:e.key==='End'?items.length-1:['ArrowUp','ArrowLeft'].includes(e.key)?(at<0?items.length-1:Math.max(0,at-1)):Math.min(items.length-1,at+1);items[next]?.focus();return;}if(search&&e.key==='Enter'){e.preventDefault();items[0]?.click();return;}}if(e.key==='Tab'){const list=[...d.querySelectorAll('input,button,a[href]')].filter(x=>!x.disabled&&!x.hidden);if(!list.length)return;const first=list[0],last=list[list.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});});
 function theme(){body.dataset.theme=body.dataset.theme==='dark'?'light':'dark';byId('theme-toggle').textContent=body.dataset.theme==='dark'?'라이트':'다크';byId('theme-toggle').setAttribute('aria-pressed',String(body.dataset.theme==='dark'));}
 function chrome(){const hiding=body.dataset.chrome!=='hidden';if(hiding&&document.activeElement.closest('.toolbar,.controls'))chromeFocus=document.activeElement;body.dataset.chrome=hiding?'hidden':'visible';byId('chrome-toggle').setAttribute('aria-expanded',String(!hiding));resize();if(hiding&&chromeFocus)byId('chrome-toggle').focus({preventScroll:true});else if(!hiding&&chromeFocus?.isConnected){chromeFocus.focus({preventScroll:true});chromeFocus=null;}}
 function toggleNotes(){body.dataset.notes=body.dataset.notes==='open'?'closed':'open';byId('notes-panel').hidden=body.dataset.notes!=='open';paint();}
 async function full(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{byId('fullscreen').textContent=language==='en'?'Unavailable':'전체화면 불가';}}
 byId('index-toggle').onclick=e=>openDialog(byId('index-dialog'),e.currentTarget);byId('lang-toggle').onclick=e=>openDialog(byId('language-dialog'),e.currentTarget);byId('help-toggle').onclick=e=>openDialog(byId('help-dialog'),e.currentTarget);byId('deck-search').oninput=renderIndex;document.querySelectorAll('[data-index-filter]').forEach(button=>button.addEventListener('click',()=>{indexFilter=button.dataset.indexFilter;renderIndex();}));
 byId('index-results').onclick=e=>{const b=e.target.closest('[data-jump]');if(!b)return;closeDialog(byId('index-dialog'));dispatch({type:'goto',index:Number(b.dataset.jump)});byId('slides').focus({preventScroll:true});};
 byId('language-dialog').addEventListener('click',e=>{const b=e.target.closest('[data-language]');if(b){languageTo(b.dataset.language);closeDialog(byId('language-dialog'));}});
 byId('mode-toggle').onchange=e=>setMode(e.target.value);byId('previous').onclick=()=>dispatch(body.dataset.mode!=='present'?{type:'goto',index:Math.max(0,state.current-1)}:{type:'previous'});byId('next').onclick=()=>dispatch(body.dataset.mode!=='present'?{type:'goto',index:Math.min(slides.length-1,state.current+1)}:{type:'next'});byId('tools-toggle').onclick=()=>{const expanded=body.dataset.tools!=='open';body.dataset.tools=expanded?'open':'closed';byId('tools-toggle').setAttribute('aria-expanded',String(expanded));resize();};byId('theme-toggle').onclick=theme;byId('chrome-toggle').onclick=chrome;byId('fullscreen').onclick=full;byId('notes-toggle').onclick=toggleNotes;
 document.querySelectorAll('.r-toggle-ctl button').forEach(button=>button.addEventListener('click',()=>{const index=slides.indexOf(button.closest('.slide'));if(index!==state.current)state={...state,current:index};dispatch({type:'view',view:button.dataset.view});}));
 byId('notes-file').addEventListener('change',async e=>{byId('note-error').textContent='';const file=e.target.files?.[0];if(!file)return;try{if(file.size>1024*1024)throw new Error('1 MB 이하 JSON 파일을 선택하세요.');const data=JSON.parse(await file.text());if(!Array.isArray(data)||data.length!==slides.length||data.some(s=>typeof s!=='string'||s.length>20000))throw new Error('슬라이드 수와 같은 길이의 문자열 배열이 필요합니다.');notes=data;updateNotes();}catch(error){byId('note-error').textContent=error.message;}finally{e.target.value='';}});
 byId('notes-clear').onclick=()=>{notes=[];updateNotes();};window.addEventListener('pagehide',()=>{notes=[];byId('note-content').textContent='';});
 document.addEventListener('keydown',e=>{
  if(e.defaultPrevented||e.isComposing||e.ctrlKey||e.metaKey||e.altKey||dialogs.some(d=>d.open))return;
  if(e.target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role=textbox],[role=slider],[role=listbox],[role=combobox]'))return;
  const key=e.key.toLowerCase();
  if(e.target.closest('button,a,summary')&&[' ','enter','tab'].includes(key))return;
  if(body.dataset.mode!=='read'&&['arrowright','pagedown',' ','arrowleft','pageup','home','end'].includes(key)){e.preventDefault();if(body.dataset.mode==='fit'){dispatch({type:'goto',index:key==='home'?0:key==='end'?slides.length-1:Math.max(0,Math.min(slides.length-1,state.current+(['arrowleft','pageup'].includes(key)?-1:1)))});return;}dispatch(key==='home'?{type:'goto',index:0}:key==='end'?{type:'goto',index:slides.length-1}:{type:['arrowleft','pageup'].includes(key)?'previous':'next'});return;}
  const actions={i:()=>openDialog(byId('index-dialog')),l:()=>openDialog(byId('language-dialog')),'?':()=>openDialog(byId('help-dialog')),t:theme,h:chrome,f:full,n:toggleNotes,p:()=>setMode(['fit','read','present'][(['fit','read','present'].indexOf(body.dataset.mode)+1)%3]),a:()=>{body.dataset.aspect=body.dataset.aspect==='16x10'?'16x9':'16x10';scheduleFit();},r:()=>dispatch({type:'reset'}),m:()=>{if(slides[state.current].querySelector('.r-toggle'))dispatch({type:'view',view:state.views[state.current]==='delegate'?'keep':'delegate'});}};
  if(actions[key]){e.preventDefault();actions[key]();}
 });
 function fromHash(){const hash=location.hash.slice(1),direct=slides.findIndex(s=>s.id===hash);if(direct>=0)return direct;if(/^\d+$/.test(hash))return Math.max(0,Math.min(slides.length-1,Number(hash)-1));return 0;}
 window.addEventListener('hashchange',()=>dispatch({type:'goto',index:fromHash()}));window.addEventListener('resize',resize);window.visualViewport?.addEventListener('resize',resize);window.visualViewport?.addEventListener('scroll',resize);document.addEventListener('fullscreenchange',resize);if(typeof ResizeObserver==='function')new ResizeObserver(resize).observe(document.querySelector('.toolbar'));compact.addEventListener('change',()=>{if(!manualMode){body.dataset.mode=compact.matches?'fit':'present';paint();scheduleFit();}});reduceMotion.addEventListener('change',()=>{body.dataset.reducedMotion=String(reduceMotion.matches);paint();});
 // Progressive enhancement is enabled only after all required elements and listeners exist.
 manualMode=['read','fit','present'].includes(qs.get('mode'));body.dataset.tools='closed';document.querySelector('.toolbar').hidden=false;document.querySelector('.controls').hidden=false;byId('chrome-toggle').hidden=false;body.dataset.chrome='visible';body.dataset.reducedMotion=String(reduceMotion.matches);body.dataset.mode=['read','fit','present'].includes(qs.get('mode'))?qs.get('mode'):compact.matches?'fit':'present';body.dataset.theme=['light','dark'].includes(qs.get('theme'))?qs.get('theme'):config.theme;byId('theme-toggle').textContent=body.dataset.theme==='dark'?'라이트':'다크';
 state={...state,current:fromHash()};if(qs.get('mode')==='notes'){body.dataset.notes='open';byId('notes-panel').hidden=false;}rebuildCatalog();if(qs.get('lang'))languageTo(qs.get('lang'));paint();scheduleFit();document.fonts?.ready.then(scheduleFit);body.dataset.ready='true';resize();
 startReadingObserver(readingGeneration);
})();
