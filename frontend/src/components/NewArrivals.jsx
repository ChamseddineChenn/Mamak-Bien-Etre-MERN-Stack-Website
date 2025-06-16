import { ShopContext } from '../context/ShopContext';
import React, { useContext, useEffect, useState } from 'react';
import Title from './Title';
import ProductItem from './ProductItem';

const NewArrivals = () => {
  const { products } = useContext(ShopContext);
  const [NewArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    setNewArrivals(products.slice(0, 10));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title primaryText={'New'} secondaryText={'Arrivals'} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-[#A6A58A]">
          Discover our newest creations — crafted to elevate your space and
          soothe your senses
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
