import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import CartTotal from '../components/CartTotal';
import Title from '../components/Title';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const { navigate, cartItems, createOrder, userDeliveryAddress, token } =
    useContext(ShopContext);

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
    // Check if user data is available
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
        newErrors[field] = 'This field is required';
      }
    });

    if (
      formData.phoneNumber &&
      !/^\+?\d{7,15}$/.test(formData.phoneNumber.replace(/[^\d+]/g, ''))
    ) {
      newErrors.phoneNumber = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(cartItems).length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const order = await createOrder({
        address: formData,
        paymentMethod,
      });

      if (order) {
        navigate(`/order-confirmation/${order._id}`);
      }
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error(`Failed to place order: ${error.message}`);
    } finally {
      setIsSubmitting(false);
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
      toast.info('Saved address loaded');
    } else {
      toast.warning('No saved address found');
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
    toast.info('Insert new address!');
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
          <Title primaryText={'Order'} secondaryText={'Information'} />
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
              Use Saved Address
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
              Use New Address
            </button>
          </div>
        )}

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Name *
          </label>
          <input
            className={`w-full px-4 py-2.5 border rounded-lg ${
              errors.recipientName
                ? 'border-red-500'
                : 'border-gray-300 focus:border-[#A6A58A]'
            } focus:outline-none focus:ring-1 focus:ring-[#A6A58A]`}
            type="text"
            name="recipientName"
            placeholder="Full Name"
            value={formData.recipientName}
            onChange={handleInputChange}
          />
          {errors.recipientName && (
            <p className="text-red-500 text-xs mt-1">{errors.recipientName}</p>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Address *
          </label>
          <input
            className={`w-full px-4 py-2.5 border rounded-lg ${
              errors.street
                ? 'border-red-500'
                : 'border-gray-300 focus:border-[#A6A58A]'
            } focus:outline-none focus:ring-1 focus:ring-[#A6A58A]`}
            type="text"
            name="street"
            placeholder="Street and building number"
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
              City *
            </label>
            <input
              className={`w-full px-4 py-2.5 border rounded-lg ${
                errors.city
                  ? 'border-red-500'
                  : 'border-gray-300 focus:border-[#A6A58A]'
              } focus:outline-none focus:ring-1 focus:ring-[#A6A58A]`}
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <input
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A6A58A] focus:border-[#A6A58A]"
              type="text"
              name="state"
              placeholder="State/Province"
              value={formData.state}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code *
            </label>
            <input
              className={`w-full px-4 py-2.5 border rounded-lg ${
                errors.zipCode
                  ? 'border-red-500'
                  : 'border-gray-300 focus:border-[#A6A58A]'
              } focus:outline-none focus:ring-1 focus:ring-[#A6A58A]`}
              type="text"
              name="zipCode"
              placeholder="Postal code"
              value={formData.zipCode}
              onChange={handleInputChange}
            />
            {errors.zipCode && (
              <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
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
            </select>
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            className={`w-full px-4 py-2.5 border rounded-lg ${
              errors.phoneNumber
                ? 'border-red-500'
                : 'border-gray-300 focus:border-[#A6A58A]'
            } focus:outline-none focus:ring-1 focus:ring-[#A6A58A]`}
            type="tel"
            name="phoneNumber"
            placeholder="e.g., +21612345678"
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
          <Title primaryText={'Payment'} secondaryText={'Method'} />
        </div>

        <div className="flex flex-col gap-4 text-[#3A3A3A] mt-4">
          <div className="flex gap-4 flex-col lg:flex-row">
            <div
              className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'icc'
                  ? 'border-2 border-[#A6A58A] bg-[#F5F3EB]'
                  : 'border border-[#E6E4D8] hover:border-[#A6A58A]'
              }`}
              onClick={() => setPaymentMethod('icc')}
            >
              <div
                className={`min-w-6 h-6 rounded-full flex items-center justify-center ${
                  paymentMethod === 'icc'
                    ? 'bg-[#A6A58A]'
                    : 'border border-[#A6A58A]'
                }`}
              >
                {paymentMethod === 'icc' && (
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
                <p className="text-sm">International Credit Card</p>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'ncc'
                  ? 'border-2 border-[#A6A58A] bg-[#F5F3EB]'
                  : 'border border-[#E6E4D8] hover:border-[#A6A58A]'
              }`}
              onClick={() => setPaymentMethod('ncc')}
            >
              <div
                className={`min-w-6 h-6 rounded-full flex items-center justify-center ${
                  paymentMethod === 'ncc'
                    ? 'bg-[#A6A58A]'
                    : 'border border-[#A6A58A]'
                }`}
              >
                {paymentMethod === 'ncc' && (
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
                <p className="text-sm">National Credit Card (Tunisia)</p>
              </div>
            </div>
          </div>

          <div
            className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${
              paymentMethod === 'cod'
                ? 'border-2 border-[#A6A58A] bg-[#F5F3EB]'
                : 'border border-[#E6E4D8] hover:border-[#A6A58A]'
            }`}
            onClick={() => setPaymentMethod('cod')}
          >
            <div
              className={`min-w-6 h-6 rounded-full flex items-center justify-center ${
                paymentMethod === 'cod'
                  ? 'bg-[#A6A58A]'
                  : 'border border-[#A6A58A]'
              }`}
            >
              {paymentMethod === 'cod' && (
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
            <p>Cash On Delivery</p>
          </div>
        </div>

        <div className="w-full mt-10">
          <button
            type="submit"
            disabled={isSubmitting || Object.keys(cartItems).length === 0}
            className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${
              isSubmitting || Object.keys(cartItems).length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#A6A58A] hover:bg-[#8a896d]'
            }`}
          >
            {isSubmitting ? 'Processing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
