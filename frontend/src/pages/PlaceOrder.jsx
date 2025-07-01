import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import Title from '../components/Title';
import React, { useContext, useState } from 'react';

const PlaceOrder = () => {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const { navigate } = useContext(ShopContext);

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 m-10 pt-5 px-10 sm:pt-14 min-h-[100vh] border-t">
      {/* ------- Left Side -------- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className=" text-xl sm:text-2xl my-3 px-20">
          <Title primaryText={'Order'} secondaryText={'Information'} />
        </div>
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="First Name"
          />
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Last Name"
          />
        </div>
        <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="email"
          placeholder="Email Address"
        />
        <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          placeholder="Street"
        />
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="City"
          />
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="State"
          />
        </div>
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="number"
            placeholder="Zip Code"
          />
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="number"
          placeholder="Phone Number"
        />
      </div>
      {/* ------- Right Side ------- */}
      <div className="my-3">
        <div className="w-[40vw] min-w-80">
          <CartTotal />
        </div>
        {/* payment method selection section */}
        <div className="mt-12 ">
          <Title primaryText={'Payment'} secondaryText={'Method'} />
        </div>
        <div className="flex flex-col gap-3 text-[#3A3A3A]">
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              className="flex items-center gap-3 border-2 border-[#E6E4D8] rounded p-2 px-3 cursor-pointer"
              onClick={() => setPaymentMethod('icc')}
            >
              <p
                className={`min-w-3.5 h-3.5 border border-[#A6A58A] rounded-full ${
                  paymentMethod === 'icc' && 'bg-[#A6A58A]'
                } `}
              ></p>
              <div className="flex flex-row items-center">
                <img
                  className="w-15 h-10 object-contain"
                  src={assets.card_icon}
                  alt=""
                />
                <p className="">International Credit Card</p>
              </div>
            </div>
            <div
              className="flex items-center gap-3 border-2 border-[#E6E4D8] rounded p-2 px-3 cursor-pointer"
              onClick={() => setPaymentMethod('ncc')}
            >
              <p
                className={`min-w-3.5 h-3.5 border border-[#A6A58A] rounded-full ${
                  paymentMethod === 'ncc' && 'bg-[#A6A58A]'
                } `}
              ></p>
              <div className="flex flex-row items-center">
                <img
                  className="w-15 h-10 object-contain"
                  src={assets.card_icon}
                  alt=""
                />
                <p className="">National Credit Card (Tunisia)</p>
              </div>
            </div>
          </div>
          <div
            className="flex items-center gap-3 border-2 border-[#E6E4D8] rounded p-2 px-3 cursor-pointer"
            onClick={() => setPaymentMethod('cod')}
          >
            <p
              className={`min-w-3.5 h-3.5 border border-[#A6A58A] rounded-full ${
                paymentMethod === 'cod' && 'bg-[#A6A58A]'
              } `}
            ></p>
            <p>Cash On Delivery</p>
          </div>
        </div>
        <div className="w-full text-end mt-8">
          <button
            className="mt-5 py-2 px-5 bg-[#f2b67b] hover:bg-[#e8a85f] text-[#5c4b42] font-medium rounded-lg transition-colors duration-300"
            onClick={() => navigate('/orders')}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
