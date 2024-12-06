import json
import os

INTENTS_FILE = os.path.join(os.path.dirname(__file__), 'intents.json')
METER_TYPES_FILE = os.path.join(os.path.dirname(__file__), 'meter_types.json')

def load_json(file_path:str):
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)
    
intents = load_json(INTENTS_FILE)
meter_types = load_json(METER_TYPES_FILE)