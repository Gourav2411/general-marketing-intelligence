# Canonical marketing semantic layer

The semantic layer gives connectors and decision tools one governed vocabulary for entities, metrics, evidence strength and cross-source identity. It prevents similarly named fields from being treated as equivalent without an explicit definition.

## Versioned contract

Schema version `1` and metric-definition version `1.0.0` are exported from `src/semantics/`. Metric definitions include their unit, aggregation rule, evidence tier, accepted source fields and a `neverMeans` guardrail.

Important distinctions are deliberate:

- GA4 key events are analytics events, not MQLs, opportunities or closed-won customers.
- Ad-platform conversions and conversion value are platform-attributed signals, not CRM revenue.
- GA4 reported revenue is analytics-attributed revenue, not finance-verified or CRM closed-won revenue.
- Reach, engagement and traffic cannot silently substitute for pipeline or revenue evidence.

Evidence tiers run from T1 (CRM or finance revenue) through T6 (reach and impressions). A higher tier does not make a weak causal design strong; it only states how close the measurement is to business value.

## Configure identities

Copy `config/semantic-model.example.json` to a private location, edit the lifecycle and identity mappings, and set:

```bash
MARKETING_SEMANTIC_FILE=/absolute/path/to/semantic-model.json
```

Do not commit account-specific mappings when campaign names, lifecycle labels or URLs are sensitive. Validate the file against `config/semantic-model.schema.v1.json` and have its owner approve definition changes.

Configured source values resolve to a shared canonical key with confidence `1`. Unmatched values remain source-qualified with confidence `0.25`; the system does not guess that two records from different systems represent the same campaign or landing page.

Commercial bundles expose `unmatchedSemanticRecords` as a review queue. The campaign-to-pipeline report includes the canonical key, mapping method, confidence, source systems and evidence IDs for every row. Only explicitly configured identities may join ad and CRM records.

## Compatibility

Semantic annotations are optional on the existing normalized evidence contract, so existing MCP clients remain compatible. New evidence bundles expose their semantic schema and definition versions, and normalized Google evidence is annotated automatically. The shared registry also defines mappings for advertising, CRM and CSV sources so their adapters can converge on the same contract.

Run `npm run test:semantic-layer` after changing definitions, mappings or graph entities. Version the contract before making a breaking semantic change.

`src/semantics/migrations.ts` is the migration gate. It accepts the current version, rejects future versions and fails closed when an older version has no declared migration. Add a deterministic migration there before incrementing the schema version, and retain compatibility fixtures for every supported input version.
