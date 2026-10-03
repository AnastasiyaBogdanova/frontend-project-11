import loadRss from '../services/loader.js';
import parseRss from '../services/parser.js';
import { state, appendPosts } from './state.js';

// Пауза между итерациями опроса (в миллисекундах).
const UPDATE_INTERVAL = 5000;

// Есть ли уже пост с таким link в этом фиде.
// Сравнение по (feedId, link) — один и тот же URL может быть в разных фидах.
const hasPost = (feedId, link) =>
  Object.values(state.posts.entities).some(
    (post) => post.feedId === feedId && post.link === link,
  );

// Обновить один фид: загрузить, распарсить, добавить только новые посты.
// Ошибки фонового обновления НЕ показываем пользователю —
// они могут быть временными и не связаны с его действиями.
const updateFeed = (feed) =>
  loadRss(feed.url)
    .then((xmlString) => parseRss(xmlString))
    .then((parsed) => {
      const newPosts = parsed.posts.filter(
        (post) => !hasPost(feed.id, post.link),
      );
      if (newPosts.length > 0) {
        appendPosts(feed.id, newPosts);
      }
    })
    .catch((err) => {
      // Тихо логируем, чтобы не сбивать пользователя.
      console.warn('Background update failed for', feed.url, err);
    });

// Обновить все фиды параллельно. Promise.allSettled — чтобы падение
// одного фида не отменяло остальные.
const updateAllFeeds = () => {
  const feedIds = [...state.feeds.ids];
  const tasks = feedIds.map((id) => updateFeed(state.feeds.entities[id]));
  return Promise.allSettled(tasks);
};

// Цепочка setTimeout: следующая итерация планируется ТОЛЬКО после
// завершения текущей. Это защищает от накопления параллельных запросов
// при медленной или недоступной сети.
const startUpdatesScheduler = () => {
  const schedule = () => {
    updateAllFeeds().finally(() => {
      setTimeout(schedule, UPDATE_INTERVAL);
    });
  };
  setTimeout(schedule, UPDATE_INTERVAL);
};

export default startUpdatesScheduler;
