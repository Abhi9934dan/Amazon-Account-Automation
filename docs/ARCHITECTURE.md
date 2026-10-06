# ADPILOT architecture

## Tenancy

Every business-owned record should carry `organization_id`.
Production authentication should resolve the organization from a verified session.
Never trust an organization id supplied by a browser.

## Data flow

### Amazon Ads

1. User clicks Connect Amazon.
2. Backend creates a state value and sends user to Amazon authorization.
3. Amazon returns an authorization code.
4. Backend exchanges the code for tokens.
5. Backend stores encrypted tokens and advertiser/profile identifiers.
6. Sync workers fetch campaigns/reports with pagination.
7. Raw/provider payloads are normalized into internal tables.
8. UI reads only normalized ADPILOT data.

### SP-API

Use a separate adapter because seller API auth, roles, marketplace endpoints,
rate limits and resource models differ from advertising APIs.

Recommended services:

- `AmazonAdsProvider`
- `AmazonSPAPIProvider`
- `SyncService`
- `ReportService`
- `ProfitService`
- `AutomationEngine`

## Automation safety

Every write action should support:

- dry-run
- approval
- idempotency key
- audit log
- before/after snapshot
- retry/backoff
- rate-limit awareness

Suggested production state machine:

`RECOMMENDED -> APPROVED -> QUEUED -> APPLIED -> VERIFIED`

## Background jobs

Run:

- campaign sync
- report ingestion
- inventory sync
- order sync
- pricing sync
- profitability calculation
- alert evaluation

through Celery/Redis or a managed queue.

## Security

- OAuth only; never collect Amazon passwords.
- Encrypt tokens with KMS or an equivalent production secret-management system.
- Use short-lived application sessions.
- Add RBAC.
- Add audit logs.
- Apply tenant isolation to every query.
- Do not log access tokens or sensitive seller data.
