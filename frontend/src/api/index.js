import axios from 'axios';
import humps from 'humps';
import { merge } from 'lodash';

const api = axios.create({
  baseURL: 'https://api.listail.org',
});

api.interceptors.request.use((config) => {
  const { decamelizeKeys = true } = config;
  const newConfig = { ...config };

  newConfig.params = humps.decamelizeKeys(merge(
    config.params,
  ));

  if (config.data && decamelizeKeys) newConfig.data = humps.decamelizeKeys(config.data);

  return newConfig;
});

api.interceptors.response.use(
  (response) => {
    if (response.data && response.headers['content-type'].match('application/json')) {
      response.data = humps.camelizeKeys(response.data);
    }

    return response;
  },
  (error) => {
    console.debug(JSON.stringify(error));

    return Promise.reject(error);
  },
);

export { api };
