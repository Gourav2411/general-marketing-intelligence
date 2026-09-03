import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

const run=(command,args,env={})=>{const result=spawnSync(command,args,{cwd:process.cwd(),encoding:"utf8",env:{...process.env,...env}});if(result.status!==0)throw new Error(result.stderr||result.stdout);return result.stdout};

const imported=run(process.execPath,["scripts/import-csv.mjs","test-upload"]);
assert.match(imported,/search-console\.csv: 5 rows validated/);
assert.match(imported,/google-ads\.csv: 4 rows validated/);
assert.match(imported,/conversions\.csv: 6 rows validated/);
console.log("✓ local CSV fixture validates and imports");

const budget=run(process.execPath,["scripts/demo.mjs","budget"],{DATA_MODE:"local",AI_PROVIDER:"none"});
assert.match(budget,/Local CSV data supplied by the operator/);
assert.match(budget,/Enterprise Workflow/);
assert.doesNotMatch(budget,/Imaginary Campaign/);
console.log("✓ budget allocation follows imported campaigns");

const enterprise=run(process.execPath,["--input-type=module","-e",'import("./dist/tools/growthBet.js").then(({buildGrowthBet})=>console.log(buildGrowthBet(undefined,"Enterprise")))'],{DATA_MODE:"local",AI_PROVIDER:"none"});
assert.match(enterprise,/Growth Bet — Enterprise/);
assert.match(enterprise,/enterprise workflow platform/);
assert.doesNotMatch(enterprise,/Imaginary Segment/);
console.log("✓ selected segment controls the growth bet");
