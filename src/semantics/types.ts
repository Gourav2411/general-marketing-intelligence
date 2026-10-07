export const SEMANTIC_SCHEMA_VERSION=1 as const;
export const METRIC_DEFINITIONS_VERSION="1.0.0" as const;

export const canonicalEntityTypes=["Account","Contact","Lead","Opportunity","Customer","Campaign","AdGroup","Creative","Channel","Audience","Persona","Keyword","LandingPage","Content","Product","Market","ConversionEvent","RevenueEvent","Experiment","Hypothesis","Decision","Action","Outcome","Learning"] as const;
export type CanonicalEntityType=typeof canonicalEntityTypes[number];

export const canonicalMetricIds=["impressions","clicks","ctr","average_position","sessions","users","analytics_key_events","analytics_reported_revenue","spend","platform_conversions","platform_conversion_value","leads","mqls","sqls","opportunities","pipeline_value","closed_won_revenue"] as const;
export type CanonicalMetricId=typeof canonicalMetricIds[number];
export type MetricUnit="count"|"ratio"|"currency"|"position";
export type MetricAggregation="sum"|"weighted_average"|"average"|"last_value";
export type EvidenceTier="T1_REVENUE"|"T2_PIPELINE"|"T3_QUALIFIED_FUNNEL"|"T4_PLATFORM_OUTCOME"|"T5_TRAFFIC"|"T6_REACH";
export interface MetricDefinition {id:CanonicalMetricId;label:string;unit:MetricUnit;aggregation:MetricAggregation;evidenceTier:EvidenceTier|null;meaning:string;neverMeans:string[];}
export interface SemanticMetricReference {field:string;metricId:CanonicalMetricId;evidenceTier:EvidenceTier|null;}
export interface IdentityResolution {mapping:"configured"|"inferred"|"unmapped";confidence:number;sourceValue:string;}
export interface SemanticAnnotation {schemaVersion:typeof SEMANTIC_SCHEMA_VERSION;definitionsVersion:typeof METRIC_DEFINITIONS_VERSION;metrics:SemanticMetricReference[];highestEvidenceTier:EvidenceTier|null;identity:{campaign?:string;landingPage?:string;channel?:string;lifecycleStage?:string;segment?:string;mapping:"configured"|"inferred"|"unmapped";confidence:number;provenance:{campaign?:IdentityResolution;landingPage?:IdentityResolution;channel?:IdentityResolution;lifecycleStage?:IdentityResolution}};}
