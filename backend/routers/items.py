from fastapi import APIRouter
from services import SupabaseService, OpenAIService
from pydantic import BaseModel

router = APIRouter(
    prefix="/items",
    tags=["items"],
)


class ItemResponse(BaseModel):
    id: str
    label: str
    imageUrl: str
    score: float
    price: int
    category: str
    reason: str


@router.get("/")
async def search_item_by_embeddings(q: str, n: int = 10):
    supabase_service = SupabaseService()
    openai_service = OpenAIService()
    search_embeddings = openai_service.get_embeddings_from_text(q)
    items: list[dict] = supabase_service.get_items_by_embeddings(search_embeddings, n)  # type: ignore
    response_items = []
    for item in items:
        response_items.append(
            ItemResponse(
                id=item["store_id"],
                label=item["item_name"],
                imageUrl=item["image_url"],
                score=item["item_score"],
                price=item["price"],
                category=item["category"],
                reason=item["score_reason"],
            )
        )
    return response_items
