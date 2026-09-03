import { data } from "../../data/loader.js";
import type { MarketingDataProvider } from "../types.js";
export class DemoProvider implements MarketingDataProvider { getPaidPerformance(){return data.ads} getSearchPerformance(){return data.search} getWebAnalytics(){return null} getPipelinePerformance(){return data.conversions} getConnectionStatus(){return ["Google Ads","Search Console","GA4","Pipeline / CRM"].map(name=>({name,status:"LIVE IMPLEMENTED" as const,configured:true,detail:"Synthetic local demo dataset"}))} }
