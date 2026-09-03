import type { AdsRow, Opportunity, SearchRow } from "../types.js";
import { ratio, sum } from "./metrics.js";
export function opportunityRadar(search:SearchRow[],ads:AdsRow[]):Opportunity[] {
 const segments=[...new Set([...search.map(row=>row.segment),...ads.map(row=>row.segment)])];
 return segments.map(segment=>{
  const organic=search.filter(row=>row.segment===segment),paid=ads.filter(row=>row.segment===segment);
  const current=sum(organic,"current_period"),previous=sum(organic,"previous_period"),growth=ratio(current-previous,previous),sqls=sum(paid,"sqls"),spend=sum(paid,"spend"),pipeline=sum(paid,"estimated_pipeline"),efficiency=ratio(pipeline,spend);
  const strongestQuery=[...organic].sort((a,b)=>b.current_period-a.current_period)[0]?.query??segment,intent=organic.some(row=>row.commercial_intent==="high"),score=growth*20+sqls+efficiency/10+(intent?2:0);
  return {title:`Validate and grow ${segment}`,segment,score,signal:`${segment} organic demand changed ${Math.round(growth*100)}%; paid activity generated ${sqls} SQLs and ${efficiency.toFixed(1)}x pipeline/spend. The largest search theme is “${strongestQuery}”.`,hypothesis:`Buyers in ${segment} may be moving from category discovery toward solution evaluation.`,implication:intent&&sqls>0?"Organic intent and downstream paid quality justify a controlled, coordinated test.":"The signal needs stronger commercial validation before material investment.",responses:[`SEO: improve the ${segment} intent path`,`Paid: test the strongest commercial theme with guardrails`,`Content: answer the highest-intent buyer question`,`Sales: align follow-up to the same segment and use case`],experiment:`Run one 30-day ${segment} acquisition and conversion test using the strongest observed theme.`,metric:"Incremental SQLs, qualified opportunities and pipeline; guardrail cost per SQL."};
 }).sort((a,b)=>b.score-a.score);
}
