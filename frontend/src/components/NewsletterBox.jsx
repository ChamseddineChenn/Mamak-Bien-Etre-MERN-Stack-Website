import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const NewsletterBox = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!email) {
      toast.warning('Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${backendURL}/api/newsletter/subscribe`,
        { email }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setEmail('');
      } else {
        toast.warning(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center py-10 bg-[#F9F5F2]">
      <p className="text-2xl font-medium text text-[#5c4b42]">
        {t('newsletter_title')}
      </p>
      <form
        className="w-[90%] sm:w-2/3 md:w-1/2 flex items-center gap-3 mx-auto my-6 border rounded-lg pl-3 bg-white"
        onSubmit={onSubmitHandler}
      >
        <input
          className="w-full sm:flex-1 outline-none py-3"
          type="email"
          placeholder={t('newsletter_placeholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          className="px-8 py-3 bg-[#f2b67b] hover:bg-[#e8a85f] text-[#5c4b42] font-medium rounded-tr-lg rounded-br-lg transition-colors duration-300 disabled:opacity-50"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? t('sending') : t('notify_me')}
        </button>
      </form>
      <p className="text-sm text-gray-600">{t('privacy_notice')}</p>
    </div>
  );
};

export default NewsletterBox;
