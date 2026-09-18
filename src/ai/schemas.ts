import { z } from "zod";
import type {NumericClaim} from "../measurement/numericProvenance.js";
const optionalString=z.string().nullable().optional().transform(value=>value??undefined),optionalList=z.array(z.string()).nullable().optional().transform(value=>value??undefined);
const numericClaim=z.object({value:z.number(),unit:optionalString,kind:z.enum(["observed","calculated","proposed","external_reference"]),label:z.string().min(1),evidenceIds:optionalList,inputIds:optionalList,calculation:optionalString,rationale:optionalString,sourceUrl:z.string().url().nullable().optional().transform(value=>value??undefined)}).strict();
export const marketingAnalysisSchema=z.object({
 observedSignal:z.string().min(1),
 interpretation:z.string().min(1),
 hypothesis:z.string().min(1),
 recommendation:z.string().min(1),
 confidence:z.enum(["LOW","MEDIUM","HIGH"]),
 successMetric:z.string().min(1),
 reviewWindow:z.string().min(1),
 strategicOutput:z.string().min(1),
 numericClaims:z.array(numericClaim).default([])
}).strict();
export type MarketingAnalysis=z.infer<typeof marketingAnalysisSchema>;
export interface EvidencePacket { observedFacts:unknown; calculatedMetrics:unknown; deterministicScores:unknown; opportunityState:unknown; confidenceInputs:unknown; deterministicOutput:string; accountContext?:unknown; }
export interface MarketingAnalysisInput { task:string; evidence:EvidencePacket; prompt:string; }
export type {NumericClaim};
