from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os
from typing import List
import json

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class Product(BaseModel):
    name: str
    ingredients: str
    image_url: str


class ScoredItem(BaseModel):
    ItemId: str
    ItemName: str
    ItemScore: float
    ScoreReason: str


class ScoredItems(BaseModel):
    items: List[ScoredItem]


def analyze_products(products: List[Product]):
    product_descriptions = "\n\n".join(
        [
            f"Product {i+1}:\nname: {p.name}\ningredients: {p.ingredients}\nimage_url: {p.image_url}"
            for i, p in enumerate(products)
        ]
    )

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a sustainability analyzer that scores products from 0 to 10 with one decimal. You should consider visual aspects, such as the packaging (plastic or not, eco stickers, real certification), the ingredients (more sustainable ingredients) and any other aspect you can imagine. The user will provide multiple products with their name, ingredients, and image URL. Return a JSON array with each product's score, reason for scoring, and name of product.",
            },
            {
                "role": "user",
                "content": product_descriptions,
            },
        ],
        response_format={"type": "json_object"},
    )
    return completion.choices[0].message.content


def main():
    products = [
        Product(
            name="Spirelli Vollkorn",
            ingredients="Sémola de trigo duro integral orgánica, Gluten",
            image_url="https://jumbo.vtexassets.com/arquivos/ids/844211-650-650",
        ),
        Product(
            name="espirales pasta de mama",
            ingredients="Sémola de trigos duros seleccionados, Niacina, Hierro (sulfato ferroso), Tiamina, Riboflavina, Gluten",
            image_url="https://jumbo.vtexassets.com/arquivos/ids/839870-650-650",
        ),
        Product(
            name="Espirales",
            ingredients="Sémola de trigo candeal, Harina de trigo, Agua, Niacina, Hierro (sulfato ferroso), Tiamina, Riboflavina, Gluten (sémola), Gluten (harina de trigo)",
            image_url="https://jumbo.vtexassets.com/arquivos/ids/467588-650-650",
        ),
    ]

    result = analyze_products(products)
    print("Analysis results:")
    print(result)


if __name__ == "__main__":
    main()
