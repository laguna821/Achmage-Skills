import assert from 'node:assert/strict';
import {subjectModelAudit} from '../lib/subject-model.mjs';
import {conceptPage} from '../lib/concept-audition.mjs';
const p={sections:[{id:'s1'}],music:[{id:'a'},{id:'b'}],preferred_music_id:'b'};
const model={version:'subject-model-v1',premise:'Observed conditions change the next action',oversimplification:'Only repeated hand movement',audience_shift:'See the decision behind the action',facets:[{id:'f',label:'Judgment',scope:'include',reason:'central premise',section_ids:['s1']}],decisions:[{id:'d',section_id:'s1',observation:'compare two conditions',choice:'adjust the operation',consequence:'visible state changes',depiction:'same object before and after',evidence_status:'planned'}],music_relation:{id:'b',feeling:'light groove',editorial_response:'contrast preparation with observation',avoid:'one fixed tempo'}};
let passed=0;const test=(n,f)=>{f();passed++;console.log('PASS '+n);};
test('legacy concepts keep original path',()=>assert(subjectModelAudit(undefined,p).ok));
test('valid model still requires editorial review',()=>{const a=subjectModelAudit(model,p);assert(a.ok);assert.equal(a.review_state,'requires-editorial-review');assert(a.pending.length);assert(!('score'in a));});
for(const [n,mutate]of [
 ['invented scene',m=>m.facets[0].section_ids=['absent']],
 ['included facet without representation',m=>m.facets[0].section_ids=[]],
 ['excluded facet secretly included',m=>m.facets[0].scope='exclude'],
 ['music conclusion uses previous choice',m=>m.music_relation.id='a'],
 ['checked without evidence',m=>m.decisions[0].evidence_status='production-checked'],
 ['missing consequence',m=>delete m.decisions[0].consequence],
 ['duplicate decision',m=>m.decisions.push({...m.decisions[0]})]
 ])test(n,()=>{const m=structuredClone(model);mutate(m);assert(!subjectModelAudit(m,p).ok);});
test('generic prose cannot automatically earn semantic approval',()=>{const m=structuredClone(model);m.decisions[0].observation='nice movement';m.decisions[0].choice='nice movement';m.decisions[0].consequence='nice movement';const a=subjectModelAudit(m,p);assert(a.ok);assert.equal(a.review_state,'requires-editorial-review');});
test('preferred music controls both initial picture player and choice',()=>{const q={...p,duration:180,preview_seconds:45,title:'fixture',logline:'fixture',message_track:{units:[]},music:p.music.map(c=>({...c,title:c.id,direction:c.id,reject_if:'fixture',provider:'fixture',rights:{},source_in:0})),sections:[]};const html=conceptPage(q,['a.mp4','b.mp4']);assert.match(html,/src="b.mp4"/);assert.match(html,/data-index="1" aria-pressed="true"/);assert.match(html,/"preferred":1/);});
console.log(JSON.stringify({passed,scope:'Subject links and preferred-player state; semantic quality remains human review.'}));
