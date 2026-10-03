import './style.css';
import { addFeed } from './model/state.js';
import { form, input } from './view/render.js';

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const url = input.value.trim();

  addFeed(url).catch((err) => {
    // Ошибка уже записана в состояние внутри addFeed,
    // здесь только логируем для отладки.
    console.error('Feed validation failed:', err.error);
  });
});

// Фокус на инпут при загрузке страницы
input.focus();