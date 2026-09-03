import type { SearchRow } from "../types.js";
import { ratio } from "./metrics.js";
export interface SeoOpportunity extends SearchRow { growth:number; expectedCtr:number; ctrGap:number; score:number; action:string }
export function seoOpportunities(rows:SearchRow[]):SeoOpportunity[]{
 return rows.map(row=>{const growth=ratio(row.current_period-row.previous_period,row.previous_period),expectedCtr=row.average_position<=3?.12:row.average_position<=6?.07:row.average_position<=10?.04:.02,ctrGap=Math.max(0,expectedCtr-row.ctr),score=growth*25+ctrGap*100+(row.commercial_intent==="high"?8:row.commercial_intent==="medium"?3:0)+(row.average_position>=4&&row.average_position<=20?4:0),action=row.average_position<=10&&ctrGap>.015?"Improve title, message match and landing-page conversion":row.average_position<=20?"Build or expand a dedicated high-intent page":"Monitor until ranking or commercial evidence strengthens";return {...row,growth,expectedCtr,ctrGap,score,action};}).filter(row=>row.growth>0||row.commercial_intent==="high").sort((a,b)=>b.score-a.score);
}
