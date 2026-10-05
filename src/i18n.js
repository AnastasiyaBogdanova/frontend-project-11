import i18next from 'i18next';
import * as yup from 'yup';
import ru from './locales/ru.js';

const i18nReady = i18next
  .init({
    lng: 'ru',
    fallbackLng: 'ru',
    debug: false,
    resources: { ru },
    interpolation: {
      escapeValue: false,
    },
  })
  .then(() => {
    yup.setLocale({
      mixed: { required: i18next.t('messages.required') },
      string: { url: i18next.t('messages.url') },
    });
  });

export { i18nReady };
export default i18next;
