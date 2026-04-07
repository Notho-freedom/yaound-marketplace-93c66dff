import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations, Language, TranslationKey } from './translations';

type Translations = typeof import('./translations').translations;
type AnyTranslation = Translations[keyof Translations];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: AnyTranslation;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLang] = useState<Language>('fr');
  const setLanguage = useCallback((lang: Language) => setLang(lang), []);
  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
