import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';
import {extensionRegistry,extensionTechnique,drawExtension} from '../lib/extensions.mjs';import {fixture,extensionInputs} from './extensions-fixtures.mjs';
import {validate} from '../lib/contract.mjs';import {sceneKey,html} from '../lib/scene.mjs';import {search,catalogSite} from '../lib/catalog.mjs';import {frameReviewer,contrastReview} from '../lib/output-review.mjs';import {browser,pageFor} from '../lib/browser.mjs';import {write,hash} from '../lib/io.mjs';
const out=process.env.MOTION_TEST_OUTPUT||fs.mkdtempSync(path.join(os.tmpdir(),'motion-ext-')),b=await browser();let checks=0;
try{for(const [id,spec]of Object.entries(extensionRegistry)){
 const p=fixture(spec.type);assert(validate(p).ok,JSON.stringify(validate(p).errors));
 const ext=p.scenes[0].composition.layers[0].extension,a=drawExtension(ext,1.3);drawExtension(ext,.2);assert.equal(a,drawExtension(ext,1.3));assert(!/NaN|undefined/.test(a));
 const key=sceneKey(p,p.scenes[0],{},false),q=structuredClone(p);q.scenes[0].composition.layers[0].extension.seed++;assert.notEqual(key,sceneKey(q,q.scenes[0],{},false));q.profile.rasterizer='skia';assert(!validate(q).ok);delete q.extensions;q.profile.rasterizer='chromium';assert(!validate(q).ok);
 const file=path.join(out,spec.type+'.html');write(file,html(p,{controls:false}));const {page,context,errors}=await pageFor(b,file,480,270);
 await page.evaluate(()=>window.__seek(1.3));const first=await page.locator('#stage').screenshot();await page.evaluate(()=>{window.__seek(.2);window.__static(1.3);});const again=await page.locator('#stage').screenshot();assert.equal(hash(first),hash(again),id+' reordered pixels');await page.evaluate(()=>window.__progress(1.3/2));assert.equal(hash(first),hash(await page.locator('#stage').screenshot()),id+' scroll pixels');assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,spec.type+'.png'),first);await context.close();checks++;console.log('PASS '+id);
 }
 assert.equal(search('',10000,{provider:'awesome-ai-motion'}).length,637);assert.equal(search('',10000,{provider:'showreel'}).length,16);assert.equal(search('',10000,{provider:'showreel',status:'automated'}).length,16);assert.equal(search('',10000,{provider:'showreel',status:'aesthetic'}).length,0);
 assert.throws(()=>extensionTechnique({id:'showreel:odometer',instance:'bad',inputs:{from:0,to:Infinity}}));assert.throws(()=>extensionTechnique({id:'showreel:data-continuity',instance:'bad',inputs:{...extensionInputs['data-continuity'],items:[{id:'same',label:'a',value:1},{id:'same',label:'b',value:2}]}}));assert.throws(()=>extensionTechnique({id:'showreel:tilt-shift',instance:'bad',inputs:{svg:'<script>alert(1)</script>'}}));
 for(const items of [{},[null]])assert.throws(()=>extensionTechnique({id:'showreel:data-continuity',instance:'bad',inputs:{items}}));
 assert.throws(()=>extensionTechnique({id:'showreel:isometric',instance:'bad',inputs:{boxes:[null]}}));
 assert.throws(()=>extensionTechnique({id:'showreel:isometric',instance:'bad',inputs:extensionInputs.isometric,parameters:{angle:180}}));
 const r=frameReviewer();for(let n=0;n<90;n++)r.push(Buffer.alloc(64,n%4<2?0:255));assert.equal(r.finish().status,'fix-required');
 const still=frameReviewer({intentionalHolds:[{start:0,end:4}]});for(let n=0;n<90;n++)still.push(Buffer.alloc(64,120));assert.equal(still.finish().status,'pass');
 assert.equal(contrastReview({scenes:[{id:'s',composition:{background:'#ffffff',layers:[{id:'t',kind:'text',color:'#ffffff'}]}}]})[0].status,'review');
 const site=catalogSite(path.join(out,'catalog'));const {page,context}=await pageForCatalog(site);await page.selectOption('#provider','showreel');assert.equal(await page.locator('article').count(),16);await context.close();
 write(path.join(out,'results.json'),{checks,mechanical:'passed',aesthetic:'pending',listening:'not-applicable',out});console.log(JSON.stringify({passed:checks,out}));
}finally{await b.close();}
async function pageForCatalog(file){const context=await b.newContext(),page=await context.newPage();await page.setContent(fs.readFileSync(file,'utf8'));return {page,context};}
