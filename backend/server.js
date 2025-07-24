import express from 'express';
import session from 'express-session';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';

// App Config
const app = express();
const port = process.env.port;
connectDB();
connectCloudinary();
// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // REQUIRED for sessions to work
  })
);
app.use(
  session({
    name: 'mamakbe.sid', // Custom session cookie name
    secret: process.env.SESSION_SECRET, // From .env
    resave: false,
    saveUninitialized: true, // Changed to false for GDPR compliance
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 1 week
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      httpOnly: true, // Prevents client-side JS access
    },
  })
);

//API Endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.get('/', (req, res) => {
  res.send('API Working');
});

app.listen(port, () => console.log('Server started on Port: ' + port));
