import type { MarketingAnalysis, MarketingAnalysisInput } from "./schemas.js";
export type AIProviderName="openai"|"none";
export type AIConnectionState="CONNECTED"|"NOT CONFIGURED"|"ERROR";
export interface AIProvider { readonly name:Exclude<AIProviderName,"none">; readonly model:string; generateMarketingAnalysis(input:MarketingAnalysisInput):Promise<MarketingAnalysis>; }
export interface AIStatus { provider:AIProviderName; model:string|null; status:AIConnectionState; detail:string; }
let lastProviderError:string|undefined;
export const recordAIError=(message?:string)=>{lastProviderError=message};
export function configuredProviderName():AIProviderName { return (process.env.AI_PROVIDER??"none").toLowerCase()==="openai"?"openai":"none"; }
export function getAIStatus(lastError=lastProviderError):AIStatus {
 const provider=configuredProviderName();
 if(provider==="none") return {provider,model:null,status:"NOT CONFIGURED",detail:"Deterministic mode; optional AI reasoning is disabled."};
 const model=process.env.OPENAI_MODEL||"gpt-5.6-terra";
 const hasKey=Boolean(process.env.OPENAI_API_KEY);
 if(!hasKey) return {provider,model,status:"NOT CONFIGURED",detail:"AI provider not configured; deterministic fallback remains active."};
 if(lastError) return {provider,model,status:"ERROR",detail:lastError};
 return {provider,model,status:"CONNECTED",detail:"Configured for optional reasoning; provider reachability is checked on request."};
}
export async function createAIProvider():Promise<AIProvider|null>{
 const provider=configuredProviderName();
 if(provider==="openai"&&process.env.OPENAI_API_KEY){const {OpenAIProvider}=await import("./openai.js");return new OpenAIProvider()}
 return null;
}
