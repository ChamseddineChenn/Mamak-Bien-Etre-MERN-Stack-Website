import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected'); // Add this to verify DB connection
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
  }
};

export default connectDB;
