import assert from 'node:assert/strict';
import {springState,hermiteState,handoffAudit} from '../lib/continuity.mjs';
for(const damping of [.4,1]){
 const p={from:10,to:20,velocity:3,damping};
 assert.equal(springState(0,p).position,10);
 assert(Math.abs(springState(0,p).velocity-3)<1e-8);
 const before=springState(.7,p);springState(4,p);springState(.1,p);
 assert.deepEqual(springState(.7,p),before);
 assert(Math.abs((springState(.700001,p).position-springState(.699999,p).position)/.000002-before.velocity)<1e-5);
}
const a={at:0,value:0,velocity:2},b={at:2,value:8,velocity:3};
assert.deepEqual(hermiteState(0,a,b),{position:0,velocity:2});
assert.deepEqual(hermiteState(2,a,b),{position:8,velocity:3});
const endpoint={x:0,y:0,width:100,height:100,radius:12,velocity:{x:0,y:0,width:0,height:0,radius:0}};
const t={version:'media-handoff-v1',segments:[0,30].map(n=>({start_frame:n,end_frame:n+30,asset_id:'film',source_in:n/30,speed:1,from:structuredClone(endpoint),to:structuredClone(endpoint)}))};
assert(handoffAudit(t).ok);
for(const bad of [null,1,'segment',[]])assert.equal(handoffAudit({...t,segments:[bad]}).ok,false);
for(const mutate of [p=>p.segments[1].start_frame++,p=>p.segments[1].source_in+=1/30,p=>p.segments[1].from.radius+=2,p=>p.segments[1].from.velocity.x+=2,p=>p.segments[1].asset_id='other']){
 const copy=structuredClone(t);mutate(copy);assert(!handoffAudit(copy).ok);
}
console.log('PASS absolute spring/derivative/order and handoff source-clock/gap/mask/velocity mutants');
