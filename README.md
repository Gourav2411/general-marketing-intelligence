# General Marketing Intelligence MCP

A reusable stdio MCP server that converts search, paid-media and conversion CSVs into deterministic marketing decisions. It is designed for a Head of Marketing, growth team or agency that needs answers—not another dashboard.

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

## Verification

```bash
npm run verify
```

This covers build, typecheck, deterministic decision cases, AI validation/fallback, local CSV behavior, arbitrary-segment output, stdio discovery and invocation of all twelve tools.

## Boundaries

- CSV is the implemented data boundary; live APIs are future work.
- Estimated pipeline is only as reliable as the supplied attribution and CRM definitions.
- Scores and confidence labels are transparent heuristics, not causal or statistical models.
- Tools recommend; they never change spend, publish, message people or write to business systems.
- [`SKILL.md`](skills/general-marketing-intelligence/SKILL.md) affects hosts that explicitly load project skills.
