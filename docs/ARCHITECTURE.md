# General Marketing Intelligence — Architecture

```text
GSC + GA4 + GOOGLE ADS + CRM APIs/CSV
                  ↓
        READ-ONLY CONNECTORS
                  ↓
 NORMALIZATION + MAPPING + PROVENANCE
                  ↓
 DETERMINISTIC SCORES + LOCAL SNAPSHOTS
                  ↓
        32 MCP DECISION TOOLS
                  ↓
     OPTIONAL MODEL INTERPRETATION
```

The CSV layer supplies Search Console-shaped demand, paid campaign economics and conversion/pipeline records. `DATA_MODE=demo` reads bundled synthetic examples; `DATA_MODE=local` reads validated imports from `data/local`.

TypeScript owns arithmetic, normalization, ranking, thresholds, opportunity states and allocations. MCP exposes 32 tools over stdio with human-readable text and structured content. OpenAI is optional and may interpret a bounded evidence packet, but cannot replace deterministic output. Responses are schema-validated, retried once and rejected if they introduce unseen numbers.

The marketing skill defines evidence standards for compatible hosts. It does not silently control every MCP client.

Search Console and GA4 use a local service-account credential. Google Ads uses OAuth plus a developer token and predefined GAQL queries. HubSpot and Salesforce use read-only tokens; the generic CRM path validates a local CSV contract. Connectors implement no mutation operations. Platform conversions remain distinct from CRM pipeline and won revenue throughout normalization and executive reporting.
