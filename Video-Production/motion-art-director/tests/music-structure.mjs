import assert from 'node:assert/strict';
import {musicIdentity,structureDigest,checkStructure,compileStructure} from '../lib/music-structure.mjs';
const p={assets:[{asset_id:'song',sha256:'a'.repeat(64)}],audio:{clips:[{bus:'music',asset_id:'song',start:0,source_in:100,duration:172}]}};
const m={version:'musical-structure-v1',identity:musicIdentity(p),boundaries:[{id:'a',source_seconds:100.37,method:'authored',evidence:'Fixture phase'},{id:'b',source_seconds:107.61,method:'authored',evidence:'Explicit independently located end'}],groups:[{id:'g',start:'a',end:'b',reason:'Musical motif fixture'}],sections:[],review:{status:'pending'}};
const edit={version:'musical-edit-plan-v1',bindings:[{id:'cut',boundary_id:'b',scene_id:'next',target:{kind:'cut'},reason:'Motif resolves into next action'}]};let n=0;
function test(name,f){f();n++;console.log('PASS '+name);}
test('missing structure fails without crash',()=>assert.equal(checkStructure(p,{}).ok,false));
test('candidate cannot silently become calibrated',()=>{assert.equal(checkStructure(p,m).calibrated,false);assert.throws(()=>compileStructure(p,m,edit),/Review/);assert.equal(compileStructure(p,m,edit,{draft:true}).rhythm_score.events[0].source_seconds,107.61);});
const reviewed=structuredClone(m);reviewed.review={status:'reviewed',note:'Synthetic test attestation, not human listening',structure_digest:structureDigest(reviewed)};
test('unchanged positive control',()=>assert.equal(checkStructure(p,reviewed).ok,true));
test('period preserved but phase shifted invalidates previous review',()=>{for(const delta of [.225, .9,1/30,-2/30]){const q=structuredClone(reviewed);q.boundaries.forEach(b=>b.source_seconds+=delta);assert.equal(checkStructure(p,q).ok,false);}});
test('source trim/hash/speed invalidate identity',()=>{for(const mutate of [x=>x.audio.clips[0].source_in++,x=>x.audio.clips[0].speed=.9,x=>x.assets[0].sha256='b'.repeat(64)]){const q=structuredClone(p);mutate(q);assert.equal(checkStructure(q,reviewed).ok,false);}});
test('gain-only change does not imply tempo change',()=>{const q=structuredClone(p);q.audio.clips[0].gain_db=-20;assert.equal(checkStructure(q,reviewed).ok,true);});
test('unordered, duplicate and orphan group endpoints rejected',()=>{for(const mutate of [x=>x.boundaries.reverse(),x=>x.boundaries[1].id='a',x=>x.groups[0].end='missing']){const q=structuredClone(m);mutate(q);assert.equal(checkStructure(p,q).ok,false);}});
test('nonuniform and syncopated times retained without grid snapping',()=>{const q=structuredClone(m);q.boundaries[1].source_seconds=108.027;const r=compileStructure(p,q,edit,{draft:true});assert.equal(r.rhythm_score.events[0].source_seconds,108.027);});
test('unknown edit boundary rejected',()=>{const e=structuredClone(edit);e.bindings[0].boundary_id='missing';assert.throws(()=>compileStructure(p,m,e,{draft:true}),/missing/);});
test('unattested listening claim rejected',()=>{const q=structuredClone(m);q.boundaries[0].method='listening-corrected';assert.equal(checkStructure(p,q).ok,false);});
console.log('music-structure: '+n+' contracts passed; phase review invalidation is not automatic perception of a wrong first beat');
