import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getOrdersForAdmin,
  checkReviewEligibility,
  getStaleOrders,
  getRecentOrders,
} from '../controllers/orderController.js';
import { authenticateUser } from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const orderRouter = express.Router();

// Admin-only routes
orderRouter.patch('/:orderId/status', adminAuth, updateOrderStatus);
orderRouter.get('/admin/orders', adminAuth, getOrdersForAdmin);
orderRouter.get('/admin/stale-orders', adminAuth, getStaleOrders);
orderRouter.get('/recent', adminAuth, getRecentOrders);

// Order routes
orderRouter.post('/create-order', authenticateUser, createOrder);
orderRouter.get('/user-orders', authenticateUser, getUserOrders);
orderRouter.get('/:orderId', authenticateUser, getOrderById);
orderRouter.post(
  '/check-review-eligibility',
  authenticateUser,
  checkReviewEligibility
);

export default orderRouter;
