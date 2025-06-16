import React from 'react';
import Title from './Title';
import { assets } from '../assets/assets';

const AdditionalServices = () => {
  return (
    <div className="my-20 px-4 sm:px-8 md:px-12 lg:px-20">
      {/* Section Header */}
      <div className="text-center text-3xl py-8">
        <Title primaryText={'Tailored'} secondaryText={'Services'} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-[#A6A58A]">
          Whether it's a gift for them or a treat for you, our tailored services
          add that extra layer of care and charm
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
            <h3 className="text-3xl font-bold mb-3">Gift Wrapping</h3>
            <p className="text-lg max-w-[60ch]">
              Elegant packaging with personalized notes for your special gifts
            </p>
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
            <h3 className="text-3xl font-bold mb-3">Custom Scents</h3>
            <p className="text-lg max-w-[60ch]">
              Personalized fragrance blend tailored to your special preferences
            </p>
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
            <h3 className="text-3xl font-bold mb-3">Complementary Samples</h3>
            <p className="text-lg max-w-[60ch]">
              Curated sample selection to help you find your special match
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalServices;
