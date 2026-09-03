# Contributing

Thank you for helping improve General Marketing Intelligence.

## Before you start

- Use an issue to discuss material changes before investing in implementation.
- Do not open public issues for security vulnerabilities; follow `SECURITY.md`.
- Never submit credentials, customer data, analytics exports, proprietary prompts or confidential business information.
- Contributions must be your original work or material you have the right to submit.

## Development workflow

1. Fork the repository and create a focused branch.
2. Install Node.js 20 or 22 and run `npm ci`.
3. Make the smallest coherent change.
4. Add or update tests and documentation.
5. Run `npm run verify` and `npm audit --omit=dev`.
6. Open a pull request using the template.

Do not weaken deterministic calculation, evidence integrity, credential isolation, read-only defaults or human approval boundaries without explicit maintainer review.

## Commit sign-off

This project uses the Developer Certificate of Origin in `DCO.md`. Sign off every commit:

```bash
git commit -s -m "Describe the change"
```

The sign-off certifies that you have the right to submit the contribution under this repository's license. Pull requests with unsigned commits may be held until corrected.

## Review and acceptance

All contributions require maintainer review. Passing automation does not guarantee acceptance. Maintainers may request changes for scope, safety, product direction, evidence quality or long-term maintenance cost.
