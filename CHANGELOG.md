# Changelog

## [Unreleased]

### Added

- Added a shared AI-guided setup playbook with repository entry points for Claude and Codex, connector routing, least-privilege rules, client-specific configuration and layered verification.

## [Unreleased]

### Added

- Added deterministic account-context retrieval ranked by relevance, recency and outcome strength, with provenance IDs and bounded prompt context.
- Added contradiction detection, tenant-isolation and evaluator-memory regression coverage.

### Changed

- Connected outcome-backed account learning to the nine-evaluator decision council and optional OpenAI reasoning path.
- Extended `inspect_account_learning` with question-aware retrieval and structured context diagnostics.

## [1.13.2] - 2026-09-18

### Fixed

- Removed the MCP client's working directory from local telemetry, decision, approval, memory and snapshot path resolution.
- Added `GMI_STATE_DIR`, defaulting to `~/.general-marketing-intelligence`, as the shared writable local state root.
- Made privacy-filtered telemetry fail safely when its destination is unavailable so observability cannot prevent tools from reaching configured connectors.
- Added a regression test that runs from `/` and verifies writable state remains available outside the process working directory.

## [1.13.1] - 2026-09-15

### Security

- Removed environment-derived account identifiers and learning contents from legacy memory CLI logs; added a regression test for the CodeQL clear-text logging path.

## [1.13.0] - 2026-09-15

### Added

- Added decision, outcome and account-learning MCP tools backed by SQLite locally and optional Postgres for hosted deployments.
- Added automatic nine-evaluator councils to executive tools.
- Added an explicit-cost live three-mode benchmark, blinded review files, a human rubric and inter-rater agreement reporting.
- Added privacy-filtered telemetry and metadata for every registered tool.
- Added optional embedding retrieval blended with structural scores and deterministic fallback.
- Added an opt-in, one-task HubSpot R2 adapter with evidence, idempotency and separate approval.
- Added a governed roadmap for the remaining 218 corpus cases; unreviewed synthetic cases were not added.

### Changed

- Expanded the MCP interface from 54 to 59 tools without removing existing tools.
- Migrated new local Decision, Outcome and Learning persistence to SQLite with a legacy JSONL importer.

## [1.12.0] - 2026-09-15

### Architecture

- Added an inspectable deterministic transferability model with documented score components, structural fit, non-transfer penalties and deterministic fallback.
- Added a typed, serializable, tenant-scoped marketing knowledge graph with canonical identity keys and normalized evidence adapters.
- Replaced prompt-only strategic-role simulation with nine independent deterministic evaluator modules and explicit disagreement synthesis.
- Added Decision, Outcome and Learning records with outcome-gated learning, contradictory-evidence corrections and account-scoped future context.
- Added R0-R4 action declarations, tenant and risk enforcement, idempotency and structured action telemetry while keeping every external write adapter disabled.
- Replaced evidence-only numeric matching with typed observed, calculated, proposed and external-reference provenance.
- Added untrusted-source sanitization for connector, CRM and corpus text.

### Evaluation

- Added a 180-scenario decision-system benchmark with 70% adversarial, ambiguous or no-action cases and JSON/Markdown output.
- Added graph, transferability, evaluator-disagreement, decision-loop, numeric-provenance, prompt-injection and action-risk tests.

### Documentation

- Added a single end-to-end data connection guide for Claude Desktop, Claude Code and OpenAI Codex.
- Added detailed least-privilege setup, configuration, verification prompts and troubleshooting for GSC, GA4, Google Ads, Meta Ads, LinkedIn Ads, HubSpot, Salesforce, generic CRM APIs, CRM CSV and paid-media CSV.
- Added a connector readiness matrix and explicitly distinguished live connectors, CSV support and planned direct integrations.
- Added architecture, marketing graph, decision loop, evaluations and action risk-model guides.

## [1.11.0] - 2026-09-14

### Added

- Twelve governed historical cases selected to strengthen weak coverage across India and APAC, B2B and SaaS, pricing and promotions, product launches, lifecycle and email, SEO, media allocation and documented PR crises.
- Evidence-backed cases for Ariel, Tata Tea, Maggi, MX Player, Saramin, Slack, HubSpot, JCPenney, Samsung, Airbnb, Fashion Nova and Booking Holdings.

### Changed

- Expanded the trusted corpus from 20 to 32 native ontology-v2 cases across seven markets.
- Increased failed-or-mixed coverage from 8 to 13 cases, preserving the anti-survivorship-bias floor at 40.6%.
- Kept company-reported and platform-library outcomes conservatively graded when no controlled counterfactual is available.

### Known limits

- The 250-case corpus milestone remains unmet; 218 additional reviewed cases are required.
- Geographic and discipline coverage is improved but remains far from representative of all marketing history.

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
