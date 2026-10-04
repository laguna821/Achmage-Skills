/* Offline, fail-closed evaluator for observations from the supported browser API. */
const fs=require('node:fs'),assert=require('node:assert/strict');
const [path,n,langs='ko']=process.argv.slice(2),count=Number(n),languages=langs.split(',');
assert(path&&Number.isInteger(count)&&count>0,'Usage: node check_mobile_matrix.js observations.json slideCount');
const rows=JSON.parse(fs.readFileSync(path,'utf8')),errors=[];
assert(Array.isArray(rows)&&rows.length,'Nonempty observation array required');
const cases=['read','present'].flatMap(mode=>[[375,812],[768,1024],[812,375],[1440,1000]].map(viewport=>({mode,viewport}))).concat([[375,675],[390,664],[375,812],[768,1024]].map(viewport=>({mode:'fit',viewport})));
const ids=rows[0].allIds;
assert(Array.isArray(ids)&&new Set(ids).size===count&&ids.length===count,'Complete actual DOM ID inventory required');
const same=(a,b)=>Array.isArray(a)&&a.length===b.length&&a.every((v,i)=>Math.abs(v-b[i])<1);
const rect=b=>b&&['x','y','width','height','right','bottom'].every(k=>Number.isFinite(b[k]))&&b.width>0&&b.height>0&&Math.abs(b.right-b.x-b.width)<1&&Math.abs(b.bottom-b.y-b.height)<1;
const within=(a,b,t=1)=>rect(a)&&rect(b)&&a.x>=b.x-t&&a.y>=b.y-t&&a.right<=b.right+t&&a.bottom<=b.bottom+t;
const err=(type,r,s,extra={})=>errors.push({type,language:r?.language,theme:r?.theme,mode:r?.mode,vp:r?.viewport,id:s?.id,...extra});
for(const language of languages)for(const theme of ['light','dark'])for(const c of cases){
 const selected=rows.filter(r=>r.language===language&&r.theme===theme&&r.mode===c.mode&&same(r.viewport,c.viewport));
 const found=new Set(selected.flatMap(r=>r.slides.map(s=>s.id)));
 if(found.size!==count||ids.some(id=>!found.has(id)))errors.push({type:'missing-coverage',language,theme,...c,expected:count,actual:found.size});
}
for(const r of rows){
 if(r.schemaVersion!==3||!languages.includes(r.language)||!['read','fit','present'].includes(r.mode)||!['light','dark'].includes(r.theme)||!Array.isArray(r.viewport)||r.viewport.length!==2||r.viewport.some(v=>!Number.isFinite(v)||v<=0)){err('malformed-row',r);continue;}
 if(JSON.stringify(r.allIds)!==JSON.stringify(ids))err('id-inventory-changed',r);
 if(r.fontStatus!=='loaded'||r.ready!=='true')err('not-ready',r);
 const viewport={x:0,y:0,width:r.viewport[0],height:r.viewport[1],right:r.viewport[0],bottom:r.viewport[1]};
 if(!within(r.stage,viewport))err('stage-outside-viewport',r);
 if(r.chrome!=='hidden'&&(!rect(r.toolbar)||!rect(r.controls)||r.stage.y<r.toolbar.bottom-1||r.stage.bottom>r.controls.y+1))err('chrome-overlap',r);
 if(r.overflow)err('page-overflow',r);
 if(!Array.isArray(r.slides)||!r.slides.length||(r.mode!=='read'&&r.slides.length!==1)){err('missing-slide',r);continue;}
 for(const s of r.slides){
  if(!ids.includes(s.id)||!rect(s.rect)||!Number.isFinite(s.scale)||s.scale<=0||!Number.isFinite(s.minBody)||!rect(s.evidence)||!rect(s.footer)||!Array.isArray(s.geometry)||s.geometry.length<2||s.geometry.some(g=>!Array.isArray(g.rect)||g.rect.length!==4||g.rect.some(v=>!Number.isFinite(v))||typeof g.text!=='string')){err('invalid-geometry',r,s);continue;}
  if(!Array.isArray(s.out)||!Array.isArray(s.collision)||s.out.length||s.collision.length)err('content-boundary',r,s,{out:s.out,collision:s.collision});
  if(!Array.isArray(s.textOverflow)||s.textOverflow.length)err('text-overhang',r,s,{textOverflow:s.textOverflow});
  if(!Array.isArray(s.glyphs)||!s.glyphs.length||s.glyphs.some(g=>typeof g.text!=='string'||!rect(g.box)||!rect(g.glyph)||g.glyph.x<g.box.x-1||g.glyph.right>g.box.right+1)||!Array.isArray(s.glyphOverflow)||s.glyphOverflow.length)err('glyph-overhang',r,s,{glyphOverflow:s.glyphOverflow});
  if(r.mode!=='read'&&(!within(s.rect,r.stage)||!within(s.evidence,s.rect)||!within(s.footer,s.rect)))err('slide-or-footer-outside-stage',r,s);
  if(!Array.isArray(s.pans))err('missing-pan-evidence',r,s);
  for(const p of s.pans||[])if(r.mode!=='read'||!rect(p.rect)||p.tabIndex<0||!p.label||p.scrollWidth<=p.clientWidth||p.rect.x<s.rect.x-1||p.rect.right>s.rect.right+1)err('unverified-local-pan',r,s);
  if(r.mode==='fit'&&(s.minBody<12||s.unsupportedDiagrams!==0))err('fit-legibility-or-projection',r,s,{minBody:s.minBody,unsupportedDiagrams:s.unsupportedDiagrams});
  if(r.mode!=='present')continue;
  const base=rows.find(b=>b.language===r.language&&b.theme===r.theme&&b.mode==='present'&&same(b.viewport,[1440,1000])&&b.aspect===r.aspect&&b.slides.some(t=>t.id===s.id))?.slides.find(t=>t.id===s.id);
  if(!base||!Array.isArray(base.geometry)||base.geometry.length!==s.geometry.length){err('missing-or-different-desktop-reference',r,s);continue;}
  let delta=0,columns=false;
  s.geometry.forEach((g,i)=>{const b=base.geometry[i];if(g.key!==b.key||g.text!==b.text)err('meaning-order-change',r,s,{key:g.key});g.rect.forEach((v,j)=>delta=Math.max(delta,Math.abs(v-b.rect[j])));columns ||= g.columns!==b.columns;});
  if(delta>2||columns)err('canvas-reflow',r,s,{maxCanvasPixelDelta:delta,columns});
 }
}
const result={status:errors.length?'fail':'pass',slideCount:count,observations:rows.length,languages,cases,errors,limits:['Chromium viewport observations; physical iPhone/WebKit unverified','Fit body 12 CSS px is a screening floor in portrait/tablet with tools and notes closed; visual review still required','Landscape fit, open tools/notes, zoom and state transitions require separate scoped evidence','No-JS, print and table pan keyboard reachability require separate evidence']};
process.stdout.write(JSON.stringify(result,null,2)+'\n');process.exitCode=errors.length?1:0;

