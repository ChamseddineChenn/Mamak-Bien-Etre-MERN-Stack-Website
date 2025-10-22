import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';
import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';

// Helper functions

// Helper function to upload images to cloudinary
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: 'image',
      folder: 'products',
      timeout: 30000,
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed');
  }
};

// Helper function to extract public ID from Cloudinary URL
const extractPublicIdFromUrl = (imageUrl) => {
  const urlParts = imageUrl.split('/');
  const uploadIndex = urlParts.indexOf('upload');

  if (uploadIndex === -1) return null;

  // Skip the version part (e.g., "v123456789")
  const startIndex = uploadIndex + 2;
  const publicIdParts = urlParts.slice(startIndex);

  // Remove file extension
  const lastPart = publicIdParts[publicIdParts.length - 1];
  const withoutExtension = lastPart.split('.')[0];

  return [...publicIdParts.slice(0, -1), withoutExtension].join('/');
};

// Helper function to upload images to Cloudinary
const uploadImageToStorage = async (file) => {
  try {
    // Create a base64 string from the buffer
    const base64String = file.buffer.toString('base64');
    const dataURI = `data:${file.mimetype};base64,${base64String}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'products',
      resource_type: 'image',
      timeout: 30000,
    });
    return result.secure_url;
  } catch (error) {
    console.error('Image upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

// Helper function to delete images from Cloudinary
const deleteImageFromStorage = async (imageUrl) => {
  try {
    const publicId = extractPublicIdFromUrl(imageUrl);
    if (!publicId) {
      console.warn('Could not extract public ID from URL:', imageUrl);
      return;
    }

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Image deletion error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

// Helper function to parse multi-language fields
const parseMultiLanguageField = (fieldValue, fieldName) => {
  if (!fieldValue) {
    return { en: '', fr: '', de: '' };
  }

  try {
    // If it's already an object, return it
    if (typeof fieldValue === 'object') {
      return fieldValue;
    }

    // If it's a string, try to parse it as JSON
    if (typeof fieldValue === 'string') {
      const parsed = JSON.parse(fieldValue);

      // Ensure it has the expected structure
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          en: parsed.en || '',
          fr: parsed.fr || '',
          de: parsed.de || '',
        };
      }
    }

    console.warn(`Invalid format for ${fieldName}, using default structure`);
    return { en: '', fr: '', de: '' };
  } catch (error) {
    console.error(`Error parsing ${fieldName}:`, error);
    // If parsing fails, create default structure with the string value in English
    return {
      en: typeof fieldValue === 'string' ? fieldValue : '',
      fr: '',
      de: '',
    };
  }
};

// Adding product function
const addProduct = async (req, res) => {
  try {
    // Parse multi-language fields
    const description = parseMultiLanguageField(
      req.body.description,
      'description'
    );
    const technicalDescription = parseMultiLanguageField(
      req.body.technicalDescription,
      'technicalDescription'
    );

    // Parse product data
    const productData = {
      name: req.body.name,
      description: description,
      technicalDescription: technicalDescription,
      price: Number(req.body.price),
      category: req.body.category,
      subCategory: req.body.subCategory,
      quantity: Number(req.body.quantity),
      bestSeller: req.body.bestSeller === 'true',
      newArrival: req.body.newArrival === 'true',
      onSale: req.body.onSale === 'true',
      onSalePercent: Number(req.body.onSalePercent || 0),
      date: Date.now(),
      image: [],
    };

    // Process images in parallel
    const imageUploads = [];
    for (let i = 1; i <= 5; i++) {
      const field = req.files[`image${i}`]?.[0];
      if (field) {
        imageUploads.push(uploadToCloudinary(field));
      }
    }

    // Wait for all uploads to complete
    const results = await Promise.allSettled(imageUploads);
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        productData.image.push(result.value);
      }
    });

    // Save product
    const product = new productModel(productData);
    await product.save();

    res.json({
      success: true,
      message: 'Product added successfully!',
      productId: product._id,
    });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding product: ' + error.message,
    });
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

// Edit product function
const editProduct = async (req, res) => {
  try {
    const { id } = req.body;

    // Validate product ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      });
    }

    // Find the product
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Parse multi-language fields
    const description = req.body.description
      ? parseMultiLanguageField(req.body.description, 'description')
      : product.description;

    const technicalDescription = req.body.technicalDescription
      ? parseMultiLanguageField(
          req.body.technicalDescription,
          'technicalDescription'
        )
      : product.technicalDescription;

    // Prepare update data
    const updateData = {
      name: req.body.name || product.name,
      description: description,
      technicalDescription: technicalDescription,
      price: req.body.price ? Number(req.body.price) : product.price,
      category: req.body.category || product.category,
      subCategory: req.body.subCategory || product.subCategory,
      quantity: req.body.quantity
        ? Number(req.body.quantity)
        : product.quantity,
      bestSeller: req.body.bestSeller === 'true',
      newArrival: req.body.newArrival === 'true',
      onSale: req.body.onSale === 'true',
      onSalePercent: req.body.onSalePercent
        ? Number(req.body.onSalePercent)
        : product.onSalePercent,
    };

    // Handle images
    let updatedImages = [];

    // 1. Process existing images
    if (req.body.existingImages) {
      try {
        const existingImages = JSON.parse(req.body.existingImages);
        updatedImages = product.image.filter((img) =>
          existingImages.includes(img)
        );

        // Find and delete removed images
        const imagesToDelete = product.image.filter(
          (img) => !existingImages.includes(img)
        );
        for (const imgUrl of imagesToDelete) {
          try {
            await deleteImageFromStorage(imgUrl);
          } catch (deleteError) {
            console.error('Failed to delete image:', imgUrl, deleteError);
          }
        }
      } catch (e) {
        console.error('Error parsing existingImages:', e);
        return res.status(400).json({
          success: false,
          message: 'Invalid existingImages format',
        });
      }
    } else {
      updatedImages = [...product.image];
    }

    // 2. Process new images
    for (let i = 1; i <= 5; i++) {
      const field = `image${i}`;
      if (req.files[field] && req.files[field][0]) {
        try {
          const file = req.files[field][0];
          const newImageUrl = await uploadToCloudinary(file);
          updatedImages.push(newImageUrl);
        } catch (uploadError) {
          console.error(`Error uploading ${field}:`, uploadError);
        }
      }
    }

    // Add images to update data
    updateData.image = updatedImages;

    // Update product in database
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Edit product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product: ' + error.message,
    });
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

// Get product stock
const getProductStock = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, stock: product.quantity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Review related functions

// Add review functionality
export const addReview = async (req, res) => {
  try {
    const { productId, rating, reviewText } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Invalid rating (1-5 required)',
      });
    }

    // Check if user has already reviewed this product
    const existingReview = await productModel.findOne({
      _id: productId,
      'reviews.userId': userId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product',
      });
    }

    // Check if user has ordered the product
    const hasOrdered = await orderModel.findOne({
      user: userId,
      'items.productId': productId,
      status: 'delivered',
    });

    if (!hasOrdered) {
      return res.status(403).json({
        success: false,
        message: 'You must purchase this product before reviewing',
      });
    }

    // Get user's name
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Add review
    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      {
        $push: {
          reviews: {
            rating,
            userId,
            userName: user.fullName,
            reviewText,
          },
        },
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Review added successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message,
    });
  }
};

const getLowStockProducts = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5;
    const products = await productModel.find({
      quantity: { $lte: threshold },
    });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  addProduct,
  removeProduct,
  displayProducts,
  productDetails,
  editProduct,
  getProductStock,
  getLowStockProducts,
};
