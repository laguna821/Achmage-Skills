// Planning evidence, not an automatic music taste score.
export function musicDirectionAudit(p){
 const b=p?.audio?.music_brief,errors=[],pending=[];
 if(!b||typeof b!=='object')return {ok:false,errors:['music_brief required: genre/mood alone is insufficient'],pending:[]};
 const text=x=>typeof x==='string'&&x.trim().length>0;
 for(const k of ['purpose','groove','drums','bass','timbre','opening','edit_logic','sfx_relationship'])if(!text(b[k]))errors.push('music_brief.'+k+' required');
 if(!Array.isArray(b.bpm_range)||b.bpm_range.length!==2||!b.bpm_range.every(Number.isFinite)||b.bpm_range[0]<30||b.bpm_range[1]>240||b.bpm_range[1]<b.bpm_range[0])errors.push('valid target BPM range required');
 if(!Array.isArray(b.avoid)||!b.avoid.length||!b.avoid.every(text))errors.push('explicit musical reject criteria required');
 if(!Array.isArray(b.candidates)||b.candidates.length<2)errors.push('at least two playable candidates required');
 for(const c of Array.isArray(b.candidates)?b.candidates:[]){
  if(!c||typeof c!=='object'){errors.push('candidate object required');continue;}
  if(!text(c.asset_id)||!Number.isFinite(c.source_in)||c.source_in<0||!Number.isFinite(c.duration)||c.duration<8||c.duration>20||!text(c.excerpt))errors.push('candidate must identify an 8–20 second excerpt');
  if(!Number.isFinite(c.bpm)||!text(c.bpm_basis))errors.push('candidate BPM and measurement/source basis required');
  if(!Array.isArray(c.evidence)||!c.evidence.length)errors.push('candidate needs explicit selection evidence');
  if(!['unreviewed','listened','user-reviewed','rejected'].includes(c.review_state))errors.push('candidate review state required');
  if(['listened','user-reviewed'].includes(c.review_state)&&(!text(c.listener)||!text(c.listening_notes)))errors.push('do not mark heard without listener and notes');
  if(c.review_state==='unreviewed')pending.push(c.asset_id+': perceptual fit unreviewed');
 }
 if(b.selected){const c=(Array.isArray(b.candidates)?b.candidates:[]).find(c=>c?.asset_id===b.selected);if(!c)errors.push('selected candidate missing');else if(c.review_state==='rejected')errors.push('rejected music cannot be selected');else if(!['listened','user-reviewed'].includes(c.review_state))pending.push('selected music is provisional; metadata is not listening');}
 if(!Array.isArray(b.sync_points)||!b.sync_points.length)errors.push('explicit musical/visual sync points required');
 for(const pt of Array.isArray(b.sync_points)?b.sync_points:[])if(!pt||!Number.isFinite(pt.time)||pt.time<0||pt.time>p.output.total_frames/30||!text(pt.visual)||!text(pt.music)||!['measured','planned','reviewed'].includes(pt.state))errors.push('invalid music sync point');
 return {ok:errors.length===0,errors,pending,scope:'Planning completeness only. Tempo is not perceived groove, and passed structure is not aesthetic approval.'};
}
