import fs from 'node:fs';import path from 'node:path';
import {hash,inside} from './io.mjs';
// Validates the recorded choice's scope and implementation, never its musical quality.
export function auditionChoiceAudit(p,c,{root=p.__projectDir,readFile=f=>fs.readFileSync(f)}={}){
 const errors=[],check=(ok,msg)=>{if(!ok)errors.push(msg);};
 check(c?.version==='audition-choice-v1','Unsupported audition choice');
 check(c?.project_id===p.project_id,'Audition choice belongs to another project');
 check(typeof c?.source_quote==='string'&&c.source_quote.trim().length>0,'Exact user selection quote required');
 const music=p.assets?.find(a=>a.asset_id===c?.music_asset_id);
 check(music?.kind==='audio'&&music.sha256===c?.music_sha256&&/^[a-f0-9]{64}$/.test(c?.music_sha256||''),'Audition music identity changed');
 check(p.audio?.clips?.some(x=>x.bus==='music'&&x.asset_id===c?.music_asset_id)&&p.rhythm_score?.music?.asset_id===c?.music_asset_id,'Selected music is not the active rhythm track');
 check(['effects-on','effects-off'].includes(c?.selected_mix),'Explicit mix choice required');
 const offset=c?.picture_offset_frames;
 check(Number.isInteger(offset)&&Math.abs(offset)<=4,'Picture offset must be an explicit bounded frame count');
 check(Array.isArray(c?.references)&&c.references.length>0,'Exact audition movie references required');
 for(const r of Array.isArray(c?.references)?c.references:[]){
  if(!root||typeof r.file!=='string'||path.isAbsolute(r.file)||!inside(root,path.resolve(root,r.file))){errors.push('Reference must stay inside the project directory');continue;}
  try{check(/^[a-f0-9]{64}$/.test(r.sha256)&&hash(readFile(path.resolve(root,r.file)))===r.sha256,'Audition reference changed: '+r.file);}catch{errors.push('Audition reference unavailable: '+r.file);}
 }
 const bindings=p.rhythm_score?.bindings;
 check(Array.isArray(bindings)&&bindings.length>0,'Compiled rhythm bindings required');
 for(const b of Array.isArray(bindings)?bindings:[])check((b.impact_offset_frames??0)===offset,'Applied picture offset differs: '+b.id);
 const hasEffects=!!(p.scenes?.some(s=>s.driving)||p.audio?.cues?.some(c=>(c.amp??1)>0)||p.audio?.clips?.some(c=>c.bus==='sfx'));
 if(c?.selected_mix==='effects-on')check(hasEffects,'Selected effects are missing from the project');
 if(c?.selected_mix==='effects-off')check(!hasEffects,'Effects remain in an effects-off project');
 return {ok:errors.length===0,errors,picture_offset_frames:offset,selected_mix:c?.selected_mix,scope:'recorded representative choice; full-film listening and aesthetics remain separate',review:'file/scope/metadata only; inspect actual encoded audio and picture'};
}
