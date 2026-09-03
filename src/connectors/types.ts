import type { AdsRow, ConversionRow, SearchRow } from "../types.js";
export type ConnectorStatus="LIVE IMPLEMENTED"|"ADAPTER READY"|"NOT IMPLEMENTED";
export interface Connection {name:string;status:ConnectorStatus;configured:boolean;detail:string}
export interface MarketingDataProvider { getPaidPerformance():AdsRow[]; getSearchPerformance():SearchRow[]; getWebAnalytics():null; getPipelinePerformance():ConversionRow[]; getConnectionStatus():Connection[]; }
