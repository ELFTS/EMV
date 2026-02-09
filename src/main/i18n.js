import i18next from 'i18next';
import zhCN from '../i18n/locales/zh-CN.json';
import en from '../i18n/locales/en.json';

const resources = {
  'zh-CN': {
    translation: zhCN,
  },
  en: {
    translation: en,
  },
};

let initialized = false;

export async function initI18n(lng = 'zh-CN') {
  if (initialized) return i18next;

  await i18next.init({
    resources,
    lng,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

  initialized = true;
  return i18next;
}

export function t(key, options) {
  return i18next.t(key, options);
}

export function changeLanguage(lng) {
  return i18next.changeLanguage(lng);
}

export function getCurrentLanguage() {
  return i18next.language;
}
