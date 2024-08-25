from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import items, jumbo_carts

app = FastAPI()

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello listAIlor World"}


app.include_router(items.router)
app.include_router(jumbo_carts.router)
