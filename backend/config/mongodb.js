import mongoose from 'mongoose';

// Global variable to track connection status
let isConnected = false;
let connectionAttempts = 0;
const MAX_RETRIES = 5;

const connectDB = async () => {
  if (isConnected) return;

  const connectionOptions = {
    serverSelectionTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 45000, // 45 seconds
    maxPoolSize: 10,
  };

  try {
    console.log('Attempting MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URL, connectionOptions);
    isConnected = true;
    connectionAttempts = 0;
    console.log('MongoDB connected successfully');

    // Event listeners
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected');
      isConnected = true;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
      isConnected = false;
      setTimeout(connectDB, 5000);
    });

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err.message}`);
      isConnected = false;
    });
  } catch (err) {
    connectionAttempts++;
    console.error(
      `Connection attempt ${connectionAttempts} failed:`,
      err.message
    );

    if (connectionAttempts < MAX_RETRIES) {
      console.log(`Retrying in 5 seconds...`);
      setTimeout(connectDB, 5000);
    } else {
      console.error('Maximum connection attempts reached. Exiting...');
      process.exit(1);
    }
  }
};

export default connectDB;
