import { z } from "zod";
export const marketingAnalysisSchema=z.object({
 observedSignal:z.string().min(1),
 interpretation:z.string().min(1),
 hypothesis:z.string().min(1),
 recommendation:z.string().min(1),
 confidence:z.enum(["LOW","MEDIUM","HIGH"]),
 successMetric:z.string().min(1),
 reviewWindow:z.string().min(1),
 strategicOutput:z.string().min(1)
}).strict();
export type MarketingAnalysis=z.infer<typeof marketingAnalysisSchema>;
export interface EvidencePacket { observedFacts:unknown; calculatedMetrics:unknown; deterministicScores:unknown; opportunityState:unknown; confidenceInputs:unknown; deterministicOutput:string; }
export interface MarketingAnalysisInput { task:string; evidence:EvidencePacket; prompt:string; }
