import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { approve, createPreview, finish, getApproval, history, payloadHash, revoke } from "./store.js";
import { assertCanExecute, assertCanPreview, loadActionPolicy } from "./policy.js";
import type { ActionRequest } from "./types.js";
export const permissionStatus=()=>{const policy=loadActionPolicy();return {...policy,guarantees:["Every execution requires a separate preview and exact approval phrase","Approvals expire and are single use","Payload integrity is checked before execution","External write adapters are disabled until explicitly implemented"]}};
export function previewAction(request:ActionRequest){const policy=loadActionPolicy();assertCanPreview(policy,request);return createPreview(request,policy.approvalTtlMinutes)}
export const approveAction=(id:string,confirmation:string)=>approve(id,confirmation);
export const revokeAction=(id:string)=>revoke(id);
export const actionHistory=(limit:number)=>history(limit);
export async function executeAction(id:string){const record=getApproval(id);if(record.status!=="approved")throw new Error(`Action cannot execute because approval is ${record.status}`);if(payloadHash(record.request)!==record.payloadHash)throw new Error("Approved payload no longer matches its preview");assertCanExecute(loadActionPolicy(),record.request);try{if(record.request.kind!=="save_campaign_draft")throw new Error(`No write adapter is enabled for ${record.request.kind}; the approved action was not executed`);const directory=resolve(process.env.MARKETING_DRAFT_DIR??".marketing-actions/drafts");mkdirSync(directory,{recursive:true,mode:0o700});const path=join(directory,`${id}.json`);writeFileSync(path,`${JSON.stringify({approvalId:id,createdAt:new Date().toISOString(),...record.request.payload},null,2)}\n`,{mode:0o600,flag:"wx"});const result={executed:true,kind:record.request.kind,path};finish(id,"executed",result);return result}catch(error){finish(id,"failed",undefined,error instanceof Error?error.message:"Unknown execution error");throw error}}
