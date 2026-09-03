import type { ConnectorId } from "./contract.js";
export interface CatalogEntry {id:ConnectorId;label:string;status:"IMPLEMENTED"|"PLANNED";mode:"read-only";category:string}
export const connectorCatalog:CatalogEntry[]=[
 {id:"google_search_console",label:"Google Search Console",status:"IMPLEMENTED",mode:"read-only",category:"organic search"},
 {id:"ga4",label:"Google Analytics 4",status:"IMPLEMENTED",mode:"read-only",category:"web analytics"},
 {id:"google_ads",label:"Google Ads",status:"IMPLEMENTED",mode:"read-only",category:"paid media"},
 {id:"hubspot",label:"HubSpot",status:"IMPLEMENTED",mode:"read-only",category:"CRM"},
 {id:"salesforce",label:"Salesforce",status:"IMPLEMENTED",mode:"read-only",category:"CRM"},
 {id:"generic_crm_csv",label:"Generic CRM CSV",status:"IMPLEMENTED",mode:"read-only",category:"CRM"},
 {id:"meta_ads",label:"Meta Ads",status:"PLANNED",mode:"read-only",category:"paid media"},
 {id:"linkedin_ads",label:"LinkedIn Ads",status:"PLANNED",mode:"read-only",category:"paid media"},
 {id:"microsoft_ads",label:"Microsoft Ads",status:"PLANNED",mode:"read-only",category:"paid media"},
 {id:"youtube_analytics",label:"YouTube Analytics",status:"PLANNED",mode:"read-only",category:"video"},
 {id:"seo_platform",label:"Ahrefs / Semrush adapter",status:"PLANNED",mode:"read-only",category:"SEO"},
 {id:"email_platform",label:"Email platform adapter",status:"PLANNED",mode:"read-only",category:"lifecycle"},
 {id:"product_analytics",label:"Product analytics adapter",status:"PLANNED",mode:"read-only",category:"product"},
 {id:"call_tracking",label:"Call tracking adapter",status:"PLANNED",mode:"read-only",category:"offline conversion"}
];
