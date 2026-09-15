export type AccessMode="read_only"|"draft_only"|"read_write";
export type ActionSource="local_artifacts"|"google_ads"|"hubspot"|"salesforce"|"email";
export type ActionKind="save_campaign_draft"|"create_hubspot_task_draft"|"create_paid_campaign"|"update_campaign_budget"|"pause_campaign"|"create_crm_campaign"|"send_email_campaign";
export type ApprovalStatus="preview"|"approved"|"executed"|"revoked"|"expired"|"failed";
export type RiskClass="R0"|"R1"|"R2"|"R3"|"R4";
export interface ActionAdapterDeclaration {kind:ActionKind;source:ActionSource;riskClass:RiskClass;reversible:boolean;approvalRequirement:"none"|"explicit"|"explicit_twice";maximumScope:Record<string,number|string|boolean>;requiredEvidence:string[];tenantPermissions:string[];auditFields:string[];enabled:boolean;}
export interface ActionPolicy {version:1;mode:AccessMode;approvalTtlMinutes:number;sources:Partial<Record<ActionSource,{read:boolean;draft:boolean;write:boolean;maxBudgetChange?:number;maxAudienceSize?:number}>>}
export interface ActionRequest {kind:ActionKind;source:ActionSource;summary:string;payload:Record<string,unknown>;risk:"low"|"medium"|"high";riskClass?:RiskClass;tenantId?:string;accountId?:string;idempotencyKey?:string;requiredEvidenceIds?:string[];expectedState?:Record<string,unknown>}
export interface ApprovalRecord {version:1;approvalId:string;createdAt:string;expiresAt:string;status:ApprovalStatus;payloadHash:string;request:ActionRequest;approvedAt?:string;executedAt?:string;revokedAt?:string;result?:Record<string,unknown>;error?:string}
