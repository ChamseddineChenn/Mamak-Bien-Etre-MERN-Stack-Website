import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets.js';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { getCartCount, navigate } = useContext(ShopContext);

  const FlyoutLink = ({ children, path, FlyoutContent }) => {
    const [open, setOpen] = useState(false);
    const showFlyout = open && FlyoutContent;

    return (
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="relative h-fit w-fit"
      >
        <button
          className="elative text-[#3A3A3A]"
          onClick={() => navigate(path)}
        >
          {children}
          <span
            className="absolute -bottom-2 -left-2 -right-2 h-0.5 rounded-full bg-[#C4A484] transition-transform duration-300 ease-out"
            style={{ transform: open ? 'scaleX(1)' : 'scaleX(0)' }}
          ></span>
        </button>
        <AnimatePresence>
          {showFlyout && (
            <motion.div
              className="absolute left-1/2 top-17 md:top-15"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              style={{ x: '-50%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="absolute bg-transparent -left-0 -right-0 -top-10 h-10" />
              <div className="absolute border-t border-l  left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#E6E4D8]" />
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
          <p className="cursor-pointer hover:text-black">My Profile</p>
          <p className="cursor-pointer hover:text-black">Orders</p>
          <p className="cursor-pointer hover:text-black">Logout</p>
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
      <div className="flex items-center gap-6">
        <div className="group relative z-5">
          <FlyoutLink path={'/login'} FlyoutContent={() => ProfileContent()}>
            <img
              src={assets.login_icon}
              className="w-7 min-w-7 cursor-pointer"
              alt=""
            />
          </FlyoutLink>
        </div>

        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-7 min-w-7" alt="" />
          <p className="absolute right-[3px] bottom-[12px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-7 min-w-7 cursor-pointer sm:hidden"
          alt=""
        />
      </div>
      {/* added this div for sidebar menu for small screen devices */}
      <div
        className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white transition-all z-10 ${
          visible ? 'w-full' : 'w-0'
        }`}
      >
        <div className="flex flex-col text-[#5c4b42] z-10">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img className="h-4 rotate-180" src={assets.back_icon} alt="" />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/collection"
          >
            Collection
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/about"
          >
            About
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border"
            to="/contact"
          >
            Contact
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
