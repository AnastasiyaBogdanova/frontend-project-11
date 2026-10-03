import './style.css';
import { i18nReady } from './i18n.js';
import { addFeed } from './model/state.js';
import {
  form,
  input,
  subscribeForm,
  subscribeFeeds,
  subscribePosts,
  renderStaticTexts,
} from './view/render.js';

i18nReady.then(() => {
  renderStaticTexts();
  subscribeForm();
  subscribeFeeds();
  subscribePosts();
  input.focus();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const url = input.value.trim();
  addFeed(url).catch((err) => {
    console.error('Feed load failed:', err.errorCode ?? err.message);
  });
});
