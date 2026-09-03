# Read-only connector guide

All connectors retrieve evidence only. They cannot change campaigns, budgets, CRM records, website content or analytics configuration.

## Google Search Console

Required environment:

```text
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json
GSC_SITE_URL=sc-domain:example.com
```

Grant the service-account email Full user access to the exact Search Console property. The connector uses the `webmasters.readonly` scope, pagination, a 15-second request timeout and bounded retry. Query/page output can omit anonymized or low-volume rows.

## GA4

Required environment:

```text
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json
GA4_PROPERTY_ID=123456789
```

Grant the service-account email the GA4 Viewer role. The connector reads sessions, users, key events and reported revenue, exposes sampling and quota metadata, and compares against a preceding or prior-year period. GA4 key events are not assumed to be MQLs or SQLs.

## Google Ads

Required environment:

```text
GOOGLE_ADS_CUSTOMER_ID=
GOOGLE_ADS_DEVELOPER_TOKEN=
GOOGLE_ADS_CLIENT_ID=
GOOGLE_ADS_CLIENT_SECRET=
GOOGLE_ADS_REFRESH_TOKEN=
GOOGLE_ADS_LOGIN_CUSTOMER_ID=
```

The login customer ID is needed only when authenticating through a manager account. Use an OAuth user with access to the reporting account and the minimum appropriate Google Ads account role. The connector submits predefined GAQL queries to `GoogleAdsService.SearchStream`; it does not accept arbitrary GAQL and implements no mutate endpoint.

Views: `campaign`, `ad_group`, `search_term`, `landing_page`, and `geography`. Device is included as a segment. Search impression share and budget-lost impression share are requested in the campaign view; conversion definitions remain account-controlled.

## HubSpot

```text
CRM_PROVIDER=hubspot
HUBSPOT_ACCESS_TOKEN=
```

Create a private app with read access to contacts and deals only. The connector reads lifecycle/source properties and deal amount/stage fields, aggregates results in code and never returns names or email addresses. Portal-specific lifecycle and deal-stage semantics must be documented.

## Salesforce

```text
CRM_PROVIDER=salesforce
SALESFORCE_INSTANCE_URL=https://your-domain.my.salesforce.com
SALESFORCE_ACCESS_TOKEN=
```

Use a dedicated integration user or connected app with API Enabled and read access only to the Lead and Opportunity fields queried by the connector. The connector runs fixed SOQL SELECT statements and has no create, update, upsert or delete path. Standard Salesforce status values do not automatically mean MQL or SQL.

## Generic CRM CSV

```text
CRM_PROVIDER=csv
GENERIC_CRM_CSV=/absolute/path/to/crm-funnel.csv
```

Copy `templates/crm-funnel.csv`. IDs should be non-sensitive internal identifiers. Do not include names, email addresses, phone numbers or free-text notes. Numeric values and dates are validated before aggregation.

## Diagnostics

```bash
npm run doctor
npm run doctor:live
```

The live doctor makes minimal read-only requests for configured connectors. It reports classifications and fixes without printing credential values.
