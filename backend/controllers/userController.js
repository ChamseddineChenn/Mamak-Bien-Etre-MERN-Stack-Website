import userModel from '../models/userModel.js';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user login

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      res.json({
        success: false,
        message: 'Invalid credentials, please verify your email/password!',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);
      res.json({
        success: true,
        message: 'Login successful, welcome back!',
        token,
      });
    } else {
      res.json({
        success: false,
        message: 'Invalid credentials, please verify your email/password!',
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Route for user registration

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    // Check for user already exists
    const sanitizedEmail = validator.normalizeEmail(validator.trim(email));
    const sanitizedFullName = validator.escape(validator.trim(fullName));

    // Validating email format & strong password
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
        message: 'Please enter a strong password of at least 8 characters!',
      });
    }

    if (password !== confirmPassword) {
      return res.json({ success: false, message: 'Passwords do not match!' });
    }

    //Hashing user password after validation

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      fullName: sanitizedEmail,
      email: sanitizedFullName,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

//Route for admin login

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

export { loginUser, registerUser, adminLogin };
