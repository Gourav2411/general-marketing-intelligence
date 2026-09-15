# Closed-loop decisions

```text
Signal -> Diagnosis -> Strategy -> Decision -> Action -> Outcome -> Learning -> Updated prior
```

`DecisionRecord` stores the question, evidence snapshots, diagnosis, competing strategies, recommendation, expected outcome, metric, guardrails, assumptions, confidence, review window and stop/continue/scale rules.

`OutcomeRecord` attaches measured numeric claims, attribution confidence, observed outcome, unexpected effects and lessons to the same tenant/account decision.

`ClosedLoopLearningRecord` is derived only when an OutcomeRecord exists. Positive evidence increases confidence modestly. A contradictory later outcome applies a larger correction in the opposite direction. `buildAccountLearningContext` retrieves only account- and tenant-scoped outcome-backed learning for future recommendations.

The local default is a private git-ignored SQLite database in WAL mode with tenant/account indexes and foreign keys. `npm run decisions:migrate` imports legacy JSONL records without deleting the originals. Set `MARKETING_DECISION_DB` to change the local path.

Hosted deployments may set `DECISION_DATABASE_URL` to use the Postgres repository. Its API exposes only tenant/account-scoped operations. Use TLS, database encryption, least-privilege credentials, backups and externally managed retention in production.
