import assert from 'node:assert/strict';import path from 'node:path';
import {hash} from '../lib/io.mjs';import {auditionChoiceAudit} from '../lib/audition-choice.mjs';
const bytes=Buffer.from('exact audition encode'),music='a'.repeat(64),root=path.resolve('example-project');
const p={project_id:'racing',assets:[{asset_id:'music',kind:'audio',sha256:music}],scenes:[{driving:{}}],audio:{cues:[],clips:[{asset_id:'music',bus:'music'}]},rhythm_score:{music:{asset_id:'music'},bindings:[{id:'cut1',impact_offset_frames:0}]}};
const c={version:'audition-choice-v1',project_id:'racing',source_quote:'effects-on current picture',music_asset_id:'music',music_sha256:music,selected_mix:'effects-on',picture_offset_frames:0,references:[{file:'review.mp4',sha256:hash(bytes)}]};
const opts={root,readFile:()=>bytes};
assert.equal(auditionChoiceAudit(p,c,opts).ok,true);
for(const mutate of [q=>q.project_id='other',q=>q.music_sha256='b'.repeat(64),q=>q.picture_offset_frames=4,q=>q.source_quote='',q=>q.references=[],q=>q.references[0].file='../outside.mp4',q=>q.references[0].sha256='c'.repeat(64)]){const q=structuredClone(c);mutate(q);assert.equal(auditionChoiceAudit(p,q,opts).ok,false);}
assert.equal(auditionChoiceAudit(p,c,{...opts,readFile:()=>Buffer.from('changed')}).ok,false);
assert.equal(auditionChoiceAudit(p,{...c,references:{}},opts).ok,false);
assert.equal(auditionChoiceAudit({...p,audio:{clips:[]}},c,opts).ok,false);
assert.equal(auditionChoiceAudit(p,{...c,selected_mix:'effects-off'},opts).ok,false);
const silent=structuredClone(p);silent.scenes=[];assert.equal(auditionChoiceAudit(silent,c,opts).ok,false);
assert.equal(auditionChoiceAudit(silent,{...c,selected_mix:'effects-off'},opts).ok,true);
const intentional=structuredClone(p),shifted=structuredClone(c);intentional.rhythm_score.bindings[0].impact_offset_frames=2;shifted.picture_offset_frames=2;assert.equal(auditionChoiceAudit(intentional,shifted,opts).ok,true);
console.log('audition-choice: source/mix/project scope, exact file identity, offset drift, traversal and positive shifted control passed');
