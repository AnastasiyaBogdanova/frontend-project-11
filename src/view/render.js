import { subscribe } from 'valtio/vanilla';
import i18next from '../i18n.js';
import { state, resetValid } from '../model/state.js';

const form = document.querySelector('#rss-form');
const input = document.querySelector('#rss-url');
const errorEl = document.querySelector('#rss-error');
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

const setErrorText = (errorCode) => {
  errorEl.textContent = errorCode ? i18next.t(`errors.${errorCode}`) : '';
};

// Подписка на изменения rssForm.
const subscribeForm = () => {
  subscribe(state.rssForm, () => {
    const { errorCode, loading, valid } = state.rssForm;

    setErrorStyle(Boolean(errorCode));
    setErrorText(errorCode);
    setLoadingStyle(loading);

    if (valid) {
      input.value = '';
      input.focus();
      resetValid();
    }
  });
};

// Рендер статичных текстов интерфейса из i18next.
const renderStaticTexts = () => {
  document.title = i18next.t('app.title');

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = i18next.t(el.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.setAttribute('placeholder', i18next.t(el.dataset.i18nPlaceholder));
  });
};

export { form, input, subscribeForm, renderStaticTexts };
