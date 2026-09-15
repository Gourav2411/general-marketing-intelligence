import {createHash} from "node:crypto";
import type {EntityType,GraphEntity,GraphRelationship,Provenance,RelationType,SerializedMarketingGraph} from "./types.js";
const stableId=(parts:string[])=>createHash("sha256").update(parts.join("|")).digest("hex").slice(0,24);
const mergeUnique=<T>(values:T[],key:(value:T)=>string)=>[...new Map(values.map(value=>[key(value),value])).values()];
export class MarketingGraph{
 private entities=new Map<string,GraphEntity>(); private relationships=new Map<string,GraphRelationship>();
 constructor(readonly tenantId:string){if(!tenantId.trim())throw new Error("tenantId is required")}
 upsertEntity(input:{accountId:string;type:EntityType;sourceSystem:string;sourceId:string;canonicalKey?:string;label:string;confidence?:number;attributes?:Record<string,unknown>;evidenceIds?:string[];retrievedAt?:string}){
  if(!input.accountId.trim()||!input.sourceSystem.trim()||!input.sourceId.trim())throw new Error("accountId, sourceSystem and sourceId are required");
  const id=stableId([this.tenantId,input.accountId,input.type,input.canonicalKey?.trim().toLowerCase()||`${input.sourceSystem}:${input.sourceId}`]),now=input.retrievedAt??new Date().toISOString(),provenance:Provenance={sourceSystem:input.sourceSystem,sourceId:input.sourceId,retrievedAt:now,evidenceIds:input.evidenceIds??[]},existing=this.entities.get(id);
  const row:GraphEntity=existing?{...existing,label:input.label||existing.label,updatedAt:now,confidence:Math.max(existing.confidence,input.confidence??1),sourceRefs:[...new Set([...existing.sourceRefs,`${input.sourceSystem}:${input.sourceId}`])],provenance:mergeUnique([...existing.provenance,provenance],x=>`${x.sourceSystem}:${x.sourceId}:${x.retrievedAt}`),attributes:{...existing.attributes,...input.attributes}}:{id,tenantId:this.tenantId,accountId:input.accountId,type:input.type,label:input.label,createdAt:now,updatedAt:now,confidence:input.confidence??1,sourceRefs:[`${input.sourceSystem}:${input.sourceId}`],provenance:[provenance],attributes:input.attributes??{}};
  this.entities.set(id,row);return row;
 }
 link(input:{accountId:string;type:RelationType;fromId:string;toId:string;sourceSystem:string;sourceId:string;confidence?:number;attributes?:Record<string,unknown>;evidenceIds?:string[];retrievedAt?:string}){
  const from=this.entities.get(input.fromId),to=this.entities.get(input.toId);if(!from||!to)throw new Error("Both relationship entities must exist");if(from.tenantId!==this.tenantId||to.tenantId!==this.tenantId||from.accountId!==input.accountId||to.accountId!==input.accountId)throw new Error("Cross-tenant or cross-account relationship rejected");
  const id=stableId([this.tenantId,input.accountId,input.type,input.fromId,input.toId]),now=input.retrievedAt??new Date().toISOString(),provenance:Provenance={sourceSystem:input.sourceSystem,sourceId:input.sourceId,retrievedAt:now,evidenceIds:input.evidenceIds??[]};
  const row:GraphRelationship={id,tenantId:this.tenantId,accountId:input.accountId,type:input.type,fromId:input.fromId,toId:input.toId,createdAt:now,confidence:input.confidence??1,provenance:[provenance],attributes:input.attributes??{}};this.relationships.set(id,row);return row;
 }
 getEntity(id:string){return this.entities.get(id)}
 listEntities(accountId?:string){return [...this.entities.values()].filter(x=>!accountId||x.accountId===accountId)}
 listRelationships(accountId?:string){return [...this.relationships.values()].filter(x=>!accountId||x.accountId===accountId)}
 serialize():SerializedMarketingGraph{return {version:1,tenantId:this.tenantId,entities:this.listEntities(),relationships:this.listRelationships()}}
 static deserialize(value:SerializedMarketingGraph){const graph=new MarketingGraph(value.tenantId);for(const row of value.entities){if(row.tenantId!==value.tenantId)throw new Error("Serialized graph tenant mismatch");graph.entities.set(row.id,row)}for(const row of value.relationships){if(row.tenantId!==value.tenantId)throw new Error("Serialized relationship tenant mismatch");graph.relationships.set(row.id,row)}return graph}
}
