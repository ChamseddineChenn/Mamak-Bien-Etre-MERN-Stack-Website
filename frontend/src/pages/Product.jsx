import RelatedProducts from '../components/RelatedProducts';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

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
            state={{ autoSelectCategory: product.category }}
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
  const {
    products,
    currency,
    addToCart,
    getRealTimeStock,
    user,
    checkReviewEligibility,
    addProductReview,
  } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [productImage, setProductImage] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [availableStock, setAvailableStock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  const fetchProductData = async () => {
    const product = products.find((item) => item._id === productId);
    if (product) {
      setProductData(product);
      setProductImage(product.image[0]);
      const stock = await getRealTimeStock(productId);
      setAvailableStock(stock);
      setLoading(false);
      // Check if user has already reviewed this product
      if (user && product.reviews) {
        const reviewed = product.reviews.some((r) => r.userId === user._id);
        setHasReviewed(reviewed);
      }
    }
  };

  const handleAddToCart = async () => {
    if (availableStock > 0) {
      try {
        await addToCart(productData._id);
        // Refresh stock after adding to cart
        const updatedStock = await getRealTimeStock(productData._id);
        setAvailableStock(updatedStock);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      toast.warning('This item is out of stock');
    }
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!productData?.reviews || productData.reviews.length === 0) return 0;

    const total = productData.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    return total / productData.reviews.length;
  };

  // Adding review for the product
  const handleAddReview = async () => {
    if (!reviewRating || !reviewText.trim()) {
      toast.warning('Please provide both rating and review text');
      return;
    }

    setIsLoadingReview(true);
    try {
      const result = await addProductReview(
        productId,
        reviewRating,
        reviewText
      );

      if (result.success) {
        toast.success('Review submitted successfully!');
        setProductData(result.product);
        setReviewRating(0);
        setReviewText('');
        setActiveTab('reviews');
        setHasReviewed(true);
      } else {
        toast.error(result.message || 'Failed to submit review');
      }
    } catch (error) {
      console.log(error.message);
      toast.error('Failed to submit review');
    } finally {
      setIsLoadingReview(false);
    }
  };

  // Check eligibility
  useEffect(() => {
    const checkEligibility = async () => {
      if (user && productId) {
        const eligible = await checkReviewEligibility(user._id, productId);
        setIsEligible(eligible);
      }
    };

    if (user) {
      checkEligibility();
    }
  }, [user, productId, checkReviewEligibility]);

  useEffect(() => {
    if (products.length > 0) {
      fetchProductData();
    }
  }, [productId, products]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[100vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-[#A6A58A]"></div>
      </div>
    );
  }

  const averageRating = calculateAverageRating();
  const reviewCount = productData?.reviews?.length || 0;

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
                {[...Array(5)].map((_, i) => {
                  const ratingValue = i + 1;
                  return (
                    <img
                      key={i}
                      src={
                        ratingValue <= Math.floor(averageRating)
                          ? assets.star_icon
                          : ratingValue - 0.5 <= averageRating
                          ? assets.star_half_icon
                          : assets.star_icon
                      }
                      alt={ratingValue <= averageRating ? '★' : '☆'}
                      className="w-5 h-5"
                      style={{
                        opacity: ratingValue > averageRating ? 0.4 : 1,
                      }}
                    />
                  );
                })}
              </div>
              <span className="text-sm text-gray-600">
                ({reviewCount} reviews)
              </span>
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
                  availableStock > 10
                    ? 'bg-green-100 text-green-800'
                    : availableStock > 0
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {availableStock > 0
                  ? `${availableStock} in stock`
                  : 'Out of stock'}
              </span>
            </div>

            {/* Add to Cart */}
            <button
              className={`w-full sm:w-auto px-8 py-4 rounded-full font-medium mb-10 transition-colors shadow-sm hover:shadow-md ${
                availableStock > 0
                  ? 'bg-[#D6A7A0] hover:bg-[#C79790] text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={handleAddToCart}
              disabled={availableStock === 0}
            >
              {availableStock > 0 ? 'Add to Cart' : 'Out of Stock'}
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
            Technical Description
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'reviews'
                ? 'text-[#5C4B42] border-b-2 border-[#5C4B42]'
                : 'text-gray-500 hover:text-[#5C4B42]'
            }`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({reviewCount})
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-[#F9F5F2] p-4 md:px-8 rounded-b-lg">
          {activeTab === 'description' ? (
            <div className="text-[#3A3A3A]/90">
              {productData.technicalDescription && (
                <>
                  <h3 className="font-semibold mt-6">
                    Technical Specifications
                  </h3>
                  <p>{productData.technicalDescription}</p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {user && isEligible && !hasReviewed && (
                <div className="bg-white p-4 rounded-lg border border-[#E8D9CC]">
                  <h3 className="font-medium text-[#5C4B42] mb-3">
                    Write a Review
                  </h3>
                  <div className="flex items-center mb-3">
                    <span className="mr-2 text-[#5C4B42]">Rating:</span>
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setReviewRating(i + 1)}
                        className="mx-1 focus:outline-none"
                      >
                        <img
                          src={
                            i + 1 <= reviewRating
                              ? assets.star_icon
                              : assets.star_icon
                          }
                          alt={i + 1 <= reviewRating ? '★' : '☆'}
                          className="w-6 h-6"
                          style={{ opacity: i + 1 > reviewRating ? 0.4 : 1 }}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full min-h-[100px] p-3 border border-[#E8D9CC] rounded-lg mb-3"
                    placeholder="Share your experience with this product..."
                  />
                  <button
                    onClick={handleAddReview}
                    disabled={isLoadingReview}
                    className="px-4 py-2 bg-[#D6A7A0] text-white rounded-lg hover:bg-[#C79790] disabled:opacity-50"
                  >
                    {isLoadingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              )}

              {productData.reviews?.length > 0 ? (
                productData.reviews.map((review) => (
                  <div
                    key={review._id || review.createdAt}
                    className="bg-white p-4 rounded-lg border border-[#E8D9CC]"
                  >
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <img
                            key={i}
                            src={
                              i < review.rating
                                ? assets.star_icon
                                : assets.star_icon
                            }
                            alt={i < review.rating ? '★' : '☆'}
                            className="w-4 h-4"
                            style={{ opacity: i >= review.rating ? 0.4 : 1 }}
                          />
                        ))}
                      </div>
                      <span className="ml-2 font-medium text-[#5C4B42]">
                        {review.userName}
                      </span>
                      <span className="ml-auto text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[#5C4B42]">{review.reviewText}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No reviews yet. Be the first to review!
                </p>
              )}
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
