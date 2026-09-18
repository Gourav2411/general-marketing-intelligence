import type {ClosedLoopLearningRecord,DecisionRecord} from "./types.js";
import {inspectLearningRecords} from "./service.js";
import {sanitizeUntrustedText} from "../security/untrusted.js";
export interface RankedLearningRecord extends ClosedLoopLearningRecord {relevance:number;ageDays:number;contradiction:boolean;}
export interface AccountLearningContext {tenantId:string;accountId:string;query:string;records:RankedLearningRecord[];recentDecisions:Pick<DecisionRecord,"id"|"createdAt"|"question"|"recommendation"|"status">[];contradictions:string[];provenanceIds:string[];markdown:string;}
const tokens=(value:string)=>new Set(value.toLowerCase().match(/[a-z0-9]{3,}/g)??[]);
const overlap=(left:Set<string>,right:Set<string>)=>{if(!left.size||!right.size)return 0;let matches=0;for(const token of left)if(right.has(token))matches++;return matches/Math.sqrt(left.size*right.size)};
const boundedAge=(createdAt:string)=>Math.max(0,(Date.now()-new Date(createdAt).getTime())/86_400_000);
const round=(value:number)=>Math.round(value*1000)/1000;
/** Builds bounded, deterministic, outcome-backed context. Model prose and unmeasured decisions never become learning. */
export async function buildAccountLearningContext(query:string,accountId=process.env.MARKETING_ACCOUNT_ID??"default",tenantId=process.env.MARKETING_TENANT_ID??"local",limit=8):Promise<AccountLearningContext>{
 let inspected:Awaited<ReturnType<typeof inspectLearningRecords>>;try{inspected=await inspectLearningRecords(accountId,tenantId,100)}catch{return {tenantId,accountId,query,records:[],recentDecisions:[],contradictions:[],provenanceIds:[],markdown:"- Account learning is unavailable. Apply no memory adjustment and do not infer prior account knowledge."}}
 const queryTokens=tokens(query),decisionById=new Map(inspected.decisions.map(row=>[row.id,row]));
 const ranked=inspected.learning.map(row=>{const decision=decisionById.get(row.decisionId),searchText=[row.lesson,...row.appliesTo,decision?.question,decision?.diagnosis,decision?.recommendation].filter(Boolean).join(" "),ageDays=boundedAge(row.createdAt),semantic=overlap(queryTokens,tokens(searchText)),recency=1/(1+ageDays/90),evidence=Math.min(1,Math.abs(row.confidenceChange)*4),relevance=round(semantic*.65+recency*.2+evidence*.15);return {...row,relevance,ageDays:round(ageDays),contradiction:false}}).sort((a,b)=>b.relevance-a.relevance||b.createdAt.localeCompare(a.createdAt)||a.id.localeCompare(b.id));
 const directions=new Map<string,Set<number>>();for(const row of ranked){const set=directions.get(row.decisionId)??new Set<number>();if(row.confidenceChange)set.add(Math.sign(row.confidenceChange));directions.set(row.decisionId,set)}
 const records=ranked.slice(0,Math.min(20,Math.max(1,limit))).map(row=>({...row,contradiction:(directions.get(row.decisionId)?.size??0)>1})),contradictions=[...new Set(records.filter(row=>row.contradiction).map(row=>row.decisionId))],recentDecisions=inspected.decisions.slice(0,5).map(({id,createdAt,question,recommendation,status})=>({id,createdAt,question,recommendation,status}));
 const markdown=records.length?records.map(row=>`- [${row.id}] relevance=${row.relevance}; age_days=${row.ageDays}; decision=${row.decisionId}; confidence_change=${row.confidenceChange>=0?"+":""}${row.confidenceChange}; contradiction=${row.contradiction}; ${sanitizeUntrustedText(row.lesson)}`).join("\n"):"- No outcome-backed account learning is recorded. Do not claim the system learned this account.";
 return {tenantId,accountId,query,records,recentDecisions,contradictions,provenanceIds:records.map(row=>row.id),markdown};
}
