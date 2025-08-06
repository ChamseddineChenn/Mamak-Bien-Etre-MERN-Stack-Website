import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const authenticateUser = async (req, res, next) => {
  req.sessionId = req.sessionID;

  let token;
  if (req.headers.token) {
    token = req.headers.token;
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await userModel.findById(decoded.id);
      if (!user) {
        throw new Error('User not found');
      }

      const tokenVersion = decoded.v ?? 0;
      if (user.tokenVersion !== tokenVersion) {
        throw new Error('Token version mismatch');
      }

      req.user = {
        id: user._id,
        ...decoded,
      };
      req.userId = decoded.id;
    } catch (error) {
      console.warn('Invalid token:', error.message);
      res.setHeader('Clear-Token', 'true');
    }
  }

  console.log(
    `Auth: ${req.user ? 'User: ' + req.userId : 'Guest'} - Session: ${
      req.sessionId
    }`
  );
  next();
};
