import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import React, { useContext } from 'react';

const Orders = () => {
  const { products, currency } = useContext(ShopContext);

  return (
    <div className="border-t m-10 pt-16 min-h-[100vh]">
      <div className="text-2xl flex justify-center">
        <Title primaryText={'My'} secondaryText={'Orders'} />
      </div>
      <div className="mx-5 md:mx-15 lg:mx-25">
        {products.slice(1, 4).map((item, index) => (
          <div className="py-4 text-gray-700" key={index}>
            {/* Main content container */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Product Info Section */}
              <div className="flex flex-row w-full md:w-auto">
                <img
                  className="w-16 h-16 sm:w-25 sm:h-25 rounded"
                  src={item.image[0]}
                  alt={item.name}
                />
                <div className="flex flex-col ml-5">
                  <p className="sm:text-xl font-medium">{item.name}</p>
                  <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                    <p className="text-lg">
                      {currency}
                      {item.price}
                    </p>
                    <p>Quantity: 1</p>
                    <p>Size: M</p>
                  </div>
                  <p className="mt-2">
                    Date: <span className="text-gray-400">05/03/2025</span>
                  </p>
                </div>
              </div>

              {/* Status and Button Section */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <p className="min-w-2 h-2 rounded-full bg-green-700"></p>
                  <p className="text-sm md:text-base">Ready To Deliver</p>
                </div>
                <button className="py-2 px-5 bg-[#A6A584]/90 hover:bg-[#bbba96] text-[#3A3A3A] font-medium rounded-lg transition-colors duration-300 sm:ml-4">
                  Track Order
                </button>
              </div>
            </div>

            {/* Divider - placed outside the main flex container */}
            <span className="block w-full border-b border-[#A6A58A] rounded-2xl mt-4"></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
