import { data } from "../data/loader.js";
import { seoOpportunities as analyze } from "../analysis/seo.js";
import { disclaimer, pct } from "../analysis/metrics.js";
export function findSeoOpportunities(segment?:string,limit=5):string {
 const rows=analyze(data.search.filter(row=>!segment||row.segment===segment)).slice(0,limit);
 return `# SEO Opportunities\n\n> ${disclaimer}\n\n${rows.map((row,index)=>`## ${index+1}. ${row.query}\n\n**Segment:** ${row.segment}  \n**Signal:** ${row.impressions.toLocaleString()} impressions · ${row.clicks} clicks · ${pct(row.ctr)} CTR · position ${row.average_position} · ${pct(row.growth)} growth  \n**Commercial intent:** ${row.commercial_intent}  \n**Opportunity score:** ${row.score.toFixed(1)}\n\n**Recommended action:** ${row.action}.  \n**Landing page:** ${row.landing_page}`).join("\n\n")}`;
}
