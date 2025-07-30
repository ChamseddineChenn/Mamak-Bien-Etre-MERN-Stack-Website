import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

// Helper to get cart for user/session
const getCart = async (userId, sessionId) => {
  try {
    if (userId) {
      return await Cart.findOne({ user: userId }).populate('items.productId'); // Keep this as is
    } else if (sessionId) {
      return await Cart.findOne({ sessionId }).populate('items.productId'); // Keep this as is
    }
    return null;
  } catch (error) {
    console.error('Get cart error:', error);
    return null;
  }
};

// Add to Cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user?.id;
    const sessionId = req.sessionId;

    // 1. Validate input
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    // 2. Check product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    console.log('user: ' + userId + '/' + 'session: ' + sessionId);
    // 3. Find existing cart
    let cart = await getCart(userId, sessionId);
    let totalRequestedQty = quantity;
    let existingItem = null;

    if (cart) {
      existingItem = cart.items.find((item) =>
        item.productId._id.equals(productId)
      );
      if (existingItem) {
        totalRequestedQty += existingItem.quantity;
      }
    }

    // 5. Validate against stock - MOVED OUTSIDE OF ELSE BLOCK
    if (product.quantity < totalRequestedQty) {
      const available =
        product.quantity - (existingItem ? existingItem.quantity : 0);
      return res.status(200).json({
        success: false,
        message: `Only ${available} items available in stock`,
        maxAllowed: available,
      });
    }

    // 6. Create new cart if doesn't exist
    if (!cart) {
      cart = new Cart({
        user: userId || null,
        sessionId: userId ? null : sessionId,
      });
    }

    // 6. Check if product already in cart
    existingItem = cart.items.find((item) =>
      item.productId._id.equals(productId)
    );

    if (existingItem) {
      // 7. Update existing item quantity
      existingItem.quantity += quantity;
    } else {
      // 8. Add new item to cart
      cart.items.push({
        productId,
        quantity,
      });
    }

    // 9. Save cart
    await cart.save();

    // 10. Return updated cart
    const updatedCart = await Cart.populate(cart, {
      path: 'items.productId',
      model: 'product',
    });

    res.status(200).json({
      success: true,
      cart: updatedCart,
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get Cart
// cartController.js - getCartData
export const getCartData = async (req, res) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.sessionId;

    const cart = await getCart(userId, sessionId);

    if (!cart) {
      // Return empty cart instead of error
      return res.status(200).json({
        success: true,
        cart: { items: [] },
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Update Cart Item Quantity
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user?.id;
    const sessionId = req.sessionId;

    console.log(`[Cart] Update request for: ${productId}, Qty: ${quantity}`);
    console.log(`User: ${userId ? userId : 'Guest'}, Session: ${sessionId}`);

    // 1. Validate input
    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required',
      });
    }

    // 2. Check product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // 3. Check stock availability
    if (product.quantity < quantity) {
      return res.status(200).json({
        success: false,
        message: `Only ${product.quantity} items available in stock`,
      });
    }

    // 4. Get cart
    const cart = await getCart(userId, sessionId);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    // 5. Find item to update
    const cartItem = cart.items.find(
      (item) => item.productId._id.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    // 6. Update or remove item
    if (quantity <= 0) {
      // Filter out the item to remove
      cart.items = cart.items.filter(
        (item) => item.productId._id.toString() !== productId
      );
    } else {
      cartItem.quantity = quantity;
    }

    // 7. Save cart
    await cart.save();

    // 8. Return updated cart
    const updatedCart = await Cart.populate(cart, {
      path: 'items.productId',
      model: 'product',
    });

    res.status(200).json({
      success: true,
      cart: updatedCart,
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// Enhanced mergeCarts function with stock validation
export const mergeCarts = async (req, res) => {
  try {
    const userId = req.user.id;
    const sessionId = req.sessionId;

    // 1. Find guest cart with sessionId
    const guestCart = await Cart.findOne({ sessionId }).populate(
      'items.productId'
    );

    // 2. Find or create user cart
    let userCart = await Cart.findOne({ user: userId }).populate(
      'items.productId'
    );

    if (!userCart) {
      userCart = new Cart({ user: userId, items: [] });
    }

    if (guestCart && guestCart.items.length > 0) {
      // 3. Merge items with stock validation
      for (const guestItem of guestCart.items) {
        const product = guestItem.productId;
        if (!product) continue; // Skip if product not found

        // Find existing item in user cart
        const existingItem = userCart.items.find(
          (item) => item.productId._id.toString() === product._id.toString()
        );

        if (existingItem) {
          // Calculate new quantity without exceeding stock
          const newQty = existingItem.quantity + guestItem.quantity;
          existingItem.quantity = Math.min(newQty, product.quantity);
        } else {
          // Add new item if in stock
          if (product.quantity > 0) {
            userCart.items.push({
              productId: product._id,
              quantity: Math.min(guestItem.quantity, product.quantity),
            });
          }
        }
      }

      // 4. Save and cleanup
      await userCart.save();
      await Cart.deleteOne({ _id: guestCart._id });
    }

    // 5. Return updated cart
    const updatedCart = await Cart.populate(userCart, {
      path: 'items.productId',
      model: 'product',
    });

    res.status(200).json({
      success: true,
      message: 'Carts merged successfully',
      cart: updatedCart,
    });
  } catch (error) {
    console.error('Merge carts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
