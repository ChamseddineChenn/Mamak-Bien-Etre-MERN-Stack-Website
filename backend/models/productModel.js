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
});

const productModel =
  mongoose.model.product || mongoose.model('product', productSchema);

export default productModel;
