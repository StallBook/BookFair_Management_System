const mongoose = require("mongoose");

const StallSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  size: {
    type: String,
    required: true,
    enum: ["small", "medium", "large"],
  },
  dimenstions: {
    width: {
      type: Number,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
  },
  map: {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    w: {
      type: Number,
      required: true,
    },
    h: {
      type: Number,
      required: true,
    },
  },
  status: {
    type: String,
    required: true,
    enum: ["available", "blocked", "reserved"],
    default: "available",
  },
  reservedByReservationId: { type: String, default: null },
  reservetAt: { type: Date, default: null },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: { type: Date, default: Date.now },
});

StallSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Stall", StallSchema);
