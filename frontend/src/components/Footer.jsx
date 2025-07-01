import { assets } from '../assets/assets';
import React from 'react';

const Footer = () => {
  return (
    <div className="bg-[#E6E4D8] text-[#3A3A3A]">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 pt-2 pb-5 ml-10 md:ml-40 text-sm">
        <div>
          <img className="mb-5 w-36" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3">
            We craft artisanal candles and perfumes designed to elevate everyday
            moments with elegance, emotion, and scent — made with care, quality
            ingredients, and a personal touch.
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5 text-[#5c4b42]">COMPANY</p>
          <ul className="flex flex-col gap-1">
            <li>Home</li>
            <li>Delivery</li>
            <li>About</li>
          </ul>
        </div>
        <div>
          <div className="pb-3">
            <p className="text-xl font-medium mb-5 text-[#5c4b42]">
              GET IN TOUCH
            </p>
            <ul className="flex flex-col gap-1">
              <li>+216 54 859 655</li>
              <li>contact@mamakbienetre.com</li>
            </ul>
          </div>
          <div>
            <p className="text-xl font-medium mb-5 text-[#5c4b42]">
              OUR SOCIAL MEDIA
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
          © 2025 Mamak Bien-Être. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
