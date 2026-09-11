import {appendFileSync,chmodSync,existsSync,mkdirSync,readFileSync,writeFileSync} from "node:fs";
import {dirname,join} from "node:path";
import {randomUUID} from "node:crypto";
import type {LearningRecord} from "./types.js";
const defaultPath=()=>process.env.MARKETING_MEMORY_FILE||join(process.cwd(),".marketing-memory/learning.jsonl");
const safeAccount=(value:string)=>value.replace(/[^a-zA-Z0-9_.-]/g,"_").slice(0,100);
export function readLearningMemory(accountId="default",limit=20,path=defaultPath()):LearningRecord[]{if(!existsSync(path))return [];return readFileSync(path,"utf8").split("\n").filter(Boolean).map(line=>JSON.parse(line) as LearningRecord).filter(x=>x.accountId===safeAccount(accountId)).slice(-limit)}
export function appendLearningRecord(input:Omit<LearningRecord,"id"|"createdAt"|"accountId">,accountId="default",path=defaultPath()):LearningRecord{mkdirSync(dirname(path),{recursive:true,mode:0o700});if(!existsSync(path))writeFileSync(path,"",{mode:0o600});const row={...input,id:randomUUID(),createdAt:new Date().toISOString(),accountId:safeAccount(accountId)};appendFileSync(path,`${JSON.stringify(row)}\n`,{mode:0o600});chmodSync(path,0o600);return row}
