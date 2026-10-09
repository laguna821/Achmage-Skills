(() => {
'use strict';
const $=id=>document.getElementById(id),config=JSON.parse($('series-config').textContent);
const stage=$('stage'),templates=[...stage.children].map(x=>x.cloneNode(true));
const media=matchMedia('(prefers-reduced-motion: reduce)');
let scenes=[],index=0,manualPaused=!config.autoplay||media.matches,hovered=false,hidden=document.hidden;
let elapsed=0,last=performance.now(),ready=false,resizeFrame=0,noticeTimer,returnFocus=null;
let theme=config.defaultTheme||'alternating';
try{theme=localStorage.getItem('poster-series-theme-v2')||theme;}catch{}
if(!['alternating','authored','light','dark'].includes(theme))theme='alternating';
$('theme').value=theme;
function announce(text){$('notice').textContent=text;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>$('notice').textContent='',4000)}
function setViewport(){
 const vv=window.visualViewport;
 if(vv&&vv.scale>1.02){pause();return false;}
 document.documentElement.style.setProperty('--vh',(vv?vv.height:innerHeight)+'px');
 return true;
}
function paintTheme(){
 const resolved=theme==='alternating'?(index%2?'dark':'light'):theme==='authored'?(scenes[index]?.dataset.theme||'light'):theme;
 stage.dataset.theme=resolved;document.documentElement.dataset.theme=resolved;
 document.querySelector('meta[name="theme-color"]').content=resolved==='dark'?'#0c1c31':'#f6f8f7';
}
function setPlayback(){
 const running=ready&&!manualPaused&&!hovered&&!hidden&&!media.matches&&scenes.length>1;
 $('play').textContent=running?'Ⅱ':'▷';$('play').setAttribute('aria-label',running?'자동 순환 정지':'자동 순환 재생');
 $('play').setAttribute('aria-pressed',String(!manualPaused));
 stage.setAttribute('aria-live',manualPaused?'polite':'off');
 document.documentElement.style.setProperty('--progress',Math.min(100,100*elapsed/((scenes[index]?.dataset.seconds||4)*1000))+'%');
 return running;
}
function pause(){manualPaused=true;setPlayback();}
function show(n,{user=false,hash=false}={}){
 if(user)pause();index=(n+scenes.length)%scenes.length;elapsed=0;
 scenes.forEach((s,i)=>{s.classList.toggle('active',i===index);s.inert=i!==index;s.setAttribute('aria-hidden',String(i!==index));});
 $('scene-menu').textContent=(index+1)+' / '+scenes.length;
 $('scene-menu').setAttribute('aria-label','포스터 목차, '+(index+1)+' / '+scenes.length);
 document.querySelectorAll('#chapter-links button').forEach((b,i)=>b.setAttribute('aria-current',String(i===index)));
 paintTheme();setPlayback();
 if(hash)history.replaceState(null,'','#'+scenes[index].id);
}
// One authored page is one complete poster. Viewport changes never create pages.
function fitSeries(){
 const sheets=scenes.map(sc=>sc.querySelector('.poster-sheet'));
 scenes.forEach(sc=>{sc.style.display='block';sc.style.visibility='hidden';});
 const availableW=Math.max(1,stage.clientWidth-12),availableH=Math.max(1,stage.clientHeight-12);
 let best=null;
 // Measure the whole set at each width. A page change must never change zoom.
 for(const width of [640,720,800,900,1000]){
  sheets.forEach(sheet=>{sheet.style.width=width+'px';sheet.style.transform='none';sheet.style.height='auto';});
  const height=Math.max(...sheets.map(sheet=>sheet.scrollHeight));
  const scale=Math.min(availableW/width,availableH/height,1.2);
  const paintedWidth=width*scale;
  const portraitMobile=stage.clientWidth<=700&&innerHeight>=innerWidth;
  if(!best||(portraitMobile?(paintedWidth>best.paintedWidth+.5||(Math.abs(paintedWidth-best.paintedWidth)<=.5&&scale>best.scale)):scale>best.scale))best={width,height,scale,paintedWidth};
 }
 const left=(stage.clientWidth-best.width*best.scale)/2;
 const top=(stage.clientHeight-best.height*best.scale)/2;
 scenes.forEach((sc,i)=>{
  const sheet=sheets[i];
  sheet.style.width=best.width+'px';sheet.style.height=best.height+'px';
  sheet.style.transform='scale('+best.scale+')';
  sheet.style.left=left+'px';sheet.style.top=top+'px';
  sc.dataset.scale=best.scale.toFixed(4);sc.dataset.logicalWidth=best.width;
  sc.dataset.bodyPx=(22*best.scale).toFixed(2);
  sc.style.display='';sc.style.visibility='';
 });
 stage.dataset.fitContract='shared-series';
}
function hashId(){try{return decodeURIComponent(location.hash.slice(1));}catch{return '';}}
function rebuild(){
 if(!setViewport())return;
 const previous=scenes[index],origin=previous?.dataset.origin;
 const block=previous?.querySelector('.block')?.dataset.contentId;
 stage.replaceChildren();scenes=[];
 document.documentElement.dataset.single=String(templates.length===1);
 for(const temp of templates){const sc=temp.cloneNode(true);scenes.push(sc);stage.append(sc);}
 fitSeries();
 const single=scenes.length===1;
 document.documentElement.dataset.single=String(single);
 document.querySelector('.playback').hidden=single;
 $('single-read').hidden=!single;
 document.querySelector('.progress').hidden=single;
 const links=$('chapter-links');links.replaceChildren();
 scenes.forEach((sc,i)=>{const b=document.createElement('button');b.textContent=String(i+1).padStart(2,'0')+'  '+sc.querySelector('.scene-heading>span').textContent+(sc.id.includes('--')?' / '+sc.querySelector('h2').textContent:'');b.onclick=()=>{show(i,{user:true,hash:true});closeChapters();};links.append(b);});
 let selected=scenes.findIndex(s=>s.dataset.origin===origin&&(!block||s.querySelector('[data-content-id="'+block+'"]')));
 const initialId=hashId();
 if(!ready&&initialId){const found=scenes.findIndex(s=>s.id===initialId||s.dataset.origin===initialId);if(found>=0)selected=found;}
 show(selected>=0?selected:0);
 if(scenes.some(s=>s.dataset.fit)){pause();announce('내용이 긴 포스터은 전체 읽기에서 편하게 확인하세요.');}
}
function closeTools(focus=false){$('tools').hidden=true;$('tools-toggle').setAttribute('aria-expanded','false');if(focus)$('tools-toggle').focus();}
function closeChapters(){ $('chapters').hidden=true;$('scene-menu').setAttribute('aria-expanded','false');$('scene-menu').focus();}
function openRead(){
 pause();returnFocus=document.activeElement?.closest('.tools')?$('tools-toggle'):document.activeElement;closeTools();$('reading').classList.add('open');$('read-close').focus();
 document.querySelector('.poster-shell').inert=true;
}
function closeRead(){
 $('reading').classList.remove('open');document.querySelector('.poster-shell').inert=false;
 (returnFocus&&returnFocus.isConnected?returnFocus:$('tools-toggle')).focus();
}
$('tools-toggle').onclick=()=>{pause();const open=$('tools').hidden;$('tools').hidden=!open;$('tools-toggle').setAttribute('aria-expanded',String(open));if(open)$('theme').focus();};
$('theme').onchange=()=>{pause();theme=$('theme').value;try{localStorage.setItem('poster-series-theme-v2',theme);}catch{}paintTheme();};
$('play').onclick=()=>{manualPaused=!manualPaused;if(media.matches&&!manualPaused){manualPaused=true;announce('기기의 모션 감소 설정을 따릅니다. 이전·다음으로 이동하세요.');}last=performance.now();setPlayback();};
$('prev').onclick=()=>show(index-1,{user:true,hash:true});
$('next').onclick=()=>show(index+1,{user:true,hash:true});
$('scene-menu').onclick=()=>{pause();$('chapters').hidden=!$('chapters').hidden;$('scene-menu').setAttribute('aria-expanded',String(!$('chapters').hidden));if(!$('chapters').hidden)$('chapter-links').querySelector('button[aria-current=true]')?.focus();};
$('chapters-close').onclick=closeChapters;
$('read-open').onclick=openRead;$('single-read').onclick=openRead;$('read-close').onclick=closeRead;
document.querySelector('.skip').onclick=e=>{e.preventDefault();openRead();};
$('copy-link').onclick=async()=>{
 pause();const u=new URL(location.href);u.hash=scenes[index].id;
 try{await navigator.clipboard.writeText(u.href);announce('현재 포스터 링크를 복사했습니다.');}
 catch{history.replaceState(null,'',u.href);announce('주소창에 현재 포스터 주소를 표시했습니다. 주소를 복사해 주세요.');}
};
document.addEventListener('pointerdown',e=>{if(!e.target.closest('#play'))pause();if(!e.target.closest('.top'))closeTools();});
document.addEventListener('focusin',e=>{if(e.target.id!=='play')pause();if(!e.target.closest('.top'))closeTools();});
stage.addEventListener('mouseenter',()=>{hovered=true;setPlayback()});
stage.addEventListener('mouseleave',()=>{hovered=false;last=performance.now();setPlayback()});
document.addEventListener('visibilitychange',()=>{hidden=document.hidden;last=performance.now();setPlayback()});
document.addEventListener('keydown',e=>{
 if(e.key==='Tab'&&$('reading').classList.contains('open')){const f=[...$('reading').querySelectorAll('button,a[href]')];if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===f.at(-1)){e.preventDefault();f[0].focus();}return;}
 if(e.key==='Escape'){if($('reading').classList.contains('open'))closeRead();else if(!$('chapters').hidden)closeChapters();else closeTools(true);return;}
 if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)||!$('tools').hidden||!$('chapters').hidden||$('reading').classList.contains('open'))return;
 if(e.key==='ArrowRight'){e.preventDefault();show(index+1,{user:true,hash:true});}
 if(e.key==='ArrowLeft'){e.preventDefault();show(index-1,{user:true,hash:true});}
 if(e.key.toLowerCase()==='t'){pause();theme=theme==='light'?'dark':'light';$('theme').value=theme;paintTheme();try{localStorage.setItem('poster-series-theme-v2',theme)}catch{}}
});
window.addEventListener('hashchange',()=>{const id=hashId();const n=scenes.findIndex(s=>s.id===id||s.dataset.origin===id);if(n>=0)show(n,{user:true});});
function queueResize(){cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{if(ready)rebuild();});}
window.addEventListener('resize',queueResize);window.visualViewport?.addEventListener('resize',queueResize);
media.addEventListener('change',()=>{if(media.matches)pause();setPlayback()});
if(location.protocol==='file:'&&config.pdf){
 const raw=atob(config.pdf),bytes=Uint8Array.from(raw,c=>c.charCodeAt(0)),url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
 document.querySelectorAll('a[href^="poster.pdf"]').forEach(a=>a.href=url);
}
document.documentElement.classList.add('ready');
Promise.all([document.fonts.ready,...[...document.querySelectorAll('.brands img')].map(i=>i.decode().catch(()=>{}))]).then(()=>{
 rebuild();ready=true;last=performance.now();setPlayback();
 setInterval(()=>{const now=performance.now();if(setPlayback()){elapsed+=Math.min(now-last,1000);if(elapsed>=Number(scenes[index].dataset.seconds)*1000)show(index+1);}last=now;},200);
});
})();
