import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonIT from './locales/it/common.json';
import homeIT from './locales/it/home.json';
import chiSonoIT from './locales/it/chiSono.json';
import serviziIT from './locales/it/servizi.json';

import commonEN from './locales/en/common.json';
import homeEN from './locales/en/home.json';
import chiSonoEN from './locales/en/chiSono.json';
import serviziEN from './locales/en/servizi.json';

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('fz-lang') || 'it' : 'it';

i18n.use(initReactI18next).init({
  resources: {
    it: { common: commonIT, home: homeIT, chiSono: chiSonoIT, servizi: serviziIT },
    en: { common: commonEN, home: homeEN, chiSono: chiSonoEN, servizi: serviziEN },
  },
  lng: savedLang,
  fallbackLng: 'it',
  defaultNS: 'common',
  interpolation: { escapeValue: false },
});

if (typeof document !== 'undefined') {
  document.documentElement.lang = savedLang;
}

export default i18n;
