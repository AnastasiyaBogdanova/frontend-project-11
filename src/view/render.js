import { subscribe } from 'valtio/vanilla';
import i18next from '../i18n.js';
import {
  state,
  resetValid,
  openPostModal,
  closePostModal,
} from '../model/state.js';

const form = document.querySelector('#rss-form');
const input = document.querySelector('#rss-url');
const feedbackEl = document.querySelector('#rss-feedback');
const submitButton = form.querySelector('button[type="submit"]');
const feedsSection = document.querySelector('#feeds');
const feedsList = document.querySelector('#feeds-list');
const postsSection = document.querySelector('#posts');
const postsList = document.querySelector('#posts-list');

const modal = document.querySelector('#post-modal');
const modalTitle = document.querySelector('#modal-title');
const modalDescription = document.querySelector('#modal-description');
const modalLink = document.querySelector('#modal-link');
const modalCloseButton = document.querySelector('#modal-close');

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
  submitButton.classList.toggle('opacity-50', isLoading);
  submitButton.classList.toggle('cursor-not-allowed', isLoading);
};

const setFeedback = (status, messageCode) => {
  feedbackEl.classList.remove('text-red-600', 'text-green-600');

  if (!messageCode) {
    feedbackEl.textContent = '';
    return;
  }

  feedbackEl.textContent = i18next.t(`messages.${messageCode}`);
  feedbackEl.classList.add(status === 'success' ? 'text-green-600' : 'text-red-600');
};

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

const renderPosts = () => {
  postsList.innerHTML = '';

  state.posts.ids.forEach((id) => {
    const post = state.posts.entities[id];

    const li = document.createElement('li');
    li.className = 'flex items-start gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 shadow-sm';

    const link = document.createElement('a');
    link.href = post.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.dataset.seen = String(post.seen);
    link.className = [
      'flex-1',
      'text-sm',
      'text-sky-600',
      'hover:underline',
      post.seen ? 'font-normal' : 'font-bold',
    ].join(' ');
    link.textContent = post.title;

    const previewButton = document.createElement('button');
    previewButton.type = 'button';
    previewButton.dataset.action = 'preview';
    previewButton.dataset.postId = post.id;
    previewButton.className =
      'shrink-0 rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50';
    previewButton.textContent = i18next.t('posts.preview');

    li.append(link, previewButton);
    postsList.append(li);
  });

  postsSection.classList.toggle('hidden', state.posts.ids.length === 0);
};

const bindPostsEvents = () => {
  postsList.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action="preview"]');
    if (!button) return;
    openPostModal(button.dataset.postId);
  });
};

const subscribeModal = () => {
  subscribe(state.ui, () => {
    const { modalPostId } = state.ui;

    if (modalPostId) {
      const post = state.posts.entities[modalPostId];
      modalTitle.textContent = post.title;
      modalDescription.textContent = post.description;
      modalLink.href = post.link;

      if (!modal.open) {
        modal.showModal();
      }
    } else if (modal.open) {
      modal.close();
    }
  });
};

const bindModalEvents = () => {
  modalCloseButton.addEventListener('click', () => {
    closePostModal();
  });

  modal.addEventListener('close', () => {
    if (state.ui.modalPostId !== null) {
      closePostModal();
    }
  });
};

const subscribeForm = () => {
  subscribe(state.rssForm, () => {
    const { status, messageCode, loading, valid } = state.rssForm;

    setErrorStyle(status === 'error');
    setFeedback(status, messageCode);
    setLoadingStyle(loading);

    if (valid) {
      input.value = '';
      input.focus();
      resetValid();
    }
  });
};

const subscribeFeeds = () => subscribe(state.feeds, renderFeeds);
const subscribePosts = () => subscribe(state.posts, renderPosts);

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
  subscribeModal,
  bindPostsEvents,
  bindModalEvents,
  renderStaticTexts,
};
