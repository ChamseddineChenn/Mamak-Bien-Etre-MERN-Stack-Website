import React from 'react';
import OrderList from '../components/OrderList';

const CompletedOrders = ({ token }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Completed Orders</h1>
      <OrderList token={token} statuses={['delivered']} />
    </div>
  );
};

export default CompletedOrders;
