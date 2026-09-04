# General Marketing Intelligence MCP

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)
[![Verify](https://github.com/Gourav2411/general-marketing-intelligence/actions/workflows/verify.yml/badge.svg)](https://github.com/Gourav2411/general-marketing-intelligence/actions/workflows/verify.yml)
[![CodeQL](https://github.com/Gourav2411/general-marketing-intelligence/actions/workflows/codeql.yml/badge.svg)](https://github.com/Gourav2411/general-marketing-intelligence/actions/workflows/codeql.yml)
[![Release](https://img.shields.io/github/v/release/Gourav2411/general-marketing-intelligence)](https://github.com/Gourav2411/general-marketing-intelligence/releases/latest)

An open-source marketing decision layer for Claude, Codex and other MCP clients. It connects acquisition, web analytics and CRM evidence, performs calculations in code, and turns the results into decision-oriented marketing outputs.

**Code calculates. AI interprets. The marketing leader decides.**

The current release provides 32 MCP tools, read-only connectors for Google Search Console, GA4, Google Ads, HubSpot, Salesforce and generic CRM CSV data, plus local stdio and a separately configured hosted Streamable HTTP reference edition.

## Why this exists

Marketing teams already have dashboards. The harder problem is combining search demand, website behavior, advertising cost and pipeline evidence into a defensible decision.

General Marketing Intelligence is designed to answer questions such as:

- What changed, and does it matter commercially?
- Which channel or landing page deserves attention?
- Are campaigns producing pipeline or merely inexpensive leads?
- Which measurement gaps prevent a confident decision?
- What should the team start, stop or continue?
- What is the next growth bet, and how should it be tested?

The MCP server retrieves and normalizes evidence. Deterministic TypeScript functions calculate comparisons, efficiency, scores, rankings, thresholds and allocations. The host model explains the evidence and helps form a strategy without becoming the source of the underlying numbers.

## Current capabilities

| Area | What is implemented |
|---|---|
| Search intelligence | Filtered GSC query and page reporting, pagination, country, device, search type, brand classification and period comparisons |
| Website behavior | GA4 acquisition, campaign, channel and landing-page evidence with sampling and quota metadata |
| Paid acquisition | Read-only Google Ads GAQL reports for campaigns, ad groups, search terms, landing pages, devices and geography |
| Commercial outcomes | HubSpot, Salesforce and vendor-neutral CRM CSV funnel, opportunity, pipeline and closed-won evidence |
| Executive decisions | Growth reviews, channel scorecards, landing-page opportunities, measurement audits, experiment reviews and growth-bet recommendations |
| Evidence governance | Normalized provenance, explicit mapping, confidence limitations, local snapshots and structured MCP responses |
| AI safety | Code-owned calculations, structured AI validation, numeric-integrity checks and deterministic fallback |
| Team architecture | Authenticated Streamable HTTP reference, external OIDC/JWKS verification, tenant/source permissions, encrypted credentials, revocation, audit events and rate limits |
| Engineering | Node 20/22 CI, CodeQL, dependency review, license policy, coverage, schema compatibility tests, SBOMs and build attestations |

## How it works

```text
GSC     GA4     Google Ads     CRM / CSV
 |       |          |              |
 +-------+----------+--------------+
                    |
          Normalized evidence layer
                    |
      Deterministic analysis and scoring
                    |
          MCP tools and structured data
                    |
              Claude or Codex
                    |
       Evidence-backed marketing decision
```

The server never changes advertising budgets, publishes content or writes to business systems. It recommends actions and leaves execution with the user.

## Quick start

Requires Node.js 20+.

```bash
git clone https://github.com/Gourav2411/general-marketing-intelligence.git
cd general-marketing-intelligence
npm ci
npm run build
npm run demo -- growth-bet
```

Other demos:

```bash
npm run demo -- radar
npm run demo -- budget
npm run demo -- roundtable
```

For an interactive private configuration flow:

```bash
npm run setup
npm run doctor
npm run doctor:live
```

Use `npm run connect:google` for GSC and GA4 only. Setup validates paths and identifiers, creates private Claude/Codex configuration output under git-ignored `setup-output/`, and can update Claude Desktop with a timestamped backup when invoked as `npm run setup -- --apply-claude`. It never prints credential contents.

For organization access, the separate hosted reference edition adds authenticated Streamable HTTP, tenant/source authorization, encrypted tenant credentials, audit events, rate limits, revocation and retention controls. It requires your own OIDC provider, TLS proxy and production storage/KMS adapters; do not expose the local stdio server. See [`docs/HOSTING.md`](docs/HOSTING.md) and [`docs/MIGRATIONS.md`](docs/MIGRATIONS.md).

## Ask an executive question

After connecting GSC and GA4, try:

> Use General Marketing Intelligence to review the last 28 completed days. Call `executive_growth_review`, `channel_health_scorecard`, `landing_page_opportunity_report`, `measurement_quality_audit` and `recommend_next_growth_bet`. Produce a 30-day plan that separates observed facts, interpretation, assumptions and recommendations. Include owners, success metrics, decision thresholds and review dates. Do not invent unavailable commercial metrics.

When Google Ads and CRM are also configured, add `campaign_to_pipeline_report` so platform conversions are evaluated against pipeline and closed-won evidence.

## Import your data

Create one folder containing:

- `search-console.csv`
- `google-ads.csv`
- `conversions.csv`

Copy the schemas from [`templates/`](templates/). `segment` is free text: product line, persona, region, vertical, use case, customer tier or another consistent grouping.

```bash
npm run import:csv -- "/absolute/path/to/csv-folder"
DATA_MODE=local npm run demo -- growth-bet
```

Imports validate required columns, numeric values, CTR, funnel order, clicks/impressions, non-empty segments and paid-campaign matching. Valid files go to git-ignored `data/local/`. Restart a running MCP server after each import.

## Connect Google Search Console and GA4 directly

The server includes read-only `google_search_console_report` and `ga4_acquisition_report` tools. Both use a service-account JSON file stored outside the repository on the local machine.

1. Create or select a Google Cloud project.
2. Enable the Search Console API and Google Analytics Data API.
3. Create a service account and download its JSON key locally.
4. Add the service-account email as a user on the Search Console property and as a Viewer on the GA4 property.
5. Configure the MCP host environment:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json
GSC_SITE_URL=https://www.example.com/
GA4_PROPERTY_ID=123456789
```

Then restart Claude or Codex and ask it to invoke the direct Google tools. Never commit the service-account JSON or place its contents in a prompt.

Search Console compares the requested period with the immediately preceding period and returns query/page metrics. GA4 returns source/medium, campaign and landing-page performance with sessions, users, configured key events and revenue. These tools do not claim that GA4 events or revenue equal CRM pipeline.

Both tools support explicit periods, previous-period or year-over-year comparison, filters and row limits. GSC supports country, device, search type, page and query filters. GA4 supports country, device, landing page, campaign and default channel-group filters.

## Connect Google Ads and CRM

Google Ads uses read-only GAQL reports for campaign, ad-group, search-term, landing-page, device and geography evidence. Configure the variables documented in [`.env.example`](.env.example); an optional manager account uses `GOOGLE_ADS_LOGIN_CUSTOMER_ID`. There are no campaign mutation methods.

Choose one CRM source:

- `CRM_PROVIDER=hubspot` with a read-only HubSpot private-app token.
- `CRM_PROVIDER=salesforce` with an HTTPS instance URL and read-only OAuth access token.
- `CRM_PROVIDER=csv` with `GENERIC_CRM_CSV` pointing to the schema in [`templates/crm-funnel.csv`](templates/crm-funnel.csv).

CRM stages and attribution fields are organization-specific. Define and govern MQL, SQL, opportunity, pipeline and revenue semantics before using them for investment decisions. See [`docs/CONNECTORS.md`](docs/CONNECTORS.md) for scopes, limitations and setup details.

## Normalize cross-channel evidence

All implemented live connectors emit a shared evidence contract with source, property, period, retrieval time, segment mapping, metrics, provenance and limitations. Copy [`config/marketing-mapping.example.json`](config/marketing-mapping.example.json), customize it, and set `MARKETING_MAPPING_FILE` to its absolute path.

Without explicit mapping, URL-path inference is used and confidence is limited. Use `save_evidence_snapshot` deliberately to store a private local metric snapshot, then `content_decay_monitor` to compare snapshots. Snapshot and setup directories are git-ignored with restrictive file permissions. See [`docs/EVIDENCE_MODEL.md`](docs/EVIDENCE_MODEL.md).

### Claude Desktop: complete Google setup

#### 1. Create one read-only Google identity

1. In [Google Cloud Console](https://console.cloud.google.com/), create or select a project.
2. Enable **Google Analytics Data API** and **Google Search Console API** under **APIs & Services → Library**.
3. Under **IAM & Admin → Service Accounts**, create a service account such as `marketing-intelligence-reader`.
4. No Google Cloud IAM role is required for this service account.
5. Open the service account, select **Keys → Add key → Create new key → JSON**, and download the file.

Keep the JSON outside this repository. A downloaded file normally has this macOS path structure:

```text
/Users/YOUR_MAC_USERNAME/Downloads/FILENAME.json
```

For a permanent installation, move it to a private location such as:

```text
/Users/YOUR_MAC_USERNAME/.config/google/marketing-intelligence-reader.json
```

In Finder, hold **Option**, right-click the file, and select **Copy as Pathname** to obtain the exact path. Never paste the JSON contents into Claude or commit the file to Git.

#### 2. Grant the minimum product permissions

Copy the service-account email ending in `.iam.gserviceaccount.com`, then grant it:

- **GA4:** **Admin → Property access management → Add users → Viewer**.
- **Search Console:** **Settings → Users and permissions → Add user → Full**.

Do not grant Google Cloud Owner, Editor, Billing, Service Account Admin, GA4 Administrator, or Search Console Owner roles.

Record:

- The numeric GA4 **Property ID**, such as `123456789`—not the `G-...` Measurement ID.
- The exact Search Console property identifier. A domain property uses `sc-domain:example.com`; a URL-prefix property uses its exact registered value, such as `https://www.example.com/`.

#### 3. Configure Claude Desktop on macOS

Quit Claude Desktop with **Command-Q**. In Finder, press **Command-Shift-G** and open:

```text
~/Library/Application Support/Claude/
```

Edit `claude_desktop_config.json`. Add the following server under `mcpServers`, preserving any other servers already in the file:

```json
{
  "mcpServers": {
    "general-marketing-intelligence": {
      "type": "stdio",
      "command": "node",
      "args": [
        "/absolute/path/to/general-marketing-intelligence/dist/stdio.js"
      ],
      "env": {
        "DATA_MODE": "demo",
        "AI_PROVIDER": "none",
        "CURRENCY_CODE": "USD",
        "NUMBER_LOCALE": "en-US",
        "GOOGLE_APPLICATION_CREDENTIALS": "/Users/YOUR_MAC_USERNAME/.config/google/marketing-intelligence-reader.json",
        "GSC_SITE_URL": "sc-domain:example.com",
        "GA4_PROPERTY_ID": "123456789"
      }
    }
  }
}
```

Use absolute paths. Claude Desktop does not expand shell aliases inside this configuration. `AI_PROVIDER=none` is intentional: Claude supplies the model reasoning while the MCP server supplies data and code-calculated metrics.

Use `DATA_MODE=demo` when testing the direct GSC and GA4 tools without CSV uploads. Change it to `local` only after importing all three required CSV files with `npm run import:csv`; if those files are missing, the server safely falls back to demo data instead of disconnecting.

Save the file and reopen Claude Desktop. In a new conversation, test in this order:

1. “Use General Marketing Intelligence and call `connection_status`.”
2. “Call `google_search_console_report` for the last 28 completed days.”
3. “Call `ga4_acquisition_report` for the last 28 days.”

If the server is disconnected, check the JSON syntax, confirm both absolute paths exist, run `npm run build` in the repository, and fully restart Claude. If a Google tool returns a permission error, confirm that the same service-account email was added to the exact GA4 and Search Console properties configured above.

## Currency

The default is USD. Override formatting without changing the input numbers:

```bash
CURRENCY_CODE=INR NUMBER_LOCALE=en-IN DATA_MODE=local npm run demo -- budget
```

## Optional OpenAI layer

```bash
cp .env.example .env
```

Configure the MCP host environment:

```bash
DATA_MODE=local
AI_PROVIDER=openai
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-5.6-terra
```

OpenAI receives observed facts, calculated metrics, deterministic scores, the selected evidence state and the unmodified deterministic output. Structured validation and numeric-integrity checks fail safely back to code-only output.

## Start the MCP server

```bash
npm run build
npm start
```

A stdio MCP server normally waits silently for a client.

## Connect Claude or OpenAI Codex

This server works as a local intelligence layer in both clients. When Claude or Codex is the host, use `AI_PROVIDER=none`: the host model interprets the deterministic MCP results, so there is no nested model call.

See [`docs/CLIENTS.md`](docs/CLIENTS.md) for exact Codex CLI, Claude Code and Claude Desktop configuration. The repository also includes a project-scoped [`.mcp.json`](.mcp.json) for Claude Code demo mode.

After connecting, try:

- “Use General Marketing Intelligence to give me the weekly growth brief.”
- “Audit paid search and explain which campaigns should scale or stop.”
- “Build a growth bet for the strongest segment.”

Local stdio is the recommended path for individual use. A shared team deployment can use the hosted reference entry point described below.

## Hosted reference edition

`npm run start:hosted` starts a loopback-only Streamable HTTP resource server. It includes external OIDC/JWKS token validation, Origin allowlisting, tenant and source permissions, AES-256-GCM credential envelopes, revocation, retention controls, rate limits and secret-free audit events.

It is deliberately not presented as a turnkey SaaS. Before public deployment, replace the reference filesystem and in-memory adapters with production KMS, secret-manager, database, distributed rate-limit and append-only audit services. Terminate TLS at a trusted proxy and complete a security review. See [`docs/HOSTING.md`](docs/HOSTING.md).

## MCP Inspector

```bash
npx -y @modelcontextprotocol/inspector@latest node dist/stdio.js
```

For local data:

```bash
DATA_MODE=local npx -y @modelcontextprotocol/inspector@latest node dist/stdio.js
```

Connect using **STDIO**, open **Tools**, invoke `connection_status`, then try `opportunity_radar` or `build_growth_bet`.

## Tools

| Tool | Decision |
|---|---|
| `growth_snapshot` | What materially changed? |
| `find_seo_opportunities` | Which organic themes deserve action? |
| `audit_paid_search` | What should scale, hold or reduce? |
| `opportunity_radar` | Which segments show joined demand and pipeline evidence? |
| `weekly_growth_brief` | What are the five next actions? |
| `paid_performance_review` | How do campaign economics compare? |
| `budget_allocator` | Where should incremental budget go? |
| `design_paid_experiment` | How should a controlled test run? |
| `content_strategy` | What content has a commercial job? |
| `create_campaign_asset` | What should a proof-safe asset contain? |
| `build_growth_bet` | How should channels coordinate around one opportunity? |
| `connection_status` / `diagnose_setup` | Which modes, credentials and APIs are ready? |
| `google_search_console_report` | What queries and pages drive Google demand, and how did they change? |
| `ga4_acquisition_report` | Which sources, campaigns and landing pages drive sessions and key events? |
| `google_ads_report` | How do campaigns, ad groups, search terms, landing pages, devices and geographies perform? |
| `hubspot_funnel_report` | What lifecycle and deal evidence exists in HubSpot? |
| `salesforce_funnel_report` | What lead and opportunity evidence exists in Salesforce? |
| `generic_crm_csv_report` | What funnel evidence exists in a vendor-neutral CRM export? |
| `connector_catalog` | Which normalized connectors are implemented or planned? |
| `live_opportunity_radar` | Which mapped GSC/GA4 opportunities deserve validation? |
| `save_evidence_snapshot` / `snapshot_history` | What historical evidence has been stored locally? |
| `executive_growth_review` | What matters commercially across all configured evidence? |
| `channel_health_scorecard` | Which channels have traffic, conversion or CRM evidence? |
| `landing_page_opportunity_report` | Which pages should be protected, validated or improved? |
| `brand_vs_nonbrand_search` | How do explicitly classified brand and non-brand queries compare? |
| `content_decay_monitor` | Which query/page signals declined across snapshots? |
| `campaign_to_pipeline_report` | Which paid campaigns match CRM pipeline and revenue? |
| `measurement_quality_audit` | Which evidence and governance gaps block confident decisions? |
| `experiment_review` | Did an experiment clear its explicit efficiency or pipeline threshold? |
| `recommend_next_growth_bet` | Which segment has the strongest evidence-weighted next bet? |

## Verification

```bash
npm run verify
```

This covers build, typecheck, deterministic decision cases, AI validation/fallback, local CSV behavior, mocked GSC/GA4/Google Ads/CRM responses, retry and error classification, normalization, stdio discovery and invocation of all 32 tools.

Tagged releases additionally produce a CycloneDX software bill of materials, SHA-256 checksums and GitHub build-provenance attestations. Public tool compatibility is protected by an MCP schema contract test.

## Boundaries

- Search Console, GA4, Google Ads, HubSpot, Salesforce and generic CRM CSV have implemented read-only report paths.
- Mapping quality and source definitions determine whether cross-platform joins are trustworthy.
- Estimated pipeline is only as reliable as the supplied attribution and CRM definitions.
- Scores and confidence labels are transparent heuristics, not causal or statistical models.
- Tools recommend; they never change spend, publish, message people or write to business systems.
- [`SKILL.md`](skills/general-marketing-intelligence/SKILL.md) affects hosts that explicitly load project skills.

## Security

Never commit service-account JSON, `.env` files, API keys or customer data. Report vulnerabilities privately through the repository Security tab; see [`SECURITY.md`](SECURITY.md). Never expose the stdio entry point to the public internet. The hosted entry point remains a reference architecture until its local storage and process-level controls are replaced with production infrastructure.

## Roadmap

Near-term priorities include:

- Browser-based OAuth and account/property discovery
- Stronger campaign and landing-page identity resolution across platforms
- Meta Ads and additional normalized connector implementations
- Scheduled executive reviews and decision-history tracking
- More hosted HTTP, authentication and multi-tenant integration coverage
- Validation with real marketing teams and documented case studies

The project is open source so marketers, analysts and engineers can use it, question its assumptions and improve it. Issues and focused pull requests are welcome.

## Contributing

Contributions are welcome through issues and pull requests. Read [`CONTRIBUTING.md`](CONTRIBUTING.md), follow the [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md), and sign commits under the [`DCO.md`](DCO.md). Project decisions and ownership are described in [`GOVERNANCE.md`](GOVERNANCE.md).

## License

Copyright 2026 Gourav Kondadadi. Licensed under the [Apache License 2.0](LICENSE). The license includes an express patent grant; trademarks and product names remain with their respective owners. See [`NOTICE`](NOTICE).

The software is provided “AS IS”, without warranties or conditions of any kind. It provides analytical recommendations, not legal, financial or professional advice.
