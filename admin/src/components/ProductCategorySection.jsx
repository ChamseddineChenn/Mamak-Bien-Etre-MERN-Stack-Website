import React from 'react';
import ProductCard from './ProductCard';

const ProductCategorySection = ({ category, subcategories, onDelete }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center mb-6 pb-3 border-b border-[#E8D9CC]">
        <h2 className="text-2xl font-bold text-[#5C4B42]">{category}</h2>
        <span className="ml-3 bg-[#D6A7A0] text-white text-sm px-3 py-1 rounded-full">
          {Object.values(subcategories).flat().length} products
        </span>
      </div>

      {Object.entries(subcategories).map(([subcategory, products]) => (
        <div key={subcategory} className="mb-8">
          <h3 className="text-xl font-semibold text-[#8C7B6B] mb-4">
            {subcategory}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCategorySection;
