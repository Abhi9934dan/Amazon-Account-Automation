from fastapi import APIRouter, HTTPException
from ..core.config import settings
from ..integrations.amazon.ads import AmazonAdsProvider
from ..integrations.amazon.sp_api import AmazonSPAPIProvider
from ..integrations.amazon.oauth import ads_authorization_url, sp_authorization_url
from ..schemas import AutomationCreate

router = APIRouter()
ads = AmazonAdsProvider()
sp = AmazonSPAPIProvider()

@router.get("/health")
def health():
    return {"status": "ok", "service": "adpilot-api", "demo_mode": settings.demo_mode}

@router.get("/dashboard")
async def dashboard():
    campaigns = await ads.get_campaigns("demo")
    spend = sum(c["spend"] for c in campaigns)
    sales = sum(c["sales"] for c in campaigns)
    orders = sum(c["orders"] for c in campaigns)
    acos = round(spend / sales * 100, 2) if sales else 0
    roas = round(sales / spend, 2) if spend else 0
    return {
        "metrics": [
            {"label": "Sales", "value": "₹8.42L", "change": "+12.8%", "trend": "up"},
            {"label": "Ad Spend", "value": "₹1.24L", "change": "+5.4%", "trend": "up"},
            {"label": "ACOS", "value": f"{acos}%", "change": "-2.1%", "trend": "down"},
            {"label": "ROAS", "value": f"{roas}x", "change": "+8.7%", "trend": "up"},
        ],
        "summary": {"spend": spend, "sales": sales, "orders": orders, "acos": acos, "roas": roas},
        "chart": [
            {"day": "Mon", "sales": 82000, "spend": 11800},
            {"day": "Tue", "sales": 96000, "spend": 13600},
            {"day": "Wed", "sales": 91000, "spend": 12900},
            {"day": "Thu", "sales": 118000, "spend": 15500},
            {"day": "Fri", "sales": 131000, "spend": 17600},
            {"day": "Sat", "sales": 146000, "spend": 19800},
            {"day": "Sun", "sales": 132000, "spend": 18200},
        ],
        "campaigns": campaigns,
    }

@router.get("/campaigns")
async def campaigns():
    data = await ads.get_campaigns("demo")
    for c in data:
        c["acos"] = round(c["spend"] / c["sales"] * 100, 2) if c["sales"] else 0
        c["roas"] = round(c["sales"] / c["spend"], 2) if c["spend"] else 0
    return data

@router.get("/inventory")
async def inventory():
    return await sp.get_inventory("demo")

@router.get("/orders")
async def orders():
    return await sp.get_orders("demo")

@router.get("/listings")
async def listings():
    return [
        {"asin": "B0PEANUT1", "sku": "PO-1L", "title": "Premium Virgin Peanut Oil 1L", "price": 699, "stock": 1840, "status": "Active"},
        {"asin": "B0PEANUT5", "sku": "PO-5L", "title": "Premium Virgin Peanut Oil 5L", "price": 2999, "stock": 720, "status": "Active"},
        {"asin": "B0PEANUT5", "sku": "PO-500", "title": "Premium Virgin Peanut Oil 500ML", "price": 399, "stock": 4260, "status": "Active"},
    ]

@router.get("/analytics")
async def analytics():
    return {
        "sales": 842000,
        "ad_spend": 124000,
        "acos": 14.73,
        "roas": 6.79,
        "tacos": 8.9,
        "ctr": 1.42,
        "cpc": 12.8,
        "cvr": 8.7,
    }

@router.get("/alerts")
async def alerts():
    return [
        {"severity": "critical", "title": "Low stock", "message": "PO-1L has approximately 6 days of cover."},
        {"severity": "warning", "title": "ACOS increased", "message": "Peanut Oil | Broad is above the target ACOS."},
        {"severity": "success", "title": "Opportunity", "message": "Brand Defense has strong ROAS and unused budget."},
    ]

@router.get("/clients")
async def clients():
    return [
        {"name": "Demo Brand", "marketplace": "India", "status": "Connected", "sales": "₹8.42L"},
        {"name": "Example Foods", "marketplace": "USA", "status": "Pending", "sales": "$12.4K"},
    ]

@router.get("/amazon/oauth/start")
def amazon_oauth_start():
    if not settings.amazon_ads_client_id:
        raise HTTPException(status_code=400, detail="AMAZON_ADS_CLIENT_ID is not configured")
    return {"authorization_url": ads_authorization_url("demo-state")}

@router.get("/amazon/sp/oauth/start")
def amazon_sp_oauth_start():
    if not settings.amazon_sp_client_id:
        raise HTTPException(status_code=400, detail="AMAZON_SP_CLIENT_ID is not configured")
    return {"authorization_url": sp_authorization_url("demo-state")}

@router.post("/automation/rules")
def create_rule(payload: AutomationCreate):
    return {"id": "demo-rule", **payload.model_dump(), "status": "created"}

@router.get("/settings")
def settings_view():
    return {
        "environment": "demo" if settings.demo_mode else "production",
        "connected_ads": bool(settings.amazon_ads_client_id),
        "connected_sp_api": bool(settings.amazon_sp_client_id),
    }
