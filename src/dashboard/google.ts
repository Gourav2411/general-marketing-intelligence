import { BetaAnalyticsDataClient, protos } from "@google-analytics/data";
import { google, type searchconsole_v1 } from "googleapis";
import { comparisonDateWindow } from "../connectors/google/dates.js";
import { withRetry } from "../connectors/google/resilience.js";
import { dashboardCatalog, querySchema, type DashboardPoint, type DashboardQuery } from "./query.js";

type GscRow=searchconsole_v1.Schema$ApiDataRow;
type GaRow=protos.google.analytics.data.v1beta.IRow;
const gscDimensions={date:"date",query:"query",landing_page:"page",country:"country",device:"device"} as const;
const gaDimensions={date:"date",country:"country",device:"deviceCategory",landing_page:"landingPagePlusQueryString",channel:"sessionDefaultChannelGroup",source_medium:"sessionSourceMedium",campaign:"sessionCampaignName"} as const;
const gaMetrics={sessions:"sessions",users:"totalUsers",key_events:"keyEvents",key_event_rate:"sessionKeyEventRate",revenue:"totalRevenue"} as const;
const percent=(current:number,previous:number)=>previous?(current-previous)/previous:null;
const formatDate=(value:string)=>/^\d{8}$/.test(value)?`${value.slice(0,4)}-${value.slice(4,6)}-${value.slice(6)}`:value;
const filterRows=<T>(rows:T[],filter:string,label:(row:T)=>string)=>filter?rows.filter(row=>label(row).toLowerCase().includes(filter.toLowerCase())):rows;
function merge(current:{label:string;value:number}[],previous:{label:string;value:number}[],query:DashboardQuery){
  const prior=new Map(previous.map(item=>[item.label,item.value]));
  const points:DashboardPoint[]=current.map((item,index)=>({label:item.label,value:item.value,previousValue:query.dimension==="date"?previous[index]?.value??0:prior.get(item.label)??0,rows:1}));
  return (query.dimension==="date"?points.sort((a,b)=>a.label.localeCompare(b.label)):points.sort((a,b)=>query.sort==="descending"?b.value-a.value:a.value-b.value)).slice(0,query.limit);
}
const summarize=(points:DashboardPoint[])=>{const current=points.reduce((sum,row)=>sum+row.value,0),previous=points.reduce((sum,row)=>sum+(row.previousValue??0),0);return {groups:points.length,total:current,previousTotal:previous,absoluteChange:current-previous,percentChange:percent(current,previous),matchedRows:points.length}};
export function buildGscDashboardResult(query:DashboardQuery,currentRows:GscRow[],previousRows:GscRow[],dates:ReturnType<typeof comparisonDateWindow>){
  const value=(row:GscRow)=>query.metric==="clicks"?Number(row.clicks??0):query.metric==="impressions"?Number(row.impressions??0):query.metric==="ctr"?Number(row.ctr??0):Number(row.position??0),convert=(rows:GscRow[])=>filterRows(rows,query.filter,row=>String(row.keys?.[0]??"Total")).map(row=>({label:query.chart==="kpi"?"Total":formatDate(String(row.keys?.[0]??"Unknown")),value:value(row)})),points=merge(convert(currentRows),convert(previousRows),query);
  return {query,points,summary:summarize(points),period:dates,source:{name:"Google Search Console",property:process.env.GSC_SITE_URL,retrievedAt:new Date().toISOString()},warnings:["Search Console can omit anonymized and low-volume queries.",...(query.metric==="ctr"||query.metric==="average_position"?["Rates and average position are dimension-level values; do not sum them across groups."]:[])],calculation:"server_side_deterministic"};
}
export function buildGa4DashboardResult(query:DashboardQuery,currentRows:GaRow[],previousRows:GaRow[],dates:ReturnType<typeof comparisonDateWindow>){
  const convert=(rows:GaRow[])=>filterRows(rows,query.filter,row=>String(row.dimensionValues?.[0]?.value??"Total")).map(row=>({label:query.chart==="kpi"?"Total":formatDate(String(row.dimensionValues?.[0]?.value??"Unknown")),value:Number(row.metricValues?.[0]?.value??0)})),points=merge(convert(currentRows),convert(previousRows),query);
  return {query,points,summary:summarize(points),period:dates,source:{name:"Google Analytics 4",property:process.env.GA4_PROPERTY_ID,retrievedAt:new Date().toISOString()},warnings:["GA4 key events and revenue use the property's configured definitions; verify them before commercial decisions.",...(query.metric==="key_event_rate"?["Key-event rate is a GA4 rate, not CRM conversion or pipeline."]:[])],calculation:"server_side_deterministic"};
}
export async function runGoogleDashboardQuery(input:unknown){
  const query=querySchema.parse(input),catalog=dashboardCatalog[query.dataset];if(query.dataset!=="gsc_live"&&query.dataset!=="ga4_live")throw new Error("A live Google dataset is required");if(!(catalog.dimensions as readonly string[]).includes(query.dimension)||!(catalog.metrics as readonly string[]).includes(query.metric))throw new Error("The requested live dimension or metric is not allowed");
  if(!process.env.GOOGLE_APPLICATION_CREDENTIALS)throw new Error("GOOGLE_APPLICATION_CREDENTIALS is not configured");const dates=comparisonDateWindow(query.start_date,query.end_date,28,query.comparison);
  if(query.dataset==="gsc_live"){
    const siteUrl=process.env.GSC_SITE_URL;if(!siteUrl)throw new Error("GSC_SITE_URL is not configured");const auth=new google.auth.GoogleAuth({scopes:["https://www.googleapis.com/auth/webmasters.readonly"]}),client=google.searchconsole({version:"v1",auth}),dimension=gscDimensions[query.dimension as keyof typeof gscDimensions];
    const call=async(startDate:string,endDate:string)=>{const response=await withRetry(()=>client.searchanalytics.query({siteUrl,requestBody:{startDate,endDate,dimensions:query.chart==="kpi"?[]:[dimension],type:"web",rowLimit:query.chart==="kpi"?1:Math.min(5000,Math.max(query.limit*20,100)),dataState:"final"}},{timeout:15000}));return response.data.rows??[]};const [current,previous]=await Promise.all([call(dates.startDate,dates.endDate),call(dates.previousStartDate,dates.previousEndDate)]);return buildGscDashboardResult(query,current,previous,dates);
  }
  const propertyId=process.env.GA4_PROPERTY_ID;if(!propertyId)throw new Error("GA4_PROPERTY_ID is not configured");const client=new BetaAnalyticsDataClient(),dimension=gaDimensions[query.dimension as keyof typeof gaDimensions],metric=gaMetrics[query.metric as keyof typeof gaMetrics],call=async(startDate:string,endDate:string)=>{const [response]=await withRetry(()=>client.runReport({property:`properties/${propertyId}`,dateRanges:[{startDate,endDate}],dimensions:query.chart==="kpi"?[]:[{name:dimension}],metrics:[{name:metric}],limit:query.chart==="kpi"?1:Math.min(10000,Math.max(query.limit*20,100)),orderBys:query.chart==="kpi"?[]:query.dimension==="date"?[{dimension:{dimensionName:"date"}}]:[{metric:{metricName:metric},desc:query.sort==="descending"}],returnPropertyQuota:true},{timeout:15000}));return response.rows??[]};const [current,previous]=await Promise.all([call(dates.startDate,dates.endDate),call(dates.previousStartDate,dates.previousEndDate)]);return buildGa4DashboardResult(query,current,previous,dates);
}
