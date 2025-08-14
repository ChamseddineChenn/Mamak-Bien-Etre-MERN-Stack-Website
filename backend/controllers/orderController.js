import mongoose from 'mongoose';
import Order from '../models/orderModel.js';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

// Create Order
export const createOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.sessionId;
    const { address, paymentMethod } = req.body;

    // Validate address
    const requiredFields = [
      'recipientName',
      'street',
      'city',
      'state',
      'zipCode',
      'country',
      'phoneNumber',
    ];

    for (const field of requiredFields) {
      if (!address[field]) {
        return res.status(400).json({
          success: false,
          message: `Address ${field} is required`,
        });
      }
    }

    // Get cart
    let cart;
    if (userId) {
      cart = await Cart.findOne({ user: userId }).populate('items.productId');
    } else {
      cart = await Cart.findOne({ sessionId }).populate('items.productId');
    }
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    // Calculate total and prepare items
    let totalAmount = 0;
    const items = [];
    const productUpdates = [];

    for (const item of cart.items) {
      const product = item.productId;
      const quantity = item.quantity;

      // Check if product exists
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.productId} not found`,
        });
      }

      // Check stock availability
      if (product.quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name}. Only ${product.quantity} available`,
          productId: product._id,
          maxAllowed: product.quantity,
        });
      }

      const price = product.price;
      totalAmount += price * quantity;

      items.push({
        productId: product._id,
        quantity,
        priceAtOrder: price,
        name: product.name,
      });
    }

    // Add delivery fee
    const deliveryFee = 10; // TND
    totalAmount += deliveryFee;

    // Create order
    const order = new Order({
      user: userId || null,
      sessionId: userId ? undefined : sessionId,
      address,
      items,
      totalAmount,
      deliveryFee,
      paymentMethod,
    });

    // Start transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update product quantities AFTER saving order
      for (const item of cart.items) {
        await Product.findByIdAndUpdate(
          item.productId._id,
          { $inc: { quantity: -item.quantity } },
          { session }
        );
      }

      // Save order
      await order.save({ session });

      // Clear cart
      cart.items = [];
      await cart.save({ session });

      // Commit transaction
      await session.commitTransaction();

      res.json({
        success: true,
        message: 'Order created successfully',
        order,
      });
    } catch (error) {
      // Abort transaction on error
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
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

      // Add image URLs to each item
      const ordersWithImages = orders.map((order) => ({
        ...order,
        items: order.items.map((item) => ({
          ...item,
          image: item.image || 'default-product.jpg', // Add default image if missing
        })),
      }));

      return res.status(200).json({ success: true, orders: ordersWithImages });
    }

    if (sessionId) {
      const orders = await Order.find({ sessionId })
        .sort({ createdAt: -1 })
        .lean();

      // Add image URLs to each item
      const ordersWithImages = orders.map((order) => ({
        ...order,
        items: order.items.map((item) => ({
          ...item,
          image: item.image || 'default-product.jpg', // Add default image if missing
        })),
      }));

      return res.status(200).json({ success: true, orders: ordersWithImages });
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
      .populate({
        path: 'items.productId',
        select: 'name image price description', // Include image here
      })
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

    // Map product data to items
    const populatedOrder = {
      ...order,
      items: order.items.map((item) => ({
        ...item,
        productData: item.productId, // Attach full product data
        productId: item.productId._id, // Keep productId as ID
      })),
    };

    res.status(200).json({ success: true, order: populatedOrder });
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

// Order management
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
        { 'address.recipientName': { $regex: trimmedSearch, $options: 'i' } },
        { 'address.phoneNumber': { $regex: trimmedSearch, $options: 'i' } },
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

export const checkReviewEligibility = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const hasOrdered = await Order.findOne({
      user: userId,
      'items.productId': productId,
      status: 'delivered',
    });

    res.json({
      success: true,
      isEligible: !!hasOrdered,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking eligibility: ' + error.message,
    });
  }
};

export const getStaleOrders = async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 48;
    const dateThreshold = new Date(Date.now() - hours * 60 * 60 * 1000);

    const orders = await Order.find({
      status: { $in: ['processing', 'awaiting_delivery'] },
      createdAt: { $lte: dateThreshold },
    });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
