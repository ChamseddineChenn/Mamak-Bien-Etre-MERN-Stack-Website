import React, { useState } from 'react';

const Login = () => {
  const [currentState, setCurrentState] = useState('Sign Up');

  return (
    <div className="min-h-[100vh] flex flex-col items-center justify-start bg-[#F5F3EB] mt-19 pt-5 px-4">
      <form
        className={`flex flex-col items-center w-full max-w-md px-8 py-10 rounded-xl gap-6 text-[#3A3A3A] bg-[#E6E4D8] shadow-lg ${
          currentState === 'Login' ? 'min-h-[50vh]' : 'min-h-[65vh]'
        }`}
      >
        {/* Header Section */}
        <div className="w-full text-center mb-6">
          <div className="inline-flex items-center justify-center gap-3">
            <hr className="border-none h-[1.5px] w-8 bg-[#C4A484] mt-2" />
            <h1 className="tinos-regular text-3xl text-[#5C4B42]">
              {currentState}
            </h1>
            <hr className="border-none h-[1.5px] w-8 bg-[#C4A484] mt-2" />
          </div>
          <p className="text-[#5C4B42]/80 mt-2">
            {currentState === 'Login'
              ? 'Welcome back! Please enter your details'
              : 'Join us today! Create your account'}
          </p>
        </div>

        {/* Form Fields */}
        <div className="w-full space-y-4">
          {currentState === 'Sign Up' && (
            <input
              className="w-full px-4 py-3 border border-[#A6A58A] rounded-lg focus:outline-none focus:ring-2 bg-[#F5F3EB] focus:ring-[#C4A484]"
              placeholder="Full Name"
              type="text"
              required
            />
          )}
          <input
            className="w-full px-4 py-3 border border-[#A6A58A] rounded-lg focus:outline-none focus:ring-2 bg-[#F5F3EB] focus:ring-[#C4A484]"
            placeholder="Email"
            type="email"
            required
          />
          <input
            className="w-full px-4 py-3 border border-[#A6A58A] rounded-lg focus:outline-none focus:ring-2 bg-[#F5F3EB] focus:ring-[#C4A484]"
            placeholder="Password"
            type="password"
            required
          />
          {currentState === 'Sign Up' && (
            <input
              className="w-full px-4 py-3 border border-[#A6A58A] rounded-lg focus:outline-none focus:ring-2 bg-[#F5F3EB] focus:ring-[#C4A484]"
              placeholder="Confirm Password"
              type="password"
              required
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-[#A6A58A] hover:bg-[#8A8970] text-white font-medium rounded-lg transition-colors duration-300 mt-4"
        >
          {currentState === 'Login' ? 'Sign In' : 'Create Account'}
        </button>

        {/* Footer Links */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center text-sm mt-4 gap-2">
          {currentState === 'Login' ? (
            <>
              <p className="text-[#5C4B42]">
                Forgot your password?{' '}
                <button className="text-[#D6A7A0] hover:underline cursor-pointer">
                  Click here!
                </button>
              </p>
              <button
                className="text-[#D6A7A0] hover:underline cursor-pointer"
                onClick={() => setCurrentState('Sign Up')}
                type="button"
              >
                Create account
              </button>
            </>
          ) : (
            <button
              className="text-[#D6A7A0] hover:underline cursor-pointer"
              onClick={() => setCurrentState('Login')}
              type="button"
            >
              Already have an account? Login here
            </button>
          )}
        </div>
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
