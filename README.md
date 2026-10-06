# ADPILOT — Amazon Seller & Ads Management SaaS

Production-style full-stack starter for a premium Amazon management platform.

## Stack

- Frontend: Next.js 14 + React 18 + TypeScript + Tailwind CSS
- Backend: FastAPI + SQLAlchemy + Pydantic
- Database: PostgreSQL
- Cache/Jobs: Redis + Celery
- Containers: Docker Compose
- Integrations: Amazon Ads API + Amazon Selling Partner API (SP-API) adapter architecture
- UI: Premium blue responsive dashboard, no paid UI dependency

## Modules

Dashboard, Ads Manager, Keywords, Search Terms, Inventory, Orders, Listings,
Pricing, Fees & Profit, Sales Analytics, Reports, Automation, Alerts,
Client Accounts, Settings.

## Quick start

1. Copy environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

2. Start everything:

```bash
docker compose up --build
```

3. Open:

- Frontend: http://localhost:3000
- API docs: http://localhost:8000/docs
- API health: http://localhost:8000/health

The dashboard uses demo data by default. Real Amazon data requires approved Amazon
API access and valid OAuth/application credentials.

## Local development

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Amazon integration architecture

The backend separates provider adapters from business logic:

```text
Next.js UI
   |
FastAPI API
   |
Service layer
   +---- Amazon Ads adapter
   +---- Amazon SP-API adapter
   |
PostgreSQL / Redis
```

Add credentials to `backend/.env` and implement/enable the provider-specific
request methods in `backend/app/integrations/amazon/`.

Do not collect or store an Amazon username/password. Use Amazon's authorization
flow and store OAuth tokens encrypted at rest in a production deployment.

## Important production work before launch

- Complete Amazon application/approval and required API roles.
- Implement the exact Amazon Ads/SP-API operations required by your approved roles.
- Replace demo auth with a real identity provider/session system.
- Encrypt OAuth tokens using a KMS/secrets manager.
- Add tenant isolation and database row-level security where appropriate.
- Add background sync workers, retries, rate-limit handling and idempotency.
- Add audit logs for every write operation.
- Add automated tests, CI/CD, monitoring and backups.
- Review Amazon terms, policies and data retention requirements before public launch.
