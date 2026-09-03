# Normalized evidence model

Every live record retains:

- Stable evidence ID
- Source and property/account
- Reporting period and retrieval time
- Explicit, inferred or unmapped segment
- Query, landing page, campaign and source/medium where applicable
- Source-specific observed metrics
- Calculation method
- Limitations and partial-data warnings

## Mapping

Set `MARKETING_MAPPING_FILE` to an absolute JSON path based on `config/marketing-mapping.example.json`. Rules use case-insensitive literal containment across queries, landing pages and campaigns. The first matching segment wins, so place specific rules before broad rules.

Configured mappings receive greater confidence than URL-path inference. A mapping is an operator assertion, not proof of attribution; campaign-to-pipeline reports expose unmatched names instead of silently joining them.

## Evidence hierarchy

Deterministic recommendations prioritize:

1. Closed-won CRM revenue
2. Qualified CRM pipeline and opportunities
3. CRM SQL and MQL progression
4. Platform conversions or GA4 key events
5. Sessions and clicks
6. Impressions

The model never relabels GA4 key events or Google Ads conversions as CRM lifecycle outcomes.

## Snapshots

`save_evidence_snapshot` is an explicit local write. Files are created with restrictive permissions in git-ignored `data/snapshots/`, or in `MARKETING_SNAPSHOT_DIR` when configured. Snapshot files contain normalized evidence and provenance, never credential contents. Use separate review dates before running `content_decay_monitor`.

## Structured MCP results

Successful tools return both Markdown content and `structuredContent` containing the deterministic data and response metadata. This preserves compatibility with conversational clients while allowing programmatic clients to consume typed evidence.
