# Changelog

## [1.10.0] - 2026-09-11

### Added

- Enriched all eight original cases into native ontology v2 with business context, source types, outcome measurements, rights and attributable review metadata.
- Added twelve sourced cases spanning identity redesign, deceptive advertising, review manipulation, education lead generation, brand platforms, fundraising, retail purpose and branded experiences.
- Expanded the trusted corpus to 20 cases with exactly 40% failed or mixed outcomes and 100% native-v2 enrichment.

### Evidence policy

- Regulatory cases use stronger source grades where the record supports them.
- Company and award claims remain conservatively graded when incrementality is not independently established.
- The 250-case corpus milestone remains unmet and is reported as such.

## [1.9.0] - 2026-09-11

### Added

- Corpus ontology v2 covering category, business model, market maturity, economic context, evidence grades, incrementality methods and outcome levels.
- Explicit source-type, rights-basis, redistribution and attributable reviewer metadata.
- Private staged contribution queue with exact and near-duplicate detection, change requests, approval audit and trusted-corpus promotion.
- Evidence-grade consistency checks that block claims stronger than their source and measurement methods support.
- Corpus health reporting with an enforced 250-case, 40% failed/mixed and 100% native-v2 editorial milestone.
- Candidate cross-case pattern discovery; only patterns with sufficient support and counterexamples can enter model context.
- A v2 contribution template, contributor workflow and corpus-foundation tests.

### Safety

- Unknown, restricted or non-redistributable contributions cannot be approved.
- Legacy cases are conservatively canonicalized at Grade D and remain visibly marked for v2 enrichment.
- The release does not manufacture cases to satisfy a corpus-count target.

## [1.8.0] - 2026-09-11

### Added

- A strict, provenance-bearing marketing-case schema and curated seed corpus covering successful, failed and mixed advertising, brand, product-launch and crisis-PR precedents.
- Deterministic precedent retrieval with evidence quality, causal confidence, failure modes and transfer/non-transfer conditions.
- A twelve-step strategic reasoning protocol, nine internal executive/creative/measurement lenses, red-team review and an executive decision contract in `SKILL.md`.
- Private, explicit, permission-restricted account learning records for decisions, outcomes, forecast errors and lessons.
- Controlled knowledge ingestion and validation commands plus a 100-scenario intelligence benchmark.
- Intelligence guidance in the existing `marketing_intelligence_router`; the MCP tool count remains unchanged.

### Security

- Account learning is git-ignored, stored with restrictive permissions and never captures credentials automatically.
- Corpus ingestion is dry-run by default and requires explicit commit plus human editorial/licensing review.
- Updated `csv-parse` to 7.0.2 to resolve GHSA-8cw4-87c7-c6xx.

## [1.7.0] - 2026-09-08

### Added

- `marketing_intelligence_router` and a backwards-compatible six-family tool catalog.
- CRM-enriched Google Ads strategy using explicit case-insensitive campaign-name matching.
- Generic paid-media CSV ingestion across Google, Meta, LinkedIn, Microsoft, YouTube and programmatic exports.
- Read-only, version-configurable Meta Insights and LinkedIn ad analytics connectors.
- Account/type empirical Bayesian baselines and deterministic anomaly, change-point, pacing, saturation and creative-fatigue screening.
- `npm run dashboard:claude` to reuse an allowlist of local Claude dashboard settings without printing credentials.
- Configurable public HTTPS JSON CRM adapter and a complete synthetic example analysis.

### Security

- Generic CRM endpoints must use HTTPS and cannot target loopback or private IPv4 hosts.
- New advertising connectors issue reporting reads only; Microsoft direct reporting remains explicitly planned rather than partially implemented.

## [1.6.0] - 2026-09-08

### Added

- Recommendation-only advertising strategy engine for Google, Meta, LinkedIn, Microsoft, YouTube and programmatic campaign types.
- Bayesian-shrunk conversion estimates, data-sufficiency and conversion-lag checks, and bounded daily budget-test suggestions.
- Campaign-type playbooks for search, Shopping, Performance Max, display, video, Demand Gen, social prospecting, retargeting, lead generation, ABM and programmatic display.
- `ad_strategy_review` for normalized cross-platform evidence and `google_ads_strategy_review` for live read-only GAQL campaign evidence.

### Safety

- No campaign, bid or budget mutation endpoint was added. Every suggestion is explicitly recommendation-only and requires human judgment outside the MCP.
- Suggested daily changes are capped, defaulting to ±10%, and sparse or conversion-lagged evidence produces a hold decision.

## [1.5.0] - 2026-09-08

### Added

- Live, read-only Google Search Console and GA4 dashboard datasets using existing service-account configuration.
- Date ranges with previous-period or year-over-year comparisons and current-versus-prior values.
- Geographic bubble charts, comparison-aware scorecards, trends and tables.
- `build_dashboard` MCP tool for validated 1-to-20-chart boards generated from Claude or Codex requests.
- One-click GSC/GA4 starter board and mocked live-provider transformation tests.

### Security

- Dashboard URLs contain allowlisted configuration only; evidence stays behind the loopback-only local server.
- Live dashboard queries use read-only Google scopes and deterministic code-owned calculations.

## [1.4.0] - 2026-09-08

### Added

- Local, dependency-free dashboard builder for Search Console, Google Ads and conversion/pipeline CSV evidence.
- User-controlled dataset, dimension, metric, aggregation, chart, sort, limit, filter and title parameters.
- Bar, horizontal-bar, line, area, donut, table and KPI rendering with browser-local layout persistence.
- `build_dashboard_chart` MCP tool for validated natural-language-to-dashboard links.
- Allowlisted, deterministic server-side aggregation and dashboard security tests.

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
