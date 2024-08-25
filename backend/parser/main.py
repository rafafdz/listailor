import os
import json


def find_dump_files(directory: str) -> list:
    """Finds all files in the specified directory that start with 'dump_' and end with '.json'."""
    return sorted(
        [
            f
            for f in os.listdir(directory)
            if f.startswith("dump_") and f.endswith(".json")
        ]
    )


def compile_dump_files(directory: str):
    """Processes all dump files in sequence."""
    dump_files = find_dump_files(directory)

    out_data = {"categories": {}}
    file_name = "product_list.json"
    with open(file_name, "w") as outfile:

        for file_name in dump_files:
            file_path = os.path.join(directory, file_name)
            try:
                with open(file_path, "r") as file:
                    data = json.load(file)

                    keys = list(data["categories"].keys())
                    for key in keys:
                        out_data["categories"][key] = data["categories"][key]

                    print(f"Successfully processed {file_name}")
            except json.JSONDecodeError as e:
                print(f"Failed to decode JSON from {file_name}: {e}")
            except Exception as e:
                print(f"An error occurred while processing {file_name}: {e}")

        json.dump(out_data, outfile, indent=4)


def parse_products():
    out_data = {}
    with open("product_list.json") as file:
        data = json.load(file)

        categories = data["categories"]
        for category in categories:
            out_data[category] = []
            products = data["categories"][category]["products"]
            for product in products:
                if len(product) > 0:
                    current_product = product[0]
                    item = current_product["items"][0]
                    current_seller = item["sellers"][0]

                    item_id = item["itemId"]
                    product_name = item["name"]
                    product_image_url = item["images"][0]["imageUrl"]
                    product_traces = ""
                    product_ingredients = ""
                    product_packaging = ""
                    product_price = ""

                    product_attributes = list(current_product.keys())

                    traces_key = "Trazas"
                    if traces_key in product_attributes:
                        product_traces = ", ".join(current_product[traces_key])

                    ingredients_key = "Ingredientes"
                    if ingredients_key in product_attributes:
                        product_ingredients = ", ".join(
                            current_product[ingredients_key]
                        )

                    packaging_key = "Envase"
                    if packaging_key in product_attributes:
                        product_packaging = ", ".join(current_product[packaging_key])

                    seller_attributes = list(current_seller.keys())
                    commercial_offer_key = "commertialOffer"
                    price_key = "Price"
                    if commercial_offer_key in seller_attributes:
                        product_price = current_seller[commercial_offer_key][price_key]

                    product_link = current_product["product_link"]

                    out_data[category].append(
                        {
                            # "category": category,
                            "item_id": item_id,
                            "name": product_name,
                            "image_url": product_image_url,
                            "traces": product_traces,
                            "ingredients": product_ingredients,
                            "url": product_link,
                            "price": product_price,
                            "packaging": product_packaging,
                        }
                    )

    with open("formatted.json", "w") as outfile:
        json.dump(out_data, outfile, indent=4)


if __name__ == "__main__":
    directory = "."
    parse_products()
