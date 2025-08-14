import Newsletter from '../models/newsletterModel.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import productModel from '../models/productModel.js';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error('SMTP Connection FAILED:', error);
  } else {
    console.log('SMTP Server is ready to send messages');
  }
});

// Subscribe to newsletter
export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({
        success: false,
        message: 'Email is already subscribed',
      });
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const verificationExpires = Date.now() + 3600000; // 1 hour expiration

    // Prepare verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-newsletter?token=${verificationToken}`;

    const mailOptions = {
      from: `"MamakBE" <${process.env.SMTP_EMAIL_DEV}>`,
      to: email,
      subject: 'Verify Your Newsletter Subscription',
      html: `
        <p>Thank you for subscribing to our newsletter!</p>
        <p>Please click the link below to verify your email:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    // Attempt to send email FIRST
    await transporter.sendMail(mailOptions);

    // Only save to DB if email was sent successfully
    const newSubscriber = new Newsletter({
      email,
      verificationToken,
      verificationExpires,
    });

    await newSubscriber.save();

    res.json({
      success: true,
      message: 'Verification email sent! Please check your inbox.',
    });
  } catch (error) {
    console.error('Subscription error:', error);

    // Determine error type
    let errorMessage = 'Failed to subscribe. Please try again.';
    if (error.code === 'EAUTH' || error.responseCode === 535) {
      errorMessage = 'Authentication failed with email service';
    } else if (error.responseCode === 550) {
      errorMessage = 'Email sending failed - sender identity issue';
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

// Verify subscription
export const verifySubscription = async (req, res) => {
  try {
    const { token } = req.body;

    const subscriber = await Newsletter.findOne({
      verificationToken: token,
      verificationExpires: { $gt: Date.now() },
    });

    if (!subscriber) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // Mark as verified
    subscriber.isVerified = true;
    subscriber.verificationToken = undefined;
    subscriber.verificationExpires = undefined;
    await subscriber.save();

    res.json({
      success: true,
      message: 'Email verified successfully!',
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify subscription',
    });
  }
};

// Get all subscribers (admin)
export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ isVerified: true }).select(
      'email subscribedAt -_id'
    );
    res.json({ success: true, subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send newsletter (admin)
export const sendNewsletter = async (req, res) => {
  try {
    const { subject, message, productId } = req.body;

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Generate email-safe image URLs
    const getEmailImageUrl = (imageUrl) => {
      if (!imageUrl) return '';

      // For Cloudinary images
      if (imageUrl.includes('res.cloudinary.com')) {
        // Add delivery parameters for email
        const separator = imageUrl.includes('?') ? '&' : '?';
        return `${imageUrl}${separator}fm=jpg&fl=progressive&q=80&dpr=1`;
      }

      return imageUrl; // For other images
    };

    // Prepare email content
    const productUrl = `${process.env.FRONTEND_URL}/product/${product._id}`;
    const productImage = getEmailImageUrl(product.image[0]);

    const mailOptions = {
      from: `"MamakBE" <${process.env.SENDER_EMAIL}>`,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5C4B42;">${subject}</h2>
          <p>${message}</p>
          
          <div style="border: 1px solid #E8D9CC; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Featured Product: ${product.name}</h3>
            <!-- Add explicit width/height for email clients -->
            <img 
              src="${productImage}" 
              alt="${product.name}" 
              width="100%" 
              height="auto" 
              style="display: block; max-width: 100%; height: auto; border-radius: 8px;"
            >
            <p>${product.description.substring(0, 200)}...</p>
            <p style="font-size: 1.2em; font-weight: bold; color: #5C4B42;">
              ${process.env.CURRENCY || 'TND'} ${product.price.toFixed(2)}
            </p>
            <a 
              href="${productUrl}" 
              style="display: inline-block; padding: 10px 20px; background-color: #D6A7A0; color: white; text-decoration: none; border-radius: 4px; margin-top: 10px;"
            >
              View Product
            </a>
          </div>
          
          <!-- Add a fallback text for blocked images -->
          <p style="color: #888; font-size: 12px; margin-top: 5px;">
            Can't see the image? <a href="${productUrl}" style="color: #888;">View product on our website</a>
          </p>
          
          <p style="font-size: 0.9em; color: #888; border-top: 1px solid #eee; padding-top: 15px; margin-top: 20px;">
            You received this email because you subscribed to MamakBE newsletter.<br>
            <a href="${
              process.env.FRONTEND_URL
            }/unsubscribe" style="color: #888;">Unsubscribe</a>
          </p>
        </div>
      `,
      // Add headers to prevent blocking
      headers: {
        'X-Message-ID': crypto.randomBytes(16).toString('hex'),
        'X-SMTPAPI': JSON.stringify({
          filters: {
            bypass_list_management: { settings: { enable: 1 } },
          },
        }),
      },
    };

    res.json({
      success: true,
      message: `Newsletter sent to ${subscribers.length} subscribers successfully!`,
    });
  } catch (error) {
    console.error('Newsletter sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send newsletter: ' + error.message,
    });
  }
};

// Unsubscribe
export const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await Newsletter.deleteOne({ email });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our subscription list',
      });
    }

    res.json({
      success: true,
      message: 'You have been unsubscribed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe: ' + error.message,
    });
  }
};
