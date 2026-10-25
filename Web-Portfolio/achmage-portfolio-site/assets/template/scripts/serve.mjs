import http from "node:http";import fs from "node:fs";import path from "node:path";
const index=process.argv.indexOf("--port"),port=index>=0?Number(process.argv[index+1]):4173;
const root=path.resolve("dist"),types={".html":"text/html; charset=utf-8",".md":"text/plain; charset=utf-8",".json":"application/json",".js":"text/javascript",".css":"text/css",".svg":"image/svg+xml",".png":"image/png",".webp":"image/webp",".woff2":"font/woff2"};
if(!fs.existsSync(path.join(root,"index.html")))throw new Error("Build the site first.");
const server=http.createServer((req,res)=>{try{const url=new URL(req.url,"http://localhost"),decoded=decodeURIComponent(url.pathname),file=path.resolve(root,"."+decoded);
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 let target=file;if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,"index.html");
 if(!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404,{"Content-Type":"text/plain"}).end("Not found");return;}
 const headers={"Content-Type":types[path.extname(target)]||"application/octet-stream","X-Content-Type-Options":"nosniff"};
 if(url.searchParams.has("download"))headers["Content-Disposition"]='attachment; filename="'+path.basename(target)+'"';
 res.writeHead(200,headers);fs.createReadStream(target).pipe(res);
 }catch{res.writeHead(400).end("Bad request");}});
server.listen(port,"127.0.0.1",()=>console.log("Preview: http://127.0.0.1:"+port));
process.on("SIGTERM",()=>server.close());process.on("SIGINT",()=>server.close());
