# General Marketing Intelligence MCP

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)
[![Verify](https://github.com/Gourav2411/general-marketing-intelligence/actions/workflows/verify.yml/badge.svg)](https://github.com/Gourav2411/general-marketing-intelligence/actions/workflows/verify.yml)

A reusable stdio MCP server that combines direct Google Search Console and GA4 reporting with paid-media and conversion CSVs to produce deterministic marketing decisions. It is designed for a Head of Marketing, growth team or agency that needs answers—not another dashboard.

## What it answers

- What changed across acquisition?
- Which organic themes deserve action?
- Which paid campaigns should scale, hold or reduce?
- Where should incremental budget go?
- Which audience or use case deserves a coordinated growth bet?
- What should the team do next week?

OpenAI is optional. Code remains the source of metrics, scores, rankings and allocations.

## Quick start

Requires Node.js 20+.

```bash
npm install
npm run build
npm run demo -- growth-bet
```

Other demos:

```bash
npm run demo -- radar
npm run demo -- budget
npm run demo -- roundtable
```

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
        "/absolute/path/to/general-marketing-intelligence/dist/index.js"
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

The current server is local stdio. A shared one-click connection for remote teams requires a hosted Streamable HTTP service with authentication and tenant isolation; see the client guide for that boundary.

## MCP Inspector

```bash
npx -y @modelcontextprotocol/inspector@latest node dist/index.js
```

For local data:

```bash
DATA_MODE=local npx -y @modelcontextprotocol/inspector@latest node dist/index.js
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
| `connection_status` | Which data and AI modes are active? |
| `google_search_console_report` | What queries and pages drive Google demand, and how did they change? |
| `ga4_acquisition_report` | Which sources, campaigns and landing pages drive sessions and key events? |

## Verification

```bash
npm run verify
```

This covers build, typecheck, deterministic decision cases, AI validation/fallback, local CSV behavior, arbitrary-segment output, stdio discovery and invocation of all fourteen tools.

## Boundaries

- Search Console and GA4 have implemented read-only report tools. Paid-media and CRM/pipeline data remain CSV-backed.
- Direct Google reports are not yet normalized into `opportunity_radar` or other cross-channel decision tools.
- Estimated pipeline is only as reliable as the supplied attribution and CRM definitions.
- Scores and confidence labels are transparent heuristics, not causal or statistical models.
- Tools recommend; they never change spend, publish, message people or write to business systems.
- [`SKILL.md`](skills/general-marketing-intelligence/SKILL.md) affects hosts that explicitly load project skills.

## Security

Never commit service-account JSON, `.env` files, API keys or customer data. Report vulnerabilities privately through the repository Security tab; see [`SECURITY.md`](SECURITY.md). This local stdio server is not hardened for direct public-internet exposure.

## Contributing

Contributions are welcome through issues and pull requests. Read [`CONTRIBUTING.md`](CONTRIBUTING.md), follow the [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md), and sign commits under the [`DCO.md`](DCO.md). Project decisions and ownership are described in [`GOVERNANCE.md`](GOVERNANCE.md).

## License

Copyright 2026 Gourav Kondadadi. Licensed under the [Apache License 2.0](LICENSE). The license includes an express patent grant; trademarks and product names remain with their respective owners. See [`NOTICE`](NOTICE).

The software is provided “AS IS”, without warranties or conditions of any kind. It provides analytical recommendations, not legal, financial or professional advice.
