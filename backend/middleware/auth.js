import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
  req.sessionId = req.sessionID;

  // Check for token in headers or cookies
  let token;

  // 1. Check headers
  if (req.headers.token) {
    token = req.headers.token;
  }
  // 2. Check cookies
  else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      req.userId = decoded.id;
    } catch (error) {
      console.warn('Invalid token:', error.message);
      // Clear invalid token from client
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
