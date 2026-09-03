import { google, type searchconsole_v1 } from "googleapis";
import { comparisonDateWindow, type ComparisonMode } from "./dates.js";
import { withRetry } from "./resilience.js";
import type { SearchConsoleEvidenceRow, SearchConsoleReport } from "./types.js";
const numeric=(value:number|null|undefined)=>Number.isFinite(value)?Number(value):0;
type QueryRows=(startDate:string,endDate:string,rowLimit:number)=>Promise<searchconsole_v1.Schema$ApiDataRow[]>;

export interface SearchConsoleReportInput {startDate?:string;endDate?:string;rowLimit?:number;comparison?:ComparisonMode;country?:string;device?:"DESKTOP"|"MOBILE"|"TABLET";searchType?:"web"|"image"|"video"|"news"|"discover"|"googleNews";pageFilter?:string;queryFilter?:string}
export async function buildSearchConsoleReport(input:SearchConsoleReportInput,queryRows:QueryRows):Promise<SearchConsoleReport>{
 const siteUrl=process.env.GSC_SITE_URL??"unconfigured",dates=comparisonDateWindow(input.startDate,input.endDate,28,input.comparison),rowLimit=Math.min(50000,Math.max(1,input.rowLimit??50));
 const [current,previous]=await Promise.all([queryRows(dates.startDate,dates.endDate,rowLimit),queryRows(dates.previousStartDate,dates.previousEndDate,rowLimit)]),prior=new Map(previous.map(row=>[(row.keys??[]).join("\u0000"),numeric(row.impressions)]));
 const rows:SearchConsoleEvidenceRow[]=current.map(row=>{const [query="",page=""]=row.keys??[],impressions=numeric(row.impressions),previousImpressions=prior.get((row.keys??[]).join("\u0000"))??0;return {query,page,clicks:numeric(row.clicks),impressions,ctr:numeric(row.ctr),position:numeric(row.position),previousImpressions,impressionGrowth:previousImpressions?(impressions-previousImpressions)/previousImpressions:null}}).sort((a,b)=>b.impressions-a.impressions).slice(0,rowLimit);
 const partial=current.length>=rowLimit,warnings=["Search Console query/page results can omit anonymized and lower-volume rows; do not treat them as complete attribution.",...(partial?[`Result reached the ${rowLimit}-row request limit and may be truncated.`]:[])];
 const markdown=`# Google Search Console Report\n\n**Site:** ${siteUrl}  \n**Current:** ${dates.startDate} → ${dates.endDate}  \n**Comparison:** ${dates.previousStartDate} → ${dates.previousEndDate}  \n**Rows:** ${rows.length}${partial?" (limit reached)":""}\n\n| Query | Page | Clicks | Impressions | CTR | Position | Prior impressions | Growth |\n|---|---|---:|---:|---:|---:|---:|---:|\n${rows.map(row=>`| ${row.query.replaceAll("|","\\|")} | ${row.page.replaceAll("|","\\|")} | ${row.clicks} | ${row.impressions} | ${(row.ctr*100).toFixed(1)}% | ${row.position.toFixed(1)} | ${row.previousImpressions} | ${row.impressionGrowth===null?"New / unavailable":`${(row.impressionGrowth*100).toFixed(1)}%`} |`).join("\n")}\n\n${warnings.join(" ")}`;
 return {meta:{source:"google_search_console",property:siteUrl,startDate:dates.startDate,endDate:dates.endDate,previousStartDate:dates.previousStartDate,previousEndDate:dates.previousEndDate,retrievedAt:new Date().toISOString(),rowCount:rows.length,partial,warnings},rows,markdown};
}

export async function searchConsoleReport(input:SearchConsoleReportInput):Promise<SearchConsoleReport>{
 const siteUrl=process.env.GSC_SITE_URL;if(!siteUrl)throw new Error("GSC_SITE_URL is not configured");if(!process.env.GOOGLE_APPLICATION_CREDENTIALS)throw new Error("GOOGLE_APPLICATION_CREDENTIALS is not configured");
 const auth=new google.auth.GoogleAuth({scopes:["https://www.googleapis.com/auth/webmasters.readonly"]}),client=google.searchconsole({version:"v1",auth}),pageSize=25000;
 const filters=[input.country?{dimension:"country",operator:"equals",expression:input.country.toLowerCase()}:undefined,input.device?{dimension:"device",operator:"equals",expression:input.device}:undefined,input.pageFilter?{dimension:"page",operator:"contains",expression:input.pageFilter}:undefined,input.queryFilter?{dimension:"query",operator:"contains",expression:input.queryFilter}:undefined].filter(Boolean) as searchconsole_v1.Schema$ApiDimensionFilter[];
 const queryRows:QueryRows=async(startDate,endDate,rowLimit)=>{const rows:searchconsole_v1.Schema$ApiDataRow[]=[];for(let startRow=0;startRow<rowLimit;startRow+=pageSize){const limit=Math.min(pageSize,rowLimit-startRow),response=await withRetry(()=>client.searchanalytics.query({siteUrl,requestBody:{startDate,endDate,dimensions:["query","page"],type:input.searchType??"web",dimensionFilterGroups:filters.length?[{groupType:"and",filters}]:undefined,rowLimit:limit,startRow,dataState:"final"}},{timeout:15000}));const page=response.data.rows??[];rows.push(...page);if(page.length<limit)break}return rows};
 return buildSearchConsoleReport(input,queryRows);
}
