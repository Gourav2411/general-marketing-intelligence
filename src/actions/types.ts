export type AccessMode="read_only"|"draft_only"|"read_write";
export type ActionSource="local_artifacts"|"google_ads"|"hubspot"|"salesforce"|"email";
export type ActionKind="save_campaign_draft"|"create_paid_campaign"|"update_campaign_budget"|"pause_campaign"|"create_crm_campaign"|"send_email_campaign";
export type ApprovalStatus="preview"|"approved"|"executed"|"revoked"|"expired"|"failed";
export interface ActionPolicy {version:1;mode:AccessMode;approvalTtlMinutes:number;sources:Partial<Record<ActionSource,{read:boolean;draft:boolean;write:boolean;maxBudgetChange?:number;maxAudienceSize?:number}>>}
export interface ActionRequest {kind:ActionKind;source:ActionSource;summary:string;payload:Record<string,unknown>;risk:"low"|"medium"|"high";expectedState?:Record<string,unknown>}
export interface ApprovalRecord {version:1;approvalId:string;createdAt:string;expiresAt:string;status:ApprovalStatus;payloadHash:string;request:ActionRequest;approvedAt?:string;executedAt?:string;revokedAt?:string;result?:Record<string,unknown>;error?:string}
