// Absolute-time evaluation; no integration state or playback order dependency.
export function springState(t,{from=0,to=1,velocity=0,frequency=2,damping=1}={}){
 if(![t,from,to,velocity,frequency,damping].every(Number.isFinite)||frequency<=0||damping<=0||damping>1)throw Error('Finite spring values; frequency > 0, 0 < damping <= 1 required');
 if(t<0)return {position:from,velocity:0};
 const w=2*Math.PI*frequency,x=from-to;
 if(damping===1){
  const b=velocity+w*x,e=Math.exp(-w*t);
  return {position:to+(x+b*t)*e,velocity:(b-w*(x+b*t))*e};
 }
 const a=damping*w,d=w*Math.sqrt(1-damping*damping),b=(velocity+a*x)/d,e=Math.exp(-a*t),c=Math.cos(d*t),s=Math.sin(d*t);
 return {position:to+e*(x*c+b*s),velocity:e*((-a*x+b*d)*c+(-a*b-x*d)*s)};
}
export function hermiteState(time,a,b){
 const duration=b.at-a.at;
 if(!(duration>0)||![time,a.value,b.value,a.velocity??0,b.velocity??0].every(Number.isFinite))throw Error('Valid Hermite endpoints required');
 const u=Math.max(0,Math.min(1,(time-a.at)/duration)),v0=a.velocity??0,v1=b.velocity??0;
 return {position:(2*u**3-3*u*u+1)*a.value+(u**3-2*u*u+u)*duration*v0+(-2*u**3+3*u*u)*b.value+(u**3-u*u)*duration*v1,
  velocity:((6*u*u-6*u)*a.value+(3*u*u-4*u+1)*duration*v0+(-6*u*u+6*u)*b.value+(3*u*u-2*u)*duration*v1)/duration};
}
export function handoffAudit(track,{fps=30,positionTolerance=.5,velocityTolerance=.5}={}){
 const errors=[];
 if(track?.version!=='media-handoff-v1'||!Array.isArray(track.segments)||!track.segments.length)return {ok:false,errors:['media-handoff-v1 segments required']};
 if(track.segments.some(s=>!s||typeof s!=='object'||Array.isArray(s)))return {ok:false,errors:['Every media handoff segment must be an object']};
 const fields=['x','y','width','height','radius'];
 for(const [i,s] of track.segments.entries()){
  if(!Number.isInteger(s.start_frame)||!Number.isInteger(s.end_frame)||s.start_frame<0||s.end_frame<=s.start_frame)errors.push(i+': invalid frame interval');
  if(!s.asset_id||!Number.isFinite(s.source_in)||s.source_in<0||!Number.isFinite(s.speed)||s.speed<=0)errors.push(i+': source clock required');
  for(const endpoint of ['from','to'])for(const f of fields){
   if(!Number.isFinite(s[endpoint]?.[f])||!Number.isFinite(s[endpoint]?.velocity?.[f]))errors.push(i+': endpoint geometry and velocity required for '+f);
  }
  if(i){
   const prev=track.segments[i-1];
   if(prev.end_frame!==s.start_frame)errors.push(i+': gap or duplicated output frame');
   if(prev.asset_id!==s.asset_id)errors.push(i+': media identity changed');
   const expected=prev.source_in+(prev.end_frame-prev.start_frame)/fps*prev.speed;
   if(Math.abs(expected-s.source_in)>1e-6||prev.speed!==s.speed)errors.push(i+': source clock or playback speed discontinuity');
   for(const f of fields){
    if(Math.abs(prev.to?.[f]-s.from?.[f])>positionTolerance)errors.push(i+': geometry discontinuity '+f);
    if(Math.abs(prev.to?.velocity?.[f]-s.from?.velocity?.[f])>velocityTolerance)errors.push(i+': velocity discontinuity '+f);
   }
  }
 }
 return {ok:!errors.length,errors,scope:'Authored geometry/source-clock continuity. Rendering, crop, z-order and masking still require frame evidence.'};
}
