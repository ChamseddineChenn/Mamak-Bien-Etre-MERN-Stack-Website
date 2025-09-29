import { assets } from '../assets/assets';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-[#E6E4D8] text-[#3A3A3A]">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 pt-2 pb-5 ml-10 md:ml-40 text-sm">
        <div>
          <img className="mb-5 w-36" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3">{t('footer_description')}</p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5 text-[#5c4b42]">
            {t('company')}
          </p>
          <ul className="flex flex-col gap-1">
            <li>{t('home')}</li>
            <li>{t('delivery')}</li>
            <li>{t('about')}</li>
          </ul>
        </div>
        <div>
          <div className="pb-3">
            <p className="text-xl font-medium mb-5 text-[#5c4b42]">
              {t('get_in_touch')}
            </p>
            <ul className="flex flex-col gap-1">
              <li>+216 54 859 655</li>
              <li>contact@mamakbienetre.com</li>
            </ul>
          </div>
          <div>
            <p className="text-xl font-medium mb-5 text-[#5c4b42]">
              {t('our_social_media')}
            </p>
            <ul className="flex gap-3">
              <li>
                <a
                  className="inline-block hover:scale-110 transition-transform"
                  href="https://www.facebook.com/profile.php?id=61559341236094"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="w-10"
                    src={assets.fb_icon}
                    alt="Visit our Facebook page"
                  />
                </a>
              </li>
              <li>
                <a
                  className="inline-block hover:scale-110 transition-transform"
                  href="https://www.instagram.com/mamak.bienetre/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="w-10"
                    src={assets.ig_icon}
                    alt="Visit our Instagram page"
                  />
                </a>
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
