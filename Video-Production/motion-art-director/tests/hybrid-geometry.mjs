import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {snapshot} from '../lib/render.mjs';import {inspectMedia} from '../lib/media.mjs';import {run,tool} from '../lib/io.mjs';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'motion-geometry-')),source=path.join(dir,'blue.mp4');
await run(tool('ffmpeg'),['-y','-v','error','-f','lavfi','-i','color=c=blue:s=64x64:r=30:d=1','-c:v','libx264','-threads','1','-pix_fmt','yuv420p',source]);
const info=await inspectMedia(source),asset={...info,asset_id:'blue',kind:'video',path:source,provenance:'Authored synthetic fixture',rights:{commercial:true,adaptation:true,source_url:'authored:blue',license_url:'MIT',attribution:'Synthetic fixture'}};
const p={schema_version:'3.1.0',project_id:'geometry-fixture',title:'Geometry fixture',direction:'Exact edge regression',renderer:'hybrid-composite',timeline_semantics:'segments-v1',editing_contract:'shot-rhythm-v1',visual_policy:'licensed_media',render_network:'local_only',profile:{jobs:1,gpu:false},output:{width:1920,height:1080,fps:30,total_frames:3},seed:1,sources:[],content_units:[],required_content_ids:[],events:[],routes:['video-editing'],assets:[asset],scenes:[{id:'edge',start:0,end:3,mode:'composite',content_ids:[],shot_role:'action',composition:{width:1920,height:1080,layers:[{id:'right',kind:'video',asset_id:'blue',source_in:0,rect:[1282,0,638,1080],fit:'cover',sound:'mute',mask:{kind:'roundrect',radius:0}}]}}],audio:{bpm:120,motif:[60],sections:[{start:0,end:.1,energy:0}]}};
// The public contract has a minimum eight-frame shot.
p.output.total_frames=9;p.scenes[0].end=9;p.audio.sections[0].end=.3;
const png=path.join(dir,'edge.png');await snapshot(p,png,{time:0,width:1280,height:720});
const raw=path.join(dir,'pixel.rgb');await run(tool('ffmpeg'),['-y','-v','error','-i',png,'-vf','format=rgb24,crop=1:1:1279:360','-frames:v','1','-pix_fmt','rgb24','-f','rawvideo',raw]);
const pixel=fs.readFileSync(raw);assert.equal(pixel.length,3);assert(pixel[2]>245&&pixel[0]<8&&pixel[1]<8,JSON.stringify([...pixel]));
console.log(JSON.stringify({passed:1,name:'actual720p right-edge video and mask retain final column',pixel:[...pixel]}));
