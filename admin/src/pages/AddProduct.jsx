import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendURL } from '../constants/Exports.js';
import { toast } from 'react-toastify';

const AddProduct = ({ token }) => {
  // State for images
  const [images, setImages] = useState(Array(5).fill(null));

  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subCategory: '',
    quantity: '',
    bestSeller: false,
    newArrival: false,
    onSale: false,
    onSalePercent: '',
  });

  // State for validation errors
  const [errors, setErrors] = useState({
    category: false,
    subCategory: false,
  });

  // Category to subcategory mapping
  const categoryMap = {
    'Home Fragrance': ['Classic Candles', 'Fondant Candles', 'Diffusers'],
    Scents: ['Air Freshner'],
    'Bundles & Sets': ['House Warming', 'Gift'],
  };

  // Handle image uploads
  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImages((prev) => {
      const newImages = [...prev];
      newImages[index] = file;
      return newImages;
    });
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // If category changes, reset subcategory
    if (name === 'category') {
      setFormData((prev) => ({
        ...prev,
        category: value,
        subCategory: '',
      }));

      // Clear category error when selected
      setErrors((prev) => ({ ...prev, category: false, subCategory: false }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }

    // Clear subcategory error when selected
    if (name === 'subCategory' && value) {
      setErrors((prev) => ({ ...prev, subCategory: false }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate category/subcategory
    const newErrors = {
      category: formData.category === '',
      subCategory: formData.subCategory === '',
    };

    setErrors(newErrors);
    if (newErrors.category || newErrors.subCategory) {
      return;
    }

    try {
      // Create FormData container
      const formDataToSend = new FormData();

      // Add images
      images.forEach((image, index) => {
        if (image) {
          formDataToSend.append(`image${index + 1}`, image);
        }
      });

      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Send to backend
      const response = await axios.post(
        `${backendURL}/api/product/addProduct`,
        formDataToSend,
        {
          headers: { token },
        }
      );

      // Reset form on success
      if (response.data.success) {
        toast.success('Product added successfully!');
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          subCategory: '',
          quantity: '',
          bestSeller: false,
          newArrival: false,
          onSale: false,
          onSalePercent: '',
        });
        setImages(Array(5).fill(null));
      }
    } catch (error) {
      console.error('Product addition failed:', error);
      toast.error('Failed to add product');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-[#5C4B42]">Add New Product</h1>
        <p className="text-[#8C7B6B] mt-2">
          Fill out the form below to add a new product to your collection
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Image Upload Section */}
        <div className="bg-[#F9F5F2] p-6 rounded-lg">
          <h2 className="text-lg font-medium text-[#5C4B42] mb-4">
            Product Images
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[0, 1, 2, 3, 4].map((index) => (
              <label
                key={index}
                htmlFor={`image${index + 1}`}
                className="aspect-square cursor-pointer"
              >
                <div className="w-full h-full border-2 border-dashed border-[#D6A7A0] rounded-lg flex flex-col items-center justify-center p-2 hover:bg-[#F5F0EB] transition-colors">
                  {images[index] ? (
                    <img
                      className="w-full h-full object-cover rounded-lg"
                      src={URL.createObjectURL(images[index])}
                      alt={`Preview ${index + 1}`}
                    />
                  ) : (
                    <>
                      <img
                        className="w-10 h-10 mb-2 opacity-70"
                        src={assets.upload_image_icon}
                        alt={`Upload image ${index + 1}`}
                      />
                      <span className="text-sm text-[#5C4B42]/80">
                        Image {index + 1}
                      </span>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  id={`image${index + 1}`}
                  className="hidden"
                  onChange={(e) => handleImageUpload(index, e)}
                  accept="image/*"
                />
              </label>
            ))}
          </div>
          <p className="mt-3 text-sm text-[#5C4B42]/60">
            Upload at least one image (max 5)
          </p>
        </div>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="bg-[#F9F5F2] p-5 rounded-lg">
            <label className="block text-base font-medium text-[#5C4B42] mb-2">
              Product Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#E8D9CC] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#D6A7A0]"
              type="text"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Product Price */}
          <div className="bg-[#F9F5F2] p-5 rounded-lg">
            <label className="block text-base font-medium text-[#5C4B42] mb-2">
              Price ($)
            </label>
            <input
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#E8D9CC] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#D6A7A0]"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="bg-[#F9F5F2] p-5 rounded-lg">
          <label className="block text-base font-medium text-[#5C4B42] mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full min-h-[120px] px-4 py-3 border border-[#E8D9CC] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#D6A7A0]"
            placeholder="Enter detailed product description"
            required
          />
        </div>

        {/* Category Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Category */}
          <div className="bg-[#F9F5F2] p-5 rounded-lg">
            <label className="block text-base font-medium text-[#5C4B42] mb-2">
              Main Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${
                errors.category ? 'border-red-500' : 'border-[#E8D9CC]'
              } rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#D6A7A0]`}
              required
            >
              <option value="" disabled>
                Select category
              </option>
              {Object.keys(categoryMap).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">
                Please select a category
              </p>
            )}
          </div>

          {/* Subcategory */}
          <div className="bg-[#F9F5F2] p-5 rounded-lg">
            <label className="block text-base font-medium text-[#5C4B42] mb-2">
              Subcategory
            </label>
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              disabled={!formData.category}
              className={`w-full px-4 py-3 border ${
                errors.subCategory ? 'border-red-500' : 'border-[#E8D9CC]'
              } rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#D6A7A0]`}
              required
            >
              <option value="" disabled>
                {formData.category
                  ? 'Select subcategory'
                  : 'Select category first'}
              </option>
              {formData.category &&
                categoryMap[formData.category].map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
            </select>
            {errors.subCategory && (
              <p className="mt-1 text-sm text-red-500">
                Please select a subcategory
              </p>
            )}
          </div>
        </div>

        {/* Quantity */}
        <div className="bg-[#F9F5F2] p-5 rounded-lg">
          <label className="block text-base font-medium text-[#5C4B42] mb-2">
            Stock Quantity
          </label>
          <input
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-[#E8D9CC] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#D6A7A0]"
            type="number"
            placeholder="Enter quantity"
            min="0"
            required
          />
        </div>

        {/* Product Flags */}
        <div className="bg-[#F9F5F2] p-5 rounded-lg">
          <h2 className="text-base font-medium text-[#5C4B42] mb-4">
            Product Flags
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="bestSeller"
                name="bestSeller"
                checked={formData.bestSeller}
                onChange={handleChange}
                className="h-5 w-5 text-[#D6A7A0] focus:ring-[#D6A7A0]"
              />
              <label htmlFor="bestSeller" className="ml-2 text-[#5C4B42]">
                Best Seller
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="newArrival"
                name="newArrival"
                checked={formData.newArrival}
                onChange={handleChange}
                className="h-5 w-5 text-[#D6A7A0] focus:ring-[#D6A7A0]"
              />
              <label htmlFor="newArrival" className="ml-2 text-[#5C4B42]">
                New Arrival
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="onSale"
                name="onSale"
                checked={formData.onSale}
                onChange={handleChange}
                className="h-5 w-5 text-[#D6A7A0] focus:ring-[#D6A7A0]"
              />
              <label htmlFor="onSale" className="ml-2 text-[#5C4B42]">
                On Sale
              </label>
            </div>

            <div>
              <label className="block text-sm text-[#5C4B42]/80 mb-1">
                Sale Percent
              </label>
              <input
                name="onSalePercent"
                value={formData.onSalePercent}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#E8D9CC] rounded-lg bg-white"
                type="number"
                placeholder="0-100"
                min="0"
                max="100"
                disabled={!formData.onSale}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-4">
          <button
            type="submit"
            className="px-8 py-3 bg-[#D6A7A0] hover:bg-[#C79790] text-white font-medium rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
