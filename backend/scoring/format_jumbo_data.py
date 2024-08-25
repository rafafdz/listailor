import json


def parse_alimentos_data(json_data):
    parsed_data = []
    for product in json_data["categories"]["yoghurt"]["products"]:
        item = product[0]
        parsed_item = {
            "item_id": item["items"][0]["itemId"],
            "name": item["items"][0]["name"],
            "image_url": item["items"][0]["images"][0]["imageUrl"],
            "trazas": item.get("Trazas", ["N/A"])[0],
            "ingredientes": item.get("Ingredientes", ["N/A"])[0],
            "envase": item.get("Envase", ["N/A"])[0],
            "pais_origen": item.get("País de Origen", ["N/A"])[0],
            "precio": item["items"][0]["sellers"][0]["commertialOffer"]["Price"],
        }
        parsed_data.append(parsed_item)
    return parsed_data


# Load the JSON data
with open("dump.json", "r", encoding="utf-8") as file:
    json_data = json.load(file)

# Parse the data
parsed_alimentos = parse_alimentos_data(json_data)

# Print the parsed data
for alimento in parsed_alimentos:
    print(f"Item ID: {alimento['item_id']}")
    print(f"Name: {alimento['name']}")
    print(f"Image URL: {alimento['image_url']}")
    print(f"Trazas: {alimento['trazas']}")
    print(f"Ingredientes: {alimento['ingredientes']}")
    print(f"Envase: {alimento['envase']}")
    print(f"País de Origen: {alimento['pais_origen']}")
    print(f"Precio: {alimento['precio']}")
    print("-" * 50)

# Save the parsed data to a JSON file
with open("items.json", "w", encoding="utf-8") as file:
    json.dump(parsed_alimentos, file, ensure_ascii=False, indent=4)
