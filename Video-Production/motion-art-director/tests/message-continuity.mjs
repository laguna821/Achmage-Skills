import assert from 'node:assert/strict';import {messageContinuityReview} from '../lib/output-review.mjs';
const text='물건 하나가 아니라, 기다린 하루가 도착한다.';
const scene=(start,end)=>({id:String(start),start,end,composition:{layers:[{id:'message',kind:'text',text}]}});
assert.equal(messageContinuityReview({scenes:[scene(0,30)]}).needsReview,true);
const r=messageContinuityReview({scenes:[scene(0,60),scene(60,120),scene(120,180)]});assert.equal(r.windows.length,1);assert.equal(r.needsReview,false);
const hidden=scene(0,180);hidden.composition.layers[0].keyframes=[{at:1,opacity:0}];assert.equal(messageContinuityReview({scenes:[hidden]}).windows[0].status,'not-measured');
console.log('PASS cross-cut reading window, short counterexample, uncertain animated visibility');
