import {genericEndingErrors} from './ending31.mjs';
import {ownedCopy} from './storage.mjs';
import fs from 'node:fs';import path from 'node:path';import {ROOT,hash,run,tool,write} from './io.mjs';
export function editErrors(p){const errors=[],a=p.audio||{},duration=p.output?.total_frames/30;if(a.clips===undefined)return errors;
 if(!Array.isArray(a.clips)||!a.clips.length)return ['audio clips must be a nonempty array'];
 for(const c of a.clips){const n=(v,min,max)=>Number.isFinite(v)&&v>=min&&v<=max;
 if(!c||typeof c!=='object'){errors.push('invalid audio clip');continue;}
 if(!(p.schema_version==='3.1.0'?['music','sfx','ambience','voice']:['music','sfx']).includes(c.bus)||!n(c.start,0,duration)||!n(c.duration,.01,duration)||c.start+c.duration>duration+.001||!n(c.source_in,0,86400)||!n(c.gain_db??0,-60,12)||!n(c.fade_in??0,0,c.duration)||!n(c.fade_out??0,0,c.duration)||!n(c.speed??1,.25,4))errors.push('invalid audio edit time/gain/fade');
 const asset=(p.assets||[]).find(a=>a.asset_id===c.asset_id);if(asset?.kind!=='audio'||!asset.path||!asset.sha256)errors.push('missing audio asset');
 if(!asset?.rights?.commercial||!asset?.rights?.adaptation||!asset?.rights?.source_url||!asset?.rights?.license_url||!asset?.rights?.attribution)errors.push('audio permission evidence missing');
 }
 return errors;
}
export function audioAssetPath(p,a){const f=path.isAbsolute(a.path)?a.path:path.resolve(p.__projectDir||ROOT,a.path);if(!fs.existsSync(f)||hash(fs.readFileSync(f))!==a.sha256)throw Error('Audio asset missing/hash mismatch: '+a.asset_id);return f;}
export async function editAudio(p,out,paths){const errs=editErrors(p);if(errs.length)throw Error(errs.join('\n'));const duration=p.output.total_frames/30,edits=[];
 const choreography=choreographyErrors(p);if(choreography.length)throw Error(choreography.join('\n'));
 for(const bus of ['music','sfx']){const clips=(p.audio.clips||[]).filter(c=>c.bus===bus);if(!clips.length)continue;const target=path.join(out,bus+'.wav'),original=path.join(out,'synth-'+bus+'.wav');ownedCopy(target,original,{kind:'temporary'});
  const args=['-y','-hide_banner','-v','error','-i',original],filters=['[0:a]aformat=sample_rates=48000:channel_layouts=stereo[b0]'];let i=1;
  for(const c of clips){const a=p.assets.find(a=>a.asset_id===c.asset_id),file=audioAssetPath(p,a);const probe=await run(tool('ffprobe'),['-v','error','-show_entries','format=duration','-of','json',file]);if(c.source_in+c.duration>Number(JSON.parse(probe.out).format.duration)+.02)throw Error('Audio source range exceeds duration: '+a.asset_id);
   args.push('-i',file);filters.push('['+i+':a]atrim=start='+c.source_in+':duration='+c.duration+',asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,volume='+(c.gain_db??0)+'dB,afade=t=in:d='+(c.fade_in??0)+',afade=t=out:st='+(c.duration-(c.fade_out??0))+':d='+(c.fade_out??0)+',adelay='+Math.round(c.start*48000)+'S:all=1[b'+i+']');edits.push({...c,sha256:a.sha256,source:a.rights.source_url,attribution:a.rights.attribution});i++;
  }
  filters.push(Array.from({length:i},(_,j)=>'[b'+j+']').join('')+'amix=inputs='+i+':normalize=0:duration=longest,apad,atrim=duration='+duration+'[out]');args.push('-filter_complex',filters.join(';'),'-map','[out]','-ar','48000','-ac','2','-c:a','pcm_s16le',target);await run(tool('ffmpeg'),args);
 }
 // Apply to each complete bus (including recording tails) at sample resolution.
 for(const [index,bus]of ['music','sfx'].entries()){
  const keys=p.audio.bus_envelopes?.[bus];if(!keys)continue;
  const raw=path.join(out,'ungated-'+bus+'.wav');ownedCopy(paths[index],raw,{kind:'temporary'});
  const e=envelopeExpression(keys),filter="aeval=exprs='val(0)*("+e+")|val(1)*("+e+")'";
  await run(tool('ffmpeg'),['-y','-v','error','-i',raw,'-af',filter,'-ar','48000','-ac','2','-c:a','pcm_s16le',paths[index]]);
 }
 const mix=p.audio.mix||{},mg=mix.music_gain_db??0,sg=mix.sfx_gain_db??0;
 if(![mg,sg].every(x=>Number.isFinite(x)&&x>=-40&&x<=18))throw Error('invalid stem mix gain');
 let tail='[0:a]volume='+mg+'dB[music];[1:a]volume='+sg+'dB[sfx];';
 if(mix.duck_sfx===true)tail+='[sfx]asplit=2[key][fx];[music][key]sidechaincompress=threshold=0.045:ratio=3:attack=20:release=260[bed];[bed][fx]amix=inputs=2:normalize=0';
 else tail+='[music][sfx]amix=inputs=2:normalize=0';
 for(const s of p.audio.silence||[])tail+=",volume=0:enable='between(t,"+s.start+','+s.end+")'";
 tail+=',alimiter=limit=0.95:level=false,apad,atrim=duration='+duration+'[out]';await run(tool('ffmpeg'),['-y','-v','error','-i',paths[0],'-i',paths[1],'-filter_complex',tail,'-map','[out]','-ar','48000','-ac','2','-c:a','pcm_s16le',paths[2]]);write(path.join(out,'edit-decision-list.json'),{version:'audio-edit-1',clips:edits,attribution:[...new Set(edits.map(e=>e.attribution))],note:'Edited licensed recordings. Synthetic SFX are not recordings of the represented vehicle.'});
}
// Audio/visual ending contract. Times are absolute seconds; renderer bindings remain editable.
export function envelopeGain(keys,t){
 if(!keys?.length)return 1;if(t<=keys[0][0])return keys[0][1];
 for(let i=1;i<keys.length;i++){const a=keys[i-1],b=keys[i];if(t<b[0])return a[1]+(b[1]-a[1])*(t-a[0])/(b[0]-a[0]);}
 return keys.at(-1)[1];
}
export function envelopeExpression(keys){
 let expr=String(keys.at(-1)[1]);
 for(let i=keys.length-1;i>0;i--){const a=keys[i-1],b=keys[i],v=a[1]===b[1]?String(a[1]):'('+a[1]+'+('+b[1]+'-'+a[1]+')*(t-'+a[0]+')/('+b[0]+'-'+a[0]+'))';expr='if(lt(t,'+b[0]+'),'+v+','+expr+')';}
 return 'if(lt(t,'+keys[0][0]+'),'+keys[0][1]+','+expr+')';
}
export function choreographyErrors(p){
 const a=p.audio||{},end=p.output?.total_frames/30,errors=[],env=a.bus_envelopes;
 const n=x=>Number.isFinite(x),same=(x,y)=>Math.abs(x-y)<=1/30+1e-8;
 if(env!==undefined){
  if(!env||typeof env!=='object'||Array.isArray(env))return ['audio.bus_envelopes must be an object'];
  for(const [bus,keys]of Object.entries(env)){
   if(!(p.schema_version==='3.1.0'?['music','sfx','ambience','voice']:['music','sfx']).includes(bus)){errors.push('unknown audio envelope bus');continue;}
   if(!Array.isArray(keys)||keys.length<2||keys.some((k,i)=>!Array.isArray(k)||k.length!==2||!k.every(n)||k[0]<0||k[0]>end||k[1]<0||k[1]>1||(i&&k[0]<=keys[i-1]?.[0]))||keys[0]?.[0]!==0||keys.at(-1)?.[0]!==end)errors.push('invalid '+bus+' envelope: cover whole duration, strictly ordered, gain 0..1');
  }
 }
 if(errors.length)return errors;
 const e=a.ending;if(e===undefined)return errors;
 if(e?.version==='event-ending-v2')return genericEndingErrors(p,envelopeGain);
 if(!e||e.version!=='event-ending-v1')return ['unknown ending contract'];
 for(const k of ['stop_time','mechanical_quiet','logo_time','tail_silence'])if(!n(e[k])||e[k]<0||e[k]>end)errors.push('invalid ending '+k);
 if(errors.length)return errors;
 if(!(e.stop_time<e.mechanical_quiet&&e.mechanical_quiet<e.logo_time&&e.logo_time<e.tail_silence&&e.tail_silence<end))errors.push('ending must order stop / quiet / logo / silence / end');
 const stop=p.scenes?.find(s=>s.id===e.stop_scene),logo=p.scenes?.find(s=>s.id===e.logo_scene);
 const local=e.stop_time-(stop?.start??0)/30,logoLocal=e.logo_time-(logo?.start??0)/30;
 if(!stop?.driving||local<0||local>=(stop.end-stop.start)/30||envelopeGain(stop.driving.speed,local)>1e-6||stop.driving.speed.some(k=>k[0]>local&&k[1]>1e-6))errors.push('ending stop is not bound to a stopped driving curve');
 if(!e.subject_id||!p.spatial?.nodes?.some(n=>n.id===e.subject_id)||!stop?.spatial?.transforms?.[e.subject_id])errors.push('ending stop needs an authored subject transform');
 const transform=stop?.spatial?.transforms?.[e.subject_id],rest=transform?.keyframes?.find(k=>same(k.at,local));
 if(!rest?.position||transform.keyframes.some(k=>k.at>local&&k.position&&k.position.some((v,i)=>Math.abs(v-rest.position[i])>1e-5)))errors.push('subject must hold its stop position after the event');
 const layer=logo?.composition?.layers?.find(l=>l.id===e.logo_layer);
 if(!layer||logoLocal<0||logoLocal>=(logo.end-logo.start)/30)errors.push('ending logo layer/time binding missing');
 else if(layer.opacity!==0||!layer.keyframes?.some(k=>same(k.at,logoLocal)&&k.opacity===0)||layer.keyframes.some(k=>k.at<logoLocal&&k.opacity>0)||!layer.keyframes.some(k=>k.at>logoLocal&&k.opacity>0))errors.push('logo must begin from zero opacity at the bound event');
 const zeroDuring=(bus,from,to)=>{const k=env?.[bus];return k&&[from,to,...k.filter(x=>x[0]>from&&x[0]<to).map(x=>x[0])].every(t=>envelopeGain(k,t)===0);};
 if(!zeroDuring('music',e.stop_time,end))errors.push('music must remain silent after the stop');
 if(!zeroDuring('sfx',e.mechanical_quiet,e.logo_time))errors.push('mechanical tail leaks into the intentional pause');
 if(!zeroDuring('sfx',e.tail_silence,end))errors.push('final SFX silence missing');
 const allowed=new Set(e.logo_cue_ids||[]),cues=a.cues||[];
 if(!allowed.size||!cues.some(c=>allowed.has(c.id)&&same(c.time,e.logo_time)))errors.push('logo needs a timed, identified effect cue');
 for(const c of cues)if(c.time+(c.duration??.7)>e.logo_time&&c.time<e.tail_silence&&!allowed.has(c.id))errors.push('unplanned SFX overlaps the logo interval');
 for(const id of allowed)if(!cues.some(c=>c.id===id&&c.time>=e.logo_time&&c.time+(c.duration??.7)<=e.tail_silence))errors.push('logo cue must end before final silence');
 for(const id of allowed)if(cues.filter(c=>c.id===id).length!==1)errors.push('logo cue IDs must be unique');
 if((a.clips||[]).some(c=>c.bus==='sfx'&&c.start+c.duration>e.logo_time&&c.start<e.tail_silence))errors.push('ending logo interval currently supports identified synthetic cues only');
 if((p.scenes||[]).some(s=>s.driving&&s.end/30>e.logo_time&&s.start/30<e.tail_silence))errors.push('driving sound overlaps the logo interval');
 if(a.narration)errors.push('ending contract does not yet automate a narration bus');
 return errors;
}

