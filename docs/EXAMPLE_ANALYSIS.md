# Complete anonymized marketing analysis

All names and figures below are synthetic. They demonstrate the decision format and are not performance claims.

## Business question

> Where should the next month of acquisition effort go, and which campaigns should receive a controlled budget test?

## Routed workflow

1. `executive_growth_review` for the commercial baseline
2. `campaign_to_pipeline_report` for paid-to-CRM validation
3. `paid_media_diagnostics` for anomaly, pacing, saturation and fatigue screening
4. `ad_strategy_review` for account-calibrated recommendations
5. `recommend_next_growth_bet` for the coordinated decision

## Observed evidence

| Campaign | Spend | Clicks | Platform conversions | Qualified leads | Pipeline | Revenue | Frequency |
|---|---:|---:|---:|---:|---:|---:|---:|
| Anonymized Search A | 2,800 | 2,400 | 96 | 24 | 18,000 | 6,000 | N/A |
| Anonymized Social B | 2,100 | 1,800 | 72 | 12 | 8,000 | 2,000 | 4.2 |

Search A produced 6.43x pipeline/spend and 2.14x closed-won revenue/spend. Social B produced 3.81x pipeline/spend and 0.95x closed-won revenue/spend. These are attributed ratios, not incremental lift.

## Interpretation

Search A has the stronger downstream evidence and is the better candidate for a bounded scale test. Social B is generating platform conversions, but weaker commercial progression and rising frequency make immediate expansion less defensible.

## Recommendation

### Anonymized Search A

- Decision: `INCREASE_TEST`
- Suggested change: no more than +10% after the conversion-lag window
- Preserve brand/non-brand separation and review search terms before broadening reach
- Primary success metric: qualified pipeline and revenue, with CPA as a guardrail
- Stop condition: model-adjusted efficiency or qualified progression falls below the approved threshold

### Anonymized Social B

- Decision: `HOLD`
- Rotate the creative hypothesis and inspect audience saturation before adding budget
- Exclude converted users and review frequency by prospecting cohort
- Primary success metric: qualified-lead-to-opportunity progression
- Stop condition: frequency increases while CTR and downstream quality continue to decline

## Coordinated 30-day growth bet

Use Search A to capture validated commercial intent, align its strongest query group to one dedicated landing-page experiment, and use Social B as a controlled creative/audience challenger rather than a scale channel. Review weekly guardrails but make the full decision only after the documented conversion lag.

## Assumptions and missing evidence

- Campaign names are consistently mapped between the ad platforms and CRM.
- Conversion actions are not duplicated and attribution windows are documented.
- No incrementality or holdout result is available.
- Gross margin, sales capacity and lifetime value are unavailable.
- The example does not authorize or execute any platform change.

## Human decision

The marketing owner must approve the target, budget cap, conversion definition, review window and stop condition in the advertising platform. The MCP provides evidence and suggestions only.
