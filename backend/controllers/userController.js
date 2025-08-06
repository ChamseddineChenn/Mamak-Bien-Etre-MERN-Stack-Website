import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import Order from '../models/orderModel.js';

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, v: user.tokenVersion },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const sanitizedEmail = validator.normalizeEmail(validator.trim(email));

    if (!validator.isEmail(sanitizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email!',
      });
    }

    const user = await userModel.findOne({ email: sanitizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials!',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials!',
      });
    }

    const token = createToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;
    const sanitizedEmail = validator.normalizeEmail(validator.trim(email));
    const sanitizedFullName = validator.escape(validator.trim(fullName));

    if (!validator.isEmail(sanitizedEmail)) {
      return res.json({
        success: false,
        message: 'Please enter a valid email!',
      });
    }

    const userExists = await userModel.findOne({ email: sanitizedEmail });
    if (userExists) {
      return res.json({ success: false, message: 'User already exists!' });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: 'Password must be at least 8 characters!',
      });
    }

    if (password !== confirmPassword) {
      return res.json({ success: false, message: 'Passwords do not match!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      fullName: sanitizedFullName,
      email: sanitizedEmail,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASS
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: 'Invalid credentials!' });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const logoutUser = (req, res) => {
  try {
    req.user = null;
    req.userId = null;
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    res.setHeader('Clear-Token', 'true');
    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
    });
  }
};

const saveDeliveryAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const deliveryAddress = req.body;

    const requiredFields = [
      'recipientName',
      'street',
      'city',
      'zipCode',
      'phoneNumber',
    ];

    for (const field of requiredFields) {
      if (!deliveryAddress[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { deliveryAddress },
      { new: true, select: '-password' }
    );

    res.status(200).json({
      success: true,
      message: 'Delivery address saved',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Save delivery address error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName } = req.body;

    if (!fullName || fullName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Full name is required',
      });
    }

    await userModel.updateOne(
      { _id: userId },
      { $set: { fullName: fullName.trim() } }
    );

    const updatedUser = await userModel.findById(userId).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.tokenVersion += 1;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully. Please login again.',
      requireReauth: true,
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Functions for admin use

// Fetch users for admin
const getUsersForAdmin = async (req, res) => {
  try {
    const users = await userModel.find({}).select('-password -tokenVersion');

    // Get order counts for each user
    const usersWithOrders = await Promise.all(
      users.map(async (user) => {
        const orderCount = await Order.countDocuments({ user: user._id });
        return {
          ...user.toObject(),
          orderCount,
        };
      })
    );

    res.status(200).json({ success: true, users: usersWithOrders });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update user email
const updateUserEmail = async (req, res) => {
  try {
    const { userId, newEmail } = req.body;
    const sanitizedEmail = validator.normalizeEmail(validator.trim(newEmail));

    if (!validator.isEmail(sanitizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email!',
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if email already exists
    const emailExists = await userModel.findOne({ email: sanitizedEmail });
    if (emailExists && emailExists._id.toString() !== userId) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use by another account',
      });
    }

    user.email = sanitizedEmail;
    user.tokenVersion += 1; // Invalidate existing tokens
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email updated successfully',
    });
  } catch (error) {
    console.error('Update email error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Update user password
const updateUserPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters!',
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.tokenVersion += 1; // Invalidate existing tokens
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export {
  loginUser,
  registerUser,
  adminLogin,
  logoutUser,
  saveDeliveryAddress,
  getProfile,
  updateProfile,
  changePassword,
  getUsersForAdmin,
  updateUserEmail,
  updateUserPassword,
};
