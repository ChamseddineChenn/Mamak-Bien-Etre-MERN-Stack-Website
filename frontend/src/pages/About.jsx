import NewletterBox from '../components/NewsletterBox';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      {/* Hero Image - Standalone */}
      <div className="relative h-[50vh] overflow-hidden">
        <img
          src={assets.bg_image}
          alt="Mamak Bien-Être artisan workshop"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Page Title - On Main Content */}
      <div className="max-w-7xl mx-auto px-6 pt-16 text-center">
        <h1 className="text-4xl md:text-6xl font-serif text-[#5C4B42] mb-4">
          <Title primaryText={'About'} secondaryText={'Us'} />
        </h1>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-6 py-8 md:py-16">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <img
              src={assets.bg_about_img}
              alt="Malak Chaherli crafting products"
              className="rounded-2xl shadow-lg w-full h-auto"
            />
          </div>
          <div className="md:w-1/2 space-y-6 text-[#3A3A3A]">
            <h2 className="text-3xl md:text-4xl font-serif text-[#5C4B42]">
              Our Story
            </h2>
            <p className="text-lg md:text-xl leading-relaxed">
              Founded by Malak Chaherli, Mamak Bien-Être began as a passionate
              endeavor to create luxurious, handcrafted candles and perfumes
              that awaken the senses and elevate everyday moments.
            </p>
            <p className="text-lg md:text-xl leading-relaxed">
              Each product is carefully formulated using traditional techniques
              combined with modern craftsmanship to deliver exceptional quality.
            </p>
            <div className="mt-8">
              <h3 className="text-2xl md:text-3xl font-serif text-[#5C4B42] mb-4">
                Our Mission
              </h3>
              <p className="text-lg md:text-xl leading-relaxed">
                To craft sensory experiences that bring comfort, joy and
                tranquility to your spaces, using only the finest natural
                ingredients and sustainable practices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-[#E6E4D8] py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-serif text-[#5C4B42] mb-4">
            <Title primaryText={'Why'} secondaryText={'Choose Us'} />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: assets.quality_icon,
                title: 'Quality Assurance',
                description:
                  'Every product undergoes rigorous testing to ensure premium quality and longevity.',
              },
              {
                icon: assets.natural_ing_icon,
                title: 'Natural Ingredients',
                description:
                  'We use only pure, responsibly-sourced ingredients with no harmful additives.',
              },
              {
                icon: assets.customer_service_icon,
                title: 'Exceptional Service',
                description:
                  'Personalized attention from founder Malak who oversees every order.',
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
            <Title primaryText={'Meet'} secondaryText={'The Founder'} />
          </h2>
          <p className="max-w-3xl mx-auto text-[#3A3A3A] md:text-lg">
            The heart and hands behind every Mamak Bien-Être creation
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <div className=" overflow-hidden rounded-xl">
              <img
                src={assets.malak_portrait_img}
                alt="Malak Chaherli, Founder of Mamak Bien-Être"
                className="w-full h-2/3 object-cover"
              />
            </div>
          </div>
          <div className="md:w-2/3 text-[#3A3A3A] mt-5">
            <h3 className="text-2xl md:text-3xl font-serif text-[#5C4B42] mb-3">
              Malak Chaherli
            </h3>
            <p className="text-lg md:text-xl mb-6 font-medium">
              Founder & Master Artisan
            </p>
            <p className="text-lg mb-4 leading-relaxed">
              With a lifelong passion for fragrance and craftsmanship, Malak
              founded Mamak Bien-Être to share her vision of sensory elegance.
              Each product reflects her meticulous attention to detail and
              commitment to quality.
            </p>
            <p className="text-lg leading-relaxed">
              When not creating new scents, Malak personally oversees every
              aspect of production, ensuring each item meets her exacting
              standards before reaching your home.
            </p>
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
