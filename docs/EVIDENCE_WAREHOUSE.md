# Historical evidence warehouse

The warehouse preserves the exact normalized evidence, lineage and definition versions used by a decision. Local deployments use SQLite in WAL mode at `MARKETING_WAREHOUSE_DB` or the private runtime state directory. Hosted deployments use `PostgresEvidenceWarehouse` with `WAREHOUSE_DATABASE_URL`.

Each immutable snapshot records its content hash, retrieval time, mapping version, semantic schema version and metric-definition version. Evidence rows retain their source, source record ID, calculation method and limitations. Identical bundle writes are idempotent. Snapshot writes are transactional: a failed write rolls back rather than creating a partial analytical record.

`save_evidence_snapshot` writes both the backwards-compatible private JSON file and the warehouse record. Its returned `snapshot.id` can be supplied to `create_marketing_decision`; the decision tool validates tenant/account ownership before recording the link. A past decision can therefore be reconstructed from the evidence and definitions available at that time.

Every operation requires tenant and account IDs. Scope export returns snapshots, evidence, lineage and decision links. Scope deletion removes those records transactionally. Retention removes only old unlinked snapshots; decision-linked evidence is preserved.

Warehouse files contain sensitive metrics. Keep them outside Git, use restrictive permissions and encrypted backups, and never store credentials in evidence payloads. Hosted operators must use TLS, encryption at rest, least-privilege roles and tested backups. Postgres remains a reference implementation, not a production-readiness claim.

Run `npm run test:warehouse` after schema or lineage changes. Future schema versions require explicit migrations and compatibility fixtures.
