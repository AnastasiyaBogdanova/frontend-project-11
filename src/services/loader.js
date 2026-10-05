import axios from 'axios';

const PROXY_URL = 'https://allorigins.hexlet.app/get';

const loadRss = (url) => {
  const proxyUrl = `${PROXY_URL}?disableCache=true&url=${encodeURIComponent(url)}`;

  return axios
    .get(proxyUrl)
    .then((response) => response.data.contents);
};

export default loadRss;
