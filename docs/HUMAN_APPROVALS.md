# Human approvals and action permissions

General Marketing Intelligence is read-only by default. Research, analysis and campaign-planning tools can propose work, but a proposal is not permission to act.

## Access modes

- `read_only`: analyze data and build plans; no draft may be saved and no action may execute.
- `draft_only`: also permits approved private local campaign drafts.
- `read_write`: makes an approved action eligible for an implemented write adapter. It does not create capabilities by itself.

Set `MCP_ACCESS_MODE` for the simple policy, or copy `config/action-policy.example.json`, validate it against `config/action-policy.schema.v1.json`, and set `MCP_ACTION_POLICY_FILE` to its absolute path. Limits can cap a budget change or email audience. Do not place secrets in the policy file.

## Required lifecycle

Every executable action follows a separate three-step protocol:

1. `preview_marketing_action` records an immutable payload hash, risk, summary and expiry.
2. The client shows the preview. The user must type the exact `APPROVE <approval_id>` phrase before `approve_marketing_action` is called.
3. Approval does not execute. The client asks once more whether to execute, then may call `execute_approved_action`.

Approvals expire, are single use, and can be revoked. Execution verifies the stored payload hash and current policy. Lifecycle metadata is recorded in a local JSONL audit log. Approval records and drafts use private file permissions and are ignored by Git.

## Current execution boundary

Version 1.3.0 implements one executor: `save_campaign_draft`, which writes an approved JSON draft to a private local directory. Google Ads, CRM and email mutation types exist only so previews and policies have a stable contract. Their write adapters are disabled, so the server cannot change a budget, create or pause an ad campaign, update CRM records or send email.

Enabling `read_write` does not override that boundary. A future adapter must add platform-specific least-privilege credentials, concurrency checks, idempotency, rollback guidance and integration tests before release.

## Trust boundary

The server enforces the exact phrase, action ID, expiry, immutable payload, current permission and single-use rule. In local stdio, the server cannot cryptographically determine whether approval text originated from a human or was fabricated by the host model. Claude and Codex are instructed to request explicit confirmation, but the client owns that interaction boundary.

Hosted mode isolates action records per tenant. A production hosted edition should additionally bind each approval to an authenticated actor and require client-native confirmation before enabling any external write adapter.
