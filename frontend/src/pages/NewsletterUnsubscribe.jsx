import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import { useTranslation } from 'react-i18next';

const NewsletterUnsubscribe = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { backendURL } = useContext(ShopContext);

  const handleUnsubscribe = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.warning(t('enter_email_warning'));
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${backendURL}/api/newsletter/unsubscribe`,
        { email }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/');
      } else {
        toast.warning(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t('unsubscribe_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F5F2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#5C4B42]">
            {t('unsubscribe_title')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('unsubscribe_message')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleUnsubscribe}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                {t('email_address')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#D6A7A0] focus:border-[#D6A7A0] focus:z-10 sm:text-sm"
                placeholder={t('email_placeholder')}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#D6A7A0] hover:bg-[#C79790] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D6A7A0] disabled:opacity-50"
            >
              {isLoading ? t('processing') : t('unsubscribe_button')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsletterUnsubscribe;
