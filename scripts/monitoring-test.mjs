import assert from "node:assert/strict";
import {mkdtempSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {evaluateMonitoringSignals} from "../dist/monitoring/engine.js";
import {MonitoringStore} from "../dist/monitoring/store.js";

const now=new Date().toISOString(),scope={tenantId:"tenant-a",accountId:"account-a"},evidence=(id,metrics,source="google_ads")=>({id,source,property:"property",period:{startDate:"2026-09-01",endDate:"2026-09-30"},retrievedAt:now,segment:"Enterprise",mapping:"configured",metrics,provenance:{method:"fixture",limitations:[]}}),previous={generatedAt:now,mappingVersion:1,evidence:[evidence("prior",{clicks:100,spend:1000,pipeline:5000})],opportunities:[],warnings:[]},current={generatedAt:now,mappingVersion:1,evidence:[evidence("current",{clicks:40,spend:500,leads:20,pipeline:0})],opportunities:[],warnings:["Authorization token abcdefghijklmnopqrstuvwxyz123456 failed for analyst@example.com"]};
const signals=evaluateMonitoringSignals(current,previous,48);
assert.ok(signals.some(row=>row.kind==="content_decay"&&row.businessDecision));
assert.ok(signals.some(row=>row.kind==="funnel_leakage"));
assert.ok(signals.some(row=>row.kind==="pacing"));
assert.ok(signals.every(row=>!row.summary.includes("abcdefghijklmnopqrstuvwxyz123456")&&!row.summary.includes("analyst@example.com")));

const dir=mkdtempSync(join(tmpdir(),"gmi-monitoring-")),store=new MonitoringStore(join(dir,"monitoring.sqlite"));
const first=store.begin(scope,"cycle-2026-10-12"),retry=store.begin(scope,"cycle-2026-10-12");
assert.equal(first.created,true);assert.equal(retry.created,false);assert.equal(first.job.id,retry.job.id);
const input={tenantId:scope.tenantId,accountId:scope.accountId,kind:"anomaly",severity:"warning",title:"Pipeline changed",businessDecision:"Whether to reallocate",summary:"Pipeline fell",recommendedAction:"Investigate",evidenceIds:["e1"],fingerprintSeed:"pipeline:down"};
const alert1=store.upsertAlert(input),alert2=store.upsertAlert({...input,summary:"Pipeline fell again"});
assert.equal(alert1.created,true);assert.equal(alert2.created,false);assert.equal(alert2.alert.occurrences,2);assert.equal(store.listAlerts(scope).length,1);
Object.assign(first.job,{status:"failed",completedAt:now,checkpoint:now});store.finish(first.job);const resumed=store.begin(scope,"cycle-2026-10-12");assert.equal(resumed.resumed,true);assert.equal(resumed.job.id,first.job.id);Object.assign(resumed.job,{status:"completed",completedAt:now});store.finish(resumed.job);assert.equal(store.listJobs(scope)[0].status,"completed");store.close();
console.log("✓ monitoring jobs are idempotent, alerts deduplicate, signals name decisions and secrets are redacted");
