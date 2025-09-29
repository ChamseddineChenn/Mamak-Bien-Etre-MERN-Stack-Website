import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import newsletterRouter from './routes/newsletterRoute.js';
import dashboardRouter from './routes/dashboardRoute.js';
import analyticsRouter from './routes/analyticsRoute.js';
import paymentRouter from './routes/paymentRoute.js';

// App Config
const app = express();
const port = process.env.PORT || 4000;

async function initializeServices() {
  try {
    await connectDB();
    connectCloudinary();

    // Verify MongoDB connection is ready
    await new Promise((resolve, reject) => {
      const checkConnection = () => {
        if (mongoose.connection.readyState === 1) {
          resolve();
        } else {
          setTimeout(checkConnection, 100);
        }
      };
      checkConnection();
    });
  } catch (err) {
    console.error('Service initialization failed:', err);
    process.exit(1);
  }
}

function setupSessionStore() {
  // Create separate MongoClient for session store
  const sessionClient = new MongoClient(process.env.MONGODB_URL, {
    serverSelectionTimeoutMS: 30000,
  });

  return MongoStore.create({
    client: sessionClient,
    dbName: 'MamakBE_Ecommerce_Website',
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60,
    autoRemove: 'interval',
    autoRemoveInterval: 60, // minutes
  });
}

async function configureApp() {
  await initializeServices();

  // Middlewares
  app.set('trust proxy', 1);
  app.use(express.json());

  // CORS configuration
  const allowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL];
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    })
  );

  // Session configuration
  const sessionStore = setupSessionStore();
  app.use(
    session({
      name: 'mamakbe.sid',
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        httpOnly: true,
        domain:
          process.env.NODE_ENV === 'development'
            ? 'localhost'
            : '.yourdomain.com',
      },
    })
  );

  // Add session ID to request
  app.use((req, res, next) => {
    console.log(`Session ID: ${req.sessionID}`);
    req.sessionId = req.sessionID;

    // Initialize session if new
    if (req.session.isNew) {
      req.session.initialized = true;
    }
    next();
  });

  // Logging middleware
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log(`Session ID: ${req.sessionID}`);
    next();
  });

  // API Endpoints
  app.use('/api/user', userRouter);
  app.use('/api/product', productRouter);
  app.use('/api/cart', cartRouter);
  app.use('/api/order', orderRouter);
  app.use('/api/newsletter', newsletterRouter);
  app.use('/api/dashboard', dashboardRouter);
  app.use('/api/analytics', analyticsRouter);
  app.use('/api/payment', paymentRouter);

  app.get('/', (req, res) => {
    res.send('API Working');
  });

  // Start server
  app.listen(port, () => console.log('Server started on Port: ' + port));
}

configureApp().catch((err) => {
  console.error('Fatal initialization error:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});
