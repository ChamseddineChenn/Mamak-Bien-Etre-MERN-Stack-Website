import NewArrivals from '../components/NewArrivals';
import Hero from '../components/Hero';
import React from 'react';
import BestSellers from '../components/BestSellers';
import AdditionalServices from '../components/AdditionalServices';
import NewletterBox from '../components/NewsletterBox';

const Home = () => {
  return (
    <div>
      <Hero />
      <NewArrivals />
      <BestSellers />
      <AdditionalServices />
      <NewletterBox />
    </div>
  );
};

export default Home;
