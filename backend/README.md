# EcoLens AI Backend

FastAPI service for the EcoLens AI environmental intelligence dashboard.

## Structure

- `main.py` - application setup, CORS, and router registration
- `core/data.py` - demo environmental datasets
- `core/services.py` - shared country lookup and similarity logic
- `schemas.py` - request validation models
- `routes/assessment.py` - countries and EPI assessment
- `routes/prediction.py` - trends and forecasts
- `routes/comparison.py` - environmental twins
- `routes/explainability.py` - model contribution explanations
- `routes/policy.py` - interventions, scenarios, and priorities

## Run locally

From the repository root:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
uvicorn backend.main:app --reload
```

The API is available at `http://localhost:8000`. Interactive documentation is at `/docs`.

## Main endpoints

- `GET /api/countries` - available country records and indicators
- `GET /api/countries/{country}/assessment` - EPI assessment and history
- `GET /api/countries/{country}/forecast` - projected EPI trend
- `GET /api/countries/{country}/twins` - environmental similarity ranking
- `GET /api/countries/{country}/explainability` - model driver contributions
- `POST /api/countries/{country}/scenarios` - evaluate selected interventions
- `GET /api/countries/{country}/priorities` - ranked intervention priorities

Country and indicator records are loaded from the tracked `data/epilens_clean.csv` dataset. The service does not add a duplicate hardcoded country dataset. Intervention definitions and explainability values remain application configuration until a trained model and policy catalogue are connected.