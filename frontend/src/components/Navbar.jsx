import React, {
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import { assets } from '../assets/assets.js';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [accountFlyoutOpen, setAccountFlyoutOpen] = useState(false);
  const [cartFlyoutOpen, setCartFlyoutOpen] = useState(false);
  const {
    navigate,
    token,
    setToken,
    cartItems,
    setCartItems,
    getCartCount,
    getCartTotal,
    products,
    currency,
    backendURL,
  } = useContext(ShopContext);

  // Reset flyouts on token change and mobile menu open
  useEffect(() => {
    setAccountFlyoutOpen(false);
    setCartFlyoutOpen(false);
  }, [token, visible]);

  // Close flyouts when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const accountFlyout = document.querySelector('.account-flyout');
      const cartFlyout = document.querySelector('.cart-flyout');

      if (accountFlyout && !accountFlyout.contains(e.target)) {
        setAccountFlyoutOpen(false);
      }

      if (cartFlyout && !cartFlyout.contains(e.target)) {
        setCartFlyoutOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post(
        `${backendURL}/api/user/logout`,
        {},
        {
          withCredentials: true,
          headers: { token: token || localStorage.getItem('token') },
        }
      );

      localStorage.removeItem('token');
      setToken('');
      setCartItems({});
      setAccountFlyoutOpen(false);
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('token');
      setToken('');
      setCartItems({});
      setAccountFlyoutOpen(false);
      navigate('/login');
    }
  }, [backendURL, token, setToken, navigate, setCartItems]);

  // Profile flyout content
  const ProfileContent = useMemo(
    () => () =>
      (
        <div className="bg-[#E6E4D8] border rounded-xl">
          <div className="flex flex-col gap-2 w-36 py-3 px-5 text-[#3A3A3A]">
            <p
              className="cursor-pointer hover:text-black"
              onClick={() => {
                navigate('/profile');
                setAccountFlyoutOpen(false);
              }}
            >
              My Profile
            </p>
            <p
              className="cursor-pointer hover:text-black"
              onClick={() => {
                navigate('/orders');
                setAccountFlyoutOpen(false);
              }}
            >
              Orders
            </p>
            <p className="cursor-pointer hover:text-black" onClick={logout}>
              Logout
            </p>
          </div>
        </div>
      ),
    [navigate, logout]
  );

  // Cart flyout content
  const CartContent = useMemo(() => {
    const cartItemsArray = Object.entries(cartItems)
      .map(([itemId, quantity]) => {
        const product = products.find((p) => p._id === itemId);
        return product
          ? {
              id: itemId,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity,
            }
          : null;
      })
      .filter(Boolean);

    return (
      <div className="bg-[#E6E4D8] border rounded-xl w-72">
        <div className="flex flex-col gap-4 p-4">
          {cartItemsArray.length === 0 ? (
            <p className="text-center text-[#3A3A3A]">Your cart is empty</p>
          ) : (
            <>
              <div className="max-h-60 overflow-y-auto pr-2">
                {cartItemsArray.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 border-b border-[#C4A484]/30 py-3"
                  >
                    <img
                      src={item.image}
                      className="w-12 h-12 object-cover rounded"
                      alt={item.name}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-[#3A3A3A]">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#3A3A3A]/80">
                        {currency}
                        {item.price} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-sm">
                      {currency}
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-medium text-[#3A3A3A]">
                <span>Subtotal</span>
                <span>
                  {currency}
                  {getCartTotal().toFixed(2)}
                </span>
              </div>
              <button
                className="bg-[#C4A484] text-white py-2 rounded-lg hover:bg-[#B08E6B] transition-colors"
                onClick={() => {
                  navigate('/cart');
                  setCartFlyoutOpen(false);
                }}
              >
                View Cart
              </button>
            </>
          )}
        </div>
      </div>
    );
  }, [cartItems, products, currency, getCartTotal, navigate]);

  return (
    <div className="fixed top-0 left-0 w-full shadow-md flex items-center justify-between ps-4 sm:ps-[5vw] pe-4 sm:pe-[5vw] ms-auto py-2 font-medium bg-[#E6E4D8] z-50">
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="" />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-[#5c4b42] tinos-bold text-[16px] -translate-x-10">
        <NavLink to="/" className="flex flex-col items-center">
          <p>Home</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-[#C4A484] hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center">
          <p>Collection</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-[#C4A484] hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center">
          <p>About</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-[#C4A484] hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center">
          <p>Contact</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-[#C4A484] hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-8">
        {/* Cart with flyout */}
        <div
          className="relative h-fit w-fit cart-flyout"
          onMouseEnter={() => setCartFlyoutOpen(true)}
          onMouseLeave={() => setCartFlyoutOpen(false)}
        >
          <button
            className="relative text-[#3A3A3A]"
            onClick={() => navigate('/cart')}
          >
            <img src={assets.cart_icon} className="w-7 min-w-7" alt="" />
            <p className="absolute right-[3px] bottom-[12px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {getCartCount()}
            </p>
            {cartFlyoutOpen && (
              <span className="absolute -bottom-2 -left-2 -right-2 h-0.5 rounded-full bg-[#C4A484]"></span>
            )}
          </button>
          <AnimatePresence>
            {cartFlyoutOpen && (
              <motion.div
                className="absolute left-1/2 top-full mt-2 z-[100]"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                style={{ x: '-50%' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="absolute bg-transparent -left-0 -right-0 -top-10 h-10" />
                <div className="absolute border-t border-l left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#E6E4D8]" />
                {CartContent}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Account with flyout */}
        <div
          className="relative h-fit w-fit account-flyout"
          onMouseEnter={() => token && setAccountFlyoutOpen(true)}
          onMouseLeave={() => setAccountFlyoutOpen(false)}
        >
          <button
            className="relative text-[#3A3A3A]"
            onClick={() => navigate(token ? '/profile' : '/login')}
          >
            <img
              src={assets.login_icon}
              className="w-7 min-w-7 cursor-pointer"
              alt=""
            />
            {accountFlyoutOpen && token && (
              <span className="absolute -bottom-2 -left-2 -right-2 h-0.5 rounded-full bg-[#C4A484]"></span>
            )}
          </button>
          <AnimatePresence>
            {accountFlyoutOpen && token && (
              <motion.div
                className="absolute left-1/2 top-full mt-2 z-[100]"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                style={{ x: '-50%' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="absolute bg-transparent -left-0 -right-0 -top-10 h-10" />
                <div className="absolute border-t border-l left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#E6E4D8]" />
                <ProfileContent />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile menu button */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-7 min-w-7 cursor-pointer sm:hidden"
          alt=""
        />
      </div>

      {/* Mobile menu - ONLY RENDERED WHEN VISIBLE */}
      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed inset-0 z-[150]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-30"
              onClick={() => setVisible(false)}
            />
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white shadow-xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setVisible(false)}
                className="flex items-center gap-3 p-4 text-[#5c4b42] hover:bg-[#F5F0EB] w-full transition-colors"
                aria-label="Close menu"
              >
                <img
                  className="h-4 rotate-180"
                  src={assets.back_icon}
                  alt=""
                  aria-hidden="true"
                />
                <span className="font-medium">Menu</span>
              </button>

              <nav className="flex flex-col mt-2">
                {[
                  { path: '/', label: 'Home' },
                  { path: '/collection', label: 'Collection' },
                  { path: '/about', label: 'About' },
                  { path: '/contact', label: 'Contact' },
                ].map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setVisible(false)}
                    className={({ isActive }) =>
                      `py-3 px-6 border-b border-[#E8D9CC] text-[#5c4b42] transition-colors ${
                        isActive
                          ? 'bg-[#F5F0EB] font-medium'
                          : 'hover:bg-[#F9F5F2]'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              <div className="absolute bottom-0 w-full p-4 border-t border-[#C79790]">
                {token ? (
                  <>
                    <NavLink
                      to="/profile"
                      className="block py-2 text-center text-[#D6A7A0] hover:text-[#C79790]/50 transition-colors"
                      onClick={() => setVisible(false)}
                    >
                      My Profile
                    </NavLink>
                    <NavLink
                      to="/orders"
                      className="block py-2 text-center text-[#D6A7A0] hover:text-[#C79790]/50 transition-colors"
                      onClick={() => setVisible(false)}
                    >
                      My Orders
                    </NavLink>
                    <button
                      className="block py-2 text-center text-[#D6A7A0] hover:text-[#C79790]/50 transition-colors w-full"
                      onClick={() => {
                        logout();
                        setVisible(false);
                      }}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <NavLink
                    to="/login"
                    className="block py-2 text-center text-[#D6A7A0] hover:text-[#C79790]/50 transition-colors"
                    onClick={() => setVisible(false)}
                  >
                    Login
                  </NavLink>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
