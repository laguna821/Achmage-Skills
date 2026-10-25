import fs from "node:fs";
import path from "node:path";
import {build} from "esbuild";
import {pathToFileURL} from "node:url";
import {renderToString} from "react-dom/server";
import React from "react";
import {validate} from "./validate.mjs";
import {syncTokens} from "./tokens.mjs";
const root=process.cwd(),out=path.join(root,"dist");
const content=JSON.parse(fs.readFileSync(path.join(root,"content/portfolio.json"),"utf8"));
const errors=validate(content);if(errors.length)throw new Error(errors.join("\n"));
syncTokens(root);
// dist is disposable generated output. Resolve and check the exact boundary before replacing it.
if(path.resolve(out)!==path.join(path.resolve(root),"dist")||path.dirname(path.resolve(out))!==path.resolve(root))throw new Error("Invalid build output boundary");
if(fs.existsSync(out)&&fs.lstatSync(out).isSymbolicLink())throw new Error("Build output must not be a symlink");
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
fs.cpSync(path.join(root,"public"),out,{recursive:true});
fs.copyFileSync(path.join(root,"src/styles.css"),path.join(out,"styles.css"));
fs.copyFileSync(path.join(root,"src/tokens.css"),path.join(out,"tokens.css"));
await build({entryPoints:["src/client.tsx"],bundle:true,format:"esm",outfile:"dist/client.js",minify:true,jsx:"automatic",define:{"process.env.NODE_ENV":'"production"'}});
await build({entryPoints:["src/Portfolio.tsx","src/model.ts"],bundle:true,platform:"node",format:"esm",outdir:".build",packages:"external",jsx:"automatic"});
const {default:App}=await import(pathToFileURL(path.join(root,".build/Portfolio.js")).href);
const {routes,fullMarkdown}=await import(pathToFileURL(path.join(root,".build/model.js")).href);
const escape=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
for(const lang of ["ko","en"]){
 for(const route of routes(content)){
  const props={content,lang,route},body=renderToString(React.createElement(App,props));
  const title=content.title[lang],data=JSON.stringify(props).replace(/</g,"\\u003c").replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029");
  const html='<!doctype html><html lang="'+lang+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escape(title)+'</title><meta name="description" content="'+escape(content.intro[lang])+'"><link rel="icon" href="/brand/favicon.svg"><link rel="preload" href="/fonts/AchmageSameTone-1.000.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/tokens.css"><link rel="stylesheet" href="/styles.css"><script>try{document.documentElement.dataset.theme=localStorage.getItem("achmage-portfolio-theme")||"light"}catch{}</script></head><body><div id="app">'+body+'</div><script id="portfolio-data" type="application/json">'+data+'</script><script type="module" src="/client.js"></script></body></html>';
  const dir=path.join(out,lang,route);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,"index.html"),html);
 }
 fs.writeFileSync(path.join(out,lang,"all.md"),fullMarkdown(content,lang));
}
fs.mkdirSync(path.join(out,"originals"),{recursive:true});
for(const o of content.originals)fs.writeFileSync(path.join(out,"originals",o.id+".md"),o.text);
fs.writeFileSync(path.join(out,"portfolio.json"),JSON.stringify(content,null,2)+"\n");
fs.copyFileSync(path.join(out,"ko/index.html"),path.join(out,"index.html"));
console.log(JSON.stringify({pages:routes(content).length*2,chapters:content.chapters.length,entries:content.entries.length,originals:content.originals.length,sample:content.sample}));
