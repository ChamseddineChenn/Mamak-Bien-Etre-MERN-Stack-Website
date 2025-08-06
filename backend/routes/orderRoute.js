import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getOrdersForAdmin,
} from '../controllers/orderController.js';
import { authenticateUser } from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const orderRouter = express.Router();

// Order routes
orderRouter.post('/create-order', authenticateUser, createOrder);
orderRouter.get('/user-orders', authenticateUser, getUserOrders);
orderRouter.get('/:orderId', authenticateUser, getOrderById);

// Admin-only routes
orderRouter.patch('/:orderId/status', adminAuth, updateOrderStatus);
orderRouter.get('/admin/orders', adminAuth, getOrdersForAdmin);

export default orderRouter;
