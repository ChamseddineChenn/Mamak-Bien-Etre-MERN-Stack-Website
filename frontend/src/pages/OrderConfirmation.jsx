import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { getOrderById, currency, isSessionReady, products } =
    useContext(ShopContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch order:', error);
        setError(error.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch when session is ready
    if (orderId && isSessionReady) {
      fetchOrder();
    }
  }, [orderId, getOrderById, isSessionReady]);

  const getProductData = (productId) => {
    return products.find((product) => product._id === productId) || null;
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'processing':
        return { text: 'Processing', color: 'text-blue-600' };
      case 'awaiting_delivery':
        return { text: 'Awaiting Delivery', color: 'text-yellow-600' };
      case 'in_delivery':
        return { text: 'In Delivery', color: 'text-purple-600' };
      case 'delivered':
        return { text: 'Delivered', color: 'text-green-600' };
      case 'paused':
        return { text: 'Paused', color: 'text-orange-600' };
      case 'cancelled':
        return { text: 'Cancelled', color: 'text-red-600' };
      default:
        return { text: status, color: 'text-gray-600' };
    }
  };

  // Show loading spinner until session is ready
  if (!isSessionReady) {
    return (
      <div className="flex justify-center items-center min-h-[100vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-[#A6A58A]"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[100vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-[#A6A58A]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <h2 className="font-bold text-xl mb-2">Error Loading Order</h2>
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-[#A6A58A] text-white rounded hover:bg-[#8A8970]"
        >
          Return Home
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center min-h-[100vh]">
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <p>We couldn't find an order with ID: {orderId}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-[#A6A58A] text-white rounded hover:bg-[#8A8970]"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto my-5 pt-19 px-4 min-h-[100vh]">
      <div className="text-center mb-12">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <img
            src={assets.green_check_icon}
            alt="Success"
            className="w-20 h-20"
          />
        </div>
        <h1 className="text-3xl font-bold mb-2">Thank You For Your Order!</h1>
        <p className="text-gray-600 mb-4">
          Your order #{order._id.slice(-8).toUpperCase()} has been placed
          successfully
        </p>
        <p className={`font-medium ${statusInfo.color} mb-2`}>
          Status: {statusInfo.text}
        </p>
        <p className="text-gray-600">Order Date: {orderDate}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <img
              src={assets.order_sum_icon}
              alt="Order"
              className="w-5 h-5 mr-2"
            />
            Order Summary
          </h2>

          <div className="space-y-4">
            {order.items.map((item, index) => {
              const product = getProductData(item.productId);
              const imageUrl = product?.image?.[0];

              return (
                <div
                  key={index}
                  className="flex justify-between items-center border-b pb-4"
                >
                  <div className="flex items-center">
                    <img
                      className="w-16 h-16 rounded object-cover mr-4"
                      src={imageUrl}
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = assets.placeholder_product;
                      }}
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-600 text-sm">
                        {item.quantity} × {currency}{' '}
                        {item.priceAtOrder.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">
                    {currency} {(item.quantity * item.priceAtOrder).toFixed(2)}
                  </p>
                </div>
              );
            })}

            <div className="pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {currency}{' '}
                  {(order.totalAmount - order.deliveryFee).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>
                  {currency} {order.deliveryFee.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>
                  {currency} {order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <img
              src={assets.shipping_icon}
              alt="Location"
              className="w-5 h-5 mr-2"
            />
            Shipping Information
          </h2>

          <div className="space-y-3">
            <p>
              <strong>Name:</strong> {order.address.recipientName}
            </p>
            <p>
              <strong>Address:</strong> {order.address.street}
            </p>
            <p>
              <strong>City:</strong> {order.address.city}
            </p>
            {order.address.state && (
              <p>
                <strong>State:</strong> {order.address.state}
              </p>
            )}
            <p>
              <strong>Postal Code:</strong> {order.address.postalCode}
            </p>
            <p>
              <strong>Country:</strong> {order.address.country}
            </p>
            <p>
              <strong>Phone:</strong> {order.address.phone}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
            <div className="flex items-center">
              <img
                src={
                  order.paymentMethod === 'cod'
                    ? assets.cash_icon
                    : assets.card_icon
                }
                alt="Payment"
                className="w-8 h-8 mr-2"
              />
              <p>
                {order.paymentMethod === 'cod'
                  ? 'Cash on Delivery'
                  : order.paymentMethod === 'icc'
                  ? 'International Credit Card'
                  : 'National Credit Card'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="mb-6">You will receive an email confirmation shortly.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => window.print()}
            className="px-6 py-2 border border-[#A6A58A] text-[#5C4B42] rounded-md hover:bg-[#F5F3EB]"
          >
            Print Receipt
          </button>
          <button
            onClick={() => navigate('/collection')}
            className="px-6 py-2 bg-[#A6A58A] text-white rounded-md hover:bg-[#8A8970]"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="px-6 py-2 bg-[#f2b67b] text-[#5c4b42] rounded-md hover:bg-[#e8a85f]"
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
