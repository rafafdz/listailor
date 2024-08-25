from supabase import create_client, Client
from pydantic import BaseModel
from typing import List
from settings import settings


class SupabaseItem(BaseModel):
    item_name: str
    store_id: str
    image_url: str
    item_score: float
    score_reason: str
    category: str
    price: int
    embedding: List[float]


class SupabaseService:
    url = settings.SUPABASE_URL
    key = settings.SUPABASE_KEY

    def __init__(self):
        self.supabase: Client = create_client(self.url, self.key)

    def get_items_by_embeddings(
        self, embeddings: List[float], n: int = 10
    ) -> list[SupabaseItem] | list[dict] | None:
        response = self.supabase.rpc(
            "match_items",
            {"match_count": n, "match_threshold": 0.1, "query_embedding": embeddings},
        ).execute()

        if response.data:
            for item in response.data:
                item.pop("embedding", None)

        print(response.data)
        return response.data

    def get_items_by_store_id(self, store_id: str, n: int = 10) -> list[SupabaseItem]:
        response = (
            self.supabase.table("items")
            .select("*")
            .eq("store_id", store_id)
            .limit(n)
            .execute()
        )
        return response.data

    def get_item_by_store_id(self, store_id: str):
        return self.get_items_by_store_id(store_id, 1)[0]
