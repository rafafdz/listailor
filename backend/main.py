from fastapi import FastAPI
from routers import items
from services import OpenAIService

app = FastAPI()

app.include_router(items.router)


@app.get("/")
async def waste_gpt_credits():
    openai_service = OpenAIService()
    openai_service.waste_gpt_credits()
