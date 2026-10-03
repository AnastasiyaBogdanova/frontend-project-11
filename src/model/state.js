import { proxy } from 'valtio/vanilla';
import * as yup from 'yup';

// Схема валидации через yup.
// Тексты ошибок строго совпадают с требованиями:
// — пустое поле: "Не должно быть пустым"
// — невалидный URL: "Ссылка должна быть валидным URL"
const feedUrlSchema = yup
  .string()
  .trim()
  .required('Не должно быть пустым')
  .url('Ссылка должна быть валидным URL');

// Реактивное состояние приложения.
const state = proxy({
  rssForm: {
    url: '',
    error: null,       // строка с текстом ошибки или null
    valid: false,      // прошла ли последняя валидация
    loading: false,    // идёт ли валидация/отправка (для блокировки кнопки)
    feeds: [],         // список добавленных фидов (для проверки дублей)
  },
});

// Валидация одной ссылки с учётом дублей.
// resolve -> { valid: true }
// reject  -> { valid: false, error: 'текст' }
const validateFeedUrl = (url) => {
  const isDuplicate = state.rssForm.feeds.some((feed) => feed.url === url);
  if (isDuplicate) {
    return Promise.reject({
      valid: false,
      error: 'Ссылка должна быть валидным URL',
    });
  }

  // Асинхронная валидация yup (работает на промисах)
  return feedUrlSchema
    .validate(url)
    .then(() => ({ valid: true }))
    .catch((err) => {
      throw { valid: false, error: err.errors[0] };
    });
};

// Функция добавления потока. Пока только валидирует и сохраняет.
// Сетевой запрос добавим на следующем шаге (Ajax).
const addFeed = (url) => {
  state.rssForm.url = url;
  state.rssForm.error = null;
  state.rssForm.valid = false;
  state.rssForm.loading = true;

  return validateFeedUrl(url)
    .then(() => {
      state.rssForm.feeds.push({ url });
      state.rssForm.valid = true;
      state.rssForm.error = null;
    })
    .catch((err) => {
      state.rssForm.valid = false;
      state.rssForm.error = err.error;
      throw err;
    })
    .finally(() => {
      state.rssForm.loading = false;
    });
};

// Сброс флага valid после того, как View его обработал.
// Это предотвращает повторную очистку инпута при последующих мутациях.
const resetValid = () => {
  state.rssForm.valid = false;
};

export { state, addFeed, validateFeedUrl, resetValid };