import CartTotal from '../components/CartTotal';
import Title from '../components/Title';
import React from 'react';

const PlaceOrder = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 m-10 pt-5 px-10 sm:pt-14 min-h-[80vh] border-t">
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
        <div className="flex gap-3 flex-col lg:flex-row">
          <div className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
            <p className={`min-w-3.5 h-3.5 border rounded-full `}></p>
            <img src="" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
