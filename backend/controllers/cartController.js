import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

// Helper to get cart for user/session
const getCart = async (userId, sessionId) => {
  if (userId) {
    // For logged-in users: find by user ID
    return await Cart.findOne({ user: userId }).populate('items.productId');
  } else {
    // For guests: find by session ID
    return await Cart.findOne({ sessionId: sessionId }).populate(
      'items.productId'
    );
  }
};

// Add to Cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user?._id;
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

    // 3. Check stock availability
    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.quantity} items available in stock`,
      });
    }

    console.log('user: ' + userId + '/' + 'session: ' + sessionId);
    // 4. Find existing cart
    let cart = await getCart(userId, sessionId);

    // 5. Create new cart if doesn't exist
    if (!cart) {
      cart = new Cart({
        user: userId || null,
        sessionId: userId ? null : sessionId,
      });
    }

    // 6. Check if product already in cart
    let existingItem = cart.items.find((item) =>
      item.productId.equals(productId)
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
export const getCartData = async (req, res) => {
  try {
    const userId = req.user?._id;
    const sessionId = req.sessionId;

    const cart = await getCart(userId, sessionId);

    if (!cart) {
      return res.status(400).json({
        success: false,
        message: 'problem here',
        cart: { items: [] },
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
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
    const userId = req.user?._id;
    const sessionId = req.sessionID;

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
      return res.status(400).json({
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
      (item) => item.productId.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    // 6. Update or remove item
    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
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
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const mergeCarts = async (req, res) => {
  try {
    const userId = req.user._id;
    const sessionId = req.sessionId;

    // 1. Find guest cart
    const guestCart = await Cart.findOne({ sessionId });

    // 2. Find user cart
    let userCart = await Cart.findOne({ user: userId });

    if (guestCart && guestCart.items.length > 0) {
      if (!userCart) {
        // Create new user cart if doesn't exist
        userCart = new Cart({ user: userId, items: [] });
      }

      // 3. Merge items
      guestCart.items.forEach((guestItem) => {
        const existingItem = userCart.items.find(
          (item) => item.productId.toString() === guestItem.productId.toString()
        );

        if (existingItem) {
          existingItem.quantity += guestItem.quantity;
        } else {
          userCart.items.push(guestItem);
        }
      });

      // 4. Save and cleanup
      await userCart.save();
      await Cart.deleteOne({ _id: guestCart._id });
    }

    res.status(200).json({ success: true, cart: userCart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
