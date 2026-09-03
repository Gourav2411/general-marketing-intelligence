# Migration guide

## 1.1.x to 1.2.0

The executable stdio entry point moved from `dist/index.js` to `dist/stdio.js` so the server factory can be reused safely by the hosted transport. Update Claude Desktop, Codex and Inspector configurations, then rebuild and restart the client.

```json
"args": ["/absolute/path/to/general-marketing-intelligence/dist/stdio.js"]
```

No tool was removed or renamed. The schema compatibility test continues to require all 32 v1.1 public tools and the reporting-control fields introduced in v1.1.

Configuration documents now declare `schemaVersion: 1` and validate against [`config/schema.v1.json`](../config/schema.v1.json). Environment variables remain supported for stdio. Hosted deployments additionally require the variables in [`docs/HOSTING.md`](HOSTING.md).

## Rollback

Restore the client argument to the prior release's `dist/index.js`, rebuild that tag and restart the client. Hosted tenant records use a versioned encrypted envelope and are not read by v1.1.

