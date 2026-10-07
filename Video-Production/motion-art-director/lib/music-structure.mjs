import fs from 'node:fs';
import path from 'node:path';
import {ROOT,read,write,run,settings,hash} from './io.mjs';

export const STRUCTURE_VERSION='musical-structure-v1';
export function musicIdentity(p){
 const index=p.audio.clips.findIndex(c=>c.bus==='music'),c=p.audio.clips[index],a=p.assets.find(a=>a.asset_id===c?.asset_id);
 if(!c||!a)throw Error('Registered music required');
 return {asset_id:a.asset_id,sha256:a.sha256,clip_index:index,start:c.start,source_in:c.source_in,duration:c.duration,speed:c.speed??1};
}
export const structureDigest=m=>hash({identity:m.identity,boundaries:m.boundaries,groups:m.groups,sections:m.sections});
export function checkStructure(p,m){
 const errors=[],check=(v,s)=>{if(!v)errors.push(s);};
 check(m?.version===STRUCTURE_VERSION,'Unsupported musical structure');
 check(hash(m?.identity??null)===hash(musicIdentity(p)),'Music source/clock identity changed');
 if(!Array.isArray(m?.boundaries)||!Array.isArray(m?.groups)||!Array.isArray(m?.sections))return {ok:false,errors:[...errors,'Structure arrays required']};
 const c=musicIdentity(p),end=c.source_in+c.duration*c.speed,ids=new Set();let last=-Infinity;
 for(const b of m.boundaries){check(typeof b.id==='string'&&!ids.has(b.id),'Boundary IDs must be unique');ids.add(b.id);check(Number.isFinite(b.source_seconds)&&b.source_seconds>=c.source_in&&b.source_seconds<=end&&b.source_seconds>last,'Boundary order/range invalid');last=b.source_seconds;check(['candidate','listening-corrected','authored'].includes(b.method)&&typeof b.evidence==='string'&&b.evidence.trim(),'Boundary evidence required');}
 const byId=new Map(m.boundaries.map(b=>[b.id,b]));
 for(const list of [m.groups,m.sections]){const names=new Set();for(const g of list){check(typeof g.id==='string'&&!names.has(g.id),'Group/section ID duplicated');names.add(g.id);const a=byId.get(g.start),b=byId.get(g.end);check(a&&b&&a.source_seconds<b.source_seconds,'Group endpoints invalid');check(typeof g.reason==='string'&&g.reason.trim(),'Group interpretation requires reason');}}
 const calibrated=m.boundaries.length>=2&&m.groups.length>=1&&m.review?.status==='reviewed'&&typeof m.review?.note==='string'&&m.review.note.trim().length>0&&m.review.structure_digest===structureDigest(m);
 if(m.review?.status==='reviewed')check(calibrated,'Stale or unsupported listening review');
 if(m.boundaries.some(b=>b.method==='listening-corrected'))check(calibrated,'Listening-corrected boundaries need current review');
 return {ok:errors.length===0,errors,calibrated:!!calibrated,listening:calibrated?'human-attested':'pending',musical_quality:'not automatically assessed',boundaries:m.boundaries.length};
}
export function compileStructure(p,m,edit,{draft=false}={}){
 const check=checkStructure(p,m);if(!check.ok)throw Error(check.errors.join('; '));
 if(!check.calibrated&&!draft)throw Error('Review musical boundaries first; use --draft for a provisional comparison only');
 if(edit?.version!=='musical-edit-plan-v1'||!Array.isArray(edit.bindings))throw Error('Explicit musical edit plan required');
 const allowance=edit.tolerance_frames??0;
 if(!Number.isInteger(allowance)||allowance<0||allowance>4)throw Error('Explicit intentional offset allowance must be 0..4 frames');
 for(const b of edit.bindings){const offset=b.impact_offset_frames??0;if(!Number.isInteger(offset)||Math.abs(offset)>allowance)throw Error('Intentional offset exceeds explicit edit allowance');}
 const q=structuredClone(p);if(p.__projectDir)Object.defineProperty(q,'__projectDir',{value:p.__projectDir});
 const used=new Set(edit.bindings.map(b=>b.boundary_id)),events=m.boundaries.filter(b=>used.has(b.id));
 if(events.length!==used.size)throw Error('Edit references missing musical boundary');
 const end=m.identity.source_in+m.identity.duration*m.identity.speed;
 if(events.some(b=>b.source_seconds>=end))throw Error('Music end cannot start a new bound scene');
 q.musical_structure=structuredClone(m);
 q.rhythm_score={version:'music-impact-v1',music:{asset_id:m.identity.asset_id,sha256:m.identity.sha256,clip_index:m.identity.clip_index},tolerance_frames:allowance,events:events.map(b=>({id:b.id,source_seconds:b.source_seconds,role:'phrase',method:check.calibrated&&b.method==='listening-corrected'?'listening-corrected':'authored',confidence:check.calibrated?1:.3,evidence:b.evidence})),bindings:edit.bindings.map(({boundary_id,...b})=>({...b,event_id:boundary_id})),holds:edit.holds||[]};
 delete q.approval;return q;
}
export async function analyzeStructure(p,analysisFolder){
 const baseline=read(path.join(analysisFolder,'rhythm-analysis.json')),identity=musicIdentity(p),c=baseline.clip;
 if(baseline.music?.sha256!==identity.sha256||baseline.music?.asset_id!==identity.asset_id||!c||['start','source_in','duration'].some(k=>c[k]!==identity[k])||(c.speed??1)!==identity.speed)throw Error('Existing analysis belongs to another music source/clock');
 const file=path.join(analysisFolder,'music-structure-candidates.json');if(fs.existsSync(file))throw Error('Preserve previous musical analysis');
 await run(settings().python||'python',[path.join(ROOT,'scripts/music_structure.py'),path.join(analysisFolder,'analysis-mono.wav'),'--out',file],{timeout:120000});
 const data=read(file);
 for(const w of data.windows){w.source_start=identity.source_in+w.start;w.source_end=identity.source_in+w.end;for(const c of w.recurrence_candidates)for(const a of c.phase_candidates)a.source_seconds=identity.source_in+a.seconds;}
 data.identity=identity;write(file,data);
 const m={version:STRUCTURE_VERSION,identity,boundaries:[],groups:[],sections:[],review:{status:'pending',note:''},analysis:'music-structure-candidates.json'};
 write(path.join(analysisFolder,'musical-structure.json'),m);return {candidates:file,structure:path.join(analysisFolder,'musical-structure.json'),windows:data.windows.length,listening:'pending'};
}
