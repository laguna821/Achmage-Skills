#!/usr/bin/env node
import {analyzeRhythm} from '../lib/rhythm-analyze.mjs';
import {pacingInventory} from '../lib/pacing.mjs';
import {compileRhythm,rhythmCheck,rhythmReviewFrames} from '../lib/rhythm-score.mjs';
import {compileSyncScore,syncScoreCheck,syncReviewFrames} from '../lib/sync-score.mjs';
import {inspectMedia,importMedia,selectRange} from '../lib/media.mjs';
import {soundbed} from '../lib/soundbed.mjs';
import {editorialInventory} from '../lib/editorial.mjs';
import {extractReviewFrames} from '../lib/review-evidence.mjs';
import {TECHNIQUES,technique,techniqueCoverage} from '../lib/techniques.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {ROOT,read,readProject,write,run,tool,settings,hash,mkdir,inside} from '../lib/io.mjs';
import {plan} from '../lib/plan.mjs';
import {search,catalogSite,ADAPTERS} from '../lib/catalog.mjs';
import {validate,approve,revise,approvalHash} from '../lib/contract.mjs';
import {audio} from '../lib/audio.mjs';
import {render,snapshot} from '../lib/render.mjs';
import {exports} from '../lib/routes.mjs';
import {audit} from '../lib/audit.mjs';
import {browser,serve} from '../lib/browser.mjs';
import {pack} from './pack.mjs';
import {status,record} from '../lib/workflow.mjs';
const [command,...args]=process.argv.slice(2),flags={};const positional=[];
for(let i=0;i<args.length;i++){if(args[i].startsWith('--')){const k=args[i].slice(2);flags[k]=args[i+1]&&!args[i+1].startsWith('--')?args[++i]:true;}else positional.push(args[i]);}
const project=()=>readProject(path.resolve(positional[0])),out=()=>path.resolve(flags.out||'motion-output');
async function doctor(){const checks={node:process.version,baseline:{gpu:false,jobs:1,draft:'1280x720',final:'1920x1080@30',Blender:false},host:process.platform,ffmpeg:null,ffprobe:null,browser:null,presentation:!!settings().presentation};
 for(const n of ['ffmpeg','ffprobe']){try{checks[n]=(await run(tool(n),['-version'])).out.split('\n')[0];}catch(e){checks[n]={error:e.message};}}
 try{const b=await browser();checks.browser=b.version();await b.close();}catch(e){checks.browser={error:e.message};}
 const cfg=settings();checks.skia={optional:true,available:false};try{const s=await run(cfg.python||'python',['-c','import skia; print(skia.__version__)'],{env:{...process.env,...(cfg.skiaPath?{PYTHONPATH:cfg.skiaPath}:{})}});checks.skia={optional:true,available:true,version:s.out.trim(),gpu:false};}catch(e){checks.skia.reason='Optional Python Skia environment not configured';}
 checks.ok=typeof checks.ffmpeg==='string'&&typeof checks.ffprobe==='string'&&typeof checks.browser==='string';return checks;}
