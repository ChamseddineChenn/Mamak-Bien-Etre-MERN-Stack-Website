import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.token?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }

    if (!req.user && req.sessionID) {
      req.sessionId = req.sessionID;
    }

    next();
  } catch (error) {
    // Don't block for guests
    next();
  }
};
