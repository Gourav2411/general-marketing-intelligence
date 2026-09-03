import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

export type AuditEvent={requestId:string;tenantId:string;actorId:string;action:string;source?:string;outcome:"allowed"|"denied"|"error";reason?:string};
export class AuditLog{constructor(private readonly path:string){mkdirSync(dirname(path),{recursive:true,mode:0o700});}write(event:AuditEvent){appendFileSync(this.path,`${JSON.stringify({timestamp:new Date().toISOString(),...event})}\n`,{mode:0o600});}}
