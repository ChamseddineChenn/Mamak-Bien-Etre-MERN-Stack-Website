import React, { useState, useRef, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelector = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    {
      code: 'en',
      name: 'EN',
      flag: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 32 32"
          className="flex-shrink-0"
        >
          <rect
            x="1"
            y="4"
            width="30"
            height="24"
            rx="4"
            ry="4"
            fill="#071b65"
          ></rect>
          <path
            d="M5.101,4h-.101c-1.981,0-3.615,1.444-3.933,3.334L26.899,28h.101c1.981,0,3.615-1.444,3.933-3.334L5.101,4Z"
            fill="#fff"
          ></path>
          <path
            d="M22.25,19h-2.5l9.934,7.947c.387-.353,.704-.777,.929-1.257l-8.363-6.691Z"
            fill="#b92932"
          ></path>
          <path
            d="M1.387,6.309l8.363,6.691h2.5L2.316,5.053c-.387,.353-.704,.777-.929,1.257Z"
            fill="#b92932"
          ></path>
          <path
            d="M5,28h.101L30.933,7.334c-.318-1.891-1.952-3.334-3.933-3.334h-.101L1.067,24.666c.318,1.891,1.952,3.334,3.933,3.334Z"
            fill="#fff"
          ></path>
          <rect x="13" y="4" width="6" height="24" fill="#fff"></rect>
          <rect x="1" y="13" width="30" height="6" fill="#fff"></rect>
          <rect x="14" y="4" width="4" height="24" fill="#b92932"></rect>
          <rect
            x="14"
            y="1"
            width="4"
            height="30"
            transform="translate(32) rotate(90)"
            fill="#b92932"
          ></rect>
          <path
            d="M28.222,4.21l-9.222,7.376v1.414h.75l9.943-7.94c-.419-.384-.918-.671-1.471-.85Z"
            fill="#b92932"
          ></path>
          <path
            d="M2.328,26.957c.414,.374,.904,.656,1.447,.832l9.225-7.38v-1.408h-.75L2.328,26.957Z"
            fill="#b92932"
          ></path>
          <path
            d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
            opacity=".15"
          ></path>
          <path
            d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
            fill="#fff"
            opacity=".2"
          ></path>
        </svg>
      ),
      fullName: 'English',
    },
    {
      code: 'fr',
      name: 'FR',
      flag: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 32 32"
          className="flex-shrink-0"
        >
          <path fill="#fff" d="M10 4H22V28H10z"></path>
          <path
            d="M5,4h6V28H5c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z"
            fill="#092050"
          ></path>
          <path
            d="M25,4h6V28h-6c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z"
            transform="rotate(180 26 16)"
            fill="#be2a2c"
          ></path>
          <path
            d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
            opacity=".15"
          ></path>
          <path
            d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
            fill="#fff"
            opacity=".2"
          ></path>
        </svg>
      ),
      fullName: 'Français',
    },
    {
      code: 'de',
      name: 'DE',
      flag: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 32 32"
          className="flex-shrink-0"
        >
          <path fill="#cc2b1d" d="M1 11H31V21H1z"></path>
          <path d="M5,4H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z"></path>
          <path
            d="M5,20H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z"
            transform="rotate(180 16 24)"
            fill="#f8d147"
          ></path>
          <path
            d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
            opacity=".15"
          ></path>
          <path
            d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
            fill="#fff"
            opacity=".2"
          ></path>
        </svg>
      ),
      fullName: 'Deutsch',
    },
  ];

  const currentLang =
    languages.find((lang) => lang.code === currentLanguage) || languages[0];

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Current Language Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 hover:border-[#f2b67b] transition-all duration-300 backdrop-blur-sm"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="flex items-center justify-center">
          {currentLang.flag}
        </span>
        <span className="text-[#3A3A3A] font-medium text-sm">
          {currentLang.name}
        </span>
        <motion.svg
          className="w-3 h-3 text-[#3A3A3A]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-48 bg-[#E6E4D8] backdrop-blur-md border border-[#C4A484] rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {languages.map((language) => (
              <motion.button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-all duration-200 ${
                  currentLanguage === language.code
                    ? 'bg-[#f2b67b]/20 text-[#5c4b42]'
                    : 'text-[#3A3A3A] hover:bg-white/50'
                }`}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center justify-center">
                  {language.flag}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">
                    {language.fullName}
                  </span>
                  <span className="text-xs text-[#3A3A3A]/70">
                    {language.name}
                  </span>
                </div>
                {currentLanguage === language.code && (
                  <motion.svg
                    className="w-4 h-4 ml-auto text-[#f2b67b]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
