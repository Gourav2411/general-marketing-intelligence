import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
process.env.AI_PROVIDER="none";
const snapshotDir=mkdtempSync(join(tmpdir(),"gmi-smoke-"));process.env.MARKETING_SNAPSHOT_DIR=snapshotDir;
for(const key of ["GSC_SITE_URL","GA4_PROPERTY_ID","GOOGLE_APPLICATION_CREDENTIALS","GOOGLE_ADS_CUSTOMER_ID","GOOGLE_ADS_DEVELOPER_TOKEN","GOOGLE_ADS_CLIENT_ID","GOOGLE_ADS_CLIENT_SECRET","GOOGLE_ADS_REFRESH_TOKEN","HUBSPOT_ACCESS_TOKEN","SALESFORCE_INSTANCE_URL","SALESFORCE_ACCESS_TOKEN","GENERIC_CRM_CSV"])delete process.env[key];
const transport=new StdioClientTransport({command:process.execPath,args:["dist/index.js"],cwd:process.cwd(),stderr:"inherit"});
const client=new Client({name:"general-marketing-smoke-test",version:"1.0.0"});
console.log("Connecting to MCP server over stdio…");
await client.connect(transport);
console.log("✓ stdio connection established");
const listed=await client.listTools();
console.log(`✓ tools/list discovered ${listed.tools.length} tools`);
assert.deepEqual(listed.tools.map(t=>t.name).sort(),["audit_paid_search","brand_vs_nonbrand_search","budget_allocator","build_growth_bet","campaign_to_pipeline_report","channel_health_scorecard","connection_status","connector_catalog","content_decay_monitor","content_strategy","create_campaign_asset","design_paid_experiment","diagnose_setup","executive_growth_review","experiment_review","find_seo_opportunities","ga4_acquisition_report","generic_crm_csv_report","google_ads_report","google_search_console_report","growth_snapshot","hubspot_funnel_report","landing_page_opportunity_report","live_opportunity_radar","measurement_quality_audit","opportunity_radar","paid_performance_review","recommend_next_growth_bet","salesforce_funnel_report","save_evidence_snapshot","snapshot_history","weekly_growth_brief"]);
const calls=[
 ["growth_snapshot",{}],["find_seo_opportunities",{}],["audit_paid_search",{}],["opportunity_radar",{}],["weekly_growth_brief",{}],
 ["paid_performance_review",{}],["budget_allocator",{incremental_budget:100000}],
 ["design_paid_experiment",{segment:"Enterprise",opportunity:"Enterprise workflow platform",budget:20000}],
 ["content_strategy",{opportunity:"Enterprise workflow platform",segment:"Enterprise",persona:"VP Operations"}],
 ["create_campaign_asset",{asset_type:"landing_page",opportunity:"Enterprise workflow platform",segment:"Enterprise"}],
 ["create_campaign_asset",{asset_type:"executive_roundtable_brief",opportunity:"Enterprise workflow platform",segment:"Enterprise"}],
 ["build_growth_bet",{segment:"Enterprise"}],["connection_status",{}]
];
for(const [name,args] of calls){const result=await client.callTool({name,arguments:args});assert.equal(result.isError,undefined);assert.match(result.content[0].text,/demo data only/i);assert.ok(result.structuredContent);console.log(`✓ ${name}${args.asset_type?` (${args.asset_type})`:""}`)}
for(const [name,args] of [["diagnose_setup",{}],["connector_catalog",{}],["live_opportunity_radar",{}],["snapshot_history",{}],["save_evidence_snapshot",{}],["content_decay_monitor",{}],["executive_growth_review",{}],["channel_health_scorecard",{}],["landing_page_opportunity_report",{}],["campaign_to_pipeline_report",{}],["measurement_quality_audit",{}],["experiment_review",{name:"Smoke",baseline_spend:100,current_spend:100,baseline_conversions:1,current_conversions:2}],["recommend_next_growth_bet",{}],["generic_crm_csv_report",{path:"templates/crm-funnel.csv",start_date:"2026-08-01",end_date:"2026-08-31"}]]){const result=await client.callTool({name,arguments:args});assert.equal(result.isError,undefined);assert.ok(result.structuredContent);console.log(`✓ ${name}`)}
for(const name of ["google_search_console_report","ga4_acquisition_report","google_ads_report","hubspot_funnel_report","salesforce_funnel_report","brand_vs_nonbrand_search"]){const result=await client.callTool({name,arguments:name==="brand_vs_nonbrand_search"?{brand_terms:["example"]}:{}});assert.equal(result.isError,true);assert.match(result.content[0].text,/not configured|must be a valid HTTPS origin/);console.log(`✓ ${name} fails safely without credentials`)}
await transport.close();
rmSync(snapshotDir,{recursive:true,force:true});
process.exit(0);
