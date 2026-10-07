import type {EvidenceSource,EvidenceMetrics} from "../evidence/schema.js";
import {METRIC_DEFINITIONS_VERSION,canonicalMetricIds,type CanonicalEntityType,type CanonicalMetricId,type EvidenceTier,type MetricDefinition,type SemanticMetricReference} from "./types.js";

const definitions:Record<CanonicalMetricId,MetricDefinition>={
 impressions:{id:"impressions",label:"Impressions",unit:"count",aggregation:"sum",evidenceTier:"T6_REACH",meaning:"A source-reported eligible display or search appearance.",neverMeans:["attention","traffic","demand","revenue"]},
 clicks:{id:"clicks",label:"Clicks",unit:"count",aggregation:"sum",evidenceTier:"T5_TRAFFIC",meaning:"A source-reported click interaction.",neverMeans:["session","lead","qualified demand"]},
 ctr:{id:"ctr",label:"Click-through rate",unit:"ratio",aggregation:"weighted_average",evidenceTier:"T5_TRAFFIC",meaning:"Clicks divided by impressions for the same source grain.",neverMeans:["conversion rate","incrementality"]},
 average_position:{id:"average_position",label:"Average search position",unit:"position",aggregation:"weighted_average",evidenceTier:"T6_REACH",meaning:"Search Console average topmost result position.",neverMeans:["rank for every user","market share"]},
 sessions:{id:"sessions",label:"Sessions",unit:"count",aggregation:"sum",evidenceTier:"T5_TRAFFIC",meaning:"Analytics sessions under the configured analytics identity and filters.",neverMeans:["people","leads","opportunities"]},
 users:{id:"users",label:"Users",unit:"count",aggregation:"sum",evidenceTier:"T5_TRAFFIC",meaning:"Analytics reported users, subject to platform identity rules.",neverMeans:["known people","accounts","customers"]},
 analytics_key_events:{id:"analytics_key_events",label:"Analytics key events",unit:"count",aggregation:"sum",evidenceTier:"T4_PLATFORM_OUTCOME",meaning:"Events configured as key events in the analytics property.",neverMeans:["MQL","SQL","opportunity","closed-won revenue"]},
 analytics_reported_revenue:{id:"analytics_reported_revenue",label:"Analytics-reported revenue",unit:"currency",aggregation:"sum",evidenceTier:"T4_PLATFORM_OUTCOME",meaning:"Revenue reported by the analytics platform under its configured collection and attribution rules.",neverMeans:["reconciled finance revenue","CRM closed-won revenue","incremental revenue"]},
 spend:{id:"spend",label:"Media spend",unit:"currency",aggregation:"sum",evidenceTier:null,meaning:"Source-reported advertising cost in the configured currency.",neverMeans:["total acquisition cost","fully loaded marketing cost"]},
 platform_conversions:{id:"platform_conversions",label:"Platform conversions",unit:"count",aggregation:"sum",evidenceTier:"T4_PLATFORM_OUTCOME",meaning:"Conversions reported under the advertising platform configuration and attribution window.",neverMeans:["MQL","SQL","opportunity","incremental conversion"]},
 platform_conversion_value:{id:"platform_conversion_value",label:"Platform conversion value",unit:"currency",aggregation:"sum",evidenceTier:"T4_PLATFORM_OUTCOME",meaning:"Value attributed by an advertising platform.",neverMeans:["CRM pipeline","closed-won revenue","incremental revenue"]},
 leads:{id:"leads",label:"Leads",unit:"count",aggregation:"sum",evidenceTier:"T3_QUALIFIED_FUNNEL",meaning:"CRM or governed source records classified as leads.",neverMeans:["MQL","SQL","opportunity"]},
 mqls:{id:"mqls",label:"Marketing-qualified leads",unit:"count",aggregation:"sum",evidenceTier:"T3_QUALIFIED_FUNNEL",meaning:"Records satisfying the operator-approved MQL definition.",neverMeans:["platform lead","key event","SQL"]},
 sqls:{id:"sqls",label:"Sales-qualified leads",unit:"count",aggregation:"sum",evidenceTier:"T3_QUALIFIED_FUNNEL",meaning:"Records satisfying the operator-approved SQL definition.",neverMeans:["MQL","opportunity","closed won"]},
 opportunities:{id:"opportunities",label:"Opportunities",unit:"count",aggregation:"sum",evidenceTier:"T2_PIPELINE",meaning:"CRM records satisfying the operator-approved opportunity definition.",neverMeans:["lead","platform conversion","closed won"]},
 pipeline_value:{id:"pipeline_value",label:"Qualified pipeline value",unit:"currency",aggregation:"sum",evidenceTier:"T2_PIPELINE",meaning:"Open or qualified opportunity value under approved CRM stage rules.",neverMeans:["forecasted revenue","closed-won revenue","incremental revenue"]},
 closed_won_revenue:{id:"closed_won_revenue",label:"Closed-won revenue",unit:"currency",aggregation:"sum",evidenceTier:"T1_REVENUE",meaning:"CRM revenue attached to records satisfying the approved closed-won rule.",neverMeans:["cash collected","recognized finance revenue","incremental revenue"]}
};
const sourceFields:Record<EvidenceSource,Partial<Record<keyof EvidenceMetrics,CanonicalMetricId>>>={
 google_search_console:{impressions:"impressions",clicks:"clicks",ctr:"ctr",position:"average_position"},
 ga4:{sessions:"sessions",users:"users",keyEvents:"analytics_key_events",revenue:"analytics_reported_revenue"},
 google_ads:{impressions:"impressions",clicks:"clicks",spend:"spend",conversions:"platform_conversions",conversionValue:"platform_conversion_value"},
 meta_ads:{impressions:"impressions",clicks:"clicks",spend:"spend",conversions:"platform_conversions",conversionValue:"platform_conversion_value"},
 linkedin_ads:{impressions:"impressions",clicks:"clicks",spend:"spend",conversions:"platform_conversions",conversionValue:"platform_conversion_value"},
 paid_media_csv:{impressions:"impressions",clicks:"clicks",spend:"spend",conversions:"platform_conversions",conversionValue:"platform_conversion_value",mqls:"mqls",sqls:"sqls",pipeline:"pipeline_value",revenue:"closed_won_revenue"},
 google_ads_csv:{impressions:"impressions",clicks:"clicks",spend:"spend",conversions:"platform_conversions",conversionValue:"platform_conversion_value"},
 hubspot:{leads:"leads",mqls:"mqls",sqls:"sqls",opportunities:"opportunities",pipeline:"pipeline_value",revenue:"closed_won_revenue"},
 salesforce:{leads:"leads",mqls:"mqls",sqls:"sqls",opportunities:"opportunities",pipeline:"pipeline_value",revenue:"closed_won_revenue"},
 generic_crm_csv:{leads:"leads",mqls:"mqls",sqls:"sqls",opportunities:"opportunities",pipeline:"pipeline_value",revenue:"closed_won_revenue"},
 generic_crm_api:{leads:"leads",mqls:"mqls",sqls:"sqls",opportunities:"opportunities",pipeline:"pipeline_value",revenue:"closed_won_revenue"},
 conversion_csv:{leads:"leads",mqls:"mqls",sqls:"sqls",opportunities:"opportunities",pipeline:"pipeline_value",revenue:"closed_won_revenue"}
};
const tierOrder:EvidenceTier[]=["T1_REVENUE","T2_PIPELINE","T3_QUALIFIED_FUNNEL","T4_PLATFORM_OUTCOME","T5_TRAFFIC","T6_REACH"];
const sourceEntities:Record<EvidenceSource,CanonicalEntityType[]>={
 google_search_console:["Account","Keyword","LandingPage","Market"],ga4:["Account","Campaign","Channel","LandingPage","ConversionEvent","RevenueEvent","Market"],google_ads:["Account","Campaign","AdGroup","Keyword","LandingPage","ConversionEvent","Market"],meta_ads:["Account","Campaign","AdGroup","Creative","Audience","ConversionEvent","Market"],linkedin_ads:["Account","Campaign","Creative","Audience","ConversionEvent","Market"],paid_media_csv:["Account","Campaign","AdGroup","Creative","Audience","ConversionEvent","RevenueEvent","Market"],hubspot:["Account","Contact","Lead","Opportunity","Customer","Campaign","RevenueEvent"],salesforce:["Account","Contact","Lead","Opportunity","Customer","Campaign","RevenueEvent"],generic_crm_csv:["Account","Contact","Lead","Opportunity","Customer","Campaign","RevenueEvent"],generic_crm_api:["Account","Contact","Lead","Opportunity","Customer","Campaign","RevenueEvent"],google_ads_csv:["Account","Campaign","AdGroup","Keyword","LandingPage","ConversionEvent","Market"],conversion_csv:["Account","Contact","Lead","Opportunity","Customer","Campaign","ConversionEvent","RevenueEvent"]
};
export const metricDefinitionsVersion=METRIC_DEFINITIONS_VERSION;
export function metricDefinition(id:CanonicalMetricId){return definitions[id]}
export function listMetricDefinitions(){return canonicalMetricIds.map(id=>definitions[id])}
export function semanticContractForSource(source:EvidenceSource){return Object.entries(sourceFields[source]).map(([field,metricId])=>({field,definition:definitions[metricId!]}))}
export function canonicalEntitiesForSource(source:EvidenceSource){return [...sourceEntities[source]]}
export function semanticMetrics(source:EvidenceSource,metrics:EvidenceMetrics):SemanticMetricReference[]{return Object.entries(sourceFields[source]).filter(([field])=>typeof metrics[field as keyof EvidenceMetrics]==="number").map(([field,id])=>({field,metricId:id!,evidenceTier:definitions[id!].evidenceTier}))}
export function highestEvidenceTier(metrics:SemanticMetricReference[]){return tierOrder.find(tier=>metrics.some(metric=>metric.evidenceTier===tier))??null}
