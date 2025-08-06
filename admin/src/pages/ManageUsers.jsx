import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendURL } from '../constants/Exports';

const ManageUsers = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({
    open: false,
    type: '', // 'email' or 'password'
    user: null,
    value: '',
  });
  const [error, setError] = useState('');

  // Fetch users with order counts
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendURL}/api/user/admin/users`, {
        headers: { token },
      });

      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const openEditModal = (user, type) => {
    setEditModal({
      open: true,
      type,
      user,
      value: type === 'email' ? user.email : '',
    });
    setError('');
  };

  const closeEditModal = () => {
    setEditModal({ open: false, type: '', user: null, value: '' });
  };

  const handleChange = (e) => {
    setEditModal((prev) => ({ ...prev, value: e.target.value }));
    setError('');
  };

  const updateUserEmail = async (userId, newEmail) => {
    try {
      const response = await axios.patch(
        `${backendURL}/api/user/admin/users/email`,
        { userId, newEmail },
        { headers: { token } }
      );
      return response.data.success;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update email';
    }
  };

  const resetUserPassword = async (userId, newPassword) => {
    try {
      const response = await axios.patch(
        `${backendURL}/api/user/admin/users/password`,
        { userId, newPassword },
        { headers: { token } }
      );
      return response.data.success;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to reset password';
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate input
      if (!editModal.value.trim()) {
        setError('This field is required');
        return;
      }

      if (
        editModal.type === 'email' &&
        !/^\S+@\S+\.\S+$/.test(editModal.value)
      ) {
        setError('Please enter a valid email');
        return;
      }

      if (editModal.type === 'password' && editModal.value.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }

      // Perform update
      let success = false;
      if (editModal.type === 'email') {
        success = await updateUserEmail(editModal.user._id, editModal.value);
      } else {
        success = await resetUserPassword(editModal.user._id, editModal.value);
      }

      if (success) {
        toast.success(`User ${editModal.type} updated successfully`);

        // Update local state
        if (editModal.type === 'email') {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === editModal.user._id
                ? { ...user, email: editModal.value }
                : user
            )
          );
        }

        closeEditModal();
      }
    } catch (error) {
      setError(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-[#A6A58A]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F5F2] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#5C4B42]">
              User Management
            </h1>
            <p className="text-[#8C7B6B] mt-2">
              Manage registered users and their information
            </p>
          </div>

          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 bg-[#D6A7A0] hover:bg-[#C79790] text-white font-medium rounded-lg px-4 py-2 transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            Refresh Users
          </button>
        </div>

        {/* User Table */}
        {users.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-[#E8D9CC]">
            <h3 className="text-2xl font-medium text-[#5C4B42] mb-3">
              No Users Found
            </h3>
            <p className="text-[#8C7B6B] max-w-md mx-auto">
              There are no registered users in the system yet.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#E8D9CC]">
            <table className="min-w-full">
              <thead className="bg-[#A6A58A] text-white">
                <tr>
                  <th className="py-4 px-6 text-left font-semibold">Name</th>
                  <th className="py-4 px-6 text-left font-semibold">Email</th>
                  <th className="py-4 px-6 text-left font-semibold">Phone</th>
                  <th className="py-4 px-6 text-left font-semibold">Orders</th>
                  <th className="py-4 px-6 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8D9CC]">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-[#F9F5F2]">
                    <td className="py-4 px-6">
                      <div className="text-[#5C4B42] font-medium">
                        {user.fullName}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-[#8C7B6B]">{user.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-[#8C7B6B]">
                        {user.deliveryAddress?.phoneNumber || 'N/A'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="bg-[#F5F0EB] text-[#5C4B42] px-3 py-1 rounded-full text-center inline-block">
                        {user.orderCount}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => openEditModal(user, 'email')}
                          className="text-[#5C4B42] hover:text-[#D6A7A0] transition-colors"
                        >
                          Change Email
                        </button>
                        <button
                          onClick={() => openEditModal(user, 'password')}
                          className="text-[#5C4B42] hover:text-[#D6A7A0] transition-colors"
                        >
                          Reset Password
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Modal */}
        {editModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md border border-[#E8D9CC]">
              <h2 className="text-xl font-bold text-[#5C4B42] mb-4">
                {editModal.type === 'email' ? 'Change Email' : 'Reset Password'}{' '}
                for {editModal.user.fullName}
              </h2>

              {editModal.type === 'email' ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#8C7B6B] mb-2">
                    New Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2.5 border border-[#E8D9CC] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A6A58A] focus:border-[#A6A58A]"
                    value={editModal.value}
                    onChange={handleChange}
                    placeholder="Enter new email"
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#8C7B6B] mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2.5 border border-[#E8D9CC] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A6A58A] focus:border-[#A6A58A]"
                    value={editModal.value}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                  <p className="text-xs text-[#8C7B6B] mt-2">
                    Password must be at least 8 characters
                  </p>
                </div>
              )}

              {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2.5 text-[#5C4B42] hover:text-[#D6A7A0] rounded-lg transition-colors"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2.5 bg-[#A6A58A] text-white rounded-lg hover:bg-[#8a896d] transition-colors"
                  onClick={handleSubmit}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
