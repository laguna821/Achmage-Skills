/* Pure meaning state; animations and print never alter this model. */
(function(scope){
 'use strict';
 function create(counts){return {current:0,counts:counts.slice(),steps:counts.map(n=>n?1:0),views:counts.map(()=>'delegate')};}
 function reduce(state,action){
  const s={...state,steps:state.steps.slice(),views:state.views.slice()},i=s.current;
  switch(action.type){
   case 'next':if(s.steps[i]<s.counts[i])s.steps[i]++;else if(i<s.counts.length-1){s.current++;s.steps[s.current]=s.counts[s.current]?1:0;}break;
   case 'previous':if(s.steps[i]>1)s.steps[i]--;else if(i>0){s.current--;s.steps[s.current]=s.counts[s.current];}break;
   case 'goto':if(Number.isInteger(action.index)&&action.index>=0&&action.index<s.counts.length){s.current=action.index;s.steps[s.current]=s.counts[s.current];}break;
   case 'reset':s.steps[i]=s.counts[i]?1:0;s.views[i]='delegate';break;
   case 'view':if(['delegate','keep'].includes(action.view))s.views[i]=action.view;break;
   default:break;
  }
  return s;
 }
 const api={create,reduce};if(typeof module==='object'&&module.exports)module.exports=api;else scope.DeckModel=api;
})(typeof globalThis!=='undefined'?globalThis:this);
