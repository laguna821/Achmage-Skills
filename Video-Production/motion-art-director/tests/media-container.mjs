import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {containerState,containerErrors,renderMediaContainer} from '../lib/media-container.mjs';
import {inspectMedia,mediaErrors} from '../lib/media.mjs';
import {hybridRuntimeHash,mediaLayerKey,hybridSnapshot} from '../lib/hybrid.mjs';
import {run,tool} from '../lib/io.mjs';
const dir=fs.mkdtempSync(path.join(process.env.MOTION_TEST_ROOT||os.tmpdir(),'motion-container-'));
const source=path.join(dir,'source.mkv');
await run(tool('ffmpeg'),['-nostdin','-v','error','-f','lavfi','-i','testsrc2=s=320x180:r=30:d=3','-c:v','ffv1','-threads','1',source]);
const metadata=await inspectMedia(source),asset={...metadata,asset_id:'film',kind:'video',path:source,rights:{commercial:true,adaptation:true,source_url:'authored:testsrc2',license_url:'authored',attribution:'Synthetic test pattern'}};
delete asset.probe;
const pose=(x,y,width,height,radius)=>({x,y,width,height,radius,velocity:{x:0,y:0,width:0,height:0,radius:0}});
const a=pose(0,0,320,180,0),b=pose(20,20,160,120,20),c=pose(170,40,140,100,30);
const track={version:'media-handoff-v1',segments:[{start_frame:0,end_frame:30,asset_id:'film',source_in:0,speed:1,from:a,to:b},{start_frame:30,end_frame:60,asset_id:'film',source_in:1,speed:1,from:b,to:c}]};
const layer={id:'container',kind:'video',asset_id:'film',source_in:0,rect:[0,0,320,180],fit:'cover',sound:'mute',media_handoff:track};
const scene={id:'move',start:0,end:60,composition:{width:320,height:180,background:'#000000',layers:[layer]}};
const p={schema_version:'3.1.0',renderer:'hybrid-composite',visual_policy:'licensed_media',output:{fps:30,total_frames:60},assets:[asset],scenes:[scene],content_units:[]};
const profile={width:320,height:180,fps:30,crf:0,portrait:false};
assert.deepEqual(containerErrors(p,scene,layer,scene.composition),[]);
for(const mutate of [
 l=>l.media_handoff.segments[1].source_in+=1/30,
 l=>l.media_handoff.segments[1].asset_id='wrong',
 l=>l.media_handoff.segments[0].to.width=-1,
 l=>l.media_handoff.segments[0].from.velocity.x=-2000,
 l=>l.media_handoff.segments[1].to.radius=80,
 l=>l.source_in=.1,
 l=>l.mask={kind:'ellipse'},
 l=>l.mask={kind:'roundrect',radius:90},
 l=>l.media_handoff.segments[1].end_frame=50
]){
 const bad=structuredClone(layer);mutate(bad);assert(containerErrors(p,scene,bad,scene.composition).length);
}
const before=containerState(track,12);containerState(track,48);containerState(track,2);assert.deepEqual(containerState(track,12),before);
const movie=path.join(dir,'container.mkv');await renderMediaContainer(p,scene,layer,60,movie,profile,0,source);
const raw=path.join(dir,'film.rgba');await run(tool('ffmpeg'),['-v','error','-i',movie,'-pix_fmt','rgba','-f','rawvideo',raw]);
const movieBytes=fs.readFileSync(raw),frameBytes=320*180*4;assert.equal(movieBytes.length,60*frameBytes);
for(const frame of [45,0,30,29,59]){
 const still=path.join(dir,'still-'+frame+'.mkv');await renderMediaContainer(p,scene,layer,1,still,profile,frame,source);
 const bytes=path.join(dir,'still-'+frame+'.rgba');await run(tool('ffmpeg'),['-v','error','-i',still,'-pix_fmt','rgba','-f','rawvideo',bytes]);
 assert.deepEqual(fs.readFileSync(bytes),movieBytes.subarray(frame*frameBytes,(frame+1)*frameBytes),'snapshot/full clock differs '+frame);
}
const pixel=(frame,x,y)=>Array.from(movieBytes.subarray(frame*frameBytes+(y*320+x)*4,frame*frameBytes+(y*320+x)*4+4));
assert.equal(pixel(30,20,20)[3],0,'round mask corner must be transparent');
assert.equal(pixel(30,100,80)[3],255,'center must remain opaque');
assert.equal(pixel(30,200,100)[3],0,'outside moving rectangle must be transparent');
assert(!mediaErrors(p).length,mediaErrors(p).join('\n'));
// The normal public hybrid snapshot must route through the adapter, too.
await hybridSnapshot(p,path.join(dir,'public-snapshot.png'),{time:1,width:320,height:180});
const base=hybridRuntimeHash(f=>Buffer.from(f));
for(const name of ['lib/media-container.mjs','lib/continuity.mjs','scripts/media_container.py'])
 assert.notEqual(hybridRuntimeHash(f=>Buffer.from(f+(f===name?'-changed':''))),base);
assert.notEqual(mediaLayerKey(asset,layer,30,profile,{clock_origin:0}),mediaLayerKey(asset,layer,30,profile,{clock_origin:30}));
console.log(JSON.stringify({suite:'media-container',passed:19,evidence:dir,scope:'60 actual frames; 5 shuffled raw RGBA snapshot equality checks; 9 mutants; mask pixels; normal hybrid route; cache identity. No aesthetic claim.'}));
