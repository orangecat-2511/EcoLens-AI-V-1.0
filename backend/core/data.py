import csv
from pathlib import Path
from typing import Dict, List


DATASET_PATH = Path(__file__).resolve().parents[2] / "data" / "epilens_clean.csv"


def _number(row: Dict[str, str], column: str) -> float:
    value = row.get(column, "")
    try:
        return round(float(value), 2)
    except (TypeError, ValueError):
        return 0.0


def _load_countries() -> List[Dict]:
    with DATASET_PATH.open(newline="", encoding="utf-8-sig") as dataset:
        rows = list(csv.DictReader(dataset))

    countries = []
    for row in rows:
        countries.append({
            "country": row["country"],
            "flag": row["iso"],
            "score": _number(row, "EPI.new"),
            "air": _number(row, "AIR.new"),
            "water": _number(row, "H2O.new"),
            "forest": _number(row, "FCD.new"),
            "renewable": _number(row, "GTP.new"),
            "waste": _number(row, "WMG.new"),
            "economic": _number(row, "ECO.new"),
            "demographic": _number(row, "POP.new"),
            "governance": _number(row, "GOV.new"),
            "social": _number(row, "SPI.new"),
            "environmental": _number(row, "EPI.new"),
        })

    return sorted(countries, key=lambda item: item["country"])


COUNTRIES = _load_countries()
COUNTRY_RANKS = {
    country["country"]: rank
    for rank, country in enumerate(
        sorted(COUNTRIES, key=lambda item: item["score"], reverse=True),
        start=1,
    )
}

# The repository dataset is a current snapshot. Historical observations should
# be loaded here when a year-indexed source is added.
HISTORY: List[Dict] = []

INTERVENTIONS = [
    {"id": "renewable-energy", "name": "Renewable Energy Expansion", "description": "Expand solar and wind capacity.", "score_gain": 3.8, "impact": 10, "confidence": 0.87},
    {"id": "forest-restoration", "name": "Forest Restoration Mission", "description": "Restore degraded forest regions.", "score_gain": 4.2, "impact": 12, "confidence": 0.85},
    {"id": "clean-air", "name": "Clean Air Action Plan", "description": "Reduce industrial, vehicle and urban emissions.", "score_gain": 3.1, "impact": 8, "confidence": 0.83},
    {"id": "wastewater", "name": "Urban Wastewater Modernization", "description": "Improve wastewater treatment infrastructure.", "score_gain": 2.4, "impact": 6, "confidence": 0.84},
    {"id": "waste-management", "name": "Sustainable Waste Management", "description": "Increase collection, sorting and recycling capacity.", "score_gain": 2.1, "impact": 5, "confidence": 0.80},
]

INDICATOR_LABELS = {
    "air": ("Air Quality", "ug/m3"), "water": ("Water Quality", "/100"),
    "forest": ("Forest Cover", "%"), "renewable": ("Renewable Energy", "%"),
    "waste": ("Waste Management", "/100"),
}

EXPLAINABILITY = [
    {"name": "Forest Cover", "value": 2.8, "positive": True},
    {"name": "Renewable Energy", "value": 1.9, "positive": True},
    {"name": "Waste Management", "value": 1.5, "positive": True},
    {"name": "Air Quality", "value": -2.7, "positive": False},
    {"name": "Water Quality", "value": -2.1, "positive": False},
    {"name": "CO2 Emissions", "value": -1.3, "positive": False},
]
