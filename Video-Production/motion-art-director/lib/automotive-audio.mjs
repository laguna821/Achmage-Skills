// Deterministic, action-driven sound design. These are designed sounds, not model recordings.
const TAU=Math.PI*2,clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export function curve(keys,t,fallback=0){
 if(!keys?.length)return fallback;if(t<=keys[0][0])return keys[0][1];
 for(let i=1;i<keys.length;i++){const a=keys[i-1],b=keys[i];if(t<=b[0])return a[1]+(b[1]-a[1])*(t-a[0])/(b[0]-a[0]);}return keys.at(-1)[1];
}
// Integrate the piecewise-linear frequency, so a gear shift cannot reset phase.
export function integral(keys,t,fallback=0){
 if(!keys?.length)return t*fallback;let v=Math.min(t,keys[0][0])*keys[0][1];
 for(let i=1;i<keys.length;i++){const a=keys[i-1],b=keys[i],dt=Math.max(0,Math.min(t,b[0])-a[0]);v+=a[1]*dt+.5*(b[1]-a[1])*dt*dt/(b[0]-a[0]);if(t<=b[0])return v;}
 return v+Math.max(0,t-keys.at(-1)[0])*keys.at(-1)[1];
}
export function drivingErrors(p){const out=[];for(const s of p.scenes||[]){const d=s.driving;if(!d)continue;const end=(s.end-s.start)/30;
 for(const [name,range] of Object.entries({rpm:[400,9000],throttle:[0,1],slip:[0,1],pan:[-1,1],speed:[0,100]})){
  const keys=d[name];if(!Array.isArray(keys)||keys.length<2){out.push(s.id+': driving '+name+' requires at least two points');continue;}
  if(keys.some((k,i)=>!Array.isArray(k)||k.length!==2||!k.every(Number.isFinite)||k[0]<0||k[0]>end+.001||k[1]<range[0]||k[1]>range[1]||(i&&k[0]<=keys[i-1][0]))||keys[0][0]!==0||Math.abs(keys.at(-1)[0]-end)>.001)out.push(s.id+': invalid driving '+name+' curve');
 }
 if(d.sound_gain_db!==undefined&&(!Number.isFinite(d.sound_gain_db)||d.sound_gain_db< -30||d.sound_gain_db>6))out.push(s.id+': invalid driving sound gain');
 if(d.passby!==undefined&&(!Number.isFinite(d.passby)||d.passby<0||d.passby>end))out.push(s.id+': invalid passby time');
}return out;}
export function drivingCues(p){const cues=[];for(const s of p.scenes||[]){const d=s.driving;if(!d)continue;const base={time:s.start/30,duration:(s.end-s.start)/30,scene_id:s.id,action:d,amp:10**((d.sound_gain_db??0)/20)};
 cues.push({...base,kind:'engine'},{...base,kind:'road'});
 if(d.slip.some(k=>k[1]>.08))cues.push({...base,kind:'skid'});
 if(d.passby!==undefined)cues.push({...base,kind:'vehicle-passby'});
}return cues;}
export function vehicleSample(c,t,n,seed,noise){const d=c.action,u=t-c.time,throttle=curve(d.throttle,u),speed=curve(d.speed,u),slip=curve(d.slip,u),edge=clamp(u/.06)*clamp((c.duration-u)/.12),w=noise(n,seed+53),low=noise(Math.floor(n/15),seed+89);
 let v=0;
 if(c.kind==='engine'){
  const phase=TAU*integral(d.rpm,u)/60*3; // Six-cylinder four-stroke firing order, stylized.
  let harmonics=0;for(let h=1;h<=8;h++)harmonics+=Math.sin(phase*h+.13*Math.sin(TAU*7*u))/(h**(1.25-.3*throttle));
  v=Math.tanh(harmonics*(1.1+throttle))*(.065+.11*throttle)+low*.022*throttle;
 }else if(c.kind==='skid'){
  const squeal=Math.sin(TAU*(780*u+43*u*u)+8*Math.sin(TAU*2.7*u))*.53+Math.sin(TAU*(1290*u+26*u*u)+4*Math.sin(TAU*4.1*u))*.24;
  v=(squeal*(.75+.25*Math.sin(TAU*31*u))+w*.12+low*.13)*Math.pow(slip,.65)*.25;
 }else if(c.kind==='road')v=(low*.65+w*.10)*Math.min(1,speed/28)*.075;
 else if(c.kind==='vehicle-passby'){
  const x=u-d.passby,env=1/(1+(x/.48)**2),phase=TAU*(210*u-52*Math.log(Math.cosh(x)));
  v=(Math.sin(phase)*.24+low*.60+w*.12)*env*.20;
 }
 return v*edge*c.amp;
}
export function automotiveCoverage(p){return(p.scenes||[]).filter(s=>s.driving).map(s=>({scene:s.id,start:s.start/30,end:s.end/30,kinds:drivingCues({scenes:[s]}).map(c=>c.kind),rpm:s.driving.rpm,slip:s.driving.slip,sound_gain_db:s.driving.sound_gain_db??0}));}
