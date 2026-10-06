from abc import ABC, abstractmethod
from typing import Any

class AmazonProvider(ABC):
    @abstractmethod
    async def get_account(self, account_id: str) -> dict[str, Any]: ...

    @abstractmethod
    async def get_campaigns(self, account_id: str) -> list[dict[str, Any]]: ...

    @abstractmethod
    async def get_inventory(self, account_id: str) -> list[dict[str, Any]]: ...

    @abstractmethod
    async def get_orders(self, account_id: str) -> list[dict[str, Any]]: ...
