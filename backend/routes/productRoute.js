import express from 'express';
import {
  addProduct,
  removeProduct,
  displayProducts,
  productDetails,
} from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

productRouter.post(
  '/addProduct',
  adminAuth,
  upload.fields([
    { name: 'firstImage', maxCount: 1 },
    { name: 'secondImage', maxCount: 1 },
    { name: 'thirdImage', maxCount: 1 },
    { name: 'fourthImage', maxCount: 1 },
    { name: 'fifthImage', maxCount: 1 },
  ]),
  addProduct
);
productRouter.post('/removeProduct', adminAuth, removeProduct);
productRouter.get('/displayProducts', adminAuth, displayProducts);
productRouter.post('/productDetails', adminAuth, productDetails);

export default productRouter;
