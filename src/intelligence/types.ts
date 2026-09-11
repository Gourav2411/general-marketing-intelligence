export type EvidenceQuality="low"|"medium"|"high";
export type Outcome="succeeded"|"failed"|"mixed";
export interface MarketingCase {
 id:string; campaign:string; brand:string; period:string; markets:string[];
 disciplines:string[]; objective:string; audience:string[]; businessContext:string;
 strategy:string; execution:string[]; outcome:Outcome; outcomes:string[];
 evidenceQuality:EvidenceQuality; causalConfidence:EvidenceQuality;
 whatWorked:string[]; whatFailed:string[]; failureModes:string[];
 transferConditions:string[]; nonTransferConditions:string[];
 sources:{title:string;url:string;publisher:string;accessedAt:string}[];
}
export interface RetrievedCase { case:MarketingCase; score:number; matchedTerms:string[]; }
export interface LearningRecord {
 id:string; createdAt:string; accountId:string; question:string; recommendation:string;
 evidenceIds:string[]; assumptions:string[]; confidence:"LOW"|"MEDIUM"|"HIGH";
 status:"proposed"|"approved"|"rejected"|"completed"; outcome?:string;
 forecastError?:string; lessons:string[];
}
