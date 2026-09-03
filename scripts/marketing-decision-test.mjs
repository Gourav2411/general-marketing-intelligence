import assert from "node:assert/strict";
import { decideMarketingAction } from "../dist/analysis/marketingDecision.js";
const cases=[
 ["Cheap leads / bad business",{leads:100,mqls:8,sqls:2,spend:10000,pipeline:20000},"DO NOT SCALE"],
 ["Expensive leads / strong pipeline",{leads:20,mqls:10,sqls:5,spend:50000,pipeline:3000000},"CONTROLLED SCALE TEST"],
 ["Rising search only",{searchGrowth:.4,commercialIntent:true},"VALIDATE"],
 ["Multi-signal opportunity",{searchGrowth:.3,commercialIntent:true,paidEvidence:true,leads:30,sqls:7,spend:40000,pipeline:3000000},"CONTROLLED SCALE TEST"],
 ["Vanity traffic",{searchGrowth:.05,commercialIntent:false,paidEvidence:true,leads:100,sqls:2,spend:50000,pipeline:100000},"DO NOT SCALE"],
 ["Field marketing signal",{searchGrowth:.3,commercialIntent:true,paidEvidence:true,leads:30,sqls:7,spend:40000,pipeline:3000000,enterpriseRelevant:true,targetAccountEngagement:true},"COORDINATED GROWTH BET"]
];
for(const [name,input,expected] of cases){const result=decideMarketingAction(input);assert.equal(result.action,expected);console.log(`✓ ${name}: ${result.action}`)}
