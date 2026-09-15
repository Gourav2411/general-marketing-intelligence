export const entityTypes=["Account","Campaign","Channel","Creative","Audience","Keyword","LandingPage","Content","Lead","Opportunity","Customer","RevenueEvent","Experiment","Hypothesis","Decision","Action","Outcome","Learning"] as const;
export type EntityType=typeof entityTypes[number];
export const relationTypes=["uses","targets","belongs_to","lands_on","originated_from","becomes","produces","tests","creates","updates","attributed_to","measured_by"] as const;
export type RelationType=typeof relationTypes[number];
export interface Provenance {sourceSystem:string;sourceId:string;retrievedAt:string;evidenceIds:string[];}
export interface GraphEntity {id:string;tenantId:string;accountId:string;type:EntityType;label:string;createdAt:string;updatedAt:string;confidence:number;sourceRefs:string[];provenance:Provenance[];attributes:Record<string,unknown>;}
export interface GraphRelationship {id:string;tenantId:string;accountId:string;type:RelationType;fromId:string;toId:string;createdAt:string;confidence:number;provenance:Provenance[];attributes:Record<string,unknown>;}
export interface SerializedMarketingGraph {version:1;tenantId:string;entities:GraphEntity[];relationships:GraphRelationship[];}
