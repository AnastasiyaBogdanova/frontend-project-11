import axios from 'axios';

const PROXY_URL = 'https://allorigins.hexlet.app/get';

const loadRss = (url) => {
  const proxyUrl = new URL(PROXY_URL);
  proxyUrl.searchParams.set('url', url);
  proxyUrl.searchParams.set('disableCache', 'true');

  return axios.get(proxyUrl.toString())
    .then((response) => {
      if (!response.data || typeof response.data.contents !== 'string') {
        throw new Error('network');
      }
      return response.data.contents;
    })
    .catch((error) => {
      console.error('Ошибка при загрузке RSS:', error.message);
      throw new Error('network');
    });
};

export default loadRss;