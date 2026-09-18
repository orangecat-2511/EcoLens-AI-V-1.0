from typing import Dict

from fastapi import APIRouter, Query

from ..core.data import COUNTRIES
from ..core.services import get_country, similarity

router = APIRouter(prefix="/api/countries/{country_name}", tags=["comparison"])


@router.get("/twins")
def twins(country_name: str, limit: int = Query(default=5, ge=1, le=10)) -> Dict:
    selected = get_country(country_name)
    ranked = [{**country, "similarity": similarity(selected, country)} for country in COUNTRIES if country["country"] != selected["country"]]
    ranked.sort(key=lambda item: item["similarity"], reverse=True)
    return {"country": selected["country"], "twins": ranked[:limit]}