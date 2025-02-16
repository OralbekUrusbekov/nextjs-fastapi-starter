'use client';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { getLanguage } from '@/action/set-cookie';

export type Language = 'kz' | 'ru' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>('kz');

  const getLang = async () => {
    setLang(await getLanguage());
  };

  useEffect(() => {
    getLang();
  }, []);

  const handleSetLang = (newLang: string) => {
    if (['kz', 'ru', 'en'].includes(newLang)) {
      setLang(newLang as Language);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
