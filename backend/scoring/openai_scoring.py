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


class AnalysisOutput(BaseModel):
    name: str
    score: float
    reason: str


class SustainabilityScore(BaseModel):
    item: str
    score: float
    reason: str


def load_items(file_path: str) -> List[Product]:
    with open(file_path, "r") as f:
        items = json.load(f)
    return [
        Product(
            name=item["name"],
            ingredients=item["ingredientes"],
            image_url=item["image_url"],
        )
        for item in items
    ]


def analyze_ingredients(products: List[Product]) -> List[AnalysisOutput]:
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
    print(f"debug ingredients: {completion.choices[0].message.content}")
    return [
        AnalysisOutput(**item)
        for item in json.loads(completion.choices[0].message.content)["products"]
    ]


def analyze_images(products: List[Product]) -> List[AnalysisOutput]:
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
    print(f"debug image: {completion.choices[0].message.content}")
    return [
        AnalysisOutput(**item)
        for item in json.loads(completion.choices[0].message.content)["products"]
    ]


def analyze_reasons(
    ingredient_analysis: List[AnalysisOutput], image_analysis: List[AnalysisOutput]
) -> List[SustainabilityScore]:
    combined_analysis = []
    for ing, img in zip(ingredient_analysis, image_analysis):
        avg_score = (ing.score + img.score) / 2
        reasons = f"Ingredient analysis: {ing.reason}\nImage analysis: {img.reason}"
        combined_analysis.append(
            {"name": ing.name, "score": avg_score, "reasons": reasons}
        )

    reasons_str = "\n\n".join(
        [
            f"Product {i+1}:\nname: {p['name']}\nscore: {p['score']}\nreasons: {p['reasons']}"
            for i, p in enumerate(combined_analysis)
        ]
    )
    completion = client.chat.completions.create(
        model=oai_model,
        messages=[
            {
                "role": "system",
                "content": "You are a sustainability expert that analyzes sustainability reports. You summarize reports. You receive one reason for ingredients and one for images, as well as an average score. You summarize and give one very concise reason that considers both. Not more than 2 lines per product. You give a json with item (product name), score (float), and reason for each product",
            },
            {
                "role": "user",
                "content": reasons_str,
            },
        ],
        response_format={"type": "json_object"},
    )
    print(f"debug reason: {completion.choices[0].message.content}")
    return [
        SustainabilityScore(**item)
        for item in json.loads(completion.choices[0].message.content)["products"]
    ]


def main(products: List[Product]):
    # Analyze ingredients
    ingredient_analysis = analyze_ingredients(products)

    # Analyze images
    print("Analyzing images...")
    image_analysis = analyze_images(products)

    # Combine analyses and summarize reasons
    final_analysis = analyze_reasons(ingredient_analysis, image_analysis)

    # Print results
    result = [f.model_dump() for f in final_analysis]

    print(result)

    # Save results to a JSON file
    with open("results.json", "w") as f:
        data = json.dumps(result, indent=4, ensure_ascii=False)
        f.write(data)

    return result


if __name__ == "__main__":
    products = load_items("items.json")
    main(products)
