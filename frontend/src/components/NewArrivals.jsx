import { ShopContext } from '../context/ShopContext';
import React, { useContext, useEffect, useState } from 'react';
import Title from './Title';
import ProductItem from './ProductItem';
import { useTranslation } from 'react-i18next';

const NewArrivals = () => {
  const { products } = useContext(ShopContext);
  const [NewArrivals, setNewArrivals] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const newProducts = products.filter((item) => item.newArrival);
    setNewArrivals(newProducts.slice(0, 5));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title primaryText={t('new_arrivals')} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-[#A6A58A]">
          {t('new_arrivals_description')}
        </p>
      </div>

      {/* Rendering Products */}
      <div className="ps-8 pe-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {NewArrivals.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default NewArrivals;
