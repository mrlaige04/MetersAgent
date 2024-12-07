from langchain_openai import ChatOpenAI
from langchain.prompts.chat import ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate
from models import ResponseModel
from langchain.schema import AIMessage
from config.settings import intents, meter_types
from dotenv import load_dotenv
import os
import json
import re
from fastapi import HTTPException

load_dotenv()

openai_api_key = os.getenv('OPENAI_API_KEY')

llm = ChatOpenAI(model='gpt-4o-mini', temperature=0.5, openai_api_key=openai_api_key)

intents_str = "\n".join([f"{intent}: {data['description']}" for intent, data in intents.items()])
meter_types_str = "\n".join([f"{meter_type}: {data['description']}" for meter_type, data in meter_types.items()])

def build_prompt(text: str, lang="en"):
    params_template = ", ".join([f'\"{param}\": <value>' for param in intents.get('SEND', {}).get('required_params', [])])

    return f"""
    Your task is to determine the intent from the user's input and extract the relevant parameters for the identified action.
    You must return the response in the following JSON format.
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
    If the input cannot be parsed or does not match a valid command, return success as false and the message "Unknown command".
    For the message text use language: {lang}
    """

def create_chat_prompt(text: str, lang="en"):
    prompt_text = build_prompt(text, lang)
    
    system_message_prompt = SystemMessagePromptTemplate.from_template(" You are a dialogue agent that processes user inputs related to meter readings.")
    human_message_prompt = HumanMessagePromptTemplate.from_template("{query}")
    
    chat_prompt = ChatPromptTemplate.from_messages(
        [system_message_prompt, human_message_prompt]
    )

    return chat_prompt, prompt_text, lang


def clean_json_string(response_text: str):
    clean_text = re.sub(r'```json\n?', '', response_text)  
    clean_text = re.sub(r'\n?```', '', clean_text) 
    return clean_text

def process_prompt(text: str, lang="en") -> ResponseModel:
    try:
        chat_prompt, query, lang = create_chat_prompt(text, lang)

        # Генерация запроса к модели
        prompt = build_prompt(text, lang)
        chain = chat_prompt | llm
        result = chain.invoke(query)

        if not result:
            raise ValueError("Empty response from LLM")

        if isinstance(result, AIMessage):
            result_text = result.content
        else:
            result_text = result

        if not result_text.strip():
            raise ValueError("Received empty or invalid result text")
        
        response_json = clean_json_string(result_text)  # если нужно очистить строку
        try:
            response_json = json.loads(response_json)  # парсим строку
        except json.JSONDecodeError:
            raise ValueError("Error decoding the JSON response")

        # Проверяем наличие обязательных параметров
        if 'intent' not in response_json:
            response_json['intent'] = 'UNKNOWN'

        # Добавляем параметр success, если его нет
        if 'success' not in response_json:
            response_json['success'] = False

        # Если success = False, то обрабатываем недостающие параметры
        if response_json.get('success') == False:
            missing_params = []
            intent = response_json.get('intent')

            # Проверка на наличие обязательных параметров для текущего intent
            if intent in intents:
                required_params = intents[intent].get('required_params', [])
                for param in required_params:
                    # Если параметр отсутствует или null/undefined
                    if param not in response_json['params'] or response_json['params'][param] is None:
                        missing_params.append(param)

            # Если параметры отсутствуют, возвращаем ошибку с отсутствующими параметрами
            if missing_params:
                response_json['message'] = f"Required params are missing: {', '.join(missing_params)}"
                return ResponseModel(**response_json)

            # Если параметров нет, а message не найден, то возвращаем общую ошибку
            response_json['message'] = 'Unknown error'
            return ResponseModel(**response_json)

        # Проверка на поддержку meter type
        meter_type = response_json['params'].get('METER_TYPE')
        if meter_type not in meter_types:
            response_json['success'] = False
            response_json['message'] = 'Unsupported meter type'
            return ResponseModel(**response_json)

        # Проверка на поддержку intent
        intent = response_json['intent']
        if intent not in intents:
            response_json['success'] = False
            response_json['message'] = 'Unsupported intent'
            return ResponseModel(**response_json)

        response_json['success'] = True
        response_json['message'] = f'Successfully processed the {intent} intent'
        return ResponseModel(**response_json)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Error processing the message: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")