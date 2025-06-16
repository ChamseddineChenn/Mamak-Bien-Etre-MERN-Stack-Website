import React, { useState } from 'react';
import { products } from '../assets/assets';
import { ShopContext } from './ShopContext';

const ShopContextProvider = (props) => {
  const currency = 'TND';
  const delivery_fee = 10;
  const [search, setSearch] = useState('');

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
