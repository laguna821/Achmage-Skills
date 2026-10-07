import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {ROOT,run,tool,write,read,mkdir} from './io.mjs';

export function assetPath(p,a){
 if(!a||typeof a.path!=='string')throw Error('Media asset path required');
 return a.path.startsWith('skill:')?path.resolve(ROOT,a.path.slice(6)):path.resolve(p.__projectDir||ROOT,a.path);
}
export async function fileHash(file){const h=crypto.createHash('sha256');for await(const b of fs.createReadStream(file))h.update(b);return h.digest('hex');}
export async function inspectMedia(file){
 const {out}=await run(tool('ffprobe'),['-v','error','-show_streams','-show_format','-of','json',path.resolve(file)]);
 const data=JSON.parse(out),v=data.streams.find(x=>x.codec_type==='video'),a=data.streams.find(x=>x.codec_type==='audio');
 if(!v)throw Error('Video stream required');
 let videoDuration=Number(v.duration||Number(v.duration_ts)*Number(v.time_base?.split('/')[0])/Number(v.time_base?.split('/')[1]));
 if(!Number.isFinite(videoDuration)||videoDuration<=0){
  // Container duration may describe a longer audio stream. Inspect video packet timestamps only.
  const rows=(await run(tool('ffprobe'),['-v','error','-select_streams','v:0','-show_packets','-show_entries','packet=pts_time,duration_time','-of','csv=p=0',path.resolve(file)])).out.trim().split(/\r?\n/);
  const ends=rows.map(row=>row.split(',').map(Number)).filter(a=>Number.isFinite(a[0])).map(a=>a[0]+(Number.isFinite(a[1])?a[1]:0));
  videoDuration=Math.max(...ends)-Number(v.start_time||0);if(!Number.isFinite(videoDuration)||videoDuration<=0)throw Error('Cannot establish video duration; normalize source explicitly');
 }
 const rotation=Number(v.side_data_list?.find(x=>x.rotation!==undefined)?.rotation||v.tags?.rotate||0);
 return {sha256:await fileHash(file),bytes:fs.statSync(file).size,width:v.width,height:v.height,duration:videoDuration,time_base:v.time_base,avg_frame_rate:v.avg_frame_rate,r_frame_rate:v.r_frame_rate,sample_aspect_ratio:v.sample_aspect_ratio||'1:1',rotation,color_space:v.color_space||'unknown',color_transfer:v.color_transfer||'unknown',color_primaries:v.color_primaries||'unknown',audio:a?{index:a.index,sample_rate:Number(a.sample_rate),channels:a.channels}:null,probe:data};
}
export async function importMedia(file,out,{id,source}={}){
 if(!/^[a-z0-9-]+$/.test(id||''))throw Error('asset id must be lowercase letters/digits/hyphens');
 if(!source?.source_url||!source.license_url||!source.attribution||source.commercial!==true||source.adaptation!==true)throw Error('Source receipt with commercial/adaptation permission required');
 if(fs.existsSync(out))throw Error('Preserve existing receipt: select a new output');
 const info=await inspectMedia(file);const asset={asset_id:id,kind:'video',path:path.relative(path.dirname(path.resolve(out)),path.resolve(file)).replaceAll('\\','/'),...info,provenance:'Source receipt verified at import',rights:source};
 delete asset.probe;write(out,asset);return asset;
}
export function mediaErrors(p){
 const errors=[],check=(v,m)=>{if(!v)errors.push(m);},assets=new Map((p.assets||[]).map(a=>[a.asset_id,a]));
 for(const a of assets.values())if(a.kind==='video'){
  check(p.visual_policy==='licensed_media','video requires licensed_media');
  check(typeof a.path==='string'&&Number.isFinite(a.duration)&&a.duration>0&&a.width>0&&a.height>0,'invalid video metadata '+a.asset_id);
  check(a.rights?.commercial===true&&a.rights?.adaptation===true&&a.rights.source_url&&a.rights.license_url&&a.rights.attribution,'video rights receipt missing '+a.asset_id);
  check(!['smpte2084','arib-std-b67'].includes(a.color_transfer),'HDR source must be explicitly converted and reviewed before SDR import');
 }
 for(const [i,s]of(p.scenes||[]).entries()){
  if(s.renderer!==undefined)check(['hybrid-composite','vector-composite','image-composite','spatial-three','cinematic'].includes(s.renderer),'unknown scene renderer');
  const duration=(s.end-s.start)/30+(p.scenes[i+1]?.transition_in?.duration||0);
  for(const c of [s.composition,s.portrait_composition].filter(Boolean)){
   const ids=new Set();for(const l of c.layers||[]){check(l.id&&!ids.has(l.id),'3.1 layer id required/duplicate');ids.add(l.id);
    if(l.kind!=='video')continue;
    const a=assets.get(l.asset_id);check(a?.kind==='video','video asset missing '+l.asset_id);
    check(Number.isFinite(l.source_in)&&l.source_in>=0,'video source_in required');
    check(l.speed===undefined||Number.isFinite(l.speed)&&l.speed>=.25&&l.speed<=4,'video speed must be .25..4');
    check(l.source_in+duration*(l.speed??1)<=(a?.duration||0)+.001,'video range or transition handle exceeds source '+l.id);
    check(l.fit===undefined||['cover','contain'].includes(l.fit),'video fit invalid');
    check(l.sound===undefined||['mute','source'].includes(l.sound),'video sound invalid');
    check(l.opacity===undefined||l.opacity===1,'video opacity: use authored matte; variable opacity unsupported');
    check(!['x','y','scale','scaleX','scaleY','rotation','draw','reveal','reveal_rect','clip','pivot','position','keyframes','motion','morph','clip_path','blend'].some(k=>l[k]!==undefined),'video transformations belong in crop/rect/mask, unsupported animation rejected');
    check(l.rect?.length===4&&l.rect.every(Number.isFinite)&&l.rect[2]>0&&l.rect[3]>0,'video rect required');
    check(l.rect?.[0]>=0&&l.rect?.[1]>=0&&l.rect[0]+l.rect[2]<=(c.width||1920)&&l.rect[1]+l.rect[3]<=(c.height||1080),'video rect outside composition');
    if(l.sound==='source')check(!!a?.audio,'requested video has no source audio');
    for(const k of ['sound_gain_db','sound_fade_in','sound_fade_out'])if(l[k]!==undefined)check(Number.isFinite(l[k])&&l[k]>=(k==='sound_gain_db'?-60:0)&&l[k]<=(k==='sound_gain_db'?12:duration),'invalid video sound parameter');
    if(l.mask?.kind==='roundrect')check(l.mask.radius===undefined||Number.isFinite(l.mask.radius)&&l.mask.radius>=0,'invalid mask radius');
    if(l.crop)check(l.crop.length===4&&l.crop.every(Number.isFinite)&&l.crop[0]>=0&&l.crop[1]>=0&&l.crop[2]>0&&l.crop[3]>0&&l.crop[0]+l.crop[2]<=1&&l.crop[1]+l.crop[3]<=1,'normalized crop invalid');
    if(l.mask)check(['ellipse','roundrect','path'].includes(l.mask.kind)&&(l.mask.kind!=='path'||typeof l.mask.d==='string'&&/^[MmLlHhVvCcSsQqTtAaZz0-9., +\\-]+$/.test(l.mask.d)),'video mask invalid');
   }
  }
  if(s.transition_in){check(i>0&&Number.isInteger(s.transition_in.duration*30)&&s.transition_in.duration*30>=1&&s.transition_in.duration*30<=s.end-s.start,'transition must use whole frames within incoming scene');check(['fade','wipeleft','wiperight','circleopen','wipe-x','wipe-y','iris'].includes(s.transition_in.kind)&&s.transition_in.duration>0&&s.transition_in.duration<=2,'hybrid transition invalid');}
 }
 return errors;
}
export async function verifyMedia(p){for(const a of p.assets||[])if(a.kind==='video'){const file=assetPath(p,a);const probe=await inspectMedia(file);if(probe.sha256!==a.sha256)throw Error('Video hash mismatch '+a.asset_id);if(Math.abs(probe.duration-a.duration)>.05||probe.width!==a.width||probe.height!==a.height)throw Error('Video metadata mismatch '+a.asset_id);}}
export async function selectRange(receipt,out,{start,duration}){
 const a=read(receipt);if(!Number.isFinite(start)||!Number.isFinite(duration)||start<0||duration<=0||start+duration>a.duration)throw Error('Selected source range invalid');
 if(fs.existsSync(out))throw Error('Selection output exists; preserve it');
 const folder=path.dirname(path.resolve(out));mkdir(folder);const source=assetPath({__projectDir:path.dirname(path.resolve(receipt))},a),frames=[];
 for(const [i,t]of[start,start+duration/2,Math.max(start,start+duration-1/30)].entries()){const f=path.join(folder,path.basename(out,'.json')+'-'+i+'.jpg');await run(tool('ffmpeg'),['-y','-v','error','-ss',String(t),'-i',source,'-frames:v','1','-vf','scale=640:-2',f]);frames.push(f);}
 const selected={asset_id:a.asset_id,source_sha256:a.sha256,source_in:start,duration,frames,review:'pending',reason:null};write(out,selected);return selected;
}
