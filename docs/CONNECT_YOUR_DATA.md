# Connect your data

This is the end-to-end setup guide for every source supported by General Marketing Intelligence. Start with one source, verify it, and add the next. You do not need every connector for the server to run.

All live connectors are read-only. The server contains no Google Ads, Meta Ads, LinkedIn Ads, HubSpot or Salesforce mutation path. Keep secrets outside the repository and never paste credentials into a model conversation, issue or support request.

## Install and verify

Requirements: Node.js 20 or newer, npm and a local MCP client.

```bash
git clone https://github.com/Gourav2411/general-marketing-intelligence.git
cd general-marketing-intelligence
npm ci
npm run build
npm test
npm run setup
npm run doctor
```

Use `npm run doctor:live` only after adding credentials. It makes minimal read-only requests and never prints credential values.

## Where configuration lives

Environment variables must be attached to the MCP server process. A shell `.env` file is not automatically inherited by Claude Desktop or Codex unless the client passes those values.

### Claude Desktop on macOS

Quit Claude Desktop fully and edit:

```text
~/Library/Application Support/Claude/claude_desktop_config.json
```

Preserve existing entries under `mcpServers`, use absolute paths and restart Claude Desktop after every change. The guided installer can back up and apply the base configuration:

```bash
npm run setup -- --apply-claude
```

### Claude Code

The repository includes `.mcp.json` for project-scoped demo mode. For a persistent user-scoped installation:

```bash
claude mcp add --scope user --transport stdio \
  --env DATA_MODE=demo \
  --env AI_PROVIDER=none \
  general-marketing-intelligence \
  -- node "/absolute/path/to/general-marketing-intelligence/dist/stdio.js"
```

Verify with `claude mcp get general-marketing-intelligence`, `claude mcp list` and `/mcp`.

### OpenAI Codex

```bash
codex mcp add general-marketing-intelligence \
  --env DATA_MODE=demo \
  --env AI_PROVIDER=none \
  -- node "/absolute/path/to/general-marketing-intelligence/dist/stdio.js"
```

