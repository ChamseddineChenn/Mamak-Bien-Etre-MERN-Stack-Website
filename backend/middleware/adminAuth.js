import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({ success: false, message: 'Unauthorized Access.' });
    }
    const adminstrator_Id = process.env.ADMIN_EMAIL + process.env.ADMIN_PASS;
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    if (token_decode !== adminstrator_Id) {
      const comparison = token_decode + '/' + adminstrator_Id;
      return res.json({
        success: false,
        message: { comparison },
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export default adminAuth;
