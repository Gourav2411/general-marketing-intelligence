import type { AdsRow } from "../types.js";
import type { ConversionRow } from "../types.js";
import { ratio } from "./metrics.js";
export interface PaidScore extends AdsRow { opportunities:number|null; ctr:number; landingPageConversion:number; cpl:number|null; costPerMql:number|null; costPerSql:number|null; mqlToSql:number|null; leadToSql:number|null; pipelinePerSpend:number|null; momentum:number|null; scaleScore:number; scoreInputs:{pipelineEfficiency:number;costPerSqlEfficiency:number;qualification:number;momentum:number}; }
const safe=(a:number,b:number):number|null=>b>0?a/b:null;
const normalise=(v:number|null,max:number,inverse=false)=>v===null?0:inverse?(v>0?Math.min(1,max/v):0):Math.min(1,v/max);
export function scorePaidCampaigns(ads:AdsRow[],conversions:ConversionRow[]):PaidScore[] {
 return ads.map(a=>{
  const conv=conversions.find(c=>c.source==="Paid Search"&&c.campaign===a.campaign);
  const cps=safe(a.spend,a.sqls), pps=safe(a.estimated_pipeline,a.spend), qualification=safe(a.sqls,a.leads);
  const inputs={pipelineEfficiency:normalise(pps,120),costPerSqlEfficiency:normalise(cps,10000,true),qualification:normalise(qualification,.25),momentum:0.5};
  return {...a,opportunities:conv?.opportunities??null,ctr:ratio(a.clicks,a.impressions),landingPageConversion:ratio(a.leads,a.clicks),cpl:safe(a.spend,a.leads),costPerMql:safe(a.spend,a.mqls),costPerSql:cps,mqlToSql:safe(a.sqls,a.mqls),leadToSql:qualification,pipelinePerSpend:pps,momentum:null,scaleScore:Math.round(100*(.35*inputs.pipelineEfficiency+.30*inputs.costPerSqlEfficiency+.20*inputs.qualification+.15*inputs.momentum)),scoreInputs:inputs};
 }).sort((a,b)=>b.scaleScore-a.scaleScore);
}
