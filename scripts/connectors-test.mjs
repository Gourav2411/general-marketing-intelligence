import assert from "node:assert/strict";
import { buildSearchConsoleReport } from "../dist/connectors/google/searchConsole.js";
import { buildGa4Report } from "../dist/connectors/google/ga4.js";
import { parseGoogleAdsRows } from "../dist/connectors/google/googleAds.js";
import { classifyGoogleError, withRetry } from "../dist/connectors/google/resilience.js";
import { genericCrmCsvReport } from "../dist/connectors/crm/csv.js";
import { normalizeGoogleEvidence } from "../dist/evidence/normalize.js";
import { hubspotFunnelReport } from "../dist/connectors/crm/hubspot.js";
import { salesforceFunnelReport } from "../dist/connectors/crm/salesforce.js";

process.env.GSC_SITE_URL="sc-domain:example.com";process.env.GA4_PROPERTY_ID="123456789";
const gsc=await buildSearchConsoleReport({startDate:"2026-08-01",endDate:"2026-08-28",rowLimit:10},async(start)=>start==="2026-08-01"?[{keys:["enterprise workflow","https://example.com/enterprise"],clicks:20,impressions:1000,ctr:.02,position:7}]:[{keys:["enterprise workflow","https://example.com/enterprise"],impressions:800}]);
assert.equal(gsc.rows[0].impressionGrowth,.25);assert.equal(gsc.meta.partial,false);console.log("✓ mocked Search Console response produces code-calculated comparison evidence");

const ga4=await buildGa4Report({days:28},async()=>({rows:[{dimensionValues:[{value:"google / organic"},{value:"Organic Search"},{value:"(organic)"},{value:"/enterprise"},{value:"India"},{value:"desktop"}],metricValues:[{value:"100"},{value:"80"},{value:"5"},{value:"250"}]}],metadata:{samplingMetadatas:[]}}));
assert.equal(ga4.rows[0].keyEventsPerSession,.05);assert.equal(ga4.rows[0].channelGroup,"Organic Search");console.log("✓ mocked GA4 response produces typed acquisition evidence");

const ads=parseGoogleAdsRows("campaign",[{results:[{campaign:{name:"Enterprise Search"},segments:{device:"DESKTOP"},metrics:{impressions:"1000",clicks:"50",costMicros:"125000000",conversions:4,conversionsValue:1000,searchImpressionShare:.5,searchBudgetLostImpressionShare:.2}}]}]);
assert.equal(ads[0].spend,125);assert.equal(ads[0].impressionShare,.5);console.log("✓ mocked Google Ads GAQL payload converts micros and shares in code");

const crm=genericCrmCsvReport({path:"templates/crm-funnel.csv",startDate:"2026-08-01",endDate:"2026-08-31"});assert.equal(crm.summary.opportunities,1);assert.equal(crm.summary.pipeline,25000);console.log("✓ generic CRM CSV contract produces funnel and pipeline evidence");

const originalFetch=globalThis.fetch;process.env.HUBSPOT_ACCESS_TOKEN="mock";globalThis.fetch=async url=>({ok:true,json:async()=>String(url).includes("contacts")?{results:[{id:"contact-1",properties:{createdate:"2026-08-10T00:00:00Z",lifecyclestage:"marketingqualifiedlead",hs_analytics_source:"ORGANIC_SEARCH",hs_analytics_source_data_1:"Enterprise",hs_analytics_source_data_2:"google"}}]}:{results:[{id:"deal-1",properties:{createdate:"2026-08-12T00:00:00Z",dealstage:"qualified",amount:"12000",pipeline:"Enterprise",hs_is_closed_won:"false",hs_analytics_source:"Enterprise"}}]}});const hubspot=await hubspotFunnelReport({startDate:"2026-08-01",endDate:"2026-08-31",rowLimit:10});assert.equal(hubspot.summary.mqls,1);assert.equal(hubspot.summary.pipeline,12000);console.log("✓ mocked HubSpot reads lifecycle and deal evidence without PII fields");

process.env.SALESFORCE_INSTANCE_URL="https://example.my.salesforce.com";process.env.SALESFORCE_ACCESS_TOKEN="mock";globalThis.fetch=async url=>({ok:true,json:async()=>decodeURIComponent(String(url)).includes("FROM Lead")?{records:[{Id:"lead-1",Status:"MQL",LeadSource:"Organic",CreatedDate:"2026-08-10T00:00:00Z"}]}:{records:[{Id:"opp-1",StageName:"Qualification",Amount:15000,IsWon:false,LeadSource:"Paid Search",CampaignId:"campaign-1",CreatedDate:"2026-08-11T00:00:00Z"}]}});const salesforce=await salesforceFunnelReport({startDate:"2026-08-01",endDate:"2026-08-31",rowLimit:10});assert.equal(salesforce.summary.mqls,1);assert.equal(salesforce.summary.pipeline,15000);console.log("✓ mocked Salesforce SOQL reads lead and opportunity evidence");globalThis.fetch=originalFetch;delete process.env.HUBSPOT_ACCESS_TOKEN;delete process.env.SALESFORCE_INSTANCE_URL;delete process.env.SALESFORCE_ACCESS_TOKEN;

const normalized=normalizeGoogleEvidence(gsc,ga4,{version:1,segments:[{name:"Enterprise",query_patterns:["enterprise"],landing_page_patterns:["/enterprise"],campaign_patterns:[]}]});assert.equal(normalized.opportunities[0].segment,"Enterprise");assert.equal(normalized.opportunities[0].confidence,"HIGH");console.log("✓ GSC and GA4 normalize into one explicitly mapped opportunity");

let attempts=0;const recovered=await withRetry(async()=>{attempts++;if(attempts<3){const error=new Error("unavailable");error.status=503;throw error}return "ok"},{attempts:3,baseDelayMs:0});assert.equal(recovered,"ok");assert.equal(attempts,3);assert.equal(classifyGoogleError(Object.assign(new Error("forbidden"),{status:403})).kind,"PERMISSION");console.log("✓ transient failures retry and permission errors are classified");
