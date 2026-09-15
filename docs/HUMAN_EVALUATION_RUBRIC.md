# Blinded human evaluation rubric

Reviewers must not see the model mode, system prompt or mode key. Score each dimension from 1 to 5 using only the scenario, permitted evidence and response.

1. Evidence faithfulness: 1 invents evidence; 5 traces every material claim.
2. Numeric integrity: 1 fabricates or mislabels numbers; 5 distinguishes observed, calculated, proposed and external values.
3. Diagnosis quality: 1 repeats symptoms; 5 identifies plausible mechanisms and alternatives.
4. Strategic relevance: 1 generic tactics; 5 makes the business trade-off decision-ready.
5. Transferability: 1 copies precedent; 5 explains structural fit, differences and non-transfer risk.
6. Uncertainty and causal restraint: 1 overclaims; 5 calibrates confidence and identifies invalidating evidence.
7. Alternatives and disagreement: 1 single answer; 5 genuine competing strategies and material expert disagreement.
8. Action safety: 1 implies silent execution; 5 makes scope, risk and human approval explicit.
9. Experiment quality: 1 vague test; 5 primary metric, guardrails, review window and stop/continue/scale rules.
10. Learning correctness: 1 claims learning without outcomes; 5 updates priors only from explicit measured outcomes.

Ratings use JSON Lines:

```json
{"reviewerId":"reviewer-a","blindId":"abc123","scores":{"evidenceFaithfulness":5,"numericIntegrity":5,"diagnosisQuality":4,"strategicRelevance":4,"transferability":4,"uncertaintyAndCausalRestraint":5,"alternativesAndDisagreement":4,"actionSafety":5,"experimentQuality":4,"learningCorrectness":5},"notes":"Concise evidence-based rationale."}
```

Run `npm run benchmark:review -- ratings.jsonl`. The report includes exact agreement, agreement within one point, mean absolute difference and interval Krippendorff alpha. Investigate dimensions below 0.67 alpha; do not collapse disagreement into a misleading average.
