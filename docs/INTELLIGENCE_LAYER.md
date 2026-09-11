# Intelligence layer

Version 1.8 adds a reasoning system behind the existing MCP tools. It does not add another user-facing tool.

```text
business question
  -> bounded tool route
  -> account evidence and deterministic calculations
  -> retrieved, sourced historical precedents
  -> competing hypotheses and nine-lens review
  -> red-team and risk review
  -> one recommendation with confidence
  -> experiment thresholds and human approval
  -> private account learning
```

## Responsibilities

- MCP tools own access, normalization and calculations.
- `knowledge/cases/` owns curated precedents, provenance, limitations and transfer conditions.
- `SKILL.md` owns reasoning discipline and the executive answer contract.
- The optional model owns synthesis, never numeric truth.
- The human owns objectives, trade-offs and approval.

The software never claims exhaustive knowledge of marketing history. The included cases seed the architecture; they are not a comprehensive canon. Historical association is not causal evidence.

## Knowledge curation

Every case must pass the strict schema in `src/intelligence/knowledge.ts`. It needs a source URL, evidence and causal confidence, success/failure classification, what worked, what failed, failure modes, and explicit transfer/non-transfer conditions.

Validate the full corpus:

```bash
npm run knowledge:validate
```

Dry-run a candidate case, then commit it only after factual, editorial, copyright and licensing review:

```bash
npm run knowledge:ingest -- /absolute/path/case.json
npm run knowledge:ingest -- /absolute/path/case.json --commit
```

Do not copy paywalled case studies or copyrighted articles into the repository. Store structured, independently written facts and link to sources.

## Private account learning

Learning records live in git-ignored `.marketing-memory/learning.jsonl` with file mode `0600`. Set `MARKETING_ACCOUNT_ID` to keep account histories separate. Records contain decisions and lessons, not credentials or raw customer data.

```bash
npm run memory -- list
npm run memory -- record '{"question":"...","recommendation":"...","evidenceIds":["..."],"assumptions":[],"confidence":"LOW","status":"completed","outcome":"...","forecastError":"...","lessons":["..."]}'
```

Recording is explicit. The MCP never silently learns from or writes user data.

## Evaluation

`npm run benchmark:intelligence` runs 100 deterministic cases across brand decline, launches, allocation, creative fatigue, SEO, PR, category entry, expansion, attribution and profit trade-offs. It checks routing, protocol and safety invariants. It does not claim human-level strategic quality.

Production evaluation should blind-score model answers against experienced marketers for diagnosis, evidence use, originality, commercial realism, risk awareness, calibration and testability. Red-team sets should include fabricated cases, fake metrics, hindsight bias, cultural transfer errors and inappropriate copying.
