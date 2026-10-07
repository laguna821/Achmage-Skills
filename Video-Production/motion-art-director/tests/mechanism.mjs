import assert from 'node:assert/strict';
import {transmission,beltGeometry} from '../lib/mechanism.mjs';
import {objectFoley} from '../lib/foley.mjs';
const x=transmission({turns:3,duration:12,wheel:true}),g=beltGeometry();
assert.equal(x.receipt.rear_turns,3*150/66);
assert.ok(g.length>1460+Math.PI*132);
const layer=id=>x.layers.find(l=>l.id==='drive-'+id);
assert.ok(Math.abs(layer('chain').keyframes[0].dash_offset+150*6*Math.PI)<1e-8);
assert.equal(layer('rear').keyframes[0].rotation,layer('wheel').keyframes[0].rotation);
assert.deepEqual(x,transmission({turns:3,duration:12,wheel:true}));
assert.throws(()=>beltGeometry({front:[400,600]}));
assert.throws(()=>transmission({duration:NaN}));
for(const kind of ['pedal-click','ratchet','tire-roll']){
 const a=Array.from({length:48000},(_,i)=>objectFoley(kind,i/48000,1,71));
 assert.ok(a.every(Number.isFinite));assert.ok(a.some(x=>Math.abs(x)>.005));
 assert.equal(objectFoley(kind,1,1),0);
 for(const i of [35001,10,7891,24])assert.equal(a[i],objectFoley(kind,i/48000,1,71));
}
console.log('mechanism: shared pitch-distance, rotor ratio, deterministic edits, bounded bicycle effects passed');
