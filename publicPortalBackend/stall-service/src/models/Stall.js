const mongoose = require("mongoose");

const StallSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      unique: true,
      trim: true,
    },
    size: {
      type: String,
      required: true,
      enum: ["small", "medium", "large"],
    },
    dimensions: { 
      width: {
        type: Number,
        required: true,
        min: 1,
      },
      length: {
        type: Number,
        required: true,
        min: 1,
      },
    },
    map: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      w: { type: Number, required: true },
      h: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ["available", "blocked", "reserved"],
      default: "available",
    },
    reservedByReservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
      default: null,
    },
    reservedAt: { type: Date, default: null },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Stall", StallSchema);
