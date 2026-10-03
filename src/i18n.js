import i18next from 'i18next';
import * as yup from 'yup';
import ru from './locales/ru.js';

// Инициализируем i18next. Ресурсы переданы inline, поэтому init
// разрешается практически мгновенно.
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
    // Связываем yup с i18next: все сообщения валидации
    // теперь приходят из ресурсных файлов.
    yup.setLocale({
      mixed: {
        required: i18next.t('errors.required'),
      },
      string: {
        url: i18next.t('errors.url'),
      },
    });
  });

export { i18nReady };
export default i18next;
