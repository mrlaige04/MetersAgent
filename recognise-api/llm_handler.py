import json
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.chat_models import ChatOpenAI
from models import ResponseModel
from config.settings import intents, meter_types
from dotenv import load_dotenv
import os 

load_dotenv()

openai_api_key = os.getenv('OPENAI_API_KEY')

llm = ChatOpenAI(model='model=gpt-4mini',temperature=0.5, openai_api_key=openai_api_key)

intents_str = "\n".join([f"{intent}: {data['description']}" for intent, data in intents.items()])
meter_types_str = "\n".join([f"{meter_type}: {data['description']}" for meter_type, data in meter_types.items()])

def build_prompt(lang="en"):
    params_template = ", ".join([f'\"{param}\": <value>' for param in intents.get('SEND', {}).get('required_params', [])])
    
    return f"""
    You are a dialogue agent that processes user inputs related to meter readings.
    Your task is to determine the intent from the user's input and extract the relevant parameters for the identified action.

    The available intents are:
    {intents_str}

    The available meter types are:
    {meter_types_str}

    The user's input is: "{{text}}"

    Please respond with the following JSON format:
    {{
        "success": true,
        "intent": "{{intent}}",
        "params": {{
            {params_template}
        }},
        "message": "Your message here"
    }}

    If the meter type is not supported, return a message "Unsupported meter type".
    If any required parameters are missing for the identified intent, return success as false and indicate which parameters are missing.

    For the message text use language: {lang}
    """

prompt = PromptTemplate(input_variables=['text'], template=build_prompt(lang="en"))
chain = LLMChain(llm=llm, prompt=prompt)

# Метод для обработки запроса
def process_prompt(text: str, lang="en") -> ResponseModel:
    try:
        prompt = build_prompt(lang) 
        prompt_template = PromptTemplate(input_variables=['text'], template=prompt)
        chain = LLMChain(llm=llm, prompt=prompt_template)
        
        result = chain.run({ "text": text })
        response_json = json.loads(result)

        meter_type = response_json['params'].get('METER_TYPE')

        if meter_type not in meter_types:
            response_json['success'] = False
            response_json['message'] = 'Unsupported meter type'
            return ResponseModel(**response_json)
        
        intent = response_json['intent']
        if intent not in intents:
            response_json['success'] = False
            response_json['message'] = 'Unsupported intent'
            return ResponseModel(**response_json)
        
        response_json['message'] = f'Successfully processed the {intent} intent'
        return ResponseModel(**response_json)
    except Exception as e:
        raise ValueError(f'Error pr