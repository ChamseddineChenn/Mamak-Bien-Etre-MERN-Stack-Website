import { assets } from '../assets/assets';
import Title from '../components/Title';
import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-[100vh]">
      <div className="text-center text-2xl pt-10 mt-19">
        <Title primaryText={'Contact'} secondaryText={'Us'} />
      </div>
      <div className="my-10 flex flex-col justify-center md:flex-row gap-5 mb-28">
        <img
          className="w-full md:max-w-[35vw] rounded-xl"
          src={assets.contact_img}
          alt=""
        />
        <div className="flex flex-col justify-center items-start gap-4">
          <p className="font-semibold text-xl text-gray-600">Our Store</p>
          <p className="text-gray-500">
            5 Rue Abou Baker Essedik <br /> 2091, Ariana
          </p>
          <p className="text-gray-500">
            Phone Number: +216 54 859 655 <br />
            Email: contact@mamakbienetre.com
          </p>
          <p className="font-semibold text-xl text-gray-600">
            Careers at Mamak Bien Etre
          </p>
          <p>Learn more about our job openings.</p>
          <button className="py-2 px-5 bg-[#f2b67b] hover:bg-[#e8a85f] text-[#5c4b42] font-medium rounded-lg transition-colors duration-300">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
