import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendURL, currency } from '../constants/Exports';
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
  const [expandedOrder, setExpandedOrder] = useState(null);

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

  const toggleExpand = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 300);

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
        <div className="flex justify-center items-center min-h-[100vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-[#A6A58A]"></div>
        </div>
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
                <th className="py-3 px-4 text-left">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div
                        className="font-medium text-gray-900"
                        title={order._id}
                      >
                        {order.shortId}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="py-3 px-4">
                        {order.address.recipientName}
                      </div>
                    </td>
                    <td className="py-3 px-4">{order.address.phoneNumber}</td>
                    <td className="py-3 px-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">{order.items.length} items</td>
                    <td className="py-3 px-4">
                      TND {order.totalAmount.toFixed(2)}
                    </td>
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
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleExpand(order._id)}
                        className="text-[#A6A58A] hover:text-[#8a896d]"
                      >
                        {expandedOrder === order._id ? '▲' : '▼'}
                      </button>
                    </td>
                  </tr>

                  {expandedOrder === order._id && (
                    <tr>
                      <td colSpan="8" className="bg-gray-50 p-4">
                        <div className="border-t border-gray-200 pt-4">
                          {/* New Address Section */}
                          <div className="mb-6">
                            <h3 className="font-semibold mb-3">
                              Delivery Address:
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <p className="flex">
                                  <span className="font-medium w-28">
                                    Recipient:
                                  </span>
                                  <span>{order.address.recipientName}</span>
                                </p>
                                <p className="flex">
                                  <span className="font-medium w-28">
                                    Street:
                                  </span>
                                  <span>{order.address.street}</span>
                                </p>
                                <p className="flex">
                                  <span className="font-medium w-28">
                                    City:
                                  </span>
                                  <span>{order.address.city}</span>
                                </p>
                              </div>
                              <div className="space-y-2">
                                <p className="flex">
                                  <span className="font-medium w-28">
                                    State:
                                  </span>
                                  <span>{order.address.state}</span>
                                </p>
                                <p className="flex">
                                  <span className="font-medium w-28">
                                    ZIP Code:
                                  </span>
                                  <span>{order.address.zipCode}</span>
                                </p>
                                <p className="flex">
                                  <span className="font-medium w-28">
                                    Phone:
                                  </span>
                                  <span>{order.address.phoneNumber}</span>
                                </p>
                                <p className="flex">
                                  <span className="font-medium w-28">
                                    Country:
                                  </span>
                                  <span>{order.address.country}</span>
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Existing Order Items Section */}
                          <h3 className="font-semibold mb-3">Order Items:</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {order.items.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center border-b pb-3 last:border-0"
                              >
                                <div className="flex-1">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-gray-600">
                                    Quantity: {item.quantity}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">
                                    {currency} {item.priceAtOrder.toFixed(2)}{' '}
                                    each
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Total: {currency}{' '}
                                    {(
                                      item.quantity * item.priceAtOrder
                                    ).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderList;
