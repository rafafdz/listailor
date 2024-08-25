import requests
from bs4 import BeautifulSoup
import json


class Scrapper:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:129.0) Gecko/20100101 Firefox/129.0",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "en-US,en;q=0.5",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Site": "cross-site",
            "x-e-commerce": "jumbo",
            "x-consumer": "jumbo",
            "apiKey": "WlVnnB7c1BblmgUPOfg",
            "Priority": "u=4",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
        }

        pass

    def _fetch_page(self, url: str) -> BeautifulSoup:
        """Fetches and parses a single page."""
        try:
            response = requests.get(url)
            response.raise_for_status()
            return BeautifulSoup(response.text, "html.parser")
        except requests.RequestException as e:
            print(f"Request failed for {url}: {e}")
            return None

    def _parse_category_page(self, soup: BeautifulSoup, base_url: str) -> list:
        """Extracts product links from the category page."""
        products = []
        if not soup:
            return products

        shelf_content = soup.find("div", class_="shelf-content")
        if not shelf_content:
            print("No shelf content found.")
            return products

        items = shelf_content.find_all("div", class_="product-card")
        for item in items:
            link_item = item.find("a", class_="product-card-image-link")
            if link_item:
                products.append(base_url + link_item.get("href"))

        return products

    def _get_page_urls(self, category_link: str) -> list:
        """Returns URLs for all pages in a category."""
        base_url = category_link
        page_urls = [base_url]

        soup = self._fetch_page(base_url)
        if not soup:
            return page_urls

        paged_results_container = soup.find("div", class_="slides")
        if paged_results_container:
            pages = paged_results_container.find_all("button", class_="page-number")
            page_numbers = [int(page.text) for page in pages if page.text.isdigit()]

            for page_number in page_numbers[1:]:
                page_url = f"{base_url}?page={page_number}"
                page_urls.append(page_url)

        return page_urls

    def _scrape_product_details(self, url: str):
        """Scrapes a product by its product url and gets its details."""
        base_url = "https://sm-web-api.ecomm.cencosud.com/catalog/api/v1/product/"
        full_url = base_url + url.replace("https://www.jumbo.cl/", "")[:-2]
        print("calling url", full_url)
        params = {"sc": "11"}

        try:
            response = requests.get(full_url, params=params, headers=self.headers)
            response.raise_for_status()
            data = response.json()
            return data
        except requests.RequestException as e:
            print(f"Request failed: {e}")
        except json.JSONDecodeError as e:
            print(f"JSON decode failed: {e}")
        return None

    def scrape_product_pages(self):
        file_name = "product_category_links.txt"
        base_url = "https://www.jumbo.cl"
        out_data = {"categories": {}}

        try:
            with open(file_name) as file:
                links = [line.strip() for line in file]

            for category_link in links:
                formatted_category = category_link.split("/")[-1]
                out_data["categories"][formatted_category] = {"products": []}

                page_urls = self._get_page_urls(category_link)
                for page_url in page_urls:
                    soup = self._fetch_page(page_url)
                    products = self._parse_category_page(soup, base_url)
                    out_data["categories"][formatted_category]["products"].extend(
                        products
                    )

        except FileNotFoundError:
            print("The file 'category_links.txt' was not found.")
        except Exception as e:
            print(f"An unexpected error occurred: {e}")

        try:
            with open("dump.json", "w") as file:
                json.dump(out_data, file, indent=4)
            print(f"Data has been written to {file_name}")
        except IOError as e:
            print(f"Error writing file: {e}")

    def scrape_product_details_from_pages(self):
        outfile = {"categories": {}}

        try:
            with open("dump.json", "r") as file:
                data = json.load(file)
                data = data.get("categories", {})
                keys = list(data.keys())
                for key in keys:
                    products = data.get(key, {}).get("products", [])
                    outfile["categories"][key] = {"products": []}
                    for product in products:
                        try:
                            product_data = self._scrape_product_details(product)
                            if product_data is not None:
                                if (
                                    isinstance(product_data, list)
                                    and len(product_data) > 0
                                ):
                                    product_data[0]["product_link"] = product
                                    outfile["categories"][key]["products"].append(
                                        product_data
                                    )
                                else:
                                    print(
                                        f"Unexpected data format for product: {product}"
                                    )
                            else:
                                print(f"Skipping product: {product}")
                        except (KeyError, TypeError) as e:
                            print(f"Error processing product data: {e}")

        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f"Error reading file: {e}")

        try:
            with open(
                f"product-information/full_dump.json",
                "w",
            ) as file:
                json.dump(outfile, file, indent=4)
        except IOError as e:
            print(f"Error writing file: {e}")


def main():
    scrapper = Scrapper()
    scrapper.scrape_product_pages()
    scrapper.scrape_product_details_from_pages()


if __name__ == "__main__":
    main()
