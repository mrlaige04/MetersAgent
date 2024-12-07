from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from models import ResponseModel, InputData
from llm_handler import process_prompt
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    'http://localhost:4200'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

@app.post('/process-message', response_model=ResponseModel)
async def process_message(data: InputData):
    try:
        result = process_prompt(data.text, data.lang)
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing the message: {str(e)}")
