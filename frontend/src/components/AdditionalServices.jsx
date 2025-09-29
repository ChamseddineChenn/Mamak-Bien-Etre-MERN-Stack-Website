import React from 'react';
import Title from './Title';
import { assets } from '../assets/assets';
import { useTranslation } from 'react-i18next';

const AdditionalServices = () => {
  const { t } = useTranslation();

  return (
    <div className="my-20 px-4 sm:px-8 md:px-12 lg:px-20">
      {/* Section Header */}
      <div className="text-center text-3xl py-8">
        <Title primaryText={t('tailored_services')} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-[#A6A58A]">
          {t('services_description')}
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {/* Service Card 1 - Gift Wrapping */}
        <div className="group relative h-[300px] rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="absolute inset-0 z-0">
            <img
              src={assets.giftwrapping_img}
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
              alt="Luxury gift wrapping"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#5c4b42]/40 to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 z-10 p-8 text-[#f6ddc4]">
            <h3 className="text-3xl font-bold mb-3">{t('gift_wrapping')}</h3>
            <p className="text-lg max-w-[60ch]">{t('gift_wrapping_desc')}</p>
          </div>
        </div>

        {/* Service Card 2 - Custom Scents */}
        <div className="group relative h-[300px] rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="absolute inset-0 z-0">
            <img
              src={assets.customcandles_img}
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
              alt="Luxury gift wrapping"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#5c4b42]/40 to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 z-10 p-8 text-[#f6ddc4]">
            <h3 className="text-3xl font-bold mb-3">{t('custom_scents')}</h3>
            <p className="text-lg max-w-[60ch]">{t('custom_scents_desc')}</p>
          </div>
        </div>

        {/* Service Card 3 - Complementary Samples */}
        <div className="group relative h-[300px] rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="absolute inset-0 z-0">
            <img
              src={assets.candlessample_img}
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
              alt="Luxury gift wrapping"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#5c4b42]/40 to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 z-10 p-8 text-[#f6ddc4]">
            <h3 className="text-3xl font-bold mb-3">
              {t('complementary_samples')}
            </h3>
            <p className="text-lg max-w-[60ch]">
              {t('complementary_samples_desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalServices;
