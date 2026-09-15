# Action risk model

| Class | Meaning | Example | Default policy |
|---|---|---|---|
| R0 | Read-only | Retrieve a report | No execution approval |
| R1 | Local, reversible draft | Save one private campaign draft | Exact approval |
| R2 | Low-risk reversible external execution | Create one bounded HubSpot task | Disabled unless explicitly configured |
| R3 | Financially consequential | Change campaign budget | Adapter disabled |
| R4 | Reputation, legal or large-scale | Send email or publish social content | Adapter disabled |

Every adapter declares reversibility, approval requirement, maximum scope, required evidence, tenant permissions and audit fields. Understating risk is rejected.

Execution requires an immutable preview, exact `APPROVE <id>`, an unexpired approval, identical payload hash, tenant and permission match, and a separate execute call. Idempotency keys prevent duplicate active or completed actions. Failed actions remain auditable and may be retried only through a new preview.

`save_campaign_draft` is locally enabled. `create_hubspot_task_draft` becomes available only with read/write policy, HubSpot write permission, `HUBSPOT_WRITE_ENABLED=true`, a private-app token, an idempotency key and required evidence. It is limited to one task and one optional contact association. Automatic ad spend, bulk CRM mutation, email sending and publication remain disabled.
