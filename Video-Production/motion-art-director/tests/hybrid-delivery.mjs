import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {assembleHybridClips} from '../lib/hybrid.mjs';
import {run,tool,write} from '../lib/io.mjs';

// Browser decoders may reject changing SPS/PPS despite a successful ffprobe or
// software decode. Exercise the actual assembly path with differing cut content.
const out=fs.mkdtempSync(path.join(os.tmpdir(),'motion-hybrid-delivery-'));
const clips=[];
for(const [i,input]of ['color=c=black:s=160x90:r=30:d=1.2','testsrc2=s=160x90:r=30:d=1.2','color=c=blue:s=160x90:r=30:d=1.2'].entries()){
 const file=path.join(out,'input-'+i+'.mp4');
 await run(tool('ffmpeg'),['-nostdin','-y','-v','error','-f','lavfi','-i',input,'-an','-c:v','libx264','-threads','2','-preset',i===1?'fast':'veryfast','-crf','22',file]);
 clips.push({path:file});
}
const p={output:{total_frames:90},scenes:[{id:'still',start:0,end:30},{id:'motion',start:30,end:60,transition_in:{kind:'fade',duration:.2}},{id:'end',start:60,end:90,transition_in:{kind:'fade',duration:.2}}]};
const picture=await assembleHybridClips(clips,p,out,{crf:22});
const probe=JSON.parse((await run(tool('ffprobe'),['-v','error','-count_frames','-select_streams','v:0','-show_entries','stream=nb_read_frames,duration,width,height,r_frame_rate,pix_fmt,color_space','-of','json',picture])).out).streams[0];
assert.equal(Number(probe.nb_read_frames),90);assert.equal(Number(probe.duration),3);assert.equal(probe.r_frame_rate,'30/1');assert.equal(probe.pix_fmt,'yuv420p');assert.equal(probe.color_space,'bt709');
const decoded=await run(tool('ffmpeg'),['-v','error','-i',picture,'-f','null','-']);assert.equal(decoded.err.trim(),'');
// Keep the initial SPS as well as later packet headers; the normal log runner
// deliberately keeps only a tail and is unsuitable for this assertion.
const trace=spawnSync(tool('ffmpeg'),['-nostdin','-v','verbose','-i',picture,'-map','0:v:0','-c:v','copy','-bsf:v','trace_headers','-f','null','-'],{encoding:'utf8',windowsHide:true,timeout:30000,maxBuffer:16*1024*1024});assert.equal(trace.status,0,String(trace.error||trace.stderr));
// These SPS fields must remain constant for the complete delivered stream.
const fields={};for(const line of trace.stderr.split('\n')){const m=line.match(/\b(profile_idc|level_idc|chroma_format_idc|pic_width_in_mbs_minus1|pic_height_in_map_units_minus1|max_num_ref_frames|log2_max_frame_num_minus4|log2_max_pic_order_cnt_lsb_minus4)\s+.*?=\s*(\d+)\s*$/);if(m)(fields[m[1]]??=new Set()).add(m[2]);}
assert(Object.keys(fields).length>=6,'Expected H264 SPS trace evidence');for(const [key,values]of Object.entries(fields))assert.equal(values.size,1,'Delivery parameter changes: '+key);
write(path.join(out,'verification.json'),{probe,sps:Object.fromEntries(Object.entries(fields).map(([k,v])=>[k,[...v]])),nativeBrowserPlayback:'separate published-file gate; this test does not claim native playback'});
console.log(JSON.stringify({passed:true,out,picture,frames:90}));
