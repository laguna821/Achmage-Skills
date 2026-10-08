// Message time is independent of shot time. No automatic shortening to isolated words.
import {hash} from './io.mjs';
const clean=s=>String(s).replace(/\s+/g,' ').trim();
export function messageTrackAudit(track,{duration,cuts=[]}={}){
 const errors=[],warnings=[],units=[];
 if(track?.version!=='message-track-v1'||!Array.isArray(track.units))return {ok:false,errors:['message-track-v1 units required'],warnings,units};
 const seen=new Set();
 for(const u of track.units){
  if(!u||typeof u.id!=='string'||seen.has(u.id)||typeof u.text!=='string'||!u.text.trim()){errors.push('unique message identity and full text required');continue;}seen.add(u.id);
  if(!Number.isFinite(u.start)||!Number.isFinite(u.end)||u.start<0||u.end<=u.start||u.end>duration){errors.push(u.id+': invalid absolute interval');continue;}
  if(!Array.isArray(u.phrases)||!u.phrases.length){errors.push(u.id+': phrases required');continue;}
  let previous=u.start;const parts=[];
  for(const f of u.phrases){
   if(!f||typeof f.text!=='string'||!f.text.trim()||!Number.isFinite(f.start)||!Number.isFinite(f.end)||f.start<u.start||f.end>u.end||f.end<=f.start||f.start<previous){errors.push(u.id+': invalid/overlapping phrase');continue;}
   if(Math.abs(f.start-previous)>1e-6)errors.push(u.id+': unplanned reading gap');previous=f.end;parts.push(f.text);
   // Heuristic review floor, not a universal reading speed or aesthetic score.
   const floor=Math.max(1.2,Array.from(f.text.replace(/\s/g,'')).length/7+0.5);
   if(f.end-f.start<floor)errors.push(u.id+': reading window too short');
  }
  if(Math.abs(previous-u.end)>1e-6)errors.push(u.id+': sentence tail omitted');
  if(clean(parts.join(' '))!==clean(u.text))errors.push(u.id+': full message lost/reordered');
  const crossed=cuts.filter(c=>c>u.start&&c<u.end);
  units.push({id:u.id,seconds:u.end-u.start,cut_boundaries_crossed:crossed.length});
  if(!crossed.length&&u.end-u.start>7)warnings.push(u.id+': verify long message does not force a long shot');
 }
 const sorted=track.units.filter(u=>u&&Number.isFinite(u.start)).sort((a,b)=>a.start-b.start);
 for(let i=1;i<sorted.length;i++)if(sorted[i].start<sorted[i-1].end)errors.push('simultaneous message units need separate authored tracks');
 return {ok:!errors.length,errors,warnings,units,signature:hash(track),scope:'Copy and duration checks only; framing, comprehension and typography require visual review.'};
}
export function messageAt(track,time){
 const u=track.units.find(u=>time>=u.start&&time<u.end);if(!u)return null;
 const f=u.phrases.find(f=>time>=f.start&&time<f.end);return f?{unit_id:u.id,full_text:u.text,text:f.text,start:f.start,end:f.end}:null;
}

export function compileMessageTrack(project,track){
 const q=structuredClone(project),check=messageTrackAudit(track,{duration:q.output.total_frames/30,cuts:q.scenes.map(s=>s.start/30)});
 if(!check.ok)throw Error(check.errors.join('\n'));
 if(!['vector-composite','hybrid-composite'].includes(q.renderer))throw Error('Message overlays currently support vector and hybrid compositors');
 if(project.__projectDir)Object.defineProperty(q,'__projectDir',{value:project.__projectDir,enumerable:false});
 for(const s of q.scenes){
  const start=s.start/30,end=s.end/30,active=track.units.flatMap(u=>u.phrases.map((f,i)=>({...f,id:u.id+'-'+i}))).filter(f=>f.start<end&&f.end>start);
  if(s.transition_in&&track.units.some(u=>u.start<start&&u.end>=start))throw Error('Outgoing cross-cut message needs a separate post-composite title track');
  for(const [layout,c]of [['landscape',s.composition],['portrait',s.portrait_composition]]){
   if(!c){if(layout==='landscape'&&active.length)throw Error('Message requires authored composition');continue;}
   if(active.length&&(c.camera||s.transition_in))throw Error('Cross-cut message with moving compositor/transition needs a separate post-composite title track; not yet supported');
   c.layers=c.layers.filter(l=>!l.id?.startsWith('message-track-'));
   for(const f of active){
    const lines=f.text.split('\n'),w=c.width||1920,h=c.height||1080,size=layout==='portrait'?48:48;
    lines.forEach((line,i)=>{
     const keyframes=[];
     if(f.start>start)keyframes.push({at:f.start-start,opacity:1,ease:'hold'});
     if(f.end<=end)keyframes.push({at:f.end-start,opacity:0,ease:'hold'});
     c.layers.push({id:'message-track-'+f.id+'-'+i,kind:'text',text:line,position:[w*.07,h*.81+i*size*1.3],size,weight:600,color:'#ffffff',align:'start',opacity:f.start<=start?1:0,keyframes});
    });
   }
  }
 }
 q.message_track=structuredClone(track);delete q.approval;delete q.production_review;return q;
}

export function compiledMessageAudit(p){
 if(!p.message_track)return {ok:true,errors:[]};
 try{
  const expected=compileMessageTrack(p,p.message_track),errors=[];
  for(let i=0;i<p.scenes.length;i++)for(const k of ['composition','portrait_composition']){
   const keep=c=>(c?.layers||[]).filter(l=>l.id?.startsWith('message-track-'));
   if(hash(keep(p.scenes[i][k]))!==hash(keep(expected.scenes[i][k])))errors.push(p.scenes[i].id+': stale/missing message overlay; recompile');
  }
  return {ok:!errors.length,errors};
 }catch(e){return {ok:false,errors:[e.message]};}
}
