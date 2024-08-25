import { useMutation } from '@tanstack/react-query';
import { api } from '.';

export const listApi = {
  async create(email, password) {
    return api({
      method: 'GET',
      url: `/jumbo_carts/shopping_list`,
      data: { email, password },
    }).then((response) => response.data);
  },
}

export function useCreateList(options = {}) {
  return useMutation({
    mutationFn: ({ email, password }) => listApi.create(email, password),
    ...options
  })
}
