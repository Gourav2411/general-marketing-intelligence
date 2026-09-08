# Local dashboard builder

The dashboard is a local companion to the MCP server. It reads imported CSV evidence or retrieves live Google Search Console and GA4 data with the same read-only credentials as the MCP server. Calculations run in TypeScript and charts render locally without sending marketing data to a charting vendor.

## Start it

```bash
npm run build
npm run dashboard
```

If GSC and GA4 are already configured in Claude Desktop, start the dashboard without copying values:

```bash
npm run dashboard:claude
```

The launcher imports only an allowlist of dashboard settings from the local Claude configuration and never prints credential values.

Open `http://127.0.0.1:4173`. Use `DATA_MODE=local npm run dashboard` after importing CSVs. Live datasets require `GOOGLE_APPLICATION_CREDENTIALS`, `GSC_SITE_URL` and/or `GA4_PROPERTY_ID`; `npm run connect:google` creates private configuration. Override the loopback port with `DASHBOARD_PORT`; do not bind it publicly without authentication and a production security review.

## Build a view

Choose:

- Dataset: imported Search Console, Google Ads or pipeline CSVs, or live GSC/GA4
- Dimension: the grouping, such as campaign, query, page, source, or segment
- Metric and aggregation: sum, average, or row count
- Visual: bar, horizontal bar, line, area, donut, geographic bubble map, table, or KPI
- Date range, previous-period or year-over-year comparison, sort, maximum groups, text filter, and chart title

Charts persist in that browser's local storage. “Clear dashboard” removes the saved layout from that browser.

## Ask Claude or Codex

The `build_dashboard_chart` MCP tool validates one chart. `build_dashboard` validates 1 to 20 charts and returns one board link. For example:

> Build a horizontal bar chart of total Google Ads spend by campaign, highest first, limited to ten campaigns. Title it “Paid investment by campaign”.

For a connected Google account, try:

> Call `build_dashboard` to create an executive acquisition dashboard for the last 28 completed days compared with the previous period. Include GSC clicks and GA4 sessions scorecards, daily GSC impressions and GA4 sessions trends, GSC clicks by country as a geo chart, GA4 sessions by channel as a donut, GSC CTR by device as a table, and GA4 key-event rate by landing page as a horizontal bar. Use only supported dimensions and metrics. Do not invent unavailable data.

Start the dashboard before opening the returned link. The URL contains only chart configuration, not marketing evidence.

## Security and interpretation

The API accepts only catalogued datasets, dimensions, metrics, aggregations, chart types and bounded row limits. It does not evaluate SQL or model-generated code. Calculations and comparisons are server-side and deterministic. Live APIs are read-only. GSC can omit anonymized or low-volume queries, and GA4 definitions depend on property configuration. The geo renderer uses a deliberately small local centroid map and reports unmatched country labels; it is a directional acquisition view, not a boundary-accurate choropleth. A line chart over a categorical dimension is an ordered series, not a time trend.
