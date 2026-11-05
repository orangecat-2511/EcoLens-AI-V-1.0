from typing import Dict, List

from fastapi import APIRouter, HTTPException

from ..core.data import INTERVENTIONS
from ..core.services import get_country
from ..schemas import ScenarioRequest

router = APIRouter(prefix="/api", tags=["policy"])


@router.get("/interventions")
def interventions() -> Dict[str, List[Dict]]:
    return {"interventions": INTERVENTIONS}


@router.post("/countries/{country_name}/scenarios")
def scenario(country_name: str, request: ScenarioRequest) -> Dict:
    country = get_country(country_name)
    selected = [item for item in INTERVENTIONS if item["id"] in request.intervention_ids]
    unknown = set(request.intervention_ids) - {item["id"] for item in selected}
    if unknown:
        raise HTTPException(status_code=422, detail=f"Unknown intervention ids: {sorted(unknown)}")
    gain = sum(item["score_gain"] for item in selected)
    return {"country": country["country"], "selected_interventions": selected, "baseline_score": country["score"], "projected_score": round(min(100, country["score"] + gain), 1), "score_gain": round(gain, 1), "confidence": round(sum(item["confidence"] for item in selected) / len(selected), 2)}


@router.get("/countries/{country_name}/priorities")
def priorities(country_name: str) -> Dict:
    country = get_country(country_name)
    indicator_mapping = {
        "renewable-energy": "renewable",
        "forest-restoration": "forest",
        "clean-air": "air",
        "wastewater": "water",
        "waste-management": "waste",
    }
    calibrated = []
    for item in INTERVENTIONS:
        indicator_key = indicator_mapping.get(item["id"])
        current_val = country.get(indicator_key, 50.0) if indicator_key else 50.0
        # Multiplier inversely proportional to current performance (more room for growth)
        growth_multiplier = max(0.6, min(1.6, (100.0 - current_val) / 50.0))
        gain = round(item["score_gain"] * growth_multiplier, 1)
        impact = round(item["impact"] * growth_multiplier, 1)
        calibrated.append({
            "id": item["id"],
            "intervention": item["name"],
            "description": item["description"],
            "gain": gain,
            "impact": impact,
            "confidence": item["confidence"],
            "priority_score": gain * item["confidence"],
        })

    calibrated.sort(key=lambda x: x["priority_score"], reverse=True)
    return {
        "country": country["country"],
        "priorities": [
            {
                "rank": idx,
                "intervention": item["intervention"],
                "description": item["description"],
                "gain": item["gain"],
                "impact": item["impact"],
                "confidence": item["confidence"],
            }
            for idx, item in enumerate(calibrated, start=1)
        ],
    }