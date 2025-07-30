import express from 'express';
import session from 'express-session';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import MongoStore from 'connect-mongo';

// App Config
const app = express();
const port = process.env.PORT || 4000; // Fixed typo: port -> PORT
connectDB();
connectCloudinary();

// Middlewares
app.set('trust proxy', 1); // Trust first proxy

app.use(express.json());

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL, // Frontend
  process.env.ADMIN_URL, // Admin panel
];
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps)

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

// Session middleware (MUST come before routes)
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  collectionName: 'sessions',
  ttl: 14 * 24 * 60 * 60, // 14 days
});

app.use(
  session({
    name: 'mamakbe.sid',
    secret: process.env.SESSION_SECRET,
    resave: false, // Changed to false for performance
    saveUninitialized: true, // Create session even if not logged in
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

const printRoutes = (router) => {
  router.stack.forEach((layer) => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
      console.log(`${methods} -> ${layer.route.path}`);
    }
  });
};
// API Endpoints (AFTER session middleware)
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for: ${req.originalUrl}`);
  next();
});

app.get('/', (req, res) => {
  res.send('API Working');
});
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log(`User ID: ${req.user?.id || 'Guest'}`);
  console.log(`Session ID: ${req.sessionID}`);
  console.log(`Token: ${token}`);
  next();
});

app.listen(port, () => console.log('Server started on Port: ' + port));
