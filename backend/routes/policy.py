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
    ranked = sorted(INTERVENTIONS, key=lambda item: item["score_gain"] * item["confidence"], reverse=True)
    return {"country": country["country"], "priorities": [{"rank": index, "intervention": item["name"], "gain": item["score_gain"], "impact": item["impact"], "confidence": item["confidence"]} for index, item in enumerate(ranked, start=1)]}