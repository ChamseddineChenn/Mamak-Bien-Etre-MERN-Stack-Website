import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';

const Navbar = ({ setToken }) => {
  const location = useLocation();
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  // Automatically close dropdowns when navigating away from their sections
  useEffect(() => {
    // Close products dropdown if not on a product-related page
    if (!location.pathname.startsWith('/admin/products')) {
      setIsProductsOpen(false);
    }

    // Close orders dropdown if not on an orders-related page
    if (!location.pathname.startsWith('/admin/orders')) {
      setIsOrdersOpen(false);
    }
  }, [location]);

  // Toggle functions with auto-close for other dropdowns
  const toggleProductsMenu = () => {
    setIsProductsOpen(!isProductsOpen);
    if (!isProductsOpen) setIsOrdersOpen(false);
  };

  const toggleOrdersMenu = () => {
    setIsOrdersOpen(!isOrdersOpen);
    if (!isOrdersOpen) setIsProductsOpen(false);
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-[#E6E4D8] text-[#3A3A3A] flex flex-col overflow-hidden shadow-2xl">
      {/* Logo at the top */}
      <Link
        to="/admin"
        className="p-4 border-b border-[#A6A58A] flex items-center justify-start transition-colors"
      >
        <img
          src={assets.admin_panel_logo}
          alt="Admin Logo"
          className="w-full"
        />
      </Link>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="px-2 space-y-1">
          <li className="rounded bg-[#A6A58A]">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-[#D6A7A0]' : 'hover:bg-[#D6A7A0]/80'
                }`
              }
            >
              <img
                src={assets.dashboard_icon}
                alt="Dashboard"
                className="h-5 w-5 mr-3"
              />
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/* Products Dropdown */}
          <li className="rounded bg-[#A6A58A]">
            <div
              className={`flex items-center p-3 rounded-lg transition-colors cursor-pointer ${
                location.pathname.startsWith('/admin/products')
                  ? 'bg-[#D6A7A0]'
                  : 'hover:bg-[#D6A7A0]/80'
              }`}
              onClick={toggleProductsMenu}
            >
              <img
                src={assets.products_icon}
                alt="Products"
                className="h-5 w-5 mr-3"
              />
              <span className="flex-1">Manage Products</span>
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${
                  isProductsOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Dropdown Content */}
            {isProductsOpen && (
              <div className="pl-4 pr-2 pb-2 mt-1 space-y-1">
                <NavLink
                  to="/admin/addProduct"
                  className={({ isActive }) =>
                    `flex items-center p-2 pl-8 rounded-lg transition-colors ${
                      isActive ? 'bg-[#D6A7A0]' : 'hover:bg-[#D6A7A0]/60'
                    }`
                  }
                >
                  <svg
                    className="h-4 w-4 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>Add Product</span>
                </NavLink>

                <NavLink
                  to="/admin/displayProducts"
                  className={({ isActive }) =>
                    `flex items-center p-2 pl-8 rounded-lg transition-colors ${
                      isActive ? 'bg-[#D6A7A0]' : 'hover:bg-[#D6A7A0]/60'
                    }`
                  }
                >
                  <svg
                    className="h-4 w-4 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span>Display Products</span>
                </NavLink>
              </div>
            )}
          </li>

          {/* Orders Dropdown */}
          <li className="rounded bg-[#A6A58A]">
            <div
              className={`flex items-center p-3 rounded-lg transition-colors cursor-pointer ${
                location.pathname.startsWith('/admin/orders')
                  ? 'bg-[#D6A7A0]'
                  : 'hover:bg-[#D6A7A0]/80'
              }`}
              onClick={toggleOrdersMenu}
            >
              <img
                src={assets.orders_icon}
                alt="Orders"
                className="h-5 w-5 mr-3"
              />
              <span className="flex-1">Manage Orders</span>
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${
                  isOrdersOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Dropdown Content */}
            {isOrdersOpen && (
              <div className="pl-4 mt-1 space-y-1">
                <NavLink
                  to="/admin/orders/pending"
                  className={({ isActive }) =>
                    `flex items-center p-2 pl-8 rounded-lg transition-colors ${
                      isActive ? 'bg-[#D6A7A0]' : 'hover:bg-[#D6A7A0]/60'
                    }`
                  }
                >
                  <svg
                    className="h-4 w-4 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span>Pending Orders</span>
                </NavLink>

                <NavLink
                  to="/admin/orders/completed"
                  className={({ isActive }) =>
                    `flex items-center p-2 pl-8 rounded-lg transition-colors ${
                      isActive ? 'bg-[#D6A7A0]' : 'hover:bg-[#D6A7A0]/60'
                    }`
                  }
                >
                  <svg
                    className="h-4 w-4 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Completed Orders</span>
                </NavLink>

                <NavLink
                  to="/admin/orders/cancelled"
                  className={({ isActive }) =>
                    `flex items-center p-2 pl-8 rounded-lg transition-colors ${
                      isActive ? 'bg-[#D6A7A0]' : 'hover:bg-[#D6A7A0]/60'
                    }`
                  }
                >
                  <svg
                    className="h-4 w-4 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Cancelled Orders</span>
                </NavLink>
              </div>
            )}
          </li>

          <li className="rounded bg-[#A6A58A]">
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-[#D6A7A0]' : 'hover:bg-[#D6A7A0]/80'
                }`
              }
            >
              <img
                src={assets.users_icon}
                alt="Users"
                className="h-5 w-5 mr-3"
              />
              <span>Manage Users</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto p-2 border-t border-[#A6A58A]">
        <ul className="space-y-1">
          <li className="rounded bg-[#A6A58A]">
            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-[#D6A7A0]' : 'hover:bg-[#D6A7A0]/80'
                }`
              }
            >
              <img
                src={assets.settings_icon}
                alt="Settings"
                className="h-5 w-5 mr-3"
              />
              <span>Settings</span>
            </NavLink>
          </li>

          <li className="rounded bg-[#A6A58A] ">
            <Link
              to="/"
              className="flex items-center p-3 rounded-lg hover:bg-[#D6A7A0]/80 transition-colors "
              onClick={() => setToken('')}
            >
              <img
                src={assets.logout_icon}
                alt="Logout"
                className="h-5 w-5 mr-3"
              />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
