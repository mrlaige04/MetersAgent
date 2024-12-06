from pydantic import BaseModel
from typing import Dict, Any

class InputData(BaseModel):
    text: str
    lang: str = 'en'


class ResponseModel(BaseModel):
    success: bool
    intent: str
    params: Dict[str, Any]
    message: str