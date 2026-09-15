# Governed 250-case corpus roadmap

The trusted corpus remains **32/250**. No synthetic or AI-written case is labeled editorially reviewed. The remaining 218 slots require named reviewer approval, source-level provenance, rights review, duplicate screening and evidence-grade validation.

## Remaining allocation target

| Coverage area | New reviewed cases |
|---|---:|
| India and South Asia | 30 |
| Southeast Asia, Japan, Korea and ANZ | 25 |
| B2B SaaS and enterprise GTM | 30 |
| Pricing, packaging and promotions | 20 |
| Product launches and category creation | 20 |
| Lifecycle, CRM and email | 20 |
| SEO and content systems | 18 |
| Paid-media allocation and incrementality | 20 |
| Brand, creative and distinctive assets | 15 |
| Documented PR successes and crises | 20 |
| **Total** | **218** |

At least 40% of the completed corpus must remain failed or mixed. No category may be represented only by successes. Company claims alone cannot support an A or B evidence grade.

## Review flow

1. Write a schema-v2 contribution using factual metadata and outbound source links.
2. Run `npm run corpus -- submit /absolute/path/case.json`.
3. Resolve duplicate candidates, rights uncertainty and unsupported causal language.
4. A named human reviewer runs `npm run corpus -- approve <id> --reviewer "Name" --notes "Review record"`.
5. Run `npm run knowledge:validate` and `npm run corpus -- status`.

The release gate remains closed until 250 cases, full v2 enrichment, the failure/mixed balance, source provenance and human approval all pass.
