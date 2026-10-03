import './style.css';
import { i18nReady } from './i18n.js';
import { addFeed } from './model/state.js';
import { form, input, subscribeForm, renderStaticTexts } from './view/render.js';

// Дожидаемся инициализации i18next, затем:
// 1) переводим статичные тексты,
// 2) подписываемся на состояние,
// 3) ставим фокус на инпут.
i18nReady.then(() => {
  renderStaticTexts();
  subscribeForm();
  input.focus();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const url = input.value.trim();
  addFeed(url).catch((err) => {
    // В состоянии уже лежит errorCode, здесь только логируем.
    console.error('Feed validation failed:', err.errorCode);
  });
});
