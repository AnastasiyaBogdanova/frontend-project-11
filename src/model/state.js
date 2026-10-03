import { proxy } from 'valtio/vanilla';
import * as yup from 'yup';
import loadRss from '../services/loader.js';
import parseRss from '../services/parser.js';

// Схема валидации. Тексты задаются через yup.setLocale() (см. src/i18n.js).
const feedUrlSchema = yup.string().trim().required().url();

// Нормализованное состояние.
const state = proxy({
  feeds: { ids: [], entities: {} },
  posts: { ids: [], entities: {} },
  rssForm: {
    url: '',
    errorCode: null,
    valid: false,
    loading: false,
  },
});

const isDuplicate = (url) =>
  state.feeds.ids.some((id) => state.feeds.entities[id].url === url);

const validateUrl = (url) => {
  if (isDuplicate(url)) {
    return Promise.reject({ errorCode: 'url' });
  }
  return feedUrlSchema.validate(url).catch((err) => {
    throw { errorCode: err.type };
  });
};

// Добавить посты фида. Используется и при первичной загрузке, и при
// фоновом обновлении (см. model/updater.js).
const appendPosts = (feedId, posts) => {
  posts.forEach((post) => {
    const postId = crypto.randomUUID();
    state.posts.entities[postId] = {
      id: postId,
      feedId,
      title: post.title,
      link: post.link,
    };
    state.posts.ids.push(postId);
  });
};

const appendFeed = (url, parsed) => {
  const feedId = crypto.randomUUID();

  state.feeds.entities[feedId] = {
    id: feedId,
    url,
    title: parsed.title,
    description: parsed.description,
  };
  state.feeds.ids.unshift(feedId);

  appendPosts(feedId, parsed.posts);
};

// Пайплайн: валидация -> загрузка -> парсинг -> добавление.
const addFeed = (url) => {
  state.rssForm.url = url;
  state.rssForm.errorCode = null;
  state.rssForm.valid = false;
  state.rssForm.loading = true;

  return validateUrl(url)
    .then(() => loadRss(url))
    .then((xmlString) => parseRss(xmlString))
    .then((parsed) => {
      appendFeed(url, parsed);
      state.rssForm.valid = true;
    })
    .catch((err) => {
      const errorCode = err.errorCode
        ?? (err.message === 'notRss' ? 'notRss' : 'network');
      state.rssForm.errorCode = errorCode;
      throw err;
    })
    .finally(() => {
      state.rssForm.loading = false;
    });
};

const resetValid = () => {
  state.rssForm.valid = false;
};

export { state, addFeed, appendPosts, resetValid };
