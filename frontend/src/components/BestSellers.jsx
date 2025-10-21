import { ShopContext } from '../context/ShopContext';
import React, { useContext, useEffect, useState } from 'react';
import Title from '../components/Title';
import ProductItem from './ProductItem';
import { useTranslation } from 'react-i18next';

const BestSellers = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestSeller);
    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title primaryText={t('best_sellers')}></Title>
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-[#A6A58A]">
          {t('best_sellers_description')}
        </p>
      </div>
      <div className="ps-8 pe-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {bestSeller.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            name={item.name}
            image={item.image}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSellers;
