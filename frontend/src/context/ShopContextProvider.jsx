import React, { use, useEffect, useState } from 'react';
import { products } from '../assets/assets';
import { ShopContext } from './ShopContext';

const ShopContextProvider = (props) => {
  const currency = 'TND';
  const delivery_fee = 10;
  const [search, setSearch] = useState('');
  const [cartItems, setCartItems] = useState({});

  const addToCart = async (itemId, size) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][(size += 1)];
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);
  };

  useEffect(() => {
    console.log(cartItems);
  }, [cartItems]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    cartItems,
    addToCart,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
