# Decision-system evaluations

```bash
npm run benchmark:decision-system
```

The harness contains 180 ground-truth contract scenarios across performance, B2B SaaS, ecommerce, enterprise sales, lifecycle, SEO, pricing, launches, PLG, regional expansion, brand, PR, attribution, measurement, noisy data, delayed revenue, creative fatigue and budget allocation. Seventy percent are adversarial, ambiguous or no-action cases.

It compares `plain_llm`, `current_gmi` and `upgraded_gmi`. JSON and Markdown reports are written under `.benchmark-results/`. The deterministic harness never silently spends an available API key.

For a real three-mode comparison, set `OPENAI_API_KEY`, choose `LIVE_BENCHMARK_LIMIT`, and explicitly acknowledge cost:

```bash
LIVE_BENCHMARK_LIMIT=12 npm run benchmark:live -- --confirm-spend
```

The live harness produces shuffled blind IDs and keeps the mode key in `.benchmark-results/private/`. Two or more reviewers score the outputs using `HUMAN_EVALUATION_RUBRIC.md`, then run `npm run benchmark:review -- ratings.jsonl` for agreement reporting.

This is an architecture regression benchmark, not proof of live-model accuracy. Practitioner blind scoring and calibrated live-model trials remain necessary.

| Mode | Average | Hallucination | Unsupported numeric | Unsafe action | Precedent misuse | Failure detection | No-action correctness |
|---|---:|---:|---:|---:|---:|---:|---:|
| Plain LLM proxy | 57.73 | 70% | 100% | 90% | 100% | 30% | 30% |
| Current GMI proxy | 83.12 | 0% | 0% | 0% | 100% | 100% | 100% |
| Upgraded GMI proxy | 90.00 | 0% | 0% | 0% | 0% | 100% | 100% |
