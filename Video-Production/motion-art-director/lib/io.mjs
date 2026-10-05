import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {spawn} from 'node:child_process';
export const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
export function readProject(file){const p=read(file);Object.defineProperty(p,'__projectDir',{value:path.dirname(path.resolve(file)),enumerable:false});return p;}
export const hash=x=>crypto.createHash('sha256').update(typeof x==='string'||Buffer.isBuffer(x)?x:JSON.stringify(x)).digest('hex');
export const mkdir=p=>fs.mkdirSync(p,{recursive:true});
export function write(p,x){mkdir(path.dirname(p));const temp=p+'.'+process.pid+'.tmp';fs.writeFileSync(temp,typeof x==='string'||Buffer.isBuffer(x)?x:JSON.stringify(x,null,2)+'\n');fs.renameSync(temp,p);}
export function inside(root,p){const r=path.relative(path.resolve(root),path.resolve(p));return !r.startsWith('..')&&!path.isAbsolute(r);}
export const escape=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const serial=x=>JSON.stringify(x).replace(/</g,'\\u003c').replace(/>/g,'\\u003e');
export function run(exe,args,opts={}){return new Promise((resolve,reject)=>{const p=spawn(exe,args,{windowsHide:true,...opts});let out='',err='';p.stdout?.on('data',b=>{out=(out+b).slice(-120000);});p.stderr?.on('data',b=>{err=(err+b).slice(-120000);});p.on('error',reject);p.on('close',code=>code===0?resolve({out,err}):reject(new Error(exe+' exited '+code+'\n'+err)));});}
export const configPath=()=>process.env.MOTION_CONFIG||path.join(process.env.LOCALAPPDATA||path.join(os.homedir(),'.config'),'motion-art-director','config.json');
export function settings(){const local=path.join(ROOT,'local.config.json'),file=configPath();return {...(fs.existsSync(local)?read(local):{}),...(fs.existsSync(file)?read(file):{})};}
export const tool=name=>process.env['MOTION_'+name.toUpperCase()]||settings()[name]||name;
export async function playwright(){try{return await import('playwright');}catch(e){const p=settings().playwright;if(!p)throw new Error('npm install 후 npx playwright install chromium 실행 필요');return import(pathToFileURL(path.join(p,'index.mjs')).href);}}
