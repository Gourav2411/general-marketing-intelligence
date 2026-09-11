import {readFileSync,readdirSync} from "node:fs";
import {dirname,join} from "node:path";
import {fileURLToPath} from "node:url";
import {z} from "zod";
import type {MarketingCase,RetrievedCase} from "./types.js";
const source=z.object({title:z.string().min(1),url:z.string().url(),publisher:z.string().min(1),accessedAt:z.string().regex(/^\d{4}-\d{2}-\d{2}$/)});
export const marketingCaseSchema=z.object({id:z.string().regex(/^[a-z0-9-]+$/),campaign:z.string().min(1),brand:z.string().min(1),period:z.string().min(1),markets:z.array(z.string()).min(1),disciplines:z.array(z.string()).min(1),objective:z.string().min(1),audience:z.array(z.string()).min(1),businessContext:z.string().min(1),strategy:z.string().min(1),execution:z.array(z.string()).min(1),outcome:z.enum(["succeeded","failed","mixed"]),outcomes:z.array(z.string()).min(1),evidenceQuality:z.enum(["low","medium","high"]),causalConfidence:z.enum(["low","medium","high"]),whatWorked:z.array(z.string()),whatFailed:z.array(z.string()),failureModes:z.array(z.string()),transferConditions:z.array(z.string()).min(1),nonTransferConditions:z.array(z.string()).min(1),sources:z.array(source).min(1)}).strict();
const root=join(dirname(fileURLToPath(import.meta.url)),"../..");
const tokenize=(value:string)=>new Set(value.toLowerCase().match(/[a-z0-9]{3,}/g)??[]);
export function loadKnowledgeBase(directory=process.env.MARKETING_KNOWLEDGE_DIR||join(root,"knowledge/cases")):MarketingCase[]{
 const seen=new Set<string>(); return readdirSync(directory).filter(x=>x.endsWith(".json")).sort().map(file=>marketingCaseSchema.parse(JSON.parse(readFileSync(join(directory,file),"utf8")))).filter(row=>{if(seen.has(row.id))throw new Error(`Duplicate marketing case id: ${row.id}`);seen.add(row.id);return true});
}
export function retrievePrecedents(query:string,limit=5,cases=loadKnowledgeBase()):RetrievedCase[]{
 const terms=tokenize(query); return cases.map(row=>{const searchable=tokenize([row.campaign,row.brand,row.objective,row.businessContext,row.strategy,...row.disciplines,...row.failureModes,...row.transferConditions].join(" "));const matched=[...terms].filter(x=>searchable.has(x));const failureBonus=row.outcome!=="succeeded"?.35:0;const qualityBonus=row.evidenceQuality==="high"?.3:row.evidenceQuality==="medium"?.15:0;return {case:row,score:matched.length+failureBonus+qualityBonus,matchedTerms:matched}}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.case.id.localeCompare(b.case.id)).slice(0,limit);
}
export function renderPrecedents(rows:RetrievedCase[]){return rows.length?rows.map(({case:c})=>`- [${c.id}] ${c.brand}, ${c.campaign} (${c.period}; ${c.outcome}; evidence=${c.evidenceQuality}, causal=${c.causalConfidence}). Transfer only when: ${c.transferConditions.join("; ")}. Do not transfer when: ${c.nonTransferConditions.join("; ")}. Source: ${c.sources.map(s=>`${s.title} (${s.url})`).join("; ")}`).join("\n"):"- No sufficiently relevant precedent found. State that limitation; do not invent one."}
