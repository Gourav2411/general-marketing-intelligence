import { z } from "zod";
import type { AdsRow, ConversionRow, SearchRow } from "../types.js";

export const dashboardCatalog = {
  search: {
    label: "Search Console",
    dimensions: ["query", "landing_page", "segment", "commercial_intent"],
    metrics: ["impressions", "clicks", "ctr", "average_position", "current_period", "previous_period"]
  },
  ads: {
    label: "Google Ads",
    dimensions: ["campaign", "segment", "keyword_or_theme", "landing_page"],
    metrics: ["spend", "impressions", "clicks", "cpc", "leads", "mqls", "sqls", "estimated_pipeline"]
  },
  conversions: {
    label: "Conversions and pipeline",
    dimensions: ["source", "campaign", "landing_page", "segment"],
    metrics: ["leads", "mqls", "sqls", "opportunities", "estimated_pipeline"]
  },
  gsc_live: {
    label: "Google Search Console · live",
    dimensions: ["date", "query", "landing_page", "country", "device"],
    metrics: ["clicks", "impressions", "ctr", "average_position"]
  },
  ga4_live: {
    label: "Google Analytics 4 · live",
    dimensions: ["date", "country", "device", "landing_page", "channel", "source_medium", "campaign"],
    metrics: ["sessions", "users", "key_events", "key_event_rate", "revenue"]
  }
} as const;

export type DashboardData = {search:SearchRow[];ads:AdsRow[];conversions:ConversionRow[]};
export const chartTypes=["bar","horizontal_bar","line","area","donut","geo","table","kpi"] as const;
export const querySchema=z.object({
  dataset:z.enum(["search","ads","conversions","gsc_live","ga4_live"]),
  dimension:z.string().min(1).max(100),
  metric:z.string().min(1).max(100),
  aggregation:z.enum(["sum","average","count"]).default("sum"),
  chart:z.enum(chartTypes).default("bar"),
  filter:z.string().max(200).default(""),
  limit:z.number().int().min(1).max(50).default(10),
  sort:z.enum(["descending","ascending"]).default("descending"),
  start_date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  end_date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  comparison:z.enum(["previous_period","year_over_year"]).default("previous_period")
});
export type DashboardQuery=z.infer<typeof querySchema>;
export type DashboardPoint={label:string;value:number;previousValue?:number;rows:number};

export function dashboardLink(input:unknown,title="",base=process.env.DASHBOARD_PUBLIC_URL??"http://127.0.0.1:4173"){
  const query=querySchema.parse(input),catalog=dashboardCatalog[query.dataset];
  if(!(catalog.dimensions as readonly string[]).includes(query.dimension))throw new Error(`Dimension '${query.dimension}' is not allowed for ${query.dataset}`);
  if(!(catalog.metrics as readonly string[]).includes(query.metric))throw new Error(`Metric '${query.metric}' is not allowed for ${query.dataset}`);
  const url=new URL(base);
  for(const [key,value] of Object.entries(query))url.searchParams.set(key,String(value));
  if(title.trim())url.searchParams.set("title",title.trim().slice(0,100));
  return {query,title:title.trim().slice(0,100),url:url.toString()};
}

export function dashboardBoardLink(charts:unknown[],title="Marketing evidence",base=process.env.DASHBOARD_PUBLIC_URL??"http://127.0.0.1:4173"){
  if(!charts.length||charts.length>20)throw new Error("A dashboard requires 1 to 20 charts");
  const validated=charts.map((chart,index)=>{const value=chart as Record<string,unknown>,link=dashboardLink(value,String(value.title??`Chart ${index+1}`),base);return {...link.query,title:link.title}}),url=new URL(base);
  url.searchParams.set("board",Buffer.from(JSON.stringify(validated)).toString("base64url"));url.searchParams.set("board_title",title.trim().slice(0,100));
  return {title:title.trim().slice(0,100),charts:validated,url:url.toString()};
}

export function runDashboardQuery(data:DashboardData,input:unknown){
  const query=querySchema.parse(input),catalog=dashboardCatalog[query.dataset];
  if(query.dataset==="gsc_live"||query.dataset==="ga4_live")throw new Error("Live Google datasets require the asynchronous dashboard provider");
  if(!(catalog.dimensions as readonly string[]).includes(query.dimension))throw new Error(`Dimension '${query.dimension}' is not allowed for ${query.dataset}`);
  if(!(catalog.metrics as readonly string[]).includes(query.metric))throw new Error(`Metric '${query.metric}' is not allowed for ${query.dataset}`);
  const filter=query.filter.trim().toLowerCase(),groups=new Map<string,{sum:number;rows:number}>();
  for(const sourceRow of data[query.dataset]){
    const row=sourceRow as unknown as Record<string,unknown>;
    if(filter&&!Object.values(row).some(value=>String(value).toLowerCase().includes(filter)))continue;
    const label=String(row[query.dimension]??"Unknown"),value=Number(row[query.metric]??0);
    if(!Number.isFinite(value))continue;
    const current=groups.get(label)??{sum:0,rows:0};current.sum+=value;current.rows++;groups.set(label,current);
  }
  const points:DashboardPoint[]=[...groups].map(([label,value])=>({label,value:query.aggregation==="count"?value.rows:query.aggregation==="average"?value.sum/value.rows:value.sum,rows:value.rows})).sort((a,b)=>query.sort==="descending"?b.value-a.value:a.value-b.value).slice(0,query.limit);
  const total=points.reduce((sum,point)=>sum+point.value,0);
  return {query,points,summary:{groups:points.length,total,sourceRows:data[query.dataset].length,matchedRows:points.reduce((sum,point)=>sum+point.rows,0)},generatedAt:new Date().toISOString(),calculation:"server_side_deterministic"};
}
