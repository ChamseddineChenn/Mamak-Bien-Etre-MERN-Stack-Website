import { currency } from '../constants/Exports';
import { useNavigate } from 'react-router-dom';

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

// Helper function to strip markdown for preview
const stripMarkdown = (text) => {
  if (!text) return '';
  return (
    text
      .replace(/#{1,6}\s?/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/- /g, '') // Remove bullet points
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .substring(0, 120) + '...'
  ); // Limit length
};

const ProductCard = ({ product, onDelete }) => {
  const navigate = useNavigate();
  const description = parseMultiLanguageDescription(product.description, 'en');
  const strippedDescription = stripMarkdown(description);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#E8D9CC] transition-all hover:shadow-md group">
      {/* Product Image */}
      <div className="relative h-60 overflow-hidden">
        {product.image && product.image[0] ? (
          <img
            src={product.image[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-[#F5F0EB] flex items-center justify-center">
            <span className="text-[#D6A7A0] text-sm">No Image Available</span>
          </div>
        )}

        {/* Flags */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
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
              Sale: {product.onSalePercent}%
            </span>
          )}
        </div>

        {/* Stock Indicator */}
        <div className="absolute bottom-3 left-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
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
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-[#5C4B42] truncate flex-1 min-w-0 mr-2">
            {product.name}
          </h3>
          <div className="flex-shrink-0 text-right">
            {/* Changed to a div container with flex-shrink-0 */}
            <div className="flex items-baseline justify-end gap-1">
              {product.onSale ? (
                <>
                  <span className="text-xl font-bold text-[#D6A7A0] whitespace-nowrap">
                    {currency}
                    {(
                      product.price *
                      (1 - product.onSalePercent / 100)
                    ).toFixed(2)}
                  </span>
                  <span className="ml-2 text-base text-gray-400 line-through whitespace-nowrap">
                    {currency}
                    {product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-[#D6A7A0] whitespace-nowrap">
                  {currency}
                  {product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-[#8C7B6B] text-sm mb-4 line-clamp-2 h-12">
          {strippedDescription}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          <span className="bg-[#F5F0EB] text-[#5C4B42] px-3 py-1 rounded-full text-xs">
            {product.category}
          </span>
          <span className="bg-[#F5F0EB] text-[#5C4B42] px-3 py-1 rounded-full text-xs">
            {product.subCategory}
          </span>
        </div>

        <div className="flex justify-between border-t border-[#E8D9CC] pt-4">
          <button
            className="text-[#5C4B42] hover:text-[#D6A7A0] transition-colors"
            onClick={() => navigate(`/admin/product-edit/${product._id}`)}
          >
            Edit
          </button>
          <button
            className="text-[#5C4B42] hover:text-[#D6A7A0] transition-colors"
            onClick={() => navigate(`/admin/product-preview/${product._id}`)}
          >
            Preview
          </button>
          <button
            className="text-red-600 hover:text-red-800 transition-colors"
            onClick={() => onDelete(product._id)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
