from math import sqrt
from typing import Dict

from fastapi import HTTPException

from .data import COUNTRIES

COUNTRY_ALIASES = {
    "vietnam": "Viet Nam",
}


def get_country(name: str) -> Dict:
    lookup_name = COUNTRY_ALIASES.get(name.lower(), name)
    country = next((item for item in COUNTRIES if item["country"].lower() == lookup_name.lower()), None)
    if country is None:
        raise HTTPException(status_code=404, detail=f"Country '{name}' was not found")
    return country


def similarity(first: Dict, second: Dict) -> float:
    fields = ["air", "water", "forest", "renewable", "waste", "economic", "demographic", "governance", "social", "environmental"]
    distance = sqrt(sum((first[field] - second[field]) ** 2 for field in fields))
    return round(max(0, min(100, 100 - distance * 0.65)), 1)