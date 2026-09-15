import { z } from "zod";
import type {NumericClaim} from "../measurement/numericProvenance.js";
const numericClaim=z.object({value:z.number(),unit:z.string().optional(),kind:z.enum(["observed","calculated","proposed","external_reference"]),label:z.string().min(1),evidenceIds:z.array(z.string()).optional(),inputIds:z.array(z.string()).optional(),calculation:z.string().optional(),rationale:z.string().optional(),sourceUrl:z.string().url().optional()}).strict();
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
export interface EvidencePacket { observedFacts:unknown; calculatedMetrics:unknown; deterministicScores:unknown; opportunityState:unknown; confidenceInputs:unknown; deterministicOutput:string; }
export interface MarketingAnalysisInput { task:string; evidence:EvidencePacket; prompt:string; }
export type {NumericClaim};
