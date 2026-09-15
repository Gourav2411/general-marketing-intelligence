# Closed-loop decisions

```text
Signal -> Diagnosis -> Strategy -> Decision -> Action -> Outcome -> Learning -> Updated prior
```

`DecisionRecord` stores the question, evidence snapshots, diagnosis, competing strategies, recommendation, expected outcome, metric, guardrails, assumptions, confidence, review window and stop/continue/scale rules.

`OutcomeRecord` attaches measured numeric claims, attribution confidence, observed outcome, unexpected effects and lessons to the same tenant/account decision.

`ClosedLoopLearningRecord` is derived only when an OutcomeRecord exists. Positive evidence increases confidence modestly. A contradictory later outcome applies a larger correction in the opposite direction. `buildAccountLearningContext` retrieves only account- and tenant-scoped outcome-backed learning for future recommendations.

Records are private, git-ignored JSONL files with restrictive permissions. They are an auditable local baseline, not a production concurrent database. Hosted deployments should use transactional, encrypted tenant storage.
