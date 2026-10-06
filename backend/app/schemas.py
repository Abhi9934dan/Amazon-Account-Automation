from pydantic import BaseModel
from typing import Any

class Metric(BaseModel):
    label: str
    value: str
    change: str
    trend: str

class CampaignOut(BaseModel):
    id: str
    name: str
    status: str
    spend: float
    sales: float
    acos: float
    roas: float
    orders: int

class AutomationCreate(BaseModel):
    name: str
    condition: dict[str, Any]
    action: dict[str, Any]
    enabled: bool = False
