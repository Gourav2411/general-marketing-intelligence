export type MonitoringJobStatus="running"|"completed"|"failed";
export type AlertKind="connector_health"|"freshness"|"anomaly"|"pacing"|"funnel_leakage"|"content_decay"|"decision_review";
export type AlertSeverity="info"|"warning"|"critical";

export interface MonitoringScope {tenantId:string;accountId:string}
export interface MonitoringJob {id:string;tenantId:string;accountId:string;idempotencyKey:string;status:MonitoringJobStatus;startedAt:string;completedAt?:string;checkpoint?:string;snapshotId?:string;alertsCreated:number;alertsSuppressed:number;errorCode?:string;remediation?:string}
export interface MonitoringAlert {id:string;tenantId:string;accountId:string;fingerprint:string;kind:AlertKind;severity:AlertSeverity;title:string;businessDecision:string;summary:string;recommendedAction:string;evidenceIds:string[];firstSeenAt:string;lastSeenAt:string;occurrences:number;status:"open"|"resolved"}
export interface MonitoringCycleResult {job:MonitoringJob;alerts:MonitoringAlert[];suppressed:number;snapshotId?:string}
