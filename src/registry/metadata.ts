import type {RiskClass} from "../actions/types.js";
export interface ToolMetadata {name:string;description:string;category:"executive"|"acquisition"|"content"|"measurement"|"governance"|"execution";riskLevel:RiskClass;permissions:string[];evidenceRequirements:string[];}
export const architectureToolMetadata:ToolMetadata[]=[
 {name:"marketing_intelligence_router",description:"Route a business question into an evidence workflow.",category:"executive",riskLevel:"R0",permissions:["read:evidence"],evidenceRequirements:[]},
 {name:"recommend_next_growth_bet",description:"Recommend a bounded evidence-backed growth bet.",category:"executive",riskLevel:"R0",permissions:["read:evidence"],evidenceRequirements:["normalized evidence"]},
 {name:"preview_marketing_action",description:"Create an immutable preview for human approval.",category:"governance",riskLevel:"R1",permissions:["draft:configured-source"],evidenceRequirements:["risk declaration"]},
 {name:"execute_approved_action",description:"Execute one exact, unexpired approved payload.",category:"execution",riskLevel:"R1",permissions:["execute:declared-adapter"],evidenceRequirements:["approval","payload hash","tenant match"]},
 {name:"run_monitoring_cycle",description:"Ingest evidence and evaluate decision-oriented signals.",category:"measurement",riskLevel:"R0",permissions:["read:configured-sources","write:local-state"],evidenceRequirements:["configured connectors"]},
 {name:"monitoring_status",description:"Inspect monitoring job state and checkpoints.",category:"governance",riskLevel:"R0",permissions:["read:local-state"],evidenceRequirements:[]},
 {name:"monitoring_alerts",description:"Inspect deduplicated decision-oriented alerts.",category:"executive",riskLevel:"R0",permissions:["read:local-state"],evidenceRequirements:["monitoring cycle"]}
];
const familyRules:[RegExp,ToolMetadata["category"]][]=[[/decision|growth|executive|router|brief|recommend/,"executive"],[/action|approval|permission|audit/,"governance"],[/campaign|paid|ads|acquisition|crm|pipeline/,"acquisition"],[/content|seo|keyword|landing|brand/,"content"],[/measurement|experiment|snapshot|dashboard|report|diagnos|connection|catalog/,"measurement"]];
export function resolveToolMetadata(name:string,description:string):ToolMetadata{const declared=architectureToolMetadata.find(row=>row.name===name);if(declared)return declared;const category=familyRules.find(([pattern])=>pattern.test(name))?.[1]??"measurement";return {name,description,category,riskLevel:"R0",permissions:["read:configured-sources"],evidenceRequirements:[]}}
export const registeredToolMetadata=new Map<string,ToolMetadata>();
export function registerToolMetadata(name:string,description:string){const metadata=resolveToolMetadata(name,description);registeredToolMetadata.set(name,metadata);return metadata}
