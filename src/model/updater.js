import loadRss from '../services/loader.js';
import parseRss from '../services/parser.js';
import { state, appendPosts } from './state.js';

// Пауза между итерациями опроса (в миллисекундах).
const UPDATE_INTERVAL = 5000;

const hasPost = (feedId, link) =>
  Object.values(state.posts.entities).some(
    (post) => post.feedId === feedId && post.link === link,
  );

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
      console.warn('Background update failed for', feed.url, err);
    });

const updateAllFeeds = () => {
  const feedIds = [...state.feeds.ids];
  const tasks = feedIds.map((id) => updateFeed(state.feeds.entities[id]));
  return Promise.allSettled(tasks);
};

const startUpdatesScheduler = () => {
  const schedule = () => {
    updateAllFeeds().finally(() => {
      setTimeout(schedule, UPDATE_INTERVAL);
    });
  };
  setTimeout(schedule, UPDATE_INTERVAL);
};

export default startUpdatesScheduler;
