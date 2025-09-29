import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: null,
    },
    sessionId: String,
    address: {
      type: {
        recipientName: String,
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        phoneNumber: String,
      },
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        priceAtOrder: {
          type: Number,
          required: true,
        },
        name: String,
      },
    ],
    status: {
      type: String,
      enum: [
        'processing',
        'awaiting_payment',
        'awaiting_delivery',
        'in_delivery',
        'paused',
        'cancelled',
        'delivered',
      ],
      default: 'processing',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'canceled'],
      default: 'pending',
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['cod', 'card'],
      default: 'cod',
    },
    paymentRef: {
      type: String,
      default: null,
    },
    paymentDetails: {
      type: {
        method: String,
        transactionId: String,
        amount: Number,
        currency: String,
        timestamp: Date,
      },
      default: null,
    },
    shortId: {
      type: String,
      unique: true,
      default: function () {
        return new mongoose.Types.ObjectId()
          .toString()
          .slice(18, 24)
          .toUpperCase();
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

orderSchema.virtual('formattedDate').get(function () {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
