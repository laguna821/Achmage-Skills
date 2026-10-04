// Optional standalone backend. Do not run where the host requires CUA or another API.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {chromium,webkit} from 'playwright';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
const take=name=>{const i=args.indexOf(name);if(i<0)return null;const v=args[i+1];if(!v||v.startsWith('--'))throw Error('Value required for '+name);args.splice(i,2);return v;};
const output=take('--output'),languageArg=take('--languages')||'ko',browserName=take('--browser')||'chromium';
if(!output||args.length!==2||!['chromium','webkit'].includes(browserName))throw Error('Usage: node capture.mjs light.html dark.html --output observations.json [--languages ko,en] [--browser chromium|webkit]');
const files=args.map(f=>path.resolve(f)),out=path.resolve(output),langs=languageArg.split(',');
if(!out.endsWith('.json'))throw Error('Observation output must end in .json');
if(!langs.length||langs.some(x=>!['ko','en'].includes(x))||new Set(langs).size!==langs.length)throw Error('Use distinct supported languages: ko,en');
if(files.includes(out))throw Error('Evidence cannot overwrite an input');
if(new Set(files.map(f=>path.basename(f))).size!==2)throw Error('Input filenames must be distinct');
if(out.startsWith(root+path.sep))throw Error('Keep evidence outside package');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const html=Object.fromEntries(await Promise.all(files.map(async f=>[path.basename(f),hash(await fs.readFile(f))])));
const engine=JSON.parse(await fs.readFile(path.join(root,'engine.lock.json'),'utf8'));
const measure=await fs.readFile(path.join(root,'engine/adapters/measure_mobile_layout.js'),'utf8');
const rows=[],screens=[],errors=[];
const browser=await ({chromium,webkit}[browserName]).launch();
try{
 const page=await browser.newPage();
 page.on('pageerror',e=>errors.push(String(e)));
 await page.route('**/*',route=>{const scheme=new URL(route.request().url()).protocol;return ['file:','data:','blob:'].includes(scheme)?route.continue():route.abort();});
 const cases=['read','present'].flatMap(mode=>[[375,812],[768,1024],[812,375],[1440,1000]].map(viewport=>({mode,viewport}))).concat([[375,675],[390,664],[375,812],[768,1024]].map(viewport=>({mode:'fit',viewport})));
 for(const file of files)for(const lang of langs)for(const {mode,viewport:[width,height]} of cases){
  await page.setViewportSize({width,height});
  const url=pathToFileURL(file);url.search=new URLSearchParams({mode,lang}).toString();
  await page.goto(url.href);
  await page.waitForFunction(()=>document.body.dataset.ready==='true'&&document.fonts.status==='loaded');
  const ids=await page.locator('.slide').evaluateAll(es=>es.map(e=>e.id));
  for(const id of ids){
   url.hash=id;await page.goto(url.href);
   await page.waitForFunction(({mode,id})=>document.body.dataset.mode===mode&&document.querySelector('.slide.active')?.id===id,{mode,id});
   await page.evaluate(()=>document.fonts.ready);
   // Wait for three identical animation-frame measurements, never assume a fixed sleep fits all machines.
   await page.evaluate(()=>new Promise((resolve,reject)=>{let last='',same=0,frames=0;const deadline=performance.now()+10000;const timer=setTimeout(()=>reject(Error('Layout did not settle within 10 seconds')),10000);const tick=()=>{const e=document.querySelector('.slide.active')||document.querySelector('.slide');if(!e){clearTimeout(timer);reject(Error('Missing slide'));return;}const b=e.getBoundingClientRect();const now=[b.x,b.y,b.width,b.height,e.dataset.fitScale].join(',');same=now===last?same+1:0;last=now;if(same>=3){clearTimeout(timer);resolve();}else if(++frames>600||performance.now()>deadline){clearTimeout(timer);reject(Error('Layout did not settle'));}else requestAnimationFrame(tick);};requestAnimationFrame(tick);}));
   rows.push(await page.evaluate('('+measure+')()'));
   const name=[path.parse(file).name,lang,mode,width,height,id].join('-')+'.png';
   const dest=path.join(path.dirname(out),'screenshots',name);await fs.mkdir(path.dirname(dest),{recursive:true});
   await page.screenshot({path:dest,fullPage:false});screens.push({file:name,slideId:id,coverage:mode==='read'?'viewport-only; long slides require additional internal-scroll inspection':'whole-slide viewport'});
  }
 }
}finally{await browser.close();}
for(const file of files)if(hash(await fs.readFile(file))!==html[path.basename(file)])throw Error('Input changed during capture');
await fs.mkdir(path.dirname(out),{recursive:true});
const observationBytes=JSON.stringify(rows,null,2);
await fs.writeFile(out,observationBytes);
await fs.writeFile(out.replace(/\.json$/,'')+'.sources.json',JSON.stringify({engineSha256:engine.packageSha256,observationsSha256:hash(observationBytes),html,browser:browserName,screenshots:screens,errors,physicalDevice:false},null,2));
if(errors.length)throw Error('Browser console errors: '+errors.join('; '));
console.log(JSON.stringify({status:'captured-not-visually-reviewed',rows:rows.length,browser:browserName,physicalDevice:false}));
