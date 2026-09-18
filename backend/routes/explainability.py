from typing import Dict

from fastapi import APIRouter

from ..core.data import EXPLAINABILITY
from ..core.services import get_country

router = APIRouter(prefix="/api/countries/{country_name}", tags=["explainability"])


@router.get("/explainability")
def explainability(country_name: str) -> Dict:
    country = get_country(country_name)
    return {"country": country["country"], "predicted_score": round(country["score"] + 5.9, 1), "base_value": 28.1, "contributions": EXPLAINABILITY}