import {MarketingGraph} from "./graph.js";
export interface NormalizedCampaignEvidence {sourceSystem:string;sourceId:string;retrievedAt:string;campaign:string;channel:string;landingPage?:string;audience?:string;spend?:number;revenue?:number;evidenceIds?:string[];}
export function addCampaignEvidence(graph:MarketingGraph,accountId:string,row:NormalizedCampaignEvidence){
 const shared={accountId,sourceSystem:row.sourceSystem,retrievedAt:row.retrievedAt,evidenceIds:row.evidenceIds};
 const campaign=graph.upsertEntity({...shared,type:"Campaign",sourceId:`campaign:${row.campaign.toLowerCase()}`,canonicalKey:row.campaign,label:row.campaign,attributes:{spend:row.spend}}),channel=graph.upsertEntity({...shared,type:"Channel",sourceId:`channel:${row.channel.toLowerCase()}`,canonicalKey:row.channel,label:row.channel});
 graph.link({...shared,type:"belongs_to",fromId:campaign.id,toId:channel.id,sourceId:row.sourceId});
 if(row.landingPage){const landing=graph.upsertEntity({...shared,type:"LandingPage",sourceId:`landing:${row.landingPage}`,canonicalKey:row.landingPage,label:row.landingPage});graph.link({...shared,type:"lands_on",fromId:campaign.id,toId:landing.id,sourceId:row.sourceId})}
 if(row.audience){const audience=graph.upsertEntity({...shared,type:"Audience",sourceId:`audience:${row.audience.toLowerCase()}`,canonicalKey:row.audience,label:row.audience});graph.link({...shared,type:"targets",fromId:campaign.id,toId:audience.id,sourceId:row.sourceId})}
 if(row.revenue!==undefined){const revenue=graph.upsertEntity({...shared,type:"RevenueEvent",sourceId:`revenue:${row.sourceId}`,label:`Revenue from ${row.campaign}`,attributes:{value:row.revenue}});graph.link({...shared,type:"produces",fromId:campaign.id,toId:revenue.id,sourceId:row.sourceId})}
 return campaign;
}
