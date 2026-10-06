from celery import Celery
from ..core.config import settings

celery_app = Celery("adpilot", broker=settings.redis_url, backend=settings.redis_url)

@celery_app.task
def sync_amazon_account(account_id: str):
    # Production: enqueue provider-specific sync jobs with pagination,
    # retries, rate-limit backoff and idempotent upserts.
    return {"account_id": account_id, "status": "queued"}
