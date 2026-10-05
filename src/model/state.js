import { proxy } from 'valtio/vanilla';
import * as yup from 'yup';
import loadRss from '../services/loader.js';
import parseRss from '../services/parser.js';

const feedUrlSchema = yup.string().trim().required().url();

const state = proxy({
  feeds: { ids: [], entities: {} },
  posts: { ids: [], entities: {} },
  ui: {
    modalPostId: null,   // id поста, открытого в модалке, или null
  },
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

// Добавить посты фида. Новые посты всегда seen: false.
const appendPosts = (feedId, posts) => {
  posts.forEach((post) => {
    const postId = crypto.randomUUID();
    state.posts.entities[postId] = {
      id: postId,
      feedId,
      title: post.title,
      link: post.link,
      description: post.description,
      seen: false,
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

// Помечаем пост прочитанным и открываем модалку.
// Мутируем ИМЕННО entity из state — так Valtio увидит изменение.
const openPostModal = (postId) => {
  state.posts.entities[postId].seen = true;
  state.ui.modalPostId = postId;
};

// Закрываем модалку — состояние очищается, View реагирует.
const closePostModal = () => {
  state.ui.modalPostId = null;
};

export {
  state,
  addFeed,
  appendPosts,
  resetValid,
  openPostModal,
  closePostModal,
};
