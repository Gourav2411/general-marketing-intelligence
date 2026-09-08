# Recommendation-only advertising strategy

The advertising strategy layer analyzes evidence and proposes bounded tests. It does not create, pause or change campaigns, bids or budgets.

## Tools

- `ad_strategy_review` accepts normalized campaign evidence for Google Ads, Meta Ads, LinkedIn Ads, Microsoft Ads, YouTube Ads and programmatic media.
- `google_ads_strategy_review` retrieves live campaign evidence through the existing read-only GAQL connector.

Supported campaign strategies cover search, Shopping, Performance Max, display, video, Demand Gen, social prospecting, social retargeting, lead generation, ABM and programmatic display.

## Statistical method

The engine applies a weakly informative Beta prior to campaign conversion observations. The posterior estimate reduces extreme conclusions from sparse samples. Confidence also requires minimum clicks, conversions, observation duration and conversion-lag maturity.

When at least two campaigns of the same platform, campaign type and objective provide at least 100 combined clicks, the engine derives a capped empirical account/type baseline. Otherwise it uses the documented weak 5% baseline. The model-adjusted rate feeds target CPA and ROAS comparisons.

This is not causal inference or proof of incrementality. Platform conversions can be affected by attribution settings, duplicated actions and reporting delay. When CRM pipeline or revenue is supplied, commercial efficiency influences the recommendation; otherwise the output explicitly reports that limitation.

## Decision controls

- Default maximum suggested daily change: ±10%
- Allowed configurable maximum: ±25%
- Hold when sample size or conversion maturity is insufficient
- Wait at least the supplied conversion-lag window after a material change
- Prefer qualified pipeline or revenue over platform conversion volume
- Return evidence, strategy, assumptions, confidence and guardrails
- Require human judgment before acting in the advertising platform

## Example request

> Call `google_ads_strategy_review` for the last 30 completed days. Treat the campaigns as search campaigns optimized for pipeline, use a seven-day conversion lag, a target CPA of 100, and cap any suggested daily budget test at 10%. Separate observed evidence from interpretation and explain why each campaign should increase, decrease, hold or be fixed before more spend. Do not execute any change.

For other platforms, supply exported campaign metrics to `ad_strategy_review`. Include qualified leads, pipeline and revenue whenever available so the engine does not optimize merely for inexpensive platform leads.

See [`EXAMPLE_ANALYSIS.md`](EXAMPLE_ANALYSIS.md) for a complete synthetic decision walkthrough.
