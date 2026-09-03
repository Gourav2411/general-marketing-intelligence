import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { mkdirSync, readFileSync, renameSync, writeFileSync, existsSync, unlinkSync } from "node:fs";
import { join } from "node:path";

export type TenantSecrets={version:1;tenantId:string;allowedSources:string[];credentials:Record<string,string>;updatedAt:string;revokedAt?:string};
type Envelope={version:1;iv:string;tag:string;ciphertext:string};
const filename=(tenantId:string)=>`${createHash("sha256").update(tenantId).digest("hex")}.enc.json`;

export class EncryptedCredentialStore{
  readonly directory:string; private readonly key:Buffer;
  constructor(directory:string,keyBase64:string,private readonly retentionDays=30){this.directory=directory;this.key=Buffer.from(keyBase64,"base64");if(this.key.length!==32)throw new Error("HOSTED_ENCRYPTION_KEY must be a base64-encoded 32-byte key");mkdirSync(directory,{recursive:true,mode:0o700});}
  put(value:Omit<TenantSecrets,"version"|"updatedAt">){const record:TenantSecrets={...value,version:1,updatedAt:new Date().toISOString()},iv=randomBytes(12),path=join(this.directory,filename(value.tenantId));const cipher=createCipheriv("aes-256-gcm",this.key,iv);cipher.setAAD(Buffer.from(`gmi:${value.tenantId}:v1`));const ciphertext=Buffer.concat([cipher.update(JSON.stringify(record)),cipher.final()]);const envelope:Envelope={version:1,iv:iv.toString("base64"),tag:cipher.getAuthTag().toString("base64"),ciphertext:ciphertext.toString("base64")},temporary=`${path}.${process.pid}.tmp`;writeFileSync(temporary,JSON.stringify(envelope),{mode:0o600});renameSync(temporary,path);return {tenantId:value.tenantId,allowedSources:value.allowedSources,updatedAt:record.updatedAt,revoked:Boolean(record.revokedAt)};}
  get(tenantId:string){const path=join(this.directory,filename(tenantId));if(!existsSync(path))return undefined;const envelope=JSON.parse(readFileSync(path,"utf8")) as Envelope,decipher=createDecipheriv("aes-256-gcm",this.key,Buffer.from(envelope.iv,"base64"));decipher.setAAD(Buffer.from(`gmi:${tenantId}:v1`));decipher.setAuthTag(Buffer.from(envelope.tag,"base64"));const record=JSON.parse(Buffer.concat([decipher.update(Buffer.from(envelope.ciphertext,"base64")),decipher.final()]).toString("utf8")) as TenantSecrets;if(record.tenantId!==tenantId)throw new Error("Tenant credential isolation check failed");if(record.revokedAt&&Date.parse(record.revokedAt)<Date.now()-this.retentionDays*86400000){unlinkSync(path);return undefined}return record;}
  revoke(tenantId:string){const current=this.get(tenantId);if(!current)return false;this.put({...current,credentials:{},revokedAt:new Date().toISOString()});return true;}
}
