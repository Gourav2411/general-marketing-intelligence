#!/usr/bin/env node
import { createHash, randomUUID } from "node:crypto";
import { join } from "node:path";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMarketingServer } from "./index.js";
import { AuditLog } from "./hosted/audit.js";
import { createTokenVerifier } from "./hosted/auth.js";
import { EncryptedCredentialStore } from "./hosted/credentials.js";
import { authorizeTool, credentialsForSources } from "./hosted/policy.js";
import { withScopedCredentials } from "./hosted/scopedEnv.js";

const required=(name:string)=>{const value=process.env[name];if(!value)throw new Error(`${name} is required for hosted mode`);return value};
const port=Number(process.env.HOSTED_PORT??3000);
const publicUrl=required("HOSTED_PUBLIC_URL").replace(/\/$/,"");
const dataDir=process.env.HOSTED_DATA_DIR??join(process.cwd(),".hosted-data");
const allowedOrigins=new Set(required("HOSTED_ALLOWED_ORIGINS").split(",").map(value=>value.trim()).filter(Boolean));
const maxRequests=Number(process.env.HOSTED_RATE_LIMIT_PER_MINUTE??60),issuer=required("HOSTED_ISSUER");
const store=new EncryptedCredentialStore(join(dataDir,"credentials"),required("HOSTED_ENCRYPTION_KEY"),Number(process.env.HOSTED_RETENTION_DAYS??30));
const audit=new AuditLog(join(dataDir,"audit","events.jsonl"));
const verify=createTokenVerifier({issuer,audience:required("HOSTED_AUDIENCE"),jwksUrl:required("HOSTED_JWKS_URL")});
const buckets=new Map<string,{minute:number;count:number}>(),app=createMcpExpressApp({host:"127.0.0.1"});
const reject=(res:any,status:number,message:string,requestId:string)=>res.status(status).json({jsonrpc:"2.0",error:{code:-32000,message,data:{requestId}},id:null});
const toolCalls=(body:any):string[]=>{const messages=Array.isArray(body)?body:[body];return messages.filter(value=>value?.method==="tools/call"&&typeof value?.params?.name==="string").map(value=>value.params.name)};
const protectedResource=(_req:any,res:any)=>res.json({resource:`${publicUrl}/mcp`,authorization_servers:[issuer],bearer_methods_supported:["header"],scopes_supported:["marketing:read"]});

app.get("/healthz",(_req:any,res:any)=>res.json({status:"ok",transport:"streamable-http",credentialStoreVersion:1}));
app.get("/.well-known/oauth-protected-resource",protectedResource);
app.get("/.well-known/oauth-protected-resource/mcp",protectedResource);
app.all("/mcp",async(req:any,res:any)=>{
  const requestId=randomUUID(),origin=req.header("origin");
  if(origin&&!allowedOrigins.has(origin)){audit.write({requestId,tenantId:"unknown",actorId:"unknown",action:"mcp_request",outcome:"denied",reason:"origin"});return reject(res,403,"Origin is not allowed",requestId)}
  let principal;
  try{principal=await verify(req.header("authorization"))}catch{res.setHeader("WWW-Authenticate",`Bearer resource_metadata=\"${publicUrl}/.well-known/oauth-protected-resource/mcp\"`);return reject(res,401,"Invalid or missing access token",requestId)}
  const minute=Math.floor(Date.now()/60000),key=`${principal.tenantId}:${principal.actorId}`,bucket=buckets.get(key);
  if(bucket?.minute===minute){bucket.count++;if(bucket.count>maxRequests)return reject(res,429,"Rate limit exceeded",requestId)}else buckets.set(key,{minute,count:1});
  const tenant=store.get(principal.tenantId);
  if(!tenant||tenant.revokedAt){audit.write({requestId,tenantId:principal.tenantId,actorId:principal.actorId,action:"mcp_request",outcome:"denied",reason:"credentials unavailable or revoked"});return reject(res,403,"Tenant credentials are unavailable or revoked",requestId)}
  try{
    for(const tool of toolCalls(req.body)){const sources=authorizeTool(principal,tool,tenant.allowedSources);audit.write({requestId,tenantId:principal.tenantId,actorId:principal.actorId,action:`tool:${tool}`,source:sources.join(","),outcome:"allowed"})}
    if(req.method!=="POST")return reject(res,405,"Stateless hosted mode accepts POST only",requestId);
    const effectiveSources=principal.sources.filter(source=>tenant.allowedSources.includes(source));
    const tenantDirectory=join(dataDir,"tenants",createHash("sha256").update(principal.tenantId).digest("hex"));
    const credentials={...credentialsForSources(tenant.credentials,effectiveSources),MCP_ACTION_DIR:join(tenantDirectory,"actions"),MARKETING_DRAFT_DIR:join(tenantDirectory,"drafts")};
    return await withScopedCredentials(credentials,join(dataDir,"runtime"),async()=>{const server=createMarketingServer(),transport=new StreamableHTTPServerTransport({sessionIdGenerator:undefined,enableJsonResponse:true});await server.connect(transport);try{await transport.handleRequest(req,res,req.body)}finally{await transport.close();await server.close()}});
  }catch(error){const reason=error instanceof Error?error.message:"unknown";audit.write({requestId,tenantId:principal.tenantId,actorId:principal.actorId,action:"mcp_request",outcome:"error",reason});if(!res.headersSent)return reject(res,403,reason,requestId)}
});

app.listen(port,"127.0.0.1",(error:any)=>{if(error)throw error;console.error(`General Marketing Intelligence hosted MCP listening on 127.0.0.1:${port}`)});
