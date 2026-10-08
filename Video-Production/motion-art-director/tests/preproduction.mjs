import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';
import {sourceSearchPlan,sourceCandidateAudit} from '../lib/source-discovery.mjs';
import {messageTrackAudit,messageAt,compileMessageTrack,compiledMessageAudit} from '../lib/message-track.mjs';
import {loudnormMeasurement} from '../lib/concept-audition.mjs';
import {ROOT,hash} from '../lib/io.mjs';
let count=0;function test(name,fn){fn();count++;console.log('PASS '+name);}
const track={version:'message-track-v1',units:[{id:'thought',text:'화면이 빠르게 바뀌어도 문장은 이어집니다.',start:1,end:9,phrases:[{text:'화면이 빠르게 바뀌어도 문장은 이어집니다.',start:1,end:9}]}]};
const p={renderer:'vector-composite',output:{total_frames:300},content_units:[],scenes:Array.from({length:5},(_,i)=>({id:'s'+i,start:i*60,end:(i+1)*60,composition:{width:1920,height:1080,background:['#112233','#334455'][i%2],layers:[]}})),approval:{hash:'previous'}};
const compiled=compileMessageTrack(p,track);
test('five fast shots preserve one complete sentence',()=>{assert(messageTrackAudit(track,{duration:10,cuts:[2,4,6,8]}).ok);assert.equal(messageAt(track,3).text,messageAt(track,7).text);assert.equal(compiled.scenes.filter(s=>s.composition.layers.length).length,5);assert(!compiled.approval);assert(p.approval);assert(compiledMessageAudit(compiled).ok);});
for(const [name,change]of [['truncated sentence',q=>q.units[0].phrases[0].text='지금'],['early removal',q=>q.units[0].phrases[0].end=2],['NaN clock',q=>q.units[0].start=NaN],['unplanned gap',q=>q.units[0].phrases[0].start=3],['duplicate unit',q=>q.units.push(structuredClone(q.units[0]))]])test(name,()=>{const q=structuredClone(track);change(q);assert(!messageTrackAudit(q,{duration:10}).ok);});
test('edited/omitted compiled overlay rejected',()=>{for(const mutate of [q=>q.scenes[2].composition.layers[0].text='빛처럼',q=>q.scenes[2].composition.layers=[]]){const q=structuredClone(compiled);mutate(q);assert(!compiledMessageAudit(q).ok);}});
test('moving frame fails explicitly instead of moving held copy',()=>{const q=structuredClone(p);q.scenes[2].transition_in={kind:'wipe-x',duration:.5};assert.throws(()=>compileMessageTrack(q,track),/post-composite/);});
test('outgoing tail cannot leak into next transition',()=>{const q=structuredClone(p),t=structuredClone(track);t.units[0].end=8;t.units[0].phrases[0].end=8;q.scenes[4].transition_in={kind:'wipe-x',duration:.5};assert.throws(()=>compileMessageTrack(q,t),/post-composite/);});
test('existing timeline semantics are not changed',()=>{const q=structuredClone(p);q.timeline_semantics=undefined;assert.equal(compileMessageTrack(q,track).timeline_semantics,undefined);});
// Execute the real pure SVG renderer, in deliberately scrambled frame order.
test('actual renderer keeps identical glyphs and visibility across cut boundary',()=>{
 const sandbox={window:{PROJECT:compiled,PORTRAIT:false},document:{getElementById:()=>({})}};vm.createContext(sandbox);vm.runInContext(fs.readFileSync(path.join(ROOT,'assets/vector.js'),'utf8'),sandbox);
 const draw=f=>{const s=compiled.scenes.find(s=>f>=s.start&&f<s.end);return sandbox.window.__vectorScene(s,f,true);};
 const glyphs=s=>s.match(/<text[\s\S]*?<\/text>/g)?.join('');
 assert.equal(glyphs(draw(60)),glyphs(draw(59)));assert.equal(glyphs(draw(200)),glyphs(draw(60)));assert.equal(hash(draw(60)),hash(draw(60)));
 assert.match(draw(29),/opacity="0"/);assert.match(draw(30),/opacity="1"/);assert.match(draw(270),/opacity="0"/);
});
test('search plan does not pretend to have searched',()=>{const r=sourceSearchPlan({kind:'music',queries:['warm instrumental rhythm cooking']});assert(r.providers.some(p=>p.id==='mewpot'));assert(r.providers.some(p=>p.id==='youtube-library'));assert.equal(r.status,'queries-only');assert(r.providers.every(p=>p.state==='not-searched'));});
const c={id:'licensed',title:'Fixture',provider:'mixkit',source_url:'https://mixkit.co/',license_url:'https://mixkit.co/license/',content_id:'unknown',availability:'downloaded',rights:{cost:0,status:'verified',evidence:'fixture official terms',checked_at:'2026-10-08',allowed_uses:['web-video']}};
test('verified web-use baseline can proceed',()=>assert(sourceCandidateAudit(c).public_ready));
for(const [name,change]of [['paid trial',q=>q.availability='trial'],['wrong destination',q=>q.rights.allowed_uses=['youtube']],['no evidence',q=>delete q.rights.evidence],['attribution omitted',q=>q.rights.attribution_required=true],['registered without receipt',q=>q.content_id='registered']])test(name,()=>{const q=structuredClone(c);change(q);assert(!sourceCandidateAudit(q).public_ready);});
test('loudnorm trailing console output accepted',()=>assert.equal(loudnormMeasurement('log\n{\n"input_i": "-18.0", "input_tp":"-2.0"\n}\nframe=225 time=45.00').input_i,'-18.0'));
console.log(JSON.stringify({passed:count,scope:'Contracts and real SVG state; no listening or aesthetic claim'}));