async function main(){
 switch(command){
 case 'pacing-review':{const r=pacingInventory(project(),{windowSeconds:Number(flags['window-seconds']||15)});write(path.join(out(),'pacing-review.json'),r);return r;}
 case 'rhythm-analyze':return analyzeRhythm(project(),out());
 case 'rhythm-compile':{const input=path.resolve(positional[0]),target=path.resolve(flags.out||'rhythm.project.json');if(input===target||fs.existsSync(target)||path.dirname(input)!==path.dirname(target))throw Error('Use a new compiled file beside source');const p=compileRhythm(project()),v=validate(p);if(!v.ok)throw Error(v.errors.join('\n'));write(target,p);return {ok:true,file:target,report:rhythmCheck(p)};}
 case 'rhythm-audit':{const p=project(),r=rhythmCheck(p);if(flags.movie)r.evidence=await extractReviewFrames(p,flags.movie,path.join(out(),'frames'),{frames:rhythmReviewFrames(p)});write(path.join(out(),'rhythm-audit.json'),r);return r;}
 case 'doctor':return doctor();
 case 'soundbed':return soundbed(read(positional[0]),path.join(out(),flags.name||'ambience.wav'));
 case 'assets':{const [action,file]=positional;if(action==='inspect')return inspectMedia(file);if(action==='import')return importMedia(file,out(),{id:flags.id,source:read(flags.receipt)});if(action==='select')return selectRange(file,out(),{start:Number(flags.start),duration:Number(flags.duration)});throw Error('assets inspect|import|select FILE');}
 case 'sync-compile':{const input=path.resolve(positional[0]),target=path.resolve(flags.out||'compiled.project.json');if(input===target)throw Error('Preserve source: choose a new output file');if(path.dirname(input)!==path.dirname(target))throw Error('Keep compiled project beside source to preserve relative asset paths');if(fs.existsSync(target))throw Error('Preserve prior compiled project');const p=compileSyncScore(project()),v=validate(p);if(!v.ok)throw Error(v.errors.join('\n'));write(target,p);return {ok:true,file:target,report:syncScoreCheck(p)};}
 case 'sync-audit':{const p=project(),r=syncScoreCheck(p);if(flags.movie)r.evidence=await extractReviewFrames(p,flags.movie,path.join(out(),'frames'),{frames:syncReviewFrames(p)});write(path.join(out(),'sync-audit.json'),r);return r;}
 case 'roughcut':return render(project(),out(),{draft:true,portrait:!!flags.portrait});
 case 'status':return status(project(),out());
 case 'resume':{const p=project(),s=status(p,out());if(!s.ok||!p.approval)return {...s,next:'plan / styleframe / user direction confirmation'};const r=await render(p,out(),{draft:!!flags.draft,portrait:!!flags.portrait});record(p,out(),'render',r);return r;}
 case 'catalog':if(flags.site)return catalogSite(out());return search(positional.join(' '),Number(flags.limit||25),Object.fromEntries(['media','engine','family','status'].filter(k=>flags[k]).map(k=>[k,flags[k]])));
 case 'techniques':return positional[0]?techniqueCoverage(project()):TECHNIQUES;
 case 'validate':return validate(project());
 case 'direction-review':{const p=project(),r=editorialInventory(p);if(flags.movie)r.evidence=await extractReviewFrames(p,flags.movie,path.join(out(),'frames'));write(path.join(out(),'editorial-review.json'),r);return {...r,ok:r.contract.ok};}
 case 'plan':return plan(project(),path.join(out(),'direction.html'));
 case 'approve':return approve(path.resolve(positional[0]),flags.by,flags.note,flags['expected-hash']);
 case 'audio':return audio(project(),out());
 case 'render':return render(project(),out(),{draft:!!flags.draft,portrait:!!flags.portrait,limitScenes:Number(flags['representative-scenes']||Infinity),stopAfterFrames:Number(flags['stop-after-frames']||Infinity)});
 case 'styleframe':return snapshot(project(),path.join(out(),'styleframe.'+(flags.type||'png')),{time:Number(flags.time||2),portrait:!!flags.portrait,type:flags.type||'png',width:flags.portrait?1080:1920,height:flags.portrait?1920:1080});
 case 'export':return exports(project(),out(),flags.routes?flags.routes.split(','):project().routes);
 case 'audit':return audit(project(),out(),{movie:flags.movie,portrait:!!flags.portrait});
 case 'revise':if(!flags.id||!flags.text||!flags.out)throw new Error('revise needs --id --text --out new-project.json');if(path.resolve(flags.out)===path.resolve(positional[0]))throw new Error('revision output must be a new file');return revise(path.resolve(positional[0]),flags.id,flags.text,path.resolve(flags.out));
 case 'effect':{const p=project();if(TECHNIQUES[flags.id]){if(!flags.spec||!flags.scene)throw Error('Reusable adapter requires --spec adapter-input.json --scene scene-id');const input=read(flags.spec),s=p.scenes.find(s=>s.id===flags.scene);if(!s?.composition)throw Error('Target scene composition required');const result=technique({...input,id:flags.id});s.composition.layers.push(...result.layers);if(result.transition)s.transition_in=result.transition;(p.techniques??=[]).push({...result.receipt,scene_id:s.id});}else{const mode=ADAPTERS[flags.id];if(!mode)throw new Error('카드/기존 클립 상태: 실행 어댑터 없음');p.scenes[0].mode=mode;}p.approval=undefined;const v=validate(p);if(!v.ok)throw Error(v.errors.join('\n'));write(path.join(out(),'adapted.project.json'),p);return plan(p,path.join(out(),'direction.html'));}
 case 'serve':{const s=await serve(path.resolve(positional[0]||out()),Number(flags.port||0));console.log(JSON.stringify({url:s.url}));await new Promise(()=>{});return;}
 case 'package':return pack(path.join(out(),'motion-art-director'));
 default:return {usage:'node scripts/motion.mjs <doctor|status|resume|catalog|techniques|assets|plan|direction-review|pacing-review|rhythm-analyze|rhythm-compile|rhythm-audit|sync-compile|sync-audit|validate|approve|styleframe|roughcut|soundbed|audio|render|export|audit|revise|effect|serve|package> [project.json] --out PATH',help:'references/cli.md'};
 }}
try{const r=await main();if(positional[0]&&['plan','styleframe','approve','render','roughcut','export','audit'].includes(command))record(project(),out(),command,r);console.log(JSON.stringify(r,null,2));if(r?.ok===false)process.exitCode=1;}catch(e){console.error(JSON.stringify({error:e.message}));process.exitCode=1;}
