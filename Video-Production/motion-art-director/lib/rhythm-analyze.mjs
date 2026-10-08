import fs from 'node:fs';import path from 'node:path';
import {ROOT,run,tool,settings,mkdir,read,write} from './io.mjs';
import {assetPath,fileHash} from './media.mjs';
export async function analyzeRhythm(p,out){
 if(fs.existsSync(out))throw Error('Use a new analysis folder');
 const index=p.audio.clips.findIndex(c=>c.bus==='music');if(index<0)throw Error('Music clip required');
 const c=p.audio.clips[index],a=p.assets.find(a=>a.asset_id===c.asset_id),file=assetPath(p,a);
 if(![c.start,c.source_in,c.duration,p.audio.bpm].every(Number.isFinite)||c.source_in<0||c.duration<=0||c.duration*(c.speed??1)>600||p.audio.bpm<30||p.audio.bpm>200)throw Error('Analysis needs a bounded music interval up to600seconds and BPM hint30..200');
 if(await fileHash(file)!==a.sha256)throw Error('Music hash mismatch');
 mkdir(out);const wav=path.join(out,'analysis-mono.wav'),features=path.join(out,'features.json');
 await run(tool('ffmpeg'),['-nostdin','-v','error','-i',file,'-ss',String(c.source_in),'-t',String(c.duration*(c.speed??1)),'-vn','-ac','1','-ar','22050','-c:a','pcm_s16le',wav],{timeout:60000});
 await run(settings().python||'python',[path.join(ROOT,'scripts/rhythm_features.py'),wav,'--bpm',String(p.audio.bpm),'--out',features],{timeout:120000});
 const fineFile=path.join(out,'fine-transients.json');
 await run(settings().python||'python',[path.join(ROOT,'scripts/rhythm_refine.py'),wav,features,'--out',fineFile],{timeout:120000});
 const data=read(features),fine=read(fineFile),result={...data,fine_transients:fine.onsets.map((e,i)=>({...e,id:'fine-'+i,source_seconds:c.source_in+e.seconds})),music:{asset_id:a.asset_id,sha256:a.sha256,clip_index:index},clip:{...c},bus_envelope:p.audio.bus_envelopes?.music||[],events:data.pulse_candidates.map((t,i)=>({id:'pulse-'+i,source_seconds:c.source_in+t,role:'pulse',method:'estimated-grid',confidence:.6,evidence:'Spectral-flux phase/tempo candidate; listening not verified'})),onsets:data.onset_candidates.map((e,i)=>({id:'onset-'+i,source_seconds:c.source_in+e.seconds,strength:e.strength})),narrative:'Candidate events do not require a cut. Fine high-frequency attacks remain separate from coarse events and are not instrument or listening labels.'};
 write(path.join(out,'rhythm-analysis.json'),result);return result;
}
