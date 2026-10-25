import fs from "node:fs";import path from "node:path";import assert from "node:assert/strict";import {createHash} from "node:crypto";
import {transformSync} from "esbuild";import {validate} from "./validate.mjs";import {syncTokens,tokenCss,designTokens} from "./tokens.mjs";
const root=process.cwd(),p=JSON.parse(fs.readFileSync("content/portfolio.json","utf8"));let count=0;
function check(name,fn){fn();count++;console.log("PASS "+name);}
check("bilingual content and all internal references",()=>assert.deepEqual(validate(p),[]));
check("missing translation is rejected",()=>{const c=structuredClone(p);delete c.chapters[0].sections[0].body.en;assert.ok(validate(c).some(e=>e.includes("body.en")));});
check("unavailable navigation is rejected",()=>{const c=structuredClone(p);c.readingPaths[0].path="/unavailable";assert.ok(validate(c).some(e=>e.includes("unavailable route")));});
check("unsafe image URL is rejected",()=>{const c=structuredClone(p);c.chapters[0].sections[0].figure={kind:"illustration",src:"javascript:alert(1)",width:10,height:10,title:p.title,alt:p.title,caption:p.title,source:p.title};assert.ok(validate(c).some(e=>e.includes("figure.src")));});
check("duplicate anchor is rejected",()=>{const c=structuredClone(p);c.chapters[0].sections.push(c.chapters[0].sections[0]);assert.ok(validate(c).some(e=>e.includes("duplicate ID")));});
check("missing source is rejected",()=>{const c=structuredClone(p);c.chapters[0].sourceIds.push("not-a-source");assert.ok(validate(c).some(e=>e.includes("unknown source")));});
check("brand font matches original asset",()=>assert.equal(createHash("sha256").update(fs.readFileSync("public/fonts/AchmageSameTone-1.000.woff2")).digest("hex"),"5ddc1264367dc547619dbae3f16df530cb74209f8d43808e86268d8cf9406d16"));
check("brand palette and font remain explicit",()=>{const d=designTokens(root);assert.equal(d.colors.primary,"#002e6e");assert.equal(d.colors.secondary,"#0066b3");assert.equal(d.colors.accent,"#00b5ad");for(const t of Object.values(d.typography))assert.equal(t.fontFamily,"Achmage SameTone");});
syncTokens(root);check("generated tokens exactly match DESIGN.md",()=>assert.equal(fs.readFileSync("src/tokens.css","utf8"),tokenCss(root)));
const transformed=transformSync(fs.readFileSync("src/model.ts","utf8"),{loader:"ts",format:"esm"}).code;
const {fullMarkdown,routes}=await import("data:text/javascript;base64,"+Buffer.from(transformed).toString("base64"));
check("optional empty modules disappear",()=>{const c=structuredClone(p);c.entries=[];c.history=[];c.originals=[];c.sources=[];assert.ok(!routes(c).includes("/catalog"));assert.ok(!routes(c).includes("/sources"));});
for(const lang of ["ko","en"])check(lang+" complete Markdown preserves source content",()=>{const md=fullMarkdown(p,lang);for(const c of p.chapters)for(const s of c.sections){assert.ok(md.includes(s.body[lang]));if(s.code)assert.ok(md.includes(s.code));}for(const o of p.originals)assert.ok(md.includes(o.text));assert.ok(md.includes("END OF PORTFOLIO | "+p.revision));});
for(const c of p.chapters)for(const s of c.sections)if(s.figure){const urls=typeof s.figure.src==="string"?[s.figure.src]:Object.values(s.figure.src);for(const url of urls)if(url.startsWith("/"))check("local figure exists: "+url,()=>{const f=path.resolve("public","."+url);assert.ok(f.startsWith(path.resolve("public")+path.sep));assert.ok(fs.existsSync(f));});}
console.log(JSON.stringify({passed:count,sample:p.sample}));
