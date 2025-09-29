import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const NewsletterVerification = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('invalid');
        return;
      }

      try {
        const response = await axios.post(
          `${backendURL}/api/newsletter/verify`,
          { token }
        );

        if (response.data.success) {
          setStatus('success');
          toast.success(t('email_verified_success'));
        } else {
          setStatus('invalid');
          toast.warning(response.data.message);
        }
      } catch (error) {
        console.log(error.message);
        setStatus('error');
        toast.error(t('verification_failed'));
      }
    };

    verifyToken();
  }, [token, backendURL, t]);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D6A7A0] mx-auto mb-4"></div>
            <p>{t('verifying_email')}</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center">
            <svg
              className="w-16 h-16 text-green-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <h2 className="text-2xl font-bold text-[#5C4B42] mb-2">
              {t('verification_success_title')}
            </h2>
            <p>{t('verification_success_message')}</p>
          </div>
        );
      case 'invalid':
        return (
          <div className="text-center">
            <svg
              className="w-16 h-16 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
            <h2 className="text-2xl font-bold text-[#5C4B42] mb-2">
              {t('invalid_link_title')}
            </h2>
            <p>{t('invalid_link_message')}</p>
          </div>
        );
      case 'error':
      default:
        return (
          <div className="text-center">
            <svg
              className="w-16 h-16 text-yellow-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
            <h2 className="text-2xl font-bold text-[#5C4B42] mb-2">
              {t('verification_error_title')}
            </h2>
            <p>{t('verification_error_message')}</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F5F2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        {renderContent()}
      </div>
    </div>
  );
};

export default NewsletterVerification;
