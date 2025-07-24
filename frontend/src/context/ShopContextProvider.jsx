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
  const [backendCart, setBackendCart] = useState(null);
  const [isCartLoading, setIsCartLoading] = useState(true);

  // ALL DATA RELATED TO PRODUCTS
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

  // ALL DATA RELATED TO CART
  // Fetch cart data
  const fetchCart = useCallback(async () => {
    try {
      setIsCartLoading(true);
      const response = await axios.get(`${backendURL}/api/cart/getCartData`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.data.success) {
        setBackendCart(response.data.cart);

        // Convert to cartItems format
        const itemsMap = {};
        response.data.cart?.items?.forEach((item) => {
          itemsMap[item.productId._id] = item.quantity;
        });

        setCartItems(itemsMap);

        // Save to localStorage for persistence
        localStorage.setItem('cartItems', JSON.stringify(itemsMap));
      }
    } catch (error) {
      console.error('Cart fetch error:', error);
      // Try to load from localStorage if fetch fails
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } finally {
      setIsCartLoading(false);
    }
  }, [backendURL, token]);

  // Enhanced useEffect with token dependency
  useEffect(() => {
    // Load from localStorage on initial mount
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    // Then fetch fresh data from backend
    fetchCart();
  }, [fetchCart]);

  // New: Refresh cart when token changes (login/logout)
  useEffect(() => {
    if (token || !token) {
      // Trigger on any token change
      fetchCart();
    }
  }, [token, fetchCart]);

  // Memoize cart functions
  const addToCart = useCallback(
    async (itemId, quantity = 1) => {
      try {
        const response = await axios.post(
          `${backendURL}/api/cart/addToCart`,
          { productId: itemId, quantity },
          {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        if (response.data.success) {
          setBackendCart(response.data.cart);

          // Update local cart state
          const newCartItems = { ...cartItems };
          newCartItems[itemId] = (newCartItems[itemId] || 0) + quantity;
          setCartItems(newCartItems);
          localStorage.setItem('cartItems', JSON.stringify(newCartItems));

          toast.success('Item added to cart!');
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || 'Failed to add to cart';
        toast.error(errorMessage);
      }
    },
    [backendURL, token, cartItems]
  );

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
      setCartItems,
      addToCart,
      getCartCount,
      modifyCartItemsQuantity,
      getCartTotal,
      navigate,
      backendURL,
      token,
      setToken,
      isCartLoading,
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
      isCartLoading,
    ]
  );

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
