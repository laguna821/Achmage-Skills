import fs from 'node:fs';
import path from 'node:path';
import {run,tool,write} from './io.mjs';
import {assetPath,fileHash} from './media.mjs';
import {envelopeExpression} from './audio-edit.mjs';
import {duckPCM} from './pcm-duck.mjs';
import {ownedReserve,ownedComplete,ownedCopy} from './storage.mjs';

export const BUSES=['music','sfx','ambience','voice'];
export function sourceAudioClips(p,{portrait=false}={}){
 const result=[];
 for(const s of p.scenes||[])for(const l of (portrait?(s.portrait_composition||s.composition):s.composition)?.layers||[])if(l.kind==='video'&&l.sound==='source')result.push({bus:'ambience',asset_id:l.asset_id,source_in:l.source_in,start:s.start/30,duration:(s.end-s.start)/30,speed:l.speed??1,gain_db:l.sound_gain_db??0,fade_in:l.sound_fade_in??.015,fade_out:l.sound_fade_out??.015,scene:s.id,layer:l.id});
 return result;
}
const tempo=s=>s<.5?'atempo=0.5,atempo='+s/.5:s>2?'atempo=2,atempo='+s/2:'atempo='+s;
export async function editAudio31(p,out,paths,{portrait=false}={}){
 const duration=p.output.total_frames/30,clips=[...(p.audio.clips||[]),...sourceAudioClips(p,{portrait})],records=[];
 const samples=Math.round(duration*48000),timeout=Math.max(30000,duration*2000);
 async function pcm(args,target){
  await run(tool('ffmpeg'),['-nostdin',...args,'-t',String(duration),'-fs',String(samples*4+65536),'-ar','48000','-ac','2','-c:a','pcm_s16le',target],{timeout,killSignal:'SIGKILL'});
  const d=JSON.parse((await run(tool('ffprobe'),['-v','error','-show_entries','format=duration','-of','json',target],{timeout:10000})).out).format.duration;
  if(Math.abs(Number(d)-duration)>1/48000+.000001||fs.statSync(target).size>samples*4+4096)throw Error('Audio output duration/size did not match bounded sample contract');
 }
 const stems={music:paths[0],sfx:paths[1],ambience:path.join(out,'ambience.wav'),voice:path.join(out,'voice.wav')};
 for(const bus of BUSES){
  const original=path.join(out,'ungated-'+bus+'.wav'),selected=clips.filter(c=>c.bus===bus);
  if(bus==='music'||bus==='sfx')ownedCopy(stems[bus],original,{kind:'temporary'});
  else await pcm(['-y','-v','error','-f','lavfi','-i','anullsrc=r=48000:cl=stereo'],original);
  const args=['-y','-v','error','-i',original],filters=['[0:a]aformat=sample_rates=48000:channel_layouts=stereo[b0]'];
  let i=1;
  for(const c of selected){
   const a=p.assets.find(a=>a.asset_id===c.asset_id),file=assetPath(p,a);if(await fileHash(file)!==a.sha256)throw Error('Audio source hash mismatch '+c.asset_id);
   const probe=JSON.parse((await run(tool('ffprobe'),['-v','error','-show_streams','-show_format','-of','json',file])).out);
   if(!probe.streams.some(s=>s.codec_type==='audio'))throw Error('Requested source audio absent: '+c.asset_id);
   const speed=c.speed??1;if(c.source_in+c.duration*speed>Number(probe.format.duration)+.001)throw Error('Audio source range exceeds duration '+c.asset_id);
   args.push('-i',file);
   let chain='['+i+':a]atrim=start='+c.source_in+':duration='+c.duration*speed+',asetpts=PTS-STARTPTS,'+tempo(speed)+',aresample=48000,aformat=channel_layouts=stereo,volume='+(c.gain_db??0)+'dB';
   if(c.fade_in>0)chain+=',afade=t=in:d='+c.fade_in;
   if(c.fade_out>0)chain+=',afade=t=out:st='+(c.duration-c.fade_out)+':d='+c.fade_out;
   filters.push(chain+',adelay='+Math.round(c.start*48000)+'S:all=1[b'+i+']');records.push({...c,sha256:a.sha256,attribution:a.rights?.attribution});i++;
  }
  let mix=Array.from({length:i},(_,j)=>'[b'+j+']').join('')+'amix=inputs='+i+':normalize=0:duration=first,apad=whole_len='+samples+',atrim=end_sample='+samples+',asetpts=N/SR/TB';
  const keys=p.audio.bus_envelopes?.[bus];if(keys){const e=envelopeExpression(keys);mix+=",aeval=exprs='val(0)*("+e+")|val(1)*("+e+")'";}
  mix+='[out]';filters.push(mix);args.push('-filter_complex_threads','1','-filter_complex',filters.join(';'),'-map','[out]');await pcm(args,stems[bus]);
 }
 // Deterministic streaming envelope follower avoids premature FFmpeg sidechain EOF.
 let musicFile=stems.music;
 for(const [bus,enabled,threshold,ratio,attack,release]of [['sfx',p.audio.mix?.duck_sfx,.045,3,20,260],['voice',p.audio.mix?.duck_voice,.03,4,15,250]])if(enabled===true){
  const target=path.join(out,'ducked-by-'+bus+'.wav');
  ownedReserve(target,{kind:'temporary'});duckPCM(musicFile,stems[bus],target,{duration,threshold,ratio,attack,release,key_gain_db:p.audio.mix?.[bus+'_gain_db']??0});ownedComplete(target);musicFile=target;
 }
 const args=['-y','-v','error'];BUSES.forEach(b=>args.push('-i',b==='music'?musicFile:stems[b]));
 let filter=BUSES.map((b,i)=>'['+i+':a]volume='+(p.audio.mix?.[b+'_gain_db']??0)+'dB['+b+']').join(';')+';';
 let music='music',fx='sfx',voice='voice';
 filter+='['+music+']['+fx+'][ambience]['+voice+']';
 filter+='amix=inputs=4:normalize=0:duration=first,alimiter=limit=0.95:level=false:latency=true,apad=whole_len='+samples+',atrim=end_sample='+samples+',asetpts=N/SR/TB';
 // Gate the completed mix at sample resolution, after effect tails and limiter delay.
 for(const s of p.audio.silence||[])filter+=",aeval=exprs='if(gte(t,"+s.start+")*lt(t,"+s.end+"),0,val(0))|if(gte(t,"+s.start+")*lt(t,"+s.end+"),0,val(1))'";
 filter+='[out]';args.push('-filter_complex_threads','1','-filter_complex',filter,'-map','[out]');await pcm(args,paths[2]);
 write(path.join(out,'edit-decision-list.json'),{version:'audio-edit-3.1',clips:records,stems,source_audio:'Original recording claims apply only to registered source clips. Synthesized effects are authored sound design.'});
 return stems;
}

// Apply editorial silence after mastering too: resampling and lookahead may
// otherwise put a few samples back into an intentional pause.
export async function gateFinal31(p,file,out){
 const ending=p.audio.ending,intervals=[...(p.audio.silence||[])];
 if(ending?.version==='event-ending-v2')intervals.push({start:ending.quiet_time,end:ending.title_time},{start:ending.tail_silence,end:p.output.total_frames/30});
 if(!intervals.length)return;
 const terms=intervals.map(s=>'gte(n,'+Math.round(s.start*48000)+')*lt(n,'+Math.round(s.end*48000)+')').join('+');
 const target=path.join(out,'gated-master.wav'),samples=Math.round(p.output.total_frames/30*48000);
 await run(tool('ffmpeg'),['-nostdin','-y','-v','error','-i',file,'-af',"aeval=exprs='if("+terms+",0,val(0))|if("+terms+",0,val(1))',apad=whole_len="+samples+',atrim=end_sample='+samples,'-ar','48000','-ac','2','-c:a','pcm_s16le',target],{timeout:Math.max(30000,p.output.total_frames/30*2000)});
 ownedCopy(target,file);
}
