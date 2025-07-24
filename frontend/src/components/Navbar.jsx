import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets.js';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
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
  } = useContext(ShopContext);

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
  };

  const FlyoutLink = ({
    children,
    path,
    FlyoutContent,
    requiresToken = true,
  }) => {
    const [open, setOpen] = useState(false);
    const showFlyout = open && FlyoutContent && (requiresToken ? token : true);

    return (
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="relative h-fit w-fit"
      >
        <button
          className="relative text-[#3A3A3A]"
          onClick={() => navigate(path)}
        >
          {children}
          {showFlyout && (
            <span
              className="absolute -bottom-2 -left-2 -right-2 h-0.5 rounded-full bg-[#C4A484] transition-transform duration-300 ease-out"
              style={{ transform: open ? 'scaleX(1)' : 'scaleX(0)' }}
            ></span>
          )}
        </button>
        <AnimatePresence>
          {showFlyout && (
            <motion.div
              className="absolute left-1/2 top-17 md:top-15 z-50"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              style={{ x: '-50%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="absolute bg-transparent -left-0 -right-0 -top-10 h-10" />
              <div className="absolute border-t border-l left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#E6E4D8]" />
              <FlyoutContent />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const ProfileContent = () => {
    return (
      <div className="bg-[#E6E4D8] border rounded-xl">
        <div className="flex flex-col  gap-2 w-36 py-3 px-5 text-[#3A3A3A]">
          <p
            className="cursor-pointer hover:text-black"
            onClick={() => navigate('/profile')}
          >
            My Profile
          </p>
          <p
            className="cursor-pointer hover:text-black"
            onClick={() => navigate('/orders')}
          >
            Orders
          </p>
          <p className="cursor-pointer hover:text-black" onClick={logout}>
            Logout
          </p>
        </div>
      </div>
    );
  };

  const CartContent = () => {
    // Create an array of cart items with product details
    const cartItemsArray = Object.entries(cartItems)
      .map(([itemId, quantity]) => {
        // Find the product in the products array
        const product = products.find((p) => p._id === itemId);
        if (!product) return null;

        return {
          id: itemId,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        };
      })
      .filter((item) => item !== null); // Remove any items that couldn't be found

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
                      <h4 className="font-medium text-sm text-[#3A3A3A] overfl">
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
                onClick={() => navigate('/cart')}
              >
                View Cart
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

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
      <div className="flex items-center gap-8 ">
        <FlyoutLink
          className="relative"
          path={'/cart'}
          FlyoutContent={CartContent}
          requiresToken={false}
        >
          <img src={assets.cart_icon} className="w-7 min-w-7" alt="" />
          <p className="absolute right-[3px] bottom-[12px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </FlyoutLink>
        <div className="group relative z-5">
          <FlyoutLink
            path={token ? '/profile' : '/login'}
            FlyoutContent={ProfileContent}
            requiresToken={true}
          >
            <img
              src={assets.login_icon}
              className="w-7 min-w-7 cursor-pointer"
              alt=""
            />
          </FlyoutLink>
        </div>

        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-7 min-w-7 cursor-pointer sm:hidden"
          alt=""
        />
      </div>
      {/* added this div for sidebar menu for small screen devices */}
      <div
        className={`fixed inset-0 bg-transparent z-50 transition-all duration-300 ease-in-out transform ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Overlay close area (click outside to close) */}
        <div
          className="absolute inset-0 bg-transparent bg-opacity-10"
          onClick={() => setVisible(false)}
        />

        {/* Menu content */}
        <div className="relative w-4/5 max-w-sm h-full bg-white shadow-xl ml-auto">
          {/* Close button */}
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

          {/* Navigation links */}
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
                    isActive ? 'bg-[#F5F0EB] font-medium' : 'hover:bg-[#F9F5F2]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Optional: Additional menu items */}
          <div className="absolute bottom-0 w-full p-4 border-t border-[#C79790]">
            <NavLink
              to="/login"
              className="block py-2 text-center text-[#D6A7A0] hover:text-[#C79790]/50 transition-colors"
              onClick={() => setVisible(false)}
            >
              Login
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
