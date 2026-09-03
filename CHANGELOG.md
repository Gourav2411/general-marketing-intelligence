# Changelog

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
