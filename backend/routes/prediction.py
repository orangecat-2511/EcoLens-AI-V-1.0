from typing import Dict

from fastapi import APIRouter, Query

from ..core.data import COUNTRY_RANKS
from ..core.services import get_country

router = APIRouter(prefix="/api/countries/{country_name}", tags=["prediction"])


@router.get("/trend")
def trend(country_name: str) -> Dict:
    country = get_country(country_name)
    points = [{"year": 2026, "score": country["score"], "rank": COUNTRY_RANKS[country["country"]]}]
    return {"country": country["country"], "points": points}


@router.get("/forecast")
def forecast(country_name: str, horizon: int = Query(default=6, ge=1, le=10)) -> Dict:
    country = get_country(country_name)
    points = [{"year": 2024, "historical": country["score"], "predicted": None}]
    for year in range(2025, 2025 + horizon):
        points.append({"year": year, "historical": None, "predicted": round(country["score"] + (year - 2024) * 0.98, 1)})
    return {"country": country["country"], "model": "baseline-gradient-forecast", "points": points}