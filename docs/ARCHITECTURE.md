# General Marketing Intelligence — Architecture

```text
CSV INPUTS → VALIDATION → DETERMINISTIC ANALYSIS → MCP TOOLS
                                                     ↓
                                      OPTIONAL OPENAI INTERPRETATION
```

The CSV layer supplies Search Console-shaped demand, paid campaign economics and conversion/pipeline records. `DATA_MODE=demo` reads bundled synthetic examples; `DATA_MODE=local` reads validated imports from `data/local`.

TypeScript owns arithmetic, normalization, ranking, thresholds, opportunity states and allocations. MCP exposes twelve tools over stdio. OpenAI is optional and may interpret a bounded evidence packet, but cannot replace deterministic output. Responses are schema-validated, retried once and rejected if they introduce unseen numbers.

The marketing skill defines evidence standards for compatible hosts. It does not silently control every MCP client.

Current integrations are CSV-only. Connector status describes future Google Ads, Search Console, analytics and CRM adapters truthfully; no live API client is implemented.
