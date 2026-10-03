import { subscribe } from 'valtio/vanilla';
import i18next from '../i18n.js';
import { state, resetValid } from '../model/state.js';

const form = document.querySelector('#rss-form');
const input = document.querySelector('#rss-url');
const errorEl = document.querySelector('#rss-error');
const submitButton = form.querySelector('button[type="submit"]');
const feedsSection = document.querySelector('#feeds');
const feedsList = document.querySelector('#feeds-list');
const postsSection = document.querySelector('#posts');
const postsList = document.querySelector('#posts-list');

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

// --- Рендер фидов ---
const renderFeeds = () => {
  feedsList.innerHTML = '';

  state.feeds.ids.forEach((id) => {
    const feed = state.feeds.entities[id];

    const li = document.createElement('li');
    li.className = 'rounded-md border border-slate-200 bg-white p-4 shadow-sm';

    const title = document.createElement('h3');
    title.className = 'text-base font-semibold text-slate-900';
    title.textContent = feed.title;

    const description = document.createElement('p');
    description.className = 'mt-1 text-sm text-slate-600';
    description.textContent = feed.description;

    li.append(title, description);
    feedsList.append(li);
  });

  feedsSection.classList.toggle('hidden', state.feeds.ids.length === 0);
};

// --- Рендер постов ---
const renderPosts = () => {
  postsList.innerHTML = '';

  state.posts.ids.forEach((id) => {
    const post = state.posts.entities[id];

    const li = document.createElement('li');
    li.className = 'rounded-md border border-slate-200 bg-white px-4 py-2 shadow-sm';

    const a = document.createElement('a');
    a.href = post.link;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'text-sky-600 hover:underline';
    a.textContent = post.title;

    li.append(a);
    postsList.append(li);
  });

  postsSection.classList.toggle('hidden', state.posts.ids.length === 0);
};

// Подписка на rssForm: ошибки, loading, очистка.
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

// Подписки на данные: перерисовываем списки при любом изменении.
const subscribeFeeds = () => subscribe(state.feeds, renderFeeds);
const subscribePosts = () => subscribe(state.posts, renderPosts);

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

export {
  form,
  input,
  subscribeForm,
  subscribeFeeds,
  subscribePosts,
  renderStaticTexts,
};
