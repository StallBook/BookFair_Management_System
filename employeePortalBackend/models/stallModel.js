//stallModel.js
const mongoose = require('mongoose');

function createStallModel(conn) {
  if (!conn) throw new Error('Stall DB connection required to create Stall model');
  // if model already created on this connection, return it
  try {
    return conn.model('Stall');
  } catch (e) {
    // proceed to create model if not exists
  }

  const StallSchema = new mongoose.Schema({
    id: { type: String, required: true, index: true }, // business id e.g. S-001
    name: { type: String },
    status: { type: String, enum: ['available','reserved'], default: 'available' },
    size: { type: String },
    pricePerDay: { type: Number },
    reservedAt: { type: Date, default: null },
    reservedBy: {
      userId: String,
      name: String,
      email: String,
      phone: String,
      organization: String
    },
    notes: String
  }, { timestamps: true });

  return conn.model('Stall', StallSchema, 'stalls');
}

module.exports = createStallModel;
