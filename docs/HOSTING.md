# Hosted edition reference architecture

The hosted entry point is a security-focused reference implementation, not a turnkey SaaS. It preserves the local stdio server and adds a stateless Streamable HTTP resource endpoint at `/mcp`. Health and OAuth protected-resource metadata endpoints are also provided.

Before exposing it to users, deploy it behind TLS and a trusted reverse proxy, connect an OAuth 2.1/OpenID Connect authorization server, replace the filesystem credential and audit adapters with production KMS/secret-manager/database services, and complete an independent security review. The process binds to `127.0.0.1` intentionally.

## Security model

- The authorization server issues signed access tokens. This project is a resource server; it does not issue tokens.
- Tokens are verified against an HTTPS JWKS URL and constrained by issuer, audience and `RS256`/`ES256` algorithms.
- Each token must contain `sub`, `tenant_id`, `roles` and `sources` claims. Supported roles are `viewer`, `analyst` and `admin`.
- Token source permissions are intersected with the tenant's configured sources before a tool call.
- Tenant records are separately encrypted with AES-256-GCM. Tenant ID is authenticated as additional data and filenames are SHA-256 tenant hashes.
- Revocation destroys stored credential values immediately. Revoked envelopes are removed after `HOSTED_RETENTION_DAYS` when accessed.
- Origin allowlisting, per-principal rate limits and JSONL audit events apply before tool execution. Audit events contain identifiers and outcomes, never credentials or marketing results.
- Existing connectors read environment variables. Hosted connector execution is therefore serialized while a tenant-scoped environment is installed and then fully restored. This prevents cross-tenant leakage in the reference adapter but limits single-process throughput. A production adapter should inject request-scoped credentials directly into connector constructors.

The current MCP TypeScript SDK documents Streamable HTTP for remote servers and explicitly requires applications to perform token verification and Origin/Host validation in front of the MCP handler. See the [official server guide](https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/server.md) and [HTTP serving guide](https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/serving/http.md).

## Required environment

```text
HOSTED_PUBLIC_URL=https://mcp.example.com
HOSTED_ALLOWED_ORIGINS=https://claude.ai,https://chatgpt.com
HOSTED_ISSUER=https://identity.example.com/
HOSTED_AUDIENCE=https://mcp.example.com/mcp
HOSTED_JWKS_URL=https://identity.example.com/.well-known/jwks.json
HOSTED_ENCRYPTION_KEY=<base64 of exactly 32 random bytes>
HOSTED_DATA_DIR=/private/persistent/path
HOSTED_PORT=3000
HOSTED_RATE_LIMIT_PER_MINUTE=60
HOSTED_RETENTION_DAYS=30
```

Generate the local development encryption key without printing it into application logs. Store production keys in a managed KMS/secret manager and inject them at runtime.

## Provision a tenant

Create a private operator-only JSON file:

```json
{
  "tenantId": "acme",
  "allowedSources": ["gsc", "ga4"],
  "credentials": {
    "GSC_SITE_URL": "sc-domain:example.com",
    "GA4_PROPERTY_ID": "123456789",
    "GOOGLE_SERVICE_ACCOUNT_JSON": "{...service-account JSON...}"
  }
}
```

Then run `npm run tenant:admin -- put /absolute/path/to/tenant.json`. Delete the plaintext provisioning file securely after confirming status. `status` returns credential key names but never values; `revoke` irreversibly clears values:

```bash
npm run tenant:admin -- status acme
npm run tenant:admin -- revoke acme
```

Start with `npm run build && npm run start:hosted`. Terminate TLS at the proxy, forward only expected headers, enforce request-body limits, and block direct access to the loopback listener.

## Production acceptance checklist

- Threat model and penetration test complete.
- External OIDC discovery, key rotation, audience and issuer behavior tested.
- Managed KMS, transactional tenant store and append-only audit sink implemented.
- Audit retention/deletion policy and data-subject procedures approved.
- Per-tenant quotas enforced in shared infrastructure, not process memory.
- Horizontal scaling and failover tested; no credentials reside on shared disk.
- Source permissions mapped to organization roles and reviewed periodically.
- Incident response, key rotation, backup/restore and tenant deletion rehearsed.
