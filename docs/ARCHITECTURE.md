# General Marketing Intelligence — Architecture

```text
CSV INPUTS → VALIDATION → DETERMINISTIC ANALYSIS ─┐
                                                  ├→ MCP TOOLS
GSC + GA4 APIs → READ-ONLY REPORT CALCULATIONS ───┘      ↓
                                           OPTIONAL OPENAI INTERPRETATION
```

The CSV layer supplies Search Console-shaped demand, paid campaign economics and conversion/pipeline records. `DATA_MODE=demo` reads bundled synthetic examples; `DATA_MODE=local` reads validated imports from `data/local`.

TypeScript owns arithmetic, normalization, ranking, thresholds, opportunity states and allocations. MCP exposes fourteen tools over stdio. OpenAI is optional and may interpret a bounded evidence packet, but cannot replace deterministic output. Responses are schema-validated, retried once and rejected if they introduce unseen numbers.

The marketing skill defines evidence standards for compatible hosts. It does not silently control every MCP client.

Search Console and GA4 have implemented read-only API clients that query Google at tool invocation time using a local service-account credential file. Paid-media and CRM/pipeline data remain CSV-backed; Google Ads and CRM live clients are future work. Direct Google reports are deliberately kept separate from CRM pipeline attribution.
