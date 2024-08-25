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
  {
    "id": 4,
    "label": "Yogurt proteina soprole con Garnola berries 125G",
    "imageUrl": "https://jumbo.vtexassets.com/arquivos/ids/939952-180-180?width=900width=180&height=180height=900&aspect=true",
    "score": 5.0,
    "price": 799,
    "category": "Yogurts",
    "reason": "La razon es que esta wea contamina caleta papito"
  },
  {
    "id": 5,
    "imageUrl": "https://jumbo.vtexassets.com/arquivos/ids/828019-180-180?width=900width=180&height=180height=900&aspect=true",
    "label": "Yogurt Loncoleche Protein Natural Endulzado 140 g",
    "score": 2.3,
    "price": 799,
    "category": "Yogurts",
    "reason": "La razon es que esta wea contamina caleta papito"
  },
  {
    "id": 6,
    "imageUrl": "https://jumbo.vtexassets.com/arquivos/ids/873098-650-650?width=650&height=650&aspect=true",
    "label": "Toalla de Baño 70 x 140 cm 550gsm Blanca",
    "score": 5.3,
    "price": 799,
    "category": "Yogurts",
    "reason": "La razon es que esta wea contamina caleta papito"
  }
]

export const searchApi = {
  // async get(q) {
  //   return api({
  //     method: 'GET',
  //     url: `/api/search`,
  //     data: { q },
  //   }).then((response) => response.data);
  // },
  async get(q) {
    console.log(q);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mock);
      }, 500); // 2 seconds delay
    });
  },
}


export function useSearchQuery(q, options = {}) {
  return useQuery({
    queryKey: ['search', q],
    queryFn: () => searchApi.get(q),
    ...options,
  });
}
