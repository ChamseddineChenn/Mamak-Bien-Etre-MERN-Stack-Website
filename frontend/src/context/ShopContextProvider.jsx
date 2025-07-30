import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { ShopContext } from './ShopContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const axiosInstance = axios.create();

const ShopContextProvider = (props) => {
  const currency = 'TND';
  const delivery_fee = 10;
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState('');
  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('');
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

  //  Only depends on getProductsData (which is memoized)

  // ALL DATA RELATED TO CART
  // Fetch cart data
  const fetchCart = useCallback(async () => {
    try {
      setIsCartLoading(true);
      const response = await axiosInstance.get(
        `${backendURL}/api/cart/getCartData`,
        {
          withCredentials: true, // Sends cookies automatically
        }
      );

      if (response.data.success) {
        const itemsMap = {};
        response.data.cart?.items?.forEach((item) => {
          if (item.productId && item.productId._id) {
            itemsMap[item.productId._id] = item.quantity;
          }
        });
        setCartItems(itemsMap);
      }
    } catch (error) {
      console.error('Cart fetch error:', error);
    } finally {
      setIsCartLoading(false);
    }
  }, [backendURL]);

  // Add item to cart
  const addToCart = useCallback(
    async (itemId, quantity = 1) => {
      try {
        const response = await axiosInstance.post(
          `${backendURL}/api/cart/addToCart`,
          { productId: itemId, quantity },
          { withCredentials: true }
        );

        // Handle stock limitation response

        if (response.data.success === false) {
          toast.warning(response.data.message);

          // Add maximum allowed quantity if specified
          if (response.data.maxAllowed >= 0) {
            await axiosInstance.post(
              `${backendURL}/api/cart/addToCart`,
              { productId: itemId, quantity: response.data.maxAllowed },
              { withCredentials: true }
            );
          }

          // Refetch cart to update UI
          fetchCart();
          return;
        }

        setCartItems((prev) => ({
          ...prev,
          [itemId]: (prev[itemId] || 0) + quantity,
        }));

        toast.success('Item added to cart!');
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || 'Failed to add to cart';
        toast.error(errorMessage);
      }
    },
    [backendURL, fetchCart]
  );

  // Update cart items
  const updateCartItemQuantity = useCallback(
    async (itemId, newQuantity) => {
      try {
        const response = await axiosInstance.put(
          `${backendURL}/api/cart/updateCartItem`,
          { productId: itemId, quantity: newQuantity },
          { withCredentials: true }
        );

        // Always handle the response message
        if (response.data.message) {
          if (response.data.success) {
            toast.success(response.data.message);
          } else {
            toast.warning(response.data.message);
          }
        }

        if (response.data.success) {
          setCartItems((prev) => {
            const updatedItems = { ...prev };
            if (newQuantity <= 0) {
              delete updatedItems[itemId];
            } else {
              updatedItems[itemId] = newQuantity;
            }
            return updatedItems;
          });
        }

        return response.data;
      } catch (error) {
        // Handle network/server errors
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Failed to update item';
        toast.error(errorMessage);
        fetchCart();
        throw error;
      }
    },
    [backendURL, fetchCart]
  );

  // Merge cart using session id with loggedin user
  const mergeCarts = useCallback(async () => {
    try {
      const response = await axiosInstance.post(
        `${backendURL}/api/cart/mergeCarts`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update local cart state
        const itemsMap = {};
        response.data.cart.items.forEach((item) => {
          if (item.productId && item.productId._id) {
            itemsMap[item.productId._id] = item.quantity;
          }
        });
        setCartItems(itemsMap);

        return true;
      }
      return false;
    } catch (error) {
      console.error('Merge carts failed:', error);
      return false;
    }
  }, [backendURL]);

  const getCartCount = useCallback(() => {
    return Object.values(cartItems).reduce(
      (count, quantity) => count + quantity,
      0
    );
  }, [cartItems]);

  const getCartTotal = useCallback(() => {
    return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
      const itemInfo = products.find((product) => product._id === itemId);
      return itemInfo ? total + itemInfo.price * quantity : total;
    }, 0);
  }, [cartItems, products]);

  // Use Effect functions are ALL here

  // Fetch products

  useEffect(() => {
    getProductsData();
  }, [getProductsData]);

  // Better handling of token

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const authToken = token || localStorage.getItem('token');
        if (authToken) {
          config.headers['token'] = authToken;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        // Check if we need to clear token
        if (response.headers['clear-token'] === 'true') {
          localStorage.removeItem('token');
          setToken('');
        }
        return response;
      },
      (error) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setToken('');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  // Refresh cart when token changes (login/logout)
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Memoize context value
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
      updateCartItemQuantity,
      mergeCarts,
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
      updateCartItemQuantity,
      mergeCarts,
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
