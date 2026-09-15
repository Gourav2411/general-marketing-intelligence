import type {RiskClass} from "../actions/types.js";
export interface ToolMetadata {name:string;description:string;category:"executive"|"acquisition"|"content"|"measurement"|"governance"|"execution";riskLevel:RiskClass;permissions:string[];evidenceRequirements:string[];}
export const architectureToolMetadata:ToolMetadata[]=[
 {name:"marketing_intelligence_router",description:"Route a business question into an evidence workflow.",category:"executive",riskLevel:"R0",permissions:["read:evidence"],evidenceRequirements:[]},
 {name:"recommend_next_growth_bet",description:"Recommend a bounded evidence-backed growth bet.",category:"executive",riskLevel:"R0",permissions:["read:evidence"],evidenceRequirements:["normalized evidence"]},
 {name:"preview_marketing_action",description:"Create an immutable preview for human approval.",category:"governance",riskLevel:"R1",permissions:["draft:configured-source"],evidenceRequirements:["risk declaration"]},
 {name:"execute_approved_action",description:"Execute one exact, unexpired approved payload.",category:"execution",riskLevel:"R1",permissions:["execute:declared-adapter"],evidenceRequirements:["approval","payload hash","tenant match"]}
];
