import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendURL, currency } from '../constants/Exports';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const ProductPreview = ({ token }) => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [activeTab, setActiveTab] = useState('description');

  // Fetch product details
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${backendURL}/api/product/productDetails`,
        { productId },
        { headers: { token } }
      );

      if (response.data.success) {
        console.log(response.data.product);
        setProduct(response.data.product);
        setActiveImage(response.data.product.image[0]);
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

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

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
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-[#D6A7A0] text-white rounded-lg hover:bg-[#C79790]"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#5C4B42]">Product Preview</h1>
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
          Back to Products
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="bg-[#F9F5F2] p-6 rounded-xl">
          <div className="mb-4">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-96 object-contain rounded-lg"
            />
          </div>

          <div className="flex overflow-x-auto gap-3 pb-2">
            {product.image.map((img, index) => (
              <div
                key={index}
                onClick={() => setActiveImage(img)}
                className={`cursor-pointer border-2 rounded-lg flex-shrink-0 ${
                  activeImage === img
                    ? 'border-[#D6A7A0]'
                    : 'border-transparent'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-[#F9F5F2] p-6 rounded-xl">
          {/* Product Flags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.bestSeller && (
              <span className="bg-[#FFD700] text-[#5C4B42] px-3 py-1 rounded-full text-xs font-medium">
                Best Seller
              </span>
            )}
            {product.newArrival && (
              <span className="bg-[#FF6B6B] text-white px-3 py-1 rounded-full text-xs font-medium">
                New Arrival
              </span>
            )}
            {product.onSale && (
              <span className="bg-[#6BCB77] text-white px-3 py-1 rounded-full text-xs font-medium">
                Sale: {product.onSalePercent}% Off
              </span>
            )}
          </div>

          <h2 className="text-3xl font-bold text-[#5C4B42] mb-2">
            {product.name}
          </h2>

          <div className="flex items-center mb-4">
            <div className="flex text-amber-400 mr-2">
              {[...Array(4)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-300"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span className="text-sm text-gray-600">(122 reviews)</span>
          </div>

          <div className="mb-6">
            <p className="text-2xl font-bold text-[#D6A7A0]">
              {currency} {product.price.toFixed(2)}
              {product.onSale && (
                <span className="ml-2 text-lg text-gray-400 line-through">
                  {currency}{' '}
                  {(product.price * (1 + product.onSalePercent / 100)).toFixed(
                    2
                  )}
                </span>
              )}
            </p>
          </div>

          <div className="mb-6">
            <p className="text-lg text-[#5C4B42]">{product.description}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-[#F5F0EB] text-[#5C4B42] px-3 py-1 rounded-full text-sm">
              {product.category}
            </span>
            <span className="bg-[#F5F0EB] text-[#5C4B42] px-3 py-1 rounded-full text-sm">
              {product.subCategory}
            </span>
          </div>

          <div className="mb-8">
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                product.quantity > 10
                  ? 'bg-green-100 text-green-800'
                  : product.quantity > 0
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {product.quantity > 0
                ? `${product.quantity} in stock`
                : 'Out of stock'}
            </div>
          </div>

          <div className="bg-[#E8D9CC] p-4 rounded-lg">
            <p className="text-center text-[#5C4B42] font-medium">
              This is how customers will see your product.
              <span className="block mt-1 text-sm">
                (Add to Cart functionality disabled in preview)
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-10">
        <div className="flex border-b border-[#E8D9CC]">
          <button
            className={`px-6 py-3 text-base font-medium transition-colors ${
              activeTab === 'description'
                ? 'text-[#5C4B42] border-b-2 border-[#5C4B42]'
                : 'text-gray-500 hover:text-[#5C4B42]'
            }`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button
            className={`px-6 py-3 text-base font-medium transition-colors ${
              activeTab === 'details'
                ? 'text-[#5C4B42] border-b-2 border-[#5C4B42]'
                : 'text-gray-500 hover:text-[#5C4B42]'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Product Details
          </button>
          <button
            className={`px-6 py-3 text-base font-medium transition-colors ${
              activeTab === 'reviews'
                ? 'text-[#5C4B42] border-b-2 border-[#5C4B42]'
                : 'text-gray-500 hover:text-[#5C4B42]'
            }`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews (122)
          </button>
        </div>

        <div className="bg-[#F9F5F2] p-6 rounded-b-lg">
          {activeTab === 'description' ? (
            <div className="space-y-4 text-[#5C4B42]">
              <p className="leading-relaxed">{product.description}</p>
              <p className="leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Et
                ducimus eius eos deleniti cupiditate laudantium ex ea, dolore
                dolorem quod libero autem doloremque laboriosam ratione corrupti
                amet, excepturi veniam omnis!
              </p>
            </div>
          ) : activeTab === 'details' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-[#5C4B42] mb-3">
                  Product Information
                </h3>
                <ul className="space-y-2">
                  <li className="flex">
                    <span className="w-32 font-medium text-[#5C4B42]">
                      Category:
                    </span>
                    <span className="text-[#8C7B6B]">{product.category}</span>
                  </li>
                  <li className="flex">
                    <span className="w-32 font-medium text-[#5C4B42]">
                      Subcategory:
                    </span>
                    <span className="text-[#8C7B6B]">
                      {product.subCategory}
                    </span>
                  </li>
                  <li className="flex">
                    <span className="w-32 font-medium text-[#5C4B42]">
                      Stock:
                    </span>
                    <span className="text-[#8C7B6B]">
                      {product.quantity} units
                    </span>
                  </li>
                  <li className="flex">
                    <span className="w-32 font-medium text-[#5C4B42]">
                      Added:
                    </span>
                    <span className="text-[#8C7B6B]">
                      {new Date(product.date).toLocaleDateString()}
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#5C4B42] mb-3">
                  Flags & Status
                </h3>
                <ul className="space-y-2">
                  <li className="flex">
                    <span className="w-32 font-medium text-[#5C4B42]">
                      Best Seller:
                    </span>
                    <span className="text-[#8C7B6B]">
                      {product.bestSeller ? 'Yes' : 'No'}
                    </span>
                  </li>
                  <li className="flex">
                    <span className="w-32 font-medium text-[#5C4B42]">
                      New Arrival:
                    </span>
                    <span className="text-[#8C7B6B]">
                      {product.newArrival ? 'Yes' : 'No'}
                    </span>
                  </li>
                  <li className="flex">
                    <span className="w-32 font-medium text-[#5C4B42]">
                      On Sale:
                    </span>
                    <span className="text-[#8C7B6B]">
                      {product.onSale
                        ? `Yes (${product.onSalePercent}% off)`
                        : 'No'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-[#5C4B42]">
                  Customer Reviews
                </h3>
                <span className="text-sm text-[#8C7B6B]">
                  (Preview only - actual reviews will appear here)
                </span>
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((review) => (
                  <div
                    key={review}
                    className="bg-white p-4 rounded-lg border border-[#E8D9CC]"
                  >
                    <div className="flex items-center mb-3">
                      <div className="flex text-amber-400 mr-3">
                        {[...Array(4)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-300"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-500">2 days ago</span>
                    </div>
                    <h4 className="font-medium text-[#5C4B42] mb-1">
                      Satisfied Customer
                    </h4>
                    <p className="text-[#8C7B6B]">
                      This is a placeholder review. Actual customer reviews will
                      appear here once your product is live.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-[#D6A7A0] hover:bg-[#C79790] text-white font-medium rounded-lg transition-colors"
        >
          Back to Product Management
        </button>
      </div>
    </div>
  );
};

export default ProductPreview;
