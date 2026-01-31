import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import bn from './bn.json'
import en from './en.json'
import { DEFAULT_LANGUAGE } from '../utils/constants'

// Get saved language or default to Bangla
const savedLanguage = localStorage.getItem('language') || DEFAULT_LANGUAGE

i18n.use(initReactI18next).init({
  resources: {
    bn: { translation: bn },
    en: { translation: en },
  },
  lng: savedLanguage,
  fallbackLng: 'bn',
  interpolation: {
    escapeValue: false, // React already escapes
  },
})

export default i18n
