import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import { useTranslation } from 'react-i18next';

const Login = () => {
  // State management
  const [currentState, setCurrentState] = useState('Login');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  // Context
  const { token, setToken, navigate, mergeCarts, backendURL } =
    useContext(ShopContext);

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
    console.log('token :' + token);

    // insert the mergeCart function here ? but how ?
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
      newErrors.email = t('error_email_required');
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t('error_email_invalid');
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t('error_password_required');
    } else if (formData.password.length < 8) {
      newErrors.password = t('error_password_length');
    }

    // Sign Up specific validations
    if (currentState === 'Sign Up') {
      if (!formData.fullName.trim()) {
        newErrors.fullName = t('error_fullName_required');
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = t('error_confirmPassword_required');
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t('error_passwords_mismatch');
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
        mergeCarts();
        toast.success(
          currentState === 'Sign Up'
            ? t('registration_successful')
            : t('login_successful')
        );
      } else {
        toast.error(response.data.message || t('authentication_failed'));
      }
    } catch (error) {
      // Handle different error types
      let errorMessage = t('authentication_error');

      if (error.response) {
        // Server responded with error status
        errorMessage =
          error.response.data.message ||
          `${t('server_error')}: ${error.response.status}`;
      } else if (error.request) {
        // No response received
        errorMessage = t('network_error');
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

  // Get the translated title based on current state
  const getTranslatedTitle = () => {
    return currentState === 'Login' ? t('login') : t('sign_up');
  };

  return (
    <div className="min-h-[100vh] flex flex-col items-center justify-start bg-[#F5F3EB] mt-19 pt-5 px-4">
      <form
        onSubmit={onSubmitHandler}
        noValidate // Disable browser validation to use custom
        className={`flex flex-col items-center w-full max-w-md px-8 py-10 rounded-xl gap-6 text-[#3A3A3A] bg-[#E6E4D8] shadow-lg ${
          currentState === 'Login' ? 'min-h-[50vh]' : 'min-h-[65vh]'
        }`}
        aria-label={
          currentState === 'Login'
            ? t('login_form_aria')
            : t('signup_form_aria')
        }
      >
        {/* Header Section */}
        <div className="w-full text-center mb-6">
          <div className="inline-flex items-center justify-center gap-3">
            <hr className="border-none h-[1.5px] w-8 bg-[#C4A484] mt-2" />
            <h1 className="tinos-regular text-3xl text-[#5C4B42]">
              {getTranslatedTitle()}
            </h1>
            <hr className="border-none h-[1.5px] w-8 bg-[#C4A484] mt-2" />
          </div>
          <p className="text-[#5C4B42]/80 mt-2">
            {currentState === 'Login'
              ? t('welcome_back_message')
              : t('join_us_message')}
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
                placeholder={t('full_name_placeholder')}
                type="text"
                required
                onChange={handleInputChange}
                value={formData.fullName}
                aria-label={t('full_name_aria')}
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
              placeholder={t('email_placeholder')}
              type="email"
              required
              onChange={handleInputChange}
              value={formData.email}
              aria-label={t('email_aria')}
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
              placeholder={t('password_placeholder')}
              type={showPassword ? 'text' : 'password'}
              required
              onChange={handleInputChange}
              value={formData.password}
              aria-label={t('password_aria')}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full"
              aria-label={
                showPassword ? t('hide_password_aria') : t('show_password_aria')
              }
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
                placeholder={t('confirm_password_placeholder')}
                type={showPassword ? 'text' : 'password'}
                required
                onChange={handleInputChange}
                value={formData.confirmPassword}
                aria-label={t('confirm_password_aria')}
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
            ? t('processing')
            : currentState === 'Login'
            ? t('sign_in')
            : t('create_account')}
        </button>

        {/* Footer Links */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center text-sm mt-4 gap-2">
          {currentState === 'Login' ? (
            <>
              <p className="text-[#5C4B42]">
                {t('forgot_password')}{' '}
                <button
                  type="button"
                  className="text-[#D6A7A0] hover:underline cursor-pointer"
                  aria-label={t('reset_password_aria')}
                >
                  {t('click_here')}
                </button>
              </p>
              <button
                type="button"
                className="text-[#D6A7A0] hover:underline cursor-pointer"
                onClick={toggleAuthState}
                aria-label={t('switch_to_signup_aria')}
              >
                {t('create_account_link')}
              </button>
            </>
          ) : (
            <button
              type="button"
              className="text-[#D6A7A0] hover:underline cursor-pointer"
              onClick={toggleAuthState}
              aria-label={t('switch_to_login_aria')}
            >
              {t('already_have_account')}
            </button>
          )}
        </div>
      </form>

      {/* Security Footer */}
      <div className="mt-10 text-center text-[#5C4B42]/60 text-sm">
        <p>{t('secure_auth_message')}</p>
        <div className="flex justify-center gap-4 mt-4">
          <span className="text-xs bg-[#E6E4D8] px-2 py-1 rounded">
            🔒 {t('ssl_secured')}
          </span>
          <span className="text-xs bg-[#E6E4D8] px-2 py-1 rounded">
            🛡️ {t('privacy_protected')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
