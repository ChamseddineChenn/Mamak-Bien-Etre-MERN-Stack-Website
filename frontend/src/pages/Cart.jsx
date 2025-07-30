import React, { useContext, useEffect, useState, useRef } from 'react';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, useAnimation } from 'framer-motion';
import { toast } from 'react-toastify';

const EmptyCart = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      x: [-5, 5, -5, 5, 0],
      y: [-2, 2, -2, 2, 0],
      rotate: [-3, 3, -3, 3, 0],
      transition: {
        duration: 1,
        ease: 'easeInOut',
      },
    });
  }, [controls]);

  return (
    <div className="flex flex-col items-center justify-center pb-30 px-6 bg-white/80 rounded-xl mt-20">
      <div className="mb-8 w-40 h-40 justify-center">
        <motion.img
          src={assets.cart_icon}
          alt="Empty cart"
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={controls}
        />
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-3 ml-5">
        Your Cart Feels Lonely
      </h3>
      <p className="text-gray-500 mb-6 text-center max-w-md justify-center ml-5">
        You haven't added anything to your cart yet. Discover our amazing
        products!
      </p>

      <Link to="/collection">
        <button className="w-50 min-w-30 mt-3 ml-5 px-8 py-3 bg-[#f2b67b] hover:bg-[#e8a85f] text-[#5c4b42] font-medium rounded-lg transition-colors duration-300">
          Shop Now
        </button>
      </Link>
    </div>
  );
};

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateCartItemQuantity,
    navigate,
    isCartLoading,
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [localQuantities, setLocalQuantities] = useState({});
  const [pendingUpdates, setPendingUpdates] = useState({});
  const inputRefs = useRef({});

  // Initialize cart data and local quantities
  useEffect(() => {
    const tempData = Object.entries(cartItems).map(([itemId, quantity]) => ({
      _id: itemId,
      quantity,
    }));

    setCartData(tempData);

    // Initialize local quantities
    const newLocalQuantities = {};
    tempData.forEach((item) => {
      newLocalQuantities[item._id] = item.quantity;
    });
    setLocalQuantities(newLocalQuantities);
  }, [cartItems]);

  // Optimistic quantity update
  const handleQuantityChange = async (itemId, newQuantity) => {
    const previousQuantity = localQuantities[itemId];

    // Optimistic UI update
    setLocalQuantities((prev) => ({ ...prev, [itemId]: newQuantity }));
    setPendingUpdates((prev) => ({ ...prev, [itemId]: true }));

    try {
      // We don't need to handle the response here
      await updateCartItemQuantity(itemId, newQuantity);
    } catch (error) {
      console.log(error);
      // Revert only for network errors
      setLocalQuantities((prev) => ({ ...prev, [itemId]: previousQuantity }));
    } finally {
      setPendingUpdates((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  // Handle direct input changes
  const handleInputChange = (itemId, value) => {
    const product = products.find((p) => p._id === itemId);
    if (!product) return;

    const numValue = Number(value);
    if (isNaN(numValue)) return;

    // Clamp value to stock limit
    const clampedValue = Math.min(Math.max(1, numValue), product.quantity);
    setLocalQuantities((prev) => ({ ...prev, [itemId]: clampedValue }));
  };

  // Handle increment/decrement buttons
  const handleQuantityAdjust = (itemId, delta) => {
    const product = products.find((p) => p._id === itemId);
    if (!product) return;

    const currentQty = localQuantities[itemId] || 1;
    const newQty = currentQty + delta;

    // Validate against stock before sending
    if (newQty > product.quantity) {
      toast.warning(`${product.quantity} items available in stock`);
      return;
    }

    handleQuantityChange(itemId, newQty);
  };

  // Handle remove item
  const handleRemoveItem = async (itemId) => {
    // Optimistically remove from UI immediately
    setLocalQuantities((prev) => {
      const newQuantities = { ...prev };
      delete newQuantities[itemId];
      return newQuantities;
    });

    // Track this update as pending
    setPendingUpdates((prev) => ({
      ...prev,
      [itemId]: true,
    }));

    try {
      await updateCartItemQuantity(itemId, 0);
    } catch (error) {
      console.error('Remove error:', error);
      // Revert on error
      setLocalQuantities((prev) => ({
        ...prev,
        [itemId]: cartItems[itemId] || 1,
      }));
    } finally {
      setPendingUpdates((prev) => ({
        ...prev,
        [itemId]: false,
      }));
    }
  };

  // Handle Enter key in input field
  const handleKeyPress = (e, itemId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
      handleQuantityChange(itemId, localQuantities[itemId]);
    }
  };

  return (
    <div className="border-t pt-14 min-h-[100vh]">
      <div className="text-2xl mb-3 mt-10 text-center">
        <Title primaryText={'Shopping'} secondaryText={'Cart'} />
      </div>
      <div>
        {isCartLoading ? (
          // Loading spinner
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-[#A6A58A]"></div>
          </div>
        ) : cartData.length ? (
          // Cart items list
          <div className="flex flex-col minh-20 mx-20">
            {cartData.map((item, index) => {
              const productData = products.find(
                (product) => product._id === item._id
              );

              // Add null check for productData
              if (!productData) return null;

              const currentQuantity =
                localQuantities[item._id] || item.quantity;
              const isPending = pendingUpdates[item._id];

              return (
                <div className="flex flex-col mx-20" key={index}>
                  <div className="text-gray-700 grid grid-cols-[4fr_2fr_0.5fr] items-center gap-4 py-4">
                    {/* Product info */}
                    <div className="flex items-start gap-6">
                      <img
                        className="w-16 sm:w-20 rounded"
                        src={productData.image[0]}
                        alt={productData.name}
                      />
                      <div>
                        <p className="text-sm sm:text-lg font-medium">
                          {productData.name}
                        </p>
                        <div className="flex items-center gap-5 mt-2">
                          <p>
                            {currency} {productData.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center">
                      <button
                        onClick={() => handleQuantityAdjust(item._id, -1)}
                        disabled={isPending}
                        className={`flex items-center justify-center min-w-5 w-5 min-h-5 h-5 ${
                          isPending ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <img
                          className="min-w-5 w-5 min-h-5 h-5 -rotate-90"
                          src={assets.arrow_up_icon}
                          alt="Decrease quantity"
                        />
                      </button>

                      <input
                        ref={(el) => (inputRefs.current[item._id] = el)}
                        className={`border-transparent bg-[#A6A58A]/30 max-w-10 sm:max-w-20 sm:px-2 p-1 text-center rounded-2xl ${
                          isPending ? 'opacity-50' : ''
                        }`}
                        type="number"
                        min={1}
                        max={productData.quantity}
                        value={currentQuantity}
                        onChange={(e) =>
                          handleInputChange(item._id, e.target.value)
                        }
                        onBlur={() =>
                          handleQuantityChange(item._id, currentQuantity)
                        }
                        onKeyPress={(e) => handleKeyPress(e, item._id)}
                        disabled={isPending}
                      />

                      <button
                        onClick={() => handleQuantityAdjust(item._id, 1)}
                        disabled={isPending}
                        className={`flex items-center justify-center min-w-5 w-5 min-h-5 h-5 ${
                          isPending ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <img
                          className="min-w-5 w-5 min-h-5 h-5 rotate-90"
                          src={assets.arrow_up_icon}
                          alt="Increase quantity"
                        />
                      </button>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      disabled={isPending}
                      className={`flex items-center justify-center w-4 mr-[16vw] sm:w-5 ${
                        isPending ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <img
                        className="w-4 sm:w-5"
                        src={assets.bin_icon}
                        alt="Remove item"
                      />
                    </button>
                  </div>
                  <span className="w-[75vw] border-b border-[#A6A58A] rounded-2xl"></span>
                </div>
              );
            })}
          </div>
        ) : (
          // Empty cart
          <EmptyCart />
        )}
      </div>
      {cartData.length ? (
        <div className="flex justify-end my-20 mx-20">
          <div className="w-full sm:w-[40vw]">
            <CartTotal />
            <div className="w-full text-end">
              <button
                className="mt-5 py-2 px-5 bg-[#f2b67b] hover:bg-[#e8a85f] text-[#5c4b42] font-medium rounded-lg transition-colors duration-300"
                onClick={() => navigate('/place-order')}
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Cart;
