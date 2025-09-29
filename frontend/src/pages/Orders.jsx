import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Orders = () => {
  const { t } = useTranslation();
  const { currency, getUserOrders, isSessionReady, products } =
    useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const userOrders = await getUserOrders();
        setOrders(userOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isSessionReady) {
      fetchOrders();
    }
  }, [getUserOrders, isSessionReady]);

  const getProductData = (productId) => {
    return products.find((product) => product._id === productId) || null;
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'processing':
        return {
          text: t('processing'),
          color: 'text-blue-600',
          dot: 'bg-blue-600',
        };
      case 'awaiting_delivery':
        return {
          text: t('awaiting_delivery'),
          color: 'text-yellow-600',
          dot: 'bg-yellow-600',
        };
      case 'in_delivery':
        return {
          text: t('in_delivery'),
          color: 'text-purple-600',
          dot: 'bg-purple-600',
        };
      case 'delivered':
        return {
          text: t('delivered'),
          color: 'text-green-600',
          dot: 'bg-green-600',
        };
      case 'paused':
        return {
          text: t('paused'),
          color: 'text-orange-600',
          dot: 'bg-orange-600',
        };
      case 'cancelled':
        return {
          text: t('cancelled'),
          color: 'text-red-600',
          dot: 'bg-red-600',
        };
      default:
        return { text: status, color: 'text-gray-600', dot: 'bg-gray-600' };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  // Show loading spinner until session is ready
  if (!isSessionReady) {
    return (
      <div className="border-t m-10 pt-16 min-h-[100vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-[#A6A58A]"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="border-t m-10 pt-16 min-h-[100vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-[#A6A58A]"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="border-t m-10 pt-16 min-h-[100vh]">
        <div className="text-2xl flex justify-center">
          <Title primaryText={t('my_plural')} secondaryText={t('orders')} />
        </div>
        <div className="flex flex-col items-center justify-center mt-20">
          <img
            src={assets.no_order_icon}
            alt={t('no_orders')}
            className="w-32 h-32 opacity-70 mb-6"
          />
          <h3 className="text-xl font-semibold mb-2">{t('no_orders')}</h3>
          <p className="text-gray-600 mb-6 max-w-md text-center">
            {t('no_orders_message')}
          </p>
          <a
            href="/collection"
            className="px-6 py-3 bg-[#A6A58A] text-white rounded-md hover:bg-[#8A8970] transition-colors"
          >
            {t('browse_collection')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t m-10 pt-16 min-h-[100vh]">
      <div className="text-2xl flex justify-center">
        <Title primaryText={t('my_plural')} secondaryText={t('orders')} />
      </div>
      <div className="mx-5 md:mx-15 lg:mx-25">
        {orders.map((order) => (
          <div
            key={order._id}
            className="mb-10 border border-[#E8D9CC] rounded-lg p-5 bg-white shadow-sm"
          >
            {/* Order Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 border-b border-[#E8D9CC]">
              <div>
                <h3 className="font-bold text-lg">
                  {t('order_number', { id: order._id.slice(-8).toUpperCase() })}
                </h3>
                <p className="text-gray-600">
                  {t('placed_on', { date: formatDate(order.createdAt) })}
                </p>
              </div>
              <div className="mt-2 md:mt-0">
                <div className="flex items-center gap-2">
                  <p
                    className={`min-w-2 h-2 rounded-full ${
                      getStatusInfo(order.status).dot
                    }`}
                  ></p>
                  <p
                    className={`font-medium ${
                      getStatusInfo(order.status).color
                    }`}
                  >
                    {getStatusInfo(order.status).text}
                  </p>
                </div>
                <p className="font-bold text-right mt-1">
                  {t('order_total', {
                    currency: currency,
                    amount: order.totalAmount.toFixed(2),
                  })}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-4">
              {order.items.map((item, index) => {
                const product = getProductData(item.productId);
                const imageUrl = product?.image?.[0];

                return (
                  <div key={index} className="py-4 text-gray-700">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex flex-row w-full">
                        <img
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover"
                          src={imageUrl}
                          alt={item.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = assets.placeholder_product;
                          }}
                        />
                        <div className="flex flex-col ml-5">
                          <p className="sm:text-lg font-medium">{item.name}</p>
                          <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                            <p className="text-lg">
                              {currency} {item.priceAtOrder.toFixed(2)}
                            </p>
                            <p>
                              {t('quantity')}: {item.quantity}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {index < order.items.length - 1 && (
                      <span className="block w-full border-b border-[#A6A58A]/30 rounded-2xl mt-4"></span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Order Footer */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#E8D9CC]">
              <p className="text-sm text-gray-600">
                {t('items_count', {
                  count: order.items.length,
                  s: order.items.length !== 1 ? 's' : '',
                })}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/order-confirmation/${order._id}`)}
                  className="py-2 px-5 bg-[#A6A584]/90 hover:bg-[#bbba96] text-[#3A3A3A] font-medium rounded-lg transition-colors duration-300"
                >
                  {t('view_details')}
                </button>
                <button className="py-2 px-5 bg-[#A6A584]/90 hover:bg-[#bbba96] text-[#3A3A3A] font-medium rounded-lg transition-colors duration-300">
                  {t('track_order')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
