# Action risk model

| Class | Meaning | Example | Default policy |
|---|---|---|---|
| R0 | Read-only | Retrieve a report | No execution approval |
| R1 | Local, reversible draft | Save one private campaign draft | Exact approval |
| R2 | Low-risk external execution | Create a bounded CRM task | Adapter not enabled |
| R3 | Financially consequential | Change campaign budget | Adapter disabled |
| R4 | Reputation, legal or large-scale | Send email or publish social content | Adapter disabled |

Every adapter declares reversibility, approval requirement, maximum scope, required evidence, tenant permissions and audit fields. Understating risk is rejected.

Execution requires an immutable preview, exact `APPROVE <id>`, an unexpired approval, identical payload hash, tenant and permission match, and a separate execute call. Idempotency keys prevent duplicate active or completed actions. Failed actions remain auditable and may be retried only through a new preview.

Only `save_campaign_draft` is enabled. Automatic ad spend, CRM mutation, email sending and publication remain explicitly disabled.
