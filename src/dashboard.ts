#!/usr/bin/env node
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { data } from "./data/loader.js";
import { chartTypes, dashboardCatalog, runDashboardQuery } from "./dashboard/query.js";
import { runGoogleDashboardQuery } from "./dashboard/google.js";

const port=Number(process.env.DASHBOARD_PORT??4173),host=process.env.DASHBOARD_HOST??"127.0.0.1",root=join(process.cwd(),"dashboard");
const headers={"Content-Security-Policy":"default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; img-src 'self' data:; connect-src 'self'","X-Content-Type-Options":"nosniff","Referrer-Policy":"no-referrer","Cache-Control":"no-store"};
const send=(res:ServerResponse,status:number,body:string,type="application/json; charset=utf-8")=>{res.writeHead(status,{...headers,"Content-Type":type});res.end(body)};
const json=(res:ServerResponse,status:number,value:unknown)=>send(res,status,JSON.stringify(value),"application/json; charset=utf-8");
async function body(req:IncomingMessage){let value="";for await(const chunk of req){value+=chunk;if(value.length>100_000)throw new Error("Request body exceeds 100 KB")}return JSON.parse(value||"{}")}
const mime:Record<string,string>={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".svg":"image/svg+xml"};
const server=createServer(async(req,res)=>{try{
  const url=new URL(req.url??"/",`http://${host}`);
  if(req.method==="GET"&&url.pathname==="/api/catalog")return json(res,200,{datasets:dashboardCatalog,chartTypes});
  if(req.method==="POST"&&url.pathname==="/api/query"){const input=await body(req),dataset=String(input.dataset??"");return json(res,200,dataset.endsWith("_live")?await runGoogleDashboardQuery(input):runDashboardQuery(data,input))}
  if(req.method!=="GET")return json(res,405,{error:"Method not allowed"});
  const requested=url.pathname==="/"?"index.html":url.pathname.slice(1),safe=normalize(requested);
  if(safe.startsWith("..")||safe.includes("\0"))return json(res,400,{error:"Invalid path"});
  const path=join(root,safe);return send(res,200,readFileSync(path,"utf8"),mime[extname(path)]??"text/plain; charset=utf-8");
}catch(error){const message=error instanceof Error?error.message:"Unknown error";return json(res,message.includes("ENOENT")?404:400,{error:message})}});
server.listen(port,host,()=>console.log(`Marketing dashboard ready at http://${host}:${port}`));
