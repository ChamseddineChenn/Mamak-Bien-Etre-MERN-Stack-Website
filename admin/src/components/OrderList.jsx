import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendURL } from '../constants/Exports';
import SearchBar from './SearchBar';

const STATUS_OPTIONS = [
  'processing',
  'awaiting_delivery',
  'in_delivery',
  'paused',
  'cancelled',
  'delivered',
];

const OrderList = ({ token, statuses }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Wrap fetchOrders in useCallback to prevent unnecessary recreations
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendURL}/api/order/admin/orders`, {
        params: {
          status: statuses.join(','),
          search: searchTerm,
        },
        headers: { token },
      });

      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      toast.error(
        'Failed to fetch orders: ' +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  }, [token, statuses, searchTerm]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `${backendURL}/api/order/${orderId}/status`,
        { status: newStatus },
        {
          headers: { token },
        }
      );

      toast.success('Order status updated');
      fetchOrders(); // Refresh list
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      toast.error(`Update failed: ${errorMsg}`);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleClear = () => {
    setSearchTerm('');
  };

  // Fetch orders when component mounts, statuses change, or searchTerm changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 300); // Shorter debounce time

    return () => clearTimeout(timer);
  }, [fetchOrders, statuses, searchTerm]);

  return (
    <div className="p-4">
      <SearchBar
        value={searchTerm}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      {loading ? (
        <div className="text-center py-8">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? 'No orders found matching your search'
              : 'No orders found'}
          </p>
          {searchTerm && (
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-[#A6A58A] text-white rounded-lg hover:bg-[#8a896d] transition-colors"
            >
              Show All Orders
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-[#A6A58A] text-white">
              <tr>
                <th className="py-3 px-4 text-left">Order ID</th>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Items</th>
                <th className="py-3 px-4 text-left">Total</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div
                      className="font-medium text-gray-900"
                      title={order._id}
                    >
                      {order.shortId}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-900">
                      {order.address.fullName}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {order.address.city}
                    </div>
                  </td>
                  <td className="py-3 px-4">{order.address.phone}</td>
                  <td className="py-3 px-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">{order.items.length} items</td>
                  <td className="py-3 px-4">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className={`px-2 py-1 rounded border ${
                        order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : order.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderList;
