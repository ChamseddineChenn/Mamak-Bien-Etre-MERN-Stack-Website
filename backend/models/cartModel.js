import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      index: true,
    },
    sessionId: {
      type: String,
      index: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'product',
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity cannot be less than 1'],
          default: 1,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Auto-update lastModified on save
    timestamps: { updatedAt: 'lastUpdated' },
  }
);

const cartModel = mongoose.models.cart || mongoose.model('cart', cartSchema);

export default cartModel;
