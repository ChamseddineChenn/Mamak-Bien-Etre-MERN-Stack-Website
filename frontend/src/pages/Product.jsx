import RelatedProducts from '../components/RelatedProducts';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ProductBreadcrumbs = ({ product }) => {
  return (
    <nav aria-label="Breadcrumb" className="p-1">
      <ol className="flex items-center gap-2 text-sm text-[#5C4B42]">
        {/* Home */}
        <li>
          <Link to="/" className="hover:underline">
            Home
          </Link>
        </li>
        <li className="text-[#D6A7A0]">/</li>
        <li>
          <Link to="/collection" className="hover:underline">
            Collection
          </Link>
        </li>
        {/* Category */}
        <li className="text-[#D6A7A0]">/</li>
        <li>
          <Link
            to="/collection"
            state={{ autoSelectCategory: product.category }} // Pass category as navigation state
            className="hover:underline"
          >
            {product.category}
          </Link>
        </li>

        {/* Current Product (non-clickable) */}
        <li className="text-[#D6A7A0]">/</li>
        <li className="font-medium">{product.name}</li>
      </ol>
    </nav>
  );
};

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [productImage, setProductImage] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [localQuantity, setLocalQuantity] = useState(0);

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setProductImage(item.image[0]);
        setLocalQuantity(item.quantity);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, products]);

  const handleAddToCart = () => {
    if (localQuantity > 0) {
      addToCart(productData._id);
      setLocalQuantity((prev) => Math.max(0, prev - 1)); // Decrement local quantity
    } else {
      alert('This product is out of stock');
    }
  };

  return productData ? (
    <div className="mt-20 transition-opacity ease-in duration-500 opacity-100 text-[#3A3A3A] ">
      {/* Product Data div */}
      <div className="flex flex-col-reverse sm:flex-row mx-5">
        {/* Product image display */}
        <div className="flex-1 flex flex-col aspect-square">
          <div className="my-5 w-full sm:w-[90%]">
            <img
              className="rounded-xl flex justify-start h-full object-contain"
              src={productImage}
              alt=""
            />
          </div>
          <div className="flex overflow-x-scroll mr-20 gap-3">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setProductImage(item)}
                className="rounded-xl w-30 h-30 flex-shrink-0 cursor-pointer object-cover"
                src={item}
                key={index}
                alt=""
              />
            ))}
          </div>
        </div>
        {/* Product Info */}
        <div className="flex-1 ">
          <div className="product-details">
            <div className="mt-10 transition-opacity ease-in duration-500 opacity-100 text-[#3A3A3A]">
              <ProductBreadcrumbs product={productData} />
            </div>
            {/* Product Title */}
            <h1 className="font-serif font-semibold text-4xl md:text-5xl mb-4 text-[#3A3A3A] my-5">
              {productData.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(4)].map((_, i) => (
                  <img
                    key={i}
                    src={assets.star_icon}
                    alt="★"
                    className="w-5 h-5"
                  />
                ))}
                <img
                  src={assets.star_icon}
                  alt="☆"
                  className="w-5 h-5 opacity-40"
                />
              </div>
              <span className="text-sm text-gray-600">(122 reviews)</span>
            </div>

            {/* Price */}
            <p className="text-3xl font-medium mb-6 text-[#5C4B42]">
              {currency} {productData.price.toFixed(2)}
            </p>

            {/* Description */}
            <p className="text-lg leading-relaxed mb-8 text-[#3A3A3A]/90 max-w-3xl">
              {productData.description}
            </p>

            {/* Stock Indicator */}
            <div className="mb-4">
              <span
                className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${
                  localQuantity > 10
                    ? 'bg-green-100 text-green-800'
                    : localQuantity > 0
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {localQuantity > 0
                  ? `${localQuantity} in stock`
                  : 'Out of stock'}
              </span>
            </div>

            {/* Add to Cart */}
            <button
              className={`w-full sm:w-auto px-8 py-4 rounded-full font-medium mb-10 transition-colors shadow-sm hover:shadow-md ${
                localQuantity > 0
                  ? 'bg-[#D6A7A0] hover:bg-[#C79790] text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={handleAddToCart}
              disabled={localQuantity === 0}
            >
              {localQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>

            {/* Divider */}
            <hr className="border-t border-[#E8D9CC] my-8" />

            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: assets.natural_icon, text: '100% Original & Natural' },
                { icon: assets.cash_icon, text: 'Cash on delivery available' },
                { icon: assets.cashback_icon, text: '7-day return policy' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="bg-[#F5F0EB] p-2 rounded-full">
                    <img src={feature.icon} alt="" className="w-6 h-6" />
                  </div>
                  <p className="text-gray-700">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Product Tabs Section */}
      <div className="mx-5 md:mx-20 my-16">
        {/* Tab Navigation */}
        <div className="flex border-b border-[#E8D9CC]">
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'description'
                ? 'text-[#5C4B42] border-b-2 border-[#5C4B42]'
                : 'text-gray-500 hover:text-[#5C4B42]'
            }`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'reviews'
                ? 'text-[#5C4B42] border-b-2 border-[#5C4B42]'
                : 'text-gray-500 hover:text-[#5C4B42]'
            }`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews (122)
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-[#F9F5F2] p-6 md:p-8 rounded-b-lg">
          {activeTab === 'description' ? (
            <div className="space-y-4 text-[#3A3A3A]/90">
              <p className="leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Et
                ducimus eius eos deleniti cupiditate laudantium ex ea, dolore
                dolorem quod libero autem doloremque laboriosam ratione corrupti
                amet, excepturi veniam omnis!
              </p>
              <p className="leading-relaxed">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Molestias nesciunt necessitatibus eligendi est soluta, quis
                ipsum dolores molestiae possimus doloremque, dolor dolorum
                fugiat laborum, reprehenderit deleniti modi at reiciendis
                repellat.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Review items would go here */}
              <p className="text-gray-500">
                Review content would be displayed here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Other Products the customer may like based on their choice */}
      <RelatedProducts category={productData.category} />
    </div>
  ) : (
    <div className="bg-amber-300 min-h-[100vh]"></div>
  );
};

export default Product;
