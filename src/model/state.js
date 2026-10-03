import { proxy } from 'valtio/vanilla';
import * as yup from 'yup';
import loadRss from '../services/loader.js';
import parseRss from '../services/parser.js';

// Схема валидации. Тексты задаются через yup.setLocale() (см. src/i18n.js).
const feedUrlSchema = yup.string().trim().required().url();

// Нормализованное состояние:
// feeds.ids — порядок, feeds.entities — данные по id
// posts.ids — порядок, posts.entities — данные по id
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

// Проверка дублей по URL среди уже добавленных фидов.
const isDuplicate = (url) =>
  state.feeds.ids.some((id) => state.feeds.entities[id].url === url);

// Валидация URL: resolve -> undefined, reject -> { errorCode }
const validateUrl = (url) => {
  if (isDuplicate(url)) {
    return Promise.reject({ errorCode: 'url' });
  }
  return feedUrlSchema.validate(url).catch((err) => {
    throw { errorCode: err.type }; // 'required' | 'url'
  });
};

// Добавляем фид и его посты в состояние.
const appendFeed = (url, parsed) => {
  const feedId = crypto.randomUUID();

  state.feeds.entities[feedId] = {
    id: feedId,
    url,
    title: parsed.title,
    description: parsed.description,
  };
  state.feeds.ids.unshift(feedId);

  parsed.posts.forEach((post) => {
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

// Пайплайн: валидация -> загрузка -> парсинг -> добавление.
// Всё на промисах, без async/await.
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
      // Приоритет: код от валидатора, иначе — от парсинга, иначе — сеть.
      const errorCode = err.errorCode
        ?? (err.message === 'notRss' ? 'notRss' : 'network');
      state.rssForm.errorCode = errorCode;
      throw err;
    })
    .finally(() => {
      state.rssForm.loading = false;
    });
};

// Сброс флага valid после того, как View его обработал.
const resetValid = () => {
  state.rssForm.valid = false;
};

export { state, addFeed, resetValid };
