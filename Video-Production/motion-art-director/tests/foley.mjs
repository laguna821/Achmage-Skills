import assert from 'node:assert/strict';
import {objectFoley} from '../lib/foley.mjs';
import {audioErrors,CUE_KINDS} from '../lib/audio.mjs';
import {read,ROOT} from '../lib/io.mjs';
import path from 'node:path';
for(const kind of ['pour','grind']){
 const samples=Array.from({length:96000},(_,i)=>objectFoley(kind,i/48000,2,97));
 assert.ok(samples.every(Number.isFinite));assert.ok(Math.max(...samples.slice(0,48000))<.2);
 assert.equal(objectFoley(kind,-1,2,97),0);assert.equal(objectFoley(kind,2,2,97),0);
 assert.ok(samples.reduce((s,n)=>s+n*n,0)>1,'audible energy');
 for(const i of [95999,173,48000,7,60013])assert.equal(samples[i],objectFoley(kind,i/48000,2,97),'random access must match');
 assert.notEqual(objectFoley(kind,.5123,2,98),objectFoley(kind,.5123,2,97));
}
const p={schema_version:'3.1.0',output:{total_frames:90},audio:{cues:[{id:'pour',kind:'pour',time:0,duration:2},{id:'grind',kind:'grind',time:2,duration:1}]}};
assert.deepEqual(audioErrors(p),[]);
for(const file of ['project.schema.json','project-3.1.schema.json']){
 const s=read(path.join(ROOT,'contracts',file));
 assert.deepEqual(s.properties.audio.properties.cues.items.properties.kind.enum,CUE_KINDS);
}
console.log('foley: deterministic pour/grind, bounded cues and schema agreement passed; listening not asserted');
