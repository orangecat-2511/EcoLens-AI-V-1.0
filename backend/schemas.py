from typing import List

from pydantic import BaseModel, Field


class ScenarioRequest(BaseModel):
    intervention_ids: List[str] = Field(default_factory=list, min_length=1)