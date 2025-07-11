import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendURL } from '../constants/Exports.js';
import { toast } from 'react-toastify';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        backendURL + '/api/user/administratorLogin',
        {
          email,
          password,
        }
      );
      if (response.data.success) {
        setToken(response.data.token);
        navigate('/admin/dashboard');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-[100vh] min-w-[100vw] flex flex-col items-center justify-start bg-[#F5F3EB] pt-25 px-4">
      <form
        className="flex flex-col items-center w-full max-w-md px-8 py-10 rounded-xl gap-6 text-[#3A3A3A] bg-[#E6E4D8] shadow-lg min-h-[50vh]'
        "
        onSubmit={onSubmitHandler}
      >
        {/* Header Section */}
        <div className="w-full text-center mb-6">
          <div className="inline-flex items-center justify-center gap-3">
            <hr className="border-none h-[1.5px] w-8 bg-[#C4A484] mt-2" />
            <h1 className="tinos-regular text-3xl text-[#5C4B42]">
              Administrator's Panel
            </h1>
            <hr className="border-none h-[1.5px] w-8 bg-[#C4A484] mt-2" />
          </div>
        </div>

        {/* Form Fields */}
        <div className="w-full space-y-4">
          <input
            className="w-full px-4 py-3 border border-[#A6A58A] rounded-lg focus:outline-none focus:ring-2 bg-[#F5F3EB] focus:ring-[#C4A484]"
            placeholder="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          <input
            className="w-full px-4 py-3 border border-[#A6A58A] rounded-lg focus:outline-none focus:ring-2 bg-[#F5F3EB] focus:ring-[#C4A484]"
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-[#A6A58A] hover:bg-[#8A8970] text-white font-medium rounded-lg transition-colors duration-300 mt-4"
        >
          Sign In
        </button>

        {/* Footer Links */}
      </form>

      {/* Decorative Elements */}
      <div className="mt-10 text-center text-[#5C4B42]/60 text-sm">
        <p>Secure authentication powered by our platform</p>
        <div className="flex justify-center gap-4 mt-4">
          {/* Add any trust badges or icons here */}
        </div>
      </div>
    </div>
  );
};

export default Login;
