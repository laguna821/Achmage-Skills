import path from 'node:path';
import {handoffAudit,hermiteState} from './continuity.mjs';
import {ROOT,write,run,settings,tool} from './io.mjs';
const fields=['x','y','width','height','radius'];
export function containerState(track,frame,fps=30){
 const s=track.segments.find(s=>frame>=s.start_frame&&frame<s.end_frame)||(frame===track.segments.at(-1).end_frame?track.segments.at(-1):null);
 if(!s)throw Error('Container frame outside authored track');
 const state=Object.fromEntries(fields.map(k=>[k,hermiteState(frame/fps,{at:s.start_frame/fps,value:s.from[k],velocity:s.from.velocity[k]},{at:s.end_frame/fps,value:s.to[k],velocity:s.to.velocity[k]}).position]));
 return {...state,asset_id:s.asset_id,source_seconds:s.source_in+(frame-s.start_frame)/fps*s.speed,speed:s.speed};
}
export function containerErrors(p,s,l,c,frames=s.end-s.start){
 if(!l.media_handoff)return [];
 const t=l.media_handoff,r=handoffAudit(t),errors=[...r.errors];
 if(!r.ok)return errors;
 if(l.mask)errors.push('Container mask is defined by its animated radius; a separate layer mask is unsupported');
 if(t.segments.some(x=>x.asset_id!==l.asset_id||(l.speed??1)!==x.speed))errors.push('Container source identity or speed differs from video layer');
 const first=t.segments[0],last=t.segments.at(-1);
 if(s.start<first.start_frame||s.start+frames>last.end_frame)errors.push('Container does not cover scene and transition handles');
 if(errors.length)return errors;
 const at=containerState(t,s.start),W=c.width||1920,H=c.height||1080;
 if(Math.abs(at.source_seconds-l.source_in)>1e-6)errors.push('Container source clock differs from layer trim');
 if(!l.rect||['x','y','width','height'].some((k,i)=>Math.abs(at[k]-l.rect[i])>1e-6))errors.push('Container initial rect differs from layer rect');
 // Evaluate every rendered frame and half-frame. The renderer consumes these same
 // absolute samples, so overshoot cannot hide between otherwise valid endpoints.
 for(let f=s.start;f<=s.start+frames;f+=.5){
  const g=containerState(t,f);
  if(!fields.every(k=>Number.isFinite(g[k]))||g.width<1||g.height<1||g.x<-.000001||g.y<-.000001||g.x+g.width>W+.000001||g.y+g.height>H+.000001||g.radius<-.000001||g.radius>Math.min(g.width,g.height)/2+.000001){
   errors.push('Container geometry/mask overshoots composition at frame '+f);break;
  }
 }
 return errors;
}
export async function renderMediaContainer(p,s,l,frames,file,profile,startFrame,source){
 const c=profile.portrait?(s.portrait_composition||s.composition):s.composition;
 const errors=containerErrors(p,s,l,c,frames+startFrame);if(errors.length)throw Error(errors.join('\n'));
 const W=profile.width,H=profile.height,scale=Math.min(W/(c.width||1920),H/(c.height||1080)),ox=(W-(c.width||1920)*scale)/2,oy=(H-(c.height||1080)*scale)/2;
 const geometry=Array.from({length:frames},(_,n)=>{
  const g=containerState(l.media_handoff,s.start+startFrame+n),x=Math.round(g.x*scale+ox),y=Math.round(g.y*scale+oy),w=Math.round((g.x+g.width)*scale+ox)-x,h=Math.round((g.y+g.height)*scale+oy)-y;
  if(w<1||h<1||x<0||y<0||x+w>W||y+h>H)throw Error('Container quantized geometry outside output');
  return {x,y,width:w,height:h,radius:g.radius*scale};
 });
 const a=p.assets.find(a=>a.asset_id===l.asset_id),sar=(a.sample_aspect_ratio||'1:1').split(':').map(Number),ratio=Number.isFinite(sar[0]/sar[1])?sar[0]/sar[1]:1;
 let sw=a.width*ratio,sh=a.height;if(Math.abs(a.rotation||0)%180===90)[sw,sh]=[sh,sw];
 if(l.crop){sw*=l.crop[2];sh*=l.crop[3];}
 const fit=Math.min(1,W/sw,H/sh),decode_width=Math.max(1,Math.round(sw*fit)),decode_height=Math.max(1,Math.round(sh*fit));
 const plan=file+'.container.json',cfg=settings();
 write(plan,{version:'media-container-render-v1',source,source_in:l.source_in,speed:l.speed??1,start_frame:startFrame,frames,width:W,height:H,decode_width,decode_height,crop:l.crop,fit:l.fit||'cover',geometry,ffmpeg:tool('ffmpeg'),output:file});
 await run(cfg.python||'python',['-X','utf8',path.join(ROOT,'scripts/media_container.py'),'--plan',plan],{managedOutput:file,timeout:Math.max(120000,frames*1500)});
}
