import express from 'express';
import {
  loginUser,
  registerUser,
  adminLogin,
} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/administratorLogin', adminLogin);

export default userRouter;
