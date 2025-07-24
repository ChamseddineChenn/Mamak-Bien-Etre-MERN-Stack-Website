import express from 'express';
import {
  addToCart,
  getCartData,
  updateCartItem,
  mergeCarts,
} from '../controllers/cartController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/mergeCarts', mergeCarts);

// Apply to all routes
router.use(authenticateUser);

// POST /api/cart - Add to cart
router.post('/addToCart', addToCart);

// GET /api/cart - Get cart data
router.get('/getCartData', getCartData);

// PUT /api/cart - Update cart item
router.put('/updateCartItem', updateCartItem);

export default router;
