import { useQuery } from '@tanstack/react-query'

const mock = [
  {
    "id": 1,
    "label": "Yogurt de frutilla colun 125G",
    "imageUrl": "https://jumbo.vtexassets.com/arquivos/ids/466501-180-180?width=900&height=900&aspect=true",
    "score": 5.0,
    "price": 2333,
    "category": "Yogurts",
    "reason": "La razon es que esta wea contamina caleta papito"
  },
  {
    "id": 2,
    "label": "Yogurt de vainilla colun 125G",
    "imageUrl": "https://jumbo.vtexassets.com/arquivos/ids/466501-180-180?width=900width=180&height=180height=900&aspect=true",
    "score": 5.0,
    "price": 2333,
    "category": "Yogurts",
    "reason": "La razon es que esta wea contamina caleta papito"
  },
  {
    "id": 3,
    "label": "Yogurt de vainilla colun 125G",
    "imageUrl": "https://jumbo.vtexassets.com/arquivos/ids/466501-180-180?width=900width=180&height=180height=900&aspect=true",
    "score": 5.0,
    "price": 2333,
    "category": "Yogurts",
    "reason": "La razon es que esta wea contamina caleta papito"
  },
]

export const productSuggestionApi = {
  async get(id) {
    return api({
      method: 'GET',
      url: `/api/products/${id}/suggestions`,
    }).then((response) => response.data);
  },
  async get(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mock);
      }, 500); // 2 seconds delay
    });
  },
}


export function useProductSuggestionsQuery(id, options = {}) {
  return useQuery({
    queryKey: ['suggestions', id],
    queryFn: () => productSuggestionApi.get(id),
    ...options,
  });
}
