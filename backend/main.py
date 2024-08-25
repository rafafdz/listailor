from fastapi import FastAPI
from routers import items, jumbo_carts

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello listAIlor World"}
    

app.include_router(items.router)
app.include_router(jumbo_carts.router)

