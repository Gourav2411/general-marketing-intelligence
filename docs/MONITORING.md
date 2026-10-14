# Continuous ingestion and decision-oriented monitoring

GMI monitoring is local-first and read-only. A cycle retrieves the configured evidence, writes one immutable warehouse snapshot, compares it with the prior snapshot and creates alerts only when a business decision may be affected.

## MCP workflow

1. Run `diagnose_setup` and correct connector errors.
2. Invoke `run_monitoring_cycle` with a stable idempotency key, such as `weekly-2026-10-12-account-a`.
3. Invoke `monitoring_alerts` to review open decision-oriented alerts.
4. Invoke `monitoring_status` to inspect checkpoints, failures and safe remediation.
5. Use the relevant executive tool before making a decision. Monitoring never changes a campaign or CRM record.

The same idempotency key returns the existing job instead of repeating ingestion. New keys create new cycles. Each completed cycle records its evidence checkpoint and snapshot ID.

## Signals

- Connector and mapping health
- Evidence freshness
- Material cross-snapshot anomalies
- Spend pacing changes
- Lead-to-opportunity or spend-to-pipeline leakage
- Organic click decay
- Decisions still active without a review after 30 days

Alerts name the affected decision, evidence IDs and a bounded next action. Repeated signals reuse a stable fingerprint, increment their occurrence count and are reported as suppressed duplicates rather than creating alert noise.

## Local state and privacy

Monitoring state defaults to `~/.general-marketing-intelligence/monitoring/monitoring.sqlite`. Override it with `MARKETING_MONITORING_DB` or move all runtime state with `GMI_STATE_DIR`.

Credential values are not stored in jobs or alerts. Connector failures are reduced to an error class and safe remediation. Warning text is redacted before persistence. Tenant and account identifiers scope every job and alert.

## Scheduling

Run a bounded cycle directly with:

```bash
npm run monitor:once -- --window 2026-10-12 --days 28 --row-limit 500
```

The default key combines tenant, account and UTC date. A trusted local scheduler or hosted job runner can execute this command daily or weekly. Retries for the same window reuse the same job; a new window creates a new job. The command emits status, checkpoint, alert metadata and remediation only, never credentials.
