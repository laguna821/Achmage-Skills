import assert from 'node:assert/strict';import {sourceActionAudit} from '../lib/source-action.mjs';
const p={output:{fps:30},assets:[{asset_id:'v',sha256:'abc'}],scenes:[{id:'s',start:900,end:960,composition:{layers:[{id:'v',kind:'video',asset_id:'v',source_in:10,speed:2,source_action:{version:'source-action-v1',source_sha256:'abc',evidence:'Observed preparation/contact/result',before:10.1,contact:12,after:13.9,landing_frame:30,entity_id:'car-a'}}]}}]};
p.assets[0].sha256='a'.repeat(64);p.scenes[0].composition.layers[0].source_action.source_sha256=p.assets[0].sha256;
assert.equal(sourceActionAudit(p).ok,true);assert.equal(sourceActionAudit(p).rows[0].output_frame,930);
for(const n of [-4,-2,-1,1,2,4]){const q=structuredClone(p);q.scenes[0].composition.layers[0].source_action.landing_frame+=n;assert.equal(sourceActionAudit(q).ok,false);}
const stale=structuredClone(p);stale.assets[0].sha256='changed';assert.equal(sourceActionAudit(stale).ok,false);
const omitted=structuredClone(p);omitted.scenes[0].composition.layers[0].source_in=10.5;assert.equal(sourceActionAudit(omitted).ok,false);
assert.equal(sourceActionAudit({scenes:[]}).ok,true);
const missing=structuredClone(p);delete missing.assets[0].sha256;delete missing.scenes[0].composition.layers[0].source_action.source_sha256;assert.equal(sourceActionAudit(missing).ok,false);
console.log('source-action: speed mapping, six timing mutants, stale source, cropped preparation, legacy compatibility passed');
