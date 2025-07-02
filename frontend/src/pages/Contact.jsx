import NewletterBox from '../components/NewletterBox';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#F9F7F2] mt-19">
      {/* Hero Section */}

      <div className="max-w-4xl mx-auto font-serif text-center text-4xl px-4 py-16">
        <Title
          primaryText={'Contact'}
          secondaryText={'Us'}
          className="text-4xl md:text-5xl"
        />
        <p className="mt-4 text-lg text-[#5C4B42]/80 max-w-3xl mx-auto">
          We'd love to hear from you! Reach out for inquiries, collaborations,
          or just to say hello.
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
              alt="Mamak Bien-Être storefront"
            />
          </div>

          {/* Contact Info */}
          <div className="lg:w-1/2 w-full space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-serif text-[#5C4B42] mb-6">
                Our Store
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={assets.address_icon}
                    className="w-10 h-10 mt-1"
                    alt=""
                  />
                  <div>
                    <p className="font-medium text-[#3A3A3A]">Address</p>
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
                    <p className="font-medium text-[#3A3A3A]">Phone</p>
                    <p className="text-[#5C4B42]/90">+216 54 859 655</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <img
                    src={assets.email_icon}
                    className="w-10 h-10 mt-1"
                    alt=""
                  />
                  <div>
                    <p className="font-medium text-[#3A3A3A]">Email</p>
                    <p className="text-[#5C4B42]/90">
                      contact@mamakbienetre.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Careers Section */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-serif text-[#5C4B42] mb-4">
                Join Our Team
              </h2>
              <p className="text-[#5C4B42]/90 mb-6">
                We're always looking for passionate individuals to join our
                growing family of artisans.
              </p>
              <button className="py-3 px-8 bg-[#D6A7A0] hover:bg-[#C79790] text-white font-medium rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md">
                Explore Job Opportunities
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-serif text-[#5C4B42] mb-6">Find Us</h2>
          <div className="aspect-video w-full bg-gray-200 rounded-lg overflow-hidden">
            {/* Replace with your Google Maps embed or component */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d964.2797957835513!2d10.165483621131353!3d36.84863447615167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd3303c50a8315%3A0x917669dc9bcf411b!2sAssociation%20Inara!5e0!3m2!1sen!2stn!4v1751451194689!5m2!1sen!2stn"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
      </div>
      <div className="pb-5">
        <NewletterBox />
      </div>
    </div>
  );
};

export default Contact;
