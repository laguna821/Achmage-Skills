// Provider discovery is a search plan, never a claim that assets were downloaded.
export const PROVIDERS = [
 {id:'pixabay',name:'Pixabay',kinds:['music','video','sfx'],home:'https://pixabay.com/',license:'https://pixabay.com/service/license-summary/',access:'official-site; API capabilities must be checked per media type',note:'Track-specific Content ID; no standalone redistribution.'},
 {id:'mewpot',name:'뮤팟',kinds:['music','sfx'],home:'https://www.mewpot.com/',license:'https://chat.mewpot.com/hc/help-center/ko_KR/categories/membership',access:'official-site / account',note:'Free tier depends on channel, purpose and operator; website/client work not assumed free.'},
 {id:'youtube-library',name:'YouTube 오디오 보관함',kinds:['music','sfx'],home:'https://www.youtube.com/audiolibrary',license:'https://support.google.com/youtube/answer/3376882',access:'authenticated Studio UI / local authorized download',note:'Inspect exact track license and attribution; off-platform use requires applicable terms.'},
 {id:'mixkit',name:'Mixkit',kinds:['music','video','sfx'],home:'https://mixkit.co/',license:'https://mixkit.co/license/',access:'official-site',note:'Separate media licenses; video Free vs Restricted. Music excludes games and broadcast.'},
 {id:'pexels',name:'Pexels',kinds:['video'],home:'https://www.pexels.com/',license:'https://www.pexels.com/license/',access:'official-site / existing authorized API',note:'Record item provenance, identifiable people/brands and intended context.'},
 {id:'coverr',name:'Coverr',kinds:['video'],home:'https://coverr.co/',license:'https://coverr.co/license',access:'official-site',note:'Confirm current item and free-download conditions; linked paid catalog is separate.'},
 {id:'incompetech',name:'Incompetech',kinds:['music'],home:'https://incompetech.com/music/royalty-free/',license:'https://incompetech.com/music/royalty-free/licenses/',access:'official-site',note:'Track-specific attribution/license; retain as one candidate source, not default winner.'}
];
export function sourceSearchPlan(brief){
 if(!brief || !['music','video','sfx'].includes(brief.kind)||!Array.isArray(brief.queries)||!brief.queries.length||!brief.queries.every(x=>typeof x==='string'&&x.trim()))throw Error('kind and nonempty queries required');
 const providers=PROVIDERS.filter(p=>p.kinds.includes(brief.kind));
 return {version:'source-search-v1',kind:brief.kind,purpose:brief.purpose||'',status:'queries-only',providers:providers.map(p=>({...p,queries:brief.queries.map(q=>'site:'+new URL(p.home).hostname+' '+q),state:'not-searched'})),budget:{providers:providers.length,candidates_per_provider:3,shortlist:3},instructions:'Search at least two suitable providers; record unavailable/rejected candidates. Use permitted UI/downloads. No challenge bypass or subscription activation. Provider count is not quality.'};
}
export function sourceCandidateAudit(c,{use='web-video'}={}){
 const errors=[],pending=[];
 if(!c||typeof c!=='object')return {ok:false,errors:['candidate required'],pending};
 const text=x=>typeof x==='string'&&x.trim();
 if(!text(c.id)||!PROVIDERS.some(p=>p.id===c.provider)||!text(c.title))errors.push('candidate identity/provider/title');
 for(const k of ['source_url','license_url'])try{if(!['http:','https:'].includes(new URL(c[k]).protocol))throw 0;}catch{errors.push(k+' must be an official HTTP URL');}
 const r=c.rights||{};
 if(r.cost!==0)pending.push('zero-cost use not confirmed');
 if(r.status!=='verified'||!text(r.evidence)||!text(r.checked_at))pending.push('asset-specific license evidence pending');
 if(!Array.isArray(r.allowed_uses)||!r.allowed_uses.includes(use))pending.push('intended destination not cleared: '+use);
 if(r.attribution_required&&!text(r.attribution))pending.push('attribution text missing');
 if(!['none-declared','registered','unknown'].includes(c.content_id))pending.push('Content ID status unknown');
 if(c.content_id==='registered'&&!text(r.claim_evidence))pending.push('registered Content ID: keep certificate/receipt');
 if(['trial','paid','blocked'].includes(c.availability))pending.push('candidate unavailable without changed conditions');
 return {ok:errors.length===0,public_ready:errors.length===0&&pending.length===0,errors,pending,scope:'Recorded evidence completeness, not independent legal certification or listening.'};
}
