# I built an open-source MCP so AI could reason over marketing evidence, not invent it

Marketing teams do not have a shortage of dashboards.

They have a shortage of connected decisions.

Search performance lives in Search Console. Website behavior lives in GA4. Spend lives in advertising platforms. Pipeline lives in CRM. Context lives in campaign documents, meetings and the heads of people who ran the work.

Then we ask an AI model for a strategy and quietly expect it to reconstruct the business from fragments.

I built General Marketing Intelligence to test a different approach. It is an open-source marketing decision system exposed through the Model Context Protocol, so it can work directly inside Claude and Codex.

The repository currently exposes 62 tools. That number is not the point. The boundaries between evidence, calculation, reasoning and action are.

## Data tools should own data truth

An AI model should not calculate performance metrics from prose if code can calculate them from source rows.

GMI retrieves or imports evidence from:

- Google Analytics 4
- Google Search Console
- Google Ads
- HubSpot
- Salesforce
- configurable CRM APIs
- CRM and paid-media CSV files
- Meta and LinkedIn reporting adapters

Connector outputs are normalized into governed entities and metric definitions. Campaign joins, rates, changes and comparisons are performed by code. Outputs preserve whether a number was observed, calculated, proposed or taken from an external reference.

This does not make the system infallible. It makes the failure modes inspectable.

## Strategy needs disagreement

Most AI strategy output is a single confident narrative. Real decisions are not like that.

A budget increase can look attractive to growth and unacceptable to finance. A campaign can generate leads while producing no qualified pipeline. A creative idea can improve short-term response while damaging brand trust. Measurement can be too weak to justify action at all.

GMI evaluates important decisions through nine independent perspectives, including growth, finance, brand, customer, measurement and risk. The synthesis keeps disagreement visible instead of smoothing it into one artificial answer.

The system also searches a governed corpus of marketing cases. Successful and failed campaigns are both useful, but historical similarity is not proof. Retrieval includes transferability and non-transfer checks so a famous campaign does not become a lazy template for an unrelated account.

## Memory should come from outcomes

Persistent memory is only useful when it is earned.

GMI records decisions, expected outcomes, primary metrics, guardrails, review windows and stop, continue or scale rules. A learning record is created only after a measured outcome is attached with attribution confidence.

Contradictory results remain visible. Account learning is tenant-scoped. Future decisions can retrieve relevant, outcome-backed context with provenance identifiers.

This is deliberately different from asking a model to remember that a campaign “worked.”

## Humans remain the final approvers

Read-only analysis is the default.

For supported actions, GMI separates preview, approval and execution:

1. The system creates an immutable preview of the exact action.
2. A human approves that specific payload.
3. Execution requires a separate request.
4. Idempotency and audit controls prevent accidental repetition.

The system can recommend a budget change. It should not silently move money.

This boundary matters more as AI systems become capable of taking action across advertising and CRM platforms.

## Local first, hosted later

The simplest mode is a local stdio MCP server. Credentials remain in the user's local MCP client configuration and are provided through the environment. Claude or Codex starts the server as a subprocess.

The repository also contains a separate Streamable HTTP foundation for team deployments. It includes token verification, tenant isolation, encrypted credential storage, source-level permissions, origin validation, rate limits, retention controls and privacy-filtered audit events.

That hosted foundation is infrastructure, not a claim that a production SaaS is already running.

## Deterministic without pretending AI is unnecessary

GMI can operate without an LLM API key. Core calculations, retrieval, routing and safety controls have deterministic fallbacks.

An optional OpenAI layer can improve synthesis and presentation, but it receives bounded evidence packets rather than unrestricted access to secrets or raw account state.

The model is used where language and judgment help. Code remains responsible where repeatability and verification matter.

## What I want from contributors

This project has grown beyond an MCP experiment. It is becoming a small operating system for marketing intelligence.

The work now needs people who will challenge it:

- marketers who can test whether the outputs improve real decisions;
- RevOps practitioners who understand attribution and lifecycle data;
- engineers who can test connectors, schemas and MCP compatibility;
- security contributors who can scrutinize the hosted and action layers;
- editors and researchers who can expand the governed case corpus without copying protected material or turning anecdotes into facts;
- administrators who can evaluate setup, permissions and operational usability.

The goal is not to replace marketers with a machine.

The goal is to make evidence easier to use, make reasoning easier to inspect and keep experimentation human.

Repository: https://github.com/Gourav2411/general-marketing-intelligence

