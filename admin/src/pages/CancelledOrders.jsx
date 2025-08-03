import React from 'react';
import OrderList from '../components/OrderList';

const CancelledOrders = ({ token }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Cancelled Orders</h1>
      <OrderList token={token} statuses={['cancelled']} />
    </div>
  );
};

export default CancelledOrders;
