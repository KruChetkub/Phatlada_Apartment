import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Language,
  LanguageOption,
  LandingTranslations,
  LANGUAGE_OPTIONS,
  landingTranslations,
} from '../locales/landing';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: LandingTranslations;
  availableLanguages: LanguageOption[];
}

const STORAGE_KEY = 'phatlada_language_preference';
const VALID_LANGUAGES: Language[] = ['th', 'en', 'lo'];

const isValidLanguage = (val: unknown): val is Language => {
  return typeof val === 'string' && VALID_LANGUAGES.includes(val as Language);
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (isValidLanguage(saved)) {
        return saved;
      }
    } catch {
      // LocalStorage access restricted (private browsing / security sandbox)
    }
    return 'th';
  });

  const setLanguage = (lang: Language) => {
    if (isValidLanguage(lang)) {
      setLanguageState(lang);
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // Fallback gracefully
      }
      // Update HTML lang attribute for accessibility & SEO
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: landingTranslations[language] || landingTranslations.th,
    availableLanguages: LANGUAGE_OPTIONS,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
