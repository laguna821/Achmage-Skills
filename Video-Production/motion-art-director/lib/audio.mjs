import {editAudio,editErrors,choreographyErrors} from './audio-edit.mjs';
import {drivingErrors,drivingCues,vehicleSample,curve,automotiveCoverage} from './automotive-audio.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {mkdir,write,hash,run,tool} from './io.mjs';
export const RATE=48000,CHANNELS=2;
export const INSTRUMENTS=['bell','pad','felt','marimba','bass','pluck','air'];
export const CUE_KINDS=['impact','chime','whoosh','tick','paper','pencil','press','thread','shear','key','drive','wind','passby'];
export function audioErrors(p){
 const a=p.audio||{},end=p.output?.total_frames/30,errors=[],check=(v,s)=>{if(!v)errors.push(s);},finite=(v,lo,hi)=>Number.isFinite(v)&&v>=lo&&v<=hi;
 for(const name of ['sections','notes','cues','silence'])if(a[name]!==undefined&&(!Array.isArray(a[name])||a[name].some(x=>!x||typeof x!=='object'||Array.isArray(x))))errors.push('invalid audio '+name+' array');
 if(errors.length)return errors;
 if(a.loudness){check(finite(a.loudness.integrated,-24,-14)&&finite(a.loudness.true_peak,-6,-1),'invalid loudness target');}
 if(a.mix){check(!!a.clips?.length,'stem mix settings require an edited audio bus');for(const k of ['music_gain_db','sfx_gain_db'])check(a.mix[k]===undefined||finite(a.mix[k],-40,18),'invalid stem mix gain');check(a.mix.duck_sfx===undefined||typeof a.mix.duck_sfx==='boolean','invalid sidechain option');}
 for(const s of a.sections||[]){check(finite(s.start,0,end)&&finite(s.end,0,end)&&s.end>s.start,'invalid audio section time');check(s.energy===undefined||finite(s.energy,0,2),'invalid section energy');if(s.instrument)check(INSTRUMENTS.includes(s.instrument),'unknown section instrument');}
 for(const n of a.notes||[]){check(finite(n.start,0,end)&&finite(n.duration,.005,end)&&n.start+n.duration<=end+.0001,'invalid note time');check(finite(n.note,0,127)&&finite(n.amp,0,.5)&&finite(n.pan??0,-1,1),'invalid note pitch/amplitude/pan');check(INSTRUMENTS.includes(n.instrument),'unknown note instrument');}
 for(const c of a.cues||[]){check(CUE_KINDS.includes(c.kind),'unknown sound cue');check(finite(c.time,0,end)&&finite(c.duration??.7,.005,end)&&c.time+(c.duration??.7)<=end+.0001,'invalid cue time');check(c.amp===undefined||finite(c.amp,0,2),'invalid cue amplitude');check(c.pan===undefined||finite(c.pan,-1,1),'invalid cue pan');}
 for(const s of a.silence||[])check(finite(s.start,0,end)&&finite(s.end,0,end)&&s.end>s.start,'invalid silence interval');
 if(a.notes!==undefined)check(Array.isArray(a.notes)&&a.notes.length>0,'explicit score requires notes');
 return errors.concat(editErrors(p),drivingErrors(p),choreographyErrors(p));
}
function wavHeader(samples){const b=Buffer.alloc(44);b.write('RIFF');b.writeUInt32LE(36+samples*4,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(CHANNELS,22);b.writeUInt32LE(RATE,24);b.writeUInt32LE(RATE*4,28);b.writeUInt16LE(4,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(samples*4,40);return b;}
const frequency=n=>440*Math.pow(2,(n-69)/12),TAU=2*Math.PI;
function noise(n,seed){let x=Math.imul(n+seed,374761393);x=Math.imul(x^x>>>13,1274126177);return((x^x>>>16)>>>0)/4294967296*2-1;}
export function score(p){
 const errors=audioErrors(p);if(errors.length)throw new Error(errors.join('\n'));
 const notes=[],duration=p.output.total_frames/30;
 if(p.audio.notes)notes.push(...p.audio.notes.map(n=>({...n,pan:n.pan??0})));
 else for(const s of p.audio.sections){const step=60/p.audio.bpm;for(let t=s.start;t<s.end;t+=step/2){const i=Math.round((t-s.start)/(step/2));notes.push({start:+t.toFixed(6),duration:Math.min(step*1.25,duration-t),note:p.audio.motif[i%p.audio.motif.length]+(s.transpose||0),amp:.095*(s.energy??.7),instrument:s.instrument||'bell',pan:.3*Math.sin(i)});}
 for(let t=s.start;t<s.end;t+=step*4)for(const n of(s.chord||[48,55,60]))notes.push({start:t,duration:Math.min(step*5,s.end-t),note:n,amp:.035*(s.energy??.7),instrument:'pad',pan:(n%3-1)*.35});}
 return {version:'synthesis-4',master_gain_db:p.audio.master_gain_db??12,seed:p.seed,rate:RATE,duration,bpm:p.audio.bpm,motif:p.audio.motif,sections:p.audio.sections,notes,cues:[...(p.audio.cues||[]),...drivingCues(p)],silence:p.audio.silence||[],composition:p.audio.composition||'section motif'};
}
function voice(x,dt){
 const f=frequency(x.note),d=x.duration,release=Math.min(1,(d-dt)/Math.min(.15,d*.25));let v=0,env=1;
 switch(x.instrument){
 case 'felt':env=Math.min(1,dt/.009)*Math.exp(-dt*2.4/Math.sqrt(d))*release;v=Math.sin(TAU*f*dt)+.32*Math.sin(TAU*f*2.002*dt)*Math.exp(-dt*3)+.08*Math.sin(TAU*f*3.007*dt)*Math.exp(-dt*6);break;
 case 'marimba':env=Math.min(1,dt/.004)*Math.exp(-dt*5.5)*release;v=Math.sin(TAU*f*dt)+.35*Math.sin(TAU*f*4.01*dt)*Math.exp(-dt*8);break;
 case 'pluck':env=Math.min(1,dt/.003)*Math.exp(-dt*3.2)*release;v=Math.sin(TAU*f*dt)+.22*Math.sin(TAU*2*f*dt)+.08*Math.sin(TAU*3*f*dt);break;
 case 'bass':env=Math.min(1,dt/.04)*Math.exp(-dt*.8)*release;v=Math.sin(TAU*f*dt)+.18*Math.sin(TAU*2*f*dt);break;
 case 'air':env=Math.sin(Math.PI*dt/d)**2;v=Math.sin(TAU*f*dt)*.7+.16*Math.sin(TAU*f*1.002*dt);break;
 case 'bell':env=Math.min(1,dt/.01)*(1-dt/d)**1.35;v=Math.sin(TAU*f*dt)*Math.exp(-dt*1.8)+.23*Math.sin(TAU*f*2.76*dt)*Math.exp(-dt*4);break;
 default:env=Math.min(1,dt/.5)*Math.min(1,(d-dt)/.8);v=(Math.sin(TAU*f*dt)+.24*Math.sin(TAU*f*1.003*dt)+.16*Math.sin(TAU*f*2*dt))*.6;
 }return v*env*x.amp;
}
function effect(c,t,n,seed){
 if(c.action)return vehicleSample(c,t,n,seed,noise);
 const dt=t-c.time,d=c.duration??.7,u=dt/d,white=noise(n,seed+13),rough=noise(Math.floor(n/5),seed+41),slow=noise(Math.floor(n/37),seed+97);
 const edge=Math.min(1,dt/.004,(d-dt)/.012),swell=Math.sin(Math.PI*u),decay=Math.exp(-dt*11);let v=0;
 switch(c.kind){
 case 'drive':v=(Math.sin(TAU*(48*dt+3*dt*dt))*.55+Math.sin(TAU*97*dt)*.15+slow*.15)*swell*.075;break;
 case 'wind':v=(slow*.6+rough*.4)*swell*.055;break;
 case 'passby':v=(Math.sin(TAU*(100*dt-20*dt*dt))*.3+rough*.7)*swell**3*.13;break;
 case 'pencil':v=(white-rough*.5)*(.35+.65*Math.sin(TAU*17*dt)**2)*swell*.03;break;
 case 'paper':v=(rough*.65+white*.35)*(swell**.7)*(.55+.45*Math.sin(TAU*31*dt)**2)*.06;break;
 case 'press':v=(Math.sin(TAU*53*dt)*.38+Math.sin(TAU*107*dt)*.18+rough*.22)*(.4+.6*Math.cos(TAU*3.2*dt)**8)*.1;break;
 case 'thread':v=(white-rough)*.022*swell*(.7+.3*Math.sin(TAU*70*dt));break;
 case 'shear':v=(rough*.7+Math.sin(TAU*(900*dt-300*dt*dt))*.3)*decay*.13;break;
 case 'key':v=(Math.sin(TAU*340*dt)*.45+white*.4+Math.sin(TAU*94*dt)*.3)*Math.exp(-dt*44)*.1;break;
 case 'tick':v=(Math.sin(TAU*900*dt)+white*.35)*Math.exp(-dt*65)*.075;break;
 case 'impact':v=(Math.sin(TAU*(80*dt-28*dt*dt))+.18*slow)*Math.exp(-dt*5)*.12;break;
 case 'chime':v=(Math.sin(TAU*1046.5*dt)+.2*Math.sin(TAU*2872*dt))*Math.exp(-dt*4)*.065;break;
 default:v=rough*swell**2*.06;
 }return v*edge*(c.amp??1);
}
export async function audio(p,out){
 mkdir(out);const data=score(p),samples=Math.round(data.duration*RATE),paths=['music','sfx','mix'].map(n=>path.join(out,n+'.wav'));
 const handles=paths.map(f=>fs.openSync(f,'w'));handles.forEach(h=>fs.writeSync(h,wavHeader(samples)));
 let peak=0,sq=0,count=0,active=[],activeCues=[],index=0,cueIndex=0,filter=[0,0];
 data.notes.sort((a,b)=>a.start-b.start);const cues=[...data.cues].sort((a,b)=>a.time-b.time);
 const delayL=new Float64Array(11003),delayR=new Float64Array(14983),gain=10**(data.master_gain_db/20);
 try{for(let start=0;start<samples;start+=4096){const size=Math.min(4096,samples-start),buffers=paths.map(()=>Buffer.alloc(size*4));
 for(let j=0;j<size;j++){const n=start+j,t=n/RATE;
 while(index<data.notes.length&&data.notes[index].start<=t)active.push(data.notes[index++]);
 while(cueIndex<cues.length&&cues[cueIndex].time<=t)activeCues.push(cues[cueIndex++]);
 for(let k=active.length-1;k>=0;k--)if(active[k].start+active[k].duration<=t)active.splice(k,1);
 for(let k=activeCues.length-1;k>=0;k--)if(activeCues[k].time+(activeCues[k].duration??.7)<=t)activeCues.splice(k,1);
 let l=0,r=0;for(const x of active){const v=voice(x,t-x.start);l+=v*Math.sqrt((1-x.pan)/2);r+=v*Math.sqrt((1+x.pan)/2);}
 const dl=delayL[n%delayL.length],dr=delayR[n%delayR.length];delayL[n%delayL.length]=l+dl*.27;delayR[n%delayR.length]=r+dr*.27;l+=dl*.18;r+=dr*.18;
 filter[0]+=.32*(l-filter[0]);filter[1]+=.32*(r-filter[1]);
 const duck=data.silence.some(x=>t>=x.start&&t<x.end)?0:1,fade=Math.max(0,Math.min(1,t/.8,(data.duration-t)/2));
 l=filter[0]*duck*fade;r=filter[1]*duck*fade;
 let el=0,er=0;for(const c of activeCues){const v=effect(c,t,n,p.seed)*duck,pan=c.action?curve(c.action.pan,t-c.time):c.pan??0;el+=v*Math.sqrt((1-pan)/2);er+=v*Math.sqrt((1+pan)/2);}
 const mix=[Math.tanh((l+el)*gain)*.89,Math.tanh((r+er)*gain)*.89],values=[[l,r],[el,er],mix];
 values.forEach((v,k)=>v.forEach((x,ch)=>buffers[k].writeInt16LE(Math.round(Math.max(-.999,Math.min(.999,x))*32767),j*4+ch*2)));
 for(const x of mix){peak=Math.max(peak,Math.abs(x));sq+=x*x;count++;}
 }buffers.forEach((b,i)=>fs.writeSync(handles[i],b));}
 }finally{handles.forEach(h=>fs.closeSync(h));}
 if(p.audio.clips?.length||p.audio.bus_envelopes)await editAudio(p,out,paths);
 if(p.audio.narration){const mixed=path.join(out,'narrated.wav');await run(tool('ffmpeg'),['-y','-i',paths[2],'-i',p.audio.narration,'-filter_complex','[1:a]asplit=2[voice][key];[0:a][key]sidechaincompress=threshold=0.02:ratio=8:attack=20:release=350[bed];[bed][voice]amix=inputs=2:normalize=0,alimiter=limit=0.9[out]','-map','[out]','-t',String(data.duration),mixed]);paths[2]=mixed;}
 const rawStats={peak_dbfs:20*Math.log10(peak||1e-9),rms_dbfs:20*Math.log10(Math.sqrt(sq/count)||1e-9)};let loudness=null;
 if(p.audio.loudness){
  const target=p.audio.loudness,pre=path.join(out,'premaster.wav'),master=path.join(out,'master.wav');fs.copyFileSync(paths[2],pre);
  const filter='loudnorm=I='+target.integrated+':TP='+target.true_peak+':LRA=11';
  const first=await run(tool('ffmpeg'),['-hide_banner','-i',pre,'-af',filter+':print_format=json','-f','null','-']);
  const match=first.err.match(/\{\s*"input_i"[\s\S]*?\}/);if(!match)throw new Error('Loudness measurement missing');
  const m=JSON.parse(match[0]);if(!Number.isFinite(Number(m.input_i)))throw new Error('Cannot normalize silent or invalid audio');
  const second=await run(tool('ffmpeg'),['-y','-hide_banner','-i',pre,'-af',filter+':measured_I='+m.input_i+':measured_TP='+m.input_tp+':measured_LRA='+m.input_lra+':measured_thresh='+m.input_thresh+':offset='+m.target_offset+':linear=true:print_format=json','-ar','48000','-ac','2','-c:a','pcm_s16le',master]);
  const measured=second.err.match(/\{\s*"input_i"[\s\S]*?\}/);loudness={target,input:m,output:measured?JSON.parse(measured[0]):null};fs.copyFileSync(master,paths[2]);
 }
 const result={synthesis:data,files:paths,sha256:paths.map(f=>hash(fs.readFileSync(f))),...rawStats,statistics_scope:p.audio.clips?.length?'synthesizer statistics only; see loudness.output for edited master':loudness?'premaster; see loudness.output for delivered master':'delivered mix',loudness,listening_review:'pending'};
 result.automotive=automotiveCoverage(p);write(path.join(out,'score.json'),data);write(path.join(out,'audio-report.json'),result);return result;
}

