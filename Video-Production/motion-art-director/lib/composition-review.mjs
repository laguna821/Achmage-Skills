import fs from 'node:fs';
import path from 'node:path';
import {hash,write,escape} from './io.mjs';
import {html} from './scene.mjs';
import {browser,pageFor} from './browser.mjs';
import {containerState} from './media-container.mjs';

const arr=x=>Array.isArray(x)?x:[];
const bucket=(v,unit)=>Math.round((Number(v)||0)/unit);
// Deliberately excludes copy, layer IDs and authored layout labels. A new name
// cannot turn an unchanged drawing or screen arrangement into a new composition.
function art(l){
 const svg=String(l.svg||'').replace(/\bid="[^"]*"/g,'id="ref"').replace(/url\(#[^)]+\)/g,'url(#ref)');
 return {kind:l.kind,svg,morph:arr(l.morph).map(k=>k.d),extension:l.extension,mode:l.mode,asset:l.kind==='image'?l.asset_id:undefined};
}
export function compositionInventory(p){
 const scenes=arr(p.scenes),fps=p.output?.fps||30,rows=[],findings=[];
 for(const s of scenes){
  const c=s.composition;if(!c){rows.push({scene:s.id,supported:false});continue;}
  const W=c.width||1920,H=c.height||1080,layers=arr(c.layers);
  const spatial=layers.filter(l=>l.kind==='text'||l.kind==='video'||l.kind==='image').map(l=>l.kind==='text'
   ?['text',bucket(l.position?.[0],W/20),bucket(l.position?.[1],H/20),bucket(l.size,H/40),l.align||'middle',l.font||'Pretendard']
   :[l.kind,...arr(l.rect).map((n,i)=>bucket(n,i%2?H/20:W/20))]);
  const graphics=layers.filter(l=>l.kind!=='text'&&l.kind!=='video').map(art);
  // Empty/one-decoration layouts are too weak to compare meaningfully.
  const layoutKey=spatial.length>=2?hash(spatial):null;
  const artKey=graphics.length?hash(graphics):null;
  const videos=layers.filter(l=>l.kind==='video');
  const assets=videos.map(l=>p.assets?.find(a=>a.asset_id===l.asset_id));
  videos.forEach((l,i)=>{
   const a=assets[i];if(a?.width&&l.rect?.[2]>a.width*1.5)findings.push({code:'SOURCE_RESOLUTION_PRESSURE',scene:s.id,time:s.start/fps,severity:'review',layer:l.id,sourceWidth:a.width,displayWidth:l.rect[2],message:'Source requires substantial enlargement. Acquire an appropriate source or deliberately redesign; do not default every shot to the same small panel.'});
  });
  rows.push({scene:s.id,start:s.start/fps,end:s.end/fps,supported:true,layoutKey,artKey,media:videos.length,texts:layers.filter(l=>l.kind==='text').map(l=>({id:l.id,text:l.text||l.content_id})),declaredLayout:p.editorial_plan?.shots?.find(q=>q?.scene_id===s.id)?.layout});
 }
 const group=key=>{const map=new Map();for(const r of rows)if(r[key]){if(!map.has(r[key]))map.set(r[key],[]);map.get(r[key]).push(r.scene);}return [...map].filter(([,ids])=>ids.length>=3).map(([signature,scenes])=>({signature,scenes}));};
 const layouts=group('layoutKey'),artworks=group('artKey');
 for(const g of layouts)findings.push({code:'RECURRING_SCREEN_ARRANGEMENT',severity:'review',scenes:g.scenes,message:'Similar text/media placement across the film, independent of layout labels. Compare actual shots; purposeful motifs are allowed.'});
 for(const g of artworks)findings.push({code:'RECURRING_GRAPHIC_CONTENT',severity:'review',scenes:g.scenes,message:'Same authored graphic content recurs. Check whether state, viewpoint or narrative consequence actually changes.'});
 return {version:'composition-review-v1',rows,groups:{layouts,artworks},findings,scope:'Source-structure triage, not pixel equivalence or an aesthetic score. It does not require an arbitrary quota of different layouts.'};
}
const intersect=(a,b)=>Math.max(0,Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y));
export function geometryFindings(layers,{scene,time,width,height}){
 const result=[],visible=layers.filter(l=>l.opacity>.1&&l.width>0&&l.height>0),texts=visible.filter(l=>l.kind==='text');
 const add=(code,l,other)=>result.push({code,severity:'review',scene,time,layer:l.id,...(other?{other:other.id}:{}),bounds:[l.x,l.y,l.width,l.height]});
 for(const l of texts){
  if(l.x<-.5||l.y<-.5||l.x+l.width>width+.5||l.y+l.height>height+.5)add('TEXT_OUTSIDE_FRAME',l);
  for(const other of visible){
   if(other.id===l.id)continue;
   const overlap=intersect(l,other)/(l.width*l.height);
   if(overlap<=.1)continue;
   if(other.kind==='text'&&other.order>l.order)add('TEXT_TEXT_OVERLAP',l,other);
   else if(['video','image'].includes(other.kind)&&other.order>l.order)add('LATER_MEDIA_OVER_TEXT',l,other);
   else if(other.kind==='svg'&&other.pathCount>=20&&overlap>.4)add('TEXT_ON_DENSE_DRAWING',l,other);
  }
 }
 return result;
}

