import type {NormalizedEvidence} from "../evidence/schema.js";

export interface UnmatchedSemanticRecord {
  evidenceId:string;
  source:string;
  kind:"campaign"|"landing_page"|"channel"|"lifecycle_stage";
  sourceValue:string;
  sourceQualifiedKey:string;
}

export function unmatchedSemanticRecords(evidence:NormalizedEvidence[]):UnmatchedSemanticRecord[]{
 const queue:UnmatchedSemanticRecord[]=[];
 for(const row of evidence){
  const identity=row.semantic?.identity;
  if(!identity)continue;
  if(row.campaign&&identity.campaign&&identity.provenance.campaign?.mapping==="unmapped")queue.push({evidenceId:row.id,source:row.source,kind:"campaign",sourceValue:row.campaign,sourceQualifiedKey:identity.campaign});
  if(row.landingPage&&identity.landingPage&&identity.provenance.landingPage?.mapping==="unmapped")queue.push({evidenceId:row.id,source:row.source,kind:"landing_page",sourceValue:row.landingPage,sourceQualifiedKey:identity.landingPage});
  if(row.sourceMedium&&identity.channel&&identity.provenance.channel?.mapping==="unmapped")queue.push({evidenceId:row.id,source:row.source,kind:"channel",sourceValue:row.sourceMedium,sourceQualifiedKey:identity.channel});
  if(row.lifecycleStage&&identity.provenance.lifecycleStage?.mapping==="unmapped")queue.push({evidenceId:row.id,source:row.source,kind:"lifecycle_stage",sourceValue:row.lifecycleStage,sourceQualifiedKey:`source:${row.source}:lifecycle:${row.lifecycleStage}`});
 }
 return queue;
}
