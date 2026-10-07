import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { annotateEvidence } from "../dist/semantics/annotate.js";
import { parseSemanticConfig, resolveCanonicalIdentity } from "../dist/semantics/config.js";
import { canonicalEntitiesForSource, highestEvidenceTier, metricDefinition, semanticContractForSource, semanticMetrics } from "../dist/semantics/registry.js";
import { campaignPipelineAnalysis } from "../dist/tools/executive.js";
import { migrateSemanticConfig, semanticMigrationPath } from "../dist/semantics/migrations.js";
import { unmatchedSemanticRecords } from "../dist/semantics/diagnostics.js";
import { canonicalEntityTypes, METRIC_DEFINITIONS_VERSION, SEMANTIC_SCHEMA_VERSION } from "../dist/semantics/types.js";

const example = JSON.parse(await readFile(new URL("../config/semantic-model.example.json", import.meta.url), "utf8"));
const config = parseSemanticConfig(example);

assert.equal(config.version, SEMANTIC_SCHEMA_VERSION);
assert.equal(config.definitions_version, METRIC_DEFINITIONS_VERSION);
for (const entity of ["Product", "ConversionEvent", "Contact", "Learning"]) {
  assert(canonicalEntityTypes.includes(entity));
}

const adsCampaign = resolveCanonicalIdentity("campaigns", "google_ads", "Enterprise Search 2026", config);
const crmCampaign = resolveCanonicalIdentity("campaigns", "hubspot", "enterprise-search", config);
assert.equal(adsCampaign.canonicalKey, crmCampaign.canonicalKey);
assert.equal(adsCampaign.confidence, 1);

const unknown = resolveCanonicalIdentity("campaigns", "google_ads", "Unmapped Campaign", config);
assert.equal(unknown.mapping, "unmapped");
assert.match(unknown.canonicalKey, /^source:google_ads:campaigns:/);
assert(!unknown.canonicalKey.includes(" "));

const ga4 = semanticMetrics("ga4", { sessions: 20, keyEvents: 3, revenue: 120 });
assert.deepEqual(ga4.map((metric) => metric.metricId), ["sessions", "analytics_key_events", "analytics_reported_revenue"]);
assert.equal(highestEvidenceTier(ga4), "T4_PLATFORM_OUTCOME");

const crm = semanticMetrics("hubspot", { revenue: 400, pipeline: 800 });
assert.equal(highestEvidenceTier(crm), "T1_REVENUE");
assert(metricDefinition("analytics_key_events").neverMeans.includes("MQL"));
for (const source of ["google_search_console", "ga4", "google_ads", "meta_ads", "linkedin_ads", "paid_media_csv", "hubspot", "salesforce", "generic_crm_csv", "generic_crm_api"]) {
  assert(semanticContractForSource(source).length > 0, `${source} lacks a semantic metric contract`);
  assert(canonicalEntitiesForSource(source).length > 0, `${source} lacks a canonical entity contract`);
}
assert.equal(migrateSemanticConfig(example).version, semanticMigrationPath.currentVersion);
assert.throws(() => migrateSemanticConfig({ ...example, version: 2 }), /newer than supported/);

const annotated = annotateEvidence({
  id: "evidence-1",
  source: "ga4",
  property: "properties/123",
  period: { startDate: "2026-01-01", endDate: "2026-01-31" },
  retrievedAt: "2026-02-01T00:00:00.000Z",
  segment: "/enterprise",
  mapping: "inferred",
  landingPage: "/enterprise",
  metrics: { sessions: 20, keyEvents: 3 },
  provenance: { method: "api", limitations: [] }
}, config);
assert.equal(annotated.metrics.sessions, 20);
assert.equal(annotated.semantic.highestEvidenceTier, "T4_PLATFORM_OUTCOME");
assert.equal(annotated.semantic.identity.landingPage, "page:enterprise");
const queue = unmatchedSemanticRecords([{ ...annotated, id: "evidence-2", campaign: "Unmapped Campaign", landingPage: undefined, semantic: { ...annotated.semantic, identity: { campaign: unknown.canonicalKey, mapping: "unmapped", confidence: 0.25, provenance: { campaign: { mapping: "unmapped", confidence: 0.25, sourceValue: "Unmapped Campaign" } } } } }]);
assert.equal(queue.length, 1);
assert.equal(queue[0].sourceValue, "Unmapped Campaign");

const paidEvidence = annotateEvidence({ id:"paid-1",source:"google_ads",property:"1",period:{startDate:"2026-01-01",endDate:"2026-01-31"},retrievedAt:"2026-02-01T00:00:00.000Z",segment:"Enterprise",mapping:"configured",campaign:"Enterprise Search 2026",metrics:{spend:100,conversions:10},provenance:{method:"test",limitations:[]} },config);
const crmEvidence = annotateEvidence({ id:"crm-1",source:"hubspot",property:"1",period:{startDate:"2026-01-01",endDate:"2026-01-31"},retrievedAt:"2026-02-01T00:00:00.000Z",segment:"Enterprise",mapping:"configured",campaign:"enterprise-search",metrics:{pipeline:1000,revenue:250},provenance:{method:"test",limitations:[]} },config);
const joined = campaignPipelineAnalysis({google:{generatedAt:"2026-02-01T00:00:00.000Z",mappingVersion:1,evidence:[],opportunities:[],warnings:[]},evidence:[paidEvidence,crmEvidence],unmatchedSemanticRecords:[],warnings:[]});
assert.equal(joined.length,1);
assert.equal(joined[0].match,"MATCHED");
assert.equal(joined[0].mapping,"configured");
assert.deepEqual(joined[0].evidenceIds,["paid-1","crm-1"]);

console.log("Semantic-layer checks passed.");
