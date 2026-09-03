import type { NormalizedEvidence } from "../evidence/schema.js";
export type ConnectorId="google_search_console"|"ga4"|"google_ads"|"hubspot"|"salesforce"|"generic_crm_csv"|"meta_ads"|"linkedin_ads"|"microsoft_ads"|"youtube_analytics"|"seo_platform"|"email_platform"|"product_analytics"|"call_tracking";
export interface ConnectorContext {startDate:string;endDate:string;rowLimit:number}
export interface ConnectorResult {connector:ConnectorId;retrievedAt:string;evidence:NormalizedEvidence[];warnings:string[];partial:boolean}
export interface ReadOnlyConnector {id:ConnectorId;configured():boolean;fetch(context:ConnectorContext):Promise<ConnectorResult>}
