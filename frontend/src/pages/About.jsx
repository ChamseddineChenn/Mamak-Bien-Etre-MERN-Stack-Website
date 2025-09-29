import NewletterBox from '../components/NewsletterBox';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      {/* Hero Image - Standalone */}
      <div className="relative h-[50vh] overflow-hidden">
        <img
          src={assets.bg_image}
          alt={t('about_hero_alt')}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Page Title - On Main Content */}
      <div className="max-w-7xl mx-auto px-6 pt-16 text-center">
        <h1 className="text-4xl md:text-6xl font-serif text-[#5C4B42] mb-4">
          <Title primaryText={t('about_us')} secondaryText={t('us')} />
        </h1>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-16">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <img
              src={assets.bg_about_img}
              alt={t('about_story_alt')}
              className="rounded-2xl shadow-lg w-full h-auto"
            />
          </div>
          <div className="md:w-1/2 space-y-6 text-[#3A3A3A]">
            <h2 className="text-3xl md:text-4xl font-serif text-[#5C4B42]">
              {t('our_story')}
            </h2>
            <p className="text-lg md:text-xl leading-relaxed">
              {t('about_story_1')}
            </p>
            <p className="text-lg md:text-xl leading-relaxed">
              {t('about_story_2')}
            </p>
            <div className="mt-8">
              <h3 className="text-2xl md:text-3xl font-serif text-[#5C4B42] mb-4">
                {t('our_mission')}
              </h3>
              <p className="text-lg md:text-xl leading-relaxed">
                {t('about_mission')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-[#E6E4D8] py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-serif text-[#5C4B42] mb-4">
            <Title primaryText={t('why')} secondaryText={t('choose_us')} />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: assets.quality_icon,
                title: t('quality_assurance'),
                description: t('quality_description'),
              },
              {
                icon: assets.natural_ing_icon,
                title: t('natural_ingredients'),
                description: t('natural_description'),
              },
              {
                icon: assets.customer_service_icon,
                title: t('exceptional_service'),
                description: t('service_description'),
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-[#F5F0EB] rounded-full flex items-center justify-center">
                  <img src={item.icon} alt="" className="w-8 h-8" />
                </div>
                <h3 className="text-xl md:text-2xl font-medium text-[#5C4B42] mb-3">
                  {item.title}
                </h3>
                <p className="text-[#3A3A3A]/90 md:text-lg">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Founder Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-[#5C4B42] mb-4">
            <Title primaryText={t('meet')} secondaryText={t('the_founder')} />
          </h2>
          <p className="max-w-3xl mx-auto text-[#3A3A3A] md:text-lg">
            {t('founder_intro')}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <div className=" overflow-hidden rounded-xl">
              <img
                src={assets.malak_portrait_img}
                alt={t('founder_alt')}
                className="w-full h-2/3 object-cover"
              />
            </div>
          </div>
          <div className="md:w-2/3 text-[#3A3A3A] mt-5">
            <h3 className="text-2xl md:text-3xl font-serif text-[#5C4B42] mb-3">
              {t('founder_name')}
            </h3>
            <p className="text-lg md:text-xl mb-6 font-medium">
              {t('founder_title')}
            </p>
            <p className="text-lg mb-4 leading-relaxed">
              {t('founder_desc_1')}
            </p>
            <p className="text-lg leading-relaxed">{t('founder_desc_2')}</p>
          </div>
        </div>
      </div>
      <div className="pb-5">
        <NewletterBox />
      </div>
    </div>
  );
};

export default About;
