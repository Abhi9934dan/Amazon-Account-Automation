# Amazon integration checklist

This repository intentionally keeps Amazon provider-specific calls behind adapters.

## Amazon Ads

Configure:

- client/application id
- client secret
- redirect URI
- region/profile configuration
- approved API scopes/roles

Then implement the approved Ads API operations inside `app/integrations/amazon/ads.py`.

Typical ADPILOT capabilities:

- campaign discovery
- campaign status/budget
- ad groups
- keywords/targets
- bid changes
- search-term/report ingestion
- performance reporting

## SP-API

Configure:

- application id
- client id/secret as required by the current application type
- redirect URI
- seller authorization
- marketplace endpoints

Implement approved operations inside `app/integrations/amazon/sp_api.py`.

Typical ADPILOT capabilities:

- inventory
- orders
- listings
- pricing
- reports
- fulfillment/FBA resources
- financial/fee resources where approved

## Do not ship the demo adapters as a production integration

Amazon APIs change over time and access is role-dependent. Before production,
verify the current Amazon documentation for your exact application type,
marketplaces, roles and API versions, then implement the operations your
application is approved to call.
