import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { ShopContext } from './ShopContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ShopContextProvider = (props) => {
  const currency = 'TND';
  const delivery_fee = 10;
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState('');
  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('');

  // Data fetching
  const getProductsData = useCallback(async () => {
    try {
      const URL = `${backendURL}/api/product/displayProducts`;
      const response = await axios.get(URL);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [backendURL]); //  Add backendURL dependency

  useEffect(() => {
    getProductsData();
  }, [getProductsData]); //  Only depends on getProductsData (which is memoized)

  // Memoize cart functions
  const addToCart = useCallback((itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
    toast.success('Item added to cart!');
  }, []);

  const getCartCount = useCallback(() => {
    return Object.values(cartItems).reduce(
      (count, quantity) => count + quantity,
      0
    );
  }, [cartItems]);

  const modifyCartItemsQuantity = useCallback((itemId, quantity) => {
    setCartItems((prev) => {
      const newCartItems = { ...prev };
      if (quantity <= 0) {
        delete newCartItems[itemId];
      } else {
        newCartItems[itemId] = quantity;
      }
      return newCartItems;
    });
  }, []);

  const getCartTotal = useCallback(() => {
    return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
      const itemInfo = products.find((product) => product._id === itemId);
      return itemInfo ? total + itemInfo.price * quantity : total;
    }, 0);
  }, [cartItems, products]);

  // 3. Memoize context value
  const value = useMemo(
    () => ({
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
      backendURL,
      token,
      setToken,
    }),
    [
      products,
      search,
      cartItems,
      addToCart,
      getCartCount,
      modifyCartItemsQuantity,
      getCartTotal,
      navigate,
      backendURL,
      token,
      setToken,
    ]
  );

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
