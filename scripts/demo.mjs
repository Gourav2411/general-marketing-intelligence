import { opportunityRadar } from "../dist/tools/opportunityRadar.js";
import { budgetAllocator } from "../dist/tools/performanceAgent.js";
import { buildGrowthBet } from "../dist/tools/growthBet.js";
import { createCampaignAsset } from "../dist/tools/contentAgent.js";

const section=process.argv[2]??"growth-bet";
const outputs={
  radar:()=>opportunityRadar(3),
  budget:()=>budgetAllocator(100000),
  "growth-bet":()=>buildGrowthBet(undefined,"Enterprise",100000),
  roundtable:()=>createCampaignAsset("executive_roundtable_brief","Enterprise workflow platform","Enterprise","VP Operations")
};
if(!outputs[section]){
  console.error("Usage: npm run demo -- [radar|budget|growth-bet|roundtable]");
  process.exit(1);
}
console.log(outputs[section]());
