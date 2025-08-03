import mongoose from 'mongoose';

const connectDB = async () => {
  const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  };

  try {
    await mongoose.connect(
      `${process.env.MONGODB_URI}/MamakBE_Ecommerce_Website`
    );
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected');
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
      setTimeout(() => connectDB(), 5000); // Retry after 5 seconds
    });

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('reconnectFailed', () => {
      console.error('MongoDB reconnection failed. Restarting process...');
      process.exit(1); // Force restart via process manager
    });
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
  }
};

export default connectDB;
