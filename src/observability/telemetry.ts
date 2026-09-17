import {appendFileSync,chmodSync,existsSync,mkdirSync,writeFileSync} from "node:fs";
import {dirname} from "node:path";
import {runtimeStatePath} from "../runtime/paths.js";
export type TelemetryEvent="tool_called"|"evidence_used"|"recommendation_created"|"decision_created"|"evaluator_disagreement"|"approval_requested"|"action_executed"|"action_failed"|"outcome_recorded"|"learning_updated";
const secret=/token|secret|password|credential|authorization|api[_-]?key/i;
const clean=(value:unknown):unknown=>Array.isArray(value)?value.map(clean):value&&typeof value==="object"?Object.fromEntries(Object.entries(value as Record<string,unknown>).filter(([key])=>!secret.test(key)).map(([key,item])=>[key,clean(item)])):value;
export function emitTelemetry(event:TelemetryEvent,fields:Record<string,unknown>={},path=process.env.MARKETING_TELEMETRY_FILE??runtimeStatePath("telemetry","events.jsonl")):boolean{try{mkdirSync(dirname(path),{recursive:true,mode:0o700});if(!existsSync(path))writeFileSync(path,"",{mode:0o600});const sanitized=clean(fields) as Record<string,unknown>;appendFileSync(path,`${JSON.stringify({timestamp:new Date().toISOString(),event,...sanitized})}\n`,{mode:0o600});chmodSync(path,0o600);return true}catch{return false}}
