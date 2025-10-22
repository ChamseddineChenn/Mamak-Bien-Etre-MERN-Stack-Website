import NewletterBox from '../components/NewsletterBox';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import React from 'react';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#F9F7F2] mt-19">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto font-serif text-center text-4xl px-4 py-16">
        <Title
          primaryText={t('contact')}
          secondaryText={t('us')}
          className="text-4xl md:text-5xl"
        />
        <p className="mt-4 text-lg text-[#5C4B42]/80 max-w-3xl mx-auto">
          {t('contact_subtitle')}
        </p>
      </div>

      {/* Contact Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Contact Image */}
          <div className="lg:w-1/2 w-full">
            <img
              className="w-full h-auto rounded-xl shadow-lg object-cover"
              src={assets.contact_img}
              alt={t('contact_img_alt')}
            />
          </div>

          {/* Contact Info */}
          <div className="lg:w-1/2 w-full space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-serif text-[#5C4B42] mb-6">
                {t('our_store')}
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <img
                    src={assets.address_icon}
                    className="w-10 h-10 mt-1"
                    alt=""
                  />
                  <div>
                    <p className="font-medium text-[#3A3A3A]">{t('address')}</p>
                    <p className="text-[#5C4B42]/90">
                      5 Rue Abou Baker Essedik
                      <br />
                      2091, Ariana
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <img
                    src={assets.phone_icon}
                    className="w-10 h-10 mt-1"
                    alt=""
                  />
                  <div>
                    <p className="font-medium text-[#3A3A3A]">{t('phone')}</p>
                    <motion.a
                      href="tel:+21653527102"
                      className="flex items-center gap-3 group"
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      <span className="w-2 h-2 bg-[#C4A484] rounded-full group-hover:bg-[#5c4b42] transition-colors flex-shrink-0"></span>
                      <span className="text-[#5C4B42]/90 group-hover:text-[#5c4b42] transition-colors underline decoration-transparent group-hover:decoration-[#C4A484] text-lg font-medium">
                        +216 53 527 102
                      </span>
                    </motion.a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <img
                    src={assets.email_icon}
                    className="w-10 h-10 mt-1"
                    alt=""
                  />
                  <div>
                    <p className="font-medium text-[#3A3A3A]">{t('email')}</p>
                    <motion.a
                      href="mailto:contact@mamakbienetre.com"
                      className="flex items-center gap-3 group"
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      <span className="w-2 h-2 bg-[#C4A484] rounded-full group-hover:bg-[#5c4b42] transition-colors flex-shrink-0"></span>
                      <span className="text-[#5C4B42]/90 group-hover:text-[#5c4b42] transition-colors underline decoration-transparent group-hover:decoration-[#C4A484] text-lg">
                        contact@mamakbienetre.com
                      </span>
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>

            {/* Careers Section */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-serif text-[#5C4B42] mb-4">
                {t('join_our_team')}
              </h2>
              <p className="text-[#5C4B42]/90 mb-6">{t('join_team_desc')}</p>
              <motion.button
                className="py-3 px-8 bg-[#D6A7A0] hover:bg-[#C79790] text-white font-medium rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                {t('explore_jobs')}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <motion.div
          className="bg-white p-8 rounded-xl shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-serif text-[#5C4B42] mb-6">
            {t('find_us')}
          </h2>
          <div className="aspect-video w-full bg-gray-200 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d964.2797957835513!2d10.165483621131353!3d36.84863447615167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd3303c50a8315%3A0x917669dc9bcf411b!2sAssociation%20Inara!5e0!3m2!1sen!2stn!4v1751451194689!5m2!1sen!2stn"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="rounded-lg"
              title={t('map_title')}
            ></iframe>
          </div>
        </motion.div>
      </div>
      <div className="pb-5">
        <NewletterBox />
      </div>
    </div>
  );
};

export default Contact;
