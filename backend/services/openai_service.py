from openai import OpenAI
from settings import settings


class OpenAIService:
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)

    def get_embeddings_from_text(self, text: str) -> list[float]:
        response = self.client.embeddings.create(
            input=text, model="text-embedding-3-small"
        )
        return response.data[0].embedding

    def waste_gpt_credits(self):
        while True:
            response = self.client.images.generate(
                model="dall-e-3",
                prompt="Listailor logo. Listailor is a mobile App that lets you make your grocery list shopping cart, using Artificial Intelligence to assess eco-friendly alternatives. Minimalistic, clean text style. Relevant Emojis",
                n=1,
                size="1024x1024",
            )
            print(response)
