import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .routes import assessment, comparison, explainability, policy, prediction


app = FastAPI(
    title="EcoLens AI API",
    description="Environmental performance assessment and sustainability decision support.",
    version="1.0.0",
)

# Configure CORS
env_origins = os.getenv("ALLOWED_ORIGINS", "*")
if env_origins.strip() == "*":
    cors_origins = ["*"]
else:
    cors_origins = [o.strip() for o in env_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True if cors_origins != ["*"] else False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(assessment.router)
app.include_router(prediction.router)
app.include_router(comparison.router)
app.include_router(explainability.router)
app.include_router(policy.router)


@app.get("/health", tags=["system"])
def health() -> dict[str, str]:
    return {"status": "healthy"}


# Serve frontend static assets if built dist folder exists
DIST_DIR = Path(__file__).resolve().parents[1] / "dist"
if (DIST_DIR / "index.html").exists():
    if (DIST_DIR / "assets").exists():
        app.mount("/assets", StaticFiles(directory=DIST_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}", tags=["frontend"])
    async def serve_spa(full_path: str):
        if full_path.startswith("api/") or full_path == "api" or full_path in ("docs", "redoc", "openapi.json"):
            return None
        file_path = DIST_DIR / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(DIST_DIR / "index.html")
else:
    @app.get("/", tags=["system"])
    def root() -> dict[str, str]:
        return {"name": "EcoLens AI API", "docs": "/docs", "status": "ok"}

