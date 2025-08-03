import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import Title from '../components/Title';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const { navigate, cartItems, createOrder } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Tunisia',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'fullName',
      'street',
      'city',
      'postalCode',
      'phone',
    ];

    requiredFields.forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    if (formData.phone && !/^\d{8,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
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
      // Create order with address and payment method
      const order = await createOrder({
        ...formData,
        paymentMethod,
      });

      if (order) {
        navigate(`/order-confirmation/${order._id}`);
      }
    } catch (error) {
      toast.error(`Failed to place order: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row justify-between gap-4 m-10 pt-5 px-10 sm:pt-14 min-h-[100vh] border-t"
    >
      {/* ------- Left Side - Address Form -------- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3 px-20">
          <Title primaryText={'Order'} secondaryText={'Information'} />
        </div>

        <div className="relative">
          <input
            className={`border ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            } rounded py-2.5 px-3.5 w-full`}
            type="text"
            name="fullName"
            placeholder="Full Name *"
            value={formData.fullName}
            onChange={handleInputChange}
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
          )}
        </div>

        <div className="relative">
          <input
            className={`border ${
              errors.street ? 'border-red-500' : 'border-gray-300'
            } rounded py-2.5 px-3.5 w-full`}
            type="text"
            name="street"
            placeholder="Street Address *"
            value={formData.street}
            onChange={handleInputChange}
          />
          {errors.street && (
            <p className="text-red-500 text-xs mt-1">{errors.street}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <input
              className={`border ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              } rounded py-2.5 px-3.5 w-full`}
              type="text"
              name="city"
              placeholder="City *"
              value={formData.city}
              onChange={handleInputChange}
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city}</p>
            )}
          </div>

          <div className="relative">
            <input
              className="border border-gray-300 rounded py-2.5 px-3.5 w-full"
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <input
              className={`border ${
                errors.postalCode ? 'border-red-500' : 'border-gray-300'
              } rounded py-2.5 px-3.5 w-full`}
              type="number"
              name="postalCode"
              placeholder="Postal Code *"
              value={formData.postalCode}
              onChange={handleInputChange}
            />
            {errors.postalCode && (
              <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
            )}
          </div>

          <div className="relative">
            <input
              className="border border-gray-300 rounded py-2.5 px-3.5 w-full"
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="relative">
          <input
            className={`border ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            } rounded py-2.5 px-3.5 w-full`}
            type="tel"
            name="phone"
            placeholder="Phone Number *"
            value={formData.phone}
            onChange={handleInputChange}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* ------- Right Side - Order Summary & Payment ------- */}
      <div className="my-3">
        <div className="w-[40vw] min-w-80">
          <CartTotal />
        </div>

        {/* Payment method selection section */}
        <div className="mt-12">
          <Title primaryText={'Payment'} secondaryText={'Method'} />
        </div>

        <div className="flex flex-col gap-3 text-[#3A3A3A] mt-4">
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'icc'
                  ? 'border-2 border-[#A6A58A] bg-[#F5F3EB]'
                  : 'border border-[#E6E4D8] hover:border-[#A6A58A]'
              }`}
              onClick={() => setPaymentMethod('icc')}
            >
              <div
                className={`min-w-5 h-5 border rounded-full flex items-center justify-center ${
                  paymentMethod === 'icc'
                    ? 'border-[#A6A58A] bg-[#A6A58A]'
                    : 'border-[#A6A58A]'
                }`}
              >
                {paymentMethod === 'icc' && (
                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <img
                  className="w-12 h-8 object-contain"
                  src={assets.card_icon}
                  alt="Credit card"
                />
                <p className="text-sm">International Credit Card</p>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'ncc'
                  ? 'border-2 border-[#A6A58A] bg-[#F5F3EB]'
                  : 'border border-[#E6E4D8] hover:border-[#A6A58A]'
              }`}
              onClick={() => setPaymentMethod('ncc')}
            >
              <div
                className={`min-w-5 h-5 border rounded-full flex items-center justify-center ${
                  paymentMethod === 'ncc'
                    ? 'border-[#A6A58A] bg-[#A6A58A]'
                    : 'border-[#A6A58A]'
                }`}
              >
                {paymentMethod === 'ncc' && (
                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <img
                  className="w-12 h-8 object-contain"
                  src={assets.card_icon}
                  alt="Credit card"
                />
                <p className="text-sm">National Credit Card (Tunisia)</p>
              </div>
            </div>
          </div>

          <div
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
              paymentMethod === 'cod'
                ? 'border-2 border-[#A6A58A] bg-[#F5F3EB]'
                : 'border border-[#E6E4D8] hover:border-[#A6A58A]'
            }`}
            onClick={() => setPaymentMethod('cod')}
          >
            <div
              className={`min-w-5 h-5 border rounded-full flex items-center justify-center ${
                paymentMethod === 'cod'
                  ? 'border-[#A6A58A] bg-[#A6A58A]'
                  : 'border-[#A6A58A]'
              }`}
            >
              {paymentMethod === 'cod' && (
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              )}
            </div>
            <p>Cash On Delivery</p>
          </div>
        </div>

        <div className="w-full text-end mt-8">
          <button
            type="submit"
            disabled={isSubmitting || Object.keys(cartItems).length === 0}
            className={`mt-5 py-2 px-5 ${
              isSubmitting || Object.keys(cartItems).length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-[#f2b67b] hover:bg-[#e8a85f]'
            } text-[#5c4b42] font-medium rounded-lg transition-colors duration-300`}
          >
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