// Measures the real bundled font and SVG transforms at bounded sample times.
// Video windows are geometry stand-ins; camera, masks and final pixel contrast
// still require encoded-output review. No media is fetched or played here.
export async function measureComposition(p,out,{maxSamplesPerScene=7}={}){
 if(!Number.isInteger(maxSamplesPerScene)||maxSamplesPerScene<3||maxSamplesPerScene>12)throw Error('Use 3–12 samples per scene');
 if(p.scenes.length>150)throw Error('Split review into at most150 scenes');
 if(fs.existsSync(path.join(out,'geometry.json')))throw Error('Preserve prior composition evidence; choose a new output directory');
 const q=structuredClone(p);q.renderer='vector-composite';q.profile={...q.profile,rasterizer:'chromium'};
 const issues=[],samples=[],fps=p.output.fps||30;
 for(const s of q.scenes){
  if(!s.composition)throw Error('Composition geometry supports authored vector/hybrid scenes only');
  delete s.transition_in;
  for(const l of s.composition.layers)if(l.kind==='video'||l.kind==='image'){
   const r=l.rect||[0,0,1920,1080];l.kind='svg';l.svg=`<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" fill="#344148"/>`;
  }
 }
 const file=path.join(out,'geometry.html');write(file,html(q,{controls:false}));
 const b=await browser(q);let context;
 try{
  const pageState=await pageFor(b,file,960,540);context=pageState.context;const page=pageState.page;
  await page.evaluate(()=>document.fonts.ready);
  for(const [index,s] of p.scenes.entries()){
   const duration=(s.end-s.start)/fps,frames=new Set([s.start,Math.floor((s.start+s.end-1)/2),s.end-1]);
   for(const l of s.composition.layers)for(const k of arr(l.keyframes)){const f=s.start+Math.round(k.at*fps);if(f>=s.start&&f<s.end)frames.add(f);}
   const all=[...frames].sort((a,b)=>a-b),selected=all.length<=maxSamplesPerScene?all:Array.from({length:maxSamplesPerScene},(_,i)=>all[Math.round(i*(all.length-1)/(maxSamplesPerScene-1))]);
   for(const frame of selected){
    const time=frame/fps;
    await page.evaluate(({index,frame})=>{document.getElementById('stage').innerHTML=window.__vectorScene(PROJECT.scenes[index],frame);},{index,frame});
    const measured=await page.evaluate(()=>{
     const stage=document.getElementById('stage'),base=stage.getBoundingClientRect();
     return [...stage.querySelectorAll('[data-layer-id]')].map((g,order)=>{const r=g.getBoundingClientRect();return {id:g.getAttribute('data-layer-id'),order,x:(r.x-base.x)*1920/base.width,y:(r.y-base.y)*1080/base.height,width:r.width*1920/base.width,height:r.height*1080/base.height,opacity:Number(g.getAttribute('opacity')??1),pathCount:g.querySelectorAll('path,line,polyline').length};});
    });
    const c=s.composition,W=c.width||1920,H=c.height||1080,fit=Math.min(1920/W,1080/H),ox=(1920-W*fit)/2,oy=(1080-H*fit)/2;
    for(const row of measured){const original=c.layers.find(l=>l.id===row.id);row.kind=original?.kind;row.text=original?.text;
     if(original?.media_handoff){const state=containerState(original.media_handoff,frame);Object.assign(row,{x:ox+state.x*fit,y:oy+state.y*fit,width:state.width*fit,height:state.height*fit});}
    }
    issues.push(...geometryFindings(measured,{scene:s.id,time,width:1920,height:1080}));samples.push({scene:s.id,frame,time,layers:measured});
   }
  }
  if(pageState.errors.length||pageState.denied.length)throw Error(JSON.stringify({errors:pageState.errors,denied:pageState.denied}));
 }finally{await context?.close();await b.close();}
 const result={version:'composition-geometry-v1',projectSha256:hash(p),samples,findings:issues,coverage:{font:'bundled font loaded; actual SVG bounds',video:'window geometry only; no source pixels',messages:p.message_track?.render_mode==='post-composite'?'not measured; inspect final encoded titles':'scene text measured',camera:p.scenes.some(s=>s.composition?.camera)?'not measured; inspect final output':'none',masks:'bounding-box candidates; clipping/intent can create false positives',listening:'not performed'},qualityDecision:'not determined'};
 write(path.join(out,'geometry.json'),result);return result;
}

export function compositionReviewHtml(report){
 const e=escape,findings=report.findings||[];
 return '<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>구도와 반복 검토</title><style>body{font:17px system-ui;background:#f6f3ea;color:#182e35;max-width:1040px;margin:40px auto;padding:20px}article{background:white;padding:20px;margin:15px 0}p{line-height:1.65}code{overflow-wrap:anywhere}</style><h1>구도와 반복 검토</h1><p>이 목록은 검토할 후보입니다. 이름·문구를 바꾸어 반복을 숨기지 않고, 의도한 모티프와 불필요한 재사용을 실제 화면에서 구분합니다. 경고가 없다는 이유로 미감 합격으로 판정하지 않습니다.</p>'+findings.map(f=>'<article><b>'+e(f.code)+'</b><p>'+e(f.scene||arr(f.scenes).join(', '))+'</p><p>'+e(f.message||[f.layer,f.other].filter(Boolean).join(' ↔ '))+'</p></article>').join('')+'</html>';
}
