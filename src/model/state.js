import { proxy } from 'valtio/vanilla';
import * as yup from 'yup';
import loadRss from '../services/loader.js';
import parseRss from '../services/parser.js';

const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const feedUrlSchema = yup.string().trim().required().url();

const state = proxy({
  feeds: { ids: [], entities: {} },
  posts: { ids: [], entities: {} },
  ui: {
    modalPostId: null,
  },
  rssForm: {
    url: '',
    status: null,
    messageCode: null,
    valid: false,
    loading: false,
  },
});

const isDuplicate = (url) =>
  state.feeds.ids.some((id) => state.feeds.entities[id].url === url);

const validateUrl = (url) => {
  if (isDuplicate(url)) {
    return Promise.reject({ messageCode: 'duplicate' });
  }
  return feedUrlSchema.validate(url).catch((err) => {
    throw { messageCode: err.type };
  });
};

const appendPosts = (feedId, posts) => {
  posts.forEach((post) => {
    const postId = generateId();
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
  const feedId = generateId();
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
  state.rssForm.status = null;
  state.rssForm.messageCode = null;
  state.rssForm.valid = false;
  state.rssForm.loading = true;

  return validateUrl(url)
    .then(() => loadRss(url))
    .then((xmlString) => parseRss(xmlString))
    .then((parsed) => {
      appendFeed(url, parsed);
      state.rssForm.status = 'success';
      state.rssForm.messageCode = 'success';
      state.rssForm.valid = true;
    })
    .catch((err) => {
      const messageCode = err.messageCode
        ?? (err.message === 'notRss' ? 'notRss' : 'network');
      state.rssForm.status = 'error';
      state.rssForm.messageCode = messageCode;
      throw err;
    })
    .finally(() => {
      state.rssForm.loading = false;
    });
};

const resetValid = () => {
  state.rssForm.valid = false;
};

const openPostModal = (postId) => {
  state.posts.entities[postId].seen = true;
  state.ui.modalPostId = postId;
};

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