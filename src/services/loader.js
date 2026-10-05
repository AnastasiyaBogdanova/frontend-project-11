import axios from 'axios';

const PROXY_URL = 'https://allorigins.hexlet.app/get';

const loadRss = (url) => {
  const proxyUrl = new URL(PROXY_URL);
  proxyUrl.searchParams.set('url', url);
  proxyUrl.searchParams.set('disableCache', 'true');

  return axios.get(proxyUrl.toString()).then((response) => {
    const { data } = response;

    if (typeof data === 'string') {
      return data;
    }

    if (data && typeof data.contents === 'string') {
      return data.contents;
    }

    throw new Error('network');
  });
};

export default loadRss;