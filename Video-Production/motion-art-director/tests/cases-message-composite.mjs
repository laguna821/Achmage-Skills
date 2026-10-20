import assert from 'node:assert/strict';
import {caseCards,recipeCards} from '../lib/cases.mjs';
import {search} from '../lib/catalog.mjs';
import {compileMessageTrack,compiledMessageAudit} from '../lib/message-track.mjs';
import {messageFilterPlan} from '../lib/message-composite.mjs';
const cases=caseCards(),recipes=recipeCards();
assert.equal(cases.length,703);assert.equal(recipes.length,16);
assert.equal(new Set(recipes.map(r=>r.family)).size,8);
assert.equal(cases.filter(c=>c.case.duplicate_of).length,19);
assert.equal(search('',1000,{kind:'case',status:'executable'}).length,0);
assert.equal(search('',1000,{kind:'recipe'}).length,16);
assert.equal(search('',1000,{provider:'awesome-ai-motion'}).length,637);
const track={version:'message-track-v1',render_mode:'post-composite',units:[{
 id:'meaning',text:'선택이 모여 옷이 됩니다.',start:0,end:6,
 phrases:[{text:'선택이 모여 옷이 됩니다.',start:0,end:6,portrait_text:'선택이 모여\n옷이 됩니다.'}]
}]};
const project={schema_version:'3.1.0',renderer:'hybrid-composite',output:{total_frames:180},
 scenes:[0,60,120].map(start=>({id:String(start),start,end:start+60,transition_in:start?{kind:'wipe-x',duration:.2}:undefined,composition:{camera:{zoom:1.2},layers:[]}}))};
const compiled=compileMessageTrack(project,track);
assert(compiledMessageAudit(compiled).ok);assert(!project.message_track);
assert(compiled.scenes.every(s=>!s.composition.layers.length));
const plan=messageFilterPlan(track,{width:1920,height:1080,portrait:false},{frames:180});
assert.equal(plan[0].end,180);
for(const frame of [0,59,60,119,120,179])assert.equal(messageFilterPlan(track,{width:1920,height:1080},{startFrame:frame,frames:1})[0].text,track.units[0].text);
assert.equal(messageFilterPlan(track,{width:1920,height:1080},{startFrame:180,frames:1}).length,0);
const bad=structuredClone(track);bad.units[0].phrases[0].portrait_text='축약';
assert.throws(()=>messageFilterPlan(bad,{width:1080,height:1920,portrait:true},{frames:180}),/preserve/);
const old=structuredClone(track);delete old.render_mode;
assert.throws(()=>compileMessageTrack(project,old),/post-composite/);
console.log('PASS 703 reference-only cases, 16 recipes, provenance/duplicate separation, cross-camera/cut message planning, portrait copy preservation, legacy rejection');
