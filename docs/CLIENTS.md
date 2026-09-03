# Connect Claude and OpenAI Codex

Build the server first:

```bash
npm install
npm run build
```

Use `AI_PROVIDER=none` when Claude or Codex is the MCP host. The host model should interpret the deterministic tool output directly. Enable embedded OpenAI only for Inspector or another client that does not provide its own reasoning model.

## OpenAI Codex

Run this with the repository's real absolute path:

```bash
codex mcp add general-marketing-intelligence \
  --env DATA_MODE=local \
  --env AI_PROVIDER=none \
  --env CURRENCY_CODE=USD \
  --env NUMBER_LOCALE=en-US \
  -- node "/absolute/path/to/general-marketing-intelligence/dist/index.js"
```

Verify:

```bash
codex mcp get general-marketing-intelligence
codex mcp list
```

Restart Codex, then ask: “Use General Marketing Intelligence to give me the weekly growth brief.”

## Claude Code

The repository includes `.mcp.json` for project-scoped demo mode. Open Claude Code from the repository, approve the project MCP server, and inspect it with `/mcp`.

For a user-scoped local-data installation:

```bash
claude mcp add --scope user --transport stdio \
  --env DATA_MODE=local \
  --env AI_PROVIDER=none \
  --env CURRENCY_CODE=USD \
  --env NUMBER_LOCALE=en-US \
  general-marketing-intelligence \
  -- node "/absolute/path/to/general-marketing-intelligence/dist/index.js"
```

Verify:

```bash
claude mcp get general-marketing-intelligence
claude mcp list
```

## Claude Desktop

Add this inside `mcpServers` in the Claude Desktop configuration, using absolute paths:

```json
{
  "mcpServers": {
    "general-marketing-intelligence": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/general-marketing-intelligence/dist/index.js"],
      "env": {
        "DATA_MODE": "local",
        "AI_PROVIDER": "none",
        "CURRENCY_CODE": "USD",
        "NUMBER_LOCALE": "en-US"
      }
    }
  }
}
```

Restart Claude Desktop after saving the configuration.

## Enable direct Google data

GSC and GA4 use the same Google Cloud service-account JSON file. Keep that file outside the repository, grant the service-account email access to the Search Console property and GA4 property, then add these variables to the MCP client's `env` block:

```json
{
  "GOOGLE_APPLICATION_CREDENTIALS": "/absolute/path/to/google-service-account.json",
  "GSC_SITE_URL": "sc-domain:example.com",
  "GA4_PROPERTY_ID": "123456789"
}
```

For a URL-prefix Search Console property, use the exact registered URL such as `https://www.example.com/`. `GA4_PROPERTY_ID` is the numeric property ID, not a Measurement ID such as `G-ABC123`.

Restart Claude or Codex after changing environment variables. Then ask it to call `connection_status`, followed by `google_search_console_report` or `ga4_acquisition_report`. These tools fetch live read-only data at invocation time; they do not copy credentials or Google data into this repository.

## Demo versus local data

- `DATA_MODE=demo`: bundled synthetic examples.
- `DATA_MODE=local`: files imported into `data/local` using `npm run import:csv -- "/path/to/folder"`.

The MCP server loads data on startup. Restart the host after importing replacement files.

## Embedded OpenAI (optional)

For Inspector or a model-less MCP client only:

```text
AI_PROVIDER=openai
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-5.6-terra
```

Do not place real keys in committed configuration files.

## Cloud access for teams

This repository currently implements local stdio. Every user must clone, install, build and configure it locally. A one-click Claude.ai or remotely managed Codex connection requires a hosted Streamable HTTP transport plus authentication, tenant isolation, encrypted data storage, rate limits, audit logging and a deployment environment. Do not expose the current local server directly to the public internet.
