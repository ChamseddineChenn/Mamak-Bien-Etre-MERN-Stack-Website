import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';
// Adding product function

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
      date,
      newArrival,
      onSale,
      onSalePercent,
    } = req.body;
    const firstImage = req.files.firstImage && req.files.firstImage[0];
    const secondImage = req.files.secondImage && req.files.secondImage[0];
    const thirdImage = req.files.thirdImage && req.files.thirdImage[0];
    const fourthImage = req.files.fourthImage && req.files.fourthImage[0];
    const fifthImage = req.files.fifthImage && req.files.fifthImage[0];

    const images = [
      firstImage,
      secondImage,
      thirdImage,
      fourthImage,
      fifthImage,
    ].filter((item) => item != undefined);

    let imagesURL = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: 'image',
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      price: Number(price),
      image: imagesURL,
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestSeller: bestSeller === 'true' ? true : false,
      date: Date.now(),
      newArrival: newArrival === 'true' ? true : false,
      onSale: onSale === 'true' ? true : false,
      onSalePercent: Number(onSalePercent),
    };

    console.log(
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
      date,
      newArrival,
      onSale,
      onSalePercent
    );
    console.log(productData);

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: 'New product added!' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Remove product function

const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: 'Product removed!' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// List product function

const displayProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Single product info function

const productDetails = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, removeProduct, displayProducts, productDetails };
