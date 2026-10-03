import { subscribe } from 'valtio/vanilla';
import { state, resetValid } from '../model/state.js';

// Ссылки на DOM-элементы
const form = document.querySelector('#rss-form');
const input = document.querySelector('#rss-url');
const submitButton = form.querySelector('button[type="submit"]');

const setErrorStyle = (hasError) => {
  if (hasError) {
    input.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
    input.classList.remove('border-slate-300', 'focus:border-sky-500', 'focus:ring-sky-500');
  } else {
    input.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
    input.classList.add('border-slate-300', 'focus:border-sky-500', 'focus:ring-sky-500');
  }
};

const setLoadingStyle = (isLoading) => {
  submitButton.disabled = isLoading;
  if (isLoading) {
    submitButton.classList.add('opacity-50', 'cursor-not-allowed');
  } else {
    submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
  }
};

// Подписка на изменения rssForm.
// Valtio сам вызывает коллбэк при любых мутациях состояния.
subscribe(state.rssForm, () => {
  setErrorStyle(Boolean(state.rssForm.error));
  setLoadingStyle(state.rssForm.loading);

  // Очистка инпута и фокус после успешного добавления
  if (state.rssForm.valid) {
    input.value = '';
    input.focus();
    // Сбрасываем флаг, чтобы очистка не сработала повторно
    // при следующей мутации состояния.
    resetValid();
  }
});

export { form, input };