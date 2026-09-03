import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Connection } from "./types.js";
const dataRoot=join(dirname(fileURLToPath(import.meta.url)),"../../data");
const localFiles=["search-console.csv","google-ads.csv","conversions.csv"];
export const localDataReady=()=>localFiles.every(file=>existsSync(join(dataRoot,"local",file)));
export const resolveDataMode=(requested=process.env.DATA_MODE,localReady=localDataReady())=>requested==="live"?"live":requested==="local"&&localReady?"local":"demo";
export const dataMode=()=>resolveDataMode();
const implemented=(name:string,vars:string[]):Connection=>{const configured=vars.every(v=>Boolean(process.env[v]));return {name,status:"LIVE IMPLEMENTED",configured,detail:configured?"Read-only API client configured":"Read-only API client implemented; credentials incomplete"}};
export function liveConnections():Connection[]{return [implemented("Google Ads",["GOOGLE_ADS_CUSTOMER_ID","GOOGLE_ADS_DEVELOPER_TOKEN","GOOGLE_ADS_CLIENT_ID","GOOGLE_ADS_CLIENT_SECRET","GOOGLE_ADS_REFRESH_TOKEN"]),implemented("Search Console",["GSC_SITE_URL","GOOGLE_APPLICATION_CREDENTIALS"]),implemented("GA4",["GA4_PROPERTY_ID","GOOGLE_APPLICATION_CREDENTIALS"]),implemented("HubSpot",["HUBSPOT_ACCESS_TOKEN"]),implemented("Salesforce",["SALESFORCE_INSTANCE_URL","SALESFORCE_ACCESS_TOKEN"]),implemented("Generic CRM CSV",["GENERIC_CRM_CSV"]),{name:"Meta Ads",status:"NOT IMPLEMENTED",configured:false,detail:"Future read-only normalized connector"}]}
