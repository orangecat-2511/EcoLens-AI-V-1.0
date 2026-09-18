from typing import Dict, List

from fastapi import APIRouter

from ..core.data import COUNTRIES, COUNTRY_RANKS, INDICATOR_LABELS
from ..core.services import get_country

router = APIRouter(prefix="/api", tags=["assessment"])


@router.get("/countries")
def list_countries() -> Dict[str, List[Dict]]:
    return {"countries": COUNTRIES}


@router.get("/countries/{country_name}/assessment")
def assessment(country_name: str) -> Dict:
    country = get_country(country_name)
    indicators = [{"name": label, "key": key, "value": country[key], "unit": unit} for key, (label, unit) in INDICATOR_LABELS.items()]
    snapshot = [{"year": 2026, "score": country["score"], "rank": COUNTRY_RANKS[country["country"]]}]
    return {"country": country, "epi_score": country["score"], "indicators": indicators, "history": snapshot}