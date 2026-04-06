require('dotenv').config();
const mongoose = require('mongoose');

const buildMongoUri = () => {
  const directUri = (process.env.MONGODB_URI || process.env.MONGO_URI || '').trim();
  if (directUri) {
    return directUri;
  }

  const user = process.env.MONGODB_USER;
  const password = process.env.MONGODB_PASSWORD;
  const cluster = process.env.MONGODB_CLUSTER;
  const dbName = process.env.MONGODB_DB || 'electrical_shop';

  if (user && password && cluster) {
    const encodedUser = encodeURIComponent(user);
    const encodedPassword = encodeURIComponent(password);
    return `mongodb+srv://${encodedUser}:${encodedPassword}@${cluster}/${dbName}?retryWrites=true&w=majority`;
  }

  throw new Error(
    'MongoDB Atlas configuration missing. Set MONGODB_URI (recommended) or MONGODB_USER, MONGODB_PASSWORD, and MONGODB_CLUSTER.'
  );
};

const connectDB = async () => {
  try {
    const mongoUri = buildMongoUri();
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Connected to MongoDB Atlas.');
  } catch (err) {
    console.error('MongoDB Atlas connection error:', err.message);
    console.log('Attempting to connect to local MongoDB...');
    
    try {
      await mongoose.connect('mongodb://localhost:27017/electrical_shop', {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('Connected to Local MongoDB.');
    } catch (localErr) {
      console.error('Local MongoDB connection error:', localErr.message);
      console.error('\n❌ Database connection failed. Please either:');
      console.error('   1. Whitelist your IP in MongoDB Atlas');
      console.error('   2. Install and run local MongoDB');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
