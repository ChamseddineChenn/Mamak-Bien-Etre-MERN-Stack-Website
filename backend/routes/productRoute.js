import express from 'express';
import {
  addProduct,
  removeProduct,
  displayProducts,
  productDetails,
  editProduct,
  getProductStock,
  addReview,
  getLowStockProducts,
} from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import { authenticateUser } from '../middleware/auth.js';

const productRouter = express.Router();

productRouter.post(
  '/addProduct',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
    { name: 'image5', maxCount: 1 },
  ]),
  addProduct
);
productRouter.put(
  '/editProduct',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
    { name: 'image5', maxCount: 1 },
  ]),
  editProduct
);
productRouter.post('/removeProduct', adminAuth, removeProduct);
productRouter.get('/displayProducts', displayProducts);
productRouter.post('/productDetails', adminAuth, productDetails);
productRouter.get('/stock/:id', getProductStock);
productRouter.post('/addReview', authenticateUser, addReview);
productRouter.get('/low-stock', adminAuth, getLowStockProducts);

productRouter.get('/:id', async (req, res) => {
  try {
    // Increment view count
    await Product.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    // Then get product details
    const product = await productModel.findById(req.params.id);
    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

export default productRouter;
