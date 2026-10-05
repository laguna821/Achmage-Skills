import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import {validate} from '../lib/contract.mjs';
import {spatialErrors} from '../lib/spatial.mjs';
import {ROOT,read} from '../lib/io.mjs';
const dir=fs.existsSync(path.join(ROOT,'examples-public'))?'examples-public':'examples';
const p=read(path.join(ROOT,dir,'object-flight.project.json'));
assert.equal(validate(p).ok,true);
for(const property of ['clip_path','blend']){
 const q=structuredClone(p);q.scenes[0].composition.layers[0][property]=property==='blend'?'screen':'M0 0L20 20';
 assert(validate(q).errors.some(x=>x.includes('do not implement clip_path/blend')));
}
const space={renderer:'spatial-three',profile:{},output:{total_frames:30},spatial:{version:'precision-1',nodes:[{id:'body',geometry:{type:'box',size:[1,1,1]}}]},scenes:[{start:0,end:30,spatial:{camera:{position:[0,2,5],target:[0,0,0]}}}]};
assert.deepEqual(spatialErrors(space),[]);
space.scenes[0].spatial_transition={kind:'shutter',duration:.4};assert.deepEqual(spatialErrors(space),[]);
space.scenes[0].spatial_transition.kind='iris';assert(spatialErrors(space).some(x=>x.includes('only shutter')));
space.spatial.version='precision-999';assert(spatialErrors(space).some(x=>x.includes('unknown spatial version')));
for(const file of fs.readdirSync(path.join(ROOT,dir)).filter(x=>x.endsWith('.json'))){
 const example=read(path.join(ROOT,dir,file));assert(!example.approval, 'Public example contains approval: '+file);
}
console.log('PASS publication: unsupported overlay/transition/version rejection; public approvals absent');
