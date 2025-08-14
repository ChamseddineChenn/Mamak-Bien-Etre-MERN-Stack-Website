import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendURL, currency } from '../constants/Exports';

const Dashboard = ({ token }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [subscribers, setSubscribers] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    productId: '',
  });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [staleOrders, setStaleOrders] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    orders: 0,
    revenue: 0,
    subscribers: 0,
  });
  const [analyticsData, setAnalyticsData] = useState({
    topProducts: [],
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [subsRes, productsRes, lowStockRes, staleOrdersRes, statsRes] =
        await Promise.all([
          axios.get(`${backendURL}/api/newsletter/subscribers`, {
            headers: { token },
          }),
          axios.get(`${backendURL}/api/product/displayProducts`),
          axios.get(`${backendURL}/api/product/low-stock`, {
            headers: { token },
            params: { threshold: 5 },
          }),
          axios.get(`${backendURL}/api/order/admin/stale-orders`, {
            headers: { token },
            params: { hours: 48 },
          }),
          axios.get(`${backendURL}/api/dashboard/stats`, {
            headers: { token },
          }),
        ]);

      if (subsRes.data.success) setSubscribers(subsRes.data.subscribers);
      if (productsRes.data.success) {
        setProducts(productsRes.data.products);
        // Calculate top products based on views
        const sortedProducts = [...productsRes.data.products]
          .sort((a, b) => b.views - a.views)
          .slice(0, 5);

        setAnalyticsData({
          topProducts: sortedProducts.map((p) => ({
            id: p._id,
            name: p.name,
            views: p.views,
            price: p.price,
          })),
        });
      }
      if (lowStockRes.data.success)
        setLowStockProducts(lowStockRes.data.products);
      if (staleOrdersRes.data.success)
        setStaleOrders(staleOrdersRes.data.orders);
      if (statsRes.data.success) setDashboardStats(statsRes.data);
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.message || !formData.productId) {
      toast.warning('Please fill all fields');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${backendURL}/api/newsletter/send`,
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          subject: '',
          message: '',
          productId: '',
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send newsletter');
    } finally {
      setIsLoading(false);
    }
  };

  const StatsOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-medium text-[#5C4B42]">Total Orders</h3>
        <p className="text-3xl font-bold text-[#D6A7A0]">
          {dashboardStats.orders}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-medium text-[#5C4B42]">Revenue</h3>
        <p className="text-3xl font-bold text-[#D6A7A0]">
          {currency}
          {dashboardStats.revenue.toFixed(2)}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-medium text-[#5C4B42]">Subscribers</h3>
        <p className="text-3xl font-bold text-[#D6A7A0]">
          {dashboardStats.subscribers}
        </p>
      </div>
    </div>
  );

  const LowStockNotification = () => (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-[#5C4B42] mb-4">
        Low Stock Alerts
      </h2>
      {lowStockProducts.length > 0 ? (
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {lowStockProducts.map((product) => (
            <li
              key={product._id}
              className="flex justify-between items-center border-b border-[#E8D9CC] py-2"
            >
              <span className="text-red-500 font-medium">{product.name}</span>
              <span>Stock: {product.quantity}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No low stock items</p>
      )}
    </div>
  );

  const StaleOrderNotification = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-[#5C4B42] mb-4">
        Pending Order Alerts
      </h2>
      {staleOrders.length > 0 ? (
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {staleOrders.map((order) => (
            <li
              key={order._id}
              className="flex justify-between items-center border-b border-[#E8D9CC] py-2"
            >
              <div>
                <span className="font-medium text-red-500">
                  Order #{order.shortId}
                </span>
                <p className="text-sm text-gray-500">
                  {order.items.length} items •{' '}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                {order.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No stale orders</p>
      )}
    </div>
  );

  const AnalyticsDashboard = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-[#5C4B42] mb-4">
        Product Analytics
      </h2>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-[#5C4B42] mb-3">
          Most Viewed Products
        </h3>
        <div className="bg-white rounded-lg border border-[#E8D9CC]">
          {analyticsData.topProducts.length > 0 ? (
            <ul className="divide-y divide-[#E8D9CC]">
              {analyticsData.topProducts.map((product, index) => (
                <li
                  key={product.id}
                  className="p-3 flex justify-between items-center"
                >
                  <div>
                    <span className="font-medium">{product.name}</span>
                    <p className="text-sm text-gray-500">
                      {product.views} views
                    </p>
                  </div>
                  <span className="bg-[#D6A7A0] text-white px-2 py-1 rounded text-sm">
                    #{index + 1}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-gray-500">No product data available</p>
          )}
        </div>
      </div>
    </div>
  );

  const RecentOrders = () => {
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
      const fetchRecentOrders = async () => {
        try {
          const res = await axios.get(`${backendURL}/api/order/recent`, {
            headers: { token },
            params: { limit: 5 },
          });
          setRecentOrders(res.data.orders);
        } catch (error) {
          console.error('Recent orders fetch error:', error);
        }
      };
      fetchRecentOrders();
    }, []);

    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-[#5C4B42] mb-4">
          Recent Orders
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E8D9CC]">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Order ID</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id}>
                  <td className="px-4 py-2">#{order.shortId}</td>
                  <td className="px-4 py-2">{order.address.recipientName}</td>
                  <td className="px-4 py-2">
                    {currency}
                    {order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D6A7A0]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#5C4B42] mb-4">Dashboard</h1>

      {/* Tab Navigation */}
      <div className="flex border-b border-[#E8D9CC] mb-6">
        {['overview', 'subscribers', 'newsletter', 'analytics'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium ${
              activeTab === tab
                ? 'text-[#5C4B42] border-b-2 border-[#5C4B42]'
                : 'text-gray-500 hover:text-[#5C4B42]'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <StatsOverview />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <LowStockNotification />
              <StaleOrderNotification />
            </div>
            <RecentOrders />
          </div>
        </div>
      )}

      {activeTab === 'subscribers' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-[#5C4B42] mb-4">
            Verified Subscribers
          </h2>
          <p className="text-3xl font-bold text-[#D6A7A0] mb-4">
            {subscribers.length}
          </p>
          <div className="max-h-96 overflow-y-auto">
            <ul className="space-y-2">
              {subscribers.map((sub, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border-b border-[#E8D9CC] py-2"
                >
                  <span>{sub.email}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(sub.subscribedAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'newsletter' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-[#5C4B42] mb-4">
            Send Newsletter
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#5C4B42] mb-1">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#E8D9CC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D6A7A0]"
                placeholder="Newsletter subject"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5C4B42] mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full min-h-[100px] px-4 py-2 border border-[#E8D9CC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D6A7A0]"
                placeholder="Write your newsletter content..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5C4B42] mb-1">
                Featured Product
              </label>
              <select
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#E8D9CC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D6A7A0]"
                required
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-[#D6A7A0] text-white rounded-lg hover:bg-[#C79790] transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Newsletter'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'analytics' && <AnalyticsDashboard />}
    </div>
  );
};

export default Dashboard;
