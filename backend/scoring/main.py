from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os
from typing import List
import json

oai_model = "gpt-4o"

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


def analyze_ingredients(products: List[Product]):
    product_descriptions = "\n\n".join(
        [
            f"Product {i+1}:\nname: {p.name}\ningredients: {p.ingredients}"
            for i, p in enumerate(products)
        ]
    )

    completion = client.chat.completions.create(
        model=oai_model,
        messages=[
            {
                "role": "system",
                "content": "You are a sustainability expert that analyzes and scores products from 0 to 10 with one decimal. You only consider the ingredients of a product. You reason on whether each ingredient is sustainable or not. You consider alternatives or overall sustainability or eco friendliness of the ingredient. The user provides name and ingredients for each product. Return a json with score, reason of scoring and name of product. You never mention scoring in your reasoning. Treat each one independently.",
            },
            {
                "role": "user",
                "content": product_descriptions,
            },
        ],
        response_format={"type": "json_object"},
    )
    return json.loads(completion.choices[0].message.content)


def analyze_images(products: List[Product]):
    product_descriptions = "\n\n".join(
        [
            f"Product {i+1}:\nname: {p.name}\nimage_url: {p.image_url}"
            for i, p in enumerate(products)
        ]
    )

    completion = client.chat.completions.create(
        model=oai_model,
        messages=[
            {
                "role": "system",
                "content": "You are a sustainability expert that analyzes and scores products from 0 to 10 with one decimal. You only consider the image of the product. You reason on whether the packaging is sustainable or not, considering primarily materials but any other indicator you see. You consider any indicators of eco friendliness written in the package but ignore ingredients. The user provides name and image url for each product. Return a json with score, reason of scoring and name of product. You never mention scoring in your reasoning.",
            },
            {
                "role": "user",
                "content": product_descriptions,
            },
        ],
        response_format={"type": "json_object"},
    )
    return json.loads(completion.choices[0].message.content)


def analyze_reasons(scores):
    reasons = "\n\n".join(
        [
            f"Product {i+1}:\nname: {p['name']}\ningredients_reason: {p['ingredients_reason']}\nimage_reason: {p['image_reason']}"
            for i, p in enumerate(scores['products'])
        ]
    )

    completion = client.chat.completions.create(
        model=oai_model,
        messages=[
            {
                "role": "system",
                "content": "You are a sustainability expert that analyzes sustainability reports. You summarize reports. You receive one reason for ingredients and one for images. You summarize and give one very concise reason that considers both. Not more than 2 lines per product. You give a json with name and reason for each product",
            },
            {
                "role": "user",
                "content": reasons,
            },
        ],
        response_format={"type": "json_object"},
    )
    return json.loads(completion.choices[0].message.content)


def combine_scores(score_dicts_with_names):
    combined_products = {}

    for score_name, score_dict in score_dicts_with_names.items():
        for product in score_dict['products']:
            name = product['name']
            if name not in combined_products:
                combined_products[name] = {'name': name}
            combined_products[name][f"{score_name}_score"] = product['score']
            combined_products[name][f"{score_name}_reason"] = product['reason']

    return {'products': list(combined_products.values())}


def add_average_score(combined_result):
    for product in combined_result['products']:
        score_keys = [key for key in product.keys() if key.endswith('_score')]
        total_score = sum(product[key] for key in score_keys)
        count = len(score_keys)
        if count > 0:
            average_score = total_score / count
        else:
            average_score = None  # In case no scores are found for the product
        print(score_keys, average_score, product['name'])
        product['average_score'] = average_score

    return combined_result


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
        Product(
            name="Cebolla",
            ingredients="Cebolla",
            image_url="https://jumbo.vtexassets.com/arquivos/ids/416120-650-650",
        ),
        Product(
            name="Cebolla congelada",
            ingredients="Cebolla",
            image_url="https://jumbo.vtexassets.com/arquivos/ids/935610-650-650",
        ),
    ]


    ingredient_scores = analyze_ingredients(products)
    image_scores = analyze_images(products)

    score_dicts_with_names = {
        "image": image_scores,
        "ingredients": ingredient_scores
    }

    combined_scores = combine_scores(score_dicts_with_names)
    reasons = analyze_reasons(combined_scores)

    averaged_scores = add_average_score(combined_scores)

    summarized_lookup = {product['name']: product['reason'] for product in reasons['products']}

    for product in averaged_scores['products']:
        name = product['name']
        if name in summarized_lookup:
            product['reason_summary'] = summarized_lookup[name]

    combined_dict = averaged_scores

    print(combined_dict)




if __name__ == "__main__":
    main()
