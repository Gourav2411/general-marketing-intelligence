import { data } from "../data/loader.js";
import { opportunityRadar } from "../analysis/opportunity.js";
import { scorePaidCampaigns } from "../analysis/performance.js";
import { decideMarketingAction } from "../analysis/marketingDecision.js";
import { ratio,sum } from "../analysis/metrics.js";
import type { EvidencePacket } from "./schemas.js";
export function buildEvidencePacket(tool:string,args:Record<string,unknown>,deterministicOutput:string):EvidencePacket{
 const ranked=opportunityRadar(data.search,data.ads);
 const paid=scorePaidCampaigns(data.ads,data.conversions).map(r=>({campaign:r.campaign,segment:r.segment,spend:r.spend,clicks:r.clicks,leads:r.leads,mqls:r.mqls,sqls:r.sqls,opportunities:r.opportunities,estimatedPipeline:r.estimated_pipeline,costPerSql:r.costPerSql,pipelinePerSpend:r.pipelinePerSpend,scaleScore:r.scaleScore,momentum:r.momentum}));
 const requestedSegment=typeof args.segment==="string"?args.segment:undefined;
 const requestedOpportunity=typeof args.opportunity==="string"?args.opportunity.toLowerCase():undefined;
 const selected=ranked.find(r=>requestedSegment?r.segment===requestedSegment:requestedOpportunity?r.title.toLowerCase().includes(requestedOpportunity):false)??ranked[0];
 const selectedSearch=data.search.filter(r=>r.segment===selected.segment),selectedAds=data.ads.filter(r=>r.segment===selected.segment),prev=sum(selectedSearch,"previous_period");
 const decision=decideMarketingAction({searchGrowth:ratio(sum(selectedSearch,"current_period")-prev,prev),commercialIntent:selectedSearch.some(r=>r.commercial_intent==="high"),paidEvidence:selectedAds.length>0,leads:sum(selectedAds,"leads"),sqls:sum(selectedAds,"sqls"),spend:sum(selectedAds,"spend"),pipeline:sum(selectedAds,"estimated_pipeline"),enterpriseRelevant:true,targetAccountEngagement:true});
 return {observedFacts:{tool,args,rankedOpportunities:ranked.map((r,index)=>({rank:index+1,title:r.title,segment:r.segment,signal:r.signal})),paidCampaigns:paid},calculatedMetrics:{paidCampaigns:paid.map(({campaign,costPerSql,pipelinePerSpend,scaleScore})=>({campaign,costPerSql,pipelinePerSpend,scaleScore}))},deterministicScores:{opportunityRanking:ranked.map((r,index)=>({rank:index+1,title:r.title,score:r.score})),paidScaleScores:paid.map(r=>({campaign:r.campaign,score:r.scaleScore}))},opportunityState:decision.state,confidenceInputs:{level:decision.confidence,reasons:decision.reasons},deterministicOutput};
}
