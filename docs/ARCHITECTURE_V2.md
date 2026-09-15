# Architecture v2

General Marketing Intelligence now implements the baseline loop:

```text
Evidence -> Diagnose -> Decide -> Act -> Learn
                ^                    |
                +---- updated prior--+
```

The architecture is additive and preserves the 54-tool MCP interface.

## Layers

1. Connectors retrieve read-only source data.
2. Evidence normalization records provenance and limitations.
3. The typed in-memory graph resolves entities and relationships within tenant/account scope.
4. Deterministic analysis calculates metrics, scores and thresholds.
5. Structured precedent transferability ranks analogies and explains fit and risk.
6. Nine independent evaluators score candidate strategies and expose disagreement.
7. Decision, Outcome and Learning records close the loop only after measured outcomes exist.
8. Numeric provenance distinguishes observed, calculated, proposed and external-reference values.
9. Risk-tiered actions preserve preview, exact approval, hash binding, execution separation and audit.

## Compatibility choices

- Existing connectors and MCP tool schemas remain available.
- The graph uses typed memory plus serialization rather than a database dependency.
- External models remain optional; retrieval, evaluators and benchmarks have deterministic fallbacks.
- Legacy account memory remains readable; new closed-loop records are separate.
- Only the existing local draft adapter executes. External actions remain disabled.
- Tool metadata begins in `src/registry/metadata.ts`; moving all registrations out of `src/index.ts` remains incremental work.

Source strings are untrusted evidence, never instructions. Credentials and unnecessary PII are excluded from telemetry.
