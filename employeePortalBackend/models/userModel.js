// models/userModel.js
/*const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, index: true },
  phone: String,
  organization: String,
  // other fields like role, passwordHash etc (do NOT expose passwordHash to clients)
}, { collection: 'users', timestamps: true });

module.exports = (conn = mongoose) => conn.model('User', UserSchema);*/

// models/userModel.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, index: true },
  phone: String,
  organization: String,
  // other fields (don't expose sensitive fields)
}, { collection: 'users', timestamps: true });

module.exports = function getUserModel(conn = mongoose) {
  try {
    return conn.model('User');
  } catch (e) {
    return conn.model('User', UserSchema);
  }
};

