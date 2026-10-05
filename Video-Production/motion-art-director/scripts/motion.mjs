#!/usr/bin/env node
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
 case 'doctor':return doctor();
 case 'status':return status(project(),out());
 case 'resume':{const p=project(),s=status(p,out());if(!s.ok||!p.approval)return {...s,next:'plan / styleframe / user direction confirmation'};const r=await render(p,out(),{draft:!!flags.draft,portrait:!!flags.portrait});record(p,out(),'render',r);return r;}
 case 'catalog':if(flags.site)return catalogSite(out());return search(positional.join(' '),Number(flags.limit||25));
 case 'validate':return validate(project());
 case 'plan':return plan(project(),path.join(out(),'direction.html'));
 case 'approve':return approve(path.resolve(positional[0]),flags.by,flags.note,flags['expected-hash']);
 case 'audio':return audio(project(),out());
 case 'render':return render(project(),out(),{draft:!!flags.draft,portrait:!!flags.portrait,limitScenes:Number(flags['representative-scenes']||Infinity),stopAfterFrames:Number(flags['stop-after-frames']||Infinity)});
 case 'styleframe':return snapshot(project(),path.join(out(),'styleframe.'+(flags.type||'png')),{time:Number(flags.time||2),portrait:!!flags.portrait,type:flags.type||'png',width:flags.portrait?1080:1920,height:flags.portrait?1920:1080});
 case 'export':return exports(project(),out(),flags.routes?flags.routes.split(','):project().routes);
 case 'audit':return audit(project(),out(),{movie:flags.movie,portrait:!!flags.portrait});
 case 'revise':if(!flags.id||!flags.text||!flags.out)throw new Error('revise needs --id --text --out new-project.json');if(path.resolve(flags.out)===path.resolve(positional[0]))throw new Error('revision output must be a new file');return revise(path.resolve(positional[0]),flags.id,flags.text,path.resolve(flags.out));
 case 'effect':{const mode=ADAPTERS[flags.id];if(!mode)throw new Error('카드/기존 클립 상태: v3 실행 어댑터 없음');const p=project();p.scenes[0].mode=mode;p.approval=undefined;write(path.join(out(),'adapted.project.json'),p);return plan(p,path.join(out(),'direction.html'));}
 case 'serve':{const s=await serve(path.resolve(positional[0]||out()),Number(flags.port||0));console.log(JSON.stringify({url:s.url}));await new Promise(()=>{});return;}
 case 'package':return pack(path.join(out(),'motion-art-director'));
 default:return {usage:'node scripts/motion.mjs <doctor|status|resume|catalog|plan|validate|approve|styleframe|audio|render|export|audit|revise|effect|serve|package> [project.json] --out PATH',help:'references/cli.md'};
 }}
try{const r=await main();if(positional[0]&&['plan','styleframe','approve','render','export','audit'].includes(command))record(project(),out(),command,r);console.log(JSON.stringify(r,null,2));if(r?.ok===false)process.exitCode=1;}catch(e){console.error(JSON.stringify({error:e.message}));process.exitCode=1;}
