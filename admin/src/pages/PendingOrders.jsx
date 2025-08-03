import React from 'react';
import OrderList from '../components/OrderList';

const PendingOrders = ({ token }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pending Orders</h1>
      <OrderList
        token={token}
        statuses={['processing', 'awaiting_delivery', 'in_delivery', 'paused']}
      />
    </div>
  );
};

export default PendingOrders;
