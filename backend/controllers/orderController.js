import mongoose from 'mongoose';
import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

// Helper to get user cart
const getUserCart = async (userId, sessionId) => {
  if (userId) {
    return await Cart.findOne({ user: userId }).populate('items.productId');
  } else if (sessionId) {
    return await Cart.findOne({ sessionId }).populate('items.productId');
  }
  return null;
};

// Create Order
export const createOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.sessionId;
    const { address, paymentMethod = 'cod' } = req.body;

    // Validate address
    if (
      !address ||
      !address.street ||
      !address.city ||
      !address.postalCode ||
      !address.phone
    ) {
      return res.status(400).json({
        success: false,
        message: 'Complete address information including phone is required',
      });
    }

    // Get cart and validate
    const cart = await getUserCart(userId, sessionId);
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    // Prepare order items and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.productId;

      // Verify product exists
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.productId} not found`,
        });
      }

      // Verify stock
      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
          productId: product._id,
        });
      }

      // Add to order items
      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        priceAtOrder: product.price,
        name: product.name,
        image: product.image[0],
      });

      // Calculate total
      totalAmount += product.price * item.quantity;
    }

    // Add delivery fee
    const deliveryFee = 10; // Could be dynamic
    totalAmount += deliveryFee;

    // Create order - FIXED: Removed shortId generation here
    const order = new Order({
      user: userId || null,
      sessionId: userId ? null : sessionId,
      address,
      items: orderItems,
      totalAmount,
      deliveryFee,
      paymentMethod,
    });

    // Save order
    await order.save();

    // Update product quantities
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { quantity: -item.quantity },
      });
    }

    // Clear cart
    await Cart.deleteOne({ _id: cart._id });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message,
    });
  }
};

// Get Orders for User
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.sessionId;

    if (userId) {
      const orders = await Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .lean();
      return res.status(200).json({ success: true, orders });
    }

    if (sessionId) {
      const orders = await Order.find({ sessionId })
        .sort({ createdAt: -1 })
        .lean();
      return res.status(200).json({ success: true, orders });
    }

    res.status(400).json({ success: false, message: 'No orders found' });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get Order by ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;
    const sessionId = req.sessionId;

    const order = await Order.findById(orderId)
      .populate('items.productId', 'name image price')
      .lean();

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }

    const isOwner =
      (userId && order.user && order.user.toString() === userId) ||
      (sessionId && order.sessionId === sessionId);

    if (!isOwner && !req.user?.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this order',
      });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update order status (FIXED)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format',
      });
    }

    // Validate status
    const validStatuses = [
      'processing',
      'awaiting_delivery',
      'in_delivery',
      'paused',
      'cancelled',
      'delivered',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid statuses: ${validStatuses.join(', ')}`,
      });
    }

    // Actual update logic
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      order,
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message,
    });
  }
};

// Order management (FIXED SEARCH)
export const getOrdersForAdmin = async (req, res) => {
  try {
    const { status, search } = req.query;
    const conditions = {};

    if (status && status.trim() !== '') {
      const statuses = status.split(',').filter((s) => s.trim() !== '');
      if (statuses.length > 0) {
        conditions.status = { $in: statuses };
      }
    }

    if (search && search.trim() !== '') {
      const trimmedSearch = search.trim();
      const isObjectId = mongoose.Types.ObjectId.isValid(trimmedSearch);

      conditions.$or = [
        { 'address.fullName': { $regex: trimmedSearch, $options: 'i' } },
        { 'address.phone': { $regex: trimmedSearch, $options: 'i' } },
        { shortId: { $regex: trimmedSearch, $options: 'i' } },
      ];
    }

    const orders = await Order.find(conditions).sort({ createdAt: -1 }).lean();

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Admin get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message,
    });
  }
};
