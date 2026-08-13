# Fintech AI Platform

Modular FastAPI backend + React frontend powering five fintech AI modules
over a shared PostgreSQL data layer.

```
React Frontend
      │
REST API Requests
      │
FastAPI Backend
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│ Loan     │ Churn    │ Fraud    │ RBI Q&A  │ Credit   │
│ Scoring  │Prediction│Detection │ (RAG+LLM)│ Agent    │
└──────────┴──────────┴──────────┴──────────┴──────────┘
      │
Shared PostgreSQL
      │
ML Models + LLM Services
(XGBoost, RAG, LLaMA 3.3 70B)
```

## Project layout

```
backend/
  app/
    core/            # config, shared DB session, JWT auth, auth router
    models/           # shared SQLAlchemy models (Postgres tables)
    schemas/          # Pydantic request/response models for all modules
    modules/
      loan_scoring/    # XGBoost model + train script + service + router
      churn_prediction/
      fraud_detection/
      rbi_qa/          # RAG pipeline: Chroma vector store + LLaMA
      credit_agent/    # Conversational agent, calls loan_scoring internally
    main.py            # wires all module routers into one FastAPI app
  requirements.txt
  Procfile             # Railway start command
  .env.example
frontend/
  src/
    api/client.js       # axios client, one function per module endpoint
    pages/               # one page per module + login
    App.jsx              # routes + nav
  package.json
  vite.config.js
```

Every module is isolated (own service.py + router.py) but shares the same
Postgres engine, auth layer, and FastAPI app instance — matching the
architecture diagram exactly.

## 1. Local setup — backend

```bash
cd backend
python -m venv venv && source venv/bin/activate     # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env                                  # then fill in real values
```

You need a running Postgres instance. Easiest local option:

```bash
docker run --name fintech-pg -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=fintech_ai -p 5432:5432 -d postgres:16
```

Update `DATABASE_URL` in `.env` to match.

Run the API:

```bash
uvicorn app.main:app --reload
```

Visit `http://localhost:8000/docs` for interactive Swagger docs — tables
are auto-created on first startup (via `init_db()` in `main.py`; swap for
Alembic migrations before production).

### Train the loan scoring model (do this before hitting the endpoint for real predictions)

```bash
python -m app.modules.loan_scoring.train_model
```

This writes `app/modules/loan_scoring/artifacts/loan_model.json`. Until
you run it, the `/api/loan-scoring/score` endpoint still works using a
simple rule-based fallback so the API never breaks — replicate the same
pattern (`train_model.py`) for churn and fraud once you have labeled data.

### Ingest RBI documents for the Q&A module

Drop `.txt` versions of RBI circulars/master directions into
`./data/rbi_documents/`, then:

```bash
python -m app.modules.rbi_qa.ingest --dir ./data/rbi_documents
```

### LLM provider

`credit_agent` and `rbi_qa` call LLaMA 3.3 70B through an OpenAI-compatible
endpoint (Groq works well and is fast/cheap). Set `LLM_PROVIDER_API_KEY`
and `LLM_PROVIDER_BASE_URL` in `.env`.

## 2. Local setup — frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`. Create a `.env` file with:

```
VITE_API_URL=http://localhost:8000
```

## 3. Deploy

### Backend → Railway
1. Push `backend/` to a GitHub repo (or connect the whole monorepo, set root
   directory to `backend`).
2. In Railway: New Project → Deploy from GitHub → add a **PostgreSQL** plugin
   (Railway sets `DATABASE_URL` automatically — just adjust the scheme prefix
   to `postgresql+asyncpg://` in `config.py` or via an env override).
3. Add the remaining env vars from `.env.example` in Railway's Variables tab.
4. Railway will detect the `Procfile` and run
   `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.

### Frontend → Vercel
1. Push `frontend/` (import the repo, set root directory to `frontend`).
2. Framework preset: Vite.
3. Add env var `VITE_API_URL=https://your-backend.up.railway.app`.
4. Update `FRONTEND_ORIGINS` in the backend's Railway env vars to include
   your Vercel domain (CORS).

## Next steps to flesh out

- Replace synthetic training data in `train_model.py` with real labeled
  loan/churn/fraud datasets, and write equivalent scripts for churn and fraud.
- Add Alembic migrations instead of `init_db()`'s auto-create.
- Add role-based access control (the `role` field already exists on `User`).
- Add rate limiting / request logging middleware.
- Write integration tests per module (`pytest` + `httpx.AsyncClient`).
