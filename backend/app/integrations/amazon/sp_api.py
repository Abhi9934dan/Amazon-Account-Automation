from .base import AmazonProvider
from ...core.config import settings

class AmazonSPAPIProvider(AmazonProvider):
    """
    Adapter boundary for Amazon Selling Partner API.

    Implement the exact SP-API operations granted to your application:
    inventory, orders, listings, pricing, reports, fees/financial data, etc.
    """

    async def get_account(self, account_id: str) -> dict:
        return {"id": account_id, "provider": "amazon_sp_api"}

    async def get_campaigns(self, account_id: str) -> list[dict]:
        return []

    async def get_inventory(self, account_id: str) -> list[dict]:
        if settings.demo_mode:
            return [
                {"asin": "B0PEANUT1", "sku": "PO-1L", "fulfillable": 1840, "inbound": 620, "reserved": 88},
                {"asin": "B0PEANUT5", "sku": "PO-5L", "fulfillable": 720, "inbound": 300, "reserved": 40},
                {"asin": "B0PEANUT5", "sku": "PO-500", "fulfillable": 4260, "inbound": 900, "reserved": 130},
            ]
        raise NotImplementedError

    async def get_orders(self, account_id: str) -> list[dict]:
        if settings.demo_mode:
            return [
                {"order_id": "DEMO-1001", "status": "Shipped", "amount": 699},
                {"order_id": "DEMO-1002", "status": "Unshipped", "amount": 1499},
            ]
        raise NotImplementedError

    async def get_listings(self, account_id: str) -> list[dict]:
        return []

    async def get_pricing(self, account_id: str) -> list[dict]:
        return []

    async def get_reports(self, account_id: str) -> list[dict]:
        return []
