import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets.js';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext.jsx';

const Navbar = () => {
  const { cartItems } = useState(ShopContext);
  const [visible, setVisible] = useState(false);
  const [shoppingCartItemsCount, setShoppingCartItemsCount] = useState(0);

  useEffect(() => {}, [cartItems]);

  return (
    <div className="fixed top-0 left-0 w-full shadow-md flex items-center justify-between ps-4 sm:ps-[5vw] pe-4 sm:pe-[5vw] ms-auto py-2 font-medium bg-[#E6E4D8] z-50">
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="" />
      </Link>
      <ul className="hidden sm:flex gap-5 text-sm text-[#5c4b42] tinos-bold text-[16px]">
        <NavLink to="/" className="flex flex-col items-center gap-1">
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
          <img
            src={assets.login_icon}
            className="w-7 min-w-7 cursor-pointer"
            alt=""
          />
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-0">
            <div className="flex flex-col  gap-2 w-36 py-3 px-5 bg-amber-100 text-[#5c4b42]">
              <p className="cursor-pointer hover:text-black">My Profile</p>
              <p className="cursor-pointer hover:text-black">Orders</p>
              <p className="cursor-pointer hover:text-black">Logout</p>
            </div>
          </div>
        </div>

        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-7 min-w-7" alt="" />
          <p className="absolute right-[3px] bottom-[12px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            0
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
