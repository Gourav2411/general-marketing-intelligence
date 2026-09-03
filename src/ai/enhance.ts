import type { AIProvider } from "./provider.js";
import { createAIProvider,configuredProviderName,recordAIError } from "./provider.js";
import { buildMarketingPrompt } from "./prompts.js";
import { marketingAnalysisSchema,type EvidencePacket,type MarketingAnalysis } from "./schemas.js";
export function renderAIAnalysis(a:MarketingAnalysis,provider:string):string{return `\n\n---\n\n## AI Intelligence Layer — ${provider}\n\n**OBSERVED SIGNAL**  \n${a.observedSignal}\n\n**INTERPRETATION**  \n${a.interpretation}\n\n**HYPOTHESIS**  \n${a.hypothesis}\n\n**RECOMMENDATION**  \n${a.recommendation}\n\n**CONFIDENCE**  \n${a.confidence}\n\n**SUCCESS METRIC**  \n${a.successMetric}\n\n**REVIEW WINDOW**  \n${a.reviewWindow}\n\n### Strategic output\n\n${a.strategicOutput}`}
function assertNumericIntegrity(a:MarketingAnalysis,evidence:EvidencePacket){const allowed=new Set((JSON.stringify(evidence).match(/\b\d+(?:[.,]\d+)?%?x?\b/g)??[]).map(x=>x.toLowerCase()));const generated=JSON.stringify(a).match(/\b\d+(?:[.,]\d+)?%?x?\b/g)??[];const invented=generated.filter(x=>!allowed.has(x.toLowerCase()));if(invented.length)throw new Error(`AI introduced numeric values absent from evidence: ${[...new Set(invented)].join(", ")}`)}
export async function enhanceMarketingOutput(task:string,fallback:string,evidence:EvidencePacket,override?:AIProvider):Promise<string>{
 const provider=override??await createAIProvider(); if(!provider)return fallback;
 const prompt=buildMarketingPrompt(task,evidence),input={task,evidence,prompt};
 for(let attempt=0;attempt<2;attempt++)try{const parsed=marketingAnalysisSchema.parse(await provider.generateMarketingAnalysis(input));assertNumericIntegrity(parsed,evidence);recordAIError();return fallback+renderAIAnalysis(parsed,`${provider.name} / ${provider.model}`)}catch(error){const message=error instanceof Error?error.message:"unknown error";recordAIError(message);console.error(`[AI reasoning fallback] ${provider.name} attempt ${attempt+1} failed:`,message)}
 return fallback;
}
export const aiEnabled=()=>configuredProviderName()!=="none";
