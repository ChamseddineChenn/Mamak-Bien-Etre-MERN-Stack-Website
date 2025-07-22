import express from 'express';
import {
  addProduct,
  removeProduct,
  displayProducts,
  productDetails,
  editProduct,
} from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

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

export default productRouter;
