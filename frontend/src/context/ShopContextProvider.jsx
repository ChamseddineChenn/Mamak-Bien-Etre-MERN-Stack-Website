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

  const addToCart = async (itemId, size) => {
    let cartData = structuredClone(cartItems);

    if (!size) {
      toast.error('Product size was not selected, please choose one!');
      return;
    }
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);
    toast.success('Item added to cart! feel free to continue shopping!');
  };

  const getCartCount = () => {
    let cartItemsTotalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            cartItemsTotalCount += cartItems[items][item];
          }
        } catch (error) {
          console.log(
            `Error when trying to count Shopping Cart total items: ${error}`
          );
        }
      }
    }
    return cartItemsTotalCount;
  };

  const modifyCartItemsQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
  };

  const getCartTotal = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    console.log(totalCount);
    return totalCount;
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
