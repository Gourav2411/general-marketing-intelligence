import { readFileSync } from "node:fs";
import { z } from "zod";
const segmentSchema=z.object({name:z.string().min(1),query_patterns:z.array(z.string().min(1)).default([]),landing_page_patterns:z.array(z.string().min(1)).default([]),campaign_patterns:z.array(z.string().min(1)).default([])});
const mappingSchema=z.object({version:z.literal(1),segments:z.array(segmentSchema)});
export type MappingConfig=z.infer<typeof mappingSchema>;
export interface MappingInput {query?:string;landingPage?:string;campaign?:string}
export function loadMappingConfig():MappingConfig {
 const path=process.env.MARKETING_MAPPING_FILE;if(!path)return {version:1,segments:[]};
 try{return mappingSchema.parse(JSON.parse(readFileSync(path,"utf8")))}catch(error){throw new Error(`MARKETING_MAPPING_FILE is invalid: ${error instanceof Error?error.message:"Unknown error"}`)}
}
const contains=(value:string|undefined,patterns:string[])=>Boolean(value&&patterns.some(pattern=>value.toLowerCase().includes(pattern.toLowerCase())));
const inferredFromPage=(page:string|undefined)=>{if(!page)return undefined;try{const parts=new URL(page,"https://local.invalid").pathname.split("/").filter(Boolean);return parts[0]?parts[0].replace(/[-_]+/g," ").replace(/\b\w/g,x=>x.toUpperCase()):"Homepage"}catch{return undefined}};
export function mapSegment(input:MappingInput,config:MappingConfig):{segment:string;mapping:"configured"|"inferred"|"unmapped"}{
 for(const rule of config.segments)if(contains(input.query,rule.query_patterns)||contains(input.landingPage,rule.landing_page_patterns)||contains(input.campaign,rule.campaign_patterns))return {segment:rule.name,mapping:"configured"};
 const inferred=inferredFromPage(input.landingPage);return inferred?{segment:inferred,mapping:"inferred"}:{segment:"Unmapped",mapping:"unmapped"};
}
