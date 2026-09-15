import type { AIProvider } from "./provider.js";
import { marketingAnalysisSchema,type MarketingAnalysisInput } from "./schemas.js";
export class OpenAIProvider implements AIProvider {
 readonly name="openai" as const; readonly model=process.env.OPENAI_MODEL||"gpt-5.6-terra";
 async generateMarketingAnalysis(input:MarketingAnalysisInput){
  const moduleName="openai"; const imported=await import(moduleName); const OpenAI=imported.default; const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
  const response=await client.responses.create({model:this.model,instructions:"You are a rigorous Head of Marketing. Use only the supplied evidence, distinguish observation from hypothesis, prioritize commercial outcomes, and return valid JSON only.",input:input.prompt,text:{format:{type:"json_schema",name:"marketing_analysis",strict:true,schema:{type:"object",additionalProperties:false,properties:{observedSignal:{type:"string"},interpretation:{type:"string"},hypothesis:{type:"string"},recommendation:{type:"string"},confidence:{type:"string",enum:["LOW","MEDIUM","HIGH"]},successMetric:{type:"string"},reviewWindow:{type:"string"},strategicOutput:{type:"string"},numericClaims:{type:"array",items:{type:"object",additionalProperties:false,properties:{value:{type:"number"},unit:{type:["string","null"]},kind:{type:"string",enum:["observed","calculated","proposed","external_reference"]},label:{type:"string"},evidenceIds:{type:["array","null"],items:{type:"string"}},inputIds:{type:["array","null"],items:{type:"string"}},calculation:{type:["string","null"]},rationale:{type:["string","null"]},sourceUrl:{type:["string","null"]}},required:["value","unit","kind","label","evidenceIds","inputIds","calculation","rationale","sourceUrl"]}}},required:["observedSignal","interpretation","hypothesis","recommendation","confidence","successMetric","reviewWindow","strategicOutput","numericClaims"]}}},store:false});
  return marketingAnalysisSchema.parse(JSON.parse(response.output_text));
 }
}
