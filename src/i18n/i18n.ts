import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import twi from './twi.json';
import ewe from './ewe.json';
import ga from './ga.json';

const resources = {
  en: { translation: en },
  twi: { translation: twi },
  ewe: { translation: ewe },
  ga: { translation: ga }
};

// Simple manual detection to avoid external dependency
const getInitialLanguage = () => {
  const saved = localStorage.getItem('room1221_language');
  if (saved) return saved;
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
