#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { EncryptedCredentialStore } from "../dist/hosted/credentials.js";
const [command,tenantIdOrFile]=process.argv.slice(2),dataDir=process.env.HOSTED_DATA_DIR??resolve(".hosted-data"),key=process.env.HOSTED_ENCRYPTION_KEY;
if(!key)throw new Error("HOSTED_ENCRYPTION_KEY is required");
const store=new EncryptedCredentialStore(join(dataDir,"credentials"),key,Number(process.env.HOSTED_RETENTION_DAYS??30));
if(command==="put"){if(!tenantIdOrFile)throw new Error("Usage: npm run tenant:admin -- put /absolute/path/to/tenant.json");const input=JSON.parse(readFileSync(resolve(tenantIdOrFile),"utf8"));if(!input.tenantId||!Array.isArray(input.allowedSources)||!input.credentials)throw new Error("Tenant file requires tenantId, allowedSources and credentials");console.log(JSON.stringify(store.put({tenantId:input.tenantId,allowedSources:input.allowedSources,credentials:input.credentials}),null,2));}
else if(command==="revoke"){if(!tenantIdOrFile)throw new Error("Tenant ID required");console.log(store.revoke(tenantIdOrFile)?"Credentials revoked":"Tenant not found");}
else if(command==="status"){if(!tenantIdOrFile)throw new Error("Tenant ID required");const record=store.get(tenantIdOrFile);console.log(record?JSON.stringify({tenantId:record.tenantId,allowedSources:record.allowedSources,credentialKeys:Object.keys(record.credentials).sort(),updatedAt:record.updatedAt,revokedAt:record.revokedAt??null},null,2):"Tenant not found");}
else throw new Error("Commands: put <tenant-json>, status <tenant-id>, revoke <tenant-id>");
