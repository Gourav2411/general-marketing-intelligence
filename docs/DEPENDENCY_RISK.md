# Dependency deprecation review

Reviewed: 2026-09-16

`npm audit --omit=dev` reports no known production vulnerabilities. Deprecated-package notices are reviewed independently because deprecation does not necessarily mean a disclosed vulnerability.

| Package | Path | Decision |
|---|---|---|
| `prebuild-install@7.1.3` | through `better-sqlite3@12.11.1` | Temporarily accepted. `better-sqlite3@13.0.3` removes it but terminated the MCP process under the supported Node 22 runtime during `inspect_account_learning`. The compatible version is retained until that runtime failure is resolved; the package has no reported audit vulnerability and is not called by application code at runtime. |
| `glob@10.5.0` | formerly through `c8@10` and Google authentication dependencies | Resolved by upgrading `c8@11`; the current tree uses maintained `glob@13`. The Google client upgrade also removed its old glob path. |
| `node-domexception@1.0.0` | `@google-analytics/data` → `google-gax` → `node-fetch` → `fetch-blob` | Temporarily accepted. It is a transitive dependency of the current Google SDK, has no reported audit vulnerability, and application code does not import it directly. Recheck monthly and when Google releases a dependency chain that removes it. |

Do not use npm `overrides` merely to silence a deprecation warning when the parent SDK has not declared compatibility. Dependabot, dependency review, CodeQL and the production audit remain mandatory gates.
