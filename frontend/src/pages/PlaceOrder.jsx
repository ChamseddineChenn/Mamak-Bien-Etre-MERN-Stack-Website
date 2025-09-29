import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import CartTotal from '../components/CartTotal';
import Title from '../components/Title';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const PlaceOrder = () => {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const {
    navigate,
    cartItems,
    createOrder,
    userDeliveryAddress,
    backendURL,
    token,
    user,
    sessionId,
    getCartTotal,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    recipientName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Tunisia',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form with saved address if available
  useEffect(() => {
    if (userDeliveryAddress || !token) {
      if (userDeliveryAddress) {
        setFormData({
          recipientName: userDeliveryAddress.recipientName || '',
          street: userDeliveryAddress.street || '',
          city: userDeliveryAddress.city || '',
          state: userDeliveryAddress.state || '',
          zipCode: userDeliveryAddress.zipCode || '',
          country: userDeliveryAddress.country || 'Tunisia',
          phoneNumber: userDeliveryAddress.phoneNumber || '',
        });
      }
      setIsLoading(false);
    }
  }, [userDeliveryAddress, token]);

  // Disable COD for non-Tunisian addresses
  useEffect(() => {
    if (formData.country !== 'Tunisia' && paymentMethod === 'cod') {
      setPaymentMethod('card');
      toast.info(t('cod_only_tunisia'));
    }
  }, [formData.country, paymentMethod, t]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'recipientName',
      'street',
      'city',
      'zipCode',
      'phoneNumber',
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === '') {
        newErrors[field] = t('field_required');
      }
    });

    if (
      formData.phoneNumber &&
      !/^\+?\d{7,15}$/.test(formData.phoneNumber.replace(/[^\d+]/g, ''))
    ) {
      newErrors.phoneNumber = t('invalid_phone_format');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    return getCartTotal() + 10; // Cart total + delivery fee
  };

  const handleCardPayment = async () => {
    try {
      setIsSubmitting(true);

      // Prepare order data without creating it in DB
      const orderData = {
        userId: user?._id,
        sessionId: sessionId,
        address: formData,
        items: Object.values(cartItems).map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          priceAtOrder: item.price,
          name: item.name,
        })),
        totalAmount: calculateTotal(),
        deliveryFee: 10,
        paymentMethod: paymentMethod,
        userEmail: user?.email,
      };

      // Initiate payment with Konnect
      const response = await axios.post(
        `${backendURL}/api/payment/konnect/initiate`,
        { orderData },
        { headers: { token } }
      );

      if (response.data.success && response.data.paymentUrl) {
        // Redirect to payment gateway
        window.location.href = response.data.paymentUrl;
      } else {
        throw new Error(t('payment_initiation_failed'));
      }
    } catch (error) {
      console.error('Card payment error:', error);
      toast.error(
        `${t('payment_failed')}: ${
          error.response?.data?.message || error.message
        }`
      );
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (paymentMethod === 'cod') {
      // Handle COD normally
      try {
        setIsSubmitting(true);
        const order = await createOrder({
          address: formData,
          paymentMethod,
        });
        navigate(`/order-confirmation/${order._id}`);
      } catch (error) {
        toast.error(`${t('order_creation_failed')}: ${error.message}`);
        setIsSubmitting(false);
      }
    } else {
      // Handle online payment
      await handleCardPayment();
    }
  };

  const useSavedAddress = () => {
    if (userDeliveryAddress) {
      setFormData({
        recipientName: userDeliveryAddress.recipientName || '',
        street: userDeliveryAddress.street || '',
        city: userDeliveryAddress.city || '',
        state: userDeliveryAddress.state || '',
        zipCode: userDeliveryAddress.zipCode || '',
        country: userDeliveryAddress.country || 'Tunisia',
        phoneNumber: userDeliveryAddress.phoneNumber || '',
      });
      toast.info(t('saved_address_loaded'));
    } else {
      toast.warning(t('no_saved_address'));
    }
  };

  const useNewAddress = () => {
    setFormData({
      recipientName: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Tunisia',
      phoneNumber: '',
    });
    toast.info(t('insert_new_address'));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[100vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-[#A6A58A]"></div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row justify-between gap-8 m-6 md:m-10 pt-19 px-4 md:px-10 min-h-[100vh]"
    >
      {/* Left Side - Address Form */}
      <div className="flex flex-col gap-6 w-full md:max-w-[480px]">
        <div className="mb-4">
          <Title primaryText={t('order')} secondaryText={t('information')} />
        </div>

        {userDeliveryAddress && (
          <div className="mb-4 flex gap-5">
            <button
              type="button"
              onClick={useSavedAddress}
              className={`text-sm font-medium flex items-center px-3 py-2 rounded-lg ${
                formData.recipientName === userDeliveryAddress.recipientName
                  ? 'bg-[#A6A58A] text-white'
                  : 'text-[#A6A58A] hover:bg-gray-100'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {t('use_saved_address')}
            </button>
            <button
              type="button"
              onClick={useNewAddress}
              className={`text-sm font-medium flex items-center px-3 py-2 rounded-lg ${
                formData.recipientName === ''
                  ? 'bg-[#A6A58A] text-white'
                  : 'text-[#A6A58A] hover:bg-gray-100'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              {t('use_new_address')}
            </button>
          </div>
        )}

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('recipient_name')} *
          </label>
          <input
            className={`w-full px-4 py-2.5 border rounded-lg ${
              errors.recipientName
                ? 'border-red-500'
                : 'border-gray-300 focus:border-[#A6A58A]'
            } focus:outline-none focus:ring-1 focus:ring-[#A6A58A]`}
            type="text"
            name="recipientName"
            placeholder={t('full_name_placeholder')}
            value={formData.recipientName}
            onChange={handleInputChange}
          />
          {errors.recipientName && (
            <p className="text-red-500 text-xs mt-1">{errors.recipientName}</p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('street_address')} *
          </label>
          <input
            className={`w-full px-4 py-2.5 border rounded-lg ${
              errors.street
                ? 'border-red-500'
                : 'border-gray-300 focus:border-[#A6A58A]'
            } focus:outline-none focus:ring-1 focus:ring-[#A6A58A]`}
            type="text"
            name="street"
            placeholder={t('street_placeholder')}
            value={formData.street}
            onChange={handleInputChange}
          />
          {errors.street && (
            <p className="text-red-500 text-xs mt-1">{errors.street}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('city_label')} *
            </label>
            <input
              className={`w-full px-4 py-2.5 border rounded-lg ${
                errors.city
                  ? 'border-red-500'
                  : 'border-gray-300 focus:border-[#A6A58A]'
              } focus:outline-none focus:ring-1 focus:ring-[#A6A58A]`}
              type="text"
              name="city"
              placeholder={t('city_placeholder')}
              value={formData.city}
              onChange={handleInputChange}
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('state_label')}
            </label>
            <input
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A6A58A] focus:border-[#A6A58A]"
              type="text"
              name="state"
              placeholder={t('state_placeholder')}
              value={formData.state}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('postal_code')} *
            </label>
            <input
              className={`w-full px-4 py-2.5 border rounded-lg ${
                errors.zipCode
                  ? 'border-red-500'
                  : 'border-gray-300 focus:border-[#A6A58A]'
              } focus:outline-none focus:ring-1 focus:ring-[#A6A58A]`}
              type="text"
              name="zipCode"
              placeholder={t('postal_code_placeholder')}
              value={formData.zipCode}
              onChange={handleInputChange}
            />
            {errors.zipCode && (
              <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('country_label')}
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A6A58A] focus:border-[#A6A58A]"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
            >
              <option value="Tunisia">Tunisia</option>
              <option value="Algeria">Algeria</option>
              <option value="Libya">Libya</option>
              <option value="Morocco">Morocco</option>
              <option value="Egypt">Egypt</option>
              <option value="Other">{t('other')}</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('phone_number')} *
          </label>
          <input
            className={`w-full px-4 py-2.5 border rounded-lg ${
              errors.phoneNumber
                ? 'border-red-500'
                : 'border-gray-300 focus:border-[#A6A58A]'
            } focus:outline-none focus:ring-1 focus:ring-[#A6A58A]`}
            type="tel"
            name="phoneNumber"
            placeholder={t('phone_placeholder')}
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
          )}
        </div>
      </div>

      {/* Right Side - Order Summary & Payment */}
      <div className="w-full md:w-[40%] min-w-[300px] mt-8 md:mt-0">
        <div className="mb-8">
          <CartTotal />
        </div>

        <div className="mt-8">
          <Title primaryText={t('payment')} secondaryText={t('method')} />
        </div>

        <div className="flex flex-col gap-4 text-[#3A3A3A] mt-4">
          <div
            className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${
              paymentMethod === 'card'
                ? 'border-2 border-[#A6A58A] bg-[#F5F3EB]'
                : 'border border-[#E6E4D8] hover:border-[#A6A58A]'
            }`}
            onClick={() => setPaymentMethod('card')}
          >
            <div
              className={`min-w-6 h-6 rounded-full flex items-center justify-center ${
                paymentMethod === 'card'
                  ? 'bg-[#A6A58A]'
                  : 'border border-[#A6A58A]'
              }`}
            >
              {paymentMethod === 'card' && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-8 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <p className="text-sm">{t('online_payment')}</p>
            </div>
          </div>

          <div
            className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${
              formData.country === 'Tunisia'
                ? paymentMethod === 'cod'
                  ? 'border-2 border-[#A6A58A] bg-[#F5F3EB]'
                  : 'border border-[#E6E4D8] hover:border-[#A6A58A]'
                : 'opacity-50 cursor-not-allowed border border-gray-200'
            }`}
            onClick={() => {
              if (formData.country === 'Tunisia') {
                setPaymentMethod('cod');
              }
            }}
          >
            <div
              className={`min-w-6 h-6 rounded-full flex items-center justify-center ${
                formData.country === 'Tunisia'
                  ? paymentMethod === 'cod'
                    ? 'bg-[#A6A58A]'
                    : 'border border-[#A6A58A]'
                  : 'border border-gray-400'
              }`}
            >
              {paymentMethod === 'cod' && formData.country === 'Tunisia' && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div>
              <p>{t('cash_on_delivery')}</p>
              {formData.country !== 'Tunisia' && (
                <p className="text-xs text-red-500 mt-1">
                  {t('cod_only_tunisia')}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="w-full mt-10">
          <button
            type="submit"
            disabled={
              isSubmitting ||
              Object.keys(cartItems).length === 0 ||
              (paymentMethod === 'cod' && formData.country !== 'Tunisia')
            }
            className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${
              isSubmitting ||
              Object.keys(cartItems).length === 0 ||
              (paymentMethod === 'cod' && formData.country !== 'Tunisia')
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#A6A58A] hover:bg-[#8a896d]'
            }`}
          >
            {isSubmitting
              ? t('processing_order')
              : paymentMethod === 'cod'
              ? t('place_order')
              : t('proceed_to_payment')}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
