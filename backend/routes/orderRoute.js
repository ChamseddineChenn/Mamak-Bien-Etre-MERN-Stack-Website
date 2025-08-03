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

const router = express.Router();

// Order routes
router.post('/create-order', authenticateUser, createOrder);
router.get('/user-orders', authenticateUser, getUserOrders);
router.get('/:orderId', authenticateUser, getOrderById);

// Admin-only routes
router.patch('/:orderId/status', adminAuth, updateOrderStatus);
router.get('/admin/orders', adminAuth, getOrdersForAdmin);

export default router;
