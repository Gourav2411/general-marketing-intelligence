import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import assert from "node:assert/strict";
process.env.AI_PROVIDER="none";
delete process.env.GSC_SITE_URL;delete process.env.GA4_PROPERTY_ID;delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
const transport=new StdioClientTransport({command:process.execPath,args:["dist/index.js"],cwd:process.cwd(),stderr:"inherit"});
const client=new Client({name:"general-marketing-smoke-test",version:"1.0.0"});
console.log("Connecting to MCP server over stdio…");
await client.connect(transport);
console.log("✓ stdio connection established");
const listed=await client.listTools();
console.log(`✓ tools/list discovered ${listed.tools.length} tools`);
assert.deepEqual(listed.tools.map(t=>t.name).sort(),["audit_paid_search","budget_allocator","build_growth_bet","connection_status","content_strategy","create_campaign_asset","design_paid_experiment","find_seo_opportunities","ga4_acquisition_report","google_search_console_report","growth_snapshot","opportunity_radar","paid_performance_review","weekly_growth_brief"]);
const calls=[
 ["growth_snapshot",{}],["find_seo_opportunities",{}],["audit_paid_search",{}],["opportunity_radar",{}],["weekly_growth_brief",{}],
 ["paid_performance_review",{}],["budget_allocator",{incremental_budget:100000}],
 ["design_paid_experiment",{segment:"Enterprise",opportunity:"Enterprise workflow platform",budget:20000}],
 ["content_strategy",{opportunity:"Enterprise workflow platform",segment:"Enterprise",persona:"VP Operations"}],
 ["create_campaign_asset",{asset_type:"landing_page",opportunity:"Enterprise workflow platform",segment:"Enterprise"}],
 ["create_campaign_asset",{asset_type:"executive_roundtable_brief",opportunity:"Enterprise workflow platform",segment:"Enterprise"}],
 ["build_growth_bet",{segment:"Enterprise"}],["connection_status",{}]
];
for(const [name,args] of calls){const result=await client.callTool({name,arguments:args});assert.equal(result.isError,undefined);assert.match(result.content[0].text,/demo data only/i);console.log(`✓ ${name}${args.asset_type?` (${args.asset_type})`:""}`)}
for(const name of ["google_search_console_report","ga4_acquisition_report"]){const result=await client.callTool({name,arguments:{}});assert.equal(result.isError,true);assert.match(result.content[0].text,/not configured/);console.log(`✓ ${name} fails safely without credentials`)}
await transport.close();
process.exit(0);
