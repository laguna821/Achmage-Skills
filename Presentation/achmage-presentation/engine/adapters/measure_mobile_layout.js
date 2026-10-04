() => {
 const visible=e=>{if(!e.getClientRects().length)return false;for(let n=e;n&&n!==document.body;n=n.parentElement){const c=getComputedStyle(n);if(c.display==='none'||c.visibility==='hidden')return false;if(n.tagName==='DETAILS'&&!n.open&&!e.closest('summary'))return false;}return true;};
 const rect=e=>{const b=e.getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height,right:b.right,bottom:b.bottom};};
 const mode=document.body.dataset.mode,staged=mode!=='read';
 const all=[...document.querySelectorAll('.slide')],sections=all.filter(s=>!staged||s.classList.contains('active'));
 return {schemaVersion:3,mode,language:document.documentElement.lang,theme:document.body.dataset.theme,viewport:[innerWidth,innerHeight],aspect:document.body.dataset.aspect,ready:document.body.dataset.ready,fontStatus:document.fonts.status,allIds:all.map(s=>s.id),stage:rect(document.querySelector('#slides')),toolbar:rect(document.querySelector('.toolbar')),controls:rect(document.querySelector('.controls')),chrome:document.body.dataset.chrome,tools:document.body.dataset.tools,notes:document.body.dataset.notes,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+1,slides:sections.map(s=>{
 const r=rect(s),scale=r.width/s.offsetWidth;
 const norm=e=>{const b=rect(e);return [b.x-r.x,b.y-r.y,b.width,b.height].map(v=>Math.round(v/scale*100)/100);};
 const evidence=s.querySelector('.sheet-evidence'),footer=s.querySelector('.sheet-footer');
 const leaves=[...s.querySelectorAll('*')].filter(e=>!e.children.length&&e.textContent.trim()&&visible(e)&&!e.closest('svg'));
 const bodies=leaves.filter(e=>e.closest('.sheet-body')&&!e.closest('.r-kicker'));
 const font=e=>Number(getComputedStyle(e).fontSize.replace('px',''))*scale;
 const panNodes=[...s.querySelectorAll('.diagram-pan'),...(s.dataset.kind==='table'?[s.querySelector('.sheet-body')]:[])].filter(e=>e&&visible(e)&&['auto','scroll'].includes(getComputedStyle(e).overflowX)&&e.scrollWidth>e.clientWidth+1);
 const localPan=e=>mode==='read'&&panNodes.some(p=>p.contains(e));
 const out=leaves.filter(e=>{const b=rect(e);return (!localPan(e)&&(b.x<r.x-1||b.right>r.right+1))||(staged&&(b.bottom>r.bottom+1||b.y<r.y-1))}).map(e=>e.textContent.slice(0,60));
 const collision=staged?bodies.filter(e=>rect(e).bottom>rect(evidence).y+1).map(e=>e.textContent.slice(0,60)):[];
 const geometry=[...new Set([...leaves,...s.querySelectorAll('.r-diagram,.r-toggle-grid,.r-compare,.r-stats,.r-steps,.r-bar,.sheet-evidence,.sheet-footer')])].filter(visible).filter(e=>!e.closest('.diagram-zoom')).map((e,i)=>({key:e.getAttribute('data-key')||String(e.className)+'-'+i,rect:norm(e),columns:getComputedStyle(e).gridTemplateColumns,text:e.textContent.trim().slice(0,60)}));
 const textOverflow=leaves.filter(e=>e.clientWidth>0&&e.scrollWidth>e.clientWidth+1&&!localPan(e)).map(e=>({text:e.textContent.slice(0,60),client:e.clientWidth,scroll:e.scrollWidth}));
 const glyphs=leaves.filter(e=>e.clientWidth>0&&!localPan(e)).map(e=>{const range=document.createRange();range.selectNodeContents(e);const b=range.getBoundingClientRect();return {text:e.textContent.slice(0,60),box:rect(e),glyph:{x:b.x,y:b.y,right:b.right,bottom:b.bottom,width:b.width,height:b.height}};});
 const glyphOverflow=glyphs.filter(g=>g.glyph.x<g.box.x-1||g.glyph.right>g.box.right+1);
 return {textOverflow,glyphOverflow,glyphs,id:s.id,kind:s.dataset.kind,rect:r,scale,geometry,out,collision,evidence:rect(evidence),footer:rect(footer),minBody:Math.min(...bodies.map(font)),smallBody:bodies.filter(e=>font(e)<12).map(e=>({text:e.textContent.slice(0,50),size:font(e)})),unsupportedDiagrams:[...s.querySelectorAll('.r-diagram[data-fit-projection=unverified]')].filter(visible).length,pans:panNodes.map(e=>({rect:rect(e),clientWidth:e.clientWidth,scrollWidth:e.scrollWidth,scrollLeft:e.scrollLeft,tabIndex:e.tabIndex,role:e.getAttribute('role'),label:e.getAttribute('aria-label')}))};
 })};
}
