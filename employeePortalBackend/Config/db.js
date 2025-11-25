/*const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;*/

// Config/db.js
const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.AUTH_MONGODB_URI || process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.warn('No AUTH_MONGODB_URI / MONGODB_URI found in env — default mongoose will not connect');
    return null;
  }
  try {
    // Use mongoose.connect on the default mongoose instance (so mongoose.model('User') works)
    await mongoose.connect(uri, {
      // options are driver-level now; keep minimal
    });
    console.log('MongoDB connected (auth/user DB)'); // this is the default connection log
    return mongoose;
  } catch (err) {
    console.error('Failed to connect auth/user MongoDB', err);
    throw err;
  }
}

module.exports = connectDB;

