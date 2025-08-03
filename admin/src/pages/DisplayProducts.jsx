import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendURL } from '../constants/Exports';
import { toast } from 'react-toastify';
import ProductCategorySection from '../components/ProductCategorySection';

const DisplayProducts = ({ token }) => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    bestSellers: 0,
    newArrivals: 0,
    onSale: 0,
  });
  const [loading, setLoading] = useState(true);

  // Group products by category and subcategory
  const groupProducts = (products) => {
    const grouped = {};

    products.forEach((product) => {
      if (!grouped[product.category]) {
        grouped[product.category] = {};
      }

      if (!grouped[product.category][product.subCategory]) {
        grouped[product.category][product.subCategory] = [];
      }

      grouped[product.category][product.subCategory].push(product);
    });

    return grouped;
  };

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        backendURL + '/api/product/displayProducts',
        { headers: { token } }
      );

      if (response.data.success) {
        const products = response.data.products;

        // Calculate stats
        const bestSellers = products.filter((p) => p.bestSeller).length;
        const newArrivals = products.filter((p) => p.newArrival).length;
        const onSale = products.filter((p) => p.onSale).length;

        setStats({
          total: products.length,
          bestSellers,
          newArrivals,
          onSale,
        });

        // Group products
        setGroupedProducts(groupProducts(products));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await axios.post(
          backendURL + '/api/product/removeProduct',
          { id },
          { headers: { token } }
        );
        if (response.data.success) {
          toast.success('Product removed successfully');
          fetchList(); // Refresh the list
        }
      } catch (error) {
        toast.error('Failed to delete product: ' + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F5F2] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Refresh Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#5C4B42]">
              Product Collection
            </h1>
            <p className="text-[#8C7B6B] mt-2 max-w-2xl">
              Products organized by category and subcategory for easy management
            </p>
          </div>
          <button
            onClick={fetchList}
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
            Refresh Products
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-[#E8D9CC]">
            <h3 className="text-lg font-medium text-[#5C4B42] mb-2">
              Total Products
            </h3>
            <p className="text-3xl font-bold text-[#5C4B42]">{stats.total}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-[#E8D9CC]">
            <h3 className="text-lg font-medium text-[#5C4B42] mb-2">
              Best Sellers
            </h3>
            <p className="text-3xl font-bold text-[#5C4B42]">
              {stats.bestSellers}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-[#E8D9CC]">
            <h3 className="text-lg font-medium text-[#5C4B42] mb-2">
              New Arrivals
            </h3>
            <p className="text-3xl font-bold text-[#5C4B42]">
              {stats.newArrivals}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-[#E8D9CC]">
            <h3 className="text-lg font-medium text-[#5C4B42] mb-2">On Sale</h3>
            <p className="text-3xl font-bold text-[#5C4B42]">{stats.onSale}</p>
          </div>
        </div>

        {/* Products by Category */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D6A7A0]"></div>
          </div>
        ) : Object.keys(groupedProducts).length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-[#E8D9CC]">
            <h3 className="text-2xl font-medium text-[#5C4B42] mb-3">
              No Products Found
            </h3>
            <p className="text-[#8C7B6B] max-w-md mx-auto">
              Your product collection is empty. Start by adding new products to
              showcase here.
            </p>
          </div>
        ) : (
          <div>
            {Object.entries(groupedProducts).map(
              ([category, subcategories]) => (
                <ProductCategorySection
                  key={category}
                  category={category}
                  subcategories={subcategories}
                  onDelete={handleDelete}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayProducts;
