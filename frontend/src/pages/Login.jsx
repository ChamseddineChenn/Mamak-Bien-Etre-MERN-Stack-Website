import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const Login = () => {
  // State management
  const [currentState, setCurrentState] = useState('Sign Up');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Context
  const { token, setToken, navigate, backendURL } = useContext(ShopContext);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Reset form on state toggle
  useEffect(() => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setErrors({});
  }, [currentState]);

  // Redirect if authenticated
  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  useEffect(() => {
    if (!token && localStorage.getItem('token'))
      setToken(localStorage.getItem('token'));
  }, [setToken, token]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Sign Up specific validations
    if (currentState === 'Sign Up') {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Prepare request data
      const endpoint =
        currentState === 'Sign Up' ? '/api/user/register' : '/api/user/login';

      const payload =
        currentState === 'Sign Up'
          ? {
              fullName: formData.fullName.trim(),
              email: formData.email.trim().toLowerCase(),
              password: formData.password,
              confirmPassword: formData.confirmPassword,
            }
          : {
              email: formData.email.trim().toLowerCase(),
              password: formData.password,
            };

      // API call
      const response = await axios.post(
        `${backendURL}${endpoint}`,
        payload,
        { timeout: 10000 } // 10-second timeout
      );
      console.log(response.data);
      // Handle successful response
      if (response.data.success) {
        const authToken = response.data.token;
        setToken(authToken);
        localStorage.setItem('token', authToken);
        toast.success(
          currentState === 'Sign Up'
            ? 'Registration successful!'
            : 'Login successful!'
        );
      } else {
        toast.error(response.data.message || 'Authentication failed');
      }
    } catch (error) {
      // Handle different error types
      let errorMessage = 'Authentication error';

      if (error.response) {
        // Server responded with error status
        errorMessage =
          error.response.data.message ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        // No response received
        errorMessage = 'Network error - please check your connection';
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle between login/signup
  const toggleAuthState = () => {
    setCurrentState((prev) => (prev === 'Login' ? 'Sign Up' : 'Login'));
  };

  return (
    <div className="min-h-[100vh] flex flex-col items-center justify-start bg-[#F5F3EB] mt-19 pt-5 px-4">
      <form
        onSubmit={onSubmitHandler}
        noValidate // Disable browser validation to use custom
        className={`flex flex-col items-center w-full max-w-md px-8 py-10 rounded-xl gap-6 text-[#3A3A3A] bg-[#E6E4D8] shadow-lg ${
          currentState === 'Login' ? 'min-h-[50vh]' : 'min-h-[65vh]'
        }`}
        aria-label={currentState === 'Login' ? 'Login form' : 'Sign up form'}
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
            <div>
              <input
                name="fullName"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-[#F5F3EB] ${
                  errors.fullName
                    ? 'border-red-500'
                    : 'border-[#A6A58A] focus:ring-[#C4A484]'
                }`}
                placeholder="Full Name"
                type="text"
                required
                onChange={handleInputChange}
                value={formData.fullName}
                aria-label="Full Name"
                aria-invalid={!!errors.fullName}
                aria-describedby={
                  errors.fullName ? 'fullName-error' : undefined
                }
              />
              {errors.fullName && (
                <p id="fullName-error" className="text-red-500 text-sm mt-1">
                  {errors.fullName}
                </p>
              )}
            </div>
          )}

          <div>
            <input
              name="email"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-[#F5F3EB] ${
                errors.email
                  ? 'border-red-500'
                  : 'border-[#A6A58A] focus:ring-[#C4A484]'
              }`}
              placeholder="Email"
              type="email"
              required
              onChange={handleInputChange}
              value={formData.email}
              aria-label="Email Address"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div className="relative">
            <input
              name="password"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-[#F5F3EB] ${
                errors.password
                  ? 'border-red-500'
                  : 'border-[#A6A58A] focus:ring-[#C4A484]'
              }`}
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              required
              onChange={handleInputChange}
              value={formData.password}
              aria-label="Password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
            {errors.password && (
              <p id="password-error" className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {currentState === 'Sign Up' && (
            <div className="relative">
              <input
                name="confirmPassword"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-[#F5F3EB] ${
                  errors.confirmPassword
                    ? 'border-red-500'
                    : 'border-[#A6A58A] focus:ring-[#C4A484]'
                }`}
                placeholder="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                required
                onChange={handleInputChange}
                value={formData.confirmPassword}
                aria-label="Confirm Password"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword ? 'confirmPassword-error' : undefined
                }
              />
              {errors.confirmPassword && (
                <p
                  id="confirmPassword-error"
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#A6A58A] hover:bg-[#8A8970]'
          } text-white font-medium rounded-lg transition-colors duration-300 mt-4`}
          aria-busy={isSubmitting}
        >
          {isSubmitting
            ? 'Processing...'
            : currentState === 'Login'
            ? 'Sign In'
            : 'Create Account'}
        </button>

        {/* Footer Links */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center text-sm mt-4 gap-2">
          {currentState === 'Login' ? (
            <>
              <p className="text-[#5C4B42]">
                Forgot your password?{' '}
                <button
                  type="button"
                  className="text-[#D6A7A0] hover:underline cursor-pointer"
                  aria-label="Reset password"
                >
                  Click here!
                </button>
              </p>
              <button
                type="button"
                className="text-[#D6A7A0] hover:underline cursor-pointer"
                onClick={toggleAuthState}
                aria-label="Switch to sign up"
              >
                Create account
              </button>
            </>
          ) : (
            <button
              type="button"
              className="text-[#D6A7A0] hover:underline cursor-pointer"
              onClick={toggleAuthState}
              aria-label="Switch to login"
            >
              Already have an account? Login here
            </button>
          )}
        </div>
      </form>

      {/* Security Footer */}
      <div className="mt-10 text-center text-[#5C4B42]/60 text-sm">
        <p>Secure authentication with end-to-end encryption</p>
        <div className="flex justify-center gap-4 mt-4">
          <span className="text-xs bg-[#E6E4D8] px-2 py-1 rounded">
            🔒 SSL Secured
          </span>
          <span className="text-xs bg-[#E6E4D8] px-2 py-1 rounded">
            🛡️ Privacy Protected
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
