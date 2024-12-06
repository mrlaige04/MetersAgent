from langchain_openai import ChatOpenAI
from langchain.prompts.chat import ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate
from models import ResponseModel
from config.settings import intents, meter_types
from dotenv import load_dotenv
import os
import json

load_dotenv()

openai_api_key = os.getenv('OPENAI_API_KEY')

llm = ChatOpenAI(model='gpt-4', temperature=0.5, openai_api_key=openai_api_key)

intents_str = "\n".join([f"{intent}: {data['description']}" for intent, data in intents.items()])
meter_types_str = "\n".join([f"{meter_type}: {data['description']}" for meter_type, data in meter_types.items()])

def build_prompt(text: str, lang="en"):
    params_template = ", ".join([f'\"{param}\": <value>' for param in intents.get('SEND', {}).get('required_params', [])])

    return f"""
    You are a dialogue agent that processes user inputs related to meter readings.
    Your task is to determine the intent from the user's input and extract the relevant parameters for the identified action.

    The available intents are:
    {intents_str}

    The available meter types are:
    {meter_types_str}

    The user's input is: "{text}"

    Please respond with the following JSON format:
    {{
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

def create_chat_prompt(text: str, lang="en"):
    system_message = "You are a helpful assistant for processing meter readings."
    system_message_prompt = SystemMessagePromptTemplate.from_template(system_message)

    human_message_prompt = HumanMessagePromptTemplate.from_template("{query}")

    chat_prompt = ChatPromptTemplate.from_messages(
        [system_message_prompt, human_message_prompt]
    )

    return chat_prompt, text, lang

def process_prompt(text: str, lang="en") -> ResponseModel:
    try:
        chat_prompt, query, lang = create_chat_prompt(text, lang)
        
        chain = chat_prompt | llm

        result = chain.invoke(query) 

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
        
        response_json['success'] = True
        response_json['message'] = f'Successfully processed the {intent} intent'
        return ResponseModel(**response_json)
    except Exception as e:
        raise ValueError(f'Error processing the LLM response: {str(e)}')
