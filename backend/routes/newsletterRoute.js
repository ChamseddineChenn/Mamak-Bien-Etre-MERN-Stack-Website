import express from 'express';
import {
  subscribe,
  verifySubscription,
  getSubscribers,
  sendNewsletter,
  unsubscribe,
} from '../controllers/newsletterController.js';
import adminAuth from '../middleware/adminAuth.js';

const newsletterRouter = express.Router();

// Public routes
newsletterRouter.post('/subscribe', subscribe);
newsletterRouter.post('/verify', verifySubscription);
newsletterRouter.post('/unsubscribe', unsubscribe);

// Admin routes
newsletterRouter.get('/subscribers', adminAuth, getSubscribers);
newsletterRouter.post('/send', adminAuth, sendNewsletter);

export default newsletterRouter;
