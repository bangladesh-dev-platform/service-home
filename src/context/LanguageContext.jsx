import { createContext, useContext, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { LANGUAGES, DEFAULT_LANGUAGE } from '../utils/constants'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation()
  const [currentLang, setCurrentLang] = useState(
    localStorage.getItem('language') || DEFAULT_LANGUAGE
  )

  const changeLanguage = useCallback((langCode) => {
    if (LANGUAGES[langCode]) {
      i18n.changeLanguage(langCode)
      localStorage.setItem('language', langCode)
      setCurrentLang(langCode)
    }
  }, [i18n])

  const toggleLanguage = useCallback(() => {
    const newLang = currentLang === 'bn' ? 'en' : 'bn'
    changeLanguage(newLang)
  }, [currentLang, changeLanguage])

  const value = {
    currentLang,
    languages: LANGUAGES,
    changeLanguage,
    toggleLanguage,
    isBangla: currentLang === 'bn',
    isEnglish: currentLang === 'en',
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export default LanguageContext
