import React from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <div className="relative h-[100vh] w-full pt-25 flex flex-col items-start justify-start overflow-hidden">
      <img
        src={assets.bg_image}
        className="absolute top-10 left-0 w-full h-full object-cover object-[top_70%_right_0] z-[-1]"
        alt=""
      />
      <div className="absolute inset-0 bg-black/20 z-[-1]"></div>
      <div className="relative px-[5vw] pt-[10vh]">
        <h4 className="text-[#f6ddc4] text-lg md:text-xl lg:text-2xl mb-2 md:mb-4 font-light">
          {t('hero_subtitle')}
        </h4>
        <h2 className="text-[#f6ddc4] text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-6 font-medium">
          {t('hero_title')}
        </h2>
        <h1 className="text-[#f2b67b] text-4xl md:text-5xl lg:text-6xl font-bold">
          {t('hero_main_title')}
        </h1>
        <Link to="/collection">
          <button className="mt-8 px-8 py-3 bg-[#f2b67b] hover:bg-[#e8a85f] text-[#5c4b42] font-medium rounded-lg transition-colors duration-300">
            {t('shop_now')}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
