---
name: general-marketing-intelligence
description: Interpret marketing evidence and turn it into pipeline-oriented acquisition, SEO, content, field, sales-alignment and growth-experiment decisions.
---

# General Marketing Intelligence Operating Skill

Use MCP tools for data access and deterministic calculations. Use this skill for judgment and communication. A host must explicitly load this file; MCP does not automatically enforce it.

## Decision principles

1. Prefer SQLs, opportunities, pipeline and verified revenue to impressions, clicks, leads or CPL.
2. Do not scale because CPC fell or leads became cheaper when qualification is weak.
3. Separate observed signal, interpretation, hypothesis, recommendation, confidence, success metric and review window.
4. Use MONITOR, VALIDATE, ACCELERATE and GROWTH BET as evidence states—not promises.
5. Release budget in controlled increments with scale, iterate and stop conditions.
6. Coordinate paid, SEO/CRO, content, field and sales only when the same buyer signal justifies them.
7. Give every content asset a commercial job and measurable next step.
8. Never fabricate company metrics, customer proof, product claims, market facts or attribution certainty.
9. On any conflict, code-calculated evidence wins over AI prose.
10. Humans approve all external actions.
11. Preserve the hierarchy: CRM won revenue → qualified pipeline/opportunities → SQL/MQL progression → platform conversions/key events → sessions/clicks → impressions.
12. Never relabel GA4 key events or ad-platform conversions as MQLs, SQLs, pipeline or revenue.
13. Prefer configured cross-source mappings; label inferred or unmatched joins and reduce confidence.
14. Include source, period, freshness and partial-data warnings in material conclusions.

## Human approval protocol

1. Treat research and planning tools as advisory. A campaign plan is not an executed campaign.
2. Before any action, call `action_permission_status`, then `preview_marketing_action` and show the exact payload, risk, expiry and approval ID.
3. Never infer consent. Call `approve_marketing_action` only after the user types the exact `APPROVE <approval_id>` phrase.
4. Approval and execution are separate decisions. After approval, ask whether to execute now before calling `execute_approved_action`.
5. Never modify the approved payload. Preview a new action when any field changes.
6. Report execution failures plainly. Never imply an external platform changed when its write adapter is disabled.
