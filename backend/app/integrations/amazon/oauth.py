from urllib.parse import urlencode
from ...core.config import settings

# Amazon authorization URLs vary by API/application configuration and region.
# Keep them centralized so production configuration can be updated without
# changing business logic.

def ads_authorization_url(state: str) -> str:
    params = {
        "client_id": settings.amazon_ads_client_id,
        "redirect_uri": settings.amazon_ads_redirect_uri,
        "state": state,
    }
    return "https://www.amazon.com/ap/oa?" + urlencode(params)

def sp_authorization_url(state: str) -> str:
    params = {
        "application_id": settings.amazon_sp_client_id,
        "state": state,
        "version": "beta",
    }
    return "https://sellercentral.amazon.com/apps/authorize/consent?" + urlencode(params)
