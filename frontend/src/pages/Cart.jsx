import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import React, { useContext, useEffect, useState } from 'react';

const Cart = () => {
  const { products, currency, cartItems, modifyCartItemsQuantity } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];

    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }
    setCartData(tempData);
    console.log(tempData);
  }, [cartItems]);

  return (
    <div className="border-t pt-14 min-h-[100vh]">
      <div className="text-2xl mb-3 mt-10 text-center">
        <Title primaryText={'Shopping'} secondaryText={'Cart'} />
      </div>
      <div>
        {cartData.length ? (
          <div className="flex flex-col minh-20 mx-20">
            {cartData.map((item, index) => {
              const productData = products.find(
                (product) => product._id === item._id
              );
              return (
                <div className="flex flex-col mx-20">
                  <div
                    className="text-gray-700 grid grid-cols-[4fr_2fr_0.5fr] items-center gap-4 py-4"
                    key={index}
                  >
                    <div className="flex items-start gap-6">
                      <img
                        className="w-16 sm:w-20"
                        src={productData.image[0]}
                        alt=""
                      />
                      <div>
                        <p className="text-sm sm:text-lg font-medium">
                          {productData.name}
                        </p>
                        <div className="flex items-center gap-5 mt-2">
                          <p>
                            {currency} {productData.price}
                          </p>
                          <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                            {item.size}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button>
                        <img
                          className="min-w-5 w-5 min-h-5 h-5 cursor-pointer -rotate-90"
                          src={assets.arrow_up_icon}
                          onClick={() => {
                            if (item.quantity > 1) {
                              const newQuantityInput = item.quantity - 1;
                              modifyCartItemsQuantity(
                                item._id,
                                item.size,
                                newQuantityInput
                              );
                            }
                          }}
                          alt=""
                        />
                      </button>
                      <input
                        className="border-transparent bg-[#A6A58A]/30 max-w-10 sm:max-w-20 sm:px-2 p-1 text-center rounded-2xl"
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => {
                          const value = Number(e.target.value);

                          if (!isNaN(value) && value >= 1) {
                            modifyCartItemsQuantity(
                              item._id,
                              item.size,
                              Number(e.target.value)
                            );
                          }
                        }}
                      />
                      <button>
                        <img
                          className="min-w-5 w-5 min-h-5 h-5 cursor-pointer rotate-90"
                          src={assets.arrow_up_icon}
                          onClick={() => {
                            const newQuantityInput = item.quantity + 1;
                            modifyCartItemsQuantity(
                              item._id,
                              item.size,
                              newQuantityInput
                            );
                          }}
                          alt=""
                        />
                      </button>
                    </div>
                    <img
                      className="w-4 mr-[16vw] sm:w-5 cursor-pointer"
                      src={assets.bin_icon}
                      onClick={() =>
                        modifyCartItemsQuantity(item._id, item.size, 0)
                      }
                      alt="delete cart entry"
                    />
                  </div>
                  <span className="w-[75vw] border-b border-[#A6A58A] rounded-2xl"></span>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <span className="text-[#6c757d] text-lg font-medium mb-3">
                Your shopping cart is empty
              </span>
              <button className="bg-[#A6A58A] hover:bg-[#8a8970] text-white px-5 py-1.5 text-sm transition-colors duration-200">
                Browse Products
              </button>
            </div>
          </div>
        )}
      </div>
      {cartData.length ? (
        <div className="flex justify-end my-20 mx-20">
          <div className="w-full sm:w-[40vw]">
            <CartTotal />
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Cart;
