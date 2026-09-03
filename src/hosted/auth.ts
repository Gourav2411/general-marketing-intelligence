import { createRemoteJWKSet, jwtVerify } from "jose";
import type { HostedRole, Principal } from "./policy.js";

const strings=(value:unknown)=>Array.isArray(value)?value.filter((v):v is string=>typeof v==="string"):typeof value==="string"?value.split(/[ ,]+/).filter(Boolean):[];
export function createTokenVerifier(config:{issuer:string;audience:string;jwksUrl:string}){const jwks=createRemoteJWKSet(new URL(config.jwksUrl));return async(header:string|undefined):Promise<Principal>=>{if(!header?.startsWith("Bearer "))throw new Error("Missing bearer token");const {payload}=await jwtVerify(header.slice(7),jwks,{issuer:config.issuer,audience:config.audience,algorithms:["RS256","ES256"]});const tenantId=typeof payload.tenant_id==="string"?payload.tenant_id:"",actorId=payload.sub??"";if(!tenantId||!actorId)throw new Error("Token must include sub and tenant_id claims");return {tenantId,actorId,roles:strings(payload.roles) as HostedRole[],sources:strings(payload.sources)};};}
