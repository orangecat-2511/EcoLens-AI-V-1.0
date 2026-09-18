from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import assessment, comparison, explainability, policy, prediction


app = FastAPI(
    title="EcoLens AI API",
    description="Environmental performance assessment and sustainability decision support.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(assessment.router)
app.include_router(prediction.router)
app.include_router(comparison.router)
app.include_router(explainability.router)
app.include_router(policy.router)


@app.get("/", tags=["system"])
def root() -> dict[str, str]:
    return {"name": "EcoLens AI API", "docs": "/docs", "status": "ok"}


@app.get("/health", tags=["system"])
def health() -> dict[str, str]:
    return {"status": "healthy"}
