import assert from 'node:assert/strict';import {landingInventory} from '../lib/rhythm-landings.mjs';
const p={audio:{clips:[{start:0,source_in:100}]},rhythm_score:{music:{clip_index:0},events:[{id:'e',source_seconds:102}],bindings:[{id:'b',event_id:'e',scene_id:'s',target:{kind:'cut'}}]},scenes:[{id:'s',start:60,end:100,composition:{layers:[{id:'t',kind:'text',x:-100,keyframes:[{at:.16,x:0}]}]}}]};
assert.equal(landingInventory(p).rows[0].first_pose_offset_frames,5);
for(const off of [-4,-2,-1,0,1,2,4]){
 p.scenes[0].start=60+off;p.scenes[0].composition.layers[0].keyframes=[];
 assert.equal(landingInventory(p).rows[0].first_pose_offset_frames,off);
}
p.scenes[0].start=56;p.rhythm_score.bindings[0].target.phase='arrival';p.scenes[0].composition.layers[0].keyframes=[{at:4/30,x:0}];
assert.equal(landingInventory(p).rows[0].first_pose_offset_frames,0);
console.log('landing inventory: late first pose, ±1/2/4-frame controls and transition arrival distinguishable');
