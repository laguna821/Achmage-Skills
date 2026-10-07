// Event, sound, pause and title are explicit bindings, independent of subject type.
export function genericEndingErrors(p,gain){
 const e=p.audio?.ending,end=p.output?.total_frames/30,errors=[],env=p.audio?.bus_envelopes||{};
 if(!e||e.version!=='event-ending-v2')return ['unknown generic ending contract'];
 if(p.schema_version!=='3.1.0')errors.push('generic ending requires schema 3.1.0');
 const finite=x=>Number.isFinite(x)&&x>=0&&x<=end,same=(a,b)=>Math.abs(a-b)<1e-7;
 if(!['event_time','music_stop','quiet_time','title_time','tail_silence'].every(k=>finite(e[k])))return ['invalid generic ending times'];
 if(!(e.event_time<=e.music_stop&&e.music_stop<=e.quiet_time&&e.quiet_time<e.title_time&&e.title_time<e.tail_silence&&e.tail_silence<end))errors.push('ending order: event / music stop / quiet / title / silence / end');
 const event=p.scenes?.find(s=>s.id===e.event_scene),title=p.scenes?.find(s=>s.id===e.title_scene),local=e.event_time-(event?.start??0)/30,tl=e.title_time-(title?.start??0)/30;
 const subject=event?.composition?.layers?.find(l=>l.id===e.event_layer),layer=title?.composition?.layers?.find(l=>l.id===e.title_layer);
 const property=e.event_property;
 if(!['x','y','scale','rotation','opacity','draw','reveal'].includes(property)||!Number.isFinite(e.event_value)||!subject||local<0||local>=(event.end-event.start)/30)errors.push('ending event must bind a supported layer property');
 else if(!subject.keyframes?.some(k=>same(k.at,local)&&k[property]===e.event_value)||subject.keyframes.some(k=>k.at>local&&k[property]!==undefined&&k[property]!==e.event_value))errors.push('event property must reach and hold its declared state');
 if(!layer||tl<0||tl>=(title.end-title.start)/30||layer.opacity!==0||!layer.keyframes?.some(k=>same(k.at,tl)&&k.opacity===0)||layer.keyframes.some(k=>k.at<tl&&k.opacity>0)||!layer.keyframes.some(k=>k.at>tl&&k.opacity>0))errors.push('title reveal is not bound to the title event');
 const zero=(bus,from,to)=>env[bus]&&[from,to,...env[bus].filter(k=>k[0]>from&&k[0]<to).map(k=>k[0])].every(t=>gain(env[bus],t)===0);
 if(!zero('music',e.music_stop,end))errors.push('music must end including its tails');
 for(const bus of ['sfx','ambience','voice']){
  if(!zero(bus,e.quiet_time,e.title_time))errors.push(bus+' leaks into deliberate pause');
  if(!zero(bus,e.tail_silence,end))errors.push(bus+' leaks into final silence');
 }
 for(const bus of ['ambience','voice'])if(!zero(bus,e.title_time,end))errors.push(bus+' must remain quiet under title');
 const ids=e.title_cue_ids||[],allowed=new Set(ids),cues=p.audio.cues||[];
 if(!allowed.size||allowed.size!==ids.length)errors.push('unique title effect identities required');
 for(const id of allowed){const rows=cues.filter(c=>c.id===id);if(rows.length!==1||rows[0].time<e.title_time-1e-7||rows[0].time+(rows[0].duration??.7)>e.tail_silence+1e-7)errors.push('title cue missing or crosses final silence');}
 if(!cues.some(c=>allowed.has(c.id)&&same(c.time,e.title_time)))errors.push('title effect must start at title event');
 for(const c of cues)if(c.time+(c.duration??.7)>e.title_time&&c.time<e.tail_silence&&!allowed.has(c.id))errors.push('unplanned effect under title');
 for(const c of p.audio.clips||[])if(c.bus==='sfx'&&c.start+c.duration>e.title_time&&c.start<e.tail_silence)errors.push('title SFX require identified synthesized cues');
 if(p.audio.narration)errors.push('use registered voice clips for generic ending');
 return errors;
}
