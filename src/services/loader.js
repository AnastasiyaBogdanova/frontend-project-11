import axios from 'axios';

const PROXY_URL = 'https://allorigins.hexlet.app/raw';

const loadRss = (url) => {
  const proxyUrl = `${PROXY_URL}?url=${encodeURIComponent(url)}&disableCache=true`;

  return axios
    .get(proxyUrl)
    .then((response) => response.data);
};

export default loadRss;
