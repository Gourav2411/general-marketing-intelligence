# Local dashboard builder

The dashboard is a local companion to the MCP server. It reads the same demo or imported CSV evidence, performs aggregations in TypeScript, and renders charts in the browser without sending marketing data to a charting vendor.

## Start it

```bash
npm run build
npm run dashboard
```

Open `http://127.0.0.1:4173`. Use `DATA_MODE=local npm run dashboard` after importing CSVs. Override the loopback port with `DASHBOARD_PORT`; do not bind it publicly without adding authentication and a production security review.

## Build a view

Choose:

- Dataset: Search Console, Google Ads, or conversions and pipeline
- Dimension: the grouping, such as campaign, query, page, source, or segment
- Metric and aggregation: sum, average, or row count
- Visual: bar, horizontal bar, line, area, donut, table, or KPI
- Sort, maximum groups, text filter, and chart title

Charts persist in that browser's local storage. “Clear dashboard” removes the saved layout from that browser.

## Ask Claude or Codex

The `build_dashboard_chart` MCP tool validates a chart specification and returns a local configuration link. For example:

> Build a horizontal bar chart of total Google Ads spend by campaign, highest first, limited to ten campaigns. Title it “Paid investment by campaign”.

Start the dashboard before opening the returned link. The URL contains only chart configuration, not marketing evidence.

## Security and interpretation

The API accepts only catalogued datasets, dimensions, metrics, aggregations, chart types and bounded row limits. It does not evaluate SQL or model-generated code. Calculations are server-side and deterministic. A line chart over a categorical dimension shows an ordered series, not a time trend; only describe it as a trend when the selected dimension is genuinely temporal.
