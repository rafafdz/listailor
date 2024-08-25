from supabase import create_client, Client
from pydantic import BaseModel
from openai import OpenAI
from typing import List, Dict
import json
import random
from dotenv import load_dotenv
import os
import time
import logging
import openai_scoring

# Set up logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

# Load environment variables
load_dotenv()

# Initialize OpenAI client
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Initialize Supabase client
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
assert url and key, "SUPABASE_URL and SUPABASE_KEY must be set"
supabase: Client = create_client(url, key)


class SupabaseItem(BaseModel):
    item_name: str
    store_id: str
    image_url: str
    item_score: float
    score_reason: str
    category: str
    price: int
    embedding: List[float]


class JumboItem(BaseModel):
    item_id: str
    name: str
    image_url: str
    traces: str
    ingredients: str
    packaging: str
    price: int


def load_items(filename: str) -> Dict[str, List[JumboItem]]:
    with open(filename, "r") as f:
        data = json.load(f)

    items = {}
    for category, category_items in data.items():
        items[category] = [JumboItem(**item) for item in category_items]

    return items


def process_items(category: str, jumbo_items: List[JumboItem]):
    logging.info(f"Processing {len(jumbo_items)} items in category: {category}")

    # Prepare items for openai_scoring
    products = [
        openai_scoring.Product(
            name=item["name"],
            ingredients=item["ingredients"],
            image_url=item["image_url"],
        )
        for item in jumbo_items
    ]

    # Get scores from openai_scoring
    try:
        scoring_results = openai_scoring.main(products)
    except Exception as e:
        logging.error(f"Error in openai_scoring: {str(e)}")
        scoring_results = []

    # Create a dictionary for easy lookup
    score_dict = {item["item"]: item for item in scoring_results}

    processed_items = []
    for jumbo_item in jumbo_items:
        try:
            # OpenAI API call for embedding
            response = openai_client.embeddings.create(
                input=jumbo_item["name"], model="text-embedding-3-small"
            )
            embedding = response.data[0].embedding

            # Get score and reason, or use fallback
            score_info = score_dict.get(jumbo_item["name"], {})
            item_score = score_info.get("score")
            if not item_score:
                logging.error(
                    f"No score found, {score_info} for {jumbo_item['name']} in {category}"
                )
                continue
            score_reason = score_info.get("reason")
            if not score_reason:
                logging.error(
                    f"No reason found, {score_info} for {jumbo_item['name']} in {category}"
                )
                continue

            # Create SupabaseItem
            item = SupabaseItem(
                item_name=jumbo_item["name"],
                store_id=jumbo_item["item_id"],
                image_url=jumbo_item["image_url"],
                item_score=item_score,
                score_reason=score_reason,
                category=category,
                price=jumbo_item["price"],
                embedding=embedding,
            )

            processed_items.append(item)

        except Exception as e:
            logging.error(f"Failed to process {jumbo_item['name']}: {str(e)}")

    # Supabase bulk insert
    try:
        supabase.table("items").upsert(
            [item.model_dump() for item in processed_items]
        ).execute()
    except Exception as e:
        logging.error(f"Supabase insert error for category {category}: {str(e)}")

    logging.info(f"Finished processing category: {category}")


def linear_upload_items(items: Dict[str, List[JumboItem]]):
    for category, category_items in items.items():
        batch = category_items[:40]  # Take up to 40 items
        process_items(category, batch)


if __name__ == "__main__":
    with open("items_utf8.json", "r") as f:
        data = json.load(f)
    target_categories = [
        "papeles-hogar",
    ]
    categories_to_process = {}
    for category, category_items in data.items():
        if category not in target_categories:
            continue
        categories_to_process[category] = category_items

    linear_upload_items(categories_to_process)
