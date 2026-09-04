# Changelog

## [1.3.0] - 2026-09-04

### Added

- Deterministic observed-query classification and SEO/SEM opportunity ranking.
- Separate growth-strategy, marketing-strategy, paid-search-plan and email-plan tools.
- Versioned read/draft/write action policy with budget and audience limits.
- Immutable action previews, exact expiring approvals, separate execution, revocation, single-use enforcement and local audit history.
- Approved private local campaign-draft executor and per-tenant hosted action directories.
- Action policy schema, security documentation and approval/strategy tests.

### Security

- Read-only remains the default and all external platform write adapters remain disabled.
- Hosted credential projection now rejects unknown credential keys and requires explicit `actions` source permission.
- The local stdio human-origin trust boundary is documented explicitly.

## [1.3.0] - 2026-09-04

### Added

- Deterministic keyword opportunity classification using observed GSC and Google Ads search-term evidence.
- Separate growth-strategy, marketing-strategy, paid-campaign draft and email-campaign draft tools.
- Explicit `read_only`, `draft_only` and `read_write` action policies.
- Expiring, hash-bound preview, exact approval, execution, revocation and audit lifecycle.
- Tenant-isolated hosted action and draft storage.

### Security

- Read-only remains the default, and every executable action requires a separate exact approval.
- Approvals are single use and payload changes invalidate execution.
- This release only executes private local campaign-draft saves. Google Ads, CRM and email mutation adapters remain disabled.

## [1.2.0] - 2026-09-04

### Added

- Separate stateless Streamable HTTP hosted entry point while retaining stdio.
- External OIDC/JWKS bearer-token verification and OAuth protected-resource metadata.
- Tenant/source RBAC policy, AES-256-GCM tenant credential envelopes, revocation, retention, rate limits and credential-free audit events.
- Versioned configuration schema and migration/hosting documentation.
- Hosted security and MCP schema compatibility tests plus coverage reporting.
- CodeQL, dependency review, license policy, CycloneDX SBOM and GitHub artifact attestations for tagged builds.

### Changed

- Local MCP clients now launch `dist/stdio.js`; see `docs/MIGRATIONS.md`.

All notable changes follow semantic versioning.

## [1.1.0] - 2026-09-04

### Added

- Structured MCP content alongside Markdown responses.
- Setup diagnostics with optional minimal live connector checks.
- Retry, timeout and error classification for Google APIs.
- GSC pagination, filters, search types and comparison modes.
- GA4 filters, channel grouping, comparisons, sampling and quota metadata.
- Shared normalized evidence, explicit mapping and local snapshots.
- Read-only Google Ads GAQL reporting.
- Read-only HubSpot and Salesforce funnel reporting.
- Vendor-neutral CRM CSV contract.
- Nine executive decision outputs and a connector catalog.
- Guided `setup`, `connect:google`, `doctor` and `doctor:live` commands.
- Mocked connector, normalization and resilience tests.

### Security

- No connector implements mutation operations.
- Setup output and snapshots are private, git-ignored local files.
- Credential contents are never returned by diagnostics.
