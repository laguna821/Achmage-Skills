// Declared source observations and timing contracts; not computer-vision or aesthetic approval.
export function sourceActionAudit(p){const errors=[],warnings=[],rows=[],fps=p.output?.fps||30,byId=new Map((p.assets||[]).map(a=>[a.asset_id,a]));
for(const s of p.scenes||[])for(const l of s.composition?.layers||[]){if(l.kind!=='video'||!l.source_action)continue;const a=l.source_action,asset=byId.get(l.asset_id),duration=(s.end-s.start)/fps,speed=l.speed??1;
const fail=(v,m)=>{if(!v)errors.push(s.id+'/'+l.id+': '+m);};
fail(a.version==='source-action-v1','unsupported source action');fail(typeof a.evidence==='string'&&a.evidence.trim(),'source observation evidence required');fail(typeof a.source_sha256==='string'&&/^[a-f0-9]{64}$/i.test(a.source_sha256)&&a.source_sha256===asset?.sha256,'source observation hash missing or stale');
fail(Number.isFinite(speed)&&speed>0,'source speed must be positive');
fail([a.before,a.contact,a.after].every(Number.isFinite)&&a.before<a.contact&&a.contact<a.after,'source action stages must increase');
fail(a.before>=l.source_in&&a.after<=l.source_in+duration*speed,'selected shot omits preparation or result');
fail(Number.isInteger(a.landing_frame)&&a.landing_frame>=0&&a.landing_frame<s.end-s.start,'landing frame outside shot');
const observed=Math.round((a.contact-l.source_in)/speed*fps);
fail(observed===a.landing_frame,'source contact does not land on requested frame');
rows.push({scene:s.id,layer:l.id,source_seconds:a.contact,output_frame:s.start+observed,target_frame:s.start+a.landing_frame,error_frames:observed-a.landing_frame,entity:a.entity_id??null,visual_review:'not inferred'});
}
return {ok:errors.length===0,errors,warnings,rows,review:'metadata/timing contract only'};}
