import { data } from "../data/loader.js";
import { semAudit } from "../analysis/sem.js";
import { disclaimer, money } from "../analysis/metrics.js";
export function auditPaidSearch(segment?:string):string {
 const rows=semAudit(data.ads.filter(row=>!segment||row.segment===segment)),scale=rows.filter(row=>row.change>0),reduce=rows.filter(row=>row.change<0);
 return `# Paid Search Audit\n\n> ${disclaimer}\n\n## Budget call\n\n${scale.length?`Controlled scale candidates: **${scale.map(row=>row.campaign).join(", ")}**.`:"No campaign currently meets the scale threshold."} ${reduce.length?`Reduction candidates: **${reduce.map(row=>row.campaign).join(", ")}**.`:"No campaign currently meets the reduction threshold."}\n\n${rows.map(row=>`### ${row.campaign}\n\n| Spend | Leads / MQLs / SQLs | Cost / SQL | Pipeline | Pipeline / spend | Suggested change |\n|---:|---:|---:|---:|---:|---:|\n| ${money(row.spend)} | ${row.leads} / ${row.mqls} / ${row.sqls} | ${Number.isFinite(row.costPerSql)?money(row.costPerSql):"No SQLs"} | ${money(row.estimated_pipeline)} | ${row.pipelineRoas.toFixed(1)}x | **${row.change>0?"+":""}${row.change}%** |\n\n**Recommendation:** ${row.recommendation}. ${row.reason}${row.negativeKeywords?`  \n**Search-term review:** ${row.negativeKeywords}.`:""}`).join("\n\n")}`;
}
