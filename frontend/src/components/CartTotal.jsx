import { ShopContext } from '../context/ShopContext';
import React, { useContext } from 'react';
import Title from './Title';

const CartTotal = () => {
  const { currency, delivery_fee, getCartTotal } = useContext(ShopContext);

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title primaryText={'Cart'} secondaryText={'Total'} />
      </div>
      <div className="flex flex-col gap-2 m-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency} {getCartTotal()}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Delivery fee</p>
          <p>
            {currency} {delivery_fee}.00
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <b>Total</b>
          <b>
            {' '}
            {currency}{' '}
            {getCartTotal() === 0 ? 0 : getCartTotal() + delivery_fee}
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
