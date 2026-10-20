import assert from 'node:assert/strict';
import {sourceSearchEvidenceAudit} from '../lib/source-discovery.mjs';
const r={version:'source-search-evidence-v1',kind:'music',searches:[
 {provider:'mixkit',query:'fashion',checked_at:'2026-10-20',status:'searched',results:[{title:'Fashion listing',url:'https://mixkit.co/free-stock-music/tag/fashion/',disposition:'candidate',reason:'compare actual excerpts'}]},
 {provider:'pixabay',query:'funk',checked_at:'2026-10-20',status:'searched',results:[{title:'Track',url:'https://pixabay.com/music/test/',disposition:'candidate',reason:'pending individual rights'}]},
 {provider:'incompetech',query:'funk',checked_at:'2026-10-20',status:'unavailable',reason:'fetch timeout'}
]};
assert(sourceSearchEvidenceAudit(r).complete);
const noResults=structuredClone(r);noResults.searches[0].results=[];assert(!sourceSearchEvidenceAudit(noResults).ok);
const wrongHost=structuredClone(r);wrongHost.searches[0].results[0].url='https://mixkit.co.attacker.invalid/a';assert(!sourceSearchEvidenceAudit(wrongHost).ok);
const inventedListening=structuredClone(r);inventedListening.searches[0].results[0].listening='passed';assert(!sourceSearchEvidenceAudit(inventedListening).ok);
assert(!sourceSearchEvidenceAudit({...r,searches:r.searches.slice(0,2)}).complete);
for(const mutate of [
 q=>q.searches.push(null),
 q=>q.searches[0].results.push(null),
 q=>q.searches[0].checked_at='not-a-date',
 q=>q.searches[0].query=' ',
 q=>q.searches[0].results[0].disposition='invented-success'
]){const q=structuredClone(r);mutate(q);assert(!sourceSearchEvidenceAudit(q).ok);}
assert(sourceSearchEvidenceAudit({version:r.version,kind:'video',searches:[
 {provider:'videezy',query:'tailoring',checked_at:'2026-10-20',status:'searched',results:[{title:'Mannequin',url:'https://www.videezy.com/abstract/36513-asian-fashion-designer-working-on-a-mannequin-at-the-studio',disposition:'candidate',reason:'inspect actual movement and item license'}]},
 {provider:'pexels',query:'tailoring',checked_at:'2026-10-20',status:'unavailable',reason:'browser blocked provider'}
]}).complete);
console.log('PASS observed-source coverage, fake result domains, invented listening and missing results');
