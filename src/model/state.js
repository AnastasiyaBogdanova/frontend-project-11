import { proxy } from 'valtio/vanilla';
import * as yup from 'yup';

// Схема валидации. Сообщения задаются через yup.setLocale() (см. src/i18n.js),
// поэтому здесь мы их не дублируем.
const feedUrlSchema = yup.string().trim().required().url();

// Реактивное состояние приложения.
// В state хранится КОД ошибки, а не её текст — текст получаем через i18next.
const state = proxy({
  rssForm: {
    url: '',
    errorCode: null,   // 'required' | 'url' | null
    valid: false,
    loading: false,
    feeds: [],
  },
});

// Валидация одной ссылки с учётом дублей.
// resolve -> { valid: true }
// reject  -> { valid: false, errorCode: 'required' | 'url' }
const validateFeedUrl = (url) => {
  const isDuplicate = state.rssForm.feeds.some((feed) => feed.url === url);
  if (isDuplicate) {
    // По ТЗ дубли показывают то же сообщение, что и невалидный URL
    return Promise.reject({ valid: false, errorCode: 'url' });
  }

  return feedUrlSchema
    .validate(url)
    .then(() => ({ valid: true }))
    .catch((err) => {
      // err.type у yup — это 'required' | 'url' | ...
      throw { valid: false, errorCode: err.type };
    });
};

const addFeed = (url) => {
  state.rssForm.url = url;
  state.rssForm.errorCode = null;
  state.rssForm.valid = false;
  state.rssForm.loading = true;

  return validateFeedUrl(url)
    .then(() => {
      state.rssForm.feeds.push({ url });
      state.rssForm.valid = true;
      state.rssForm.errorCode = null;
    })
    .catch((err) => {
      state.rssForm.valid = false;
      state.rssForm.errorCode = err.errorCode;
      throw err;
    })
    .finally(() => {
      state.rssForm.loading = false;
    });
};

// Сброс флага valid после того, как View его обработал.
const resetValid = () => {
  state.rssForm.valid = false;
};

export { state, addFeed, validateFeedUrl, resetValid };
