import { data } from "../data/loader.js";
import { opportunityRadar as analyze } from "../analysis/opportunity.js";
import { disclaimer } from "../analysis/metrics.js";
export function opportunityRadar(limit=3):string {
 const rows=analyze(data.search,data.ads).slice(0,limit);
 return `# Opportunity radar\n\n> ${disclaimer}\n\n${rows.map((r,i)=>`## ${i+1}. ${r.title}\n\n**SIGNAL**  \n${r.signal}\n\n**HYPOTHESIS**  \n${r.hypothesis}\n\n**COMMERCIAL IMPLICATION**  \n${r.implication}\n\n**RECOMMENDED RESPONSE**\n${r.responses.map(x=>`- ${x}`).join("\n")}\n\n**EXPERIMENT**  \n${r.experiment}\n\n**SUCCESS METRIC**  \n${r.metric}`).join("\n\n")}`;
}
