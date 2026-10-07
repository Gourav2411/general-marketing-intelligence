import type {EvidenceBundle,NormalizedEvidence} from "../evidence/schema.js";

export const WAREHOUSE_SCHEMA_VERSION=1 as const;
export interface WarehouseScope {tenantId:string;accountId:string}
export interface WarehouseSnapshot {id:string;tenantId:string;accountId:string;capturedAt:string;mappingVersion:number;semanticSchemaVersion:number|null;metricDefinitionsVersion:string|null;contentHash:string;evidenceCount:number;warnings:string[]}
export interface WarehouseEvidence extends NormalizedEvidence {snapshotId:string;tenantId:string;accountId:string;contentHash:string}
export interface WarehouseLineage {snapshotId:string;evidenceId:string;source:string;sourceRecordId:string;retrievedAt:string;mappingVersion:number;semanticSchemaVersion:number|null;metricDefinitionsVersion:string|null;calculationMethod:string;limitations:string[]}
export interface DecisionEvidenceLink {decisionId:string;snapshotId:string;tenantId:string;accountId:string;linkedAt:string}
export type WarehouseRecordKind="decision"|"approval"|"experiment"|"outcome";
export interface WarehouseRecordLink {kind:WarehouseRecordKind;recordId:string;snapshotId:string;tenantId:string;accountId:string;linkedAt:string}
export interface RawConnectorRecord {id:string;tenantId:string;accountId:string;snapshotId:string;source:string;retrievedAt:string;contentHash:string;payload:unknown}
export interface ReconstructedDecisionEvidence {link:DecisionEvidenceLink;snapshot:WarehouseSnapshot;evidence:WarehouseEvidence[];lineage:WarehouseLineage[]}
export interface WarehouseExport {schemaVersion:typeof WAREHOUSE_SCHEMA_VERSION;exportedAt:string;scope:WarehouseScope;snapshots:WarehouseSnapshot[];rawRecords:RawConnectorRecord[];evidence:WarehouseEvidence[];lineage:WarehouseLineage[];recordLinks:WarehouseRecordLink[]}
export interface ReconstructedSnapshot {snapshot:WarehouseSnapshot;evidence:WarehouseEvidence[];lineage:WarehouseLineage[]}
export interface EvidenceWarehouse {saveBundle(bundle:EvidenceBundle,scope:WarehouseScope):WarehouseSnapshot;saveRawRecords(snapshotId:string,source:string,records:unknown[],scope:WarehouseScope):RawConnectorRecord[];getSnapshot(id:string,scope:WarehouseScope):WarehouseSnapshot|undefined;listSnapshots(scope:WarehouseScope,limit?:number):WarehouseSnapshot[];reconstructSnapshot(id:string,scope:WarehouseScope):ReconstructedSnapshot;linkRecord(kind:WarehouseRecordKind,recordId:string,snapshotId:string,scope:WarehouseScope):WarehouseRecordLink;linkDecision(decisionId:string,snapshotId:string,scope:WarehouseScope):DecisionEvidenceLink;reconstructDecision(decisionId:string,scope:WarehouseScope):ReconstructedDecisionEvidence[];exportScope(scope:WarehouseScope):WarehouseExport;deleteScope(scope:WarehouseScope):{snapshots:number;rawRecords:number;evidence:number;lineage:number;recordLinks:number};applyRetention(scope:WarehouseScope,before:string):{snapshots:number};close():void}
