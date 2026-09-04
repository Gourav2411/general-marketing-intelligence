# Migration guide

## 1.2.x to 1.3.0

No existing tool was removed or renamed. Eleven tools were added for keyword intelligence, separate growth and marketing strategy, campaign planning, and the action approval lifecycle. The public tool count is now 43.

Action access defaults to `read_only`. To permit private local draft saving, set `MCP_ACCESS_MODE=draft_only`; or point `MCP_ACTION_POLICY_FILE` to a policy following `config/action-policy.schema.v1.json`. External platform write adapters remain disabled even in `read_write` mode. See [`HUMAN_APPROVALS.md`](HUMAN_APPROVALS.md).

No connector credential or configuration migration is required.

## 1.1.x to 1.2.0

The executable stdio entry point moved from `dist/index.js` to `dist/stdio.js` so the server factory can be reused safely by the hosted transport. Update Claude Desktop, Codex and Inspector configurations, then rebuild and restart the client.

```json
"args": ["/absolute/path/to/general-marketing-intelligence/dist/stdio.js"]
```

No tool was removed or renamed. At the time of this release, the schema compatibility test continued to require all 32 v1.1 public tools and the reporting-control fields introduced in v1.1.

Configuration documents now declare `schemaVersion: 1` and validate against [`config/schema.v1.json`](../config/schema.v1.json). Environment variables remain supported for stdio. Hosted deployments additionally require the variables in [`docs/HOSTING.md`](HOSTING.md).

## Rollback

Restore the client argument to the prior release's `dist/index.js`, rebuild that tag and restart the client. Hosted tenant records use a versioned encrypted envelope and are not read by v1.1.
