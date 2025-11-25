// models/userModel.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, index: true },
  phone: String,
  organization: String,
  // other fields like role, passwordHash etc (do NOT expose passwordHash to clients)
}, { collection: 'users', timestamps: true });

module.exports = (conn = mongoose) => conn.model('User', UserSchema);
