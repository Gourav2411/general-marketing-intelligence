export type EvidenceQuality="low"|"medium"|"high";
export type Outcome="succeeded"|"failed"|"mixed";
export type EvidenceGrade="A"|"B"|"C"|"D"|"E";
export type RightsBasis="public-domain"|"permission-granted"|"licensed-redistribution"|"factual-metadata-only"|"restricted"|"unknown";
export interface RightsRecord {basis:RightsBasis;redistributionAllowed:boolean;reviewedBy:string;reviewedAt:string;notes:string;}
export interface OutcomeMeasurement {name:string;level:"business"|"brand"|"behavior"|"media"|"reputation";direction:"positive"|"negative"|"neutral"|"unknown";value?:number;unit?:string;incrementality:"experimental"|"econometric"|"observational"|"claimed"|"unknown";sourceIds:string[];}
export interface MarketingCase {
 schemaVersion:2;
 id:string; campaign:string; brand:string; period:string; markets:string[];
 category:string;businessModel:string;marketMaturity:string;economicContext:string;
 disciplines:string[]; objective:string; audience:string[]; businessContext:string;
 strategy:string; execution:string[]; outcome:Outcome; outcomes:string[];
 evidenceQuality:EvidenceQuality; causalConfidence:EvidenceQuality;
 evidenceGrade:EvidenceGrade;outcomeMeasurements:OutcomeMeasurement[];rights:RightsRecord;
 review:{status:"approved";reviewedBy:string;reviewedAt:string;notes:string};
 whatWorked:string[]; whatFailed:string[]; failureModes:string[];
 transferConditions:string[]; nonTransferConditions:string[];
 sources:{id?:string;title:string;url:string;publisher:string;accessedAt:string;sourceType?:"independent-research"|"regulatory"|"company-report"|"platform-library"|"award-case"|"journalism"|"commentary";methodology?:string}[];
}
export interface RetrievedCase { case:MarketingCase; score:number; matchedTerms:string[]; }
export interface LearningRecord {
 id:string; createdAt:string; accountId:string; question:string; recommendation:string;
 evidenceIds:string[]; assumptions:string[]; confidence:"LOW"|"MEDIUM"|"HIGH";
 status:"proposed"|"approved"|"rejected"|"completed"; outcome?:string;
 forecastError?:string; lessons:string[];
}
