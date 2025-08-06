import express from 'express';
import {
  loginUser,
  registerUser,
  adminLogin,
  logoutUser,
  saveDeliveryAddress,
  getProfile,
  changePassword,
  updateProfile,
  getUsersForAdmin,
  updateUserEmail,
  updateUserPassword,
} from '../controllers/userController.js';
import { authenticateUser } from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/administratorLogin', adminLogin);
userRouter.post('/logout', logoutUser);
userRouter.post('/delivery-address', authenticateUser, saveDeliveryAddress);
userRouter.get('/profile', authenticateUser, getProfile);
userRouter.put('/profile', authenticateUser, updateProfile);
userRouter.put('/change-password', authenticateUser, changePassword);
userRouter.get('/admin/users', adminAuth, getUsersForAdmin);
userRouter.patch('/admin/users/email', adminAuth, updateUserEmail);
userRouter.patch('/admin/users/password', adminAuth, updateUserPassword);

export default userRouter;
