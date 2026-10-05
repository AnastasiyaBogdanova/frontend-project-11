import './style.css';
import { i18nReady } from './i18n.js';
import { addFeed } from './model/state.js';
import startUpdatesScheduler from './model/updater.js';
import {
  form,
  input,
  subscribeForm,
  subscribeFeeds,
  subscribePosts,
  subscribeModal,
  bindPostsEvents,
  bindModalEvents,
  renderStaticTexts,
} from './view/render.js';

i18nReady.then(() => {
  renderStaticTexts();
  subscribeForm();
  subscribeFeeds();
  subscribePosts();
  subscribeModal();
  bindPostsEvents();
  bindModalEvents();
  input.focus();
  startUpdatesScheduler();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const url = input.value.trim();
  addFeed(url).catch((err) => {
    console.error('Feed load failed:', err.errorCode ?? err.message);
  });
});
