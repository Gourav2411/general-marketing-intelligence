import type {NormalizedEvidence} from "../evidence/schema.js";
import {loadSemanticConfig,resolveCanonicalIdentity,resolveChannelGroup,resolveLifecycleStage,type SemanticConfig} from "./config.js";
import {highestEvidenceTier,semanticMetrics} from "./registry.js";
import {METRIC_DEFINITIONS_VERSION,SEMANTIC_SCHEMA_VERSION,type IdentityResolution} from "./types.js";

const provenance=(item:{mapping:"configured"|"unmapped";confidence:number;value:string}|undefined):IdentityResolution|undefined=>item?({mapping:item.mapping,confidence:item.confidence,sourceValue:item.value}):undefined;

export function annotateEvidence<T extends NormalizedEvidence>(row:T,config:SemanticConfig=loadSemanticConfig()):T{
 const metrics=semanticMetrics(row.source,row.metrics);
 const campaign=resolveCanonicalIdentity("campaigns",row.source,row.campaign,config);
 const landing=resolveCanonicalIdentity("landing_pages",row.source,row.landingPage,config);
 const channel=resolveChannelGroup(row.source,row.sourceMedium,config);
 const lifecycle=resolveLifecycleStage(row.source,row.lifecycleStage,config);
 const resolutions=[campaign,landing,channel,lifecycle].filter(Boolean);
 const configured=resolutions.length>0&&resolutions.every(item=>item?.mapping==="configured");
 const mapping=configured?"configured":resolutions.some(item=>item?.mapping==="unmapped")?"unmapped":row.mapping;
 const confidence=resolutions.length?Math.min(...resolutions.map(item=>item?.confidence??0)):mapping==="configured"?1:mapping==="inferred"?.5:.25;
 return {...row,semantic:{schemaVersion:SEMANTIC_SCHEMA_VERSION,definitionsVersion:METRIC_DEFINITIONS_VERSION,metrics,highestEvidenceTier:highestEvidenceTier(metrics),identity:{campaign:campaign?.canonicalKey,landingPage:landing?.canonicalKey,channel:channel?.canonicalKey,lifecycleStage:lifecycle?.canonicalStage,segment:row.segment,mapping,confidence,provenance:{campaign:provenance(campaign),landingPage:provenance(landing),channel:provenance(channel),lifecycleStage:provenance(lifecycle)}}}};
}
