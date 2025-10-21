import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const useLanguage = () => {
  return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize language on mount - wait for i18n to be ready
    const initializeLanguage = () => {
      // Check if i18n is ready and has a language set
      if (i18n.isInitialized) {
        const detectedLanguage =
          i18n.language ||
          localStorage.getItem('preferredLanguage') ||
          navigator.language?.split('-')[0] ||
          'en';

        // Ensure the detected language is supported
        const supportedLanguages = ['en', 'fr', 'de'];
        const finalLanguage = supportedLanguages.includes(detectedLanguage)
          ? detectedLanguage
          : 'en';

        // Only change if different from current
        if (finalLanguage !== i18n.language) {
          i18n.changeLanguage(finalLanguage);
        }

        setCurrentLanguage(finalLanguage);
        setIsInitialized(true);
      } else {
        // If i18n isn't ready, try again shortly
        setTimeout(initializeLanguage, 100);
      }
    };

    initializeLanguage();
  }, [i18n]);

  // Listen for language changes from i18n
  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      setCurrentLanguage(lng);
      localStorage.setItem('preferredLanguage', lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // No need to setCurrentLanguage here as it will be handled by the event listener
  };

  const value = {
    currentLanguage,
    changeLanguage,
    isInitialized,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
