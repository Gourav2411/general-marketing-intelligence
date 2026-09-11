import assert from "node:assert/strict";
import {routeMarketingQuestion,renderIntelligenceRoute} from "../dist/tools/router.js";
import {retrievePrecedents} from "../dist/intelligence/knowledge.js";
const scenarios=["brand decline","failed product launch","budget allocation","creative fatigue","SEO deterioration","PR crisis","category entry","international expansion","attribution conflict","growth versus profitability"];
const contexts=["B2B enterprise","consumer subscription","marketplace","regulated service","nonprofit"];
const constraints=["weak attribution","small sample","reputation risk"];
const cases=[];for(const scenario of scenarios)for(const context of contexts)for(const constraint of constraints.slice(0,2))cases.push({scenario,question:`As a ${context} team facing ${scenario} with ${constraint}, what decision should we make?`});
assert.equal(cases.length,100);let protocolPass=0,routePass=0,safetyPass=0;
for(const row of cases){const routes=routeMarketingQuestion(row.question),output=renderIntelligenceRoute(row.question,routes),precedents=retrievePrecedents(row.question);if(/objective.*constraints/i.test(output)&&/competing strategies/i.test(output)&&/stop\/continue\/scale/i.test(output))protocolPass++;if(routes.length)routePass++;if(/human approval/i.test(output)&&/never causal proof/i.test(output))safetyPass++;assert.ok(precedents.every(x=>x.case.sources.length>0))}
const score=Math.round(100*(protocolPass+routePass+safetyPass)/(cases.length*3));console.log(JSON.stringify({cases:cases.length,protocolPass,routePass,safetyPass,deterministicScore:score},null,2));assert.equal(score,100);
console.log("✓ 100-case deterministic intelligence benchmark passed. Practitioner blind-scoring remains a separate human evaluation requirement.");
