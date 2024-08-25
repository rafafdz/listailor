import { useMutation } from '@tanstack/react-query';
import { api } from '.';

export const listApi = {
  async create(username, password, products) {
    return api({
      method: 'POST',
      url: `/jumbo_carts/shopping_list`,
      data: { username, password, products },
    }).then((response) => response.data);
  },
}

export function useCreateList(options = {}) {
  return useMutation({
    mutationFn: ({ username, password, products }) => listApi.create(username, password, products),
    ...options
  })
}
