export type NumericProvenanceKind="observed"|"calculated"|"proposed"|"external_reference";
export interface NumericClaim {value:number;unit?:string;kind:NumericProvenanceKind;label:string;evidenceIds?:string[];inputIds?:string[];calculation?:string;rationale?:string;sourceUrl?:string;}
export interface NumericValidation {valid:boolean;errors:string[];}
export function validateNumericClaims(claims:NumericClaim[],knownEvidenceIds=new Set<string>()):NumericValidation{
 const errors:string[]=[];
 for(const [index,claim] of claims.entries()){
  const at=`Numeric claim ${index+1} (${claim.label})`;
  if(!Number.isFinite(claim.value))errors.push(`${at} must be finite`);
  if(claim.kind==="observed"&&(!claim.evidenceIds?.length||claim.evidenceIds.some(id=>!knownEvidenceIds.has(id))))errors.push(`${at} requires valid source evidence IDs`);
  if(claim.kind==="calculated"&&(!claim.inputIds?.length||!claim.calculation))errors.push(`${at} requires deterministic input IDs and calculation`);
  if(claim.kind==="proposed"&&!claim.rationale)errors.push(`${at} requires proposal rationale`);
  if(claim.kind==="external_reference"&&!claim.sourceUrl)errors.push(`${at} requires a source URL`);
 }
 return {valid:errors.length===0,errors};
}
export const numericClaimKey=(value:number)=>String(value).replace(/\.0+$/," ").trim();
