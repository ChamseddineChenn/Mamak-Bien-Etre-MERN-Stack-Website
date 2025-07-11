import React, { useEffect, useState } from 'react';
import { products } from '../assets/assets';
import { ShopContext } from './ShopContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ShopContextProvider = (props) => {
  const currency = 'TND';
  const delivery_fee = 10;
  const [search, setSearch] = useState('');
  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();

  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
    toast.success('Item added to cart!');
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce(
      (count, quantity) => count + quantity,
      0
    );
  };

  const modifyCartItemsQuantity = (itemId, quantity) => {
    setCartItems((prev) => {
      const newCartItems = { ...prev };
      if (quantity <= 0) {
        delete newCartItems[itemId];
      } else {
        newCartItems[itemId] = quantity;
      }
      return newCartItems;
    });
  };

  const getCartTotal = () => {
    return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
      const itemInfo = products.find((product) => product._id === itemId);
      return itemInfo ? total + itemInfo.price * quantity : total;
    }, 0);
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
    getCartCount,
    modifyCartItemsQuantity,
    getCartTotal,
    navigate,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
