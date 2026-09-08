import assert from "node:assert/strict";
import { comparisonDateWindow } from "../dist/connectors/google/dates.js";
import { buildGa4DashboardResult, buildGscDashboardResult } from "../dist/dashboard/google.js";
import { querySchema } from "../dist/dashboard/query.js";

const dates=comparisonDateWindow("2026-08-01","2026-08-02",28,"previous_period");
const gscQuery=querySchema.parse({dataset:"gsc_live",dimension:"country",metric:"clicks",chart:"geo",limit:10});
const gsc=buildGscDashboardResult(gscQuery,[{keys:["usa"],clicks:120},{keys:["ind"],clicks:80}],[{keys:["usa"],clicks:100},{keys:["ind"],clicks:100}],dates);
assert.deepEqual(gsc.points.map(point=>point.value),[120,80]);
assert.equal(gsc.points[0].previousValue,100);
assert.equal(gsc.summary.percentChange,0);
assert.equal(gsc.calculation,"server_side_deterministic");

const gaQuery=querySchema.parse({dataset:"ga4_live",dimension:"date",metric:"sessions",chart:"line",limit:10,sort:"ascending"});
const ga=buildGa4DashboardResult(gaQuery,[{dimensionValues:[{value:"20260801"}],metricValues:[{value:"40"}]},{dimensionValues:[{value:"20260802"}],metricValues:[{value:"60"}]}],[{dimensionValues:[{value:"20260730"}],metricValues:[{value:"25"}]},{dimensionValues:[{value:"20260731"}],metricValues:[{value:"50"}]}],dates);
assert.deepEqual(ga.points.map(point=>point.label),["2026-08-01","2026-08-02"]);
assert.deepEqual(ga.points.map(point=>point.previousValue),[25,50]);
assert.equal(ga.summary.absoluteChange,25);

const kpiQuery=querySchema.parse({dataset:"gsc_live",dimension:"query",metric:"impressions",chart:"kpi"});
const kpi=buildGscDashboardResult(kpiQuery,[{impressions:500}],[{impressions:400}],dates);
assert.equal(kpi.points[0].label,"Total");
assert.equal(kpi.summary.percentChange,.25);
console.log("Live GSC/GA4 dashboard transformations and comparisons passed.");
