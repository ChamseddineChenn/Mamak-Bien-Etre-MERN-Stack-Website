import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendURL } from '../constants/Exports';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import MarkdownEditor from '../components/MarkdownEditor';

// Helper function to parse multi-language descriptions
const parseMultiLanguageDescription = (description, currentLanguage = 'en') => {
  if (!description) return '';

  if (typeof description === 'string') {
    if (description.startsWith('{') && description.endsWith('}')) {
      try {
        const parsed = JSON.parse(description);
        if (typeof parsed === 'object' && parsed !== null) {
          return parsed[currentLanguage] || parsed.en || '';
        }
      } catch (error) {
        console.error('Error parsing description JSON:', error);
        return description;
      }
    }
    return description;
  }

  if (typeof description === 'object' && description !== null) {
    return description[currentLanguage] || description.en || '';
  }

  return '';
};

const ProductEdit = ({ token }) => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: {
      en: '',
      fr: '',
      de: '',
    },
    technicalDescription: {
      en: '',
      fr: '',
      de: '',
    },
    price: '',
    quantity: '',
    category: '',
    subCategory: '',
    bestSeller: false,
    newArrival: false,
    onSale: false,
    onSalePercent: '',
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [activeDescLang, setActiveDescLang] = useState('en');
  const [activeTechLang, setActiveTechLang] = useState('en');

  // Language configuration
  const languages = {
    en: { name: 'English', flag: '🇬🇧' },
    fr: { name: 'Français', flag: '🇫🇷' },
    de: { name: 'Deutsch', flag: '🇩🇪' },
  };

  // Language Tab Component
  const LanguageTabs = ({ activeLang, onLanguageChange }) => (
    <div className="flex border-b border-[#E8D9CC] mb-4">
      {Object.entries(languages).map(([code, lang]) => (
        <button
          key={code}
          type="button"
          onClick={() => onLanguageChange(code)}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeLang === code
              ? 'border-[#D6A7A0] text-[#5C4B42] font-medium'
              : 'border-transparent text-[#5C4B42]/60 hover:text-[#5C4B42]'
          }`}
        >
          <span>{lang.flag}</span>
          <span>{lang.name}</span>
        </button>
      ))}
    </div>
  );

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${backendURL}/api/product/productDetails`,
          { productId },
          { headers: { token } }
        );

        if (response.data.success) {
          const prod = response.data.product;
          setProduct(prod);

          // Parse multi-language descriptions
          const description = {
            en: parseMultiLanguageDescription(prod.description, 'en'),
            fr: parseMultiLanguageDescription(prod.description, 'fr'),
            de: parseMultiLanguageDescription(prod.description, 'de'),
          };

          const technicalDescription = {
            en: parseMultiLanguageDescription(prod.technicalDescription, 'en'),
            fr: parseMultiLanguageDescription(prod.technicalDescription, 'fr'),
            de: parseMultiLanguageDescription(prod.technicalDescription, 'de'),
          };

          setFormData({
            name: prod.name,
            description: description,
            technicalDescription: technicalDescription,
            price: prod.price.toString(),
            quantity: prod.quantity.toString(),
            category: prod.category,
            subCategory: prod.subCategory,
            bestSeller: prod.bestSeller,
            newArrival: prod.newArrival,
            onSale: prod.onSale,
            onSalePercent: prod.onSalePercent.toString() || '',
            images: prod.image,
          });
          setImagePreviews(prod.image);
        } else {
          toast.error('Failed to load product details');
        }
      } catch (error) {
        console.error('Product fetch error:', error);
        toast.error('Error loading product');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, token]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle multi-language description changes
  const handleDescriptionChange = (lang, value, field = 'description') => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);

    // Create previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  const removeImage = (index) => {
    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);

    // Handle if all images are removed
    if (index >= formData.images.length) {
      const newIndex = index - formData.images.length;
      const updatedNewImages = [...newImages];
      updatedNewImages.splice(newIndex, 1);
      setNewImages(updatedNewImages);
    } else {
      const updatedImages = [...formData.images];
      updatedImages.splice(index, 1);
      setFormData({
        ...formData,
        images: updatedImages.length > 0 ? updatedImages : [],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();

      // Append correct ID field
      form.append('id', productId);

      // Append form data with proper formatting
      form.append('name', formData.name);
      form.append('description', JSON.stringify(formData.description));
      form.append(
        'technicalDescription',
        JSON.stringify(formData.technicalDescription)
      );
      form.append('price', formData.price.toString());
      form.append('quantity', formData.quantity.toString());
      form.append('category', formData.category);
      form.append('subCategory', formData.subCategory);
      form.append('bestSeller', formData.bestSeller ? 'true' : 'false');
      form.append('newArrival', formData.newArrival ? 'true' : 'false');
      form.append('onSale', formData.onSale ? 'true' : 'false');
      form.append('onSalePercent', formData.onSalePercent.toString());

      // Append existing images as a JSON string array
      form.append('existingImages', JSON.stringify(formData.images));

      // Append new images with correct field names
      newImages.forEach((img, index) => {
        form.append(`image${index + 1}`, img);
      });

      const response = await axios.put(
        `${backendURL}/api/product/editProduct`,
        form,
        {
          headers: {
            token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success('Product updated successfully!');
        navigate('/admin/displayProducts');
      } else {
        toast.error(response.data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Error updating product');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D6A7A0]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-[#E8D9CC]">
        <h3 className="text-2xl font-medium text-[#5C4B42] mb-3">
          Product Not Found
        </h3>
        <button
          onClick={() => navigate('/admin/products')}
          className="mt-4 px-4 py-2 bg-[#D6A7A0] text-white rounded-lg hover:bg-[#C79790]"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#5C4B42]">Edit Product</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-[#F9F5F2] hover:bg-[#F5F0EB] text-[#5C4B42] font-medium rounded-lg px-4 py-2 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-[#F9F5F2] p-6 rounded-xl">
          <h2 className="text-xl font-bold text-[#5C4B42] mb-4">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#5C4B42] mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-[#E8D9CC] rounded-lg focus:ring-[#D6A7A0] focus:border-[#D6A7A0]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5C4B42] mb-1">
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-[#E8D9CC] rounded-lg focus:ring-[#D6A7A0] focus:border-[#D6A7A0]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5C4B42] mb-1">
                Category *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-[#E8D9CC] rounded-lg focus:ring-[#D6A7A0] focus:border-[#D6A7A0]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5C4B42] mb-1">
                Subcategory *
              </label>
              <input
                type="text"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-[#E8D9CC] rounded-lg focus:ring-[#D6A7A0] focus:border-[#D6A7A0]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5C4B42] mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-[#E8D9CC] rounded-lg focus:ring-[#D6A7A0] focus:border-[#D6A7A0]"
                required
              />
            </div>
          </div>
        </div>

        {/* Multi-language Description Section */}
        <div className="bg-[#F9F5F2] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-base font-medium text-[#5C4B42]">
              Product Description
            </label>
            <span className="text-sm text-[#5C4B42]/60">
              Required for all languages
            </span>
          </div>

          <LanguageTabs
            activeLang={activeDescLang}
            onLanguageChange={setActiveDescLang}
            type="description"
          />

          {Object.entries(languages).map(([code, lang]) => (
            <div
              key={code}
              className={activeDescLang === code ? 'block' : 'hidden'}
            >
              <MarkdownEditor
                value={formData.description[code]}
                onChange={(value) =>
                  handleDescriptionChange(code, value, 'description')
                }
                placeholder={`Enter product description in ${lang.name} using markdown formatting...`}
                height="250px"
              />
            </div>
          ))}
        </div>

        {/* Images */}
        <div className="bg-[#F9F5F2] p-6 rounded-xl">
          <h2 className="text-xl font-bold text-[#5C4B42] mb-4">
            Product Images
          </h2>

          <div className="flex flex-wrap gap-4 mb-6">
            {imagePreviews.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img}
                  alt={`Preview ${index}`}
                  className="w-24 h-24 object-cover rounded-lg border-2 border-[#E8D9CC]"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <label className="block text-sm font-medium text-[#5C4B42] mb-2">
            Add New Images
          </label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            accept="image/*"
            className="block w-full text-sm text-[#5C4B42]
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-medium
              file:bg-[#D6A7A0] file:text-white
              hover:file:bg-[#C79790]
            "
          />
          <p className="mt-1 text-sm text-[#8C7B6B]">
            Add up to 10 images (JPEG, PNG, etc.)
          </p>
        </div>

        {/* Multi-language Technical Description Section */}
        <div className="bg-[#F9F5F2] p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-base font-medium text-[#5C4B42]">
              Technical Description
            </label>
            <span className="text-sm text-[#5C4B42]/60">
              Optional for all languages
            </span>
          </div>

          <LanguageTabs
            activeLang={activeTechLang}
            onLanguageChange={setActiveTechLang}
            type="technical"
          />

          {Object.entries(languages).map(([code, lang]) => (
            <div
              key={code}
              className={activeTechLang === code ? 'block' : 'hidden'}
            >
              <MarkdownEditor
                value={formData.technicalDescription[code]}
                onChange={(value) =>
                  handleDescriptionChange(code, value, 'technicalDescription')
                }
                placeholder={`Enter technical description in ${lang.name} using markdown formatting...`}
                height="200px"
              />
            </div>
          ))}
        </div>

        {/* Flags & Status */}
        <div className="bg-[#F9F5F2] p-6 rounded-xl">
          <h2 className="text-xl font-bold text-[#5C4B42] mb-4">
            Status Flags
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                id="bestSeller"
                name="bestSeller"
                type="checkbox"
                checked={formData.bestSeller}
                onChange={handleInputChange}
                className="h-4 w-4 text-[#D6A7A0] rounded focus:ring-[#D6A7A0] border-[#E8D9CC]"
              />
              <label
                htmlFor="bestSeller"
                className="ml-2 text-sm text-[#5C4B42]"
              >
                Best Seller
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="newArrival"
                name="newArrival"
                type="checkbox"
                checked={formData.newArrival}
                onChange={handleInputChange}
                className="h-4 w-4 text-[#D6A7A0] rounded focus:ring-[#D6A7A0] border-[#E8D9CC]"
              />
              <label
                htmlFor="newArrival"
                className="ml-2 text-sm text-[#5C4B42]"
              >
                New Arrival
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="onSale"
                name="onSale"
                type="checkbox"
                checked={formData.onSale}
                onChange={handleInputChange}
                className="h-4 w-4 text-[#D6A7A0] rounded focus:ring-[#D6A7A0] border-[#E8D9CC]"
              />
              <label htmlFor="onSale" className="ml-2 text-sm text-[#5C4B42]">
                On Sale
              </label>
            </div>
          </div>

          {formData.onSale && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-[#5C4B42] mb-1">
                Discount Percentage
              </label>
              <input
                type="number"
                name="onSalePercent"
                value={formData.onSalePercent}
                onChange={handleInputChange}
                min="0"
                max="100"
                className="w-32 px-4 py-2 border border-[#E8D9CC] rounded-lg focus:ring-[#D6A7A0] focus:border-[#D6A7A0]"
              />
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-[#D6A7A0] hover:bg-[#C79790] text-white font-medium rounded-lg transition-colors"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;
