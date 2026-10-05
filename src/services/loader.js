import axios from 'axios';

const PROXY_URL = 'https://allorigins.hexlet.app/get';

const loadRss = (url) => {
  const proxyUrl = new URL(PROXY_URL);
  proxyUrl.searchParams.set('url', url);
  proxyUrl.searchParams.set('disableCache', 'true');

  return axios
    .get(proxyUrl.toString())
    .then((response) => response.data.contents);
};

export default loadRss;
