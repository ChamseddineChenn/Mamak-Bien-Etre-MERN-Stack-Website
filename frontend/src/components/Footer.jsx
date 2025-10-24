import { assets } from '../assets/assets';
import React from 'react';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-[#E6E4D8] text-[#3A3A3A]">
      <div className="flex flex-col justify-between sm:grid grid-cols-[3fr_1fr] gap-25 pt-2 pb-5 ml-5 md:ml-40 text-sm">
        <div>
          <img className="mb-5 w-36" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3">{t('footer_description')}</p>
        </div>
        <div>
          <div className="pb-3">
            <p className="text-xl font-medium mb-5 text-[#5c4b42]">
              {t('get_in_touch')}
            </p>
            <ul className="flex flex-col gap-3">
              <li>
                <motion.a
                  href="tel:+21653527102"
                  className="flex items-center gap-2 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <span className="w-2 h-2 bg-[#C4A484] rounded-full group-hover:bg-[#5c4b42] transition-colors"></span>
                  <span className="text-[#3A3A3A] group-hover:text-[#5c4b42] transition-colors underline decoration-transparent group-hover:decoration-[#C4A484]">
                    +216 53 527 102
                  </span>
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="mailto:contact@mamakbienetre.com"
                  className="flex items-center gap-2 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <span className="w-2 h-2 bg-[#C4A484] rounded-full group-hover:bg-[#5c4b42] transition-colors"></span>
                  <span className="text-[#3A3A3A] group-hover:text-[#5c4b42] transition-colors underline decoration-transparent group-hover:decoration-[#C4A484]">
                    contact@mamakbienetre.com
                  </span>
                </motion.a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xl font-medium mb-5 text-[#5c4b42]">
              {t('our_social_media')}
            </p>
            <ul className="flex gap-3">
              <li>
                <motion.a
                  href="https://www.facebook.com/profile.php?id=61559341236094"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <img
                    className="w-10"
                    src={assets.fb_icon}
                    alt="Visit our Facebook page"
                  />
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="https://www.instagram.com/mamak.bienetre/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <img
                    className="w-10"
                    src={assets.ig_icon}
                    alt="Visit our Instagram page"
                  />
                </motion.a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-[#5c4b42]/20">
        <p className="py-3 text-sm text-center">
          © 2025 Mamak Bien-Être. {t('all_rights_reserved')}
        </p>
      </div>
    </div>
  );
};

export default Footer;
