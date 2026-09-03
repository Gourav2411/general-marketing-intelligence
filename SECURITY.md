# Security Policy

## Supported versions

Security fixes are applied to the latest code on the default branch. This project has not yet established multiple maintained release lines.

## Report a vulnerability privately

Do not open a public issue. Use GitHub's **Report a vulnerability** action in the repository Security tab. Include affected versions, reproduction steps, impact and any suggested mitigation. Avoid accessing data that is not yours and do not include real credentials or customer data.

The maintainer will acknowledge a complete report when practicable, investigate it, coordinate remediation and credit the reporter if requested and appropriate. No response or resolution SLA is promised.

## Credential model

- Store Google service-account JSON and API keys outside the repository.
- Pass only absolute credential-file paths or environment variables to local MCP clients.
- Never include secrets in prompts, logs, fixtures, screenshots, issues or pull requests.
- Use least-privilege, read-only product roles.
- Rotate and revoke a credential immediately if exposure is suspected.

The server is local stdio software. Do not expose it directly to the public internet without authentication, tenant isolation, encrypted storage, rate limiting and audit controls.