Verify with `codex mcp get general-marketing-intelligence` and `codex mcp list`. See the official [Codex MCP documentation](https://learn.chatgpt.com/docs/extend/mcp?surface=cli).

## Connector readiness matrix

| Source | Support | Authentication or input | Verification tool |
|---|---|---|---|
| Google Search Console | Direct, read-only | Google service account | `google_search_console_report` |
| Google Analytics 4 | Direct, read-only | Same Google service account | `ga4_acquisition_report` |
| Google Ads | Direct, read-only | OAuth reporting identity | `google_ads_report` |
| Meta Ads | Direct, read-only | Meta reporting token | `meta_ads_report` |
| LinkedIn Ads | Direct, read-only | Token with `r_ads_reporting` | `linkedin_ads_report` |
| Microsoft Ads | CSV now; direct API planned | Paid-media CSV | `paid_media_csv_report` |
| HubSpot | Direct, read-only | Private-app token | `hubspot_funnel_report` |
| Salesforce | Direct, read-only | Instance URL and OAuth token | `salesforce_funnel_report` |
| Other HTTPS CRM | Direct, read-only | Field map and token | `generic_crm_api_report` |
| Other CRM | CSV | CRM funnel CSV | `generic_crm_csv_report` |
| Other paid media | CSV | Paid-media CSV | `paid_media_csv_report` |

## Google Search Console and GA4

These connectors share one service-account JSON file.

1. In [Google Cloud Console](https://console.cloud.google.com/), create or select a project.
2. Enable **Google Analytics Data API** and **Google Search Console API**.
3. Open **IAM & Admin → Service Accounts** and create `marketing-intelligence-reader`.
4. Do not grant a Google Cloud project role. Product-level access is granted separately.
5. Open the service account, choose **Keys → Add key → Create new key → JSON** and download it.
6. Move the file outside this repository, for example to `/Users/YOUR_NAME/.config/google/marketing-intelligence-reader.json`.
7. Copy the service-account email ending in `.iam.gserviceaccount.com`.
8. In GA4, use **Admin → Property access management → Add users** and grant **Viewer**.
9. In Search Console, open the exact property, then **Settings → Users and permissions → Add user** and grant **Full**. The connector requests the read-only API scope.

Do not grant Google Cloud Owner or Editor, GA4 Administrator, Search Console Owner, Billing or service-account administration roles.

`GA4_PROPERTY_ID` is the numeric property ID from **GA4 → Admin → Property settings**, not the `G-...` Measurement ID. `GSC_SITE_URL` must exactly match the registered property: `sc-domain:example.com` or a URL-prefix such as `https://www.example.com/`.

```json
"GOOGLE_APPLICATION_CREDENTIALS": "/absolute/path/to/service-account.json",
"GSC_SITE_URL": "sc-domain:example.com",
"GA4_PROPERTY_ID": "123456789"
```

References: [GA4 quickstart](https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart), [GA4 property ID](https://developers.google.com/analytics/devguides/reporting/data/v1/property-id), [Search Console authorization](https://developers.google.com/webmaster-tools/v1/how-tos/authorizing).

Verification prompt:

> Call `connection_status`, then run `google_search_console_report` and `ga4_acquisition_report` for the last 28 completed days. Report permission, sampling, quota and missing-data warnings without guessing.

## Google Ads

Google Ads uses a separate OAuth identity from the GSC/GA4 service account.

1. Use a Google account that can view the reporting customer. Prefer the lowest account role that can read reports.
2. Enable the Google Ads API in Google Cloud and create an OAuth 2.0 client for a desktop or secured internal application.
3. Complete Google's user-authentication flow for the `https://www.googleapis.com/auth/adwords` scope and securely store the refresh token.
4. Record the customer ID without spaces or hyphens.
5. If access is through a manager, record that ID as `GOOGLE_ADS_LOGIN_CUSTOMER_ID`.
6. This release still requires a non-empty `GOOGLE_ADS_DEVELOPER_TOKEN` compatibility value before it starts the connector. Google states developer tokens were sunset on September 9, 2026 and access levels now follow the OAuth credential's Cloud project. Existing users may supply their former token; new users should follow Google's current onboarding guidance. A future connector revision will remove this local compatibility check.

```json
"GOOGLE_ADS_CUSTOMER_ID": "1234567890",
"GOOGLE_ADS_CLIENT_ID": "YOUR_OAUTH_CLIENT_ID",
"GOOGLE_ADS_CLIENT_SECRET": "YOUR_OAUTH_CLIENT_SECRET",
"GOOGLE_ADS_REFRESH_TOKEN": "YOUR_REFRESH_TOKEN",
"GOOGLE_ADS_LOGIN_CUSTOMER_ID": "OPTIONAL_MANAGER_ID",
"GOOGLE_ADS_DEVELOPER_TOKEN": "REQUIRED_BY_V1_11_CONNECTOR_COMPATIBILITY"
```

References: [Google Ads user authentication](https://developers.google.com/google-ads/api/docs/oauth/user-authentication), [Google Ads API access changes](https://developers.google.com/google-ads/api/docs/api-policy/developer-token).

Verification prompt:

> Call `google_ads_report` for campaign, ad-group, search-term, landing-page and geography views over the last 30 completed days. Do not change any campaign.

## Meta Ads

1. Create or select a Meta developer app associated with the appropriate business portfolio.
2. Add the Marketing API product.
3. Ensure the authenticating user or system user has reporting access to the ad account.
4. Create a token with read-only advertising permission. Prefer `ads_read`; do not request `ads_management` for this connector.
5. Record the ad-account ID and a Graph API version supported by your app.
6. Set the conversion action to the account's real primary event. The default purchase event may be wrong for lead generation.

```json
"META_AD_ACCOUNT_ID": "act_1234567890",
"META_ACCESS_TOKEN": "YOUR_READ_ONLY_TOKEN",
"META_API_VERSION": "vXX.X",
"META_CONVERSION_ACTION": "offsite_conversion.purchase"
```

Reference: [Meta Marketing API Insights](https://developers.facebook.com/docs/marketing-api/insights/).

Verification prompt:

> Call `meta_ads_report` for the last 30 completed days. State which conversion action was used and warn if it does not match the business outcome.

## LinkedIn Ads

1. Create or select a LinkedIn developer app and associate it with the correct company page.
2. Request access to LinkedIn Marketing APIs. Approval may be required.
3. Authorize a member who can view the target ad account.
4. Request `r_ads_reporting`; the server does not need an advertising write scope.
5. Record the numeric ad-account ID and a currently supported Marketing API version in `YYYYMM` form.

```json
"LINKEDIN_AD_ACCOUNT_ID": "123456789",
"LINKEDIN_ACCESS_TOKEN": "YOUR_REPORTING_TOKEN",
"LINKEDIN_API_VERSION": "YYYYMM"
```

Do not copy an example version blindly because LinkedIn sunsets versions. Reference: [LinkedIn Ads reporting](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads-reporting/ads-reporting).

Verification prompt:

> Call `linkedin_ads_report` for the last 30 completed days. Keep campaign URNs visible when names cannot be resolved; do not invent names.

## HubSpot

1. Open **HubSpot Settings → Integrations → Private Apps** and create an internal private app.
2. Grant only `crm.objects.contacts.read` and `crm.objects.deals.read`.
3. Do not grant contact/deal write, import, export, marketing-email or workflow scopes.
4. Copy the access token once and store it only in the MCP client's environment.
5. Document your portal's lifecycle stages, deal stages, pipeline value, source and closed-won definition.

```json
"CRM_PROVIDER": "hubspot",
"HUBSPOT_ACCESS_TOKEN": "YOUR_PRIVATE_APP_TOKEN"
```

References: [HubSpot private apps](https://developers.hubspot.com/docs/apps/legacy-apps/private-apps/overview), [HubSpot scopes](https://developers.hubspot.com/docs/apps/developer-platform/build-apps/authentication/scopes).

Verification prompt:

> Call `hubspot_funnel_report` for the last 90 days. Confirm the lifecycle and deal-stage definitions with me before recommending investment.

The connector aggregates in code and does not return contact names or email addresses.

## Salesforce

1. Create a dedicated integration user where licensing permits.
2. Grant **API Enabled** and read access only to the Lead and Opportunity objects and required fields.
3. Create or use an OAuth connected app/external client app according to the current Salesforce setup flow.
4. Obtain an access token and record the exact HTTPS instance URL, such as `https://your-domain.my.salesforce.com`.
5. Do not grant Modify All Data, object write, delete or broad administrator permission.

```json
"CRM_PROVIDER": "salesforce",
"SALESFORCE_INSTANCE_URL": "https://your-domain.my.salesforce.com",
"SALESFORCE_ACCESS_TOKEN": "YOUR_OAUTH_ACCESS_TOKEN"
```

Reference: [Salesforce OAuth flows](https://help.salesforce.com/s/articleView?id=xcloud.remoteaccess_oauth_flows.htm&type=5).

Verification prompt:

> Call `salesforce_funnel_report` for the last 90 days. Explain observed Lead statuses and Opportunity stages; do not automatically relabel them as MQL or SQL.

Salesforce access tokens can expire. Replace the token and restart the MCP client after an authentication error.

## Generic CRM HTTPS API

Use this for a public HTTPS JSON endpoint such as a read-only deals endpoint in another CRM.

1. Copy `config/generic-crm-api.example.json` to a private file outside the repository.
2. Set the HTTPS endpoint, response-array path and field mappings.
3. Put only the token environment-variable name in the mapping file, never the token.
4. The adapter rejects HTTP, loopback and private-network targets, makes one GET request and implements no pagination or associations.

```json
"CRM_PROVIDER": "api",
"GENERIC_CRM_API_CONFIG": "/absolute/private/path/crm-map.json",
"GENERIC_CRM_API_TOKEN": "YOUR_TOKEN"
```

Verification prompt:

> Call `generic_crm_api_report` for the last 90 days. Show mapping warnings, rejected rows and missing attribution fields before recommending action.

## CRM CSV

Copy `templates/crm-funnel.csv`, retain its header and add non-sensitive internal records. Do not include names, emails, phone numbers or free-text notes.

```json
"CRM_PROVIDER": "csv",
"GENERIC_CRM_CSV": "/absolute/path/to/crm-funnel.csv"
```

Verification prompt:

> Call `generic_crm_csv_report`. Validate funnel order, amounts, dates and campaign attribution before using `campaign_to_pipeline_report`.

## Paid-media CSV, including Microsoft Ads

Google, Meta and LinkedIn have direct connectors. Microsoft Ads, YouTube and programmatic sources can be normalized through CSV.

1. Export campaign-level platform data.
2. Copy the contract from `templates/paid-media.csv`.
3. Map platform, campaign, campaign type, objective, spend, impressions, clicks, conversions and conversion value.
4. Use one currency per analysis and document the conversion event.

```json
"PAID_MEDIA_CSV": "/absolute/path/to/paid-media.csv"
```

Verification prompt:

> Call `paid_media_csv_report`. Check totals against the platform, identify conversion-definition differences and return recommendations only.

## Complete Claude Desktop example

Delete unused connector variables instead of leaving fake values. Never commit this file. Configure only one `CRM_PROVIDER` at a time.

```json
{
  "mcpServers": {
    "general-marketing-intelligence": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/general-marketing-intelligence/dist/stdio.js"],
      "env": {
        "DATA_MODE": "demo",
        "AI_PROVIDER": "none",
        "CURRENCY_CODE": "USD",
        "NUMBER_LOCALE": "en-US",
        "GOOGLE_APPLICATION_CREDENTIALS": "/absolute/path/to/service-account.json",
        "GSC_SITE_URL": "sc-domain:example.com",
        "GA4_PROPERTY_ID": "123456789",
        "GOOGLE_ADS_CUSTOMER_ID": "1234567890",
        "GOOGLE_ADS_CLIENT_ID": "YOUR_OAUTH_CLIENT_ID",
        "GOOGLE_ADS_CLIENT_SECRET": "YOUR_OAUTH_CLIENT_SECRET",
        "GOOGLE_ADS_REFRESH_TOKEN": "YOUR_REFRESH_TOKEN",
        "META_AD_ACCOUNT_ID": "act_1234567890",
        "META_ACCESS_TOKEN": "YOUR_READ_ONLY_TOKEN",
        "META_API_VERSION": "vXX.X",
        "META_CONVERSION_ACTION": "offsite_conversion.purchase",
        "LINKEDIN_AD_ACCOUNT_ID": "123456789",
        "LINKEDIN_ACCESS_TOKEN": "YOUR_REPORTING_TOKEN",
        "LINKEDIN_API_VERSION": "YYYYMM",
        "CRM_PROVIDER": "hubspot",
        "HUBSPOT_ACCESS_TOKEN": "YOUR_PRIVATE_APP_TOKEN",
        "MARKETING_MAPPING_FILE": "/absolute/path/to/marketing-mapping.json"
      }
    }
  }
}
```

## Validate the complete setup

Restart the MCP client, then ask:

> Use General Marketing Intelligence. Call `connection_status`, then `diagnose_setup` without live access. List connector readiness and missing variable names only; never display credential values. Ask before making the live Google diagnostic request.

After the raw source reports are correct:

> Call `executive_growth_review`, `channel_health_scorecard`, `campaign_to_pipeline_report`, `measurement_quality_audit` and `recommend_next_growth_bet`. Separate observed data, code-calculated metrics, interpretation and missing evidence. Do not execute changes.

## Troubleshooting

- **MCP disconnected:** run `npm run build`; check JSON syntax, the absolute `dist/stdio.js` path and Node; fully restart the client.
- **Credential file not found:** replace placeholder paths with real absolute paths. Never use `/absolute/path/...` literally.
- **Permission denied:** confirm the identity has access to the exact property, account or CRM object.
- **Empty report:** verify dates, IDs, filters, conversion event and that the source contains data.
- **Token expired:** rotate or refresh it, update client configuration and restart the client.
- **Dashboard lacks Google credentials:** use `npm run dashboard:claude` or pass the same variables to `npm run dashboard`.
- **Port 4173 is busy:** use `DASHBOARD_PORT=4174 npm run dashboard` or stop the existing process.
- **CRM and ads do not join:** normalize campaign names with `config/marketing-mapping.example.json`; the Google Ads strategy join otherwise uses case-insensitive exact names.
- **Microsoft Ads direct connection:** it is not implemented; use the paid-media CSV contract.

## Security checklist

- Keep credentials outside git and prompts.
- Use absolute paths and least-privilege, read-only identities.
- Set `AI_PROVIDER=none` when Claude or Codex supplies reasoning.
- Keep `MCP_ACCESS_MODE=read_only` unless intentionally testing local draft approvals.
- Revoke tokens when a device or collaborator no longer needs access.
- Do not expose the stdio server or loopback dashboard publicly.
- Review attribution and conversion semantics before acting on recommendations.
