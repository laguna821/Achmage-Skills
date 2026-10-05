import assert from 'node:assert/strict';import {curve,integral,drivingCues,drivingErrors,vehicleSample} from '../lib/automotive-audio.mjs';import {PrecisionBuilder,cameraOrbit} from '../lib/precision.mjs';
let checks=0;function test(name,fn){fn();checks++;console.log('PASS '+name);}
const driving={speed:[[0,10],[4,20]],rpm:[[0,1000],[2,5000],[4,3000]],throttle:[[0,.5],[4,1]],slip:[[0,0],[1,.8],[4,.8]],pan:[[0,-1],[4,1]]},p={scenes:[{id:'drive',start:0,end:120,driving}]};
test('valid driving data',()=>assert.deepEqual(drivingErrors(p),[]));
test('frequency integral is continuous at shift',()=>{assert.equal(integral(driving.rpm,2),6000);assert.ok(Math.abs(integral(driving.rpm,2.00001)-integral(driving.rpm,1.99999)-.1)<1e-5);});
test('same speed curve integrates travelled distance',()=>assert.equal(integral(driving.speed,4),60));
for(const [name,mut]of [['empty curve',d=>d.rpm=[]],['unordered',d=>d.slip=[[0,0],[3,.8],[2,.8]]],['nonfinite',d=>d.speed[1][1]=NaN],['uncovered end',d=>d.pan[1][0]=3],['too loud',d=>d.sound_gain_db=99]])test('reject '+name,()=>{const q=structuredClone(p);mut(q.scenes[0].driving);assert(drivingErrors(q).length);});
test('slip creates dedicated skid cue',()=>assert.deepEqual(drivingCues(p).map(c=>c.kind),['engine','road','skid']));
test('finite audible deterministic effect',()=>{const c=drivingCues(p).at(-1),noise=n=>Math.sin(n*17);let power=0;for(let n=0;n<4800;n++){const a=vehicleSample(c,1+n/48000,n,123,noise);assert.equal(a,vehicleSample(c,1+n/48000,n,123,noise));assert(Number.isFinite(a));power+=a*a;}assert(power/4800>.001);});
test('parameterized surface rejects nonfinite points',()=>{const b=new PrecisionBuilder();assert.throws(()=>b.surface(null,()=>[0,NaN,0],2,2,{}));});
test('surface triangle and UV indices correspond',()=>{const b=new PrecisionBuilder();b.surface(null,(u,v)=>[u,v,0],2,3,{});const g=b.nodes[0].geometry;assert.equal(g.vertices.length,36);assert.equal(g.uv.length,24);assert.equal(g.indices.length,36);});
test('camera orbit retains final target and radius',()=>{const c=cameraOrbit({radius:5,height:3,start:0,end:Math.PI,duration:6});assert.ok(Math.abs(c.keyframes.at(-1).position[2]+5)<1e-9);assert.equal(c.keyframes.at(-1).at,6);});
console.log(JSON.stringify({checks}));
