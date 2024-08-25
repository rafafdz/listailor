from supabase import create_client, Client
from pydantic import BaseModel
from openai import OpenAI
from typing import List
import json
import random
from dotenv import load_dotenv
import os
import time
import concurrent.futures
import logging

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
    trazas: str
    ingredientes: str
    envase: str
    pais_origen: str
    precio: int


def process_item(jumbo_item: JumboItem):
    try:
        logging.info(f"Processing {jumbo_item.name}")

        # OpenAI API call
        try:
            response = openai_client.embeddings.create(
                input=jumbo_item.name, model="text-embedding-3-small"
            )
            embedding = response.data[0].embedding
        except Exception as e:
            logging.error(f"OpenAI API error for {jumbo_item.name}: {str(e)}")
            raise

        # Create SupabaseItem
        item = SupabaseItem(
            item_name=jumbo_item.name,
            store_id=jumbo_item.item_id,
            image_url=jumbo_item.image_url,
            item_score=random.randint(1, 100) / 10,
            score_reason=jumbo_item.ingredientes,
            category="Yogurt",
            price=jumbo_item.precio,
            embedding=embedding,
        )

        # Supabase insert
        try:
            supabase.table("items").insert(item.model_dump()).execute()
        except Exception as e:
            logging.error(f"Supabase insert error for {jumbo_item.name}: {str(e)}")
            raise

    except Exception as e:
        logging.error(f"Failed to process {jumbo_item.name}: {str(e)}")
        append_to_failed_items(jumbo_item)


def append_to_failed_items(item: JumboItem):
    with open("failed_items.json", "a") as f:
        json.dump(item.model_dump(), f)
        f.write("\n")


def bulk_upload_items(jumbo_items: List[JumboItem]):
    with concurrent.futures.ThreadPoolExecutor(max_workers=16) as executor:
        list(executor.map(process_item, jumbo_items))


def load_items(filename: str) -> List[JumboItem]:
    with open(filename, "r") as f:
        items = json.load(f)
    return [JumboItem(**item) for item in items]


def load_failed_items() -> List[JumboItem]:
    items = []
    try:
        with open("failed_items.json", "r") as f:
            for line in f:
                items.append(JumboItem(**json.loads(line)))
    except FileNotFoundError:
        logging.info("No failed items file found.")
    return items


def main():
    while True:
        print("\n1. Upload whole file")
        print("2. Retry failed items")
        print("3. Exit")
        choice = input("Enter your choice (1/2/3): ")

        if choice == "1":
            filename = input("Enter the filename to upload (e.g., items.json): ")
            try:
                filename = filename or "items.json"
                items = load_items(filename)
                start_time = time.time()
                bulk_upload_items(items)
                total_time = time.time() - start_time
                print(f"Total execution time: {total_time:.4f} seconds")
            except FileNotFoundError:
                print(f"File {filename} not found.")
            except json.JSONDecodeError:
                print(f"Invalid JSON in {filename}.")
            except Exception as e:
                print(f"An error occurred: {str(e)}")

        elif choice == "2":
            failed_items = load_failed_items()
            if failed_items:
                print(f"Retrying {len(failed_items)} failed items...")
                start_time = time.time()
                bulk_upload_items(failed_items)
                total_time = time.time() - start_time
                print(f"Total execution time: {total_time:.4f} seconds")
                os.remove("failed_items.json")
            else:
                print("No failed items to retry.")

        elif choice == "3":
            print("Exiting the program.")
            break

        else:
            print("Invalid choice. Please try again.")


if __name__ == "__main__":
    main()
