import axios from 'axios';
import crypto from 'crypto';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

export const initiateKonnectPayment = async (req, res) => {
  try {
    const { orderData } = req.body;

    if (!orderData || !orderData.address || !orderData.items) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order data',
      });
    }

    // Generate a unique order ID for reference
    const tempOrderId = `TEMP_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const paymentData = {
      receiverWalletId: process.env.KONNECT_WALLET_ID,
      token: 'TND',
      amount: Math.round(orderData.totalAmount * 1000), // Convert to millimes
      type: 'immediate',
      description: `Order Payment - ${orderData.address.recipientName}`,
      acceptedPaymentMethods: ['wallet', 'bank_card', 'e-DINAR'],
      lifespan: 10,
      checkoutForm: false,
      addPaymentFeesToAmount: true,
      firstName: orderData.address.recipientName.split(' ')[0],
      lastName: orderData.address.recipientName.split(' ').slice(1).join(' '),
      phoneNumber: orderData.address.phoneNumber.replace(/\D/g, ''), // Remove non-digit characters
      email: orderData.userEmail || 'customer@example.com',
      orderId: tempOrderId,
      webhook: `${process.env.BACKEND_URL}/api/payment/konnect/webhook`,
      theme: 'dark',
    };

    const response = await axios.post(
      process.env.KONNECT_BASE_URL + '/payments/init-payment',
      paymentData,
      {
        headers: {
          'x-api-key': process.env.KONNECT_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({
      success: true,
      paymentUrl: response.data.payUrl,
      paymentRef: response.data.paymentRef,
    });
  } catch (error) {
    console.error(
      'Konnect payment error:',
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: error.response?.data || error.message,
    });
  }
};

export const konnectWebhookHandler = async (req, res) => {
  try {
    // Verify signature
    const signature = req.headers['x-signature'];
    const rawBody = JSON.stringify(req.body);
    const computedSignature = crypto
      .createHmac('sha256', process.env.KONNECT_API_KEY)
      .update(rawBody)
      .digest('hex');

    if (computedSignature !== signature) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ success: false });
    }

    const payload = req.body;
    const { status, transaction, metadata } = payload.data;

    if (status === 'completed') {
      // Parse order data from metadata or reconstruct it
      const orderData = {
        userId: metadata?.userId || null,
        sessionId: metadata?.sessionId,
        address: metadata?.address,
        items: metadata?.items,
        totalAmount: transaction.amount / 1000, // Convert millimes to TND
        deliveryFee: metadata?.deliveryFee || 10,
        paymentMethod: 'card',
      };

      // Create the order
      const order = new Order({
        user: orderData.userId,
        sessionId: orderData.sessionId,
        address: orderData.address,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        deliveryFee: orderData.deliveryFee,
        paymentMethod: orderData.paymentMethod,
        status: 'awaiting_delivery',
        paymentStatus: 'completed',
        paymentRef: transaction.id,
        paymentDetails: {
          method: transaction.method,
          transactionId: transaction.id,
          amount: transaction.amount / 1000, // Convert millimes to TND
          currency: transaction.currency,
          timestamp: new Date(transaction.timestamp),
        },
      });

      // Save order
      await order.save();

      // Reduce stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: -item.quantity },
        });
      }

      console.log(
        `Order ${order._id} created successfully via Konnect payment`
      );
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false });
  }
};
