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
        fullName: String,
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        phone: String,
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
        image: String,
      },
    ],
    status: {
      type: String,
      enum: [
        'processing',
        'awaiting_delivery',
        'in_delivery',
        'paused',
        'cancelled',
        'delivered',
      ],
      default: 'processing',
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
      enum: ['cod', 'icc', 'ncc'],
      default: 'cod',
    },
    shortId: {
      type: String,
      unique: true,
      default: function () {
        // Fixed ObjectId generation
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
