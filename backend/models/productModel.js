import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  bestSeller: { type: Boolean, required: true },
  date: { type: Number, required: true },
  newArrival: { type: Boolean, required: true },
  onSale: { type: Boolean, required: true },
  onSalePercent: { type: Number, required: true, min: 0, max: 100, default: 0 },
  technicalDescription: { type: String, default: '' },
  views: { type: Number, default: 0 },
  reviews: [
    {
      rating: { type: Number, required: true, min: 1, max: 5 },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
      userName: { type: String, required: true },
      reviewText: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const productModel =
  mongoose.model.product || mongoose.model('product', productSchema);

export default productModel;
