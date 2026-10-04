/* Owned runtime; slide content is static HTML and remains editable. */
(()=>{
'use strict';
const body=document.body,slides=[...document.querySelectorAll('.slide')],main=document.querySelector('main');
const byId=id=>document.getElementById(id);
let current=0,manualMode=false;
const mq=matchMedia('(max-width:899px)');
const allDetails=[...document.querySelectorAll('details.evidence')];
let beforePrint=[];
function fromHash(){const m=location.hash.match(/^#(?:slide-)?(\d+)$/);return m?Math.max(0,Math.min(slides.length-1,Number(m[1])-1)):0}
function scale(){body.style.setProperty('--toolbar-height',document.querySelector('.toolbar').getBoundingClientRect().height+'px');const rect=main.getBoundingClientRect();body.style.setProperty('--scale',String(Math.min(rect.width/1920,rect.height/1080)))}
function update(){slides.forEach((s,i)=>{s.classList.toggle('active',i===current);if(body.dataset.mode==='present')s.setAttribute('aria-hidden',String(i!==current));else s.removeAttribute('aria-hidden')});
 byId('position').textContent=(current+1)+' / '+slides.length;byId('progress').value=current+1;byId('previous').disabled=current===0;byId('next').disabled=current===slides.length-1;
 byId('mode-toggle').textContent=body.dataset.mode==='present'?'읽기 모드':'발표 모드';byId('mode-toggle').setAttribute('aria-pressed',String(body.dataset.mode==='present'));scale()}
function go(index,scroll=true){current=Math.max(0,Math.min(slides.length-1,index));history.replaceState(null,'','#slide-'+(current+1));update();if(scroll&&body.dataset.mode==='read')slides[current].scrollIntoView({block:'start'})}
function mode(value){body.dataset.mode=value;allDetails.forEach(d=>{d.open=value==='present'});update();if(value==='read')slides[current].scrollIntoView({block:'start'})}
function closeIndex(){byId('deck-index').hidden=true;byId('index-toggle').setAttribute('aria-expanded','false')}
byId('mode-toggle').onclick=()=>{manualMode=true;mode(body.dataset.mode==='present'?'read':'present')};
byId('index-toggle').onclick=()=>{const hidden=!byId('deck-index').hidden;byId('deck-index').hidden=hidden;byId('index-toggle').setAttribute('aria-expanded',String(!hidden));if(!hidden)byId('deck-index').querySelector('a').focus()};
byId('deck-index').onclick=e=>{const a=e.target.closest('a');if(!a)return;e.preventDefault();closeIndex();go(Number(a.hash.replace('#slide-',''))-1);main.focus({preventScroll:true})};
byId('previous').onclick=()=>go(current-1);byId('next').onclick=()=>go(current+1);
byId('theme-toggle').onclick=()=>{const dark=body.dataset.theme!=='dark';body.dataset.theme=dark?'dark':'light';byId('theme-toggle').setAttribute('aria-pressed',String(dark));byId('theme-toggle').textContent=dark?'라이트':'다크'};
byId('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{byId('fullscreen').textContent='전체화면 불가'}};
document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||e.target.closest('input,textarea,select,button,a,summary,[contenteditable="true"]'))return;
 if(e.key==='Escape'){closeIndex();return}
 if(!byId('deck-index').hidden)return;
 if(['ArrowRight','PageDown','ArrowLeft','PageUp','Home','End',' '].includes(e.key)&&body.dataset.mode==='present'){e.preventDefault();go(e.key==='Home'?0:e.key==='End'?slides.length-1:current+(['ArrowLeft','PageUp'].includes(e.key)?-1:1))}
 if(e.key.toLowerCase()==='f'){e.preventDefault();byId('fullscreen').click()}
 if(e.key.toLowerCase()==='p'){manualMode=true;mode(body.dataset.mode==='present'?'read':'present')}
 if(e.key.toLowerCase()==='i')byId('index-toggle').click()
});
document.addEventListener('click',e=>{if(!byId('deck-index').hidden&&!e.target.closest('#deck-index,#index-toggle'))closeIndex()});
window.addEventListener('hashchange',()=>go(fromHash()));
window.addEventListener('resize',scale);document.addEventListener('fullscreenchange',scale);
mq.addEventListener('change',()=>{if(!manualMode)mode(mq.matches?'read':'present')});
window.addEventListener('beforeprint',()=>{beforePrint=allDetails.map(d=>d.open);allDetails.forEach(d=>d.open=true)});
window.addEventListener('afterprint',()=>allDetails.forEach((d,i)=>d.open=beforePrint[i]));
const observer=new IntersectionObserver(entries=>{if(body.dataset.mode!=='read')return;const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(visible){current=slides.indexOf(visible.target);update()}},{threshold:[.3,.6]});slides.forEach(s=>observer.observe(s));
current=fromHash();mode(mq.matches?'read':'present');document.fonts.ready.then(scale);
})();
