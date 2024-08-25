import { useQuery } from '@tanstack/react-query'
import { api } from '.';

export const searchApi = {
  async get(q, n) {
    return api({
      method: 'GET',
      url: `/items`,
      params: { q, n },
    }).then((response) => response.data).catch(err => console.error(err))
  },
}


export function useSearchQuery(q, n, options = {}) {
  return useQuery({
    queryKey: ['search', q, n],
    queryFn: () => searchApi.get(q, n),
    enabled: Boolean(q),
    ...options,
  });
}
