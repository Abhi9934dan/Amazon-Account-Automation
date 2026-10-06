import httpx
from .base import AmazonProvider
from ...core.config import settings

class AmazonAdsProvider(AmazonProvider):
    """
    Adapter boundary for Amazon Ads API.

    Keep Amazon-specific authentication, headers, profile selection, paging,
    retries and API-version details here. The rest of ADPILOT should only call
    provider methods, so API changes do not leak into the application layer.
    """

    async def get_account(self, account_id: str) -> dict:
        return {"id": account_id, "provider": "amazon_ads"}

    async def get_campaigns(self, account_id: str) -> list[dict]:
        if settings.demo_mode:
            return [
                {"id": "demo-1", "name": "Peanut Oil | Exact", "status": "ENABLED",
                 "spend": 18420, "sales": 119500, "orders": 186},
                {"id": "demo-2", "name": "Peanut Oil | Broad", "status": "ENABLED",
                 "spend": 12480, "sales": 61800, "orders": 91},
                {"id": "demo-3", "name": "Brand Defense", "status": "PAUSED",
                 "spend": 4380, "sales": 26700, "orders": 44},
            ]
        raise NotImplementedError("Implement approved Amazon Ads API operations here.")

    async def get_inventory(self, account_id: str) -> list[dict]:
        return []

    async def get_orders(self, account_id: str) -> list[dict]:
        return []

    async def update_bid(self, campaign_id: str, bid: float) -> dict:
        if settings.demo_mode:
            return {"campaign_id": campaign_id, "bid": bid, "status": "simulated"}
        raise NotImplementedError

    async def update_budget(self, campaign_id: str, budget: float) -> dict:
        if settings.demo_mode:
            return {"campaign_id": campaign_id, "budget": budget, "status": "simulated"}
        raise NotImplementedError
