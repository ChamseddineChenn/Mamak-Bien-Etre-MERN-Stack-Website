import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const UserProfile = () => {
  const { t } = useTranslation();
  const {
    user,
    token,
    backendURL,
    updateUserDeliveryAddress,
    updateUserProfile,
    changePassword,
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ fullName: '' });
  const [addressForm, setAddressForm] = useState({
    recipientName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Tunisia',
    phoneNumber: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if no token
    if (!token) {
      navigate('/login');
      return;
    }

    // Initialize forms when user data is available
    if (user) {
      setProfileForm({ fullName: user.fullName || '' });

      if (user.deliveryAddress) {
        setAddressForm({
          recipientName: user.deliveryAddress.recipientName || '',
          street: user.deliveryAddress.street || '',
          city: user.deliveryAddress.city || '',
          state: user.deliveryAddress.state || '',
          zipCode: user.deliveryAddress.zipCode || '',
          country: user.deliveryAddress.country || 'Tunisia',
          phoneNumber: user.deliveryAddress.phoneNumber || '',
        });
      }

      setIsLoading(false);
    } else {
      // If user context isn't populated yet, try to fetch manually
      const fetchUserProfile = async () => {
        try {
          const response = await fetch(`${backendURL}/api/user/profile`, {
            headers: { token },
          });
          const data = await response.json();

          if (data.success && data.user) {
            setProfileForm({ fullName: data.user.fullName });
            if (data.user.deliveryAddress) {
              setAddressForm({
                ...data.user.deliveryAddress,
                country: data.user.deliveryAddress.country || 'Tunisia',
              });
            }
          }
        } catch (error) {
          toast.error(t('profile_load_error') + error.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserProfile();
    }
  }, [user, token, backendURL, navigate, t]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!profileForm.fullName.trim()) {
      setErrors({ fullName: t('error_fullName_required') });
      return;
    }

    setIsSaving(true);

    try {
      await updateUserProfile(profileForm.fullName);
      toast.success(t('profile_updated'));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const requiredFields = [
      'recipientName',
      'street',
      'city',
      'zipCode',
      'phoneNumber',
    ];

    requiredFields.forEach((field) => {
      if (!addressForm[field] || addressForm[field].trim() === '') {
        newErrors[field] = t('field_required');
      }
    });

    if (
      addressForm.phoneNumber &&
      !/^\+?\d{7,15}$/.test(addressForm.phoneNumber.replace(/[^\d+]/g, ''))
    ) {
      newErrors.phoneNumber = t('invalid_phone');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    try {
      await updateUserDeliveryAddress(addressForm);
      toast.success(t('address_saved'));
      setErrors({});
    } catch (error) {
      toast.error(t('address_save_error') + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = t('error_current_password_required');
    }
    if (!passwordForm.newPassword) {
      newErrors.newPassword = t('error_new_password_required');
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = t('error_password_length');
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = t('error_passwords_mismatch');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    try {
      await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      toast.success(t('password_changed'));
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setErrors({});
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;

    switch (formType) {
      case 'profile':
        setProfileForm((prev) => ({ ...prev, [name]: value }));
        break;
      case 'address':
        setAddressForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
        break;
      case 'password':
        setPasswordForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[100vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-[#A6A58A]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-[100vh] sm:p-6">
      <div className="text-center mb-8">
        <Title primaryText={t('your')} secondaryText={t('profile')} />
      </div>

      <div className="flex border-b mb-6">
        <button
          className={`py-3 px-6 font-medium ${
            activeTab === 'profile'
              ? 'text-[#A6A58A] border-b-2 border-[#A6A58A]'
              : 'text-gray-600 hover:text-[#A6A58A]'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          {t('account_details')}
        </button>
        <button
          className={`py-3 px-6 font-medium ${
            activeTab === 'shipping'
              ? 'text-[#A6A58A] border-b-2 border-[#A6A58A]'
              : 'text-gray-600 hover:text-[#A6A58A]'
          }`}
          onClick={() => setActiveTab('shipping')}
        >
          {t('shipping_address')}
        </button>
        <button
          className={`py-3 px-6 font-medium ${
            activeTab === 'password'
              ? 'text-[#A6A58A] border-b-2 border-[#A6A58A]'
              : 'text-gray-600 hover:text-[#A6A58A]'
          }`}
          onClick={() => setActiveTab('password')}
        >
          {t('change_password')}
        </button>
      </div>

      {activeTab === 'profile' && (
        <form
          onSubmit={handleProfileSubmit}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-xl font-semibold mb-6">
            {t('account_information')}
          </h3>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('full_name_label')}
            </label>
            <input
              className={`w-full px-4 py-2 border rounded-md ${
                errors.fullName
                  ? 'border-red-500'
                  : 'border-gray-300 focus:border-[#A6A58A]'
              } focus:outline-none focus:ring-1 focus:ring-[#A6A58A]`}
              type="text"
              name="fullName"
              value={profileForm.fullName}
              onChange={(e) => handleInputChange(e, 'profile')}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('email_address')}
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none cursor-not-allowed"
              type="email"
              value={user?.email || ''}
              readOnly
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('contact_support_email')}
            </p>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={isSaving}
              className={`py-2 px-6 bg-[#A6A58A] text-white rounded-md hover:bg-[#8a896d] transition-colors ${
                isSaving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? t('saving') : t('save_changes')}
            </button>
          </div>
        </form>
      )}

      {activeTab === 'shipping' && (
        <form
          onSubmit={handleAddressSubmit}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-xl font-semibold mb-6">
            {t('shipping_information')}
          </h3>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('recipient_name')}
              </label>
              <input
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.recipientName
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-[#A6A58A]'
                } focus:outline-none focus:ring-1 focus:ring-[#A6A58A]`}
                type="text"
                name="recipientName"
                value={addressForm.recipientName}
                onChange={(e) => handleInputChange(e, 'address')}
              />
              {errors.recipientName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.recipientName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('street_address')}
              </label>
              <input
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.street
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-[#A6A58A]'
                } focus:outline-none focus:ring-1 focus:ring-[#A6A58A]`}
                type="text"
                name="street"
                value={addressForm.street}
                onChange={(e) => handleInputChange(e, 'address')}
              />
              {errors.street && (
                <p className="text-red-500 text-xs mt-1">{errors.street}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('city_label')}
                </label>
                <input
                  className={`w-full px-4 py-2 border rounded-md ${
                    errors.city
                      ? 'border-red-500'
                      : 'border-gray-300 focus:border-[#A6A58A]'
                  } focus:outline-none focus:ring-1 focus:ring-[#A6A58A]`}
                  type="text"
                  name="city"
                  value={addressForm.city}
                  onChange={(e) => handleInputChange(e, 'address')}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('state_label')}
                </label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#A6A58A] focus:border-[#A6A58A]"
                  type="text"
                  name="state"
                  value={addressForm.state}
                  onChange={(e) => handleInputChange(e, 'address')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('postal_code')}
                </label>
                <input
                  className={`w-full px-4 py-2 border rounded-md ${
                    errors.zipCode
                      ? 'border-red-500'
                      : 'border-gray-300 focus:border-[#A6A58A]'
                  } focus:outline-none focus:ring-1 focus:ring-[#A6A58A]`}
                  type="text"
                  name="zipCode"
                  value={addressForm.zipCode}
                  onChange={(e) => handleInputChange(e, 'address')}
                />
                {errors.zipCode && (
                  <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('country_label')}
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#A6A58A] focus:border-[#A6A58A]"
                  name="country"
                  value={addressForm.country}
                  onChange={(e) => handleInputChange(e, 'address')}
                >
                  <option value="Tunisia">Tunisia</option>
                  <option value="Algeria">Algeria</option>
                  <option value="Libya">Libya</option>
                  <option value="Morocco">Morocco</option>
                  <option value="France">France</option>
                  <option value="Germany">Germany</option>
                  <option value="Italy">Italy</option>
                  <option value="Spain">Spain</option>
                  <option value="Denmark">Denmark</option>
                  <option value="Poland">Poland</option>
                  <option value="Austria">Austria</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('phone_number')}
              </label>
              <input
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.phoneNumber
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-[#A6A58A]'
                } focus:outline-none focus:ring-1 focus:ring-[#A6A58A]`}
                type="tel"
                name="phoneNumber"
                value={addressForm.phoneNumber}
                onChange={(e) => handleInputChange(e, 'address')}
                placeholder="e.g., +21612345678"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={isSaving}
              className={`py-2 px-6 bg-[#A6A58A] text-white rounded-md hover:bg-[#8a896d] transition-colors ${
                isSaving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? t('saving') : t('save_address')}
            </button>
          </div>
        </form>
      )}

      {activeTab === 'password' && (
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-xl font-semibold mb-6">{t('change_password')}</h3>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('current_password')}
              </label>
              <input
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.currentPassword
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-[#A6A58A]'
                } focus:outline-none focus:ring-1 focus:ring-[#A6A58A]`}
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={(e) => handleInputChange(e, 'password')}
              />
              {errors.currentPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.currentPassword}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('new_password')}
              </label>
              <input
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.newPassword
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-[#A6A58A]'
                } focus:outline-none focus:ring-1 focus:ring-[#A6A58A]`}
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={(e) => handleInputChange(e, 'password')}
              />
              {errors.newPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.newPassword}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {t('password_length_hint')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('confirm_new_password')}
              </label>
              <input
                className={`w-full px-4 py-2 border rounded-md ${
                  errors.confirmPassword
                    ? 'border-red-500'
                    : 'border-gray-300 focus:border-[#A6A58A]'
                } focus:outline-none focus:ring-1 focus:ring-[#A6A58A]`}
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={(e) => handleInputChange(e, 'password')}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={isSaving}
              className={`py-2 px-6 bg-[#A6A58A] text-white rounded-md hover:bg-[#8a896d] transition-colors ${
                isSaving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? t('updating') : t('change_password_button')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserProfile;
