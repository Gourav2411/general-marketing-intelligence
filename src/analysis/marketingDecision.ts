export type OpportunityState="MONITOR"|"VALIDATE"|"ACCELERATE"|"GROWTH BET";
export type Confidence="LOW"|"MEDIUM"|"HIGH";
export interface DecisionSignals { searchGrowth?:number|null; commercialIntent?:boolean; paidEvidence?:boolean; leads?:number; mqls?:number; sqls?:number; opportunities?:number; spend?:number; pipeline?:number; enterpriseRelevant?:boolean; targetAccountEngagement?:boolean }
export interface MarketingDecision { state:OpportunityState; confidence:Confidence; action:"DO NOT SCALE"|"VALIDATE"|"CONTROLLED SCALE TEST"|"COORDINATED GROWTH BET"; fieldMotion:boolean; reasons:string[] }

export function decideMarketingAction(s:DecisionSignals):MarketingDecision {
 const leadToSql=s.leads? (s.sqls??0)/s.leads:0, pipelineEfficiency=s.spend? (s.pipeline??0)/s.spend:0;
 const corroborating=[(s.searchGrowth??0)>.1,s.commercialIntent===true,s.paidEvidence===true,(s.sqls??0)>=3,(s.pipeline??0)>0].filter(Boolean).length;
 const poorBusiness=(s.leads??0)>=20 && leadToSql<.08 && pipelineEfficiency<10;
 const strongDownstream=leadToSql>=.15 && pipelineEfficiency>=30 && (s.sqls??0)>=3;
 const multiSignal=corroborating>=4 && strongDownstream;
 const fieldMotion=multiSignal && s.enterpriseRelevant===true && (s.targetAccountEngagement!==false);
 if(poorBusiness) return {state:"MONITOR",confidence:"HIGH",action:"DO NOT SCALE",fieldMotion:false,reasons:["Lead volume is not converting to SQLs or pipeline."]};
 if(multiSignal) return {state:fieldMotion?"GROWTH BET":"ACCELERATE",confidence:"HIGH",action:fieldMotion?"COORDINATED GROWTH BET":"CONTROLLED SCALE TEST",fieldMotion,reasons:["Organic demand, paid evidence, SQL quality and pipeline corroborate the opportunity."]};
 if(strongDownstream) return {state:"ACCELERATE",confidence:"MEDIUM",action:"CONTROLLED SCALE TEST",fieldMotion:false,reasons:["Higher acquisition cost is justified by downstream SQL and pipeline quality."]};
 if((s.searchGrowth??0)>.1 && s.commercialIntent) return {state:"VALIDATE",confidence:"LOW",action:"VALIDATE",fieldMotion:false,reasons:["Search demand is promising but lacks sufficient downstream validation."]};
 return {state:"MONITOR",confidence:"LOW",action:"DO NOT SCALE",fieldMotion:false,reasons:["Evidence is insufficient or commercially weak."]};
}
