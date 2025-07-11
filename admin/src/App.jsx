import React, { useEffect, useState } from 'react';
import Navbar from './componnents/Navbar';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddProduct from './pages/AddProduct';
import DisplayProducts from './pages/DisplayProducts';
import Orders from './pages/Orders';
import Login from './componnents/Login';
import Dashboard from './pages/Dashboard';
import ProductPreview from './componnents/ProductPreview';
import ProductEdit from './componnents/ProductEdit';

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem('token') ? localStorage.getItem('token') : ''
  );

  useEffect(() => {
    localStorage.setItem('token', token);
    console.log(token);
  }, [token]);

  return (
    <>
      <ToastContainer />
      {token === '' ? (
        <div className="flex justify-center w-full h-full">
          <Login setToken={setToken} />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row w-full min-h-screen ">
            <Navbar setToken={setToken} />
            <div className="ml-70 w-[80%] mx-auto my-8 text-base min-h-[100vh]">
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to={'/admin/dashboard'} replace />}
                />
                <Route
                  path="/admin/dashboard"
                  element={<Dashboard token={token} />}
                />
                <Route
                  path="/admin/addProduct"
                  element={<AddProduct token={token} />}
                />
                <Route
                  path="/admin/displayProducts"
                  element={<DisplayProducts token={token} />}
                />
                <Route
                  path="/admin/orders"
                  element={<Orders token={token} />}
                />
                <Route
                  path="*"
                  element={<Navigate to={'/admin/dashboard'} replace />}
                />

                <Route
                  path="/admin/product-preview/:productId"
                  element={<ProductPreview token={token} />}
                />
                <Route
                  path="/admin/product-edit/:productId"
                  element={<ProductEdit token={token} />}
                />
              </Routes>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default App;
