# Changelog

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
