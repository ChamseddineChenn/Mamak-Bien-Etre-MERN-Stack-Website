import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
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

// Fix for ES modules __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  // ✅ FIX: Use the simpler connection string approach
  return MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    dbName: 'MamakBE_Ecommerce_Website',
    collectionName: 'sessions',
    ttl: 30 * 24 * 60 * 60,
    autoRemove: 'interval',
    autoRemoveInterval: 60,
  });
}

async function configureApp() {
  await initializeServices();

  // Middlewares
  app.set('trust proxy', 1);
  app.use(express.json());

  // CORS configuration - only for external requests in development
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    'http://localhost:5173', // Frontend dev server (development only)
    'http://localhost:5174', // Admin dev server (development only)
    'https://mamakbienetre.com',
    'https://www.mamakbienetre.com',
  ].filter(Boolean);

  app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or server-to-server)
        if (!origin) return callback(null, true);

        // Allow same-origin requests
        if (origin.includes('mamakbienetre.com')) {
          return callback(null, true);
        }

        // Allow localhost only in development
        if (
          process.env.NODE_ENV !== 'production' &&
          origin.includes('localhost')
        ) {
          return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.log('CORS blocked for origin:', origin);
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
      saveUninitialized: true,
      store: sessionStore,
      proxy: true,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        httpOnly: true,
      },
      rolling: true,
    })
  );

  app.use((req, res, next) => {
    console.log('=== COOKIE DEBUG ===');
    console.log(
      'Request cookies:',
      req.headers.cookie || 'No cookies received'
    );
    console.log('Session ID:', req.sessionID);

    // Log when session is saved
    const originalSave = req.session.save;
    req.session.save = function (callback) {
      console.log('SESSION SAVE CALLED - Setting cookie should happen now');
      return originalSave.call(this, callback);
    };

    next();
  });

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

  app.get('/api/debug-cookie', (req, res) => {
    console.log('=== COOKIE SET TEST ===');

    // Force session to be saved and cookie set
    req.session.debugVisit = (req.session.debugVisit || 0) + 1;

    res.json({
      message: 'Cookie should be set now',
      sessionId: req.sessionID,
      debugVisit: req.session.debugVisit,
      cookiesInRequest: req.headers.cookie || 'none',
      sessionIsNew: req.session.isNew,
    });
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

  // Serve static files for frontend and admin
  const frontendPath = path.join(__dirname, '../frontend/dist');
  const adminPath = path.join(__dirname, '../admin/dist');

  // Serve frontend static files
  app.use(express.static(frontendPath));

  // Serve admin static files under /admin route
  app.use('/admin', express.static(adminPath));

  // API status route
  app.get('/api', (req, res) => {
    res.json({ message: 'Mamak Ecommerce API Working', timestamp: new Date() });
  });

  // Serve admin SPA - handle all admin routes
  app.get('/admin', (req, res) => {
    res.sendFile(path.join(adminPath, 'index.html'));
  });

  // Serve frontend SPA - handle all other routes
  app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
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
