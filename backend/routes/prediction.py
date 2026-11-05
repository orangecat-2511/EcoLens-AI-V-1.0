from typing import Dict

from fastapi import APIRouter, Query

from ..core.data import COUNTRIES, COUNTRY_RANKS, INDICATOR_LABELS
from ..core.services import get_country

router = APIRouter(prefix="/api/countries/{country_name}", tags=["prediction"])


@router.get("/trend")
def trend(country_name: str) -> Dict:
    country = get_country(country_name)
    points = [{"year": 2024, "score": country["score"], "rank": COUNTRY_RANKS[country["country"]]}]
    return {"country": country["country"], "points": points}


@router.get("/forecast")
def forecast(country_name: str, horizon: int = Query(default=6, ge=1, le=10)) -> Dict:
    country = get_country(country_name)
    base_score = country["score"]
    current_rank = COUNTRY_RANKS[country["country"]]

    # Dynamic annual rate based on distance to 65 threshold
    annual_gain = round(max(0.4, min(1.6, (65 - base_score) * 0.025 + 0.75)), 2)
    points = [{"year": 2024, "historical": base_score, "predicted": None}]
    for index, year in enumerate(range(2025, 2025 + horizon), start=1):
        points.append({
            "year": year,
            "historical": None,
            "predicted": round(min(100.0, base_score + index * annual_gain), 1)
        })

    predicted_score = points[-1]["predicted"]
    predicted_rank = sum(1 for c in COUNTRIES if c["score"] > predicted_score) + 1
    rank_improvement = max(0, current_rank - predicted_rank)
    confidence = int(max(72, min(94, 88 - abs(base_score - 48) * 0.2)))

    indicator_forecasts = []
    for key, (label, unit) in INDICATOR_LABELS.items():
        curr_val = country[key]
        pred_val = round(min(100.0, curr_val + annual_gain * 1.8), 1)
        status = "Good" if pred_val >= 60 else "Moderate" if pred_val >= 35 else "Low"
        indicator_forecasts.append({
            "name": label,
            "current": curr_val,
            "predicted": pred_val,
            "status": status,
            "unit": unit
        })

    return {
        "country": country["country"],
        "base_year": 2024,
        "prediction_year": 2024 + horizon,
        "base_score": base_score,
        "base_rank": current_rank,
        "predicted_score": predicted_score,
        "predicted_rank": predicted_rank,
        "rank_improvement": rank_improvement,
        "confidence": confidence,
        "indicator_forecasts": indicator_forecasts,
        "model": "gradient-trend-projection",
        "points": points,
    }