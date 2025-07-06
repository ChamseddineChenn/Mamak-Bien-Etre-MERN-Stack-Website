import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log('MongoDB Connected'); // Add this to verify DB connection
    });
    await mongoose.connect(
      `${process.env.MONGODB_URI}/MamakBE_Ecommerce_Website`
    );
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
  }
};

export default connectDB;
