import express from 'express';
import {
  addToCart,
  getCartData,
  updateCartItem,
  mergeCarts,
} from '../controllers/cartController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Apply authenticateUser to all routes
router.use(authenticateUser);

router.put('/updateCartItem', updateCartItem);
router.post('/addToCart', addToCart);
router.post('/mergeCarts', mergeCarts);
router.get('/getCartData', getCartData);

export default router;
