// Config/stallDb.js
const mongoose = require('mongoose');

let stallConn = null;

async function connectStallDB() {
  const uri = process.env.MONGODB_URI_STALL_SERVICE;
  if (!uri) {
    console.warn('MONGODB_URI_STALL_SERVICE not set — skipping stall DB connect');
    return;
  }
  if (stallConn) return stallConn;
  stallConn = await mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).asPromise();
  console.log('Connected to Stall DB');
  return stallConn;
}

module.exports = { connectStallDB, getStallConn: () => stallConn };
