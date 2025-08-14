import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
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
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || '';
  });
  const [isCartLoading, setIsCartLoading] = useState(true);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const isSessionInitialized = useRef(false);
  const [user, setUser] = useState(null);

  // Products ----------------------------------------------------------------------------------------
  const getProductsData = useCallback(async () => {
    try {
      const URL = `${backendURL}/api/product/displayProducts`;
      const response = await axios.get(URL);
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [backendURL]);

  // Users ----------------------------------------------------------------------------------------
  const fetchUserProfile = useCallback(async () => {
    if (!token) return;

    try {
      const response = await axiosInstance.get(
        `${backendURL}/api/user/profile`,
        {
          withCredentials: true,
          headers: {
            token: token,
          },
        }
      );

      if (response.data.success && response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  }, [backendURL, token]);

  const updateUserProfile = useCallback(
    async (fullName) => {
      try {
        const response = await axiosInstance.put(
          `${backendURL}/api/user/profile`,
          { fullName },
          { withCredentials: true }
        );

        if (response.data.success) {
          setUser((prev) => ({
            ...prev,
            fullName: response.data.user.fullName,
          }));
          return true;
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            'Profile update failed'
        );
      }
    },
    [backendURL, token]
  );

  const changePassword = useCallback(
    async (currentPassword, newPassword) => {
      try {
        const response = await axiosInstance.put(
          `${backendURL}/api/user/change-password`,
          { currentPassword, newPassword },
          { withCredentials: true }
        );

        if (response.data.success) {
          if (response.data.requireReauth) {
            localStorage.removeItem('token');
            setToken('');
            toast.info('Password changed. Please login again.');
            navigate('/login');
          }
          return true;
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            'Password change failed'
        );
      }
    },
    [backendURL, token, navigate]
  );

  // Orders ----------------------------------------------------------------------------------------
  const updateUserDeliveryAddress = useCallback(
    async (address) => {
      if (!token) return;

      try {
        setUser((prev) => ({
          ...prev,
          deliveryAddress: address,
        }));

        await axiosInstance.post(
          `${backendURL}/api/user/delivery-address`,
          address,
          { withCredentials: true }
        );
        return true;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to save address';
      }
    },
    [backendURL, token]
  );

  const createOrder = useCallback(
    async (orderData) => {
      try {
        const response = await axiosInstance.post(
          `${backendURL}/api/order/create-order`,
          {
            address: orderData.address,
            paymentMethod: orderData.paymentMethod,
          },
          { withCredentials: true }
        );

        if (response.data.success) {
          setCartItems({});
          getProductsData(); // Refresh products after order
          return response.data.order;
        }
        throw new Error(response.data.message || 'Failed to create order');
      } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
      }
    },
    [backendURL, getProductsData]
  );

  const getRealTimeStock = useCallback(
    async (productId) => {
      try {
        const response = await axiosInstance.get(
          `${backendURL}/api/product/stock/${productId}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          return response.data.stock;
        }
        return 0;
      } catch (error) {
        console.error('Stock check error:', error);
        return 0;
      }
    },
    [backendURL]
  );

  const getOrderById = useCallback(
    async (orderId) => {
      try {
        const response = await axiosInstance.get(
          `${backendURL}/api/order/${orderId}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          return response.data.order;
        }
        throw new Error('Order not found');
      } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
      }
    },
    [backendURL]
  );

  const getUserOrders = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `${backendURL}/api/order/user-orders`,
        { withCredentials: true }
      );

      if (response.data.success) {
        return response.data.orders;
      }
      return [];
    } catch (error) {
      console.error('Failed to get orders:', error);
      return [];
    }
  }, [backendURL]);

  // Cart ----------------------------------------------------------------------------------------
  const fetchCart = useCallback(async () => {
    try {
      setIsCartLoading(true);
      const response = await axiosInstance.get(
        `${backendURL}/api/cart/getCartData`,
        { withCredentials: true }
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
      setIsSessionReady(true);
    }
  }, [backendURL]);

  const addToCart = useCallback(
    async (itemId, quantity = 1) => {
      try {
        const response = await axiosInstance.post(
          `${backendURL}/api/cart/addToCart`,
          { productId: itemId, quantity },
          { withCredentials: true }
        );

        if (response.data.success === false) {
          toast.warning(response.data.message);

          if (response.data.maxAllowed >= 0) {
            await axiosInstance.post(
              `${backendURL}/api/cart/addToCart`,
              { productId: itemId, quantity: response.data.maxAllowed },
              { withCredentials: true }
            );
          }

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

  const updateCartItemQuantity = useCallback(
    async (itemId, newQuantity) => {
      try {
        const currentStock = await getRealTimeStock(itemId);
        if (newQuantity > currentStock) {
          toast.warning(`Only ${currentStock} available`);
          return { success: false, maxAllowed: currentStock };
        }

        const response = await axiosInstance.put(
          `${backendURL}/api/cart/updateCartItem`,
          { productId: itemId, quantity: newQuantity },
          { withCredentials: true }
        );

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
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          'Failed to update item';
        toast.error(errorMessage);
        fetchCart();
        throw error;
      }
    },
    [backendURL, fetchCart, getRealTimeStock]
  );

  const mergeCarts = useCallback(async () => {
    try {
      const response = await axiosInstance.post(
        `${backendURL}/api/cart/mergeCarts`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
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

  // Reviews -----------------------------------------------------------------------------

  const addProductReview = useCallback(
    async (productId, rating, reviewText) => {
      try {
        const response = await axiosInstance.post(
          `${backendURL}/api/product/addReview`,
          { productId, rating, reviewText },
          { withCredentials: true }
        );

        if (response.data.success) {
          // Update products state with new review
          setProducts((prev) =>
            prev.map((product) =>
              product._id === productId ? response.data.product : product
            )
          );

          return { success: true, product: response.data.product };
        }

        return { success: false, message: response.data.message };
      } catch (error) {
        console.error('Review submission error:', error);
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to submit review',
        };
      }
    },
    [backendURL]
  );

  const checkReviewEligibility = useCallback(
    async (userId, productId) => {
      if (!userId || !productId) return false;

      try {
        const response = await axios.post(
          `${backendURL}/api/order/check-review-eligibility`,
          { userId, productId },
          { headers: { token: localStorage.getItem('token') } }
        );
        return response.data?.isEligible || false;
      } catch (error) {
        console.error('Eligibility check error:', error);
        return false;
      }
    },
    [backendURL]
  );

  // UseEffects right here ->
  useEffect(() => {
    getProductsData();
  }, [getProductsData]);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setUser(null);
    }
  }, [token, fetchUserProfile]);

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
        if (response.headers['clear-token'] === 'true') {
          localStorage.removeItem('token');
          setToken('');
        }
        return response;
      },
      (error) => {
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

  useEffect(() => {
    if (!isSessionInitialized.current) {
      isSessionInitialized.current = true;
      fetchCart();
    }
  }, [fetchCart]);

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
      createOrder,
      getOrderById,
      getUserOrders,
      isSessionReady,
      user,
      userDeliveryAddress: user?.deliveryAddress || null,
      updateUserDeliveryAddress,
      changePassword,
      updateUserProfile,
      getRealTimeStock,
      checkReviewEligibility,
      addProductReview,
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
      createOrder,
      getOrderById,
      getUserOrders,
      isSessionReady,
      user,
      updateUserDeliveryAddress,
      changePassword,
      updateUserProfile,
      getRealTimeStock,
      checkReviewEligibility,
      addProductReview,
    ]
  );

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
